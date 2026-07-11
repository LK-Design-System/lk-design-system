import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const outDir = path.join(root, 'visual-artifacts', 'smoke');

const targets = [
  {
    name: 'react-card-interactive-dark',
    match: { importPath: './stories/Card.stories.jsx', exportName: 'InteractiveAndDark' },
    viewport: { width: 980, height: 520 },
  },
  {
    name: 'wds-content-card-patterns',
    match: { importPath: './stories/Card.stories.jsx', exportName: 'ContentCardPatterns' },
    viewport: { width: 1180, height: 860 },
  },
  {
    name: 'action-button-matrix',
    match: { importPath: './stories/Button.stories.jsx', exportName: 'ActionMatrix' },
    viewport: { width: 1180, height: 860 },
  },
  {
    name: 'react-product-content-cards',
    match: { importPath: './stories/CardsExtended.stories.jsx', exportName: 'ProductCards' },
    viewport: { width: 1120, height: 760 },
  },
  {
    name: 'react-topbar',
    match: { importPath: './stories/Navigation.stories.jsx', exportName: 'TopBarDefault' },
    viewport: { width: 1120, height: 520 },
  },
  {
    name: 'react-forms',
    match: { importPath: './stories/FormsFull.stories.jsx', exportName: 'TextInputs' },
    viewport: { width: 1120, height: 760 },
  },
  {
    name: 'wds-textinput-interactions',
    match: { importPath: './stories/FormsFull.stories.jsx', exportName: 'TextInputInteractionMatrix' },
    viewport: { width: 1180, height: 920 },
  },
  {
    name: 'wds-control-states',
    match: { importPath: './stories/FormSelectionControls.stories.jsx', exportName: 'ControlStateMatrix' },
    viewport: { width: 1180, height: 920 },
  },
  {
    name: 'wds-segmented-control-matrix',
    match: { importPath: './stories/SelectionSegmentedToggle.stories.jsx', exportName: 'SegmentedControlMatrix' },
    viewport: { width: 980, height: 760 },
  },
  {
    name: 'wds-menu-patterns',
    match: { importPath: './stories/OverlayMenu.stories.jsx', exportName: 'MenuPatterns' },
    viewport: { width: 1180, height: 860 },
  },
  {
    name: 'wds-tooltip-patterns',
    match: { importPath: './stories/ContentAnnotations.stories.jsx', exportName: 'TooltipPatterns' },
    viewport: { width: 1180, height: 960 },
  },
  {
    name: 'wds-loading-states',
    match: { importPath: './stories/StatusLoading.stories.jsx', exportName: 'LoadingStates' },
    viewport: { width: 1120, height: 860 },
  },
  {
    name: 'wds-alert-platform-variants',
    match: { importPath: './stories/OverlayConfirmAlert.stories.jsx', exportName: 'AlertPlatformPreview' },
    viewport: { width: 1120, height: 700 },
  },
  {
    name: 'react-overlay-alert',
    match: { importPath: './stories/OverlayAnchored.stories.jsx', exportName: 'AnchoredOverlays' },
    viewport: { width: 980, height: 720 },
  },
  {
    name: 'react-robotics-viz',
    match: { importPath: './stories/RoboticsAndViz.stories.jsx', exportName: 'RobotState' },
    viewport: { width: 1180, height: 820 },
  },
  {
    name: 'robotics-viewer-frame-states',
    match: { importPath: './stories/ViewerFrame.stories.jsx', exportName: 'StatePlacement' },
    viewport: { width: 980, height: 720 },
  },
  {
    name: 'robotics-viewer-light-frame-on-dark',
    match: { importPath: './stories/ViewerFrame.stories.jsx', exportName: 'LightMapFrame' },
    query: { globals: 'backgrounds.value:Dark' },
    viewport: { width: 720, height: 520 },
  },
  {
    name: 'robotics-viewer-map',
    match: { importPath: './stories/ViewerMap.stories.jsx', exportName: 'MapCanvasOverview' },
    viewport: { width: 900, height: 620 },
  },
  {
    name: 'robotics-viewer-map-narrow',
    match: { importPath: './stories/ViewerMap.stories.jsx', exportName: 'KeyboardAndPointerContract' },
    viewport: { width: 320, height: 520 },
  },
  {
    name: 'robotics-viewer-3d-narrow',
    match: { importPath: './stories/Viewer3D.stories.jsx', exportName: 'NarrowWidth' },
    viewport: { width: 320, height: 520 },
  },
  {
    name: 'robotics-viewer-toolbar',
    match: { importPath: './stories/ViewerToolbar.stories.jsx', exportName: 'ViewerToolbarOverview' },
    viewport: { width: 320, height: 520 },
  },
  {
    name: 'robotics-viewer-video-states',
    match: { importPath: './stories/ViewerVideo.stories.jsx', exportName: 'VideoStreamOverview' },
    viewport: { width: 1000, height: 920 },
  },
  {
    name: 'robotics-viewer-video-narrow',
    match: { importPath: './stories/ViewerVideo.stories.jsx', exportName: 'NarrowWidth' },
    viewport: { width: 320, height: 520 },
  },
  {
    name: 'robotics-viewer-video-compact-states',
    match: { importPath: './stories/ViewerVideo.stories.jsx', exportName: 'CommonStateContract' },
    viewport: { width: 240, height: 900 },
  },
  {
    name: 'robotics-viewer-telemetry-compact',
    match: { importPath: './stories/ViewerTelemetry.stories.jsx', exportName: 'CompactReadouts' },
    viewport: { width: 320, height: 900 },
  },
  {
    name: 'product-validation-summary',
    match: { importPath: './stories/FormValidationSummary.stories.jsx', exportName: 'ErrorsAndWarnings' },
    viewport: { width: 860, height: 520 },
  },
  {
    name: 'product-file-upload-queue',
    match: { importPath: './stories/FormFileUploadQueue.stories.jsx', exportName: 'UploadAndConversion' },
    viewport: { width: 800, height: 720 },
  },
];

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

