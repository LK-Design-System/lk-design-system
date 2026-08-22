import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  buildDensityCoverage,
  CATEGORIES,
  validateDensityCoverage,
} from './check-density-coverage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), 'utf8'));
}

function currentFixture() {
  return {
    registry: readJson('docs/references/architecture/DENSITY_COVERAGE_CONTRACT.json'),
    schema: readJson('docs/references/architecture/DENSITY_COVERAGE_CONTRACT.schema.json'),
    componentContent: readJson('docs/components/component-content.json'),
    profileContract: readJson('docs/references/architecture/EXPRESSION_PROFILE_CONTRACT.json'),
  };
}

function validate(fixture) {
  return validateDensityCoverage(fixture);
}

test('current M0 register validates all 208 public component entries exactly once', () => {
  const fixture = currentFixture();
  const summary = validate(fixture);
  assert.equal(summary.entryCount, 208);
  assert.equal(
    Object.values(summary.categoryCounts).reduce((sum, count) => sum + count, 0),
    208,
  );
  assert.deepEqual(Object.keys(summary.categoryCounts), CATEGORIES);
  assert.equal(new Set(fixture.registry.entries.map((entry) => entry.id)).size, 208);
});

test('schema rejects a multi-valued category instead of treating it as two decisions', () => {
  const fixture = currentFixture();
  fixture.registry.entries[0].category = ['fixed', 'not-applicable'];
  assert.throws(() => validate(fixture), /schema violations|must be equal to one of the allowed values/);
});

test('fixed and not-applicable decisions require durable review governance', async (t) => {
  for (const category of ['fixed', 'not-applicable']) {
    await t.test(category, () => {
      const fixture = currentFixture();
      const entry = fixture.registry.entries.find((item) => item.category === category);
      assert.ok(entry, `fixture must contain ${category}`);
      delete entry.reviewTrigger;
      assert.throws(() => validate(fixture), /schema violations|required property/);
    });
  }
});

test('update refuses a new public entry until an owner makes an explicit category decision', () => {
  const fixture = currentFixture();
  fixture.componentContent.entries[0].id = 'unclassified-public-entry';
  assert.throws(
    () => buildDensityCoverage(fixture.componentContent, fixture.profileContract),
    /exact public component set|Unclassified: unclassified-public-entry|explicit owner decision/,
  );
});

test('a fixed entry cannot silently become geometry-profile-aware', () => {
  const fixture = currentFixture();
  const token = '--component-link-density-test';
  fixture.profileContract.allowedOverrides.push(token);
  fixture.componentContent.entries.find((entry) => entry.id === 'link').tokens.push(token);
  assert.throws(
    () => buildDensityCoverage(fixture.componentContent, fixture.profileContract),
    /link: fixed cannot consume profile geometry tokens; curate a new decision first/,
  );
});

test('evidence regeneration may update profileAware without inventing a new category', () => {
  const fixture = currentFixture();
  const source = fixture.componentContent.entries.find((entry) => entry.id === 'link');
  source.tokens.push('--dur-fast');
  const generated = buildDensityCoverage(fixture.componentContent, fixture.profileContract);
  const entry = generated.entries.find((item) => item.id === 'link');
  assert.equal(entry.category, 'fixed');
  assert.equal(entry.profileAware, true);
  assert.deepEqual(entry.profileTokens, ['--dur-fast']);
});
