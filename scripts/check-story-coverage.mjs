import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'STORY_COVERAGE_BASELINE.json');
const update = process.argv.includes('--update-baseline');

async function collect(dir, suffix, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, suffix, out);
    else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(absolute);
  }
  return out.sort();
}

const storyFiles = await collect(path.join(root, 'stories'), '.stories.jsx');
const storySources = await Promise.all(storyFiles.map(async (file) => [file, await readFile(file, 'utf8')]));
const storyCorpus = storySources.map(([, source]) => source).join('\n');
const parityCorpus = storySources.filter(([, source]) => source.includes('visual-parity')).map(([, source]) => source).join('\n');
const findings = {
  storyFilesWithoutPlay: storySources.filter(([, source]) => !/\bplay\s*:/.test(source)).map(([file]) => path.relative(root, file).replaceAll('\\', '/')),
  storyFilesWithoutNarrowEvidence: storySources.filter(([, source]) => !/320|narrow/i.test(source)).map(([file]) => path.relative(root, file).replaceAll('\\', '/')),
  disabledStateGaps: [],
  loadingStateGaps: [],
  emptyStateGaps: [],
  visualParityGaps: [],
};

const classification = JSON.parse(
  await readFile(path.join(root, 'docs', 'references', 'wds', 'PUBLIC_EXPORT_CLASSIFICATION.json'), 'utf8'),
);
const internalModulePaths = new Set(
  (classification.internalModules ?? []).map((module) => path.normalize(path.join(root, module.path))),
);

function componentPropNames(declarationSource, componentName) {
  const file = ts.createSourceFile(
    `${componentName}.d.ts`,
    declarationSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const interfaces = new Map();
  for (const node of file.statements) {
    if (!ts.isInterfaceDeclaration(node)) continue;
    interfaces.set(node.name.text, {
      props: node.members
        .filter(ts.isPropertySignature)
        .map((member) => member.name?.text)
        .filter(Boolean),
      parents: (node.heritageClauses ?? [])
        .flatMap((clause) => clause.types)
        .map((type) => ts.isIdentifier(type.expression) ? type.expression.text : null)
        .filter(Boolean),
    });
  }
  const target = `${componentName}Props`;
  if (!interfaces.has(target)) return null;
  const collect = (name, seen = new Set()) => {
    if (seen.has(name) || !interfaces.has(name)) return [];
    seen.add(name);
    const row = interfaces.get(name);
    return [...row.props, ...row.parents.flatMap((parent) => collect(parent, seen))];
  };
  return new Set(collect(target));
}

for (const jsxPath of (await collect(path.join(root, 'components'), '.jsx'))
  .filter((file) => !internalModulePaths.has(path.normalize(file)))) {
  const rel = path.relative(root, jsxPath).replaceAll('\\', '/');
  const source = await readFile(jsxPath, 'utf8');
  const declarationSource = await readFile(jsxPath.replace(/\.jsx$/, '.d.ts'), 'utf8').catch(() => source);
  const exports = [...source.matchAll(/^export\s+(?:function|const)\s+([A-Za-z_$][\w$]*)/gm)].map((match) => match[1]);
  for (const name of exports) {
    const propNames = componentPropNames(declarationSource, name);
    const declaresProp = (fallbackPattern, predicate) => propNames
      ? [...propNames].some(predicate)
      : fallbackPattern.test(declarationSource);
    const stateEvidence = (prop) => new RegExp(`<${name}\\b[\\s\\S]{0,500}\\b${prop}\\b`).test(storyCorpus);
    if (declaresProp(/\bdisabled\??\s*:/, (prop) => prop === 'disabled') && !stateEvidence('disabled')) findings.disabledStateGaps.push(`${rel}#${name}`);
    if (declaresProp(/\bloading\w*\??\s*:/, (prop) => prop.startsWith('loading')) && !stateEvidence('loading')) findings.loadingStateGaps.push(`${rel}#${name}`);
    if (declaresProp(/\bempty(?:Label|Message)?\??\s*:/, (prop) => /^(?:empty|emptyLabel|emptyMessage)$/.test(prop)) && !stateEvidence('empty(?:Label|Message)?')) findings.emptyStateGaps.push(`${rel}#${name}`);
    if (!new RegExp(`<${name}\\b`).test(parityCorpus)) findings.visualParityGaps.push(`${rel}#${name}`);
  }
}
for (const values of Object.values(findings)) values.sort();

if (update) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({ schemaVersion: 1, findings }, null, 2)}\n`);
  console.log(`Updated story coverage baseline: ${Object.entries(findings).map(([key, values]) => `${key}=${values.length}`).join(', ')}.`);
  process.exit(0);
}
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [category, values] of Object.entries(findings)) {
  const allowed = new Set(baseline.findings?.[category] || []);
  values.filter((value) => !allowed.has(value)).forEach((value) => regressions.push(`${category}: ${value}`));
}
if (regressions.length) throw new Error(`Story coverage regressions detected:\n- ${regressions.join('\n- ')}`);
console.log('Validated story coverage ratchet: 0 new play, narrow, state, or visual-parity coverage gaps.');