function findStoryId(entries, target) {
  const found = Object.values(entries).find(
    (entry) =>
      entry.type === 'story' &&
      entry.importPath === target.match.importPath &&
      entry.exportName === target.match.exportName
  );
  if (!found) {
    throw new Error(`Unable to find Storybook entry for ${target.name}: ${JSON.stringify(target.match)}`);
  }
  return found.id;
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

async function main() {
  const indexPath = path.join(staticDir, 'index.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  await mkdir(outDir, { recursive: true });

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: targets[0].viewport, deviceScaleFactor: 1 });
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  const manifest = {
    generatedAt: new Date().toISOString(),
    storybookStatic: 'storybook-static',
    count: targets.length,
    captures: [],
  };

  try {
    for (const target of targets) {
      const id = findStoryId(index.entries, target);
      runtimeErrors.length = 0;
      await page.setViewportSize(target.viewport);
      const url = storyUrl(origin, id, target.query);
      await page.goto(url, { waitUntil: 'networkidle' });
      const readinessHandle = await page.waitForFunction(() => {
        const root = document.querySelector('#storybook-root');
        const bodyText = document.body?.innerText || '';
        const hasStoryError = bodyText.includes('The component failed to render properly')
          || bodyText.includes('Cannot access');
        if (hasStoryError) return { status: 'error', bodyText: bodyText.slice(0, 600) };
        if (root?.children.length) return { status: 'ready' };
        return null;
      }, undefined, { timeout: 30000 });
      const readiness = await readinessHandle.jsonValue();
      if (readiness.status === 'error') {
        throw new Error(`${target.name} failed to render: ${readiness.bodyText}`);
      }
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(600);
      if (runtimeErrors.length > 0) {
        throw new Error(`${target.name} emitted runtime errors: ${runtimeErrors.join(' | ')}`);
      }

      const outputPath = path.join(outDir, `${target.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true, animations: 'disabled' });

      const fileStat = await stat(outputPath);
      if (fileStat.size < 1024) {
        throw new Error(`Screenshot is unexpectedly small: ${outputPath} (${fileStat.size} bytes)`);
      }

      manifest.captures.push({
        name: target.name,
        id,
        query: target.query || {},
        viewport: target.viewport,
        path: path.relative(root, outputPath).replaceAll('\\', '/'),
        bytes: fileStat.size,
        sha256: await sha256(outputPath),
      });
    }
  } finally {
    await page.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Captured ${manifest.captures.length} visual smoke screenshots to ${path.relative(root, outDir)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
