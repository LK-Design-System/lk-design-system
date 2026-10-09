import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as fontkit from 'fontkit';
import opentype from 'opentype.js';
import { INLINE_WORDMARK_EXPECTED, layoutInlineWordmark } from './brand/inline-construction.mjs';
import { LK_MARK_PATHS, LOGO_GEOMETRY } from './brand/lk-logo-source.mjs';
import { ROBOTICS_INLINE_PATHS, ROBOTICS_INLINE_TRANSFORM } from '../components/brand/lk-logo-paths.js';
import {
  PORTAL_INLINE_TRANSFORM,
  PORTAL_LOCKUP_VIEWBOX,
  PORTAL_MINIMUM_RENDERED_HEIGHT_PX,
  PORTAL_PATHS,
} from '../components/brand/lk-portal-lockup-paths.js';

// `npm run generate:brand` regenerates the fixed Portal module first. Importing
// it here makes a stale or independently changed canonical fail registry generation.

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const construction = JSON.parse(await readFile(path.join(root, 'assets/brand/lk-logo-construction.json'), 'utf8'));
const registry = JSON.parse(await readFile(path.join(root, 'assets/brand/lk-product-lockups.json'), 'utf8'));
const productWordmark = construction.productLockupWordmark;
const fontBuffer = await readFile(path.join(root, productWordmark.fontFile));
const licenseBuffer = await readFile(path.join(root, productWordmark.licenseFile));
const fontArrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
const font = opentype.parse(fontArrayBuffer);
const outputPath = 'components/brand/lk-product-lockup-paths.js';
const inlineWordmark = construction.inlineWordmark;
const inlineFontBuffer = await readFile(path.join(root, inlineWordmark.fontFile));
const inlineFont = opentype.parse(inlineFontBuffer.buffer.slice(inlineFontBuffer.byteOffset, inlineFontBuffer.byteOffset + inlineFontBuffer.byteLength));

assertEqual(registry.schemaVersion, 1, 'registry schema version');
assertEqual(registry.constructionVersion, 3, 'registry construction version');
assertEqual(productWordmark.family, 'Montserrat', 'product-lockup wordmark family');
assertEqual(productWordmark.style, 'SemiBold', 'product-lockup wordmark style');
assertEqual(productWordmark.weight, 600, 'product-lockup wordmark weight');
assertEqual(productWordmark.kerning, 'font-default', 'product-lockup wordmark kerning');
assertEqual(productWordmark.letterSpacing, 0, 'product-lockup wordmark letter spacing');
assertEqual(productWordmark.horizontalScale, 1, 'product-lockup wordmark horizontal scale');
assertEqual(productWordmark.verticalScale, 1, 'product-lockup wordmark vertical scale');
assertEqual(productWordmark.manualGlyphEdits, false, 'product-lockup wordmark manual glyph edits');
assertEqual(construction.output.productWordmarksAsOutlines, true, 'product outline output');
assertEqual(construction.output.textElementsAllowed, false, 'text element policy');
assertEqual(construction.output.runtimeFontDependency, false, 'runtime font policy');
assertEqual(fileSha256(fontBuffer), productWordmark.fontSha256, 'product-lockup font SHA-256');
assertEqual(fileSha256(licenseBuffer), productWordmark.licenseSha256, 'product-lockup license SHA-256');
assertEqual(font.names.fontFamily?.en, `${productWordmark.family} ${productWordmark.style}`, 'product-lockup font family metadata');
assertEqual(font.names.version?.en?.replace(/^Version\s+/i, ''), productWordmark.fontVersion, 'product-lockup font version metadata');
assertEqual(font.tables.os2?.usWeightClass, productWordmark.weight, 'product-lockup font weight metadata');

const layout = construction.layout.productLockup;
assertEqual(layout.visibleWordmarkHeightToX, 1, 'visible wordmark height');
assertEqual(layout.gapToMarkWidth, 0.35, 'visible mark-width gap');
assertEqual(layout.verticalAlignment, 'visible-bounds', 'vertical alignment');
assertEqual(layout.minimumRenderedHeightPx, 20, 'minimum rendered height');

