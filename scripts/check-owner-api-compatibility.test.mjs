import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  coreInternalModuleSpecifiers,
  findForbiddenProductCoreSpecifiers,
  findNonCoreCorePrivateImports,
  findProductCorePrivateImports,
  isForbiddenProductCoreSpecifier,
} from './check-layer-private-imports.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const readJson = async (relative) => JSON.parse(await read(relative));

const [authority, classification, decisions] = await Promise.all([
  readJson('docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json'),
  readJson('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'),
  readJson('docs/references/architecture/R3B_OWNER_API_DECISIONS.json'),
]);

const projection = authority.compatibilityProjections.deprecatedPackageReexports;
const ownerByExport = new Map(
  classification.groups.flatMap((group) => group.exports.map((name) => [name, group.ownerLayer])),
);

test('R3B move-now exports have one Core owner and an active 0.1.x Product window', () => {
  assert.equal(projection.status, 'active');
  assert.equal(projection.sourceLayer, 'product');
  assert.equal(projection.targetLayer, 'core');
  assert.equal(projection.supportWindow, 'all-0.1.x-releases');
  assert.equal(projection.earliestRemoval, '0.2.0');
  assert.equal(decisions.status, 'closed');
  assert.equal(decisions.supportWindow.policy, projection.supportWindow);

  const expected = [
    'Calendar',
    'CircularProgress',
    'DatePicker',
    'Link',
    'Meter',
    'NumberField',
    'PasswordInput',
    'Popover',
    'ProgressBar',
  ];
  const actual = projection.entries.flatMap((entry) => entry.exports).sort();
  assert.deepEqual(actual, expected);
  for (const name of expected) assert.equal(ownerByExport.get(name), 'core', name);
});

test('generated Product root and deep files only re-export the Core owner', async () => {
  const productEntry = await read('packages/product/src/index.js');
  for (const entry of projection.entries) {
    const moduleWithoutExtension = entry.module.replace(/\.(jsx|js)$/, '');
    const compatibilityFacade = moduleWithoutExtension === 'components/overlay/anchored-panel-style';
    const target = compatibilityFacade
      ? '@lk-design-system/lds-core/platform'
      : `@lk-design-system/lds-core/${moduleWithoutExtension}`;
    const wrapper = await read(`packages/product/src/${entry.module}`);
    const declaration = await read(`packages/product/src/${entry.module.replace(/\.(jsx|js)$/, '.d.ts')}`);
    assert.match(wrapper, /@deprecated/);
    assert.match(declaration, /@deprecated/);
    assert.ok(wrapper.includes(target), `${entry.module} must target ${target}`);
    assert.ok(declaration.includes(target), `${entry.module} declaration must target ${target}`);
    if (compatibilityFacade) {
      assert.match(wrapper, /export \{ anchoredPanelStyle \} from '@lk-design-system\/lds-core\/platform';/);
      assert.match(declaration, /export \{ anchoredPanelStyle \} from '@lk-design-system\/lds-core\/platform';/);
      assert.doesNotMatch(wrapper, /export \*/);
      assert.doesNotMatch(declaration, /export \*/);
    }
    for (const name of entry.exports) {
      assert.ok(productEntry.includes(`export { ${entry.exports.join(', ')} } from './${entry.module}';`), name);
    }
  }
});

test('stay and defer decisions keep Product and Robotics semantics out of Core', () => {
  for (const name of ['DateRangeField', 'TelemetryGauge', 'TelemetryValue', 'ViewerFrame', 'ViewerToolbar']) {
    assert.equal(ownerByExport.get(name), 'product', name);
  }
  for (const id of ['adjacent-composite-review', 'family-subpaths', 'private-helper-wildcard']) {
    const decision = decisions.decisions.find((entry) => entry.id === id);
    assert.equal(decision?.decision, 'defer', id);
    assert.ok(decision.reviewTrigger.length >= 24, id);
    assert.ok(decision.nextReview.length >= 8, id);
  }
  assert.equal(
    decisions.decisions.find((entry) => entry.id === 'robotics-domain-surface')?.ownerLayer,
    'robotics',
  );
});

