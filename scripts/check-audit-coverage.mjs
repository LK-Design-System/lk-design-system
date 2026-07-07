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
    if (entry.isDirectory()) {
      await collect(rel, predicate, out);
    } else if (entry.isFile() && predicate(rel)) {
      out.push(rel);
    }
  }
  return out.sort();
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function extractPaths(source, pattern) {
  return [...new Set([...source.matchAll(pattern)].map((match) => match[1]))]
    .filter((item) => !item.includes('*'))
    .sort();
}

const guidelineFiles = await collect('guidelines', (rel) => rel.endsWith('.html'));
const componentCardFiles = await collect('components', (rel) => rel.endsWith('.card.html'));
const templateCardFiles = await collect('templates-cards', (rel) => rel.endsWith('.card.html'));

assert(guidelineFiles.length === 20, `Expected 20 guideline HTML files, found ${guidelineFiles.length}.`);
assert(componentCardFiles.length === 83, `Expected 83 component card HTML files, found ${componentCardFiles.length}.`);
assert(templateCardFiles.length === 4, `Expected 4 template card HTML files, found ${templateCardFiles.length}.`);

const auditSource = await read('stories/Audit.data.jsx');
const auditGuidelines = extractPaths(auditSource, /['"](guidelines\/[^'"]+\.html)['"]/g);
const auditComponents = extractPaths(auditSource, /['"](components\/[^'"]+\.card\.html)['"]/g);
const auditTemplates = extractPaths(auditSource, /['"](templates-cards\/[^'"]+\.card\.html)['"]/g);

const missingGuidelines = diff(guidelineFiles, auditGuidelines);
const missingComponents = diff(componentCardFiles, auditComponents);
const missingTemplates = diff(templateCardFiles, auditTemplates);
const staleGuidelines = diff(auditGuidelines, guidelineFiles);
const staleComponents = diff(auditComponents, componentCardFiles);
const staleTemplates = diff(auditTemplates, templateCardFiles);

assert(missingGuidelines.length === 0, `Audit data is missing guideline files:\n${missingGuidelines.join('\n')}`);
assert(missingComponents.length === 0, `Audit data is missing component card files:\n${missingComponents.join('\n')}`);
assert(missingTemplates.length === 0, `Audit data is missing template card files:\n${missingTemplates.join('\n')}`);
assert(staleGuidelines.length === 0, `Audit data references missing guideline files:\n${staleGuidelines.join('\n')}`);
assert(staleComponents.length === 0, `Audit data references missing component card files:\n${staleComponents.join('\n')}`);
assert(staleTemplates.length === 0, `Audit data references missing template card files:\n${staleTemplates.join('\n')}`);

const cardMetaMissing = [];
for (const rel of [...componentCardFiles, ...templateCardFiles]) {
  const source = await read(rel);
  if (!source.includes('@dsCard')) cardMetaMissing.push(`${rel}: missing @dsCard`);
  if (!/@dsCard[^]*?viewport="[^"]+"/.test(source)) cardMetaMissing.push(`${rel}: missing @dsCard viewport`);
  if (!/@dsCard[^]*?name="[^"]+"/.test(source)) cardMetaMissing.push(`${rel}: missing @dsCard name`);
}

assert(cardMetaMissing.length === 0, `Original card metadata is incomplete:\n${cardMetaMissing.join('\n')}`);

const ledgerSource = await read('docs/VISUAL_PARITY_LEDGER.md');
for (const expected of [
  '| Foundation guidelines | 20 |',
  '| Component cards | 83 |',
  '| Template cards | 4 |',
  '| Runtime export gaps | 0 |',
  '| React exports | 150 |',
]) {
  assert(ledgerSource.includes(expected), `Visual parity ledger coverage row is missing: ${expected}`);
}

console.log(
  `Validated audit coverage: ${guidelineFiles.length} guidelines, ${componentCardFiles.length} component cards, ${templateCardFiles.length} template cards.`
);
