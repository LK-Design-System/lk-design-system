import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// The editor, viz, and robotics component groups keep their prompt.md contracts
// in THIS repository while their implementations, type surfaces, and stories
// live in the external Robotics repository. Every other group is guarded by
// check-api-drift's in-repo three-way sync (JSX / .d.ts / .prompt.md); this
// check extends the same discipline across the repository seam so a contract
// and its implementation cannot drift apart silently.
//
// Like the other ratchets, a baseline records the currently-known findings and
// only NEW drift fails the check. Refresh with --update-baseline.

const root = process.cwd();
const roboticsRootArg = process.argv.find((arg) => arg.startsWith('--root='))?.slice('--root='.length);
const roboticsRoot = path.resolve(root, roboticsRootArg || '../lk-design-system-robotics');
const updateBaseline = process.argv.includes('--update-baseline');
const baselinePath = path.join(root, 'docs/references/robotics/CONTRACT_DRIFT_BASELINE.json');
// Full groups are entirely implemented in the Robotics repository, so every
// prompt must have an implementation and vice versa. Sparse groups share their
// name with main-repo components (navigation holds SideNav here but FloorSelector
// there), so only the components present in BOTH repositories are checked.
const FULL_GROUPS = ['editor', 'viz', 'robotics'];
const SPARSE_GROUPS = ['navigation'];
const CONTRACT_GROUPS = [...FULL_GROUPS, ...SPARSE_GROUPS];

// DOM/React attributes that legitimately appear in prompt code fences without
// being a component's own contracted prop.
const STANDARD_ATTRS = new Set([
  'children', 'className', 'style', 'key', 'ref', 'id', 'role', 'title', 'value',
  'type', 'name', 'onClick', 'onChange', 'onKeyDown', 'onFocus', 'onBlur', 'tabIndex', 'hidden',
]);

// Props a prompt's JSX examples set on the documented component itself but the
// .d.ts does not declare — the doc→impl direction the impl→doc scan cannot see
// (e.g. a prompt promoting a `model` prop the component never implemented).
// Only the component's OWN opening tags are scanned: attributes on child
// components or SVG elements inside the example belong to those elements.
function phantomPropsFromPrompt(prompt, component, props) {
  const declared = new Set(props);
  const phantom = new Set();
  for (const fence of prompt.matchAll(/```[\s\S]*?```/g)) {
    // The opening `<Component` tag, read to its matching `>` at brace depth 0 so
    // a slot prop whose value contains nested JSX (icon={<Icon size={16}/>}) is
    // captured whole rather than truncated at the child element's `>`.
    const source = fence[0];
    const openPattern = new RegExp(`<${component}\\b`, 'g');
    for (let open = openPattern.exec(source); open; open = openPattern.exec(source)) {
      let depth = 0;
      let end = open.index + open[0].length;
      while (end < source.length) {
        const ch = source[end];
        if (ch === '{') depth += 1;
        else if (ch === '}') depth -= 1;
        else if (ch === '>' && depth === 0) break;
        end += 1;
      }
      // Strip every brace-delimited value so nested child attributes disappear,
      // leaving only this component's own top-level attribute names.
      const attrs = source.slice(open.index + open[0].length, end).replace(/\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/g, '=');
      for (const attr of attrs.matchAll(/(?:^|\s)([a-z][A-Za-z0-9]*)=/g)) {
        const name = attr[1];
        if (declared.has(name) || STANDARD_ATTRS.has(name) || name.includes('-')) continue;
        phantom.add(name);
      }
    }
  }
  return [...phantom].sort();
}

function fail(message) {
  throw new Error(message);
}

if (!existsSync(path.join(roboticsRoot, 'src', 'components'))) {
  fail(
    `Robotics repository not found at ${path.relative(root, roboticsRoot)} `
    + '(pass --root=<robotics checkout> to point at it). The editor/viz/robotics '
    + 'contracts cannot be verified without their implementations.',
  );
}

function listFiles(dir, suffix) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith(suffix));
}

