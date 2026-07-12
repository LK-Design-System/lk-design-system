import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'API_GRAMMAR_BASELINE.json');
const update = process.argv.includes('--update-baseline');
const allowedSizes = new Set(['sm', 'md', 'lg', 'small', 'medium', 'large']);
const allowedTones = new Set(['positive', 'cautionary', 'negative', 'signal', 'offline', 'info', 'success', 'warning', 'error', 'normal', 'neutral', 'critical', 'online']);

async function collect(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, out);
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) out.push(absolute);
  }
  return out.sort();
}

function propertyMap(node, file) {
  return new Map(node.members.filter(ts.isPropertySignature).map((member) => [
    member.name?.text,
    member.type?.getText(file) || '',
  ]).filter(([name]) => name));
}

const findings = {
  nonstandardSizeValues: [],
  nonstandardToneValues: [],
  nonstandardAccessibleNameProps: [],
  incompleteControlledTriads: [],
  eventFirstOnChange: [],
};

for (const absolute of await collect(path.join(root, 'components'))) {
  const rel = path.relative(root, absolute).replaceAll('\\', '/');
  const source = await readFile(absolute, 'utf8');
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const node of file.statements.filter(ts.isInterfaceDeclaration)) {
    if (!node.name.text.endsWith('Props')) continue;
    const props = propertyMap(node, file);
    const key = `${rel}#${node.name.text}`;
    for (const [prop, allowed, bucket] of [['size', allowedSizes, 'nonstandardSizeValues'], ['tone', allowedTones, 'nonstandardToneValues']]) {
      const type = props.get(prop);
      if (!type) continue;
      for (const value of [...type.matchAll(/["']([^"']+)["']/g)].map((match) => match[1])) {
        if (!allowed.has(value)) findings[bucket].push(`${key}:${prop}=${value}`);
      }
    }
    for (const prop of props.keys()) {
      if (['accessibleLabel', 'accessibilityLabel', 'labelForAccessibility'].includes(prop)) {
        findings.nonstandardAccessibleNameProps.push(`${key}:${prop}`);
      }
    }
    const hasValue = props.has('value');
    const hasDefault = props.has('defaultValue');
    const hasOnChange = props.has('onChange');
    if ((hasDefault && (!hasValue || !hasOnChange)) || (hasValue && !hasOnChange)) {
      findings.incompleteControlledTriads.push(`${key}:value=${hasValue},defaultValue=${hasDefault},onChange=${hasOnChange}`);
    }
    const onChange = props.get('onChange');
    if (onChange && /(?:ChangeEvent|\bEvent\b|SyntheticEvent)/.test(onChange)) {
      findings.eventFirstOnChange.push(`${key}:${onChange.replace(/\s+/g, ' ')}`);
    }
  }
}
for (const values of Object.values(findings)) values.sort();

if (update) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({ schemaVersion: 1, findings }, null, 2)}\n`);
  console.log(`Updated API grammar baseline: ${Object.entries(findings).map(([key, values]) => `${key}=${values.length}`).join(', ')}.`);
  process.exit(0);
}
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [category, values] of Object.entries(findings)) {
  const allowed = new Set(baseline.findings?.[category] || []);
  values.filter((value) => !allowed.has(value)).forEach((value) => regressions.push(`${category}: ${value}`));
}
if (regressions.length) throw new Error(`API grammar regressions detected:\n- ${regressions.join('\n- ')}`);
console.log('Validated API grammar ratchet: 0 new vocabulary, controlled-state, accessible-name, or onChange signature violations.');
