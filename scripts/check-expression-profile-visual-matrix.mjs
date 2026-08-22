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
const artifactDir = path.join(root, 'visual-artifacts', 'expression-profile');
const baselineDir = path.join(root, 'visual-baselines', 'expression-profile');
const durableManifestPath = path.join(root, 'docs/references/visual/EXPRESSION_PROFILE_MATRIX.json');
const update = process.argv.includes('--update');
const check = process.argv.includes('--check');
const maxDiffRatio = Number(process.env.VISUAL_MAX_DIFF_RATIO || 0.01);

if (update === check) throw new Error('Pass exactly one of --update or --check.');

const profiles = ['default', 'ops'];
const themes = ['light', 'dark'];
const widths = [
  { id: 'normal', width: 1280, height: 820 },
  { id: '320', width: 320, height: 900 },
];
const stories = [
  {
    id: 'record-header',
    importPath: './stories/ContentRecordHeader.stories.jsx',
    exportNameByWidth: { normal: 'RecordHeaderOverview', '320': 'RecordHeaderOverview' },
  },
  {
    id: 'input-surface',
    importPath: './stories/FormInput.stories.jsx',
    exportNameByWidth: { normal: 'InputOverview', '320': 'InputOverview' },
  },
  {
    id: 'data-dense',
    importPath: './stories/ExpressionProfileDensity.stories.jsx',
    exportNameByWidth: { normal: 'DataDense', '320': 'DataDense' },
  },
  {
    id: 'navigation-overlay',
    importPath: './stories/ExpressionProfileDensity.stories.jsx',
    exportNameByWidth: { normal: 'NavigationOverlay', '320': 'NavigationOverlay' },
  },
];

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
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(staticDir, safePath);
      assert(filePath.startsWith(staticDir), 'static server path escaped storybook-static');
      const fileStat = await stat(filePath);
      assert(fileStat.isFile(), 'requested static path is not a file');
      response.writeHead(200, { 'content-type': contentType(filePath) });
      createReadStream(filePath).pipe(response);
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

function storyId(index, story, widthId) {
  const exportName = story.exportNameByWidth[widthId];
  const entry = Object.values(index.entries).find((candidate) => candidate.type === 'story'
    && candidate.importPath === story.importPath && candidate.exportName === exportName);
  assert(entry, `Storybook entry not found for ${story.id}`);
  return entry.id;
}

function storyUrl(origin, id, profile, theme) {
  const params = new URLSearchParams({
    id,
    viewMode: 'story',
    globals: `profile:${profile};backgrounds.value:${theme === 'dark' ? 'Dark' : 'Base'}`,
  });
  return `${origin}/iframe.html?${params.toString()}`;
}

function hash(filePath) {
  return new Promise((resolve, reject) => {
    const digest = createHash('sha256');
    createReadStream(filePath).on('data', (chunk) => digest.update(chunk)).on('error', reject).on('end', () => resolve(digest.digest('hex')));
  });
}

async function compare(name, actualPath) {
  const baselinePath = path.join(baselineDir, `${name}.png`);
  const baseline = PNG.sync.read(await readFile(baselinePath));
  const actual = PNG.sync.read(await readFile(actualPath));
  assert(actual.width === baseline.width && actual.height === baseline.height, `${name} dimensions drifted`);
  const diff = new PNG({ width: actual.width, height: actual.height });
  const differentPixels = pixelmatch(baseline.data, actual.data, diff.data, actual.width, actual.height, { threshold: 0.1, includeAA: false });
  const diffRatio = differentPixels / (actual.width * actual.height);
  if (differentPixels > 0) {
    await mkdir(path.join(artifactDir, 'diff'), { recursive: true });
    await writeFile(path.join(artifactDir, 'diff', `${name}.png`), PNG.sync.write(diff));
  }
  return { differentPixels, diffRatio };
}

