import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = process.cwd();
const inventoryDir = path.join(root, 'visual-artifacts', 'inventory');
const manifestPath = path.join(inventoryDir, 'manifest.json');
const diffDir = path.join(inventoryDir, 'diffs');
const diffImageDir = path.join(diffDir, 'images');
const diffManifestPath = path.join(diffDir, 'manifest.json');
const diffReportPath = path.join(diffDir, 'report.html');
const diffSmokePath = path.join(diffDir, 'report-smoke.png');
const pixelThreshold = 24;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slug(value) {
  return value
    .replace(/\\/g, '/')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);
}

function relFromDiff(filePath) {
  return path.relative(diffDir, path.join(root, filePath)).replaceAll('\\', '/');
}

function relFromRoot(filePath) {
  return path.relative(root, filePath).replaceAll('\\', '/');
}

async function assertFile(filePath, label) {
  const fullPath = path.join(root, filePath);
  await access(fullPath);
  const fileStat = await stat(fullPath);
  assert(fileStat.isFile(), `${label} is not a file: ${filePath}`);
  assert(fileStat.size >= 1024, `${label} is unexpectedly small: ${filePath} (${fileStat.size} bytes)`);
}

async function imageDataUrl(filePath) {
  const buffer = await readFile(path.join(root, filePath));
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function compareImages(page, legacy, primary, diffOutputPath) {
  const result = await page.evaluate(
    async ({ legacyUrl, primaryUrl, threshold }) => {
      async function loadImage(src) {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        await image.decode();
        return image;
      }

      function draw(image, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, width, height);
      }

      const [legacyImage, primaryImage] = await Promise.all([loadImage(legacyUrl), loadImage(primaryUrl)]);
      const width = Math.max(legacyImage.naturalWidth, primaryImage.naturalWidth);
      const height = Math.max(legacyImage.naturalHeight, primaryImage.naturalHeight);
      const legacyData = draw(legacyImage, width, height).data;
      const primaryData = draw(primaryImage, width, height).data;
      const diffCanvas = document.createElement('canvas');
      diffCanvas.width = width;
      diffCanvas.height = height;
      const diffContext = diffCanvas.getContext('2d');
      const diffImage = diffContext.createImageData(width, height);
      let mismatchPixels = 0;
      let totalDelta = 0;
      let maxDelta = 0;

      for (let index = 0; index < legacyData.length; index += 4) {
        const pixel = index / 4;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        const outsideLegacy = x >= legacyImage.naturalWidth || y >= legacyImage.naturalHeight;
        const outsidePrimary = x >= primaryImage.naturalWidth || y >= primaryImage.naturalHeight;
        const delta = outsideLegacy !== outsidePrimary
          ? 255
          : Math.max(
              Math.abs(legacyData[index] - primaryData[index]),
              Math.abs(legacyData[index + 1] - primaryData[index + 1]),
              Math.abs(legacyData[index + 2] - primaryData[index + 2]),
              Math.abs(legacyData[index + 3] - primaryData[index + 3])
            );
        totalDelta += delta;
        if (delta > maxDelta) maxDelta = delta;
        if (delta > threshold) {
          mismatchPixels += 1;
          diffImage.data[index] = 255;
          diffImage.data[index + 1] = Math.max(0, 210 - delta);
          diffImage.data[index + 2] = Math.max(0, 210 - delta);
          diffImage.data[index + 3] = 255;
        } else {
          const gray = 242 - Math.min(72, delta * 2);
          diffImage.data[index] = gray;
          diffImage.data[index + 1] = gray;
          diffImage.data[index + 2] = gray;
          diffImage.data[index + 3] = 255;
        }
      }

      diffContext.putImageData(diffImage, 0, 0);
      const dataUrl = diffCanvas.toDataURL('image/png');
      const totalPixels = width * height;
      return {
        dataUrl,
        width,
        height,
        legacyWidth: legacyImage.naturalWidth,
        legacyHeight: legacyImage.naturalHeight,
        primaryWidth: primaryImage.naturalWidth,
        primaryHeight: primaryImage.naturalHeight,
        totalPixels,
        mismatchPixels,
        mismatchRatio: totalPixels === 0 ? 0 : mismatchPixels / totalPixels,
        meanDelta: totalPixels === 0 ? 0 : totalDelta / totalPixels,
        maxDelta,
        threshold,
      };
    },
    { legacyUrl: await imageDataUrl(legacy.path), primaryUrl: await imageDataUrl(primary.path), threshold: pixelThreshold }
  );

  const diffBase64 = result.dataUrl.replace(/^data:image\/png;base64,/, '');
  await writeFile(diffOutputPath, Buffer.from(diffBase64, 'base64'));
  delete result.dataUrl;
  return result;
}

