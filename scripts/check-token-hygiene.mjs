import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'TOKEN_HYGIENE_BASELINE.json');
const updateBaseline = process.argv.includes('--update-baseline');

async function collect(dir, predicate, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, predicate, out);
    else if (entry.isFile() && predicate(absolute)) out.push(absolute);
  }
  return out.sort();
}

function tokenObjects(value, currentPath = '', result = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => tokenObjects(item, `${currentPath}[${index}]`, result));
    return result;
  }
  if (!value || typeof value !== 'object') return result;
  if (value.$type || value.css || value.ref) result.push({ path: currentPath, token: value });
  for (const [key, child] of Object.entries(value)) {
    tokenObjects(child, currentPath ? `${currentPath}.${key}` : key, result);
  }
  return result;
}

function definitionEntries(source, rel) {
  return [...source.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)].map((match) => ({
    rel,
    name: match[1],
    value: match[2].trim(),
  }));
}

function owner(name) {
  return name.match(/^--component-([a-z0-9]+)/)?.[1] || null;
}

const tokenFiles = await collect(path.join(root, 'tokens'), (file) => file.endsWith('.css'));
const scanRoots = ['tokens', 'components', 'stories', '.storybook'];
const scanFiles = [path.join(root, 'styles.css')];
for (const scanRoot of scanRoots) {
  scanFiles.push(...await collect(path.join(root, scanRoot), (file) => /\.(css|js|jsx|ts|tsx|md)$/.test(file)));
}

const fileSources = new Map();
for (const absolute of [...new Set(scanFiles)]) {
  fileSources.set(absolute, await readFile(absolute, 'utf8'));
}

const definitions = [];
for (const absolute of tokenFiles) {
  const rel = path.relative(root, absolute).replaceAll('\\', '/');
  definitions.push(...definitionEntries(fileSources.get(absolute), rel));
}

const definitionCounts = new Map();
for (const { name } of definitions) definitionCounts.set(name, (definitionCounts.get(name) || 0) + 1);
const occurrenceCounts = new Map();
for (const source of fileSources.values()) {
  for (const match of source.matchAll(/--[a-zA-Z0-9_-]+/g)) {
    occurrenceCounts.set(match[0], (occurrenceCounts.get(match[0]) || 0) + 1);
  }
}

const source = JSON.parse(await readFile(path.join(root, 'tokens', 'source.json'), 'utf8'));
const sourceTokens = tokenObjects(source);
const sourceComponentNames = new Set(sourceTokens
  .filter(({ path: tokenPath }) => tokenPath.startsWith('component.'))
  .flatMap(({ token }) => Array.isArray(token.css) ? token.css : [token.css])
  .filter((name) => typeof name === 'string' && name.startsWith('--component-')));

const componentDefinitions = definitions
  .filter(({ rel, name }) => rel === 'tokens/components.css' && name.startsWith('--component-'))
  .map(({ name }) => name);

const findings = {
  missingComponentSource: [...new Set(componentDefinitions.filter((name) => !sourceComponentNames.has(name)))].sort(),
  unusedTokens: [...definitionCounts.keys()]
    .filter((name) => (occurrenceCounts.get(name) || 0) <= (definitionCounts.get(name) || 0))
    .sort(),
  invalidNames: [...definitionCounts.keys()].filter((name) => !/^--[a-z0-9-]+$/.test(name)).sort(),
  transparentColors: sourceTokens
    .filter(({ token }) => token.$type === 'color' && (
      token.$value === 'transparent' || Object.values(token.modes || {}).includes('transparent')
    ))
    .map(({ path: tokenPath }) => tokenPath)
    .sort(),
  crossComponentRefs: definitions.flatMap(({ name, value }) => {
    const sourceOwner = owner(name);
    if (!sourceOwner) return [];
    return [...value.matchAll(/var\((--component-[a-z0-9-]+)/g)]
      .map((match) => match[1])
      .filter((reference) => owner(reference) && owner(reference) !== sourceOwner)
      .map((reference) => `${name}->${reference}`);
  }).sort(),
  rawColorLiterals: definitions
    .filter(({ rel, value }) => rel !== 'tokens/color-atomic.css' && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(value))
    .map(({ rel, name, value }) => `${rel}:${name}:${value.replace(/\s+/g, ' ')}`)
    .sort(),
};

const baseline = {
  schemaVersion: 1,
  description: 'Known token hygiene debt. New missing-source, dead, invalid, misleading, cross-owner, or raw-color tokens are rejected.',
  findings,
};

if (updateBaseline) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
  console.log(`Updated token hygiene baseline: ${Object.entries(findings).map(([key, values]) => `${key}=${values.length}`).join(', ')}.`);
  process.exit(0);
}

const expected = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [category, values] of Object.entries(findings)) {
  const allowed = new Set(expected.findings?.[category] || []);
  for (const value of values) {
    if (!allowed.has(value)) regressions.push(`${category}: ${value}`);
  }
}
if (regressions.length > 0) {
  throw new Error(`Token hygiene regressions detected:\n- ${regressions.join('\n- ')}`);
}

console.log(`Validated token hygiene ratchet: ${definitions.length} CSS definitions, 0 new hygiene regressions.`);