/* Company-endorsed form: the company inline unit (LK + Bold 700 ROBOTICS) is
   recomputed with the same helper as generate-brand-assets.mjs and must match
   the published ROBOTICS_INLINE_* runtime constants exactly. */
const companyLayout = registry.companyLockup;
assertEqual(companyLayout.companyUnit, 'lockup-inline', 'company lockup unit');
/* The company form's product name uses the LDS UI typography font, outlined at
   build time like the Pretendard corporate name: the vendor pin must be the same
   bytes as the UI font so a UI-font upgrade forces an explicit logo revision. */
const companyFontSpec = companyLayout.productNameFont;
assertEqual(companyFontSpec.family, 'Pretendard', 'company lockup product-name family');
assertEqual(companyFontSpec.style, 'SemiBold', 'company lockup product-name style');
assertEqual(companyFontSpec.weight, 600, 'company lockup product-name weight');
assertEqual(companyFontSpec.fontFormat, 'static-woff2', 'company lockup product-name font format');
assertEqual(companyFontSpec.engine, 'fontkit@2.0.4', 'company lockup product-name layout engine');
assertEqual(companyFontSpec.kerning, 'font-default', 'company lockup product-name kerning');
assertEqual(companyFontSpec.letterSpacing, 0, 'company lockup product-name letter spacing');
assertEqual(companyFontSpec.horizontalScale, 1, 'company lockup product-name horizontal scale');
assertEqual(companyFontSpec.verticalScale, 1, 'company lockup product-name vertical scale');
assertEqual(companyFontSpec.manualGlyphEdits, false, 'company lockup product-name manual glyph edits');
const fontkitPackage = JSON.parse(await readFile(path.join(root, 'node_modules/fontkit/package.json'), 'utf8'));
assertEqual(`fontkit@${fontkitPackage.version}`, companyFontSpec.engine, 'installed fontkit version');
const companyFontBuffer = await readFile(path.join(root, companyFontSpec.fontFile));
assertEqual(fileSha256(companyFontBuffer), companyFontSpec.fontSha256, 'company lockup product-name font SHA-256');
assertEqual(fileSha256(await readFile(path.join(root, companyFontSpec.uiTypographyFile))), companyFontSpec.fontSha256, 'company lockup product-name font matches the UI typography font');
assertEqual(fileSha256(await readFile(path.join(root, companyFontSpec.licenseFile))), companyFontSpec.licenseSha256, 'company lockup product-name license SHA-256');
const companyFont = fontkit.create(companyFontBuffer);
assertEqual(companyFont.familyName, `${companyFontSpec.family} ${companyFontSpec.style}`, 'company lockup product-name family metadata');
assertEqual(companyFont.postscriptName, `${companyFontSpec.family}-${companyFontSpec.style}`, 'company lockup product-name PostScript metadata');
assertEqual(companyFont.version, companyFontSpec.fontVersionMetadata, 'company lockup product-name font version metadata');
assertEqual(companyFont.version.replace(/^Version\s+/i, ''), companyFontSpec.fontVersion, 'company lockup product-name font version');
assertEqual(companyFont['OS/2']?.usWeightClass, companyFontSpec.weight, 'company lockup product-name weight metadata');
assertEqual(Object.keys(companyFont.variationAxes ?? {}).length, 0, 'company lockup product-name font is static');
assertEqual(companyLayout.case, 'canonical-label', 'company lockup case');
assertEqual(companyLayout.latinPattern, '^[A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*$', 'company lockup Latin pattern');
assertEqual(companyLayout.capHeightToRoboticsCapHeight, 1, 'company lockup cap-height ratio');
assertEqual(companyLayout.baseline, 'robotics-inline-baseline', 'company lockup baseline');
assertEqual(companyLayout.gapToMarkWidth, layout.gapToMarkWidth, 'company lockup gap reuses the product-lockup mark-width gap');
assertEqual(companyLayout.gapMeasurement, 'robotics-ink-right-to-name-ink-left', 'company lockup gap measurement');
assertEqual(companyLayout.verticalFrame, 'inline-padded-mark-frame', 'company lockup vertical frame');
assertEqual(companyLayout.defaultRenderedHeightPx, 28, 'company lockup default height');
assertEqual(companyLayout.minimumRenderedHeightPx, layout.minimumRenderedHeightPx, 'company lockup minimum height');
assertArrayEqual(companyLayout.appearances, ['positive', 'reverse'], 'company lockup appearances');
assertEqual(companyLayout.compact, false, 'company lockup has no compact mode');
assertEqual(fileSha256(inlineFontBuffer), inlineWordmark.fontSha256, 'company unit inline font SHA-256');
assertEqual(inlineFont.tables.os2?.usWeightClass, inlineWordmark.weight, 'company unit inline font weight metadata');
assertEqual(inlineFont.unitsPerEm, font.unitsPerEm, 'company unit and product-name units per em');
const inlineLayout = construction.layout.inline;
const companyUnit = layoutInlineWordmark({
  font: inlineFont,
  text: inlineWordmark.text,
  markBounds: LOGO_GEOMETRY.markBounds,
  visibleWordmarkHeightToX: inlineLayout.visibleWordmarkHeightToX,
  gapToMarkWidth: inlineLayout.gapToMarkWidth,
});
assertArrayEqual(companyUnit.glyphRows.map((row) => row.glyphId), INLINE_WORDMARK_EXPECTED.glyphIds, 'company unit ROBOTICS glyph IDs');
assertArrayEqual(companyUnit.glyphRows.map((row) => row.origin), INLINE_WORDMARK_EXPECTED.origins, 'company unit ROBOTICS origins');
assertEqual(companyUnit.finalAdvance, INLINE_WORDMARK_EXPECTED.finalAdvance, 'company unit ROBOTICS advance');
assertArrayEqual(companyUnit.sourceBoundsArray, INLINE_WORDMARK_EXPECTED.sourceBounds, 'company unit ROBOTICS ink bounds');
assertEqual(
  matrix(companyUnit.scale, companyUnit.translateX, companyUnit.translateY),
  ROBOTICS_INLINE_TRANSFORM,
  'company unit transform matches Lockup inline ROBOTICS_INLINE_TRANSFORM',
);
assertArrayEqual(
  companyUnit.glyphRows.map((row) => row.d),
  ROBOTICS_INLINE_PATHS.map((row) => row.d),
  'company unit paths match Lockup inline ROBOTICS_INLINE_PATHS',
);
const roboticsCapHeight = inlineFont.tables.os2?.sCapHeight;
const productNameCapHeight = companyFont.capHeight;
if (!(roboticsCapHeight > 0) || !(productNameCapHeight > 0)) throw new Error('Pinned fonts need a usable OS/2 cap height.');