async function verifyBehavior(page, story, name) {
  if (story.id === 'data-dense') {
    const checkbox = page.locator('[data-expression-fixture="data-dense"] input[type="checkbox"]').first();
    assert(await checkbox.count() === 1, `${name} has no selection checkbox`);
    await checkbox.focus();
    await page.keyboard.press('Space');
    assert(await checkbox.isChecked(), `${name} selection checkbox did not toggle from the keyboard`);

    const treeItems = page.locator('[data-expression-fixture="data-dense"] [role="treeitem"]');
    assert(await treeItems.count() >= 2, `${name} has no navigable tree`);
    await treeItems.first().focus();
    const firstKey = await treeItems.first().getAttribute('data-tree-key');
    await page.keyboard.press('ArrowDown');
    const activeKey = await page.evaluate(() => document.activeElement?.getAttribute('data-tree-key'));
    assert(activeKey && activeKey !== firstKey, `${name} tree ArrowDown did not move focus`);
  }

  if (story.id === 'navigation-overlay') {
    const menuTrigger = page.getByRole('button', { name: '보기', exact: true }).first();
    assert(await menuTrigger.count() === 1, `${name} has no DropdownMenu trigger`);
    if (await menuTrigger.getAttribute('aria-expanded') === 'true') {
      await menuTrigger.click();
      await page.waitForFunction(() => [...document.querySelectorAll('button')]
        .some((button) => button.textContent?.trim() === '보기' && button.getAttribute('aria-expanded') === 'false'));
    }

    const trigger = page.getByRole('button', { name: '필터', exact: true }).first();
    assert(await trigger.count() === 1, `${name} has no Drawer trigger`);
    await trigger.click();
    await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
    const focusEntered = await page.evaluate(() => Boolean(document.querySelector('[role="dialog"]')?.contains(document.activeElement)));
    assert(focusEntered, `${name} Drawer did not acquire focus`);
    await page.keyboard.press('Escape');
    await page.locator('[role="dialog"]').waitFor({ state: 'detached' });
    await page.waitForFunction(() => document.activeElement?.textContent?.trim() === '필터');

    await menuTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(() => [...document.querySelectorAll('button')]
      .some((button) => button.textContent?.trim() === '보기' && button.getAttribute('aria-expanded') === 'true'));
    await page.waitForFunction(() => document.activeElement?.getAttribute('role')?.startsWith('menuitem')
      && document.activeElement?.closest('[role="menu"]'));
  }
}

async function settleCaptureState(page, story, name) {
  if (story.id !== 'navigation-overlay') return;

  const menuTrigger = page.getByRole('button', { name: '보기', exact: true }).first();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (await menuTrigger.getAttribute('aria-expanded') !== 'true') {
      await menuTrigger.focus();
      await page.keyboard.press('ArrowDown');
    }
    await page.waitForFunction(() => {
      const trigger = [...document.querySelectorAll('button')]
        .find((button) => button.textContent?.trim() === '보기');
      const menu = document.querySelector('[role="menu"]');
      return trigger?.getAttribute('aria-expanded') === 'true'
        && menu?.getBoundingClientRect().height > 0;
    });
    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    if (await menuTrigger.getAttribute('aria-expanded') === 'true') return;
  }
  throw new Error(`${name} DropdownMenu did not remain open through capture settlement`);
}