function renderDiffCard(result) {
  const ratio = `${(result.mismatchRatio * 100).toFixed(2)}%`;
  const legacySize = `${result.legacyWidth}x${result.legacyHeight}`;
  const primarySize = `${result.primaryWidth}x${result.primaryHeight}`;
  return `
    <section class="pair" id="${escapeHtml(result.anchor)}">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(result.card)}</p>
          <h2>${escapeHtml(result.exports.join(', '))}</h2>
          <p>Primary story: ${escapeHtml(result.primaryStoryId)}</p>
          <p>Mismatch: <strong>${escapeHtml(ratio)}</strong> (${escapeHtml(result.mismatchPixels)} / ${escapeHtml(result.totalPixels)} px), mean delta ${escapeHtml(result.meanDelta.toFixed(2))}, max delta ${escapeHtml(result.maxDelta)}</p>
        </div>
        <span class="badge">${escapeHtml(legacySize)} vs ${escapeHtml(primarySize)}</span>
      </header>
      <div class="grid">
        <figure>
          <figcaption>Original card</figcaption>
          <img src="${escapeHtml(relFromDiff(result.legacyPath))}" alt="${escapeHtml(`${result.card} original`)}" />
        </figure>
        <figure>
          <figcaption>Primary React</figcaption>
          <img src="${escapeHtml(relFromDiff(result.primaryPath))}" alt="${escapeHtml(`${result.card} primary React`)}" />
        </figure>
        <figure>
          <figcaption>Pixel diff (red = above threshold ${escapeHtml(result.threshold)})</figcaption>
          <img src="${escapeHtml(relFromDiff(result.diffPath))}" alt="${escapeHtml(`${result.card} diff`)}" />
        </figure>
      </div>
    </section>
  `;
}

