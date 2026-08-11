import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import opentype from 'opentype.js';
import {
  PORTAL_INLINE_TRANSFORM,
  PORTAL_LOCKUP_VIEWBOX,
  PORTAL_MINIMUM_RENDERED_HEIGHT_PX,
  PORTAL_PATHS,
} from '../components/brand/lk-portal-lockup-paths.js';
import { LOGO_GEOMETRY } from './brand/lk-logo-source.mjs';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const construction = JSON.parse(await readFile(path.join(root, 'assets/brand/lk-logo-construction.json'), 'utf8'));
const registry = JSON.parse(await readFile(path.join(root, 'assets/brand/lk-product-lockups.json'), 'utf8'));
const fontBuffer = await readFile(path.join(root, construction.wordmark.fontFile));
const licenseBuffer = await readFile(path.join(root, construction.wordmark.licenseFile));
const fontArrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
const font = opentype.parse(fontArrayBuffer);
const outputPath = 'components/brand/lk-product-lockup-paths.js';

assertEqual(registry.schemaVersion, 1, 'registry schema version');
assertEqual(registry.constructionVersion, 1, 'registry construction version');
assertEqual(construction.wordmark.family, 'Montserrat', 'wordmark family');
assertEqual(construction.wordmark.style, 'ExtraBold', 'wordmark style');
assertEqual(construction.wordmark.weight, 800, 'wordmark weight');
assertEqual(construction.wordmark.kerning, 'font-default', 'wordmark kerning');
assertEqual(construction.wordmark.letterSpacing, 0, 'wordmark letter spacing');
assertEqual(construction.wordmark.horizontalScale, 1, 'wordmark horizontal scale');
assertEqual(construction.wordmark.verticalScale, 1, 'wordmark vertical scale');
assertEqual(construction.wordmark.manualGlyphEdits, false, 'wordmark manual glyph edits');
assertEqual(construction.output.productWordmarksAsOutlines, true, 'product outline output');
assertEqual(construction.output.textElementsAllowed, false, 'text element policy');
assertEqual(construction.output.runtimeFontDependency, false, 'runtime font policy');
assertEqual(fileSha256(fontBuffer), construction.wordmark.fontSha256, 'wordmark font SHA-256');
assertEqual(fileSha256(licenseBuffer), construction.wordmark.licenseSha256, 'wordmark license SHA-256');
assertEqual(font.names.fontFamily?.en, `${construction.wordmark.family} ${construction.wordmark.style}`, 'font family metadata');
assertEqual(font.names.version?.en?.replace(/^Version\s+/i, ''), construction.wordmark.fontVersion, 'font version metadata');
assertEqual(font.tables.os2?.usWeightClass, construction.wordmark.weight, 'font weight metadata');

const layout = construction.layout.portal;
assertEqual(layout.visibleWordmarkHeightToX, 1, 'visible wordmark height');
assertEqual(layout.gapToMarkWidth, 0.35, 'visible mark-width gap');
assertEqual(layout.verticalAlignment, 'visible-bounds', 'vertical alignment');
assertEqual(layout.minimumRenderedHeightPx, 20, 'minimum rendered height');

const rows = Object.entries(registry.products).map(([key, product]) => buildProduct(key, product));
const portal = rows.find((row) => row.key === 'portal');
if (!portal) throw new Error('The approved registry must retain the Portal compatibility entry.');
assertEqual(JSON.stringify(portal.paths), JSON.stringify(PORTAL_PATHS), 'Portal path parity');
assertEqual(portal.transform, PORTAL_INLINE_TRANSFORM, 'Portal transform parity');
assertEqual(portal.viewBox, PORTAL_LOCKUP_VIEWBOX, 'Portal viewBox parity');
assertEqual(portal.minimumRenderedHeightPx, PORTAL_MINIMUM_RENDERED_HEIGHT_PX, 'Portal minimum-height parity');

const output = renderModule(rows);
if (/<text\s/i.test(output)) throw new Error('ProductLockup runtime output must not contain SVG text elements.');

if (checkOnly) {
  const current = await readFile(path.join(root, outputPath), 'utf8').catch(() => '');
  if (current !== output) throw new Error(`${outputPath} is stale. Run node scripts/generate-product-lockups.mjs.`);
  console.log(`Validated ${rows.length} approved outlined product lockups with exact Portal parity.`);
} else {
  await writeFile(path.join(root, outputPath), output);
  console.log(`Generated ${rows.length} approved outlined product lockups with exact Portal parity.`);
}

