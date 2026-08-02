import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'API_DRIFT_BASELINE.json');
const updateBaseline = process.argv.includes('--update-baseline');
// Props a component inherits from React.*HTMLAttributes when its props type
// `extends` a DOM attribute interface. The .d.ts surfaces these through the
// extends clause, which this AST comparison does not resolve, so treat the
// standard DOM/ARIA/HTML attribute names (and every `aria-*` attribute) as
// inherited. Custom handlers with bespoke signatures (onChange, onSelect, …)
// are deliberately NOT listed so genuine contract drift is still caught.
const inheritedProps = new Set([
  'children', 'className', 'style', 'id', 'role', 'tabIndex', 'ref',
  // Standard DOM event handlers (React.DOMAttributes).
  'onClick', 'onKeyDown', 'onKeyUp', 'onKeyPress',
  'onFocus', 'onBlur', 'onFocusCapture', 'onBlurCapture',
  'onMouseDown', 'onMouseUp', 'onMouseEnter', 'onMouseLeave',
  'onMouseMove', 'onMouseOver', 'onMouseOut',
  'onPointerDown', 'onPointerUp', 'onPointerEnter', 'onPointerLeave',
  // Standard interactive HTML attributes (React.*HTMLAttributes).
  'disabled', 'required', 'readOnly', 'placeholder', 'autoFocus',
]);

function isInherited(name) {
  return inheritedProps.has(name) || name.startsWith('aria-');
}

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

function typeContracts(source, rel, absolutePath) {
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const interfaces = new Map();
  const aliases = new Map();
  const functions = new Map();
  const imports = new Map();

  for (const node of file.statements) {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.set(node.name.text, {
        props: node.members
          .filter(ts.isPropertySignature)
          .map((member) => member.name?.text)
          .filter(Boolean),
        extends: (node.heritageClauses || [])
          .flatMap((clause) => clause.types)
          .map((type) => ts.isIdentifier(type.expression) ? type.expression.text : null)
          .filter(Boolean),
      });
    } else if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, node.type);
    } else if (
      ts.isImportDeclaration(node)
      && ts.isStringLiteral(node.moduleSpecifier)
      && node.importClause?.namedBindings
      && ts.isNamedImports(node.importClause.namedBindings)
    ) {
      for (const specifier of node.importClause.namedBindings.elements) {
        imports.set(specifier.name.text, {
          importedName: specifier.propertyName?.text || specifier.name.text,
          moduleSpecifier: node.moduleSpecifier.text,
        });
      }
    } else if (ts.isFunctionDeclaration(node) && node.name && node.parameters[0]?.type) {
      const type = node.parameters[0].type;
      if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
        functions.set(node.name.text, type.typeName.text);
      }
    }
  }
  return { absolutePath, interfaces, aliases, functions, imports };
}

function resolveDtsImport(fromPath, moduleSpecifier) {
  if (!moduleSpecifier.startsWith('.')) return null;
  const absolute = path.resolve(path.dirname(fromPath), moduleSpecifier);
  const withoutJs = absolute.replace(/\.js$/, '');
  return path.normalize(withoutJs.endsWith('.d.ts') ? withoutJs : `${withoutJs}.d.ts`);
}

function resolveTypeNodeProps(registry, filePath, typeNode, seen) {
  if (ts.isTypeLiteralNode(typeNode)) {
    return typeNode.members
      .filter(ts.isPropertySignature)
      .map((member) => member.name?.text)
      .filter(Boolean);
  }
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return resolveTypeNodeProps(registry, filePath, typeNode.type, seen);
  }
  if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.flatMap((type) => resolveTypeNodeProps(registry, filePath, type, seen));
  }
  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    return resolveContractProps(registry, filePath, typeNode.typeName.text, seen);
  }
  return [];
}

function resolveContractProps(registry, filePath, contractName, seen = new Set()) {
  const normalizedPath = path.normalize(filePath);
  const key = `${normalizedPath}#${contractName}`;
  if (seen.has(key)) return [];
  seen.add(key);

  const contract = registry.get(normalizedPath);
  if (!contract) return [];
  if (contract.aliases.has(contractName)) {
    return [...new Set(resolveTypeNodeProps(
      registry,
      normalizedPath,
      contract.aliases.get(contractName),
      seen,
    ))];
  }

  const declaration = contract.interfaces.get(contractName);
  if (!declaration) return [];
  const inherited = declaration.extends.flatMap((parentName) => {
    if (contract.interfaces.has(parentName)) {
      return resolveContractProps(registry, normalizedPath, parentName, seen);
    }
    const imported = contract.imports.get(parentName);
    if (!imported) return [];
    const importedPath = resolveDtsImport(normalizedPath, imported.moduleSpecifier);
    return importedPath
      ? resolveContractProps(registry, importedPath, imported.importedName, seen)
      : [];
  });
  return [...new Set([...declaration.props, ...inherited])];
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

const classification = JSON.parse(
  await readFile(path.join(root, 'docs', 'references', 'wds', 'PUBLIC_EXPORT_CLASSIFICATION.json'), 'utf8'),
);
const internalModulePaths = new Set(
  (classification.internalModules ?? []).map((module) => path.normalize(path.join(root, module.path))),
);
const jsxFiles = (await collect(path.join(root, 'components'), '.jsx'))
  .filter((file) => !internalModulePaths.has(path.normalize(file)));
const dtsFiles = await collect(path.join(root, 'components'), '.d.ts');
const typeRegistry = new Map();
for (const dtsPath of dtsFiles) {
  const normalizedPath = path.normalize(dtsPath);
  const rel = path.relative(root, dtsPath).replaceAll('\\', '/');
  const source = await readFile(dtsPath, 'utf8');
  typeRegistry.set(normalizedPath, typeContracts(source, rel, normalizedPath));
}
const findings = {};
let analyzableExports = 0;

for (const jsxPath of jsxFiles) {
  const rel = path.relative(root, jsxPath).replaceAll('\\', '/');
  const base = jsxPath.slice(0, -4);
  const dtsPath = `${base}.d.ts`;
  const promptPath = `${base}.prompt.md`;
  const [jsx, prompt] = await Promise.all([
    readFile(jsxPath, 'utf8'),
    readFile(promptPath, 'utf8').catch(() => ''),
  ]);
  const implementations = implementationExports(jsx, rel);
  const contracts = typeRegistry.get(path.normalize(dtsPath));

  for (const [exportName, props] of implementations) {
    if (!props) continue;
    const contractName = contracts.functions.get(exportName);
    if (!contractName) continue;
    const declared = resolveContractProps(typeRegistry, dtsPath, contractName);
    if (!declared) continue;
    analyzableExports += 1;

    const implementationProps = props.filter((name) => !isInherited(name));
    const declaredProps = declared.filter((name) => !isInherited(name));
    const directDeclaration = contracts.interfaces.get(contractName);
    const documentedProps = (directDeclaration?.props || declaredProps).filter((name) => !isInherited(name));
    const key = `${rel}#${exportName}`;
    findings[key] = normalize({
      missingInTypes: implementationProps.filter((name) => !declaredProps.includes(name)),
      missingInImplementation: declaredProps.filter((name) => !implementationProps.includes(name)),
      undocumentedProps: wordsMentioned(prompt, documentedProps),
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
