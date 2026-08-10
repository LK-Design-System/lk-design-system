import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as fontkit from 'fontkit';
import opentype from 'opentype.js';
import { LK_MARK_PATHS, LOGO_GEOMETRY } from './brand/lk-logo-source.mjs';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const manifestPath = path.join(root, 'assets/brand/lk-logo-construction.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const fontBuffer = await readFile(path.join(root, manifest.wordmark.fontFile));
const corporateFontBuffer = await readFile(path.join(root, manifest.corporateName.fontFile));
const licenseBuffer = await readFile(path.join(root, manifest.wordmark.licenseFile));
const corporateLicenseBuffer = await readFile(path.join(root, manifest.corporateName.licenseFile));

assertEqual(manifest.schemaVersion, 1, 'manifest schema version');
assertEqual(manifest.constructionVersion, 3, 'logo construction version');
assertEqual(
  geometrySha256({ paths: LK_MARK_PATHS, bounds: LOGO_GEOMETRY.markBounds }),
  manifest.symbol.geometrySha256,
  'LK symbol geometry SHA-256',
);
validateMarkBounds(LK_MARK_PATHS, LOGO_GEOMETRY.markBounds);
assertEqual(fileSha256(fontBuffer), manifest.wordmark.fontSha256, 'wordmark font SHA-256');
assertEqual(fileSha256(licenseBuffer), manifest.wordmark.licenseSha256, 'wordmark license SHA-256');
assertEqual(fileSha256(corporateFontBuffer), manifest.corporateName.fontSha256, 'corporate-name font SHA-256');
assertEqual(fileSha256(corporateLicenseBuffer), manifest.corporateName.licenseSha256, 'corporate-name license SHA-256');
assertEqual(manifest.wordmark.case, 'uppercase', 'wordmark case');
assertEqual(manifest.wordmark.text, manifest.wordmark.text.toUpperCase(), 'uppercase wordmark text');
assertEqual(manifest.wordmark.kerning, 'font-default', 'kerning rule');
assertEqual(manifest.wordmark.letterSpacing, 0, 'letter spacing');
assertEqual(manifest.wordmark.horizontalScale, 1, 'horizontal scale');
assertEqual(manifest.wordmark.verticalScale, 1, 'vertical scale');
assertEqual(manifest.wordmark.manualGlyphEdits, false, 'manual glyph edits');
assertEqual(manifest.corporateName.normalization, 'NFC', 'corporate-name normalization');
assertEqual(manifest.corporateName.text.normalize('NFC'), manifest.corporateName.text, 'NFC corporate-name text');
assertEqual(manifest.corporateName.kerning, 'font-default', 'corporate-name kerning rule');
assertEqual(manifest.corporateName.letterSpacingEm, 0.105, 'corporate-name letter spacing');
assertEqual(manifest.corporateName.horizontalScale, 1, 'corporate-name horizontal scale');
assertEqual(manifest.corporateName.verticalScale, 1, 'corporate-name vertical scale');
assertEqual(manifest.corporateName.manualGlyphEdits, false, 'corporate-name manual glyph edits');
assertEqual(manifest.output.wordmarkAsOutlines, true, 'outline output rule');
assertEqual(manifest.output.corporateNameAsOutlines, true, 'corporate-name outline output rule');
assertEqual(manifest.output.textElementsAllowed, false, 'text element rule');
assertEqual(manifest.output.runtimeFontDependency, false, 'runtime font dependency rule');
assertEqual(manifest.output.constructionManifestDistribution, 'repository-root-only', 'construction manifest distribution');

const opentypePackage = JSON.parse(await readFile(path.join(root, 'node_modules/opentype.js/package.json'), 'utf8'));
assertEqual(opentypePackage.version, '1.3.4', 'opentype.js serializer version');
const fontkitPackage = JSON.parse(await readFile(path.join(root, 'node_modules/fontkit/package.json'), 'utf8'));
assertEqual(fontkitPackage.version, '2.0.4', 'fontkit variable-font engine version');

const fontArrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
const font = opentype.parse(fontArrayBuffer);
const fontFamily = font.names.fontFamily?.en;
const fontFullName = font.names.fullName?.en;
const fontVersion = font.names.version?.en?.replace(/^Version\s+/i, '');
const weightClass = font.tables.os2?.usWeightClass;
const capHeight = font.tables.os2?.sCapHeight;

assertEqual(fontFamily, `${manifest.wordmark.family} ${manifest.wordmark.style}`, 'font family metadata');
assertEqual(fontFullName, `${manifest.wordmark.family} ${manifest.wordmark.style}`, 'font full-name metadata');
assertEqual(fontVersion, manifest.wordmark.fontVersion, 'font version metadata');
assertEqual(weightClass, manifest.wordmark.weight, 'font weight metadata');
if (!Number.isFinite(capHeight) || capHeight <= 0) throw new Error('Pinned font has no usable OS/2 cap height.');

assertEqual(manifest.corporateName.fontFormat, 'variable-ttf', 'corporate-name font format');
assertEqual(manifest.corporateName.variation.wght, manifest.corporateName.weight, 'corporate-name weight variation');
const corporateBaseFont = fontkit.create(corporateFontBuffer);
assertEqual(corporateBaseFont.familyName, `${manifest.corporateName.family} Thin`, 'corporate-name default family metadata');
assertEqual(corporateBaseFont.fullName, `${manifest.corporateName.family} Thin`, 'corporate-name default full-name metadata');
assertEqual(corporateBaseFont.postscriptName, 'NotoSansKR-Thin', 'corporate-name default PostScript metadata');
assertEqual(corporateBaseFont.version, manifest.corporateName.fontVersionMetadata, 'corporate-name font version metadata');
assertEqual(corporateBaseFont.unitsPerEm, 1000, 'corporate-name font units per em');
assertEqual(corporateBaseFont.variationAxes?.wght?.min, 100, 'corporate-name minimum weight');
assertEqual(corporateBaseFont.variationAxes?.wght?.default, 100, 'corporate-name default weight');
assertEqual(corporateBaseFont.variationAxes?.wght?.max, 900, 'corporate-name maximum weight');
assertEqual(
  corporateBaseFont.namedVariations?.[manifest.corporateName.style]?.wght,
  manifest.corporateName.weight,
  'corporate-name named variation weight',
);
const corporateFont = corporateBaseFont.getVariation(manifest.corporateName.variation);

const wordmarkText = manifest.wordmark.text;
const letters = [...wordmarkText];
const glyphRows = [];
const finalAdvance = font.forEachGlyph(
  wordmarkText,
  0,
  0,
  font.unitsPerEm,
  { kerning: true },
  (glyph, x, y, fontSize) => {
    const glyphPath = glyph.getPath(x, y, fontSize);
    glyphRows.push({
      letter: letters[glyphRows.length],
      glyphId: glyph.index,
      origin: x,
      d: glyphPath.toPathData(3),
    });
  },
);

assertEqual(glyphRows.length, letters.length, 'glyph count');
assertArrayEqual(glyphRows.map((row) => row.letter), letters, 'glyph sequence');
assertArrayEqual(glyphRows.map((row) => row.glyphId), [172, 134, 32, 134, 194, 88, 33, 180], 'glyph IDs');
assertArrayEqual(glyphRows.map((row) => row.origin), [0, 740, 1586, 2355, 3191, 3826, 4165, 4896], 'kerning-aware glyph origins');
assertEqual(finalAdvance, 5543, 'kerning-aware word advance');

const wordmarkPath = font.getPath(wordmarkText, 0, 0, font.unitsPerEm, { kerning: true });
const sourceBoundsRaw = wordmarkPath.getBoundingBox();
const sourceBounds = Object.freeze({
  x: sourceBoundsRaw.x1,
  y: sourceBoundsRaw.y1,
  width: sourceBoundsRaw.x2 - sourceBoundsRaw.x1,
  height: sourceBoundsRaw.y2 - sourceBoundsRaw.y1,
});
assertArrayEqual(
  [sourceBoundsRaw.x1, sourceBoundsRaw.y1, sourceBoundsRaw.x2, sourceBoundsRaw.y2],
  [70, -714, 5522, 14],
  'wordmark ink bounds',
);

const corporateText = manifest.corporateName.text.normalize('NFC');
const corporateLetters = [...corporateText];
const corporateRun = corporateFont.layout(corporateText);
const corporateGlyphs = corporateRun.glyphs;
const corporateTracking = corporateFont.unitsPerEm * manifest.corporateName.letterSpacingEm;
const corporateGlyphRows = [];
const corporateKerning = [];
let corporateAdvance = 0;

for (let index = 0; index < corporateGlyphs.length; index += 1) {
  const glyph = corporateGlyphs[index];
  const position = corporateRun.positions[index];
  const kerning = position.xAdvance - glyph.advanceWidth;
  corporateKerning.push(kerning);
  const origin = corporateAdvance + position.xOffset;
  const glyphPath = glyph.path.scale(1, -1).translate(origin, -position.yOffset);
  const glyphBounds = glyphPath.commands.length
    ? {
        x1: glyphPath.bbox.minX,
        y1: glyphPath.bbox.minY,
        x2: glyphPath.bbox.maxX,
        y2: glyphPath.bbox.maxY,
      }
    : undefined;
  corporateGlyphRows.push({
    letter: corporateLetters[index],
    glyphId: glyph.id,
    origin,
    d: serializeFontkitPath(glyphPath.toSVG()),
    bounds: glyphBounds,
  });
  corporateAdvance += position.xAdvance;
  if (index < corporateGlyphs.length - 1) corporateAdvance += corporateTracking;
}

assertEqual(corporateGlyphRows.length, corporateLetters.length, 'corporate-name glyph count');
assertArrayEqual(corporateGlyphRows.map((row) => row.letter), corporateLetters, 'corporate-name glyph sequence');
assertArrayEqual(corporateGlyphRows.map((row) => row.glyphId), [17736, 16169, 21208, 15608, 22586, 16932, 19276, 17344, 13480, 14656, 20285, 16112], 'corporate-name glyph IDs');
assertNumberArrayClose(corporateGlyphRows.map((row) => row.origin), [0, 1025, 2050, 3075, 4100, 4485, 5510, 6535, 7560, 8585, 9610, 10635], 'tracked corporate-name glyph origins');
assertArrayEqual(corporateKerning, Array(corporateGlyphs.length).fill(0), 'corporate-name kerning adjustments');
assertNumberClose(corporateAdvance, 11555, 'tracked corporate-name advance');

const corporateSourceBounds = boundsFromOpenTypeRows(corporateGlyphRows);
assertNumberArrayClose(
  [
    corporateSourceBounds.x,
    corporateSourceBounds.y,
    corporateSourceBounds.x + corporateSourceBounds.width,
    corporateSourceBounds.y + corporateSourceBounds.height,
  ],
  [39, -842, 11517, 94],
  'corporate-name ink bounds',
);

const colors = manifest.colors;
const layout = manifest.layout;
const markBounds = LOGO_GEOMETRY.markBounds;
const lockupGap = markBounds.width * layout.stacked.gapToMarkWidth;

const stackedScale = (markBounds.height * layout.stacked.nominalCapHeightToX) / capHeight;
const stackedBounds = Object.freeze({
  x: markBounds.x + (markBounds.width - sourceBounds.width * stackedScale) / 2,
  y: markBounds.y + markBounds.height + lockupGap,
  width: sourceBounds.width * stackedScale,
  height: sourceBounds.height * stackedScale,
});
const stackedTransform = matrix(
  stackedScale,
  stackedBounds.x - sourceBounds.x * stackedScale,
  stackedBounds.y - sourceBounds.y * stackedScale,
);

const inlineScaleAbsolute = (markBounds.height * layout.inline.visibleWordmarkHeightToX) / sourceBounds.height;
const inlineScale = inlineScaleAbsolute / stackedScale;
const inlineBounds = Object.freeze({
  x: markBounds.x + markBounds.width + markBounds.width * layout.inline.gapToMarkWidth,
  y: markBounds.y,
  width: sourceBounds.width * inlineScaleAbsolute,
  height: sourceBounds.height * inlineScaleAbsolute,
});
const inlineTransform = matrix(
  inlineScale,
  inlineBounds.x - stackedBounds.x * inlineScale,
  inlineBounds.y - stackedBounds.y * inlineScale,
);

const markViewBox = padBounds(markBounds, layout.tightPaddingSourceUnits);
const stackedViewBox = padBounds(unionBounds(markBounds, stackedBounds), layout.tightPaddingSourceUnits);
const inlineViewBox = padBounds(unionBounds(markBounds, inlineBounds), layout.tightPaddingSourceUnits);
const bannerClearSpace = markBounds.height * layout.banner.clearSpaceToX;
const bannerViewBox = padBounds(unionBounds(markBounds, inlineBounds), bannerClearSpace);

const generatedWordmarkPaths = glyphRows.map((row) => ({
  letter: row.letter,
  d: row.d,
  transform: stackedTransform,
}));

assertEqual(layout.corporate.visibleWidthToX, 1.9, 'corporate-name visible width');
assertEqual(layout.corporate.gapFromLockupToX, 0.21, 'corporate-name gap');
assertEqual(layout.corporate.horizontalAlignment, 'lockup-visible-center', 'corporate-name alignment');
assertEqual(layout.corporate.minimumRenderedSquarePx, 160, 'corporate-name minimum digital size');
assertEqual(layout.corporate.recommendedRenderedSquarePx, 192, 'corporate-name recommended digital size');
assertEqual(layout.corporate.minimumPrintedSquareMm, 32, 'corporate-name minimum print size');

const corporateLockupBounds = translateBounds(
  unionBounds(markBounds, stackedBounds),
  LOGO_GEOMETRY.corporateOffset.x,
  LOGO_GEOMETRY.corporateOffset.y,
);
const corporateTargetWidth = markBounds.height * layout.corporate.visibleWidthToX;
const corporateScale = corporateTargetWidth / corporateSourceBounds.width;
const corporateTargetBounds = Object.freeze({
  x: corporateLockupBounds.x + (corporateLockupBounds.width - corporateTargetWidth) / 2,
  y: corporateLockupBounds.y + corporateLockupBounds.height + markBounds.height * layout.corporate.gapFromLockupToX,
  width: corporateTargetWidth,
  height: corporateSourceBounds.height * corporateScale,
});
const corporateTransform = matrix(
  corporateScale,
  corporateTargetBounds.x - corporateSourceBounds.x * corporateScale,
  corporateTargetBounds.y - corporateSourceBounds.y * corporateScale,
  9,
);
const generatedCorporatePaths = corporateGlyphRows
  .filter((row) => row.d)
  .map((row) => ({
    letter: row.letter,
    d: row.d,
    transform: corporateTransform,
  }));

assertNumberArrayClose(
  [
    corporateTargetBounds.x,
    corporateTargetBounds.y,
    corporateTargetBounds.x + corporateTargetBounds.width,
    corporateTargetBounds.y + corporateTargetBounds.height,
  ],
  [103.223875, 238.559309459961, 209.933195, 247.261167233092],
  'positioned corporate-name bounds',
  0.0001,
);

const outputs = new Map();
outputs.set('components/brand/lk-logo-paths.js', renderRuntimeModule({
  generatedWordmarkPaths,
  inlineScale,
  inlineTransform,
  markViewBox,
  stackedViewBox,
  inlineViewBox,
  colors,
}));

outputs.set('assets/brand/lk-logo-navy.svg', renderSvg({
  title: 'LK ROBOTICS stacked logo',
  viewBox: stackedViewBox,
  body: renderStacked(colors.navy),
}));
outputs.set('assets/brand/lk-logo-white.svg', renderSvg({
  title: 'LK ROBOTICS stacked logo',
  viewBox: stackedViewBox,
  body: renderStacked(colors.white),
}));
outputs.set('assets/brand/lk-logo-inline-navy.svg', renderSvg({
  title: 'LK ROBOTICS inline logo',
  viewBox: inlineViewBox,
  body: renderInline(colors.navy),
}));
outputs.set('assets/brand/lk-logo-inline-white.svg', renderSvg({
  title: 'LK ROBOTICS inline logo',
  viewBox: inlineViewBox,
  body: renderInline(colors.white),
}));
outputs.set('assets/brand/lk-logo-banner-navy.svg', renderSvg({
  title: 'LK ROBOTICS navy banner logo',
  viewBox: bannerViewBox,
  body: [
    renderRect(bannerViewBox, colors.navy, 1),
    renderInline(colors.white),
  ].join('\n'),
}));
outputs.set('assets/brand/lk-logo-banner-light.svg', renderSvg({
  title: 'LK ROBOTICS light banner logo',
  viewBox: bannerViewBox,
  body: [
    renderRect(bannerViewBox, colors.white, 1),
    renderInline(colors.navy),
  ].join('\n'),
}));

outputs.set('assets/brand/lk-logo-official.svg', renderSvg({
  title: 'LK ROBOTICS logo',
  viewBox: LOGO_GEOMETRY.standardSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.standardSquare,
    background: colors.navy,
    foreground: colors.white,
  }),
}));
outputs.set('assets/brand/lk-logo-official-light.svg', renderSvg({
  title: 'LK ROBOTICS logo on light background',
  viewBox: LOGO_GEOMETRY.standardSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.standardSquare,
    background: colors.white,
    foreground: colors.navy,
  }),
}));
outputs.set('assets/brand/lk-logo-tile-navy.svg', renderSvg({
  title: 'LK ROBOTICS navy tile logo',
  viewBox: LOGO_GEOMETRY.standardSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.standardSquare,
    background: colors.navy,
    foreground: colors.white,
  }),
}));
outputs.set('assets/brand/lk-logo-tile-light.svg', renderSvg({
  title: 'LK ROBOTICS light tile logo',
  viewBox: LOGO_GEOMETRY.standardSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.standardSquare,
    background: colors.white,
    foreground: colors.navy,
  }),
}));
outputs.set('assets/brand/lk-logo-official-corporate.svg', renderSvg({
  title: 'LK ROBOTICS corporate logo',
  viewBox: LOGO_GEOMETRY.corporateSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.corporateSquare,
    background: colors.navy,
    foreground: colors.white,
    corporate: true,
  }),
}));
outputs.set('assets/brand/lk-logo-official-corporate-light.svg', renderSvg({
  title: 'LK ROBOTICS corporate logo on light background',
  viewBox: LOGO_GEOMETRY.corporateSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.corporateSquare,
    background: colors.white,
    foreground: colors.navy,
    corporate: true,
  }),
}));
outputs.set('assets/brand/lk-logo-master.svg', renderSvg({
  title: 'LK ROBOTICS official logo master',
  viewBox: { x: 77.0213, y: 114.3693, width: 379.148, height: 158.74 },
  body: [
    renderSquare({
      square: LOGO_GEOMETRY.corporateSquare,
      background: colors.navy,
      foreground: colors.white,
      corporate: true,
    }),
    renderSquare({
      square: LOGO_GEOMETRY.standardSquare,
      background: colors.navy,
      foreground: colors.white,
    }),
  ].join('\n'),
}));

