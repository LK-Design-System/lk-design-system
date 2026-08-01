import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { assertStorySortRootOrder } from './storybook-order.mjs';

const root = process.cwd();

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

function extractTitle(source, file) {
  const match = source.match(
    /(?:^|\r?\n)\s*(?:const\s+meta\s*=\s*|export\s+default\s*)\{\s*(?:id:\s*(?:'[^']*'|"[^"]*"),\s*)?title:\s*(['"])(.*?)\1/,
  );
  assert(match, `${file} is missing a Storybook meta title.`);
  return match[2];
}

async function storyExportExists(ref) {
  const [file, exportName] = ref.split('#');
  if (externalRoboticsStoryFiles?.has(file)) return true;
  if (!file || !exportName || !storyFiles.includes(file)) return false;
  const source = await read(file);
  return new RegExp(`export\\s+const\\s+${exportName}\\b`).test(source);
}

const classification = JSON.parse(await read('docs/references/wds/LAYER_CLASSIFICATION.json'));
const tokenMap = JSON.parse(await read('docs/references/wds/TOKEN_MAP.json'));
const coverageAudit = JSON.parse(await read('docs/references/wds/COVERAGE_AUDIT.json'));
const coverageDetailAudit = JSON.parse(await read('docs/references/wds/COVERAGE_DETAIL_AUDIT.json'));
const foundationAudit = JSON.parse(await read('docs/references/wds/FOUNDATION_AUDIT.json'));
const foundationSourcePdfs = JSON.parse(await read('docs/references/wds/FOUNDATION_SOURCE_PDFS.json'));
const componentSourcePdfs = JSON.parse(await read('docs/references/wds/COMPONENT_SOURCE_PDFS.json'));
const figmaNodeAuditQueue = JSON.parse(await read('docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json'));
const completionGate = JSON.parse(await read('docs/references/wds/COVERAGE_COMPLETION_GATE.json'));
const publicExportClassification = JSON.parse(await read('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'));
const storybookIaAudit = JSON.parse(await read('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json'));
const variantAuditChecklist = JSON.parse(await read('docs/references/wds/VARIANT_AUDIT_CHECKLIST.json'));
const iconManifest = JSON.parse(await read('assets/icons/manifest.json'));
const roboticsExternalSurface = JSON.parse(await read('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json'));
const storyFiles = await collect('stories', (rel) => rel.endsWith('.stories.jsx'));
const externalRoboticsStoryFiles = new Set(
  Object.entries(classification.storyTitles)
    .filter(([, title]) => title.startsWith('LDS Robotics/'))
    .map(([file]) => file),
);
const expectedStoryFiles = Object.keys(classification.storyTitles)
  .filter((file) => !externalRoboticsStoryFiles.has(file))
  .sort();

const missing = storyFiles.filter((file) => !expectedStoryFiles.includes(file));
const stale = expectedStoryFiles.filter((file) => !storyFiles.includes(file));
assert(missing.length === 0, `WDS layer classification is missing story files:\n${missing.join('\n')}`);
assert(stale.length === 0, `WDS layer classification references missing story files:\n${stale.join('\n')}`);

const allowedPrefixes = classification.allowedTitlePrefixes || [];
const expectedOwnerLayers = {
  core: 'LDS Core',
  theme: 'LDS Theme',
  product: 'LDS Product',
  robotics: 'LDS Robotics',
};
const configuredOwnerLayers = classification.ownerLayers || {};
const allowedOwnerLayers = new Set(Object.keys(expectedOwnerLayers));
const ownerLayerFailures = [];
const expectedProvenanceAuthority = 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json#provenanceLegend';
const storyLayerExceptions = (
  classification.storyLayerExceptions
  && typeof classification.storyLayerExceptions === 'object'
  && !Array.isArray(classification.storyLayerExceptions)
) ? classification.storyLayerExceptions : {};
if (classification.provenanceAuthority !== expectedProvenanceAuthority) {
  ownerLayerFailures.push(
    `provenanceAuthority must be "${expectedProvenanceAuthority}"; found "${String(classification.provenanceAuthority)}"`,
  );
}
if (Object.hasOwn(classification, 'layers')) {
  ownerLayerFailures.push('Legacy layers.* Storybook-prefix mappings conflate provenance with runtime ownership; use ownerLayers and provenanceAuthority.');
}
if (classification.storyLayerExceptions !== undefined && storyLayerExceptions !== classification.storyLayerExceptions) {
  ownerLayerFailures.push('storyLayerExceptions must be an object keyed by Storybook source file.');
}
for (const [ownerLayer, storybookPrefix] of Object.entries(expectedOwnerLayers)) {
  if (configuredOwnerLayers[ownerLayer] !== storybookPrefix) {
    ownerLayerFailures.push(
      `${ownerLayer}: expected owner-layer Storybook prefix "${storybookPrefix}", found "${configuredOwnerLayers[ownerLayer]}"`,
    );
  }
  if (!allowedPrefixes.includes(`${storybookPrefix}/`)) {
    ownerLayerFailures.push(`${ownerLayer}: allowedTitlePrefixes is missing "${storybookPrefix}/"`);
  }
}
for (const ownerLayer of Object.keys(configuredOwnerLayers)) {
  if (!allowedOwnerLayers.has(ownerLayer)) ownerLayerFailures.push(`Unknown owner layer "${ownerLayer}"`);
}
assert(ownerLayerFailures.length === 0, `LDS owner-layer configuration failed:\n${ownerLayerFailures.join('\n')}`);

const titleFailures = [];
const actualStoryTitles = new Map();
for (const file of storyFiles) {
  const source = await read(file);
  const actual = extractTitle(source, file);
  actualStoryTitles.set(file, actual);
  const expected = classification.storyTitles[file];
  if (actual !== expected) titleFailures.push(`${file}: expected "${expected}", found "${actual}"`);
  if (!allowedPrefixes.some((prefix) => actual.startsWith(prefix))) {
    titleFailures.push(`${file}: title does not start with an allowed WDS/LK layer prefix: "${actual}"`);
  }
}
assert(titleFailures.length === 0, `Storybook WDS layer alignment failed:\n${titleFailures.join('\n')}`);

const cssSurface = [
  await read('tokens/color-atomic.css'),
  await read('tokens/color-semantic.css'),
  await read('tokens/color-components.css'),
  await read('tokens/spacing.css'),
  await read('tokens/components.css'),
].join('\n');
const tokenCssSurface = [
  await read('tokens/fonts.css'),
  await read('tokens/color-atomic.css'),
  await read('tokens/color-semantic.css'),
  await read('tokens/color-components.css'),
  await read('tokens/typography.css'),
  await read('tokens/spacing.css'),
  await read('tokens/grid.css'),
  await read('tokens/effects.css'),
  await read('tokens/components.css'),
  await read('tokens/base.css'),
].join('\n');

const sourceTokens = JSON.parse(await read('tokens/source.json'));
const cssRefs = [
  ...tokenMap.theme.map((item) => item.css),
  ...tokenMap.frame.map((item) => item.css),
].filter(Boolean);
const missingCssRefs = cssRefs.filter((css) => !cssSurface.includes(`${css}:`));
assert(missingCssRefs.length === 0, `WDS token map references CSS variables that are not defined:\n${missingCssRefs.join('\n')}`);

for (const key of ['frameSm', 'frameMd', 'frameLg', 'frameXl']) {
  assert(sourceTokens.primitive?.radius?.[key], `tokens/source.json is missing primitive.radius.${key}.`);
}

const audit = await read('docs/references/wds/CONFLICT_AUDIT.md');
for (const phrase of ['WDS Core', 'LK Theme Override', 'LK Robotics Extension', 'Token Vocabulary Drift']) {
  assert(audit.includes(phrase), `WDS conflict audit is missing phrase: ${phrase}`);
}

const preview = await read('.storybook/preview.jsx');
const localStoryLayers = new Set(
  [...actualStoryTitles.values()].map((title) => title.split('/')[0]),
);
const expectedStorySortRootOrder = allowedPrefixes
  .map((prefix) => prefix.replace(/\/$/, ''))
  .filter((layer) => localStoryLayers.has(layer));
assertStorySortRootOrder(preview, expectedStorySortRootOrder);

assert(
  coverageAudit.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS coverage audit source file key does not match layer classification.'
);

const allowedCoverageStatuses = new Set(Object.keys(coverageAudit.statusLegend || {}));
const coverageRows = (coverageAudit.pages || []).flatMap((page) =>
  (page.sections || []).map((section) => ({ page: page.wdsPage, ...section }))
);
assert(coverageRows.length > 0, 'WDS coverage audit has no section rows.');

const requiredCoverageRows = [
  '1 Theme / 1 Icon',
  '1 Theme / 2 Logo',
  '2 Element / 1 Basic',
  '2 Element / 2 Spacing',
  '2 Element / 3 Decorate',
  ...classification.wdsComponentSections.map((section) => `3 Component / ${section}`),
];
const coverageLabels = coverageRows.map((row) => `${row.page} / ${row.wdsSection}`);
const missingCoverageRows = requiredCoverageRows.filter((label) => !coverageLabels.includes(label));
assert(
  missingCoverageRows.length === 0,
  `WDS coverage audit is missing required source rows:\n${missingCoverageRows.join('\n')}`
);

const coverageFailures = [];
for (const row of coverageRows) {
  const label = `${row.page} / ${row.wdsSection}`;
  if (!allowedCoverageStatuses.has(row.status)) {
    coverageFailures.push(`${label}: unknown status "${row.status}"`);
  }
  if (row.status !== 'not-covered' && (!Array.isArray(row.ldsCoverage) || row.ldsCoverage.length === 0)) {
    coverageFailures.push(`${label}: covered/partial row has no LDS coverage references`);
  }
  for (const ref of row.ldsCoverage || []) {
    if (ref.endsWith('.stories.jsx') && !storyFiles.includes(ref)) {
      coverageFailures.push(`${label}: story coverage reference is missing: ${ref}`);
    } else if (!ref.endsWith('.stories.jsx')) {
      try {
        await stat(path.join(root, ref));
      } catch {
        coverageFailures.push(`${label}: coverage reference is missing: ${ref}`);
      }
    }
  }
}
assert(coverageFailures.length === 0, `WDS coverage audit failed:\n${coverageFailures.join('\n')}`);

const coveredFindings = coverageAudit.knownCoveredFindings || [];
assert(
  coveredFindings.some((finding) => finding.figmaNodeId === '16285:163253'),
  'WDS coverage audit is missing the confirmed mobile safe-area spacing finding for node 16285:163253.'
);

assert(
  figmaNodeAuditQueue.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS Figma node audit queue source file key does not match layer classification.'
);
const allowedQueueStatuses = new Set(Object.keys(figmaNodeAuditQueue.statusLegend || {}));
const queueRows = figmaNodeAuditQueue.queue || [];
assert(queueRows.length > 0, 'WDS Figma node audit queue has no rows.');

const coverageNodeIdsByLabel = new Map(coverageRows.map((row) => [`${row.page} / ${row.wdsSection}`, row.figmaNodeId]));
const knownFindingNodeIdsByLabel = new Map(coveredFindings.map((finding) => [finding.wdsSource, finding.figmaNodeId]));
const queueLabels = queueRows.map((row) => row.wdsSource);
const missingQueueRows = coverageLabels.filter((label) => !queueLabels.includes(label));
assert(
  missingQueueRows.length === 0,
  `WDS Figma node audit queue is missing section rows:\n${missingQueueRows.join('\n')}`
);

const queueFailures = [];
const queueIds = [];
for (const row of queueRows) {
  if (!row.id || !row.wdsSource) {
    queueFailures.push('Figma node audit queue row is missing id or wdsSource.');
    continue;
  }
  queueIds.push(row.id);
  if (!allowedQueueStatuses.has(row.status)) {
    queueFailures.push(`${row.id}: unknown queue status "${row.status}"`);
  }
  const expectedNodeId = coverageNodeIdsByLabel.get(row.wdsSource) || knownFindingNodeIdsByLabel.get(row.wdsSource);
  if (!expectedNodeId) {
    queueFailures.push(`${row.id}: wdsSource does not match a coverage row or known covered finding: ${row.wdsSource}`);
  } else if (row.figmaNodeId !== expectedNodeId) {
    queueFailures.push(`${row.id}: expected Figma node ${expectedNodeId}, found ${row.figmaNodeId}`);
  }
  if (!Array.isArray(row.localEvidence) || row.localEvidence.length === 0) {
    queueFailures.push(`${row.id}: no local evidence listed`);
  }
  for (const ref of row.localEvidence || []) {
    if (ref.endsWith('.stories.jsx')) {
      if (!storyFiles.includes(ref)) queueFailures.push(`${row.id}: story evidence is missing: ${ref}`);
    } else {
      try {
        await stat(path.join(root, ref));
      } catch {
        queueFailures.push(`${row.id}: local evidence is missing: ${ref}`);
      }
    }
  }
  if (!Array.isArray(row.closureCriteria) || row.closureCriteria.length === 0) {
    queueFailures.push(`${row.id}: no closure criteria listed`);
  }
  if (row.status !== 'confirmed-covered' && (!Array.isArray(row.nextFigmaReads) || row.nextFigmaReads.length === 0)) {
    queueFailures.push(`${row.id}: pending row has no next Figma reads`);
  }
}
const duplicateQueueIds = queueIds.filter((id, index) => queueIds.indexOf(id) !== index);
if (duplicateQueueIds.length > 0) {
  queueFailures.push(`Duplicate WDS Figma node audit queue ids:\n${[...new Set(duplicateQueueIds)].join('\n')}`);
}
assert(queueFailures.length === 0, `WDS Figma node audit queue failed:\n${queueFailures.join('\n')}`);

assert(
  foundationAudit.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS foundation audit source file key does not match layer classification.'
);
const allowedFoundationStatuses = new Set(Object.keys(foundationAudit.statusLegend || {}));
const foundationRows = foundationAudit.foundations || [];
assert(foundationRows.length > 0, 'WDS foundation audit has no rows.');

const requiredFoundationRows = [
  '1 Theme / 1 Icon',
  '1 Theme / 2 Logo',
  '2 Element / 1 Basic / Color',
  '2 Element / 1 Basic / Typography',
  '2 Element / 1 Basic / Ratio',
  '2 Element / 2 Spacing / Base Scale',
  '2 Element / 2 Spacing / Status and Bottom',
  '2 Element / 1 Basic / Frame Radius',
  '2 Element / 3 Decorate / Effects',
  '2 Element / 3 Decorate / Gradient',
  '2 Element / 3 Decorate / Interaction',
  '2 Element / 2 Spacing / Grid',
  'Theme Modes / Light and Dark',
];
const foundationLabels = foundationRows.map((row) => row.wdsSource);
const missingFoundationRows = requiredFoundationRows.filter((label) => !foundationLabels.includes(label));
assert(
  missingFoundationRows.length === 0,
  `WDS foundation audit is missing required rows:\n${missingFoundationRows.join('\n')}`
);

const foundationFailures = [];
const foundationCssTokens = foundationRows.flatMap((row) => row.cssTokens || []);
const missingFoundationTokenMapRefs = cssRefs.filter((css) => !foundationCssTokens.includes(css));
if (missingFoundationTokenMapRefs.length > 0) {
  foundationFailures.push(
    `Foundation audit does not include TOKEN_MAP theme/frame CSS refs:\n${missingFoundationTokenMapRefs.join('\n')}`
  );
}
for (const row of foundationRows) {
  if (!allowedFoundationStatuses.has(row.status)) {
    foundationFailures.push(`${row.wdsSource}: unknown foundation status "${row.status}"`);
  }
  if (!Array.isArray(row.storyEvidence) || row.storyEvidence.length === 0) {
    foundationFailures.push(`${row.wdsSource}: no Storybook evidence listed`);
  }
  for (const ref of row.storyEvidence || []) {
    if (!(await storyExportExists(ref))) {
      foundationFailures.push(`${row.wdsSource}: Storybook evidence export is missing: ${ref}`);
    }
  }
  for (const ref of row.fileEvidence || []) {
    try {
      await stat(path.join(root, ref));
    } catch {
      foundationFailures.push(`${row.wdsSource}: file evidence is missing: ${ref}`);
    }
  }
  for (const css of row.cssTokens || []) {
    if (!tokenCssSurface.includes(`${css}:`)) {
      foundationFailures.push(`${row.wdsSource}: CSS token is missing: ${css}`);
    }
  }
}
assert(foundationFailures.length === 0, `WDS foundation audit failed:\n${foundationFailures.join('\n')}`);

const expectedFoundationPdfIds = ['basic-ratio', 'spacing-safe-area', 'decorate-gradient-interaction'];
const foundationPdfRows = foundationSourcePdfs.pdfs || [];
const foundationPdfFailures = [];
const foundationPdfIds = foundationPdfRows.map((row) => row.id);
const missingFoundationPdfRows = expectedFoundationPdfIds.filter((id) => !foundationPdfIds.includes(id));
if (missingFoundationPdfRows.length > 0) {
  foundationPdfFailures.push(`Foundation source PDF map is missing rows:\n${missingFoundationPdfRows.join('\n')}`);
}
for (const row of foundationPdfRows) {
  if (!row.id || !row.wdsSource || !row.file) {
    foundationPdfFailures.push('Foundation source PDF row is missing id, wdsSource, or file.');
    continue;
  }
  if (!row.file.endsWith('.pdf')) {
    foundationPdfFailures.push(`${row.id}: source file is not a PDF reference: ${row.file}`);
  }
  try {
    await stat(path.join(root, row.file));
  } catch {
    foundationPdfFailures.push(`${row.id}: source PDF file is missing: ${row.file}`);
  }
  if (!Array.isArray(row.extractedStructure) || row.extractedStructure.length === 0) {
    foundationPdfFailures.push(`${row.id}: extractedStructure is empty.`);
  }
  if (!Array.isArray(row.localEvidence) || row.localEvidence.length === 0) {
    foundationPdfFailures.push(`${row.id}: localEvidence is empty.`);
  }
  for (const ref of row.localEvidence || []) {
    if (ref.includes('#')) {
      if (!(await storyExportExists(ref))) {
        foundationPdfFailures.push(`${row.id}: Storybook evidence export is missing: ${ref}`);
      }
    } else {
      try {
        await stat(path.join(root, ref));
      } catch {
        foundationPdfFailures.push(`${row.id}: local evidence is missing: ${ref}`);
      }
    }
  }
}
const duplicateFoundationPdfIds = foundationPdfIds.filter((id, index) => foundationPdfIds.indexOf(id) !== index);
if (duplicateFoundationPdfIds.length > 0) {
  foundationPdfFailures.push(`Duplicate foundation source PDF ids:\n${[...new Set(duplicateFoundationPdfIds)].join('\n')}`);
}
assert(foundationPdfFailures.length === 0, `WDS foundation source PDF map failed:\n${foundationPdfFailures.join('\n')}`);

const expectedComponentPdfIds = ['layout-essential-divider', 'action-taxonomy'];
const componentPdfRows = componentSourcePdfs.pdfs || [];
const componentPdfFailures = [];
const componentPdfIds = componentPdfRows.map((row) => row.id);
const missingComponentPdfRows = expectedComponentPdfIds.filter((id) => !componentPdfIds.includes(id));
if (missingComponentPdfRows.length > 0) {
  componentPdfFailures.push(`Component source PDF map is missing rows:\n${missingComponentPdfRows.join('\n')}`);
}
for (const row of componentPdfRows) {
  if (!row.id || !row.wdsSource || !row.file) {
    componentPdfFailures.push('Component source PDF row is missing id, wdsSource, or file.');
    continue;
  }
  if (!row.file.endsWith('.pdf')) {
    componentPdfFailures.push(`${row.id}: source file is not a PDF reference: ${row.file}`);
  }
  try {
    await stat(path.join(root, row.file));
  } catch {
    componentPdfFailures.push(`${row.id}: source PDF file is missing: ${row.file}`);
  }
  if (!Array.isArray(row.extractedStructure) || row.extractedStructure.length === 0) {
    componentPdfFailures.push(`${row.id}: extractedStructure is empty.`);
  }
  if (!Array.isArray(row.localEvidence) || row.localEvidence.length === 0) {
    componentPdfFailures.push(`${row.id}: localEvidence is empty.`);
  }
  for (const ref of row.localEvidence || []) {
    if (ref.includes('#')) {
      if (!(await storyExportExists(ref))) {
        componentPdfFailures.push(`${row.id}: Storybook evidence export is missing: ${ref}`);
      }
    } else {
      try {
        await stat(path.join(root, ref));
      } catch {
        componentPdfFailures.push(`${row.id}: local evidence is missing: ${ref}`);
      }
    }
  }
}
const duplicateComponentPdfIds = componentPdfIds.filter((id, index) => componentPdfIds.indexOf(id) !== index);
if (duplicateComponentPdfIds.length > 0) {
  componentPdfFailures.push(`Duplicate component source PDF ids:\n${[...new Set(duplicateComponentPdfIds)].join('\n')}`);
}
assert(componentPdfFailures.length === 0, `WDS component source PDF map failed:\n${componentPdfFailures.join('\n')}`);

const iconComponentSource = await read('components/icon/Icon.jsx');
const iconNamesMatch = iconComponentSource.match(/export const ICON_NAMES = (\[[\s\S]*?\]);/);
assert(iconNamesMatch, 'components/icon/Icon.jsx is missing the generated ICON_NAMES array.');
const iconNames = JSON.parse(iconNamesMatch[1]);
const manifestNames = (iconManifest.icons || []).map((icon) => icon.name);
const iconFailures = [];
if (iconManifest.counts?.svgImported !== 339) {
  iconFailures.push(`Expected 339 imported WDS SVG icons, found ${iconManifest.counts?.svgImported}.`);
}
if (iconManifest.counts?.publicIconNames !== iconNames.length) {
  iconFailures.push(
    `Icon manifest publicIconNames ${iconManifest.counts?.publicIconNames} does not match ICON_NAMES ${iconNames.length}.`
  );
}
const missingManifestNames = iconNames.filter((name) => !manifestNames.includes(name));
const staleManifestNames = manifestNames.filter((name) => !iconNames.includes(name));
if (missingManifestNames.length > 0) {
  iconFailures.push(`ICON_NAMES entries are missing from assets/icons/manifest.json:\n${missingManifestNames.join('\n')}`);
}
if (staleManifestNames.length > 0) {
  iconFailures.push(`assets/icons/manifest.json entries are missing from ICON_NAMES:\n${staleManifestNames.join('\n')}`);
}
for (const icon of iconManifest.icons || []) {
  if (icon.assetPath) {
    try {
      await stat(path.join(root, icon.assetPath));
    } catch {
      iconFailures.push(`${icon.name}: icon asset is missing: ${icon.assetPath}`);
    }
  }
}
assert(iconFailures.length === 0, `WDS icon manifest failed:\n${iconFailures.join('\n')}`);

assert(
  coverageDetailAudit.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS coverage detail audit source file key does not match layer classification.'
);

const detailFamilies = coverageDetailAudit.families || [];
assert(detailFamilies.length > 0, 'WDS coverage detail audit has no family rows.');

const tokenMapFamilies = tokenMap.componentFamilies.map((family) => family.wds).sort();
const detailFamilyLabels = detailFamilies.map((family) => family.wdsFamily).sort();
const missingDetailFamilies = tokenMapFamilies.filter((family) => !detailFamilyLabels.includes(family));
const staleDetailFamilies = detailFamilyLabels.filter((family) => !tokenMapFamilies.includes(family));
assert(
  missingDetailFamilies.length === 0,
  `WDS coverage detail audit is missing TOKEN_MAP component families:\n${missingDetailFamilies.join('\n')}`
);
assert(
  staleDetailFamilies.length === 0,
  `WDS coverage detail audit has families not present in TOKEN_MAP:\n${staleDetailFamilies.join('\n')}`
);

const allowedDetailStatuses = new Set(Object.keys(coverageDetailAudit.statusLegend || {}));
const publicIndex = await read('src/index.js');
const roboticsEntry = await read('src/robotics.js');
const directPublicExportRows = [...publicIndex.matchAll(/export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)].flatMap(
  (match) => match[1].split(',').map((part) => ({
    name: part.trim().split(/\s+as\s+/).pop().trim(),
    source: path.posix.normalize(path.posix.join('src', match[2])),
  })),
);
assert(roboticsExternalSurface.package?.name === '@lk-design-system/lds-robotics-ui', 'Robotics external surface must identify the published robotics package.');
assert(
  !/export\s+\*\s+from\s+['"]@lk-design-system\/lds-robotics-ui['"]/.test(publicIndex),
  'src/index.js must not load the separately published Robotics package.',
);
assert(
  /export\s+\*\s+from\s+['"]@lk-design-system\/lds-robotics-ui['"]/.test(roboticsEntry),
  'src/robotics.js must re-export the published Robotics package.',
);
const externalPublicExportRows = roboticsExternalSurface.entries.flatMap((entry) =>
  entry.exports.map((name) => ({ name, source: `${entry.source}.jsx` })),
);
const externalComponentFiles = new Set(externalPublicExportRows.map((row) => row.source));
const publicExportRows = [...directPublicExportRows, ...externalPublicExportRows];
const publicExportNames = publicExportRows.map((row) => row.name);
const detailFailures = [];
for (const family of detailFamilies) {
  if (!allowedDetailStatuses.has(family.status)) {
    detailFailures.push(`${family.wdsFamily}: unknown detail status "${family.status}"`);
  }
  if (!Array.isArray(family.components) || family.components.length === 0) {
    detailFailures.push(`${family.wdsFamily}: no component evidence rows`);
  }
  if (!Array.isArray(family.stories) || family.stories.length === 0) {
    detailFailures.push(`${family.wdsFamily}: no story evidence rows`);
  }

  for (const story of family.stories || []) {
    if (!storyFiles.includes(story) && !externalRoboticsStoryFiles.has(story)) {
      detailFailures.push(`${family.wdsFamily}: story evidence is missing: ${story}`);
    }
  }

  for (const component of [...(family.components || []), ...(family.extensionComponents || [])]) {
    if (!component.name || !component.file) {
      detailFailures.push(`${family.wdsFamily}: component evidence row is missing name or file`);
      continue;
    }
    try {
      await stat(path.join(root, component.file));
    } catch {
      if (!externalComponentFiles.has(component.file)) {
        detailFailures.push(`${family.wdsFamily}: component file is missing: ${component.file}`);
      }
    }
    if (component.publicExport && !publicExportNames.includes(component.name)) {
      detailFailures.push(`${family.wdsFamily}: public export is missing from src/index.js: ${component.name}`);
    }
    if (component.story && !storyFiles.includes(component.story) && !externalRoboticsStoryFiles.has(component.story)) {
      detailFailures.push(`${family.wdsFamily}: extension component story is missing: ${component.story}`);
    }
  }
}
assert(detailFailures.length === 0, `WDS coverage detail audit failed:\n${detailFailures.join('\n')}`);

assert(
  publicExportClassification.source?.entrypoint === 'src/index.js',
  'WDS public export classification must classify src/index.js.'
);
const expectedProvenances = new Set([
  'direct-wds',
  'wds-adjacent',
  'theme-override',
  'product-extension',
  'robotics-extension',
]);
const configuredProvenances = new Set(Object.keys(publicExportClassification.provenanceLegend || {}));
const missingProvenances = [...expectedProvenances].filter((value) => !configuredProvenances.has(value));
const unknownProvenances = [...configuredProvenances].filter((value) => !expectedProvenances.has(value));
assert(
  missingProvenances.length === 0 && unknownProvenances.length === 0,
  `WDS public export provenance legend is invalid:\nMissing: ${missingProvenances.join(', ') || 'none'}\nUnknown: ${unknownProvenances.join(', ') || 'none'}`,
);
const tokenMapCrosswalkFailures = [];
const allowedTokenMapCrosswalkKinds = new Set([
  'wds-family-crosswalk',
  'lds-extension-crosswalk',
]);
if (tokenMap.provenanceAuthority !== expectedProvenanceAuthority) {
  tokenMapCrosswalkFailures.push(
    `TOKEN_MAP provenanceAuthority must be "${expectedProvenanceAuthority}"; found "${String(tokenMap.provenanceAuthority)}"`,
  );
}
for (const family of tokenMap.componentFamilies || []) {
  if (Object.hasOwn(family, 'layer') || Object.hasOwn(family, 'provenance')) {
    tokenMapCrosswalkFailures.push(
      `${family.wds}: family crosswalk rows must not claim export ownership or provenance.`,
    );
  }
  if (!allowedTokenMapCrosswalkKinds.has(family.mappingKind)) {
    tokenMapCrosswalkFailures.push(
      `${family.wds}: unknown mappingKind "${String(family.mappingKind)}".`,
    );
  }
}
assert(
  tokenMapCrosswalkFailures.length === 0,
  `WDS TOKEN_MAP family crosswalk failed:\n${tokenMapCrosswalkFailures.join('\n')}`,
);
const exportGroups = publicExportClassification.groups || [];
assert(exportGroups.length > 0, 'WDS public export classification has no groups.');

const classifiedExportEntries = exportGroups.flatMap((group) =>
  (group.exports || []).map((name) => ({
    name,
    group: group.name,
    ownerLayer: group.ownerLayer,
    provenance: group.provenance,
  }))
);
const classifiedExportNames = classifiedExportEntries.map((entry) => entry.name);
const unclassifiedExports = publicExportNames.filter((name) => !classifiedExportNames.includes(name));
const staleClassifiedExports = classifiedExportNames.filter((name) => !publicExportNames.includes(name));
const duplicateClassifications = classifiedExportNames.filter((name, index) => classifiedExportNames.indexOf(name) !== index);
assert(
  unclassifiedExports.length === 0,
  `WDS public export classification is missing exports:\n${unclassifiedExports.join('\n')}`
);
assert(
  staleClassifiedExports.length === 0,
  `WDS public export classification references non-public exports:\n${staleClassifiedExports.join('\n')}`
);
assert(
  duplicateClassifications.length === 0,
  `WDS public export classification has duplicate exports:\n${[...new Set(duplicateClassifications)].join('\n')}`
);

const exportClassificationFailures = [];
const extensionProvenanceOwners = {
  'theme-override': 'theme',
  'product-extension': 'product',
  'robotics-extension': 'robotics',
};
for (const group of exportGroups) {
  if (!group.name) exportClassificationFailures.push('Export classification group is missing a name.');
  if (Object.hasOwn(group, 'layer') || Object.hasOwn(group, 'classification')) {
    exportClassificationFailures.push(`${group.name}: legacy layer/classification fields are not authoritative; use ownerLayer/provenance only`);
  }
  if (!allowedOwnerLayers.has(group.ownerLayer)) {
    exportClassificationFailures.push(`${group.name}: unknown ownerLayer "${group.ownerLayer}"`);
  }
  if (!expectedProvenances.has(group.provenance)) {
    exportClassificationFailures.push(`${group.name}: unknown provenance "${group.provenance}"`);
  }
  const requiredOwner = extensionProvenanceOwners[group.provenance];
  if (requiredOwner && group.ownerLayer !== requiredOwner) {
    exportClassificationFailures.push(
      `${group.name}: provenance "${group.provenance}" requires ownerLayer "${requiredOwner}", found "${group.ownerLayer}"`,
    );
  }
  if (!Array.isArray(group.exports) || group.exports.length === 0) {
    exportClassificationFailures.push(`${group.name}: no exports listed`);
  }
  if (!Array.isArray(group.storyEvidence) || group.storyEvidence.length === 0) {
    exportClassificationFailures.push(`${group.name}: no Storybook evidence listed`);
  }
  for (const story of group.storyEvidence || []) {
    if (!storyFiles.includes(story) && !externalRoboticsStoryFiles.has(story)) {
      exportClassificationFailures.push(`${group.name}: story evidence is missing: ${story}`);
      continue;
    }
    if (externalRoboticsStoryFiles.has(story)) continue;
    const ownerPrefix = configuredOwnerLayers[group.ownerLayer];
    const actualTitle = actualStoryTitles.get(story);
    if (ownerPrefix && !actualTitle?.startsWith(`${ownerPrefix}/`)) {
      exportClassificationFailures.push(
        `${group.name}: story evidence owner mismatch for ${story}; ownerLayer "${group.ownerLayer}" requires "${ownerPrefix}/", found "${actualTitle}"`,
      );
    }
  }
  if (group.wdsFamily && !tokenMapFamilies.includes(group.wdsFamily)) {
    exportClassificationFailures.push(`${group.name}: unknown WDS family "${group.wdsFamily}"`);
  }
}
assert(
  exportClassificationFailures.length === 0,
  `WDS public export classification failed:\n${exportClassificationFailures.join('\n')}`
);

const exportOwnerByName = new Map(
  classifiedExportEntries.map(({ name, ownerLayer }) => [name, ownerLayer]),
);
const storyLayerFailures = [];
const iaPageByStory = new Map();
for (const page of storybookIaAudit.pages || []) {
  const storyFile = typeof page?.importPath === 'string' ? page.importPath.replace(/^\.\//, '') : '';
  if (!storyFile) continue;
  if (iaPageByStory.has(storyFile)) {
    storyLayerFailures.push(`${storyFile}: Storybook IA contains more than one page for the same story source.`);
  }
  iaPageByStory.set(storyFile, page);
}

for (const [storyFile, exception] of Object.entries(storyLayerExceptions)) {
  if (externalRoboticsStoryFiles.has(storyFile)) continue;
  const iaPage = iaPageByStory.get(storyFile);
  if (!storyFiles.includes(storyFile)) {
    storyLayerFailures.push(`${storyFile}: story-layer exception references a missing story file.`);
  }
  if (!iaPage) {
    storyLayerFailures.push(`${storyFile}: story-layer exception is missing from the Storybook IA census.`);
  } else if (iaPage.primaryOwner !== exception?.primaryExport) {
    storyLayerFailures.push(
      `${storyFile}: exception primaryExport "${String(exception?.primaryExport)}" does not match IA primaryOwner "${String(iaPage.primaryOwner)}".`,
    );
  }
  if (!allowedOwnerLayers.has(exception?.storyOwnerLayer)) {
    storyLayerFailures.push(`${storyFile}: exception has invalid storyOwnerLayer "${String(exception?.storyOwnerLayer)}".`);
  }
  if (!allowedOwnerLayers.has(exception?.exportOwnerLayer)) {
    storyLayerFailures.push(`${storyFile}: exception has invalid exportOwnerLayer "${String(exception?.exportOwnerLayer)}".`);
  }
  const classifiedOwner = exportOwnerByName.get(exception?.primaryExport);
  if (classifiedOwner !== exception?.exportOwnerLayer) {
    storyLayerFailures.push(
      `${storyFile}: exception exportOwnerLayer "${String(exception?.exportOwnerLayer)}" does not match classified owner "${String(classifiedOwner)}" for ${String(exception?.primaryExport)}.`,
    );
  }
  if (typeof exception?.kind !== 'string' || exception.kind.trim() === '') {
    storyLayerFailures.push(`${storyFile}: exception kind must be a non-empty string.`);
  }
  if (typeof exception?.reason !== 'string' || exception.reason.trim().length < 24) {
    storyLayerFailures.push(`${storyFile}: exception reason must explain the cross-layer evidence surface.`);
  }
}

for (const [storyFile, page] of iaPageByStory) {
  if (externalRoboticsStoryFiles.has(storyFile)) continue;
  // The IA audit's own "Other" layer is the meta page: a cross-family entry
  // point like the directory, which sits under the LDS/ root rather than any
  // layer. It still names a primary owner (it renders with real components),
  // so without this it looked like a layer page whose title resolved nowhere.
  if (page.layer === 'Other') continue;
  const exportOwnerLayer = exportOwnerByName.get(page.primaryOwner);
  if (!exportOwnerLayer) continue;
  const title = actualStoryTitles.get(storyFile);
  const storyOwnerLayer = Object.entries(configuredOwnerLayers)
    .find(([, storybookPrefix]) => title?.startsWith(`${storybookPrefix}/`))?.[0];
  if (!storyOwnerLayer) {
    storyLayerFailures.push(`${storyFile}: cannot resolve a Storybook owner layer from title "${String(title)}".`);
    continue;
  }

  const exception = storyLayerExceptions[storyFile];
  if (storyOwnerLayer === exportOwnerLayer) {
    if (exception) {
      storyLayerFailures.push(
        `${storyFile}: story-layer exception is stale because ${page.primaryOwner} and the story both belong to ${storyOwnerLayer}.`,
      );
    }
    continue;
  }
  if (!exception) {
    storyLayerFailures.push(
      `${storyFile}: IA primary owner ${page.primaryOwner} belongs to ${exportOwnerLayer}, but the story belongs to ${storyOwnerLayer}; register a justified storyLayerExceptions entry or align the title.`,
    );
    continue;
  }
  if (exception.storyOwnerLayer !== storyOwnerLayer) {
    storyLayerFailures.push(
      `${storyFile}: exception storyOwnerLayer "${String(exception.storyOwnerLayer)}" does not match title owner "${storyOwnerLayer}".`,
    );
  }
  if (exception.primaryExport !== page.primaryOwner || exception.exportOwnerLayer !== exportOwnerLayer) {
    storyLayerFailures.push(
      `${storyFile}: exception does not match IA/export ownership (${page.primaryOwner}: ${exportOwnerLayer}).`,
    );
  }
}
assert(
  storyLayerFailures.length === 0,
  `Storybook runtime-owner alignment failed:\n${storyLayerFailures.join('\n')}`,
);

const publicComponentModulePaths = new Set(
  publicExportRows.map((row) => row.source).filter((source) => source.startsWith('components/')),
);
const componentJsModules = await collect('components', (rel) => rel.endsWith('.js') || rel.endsWith('.jsx'));
const expectedInternalComponentModules = componentJsModules.filter(
  (modulePath) => !publicComponentModulePaths.has(modulePath),
);
const internalModules = publicExportClassification.internalModules || [];
const internalModulePaths = internalModules.map((module) => module.path);
const missingInternalModules = expectedInternalComponentModules.filter(
  (modulePath) => !internalModulePaths.includes(modulePath),
);
const staleInternalModules = internalModules
  .filter((module) => (
    typeof module?.path === 'string'
    && !expectedInternalComponentModules.includes(module.path)
    && module.ownerLayer !== 'robotics'
  ))
  .map((module) => module.path);
const duplicateInternalModules = internalModulePaths.filter(
  (modulePath, index) => internalModulePaths.indexOf(modulePath) !== index,
);
const internalModuleFailures = [];
if (!Array.isArray(publicExportClassification.internalModules)) {
  internalModuleFailures.push('internalModules must be an array.');
}
for (const module of internalModules) {
  if (!module || typeof module.path !== 'string' || !module.path.startsWith('components/') || !/\.jsx?$/.test(module.path)) {
    internalModuleFailures.push(`Invalid internal component module path: ${JSON.stringify(module?.path)}`);
  }
  if (!allowedOwnerLayers.has(module?.ownerLayer)) {
    internalModuleFailures.push(`${module?.path || '<missing path>'}: unknown ownerLayer "${module?.ownerLayer}"`);
  }
}
if (missingInternalModules.length > 0) {
  internalModuleFailures.push(`Unclassified internal component modules:\n${missingInternalModules.join('\n')}`);
}
if (staleInternalModules.length > 0) {
  internalModuleFailures.push(`Stale internal component module classifications:\n${staleInternalModules.join('\n')}`);
}
if (duplicateInternalModules.length > 0) {
  internalModuleFailures.push(
    `Duplicate internal component module classifications:\n${[...new Set(duplicateInternalModules)].join('\n')}`,
  );
}
assert(
  internalModuleFailures.length === 0,
  `WDS internal component module classification failed:\n${internalModuleFailures.join('\n')}`,
);

assert(
  variantAuditChecklist.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS variant audit checklist source file key does not match layer classification.'
);
const allowedVariantStatuses = new Set(Object.keys(variantAuditChecklist.statusLegend || {}));
const variantFamilies = variantAuditChecklist.families || [];
const variantFamilyLabels = variantFamilies.map((family) => family.wdsFamily).sort();
const missingVariantFamilies = tokenMapFamilies.filter((family) => !variantFamilyLabels.includes(family));
const staleVariantFamilies = variantFamilyLabels.filter((family) => !tokenMapFamilies.includes(family));
assert(
  missingVariantFamilies.length === 0,
  `WDS variant audit checklist is missing TOKEN_MAP component families:\n${missingVariantFamilies.join('\n')}`
);
assert(
  staleVariantFamilies.length === 0,
  `WDS variant audit checklist has families not present in TOKEN_MAP:\n${staleVariantFamilies.join('\n')}`
);

const variantFailures = [];
const checkIds = [];
for (const family of variantFamilies) {
  if (!allowedVariantStatuses.has(family.status)) {
    variantFailures.push(`${family.wdsFamily}: unknown variant checklist status "${family.status}"`);
  }
  if (!Array.isArray(family.checks) || family.checks.length === 0) {
    variantFailures.push(`${family.wdsFamily}: no variant checks listed`);
  }
  for (const check of family.checks || []) {
    if (!check.id || !check.label) {
      variantFailures.push(`${family.wdsFamily}: variant check is missing id or label`);
    }
    if (check.id) checkIds.push(check.id);
    if (!Array.isArray(check.wdsChecks) || check.wdsChecks.length === 0) {
      variantFailures.push(`${family.wdsFamily}/${check.id}: no WDS checks listed`);
    }
    if (!Array.isArray(check.localEvidence) || check.localEvidence.length === 0) {
      variantFailures.push(`${family.wdsFamily}/${check.id}: no local Storybook evidence listed`);
    }
    for (const ref of check.localEvidence || []) {
      if (!(await storyExportExists(ref))) {
        variantFailures.push(`${family.wdsFamily}/${check.id}: Storybook evidence export is missing: ${ref}`);
      }
    }
  }
}
const duplicateCheckIds = checkIds.filter((id, index) => checkIds.indexOf(id) !== index);
if (duplicateCheckIds.length > 0) {
  variantFailures.push(`Duplicate WDS variant checklist ids:\n${[...new Set(duplicateCheckIds)].join('\n')}`);
}
assert(variantFailures.length === 0, `WDS variant audit checklist failed:\n${variantFailures.join('\n')}`);

assert(
  completionGate.source?.figmaFileKey === classification.source?.figmaFileKey,
  'WDS coverage completion gate source file key does not match layer classification.'
);
const gateFailures = [];
const allowedClaimStatuses = new Set(['not-ready', 'ready']);
const allowedGateStatuses = new Set(['met', 'met-local-pending-figma', 'not-met']);
if (!allowedClaimStatuses.has(completionGate.claimStatus)) {
  gateFailures.push(`Unknown coverage completion claimStatus: ${completionGate.claimStatus}`);
}
for (const gate of completionGate.localEvidenceGates || []) {
  if (!gate.id || !gate.evidence || !gate.criteria) {
    gateFailures.push('Coverage completion gate row is missing id, evidence, or criteria.');
    continue;
  }
  if (!allowedGateStatuses.has(gate.status)) {
    gateFailures.push(`${gate.id}: unknown local evidence gate status "${gate.status}"`);
  }
  try {
    await stat(path.join(root, gate.evidence));
  } catch {
    gateFailures.push(`${gate.id}: evidence file is missing: ${gate.evidence}`);
  }
}
const pendingCoverageRows = coverageRows.filter((row) => ['partial', 'needs-detail-audit', 'not-covered'].includes(row.status));
const pendingFoundationRows = foundationRows.filter((row) => row.status === 'pending-figma-parity');
const pendingVariantFamilies = variantFamilies.filter((family) => family.status === 'pending-figma-parity');
const pendingQueueRows = queueRows.filter((row) => row.status !== 'confirmed-covered');
const requiredExternalFigmaReads = queueRows.reduce((total, row) => total + (row.nextFigmaReads || []).length, 0);
const expectedGateCounts = {
  coverageRows: coverageRows.length,
  foundationRows: foundationRows.length,
  figmaNodeQueueRows: queueRows.length,
  confirmedFigmaNodeRows: queueRows.length - pendingQueueRows.length,
  pendingFigmaNodeRows: pendingQueueRows.length,
  requiredExternalFigmaReads,
  componentFamilyRows: detailFamilies.length,
  variantChecks: checkIds.length,
  publicExportsClassified: publicExportNames.length,
};
for (const [key, expected] of Object.entries(expectedGateCounts)) {
  if (completionGate.currentCounts?.[key] !== expected) {
    gateFailures.push(`${key}: completion gate count ${completionGate.currentCounts?.[key]} does not match actual ${expected}`);
  }
}
const hasUnresolvedParity =
  pendingCoverageRows.length > 0 ||
  pendingFoundationRows.length > 0 ||
  pendingVariantFamilies.length > 0 ||
  pendingQueueRows.length > 0;
if (hasUnresolvedParity && completionGate.claimStatus !== 'not-ready') {
  gateFailures.push('Coverage completion gate must stay `not-ready` while WDS parity rows are unresolved.');
}
if (!hasUnresolvedParity && completionGate.claimStatus !== 'ready') {
  gateFailures.push('Coverage completion gate can be `ready` only after every WDS parity row is resolved.');
}
if (completionGate.claimStatus === 'not-ready' && (!Array.isArray(completionGate.notReadyReasons) || completionGate.notReadyReasons.length === 0)) {
  gateFailures.push('Coverage completion gate is not-ready but has no notReadyReasons.');
}
for (const command of [
  'node scripts/check-wds-alignment.mjs',
  'node scripts/check-token-source.mjs',
  'node scripts/check-visual-token-drift.mjs',
  'pnpm exec storybook build',
]) {
  if (!completionGate.lastVerifiedCommands?.includes(command)) {
    gateFailures.push(`Coverage completion gate is missing verified command: ${command}`);
  }
}
assert(gateFailures.length === 0, `WDS coverage completion gate failed:\n${gateFailures.join('\n')}`);

console.log(
  `Validated WDS alignment: ${storyFiles.length} story titles, ${Object.keys(storyLayerExceptions).length} explicit story-layer exceptions, ${cssRefs.length} token map refs, ${tokenMap.componentFamilies.length} component-family mappings, ${coverageRows.length} coverage rows, ${foundationRows.length} foundation rows, ${foundationPdfRows.length} foundation PDF rows, ${componentPdfRows.length} component PDF rows, ${queueRows.length} Figma node queue rows, ${detailFamilies.length} detail families, ${publicExportNames.length} public exports, ${expectedInternalComponentModules.length} internal component modules, ${iconNames.length} icons, ${checkIds.length} variant checks, completion gate ${completionGate.claimStatus}.`
);
