/**
 * Generate deterministic, platform-ready contracts from the canonical LK SVGs.
 *
 * This generator deliberately does not call Figma or claim design approval. It
 * records import-ready metadata and produces local iOS, Android, and web assets
 * whose provenance can be checked from source SHA-256 hashes.
 *
 * Use --check to fail on missing, changed, or unexpected generated files.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rmdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const generatorPath = 'scripts/generate-brand-platform-assets.mjs';
const constructionManifestPath = 'assets/brand/lk-logo-construction.json';
const governancePath = 'docs/brand/lk-logo-governance.json';
const platformRoot = 'assets/brand/platforms';
const contractVersion = 1;
const androidIntrinsicPrecision = 6;

const identityMatrix = Object.freeze({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });

const constructionManifestBuffer = await readFileFromRoot(constructionManifestPath);
const constructionManifest = parseJson(constructionManifestBuffer, constructionManifestPath);
const governanceBuffer = await readFileFromRoot(governancePath);
const governance = parseJson(governanceBuffer, governancePath);
assertPositiveInteger(constructionManifest.schemaVersion, `${constructionManifestPath} schemaVersion`);
assertPositiveInteger(constructionManifest.constructionVersion, `${constructionManifestPath} constructionVersion`);
assert(
  constructionManifest.colors && typeof constructionManifest.colors === 'object',
  `${constructionManifestPath} must define colors.`,
);
assert(
  constructionManifest.layout && typeof constructionManifest.layout === 'object',
  `${constructionManifestPath} must define layout contracts.`,
);
assert(
  constructionManifest.output?.constructionManifestDistribution === 'repository-root-only',
  `${constructionManifestPath} distribution must remain repository-root-only.`,
);
assert(governance.standard?.version === '1.0.0', `${governancePath} standard version drifted.`);
assert(governance.standard?.status === 'current-repository-standard', `${governancePath} standard status drifted.`);
assert(
  governance.minimumSizeStatus?.status === 'repository-policy-pending-human-optical-approval',
  `${governancePath} minimum-size status drifted.`,
);
assert(governance.minimumSizeStatus?.approvalRecord === null, `${governancePath} minimum-size approval must remain explicit.`);

const brandStandard = Object.freeze({
  version: governance.standard.version,
  status: governance.standard.status,
  governanceSha256: sha256(governanceBuffer),
  minimumSizePolicy: Object.freeze({
    status: governance.minimumSizeStatus.status,
    humanOpticalApproval: governance.minimumSizeStatus.approvalRecord !== null,
    approvalRecord: governance.minimumSizeStatus.approvalRecord,
  }),
});

const layout = constructionManifest.layout;

const familyContracts = Object.freeze({
  mark: {
    minimumRendered: { axis: 'rendered-height', value: layout.mark?.minimumRenderedHeightPx, unit: 'platform-logical-unit' },
    minimumVisibleArtworkHeight: {
      axis: 'visible-artwork-height',
      value: layout.mark?.minimumVisibleArtworkHeightPx,
      unit: 'platform-logical-unit',
    },
  },
  inline: {
    minimumRendered: { axis: 'rendered-height', value: layout.inline?.minimumRenderedHeightPx, unit: 'platform-logical-unit' },
  },
  stacked: {
    minimumRendered: { axis: 'rendered-height', value: layout.stacked?.minimumRenderedHeightPx, unit: 'platform-logical-unit' },
  },
  banner: {
    minimumRendered: { axis: 'rendered-height', value: layout.banner?.minimumRenderedHeightPx, unit: 'platform-logical-unit' },
  },
  square: {
    minimumRendered: { axis: 'edge', value: layout.officialSquare?.minimumRenderedSquarePx, unit: 'platform-logical-unit' },
    recommendedRendered: { axis: 'edge', value: layout.officialSquare?.recommendedRenderedSquarePx, unit: 'platform-logical-unit' },
  },
  corporateSquare: {
    minimumRendered: { axis: 'edge', value: layout.corporate?.minimumRenderedSquarePx, unit: 'platform-logical-unit' },
    recommendedRendered: { axis: 'edge', value: layout.corporate?.recommendedRenderedSquarePx, unit: 'platform-logical-unit' },
  },
  favicon: {
    minimumRendered: { axis: 'edge', value: layout.favicon?.minimumRenderedSquarePx, unit: 'platform-logical-unit' },
  },
});

for (const [family, contract] of Object.entries(familyContracts)) {
  for (const [name, measurement] of Object.entries(contract)) {
    assert(
      Number.isFinite(measurement.value) && measurement.value > 0,
      `${constructionManifestPath} is missing ${family}.${name}.`,
    );
  }
}

const assetDefinitions = Object.freeze([
  asset('mark-navy', 'mark', 'navy', 'assets/brand/lk-mark-navy.svg'),
  asset('mark-white', 'mark', 'white', 'assets/brand/lk-mark-white.svg'),
  asset('logo-inline-navy', 'inline', 'navy', 'assets/brand/lk-logo-inline-navy.svg'),
  asset('logo-inline-white', 'inline', 'white', 'assets/brand/lk-logo-inline-white.svg'),
  asset('logo-stacked-navy', 'stacked', 'navy', 'assets/brand/lk-logo-navy.svg'),
  asset('logo-stacked-white', 'stacked', 'white', 'assets/brand/lk-logo-white.svg'),
  asset('logo-banner-navy', 'banner', 'navy', 'assets/brand/lk-logo-banner-navy.svg'),
  asset('logo-banner-light', 'banner', 'light', 'assets/brand/lk-logo-banner-light.svg'),
  asset('logo-square-navy', 'square', 'navy', 'assets/brand/lk-logo-official.svg'),
  asset('logo-square-light', 'square', 'light', 'assets/brand/lk-logo-official-light.svg'),
  asset(
    'logo-corporate-square-navy',
    'corporateSquare',
    'navy',
    'assets/brand/lk-logo-official-corporate.svg',
  ),
  asset(
    'logo-corporate-square-light',
    'corporateSquare',
    'light',
    'assets/brand/lk-logo-official-corporate-light.svg',
  ),
  asset('favicon', 'favicon', 'navy', 'assets/brand/lk-favicon.svg', {
    ios: false,
    android: false,
    usage: 'browser-favicon-only',
  }),
]);

const sourceAssets = [];
for (const definition of assetDefinitions) {
  const buffer = await readFileFromRoot(definition.sourcePath);
  const svg = parseSvg(buffer.toString('utf8'), definition.sourcePath);
  validateSvg(svg, definition, constructionManifest.colors);
  sourceAssets.push(Object.freeze({
    ...definition,
    buffer,
    sha256: sha256(buffer),
    byteLength: buffer.byteLength,
    title: svg.title,
    viewBox: svg.viewBox,
    colors: svg.fills,
    svg,
  }));
}

for (const [family, sourcePath] of [
  ['mark', 'assets/brand/lk-mark-navy.svg'],
  ['stacked', 'assets/brand/lk-logo-navy.svg'],
  ['inline', 'assets/brand/lk-logo-inline-navy.svg'],
  ['banner', 'assets/brand/lk-logo-banner-navy.svg'],
]) {
  const source = sourceAssets.find((item) => item.sourcePath === sourcePath);
  assert(source, `Missing responsive source asset ${sourcePath}.`);
  const minimumHeight = familyContracts[family].minimumRendered.value;
  familyContracts[family].minimumRequiredSlotWidth = {
    axis: 'slot-width',
    value: round(minimumHeight * source.viewBox.width / source.viewBox.height, 6),
    unit: 'platform-logical-unit',
  };
}
assert(familyContracts.mark.minimumRequiredSlotWidth.value === 21.431318, 'mark minimum slot width drifted.');
assert(familyContracts.stacked.minimumRequiredSlotWidth.value === 82.61299, 'stacked minimum slot width drifted.');
assert(familyContracts.inline.minimumRequiredSlotWidth.value === 156.324048, 'inline minimum slot width drifted.');
assert(familyContracts.banner.minimumRequiredSlotWidth.value === 137.019722, 'banner minimum slot width drifted.');
for (const contract of Object.values(familyContracts)) Object.freeze(contract);

const platformLogicalUnits = Object.freeze({
  figma: 'design-px',
  ios: 'pt',
  android: 'dp',
  web: 'css-px',
});

const sourceSetSha256 = sha256(Buffer.from(JSON.stringify(sourceAssets.map((item) => ({
  id: item.id,
  sourcePath: item.sourcePath,
  sha256: item.sha256,
})))));
const constructionManifestSha256 = sha256(constructionManifestBuffer);
const generated = new Map();

const sourceSummary = Object.freeze({
  constructionManifest: {
    path: constructionManifestPath,
    schemaVersion: constructionManifest.schemaVersion,
    constructionVersion: constructionManifest.constructionVersion,
    sha256: constructionManifestSha256,
    distribution: constructionManifest.output.constructionManifestDistribution,
    resolvableInPackage: false,
  },
  governance: {
    path: governancePath,
    sha256: brandStandard.governanceSha256,
    distribution: 'repository-docs-only',
    resolvableInPackage: false,
  },
  assetSetSha256: sourceSetSha256,
  assets: sourceAssets.map(renderSourceRecord),
});

const clearSpaceApplicationByFamily = Object.freeze({
  mark: 'external-required-from-visible-artwork-bounds',
  inline: 'external-required-from-visible-artwork-bounds',
  stacked: 'external-required-from-visible-artwork-bounds',
  banner: 'embedded-in-source-asset',
  square: 'preserve-complete-containment-canvas',
  corporateSquare: 'preserve-complete-containment-canvas',
  favicon: 'preserve-complete-containment-canvas',
});
const clearSpace = Object.freeze({
  definition: 'Clear-space application is family-specific; transparent lockups require external space, banners embed it, and contained assets preserve their complete canvas.',
  unit: 'X',
  xDefinition: layout.xDefinition,
  measurement: layout.safeArea?.measurement,
  application: 'family-specific',
  transparentAssetApplication: layout.safeArea?.application,
  externalMinimumAppliesTo: layout.safeArea?.appliesTo,
  minimumToX: layout.safeArea?.minimumClearSpaceToX,
  coBrandMinimumToX: layout.safeArea?.coBrandClearSpaceToX,
  applicationByFamily: clearSpaceApplicationByFamily,
});
assert(clearSpace.measurement === 'visible-artwork-bounds', `${constructionManifestPath} has an unsupported safe-area measurement.`);
assert(clearSpace.transparentAssetApplication === 'external-around-visible-bounds', `${constructionManifestPath} has an unsupported safe-area application.`);
assert(
  JSON.stringify(clearSpace.externalMinimumAppliesTo) === JSON.stringify(['mark', 'stacked', 'inline']),
  `${constructionManifestPath} safe-area families are invalid.`,
);
assert(Number.isFinite(clearSpace.minimumToX) && clearSpace.minimumToX > 0, `${constructionManifestPath} safe-area minimum is invalid.`);

emitJson(`${platformRoot}/manifest.json`, {
  schemaVersion: 1,
  contractVersion,
  generatedBy: generatorPath,
  brandStandard,
  source: sourceSummary,
  clearSpace,
  familyContracts,
  platformLogicalUnits,
  platforms: {
    figma: {
      contract: `${platformRoot}/figma/import-manifest.json`,
      integration: 'manual-import-contract',
      liveSync: false,
    },
    ios: {
      contract: `${platformRoot}/ios/manifest.json`,
      assetCatalog: `${platformRoot}/ios/LKBrandAssets.xcassets`,
    },
    android: {
      contract: `${platformRoot}/android/manifest.json`,
      resourceRoot: `${platformRoot}/android/res`,
    },
    web: {
      contract: `${platformRoot}/web/manifest.json`,
      assetsCopied: false,
    },
  },
});

emitJson(`${platformRoot}/figma/import-manifest.json`, {
  schemaVersion: 1,
  contractVersion,
  generatedBy: generatorPath,
  brandStandard,
  sourceAssetSetSha256: sourceSetSha256,
  sourceConstructionVersion: constructionManifest.constructionVersion,
  sourceConstructionManifestSha256: constructionManifestSha256,
  integration: {
    mode: 'manual-import-contract',
    sourceAuthority: 'canonical-generated-repository-assets',
    liveSync: false,
    uploadStatus: 'not-attempted',
    approvalStatus: 'not-recorded',
    note: 'This file describes deterministic import inputs; it is not evidence of a Figma upload or approval.',
  },
  importRules: {
    preserveVectorGeometry: true,
    preserveSourceViewBox: true,
    flattenText: true,
    componentSetName: 'LK Brand Assets',
    variantProperties: ['Family', 'Tone'],
  },
  measurementUnit: platformLogicalUnits.figma,
  clearSpace,
  assets: sourceAssets.filter((item) => item.platforms.figma).map((item) => ({
    id: item.id,
    componentName: figmaComponentName(item),
    family: item.family,
    tone: item.tone,
    usage: item.usage,
    sourcePath: item.sourcePath,
    sha256: item.sha256,
    viewBox: item.viewBox,
    clearSpaceApplication: clearSpaceApplicationByFamily[item.family],
    ...familyContractForPlatform(item.family, 'figma'),
  })),
});

emitJson(`${platformRoot}/ios/LKBrandAssets.xcassets/Contents.json`, {
  info: { author: 'xcode', version: 1 },
});

const iosAssets = [];
for (const item of sourceAssets.filter((source) => source.platforms.ios)) {
  const imagesetName = iosImagesetName(item);
  const copyPath = `${platformRoot}/ios/LKBrandAssets.xcassets/${imagesetName}.imageset/${path.basename(item.sourcePath)}`;
  const contentsPath = `${platformRoot}/ios/LKBrandAssets.xcassets/${imagesetName}.imageset/Contents.json`;
  emit(copyPath, item.buffer);
  emitJson(contentsPath, {
    images: [{ filename: path.basename(item.sourcePath), idiom: 'universal' }],
    info: { author: 'xcode', version: 1 },
    properties: { 'preserves-vector-representation': true },
  });
  iosAssets.push({
    id: item.id,
    imagesetName,
    usage: item.usage,
    sourcePath: item.sourcePath,
    sourceSha256: item.sha256,
    copiedSvgPath: copyPath,
    copiedSvgSha256: item.sha256,
    clearSpaceApplication: clearSpaceApplicationByFamily[item.family],
    ...familyContractForPlatform(item.family, 'ios'),
  });
}

emitJson(`${platformRoot}/ios/manifest.json`, {
  schemaVersion: 1,
  contractVersion,
  generatedBy: generatorPath,
  brandStandard,
  sourceAssetSetSha256: sourceSetSha256,
  sourceConstructionVersion: constructionManifest.constructionVersion,
  sourceConstructionManifestSha256: constructionManifestSha256,
  delivery: {
    type: 'xcode-asset-catalog',
    moduleName: 'consumer-defined',
    preservesVectorRepresentation: true,
    appIconStatus: 'not-provided',
    note: 'These are scalable imagesets, not an AppIcon.appiconset or evidence of App Store approval.',
  },
  measurementUnit: platformLogicalUnits.ios,
  clearSpace,
  assetCatalogPath: `${platformRoot}/ios/LKBrandAssets.xcassets`,
  assets: iosAssets,
  excludedAssets: sourceAssets
    .filter((item) => !item.platforms.ios)
    .map((item) => ({
      id: item.id,
      reason: item.usage === 'browser-favicon-only'
        ? 'Browser favicon only; do not ship it in a native iOS asset catalog or use it as AppIcon.'
        : 'This asset has no iOS delivery contract.',
    })),
});

const colorResourceNames = Object.freeze({
  [constructionManifest.colors.navy.toLowerCase()]: 'lk_brand_navy',
  [constructionManifest.colors.accent.toLowerCase()]: 'lk_brand_accent',
  [constructionManifest.colors.white.toLowerCase()]: 'lk_brand_white',
});

emit(`${platformRoot}/android/res/values/lk_brand_colors.xml`, renderAndroidColors(constructionManifest.colors));

const androidAssets = [];
for (const item of sourceAssets.filter((source) => source.platforms.android)) {
  const resourceName = androidResourceName(item);
  const outputPath = `${platformRoot}/android/res/drawable/${resourceName}.xml`;
  const xml = renderAndroidVector(item, colorResourceNames);
  emit(outputPath, xml);
  androidAssets.push({
    id: item.id,
    resourceName,
    usage: item.usage,
    sourcePath: item.sourcePath,
    sourceSha256: item.sha256,
    vectorDrawablePath: outputPath,
    vectorDrawableSha256: sha256(Buffer.from(xml)),
    intrinsicSize: androidIntrinsicSize(item),
    clearSpaceApplication: clearSpaceApplicationByFamily[item.family],
    ...familyContractForPlatform(item.family, 'android'),
  });
}

emitJson(`${platformRoot}/android/manifest.json`, {
  schemaVersion: 1,
  contractVersion,
  generatedBy: generatorPath,
  brandStandard,
  sourceAssetSetSha256: sourceSetSha256,
  sourceConstructionVersion: constructionManifest.constructionVersion,
  sourceConstructionManifestSha256: constructionManifestSha256,
  delivery: {
    type: 'android-resources',
    vectorFormat: 'VectorDrawable',
    autoMirrored: false,
    adaptiveIconStatus: 'not-provided',
    note: 'Brand vectors use fixed colors and must not be mirrored or tinted by consumers.',
  },
  measurementUnit: platformLogicalUnits.android,
  clearSpace,
  colorResourcePath: `${platformRoot}/android/res/values/lk_brand_colors.xml`,
  assets: androidAssets,
  excludedAssets: sourceAssets
    .filter((item) => !item.platforms.android)
    .map((item) => ({
      id: item.id,
      reason: item.usage === 'browser-favicon-only'
        ? 'Browser favicon only; do not ship it as an Android drawable or present it as an adaptive icon.'
        : 'This asset has no Android delivery contract.',
    })),
});

emitJson(`${platformRoot}/web/manifest.json`, {
  schemaVersion: 1,
  contractVersion,
  generatedBy: generatorPath,
  brandStandard,
  sourceAssetSetSha256: sourceSetSha256,
  sourceConstructionVersion: constructionManifest.constructionVersion,
  sourceConstructionManifestSha256: constructionManifestSha256,
  cacheKey: `lk-brand-c${constructionManifest.constructionVersion}-${sourceSetSha256.slice(0, 16)}`,
  delivery: {
    type: 'canonical-repository-svg',
    assetsCopied: false,
    mimeType: 'image/svg+xml',
    note: 'Use the canonical sourcePath directly; integrity values are provided for build-time verification.',
  },
  measurementUnit: platformLogicalUnits.web,
  clearSpace,
  assets: sourceAssets.filter((source) => source.platforms.web).map((item) => ({
    id: item.id,
    family: item.family,
    tone: item.tone,
    usage: item.usage,
    sourcePath: item.sourcePath,
    sha256: item.sha256,
    integrity: `sha256-${createHash('sha256').update(item.buffer).digest('base64')}`,
    byteLength: item.byteLength,
    viewBox: item.viewBox,
    clearSpaceApplication: clearSpaceApplicationByFamily[item.family],
    ...familyContractForPlatform(item.family, 'web'),
  })),
});

validateGeneratedContracts();
await writeOrCheckGeneratedFiles();

console.log(
  `${checkOnly ? 'Validated' : 'Generated'} ${generated.size} LK platform asset files from construction v${constructionManifest.constructionVersion} (${sourceSetSha256.slice(0, 12)}).`,
);

function asset(id, family, tone, sourcePath, platforms = {}) {
  assert(familyContracts[family], `Unknown family contract: ${family}`);
  return Object.freeze({
    id,
    family,
    tone,
    usage: platforms.usage ?? 'general-brand-asset',
    sourcePath,
    platforms: Object.freeze({
      figma: platforms.figma ?? true,
      ios: platforms.ios ?? true,
      android: platforms.android ?? true,
      web: platforms.web ?? true,
    }),
  });
}

function familyContractForPlatform(family, platform) {
  const unit = platformLogicalUnits[platform];
  assert(unit, `Unknown platform logical unit: ${platform}`);
  return Object.fromEntries(
    Object.entries(familyContracts[family]).map(([name, measurement]) => [
      name,
      { ...measurement, unit },
    ]),
  );
}

function renderSourceRecord(item) {
  return {
    id: item.id,
    family: item.family,
    tone: item.tone,
    usage: item.usage,
    path: item.sourcePath,
    sha256: item.sha256,
    byteLength: item.byteLength,
    title: item.title,
    viewBox: item.viewBox,
    colors: item.colors,
    platforms: item.platforms,
  };
}

function figmaComponentName(item) {
  return `LK/${familyDisplayName(item.family)}/${toneDisplayName(item.tone)}`;
}

function iosImagesetName(item) {
  return `LK${familyDisplayName(item.family).replaceAll(' ', '')}${toneDisplayName(item.tone)}`;
}

function androidResourceName(item) {
  return `lk_brand_${item.id.replaceAll('-', '_')}`;
}

function familyDisplayName(family) {
  return {
    mark: 'Mark',
    inline: 'Logo Inline',
    stacked: 'Logo Stacked',
    banner: 'Logo Banner',
    square: 'Logo Square',
    corporateSquare: 'Logo Corporate Square',
    favicon: 'Favicon',
  }[family];
}

function toneDisplayName(tone) {
  return { navy: 'Navy', white: 'White', light: 'Light' }[tone];
}

function androidIntrinsicSize(item) {
  const contract = familyContracts[item.family];
  const target = contract.recommendedRendered || contract.minimumRendered;
  const ratio = item.viewBox.width / item.viewBox.height;
  if (target.axis === 'edge') return { widthDp: target.value, heightDp: target.value };
  if (target.axis === 'rendered-height' || target.axis === 'visible-artwork-height') {
    const proportionalWidth = round(target.value * ratio, androidIntrinsicPrecision);
    const minimumSlotWidth = contract.minimumRequiredSlotWidth?.value;
    return {
      widthDp: minimumSlotWidth === undefined
        ? proportionalWidth
        : Math.max(minimumSlotWidth, proportionalWidth),
      heightDp: target.value,
    };
  }
  throw new Error(`Unsupported Android intrinsic-size axis: ${target.axis}`);
}

function renderAndroidColors(colors) {
  const rows = [
    ['lk_brand_navy', colors.navy],
    ['lk_brand_accent', colors.accent],
    ['lk_brand_white', colors.white],
  ];
  for (const [name, value] of rows) {
    assert(/^#[0-9a-f]{6}$/i.test(value), `Android color ${name} must be a six-digit hex value.`);
  }
  return `${xmlHeader()}<resources>\n${rows.map(([name, value]) => `  <color name="${name}">${value.toUpperCase()}</color>`).join('\n')}\n</resources>\n`;
}

function renderAndroidVector(item, colorResourceNames) {
  const intrinsic = androidIntrinsicSize(item);
  const paths = extractAndroidPaths(item.svg, item.sourcePath);
  assert(paths.length > 0, `${item.sourcePath} produced no Android vector paths.`);
  const pathRows = paths.map((row) => {
    const colorName = colorResourceNames[row.fill.toLowerCase()];
    assert(colorName, `${item.sourcePath} contains unmapped Android fill ${row.fill}.`);
    return `  <path\n    android:fillColor="@color/${colorName}"\n    android:pathData="${escapeXml(row.pathData)}" />`;
  });
  return `${xmlHeader()}<vector xmlns:android="http://schemas.android.com/apk/res/android"\n  android:width="${formatNumber(intrinsic.widthDp)}dp"\n  android:height="${formatNumber(intrinsic.heightDp)}dp"\n  android:viewportWidth="${formatNumber(item.viewBox.width)}"\n  android:viewportHeight="${formatNumber(item.viewBox.height)}">\n${pathRows.join('\n')}\n</vector>\n`;
}

function extractAndroidPaths(svg, sourcePath) {
  const paths = [];
  const matrices = [identityMatrix];
  const tags = svg.source.match(/<[^>]+>/g) || [];
  for (const tag of tags) {
    if (/^<\/g\s*>$/i.test(tag)) {
      assert(matrices.length > 1, `${sourcePath} has an unmatched closing <g>.`);
      matrices.pop();
      continue;
    }
    if (/^<g\b/i.test(tag)) {
      const local = parseTransform(attribute(tag, 'transform'), sourcePath);
      matrices.push(multiplyMatrices(matrices.at(-1), local));
      continue;
    }
    if (/^<path\b/i.test(tag)) {
      const d = requiredAttribute(tag, 'd', sourcePath);
      const fill = requiredAttribute(tag, 'fill', sourcePath);
      const local = parseTransform(attribute(tag, 'transform'), sourcePath);
      const matrix = multiplyMatrices(matrices.at(-1), local);
      paths.push({
        fill,
        pathData: transformPathData(d, matrix, svg.viewBox, sourcePath),
      });
      continue;
    }
    if (/^<rect\b/i.test(tag)) {
      assert(!attribute(tag, 'rx') && !attribute(tag, 'ry'), `${sourcePath} uses a rounded rect unsupported by this VectorDrawable generator.`);
      const x = numberAttribute(tag, 'x', 0, sourcePath);
      const y = numberAttribute(tag, 'y', 0, sourcePath);
      const width = numberAttribute(tag, 'width', undefined, sourcePath);
      const height = numberAttribute(tag, 'height', undefined, sourcePath);
      const fill = requiredAttribute(tag, 'fill', sourcePath);
      const local = parseTransform(attribute(tag, 'transform'), sourcePath);
      const matrix = multiplyMatrices(matrices.at(-1), local);
      const points = [
        applyMatrix({ x, y }, matrix, svg.viewBox),
        applyMatrix({ x: x + width, y }, matrix, svg.viewBox),
        applyMatrix({ x: x + width, y: y + height }, matrix, svg.viewBox),
        applyMatrix({ x, y: y + height }, matrix, svg.viewBox),
      ];
      paths.push({
        fill,
        pathData: `M${pointString(points[0])} L${pointString(points[1])} L${pointString(points[2])} L${pointString(points[3])} Z`,
      });
    }
  }
  assert(matrices.length === 1, `${sourcePath} has an unclosed <g>.`);
  return paths;
}

function transformPathData(d, matrix, viewBox, sourcePath) {
  const tokenPattern = /[MmLlHhVvQqZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
  const tokens = d.match(tokenPattern) || [];
  const residue = d.replace(tokenPattern, '').replace(/[\s,]/g, '');
  assert(!residue, `${sourcePath} contains unsupported SVG path syntax: ${residue}`);
  const rows = [];
  let index = 0;
  let command;
  let current = { x: 0, y: 0 };
  let subpathStart = { x: 0, y: 0 };

  while (index < tokens.length) {
    if (isCommand(tokens[index])) command = tokens[index++];
    assert(command, `${sourcePath} path data is missing a command near token ${index}.`);
    const relative = command === command.toLowerCase();
    switch (command.toUpperCase()) {
      case 'M': {
        const point = readPoint(tokens, index, current, relative, sourcePath);
        index += 2;
        current = point;
        subpathStart = point;
        rows.push(`M${pointString(applyMatrix(point, matrix, viewBox))}`);
        command = relative ? 'l' : 'L';
        break;
      }
      case 'L': {
        const point = readPoint(tokens, index, current, relative, sourcePath);
        index += 2;
        current = point;
        rows.push(`L${pointString(applyMatrix(point, matrix, viewBox))}`);
        break;
      }
      case 'H': {
        const value = readNumber(tokens, index, sourcePath);
        index += 1;
        current = { x: relative ? current.x + value : value, y: current.y };
        rows.push(`L${pointString(applyMatrix(current, matrix, viewBox))}`);
        break;
      }
      case 'V': {
        const value = readNumber(tokens, index, sourcePath);
        index += 1;
        current = { x: current.x, y: relative ? current.y + value : value };
        rows.push(`L${pointString(applyMatrix(current, matrix, viewBox))}`);
        break;
      }
      case 'Q': {
        const control = readPoint(tokens, index, current, relative, sourcePath);
        const point = readPoint(tokens, index + 2, current, relative, sourcePath);
        index += 4;
        current = point;
        rows.push(`Q${pointString(applyMatrix(control, matrix, viewBox))} ${pointString(applyMatrix(point, matrix, viewBox))}`);
        break;
      }
      case 'Z': {
        current = subpathStart;
        command = undefined;
        rows.push('Z');
        break;
      }
      default:
        throw new Error(`${sourcePath} contains unsupported SVG path command ${command}.`);
    }
  }
  return rows.join(' ');
}

function readPoint(tokens, index, current, relative, sourcePath) {
  const x = readNumber(tokens, index, sourcePath);
  const y = readNumber(tokens, index + 1, sourcePath);
  return relative ? { x: current.x + x, y: current.y + y } : { x, y };
}

function readNumber(tokens, index, sourcePath) {
  const token = tokens[index];
  assert(token !== undefined && !isCommand(token), `${sourcePath} path data is missing a number near token ${index}.`);
  const value = Number(token);
  assert(Number.isFinite(value), `${sourcePath} path data has invalid number ${token}.`);
  return value;
}

function isCommand(token) {
  return /^[A-Za-z]$/.test(token);
}

function applyMatrix(point, matrix, viewBox) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e - viewBox.x,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f - viewBox.y,
  };
}

function multiplyMatrices(parent, child) {
  return {
    a: parent.a * child.a + parent.c * child.b,
    b: parent.b * child.a + parent.d * child.b,
    c: parent.a * child.c + parent.c * child.d,
    d: parent.b * child.c + parent.d * child.d,
    e: parent.a * child.e + parent.c * child.f + parent.e,
    f: parent.b * child.e + parent.d * child.f + parent.f,
  };
}

function parseTransform(value, sourcePath) {
  if (!value) return identityMatrix;
  const calls = [...value.matchAll(/(matrix|translate|scale)\(([^)]+)\)/g)];
  const residue = value.replace(/(matrix|translate|scale)\(([^)]+)\)/g, '').trim();
  assert(calls.length > 0 && !residue, `${sourcePath} contains unsupported transform: ${value}`);
  let result = identityMatrix;
  for (const [, name, argumentsText] of calls) {
    const values = argumentsText.split(/[\s,]+/).filter(Boolean).map(Number);
    assert(values.every(Number.isFinite), `${sourcePath} contains invalid transform numbers: ${value}`);
    let operation;
    if (name === 'matrix') {
      assert(values.length === 6, `${sourcePath} matrix() must have six values.`);
      operation = { a: values[0], b: values[1], c: values[2], d: values[3], e: values[4], f: values[5] };
    } else if (name === 'translate') {
      assert(values.length === 1 || values.length === 2, `${sourcePath} translate() must have one or two values.`);
      operation = { a: 1, b: 0, c: 0, d: 1, e: values[0], f: values[1] || 0 };
    } else {
      assert(values.length === 1 || values.length === 2, `${sourcePath} scale() must have one or two values.`);
      operation = { a: values[0], b: 0, c: 0, d: values[1] ?? values[0], e: 0, f: 0 };
    }
    result = multiplyMatrices(result, operation);
  }
  return result;
}

function parseSvg(source, sourcePath) {
  const svgTag = source.match(/<svg\b[^>]*>/i)?.[0];
  assert(svgTag, `${sourcePath} must contain an <svg> root.`);
  const viewBoxText = requiredAttribute(svgTag, 'viewBox', sourcePath);
  const values = viewBoxText.split(/[\s,]+/).map(Number);
  assert(values.length === 4 && values.every(Number.isFinite), `${sourcePath} has an invalid viewBox.`);
  const [x, y, width, height] = values;
  assert(width > 0 && height > 0, `${sourcePath} viewBox dimensions must be positive.`);
  const title = source.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  assert(title, `${sourcePath} must contain a non-empty <title>.`);
  const fills = [...new Set([...source.matchAll(/\bfill="([^"]+)"/gi)].map((match) => match[1].toLowerCase()))].sort();
  return {
    source,
    title,
    viewBox: { x, y, width, height },
    fills,
  };
}

function validateSvg(svg, definition, colors) {
  assert(!/<text\b/i.test(svg.source), `${definition.sourcePath} must contain outlined paths, not <text>.`);
  assert(!/(?:href|xlink:href)="/i.test(svg.source), `${definition.sourcePath} must not reference external content.`);
  assert(!/<(?:image|script|foreignObject)\b/i.test(svg.source), `${definition.sourcePath} contains a forbidden SVG element.`);
  assert(/preserveAspectRatio="xMidYMid meet"/.test(svg.source), `${definition.sourcePath} must preserve its aspect ratio.`);
  assert(/<path\b/.test(svg.source), `${definition.sourcePath} must contain vector paths.`);
  const approvedColors = new Set(Object.values(colors).map((value) => value.toLowerCase()));
  for (const fill of svg.fills) assert(approvedColors.has(fill), `${definition.sourcePath} uses unapproved fill ${fill}.`);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
}

function requiredAttribute(tag, name, sourcePath) {
  const value = attribute(tag, name);
  assert(value !== undefined && value !== '', `${sourcePath} is missing required ${name}.`);
  return value;
}

function numberAttribute(tag, name, fallback, sourcePath) {
  const raw = attribute(tag, name);
  if (raw === undefined) {
    assert(fallback !== undefined, `${sourcePath} is missing required numeric ${name}.`);
    return fallback;
  }
  const value = Number(raw);
  assert(Number.isFinite(value), `${sourcePath} has invalid ${name}=${raw}.`);
  return value;
}

function emitJson(relativePath, value) {
  emit(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function emit(relativePath, contents) {
  const normalized = Buffer.isBuffer(contents) ? contents : Buffer.from(contents.replaceAll('\r\n', '\n'));
  assert(!generated.has(relativePath), `Duplicate generated output: ${relativePath}`);
  generated.set(relativePath, normalized);
}

function validateGeneratedContracts() {
  const required = [
    `${platformRoot}/manifest.json`,
    `${platformRoot}/figma/import-manifest.json`,
    `${platformRoot}/ios/manifest.json`,
    `${platformRoot}/ios/LKBrandAssets.xcassets/Contents.json`,
    `${platformRoot}/android/manifest.json`,
    `${platformRoot}/android/res/values/lk_brand_colors.xml`,
    `${platformRoot}/web/manifest.json`,
  ];
  for (const relativePath of required) assert(generated.has(relativePath), `Missing required platform output: ${relativePath}`);

  for (const [relativePath, contents] of generated) {
    const text = contents.toString('utf8');
    assert(!text.includes('\r'), `${relativePath} must use LF line endings.`);
    if (relativePath.endsWith('.json')) {
      parseJson(contents, relativePath);
      continue;
    }
    if (relativePath.endsWith('.xml')) {
      assert(text.startsWith(xmlHeader()), `${relativePath} must include an XML declaration.`);
      assert(!/<text\b/i.test(text), `${relativePath} must not contain runtime text.`);
      if (relativePath.includes('/drawable/')) {
        assert(/<vector\b/.test(text) && /<\/vector>\s*$/.test(text), `${relativePath} must contain one VectorDrawable root.`);
        assert(/xmlns:android="http:\/\/schemas\.android\.com\/apk\/res\/android"/.test(text), `${relativePath} is missing the Android namespace.`);
        assert((text.match(/<path\b/g) || []).length > 0, `${relativePath} must contain vector paths.`);
        assert(!/android:(?:tint|autoMirrored)=/.test(text), `${relativePath} must not tint or mirror brand artwork.`);
      }
    }
  }

  const platformManifest = parseJson(generated.get(`${platformRoot}/manifest.json`), 'platform manifest');
  assert(
    platformManifest.source.constructionManifest.distribution === 'repository-root-only',
    'Platform manifest must identify the construction manifest as repository-root-only.',
  );
  assert(
    platformManifest.source.constructionManifest.resolvableInPackage === false,
    'Platform manifest must not imply the construction manifest ships in packages.',
  );
  assert(platformManifest.source.governance.resolvableInPackage === false, 'Platform manifest must not imply governance docs ship in packages.');
  assertEqualJson(platformManifest.brandStandard, brandStandard, 'platform brand-standard snapshot');

  const figma = parseJson(generated.get(`${platformRoot}/figma/import-manifest.json`), 'Figma import manifest');
  assert(figma.integration.liveSync === false, 'Figma manifest must not claim live synchronization.');
  assert(figma.integration.uploadStatus === 'not-attempted', 'Figma manifest must report the honest upload state.');
  assert(figma.integration.approvalStatus === 'not-recorded', 'Figma manifest must not claim approval.');
  assertPlatformMeasurementUnits(figma, 'figma');
  assertEqualJson(figma.brandStandard, brandStandard, 'Figma brand-standard snapshot');

  const ios = parseJson(generated.get(`${platformRoot}/ios/manifest.json`), 'iOS manifest');
  assert(ios.assets.length === sourceAssets.filter((item) => item.platforms.ios).length, 'iOS manifest asset count drifted.');
  assertPlatformMeasurementUnits(ios, 'ios');
  assertEqualJson(ios.brandStandard, brandStandard, 'iOS brand-standard snapshot');
  assert(!ios.assets.some((item) => item.id === 'favicon'), 'Browser favicon must not ship in the iOS asset catalog.');
  assert(
    ios.excludedAssets.some((item) => item.id === 'favicon' && item.reason.includes('Browser favicon only')),
    'iOS manifest must explain the browser-favicon exclusion.',
  );
  for (const item of ios.assets) {
    assert(item.sourceSha256 === item.copiedSvgSha256, `iOS imageset ${item.imagesetName} lost source fidelity.`);
  }

  const android = parseJson(generated.get(`${platformRoot}/android/manifest.json`), 'Android manifest');
  assert(android.assets.length === sourceAssets.filter((item) => item.platforms.android).length, 'Android manifest asset count drifted.');
  assert(android.delivery.autoMirrored === false, 'Android contract must prohibit brand mirroring.');
  assertPlatformMeasurementUnits(android, 'android');
  assertEqualJson(android.brandStandard, brandStandard, 'Android brand-standard snapshot');
  assert(
    android.excludedAssets.some((item) => item.id === 'favicon' && item.reason.includes('Browser favicon only')),
    'Android manifest must explain the browser-favicon exclusion.',
  );
  for (const assetRecord of android.assets) {
    const source = sourceAssets.find((item) => item.id === assetRecord.id);
    assert(source, `Android manifest references unknown source asset ${assetRecord.id}.`);
    const { widthDp, heightDp } = assetRecord.intrinsicSize;
    assert(Number.isFinite(widthDp) && widthDp > 0, `Android ${assetRecord.id} intrinsic width must be positive.`);
    assert(Number.isFinite(heightDp) && heightDp > 0, `Android ${assetRecord.id} intrinsic height must be positive.`);
    const minimumSlotWidth = assetRecord.minimumRequiredSlotWidth?.value;
    if (minimumSlotWidth !== undefined) {
      assert(
        widthDp >= minimumSlotWidth,
        `Android ${assetRecord.id} intrinsic width ${widthDp}dp is below its ${minimumSlotWidth}dp minimum slot.`,
      );
    }
    assertAndroidRatiosAgree(
      widthDp,
      heightDp,
      source.viewBox.width,
      source.viewBox.height,
      `Android ${assetRecord.id} manifest intrinsic/viewBox ratio`,
    );

    const vector = generated.get(assetRecord.vectorDrawablePath)?.toString('utf8');
    assert(vector, `Missing Android VectorDrawable ${assetRecord.vectorDrawablePath}.`);
    const vectorTag = vector.match(/<vector\b[^>]*>/)?.[0];
    assert(vectorTag, `${assetRecord.vectorDrawablePath} is missing its vector root.`);
    const xmlWidthDp = androidDpAttribute(vectorTag, 'android:width', assetRecord.vectorDrawablePath);
    const xmlHeightDp = androidDpAttribute(vectorTag, 'android:height', assetRecord.vectorDrawablePath);
    const viewportWidth = numberAttribute(vectorTag, 'android:viewportWidth', undefined, assetRecord.vectorDrawablePath);
    const viewportHeight = numberAttribute(vectorTag, 'android:viewportHeight', undefined, assetRecord.vectorDrawablePath);
    assert(xmlWidthDp === widthDp, `${assetRecord.vectorDrawablePath} intrinsic width drifted from its manifest.`);
    assert(xmlHeightDp === heightDp, `${assetRecord.vectorDrawablePath} intrinsic height drifted from its manifest.`);
    if (minimumSlotWidth !== undefined) {
      assert(
        xmlWidthDp >= minimumSlotWidth,
        `${assetRecord.vectorDrawablePath} intrinsic width ${xmlWidthDp}dp is below its ${minimumSlotWidth}dp minimum slot.`,
      );
    }
    assertAndroidRatiosAgree(
      xmlWidthDp,
      xmlHeightDp,
      viewportWidth,
      viewportHeight,
      `${assetRecord.vectorDrawablePath} intrinsic/viewport ratio`,
    );
  }

  const web = parseJson(generated.get(`${platformRoot}/web/manifest.json`), 'web manifest');
  assert(web.delivery.assetsCopied === false, 'Web contract must reference canonical SVGs without shadow copies.');
  assert(web.assets.every((item) => item.integrity.startsWith('sha256-')), 'Web assets must include SRI-compatible hashes.');
  assertPlatformMeasurementUnits(web, 'web');
  assertEqualJson(web.brandStandard, brandStandard, 'Web brand-standard snapshot');
}

function assertEqualJson(actual, expected, label) {
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} drifted: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`,
  );
}

function assertPlatformMeasurementUnits(manifest, platform) {
  const expectedUnit = platformLogicalUnits[platform];
  assert(manifest.measurementUnit === expectedUnit, `${platform} measurement-unit declaration drifted.`);
  for (const assetRecord of manifest.assets) {
    for (const [name, measurement] of Object.entries(assetRecord)) {
      if (!measurement || typeof measurement !== 'object' || !('axis' in measurement)) continue;
      assert(
        measurement.unit === expectedUnit,
        `${platform} ${assetRecord.id} ${name} must use ${expectedUnit}, received ${measurement.unit}.`,
      );
    }
  }
}

function androidDpAttribute(tag, name, sourcePath) {
  const raw = requiredAttribute(tag, name, sourcePath);
  assert(raw.endsWith('dp'), `${sourcePath} ${name} must use dp.`);
  const value = Number(raw.slice(0, -2));
  assert(Number.isFinite(value) && value > 0, `${sourcePath} ${name} must be a positive dp value.`);
  return value;
}

function assertAndroidRatiosAgree(width, height, viewBoxWidth, viewBoxHeight, label) {
  const intrinsicRatio = width / height;
  const viewBoxRatio = viewBoxWidth / viewBoxHeight;
  const roundingTolerance = (0.5 * 10 ** -androidIntrinsicPrecision) / height;
  const floatingPointTolerance = Number.EPSILON * Math.max(1, Math.abs(viewBoxRatio)) * 4;
  assert(
    Math.abs(intrinsicRatio - viewBoxRatio) <= roundingTolerance + floatingPointTolerance,
    `${label} drifted: intrinsic ${intrinsicRatio}, viewBox ${viewBoxRatio}.`,
  );
}

async function writeOrCheckGeneratedFiles() {
  const expectedPaths = new Set(generated.keys());
  const existingPaths = new Set(await listFiles(path.join(root, platformRoot)));
  const stale = [];
  for (const [relativePath, expected] of generated) {
    let actual;
    try {
      actual = await readFile(path.join(root, relativePath));
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
    if (!actual || !actual.equals(expected)) stale.push(relativePath);
  }
  const unexpected = [...existingPaths].filter((relativePath) => !expectedPaths.has(relativePath)).sort();

  if (checkOnly) {
    if (stale.length || unexpected.length) {
      const rows = [
        ...stale.map((file) => `- stale or missing: ${file}`),
        ...unexpected.map((file) => `- unexpected: ${file}`),
      ];
      throw new Error(`Brand platform outputs have drifted. Run npm run generate:brand-platforms.\n${rows.join('\n')}`);
    }
    return;
  }

  for (const relativePath of unexpected) await unlink(path.join(root, relativePath));
  await removeEmptyDirectories(path.join(root, platformRoot));
  for (const [relativePath, contents] of generated) {
    const absolutePath = path.join(root, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, contents);
  }
}

async function listFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  const rows = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) rows.push(...await listFiles(absolutePath));
    else rows.push(toPosix(path.relative(root, absolutePath)));
  }
  return rows.sort();
}

async function removeEmptyDirectories(directory, isRoot = true) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) await removeEmptyDirectories(path.join(directory, entry.name), false);
  }
  if (!isRoot && (await readdir(directory)).length === 0) await rmdir(directory);
}

async function readFileFromRoot(relativePath) {
  try {
    return await readFile(path.join(root, relativePath));
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`Missing canonical brand source: ${relativePath}`);
    throw error;
  }
}

function parseJson(buffer, sourcePath) {
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    throw new Error(`${sourcePath} is not valid JSON: ${error.message}`);
  }
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function xmlHeader() {
  return '<?xml version="1.0" encoding="utf-8"?>\n';
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function pointString(point) {
  return `${formatNumber(point.x)},${formatNumber(point.y)}`;
}

function formatNumber(value) {
  const normalized = Math.abs(value) < 0.0000005 ? 0 : value;
  return Number(normalized.toFixed(6)).toString();
}

function round(value, digits) {
  return Number(value.toFixed(digits));
}

function toPosix(value) {
  return value.replaceAll(path.sep, '/');
}

function assertPositiveInteger(value, label) {
  assert(Number.isInteger(value) && value > 0, `${label} must be a positive integer.`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
