import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const outDir = path.join(root, 'visual-artifacts', 'smoke');
const baselineDir = path.join(root, 'visual-baselines', 'smoke');
const diffDir = path.join(root, 'visual-artifacts', 'smoke-diff');
const updateBaseline = process.argv.includes('--update-baseline');
const checkBaseline = process.argv.includes('--check');
const maxDiffRatio = Number(process.env.VISUAL_MAX_DIFF_RATIO || 0.01);

if (updateBaseline && checkBaseline) {
  throw new Error('Choose either --update-baseline or --check, not both.');
}

const targets = [
  {
    name: 'foundation-color-brand-icons',
    match: { importPath: './stories/Iconography.stories.jsx', exportName: 'ColorBrandIcons' },
    viewport: { width: 980, height: 620 },
  },
  {
    name: 'react-card-interactive-dark',
    match: { importPath: './stories/Card.stories.jsx', exportName: 'InteractiveAndDark' },
    viewport: { width: 980, height: 520 },
  },
  {
    name: 'react-card-content-patterns-dark',
    match: { importPath: './stories/Card.stories.jsx', exportName: 'ContentCardPatterns' },
    query: { globals: 'backgrounds.value:Dark' },
    viewport: { width: 1180, height: 860 },
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
    name: 'react-topbar-dark',
    match: { importPath: './stories/Navigation.stories.jsx', exportName: 'TopBarDefault' },
    query: { globals: 'backgrounds.value:Dark' },
    viewport: { width: 1120, height: 520 },
  },
  {
    name: 'react-forms',
    match: { importPath: './stories/FormInput.stories.jsx', exportName: 'InputOverview' },
    viewport: { width: 1120, height: 760 },
  },
  {
    name: 'react-forms-narrow',
    match: { importPath: './stories/FormInput.stories.jsx', exportName: 'InputOverview' },
    viewport: { width: 320, height: 900 },
  },
  {
    name: 'wds-selection-groups',
    match: { importPath: './stories/FormCheckbox.stories.jsx', exportName: 'Checkboxes' },
    viewport: { width: 980, height: 760 },
  },
  {
    name: 'wds-selection-groups-narrow',
    match: { importPath: './stories/FormCheckbox.stories.jsx', exportName: 'Checkboxes' },
    viewport: { width: 320, height: 900 },
  },
  {
    name: 'wds-action-area-states',
    match: { importPath: './stories/ActionArea.stories.jsx', exportName: 'ActionAreaStates' },
    viewport: { width: 980, height: 900 },
  },
  {
    name: 'wds-action-area-states-narrow',
    match: { importPath: './stories/ActionArea.stories.jsx', exportName: 'ActionAreaStates' },
    viewport: { width: 320, height: 900 },
  },
  {
    name: 'wds-textinput-interactions',
    match: { importPath: './stories/FormInput.stories.jsx', exportName: 'InputInteractionMatrix' },
    viewport: { width: 1180, height: 920 },
  },
  {
    name: 'wds-control-states',
    match: { importPath: './stories/FormCheckbox.stories.jsx', exportName: 'CheckboxStateContract' },
    viewport: { width: 1180, height: 920 },
  },
  {
    name: 'wds-segmented-control-matrix',
    match: { importPath: './stories/SelectionSegmentedControl.stories.jsx', exportName: 'SegmentedControlStates' },
    viewport: { width: 980, height: 760 },
  },
  {
    name: 'wds-menu-patterns',
    match: { importPath: './stories/OverlayDropdownMenu.stories.jsx', exportName: 'DropdownMenuPatterns' },
    viewport: { width: 1180, height: 860 },
  },
  {
    name: 'wds-menu-patterns-dark',
    match: { importPath: './stories/OverlayDropdownMenu.stories.jsx', exportName: 'DropdownMenuPatterns' },
    query: { globals: 'backgrounds.value:Dark' },
    viewport: { width: 1180, height: 860 },
  },
  {
    name: 'wds-tooltip-patterns',
    match: { importPath: './stories/ContentTooltip.stories.jsx', exportName: 'TooltipPatterns' },
    viewport: { width: 1180, height: 960 },
  },
  {
    name: 'wds-loading-states',
    match: { importPath: './stories/StatusSkeleton.stories.jsx', exportName: 'SkeletonOverview' },
    viewport: { width: 1120, height: 860 },
  },
  {
    name: 'wds-alert-platform-variants',
    match: { importPath: './stories/OverlayConfirmAlert.stories.jsx', exportName: 'AlertPlatformPreview' },
    viewport: { width: 1120, height: 700 },
  },
  {
    name: 'wds-alert-platform-variants-dark',
    match: { importPath: './stories/OverlayConfirmAlert.stories.jsx', exportName: 'AlertPlatformPreview' },
    query: { globals: 'backgrounds.value:Dark' },
    viewport: { width: 1120, height: 700 },
  },
  {
    name: 'react-overlay-alert',
    match: { importPath: './stories/OverlayPopover.stories.jsx', exportName: 'PopoverOverview' },
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
    match: { importPath: './stories/RoboticsTelemetryValue.stories.jsx', exportName: 'CompactReadouts' },
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
  {
    name: 'communication-message-family-dark',
    match: { importPath: './stories/CommunicationMessage.stories.jsx', exportName: 'MessageFamilyVisualParity' },
    viewport: { width: 860, height: 520 },
  },
  {
    name: 'communication-message-overview-light',
    match: { importPath: './stories/CommunicationMessage.stories.jsx', exportName: 'MessageOverview' },
    viewport: { width: 900, height: 820 },
  },
];

const ATOM_ZOOM = 8;

// Per-atom captures. The full-page targets above prove a story RENDERS; these
// prove the tiny map GLYPHS stay LEGIBLE at their real ~13-22px render size —
// the exact class of regression the system-level review missed (a bespoke
// elevator glyph that was unreadable at 22px). Each atom is cropped 1:1 (its
// true painted size) AND upscaled ATOM_ZOOMx with nearest-neighbour (no
// smoothing), so a sub-pixel limb loss, mis-centering, or a swapped glyph shows
// as a pixel diff against the baseline. `clip` is a fixed square centered on the
// atom so its dimensions stay stable between runs (a varying crop size would
// fail pixelmatch's dimension check spuriously).
const atomTargets = [
  { name: 'atom-facility-lift-marker', match: { importPath: './stories/RoboticsNavigationFacilities.stories.jsx', exportName: 'FacilityTransitionOverview' }, selector: '[data-transition-kind="lift"] [data-transition-marker]', clip: 46, viewport: { width: 900, height: 720 } },
  { name: 'atom-facility-lift-marker-dark', match: { importPath: './stories/RoboticsNavigationFacilities.stories.jsx', exportName: 'AvailabilityAndSourceStates' }, selector: '[data-transition-kind="lift"] [data-transition-marker]', clip: 46, viewport: { width: 980, height: 760 } },
  { name: 'atom-facility-door-marker', match: { importPath: './stories/RoboticsNavigationFacilities.stories.jsx', exportName: 'AvailabilityAndSourceStates' }, selector: '[data-transition-kind="door"] [data-transition-marker]', clip: 46, viewport: { width: 980, height: 760 } },
  { name: 'atom-facility-dock-marker', match: { importPath: './stories/RoboticsNavigationFacilities.stories.jsx', exportName: 'AvailabilityAndSourceStates' }, selector: '[data-transition-kind="dock"] [data-transition-marker]', clip: 46, viewport: { width: 980, height: 760 } },
  { name: 'atom-waypoint-point', match: { importPath: './stories/RoboticsNavigationWaypoint.stories.jsx', exportName: 'Overview' }, selector: '[data-waypoint-point]', clip: 34, viewport: { width: 900, height: 720 } },
  { name: 'atom-glyph-unknown', match: { importPath: './stories/RoboticsNavigationLane.stories.jsx', exportName: 'LaneStatesAndConstraints' }, selector: '[data-navigation-state-glyph="unknown"]', clip: 28, viewport: { width: 900, height: 760 } },
  { name: 'atom-glyph-conflict', match: { importPath: './stories/RoboticsNavigationLane.stories.jsx', exportName: 'LaneStatesAndConstraints' }, selector: '[data-navigation-state-glyph="conflict"]', clip: 28, viewport: { width: 900, height: 760 } },
  { name: 'atom-glyph-closed', match: { importPath: './stories/RoboticsNavigationLane.stories.jsx', exportName: 'LaneStatesAndConstraints' }, selector: '[data-navigation-state-glyph="closed"]', clip: 28, viewport: { width: 900, height: 760 } },
  { name: 'atom-glyph-invalid', match: { importPath: './stories/RoboticsNavigationRoute.stories.jsx', exportName: 'RouteAndTrajectoryStates' }, selector: '[data-navigation-state-glyph="invalid"]', clip: 28, viewport: { width: 1000, height: 900 } },
  { name: 'atom-glyph-waiting', match: { importPath: './stories/RoboticsNavigationRoute.stories.jsx', exportName: 'RouteAndTrajectoryStates' }, selector: '[data-navigation-state-glyph="waiting"]', clip: 28, viewport: { width: 1000, height: 900 } },
  { name: 'atom-glyph-completed', match: { importPath: './stories/RoboticsNavigationRoute.stories.jsx', exportName: 'RouteAndTrajectoryStates' }, selector: '[data-navigation-state-glyph="completed"]', clip: 28, viewport: { width: 1000, height: 900 } },
  { name: 'atom-glyph-rerouting', match: { importPath: './stories/RoboticsNavigationRoute.stories.jsx', exportName: 'RouteAndTrajectoryStates' }, selector: '[data-navigation-state-glyph="rerouting"]', clip: 28, viewport: { width: 1000, height: 900 } },
  { name: 'atom-glyph-stale', match: { importPath: './stories/RoboticsNavigationRoute.stories.jsx', exportName: 'RouteAndTrajectoryStates' }, selector: '[data-navigation-state-glyph="stale"]', clip: 28, viewport: { width: 1000, height: 900 } },
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

async function compareScreenshot(name, actualPath) {
  const baselinePath = path.join(baselineDir, `${name}.png`);
  let baselineBuffer;
  try {
    baselineBuffer = await readFile(baselinePath);
  } catch {
    throw new Error(`Missing visual baseline: ${path.relative(root, baselinePath)}. Run npm run update:visual-baseline.`);
  }

  const actual = PNG.sync.read(await readFile(actualPath));
  const baseline = PNG.sync.read(baselineBuffer);
  if (actual.width !== baseline.width || actual.height !== baseline.height) {
    throw new Error(
      `${name} changed dimensions: baseline ${baseline.width}x${baseline.height}, actual ${actual.width}x${actual.height}`
    );
  }

  const diff = new PNG({ width: actual.width, height: actual.height });
  const differentPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    actual.width,
    actual.height,
    { threshold: 0.1, includeAA: false }
  );
  const totalPixels = actual.width * actual.height;
  const diffRatio = differentPixels / totalPixels;
  if (differentPixels > 0) {
    await mkdir(diffDir, { recursive: true });
    await writeFile(path.join(diffDir, `${name}.png`), PNG.sync.write(diff));
  }
  return { differentPixels, totalPixels, diffRatio };
}

function upscaleNearest(buffer, factor) {
  const src = PNG.sync.read(buffer);
  const dst = new PNG({ width: src.width * factor, height: src.height * factor });
  for (let y = 0; y < dst.height; y += 1) {
    const sourceRow = Math.floor(y / factor);
    for (let x = 0; x < dst.width; x += 1) {
      const sourceCol = Math.floor(x / factor);
      const si = (src.width * sourceRow + sourceCol) << 2;
      const di = (dst.width * y + x) << 2;
      dst.data[di] = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = src.data[si + 3];
    }
  }
  return PNG.sync.write(dst);
}

async function loadStoryReady(page, url, name, runtimeErrors) {
  runtimeErrors.length = 0;
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
    throw new Error(`${name} failed to render: ${readiness.bodyText}`);
  }
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(600);
  if (runtimeErrors.length > 0) {
    throw new Error(`${name} emitted runtime errors: ${runtimeErrors.join(' | ')}`);
  }
}

