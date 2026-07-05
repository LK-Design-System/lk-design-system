import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'tokens', 'source.json');
const componentCssPath = path.join(root, 'tokens', 'components.css');
const stylesPath = path.join(root, 'styles.css');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function collectCssRefs(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectCssRefs(item, refs);
    return refs;
  }

  if (!value || typeof value !== 'object') return refs;

  if (typeof value.css === 'string') refs.push(value.css);
  if (Array.isArray(value.css)) refs.push(...value.css);

  for (const child of Object.values(value)) {
    collectCssRefs(child, refs);
  }

  return refs;
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const componentCss = await readFile(componentCssPath, 'utf8');
const stylesCss = await readFile(stylesPath, 'utf8');

for (const key of ['metadata', 'primitive', 'semantic', 'component', 'modes']) {
  assert(source[key], `tokens/source.json is missing top-level "${key}".`);
}

for (const name of ['button', 'input', 'card']) {
  assert(source.component[name]?.tokens, `tokens/source.json is missing component.${name}.tokens.`);
}

assert(
  source.metadata.runtimeCssFiles.includes('tokens/components.css'),
  'tokens/source.json metadata.runtimeCssFiles must include tokens/components.css.'
);

assert(
  stylesCss.includes("@import url('tokens/components.css');"),
  'styles.css must import tokens/components.css.'
);

const componentRefs = [...new Set(collectCssRefs(source.component))]
  .filter((ref) => ref.startsWith('--component-'));

const missingRefs = componentRefs.filter((ref) => !componentCss.includes(`${ref}:`));

assert(
  missingRefs.length === 0,
  `Component token CSS references are missing from tokens/components.css: ${missingRefs.join(', ')}`
);

console.log(`Validated ${componentRefs.length} component token CSS references.`);
