import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import axe from 'axe-core';

const root = process.cwd();
const inspectorWidthProperty = '--lds3d-inspector-width';

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
  if (file.endsWith('.js') || file.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.woff2')) return 'font/woff2';
  if (file.endsWith('.wasm')) return 'application/wasm';
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
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const file = path.resolve(staticDirectory, safePath);
      const relativePath = path.relative(staticDirectory, file);
      if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
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
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      server.on('error', () => {});
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function waitForStory(page, storyId) {
  await page.waitForSelector('#storybook-root, #root', { state: 'attached', timeout: 30000 });
  await page.waitForFunction(
    (expectedId) => {
      const storyRoot = document.querySelector('#storybook-root') || document.querySelector('#root');
      const rectangle = storyRoot?.getBoundingClientRect();
      const currentId = new URL(window.location.href).searchParams.get('id');
      return currentId === expectedId && rectangle?.width > 0 && rectangle?.height > 0 && storyRoot.children.length > 0;
    },
    storyId,
    { timeout: 30000 },
  );
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return !(canvas instanceof HTMLCanvasElement) || (canvas.width > 0 && canvas.height > 0);
  }, { timeout: 30000 });
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }).catch(() => {});
  await page.waitForTimeout(300);
}

function rendererClassification(renderer, hasWebgl) {
  if (!hasWebgl) return 'no-webgl';
  return /swiftshader|software|llvmpipe/i.test(renderer || '') ? 'software-webgl' : 'hardware-webgl';
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
  const lds3dRoot = path.resolve(root, args.root || '../LK Design System 3D');
  const staticDirectory = path.resolve(lds3dRoot, args['storybook-dir'] || 'storybook-static');
  const outputDirectory = path.resolve(root, args.output || 'visual-artifacts/lds3d-style-conformance');
  const outputRelativePath = path.relative(root, outputDirectory);
  if (!outputRelativePath || outputRelativePath.startsWith('..') || path.isAbsolute(outputRelativePath)) {
    throw new Error(`Browser evidence output must stay inside ${root}.`);
  }

  // A failed browser launch or invalid input must never leave a previous passing report behind.
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  const contractPath = path.join(root, 'docs', 'references', 'package-split', 'CROSS_REPOSITORY_STYLE_CONTRACT.json');
  const contractSource = await readFile(contractPath, 'utf8');
  const contract = JSON.parse(contractSource);
  const profile = contract.profiles['lds3d-ui'];
  if (!profile) throw new Error('Cross-repository style contract is missing the lds3d-ui profile.');

  const storybookIndexSource = await readFile(path.join(staticDirectory, 'index.json'));
  const storybookIndex = JSON.parse(storybookIndexSource.toString('utf8'));
  for (const story of profile.representativeStories) {
    if (!storybookIndex.entries?.[story.id]) throw new Error(`Built LDS3D Storybook is missing ${story.id}.`);
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
      args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
    });

    for (const story of profile.representativeStories) {
      const [width, height] = story.viewport.split('x').map(Number);
      if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
        throw new Error(`Invalid viewport ${story.viewport}.`);
      }
      const page = await browser.newPage({ viewport: { width, height } });
      const browserErrors = [];
      const failedRequests = [];
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(message.text());
      });
      page.on('pageerror', (error) => browserErrors.push(error.message));
      page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText || 'failed'}`));

      try {
        const url = `${origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await waitForStory(page, story.id);
        const storybookError = await page.evaluate(() =>
          [...document.querySelectorAll('#error-stack, [data-testid="story-error"], .sb-errordisplay')].some(
            (element) => {
              const rectangle = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return (
                element.getAttribute('aria-hidden') !== 'true' &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                rectangle.width > 0 &&
                rectangle.height > 0
              );
            },
          ),
        );
        if (storybookError) failures.push(`${story.id}: Storybook rendered an error boundary.`);

        await page.addScriptTag({ content: axe.source });
        const axeResults = await page.evaluate(async (rules) => {
          const storyRoot = document.querySelector('#storybook-root') || document.body;
          return window.axe.run(storyRoot, { runOnly: { type: 'rule', values: rules } });
        }, axeRules);
        const seriousViolations = axeResults.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');

        const runtime = await page.evaluate((propertyName) => {
          const composition = document.querySelector('[data-lds3d-composition]');
          const canvas = document.querySelector('canvas');
          let context = null;
          try {
            context = canvas instanceof HTMLCanvasElement ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;
          } catch {}
          let renderer = null;
          let version = null;
          if (context) {
            const extension = context.getExtension('WEBGL_debug_renderer_info');
            renderer = extension ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER);
            version = context.getParameter(context.VERSION);
          }
          return {
            composition: composition?.getAttribute('data-lds3d-composition') || null,
            inspectorWidth: composition ? getComputedStyle(composition).getPropertyValue(propertyName).trim() : null,
            hasCanvas: canvas instanceof HTMLCanvasElement,
            hasWebgl: context !== null,
            renderer,
            version,
          };
        }, inspectorWidthProperty);
        const classification = rendererClassification(runtime.renderer, runtime.hasWebgl);
        if (story.requiresComposition && runtime.composition !== 'actual') {
          failures.push(`${story.id}: required LDS3D composition root marker is missing.`);
        }
        if ((story.requiresComposition || runtime.composition) && !runtime.inspectorWidth) {
          failures.push(`${story.id}: ${inspectorWidthProperty} is missing from the LDS3D composition root.`);
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
          axeViolationDetails: axeResults.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            targets: violation.nodes.flatMap((node) => node.target),
            failureSummaries: violation.nodes.map((node) => node.failureSummary).filter(Boolean),
          })),
          browserErrors,
          failedRequests,
          composition: runtime.composition,
          inspectorWidth: runtime.inspectorWidth,
          renderer: {
            classification,
            name: runtime.renderer,
            version: runtime.version,
          },
        });
        if (seriousViolations.length) failures.push(`${story.id}: serious Axe violations ${seriousViolations.map((violation) => violation.id).join(', ')}`);
        if (browserErrors.length) failures.push(`${story.id}: browser errors ${browserErrors.join(' | ')}`);
        if (failedRequests.length) failures.push(`${story.id}: failed requests ${failedRequests.join(' | ')}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) await new Promise((resolve) => server.close(resolve));
  }

  const evidence = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    ldsCommit: gitHead(root),
    lds3dCommit: gitHead(lds3dRoot),
    contractVersion: contract.schemaVersion,
    contractSha256: sha256(contractSource),
    storybookIndexSha256: sha256(storybookIndexSource),
    stories: results,
    passed: failures.length === 0,
    failures,
  };
  await writeFile(path.join(outputDirectory, 'evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  if (failures.length) throw new Error(`LDS3D representative browser gate failed:\n${failures.join('\n')}`);
  console.log(`LDS3D representative browser gate passed: ${results.length} stories, ${results.reduce((total, story) => total + story.axeViolations, 0)} Axe violations.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
