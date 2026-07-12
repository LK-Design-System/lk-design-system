import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'API_DRIFT_BASELINE.json');
const updateBaseline = process.argv.includes('--update-baseline');
const inheritedProps = new Set(['children', 'className', 'style', 'id', 'role', 'tabIndex']);

async function collect(dir, suffix, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, suffix, out);
    else if (entry.isFile() && entry.name.endsWith(suffix)) out.push(absolute);
  }
  return out.sort();
}

function hasExport(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function bindingNames(parameter) {
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return null;
  return parameter.name.elements
    .filter((element) => !element.dotDotDotToken)
    .map((element) => element.propertyName?.text || element.name?.text)
    .filter(Boolean);
}

function findFunctionLike(node) {
  if (!node) return null;
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node;
  if (ts.isCallExpression(node)) {
    for (const argument of node.arguments) {
      const found = findFunctionLike(argument);
      if (found) return found;
    }
  }
  return null;
}

function implementationExports(source, rel) {
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const exports = new Map();
  for (const node of file.statements) {
    if (!hasExport(node)) continue;
    if (ts.isFunctionDeclaration(node) && node.name) {
      exports.set(node.name.text, bindingNames(node.parameters[0]));
    } else if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        const fn = findFunctionLike(declaration.initializer);
        exports.set(declaration.name.text, bindingNames(fn?.parameters[0]));
      }
    }
  }
  return exports;
}

function typeContracts(source, rel) {
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const interfaces = new Map();
  const aliases = new Map();
  const functions = new Map();

  for (const node of file.statements) {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.set(node.name.text, node.members
        .filter(ts.isPropertySignature)
        .map((member) => member.name?.text)
        .filter(Boolean));
    } else if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
      aliases.set(node.name.text, node.type.members
        .filter(ts.isPropertySignature)
        .map((member) => member.name?.text)
        .filter(Boolean));
    } else if (ts.isFunctionDeclaration(node) && node.name && node.parameters[0]?.type) {
      const type = node.parameters[0].type;
      if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
        functions.set(node.name.text, type.typeName.text);
      }
    }
  }
  return { interfaces, aliases, functions };
}

function wordsMentioned(text, names) {
  return names.filter((name) => !new RegExp(`(^|[^\\w$])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w$]|$)`).test(text));
}

function normalize(record) {
  return Object.fromEntries(Object.entries(record)
    .filter(([, value]) => value.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [key, [...new Set(value)].sort()]));
}

const jsxFiles = await collect(path.join(root, 'components'), '.jsx');
const findings = {};
let analyzableExports = 0;

for (const jsxPath of jsxFiles) {
  const rel = path.relative(root, jsxPath).replaceAll('\\', '/');
  const base = jsxPath.slice(0, -4);
  const dtsPath = `${base}.d.ts`;
  const promptPath = `${base}.prompt.md`;
  const [jsx, dts, prompt] = await Promise.all([
    readFile(jsxPath, 'utf8'),
    readFile(dtsPath, 'utf8'),
    readFile(promptPath, 'utf8').catch(() => ''),
  ]);
  const implementations = implementationExports(jsx, rel);
  const contracts = typeContracts(dts, rel.replace(/\.jsx$/, '.d.ts'));

  for (const [exportName, props] of implementations) {
    if (!props) continue;
    const contractName = contracts.functions.get(exportName);
    if (!contractName) continue;
    const declared = contracts.interfaces.get(contractName) || contracts.aliases.get(contractName);
    if (!declared) continue;
    analyzableExports += 1;

    const implementationProps = props.filter((name) => !inheritedProps.has(name));
    const declaredProps = declared.filter((name) => !inheritedProps.has(name));
    const key = `${rel}#${exportName}`;
    findings[key] = normalize({
      missingInTypes: implementationProps.filter((name) => !declaredProps.includes(name)),
      missingInImplementation: declaredProps.filter((name) => !implementationProps.includes(name)),
      undocumentedProps: wordsMentioned(prompt, declaredProps),
    });
    if (Object.keys(findings[key]).length === 0) delete findings[key];
  }
}

const baseline = {
  schemaVersion: 1,
  description: 'Known JSX/.d.ts/.prompt.md API mismatches. The guard rejects only newly introduced drift.',
  analyzableExports,
  findings,
};

if (updateBaseline) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
  console.log(`Updated API drift baseline: ${analyzableExports} analyzable exports, ${Object.keys(findings).length} entries with known drift.`);
  process.exit(0);
}

const expected = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = [];
for (const [key, categories] of Object.entries(findings)) {
  for (const [category, values] of Object.entries(categories)) {
    const allowed = new Set(expected.findings?.[key]?.[category] || []);
    for (const value of values) {
      if (!allowed.has(value)) regressions.push(`${key} ${category}: ${value}`);
    }
  }
}
if (regressions.length > 0) {
  throw new Error(`API drift regressions detected:\n- ${regressions.join('\n- ')}`);
}

console.log(`Validated API drift ratchet: ${analyzableExports} implementation exports, 0 new JSX/.d.ts/.prompt.md mismatches.`);
