import { createReadStream } from 'node:fs';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import axe from 'axe-core';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const outDir = path.join(root, 'visual-artifacts', 'accessibility');
const axeRules = [
  'aria-allowed-attr',
  'aria-conditional-attr',
  'aria-prohibited-attr',
  'aria-required-attr',
  'aria-required-children',
  'aria-required-parent',
  'aria-roles',
  'aria-valid-attr-value',
  'aria-valid-attr',
  'button-name',
  'color-contrast',
  'duplicate-id-aria',
  'form-field-multiple-labels',
  'image-alt',
  'input-button-name',
  'label',
  'link-name',
  'nested-interactive',
  'aria-progressbar-name',
  'select-name',
  'svg-img-alt',
];
// Axe (including color-contrast) runs on every implementation story. Optional
// A11Y_SHARD="i/n" splits the story list for parallel local runs.
function shardStories(stories) {
  const shard = process.env.A11Y_SHARD;
  if (!shard) return { stories, suffix: '' };
  const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(shard.trim());
  if (!match) throw new Error(`A11Y_SHARD must look like "1/3"; received "${shard}".`);
  const index = Number(match[1]);
  const total = Number(match[2]);
  if (index > total) throw new Error(`A11Y_SHARD index ${index} exceeds shard count ${total}.`);
  return {
    stories: stories.filter((_, storyIndex) => storyIndex % total === index - 1),
    suffix: `-shard-${index}-of-${total}`,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

function storyUrl(origin, id) {
  return `${origin}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;
}

function implementationStories(entries) {
  return Object.values(entries)
    .filter((entry) => entry.type === 'story')
    .filter((entry) => !String(entry.title).startsWith('문서/'))
    .sort((a, b) => `${a.title} ${a.name}`.localeCompare(`${b.title} ${b.name}`, 'ko'));
}

async function waitForStoryReady(page, storyId) {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForSelector('#storybook-root, #root', { state: 'attached', timeout: 30000 });
    await page.waitForFunction(
      (expectedId) => {
        const root = document.querySelector('#storybook-root') || document.querySelector('#root');
        if (!root) return false;

        const text = document.body?.innerText || '';
        if (text.includes('Not found') || text.includes('No Preview') || text.includes('Cannot load story') || text.includes('The component failed to render properly')) return false;

        const href = new URL(window.location.href);
        if (href.searchParams.get('id') !== expectedId) return false;

        const rootRect = root.getBoundingClientRect();
        return rootRect.width > 0 && rootRect.height > 0 && root.children.length > 0;
      },
      storyId,
      { timeout: 30000 }
    );
  } catch (error) {
    const diagnostics = await page
      .evaluate(() => ({
        readyState: document.readyState,
        rootExists: Boolean(document.querySelector('#storybook-root') || document.querySelector('#root')),
        bodyText: document.body?.innerText?.slice(0, 240) || '',
      }))
      .catch(() => null);
    throw new Error(
      `${storyId}: Storybook story did not become render-ready at ${page.url()}: ${error.message}${
        diagnostics ? ` Diagnostics: ${JSON.stringify(diagnostics)}` : ''
      }`
    );
  }
}

async function gotoStoryReady(page, url, storyId) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await waitForStoryReady(page, storyId);
      return;
    } catch (error) {
      lastError = error;
      await page.goto('about:blank', { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
    }
  }
  throw lastError;
}

async function main() {
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  const { stories, suffix } = shardStories(implementationStories(index.entries || {}));
  assert(stories.length > 0, 'No implementation stories found in storybook-static/index.json.');

  const { server, origin } = await startStaticServer();
  // Interaction-heavy play functions rely on sub-second UI timers (e.g. the
  // SideNav overlay peek). Chromium throttles timers in backgrounded pages,
  // which scrambles those sequences under parallel shards — disable it.
  const browser = await chromium.launch({
    args: [
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ],
  });
  const failures = [];
  const consoleErrors = [];
  let axeCheckedStories = 0;

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    for (const story of stories) {
      await gotoStoryReady(page, storyUrl(origin, story.id), story.id);
      axeCheckedStories += 1;
      await page.evaluate(() => document.fonts?.ready).catch(() => {});
      await page.addScriptTag({ content: axe.source });
      const axeResults = await page.evaluate(async (rules) => {
        const root = document.querySelector('#storybook-root') || document.body;
        let results;
        for (let attempt = 0; attempt < 50; attempt += 1) {
          try {
            results = await window.axe.run(root, { runOnly: { type: 'rule', values: rules } });
            break;
          } catch (error) {
            if (!String(error?.message || error).includes('already running') || attempt === 49) throw error;
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        if (!results) throw new Error('Axe did not become available.');
        // WCAG 1.4.3 exempts text in inactive UI components. Axe only detects
        // native :disabled, so custom controls mark their label root with
        // data-disabled / aria-disabled and are exempted here explicitly.
        results.violations = results.violations
          .map((violation) => {
            if (violation.id !== 'color-contrast') return violation;
            const nodes = violation.nodes.filter((node) => {
              const selector = Array.isArray(node.target) ? node.target[node.target.length - 1] : node.target;
              let element = null;
              try { element = document.querySelector(selector); } catch { element = null; }
              return !(element && element.closest('[data-disabled], [aria-disabled="true"], :disabled'));
            });
            return { ...violation, nodes };
          })
          .filter((violation) => violation.nodes.length > 0);
        return results;
      }, axeRules);
      const storyFailures = await page.evaluate(() => {
        const root = document.querySelector('#storybook-root') || document.body;
        const controlSelector = [
          'button',
          '[role="button"]',
          '[role="radio"]',
          '[role="checkbox"]',
          '[role="switch"]',
          '[role="tab"]',
          '[role="menuitem"]',
          'a[href]',
          'input',
          'select',
          'textarea',
          'svg[role="img"]',
          'img',
        ].join(',');

        function isElementVisible(el) {
          if (el.closest('[aria-hidden="true"]')) return false;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }

        function textFromIds(value) {
          return value
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent?.trim() || '')
            .filter(Boolean)
            .join(' ')
            .trim();
        }

        function labelTextForControl(el) {
          const id = el.getAttribute('id');
          const explicit = id ? [...document.querySelectorAll(`label[for="${CSS.escape(id)}"]`)].map((label) => label.textContent?.trim()).filter(Boolean).join(' ') : '';
          const implicit = el.closest('label')?.textContent?.trim() || '';
          return `${explicit} ${implicit}`.trim();
        }

        function accessibleName(el) {
          const ariaLabel = el.getAttribute('aria-label')?.trim();
          if (ariaLabel) return ariaLabel;
          const labelledBy = el.getAttribute('aria-labelledby');
          if (labelledBy) {
            const text = textFromIds(labelledBy);
            if (text) return text;
          }
          const labelText = /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) ? labelTextForControl(el) : '';
          if (labelText) return labelText;
          const title = el.getAttribute('title')?.trim();
          if (title) return title;
          if (el.tagName === 'IMG') return el.getAttribute('alt')?.trim() || '';
          const svgTitle = el.querySelector('title')?.textContent?.trim();
          if (svgTitle) return svgTitle;
          return (el.textContent || '').replace(/\s+/g, ' ').trim();
        }

        const failures = [];
        for (const el of root.querySelectorAll(controlSelector)) {
          if (!isElementVisible(el)) continue;
          const tag = el.tagName.toLowerCase();
          const role = el.getAttribute('role') || '';
          const marker = `${tag}${role ? `[role=${role}]` : ''}${el.id ? `#${el.id}` : ''}${el.className && typeof el.className === 'string' ? `.${el.className.split(/\s+/).slice(0, 2).join('.')}` : ''}`;

          if (tag === 'input' && el.getAttribute('type') === 'hidden') continue;

          if (tag === 'img') {
            if (el.getAttribute('role') === 'presentation' || el.getAttribute('aria-hidden') === 'true') continue;
            if (el.getAttribute('alt') == null) failures.push(`${marker}: visible img must have alt text or be aria-hidden/presentation`);
            continue;
          }

          if (!accessibleName(el)) failures.push(`${marker}: missing accessible name`);
          if (tag === 'button' && !el.getAttribute('type')) failures.push(`${marker}: button must set explicit type`);
        }
        return failures;
      });

      for (const failure of storyFailures) failures.push(`${story.title} / ${story.name}: ${failure}`);
      for (const violation of axeResults.violations) {
        for (const node of violation.nodes) {
          failures.push(`${story.title} / ${story.name}: axe ${violation.id} (${violation.impact ?? 'unknown'}) ${node.target.join(' ')} — ${node.failureSummary}`);
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const uniqueConsoleErrors = [...new Set(consoleErrors)].filter((message) => !/ResizeObserver loop/.test(message));
  const report = {
    generatedAt: new Date().toISOString(),
    checkedStories: stories.length,
    axeCheckedStories,
    failures,
    consoleErrors: uniqueConsoleErrors,
  };
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, `manifest${suffix}.json`), JSON.stringify(report, null, 2), 'utf8');

  assert(uniqueConsoleErrors.length === 0, `Storybook implementation stories emitted console/page errors:\n${uniqueConsoleErrors.join('\n')}`);
  assert(failures.length === 0, `Storybook accessibility guard failed:\n${failures.join('\n')}`);

  console.log(`Validated Storybook accessibility guard: ${stories.length} implementation stories, ${axeCheckedStories} Axe-guarded stories, 0 violations, 0 missing names, 0 implicit button types, 0 console errors.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