const rows = Object.entries(registry.products).map(([key, product]) => buildProduct(key, product));
const portal = rows.find((row) => row.key === 'portal');
if (!portal) throw new Error('The approved registry must retain the Portal product entry.');
assertEqual(JSON.stringify(portal.paths), JSON.stringify(PORTAL_PATHS), 'registry Portal paths match canonical fixed Portal');
assertEqual(portal.transform, PORTAL_INLINE_TRANSFORM, 'registry Portal transform matches canonical fixed Portal');
assertEqual(portal.viewBox, PORTAL_LOCKUP_VIEWBOX, 'registry Portal viewBox matches canonical fixed Portal');
assertEqual(portal.minimumRenderedHeightPx, PORTAL_MINIMUM_RENDERED_HEIGHT_PX, 'registry Portal minimum height matches canonical fixed Portal');

const outputs = new Map([[outputPath, renderModule(rows)]]);
for (const row of rows.filter((candidate) => candidate.company)) {
  outputs.set(`assets/brand/lk-lockup-company-${row.key}-navy.svg`, renderCompanySvg(row.company, construction.colors.navy));
  outputs.set(`assets/brand/lk-lockup-company-${row.key}-white.svg`, renderCompanySvg(row.company, construction.colors.white));
}
for (const [relativePath, content] of outputs) {
  if (/<text\s/i.test(content)) throw new Error(`${relativePath} must not contain SVG text elements.`);
}
const companySvgPaths = [...outputs.keys()].filter((relativePath) => relativePath.endsWith('.svg')).sort();
const companyCount = rows.filter((row) => row.company).length;

