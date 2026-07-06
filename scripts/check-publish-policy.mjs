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

assert(pkg.private === true, 'Operational policy is internal Git/package consumption for now: package.json private must remain true until an explicit publish decision.');
assert(pkg.publishConfig?.registry === 'https://npm.pkg.github.com', 'publishConfig.registry must document the intended future registry.');

for (const expected of ['dist', 'components', 'tokens', 'assets', 'styles.css', 'guidelines', 'templates', 'templates-cards', '_ds_bundle.js', 'readme.md']) {
  assert(pkg.files?.includes(expected), `package.json files must include ${expected}.`);
}

for (const expected of ['./dist/index.cjs', './dist/index.js', './dist/index.d.ts']) {
  const serialized = JSON.stringify(pkg);
  assert(serialized.includes(expected), `package metadata must reference ${expected}.`);
}

const policyText = `${readme}\n${inventory}\n${workflow}`;
for (const expected of ['private: true', '내부 Git 소비', 'npm publish', 'GitHub Packages']) {
  assert(policyText.includes(expected), `Docs must state publish policy phrase: ${expected}`);
}

console.log('Validated publish policy: package remains private for internal Git consumption, packable files are explicit, and future GitHub Packages intent is documented.');
