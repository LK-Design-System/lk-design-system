import { access, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = process.cwd();
const inventoryDir = path.join(root, 'visual-artifacts', 'inventory');
const manifestPath = path.join(inventoryDir, 'manifest.json');
const reportPath = path.join(inventoryDir, 'review.html');
const reportSmokePath = path.join(inventoryDir, 'review-smoke.png');

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

function relFromReport(filePath) {
  return path.relative(inventoryDir, path.join(root, filePath)).replaceAll('\\', '/');
}

async function assertFile(filePath, label) {
  const fullPath = path.join(root, filePath);
  await access(fullPath);
  const fileStat = await stat(fullPath);
  assert(fileStat.isFile(), `${label} is not a file: ${filePath}`);
  assert(fileStat.size >= 1024, `${label} is unexpectedly small: ${filePath} (${fileStat.size} bytes)`);
}

function renderStoryCard(story, screenshot) {
  return `
    <figure class="story">
      <figcaption>
        <strong>${escapeHtml(story.title || story.importPath)}</strong>
        <span>${escapeHtml(story.name || story.exportName)} · ${escapeHtml(story.id)}</span>
      </figcaption>
      <img src="${escapeHtml(relFromReport(screenshot.path))}" alt="${escapeHtml(story.id)}" />
    </figure>
  `;
}

function renderPair(pair, legacyScreenshot, reactScreenshots) {
  return `
    <section class="pair">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(pair.card)}</p>
          <h2>${escapeHtml(pair.exports.join(', '))}</h2>
        </div>
        <span class="count">${reactScreenshots.length} React story${reactScreenshots.length === 1 ? '' : 'ies'}</span>
      </header>
      <div class="grid">
        <figure class="legacy">
          <figcaption>
            <strong>Original component card</strong>
            <span>${escapeHtml(legacyScreenshot.viewport?.raw || '')}</span>
          </figcaption>
          <img src="${escapeHtml(relFromReport(legacyScreenshot.path))}" alt="${escapeHtml(pair.card)}" />
        </figure>
        <div class="stories">
          ${reactScreenshots.map(({ story, screenshot }) => renderStoryCard(story, screenshot)).join('\n')}
        </div>
      </div>
    </section>
  `;
}

async function verifyRenderedReport(expectedPairs) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  try {
    await page.goto(pathToFileURL(reportPath).href, { waitUntil: 'load', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForSelector('.pair', { timeout: 15000 });

    const title = await page.title();
    assert(title === 'LK ROBOTICS Visual Inventory Review', `Unexpected visual review title: ${title}`);

    const pairCount = await page.locator('.pair').count();
    assert(pairCount === expectedPairs, `Expected ${expectedPairs} rendered review pairs, found ${pairCount}.`);

    const brokenImages = await page.$$eval('img', (images) =>
      images
        .map((image) => ({
          src: image.getAttribute('src') || '',
          width: image.naturalWidth,
          height: image.naturalHeight,
        }))
        .filter((image) => image.width <= 0 || image.height <= 0)
    );
    assert(brokenImages.length === 0, `Visual review report has broken images:\n${brokenImages.map((image) => image.src).join('\n')}`);

    const firstPairText = await page.locator('.pair').first().innerText();
    assert(firstPairText.includes('Original component card'), 'Rendered report is missing the original-card label.');
    assert(firstPairText.includes('React story') || firstPairText.includes('React stories'), 'Rendered report is missing React story labels.');

    await page.screenshot({ path: reportSmokePath, fullPage: false, animations: 'disabled' });
  } finally {
    await page.close();
    await browser.close();
  }

  assert(errors.length === 0, `Visual review report emitted browser errors:\n${errors.join('\n')}`);
  await assertFile(path.relative(root, reportSmokePath).replaceAll('\\', '/'), 'Visual review smoke screenshot');
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const legacyByCard = new Map(manifest.legacyComponentCards.map((item) => [item.selected, item]));
  const reactById = new Map(manifest.reactStories.map((item) => [item.id, item]));
  const pairs = manifest.cardStoryPairs || [];
  const failures = [];

  assert(manifest.counts?.legacyComponentCards === 83, `Expected 83 legacy component cards, found ${manifest.counts?.legacyComponentCards}.`);
  assert(manifest.counts?.cardStoryPairs === 83, `Expected 83 card/story pairs, found ${manifest.counts?.cardStoryPairs}.`);
  assert(pairs.length === 83, `Expected 83 card/story pair records, found ${pairs.length}.`);

  for (const legacy of manifest.legacyComponentCards) await assertFile(legacy.path, 'Legacy screenshot');
  for (const react of manifest.reactStories) await assertFile(react.path, 'React screenshot');

  for (const pair of pairs) {
    const legacyScreenshot = legacyByCard.get(pair.card);
    if (!legacyScreenshot) failures.push(`${pair.card}: missing legacy screenshot`);
    if (!pair.stories?.length) failures.push(`${pair.card}: no paired React stories`);
    for (const story of pair.stories || []) {
      if (!reactById.has(story.id)) failures.push(`${pair.card}: paired story has no screenshot (${story.id})`);
    }
  }

  assert(failures.length === 0, `Visual review report validation failed:\n${failures.join('\n')}`);

  const renderedPairs = pairs
    .map((pair) => {
      const legacyScreenshot = legacyByCard.get(pair.card);
      const reactScreenshots = pair.stories.map((story) => ({ story, screenshot: reactById.get(story.id) }));
      return renderPair(pair, legacyScreenshot, reactScreenshots);
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>LK ROBOTICS Visual Inventory Review</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --panel: #fff;
      --ink: #111827;
      --muted: #6b7280;
      --line: #d8dee8;
      --brand: #003b71;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Arial, "Pretendard", sans-serif;
      letter-spacing: 0;
    }
    main {
      width: min(1480px, calc(100% - 48px));
      margin: 0 auto;
      padding: 40px 0 64px;
    }
    .hero {
      display: grid;
      gap: 12px;
      margin-bottom: 28px;
    }
    .hero strong {
      color: var(--brand);
      font-size: 13px;
      letter-spacing: .08em;
    }
    h1, h2, p { margin: 0; }
    h1 { font-size: clamp(28px, 4vw, 48px); line-height: 1.08; }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--muted);
      line-height: 1.6;
    }
    .summary code {
      padding: 2px 6px;
      border-radius: 6px;
      background: #e9edf3;
      color: var(--ink);
    }
    .pair {
      margin-top: 24px;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: var(--panel);
      box-shadow: 0 8px 24px rgba(15, 23, 42, .06);
    }
    .pair > header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
      margin-bottom: 16px;
    }
    .eyebrow {
      margin-bottom: 6px;
      color: var(--brand);
      font-size: 12px;
      font-weight: 700;
    }
    h2 { font-size: 20px; }
    .count {
      flex: none;
      padding: 5px 10px;
      border-radius: 999px;
      background: #eef5ff;
      color: var(--brand);
      font-size: 12px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: minmax(320px, .92fr) minmax(360px, 1.08fr);
      gap: 16px;
      align-items: start;
    }
    figure {
      margin: 0;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: #f9fafb;
    }
    figcaption {
      display: grid;
      gap: 4px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      background: #fff;
      font-size: 13px;
    }
    figcaption span {
      color: var(--muted);
      font-size: 12px;
      word-break: break-all;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
      background: white;
    }
    .stories {
      display: grid;
      gap: 16px;
    }
    @media (max-width: 980px) {
      main { width: min(100% - 24px, 1480px); }
      .grid { grid-template-columns: 1fr; }
      .pair > header { display: grid; }
      .count { justify-self: start; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <strong>LK ROBOTICS VISUAL INVENTORY REVIEW</strong>
      <h1>Original component cards ↔ React implementation stories</h1>
      <p class="summary">
        <span>Generated from <code>visual-artifacts/inventory/manifest.json</code></span>
        <span>· ${escapeHtml(manifest.counts.legacyComponentCards)} original cards</span>
        <span>· ${escapeHtml(manifest.counts.reactStories)} React stories</span>
        <span>· ${escapeHtml(manifest.counts.cardStoryPairs)} traceability pairs</span>
      </p>
    </section>
    ${renderedPairs}
  </main>
</body>
</html>
`;

  await writeFile(reportPath, html, 'utf8');
  await verifyRenderedReport(pairs.length);
  console.log(
    `Generated visual review report: ${path.relative(root, reportPath).replaceAll('\\', '/')} and ${path
      .relative(root, reportSmokePath)
      .replaceAll('\\', '/')}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