test('non-Core packages reject Core authority internals across every module syntax', async () => {
  const internalSpecifiers = coreInternalModuleSpecifiers(classification);
  assert.equal(
    isForbiddenProductCoreSpecifier(
      '@lk-design-system/lds-core/components/internal/surface',
      internalSpecifiers,
    ),
    true,
  );
  assert.equal(
    isForbiddenProductCoreSpecifier(
      '@lk-design-system/lds-core/components/overlay/dialog-focus.js?fixture',
      internalSpecifiers,
    ),
    true,
  );
  assert.equal(
    isForbiddenProductCoreSpecifier('@lk-design-system/lds-core/components/internal/not-authority', internalSpecifiers),
    true,
  );
  assert.equal(isForbiddenProductCoreSpecifier('@lk-design-system/lds-core/private/menu', internalSpecifiers), true);
  assert.equal(isForbiddenProductCoreSpecifier('@lk-design-system/lds-core/headless', internalSpecifiers), false);
  assert.equal(
    isForbiddenProductCoreSpecifier('@lk-design-system/lds-product/components/internal/x', internalSpecifiers),
    false,
  );

  const findings = findForbiddenProductCoreSpecifiers(`
    import { hidden } from '@lk-design-system/lds-core/components/internal/bounded-value';
    import type { HiddenField } from '@lk-design-system/lds-core/components/forms/field-shared';
    export type { HiddenStatus } from '@lk-design-system/lds-core/components/status/status-presentation';
    type HiddenFocus = import('@lk-design-system/lds-core/components/overlay/dialog-focus').UseDialogFocusOptions;
    const lazy = import('@lk-design-system/lds-core/components/overlay/anchored-overlay.js?lazy');
    const legacy = require('@lk-design-system/lds-core/components/selection/pill-chip-style');
    const futurePrivate = require('@lk-design-system/lds-core/private/menu');
    import { useMenuKeyboard } from '@lk-design-system/lds-core/headless';
    import { allowedUnknown } from '@lk-design-system/lds-core/components/internal/not-authority';
  `, 'private-import-fixture.ts', internalSpecifiers);
  assert.deepEqual(
    findings.map(({ specifier }) => specifier),
    [
      '@lk-design-system/lds-core/components/internal/bounded-value',
      '@lk-design-system/lds-core/components/forms/field-shared',
      '@lk-design-system/lds-core/components/status/status-presentation',
      '@lk-design-system/lds-core/components/overlay/dialog-focus',
      '@lk-design-system/lds-core/components/overlay/anchored-overlay.js?lazy',
      '@lk-design-system/lds-core/components/selection/pill-chip-style',
      '@lk-design-system/lds-core/private/menu',
      '@lk-design-system/lds-core/components/internal/not-authority',
    ],
  );
  assert.deepEqual(await findProductCorePrivateImports(root), []);
  assert.deepEqual(await findNonCoreCorePrivateImports(root), []);
});

function sourceRuntimeExports(source) {
  const names = [];
  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from/g)) {
    names.push(...match[1].split(',').map((name) => name.trim().split(/\s+as\s+/).at(-1)));
  }
  return names.filter(Boolean).sort();
}

