import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  findProductSpecialistSpecifiers,
  LayerOwnerExactSetError,
  loadLayerOwnerExactSetSnapshot,
  parseProductPublicEntry,
  validateLayerOwnerExactSet,
} from './check-layer-owner-exact-set.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cases = JSON.parse(await readFile(path.join(root, 'scripts/fixtures/layer-owner-exact-set/cases.json'), 'utf8'));

function decodePointerSegment(segment) {
  return segment.replaceAll('~1', '/').replaceAll('~0', '~');
}

function applyOperation(document, operation) {
  const segments = operation.path.split('/').slice(1).map(decodePointerSegment);
  assert.ok(segments.length > 0, `fixture operation path must not target the document root: ${operation.path}`);
  let parent = document;
  for (const segment of segments.slice(0, -1)) {
    assert.ok(parent != null && Object.hasOwn(parent, segment), `fixture path does not exist: ${operation.path}`);
    parent = parent[segment];
  }
  const key = segments.at(-1);
  if (operation.op === 'add' && Array.isArray(parent) && key === '-') {
    parent.push(structuredClone(operation.value));
    return;
  }
  if (operation.op === 'remove' && Array.isArray(parent)) {
    parent.splice(Number(key), 1);
    return;
  }
  if (operation.op === 'remove') {
    delete parent[key];
    return;
  }
  if (operation.op === 'add' || operation.op === 'replace') {
    parent[key] = structuredClone(operation.value);
    return;
  }
  throw new Error(`unsupported fixture operation: ${operation.op}`);
}

test('current Product, Storybook, Robotics, and LDS3D owner surfaces form one exact set', async () => {
  const summary = validateLayerOwnerExactSet(await loadLayerOwnerExactSetSnapshot(root));
  assert.equal(summary.product.ownedSources, 111);
  assert.equal(summary.product.ownedExports, 119);
  assert.equal(summary.product.compatibilitySources, 9);
  assert.equal(summary.product.canonicalStorybookPages, 109);
  assert.equal(summary.product.nonCanonicalHiddenPages, 1);
  assert.equal(summary.robotics.sources, 23);
  assert.equal(summary.robotics.exports, 53);
  assert.equal(summary.lds3d.packages, 8);
  assert.equal(summary.lds3d.qualifiedExports, 41);
  assert.deepEqual(summary.violations, { unclassified: 0, duplicate: 0, conflict: 0 });
});

test('minimal positive fixture retains all three Product families and both specialist boundaries', () => {
  const summary = validateLayerOwnerExactSet(structuredClone(cases.valid));
  assert.deepEqual(summary.product.familyCounts, {
    application: 1,
    operations: 2,
    workspace: 1,
  });
  assert.equal(summary.product.canonicalStorybookPages, 4);
  assert.equal(summary.product.nonCanonicalHiddenPages, 1);
  assert.equal(summary.robotics.exports, 1);
  assert.equal(summary.lds3d.qualifiedExports, 2);
});

test('Product specialist scanner covers static, type, template, comment, and require syntax', () => {
  const findings = findProductSpecialistSpecifiers(`
    import { RobotStatusCard } from '@lk-design-system/lds-robotics-ui';
    export type { Scene } from '@lk-design-system/lds-3d-renderer';
    type Coordinates = import('@lk-design-system/lds-3d-core/coordinates').Coordinates;
    const robotics = () => import(\`@lk-design-system/lds-robotics-ui/components/robotics/RobotStatusCard\`);
    const scene = () => import(/* webpackIgnore: true */ '@lk-design-system/lds-3d');
    const legacy = require('@lk-design-system/lds-robotics-ui');
    import Renderer = require('@lk-design-system/lds-3d-renderer');
  `, 'packages/product/src/specialist-negative.ts');

  assert.deepEqual(findings.map(({ specifier }) => specifier), [
    '@lk-design-system/lds-robotics-ui',
    '@lk-design-system/lds-3d-renderer',
    '@lk-design-system/lds-3d-core/coordinates',
    '@lk-design-system/lds-robotics-ui/components/robotics/RobotStatusCard',
    '@lk-design-system/lds-3d',
    '@lk-design-system/lds-robotics-ui',
    '@lk-design-system/lds-3d-renderer',
  ]);
});

test('Product public entry parser rejects unsupported syntax and noncanonical paths', () => {
  const valid = parseProductPublicEntry("export { ProductCard } from './components/cards/ProductCard.jsx';");
  assert.deepEqual(valid.diagnostics, []);
  assert.deepEqual(valid.rows, [{
    source: './components/cards/ProductCard.jsx',
    exports: ['ProductCard'],
  }]);

  const invalid = parseProductPublicEntry(`
    export * from './components/cards/ProductCard.jsx';
    export { ProductCard } from './components/cards/../cards/ProductCard.jsx';
    export { ProductCard as Card } from './components/cards/ProductCard.jsx';
    const hiddenExport = true;
  `);
  const codes = invalid.diagnostics.map(({ code }) => code);
  assert.ok(codes.includes('PRODUCT_ENTRY_EXPORT_SYNTAX_CONFLICT'));
  assert.ok(codes.includes('PRODUCT_ENTRY_SOURCE_PATH_CONFLICT'));
  assert.ok(codes.includes('PRODUCT_ENTRY_STATEMENT_CONFLICT'));
  assert.deepEqual(invalid.rows, []);
});

for (const fixtureCase of cases.negativeCases) {
  test(`negative fixture: ${fixtureCase.id}`, () => {
    const fixture = structuredClone(cases.valid);
    for (const operation of fixtureCase.operations) applyOperation(fixture, operation);
    assert.throws(
      () => validateLayerOwnerExactSet(fixture),
      (error) => {
        assert.ok(error instanceof LayerOwnerExactSetError, error?.stack ?? String(error));
        const codes = new Set(error.diagnostics.map((diagnostic) => diagnostic.code));
        for (const expectedCode of fixtureCase.expectedCodes) {
          assert.ok(codes.has(expectedCode), `${fixtureCase.id} expected ${expectedCode}; got ${[...codes].sort().join(', ')}`);
        }
        return true;
      },
    );
  });
}