// Own props of the component's Props interface: directly declared members plus
// same-file interface parents. External parents (React.HTMLAttributes and
// friends) are inherited platform surface, not contract surface.
function ownPropsFromDts(source, rel) {
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const interfaces = new Map();
  for (const node of file.statements) {
    if (!ts.isInterfaceDeclaration(node)) continue;
    interfaces.set(node.name.text, {
      props: node.members
        .filter(ts.isPropertySignature)
        .map((member) => member.name?.text)
        .filter(Boolean),
      parents: (node.heritageClauses || [])
        .flatMap((clause) => clause.types)
        .map((type) => (ts.isIdentifier(type.expression) ? type.expression.text : null))
        .filter(Boolean),
    });
  }
  const collect = (name, seen = new Set()) => {
    if (seen.has(name) || !interfaces.has(name)) return [];
    seen.add(name);
    const { props, parents } = interfaces.get(name);
    return [...props, ...parents.flatMap((parent) => collect(parent, seen))];
  };
  const propsInterfaces = [...interfaces.keys()].filter((name) => name.endsWith('Props'));
  return [...new Set(propsInterfaces.flatMap((name) => collect(name)))];
}

function wordsMentioned(text, names) {
  return names.filter((name) => !new RegExp(`(^|[^\\w$])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w$]|$)`).test(text));
}

const findings = {};
function record(component, kind, value) {
  findings[component] ??= {};
  findings[component][kind] = value;
}

for (const group of CONTRACT_GROUPS) {
  const sparse = SPARSE_GROUPS.includes(group);
  const contractDir = path.join(root, 'components', group);
  const implementationDir = path.join(roboticsRoot, 'src', 'components', group);
  const prompts = new Set(listFiles(contractDir, '.prompt.md').map((name) => name.replace('.prompt.md', '')));
  const implementations = new Set(listFiles(implementationDir, '.jsx').map((name) => name.replace('.jsx', '')));

  for (const component of prompts) {
    const key = `${group}/${component}`;
    if (!implementations.has(component)) {
      // In a sparse group a prompt without a robotics impl is a main-repo
      // component, not drift.
      if (!sparse) record(key, 'missingImplementation', true);
      continue;
    }
    const dtsPath = path.join(implementationDir, `${component}.d.ts`);
    if (!existsSync(dtsPath)) {
      record(key, 'missingTypeContract', true);
      continue;
    }
    const prompt = readFileSync(path.join(contractDir, `${component}.prompt.md`), 'utf8');
    const props = ownPropsFromDts(readFileSync(dtsPath, 'utf8'), `${component}.d.ts`);
    const undocumented = wordsMentioned(prompt, props).sort();
    if (undocumented.length > 0) record(key, 'undocumentedProps', undocumented);
    const phantom = phantomPropsFromPrompt(prompt, component, props);
    if (phantom.length > 0) record(key, 'phantomProps', phantom);
  }

  // A robotics impl with no main-repo prompt is missing its contract — but only
  // in full groups, where the whole group is robotics-owned.
  if (!sparse) {
    for (const component of implementations) {
      if (!prompts.has(component)) record(`${group}/${component}`, 'missingPrompt', true);
    }
  }
}

const baseline = {
  schemaVersion: 1,
  description:
    'Known contract drift between this repository’s editor/viz/robotics prompt.md '
    + 'contracts and their implementations in the Robotics repository. The guard '
    + 'rejects only newly introduced drift; shrink this file by fixing entries, '
    + 'refresh it with check:robotics-contract-drift -- --update-baseline.',
  findings: Object.fromEntries(Object.entries(findings).sort(([a], [b]) => a.localeCompare(b))),
};

if (updateBaseline) {
  writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`Captured robotics contract drift baseline: ${Object.keys(findings).length} known findings.`);
  process.exit(0);
}

const known = existsSync(baselinePath)
  ? JSON.parse(readFileSync(baselinePath, 'utf8')).findings || {}
  : {};

const regressions = [];
for (const [component, kinds] of Object.entries(findings)) {
  for (const [kind, value] of Object.entries(kinds)) {
    const knownValue = known[component]?.[kind];
    if (kind === 'undocumentedProps' || kind === 'phantomProps') {
      const fresh = value.filter((prop) => !(knownValue || []).includes(prop));
      if (fresh.length > 0) regressions.push(`${component} ${kind}: ${fresh.join(', ')}`);
    } else if (!knownValue) {
      regressions.push(`${component} ${kind}`);
    }
  }
}

if (regressions.length > 0) {
  fail(`Robotics contract drift regressions detected:\n- ${regressions.join('\n- ')}`);
}

const total = Object.keys(findings).length;
console.log(
  `Validated robotics contract drift: ${CONTRACT_GROUPS.length} groups, `
  + `${total} known findings, 0 new regressions (implementations at ${path.relative(root, roboticsRoot)}).`,
);