if (checkOnly) {
  const repositoryCompanySvgPaths = (await readdir(path.join(root, 'assets/brand')))
    .filter((name) => name.startsWith('lk-lockup-company-') && name.endsWith('.svg'))
    .map((name) => `assets/brand/${name}`)
    .sort();
  assertArrayEqual(repositoryCompanySvgPaths, companySvgPaths, 'repository company-endorsed lockup SVG inventory');
  const stale = [];
  for (const [relativePath, expected] of outputs) {
    const current = await readFile(path.join(root, relativePath), 'utf8').catch(() => '');
    if (current !== expected) stale.push(relativePath);
  }
  if (stale.length) throw new Error(`Product lockup outputs are stale. Run node scripts/generate-product-lockups.mjs.\n${stale.map((file) => `- ${file}`).join('\n')}`);
  console.log(`Validated ${rows.length} approved outlined product lockups (${companyCount} company-endorsed) with parent-brand-first SemiBold hierarchy.`);
} else {
  for (const [relativePath, content] of outputs) await writeFile(path.join(root, relativePath), content);
  console.log(`Generated ${rows.length} approved outlined product lockups (${companyCount} company-endorsed) with parent-brand-first SemiBold hierarchy.`);
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
    paths,
    transform,
    viewBox,
    minimumRenderedHeightPx: layout.minimumRenderedHeightPx,
    minimumRequiredSlotWidthPx,
    company: product.company ? buildCompanyForm(key, product) : null,
  };
}

