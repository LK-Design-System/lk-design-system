import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = 'docs/references/quality/TOKEN_DEPRECATION_RETENTION.json';
const registry = JSON.parse(await readFile(path.join(root, registryPath), 'utf8'));
const fullSource = JSON.parse(await readFile(path.join(root, 'tokens/source.json'), 'utf8'));
const scripts = ['check-token-hygiene.mjs', 'check-deprecated-tokens.mjs', 'token-deprecation-retention.mjs'];

async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'lds-token-retention-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const write = async (file, value) => {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await writeFile(path.join(dir, file), typeof value === 'string' ? value : JSON.stringify(value), 'utf8');
  };
  const source = { component: { shellPanel: { component: registry.component, tokens: structuredClone(fullSource.component.shellPanel.tokens) } } };
  const contract = structuredClone(registry);
  for (const name of scripts) await write(`scripts/${name}`, await readFile(path.join(root, 'scripts', name), 'utf8'));
  await write('package.json', { type: 'module', version: '0.4.7' });
  await write('tokens/source.json', source);
  await write(registryPath, contract);
  await write('docs/TOKEN_GOVERNANCE.md', await readFile(path.join(root, 'docs/TOKEN_GOVERNANCE.md'), 'utf8'));
  await write('docs/references/quality/TOKEN_HYGIENE_BASELINE.json', { schemaVersion: 1, findings: {} });
  await write('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json', {});
  const css = new Map();
  for (const entry of contract.tokens) for (const [file, values] of Object.entries(entry.declarations)) {
    css.set(file, (css.get(file) || '') + values.map(value => `:root { ${entry.css}: ${value}; }\n`).join(''));
  }
  // Actual referenced primitive definitions; no fake reference to retained names.
  const primitiveNames = [...new Set([...css.values()].join('').match(/--color-atomic-[a-z0-9-]+/g))];
  await write('tokens/color-atomic.css', `:root {\n${primitiveNames.map(name => `  ${name}: #000;`).join('\n')}\n}\n`);
  for (const [file, value] of css) await write(file, value);
  await write(registry.component, 'export const ShellPanel = () => null;\n');
  await write('stories/Fixture.stories.jsx', 'export const Default = {};\n');
  await write('.storybook/preview.js', 'export default {};\n');
  await write('styles.css', '');
  const run = (script) => {
    const result = spawnSync(process.execPath, [`scripts/${script}.mjs`], { cwd: dir, encoding: 'utf8', timeout: 10000 });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  };
  return { dir, source, contract, write, run };
}

test('registered declaration-only compatibility passes both real guards without baseline debt', async t => {
  const f = await fixture(t);
  for (const script of ['check-token-hygiene', 'check-deprecated-tokens']) {
    const result = f.run(script);
    assert.equal(result.status, 0, result.output);
  }
});

test('a new active unused token still fails the real hygiene ratchet', async t => {
  const f = await fixture(t);
  f.source.component.shellPanel.tokens.unused = { $type: 'dimension', $value: '1px', css: '--component-shell-panel-unused' };
  await f.write('tokens/source.json', f.source);
  const css = await readFile(path.join(f.dir, 'tokens/components.css'), 'utf8');
  await f.write('tokens/components.css', `${css}:root { --component-shell-panel-unused: 1px; }\n`);
  const result = f.run('check-token-hygiene');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /unusedTokens: --component-shell-panel-unused/);
});

test('unregistered deprecated unused tokens still fail', async t => {
  const f = await fixture(t);
  f.contract.tokens = f.contract.tokens.filter(entry => !entry.css.endsWith('-active-surface'));
  await f.write(registryPath, f.contract);
  const result = f.run('check-token-hygiene');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /unusedTokens: --component-shell-panel-active-surface/);
});

