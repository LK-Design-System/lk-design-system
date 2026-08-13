import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as fontkit from 'fontkit';
import opentype from 'opentype.js';
import {
  LK_MARK_GEOMETRY_VERSION,
  LK_MARK_PATHS,
  LOGO_GEOMETRY,
} from './brand/lk-logo-source.mjs';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const manifestPath = path.join(root, 'assets/brand/lk-logo-construction.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const portalWordmark = manifest.productWordmarks.portal;
const productLockupWordmark = manifest.productLockupWordmark;
const fontBuffer = await readFile(path.join(root, manifest.wordmark.fontFile));
const portalFontBuffer = await readFile(path.join(root, portalWordmark.fontFile));
const corporateFontBuffer = await readFile(path.join(root, manifest.corporateName.fontFile));
const licenseBuffer = await readFile(path.join(root, manifest.wordmark.licenseFile));
const portalLicenseBuffer = await readFile(path.join(root, portalWordmark.licenseFile));
const corporateLicenseBuffer = await readFile(path.join(root, manifest.corporateName.licenseFile));

assertEqual(manifest.schemaVersion, 1, 'manifest schema version');
assertEqual(manifest.constructionVersion, 5, 'logo construction version');
assertEqual(manifest.symbol.geometryVersion, LK_MARK_GEOMETRY_VERSION, 'LK symbol geometry version');
assertEqual(
  geometrySha256({ paths: LK_MARK_PATHS, bounds: LOGO_GEOMETRY.markBounds }),
  manifest.symbol.geometrySha256,
  'LK symbol geometry SHA-256',
);
validateMarkBounds(LK_MARK_PATHS, LOGO_GEOMETRY.markBounds);
const markConstructionMetrics = deriveMarkConstructionMetrics(LK_MARK_PATHS, LOGO_GEOMETRY.markBounds);
assertEqual(fileSha256(fontBuffer), manifest.wordmark.fontSha256, 'wordmark font SHA-256');
assertEqual(fileSha256(portalFontBuffer), portalWordmark.fontSha256, 'portal wordmark font SHA-256');
assertEqual(fileSha256(licenseBuffer), manifest.wordmark.licenseSha256, 'wordmark license SHA-256');
assertEqual(fileSha256(portalLicenseBuffer), portalWordmark.licenseSha256, 'portal wordmark license SHA-256');
assertEqual(fileSha256(corporateFontBuffer), manifest.corporateName.fontSha256, 'corporate-name font SHA-256');
assertEqual(fileSha256(corporateLicenseBuffer), manifest.corporateName.licenseSha256, 'corporate-name license SHA-256');
assertEqual(manifest.wordmark.case, 'uppercase', 'wordmark case');
assertEqual(manifest.wordmark.text, manifest.wordmark.text.toUpperCase(), 'uppercase wordmark text');
assertEqual(manifest.wordmark.kerning, 'font-default', 'kerning rule');
assertEqual(manifest.wordmark.letterSpacing, 0, 'letter spacing');
assertEqual(manifest.wordmark.horizontalScale, 1, 'horizontal scale');
assertEqual(manifest.wordmark.verticalScale, 1, 'vertical scale');
assertEqual(manifest.wordmark.manualGlyphEdits, false, 'manual glyph edits');
/* 승인 Portal 워드마크. 회사 ROBOTICS의 800 조형과 분리하고, 제품 로크업
   registry와 같은 600 제작 규칙에 고정한다. */
assertEqual(portalWordmark.text, 'PORTAL', 'portal wordmark text');
assertEqual(portalWordmark.case, 'uppercase', 'portal wordmark case');
assertEqual(portalWordmark.text, portalWordmark.text.toUpperCase(), 'uppercase portal wordmark text');
assertEqual(portalWordmark.family, productLockupWordmark.family, 'portal wordmark font family');
assertEqual(portalWordmark.style, productLockupWordmark.style, 'portal wordmark font style');
assertEqual(portalWordmark.weight, productLockupWordmark.weight, 'portal wordmark font weight');
assertEqual(portalWordmark.fontVersion, productLockupWordmark.fontVersion, 'portal wordmark font version');
assertEqual(portalWordmark.fontFile, productLockupWordmark.fontFile, 'portal wordmark font file');
assertEqual(portalWordmark.fontSha256, productLockupWordmark.fontSha256, 'portal wordmark font SHA-256');
assertEqual(portalWordmark.fontSource, productLockupWordmark.fontSource, 'portal wordmark font source');
assertEqual(portalWordmark.license, productLockupWordmark.license, 'portal wordmark license');
assertEqual(portalWordmark.licenseFile, productLockupWordmark.licenseFile, 'portal wordmark license file');
assertEqual(portalWordmark.licenseSha256, productLockupWordmark.licenseSha256, 'portal wordmark license SHA-256');
assertEqual(portalWordmark.kerning, 'font-default', 'portal wordmark kerning rule');
assertEqual(portalWordmark.letterSpacing, 0, 'portal wordmark letter spacing');
assertEqual(portalWordmark.horizontalScale, 1, 'portal wordmark horizontal scale');
assertEqual(portalWordmark.verticalScale, 1, 'portal wordmark vertical scale');
assertEqual(portalWordmark.manualGlyphEdits, false, 'portal wordmark manual glyph edits');
assertEqual(manifest.output.productWordmarksAsOutlines, true, 'product wordmark outline output rule');
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
const portalFontArrayBuffer = portalFontBuffer.buffer.slice(
  portalFontBuffer.byteOffset,
  portalFontBuffer.byteOffset + portalFontBuffer.byteLength,
);
const portalFont = opentype.parse(portalFontArrayBuffer);
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

assertEqual(portalFont.names.fontFamily?.en, `${portalWordmark.family} ${portalWordmark.style}`, 'portal font family metadata');
assertEqual(portalFont.names.fullName?.en, `${portalWordmark.family} ${portalWordmark.style}`, 'portal font full-name metadata');
assertEqual(portalFont.names.version?.en?.replace(/^Version\s+/i, ''), portalWordmark.fontVersion, 'portal font version metadata');
assertEqual(portalFont.tables.os2?.usWeightClass, portalWordmark.weight, 'portal font weight metadata');

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

const portalText = portalWordmark.text;
const portalLetters = [...portalText];
const portalGlyphRows = [];
const portalFinalAdvance = portalFont.forEachGlyph(
  portalText,
  0,
  0,
  portalFont.unitsPerEm,
  { kerning: true },
  (glyph, x, y, fontSize) => {
    portalGlyphRows.push({
      letter: portalLetters[portalGlyphRows.length],
      glyphId: glyph.index,
      origin: x,
      d: glyph.getPath(x, y, fontSize).toPathData(3),
    });
  },
);

assertEqual(portalGlyphRows.length, portalLetters.length, 'portal glyph count');
assertArrayEqual(portalGlyphRows.map((row) => row.letter), portalLetters, 'portal glyph sequence');
assertArrayEqual(portalGlyphRows.map((row) => row.glyphId), [169, 134, 172, 194, 4, 110], 'portal glyph IDs');
assertArrayEqual(portalGlyphRows.map((row) => row.origin), [0, 726, 1568, 2289, 2856, 3605], 'portal kerning-aware glyph origins');
assertEqual(portalFinalAdvance, 4204, 'portal kerning-aware word advance');

const portalPath = portalFont.getPath(portalText, 0, 0, portalFont.unitsPerEm, { kerning: true });
const portalSourceBoundsRaw = portalPath.getBoundingBox();
const portalSourceBounds = Object.freeze({
  x: portalSourceBoundsRaw.x1,
  y: portalSourceBoundsRaw.y1,
  width: portalSourceBoundsRaw.x2 - portalSourceBoundsRaw.x1,
  height: portalSourceBoundsRaw.y2 - portalSourceBoundsRaw.y1,
});
assertArrayEqual(
  [portalSourceBoundsRaw.x1, portalSourceBoundsRaw.y1, portalSourceBoundsRaw.x2, portalSourceBoundsRaw.y2],
  [94, -710, 4195, 10],
  'portal wordmark ink bounds',
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

assertEqual(layout.xDefinition, 'visible height of the custom LK symbol', 'X measurement rule');
assertEqual(layout.safeArea.measurement, 'visible-artwork-bounds', 'safe-area measurement');
assertEqual(layout.safeArea.application, 'external-around-visible-bounds', 'safe-area application');
assertEqual(layout.safeArea.minimumClearSpaceToX, 0.5, 'minimum clear space');
assertEqual(layout.safeArea.coBrandClearSpaceToX, 1, 'co-brand clear space');
assertArrayEqual(layout.safeArea.appliesTo, ['mark', 'stacked', 'inline'], 'safe-area variants');
assertEqual(layout.banner.clearSpaceToX, layout.safeArea.minimumClearSpaceToX, 'banner embedded clear space');
assertEqual(layout.mark.minimumVisibleArtworkHeightPx, 16, 'mark minimum visible-artwork height');
assertEqual(layout.mark.minimumRenderedHeightPx, 20, 'mark minimum rendered height');
assertEqual(layout.stacked.minimumRenderedHeightPx, 64, 'stacked minimum digital height');
assertEqual(layout.inline.minimumRenderedHeightPx, 20, 'inline minimum digital height');
assertEqual(layout.banner.minimumRenderedHeightPx, 28, 'banner minimum digital height');
assertEqual(layout.officialSquare.minimumRenderedSquarePx, 64, 'official-square minimum digital size');
assertEqual(layout.officialSquare.recommendedRenderedSquarePx, 96, 'official-square recommended digital size');

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

/* 제품형 로크업. `inline`과 같은 구성(워드마크 보이는 높이 = 1X, 보이는 bounds
   기준 세로 정렬)이되 간격만 0.35X다. `inline`이 stacked 변환에 이어 붙는 것과
   달리 PORTAL은 자체 글리프 세트라 원본에서 바로 절대 스케일로 배치한다. */
assertEqual(layout.portal.visibleWordmarkHeightToX, 1, 'portal visible wordmark height');
assertEqual(layout.portal.gapToMarkWidth, 0.35, 'portal wordmark gap');
assertEqual(layout.portal.verticalAlignment, 'visible-bounds', 'portal wordmark alignment');
assertEqual(layout.portal.minimumRenderedHeightPx, 20, 'portal minimum digital height');
assertEqual(layout.portal.visibleWordmarkHeightToX, layout.productLockup.visibleWordmarkHeightToX, 'portal/product lockup visible height parity');
assertEqual(layout.portal.gapToMarkWidth, layout.productLockup.gapToMarkWidth, 'portal/product lockup gap parity');
assertEqual(layout.portal.verticalAlignment, layout.productLockup.verticalAlignment, 'portal/product lockup alignment parity');
assertEqual(layout.portal.minimumRenderedHeightPx, layout.productLockup.minimumRenderedHeightPx, 'portal/product lockup minimum height parity');
const portalScale = (markBounds.height * layout.portal.visibleWordmarkHeightToX) / portalSourceBounds.height;
const portalBounds = Object.freeze({
  x: markBounds.x + markBounds.width + markBounds.width * layout.portal.gapToMarkWidth,
  y: markBounds.y,
  width: portalSourceBounds.width * portalScale,
  height: portalSourceBounds.height * portalScale,
});
const portalTransform = matrix(
  portalScale,
  portalBounds.x - portalSourceBounds.x * portalScale,
  portalBounds.y - portalSourceBounds.y * portalScale,
);

const markViewBox = padBounds(markBounds, layout.tightPaddingSourceUnits);
const stackedViewBox = padBounds(unionBounds(markBounds, stackedBounds), layout.tightPaddingSourceUnits);
const inlineViewBox = padBounds(unionBounds(markBounds, inlineBounds), layout.tightPaddingSourceUnits);
const portalViewBox = padBounds(unionBounds(markBounds, portalBounds), layout.tightPaddingSourceUnits);
const bannerClearSpace = markBounds.height * layout.banner.clearSpaceToX;
const bannerViewBox = padBounds(unionBounds(markBounds, inlineBounds), bannerClearSpace);
const minimumRequiredSlotWidthPx = Object.freeze({
  mark: minimumSlotWidth(layout.mark.minimumRenderedHeightPx, markViewBox),
  stacked: minimumSlotWidth(layout.stacked.minimumRenderedHeightPx, stackedViewBox),
  inline: minimumSlotWidth(layout.inline.minimumRenderedHeightPx, inlineViewBox),
  portal: minimumSlotWidth(layout.portal.minimumRenderedHeightPx, portalViewBox),
  banner: minimumSlotWidth(layout.banner.minimumRenderedHeightPx, bannerViewBox),
});
assertNumberClose(minimumRequiredSlotWidthPx.mark, 21.431318, 'mark minimum required slot width');
assertNumberClose(minimumRequiredSlotWidthPx.stacked, 82.61299, 'stacked minimum required slot width');
assertNumberClose(minimumRequiredSlotWidthPx.inline, 156.324048, 'inline minimum required slot width');
assertNumberClose(minimumRequiredSlotWidthPx.portal, 127.772713, 'portal minimum required slot width');
assertNumberClose(minimumRequiredSlotWidthPx.banner, 137.019722, 'banner minimum required slot width');
const visibleMarkHeightAtMinimumRenderedHeight =
  layout.mark.minimumRenderedHeightPx * markBounds.height / markViewBox.height;
if (visibleMarkHeightAtMinimumRenderedHeight < layout.mark.minimumVisibleArtworkHeightPx) {
  throw new Error(
    `Mark rendered-height minimum exposes only ${formatNumber(visibleMarkHeightAtMinimumRenderedHeight)}px of visible artwork; `
      + `${layout.mark.minimumVisibleArtworkHeightPx}px is required.`,
  );
}
const faviconViewBox = Object.freeze({
  x: 0,
  y: 0,
  width: layout.favicon.referenceCanvasSizePx,
  height: layout.favicon.referenceCanvasSizePx,
});
const faviconMarkCenter = layout.favicon.markCenterSourceUnits;
const faviconTransform = [
  `translate(${formatNumber(layout.favicon.referenceCanvasSizePx / 2)} ${formatNumber(layout.favicon.referenceCanvasSizePx / 2)})`,
  `scale(${formatNumber(layout.favicon.markScale, 8)})`,
  `translate(${-faviconMarkCenter.x} ${-faviconMarkCenter.y})`,
].join(' ');
const faviconMarkBounds = Object.freeze({
  x: layout.favicon.referenceCanvasSizePx / 2
    + (markBounds.x - faviconMarkCenter.x) * layout.favicon.markScale,
  y: layout.favicon.referenceCanvasSizePx / 2
    + (markBounds.y - faviconMarkCenter.y) * layout.favicon.markScale,
  width: markBounds.width * layout.favicon.markScale,
  height: markBounds.height * layout.favicon.markScale,
});

assertEqual(layout.favicon.referenceCanvasSizePx, 512, 'favicon reference canvas size');
assertEqual(layout.favicon.minimumRenderedSquarePx, 16, 'favicon minimum rendered size');
assertEqual(layout.favicon.cornerRadiusPx, 112, 'favicon corner radius');
assertEqual(layout.favicon.markScale, 5.30600371, 'favicon mark scale');
assertNumberClose(
  faviconMarkCenter.x,
  markBounds.x + markBounds.width / 2,
  'favicon horizontal mark center',
  0.00001,
);
assertNumberClose(
  faviconMarkCenter.y,
  markBounds.y + markBounds.height / 2,
  'favicon vertical mark center',
  0.00001,
);
assertEqual(
  formatViewBox({ x: 1.23456789, y: 2.34567891, width: 3.45678912, height: 4.56789123 }),
  '1.234568 2.345679 3.456789 4.567891',
  'viewBox fixed-precision serialization',
);

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
const stackedArtworkBounds = unionBounds(markBounds, stackedBounds);
const inlineArtworkBounds = unionBounds(markBounds, inlineBounds);
const portalArtworkBounds = unionBounds(markBounds, portalBounds);
const generatedPortalPaths = portalGlyphRows.map((row) => ({ letter: row.letter, d: row.d }));
const corporateArtworkBounds = unionBounds(corporateLockupBounds, corporateTargetBounds);
const masterArtworkBounds = unionBounds(stackedArtworkBounds, corporateArtworkBounds);
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
  minimumRequiredSlotWidthPx,
  colors,
}));
outputs.set('components/brand/lk-portal-lockup-paths.js', renderPortalRuntimeModule({
  generatedPortalPaths,
  portalTransform,
  portalViewBox,
}));
outputs.set('assets/brand/lk-logo-portal-navy.svg', renderSvg({
  title: 'LK Portal logo',
  viewBox: portalViewBox,
  body: renderPortal(colors.navy),
}));
outputs.set('assets/brand/lk-logo-portal-white.svg', renderSvg({
  title: 'LK Portal logo',
  viewBox: portalViewBox,
  body: renderPortal(colors.white),
}));

