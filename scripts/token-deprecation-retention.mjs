import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const contractPath = 'docs/references/quality/TOKEN_DEPRECATION_RETENTION.json';
const exactKeys = (value, keys, label) => assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label}: unexpected or missing fields`);
const text = (value, label) => assert(typeof value === 'string' && value.trim(), `${label}: required text`);
function version(value, stable = true) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?(?:\+([\w.-]+))?$/.exec(value);
  assert(match && (!stable || (!match[4] && !match[5])), `Invalid retention semantic version: ${value}`);
  return match.slice(1, 4).map(Number);
}
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

// Property names only: a token appearing in a value, comment or selector is
// never treated as a compatibility declaration. Keep offsets for the scanner.
export function cssDeclarations(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, match => ' '.repeat(match.length));
  return [...clean.matchAll(/(?:^|[;{}])\s*(--[a-zA-Z0-9_-]+)\s*:\s*([^;{}]+);/gm)].map(match => ({
    name: match[1], value: match[2].trim(), at: match.index + match[0].indexOf(match[1]),
  }));
}

export async function loadTokenRetention(root, source) {
  const contract = JSON.parse(await readFile(path.join(root, contractPath), 'utf8'));
  exactKeys(contract, ['schemaVersion', 'component', 'firstDeprecatedMinor', 'reviewBy', 'removal', 'migration', 'tokens'], contractPath);
  assert.equal(contract.schemaVersion, 1, 'Unknown token retention schema');
  text(contract.component, 'affected component');
  assert(/^components\/[\w/-]+\.jsx$/.test(contract.component), 'Invalid affected component');
  await readFile(path.join(root, contract.component), 'utf8');
  const first = version(contract.firstDeprecatedMinor);
  const review = version(contract.reviewBy);
  const current = version(JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version, false);
  assert(first[2] === 0 && review[2] === 0 && compare(review, [first[0], first[1] + 1, 0]) >= 0, 'Retention must span at least one complete minor cycle');
  assert(compare(current, review) < 0, `Token retention review expired at ${contract.reviewBy}; no automatic removal is permitted`);
  assert.equal(contract.removal, 'Explicit breaking-change approval required; review expiry never removes tokens automatically.');
  assert.equal(contract.migration, 'docs/TOKEN_GOVERNANCE.md#shell-panel-retained-compatibility');
  const document = await readFile(path.join(root, 'docs/TOKEN_GOVERNANCE.md'), 'utf8');
  const section = document.split('### Shell-panel retained compatibility\n')[1]?.split(/\n#{1,3} /)[0];
  assert(section, 'Missing token retention migration section');
  for (const required of [contract.component, contract.firstDeprecatedMinor, contract.reviewBy, contract.removal]) {
    assert(section.includes(required), `Missing migration fact: ${required}`);
  }
  assert(Array.isArray(contract.tokens) && contract.tokens.length, 'Retention must register tokens');
  const retained = new Map();
  for (const entry of contract.tokens) {
    exactKeys(entry, ['css', 'sourcePath', 'replacement', 'preservedSource', 'declarations'], 'retained token');
    assert(/^--component-[a-z0-9-]+$/.test(entry.css) && !retained.has(entry.css), 'Invalid or duplicate retained token');
    assert(/^component\.[a-zA-Z0-9]+\.tokens\.[a-zA-Z0-9]+$/.test(entry.sourcePath), 'Invalid retained source path');
    text(entry.replacement, `${entry.css} replacement`);
    for (const required of [entry.css, entry.replacement]) assert(section.includes(required), `Missing migration fact: ${required}`);
    const node = entry.sourcePath.split('.').reduce((value, key) => value?.[key], source);
    assert.equal(node?.css, entry.css, `${entry.css}: missing source identity`);
    assert(/^Deprecated\b/.test(node.$description || ''), `${entry.css}: source must be Deprecated`);
    for (const required of [entry.replacement, contract.firstDeprecatedMinor, contract.reviewBy, contract.migration]) {
      assert(node.$description.includes(required), `${entry.css}: missing source migration fact ${required}`);
    }
    assert.equal(source.component[entry.sourcePath.split('.')[1]]?.component, contract.component, `${entry.css}: affected component mismatch`);
    assert.deepEqual(Object.fromEntries(Object.entries(node).filter(([key]) => key !== '$description')), entry.preservedSource, `${entry.css}: retained source value changed`);
    assert(entry.declarations && Object.keys(entry.declarations).length, `${entry.css}: missing retained declarations`);
    for (const [file, values] of Object.entries(entry.declarations)) {
      assert(/^tokens\/[\w-]+\.css$/.test(file), 'Retention declarations must be token CSS');
      assert(Array.isArray(values) && values.length && values.every(value => typeof value === 'string' && value.trim()), 'Missing retained declaration values');
      const declarations = cssDeclarations(await readFile(path.join(root, file), 'utf8')).filter(item => item.name === entry.css);
      assert.deepEqual(declarations.map(item => item.value).sort(), [...values].sort(), `${entry.css}: retained CSS values/count changed in ${file}`);
    }
    retained.set(entry.css, entry);
  }
  return retained;
}

// Only the exact property-name occurrence at an approved token CSS declaration
// is allowed. A same-line var(), new CSS file, JS key or prose mention still fails.
export function retainedTokenReferences(source, rel, retained) {
  const allowed = new Set();
  if (rel.endsWith('.css')) {
    for (const declaration of cssDeclarations(source)) {
      const entry = retained.get(declaration.name);
      if (entry?.declarations[rel]?.includes(declaration.value)) allowed.add(declaration.at);
    }
  }
  return [...source.matchAll(/--[a-zA-Z0-9_-]+/g)]
    .filter(match => retained.has(match[0]) && !allowed.has(match.index))
    .map(match => ({ name: match[0], line: source.slice(0, match.index).split('\n').length }));
}
