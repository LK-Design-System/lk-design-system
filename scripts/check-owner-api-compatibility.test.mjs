import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

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
    const target = `@lk-design-system/lds-core/${entry.module.replace(/\.(jsx|js)$/, '')}`;
    const wrapper = await read(`packages/product/src/${entry.module}`);
    const declaration = await read(`packages/product/src/${entry.module.replace(/\.(jsx|js)$/, '.d.ts')}`);
    assert.match(wrapper, /@deprecated/);
    assert.match(declaration, /@deprecated/);
    assert.ok(wrapper.includes(target), `${entry.module} must target ${target}`);
    assert.ok(declaration.includes(target), `${entry.module} declaration must target ${target}`);
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
