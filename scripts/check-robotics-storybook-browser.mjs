import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import axe from 'axe-core';

const root = process.cwd();

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) continue;
    result[value.slice(2)] = argv[++index];
  }
  return result;
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

function gitHead(directory) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function startStaticServer(staticDirectory) {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      let safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      if (safePath === 'favicon.ico') safePath = 'favicon.svg';
      const file = path.resolve(staticDirectory, safePath);
      if (!file.startsWith(staticDirectory)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }
      const metadata = await stat(file);
      if (!metadata.isFile()) throw new Error('Not a file');
      response.writeHead(200, { 'content-type': contentType(file) });
      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
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

async function waitForStory(page, storyId) {
  await page.waitForSelector('#storybook-root, #root', { state: 'attached', timeout: 30000 });
  await page.waitForFunction((expectedId) => {
    const rootElement = document.querySelector('#storybook-root') || document.querySelector('#root');
    const currentId = new URL(window.location.href).searchParams.get('id');
    const rectangle = rootElement?.getBoundingClientRect();
    return currentId === expectedId && rectangle?.width > 0 && rectangle?.height > 0 && rootElement.children.length > 0;
  }, storyId, { timeout: 30000 });
  await page.waitForFunction((expectedId) => window.__LDS_ROBOTICS_LIFECYCLE__?.finished?.some((result) => result?.storyId === expectedId), storyId, { timeout: 30000 });
  const lifecycle = await page.evaluate((expectedId) => {
    const state = window.__LDS_ROBOTICS_LIFECYCLE__;
    return {
      finished: state?.finished?.find((result) => result?.storyId === expectedId) || null,
      errors: [...(state?.playErrors || []), ...(state?.unhandledPlayErrors || []), ...(state?.renderErrors || [])],
    };
  }, storyId);
  if (lifecycle.finished?.status !== 'success' || lifecycle.errors.length > 0) {
    throw new Error(`${storyId} Storybook lifecycle failed: ${JSON.stringify(lifecycle)}`);
  }
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
}

const axeRules = [
  'aria-allowed-attr',
  'aria-required-attr',
  'aria-roles',
  'aria-valid-attr-value',
  'aria-valid-attr',
  'button-name',
  'color-contrast',
  'duplicate-id-aria',
  'image-alt',
  'nested-interactive',
  'svg-img-alt',
];

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const roboticsRoot = path.resolve(root, args.root || '../LK Design System Robotics');
  const staticDirectory = path.resolve(roboticsRoot, args['storybook-dir'] || 'storybook-static');
  const outputDirectory = path.resolve(root, args.output || 'visual-artifacts/robotics-style-conformance');
  const outputRelativePath = path.relative(root, outputDirectory);
  if (!outputRelativePath || outputRelativePath.startsWith('..') || path.isAbsolute(outputRelativePath)) {
    throw new Error(`Browser evidence output must stay inside ${root}.`);
  }
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  const contractPath = path.join(root, 'docs', 'references', 'package-split', 'CROSS_REPOSITORY_STYLE_CONTRACT.json');
  const contractSource = await readFile(contractPath, 'utf8');
  const contract = JSON.parse(contractSource);
  const profile = contract.profiles['robotics-ui'];
  const storybookIndex = JSON.parse(await readFile(path.join(staticDirectory, 'index.json'), 'utf8'));
  for (const story of profile.representativeStories) {
    if (!storybookIndex.entries?.[story.id]) throw new Error(`Built Storybook is missing ${story.id}.`);
  }

  let server;
  let browser;
  const results = [];
  const failures = [];

  try {
    const startedServer = await startStaticServer(staticDirectory);
    server = startedServer.server;
    const { origin } = startedServer;
    browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
    });

    for (const story of profile.representativeStories) {
      const [width, height] = story.viewport.split('x').map(Number);
      if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error(`Invalid viewport ${story.viewport}.`);
      const page = await browser.newPage({ viewport: { width, height } });
      const browserErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          const location = message.location();
          const source = location?.url ? ` (${location.url}:${location.lineNumber}:${location.columnNumber})` : '';
          browserErrors.push(`${message.text()}${source}`);
        }
      });
      page.on('response', (response) => {
        if (response.status() >= 400) browserErrors.push(`${response.status()} ${response.url()}`);
      });
      page.on('pageerror', (error) => browserErrors.push(error.message));
      await page.addInitScript(() => {
        const lifecycle = { finished: [], playErrors: [], unhandledPlayErrors: [], renderErrors: [] };
        Object.defineProperty(window, '__LDS_ROBOTICS_LIFECYCLE__', { configurable: true, value: lifecycle });
        const attach = () => {
          const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
          if (!channel || typeof channel.on !== 'function') return false;
          channel.on('storyFinished', (result) => lifecycle.finished.push(result));
          channel.on('playFunctionThrewException', (error) => lifecycle.playErrors.push(error));
          channel.on('unhandledErrorsWhilePlaying', (errors) => lifecycle.unhandledPlayErrors.push(...(errors || [])));
          channel.on('storyThrewException', (error) => lifecycle.renderErrors.push(error));
          channel.on('storyErrored', (error) => lifecycle.renderErrors.push(error));
          return true;
        };
        if (!attach()) {
          const interval = window.setInterval(() => {
            if (attach()) window.clearInterval(interval);
          }, 0);
        }
      });

      try {
        const url = `${origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await waitForStory(page, story.id);
        await page.addScriptTag({ content: axe.source });
        const axeResults = await page.evaluate(async (rules) => {
          const rootElement = document.querySelector('#storybook-root') || document.body;
          return window.axe.run(rootElement, { runOnly: { type: 'rule', values: rules } });
        }, axeRules);
        const seriousViolations = axeResults.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
        const customProperties = await page.evaluate((names) => {
          const subject = document.querySelector('[data-theme]') || document.querySelector('#storybook-root') || document.documentElement;
          const style = getComputedStyle(subject);
          return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
        }, profile.localTokenDefinitions.names);
        const missingCustomProperties = Object.entries(customProperties).filter(([, value]) => !value).map(([name]) => name);
        if (story.id === profile.focusOverride.provingStoryId) {
          const focusEvidence = await page.locator(profile.focusOverride.evidenceSelector).count();
          if (focusEvidence === 0) failures.push(`${story.id}: missing focus evidence ${profile.focusOverride.evidenceSelector}`);
        }
        const screenshotPath = path.join(outputDirectory, `${story.id}-${width}x${height}.png`);
        const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
        results.push({
          id: story.id,
          viewport: story.viewport,
          screenshot: path.basename(screenshotPath),
          screenshotSha256: sha256(screenshot),
          axeViolations: axeResults.violations.length,
          seriousAxeViolations: seriousViolations.map((violation) => violation.id),
          browserErrors,
          missingCustomProperties,
        });
        if (seriousViolations.length) failures.push(`${story.id}: serious Axe violations ${seriousViolations.map((violation) => violation.id).join(', ')}`);
        if (browserErrors.length) failures.push(`${story.id}: browser errors ${browserErrors.join(' | ')}`);
        if (missingCustomProperties.length) failures.push(`${story.id}: missing custom properties ${missingCustomProperties.join(', ')}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) {
      await new Promise((resolve) => server.close(() => resolve()));
    }
  }

  const evidence = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    ldsCommit: gitHead(root),
    roboticsCommit: gitHead(roboticsRoot),
    contractVersion: contract.schemaVersion,
    contractSha256: sha256(contractSource),
    stories: results,
    passed: failures.length === 0,
    failures,
  };
  await writeFile(path.join(outputDirectory, 'evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  if (failures.length) throw new Error(`Robotics representative browser gate failed:\n${failures.join('\n')}`);
  console.log(`Robotics representative browser gate passed: ${results.length} stories, ${results.reduce((total, story) => total + story.axeViolations, 0)} Axe violations.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
