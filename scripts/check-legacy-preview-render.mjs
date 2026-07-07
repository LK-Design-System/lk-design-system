import { createReadStream } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const reportDir = path.join(root, 'visual-artifacts', 'legacy-render');
const reportPath = path.join(reportDir, 'manifest.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function collect(dirRel, predicate, out = []) {
  const dir = path.join(root, dirRel);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(dirRel, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(rel, predicate, out);
    else if (entry.isFile() && predicate(rel)) out.push(rel);
  }
  return out.sort();
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(root, safePath);
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'content-type': contentType(filePath) });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function waitForLegacyPage(page, selected, kind) {
  await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });

  if (kind !== 'guideline') {
    await page.waitForFunction(
      () => {
        const root = document.querySelector('#root');
        return Boolean(root && root.children.length > 0);
      },
      null,
      { timeout: 15000 }
    );
  }

  return page.evaluate(() => {
    const root = document.querySelector('#root');
    const themeToggle = document.getElementById('__om-theme-toggle');
    if (themeToggle) themeToggle.style.display = 'none';

    const bodyText = (document.body?.innerText || '').trim();
    const bodyRect = document.body?.getBoundingClientRect();
    const rootRect = root?.getBoundingClientRect();
    const visibleElements = [...document.body.querySelectorAll('*')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const area = Math.round(rect.width * rect.height);
        return {
          area,
          visible:
            area > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            Number(style.opacity || 1) !== 0,
        };
      })
      .filter((item) => item.visible);

    return {
      title: document.title || '',
      bodyTextLength: bodyText.length,
      bodyChildCount: document.body?.children.length || 0,
      rootChildCount: root?.children.length || 0,
      bodyWidth: Math.round(bodyRect?.width || 0),
      bodyHeight: Math.round(bodyRect?.height || 0),
      rootWidth: Math.round(rootRect?.width || 0),
      rootHeight: Math.round(rootRect?.height || 0),
      visibleElementCount: visibleElements.length,
      maxVisibleElementArea: Math.max(0, ...visibleElements.map((item) => item.area)),
    };
  });
}

async function main() {
  const groups = [
    {
      kind: 'guideline',
      files: await collect('guidelines', (rel) => rel.endsWith('.html')),
    },
    {
      kind: 'component',
      files: await collect('components', (rel) => rel.endsWith('.card.html')),
    },
    {
      kind: 'template',
      files: await collect('templates-cards', (rel) => rel.endsWith('.card.html')),
    },
  ];

  const expected = { guideline: 20, component: 83, template: 4 };
  for (const group of groups) {
    assert(group.files.length === expected[group.kind], `${group.kind}: expected ${expected[group.kind]}, found ${group.files.length}`);
  }

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const report = {
    generatedAt: new Date().toISOString(),
    source: 'direct-html',
    counts: Object.fromEntries(groups.map((group) => [group.kind, group.files.length])),
    entries: [],
  };
  const errors = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 840 }, deviceScaleFactor: 1 });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error?.message || error)));

    for (const group of groups) {
      for (const selected of group.files) {
        const beforeErrorCount = pageErrors.length;
        try {
          const url = `${origin}/${selected}`;
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          const metrics = await waitForLegacyPage(page, selected, group.kind);
          const newErrors = pageErrors.slice(beforeErrorCount);

          assert(metrics.bodyChildCount > 0, `${selected}: body is empty`);
          assert(metrics.bodyWidth > 0 && metrics.bodyHeight > 0, `${selected}: page has no visible body box`);
          assert(metrics.visibleElementCount > 0, `${selected}: page has no visible descendants`);
          assert(metrics.maxVisibleElementArea > 0, `${selected}: visible descendants have no area`);
          if (group.kind !== 'guideline') {
            assert(metrics.rootChildCount > 0, `${selected}: #root did not render component content`);
          }

          report.entries.push({
            kind: group.kind,
            selected,
            url,
            metrics,
            pageErrors: newErrors,
          });
        } catch (error) {
          errors.push({ kind: group.kind, selected, error: String(error?.message || error) });
        }
      }
    }

    await page.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  await mkdir(reportDir, { recursive: true });
  report.errorCount = errors.length;
  report.errors = errors;
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (errors.length > 0) {
    console.error(`Legacy direct render failures: ${errors.length}`);
    for (const error of errors.slice(0, 20)) {
      console.error(`- ${error.kind} ${error.selected}: ${error.error}`);
    }
    process.exit(1);
  }

  const total = groups.reduce((sum, group) => sum + group.files.length, 0);
  console.log(`Validated ${total} legacy direct HTML renders: 20 guidelines, 83 component cards, 4 template cards.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