function buildCompanyForm(key, product) {
  const company = product.company;
  assertEqual(company.status, 'approved', `${key} company-endorsed approval status`);
  assertEqual(company.wordmark, product.label, `${key} company-endorsed wordmark equals the canonical label`);
  if (!new RegExp(companyLayout.latinPattern).test(company.wordmark)) {
    throw new Error(`${key} company-endorsed wordmark must be canonical-case ASCII words. A Hangul name needs a separate approved revision that pins Pretendard SemiBold through fontkit; do not compose it from live text.`);
  }

  for (const character of company.wordmark) {
    if (!companyFont.hasGlyphForCodePoint(character.codePointAt(0))) {
      throw new Error(`${key} company-endorsed wordmark character ${JSON.stringify(character)} is missing from the pinned product-name font.`);
    }
  }
  const letters = [...company.wordmark];
  const run = companyFont.layout(company.wordmark, companyFontSpec.layoutFeatures);
  assertArrayEqual(Object.keys(run.features ?? {}).sort(), companyFontSpec.appliedFeatures, `${key} company-endorsed applied layout features`);
  assertEqual(run.glyphs.length, letters.length, `${key} company-endorsed glyph count`);
  const paths = [];
  const glyphIds = [];
  const origins = [];
  const glyphBounds = [];
  let finalAdvance = 0;
  run.glyphs.forEach((glyph, index) => {
    if (glyph.id === 0) throw new Error(`${key} company-endorsed wordmark maps a character to .notdef.`);
    const position = run.positions[index];
    const origin = finalAdvance + position.xOffset;
    const glyphPath = glyph.path.scale(1, -1).translate(origin, -position.yOffset);
    glyphIds.push(glyph.id);
    origins.push(origin);
    if (glyphPath.commands.length) {
      paths.push({ letter: letters[index], d: serializeFontkitPath(glyphPath.toSVG()) });
      glyphBounds.push(glyphPath.bbox);
    }
    finalAdvance += position.xAdvance;
  });
  const sourceBoundsRaw = {
    x1: Math.min(...glyphBounds.map((box) => box.minX)),
    y1: Math.min(...glyphBounds.map((box) => box.minY)),
    x2: Math.max(...glyphBounds.map((box) => box.maxX)),
    y2: Math.max(...glyphBounds.map((box) => box.maxY)),
  };
  const sourceBoundsArray = [sourceBoundsRaw.x1, sourceBoundsRaw.y1, sourceBoundsRaw.x2, sourceBoundsRaw.y2];
  assertArrayEqual(glyphIds, company.expected.glyphIds, `${key} company-endorsed glyph IDs`);
  assertArrayEqual(origins, company.expected.origins, `${key} company-endorsed kerning-aware origins`);
  assertArrayEqual(sourceBoundsArray, company.expected.sourceBounds, `${key} company-endorsed source bounds`);
  assertEqual(finalAdvance, company.expected.finalAdvance, `${key} company-endorsed final advance`);

  // The product name's cap height equals the ROBOTICS cap height and both words
  // share the ROBOTICS baseline. Mixed case is not scaled by ink height: the
  // ascender of `l` would otherwise shrink the capitals.
  const markBounds = LOGO_GEOMETRY.markBounds;
  const scale = companyUnit.scale * (roboticsCapHeight / productNameCapHeight) * companyLayout.capHeightToRoboticsCapHeight;
  const roboticsInkRight = companyUnit.bounds.x + companyUnit.bounds.width;
  const nameInkLeft = roboticsInkRight + markBounds.width * companyLayout.gapToMarkWidth;
  const baseline = companyUnit.translateY;
  const nameBounds = {
    x: nameInkLeft,
    y: baseline + sourceBoundsRaw.y1 * scale,
    width: (sourceBoundsRaw.x2 - sourceBoundsRaw.x1) * scale,
    height: (sourceBoundsRaw.y2 - sourceBoundsRaw.y1) * scale,
  };
  const transform = matrix(scale, nameInkLeft - sourceBoundsRaw.x1 * scale, baseline);

  // Same vertical frame as Lockup inline, so one rendered height gives one X.
  const padding = construction.layout.tightPaddingSourceUnits;
  const frame = padBounds(markBounds, padding);
  for (const [label, box] of [['ROBOTICS', companyUnit.bounds], ['product name', nameBounds]]) {
    if (box.y < frame.y || box.y + box.height > frame.y + frame.height) {
      throw new Error(`${key} company-endorsed ${label} ink leaves the inline vertical frame.`);
    }
  }
  const viewBox = formatViewBox({
    x: frame.x,
    y: frame.y,
    width: nameBounds.x + nameBounds.width + padding - frame.x,
    height: frame.height,
  });
  const [, , serializedWidth, serializedHeight] = viewBox.split(/\s+/).map(Number);
  const minimumRequiredSlotWidthPx = Number((companyLayout.minimumRenderedHeightPx * serializedWidth / serializedHeight).toFixed(6));

  return {
    label: product.label,
    wordmark: company.wordmark,
    paths,
    transform,
    viewBox,
    defaultRenderedHeightPx: companyLayout.defaultRenderedHeightPx,
    minimumRenderedHeightPx: companyLayout.minimumRenderedHeightPx,
    minimumRequiredSlotWidthPx,
  };
}

function renderCompanySvg(company, fill) {
  const pathRow = (row, indent) => `${'  '.repeat(indent)}<path d="${row.d}"${row.transform ? ` transform="${row.transform}"` : ''} fill="${fill}" />`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${company.viewBox}" preserveAspectRatio="xMidYMid meet">`,
    `  <title>LK ROBOTICS ${company.label}</title>`,
    ...LK_MARK_PATHS.map((row) => pathRow(row, 1)),
    `  <g transform="${ROBOTICS_INLINE_TRANSFORM}">`,
    ...ROBOTICS_INLINE_PATHS.map((row) => pathRow(row, 2)),
    '  </g>',
    `  <g transform="${company.transform}">`,
    ...company.paths.map((row) => pathRow(row, 2)),
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
}