// Crop a fixed square centered on the atom (true render size), then also emit a
// nearest-neighbour zoom. Returns the two capture file names.
async function captureAtom(page, atom, outputDir) {
  const el = await page.$(atom.selector);
  if (!el) {
    throw new Error(`Atom "${atom.name}": selector ${atom.selector} not found. A missing atom must fail loudly, never silently skip the legibility gate.`);
  }
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  if (!box || box.width < 1 || box.height < 1) {
    throw new Error(`Atom "${atom.name}": element has no visible bounding box.`);
  }
  const clipSize = atom.clip || 40;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const clip = {
    x: Math.max(0, Math.round(centerX - clipSize / 2)),
    y: Math.max(0, Math.round(centerY - clipSize / 2)),
    width: clipSize,
    height: clipSize,
  };
  const truePath = path.join(outputDir, `${atom.name}.png`);
  await page.screenshot({ path: truePath, clip, animations: 'disabled' });
  const zoomName = `${atom.name}@${ATOM_ZOOM}x`;
  await writeFile(path.join(outputDir, `${zoomName}.png`), upscaleNearest(await readFile(truePath), ATOM_ZOOM));
  return [atom.name, zoomName];
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
    count: targets.length + atomTargets.length * 2,
    captures: [],
  };
  const regressions = [];

  try {
    for (const target of targets) {
      const id = findStoryId(index.entries, target);
      await page.setViewportSize(target.viewport);
      const url = storyUrl(origin, id, target.query);
      await loadStoryReady(page, url, target.name, runtimeErrors);

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

      if (updateBaseline) {
        await mkdir(baselineDir, { recursive: true });
        await copyFile(outputPath, path.join(baselineDir, `${target.name}.png`));
      } else if (checkBaseline) {
        const comparison = await compareScreenshot(target.name, outputPath);
        manifest.captures.at(-1).comparison = comparison;
        const percent = (comparison.diffRatio * 100).toFixed(3);
        console.log(`${target.name}: ${percent}% pixel difference`);
        if (comparison.diffRatio > maxDiffRatio) {
          regressions.push(`${target.name} ${percent}% > ${(maxDiffRatio * 100).toFixed(3)}%`);
        }
      }
    }

    for (const atom of atomTargets) {
      const id = findStoryId(index.entries, atom);
      await page.setViewportSize(atom.viewport);
      await loadStoryReady(page, storyUrl(origin, id, atom.query), atom.name, runtimeErrors);
      const captureNames = await captureAtom(page, atom, outDir);
      for (const captureName of captureNames) {
        const capturePath = path.join(outDir, `${captureName}.png`);
        const fileStat = await stat(capturePath);
        manifest.captures.push({
          name: captureName,
          id,
          atom: true,
          selector: atom.selector,
          query: atom.query || {},
          viewport: atom.viewport,
          path: path.relative(root, capturePath).replaceAll('\\', '/'),
          bytes: fileStat.size,
          sha256: await sha256(capturePath),
        });
        if (updateBaseline) {
          await mkdir(baselineDir, { recursive: true });
          await copyFile(capturePath, path.join(baselineDir, `${captureName}.png`));
        } else if (checkBaseline) {
          const comparison = await compareScreenshot(captureName, capturePath);
          manifest.captures.at(-1).comparison = comparison;
          const percent = (comparison.diffRatio * 100).toFixed(3);
          console.log(`${captureName}: ${percent}% pixel difference`);
          if (comparison.diffRatio > maxDiffRatio) {
            regressions.push(`${captureName} ${percent}% > ${(maxDiffRatio * 100).toFixed(3)}%`);
          }
        }
      }
    }
  } finally {
    await page.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  if (updateBaseline) {
    const baselineManifest = {
      schemaVersion: 1,
      count: manifest.captures.length,
      maxDiffRatio,
      captures: manifest.captures.map(({ name, id, query, viewport, bytes, sha256 }) => ({
        name,
        id,
        query,
        viewport,
        bytes,
        sha256,
      })),
    };
    await writeFile(
      path.join(baselineDir, 'manifest.json'),
      `${JSON.stringify(baselineManifest, null, 2)}\n`,
      'utf8'
    );
    console.log(`Updated ${manifest.captures.length} visual baselines in ${path.relative(root, baselineDir)}.`);
  }
  if (regressions.length > 0) {
    throw new Error(`Visual regressions exceeded the pixel threshold:\n- ${regressions.join('\n- ')}`);
  }
  console.log(`Captured ${manifest.captures.length} visual smoke screenshots to ${path.relative(root, outDir)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
