import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const outDir = path.join(root, 'visual-artifacts', 'inventory');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
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
      const filePath = path.resolve(staticDir, safePath);
      if (!filePath.startsWith(staticDir)) {
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

function parseViewport(source) {
  const viewport = source.match(/@dsCard[^]*?viewport="([^"]+)"/)?.[1] || '900x520';
  const match = viewport.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { width: 900, height: 520, raw: viewport };
  return { width: Number(match[1]), height: Number(match[2]), raw: viewport };
}

function slug(value) {
  return value
    .replace(/\\/g, '/')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);
}

function storyUrl(origin, id, query = {}) {
  const params = new URLSearchParams({ id, viewMode: 'story' });
  for (const [key, value] of Object.entries(query)) params.set(key, value);
  return `${origin}/iframe.html?${params.toString()}`;
}

async function sha256(filePath) {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => {
    createReadStream(filePath)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', resolve);
  });
  return hash.digest('hex');
}

function findStory(entries, importPath, exportName) {
  const found = Object.values(entries).find(
    (entry) => entry.type === 'story' && entry.importPath === importPath && entry.exportName === exportName
  );
  assert(found, `Unable to find story ${importPath} / ${exportName}`);
  return found;
}

function implementationStories(entries) {
  const excluded = new Set([
    './stories/Audit.stories.jsx',
    './stories/LegacyPreviews.stories.jsx',
    './stories/Overview.stories.jsx',
    './stories/TokenStrategy.stories.jsx',
    './stories/VisualParityLedger.stories.jsx',
  ]);
  return Object.values(entries)
    .filter((entry) => entry.type === 'story' && !excluded.has(entry.importPath))
    .sort((a, b) => `${a.importPath} ${a.exportName}`.localeCompare(`${b.importPath} ${b.exportName}`, 'ko'));
}

async function ensureVisibleScreenshot(filePath, metadata) {
  const fileStat = await stat(filePath);
  assert(fileStat.size >= 1024, `Screenshot is unexpectedly small: ${filePath} (${fileStat.size} bytes)`);
  return {
    ...metadata,
    path: path.relative(root, filePath).replaceAll('\\', '/'),
    bytes: fileStat.size,
    sha256: await sha256(filePath),
  };
}

async function main() {
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  const entries = index.entries;
  const componentCards = await collect('components', (rel) => rel.endsWith('.card.html'));
  assert(componentCards.length === 83, `Expected 83 component cards, found ${componentCards.length}.`);

  const legacyStory = findStory(entries, './stories/LegacyPreviews.stories.jsx', 'ComponentCards');
  const reactStories = implementationStories(entries);
  await mkdir(path.join(outDir, 'legacy-components'), { recursive: true });
  await mkdir(path.join(outDir, 'react-stories'), { recursive: true });

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const manifest = {
    generatedAt: new Date().toISOString(),
    storybookStatic: 'storybook-static',
    counts: {
      legacyComponentCards: componentCards.length,
      reactStories: reactStories.length,
    },
    legacyComponentCards: [],
    reactStories: [],
  };

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

    for (const selected of componentCards) {
      const source = await read(selected);
      const viewport = parseViewport(source);
      await page.setViewportSize({
        width: Math.max(360, Math.min(1400, viewport.width + 80)),
        height: Math.max(240, Math.min(1100, viewport.height + 160)),
      });
      await page.goto(storyUrl(origin, legacyStory.id, { selected }), { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForSelector('iframe', { timeout: 15000 });
      await page.waitForTimeout(250);

      const outputPath = path.join(outDir, 'legacy-components', `${slug(selected)}.png`);
      await page.locator('iframe').first().screenshot({ path: outputPath, animations: 'disabled' });
      manifest.legacyComponentCards.push(
        await ensureVisibleScreenshot(outputPath, {
          selected,
          id: legacyStory.id,
          viewport: { width: viewport.width, height: viewport.height, raw: viewport.raw },
        })
      );
    }

    for (const story of reactStories) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(storyUrl(origin, story.id), { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(350);

      const outputPath = path.join(outDir, 'react-stories', `${slug(`${story.importPath}-${story.exportName}`)}.png`);
      await page.screenshot({ path: outputPath, fullPage: true, animations: 'disabled' });
      manifest.reactStories.push(
        await ensureVisibleScreenshot(outputPath, {
          id: story.id,
          importPath: story.importPath,
          exportName: story.exportName,
          title: story.title,
          name: story.name,
        })
      );
    }

    await page.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    `Captured visual inventory: ${manifest.legacyComponentCards.length} legacy component cards and ${manifest.reactStories.length} React stories.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