function renderModule(products) {
  const localPathBlocks = products
    .map((product) => {
      const constant = `${product.key.toUpperCase().replace(/-/g, '_')}_PATHS`;
      const paths = product.paths.map((row) => `  Object.freeze({ letter: ${JSON.stringify(row.letter)}, d: ${JSON.stringify(row.d)} }),`).join('\n');
      const block = `const ${constant} = Object.freeze([\n${paths}\n]);`;
      if (!product.company) return block;
      const companyConstant = `${product.key.toUpperCase().replace(/-/g, '_')}_COMPANY_PATHS`;
      const companyPaths = product.company.paths.map((row) => `  Object.freeze({ letter: ${JSON.stringify(row.letter)}, d: ${JSON.stringify(row.d)} }),`).join('\n');
      return `${block}\n\nconst ${companyConstant} = Object.freeze([\n${companyPaths}\n]);`;
    })
    .join('\n\n');
  const registryRows = products.map((product) => {
    const paths = `${product.key.toUpperCase().replace(/-/g, '_')}_PATHS`;
    return [
      `  ${JSON.stringify(product.key)}: Object.freeze({`,
      `    label: ${JSON.stringify(product.label)},`,
      `    wordmark: ${JSON.stringify(product.wordmark)},`,
      `    paths: ${paths},`,
      `    transform: ${JSON.stringify(product.transform)},`,
      `    viewBox: ${JSON.stringify(product.viewBox)},`,
      `    minimumRenderedHeightPx: ${product.minimumRenderedHeightPx},`,
      `    minimumRequiredSlotWidthPx: ${product.minimumRequiredSlotWidthPx},`,
      ...(product.company ? [
        '    company: Object.freeze({',
        `      label: ${JSON.stringify(product.company.label)},`,
        `      wordmark: ${JSON.stringify(product.company.wordmark)},`,
        `      paths: ${product.key.toUpperCase().replace(/-/g, '_')}_COMPANY_PATHS,`,
        `      transform: ${JSON.stringify(product.company.transform)},`,
        `      viewBox: ${JSON.stringify(product.company.viewBox)},`,
        `      defaultRenderedHeightPx: ${product.company.defaultRenderedHeightPx},`,
        `      minimumRenderedHeightPx: ${product.company.minimumRenderedHeightPx},`,
        `      minimumRequiredSlotWidthPx: ${product.company.minimumRequiredSlotWidthPx},`,
        '    }),',
      ] : []),
      '  }),',
    ].join('\n');
  }).join('\n');
  return `/**
 * Generated by scripts/generate-product-lockups.mjs. Do not edit by hand.
 *
 * Mark-form product wordmarks are outlined from pinned Montserrat SemiBold 600
 * v${productWordmark.fontVersion}; company-endorsed product names are outlined from
 * pinned ${companyFontSpec.family} ${companyFontSpec.style} ${companyFontSpec.weight} v${companyFontSpec.releaseVersion}.
 * Runtime output has no font or SVG text dependency.
 * Font SHA-256: ${productWordmark.fontSha256} (mark form), ${companyFontSpec.fontSha256} (company form)
 */
${localPathBlocks}

export const PRODUCT_LOCKUP_REGISTRY = Object.freeze({
${registryRows}
});

export const PRODUCT_LOCKUP_KEYS = Object.freeze(Object.keys(PRODUCT_LOCKUP_REGISTRY));

/** Registry keys whose company-endorsed form (LK ROBOTICS + product name) is approved. */
export const PRODUCT_LOCKUP_COMPANY_KEYS = Object.freeze(
  PRODUCT_LOCKUP_KEYS.filter((key) => PRODUCT_LOCKUP_REGISTRY[key].company),
);
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

function serializeFontkitPath(value, precision = 3) {
  return value.replace(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi, (token) => formatNumber(Number(token), precision));
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