function buildProduct(key, product) {
  if (!/^[a-z][a-z0-9-]*$/.test(key)) throw new Error(`Invalid product registry key: ${key}`);
  assertEqual(product.status, 'approved', `${key} approval status`);
  if (typeof product.label !== 'string' || !product.label.trim()) throw new Error(`${key} requires a canonical label.`);
  if (!/^[A-Z]+(?: [A-Z]+)*$/.test(product.wordmark)) throw new Error(`${key} wordmark must use approved A-Z words and ASCII spaces only.`);
  assertEqual(product.wordmark, product.label.toUpperCase(), `${key} canonical uppercase wordmark`);

  const letters = [...product.wordmark];
  const paths = [];
  const glyphIds = [];
  const origins = [];
  const finalAdvance = font.forEachGlyph(
    product.wordmark,
    0,
    0,
    font.unitsPerEm,
    { kerning: true },
    (glyph, x, y, fontSize) => {
      glyphIds.push(glyph.index);
      origins.push(x);
      const d = glyph.getPath(x, y, fontSize).toPathData(3);
      if (d) paths.push({ letter: letters[glyphIds.length - 1], d });
    },
  );
  const sourceBoundsRaw = font.getPath(product.wordmark, 0, 0, font.unitsPerEm, { kerning: true }).getBoundingBox();
  const sourceBoundsArray = [sourceBoundsRaw.x1, sourceBoundsRaw.y1, sourceBoundsRaw.x2, sourceBoundsRaw.y2];
  assertArrayEqual(glyphIds, product.expected.glyphIds, `${key} glyph IDs`);
  assertArrayEqual(origins, product.expected.origins, `${key} kerning-aware origins`);
  assertArrayEqual(sourceBoundsArray, product.expected.sourceBounds, `${key} source bounds`);
  assertEqual(finalAdvance, product.expected.finalAdvance, `${key} final advance`);

  const sourceBounds = {
    x: sourceBoundsRaw.x1,
    y: sourceBoundsRaw.y1,
    width: sourceBoundsRaw.x2 - sourceBoundsRaw.x1,
    height: sourceBoundsRaw.y2 - sourceBoundsRaw.y1,
  };
  const markBounds = LOGO_GEOMETRY.markBounds;
  const scale = markBounds.height / sourceBounds.height;
  const productBounds = {
    x: markBounds.x + markBounds.width + markBounds.width * layout.gapToMarkWidth,
    y: markBounds.y,
    width: sourceBounds.width * scale,
    height: sourceBounds.height * scale,
  };
  const transform = matrix(
    scale,
    productBounds.x - sourceBounds.x * scale,
    productBounds.y - sourceBounds.y * scale,
  );
  const viewBoxBounds = padBounds(unionBounds(markBounds, productBounds), construction.layout.tightPaddingSourceUnits);
  const viewBox = formatViewBox(viewBoxBounds);
  const [, , serializedWidth, serializedHeight] = viewBox.split(/\s+/).map(Number);
  const minimumRequiredSlotWidthPx = Number((layout.minimumRenderedHeightPx * serializedWidth / serializedHeight).toFixed(6));

  return {
    key,
    label: product.label,
    wordmark: product.wordmark,
    compatibilityVariant: product.compatibilityVariant,
    paths,
    transform,
    viewBox,
    minimumRenderedHeightPx: layout.minimumRenderedHeightPx,
    minimumRequiredSlotWidthPx,
  };
}

function renderModule(products) {
  const importsPortal = products.some((product) => product.key === 'portal');
  const localPathBlocks = products
    .filter((product) => product.key !== 'portal')
    .map((product) => {
      const constant = `${product.key.toUpperCase().replace(/-/g, '_')}_PATHS`;
      const paths = product.paths.map((row) => `  Object.freeze({ letter: ${JSON.stringify(row.letter)}, d: ${JSON.stringify(row.d)} }),`).join('\n');
      return `const ${constant} = Object.freeze([\n${paths}\n]);`;
    })
    .join('\n\n');
  const registryRows = products.map((product) => {
    const paths = product.key === 'portal' ? 'PORTAL_PATHS' : `${product.key.toUpperCase().replace(/-/g, '_')}_PATHS`;
    return [
      `  ${JSON.stringify(product.key)}: Object.freeze({`,
      `    label: ${JSON.stringify(product.label)},`,
      `    wordmark: ${JSON.stringify(product.wordmark)},`,
      `    paths: ${paths},`,
      `    transform: ${product.key === 'portal' ? 'PORTAL_INLINE_TRANSFORM' : JSON.stringify(product.transform)},`,
      `    viewBox: ${product.key === 'portal' ? 'PORTAL_LOCKUP_VIEWBOX' : JSON.stringify(product.viewBox)},`,
      `    minimumRenderedHeightPx: ${product.key === 'portal' ? 'PORTAL_MINIMUM_RENDERED_HEIGHT_PX' : product.minimumRenderedHeightPx},`,
      `    minimumRequiredSlotWidthPx: ${product.minimumRequiredSlotWidthPx},`,
      '  }),',
    ].join('\n');
  }).join('\n');
  const portalImport = importsPortal
    ? `import {\n  PORTAL_INLINE_TRANSFORM,\n  PORTAL_LOCKUP_VIEWBOX,\n  PORTAL_MINIMUM_RENDERED_HEIGHT_PX,\n  PORTAL_PATHS,\n} from './lk-portal-lockup-paths.js';\n\n`
    : '';

  return `/**
 * Generated by scripts/generate-product-lockups.mjs. Do not edit by hand.
 *
 * Approved product wordmarks are outlined from pinned Montserrat ExtraBold 800
 * v${construction.wordmark.fontVersion}. Runtime output has no font or SVG text dependency.
 * Font SHA-256: ${construction.wordmark.fontSha256}
 */
${portalImport}${localPathBlocks}

export const PRODUCT_LOCKUP_REGISTRY = Object.freeze({
${registryRows}
});

export const PRODUCT_LOCKUP_KEYS = Object.freeze(Object.keys(PRODUCT_LOCKUP_REGISTRY));
`;
}

function padBounds(box, padding) {
  return { x: box.x - padding, y: box.y - padding, width: box.width + padding * 2, height: box.height + padding * 2 };
}

function unionBounds(...boxes) {
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function matrix(scale, translateX, translateY) {
  return `matrix(${formatNumber(scale)} 0 0 ${formatNumber(scale)} ${formatNumber(translateX)} ${formatNumber(translateY)})`;
}

function formatViewBox(box) {
  return [box.x, box.y, box.width, box.height].map((value) => formatNumber(value)).join(' ');
}

function formatNumber(value, precision = 6) {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function fileSha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function assertArrayEqual(actual, expected, label) {
  assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
