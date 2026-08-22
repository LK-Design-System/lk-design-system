import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export const CATEGORIES = [
  'profile-token-automatic',
  'explicit-size-density',
  'fixed',
  'not-applicable',
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = 'docs/references/architecture/DENSITY_COVERAGE_CONTRACT.json';
const schemaPath = 'docs/references/architecture/DENSITY_COVERAGE_CONTRACT.schema.json';
const componentRegistryPath = 'docs/components/component-content.json';
const profileContractPath = 'docs/references/architecture/EXPRESSION_PROFILE_CONTRACT.json';
const nextReview = '2026-11-22';

// These are owner decisions, not heuristics. New public IDs intentionally fail the update
// command until an owner adds them to exactly one curated rule below.
const EXPLICIT_AXIS_RULES = new Map([
  ['brand-logo', ['size']],
  ['product-lockup', ['compact']],
  ['action-area', ['compact']],
  ['button', ['size']],
  ['button-group', ['size']],
  ['copy-button', ['size']],
  ['fab', ['size']],
  ['icon-button', ['size']],
  ['split-button', ['size']],
  ['text-button', ['size']],
  ['toggle-icon', ['size']],
  ['card', ['padding', 'density']],
  ['feature-card', ['density']],
  ['conversation-message', ['density']],
  ['message-composer', ['density']],
  ['message-feed', ['density']],
  ['bookmark', ['size']],
  ['collapsible', ['density']],
  ['content-badge', ['size']],
  ['list-cell', ['verticalPadding']],
  ['log-viewer', ['density']],
  ['reaction-bar', ['size']],
  ['record-header', ['size']],
  ['reorder-list', ['density']],
  ['stat-list', ['size']],
  ['tooltip', ['size']],
  ['data-export-action', ['size']],
  ['data-grid', ['size']],
  ['data-toolbar', ['size']],
  ['donut-chart', ['size']],
  ['filter-bar', ['size']],
  ['legend', ['size']],
  ['refresh-control', ['size']],
  ['saved-view-control', ['size']],
  ['get-table-data-cell-style', ['size']],
  ['visibility-manager', ['density']],
  ['canvas-editor-command-bar', ['size']],
  ['history-toolbar', ['size']],
  ['avatar', ['size']],
  ['avatar-group', ['size']],
  ['chip', ['size']],
  ['rating', ['size']],
  ['tag', ['size']],
  ['auto-complete', ['size']],
  ['checkbox', ['size']],
  ['checkbox-group', ['size']],
  ['color-swatch', ['size']],
  ['combobox', ['size']],
  ['date-picker', ['size']],
  ['date-range-field', ['size']],
  ['field-action', ['size']],
  ['file-upload', ['size']],
  ['input', ['size']],
  ['input-group', ['size']],
  ['number-field', ['size']],
  ['password-input', ['size']],
  ['pin-input', ['size']],
  ['radio', ['size']],
  ['radio-group', ['size']],
  ['search-field', ['size']],
  ['secret-field', ['size']],
  ['select', ['size']],
  ['textarea', ['size']],
  ['time-picker', ['size']],
  ['icon', ['size']],
  ['container', ['size']],
  ['page-header', ['size']],
  ['spacer', ['size']],
  ['category', ['size', 'padding', 'verticalPadding']],
  ['floor-selector', ['size']],
  ['footer', ['compact']],
  ['page-indicator', ['size']],
  ['tabs', ['size', 'padding']],
  ['drawer', ['density']],
  ['dropdown-menu', ['density', 'cellPadding', 'verticalPadding']],
  ['battery-gauge', ['size']],
  ['connection-badge', ['size']],
  ['choice-card', ['padding']],
  ['filter-chip', ['size']],
  ['icon-picker', ['size']],
  ['multi-select-chip', ['size']],
  ['segmented-control', ['size']],
  ['stepper', ['size']],
  ['switch', ['size']],
  ['theme-toggle', ['size']],
  ['toggle-button', ['size']],
  ['callout', ['density']],
  ['circular-progress', ['size']],
  ['meter', ['size']],
  ['progress-bar', ['size']],
  ['spinner', ['size']],
  ['telemetry-gauge', ['size']],
  ['telemetry-value', ['size']],
]);

const PROFILE_TOKEN_AUTOMATIC_IDS = new Set([
  'searchable-multi-select',
  'side-nav',
  'toolbar',
  'top-bar',
  'tree',
  'user-menu',
  'virtual-keypad',
]);

const FIXED_IDS = new Set([
  'lockup',
  'link',
  'social-button',
  'speed-dial',
  'checklist-item',
  'feed-card',
  'listing-card',
  'metric-card',
  'news-card',
  'product-card',
  'spec-row',
  'stat',
  'accordion',
  'blockquote',
  'bubble',
  'code',
  'connection-row',
  'content-editor',
  'divider',
  'expandable-text',
  'kbd',
  'overline',
  'prose',
  'source-disclosure',
  'source-tag',
  'status-badge',
  'status-indicator',
  'step-list',
  'thumbnail',
  'timeline',
  'annotated-image',
  'bar-chart',
  'calendar',
  'carousel',
  'chart-frame',
  'data-collection-panel',
  'description-list',
  'file-browser',
  'line-chart',
  'network-graph',
  'resource-state',
  'sparkline',
  'tree-picker',
  'canvas-editor-shell',
  'editor-toolbar',
  'layer-panel',
  'selection-inspector',
  'viewport-status-bar',
  'badge',
  'notification',
  'push-badge',
  'file-upload-queue',
  'form-field',
  'property-field',
  'range-slider',
  'slider',
  'tag-input',
  'validation-summary',
  'dashboard-shell',
  'dock-panel',
  'anchor',
  'bottom-nav',
  'breadcrumb',
  'language-switcher',
  'menubar',
  'nav-rail',
  'pagination',
  'steps',
  'wizard',
  'alert',
  'command-palette',
  'confirm-dialog',
  'dimmer',
  'hover-card',
  'lightbox',
  'modal',
  'popover',
  'sheet',
  'snackbar',
  'toast',
  'toast-stack',
  'equipment-status-card',
  'wheel-picker',
  'banner',
  'empty-state',
  'overlay-status-chip',
  'skeleton',
  'elevator-fleet-overview',
  'map2-dcanvas',
  'scene3-dframe',
  'video-stream-tile',
  'viewer-frame',
  'viewer-toolbar',
]);

const NOT_APPLICABLE_RULES = new Map([
  ['aspect-ratio', 'layout-primitive'],
  ['center', 'layout-primitive'],
  ['cluster', 'layout-primitive'],
  ['col', 'layout-primitive'],
  ['columns', 'layout-primitive'],
  ['dashboard-grid', 'layout-primitive'],
  ['grid', 'layout-primitive'],
  ['mobile-system-bars', 'layout-primitive'],
  ['primary-detail', 'layout-primitive'],
  ['scroll-area', 'layout-primitive'],
  ['section', 'layout-primitive'],
  ['split', 'layout-primitive'],
  ['stack', 'layout-primitive'],
  ['visually-hidden', 'non-visual-utility'],
  ['create-local-storage-manager', 'runtime-entry'],
]);

const NON_GEOMETRY_PROFILE_TOKENS = new Set([
  '--dur-fast',
  '--dur-base',
  '--dur-slow',
  '--duration-fast',
  '--duration-normal',
  '--duration-slow',
  '--shadow-sm',
  '--shadow-md',
]);

// Explicit evidence exceptions cover component-token aliases and direct source tokens
// introduced in the same R3A change before component-content.json is regenerated.
// They are evidence-only: categoryFor() still requires a separate curated owner decision.
const PROFILE_TOKEN_EVIDENCE_EXCEPTIONS = new Map([
  ['card', ['--shadow-sm', '--shadow-md']],
  ['chart-frame', ['--shadow-sm']],
  ['data-collection-panel', ['--shadow-sm']],
  ['get-table-data-cell-style', [
    '--component-table-cell-padding-sm',
    '--component-table-cell-padding-md',
  ]],
  ['data-grid', [
    '--component-data-grid-cell-padding-sm',
    '--component-data-grid-cell-padding-md',
    '--component-data-grid-header-height-sm',
    '--component-data-grid-header-height-md',
    '--component-data-grid-detail-padding-sm',
    '--component-data-grid-detail-padding-md',
  ]],
  ['list-cell', [
    '--component-list-cell-padding-y-sm',
    '--component-list-cell-padding-y-md',
    '--component-list-cell-padding-y-lg',
  ]],
  ['tree', [
    '--component-tree-row-min-height',
    '--component-tree-row-padding-y',
    '--component-tree-row-padding-x',
    '--component-tree-row-gap',
    '--component-tree-indent',
  ]],
  ['side-nav', [
    '--component-side-nav-padding',
    '--component-side-nav-item-height',
    '--component-side-nav-item-padding-y',
    '--component-side-nav-item-padding-x',
    '--component-side-nav-child-item-height',
    '--component-side-nav-child-item-padding-y',
  ]],
  ['toolbar', [
    '--component-toolbar-gap',
    '--component-toolbar-padding',
  ]],
  ['top-bar', [
    '--component-menu-gap',
    '--component-menu-padding-y',
    '--component-menu-item-min-height',
    '--component-menu-item-padding-y',
    '--component-menu-item-padding-x',
  ]],
  ['drawer', [
    '--component-drawer-header-padding-comfortable',
    '--component-drawer-header-padding-compact',
    '--component-drawer-body-padding-comfortable',
    '--component-drawer-body-padding-compact',
    '--component-drawer-footer-padding-comfortable',
    '--component-drawer-footer-padding-compact',
  ]],
]);

const NOT_APPLICABLE_POLICY = {
  'layout-primitive': {
    rationale: '범용 layout primitive는 제품이 전달한 관계와 배치를 표현하며 component-level density policy를 소유하지 않는다.',
    reviewTrigger: '공개 계약이 component-owned visual geometry 또는 interactive target을 직접 소유하도록 바뀔 때',
  },
  'non-visual-utility': {
    rationale: '접근성 전용 비시각 utility에는 visual density가 적용되지 않는다.',
    reviewTrigger: '이 entry가 사용자에게 보이는 geometry를 직접 렌더링하도록 공개 계약이 바뀔 때',
  },
  'runtime-entry': {
    rationale: 'Theme runtime/provider entry는 profile 상태를 전달하지만 component-level visual density를 직접 렌더링하지 않는다.',
    reviewTrigger: 'runtime entry가 사용자에게 보이는 component geometry 또는 interactive target을 직접 소유하게 될 때',
  },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sourceFingerprint(value) {
  return sha256(JSON.stringify(value));
}

function ownerName(ownerLayer) {
  return `LDS ${ownerLayer[0].toUpperCase()}${ownerLayer.slice(1)} owner`;
}

function governanceFor(entry, category) {
  if (category === 'fixed') {
    return {
      owner: ownerName(entry.ownerLayer),
      rationale: '현재 공개 계약에는 profile geometry token 또는 명시적 size/density 축이 없으며 기본 geometry를 고정해 기존 소비자 출력을 보존한다.',
      reviewTrigger: '대표 consumer에서 반복 geometry를 profile 또는 local density에 따라 달리해야 한다는 승인된 evidence가 생길 때',
      nextReview,
    };
  }
  const policy = NOT_APPLICABLE_POLICY[NOT_APPLICABLE_RULES.get(entry.id)];
  assert(policy, `${entry.id}: missing not-applicable policy.`);
  return {
    owner: ownerName(entry.ownerLayer),
    ...policy,
    nextReview,
  };
}

function categoryFor(id) {
  const matches = [
    EXPLICIT_AXIS_RULES.has(id) && 'explicit-size-density',
    PROFILE_TOKEN_AUTOMATIC_IDS.has(id) && 'profile-token-automatic',
    FIXED_IDS.has(id) && 'fixed',
    NOT_APPLICABLE_RULES.has(id) && 'not-applicable',
  ].filter(Boolean);
  assert(matches.length === 1, `${id}: expected exactly one curated density category, found ${matches.length}.`);
  return matches[0];
}

function validateCuratedDecisionSet(componentContent) {
  const sourceIds = componentContent.entries.map((entry) => entry.id);
  assert(new Set(sourceIds).size === sourceIds.length, `${componentRegistryPath} contains duplicate entry IDs.`);
  const curatedIds = [
    ...EXPLICIT_AXIS_RULES.keys(),
    ...PROFILE_TOKEN_AUTOMATIC_IDS,
    ...FIXED_IDS,
    ...NOT_APPLICABLE_RULES.keys(),
  ];
  const duplicateCuratedIds = curatedIds.filter((id, index) => curatedIds.indexOf(id) !== index);
  assert(duplicateCuratedIds.length === 0, `Curated density decisions overlap: ${[...new Set(duplicateCuratedIds)].join(', ')}.`);
  const sourceSet = new Set(sourceIds);
  const curatedSet = new Set(curatedIds);
  const missingDecisions = sourceIds.filter((id) => !curatedSet.has(id));
  const retiredDecisions = curatedIds.filter((id) => !sourceSet.has(id));
  assert(
    missingDecisions.length === 0 && retiredDecisions.length === 0,
    `Density decisions are not the exact public component set. `
      + `Unclassified: ${missingDecisions.join(', ') || 'none'}; retired: ${retiredDecisions.join(', ') || 'none'}. `
      + 'Update refused: add or remove an explicit owner decision in check-density-coverage.mjs.',
  );
}

function validateEntryDecision(entry) {
  const geometryProfileTokens = entry.profileTokens.filter((token) => !NON_GEOMETRY_PROFILE_TOKENS.has(token));
  if (entry.category === 'explicit-size-density') {
    assert(entry.explicitAxes.length > 0, `${entry.id}: explicit-size-density requires a curated axis.`);
  } else {
    assert(entry.explicitAxes.length === 0, `${entry.id}: only explicit-size-density may expose explicitAxes.`);
  }
  if (entry.category === 'profile-token-automatic') {
    assert(geometryProfileTokens.length > 0, `${entry.id}: profile-token-automatic requires an allowed geometry profile token.`);
  }
  if (entry.category === 'fixed' || entry.category === 'not-applicable') {
    assert(geometryProfileTokens.length === 0, `${entry.id}: ${entry.category} cannot consume profile geometry tokens; curate a new decision first.`);
    for (const field of ['owner', 'rationale', 'reviewTrigger', 'nextReview']) {
      assert(typeof entry[field] === 'string' && entry[field].trim(), `${entry.id}: ${entry.category} requires ${field}.`);
    }
  } else {
    for (const field of ['owner', 'rationale', 'reviewTrigger', 'nextReview']) {
      assert(entry[field] === undefined, `${entry.id}: ${field} is reserved for fixed/not-applicable governance.`);
    }
  }
  assert(entry.profileAware === (entry.profileTokens.length > 0), `${entry.id}: profileAware must match profileTokens evidence.`);
}

export function buildDensityCoverage(componentContent, profileContract) {
  assert(componentContent?.summary?.componentEntries === 208, `${componentRegistryPath} must currently declare the R3A M0 census of 208 entries.`);
  assert(Array.isArray(componentContent.entries), `${componentRegistryPath} entries must be an array.`);
  assert(Array.isArray(profileContract?.allowedOverrides), `${profileContractPath} allowedOverrides must be an array.`);
  validateCuratedDecisionSet(componentContent);

  const allowedOverrides = new Set(profileContract.allowedOverrides);
  const entries = componentContent.entries.map((sourceEntry) => {
    const category = categoryFor(sourceEntry.id);
    const sourceProps = new Set(sourceEntry.props.map((property) => property.name));
    const explicitAxes = EXPLICIT_AXIS_RULES.get(sourceEntry.id) || [];
    for (const axis of explicitAxes) {
      assert(sourceProps.has(axis), `${sourceEntry.id}: curated axis "${axis}" is absent from the public component registry.`);
    }
    const profileTokens = [...new Set([
      ...sourceEntry.tokens.filter((token) => allowedOverrides.has(token)),
      ...(PROFILE_TOKEN_EVIDENCE_EXCEPTIONS.get(sourceEntry.id) || [])
        .filter((token) => allowedOverrides.has(token)),
    ])].sort();
    const entry = {
      id: sourceEntry.id,
      title: sourceEntry.title,
      source: sourceEntry.source,
      ownerLayer: sourceEntry.ownerLayer,
      category,
      profileAware: profileTokens.length > 0,
      explicitAxes,
      profileTokens,
      ...(category === 'fixed' || category === 'not-applicable'
        ? governanceFor(sourceEntry, category)
        : {}),
    };
    validateEntryDecision(entry);
    return entry;
  });

  const categoryCounts = Object.fromEntries(CATEGORIES.map((category) => [
    category,
    entries.filter((entry) => entry.category === category).length,
  ]));
  return {
    $schema: './DENSITY_COVERAGE_CONTRACT.schema.json',
    schemaVersion: 1,
    status: 'active',
    authority: {
      decisionMode: 'curated-id-register',
      newEntryPolicy: 'fail-until-owner-classified',
      evidenceUpdatePolicy: 'regenerate-source-facts-only',
    },
    source: {
      componentRegistry: componentRegistryPath,
      componentRegistryFingerprint: sourceFingerprint(componentContent),
      expressionProfileContract: profileContractPath,
      expressionProfileContractFingerprint: sourceFingerprint(profileContract),
    },
    summary: {
      entryCount: entries.length,
      categoryCounts,
      profileAwareEntries: entries.filter((entry) => entry.profileAware).length,
    },
    entries,
  };
}

function compileSchema(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

export function validateDensityCoverage({ registry, schema, componentContent, profileContract }) {
  const validateSchema = compileSchema(schema);
  assert(
    validateSchema(registry),
    `Density coverage schema violations:\n${validateSchema.errors?.map((error) => `${error.instancePath || '/'} ${error.message}`).join('\n')}`,
  );
  const registryIds = registry.entries.map((entry) => entry.id);
  assert(new Set(registryIds).size === registryIds.length, `${registryPath} contains duplicate entry IDs.`);
  for (const entry of registry.entries) validateEntryDecision(entry);

  const expected = buildDensityCoverage(componentContent, profileContract);
  assert(
    JSON.stringify(registry) === JSON.stringify(expected),
    `${registryPath} is stale or does not match the curated decisions. Run npm run update:density-coverage.`,
  );
  return registry.summary;
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

export async function runDensityCoverageCli(argv = process.argv.slice(2)) {
  const [componentContent, profileContract, schema] = await Promise.all([
    readJson(componentRegistryPath),
    readJson(profileContractPath),
    readJson(schemaPath),
  ]);
  const update = argv.includes('--update');
  let registry;
  if (update) {
    registry = buildDensityCoverage(componentContent, profileContract);
    const validateSchema = compileSchema(schema);
    assert(
      validateSchema(registry),
      `Generated density coverage schema violations:\n${validateSchema.errors?.map((error) => `${error.instancePath || '/'} ${error.message}`).join('\n')}`,
    );
    await writeFile(path.join(root, registryPath), `${JSON.stringify(registry, null, 2)}\n`);
  } else {
    registry = await readJson(registryPath);
  }
  const summary = validateDensityCoverage({ registry, schema, componentContent, profileContract });
  console.log(
    `${update ? 'Updated' : 'Validated'} density coverage: ${summary.entryCount} entries; `
      + CATEGORIES.map((category) => `${category}=${summary.categoryCounts[category]}`).join(', ')
      + `; profileAware=${summary.profileAwareEntries}.`,
  );
  return summary;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) await runDensityCoverageCli();
