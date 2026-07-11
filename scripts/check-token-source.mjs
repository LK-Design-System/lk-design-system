import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'tokens', 'source.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectTokenObjects(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectTokenObjects(item, result);
    return result;
  }
  if (!value || typeof value !== 'object') return result;
  if (value.$type || value.css || value.ref) result.push(value);
  for (const child of Object.values(value)) collectTokenObjects(child, result);
  return result;
}

function getPath(value, dottedPath) {
  return dottedPath.split('.').reduce((current, segment) => current?.[segment], value);
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
for (const key of ['metadata', 'primitive', 'semantic', 'component', 'modes']) {
  assert(source[key], `tokens/source.json is missing top-level "${key}".`);
}

for (const mode of ['light', 'dark', 'auto']) {
  assert(source.modes[mode]?.selector, `tokens/source.json is missing modes.${mode}.selector.`);
}

const runtimeFiles = source.metadata.runtimeCssFiles;
assert(Array.isArray(runtimeFiles) && runtimeFiles.length > 0, 'metadata.runtimeCssFiles must be a non-empty array.');
assert(new Set(runtimeFiles).size === runtimeFiles.length, 'metadata.runtimeCssFiles contains duplicates.');

const requiredColorOutputs = [
  'tokens/color-atomic.css',
  'tokens/color-semantic.css',
  'tokens/color-components.css',
];
for (const file of requiredColorOutputs) {
  assert(runtimeFiles.includes(file), `metadata.runtimeCssFiles must include ${file}.`);
}

const stylesCss = await readFile(path.join(root, 'styles.css'), 'utf8');
for (const file of runtimeFiles) {
  await access(path.join(root, file));
  if (file.endsWith('.css')) {
    assert(stylesCss.includes(`@import url('${file}');`), `styles.css must import ${file}.`);
  }
}

const colorRamps = source.primitive.colorRamps;
assert(colorRamps && Object.keys(colorRamps).length >= 1, 'primitive.colorRamps must define atomic color families.');
const atomicTokens = Object.values(colorRamps).flatMap((family) => Object.values(family.tokens || {}));
assert(atomicTokens.length >= 1, 'primitive.colorRamps must define atomic color tokens.');
for (const token of atomicTokens) {
  assert(token.$type === 'color' && token.$value && token.css?.startsWith('--color-atomic-'), 'Every atomic color token needs $type=color, $value, and --color-atomic-* css.');
}
assert(new Set(atomicTokens.map((token) => token.css)).size === atomicTokens.length, 'Atomic CSS variable names must be unique.');

const colorRoles = source.semantic.colorRoles;
assert(colorRoles && Object.keys(colorRoles).length >= 1, 'semantic.colorRoles must define semantic colors.');
const semanticCssNames = new Set();
for (const [name, token] of Object.entries(colorRoles)) {
  assert(token.$type === 'color', `semantic.colorRoles.${name} must use $type=color.`);
  assert(token.css === `--color-semantic-${name}`, `semantic.colorRoles.${name}.css must be --color-semantic-${name}.`);
  assert(token.modes?.light && token.modes?.dark, `semantic.colorRoles.${name} must define light and dark values.`);
  assert(!semanticCssNames.has(token.css), `Duplicate semantic CSS variable: ${token.css}`);
  semanticCssNames.add(token.css);
}

assert(!JSON.stringify(source).includes('--bw-'), 'tokens/source.json must not reintroduce removed --bw-* color names.');

for (const token of collectTokenObjects(source)) {
  if (!token.ref || !/^(primitive|semantic|component)\./.test(token.ref)) continue;
  assert(getPath(source, token.ref), `Token reference does not resolve: ${token.ref}`);
}

for (const name of ['button', 'input', 'card']) {
  assert(source.component[name]?.tokens, `tokens/source.json is missing component.${name}.tokens.`);
}

const componentCss = [
  await readFile(path.join(root, 'tokens', 'components.css'), 'utf8'),
  await readFile(path.join(root, 'tokens', 'color-components.css'), 'utf8'),
].join('\n');
const componentRefs = [...new Set(collectTokenObjects(source.component)
  .flatMap((token) => Array.isArray(token.css) ? token.css : [token.css])
  .filter((css) => typeof css === 'string' && css.startsWith('--component-')))];
const missingRefs = componentRefs.filter((ref) => !componentCss.includes(`${ref}:`));
assert(missingRefs.length === 0, `Component token CSS references are missing: ${missingRefs.join(', ')}`);

const generator = await readFile(path.join(root, 'scripts', 'generate-lk-color-system.mjs'), 'utf8');
assert(generator.includes("const SOURCE_PATH = 'tokens/source.json'"), 'Color generator must read tokens/source.json.');
assert(!generator.includes('docs/references/wds/'), 'Color generator must not read WDS evidence as a runtime source.');

console.log(`Validated token source: ${atomicTokens.length} atomic colors, ${semanticCssNames.size} semantic colors, ${componentRefs.length} component variables, no legacy color layer.`);