outputs.set('assets/brand/lk-mark-navy.svg', renderSvg({
  title: 'LK ROBOTICS mark',
  viewBox: markViewBox,
  body: renderMark(colors.navy),
}));
outputs.set('assets/brand/lk-mark-white.svg', renderSvg({
  title: 'LK ROBOTICS mark',
  viewBox: markViewBox,
  body: renderMark(colors.white),
}));
outputs.set('assets/brand/lk-favicon.svg', renderFavicon({
  viewBox: faviconViewBox,
  cornerRadius: layout.favicon.cornerRadiusPx,
  background: colors.navy,
  foreground: colors.white,
  markTransform: faviconTransform,
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
  title: 'LK ROBOTICS corporate logo — 주식회사 엘케이로보틱스',
  viewBox: LOGO_GEOMETRY.corporateSquare,
  body: renderSquare({
    square: LOGO_GEOMETRY.corporateSquare,
    background: colors.navy,
    foreground: colors.white,
    corporate: true,
  }),
}));
outputs.set('assets/brand/lk-logo-official-corporate-light.svg', renderSvg({
  title: 'LK ROBOTICS corporate logo on light background — 주식회사 엘케이로보틱스',
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

/* `portalInstances`가 기본 0인 이유: PORTAL은 회사 워드마크·법인명과 겹치지
   않는 별도 글리프 세트라, 기존 출력 전부가 "PORTAL이 0개"임을 명시적으로
   주장해야 제품 워드마크가 회사 자산으로 새는 것을 막는다. */
const outputContracts = new Map([
  ['components/brand/lk-logo-paths.js', { kind: 'runtime', markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['components/brand/lk-portal-lockup-paths.js', { kind: 'runtime-portal', markInstances: 0, wordmarkInstances: 0, corporateInstances: 0, portalInstances: 1 }],
  ['assets/brand/lk-logo-portal-navy.svg', { kind: 'svg', viewBox: portalViewBox, pathBounds: portalArtworkBounds, markInstances: 1, wordmarkInstances: 0, corporateInstances: 0, portalInstances: 1 }],
  ['assets/brand/lk-logo-portal-white.svg', { kind: 'svg', viewBox: portalViewBox, pathBounds: portalArtworkBounds, markInstances: 1, wordmarkInstances: 0, corporateInstances: 0, portalInstances: 1 }],
  ['assets/brand/lk-mark-navy.svg', { kind: 'svg', viewBox: markViewBox, pathBounds: markBounds, markInstances: 1, wordmarkInstances: 0, corporateInstances: 0 }],
  ['assets/brand/lk-mark-white.svg', { kind: 'svg', viewBox: markViewBox, pathBounds: markBounds, markInstances: 1, wordmarkInstances: 0, corporateInstances: 0 }],
  ['assets/brand/lk-favicon.svg', { kind: 'svg', viewBox: faviconViewBox, pathBounds: faviconMarkBounds, markInstances: 1, wordmarkInstances: 0, corporateInstances: 0 }],
  ['assets/brand/lk-logo-navy.svg', { kind: 'svg', viewBox: stackedViewBox, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-white.svg', { kind: 'svg', viewBox: stackedViewBox, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-inline-navy.svg', { kind: 'svg', viewBox: inlineViewBox, pathBounds: inlineArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-inline-white.svg', { kind: 'svg', viewBox: inlineViewBox, pathBounds: inlineArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-banner-navy.svg', { kind: 'svg', viewBox: bannerViewBox, pathBounds: inlineArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-banner-light.svg', { kind: 'svg', viewBox: bannerViewBox, pathBounds: inlineArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-official.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.standardSquare, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-official-light.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.standardSquare, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-tile-navy.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.standardSquare, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-tile-light.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.standardSquare, pathBounds: stackedArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 0 }],
  ['assets/brand/lk-logo-official-corporate.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.corporateSquare, pathBounds: corporateArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 1 }],
  ['assets/brand/lk-logo-official-corporate-light.svg', { kind: 'svg', viewBox: LOGO_GEOMETRY.corporateSquare, pathBounds: corporateArtworkBounds, markInstances: 1, wordmarkInstances: 1, corporateInstances: 1 }],
  ['assets/brand/lk-logo-master.svg', { kind: 'svg', viewBox: { x: 77.0213, y: 114.3693, width: 379.148, height: 158.74 }, pathBounds: masterArtworkBounds, markInstances: 2, wordmarkInstances: 2, corporateInstances: 1 }],
]);

assertArrayEqual([...outputs.keys()], [...outputContracts.keys()], 'generated brand output inventory');
const repositoryBrandSvgPaths = (await readdir(path.join(root, 'assets/brand')))
  .filter((name) => name.endsWith('.svg'))
  .map((name) => `assets/brand/${name}`)
  .sort();
const generatedBrandSvgPaths = [...outputContracts.entries()]
  .filter(([, contract]) => contract.kind === 'svg')
  .map(([relativePath]) => relativePath)
  .sort();
assertArrayEqual(repositoryBrandSvgPaths, generatedBrandSvgPaths, 'repository brand SVG inventory');
for (const [relativePath, content] of outputs) {
  validateProductionOutput(relativePath, content, outputContracts.get(relativePath));
}

if (checkOnly) {
  const [lockupPrompt, brandStandard, governanceText] = await Promise.all([
    readFile(path.join(root, 'components/brand/Lockup.prompt.md'), 'utf8'),
    readFile(path.join(root, 'docs/brand/LK_LOGO_STANDARD.md'), 'utf8'),
    readFile(path.join(root, 'docs/brand/lk-logo-governance.json'), 'utf8'),
  ]);
  validateMinimumSlotWidthDocumentation(lockupPrompt, minimumRequiredSlotWidthPx);
  validateBrandPolicyDocumentation(brandStandard, JSON.parse(governanceText), minimumRequiredSlotWidthPx);
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
  console.log(`Brand assets match ${manifest.wordmark.family} ${manifest.wordmark.style} ${manifest.wordmark.weight} v${manifest.wordmark.fontVersion}, Portal ${portalWordmark.style} ${portalWordmark.weight}, and ${manifest.corporateName.family} ${manifest.corporateName.style} ${manifest.corporateName.weight} v${manifest.corporateName.releaseVersion}.`);
} else {
  for (const [relativePath, content] of outputs) await writeFile(path.join(root, relativePath), content);
  console.log(`Generated ${outputs.size} brand outputs from ${manifest.wordmark.family} ${manifest.wordmark.style} ${manifest.wordmark.weight} v${manifest.wordmark.fontVersion}, Portal ${portalWordmark.style} ${portalWordmark.weight}, and ${manifest.corporateName.family} ${manifest.corporateName.style} ${manifest.corporateName.weight} v${manifest.corporateName.releaseVersion}.`);
}

function renderPortalRuntimeModule({
  generatedPortalPaths: portalPaths,
  portalTransform: productPortalTransform,
  portalViewBox: portalBox,
}) {
  const portalRows = portalPaths.map((row) => [
    '  {',
    `    letter: ${JSON.stringify(row.letter)},`,
    `    d: ${JSON.stringify(row.d)},`,
    '  },',
  ].join('\n')).join('\n');

  return `/**
 * Generated by scripts/generate-brand-assets.mjs. Do not edit by hand.
 *
 * PORTAL is outlined from the pinned static ${portalWordmark.family} ${portalWordmark.style} ${portalWordmark.weight}
 * v${portalWordmark.fontVersion} font with default kerning, zero added letter spacing,
 * uniform scaling, and no glyph edits. No runtime font is required.
 * Font SHA-256: ${portalWordmark.fontSha256}
 */
export const PORTAL_PATHS = Object.freeze([
${portalRows}
]);

// PORTAL's visible height equals the LK symbol's visible height, with a gap
// equal to ${layout.portal.gapToMarkWidth * 100}% of the symbol's visible width.
export const PORTAL_INLINE_TRANSFORM = ${JSON.stringify(productPortalTransform)};
export const PORTAL_LOCKUP_VIEWBOX = ${JSON.stringify(formatViewBox(portalBox))};
export const PORTAL_MINIMUM_RENDERED_HEIGHT_PX = ${layout.portal.minimumRenderedHeightPx};
`;
}

function renderRuntimeModule({
  generatedWordmarkPaths: wordmarkPaths,
  inlineScale: wordmarkInlineScale,
  inlineTransform: wordmarkInlineTransform,
  markViewBox: markBox,
  stackedViewBox: stackedBox,
  inlineViewBox: inlineBox,
  minimumRequiredSlotWidthPx: minimumSlotWidth,
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

export const LK_MARK_CONSTRUCTION = Object.freeze({
  coordinateSystem: Object.freeze({
    origin: ${JSON.stringify(markConstructionMetrics.coordinateSystem.origin)},
    xAxis: ${JSON.stringify(markConstructionMetrics.coordinateSystem.xAxis)},
    yAxis: ${JSON.stringify(markConstructionMetrics.coordinateSystem.yAxis)},
    unit: ${JSON.stringify(markConstructionMetrics.coordinateSystem.unit)},
    precisionToX: ${formatNumber(markConstructionMetrics.coordinateSystem.precisionToX)},
  }),
  contours: Object.freeze([
${markConstructionMetrics.contours.map((contour) => `    Object.freeze({
      id: ${JSON.stringify(contour.id)},
      closed: true,
      winding: ${JSON.stringify(contour.winding)},
      normalizedPath: ${JSON.stringify(contour.normalizedPath)},
      vertices: Object.freeze([
${contour.vertices.map((vertex) => `        Object.freeze({ id: ${JSON.stringify(vertex.id)}, xToX: ${formatNumber(vertex.xToX)}, yToX: ${formatNumber(vertex.yToX)} }),`).join('\n')}
      ]),
    }),`).join('\n')}
  ]),
  stemWidthToX: ${formatNumber(markConstructionMetrics.stemWidthToX)},
  footReachToX: ${formatNumber(markConstructionMetrics.footReachToX)},
  footThicknessToX: ${formatNumber(markConstructionMetrics.footThicknessToX)},
  innerVertex: Object.freeze({
    xToX: ${formatNumber(markConstructionMetrics.innerVertex.xToX)},
    yToX: ${formatNumber(markConstructionMetrics.innerVertex.yToX)},
  }),
  innerDiagonalAngleDeg: Object.freeze({
    upper: ${formatNumber(markConstructionMetrics.innerDiagonalAngleDeg.upper)},
    lower: ${formatNumber(markConstructionMetrics.innerDiagonalAngleDeg.lower)},
  }),
  diagonalGapToX: Object.freeze({
    minimum: ${formatNumber(markConstructionMetrics.diagonalGapToX.minimum)},
    maximum: ${formatNumber(markConstructionMetrics.diagonalGapToX.maximum)},
  }),
  diagonalGapSegments: Object.freeze([
    Object.freeze({ from: Object.freeze(${JSON.stringify(markConstructionMetrics.diagonalGapSegments[0].from)}), to: Object.freeze(${JSON.stringify(markConstructionMetrics.diagonalGapSegments[0].to)}) }),
    Object.freeze({ from: Object.freeze(${JSON.stringify(markConstructionMetrics.diagonalGapSegments[1].from)}), to: Object.freeze(${JSON.stringify(markConstructionMetrics.diagonalGapSegments[1].to)}) }),
  ]),
});

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

export const LK_LOGO_USAGE = Object.freeze({
  geometryVersion: ${JSON.stringify(manifest.symbol.geometryVersion)},
  minimumVisibleArtworkHeightPx: Object.freeze({
    mark: ${layout.mark.minimumVisibleArtworkHeightPx},
  }),
  minimumRenderedHeightPx: Object.freeze({
    mark: ${layout.mark.minimumRenderedHeightPx},
    stacked: ${layout.stacked.minimumRenderedHeightPx},
    inline: ${layout.inline.minimumRenderedHeightPx},
    banner: ${layout.banner.minimumRenderedHeightPx},
  }),
  minimumRequiredSlotWidthPx: Object.freeze({
    mark: ${formatNumber(minimumSlotWidth.mark)},
    stacked: ${formatNumber(minimumSlotWidth.stacked)},
    inline: ${formatNumber(minimumSlotWidth.inline)},
    banner: ${formatNumber(minimumSlotWidth.banner)},
  }),
  officialSquare: Object.freeze({
    minimumRenderedSquarePx: ${layout.officialSquare.minimumRenderedSquarePx},
    recommendedRenderedSquarePx: ${layout.officialSquare.recommendedRenderedSquarePx},
  }),
  favicon: Object.freeze({
    minimumRenderedSquarePx: ${layout.favicon.minimumRenderedSquarePx},
  }),
  corporateSquare: Object.freeze({
    minimumRenderedSquarePx: ${layout.corporate.minimumRenderedSquarePx},
    recommendedRenderedSquarePx: ${layout.corporate.recommendedRenderedSquarePx},
    minimumPrintedSquareMm: ${layout.corporate.minimumPrintedSquareMm},
  }),
  clearSpace: Object.freeze({
    measurement: ${JSON.stringify(layout.safeArea.measurement)},
    application: ${JSON.stringify(layout.safeArea.application)},
    minimumToX: ${layout.safeArea.minimumClearSpaceToX},
    coBrandToX: ${layout.safeArea.coBrandClearSpaceToX},
    appliesTo: Object.freeze(${JSON.stringify(layout.safeArea.appliesTo)}),
  }),
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

function renderFavicon({ viewBox, cornerRadius, background, foreground, markTransform }) {
  const size = normalizeBox(viewBox).width;
  return renderSvg({
    title: 'LK ROBOTICS favicon tile',
    viewBox,
    body: [
      `  <rect width="${formatNumber(size)}" height="${formatNumber(size)}" rx="${formatNumber(cornerRadius)}" fill="${background}" />`,
      `  <g transform="${markTransform}">`,
      renderMark(foreground, 2),
      '  </g>',
    ].join('\n'),
  });
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

function renderPortal(fill, indent = 1) {
  const spaces = '  '.repeat(indent);
  return [
    renderMark(fill, indent),
    `${spaces}<g transform="${portalTransform}">`,
    generatedPortalPaths.map((row) => renderPath(row, fill, indent + 1)).join('\n'),
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
  const transform = row.transform ? ` transform="${row.transform}"` : '';
  return `${spaces}<path d="${row.d}"${transform} fill="${fill}" />`;
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
  return [normalized.x, normalized.y, normalized.width, normalized.height]
    .map((value) => formatNumber(value))
    .join(' ');
}

function formatNumber(value, precision = 6) {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function minimumSlotWidth(minimumRenderedHeight, viewBox) {
  const serialized = normalizeBox(viewBox);
  const width = Number(formatNumber(serialized.width));
  const height = Number(formatNumber(serialized.height));
  return Number((minimumRenderedHeight * width / height).toFixed(6));
}

function serializeFontkitPath(value, precision = 3) {
  return value.replace(
    /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi,
    (token) => formatNumber(Number(token), precision),
  );
}

function validateProductionOutput(relativePath, content, contract) {
  if (!contract) throw new Error(`${relativePath} has no generated-output contract.`);
  if (/transform=["']undefined["']/.test(content)) {
    throw new Error(`${relativePath} contains an undefined transform attribute.`);
  }
  assertNoRuntimeFontDependency(relativePath, content);
  assertPathInstances(relativePath, content, LK_MARK_PATHS, contract.markInstances, 'LK mark');
  assertPathInstances(relativePath, content, generatedWordmarkPaths, contract.wordmarkInstances, 'wordmark');
  assertPathInstances(relativePath, content, generatedCorporatePaths, contract.corporateInstances, 'corporate name');
  assertPathInstances(relativePath, content, generatedPortalPaths, contract.portalInstances ?? 0, 'portal wordmark');

  if (contract.kind === 'runtime') {
    if (!content.includes('export const LK_MARK_CONSTRUCTION = Object.freeze({')) {
      throw new Error(`${relativePath} does not export LK internal construction metrics.`);
    }
    if (!content.includes('export const LK_LOGO_USAGE = Object.freeze({')) {
      throw new Error(`${relativePath} does not export logo usage metadata.`);
    }
    return;
  }

  if (contract.kind === 'runtime-portal') {
    if (!content.includes('export const PORTAL_LOCKUP_VIEWBOX =')) {
      throw new Error(`${relativePath} does not export the portal lockup viewBox.`);
    }
    return;
  }

  if (contract.kind !== 'svg') throw new Error(`${relativePath} has unsupported output kind ${contract.kind}.`);
  if (/<text\b/i.test(content)) throw new Error(`${relativePath} contains a text element.`);
  const viewBoxMatch = /<svg\b[^>]*\bviewBox="([^"]+)"/i.exec(content);
  if (!viewBoxMatch) throw new Error(`${relativePath} has no SVG viewBox.`);
  assertEqual(viewBoxMatch[1], formatViewBox(contract.viewBox), `${relativePath} viewBox`);
  assertBoundsContained(contract.pathBounds, contract.viewBox, `${relativePath} transformed path bounds`, 0.001);

  const actualPathCount = content.match(/<path\b/g)?.length ?? 0;
  const expectedPathCount =
    LK_MARK_PATHS.length * contract.markInstances
    + generatedWordmarkPaths.length * contract.wordmarkInstances
    + generatedCorporatePaths.length * contract.corporateInstances
    + generatedPortalPaths.length * (contract.portalInstances ?? 0);
  assertEqual(actualPathCount, expectedPathCount, `${relativePath} path count`);
}

function assertBoundsContained(inner, outer, label, tolerance = 0.000001) {
  const content = normalizeBox(inner);
  const canvas = normalizeBox(outer);
  const contentRight = content.x + content.width;
  const contentBottom = content.y + content.height;
  const canvasRight = canvas.x + canvas.width;
  const canvasBottom = canvas.y + canvas.height;
  if (
    content.x < canvas.x - tolerance
    || content.y < canvas.y - tolerance
    || contentRight > canvasRight + tolerance
    || contentBottom > canvasBottom + tolerance
  ) {
    throw new Error(`${label} escape viewBox: content=${formatViewBox(content)}, viewBox=${formatViewBox(canvas)}.`);
  }
}

function validateMinimumSlotWidthDocumentation(content, minimumSlotWidth) {
  for (const [variant, value] of Object.entries(minimumSlotWidth)) {
    const renderedValue = value.toFixed(6);
    if (!content.includes(`${renderedValue}px`)) {
      throw new Error(
        `components/brand/Lockup.prompt.md must document the derived ${variant} minimum slot width ${renderedValue}px.`,
      );
    }
  }
}

function validateBrandPolicyDocumentation(content, governance, minimumSlotWidth) {
  const expectedConstructionContract = {
    constructionVersion: manifest.constructionVersion,
    geometryVersion: manifest.symbol.geometryVersion,
    visibleMarkWidthToX: markBounds.width / markBounds.height,
    clearSpace: {
      transparentMinimumToX: layout.safeArea.minimumClearSpaceToX,
      coBrandMinimumToX: layout.safeArea.coBrandClearSpaceToX,
    },
    minimumRenderedLogicalUnits: {
      markHeight: layout.mark.minimumRenderedHeightPx,
      markVisibleArtworkHeight: layout.mark.minimumVisibleArtworkHeightPx,
      inlineHeight: layout.inline.minimumRenderedHeightPx,
      stackedHeight: layout.stacked.minimumRenderedHeightPx,
      bannerHeight: layout.banner.minimumRenderedHeightPx,
      officialSquareEdge: layout.officialSquare.minimumRenderedSquarePx,
      corporateSquareEdge: layout.corporate.minimumRenderedSquarePx,
      corporateSquareRecommendedEdge: layout.corporate.recommendedRenderedSquarePx,
      faviconSquareEdge: layout.favicon.minimumRenderedSquarePx,
    },
    minimumSlotLogicalUnits: {
      markWidth: minimumSlotWidth.mark,
      stackedWidth: minimumSlotWidth.stacked,
      inlineWidth: minimumSlotWidth.inline,
      bannerWidth: minimumSlotWidth.banner,
    },
  };
  assertEqual(
    JSON.stringify(governance.constructionContract),
    JSON.stringify(expectedConstructionContract),
    'brand governance construction contract',
  );
  assertEqual(governance.minimumSizeStatus?.status, 'repository-policy-pending-human-optical-approval', 'minimum-size approval status');
  assertEqual(governance.minimumSizeStatus?.approvalRecord, null, 'minimum-size approval record');
  assertEqual(governance.authority?.precedence?.[0], 'scripts/brand/lk-logo-source.mjs', 'brand authority geometry source');
  assertEqual(governance.authority?.precedence?.[1], 'assets/brand/lk-logo-construction.json', 'brand authority construction source');
  assertEqual(governance.authority?.precedence?.[2], 'scripts/generate-brand-assets.mjs', 'brand authority generator');

  const expectedColors = {
    navy: manifest.colors.navy.toUpperCase(),
    accent: manifest.colors.accent.toUpperCase(),
    white: manifest.colors.white.toUpperCase(),
  };
  for (const [name, expectedHex] of Object.entries(expectedColors)) {
    assertEqual(governance.printColorStatus?.digitalSource?.[name]?.hex, expectedHex, `brand governance ${name} color`);
  }

  const requiredFragments = [
    `\`${formatNumber(expectedConstructionContract.visibleMarkWidthToX, 16)}X : 1X\``,
    `${manifest.wordmark.family} ${manifest.wordmark.style} ${manifest.wordmark.weight} v${manifest.wordmark.fontVersion}`,
    `${manifest.corporateName.family} ${manifest.corporateName.style} \`wght=${manifest.corporateName.weight}\` v${manifest.corporateName.releaseVersion}`,
    `최소 \`${layout.safeArea.minimumClearSpaceToX}X\``,
    `최소 \`${layout.safeArea.coBrandClearSpaceToX}X\``,
    `| mark | \`${layout.mark.minimumRenderedHeightPx}px\``,
    `| inline | \`${layout.inline.minimumRenderedHeightPx}px\``,
    `| stacked | \`${layout.stacked.minimumRenderedHeightPx}px\``,
    `| banner | \`${layout.banner.minimumRenderedHeightPx}px\``,
    `| official square / tile | \`${layout.officialSquare.minimumRenderedSquarePx}px\``,
    `| corporate square | \`${layout.corporate.minimumRenderedSquarePx}px\` | \`${layout.corporate.recommendedRenderedSquarePx}px\` 이상`,
    `| favicon tile | \`${layout.favicon.minimumRenderedSquarePx}px\``,
    `mark \`${minimumSlotWidth.mark.toFixed(6)}\``,
    `inline \`${minimumSlotWidth.inline.toFixed(6)}\``,
    `stacked \`${minimumSlotWidth.stacked.toFixed(6)}\``,
    `banner \`${minimumSlotWidth.banner.toFixed(6)}\``,
    'repository-root-only',
    'resolvableInPackage: false',
    '저장소 정책 최소값',
  ];
  for (const fragment of requiredFragments) {
    if (!content.includes(fragment)) {
      throw new Error(`docs/brand/LK_LOGO_STANDARD.md is missing generated-contract evidence: ${fragment}`);
    }
  }
}

function assertNoRuntimeFontDependency(relativePath, content) {
  if (/@font-face|\bfont(?:-family|-weight|-style)?\s*[:=]|\.(?:otf|ttf|woff2?)\b|url\([^)]*\.(?:otf|ttf|woff2?)/i.test(content)) {
    throw new Error(`${relativePath} contains a runtime font dependency.`);
  }
  if (/\b(?:import|require)\b[^\n]*(?:fontkit|opentype)/i.test(content)) {
    throw new Error(`${relativePath} imports a font serialization dependency at runtime.`);
  }
}

function assertPathInstances(relativePath, content, rows, expectedInstances, label) {
  for (const row of rows) {
    const actualInstances = countOccurrences(content, row.d);
    if (actualInstances !== expectedInstances) {
      throw new Error(
        `${relativePath} ${label} path instances: expected ${expectedInstances}, received ${actualInstances}.`,
      );
    }
  }
}

function countOccurrences(value, search) {
  if (!search) return 0;
  return value.split(search).length - 1;
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

function deriveMarkConstructionMetrics(rows, bounds) {
  if (rows.length !== 2) throw new Error(`LK symbol construction expects 2 paths, received ${rows.length}.`);
  const transformedRows = rows.map((row) => {
    const matrixValues = parseSvgMatrix(row.transform);
    return parseLinearPathVertices(row.d).map((point) => transformPoint(point, matrixValues));
  });
  const [lVertices, kVertices] = transformedRows;
  if (lVertices.length !== 6 || kVertices.length !== 6) {
    throw new Error(`LK symbol construction expects 6 vertices per path, received ${lVertices.length} and ${kVertices.length}.`);
  }

  const x = bounds.height;
  const normalize = (point) => ({
    x: Number(formatNumber((point.x - bounds.x) / x)),
    y: Number(formatNumber((point.y - bounds.y) / x)),
  });
  const angleDeg = (from, to) => Math.atan2(Math.abs(to.y - from.y), Math.abs(to.x - from.x)) * 180 / Math.PI;
  const projectToLine = (point, from, to) => {
    const vx = to.x - from.x;
    const vy = to.y - from.y;
    const scalar = ((point.x - from.x) * vx + (point.y - from.y) * vy) / ((vx * vx) + (vy * vy));
    return { x: from.x + (scalar * vx), y: from.y + (scalar * vy) };
  };
  const distance = (from, to) => Math.hypot(to.x - from.x, to.y - from.y);
  const signedArea = (vertices) => vertices.reduce((sum, point, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return sum + ((point.x * next.y) - (next.x * point.y));
  }, 0) / 2;
  const makeContour = (id, vertices) => {
    const normalizedVertices = vertices.map((point, index) => {
      const normalized = normalize(point);
      return { id: `${id}${index + 1}`, xToX: normalized.x, yToX: normalized.y };
    });
    const normalizedPath = normalizedVertices
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${formatNumber(point.xToX)} ${formatNumber(point.yToX)}`)
      .join(' ')
      .concat(' Z');
    return {
      id,
      closed: true,
      winding: signedArea(normalizedVertices.map(({ xToX, yToX }) => ({ x: xToX, y: yToX }))) > 0
        ? 'clockwise'
        : 'counter-clockwise',
      normalizedPath,
      vertices: normalizedVertices,
    };
  };

  const gapFromUpper = lVertices[3];
  const gapFromLower = lVertices[2];
  const gapToUpper = projectToLine(gapFromUpper, kVertices[2], kVertices[3]);
  const gapToLower = projectToLine(gapFromLower, kVertices[2], kVertices[3]);
  const gapValues = [distance(gapFromUpper, gapToUpper) / x, distance(gapFromLower, gapToLower) / x];

  return {
    coordinateSystem: {
      origin: 'visible-bounds-top-left',
      xAxis: 'right',
      yAxis: 'down',
      unit: 'X-visible-artwork-height',
      precisionToX: 0.000001,
    },
    contours: [makeContour('L', lVertices), makeContour('K', kVertices)],
    stemWidthToX: (lVertices[5].x - lVertices[0].x) / x,
    footReachToX: (lVertices[2].x - lVertices[1].x) / x,
    footThicknessToX: (lVertices[2].y - lVertices[3].y) / x,
    innerVertex: {
      xToX: (kVertices[2].x - bounds.x) / x,
      yToX: (kVertices[2].y - bounds.y) / x,
    },
    innerDiagonalAngleDeg: {
      upper: angleDeg(kVertices[2], kVertices[1]),
      lower: angleDeg(kVertices[2], kVertices[3]),
    },
    diagonalGapToX: {
      minimum: Math.min(...gapValues),
      maximum: Math.max(...gapValues),
    },
    diagonalGapSegments: [
      { from: normalize(gapFromUpper), to: normalize(gapToUpper) },
      { from: normalize(gapFromLower), to: normalize(gapToLower) },
    ],
  };
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