async function verifyRenderedReport(expectedPairs) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  try {
    await page.goto(pathToFileURL(diffReportPath).href, { waitUntil: 'load', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForSelector('.pair', { timeout: 15000 });
    assert((await page.title()) === 'LK ROBOTICS Visual Pixel Diff Report', 'Unexpected pixel diff report title.');
    assert((await page.locator('.pair').count()) === expectedPairs, `Expected ${expectedPairs} rendered diff pairs.`);
    const brokenImages = await page.$$eval('img', (images) =>
      images
        .map((image) => ({ src: image.getAttribute('src') || '', width: image.naturalWidth, height: image.naturalHeight }))
        .filter((image) => image.width <= 0 || image.height <= 0)
    );
    assert(brokenImages.length === 0, `Pixel diff report has broken images:\n${brokenImages.map((image) => image.src).join('\n')}`);
    await page.screenshot({ path: diffSmokePath, fullPage: false, animations: 'disabled' });
  } finally {
    await page.close();
    await browser.close();
  }

  assert(errors.length === 0, `Pixel diff report emitted browser errors:\n${errors.join('\n')}`);
  await assertFile(relFromRoot(diffSmokePath), 'Pixel diff smoke screenshot');
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert(manifest.counts?.legacyComponentCards === 83, `Expected 83 legacy component cards, found ${manifest.counts?.legacyComponentCards}.`);
  assert(manifest.counts?.primaryReactCards === 83, `Expected 83 primary React card captures, found ${manifest.counts?.primaryReactCards}.`);
  assert(manifest.counts?.cardStoryPairs === 83, `Expected 83 card/story pairs, found ${manifest.counts?.cardStoryPairs}.`);

  const legacyByCard = new Map((manifest.legacyComponentCards || []).map((item) => [item.selected, item]));
  const primaryByCard = new Map((manifest.primaryReactCards || []).map((item) => [item.selected, item]));
  const pairs = manifest.cardStoryPairs || [];
  const failures = [];

  await mkdir(diffImageDir, { recursive: true });

  for (const pair of pairs) {
    const legacy = legacyByCard.get(pair.card);
    const primary = primaryByCard.get(pair.card);
    if (!legacy) failures.push(`${pair.card}: missing original-card screenshot`);
    if (!primary) failures.push(`${pair.card}: missing same-viewport primary React screenshot`);
    if (primary && primary.id !== pair.primaryStory?.id) failures.push(`${pair.card}: primary screenshot id ${primary.id} does not match ${pair.primaryStory?.id}`);
  }
  assert(failures.length === 0, `Pixel diff preflight failed:\n${failures.join('\n')}`);

  for (const item of manifest.legacyComponentCards || []) await assertFile(item.path, 'Original card screenshot');
  for (const item of manifest.primaryReactCards || []) await assertFile(item.path, 'Primary React screenshot');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];
  try {
    for (const pair of pairs) {
      const legacy = legacyByCard.get(pair.card);
      const primary = primaryByCard.get(pair.card);
      const diffOutputPath = path.join(diffImageDir, `${slug(pair.card)}.diff.png`);
      const metrics = await compareImages(page, legacy, primary, diffOutputPath);
      results.push({
        card: pair.card,
        exports: pair.exports,
        primaryStoryId: pair.primaryStory?.id || '',
        anchor: slug(pair.card),
        legacyPath: legacy.path,
        primaryPath: primary.path,
        diffPath: relFromRoot(diffOutputPath),
        ...metrics,
      });
    }
  } finally {
    await page.close();
    await browser.close();
  }

  const sortedByMismatch = [...results].sort((a, b) => b.mismatchRatio - a.mismatchRatio || a.card.localeCompare(b.card, 'ko'));
  const summary = {
    generatedAt: new Date().toISOString(),
    threshold: pixelThreshold,
    counts: {
      comparedPairs: results.length,
      legacyComponentCards: manifest.counts.legacyComponentCards,
      primaryReactCards: manifest.counts.primaryReactCards,
    },
    aggregate: {
      mismatchPixels: results.reduce((sum, result) => sum + result.mismatchPixels, 0),
      totalPixels: results.reduce((sum, result) => sum + result.totalPixels, 0),
      maxMismatchRatio: sortedByMismatch[0]?.mismatchRatio || 0,
      meanMismatchRatio: results.reduce((sum, result) => sum + result.mismatchRatio, 0) / results.length,
    },
    topMismatches: sortedByMismatch.slice(0, 10).map((result) => ({
      card: result.card,
      mismatchRatio: result.mismatchRatio,
      mismatchPixels: result.mismatchPixels,
      totalPixels: result.totalPixels,
      legacySize: `${result.legacyWidth}x${result.legacyHeight}`,
      primarySize: `${result.primaryWidth}x${result.primaryHeight}`,
    })),
    results,
  };

  await writeFile(diffManifestPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>LK ROBOTICS Visual Pixel Diff Report</title>
  <style>
    :root { color-scheme: light; --bg: #f6f7f9; --panel: #fff; --ink: #111827; --muted: #6b7280; --line: #d8dee8; --brand: #003b71; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-family: Arial, "Pretendard", sans-serif; letter-spacing: 0; }
    main { width: min(1560px, calc(100% - 48px)); margin: 0 auto; padding: 40px 0 64px; }
    .hero { display: grid; gap: 12px; margin-bottom: 28px; }
    .hero strong, .eyebrow { color: var(--brand); font-size: 12px; font-weight: 800; }
    h1, h2, p { margin: 0; }
    h1 { font-size: clamp(28px, 4vw, 48px); line-height: 1.08; }
    h2 { font-size: 18px; }
    .summary { display: flex; flex-wrap: wrap; gap: 10px; color: var(--muted); line-height: 1.6; }
    .summary code { padding: 2px 6px; border-radius: 6px; background: #e9edf3; color: var(--ink); }
    .pair { margin-top: 24px; padding: 20px; border: 1px solid var(--line); border-radius: 20px; background: var(--panel); box-shadow: 0 8px 24px rgba(15, 23, 42, .06); }
    .pair > header { display: flex; justify-content: space-between; gap: 16px; align-items: start; margin-bottom: 16px; }
    .pair header div { display: grid; gap: 6px; }
    .pair header p { color: var(--muted); font-size: 13px; }
    .badge { flex: none; padding: 5px 10px; border-radius: 999px; background: #eef5ff; color: var(--brand); font-size: 12px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(280px, 1fr)); gap: 16px; align-items: start; }
    figure { margin: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 16px; background: #f9fafb; }
    figcaption { padding: 10px 12px; border-bottom: 1px solid var(--line); background: #fff; font-size: 13px; font-weight: 700; }
    img { display: block; width: 100%; height: auto; background: white; }
    @media (max-width: 1100px) { main { width: min(100% - 24px, 1560px); } .grid { grid-template-columns: 1fr; } .pair > header { display: grid; } .badge { justify-self: start; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <strong>LK ROBOTICS VISUAL PIXEL DIFF</strong>
      <h1>Original card screenshots to same-viewport primary React captures</h1>
      <p class="summary">
        <span>Generated from <code>visual-artifacts/inventory/manifest.json</code></span>
        <span>- ${escapeHtml(results.length)} compared pairs</span>
        <span>- threshold ${escapeHtml(pixelThreshold)} channel delta</span>
        <span>- max mismatch ${(summary.aggregate.maxMismatchRatio * 100).toFixed(2)}%</span>
        <span>- mean mismatch ${(summary.aggregate.meanMismatchRatio * 100).toFixed(2)}%</span>
      </p>
    </section>
    ${sortedByMismatch.map(renderDiffCard).join('\n')}
  </main>
</body>
</html>
`;

  await writeFile(diffReportPath, html, 'utf8');
  await verifyRenderedReport(results.length);
  console.log(
    `Generated visual pixel diff report: ${relFromRoot(diffManifestPath)}, ${relFromRoot(diffReportPath)}, and ${relFromRoot(diffSmokePath)} (${results.length} pairs).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
