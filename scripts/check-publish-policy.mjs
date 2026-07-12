import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

const pkg = JSON.parse(await read('package.json'));
const readme = await read('readme.md');
const inventory = await read('docs/REPOSITORY_INVENTORY.md');
const workflow = await read('docs/COMPONENT_WORKFLOW.md');
const changelog = await read('CHANGELOG.md');
const deprecations = await read('docs/DEPRECATIONS.md');

assert(pkg.private === true, 'Operational policy is internal Git/package consumption for now: package.json private must remain true until an explicit publish decision.');
assert(pkg.publishConfig?.registry === 'https://npm.pkg.github.com', 'publishConfig.registry must document the intended future registry.');
assert(!pkg.dependencies || Object.keys(pkg.dependencies).length === 0, 'Runtime dependencies must remain empty; React belongs in peerDependencies and tooling belongs in devDependencies.');
assert(JSON.stringify(Object.keys(pkg.peerDependencies || {}).sort()) === JSON.stringify(['react', 'react-dom']), 'peerDependencies must contain exactly react and react-dom.');
assert(!pkg.files?.includes('components'), 'Raw components source must not be published; compiled component subpaths live under dist.');
assert(pkg.exports?.['./components/*']?.import === './dist/components/*.js', 'Compiled ESM component subpaths must resolve under dist/components.');
assert(pkg.exports?.['./components/*']?.require === './dist/components/*.cjs', 'Compiled CJS component subpaths must resolve under dist/components.');

for (const expected of ['dist', 'tokens', 'assets', 'styles.css', 'readme.md', 'CHANGELOG.md', 'docs/DEPRECATIONS.md']) {
  assert(pkg.files?.includes(expected), `package.json files must include ${expected}.`);
}

assert(changelog.includes(`## ${pkg.version} -`), `CHANGELOG.md must include the current package version ${pkg.version}.`);
assert(deprecations.includes('# Deprecations'), 'docs/DEPRECATIONS.md must exist as the generated public deprecation register.');

for (const expected of ['./dist/index.cjs', './dist/index.js', './dist/index.d.ts']) {
  const serialized = JSON.stringify(pkg);
  assert(serialized.includes(expected), `package metadata must reference ${expected}.`);
}

const policyText = `${readme}\n${inventory}\n${workflow}`;
for (const expected of ['private: true', '내부 Git 소비', 'npm publish', 'GitHub Packages']) {
  assert(policyText.includes(expected), `Docs must state publish policy phrase: ${expected}`);
}

console.log('Validated publish policy: private Git consumption, empty runtime dependencies, compiled exports, current changelog, deprecation register, and future GitHub Packages intent are documented.');