async function main() {
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const captures = [];
  const regressions = [];

  try {
    for (const story of stories) {
      for (const theme of themes) {
        for (const width of widths) {
          const id = storyId(index, story, width.id);
          for (const profile of profiles) {
            const name = `${story.id}--${profile}--${theme}--${width.id}`;
            errors.length = 0;
            await page.setViewportSize({ width: width.width, height: width.height });
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.mouse.move(-1, -1);
            await page.goto(storyUrl(origin, id, profile, theme), { waitUntil: 'networkidle' });
            await page.waitForFunction(({ expectedProfile, expectedTheme }) => {
              const root = document.querySelector('#storybook-root');
              const scope = document.querySelector(`[data-lds-profile="${expectedProfile}"]`);
              return Boolean(root?.children.length && scope?.getAttribute('data-theme') === expectedTheme);
            }, { expectedProfile: profile, expectedTheme: theme }, { timeout: 30000 });
            await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
            await page.waitForTimeout(350);
            assert(errors.length === 0, `${name} runtime errors: ${errors.join(' | ')}`);

            const expression = await page.evaluate(() => {
              const scope = document.querySelector('[data-lds-profile]');
              const style = getComputedStyle(scope);
              const focusable = scope.querySelector('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
              focusable?.focus();
              const root = document.documentElement;
              const previousRootProfile = root.getAttribute('data-lds-profile');
              root.removeAttribute('data-lds-profile');
              const rootDefaultButtonHeight = getComputedStyle(root).getPropertyValue('--component-button-height-md').trim();
              root.setAttribute('data-lds-profile', 'ops');
              const rootOpsStyle = getComputedStyle(root);
              const rootOpsButtonHeight = rootOpsStyle.getPropertyValue('--component-button-height-md').trim();
              const rootOpsTablePadding = rootOpsStyle.getPropertyValue('--component-table-cell-padding-md').trim();
              if (previousRootProfile == null) root.removeAttribute('data-lds-profile');
              else root.setAttribute('data-lds-profile', previousRootProfile);

              const targetRects = [...document.querySelectorAll('[data-lds-target]')].map((target) => {
                const rect = target.getBoundingClientRect();
                return { width: rect.width, height: rect.height };
              });
              const tableCell = document.querySelector('[data-density-surface="table"] tbody :is(td, th)');
              const gridHeaderRow = [...document.querySelectorAll('[data-density-surface="data-grid"] thead tr')]
                .find((row) => row.getBoundingClientRect().height > 1);
              const treeRow = document.querySelector('[data-density-surface="tree"] [role="treeitem"] > div');
              const dataToolbar = document.querySelector('[data-density-surface="data-toolbar"]');
              const filterBar = document.querySelector('[data-density-surface="filter-bar"]');
              const sideNavItem = document.querySelector('[data-expression-fixture="navigation-overlay"] [data-sidenav-value]');
              const menuItem = document.querySelector('[role^="menuitem"]');
              const px = (node, property) => node ? getComputedStyle(node)[property] : null;
              return {
                profile: scope.getAttribute('data-lds-profile'),
                theme: scope.getAttribute('data-theme'),
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1 || document.body.scrollWidth > window.innerWidth + 1,
                buttonHeight: style.getPropertyValue('--component-button-height-md').trim(),
                cardPadding: style.getPropertyValue('--component-card-padding').trim(),
                duration: style.getPropertyValue('--dur-fast').trim(),
                semanticLabel: style.getPropertyValue('--color-semantic-label-normal').trim(),
                focusable: document.activeElement === focusable,
                rootDefaultButtonHeight,
                rootOpsButtonHeight,
                rootOpsTablePadding,
                targetRects,
                geometry: {
                  tablePaddingTop: px(tableCell, 'paddingTop'),
                  gridHeaderHeight: gridHeaderRow?.getBoundingClientRect().height ?? null,
                  treeRowHeight: treeRow?.getBoundingClientRect().height ?? null,
                  dataToolbarPaddingTop: px(dataToolbar, 'paddingTop'),
                  filterBarPaddingTop: px(filterBar, 'paddingTop'),
                  sideNavItemHeight: sideNavItem?.getBoundingClientRect().height ?? null,
                  menuItemHeight: menuItem?.getBoundingClientRect().height ?? null,
                },
              };
            });
            assert(expression.profile === profile && expression.theme === theme, `${name} profile/theme wrapper mismatch`);
            assert(!expression.overflow, `${name} has horizontal overflow`);
            assert(expression.focusable, `${name} has no keyboard-focusable control`);
            assert(expression.rootDefaultButtonHeight === '40px', `${name} root default profile drifted: ${expression.rootDefaultButtonHeight}`);
            assert(expression.rootOpsButtonHeight === '36px', `${name} html[data-lds-profile=ops] did not override Core :root: ${expression.rootOpsButtonHeight}`);
            assert(expression.rootOpsTablePadding === '10px 12px', `${name} root ops data density did not resolve: ${expression.rootOpsTablePadding}`);
            if (story.id === 'data-dense') {
              assert(expression.targetRects.length > 0, `${name} has no measured dense targets`);
              for (const target of expression.targetRects) {
                assert(target.width >= 24 && target.height >= 24, `${name} has a ${target.width}x${target.height} target below 24px`);
              }
            }

            await verifyBehavior(page, story, name);

            await page.emulateMedia({ reducedMotion: 'reduce' });
            const reducedDuration = await page.evaluate(() => getComputedStyle(document.querySelector('[data-lds-profile]')).getPropertyValue('--dur-fast').trim());
            if (profile === 'ops') assert(reducedDuration === '0ms', `${name} did not zero --dur-fast under reduced motion`);
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await settleCaptureState(page, story, name);

            const outputPath = path.join(artifactDir, `${name}.png`);
            await mkdir(artifactDir, { recursive: true });
            await page.screenshot({ path: outputPath, fullPage: true, animations: 'disabled' });
            const fileStat = await stat(outputPath);
            assert(fileStat.size > 1024, `${name} screenshot is unexpectedly small`);
            const capture = {
              name,
              story: story.id,
              id,
              profile,
              theme,
              viewport: { width: width.width, height: width.height },
              expression: {
                buttonHeight: expression.buttonHeight,
                cardPadding: expression.cardPadding,
                duration: expression.duration,
                semanticLabel: expression.semanticLabel,
                rootDefaultButtonHeight: expression.rootDefaultButtonHeight,
                rootOpsButtonHeight: expression.rootOpsButtonHeight,
                rootOpsTablePadding: expression.rootOpsTablePadding,
                targetRects: expression.targetRects,
                geometry: expression.geometry,
              },
              path: path.relative(root, outputPath).replaceAll('\\', '/'),
              sha256: await hash(outputPath),
            };
            captures.push(capture);
            if (update) {
              await mkdir(baselineDir, { recursive: true });
              await copyFile(outputPath, path.join(baselineDir, `${name}.png`));
            } else {
              const comparison = await compare(name, outputPath);
              capture.comparison = comparison;
              if (comparison.diffRatio > maxDiffRatio) regressions.push(`${name} ${(comparison.diffRatio * 100).toFixed(3)}%`);
            }
          }
        }
      }
    }
  } finally {
    await page.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  for (const story of stories) {
    for (const theme of themes) {
      for (const width of widths) {
        const pair = captures.filter((capture) => capture.story === story.id && capture.theme === theme && capture.viewport.width === width.width);
        const defaultCapture = pair.find((capture) => capture.profile === 'default');
        const opsCapture = pair.find((capture) => capture.profile === 'ops');
        assert(defaultCapture && opsCapture, `incomplete profile pair for ${story.id}/${theme}/${width.id}`);
        assert(defaultCapture.expression.buttonHeight !== opsCapture.expression.buttonHeight, `button height did not express a profile delta for ${story.id}/${theme}/${width.id}`);
        assert(defaultCapture.expression.cardPadding !== opsCapture.expression.cardPadding, `card padding did not express a profile delta for ${story.id}/${theme}/${width.id}`);
        assert(defaultCapture.expression.semanticLabel === opsCapture.expression.semanticLabel, `semantic label changed with profile for ${story.id}/${theme}/${width.id}`);
        if (story.id === 'data-dense') {
          assert(defaultCapture.expression.geometry.tablePaddingTop !== opsCapture.expression.geometry.tablePaddingTop, `Table density did not change for ${story.id}/${theme}/${width.id}`);
          assert(defaultCapture.expression.geometry.gridHeaderHeight > opsCapture.expression.geometry.gridHeaderHeight, `DataGrid header did not become denser for ${story.id}/${theme}/${width.id}`);
          assert(defaultCapture.expression.geometry.treeRowHeight > opsCapture.expression.geometry.treeRowHeight, `Tree row did not become denser for ${story.id}/${theme}/${width.id}`);
          assert(defaultCapture.expression.geometry.dataToolbarPaddingTop !== opsCapture.expression.geometry.dataToolbarPaddingTop, `DataToolbar chrome did not become denser for ${story.id}/${theme}/${width.id}`);
          assert(defaultCapture.expression.geometry.filterBarPaddingTop !== opsCapture.expression.geometry.filterBarPaddingTop, `FilterBar chrome did not become denser for ${story.id}/${theme}/${width.id}`);
        }
        if (story.id === 'navigation-overlay') {
          assert(defaultCapture.expression.geometry.sideNavItemHeight > opsCapture.expression.geometry.sideNavItemHeight, `SideNav row did not become denser for ${story.id}/${theme}/${width.id}`);
          assert(defaultCapture.expression.geometry.menuItemHeight > opsCapture.expression.geometry.menuItemHeight, `Menu item did not become denser for ${story.id}/${theme}/${width.id}`);
        }
      }
    }
  }

  const durable = {
    schemaVersion: 1,
    kind: 'lds-expression-profile-visual-matrix',
    generatedAt: new Date().toISOString().slice(0, 10),
    matrix: { profiles, themes, widths: widths.map(({ id, width, height }) => ({ id, width, height })), stories: stories.map(({ id, importPath, exportNameByWidth }) => ({ id, importPath, exportNameByWidth })) },
    count: captures.length,
    captures: captures.map(({ comparison, ...capture }) => comparison ? { ...capture, comparison } : capture),
  };
  if (update) await writeFile(durableManifestPath, `${JSON.stringify(durable, null, 2)}\n`, 'utf8');
  else {
    const existing = JSON.parse(await readFile(durableManifestPath, 'utf8'));
    assert(existing.count === captures.length, 'durable visual matrix count drifted');
  }
  if (regressions.length) throw new Error(`Expression profile visual regressions exceeded ${maxDiffRatio}: ${regressions.join(', ')}`);
  console.log(`${update ? 'Updated' : 'Checked'} expression profile visual matrix: ${captures.length} captures (${profiles.length} profiles × ${themes.length} themes × ${widths.length} widths × ${stories.length} stories).`);
}

main().catch((error) => { console.error(error); process.exit(1); });
