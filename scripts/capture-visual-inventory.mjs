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

function storyPath(id, query = {}) {
  const params = new URLSearchParams({ id, viewMode: 'story' });
  for (const [key, value] of Object.entries(query)) params.set(key, value);
  return `storybook-static/iframe.html?${params.toString()}`;
}

function storyUrl(origin, id, query = {}) {
  return `${origin}/${storyPath(id, query).replace(/^storybook-static\//, '')}`;
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

function parseComponentRows(auditSource) {
  return [...auditSource.matchAll(/\[\s*'[^']*',\s*'[^']*',\s*'(components\/[^']+\.card\.html)',\s*'([^']*)'/g)].map(
    (match) => ({
      card: match[1],
      exports: match[2]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })
  );
}


function normalizedIdentifier(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function storySpecificity(story, exports) {
  const storyTokens = [story.exportName, story.name, story.id].map(normalizedIdentifier).filter(Boolean);
  return exports.reduce((score, exportName) => {
    const token = normalizedIdentifier(exportName);
    if (!token) return score;
    if (storyTokens.some((storyToken) => storyToken === token || storyToken.includes(token))) return score + 2;
    return score;
  }, 0);
}

function hasWord(source, name) {
  return new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(source);
}

function storyBlock(source, exportName) {
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start === -1) return '';

  const next = source.indexOf('\nexport const ', start + marker.length);
  return source.slice(start, next === -1 ? source.length : next);
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

async function mapComponentCardsToStories(entries, componentCards) {
  const rows = parseComponentRows(await read('stories/Audit.stories.jsx'));
  const rowCards = rows.map((row) => row.card).sort();
  const missingRows = componentCards.filter((file) => !rowCards.includes(file));
  const staleRows = rowCards.filter((file) => !componentCards.includes(file));

  assert(rows.length === componentCards.length, `Expected ${componentCards.length} Audit component rows, found ${rows.length}.`);
  assert(missingRows.length === 0, `Visual inventory card/story map is missing Audit rows:\n${missingRows.join('\n')}`);
  assert(staleRows.length === 0, `Visual inventory card/story map has stale Audit rows:\n${staleRows.join('\n')}`);

  const stories = implementationStories(entries);
  const sourceByImportPath = new Map();
  const blockByStoryId = new Map();
  for (const story of stories) {
    if (!sourceByImportPath.has(story.importPath)) {
      sourceByImportPath.set(story.importPath, await read(story.importPath.replace(/^\.\//, '')));
    }
    blockByStoryId.set(story.id, storyBlock(sourceByImportPath.get(story.importPath), story.exportName));
  }

  const legacyStory = findStory(entries, './stories/LegacyPreviews.stories.jsx', 'ComponentCards');
  const failures = [];
  const pairs = rows.map((row) => {
    const matchedStories = stories
      .map((story) => {
        const source = sourceByImportPath.get(story.importPath) || '';
        const block = blockByStoryId.get(story.id) || '';
        const blockExports = row.exports.filter((name) => hasWord(block, name));
        const moduleExports = row.exports.filter((name) => hasWord(source, name));
        if (blockExports.length > 0) return { story, matchedExports: blockExports, matchMode: 'story-block' };
        if (moduleExports.length > 0) return { story, matchedExports: moduleExports, matchMode: 'story-module' };
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.matchMode !== b.matchMode) return a.matchMode === 'story-block' ? -1 : 1;
        const specificity = storySpecificity(b.story, row.exports) - storySpecificity(a.story, row.exports);
        return specificity || b.matchedExports.length - a.matchedExports.length || a.story.id.localeCompare(b.story.id, 'ko');
      })
      .map(({ story, matchedExports, matchMode }) => ({
        id: story.id,
        importPath: story.importPath,
        exportName: story.exportName,
        title: story.title,
        name: story.name,
        matchMode,
        matchedExports,
      }));

    if (matchedStories.length === 0) failures.push(`${row.card}: no React implementation story source references ${row.exports.join(', ')}`);
    if (matchedStories[0]?.matchMode !== 'story-block') {
      failures.push(`${row.card}: primary React story is not matched inside a Storybook export block`);
    }
    const storyBlockCoverage = new Set(
      matchedStories.filter((story) => story.matchMode === 'story-block').flatMap((story) => story.matchedExports)
    );
    const storyBlockCoverageGaps = row.exports.filter((name) => !storyBlockCoverage.has(name));
    if (storyBlockCoverageGaps.length > 0) {
      failures.push(`${row.card}: Storybook export blocks do not cover mapped exports ${storyBlockCoverageGaps.join(', ')}`);
    }

    return {
      card: row.card,
      exports: row.exports,
      primaryStory: matchedStories[0],
      storyBlockCoverage: [...storyBlockCoverage].sort((a, b) => a.localeCompare(b, 'ko')),
      storyBlockCoverageComplete: storyBlockCoverageGaps.length === 0,
      storyBlockCoverageGaps,
      reviewAnchor: `#${slug(row.card)}`,
      legacyStoryPath: storyPath(legacyStory.id, { selected: row.card }),
      primaryStoryPath: matchedStories[0] ? storyPath(matchedStories[0].id) : null,
      stories: matchedStories.map((story) => ({
        ...story,
        storyPath: storyPath(story.id),
      })),
    };
  });

  assert(failures.length === 0, `Visual inventory card/story pairing failed:\n${failures.join('\n')}`);
  return pairs;
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
  const cardStoryPairs = await mapComponentCardsToStories(entries, componentCards);
  const pairByCard = new Map(cardStoryPairs.map((pair) => [pair.card, pair]));
  await mkdir(path.join(outDir, 'legacy-components'), { recursive: true });
  await mkdir(path.join(outDir, 'react-stories'), { recursive: true });
  await mkdir(path.join(outDir, 'react-primary'), { recursive: true });

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const manifest = {
    generatedAt: new Date().toISOString(),
    storybookStatic: 'storybook-static',
    counts: {
      legacyComponentCards: componentCards.length,
      reactStories: reactStories.length,
      primaryReactCards: componentCards.length,
      cardStoryPairs: cardStoryPairs.length,
    },
    cardStoryPairs,
    legacyComponentCards: [],
    reactStories: [],
    primaryReactCards: [],
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

      const pair = pairByCard.get(selected);
      assert(pair?.primaryStory?.id, `Unable to find primary React story for ${selected}`);
      await page.goto(storyUrl(origin, pair.primaryStory.id), { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(350);

      const primaryOutputPath = path.join(outDir, 'react-primary', `${slug(selected)}.png`);
      await page.screenshot({ path: primaryOutputPath, fullPage: true, animations: 'disabled' });
      manifest.primaryReactCards.push(
        await ensureVisibleScreenshot(primaryOutputPath, {
          selected,
          id: pair.primaryStory.id,
          viewport: { width: viewport.width, height: viewport.height, raw: viewport.raw },
          primaryStory: pair.primaryStory,
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
    `Captured visual inventory: ${manifest.legacyComponentCards.length} legacy component cards, ${manifest.primaryReactCards.length} primary React cards, ${manifest.reactStories.length} React stories, and ${manifest.cardStoryPairs.length} card/story pairs.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
