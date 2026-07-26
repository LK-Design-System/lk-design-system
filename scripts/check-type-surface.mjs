import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const componentRoot = path.join(root, 'components');
const layerNames = ['core', 'theme', 'product', 'robotics'];

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

function extensionless(rel) {
  return rel.replace(/\.(jsx|d\.ts)$/, '');
}

function exportNames(source) {
  return [...source.matchAll(/^export\s+(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm)]
    .map((match) => match[1])
    .sort((a, b) => a.localeCompare(b));
}

function exportedNamesFromEntry(source) {
  return [...source.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+'\.\.\/components\/[^']+?(?:\.jsx)?';$/gm)]
    .flatMap((match) => match[1].split(',').map((item) => item.trim().split(/\s+as\s+/)[0]));
}

const jsxFiles = await collect('components', (rel) => rel.endsWith('.jsx'));
const dtsFiles = await collect('components', (rel) => rel.endsWith('.d.ts'));

const jsxBases = new Set(jsxFiles.map(extensionless));
const dtsBases = new Set(dtsFiles.map(extensionless));
const missingDts = [...jsxBases].filter((base) => !dtsBases.has(base)).sort();
const staleDts = [...dtsBases].filter((base) => !jsxBases.has(base)).sort();

assert(missingDts.length === 0, `Every component .jsx needs a .d.ts contract. Missing:\n${missingDts.join('\n')}`);
assert(staleDts.length === 0, `Every component .d.ts must map to a .jsx implementation. Stale:\n${staleDts.join('\n')}`);

const packageJson = JSON.parse(await read('package.json'));
const classification = JSON.parse(await read('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'));
const entrySources = {};

for (const entryName of ['index', ...layerNames]) {
  const js = await read(`src/${entryName}.js`);
  const types = await read(`src/${entryName}.d.ts`);
  const distTypes = await read(`dist/${entryName}.d.ts`);
  const jsNames = exportedNamesFromEntry(js).sort((a, b) => a.localeCompare(b));
  const typeNames = exportedNamesFromEntry(types).sort((a, b) => a.localeCompare(b));
  assert(
    JSON.stringify(jsNames) === JSON.stringify(typeNames),
    `src/${entryName}.js and src/${entryName}.d.ts must expose the same named exports.`,
  );
  assert(types === distTypes, `dist/${entryName}.d.ts must be an exact copy of src/${entryName}.d.ts. Run npm run build.`);
  entrySources[entryName] = { js, types, names: jsNames };
}

const srcIndex = entrySources.index.js;
const srcTypes = entrySources.index.types;

assert(packageJson.types === './dist/index.d.ts', 'package.json types must point to ./dist/index.d.ts.');
assert(packageJson.exports?.['.']?.types === './dist/index.d.ts', 'package root export must expose dist/index.d.ts.');
assert(packageJson.exports?.['./styles.css'] === './styles.css', 'package must expose ./styles.css for consumers.');
for (const layer of layerNames) {
  assert(
    packageJson.exports?.[`./${layer}`]?.types === `./dist/${layer}.d.ts`,
    `package ${layer} export must expose dist/${layer}.d.ts.`,
  );
}

const entryNames = entrySources.index.names;
const implementationExportNames = [];
for (const rel of jsxFiles) {
  implementationExportNames.push(...exportNames(await read(rel)));
}
implementationExportNames.sort((a, b) => a.localeCompare(b));
assert(
  JSON.stringify(entryNames) === JSON.stringify(implementationExportNames),
  `Root entry must expose exactly ${implementationExportNames.length} named public exports from ${jsxFiles.length} component entries.`,
);

const expectedByLayer = Object.fromEntries(layerNames.map((layer) => [layer, []]));
for (const group of classification.groups || []) {
  assert(layerNames.includes(group.ownerLayer), `Unknown ownerLayer in public export classification: ${group.ownerLayer}`);
  expectedByLayer[group.ownerLayer].push(...(group.exports || []));
}
const classifiedNames = Object.values(expectedByLayer).flat().sort((a, b) => a.localeCompare(b));
assert(
  JSON.stringify(classifiedNames) === JSON.stringify(entryNames),
  'Public export classification must equal the root entry exactly.',
);
for (const layer of layerNames) {
  expectedByLayer[layer].sort((a, b) => a.localeCompare(b));
  assert(
    JSON.stringify(entrySources[layer].names) === JSON.stringify(expectedByLayer[layer]),
    `src/${layer} must expose exactly the public exports owned by ${layer}.`,
  );
}
const layerUnion = [...new Set(layerNames.flatMap((layer) => entrySources[layer].names))]
  .sort((a, b) => a.localeCompare(b));
assert(JSON.stringify(layerUnion) === JSON.stringify(entryNames), 'Root entry must equal the exact union of all layer entries.');

const unexportedComponents = [];
const missingEntryContracts = [];
for (const rel of jsxFiles) {
  const source = await read(rel);
  const names = exportNames(source);
  if (names.length === 0) continue;
  for (const name of names) {
    if (!new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(srcIndex)) {
      unexportedComponents.push(`${rel}: ${name}`);
    }
    if (!new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(srcTypes)) {
      missingEntryContracts.push(`${rel}: ${name}`);
    }
  }
}

assert(unexportedComponents.length === 0, `Named component exports missing from src/index.js:\n${unexportedComponents.join('\n')}`);
assert(missingEntryContracts.length === 0, `Named component exports missing from src/index.d.ts:\n${missingEntryContracts.join('\n')}`);

const anyLeaks = [];
for (const rel of dtsFiles) {
  const source = await read(rel);
  for (const match of source.matchAll(/\bany\b/g)) {
    anyLeaks.push(`${rel}:${source.slice(0, match.index).split('\n').length}: ${source.split('\n')[source.slice(0, match.index).split('\n').length - 1].trim()}`);
  }
}
assert(anyLeaks.length === 0, `Public component type contracts must not expose any:\n${anyLeaks.join('\n')}`);

console.log(
  `Validated type surface: ${jsxFiles.length} component implementations, ${dtsFiles.length} .d.ts contracts, `
    + `${entryNames.length} aggregate exports (${layerNames.map((layer) => `${layer}=${entrySources[layer].names.length}`).join(', ')}), `
    + 'exact layer ownership, and 0 public any leaks.',
);