const invalidContracts = [
  ['expired review', async f => f.write('package.json', { type: 'module', version: '0.6.0' }), /review expired/],
  ['retains one full minor cycle', async f => { f.contract.reviewBy = '0.5.0'; await f.write(registryPath, f.contract); }, /complete minor cycle/],
  ['missing migration', async f => f.write('docs/TOKEN_GOVERNANCE.md', '# No migration\n'), /Missing token retention migration section/],
  ['missing replacement', async f => { f.contract.tokens[0].replacement = ''; await f.write(registryPath, f.contract); }, /replacement: required text/],
  ['source is active', async f => { f.source.component.shellPanel.tokens.rowHeight.$description = 'Active'; await f.write('tokens/source.json', f.source); }, /source must be Deprecated/],
  ['missing source identity', async f => { delete f.source.component.shellPanel.tokens.rowHeight; await f.write('tokens/source.json', f.source); }, /missing source identity/],
  ['source value change', async f => { f.source.component.shellPanel.tokens.rowHeight.$value = '41px'; await f.write('tokens/source.json', f.source); }, /retained source value changed/],
  ['CSS value change', async f => { const css = await readFile(path.join(f.dir, 'tokens/components.css'), 'utf8'); await f.write('tokens/components.css', css.replace('40px', '41px')); }, /retained CSS values\/count changed/],
  ['missing declaration', async f => f.write('tokens/components.css', ''), /retained CSS values\/count changed/],
];
for (const [name, mutate, message] of invalidContracts) test(`${name} fails both real guards closed`, async t => {
  const f = await fixture(t);
  await mutate(f);
  for (const script of ['check-token-hygiene', 'check-deprecated-tokens']) {
    const result = f.run(script);
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, message);
  }
});

const forbiddenReferences = [
  ['runtime', 'components/layout/Forbidden.jsx', 'export const value = "var(--component-shell-panel-row-height)";'],
  ['story', 'stories/Forbidden.stories.jsx', 'export const value = "--component-shell-panel-active-surface";'],
  ['prompt', 'components/layout/Forbidden.prompt.md', 'Use --component-shell-panel-active-hover-surface.'],
  ['preview', '.storybook/forbidden.js', 'export const value = "var(--component-shell-panel-row-height)";'],
  ['CSS value', 'tokens/forbidden.css', ':root { --ordinary: var(--component-shell-panel-row-height); }'],
  ['same-line declaration and var', 'tokens/components.css', ':root { --component-shell-panel-row-height: 40px; --ordinary: var(--component-shell-panel-row-height); }'],
  ['unregistered declaration file', 'tokens/forbidden.css', ':root { --component-shell-panel-row-height: 40px; }'],
  ['generated CSS value', 'tokens/color-components.css', ':root { --ordinary: var(--component-shell-panel-active-surface); }'],
  ['generated story data', 'stories/color-system.data.js', 'export const value = "--component-shell-panel-row-height";'],
  ['CSS comment', 'tokens/forbidden.css', '/* Use --component-shell-panel-row-height. */'],
];
for (const [name, file, reference] of forbiddenReferences) test(`${name} cannot reuse a retained token`, async t => {
  const f = await fixture(t);
  const current = await readFile(path.join(f.dir, file), 'utf8').catch(() => '');
  await f.write(file, file === 'tokens/components.css' ? reference + '\n' : current + '\n' + reference + '\n');
  const result = f.run('check-deprecated-tokens');
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /uses deprecated|retained CSS values\/count changed/);
});

test('a longer different token name is not a retained-token reference', async t => {
  const f = await fixture(t);
  await f.write('stories/Longer.stories.jsx', 'export const value = "--component-shell-panel-row-height-extra";\n');
  const result = f.run('check-deprecated-tokens');
  assert.equal(result.status, 0, result.output);
});

test('existing unregistered legacy deprecations still reject runtime references', async t => {
  const f = await fixture(t);
  f.source.component.shellPanel.tokens.legacy = { $type: 'dimension', css: '--component-shell-panel-legacy', $description: 'Deprecated. Use an active token.' };
  await f.write('tokens/source.json', f.source);
  await f.write('components/layout/Legacy.jsx', 'export const value = "var(--component-shell-panel-legacy)";\n');
  const result = f.run('check-deprecated-tokens');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /uses deprecated --component-shell-panel-legacy/);
});

test('pre-release package versions retain the same conservative review deadline', async t => {
  const f = await fixture(t);
  await f.write('package.json', { type: 'module', version: '0.5.0-rc.1' });
  assert.equal(f.run('check-token-hygiene').status, 0);
  await f.write('package.json', { type: 'module', version: '0.6.0-rc.1' });
  const result = f.run('check-token-hygiene');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /review expired/);
});