test('supported Core facades expose exact source, manifest, and SSR contracts', async () => {
  const manifest = await readJson('packages/core/package.json');
  const expectedExportTargets = {
    './brand-authoring': {
      types: './dist/brand-authoring.d.ts',
      import: './dist/brand-authoring.js',
    },
    './component-authoring': {
      types: './dist/component-authoring.d.ts',
      import: './dist/component-authoring.js',
    },
    './density': {
      types: './dist/density.d.ts',
      import: './dist/density.js',
    },
    './headless': {
      types: './dist/headless.d.ts',
      import: './dist/headless.js',
    },
    './platform': {
      types: './dist/platform.d.ts',
      import: './dist/platform.js',
    },
  };
  for (const [subpath, target] of Object.entries(expectedExportTargets)) {
    assert.deepEqual(manifest.exports[subpath], target, subpath);
  }

  const expectedRuntimeExports = {
    'brand-authoring': [
      'LK_LOGO_COLORS',
      'LK_LOGO_USAGE',
      'LK_LOGO_VIEWBOX',
      'LK_PATHS',
      'ROBOTICS_INLINE_TRANSFORM',
      'ROBOTICS_PATHS',
    ],
    'component-authoring': [
      'FieldLabel',
      'FieldMessage',
      'FieldStack',
      'FieldStatusIcon',
      'STATUS_TONE_STYLE',
      'componentVars',
      'embeddedBandStyle',
      'fieldBackground',
      'fieldBorderColor',
      'fieldTypography',
      'formatValueWithUnit',
      'getUnitSeparator',
      'isAttachedUnit',
      'mergeIds',
      'normalizeBoundedValue',
      'normalizeStatusTone',
      'normalizeUnit',
      'normalizeValueText',
      'partClassName',
      'partStyle',
      'statusToneStyle',
      'useFieldMetadata',
      'useMergedRefs',
    ],
    density: ['ComponentDensityScope', 'useResolvedControlSize', 'useResolvedDensity'],
    headless: ['useMenuKeyboard', 'useSubmenuBranch'],
    platform: [
      'OverlayPortal',
      'OverlayRuntimeContext',
      'OverlayRuntimeProvider',
      'anchoredPanelStyle',
      'appendAriaReference',
      'findOverlayTrigger',
      'inlineFloatingStyle',
      'useControllableOpen',
      'useDialogFocus',
      'useFloatingPosition',
      'useLightDismiss',
      'useOverlayLayer',
      'useOverlayRuntime',
    ],
  };
  for (const [facade, expected] of Object.entries(expectedRuntimeExports)) {
    assert.deepEqual(
      sourceRuntimeExports(await read(`packages/core/src/${facade}.js`)),
      expected,
      `${facade} source facade`,
    );
  }
  assert.deepEqual(
    [...(await read('packages/core/src/brand-authoring.d.ts')).matchAll(/export const (\w+)/g)]
      .map((match) => match[1])
      .sort(),
    expectedRuntimeExports['brand-authoring'],
    'brand-authoring declaration values',
  );

  const deniedInternalSubpaths = [
    './components/internal/*',
    './components/private/*',
    './components/brand/lk-logo-paths',
    './components/forms/field-shared',
    './components/overlay/anchored-overlay',
    './components/overlay/overlay-platform',
    './components/overlay/anchored-panel-style',
    './components/overlay/dialog-focus',
    './components/selection/pill-chip-style',
    './components/status/status-presentation',
  ];
  for (const subpath of deniedInternalSubpaths) assert.equal(manifest.exports[subpath], null, subpath);

  const [brandAuthoring, density, platformApi] = await Promise.all([
    import(pathToFileURL(path.join(root, 'packages/core/src/brand-authoring.js')).href),
    import(pathToFileURL(path.join(root, 'packages/core/src/density.js')).href),
    import(pathToFileURL(path.join(root, 'packages/core/src/platform.js')).href),
  ]);
  assert.deepEqual(Object.keys(brandAuthoring).sort(), expectedRuntimeExports['brand-authoring']);
  assert.deepEqual(Object.keys(density).sort(), expectedRuntimeExports.density);
  assert.deepEqual(Object.keys(platformApi).sort(), expectedRuntimeExports.platform);

  function SupportedSubpathSsrFixture() {
    const resolvedDensity = density.useResolvedDensity();
    const layer = platformApi.useOverlayLayer({ open: false });
    return React.createElement('output', {
      'data-density': resolvedDensity,
      'data-overlay-z-index': layer.zIndex,
      'data-panel-position': platformApi.anchoredPanelStyle(240).position,
    }, platformApi.appendAriaReference('authoring', 'platform'));
  }

  const markup = renderToStaticMarkup(
    React.createElement(
      density.ComponentDensityScope,
      { density: 'compact' },
      React.createElement(
        platformApi.OverlayRuntimeProvider,
        { zIndexBase: 160 },
        React.createElement(SupportedSubpathSsrFixture),
      ),
    ),
  );
  assert.match(markup, /data-density="compact"/);
  assert.match(markup, /data-overlay-z-index="160"/);
  assert.match(markup, /data-panel-position="absolute"/);
  assert.match(markup, />authoring platform<\/output>/);
});
