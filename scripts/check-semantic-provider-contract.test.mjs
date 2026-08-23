import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  extractCustomPropertyContract,
  runSemanticProviderCheck,
  validateRoboticsRuntimeAdapter,
  validateSemanticCombination,
  verifyFixtureCases,
} from './check-semantic-provider-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('only var() calls without a fallback enter the required provider interface', () => {
  const result = extractCustomPropertyContract(`
    :root { --local: 1; }
    .subject {
      color: var(--required-color);
      min-height: var(--consumer-axis, var(--required-height));
      padding: var(--optional-padding, 8px);
    }
    const style = { '--runtime-local': 'var(--required-color)' };
  `);

  assert.deepEqual(result.definitions, ['--local', '--runtime-local']);
  assert.deepEqual(result.requiredReferences, ['--required-color', '--required-height']);
  assert.deepEqual(result.allReferences, [
    '--consumer-axis',
    '--optional-padding',
    '--required-color',
    '--required-height',
  ]);
});

test('positive and negative semantic provider fixtures have deterministic diagnostics', async () => {
  const fixture = JSON.parse(await readFile(
    path.join(root, 'scripts/fixtures/semantic-provider-contract/cases.json'),
    'utf8',
  ));
  const results = verifyFixtureCases(fixture);
  assert.equal(results.length, 6);
  assert.deepEqual(
    results.find(({ id }) => id === 'core-only-missing-theme').diagnostics.map(({ code }) => code),
    ['LDS_THEME_PROVIDER_MISSING', 'LDS_SEMANTIC_VARIABLE_MISSING'],
  );
  assert.deepEqual(
    results.find(({ id }) => id === 'provider-variable-missing').diagnostics.map(({ code }) => code),
    ['LDS_SEMANTIC_VARIABLE_MISSING'],
  );
  assert.deepEqual(
    results.find(({ id }) => id === 'provider-version-mismatch').diagnostics.map(({ code }) => code),
    ['LDS_SEMANTIC_PROVIDER_VERSION_MISMATCH'],
  );
});

test('Robotics runtime adapter fixtures reject under-report and local-definition drift', async () => {
  const fixture = JSON.parse(await readFile(
    path.join(root, 'scripts/fixtures/semantic-provider-contract/cases.json'),
    'utf8',
  ));
  assert.ok(Array.isArray(fixture.roboticsRuntimeCases));
  for (const fixtureCase of fixture.roboticsRuntimeCases) {
    if (fixtureCase.expect.status === 'valid') {
      assert.deepEqual(
        validateRoboticsRuntimeAdapter(fixtureCase.adapter, fixtureCase.scan),
        ['--runtime-required'],
        fixtureCase.id,
      );
      continue;
    }
    assert.throws(
      () => validateRoboticsRuntimeAdapter(fixtureCase.adapter, fixtureCase.scan),
      (error) => {
        assert.match(error.message, new RegExp(fixtureCase.expect.messageIncludes), fixtureCase.id);
        return true;
      },
    );
  }
});

test('a provider version mismatch is independent from variable coverage', () => {
  const result = validateSemanticCombination([
    {
      id: 'core',
      name: '@fixture/core',
      role: 'consumer',
      requiresSemanticContractVersion: '1',
      requiredVariables: ['--semantic-label'],
      definitions: [],
    },
    {
      id: 'theme',
      name: '@fixture/theme',
      role: 'provider',
      requiresSemanticContractVersion: '1',
      providesSemanticContractVersion: '2',
      requiredVariables: [],
      definitions: ['--semantic-label'],
    },
  ], ['core', 'theme'], 'version-only-negative');

  assert.deepEqual(result.diagnostics.map(({ code }) => code), [
    'LDS_SEMANTIC_PROVIDER_VERSION_MISMATCH',
  ]);
});

test('current source contracts prove the Core-only negative and all supported package combinations', async () => {
  const result = await runSemanticProviderCheck(root, { allowMissingManifestMetadata: true });
  const [coreOnly, coreTheme, coreThemeProduct, full] = result.combinations;
  assert.equal(coreOnly.status, 'invalid');
  assert.ok(coreOnly.diagnostics.find(({ code }) => code === 'LDS_THEME_PROVIDER_MISSING'));
  const missing = coreOnly.diagnostics.find(({ code }) => code === 'LDS_SEMANTIC_VARIABLE_MISSING');
  assert.ok(missing.variables.length > 0);
  assert.deepEqual([...missing.variables].sort(), missing.variables);
  assert.equal(coreTheme.status, 'valid');
  assert.equal(coreThemeProduct.status, 'valid');
  assert.equal(full.status, 'valid');
  assert.equal(result.records.find(({ id }) => id === 'robotics').version, '0.1.0-rc.33');
});
