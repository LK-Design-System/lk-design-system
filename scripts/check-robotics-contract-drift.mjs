import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Robotics-owned components keep their prompt.md contracts in THIS repository
// while implementations, type surfaces, and stories live in the external
// Robotics repository. Product-owned compatibility facades are intentionally
// skipped because check-api-drift guards their canonical in-repo sources.
//
// Like the other ratchets, a baseline records the currently-known findings and
// only NEW drift fails the check. Refresh with --update-baseline.

const root = process.cwd();
const roboticsRootArg = process.argv.find((arg) => arg.startsWith('--root='))?.slice('--root='.length);
const roboticsRoot = path.resolve(root, roboticsRootArg || '../lk-design-system-robotics');
const updateBaseline = process.argv.includes('--update-baseline');
const baselinePath = path.join(root, 'docs/references/robotics/CONTRACT_DRIFT_BASELINE.json');
const CONTRACT_GROUPS = ['editor', 'viz', 'robotics', 'navigation'];
const classification = JSON.parse(readFileSync(
  path.join(root, 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'),
  'utf8',
));
const roboticsOwnedComponents = new Set(
  (classification.groups ?? [])
    .filter((group) => group.ownerLayer === 'robotics')
    .flatMap((group) => group.exports ?? []),
);

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
// local relative interface parents. Platform parents from React remain outside
// the component contract.
function ownPropsFromDts(source, rel, implementationDir) {
  const interfaces = new Map();
  const rootInterfaces = new Set();
  const visited = new Set();
  const rootPath = path.resolve(implementationDir, rel);

  function visit(moduleSource, modulePath) {
    const absolutePath = path.resolve(implementationDir, modulePath);
    if (visited.has(absolutePath)) return;
    visited.add(absolutePath);
    const file = ts.createSourceFile(modulePath, moduleSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    for (const node of file.statements) {
      if (ts.isInterfaceDeclaration(node)) {
        if (absolutePath === rootPath) rootInterfaces.add(node.name.text);
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
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const specifier = node.moduleSpecifier.text;
      if (!specifier.startsWith('.')) continue;
      const importedPath = path.resolve(
        path.dirname(absolutePath),
        specifier.endsWith('.d.ts') ? specifier : `${specifier}.d.ts`,
      );
      if (existsSync(importedPath)) {
        visit(readFileSync(importedPath, 'utf8'), path.relative(implementationDir, importedPath));
      }
    }
  }
  visit(source, rel);

  const collect = (name, seen = new Set()) => {
    if (seen.has(name) || !interfaces.has(name)) return [];
    seen.add(name);
    const { props, parents } = interfaces.get(name);
    return [...props, ...parents.flatMap((parent) => collect(parent, seen))];
  };
  const collectRoot = (name, seen = new Set()) => {
    if (seen.has(name) || !rootInterfaces.has(name) || !interfaces.has(name)) return [];
    seen.add(name);
    const { props, parents } = interfaces.get(name);
    return [...props, ...parents.flatMap((parent) => collectRoot(parent, seen))];
  };
  const componentName = path.basename(rel, '.d.ts');
  const componentProps = `${componentName}Props`;
  const propsInterfaces = interfaces.has(componentProps)
    ? [componentProps]
    : [...interfaces.keys()].filter((name) => name.endsWith('Props'));
  const rootPropsInterfaces = rootInterfaces.has(componentProps)
    ? [componentProps]
    : [...rootInterfaces].filter((name) => name.endsWith('Props'));
  return {
    declared: [...new Set(rootPropsInterfaces.flatMap((name) => collectRoot(name)))],
    inherited: [...new Set(propsInterfaces.flatMap((name) => collect(name)))],
  };
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
  const contractDir = path.join(root, 'components', group);
  const implementationDir = path.join(roboticsRoot, 'src', 'components', group);
  const prompts = new Set(listFiles(contractDir, '.prompt.md').map((name) => name.replace('.prompt.md', '')));
  const implementations = new Set(listFiles(implementationDir, '.jsx').map((name) => name.replace('.jsx', '')));

  for (const component of prompts) {
    if (!roboticsOwnedComponents.has(component)) continue;
    const key = `${group}/${component}`;
    if (!implementations.has(component)) {
      record(key, 'missingImplementation', true);
      continue;
    }
    const dtsPath = path.join(implementationDir, `${component}.d.ts`);
    if (!existsSync(dtsPath)) {
      record(key, 'missingTypeContract', true);
      continue;
    }
    const prompt = readFileSync(path.join(contractDir, `${component}.prompt.md`), 'utf8');
    const props = ownPropsFromDts(
      readFileSync(dtsPath, 'utf8'),
      `${component}.d.ts`,
      implementationDir,
    );
    const undocumented = wordsMentioned(prompt, props.declared).sort();
    if (undocumented.length > 0) record(key, 'undocumentedProps', undocumented);
    const phantom = phantomPropsFromPrompt(prompt, component, props.inherited);
    if (phantom.length > 0) record(key, 'phantomProps', phantom);
  }

  for (const component of implementations) {
    if (roboticsOwnedComponents.has(component) && !prompts.has(component)) {
      record(`${group}/${component}`, 'missingPrompt', true);
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
