import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const NON_CORE_SOURCE_ROOTS = ['packages/theme/src', 'packages/product/src'];
const CLASSIFICATION_PATH = 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json';
const SOURCE_EXTENSION = /(?:\.d\.ts|\.[cm]?[jt]sx?)$/;
const CORE_PREFIX = '@lk-design-system/lds-core/';
const PRIVATE_SEGMENTS = new Set(['internal', 'private']);

function normalizeInternalModulePath(value) {
  return value
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .replace(/\.(?:jsx?|tsx?)$/, '');
}

export function coreInternalModuleSpecifiers(classification) {
  if (!Array.isArray(classification?.internalModules)) {
    throw new TypeError('PUBLIC_EXPORT_CLASSIFICATION.json must contain internalModules.');
  }
  const coreModules = classification.internalModules.filter(({ ownerLayer }) => ownerLayer === 'core');
  if (coreModules.length === 0) {
    throw new TypeError('PUBLIC_EXPORT_CLASSIFICATION.json must classify at least one Core internal module.');
  }
  return new Set(coreModules.map((module) => {
    if (typeof module.path !== 'string' || module.path.trim() === '') {
      throw new TypeError('Every Core internalModules row must have a non-empty path.');
    }
    return `${CORE_PREFIX}${normalizeInternalModulePath(module.path)}`;
  }));
}

function normalizeCoreSpecifier(specifier) {
  if (typeof specifier !== 'string' || !specifier.startsWith(CORE_PREFIX)) return null;
  const clean = specifier.split(/[?#]/, 1)[0];
  return `${CORE_PREFIX}${normalizeInternalModulePath(clean.slice(CORE_PREFIX.length))}`;
}

export function isForbiddenProductCoreSpecifier(specifier, internalSpecifiers) {
  if (!(internalSpecifiers instanceof Set)) {
    throw new TypeError('Core internal authority specifiers must be provided as a Set.');
  }
  const normalized = normalizeCoreSpecifier(specifier);
  if (normalized === null) return false;
  const modulePath = normalized.slice(CORE_PREFIX.length);
  return internalSpecifiers.has(normalized)
    || modulePath.split('/').some((segment) => PRIVATE_SEGMENTS.has(segment));
}

function sourceKind(filename) {
  if (/\.tsx$/.test(filename)) return ts.ScriptKind.TSX;
  if (/\.(?:d\.)?[cm]?ts$/.test(filename)) return ts.ScriptKind.TS;
  if (/\.jsx$/.test(filename)) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function moduleSpecifierNode(node) {
  if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return node.moduleSpecifier;
  if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
    return node.moduleReference.expression;
  }
  if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) return node.argument.literal;
  if (
    ts.isCallExpression(node)
    && (node.expression.kind === ts.SyntaxKind.ImportKeyword
      || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
  ) {
    return node.arguments[0];
  }
  return null;
}

export function findForbiddenProductCoreSpecifiers(source, filename, internalSpecifiers) {
  const sourceFile = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    sourceKind(filename),
  );
  const findings = [];

  function visit(node) {
    const candidate = moduleSpecifierNode(node);
    if (
      candidate
      && ts.isStringLiteralLike(candidate)
      && isForbiddenProductCoreSpecifier(candidate.text, internalSpecifiers)
    ) {
      const position = sourceFile.getLineAndCharacterOfPosition(candidate.getStart(sourceFile));
      findings.push({
        specifier: candidate.text,
        line: position.line + 1,
        column: position.character + 1,
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

async function collectSourceFiles(directory, output = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectSourceFiles(target, output);
    else if (entry.isFile() && SOURCE_EXTENSION.test(entry.name)) output.push(target);
  }
  return output;
}

async function findCorePrivateImports(root, sourceRoots) {
  const classification = JSON.parse(await readFile(path.join(root, CLASSIFICATION_PATH), 'utf8'));
  const internalSpecifiers = coreInternalModuleSpecifiers(classification);
  const findings = [];
  for (const sourceRoot of sourceRoots) {
    const files = await collectSourceFiles(path.join(root, sourceRoot));
    for (const file of files) {
      const source = await readFile(file, 'utf8');
      for (const finding of findForbiddenProductCoreSpecifiers(source, file, internalSpecifiers)) {
        findings.push({
          ...finding,
          file: path.relative(root, file).replaceAll('\\', '/'),
        });
      }
    }
  }
  return findings.sort((a, b) => (
    a.file.localeCompare(b.file)
    || a.line - b.line
    || a.column - b.column
  ));
}

export function findNonCoreCorePrivateImports(root = process.cwd()) {
  return findCorePrivateImports(root, NON_CORE_SOURCE_ROOTS);
}

export function findProductCorePrivateImports(root = process.cwd()) {
  return findCorePrivateImports(root, ['packages/product/src']);
}
