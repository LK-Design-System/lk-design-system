import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

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

function parseComponentRows(auditSource) {
  return [...auditSource.matchAll(/\[\s*'[^']*',\s*'[^']*',\s*'(components\/[^']+\.card\.html)',\s*'([^']*)'/g)]
    .map((match) => ({
      card: match[1],
      exports: match[2]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }));
}

function hasWord(source, name) {
  return new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(source);
}

const auditSource = await read('stories/Audit.stories.jsx');
const srcIndex = await read('src/index.js');
const distTypes = await read('dist/index.d.ts');
const bundleSource = await read('_ds_bundle.js');

let storySource = '';
for (const file of await collect('stories', (rel) => rel.endsWith('.stories.jsx'))) {
  if (file.endsWith('Audit.stories.jsx') || file.endsWith('LegacyPreviews.stories.jsx') || file.endsWith('VisualParityLedger.stories.jsx')) {
    continue;
  }
  storySource += `\n// ${file}\n${await read(file)}`;
}

const componentCardFiles = await collect('components', (rel) => rel.endsWith('.card.html'));
const rows = parseComponentRows(auditSource);

assert(componentCardFiles.length === 83, `Expected 83 component card files, found ${componentCardFiles.length}.`);
assert(rows.length === 83, `Expected 83 component card rows in Audit.stories.jsx, found ${rows.length}.`);

const rowCards = rows.map((row) => row.card).sort();
const missingRows = componentCardFiles.filter((file) => !rowCards.includes(file));
const staleRows = rowCards.filter((file) => !componentCardFiles.includes(file));
assert(missingRows.length === 0, `Audit component card map is missing files:\n${missingRows.join('\n')}`);
assert(staleRows.length === 0, `Audit component card map references missing files:\n${staleRows.join('\n')}`);

const duplicateRows = rowCards.filter((file, index) => rowCards.indexOf(file) !== index);
assert(duplicateRows.length === 0, `Audit component card map has duplicate rows:\n${[...new Set(duplicateRows)].join('\n')}`);

const failures = [];
const allMappedExports = new Set();

for (const row of rows) {
  if (row.exports.length === 0) failures.push(`${row.card}: no React export names listed`);

  const cardSource = await read(row.card);
  for (const name of row.exports) {
    allMappedExports.add(name);
    if (!hasWord(cardSource, name)) failures.push(`${row.card}: card HTML does not reference mapped export "${name}"`);
    if (!hasWord(srcIndex, name)) failures.push(`${row.card}: src/index.js does not export "${name}"`);
    if (!hasWord(distTypes, name)) failures.push(`${row.card}: dist/index.d.ts does not expose "${name}"`);
    if (!hasWord(bundleSource, name)) failures.push(`${row.card}: _ds_bundle.js does not expose/reference "${name}" for legacy previews`);
    if (!hasWord(storySource, name)) failures.push(`${row.card}: no React Storybook story references "${name}"`);
  }
}

assert(failures.length === 0, `Component card map validation failed:\n${failures.join('\n')}`);

console.log(
  `Validated component card map: ${rows.length} original component cards mapped to ${allMappedExports.size} React exports with Storybook coverage.`
);