for (const [relativePath, content] of outputs) validateProductionOutput(relativePath, content);

if (checkOnly) {
  const stale = [];
  for (const [relativePath, expected] of outputs) {
    let actual;
    try {
      actual = await readFile(path.join(root, relativePath), 'utf8');
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
    if (actual !== expected) stale.push(relativePath);
  }
  if (stale.length) {
    throw new Error(`Brand outputs are stale. Run npm run generate:brand.\n${stale.map((file) => `- ${file}`).join('\n')}`);
  }
  console.log(`Brand assets match ${manifest.wordmark.family} ${manifest.wordmark.style} ${manifest.wordmark.weight} v${manifest.wordmark.fontVersion} and ${manifest.corporateName.family} ${manifest.corporateName.style} ${manifest.corporateName.weight} v${manifest.corporateName.releaseVersion}.`);
} else {
  for (const [relativePath, content] of outputs) await writeFile(path.join(root, relativePath), content);
  console.log(`Generated ${outputs.size} brand outputs from ${manifest.wordmark.family} ${manifest.wordmark.style} ${manifest.wordmark.weight} v${manifest.wordmark.fontVersion} and ${manifest.corporateName.family} ${manifest.corporateName.style} ${manifest.corporateName.weight} v${manifest.corporateName.releaseVersion}.`);
}

function renderRuntimeModule({
  generatedWordmarkPaths: wordmarkPaths,
  inlineScale: wordmarkInlineScale,
  inlineTransform: wordmarkInlineTransform,
  markViewBox: markBox,
  stackedViewBox: stackedBox,
  inlineViewBox: inlineBox,
  colors: logoColors,
}) {
  const markRows = LK_MARK_PATHS.map((row) => [
    '  {',
    `    d: ${JSON.stringify(row.d)},`,
    `    transform: ${JSON.stringify(row.transform)},`,
    '  },',
  ].join('\n')).join('\n');
  const wordmarkRows = wordmarkPaths.map((row) => [
    '  {',
    `    letter: ${JSON.stringify(row.letter)},`,
    `    d: ${JSON.stringify(row.d)},`,
    `    transform: ${JSON.stringify(row.transform)},`,
    '  },',
  ].join('\n')).join('\n');

  return `/**
 * Generated by scripts/generate-brand-assets.mjs. Do not edit by hand.
 *
 * LK is custom vector geometry. ROBOTICS is outlined from the pinned static
 * Montserrat ExtraBold 800 v${manifest.wordmark.fontVersion} font with default kerning,
 * zero added letter spacing, uniform scaling, and no glyph edits.
 * Font SHA-256: ${manifest.wordmark.fontSha256}
 */
export const LK_PATHS = Object.freeze([
${markRows}
]);

export const ROBOTICS_PATHS = Object.freeze([
${wordmarkRows}
]);

// Inline construction: the wordmark's visible height equals the LK symbol's
// visible height, with a gap equal to 20% of the symbol's visible width.
export const ROBOTICS_INLINE_SCALE = ${formatNumber(wordmarkInlineScale)};
export const ROBOTICS_INLINE_TRANSFORM = ${JSON.stringify(wordmarkInlineTransform)};

export const LK_LOGO_VIEWBOX = Object.freeze({
  mark: ${JSON.stringify(formatViewBox(markBox))},
  stacked: ${JSON.stringify(formatViewBox(stackedBox))},
  inline: ${JSON.stringify(formatViewBox(inlineBox))},
});

export const LK_LOGO_COLORS = Object.freeze({
  navy: ${JSON.stringify(logoColors.navy)},
  accent: ${JSON.stringify(logoColors.accent)},
  white: ${JSON.stringify(logoColors.white)},
});
`;
}

function renderSvg({ title, viewBox, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${formatViewBox(viewBox)}" preserveAspectRatio="xMidYMid meet">
  <title>${title}</title>
${body}
</svg>
`;
}

function renderMark(fill, indent = 1) {
  return LK_MARK_PATHS.map((row) => renderPath(row, fill, indent)).join('\n');
}

function renderWordmark(fill, indent = 1) {
  return generatedWordmarkPaths.map((row) => renderPath(row, fill, indent)).join('\n');
}

function renderStacked(fill, indent = 1) {
  return [renderMark(fill, indent), renderWordmark(fill, indent)].join('\n');
}

function renderInline(fill, indent = 1) {
  const spaces = '  '.repeat(indent);
  return [
    renderMark(fill, indent),
    `${spaces}<g transform="${inlineTransform}">`,
    renderWordmark(fill, indent + 1),
    `${spaces}</g>`,
  ].join('\n');
}

function renderSquare({ square, background, foreground, corporate = false }) {
  const rows = [renderRect(square, background, 1)];
  if (corporate) {
    rows.push(
      `  <g transform="translate(${formatNumber(LOGO_GEOMETRY.corporateOffset.x)} ${formatNumber(LOGO_GEOMETRY.corporateOffset.y)})">`,
      renderStacked(foreground, 2),
      '  </g>',
      generatedCorporatePaths.map((row) => renderPath(row, colors.accent, 1)).join('\n'),
    );
  } else {
    rows.push(renderStacked(foreground, 1));
  }
  return rows.join('\n');
}

function renderPath(row, fill, indent) {
  const spaces = '  '.repeat(indent);
  return `${spaces}<path d="${row.d}" transform="${row.transform}" fill="${fill}" />`;
}

function renderRect(box, fill, indent) {
  const spaces = '  '.repeat(indent);
  const normalized = normalizeBox(box);
  return `${spaces}<rect x="${formatNumber(normalized.x)}" y="${formatNumber(normalized.y)}" width="${formatNumber(normalized.width)}" height="${formatNumber(normalized.height)}" fill="${fill}" />`;
}

function normalizeBox(box) {
  if (Number.isFinite(box.width) && Number.isFinite(box.height)) return box;
  if (Number.isFinite(box.size)) return { x: box.x, y: box.y, width: box.size, height: box.size };
  throw new Error(`Invalid box: ${JSON.stringify(box)}`);
}

function padBounds(box, padding) {
  return Object.freeze({
    x: box.x - padding,
    y: box.y - padding,
    width: box.width + padding * 2,
    height: box.height + padding * 2,
  });
}

function unionBounds(...boxes) {
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return Object.freeze({ x: left, y: top, width: right - left, height: bottom - top });
}

function translateBounds(box, x, y) {
  return Object.freeze({
    x: box.x + x,
    y: box.y + y,
    width: box.width,
    height: box.height,
  });
}

function boundsFromOpenTypeRows(rows) {
  const bounds = rows.map((row) => row.bounds).filter(Boolean);
  if (!bounds.length) throw new Error('Corporate-name geometry has no visible bounds.');
  const left = Math.min(...bounds.map((box) => box.x1));
  const top = Math.min(...bounds.map((box) => box.y1));
  const right = Math.max(...bounds.map((box) => box.x2));
  const bottom = Math.max(...bounds.map((box) => box.y2));
  return Object.freeze({ x: left, y: top, width: right - left, height: bottom - top });
}

function matrix(scale, translateX, translateY, precision = 6) {
  return `matrix(${formatNumber(scale, precision)} 0 0 ${formatNumber(scale, precision)} ${formatNumber(translateX, precision)} ${formatNumber(translateY, precision)})`;
}

function formatViewBox(box) {
  const normalized = normalizeBox(box);
  return [normalized.x, normalized.y, normalized.width, normalized.height].map(formatNumber).join(' ');
}

function formatNumber(value, precision = 6) {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function serializeFontkitPath(value, precision = 3) {
  return value.replace(
    /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi,
    (token) => formatNumber(Number(token), precision),
  );
}

function validateProductionOutput(relativePath, content) {
  if (relativePath.endsWith('.svg')) {
    if (/<text\b/i.test(content)) throw new Error(`${relativePath} contains a text element.`);
    if (/font-(?:family|weight|style)|@font-face/i.test(content)) throw new Error(`${relativePath} contains a runtime font dependency.`);
    const wordmarkPathCount = generatedWordmarkPaths.filter((row) => content.includes(`d="${row.d}"`)).length;
    if (wordmarkPathCount !== generatedWordmarkPaths.length) {
      throw new Error(`${relativePath} does not contain all ${generatedWordmarkPaths.length} outlined wordmark glyphs.`);
    }
    const expectsCorporateName = [
      'assets/brand/lk-logo-master.svg',
      'assets/brand/lk-logo-official-corporate.svg',
      'assets/brand/lk-logo-official-corporate-light.svg',
    ].includes(relativePath);
    const corporatePathCount = generatedCorporatePaths.filter((row) => content.includes(`d="${row.d}"`)).length;
    if (expectsCorporateName && corporatePathCount !== generatedCorporatePaths.length) {
      throw new Error(`${relativePath} does not contain all ${generatedCorporatePaths.length} outlined corporate-name glyphs.`);
    }
    if (!expectsCorporateName && corporatePathCount !== 0) {
      throw new Error(`${relativePath} unexpectedly contains corporate-name glyphs.`);
    }
  }
}

function fileSha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function geometrySha256(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function validateMarkBounds(rows, expectedBounds) {
  const points = rows.flatMap((row) => {
    const matrixValues = parseSvgMatrix(row.transform);
    return parseLinearPathVertices(row.d).map((point) => transformPoint(point, matrixValues));
  });
  if (!points.length) throw new Error('LK symbol geometry has no vertices.');

  const left = Math.min(...points.map((point) => point.x));
  const top = Math.min(...points.map((point) => point.y));
  const right = Math.max(...points.map((point) => point.x));
  const bottom = Math.max(...points.map((point) => point.y));
  const actualBounds = {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };

  for (const key of ['x', 'y', 'width', 'height']) {
    if (Math.abs(actualBounds[key] - expectedBounds[key]) > 0.0001) {
      throw new Error(
        `LK symbol ${key} bound: expected ${expectedBounds[key]}, received ${actualBounds[key]}.`,
      );
    }
  }
}

function parseSvgMatrix(value) {
  const match = /^matrix\(([^)]+)\)$/.exec(value.trim());
  if (!match) throw new Error(`Unsupported LK symbol transform: ${value}`);
  const values = match[1].match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g)?.map(Number) ?? [];
  if (values.length !== 6 || values.some((number) => !Number.isFinite(number))) {
    throw new Error(`Invalid LK symbol transform: ${value}`);
  }
  return values;
}

function parseLinearPathVertices(value) {
  const tokens = value.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) ?? [];
  const points = [];
  let cursor = 0;
  let command;
  let current = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };

  const isCommand = (token) => /^[a-zA-Z]$/.test(token);
  const readNumber = () => {
    const token = tokens[cursor];
    if (token === undefined || isCommand(token)) throw new Error(`Invalid LK symbol path: ${value}`);
    cursor += 1;
    return Number(token);
  };

  while (cursor < tokens.length) {
    if (isCommand(tokens[cursor])) {
      command = tokens[cursor];
      cursor += 1;
    }
    if (!command) throw new Error(`Invalid LK symbol path: ${value}`);

    const lower = command.toLowerCase();
    const relative = command === lower;
    if (lower === 'z') {
      current = { ...start };
      command = undefined;
      continue;
    }
    if (!['m', 'l', 'h', 'v'].includes(lower)) {
      throw new Error(`Unsupported LK symbol path command ${command}: ${value}`);
    }

    let firstMove = lower === 'm';
    while (cursor < tokens.length && !isCommand(tokens[cursor])) {
      if (lower === 'h') {
        const x = readNumber();
        current = { x: relative ? current.x + x : x, y: current.y };
      } else if (lower === 'v') {
        const y = readNumber();
        current = { x: current.x, y: relative ? current.y + y : y };
      } else {
        const x = readNumber();
        const y = readNumber();
        current = {
          x: relative ? current.x + x : x,
          y: relative ? current.y + y : y,
        };
      }
      if (firstMove) {
        start = { ...current };
        firstMove = false;
      }
      points.push({ ...current });
    }
  }

  return points;
}

function transformPoint(point, [a, b, c, d, e, f]) {
  return {
    x: a * point.x + c * point.y + e,
    y: b * point.x + d * point.y + f,
  };
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

function assertArrayEqual(actual, expected, label) {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function assertNumberClose(actual, expected, label, tolerance = 0.000001) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected}, received ${actual}.`);
  }
}

function assertNumberArrayClose(actual, expected, label, tolerance = 0.000001) {
  if (actual.length !== expected.length) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
  actual.forEach((value, index) => assertNumberClose(value, expected[index], `${label}[${index}]`, tolerance));
}
