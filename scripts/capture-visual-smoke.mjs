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
const onlyArguments = process.argv.filter((argument) => argument.startsWith('--only='));
const maxDiffRatio = Number(process.env.VISUAL_MAX_DIFF_RATIO || 0.01);

if (updateBaseline && checkBaseline) {
  throw new Error('Choose either --update-baseline or --check, not both.');
}
if (onlyArguments.length > 1) {
  throw new Error('Pass at most one comma-separated --only= capture list.');
}
if (onlyArguments.length > 0 && !updateBaseline && !checkBaseline) {
  throw new Error('--only= is supported with --update-baseline or --check.');
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
  {
    name: 'product-sidenav-docked-expanded',
    match: { importPath: './stories/NavigationSideNav.stories.jsx', exportName: 'DockedSurface' },
    viewport: { width: 900, height: 620 },
  },
  {
    name: 'product-sidenav-docked-collapsed',
    match: { importPath: './stories/NavigationSideNav.stories.jsx', exportName: 'DockedCollapsed' },
    viewport: { width: 900, height: 620 },
  },
  {
    name: 'product-sidenav-docked-reduced-motion',
    match: { importPath: './stories/NavigationSideNav.stories.jsx', exportName: 'DockedCollapsed' },
    viewport: { width: 900, height: 620 },
    reducedMotion: 'reduce',
    reducedMotionSelectors: ['.lk-sidenav__surface'],
  },
  {
    name: 'product-dashboard-shell-normal',
    match: { importPath: './stories/LayoutDashboardShell.stories.jsx', exportName: 'NormalWidth' },
    viewport: { width: 1280, height: 820 },
  },
  {
    name: 'product-dashboard-shell-dark',
    match: { importPath: './stories/LayoutDashboardShell.stories.jsx', exportName: 'DarkSurface' },
    viewport: { width: 1280, height: 820 },
  },
  {
    name: 'product-navigation-dashboard-fixed',
    match: { importPath: './stories/NavigationDashboard.stories.jsx', exportName: 'Overview' },
    viewport: { width: 1280, height: 820 },
  },
  {
    name: 'product-navigation-dashboard-overlay-rail',
    match: { importPath: './stories/NavigationDashboard.stories.jsx', exportName: 'OverlayPeekRail' },
    viewport: { width: 1280, height: 820 },
  },
  {
    name: 'product-navigation-dashboard-topbar-toggle',
    match: { importPath: './stories/NavigationDashboard.stories.jsx', exportName: 'TopBarToggle' },
    viewport: { width: 1280, height: 820 },
  },
];

// Robotics visual coverage lives in the split repository's representative
// Storybook browser gate. Keep this root baseline limited to LDS Core/Product.
const requestedCaptureNames = onlyArguments.length === 0
  ? null
  : onlyArguments[0].slice('--only='.length).split(',').map((name) => name.trim()).filter(Boolean);
const knownCaptureNames = new Set(targets.map(({ name }) => name));
const selectedCaptureNames = requestedCaptureNames === null
  ? null
  : new Set(requestedCaptureNames);

if (selectedCaptureNames?.size === 0) {
  throw new Error('--only= must name at least one capture.');
}
for (const name of selectedCaptureNames || []) {
  if (!knownCaptureNames.has(name)) {
    throw new Error(`Unknown visual capture in --only=: ${name}`);
  }
}

function shouldCapture(name) {
  return selectedCaptureNames === null || selectedCaptureNames.has(name);
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

async function main() {
  const indexPath = path.join(staticDir, 'index.json');
  const index = JSON.parse(await readFile(indexPath, 'utf8'));
  await mkdir(outDir, { recursive: true });
  let existingBaselineManifest = null;
  if (updateBaseline && selectedCaptureNames !== null) {
    const baselineManifestPath = path.join(baselineDir, 'manifest.json');
    existingBaselineManifest = JSON.parse(await readFile(baselineManifestPath, 'utf8'));
  }

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
    count: selectedCaptureNames?.size ?? targets.length,
    captures: [],
  };
  const regressions = [];

  try {
    for (const target of targets) {
      if (!shouldCapture(target.name)) continue;
      const id = findStoryId(index.entries, target);
      await page.setViewportSize(target.viewport);
      await page.emulateMedia({ reducedMotion: target.reducedMotion || 'no-preference' });
      const url = storyUrl(origin, id, target.query);
      await loadStoryReady(page, url, target.name, runtimeErrors);

      if (target.reducedMotionSelectors?.length) {
        const transitionEvidence = await page.evaluate((selectors) => selectors.map((selector) => {
          const element = document.querySelector(selector);
          if (!element) return { selector, missing: true };
          const styles = getComputedStyle(element);
          return {
            selector,
            transitionDuration: styles.transitionDuration,
            animationDuration: styles.animationDuration,
          };
        }), target.reducedMotionSelectors);
        const nonZeroEvidence = transitionEvidence.filter((entry) => (
          entry.missing
          || entry.transitionDuration.split(',').some((value) => Number.parseFloat(value) > 0)
          || entry.animationDuration.split(',').some((value) => Number.parseFloat(value) > 0)
        ));
        if (nonZeroEvidence.length > 0) {
          throw new Error(`${target.name} did not disable motion: ${JSON.stringify(nonZeroEvidence)}`);
        }
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
        reducedMotion: target.reducedMotion || 'no-preference',
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

  } finally {
    await page.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  if (updateBaseline) {
    const updatedCaptures = manifest.captures.map(({ name, id, query, viewport, reducedMotion, bytes, sha256 }) => ({
      name,
      id,
      query,
      viewport,
      reducedMotion,
      bytes,
      sha256,
    }));
    const baselineManifest = existingBaselineManifest === null
      ? {
          schemaVersion: 1,
          count: updatedCaptures.length,
          maxDiffRatio,
          captures: updatedCaptures,
        }
      : (() => {
          const updatedByName = new Map(updatedCaptures.map((capture) => [capture.name, capture]));
          const existingNames = new Set(existingBaselineManifest.captures.map(({ name }) => name));
          const replaced = existingBaselineManifest.captures.map((capture) => updatedByName.get(capture.name) || capture);
          const appended = targets
            .filter(({ name }) => selectedCaptureNames.has(name) && !existingNames.has(name))
            .map(({ name }) => updatedByName.get(name));
          const captures = [...replaced, ...appended];
          return {
            ...existingBaselineManifest,
            count: captures.length,
            captures,
          };
        })();
    await writeFile(
      path.join(baselineDir, 'manifest.json'),
      `${JSON.stringify(baselineManifest, null, 2)}\n`,
      'utf8'
    );
    const updateKind = selectedCaptureNames === null ? 'visual baselines' : 'selected visual baselines';
    console.log(`Updated ${manifest.captures.length} ${updateKind} in ${path.relative(root, baselineDir)}.`);
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
