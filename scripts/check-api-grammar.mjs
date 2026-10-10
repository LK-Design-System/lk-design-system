import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'API_GRAMMAR_BASELINE.json');
const update = process.argv.includes('--update-baseline');
const allowedSizes = new Set(['sm', 'md', 'lg', 'small', 'medium', 'large']);
// The status-tone axis has exactly one canonical lexicon, the one STATUS_TONE_STYLE keys on.
// `normalizeStatusTone` also accepts pre-canonicalisation aliases (info · success · warning ·
// error · normal · neutral · critical · online) and they keep rendering, but they used to sit in
// this allow-set — which meant every new component could reach for `warning` instead of
// `cautionary` for free, and the vocabulary re-split as fast as it was unified. They are now
// ledgered in API_GRAMMAR_BASELINE.json instead: existing unions pass, new ones fail.
// QUALITY_GAP_AUDIT.json ("status tone 어휘 3계열 잔존") tracks retiring them for real.
const allowedTones = new Set(['positive', 'cautionary', 'negative', 'signal', 'offline']);

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
    const hasOnValueChange = props.has('onValueChange');
    const hasControlledChange = hasOnChange || hasOnValueChange;
    if ((hasDefault && (!hasValue || !hasControlledChange)) || (hasValue && !hasControlledChange)) {
      findings.incompleteControlledTriads.push(`${key}:value=${hasValue},defaultValue=${hasDefault},onChange=${hasOnChange}`);
    }
    const onChange = props.get('onChange');
    if (onChange && /(?:ChangeEvent|\bEvent\b|SyntheticEvent)/.test(onChange)) {
      findings.eventFirstOnChange.push(`${key}:${onChange.replace(/\s+/g, ' ')}`);
    }
  }
}
// Component-owned size decisions are separate from historical API debt. They
// retain the global vocabulary and every baseline entry; each approved opt-in
// must still exist in the public contract and carry reviewable source evidence.
const decisionsPath = path.join(root, 'docs/references/quality/API_GRAMMAR_COMPONENT_AXES.json');
const decisions = JSON.parse(await readFile(decisionsPath, 'utf8'));
if (decisions.schemaVersion !== 1 || !Array.isArray(decisions.sizeAxes)) {
  throw new Error('Invalid component-owned API grammar size-axis register.');
}
const approvedSizeFindings = new Set();
for (const decision of decisions.sizeAxes) {
  const keys = Object.keys(decision).sort().join(',');
  if (keys !== 'evidence,finding,owner,rationale,status' || decision.status !== 'approved'
      || decision.owner !== 'LDS design owner' || !decision.rationale?.trim()
      || !/^components\/[A-Za-z0-9_/-]+\.d\.ts#[A-Za-z0-9_]+Props:size=[A-Za-z0-9_-]+$/.test(decision.finding)
      || approvedSizeFindings.has(decision.finding)
      || !findings.nonstandardSizeValues.includes(decision.finding)
      || !Array.isArray(decision.evidence) || decision.evidence.length < 3
      || new Set(decision.evidence.map(item => item.path)).size !== decision.evidence.length
      || !['docs/', 'components/', 'stories/'].every(prefix => decision.evidence.some(item => item.path?.startsWith(prefix)))) {
    throw new Error('Invalid, unapproved, duplicate or stale component-owned size decision: ' + decision.finding);
  }
  for (const evidence of decision.evidence) {
    if (Object.keys(evidence).sort().join(',') !== 'contains,path'
        || typeof evidence.path !== 'string' || !/^(?:docs|components|stories)\//.test(evidence.path)
        || evidence.path.includes('..') || evidence.path.includes('\\')
        || !evidence.contains?.trim()
        || !(await readFile(path.join(root, evidence.path), 'utf8')).includes(evidence.contains)) {
      throw new Error('Missing component-owned size decision evidence: ' + decision.finding);
    }
  }
  approvedSizeFindings.add(decision.finding);
}
findings.nonstandardSizeValues = findings.nonstandardSizeValues.filter(value => !approvedSizeFindings.has(value));
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
