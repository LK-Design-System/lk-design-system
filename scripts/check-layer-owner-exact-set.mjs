import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const OWNER_AUTHORITY_PATH = 'docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json';
const PRODUCT_FAMILY_PATH = 'docs/references/architecture/PRODUCT_FAMILY_CONTRACT.json';
const PRODUCT_ENTRY_PATH = 'packages/product/src/index.js';
const PRODUCT_PACKAGE_PATH = 'packages/product/package.json';
const COMPONENT_CONTENT_PATH = 'docs/components/component-content.json';
const STORYBOOK_IA_PATH = 'docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json';
const ROBOTICS_SURFACE_PATH = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
const LDS3D_SURFACE_PATH = 'docs/references/package-split/LDS3D_EXTERNAL_SURFACE.json';
const CROSS_REPOSITORY_CONTRACT_PATH = 'docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.json';
const PRODUCT_LAYER = 'product';
const PRODUCT_STORYBOOK_LAYER = 'Product';
const PRODUCT_STORYBOOK_PREFIX = 'LDS Product/';
const OWNER_BOUNDARY_REFERENCE = `${OWNER_AUTHORITY_PATH}#domainDecisions`;

export const NON_CANONICAL_PRODUCT_STORYBOOK_PAGES = Object.freeze({
  'LDS Product/Patterns/Expression Profile Density': Object.freeze({
    importPath: './stories/ExpressionProfileDensity.stories.jsx',
    primaryOwner: 'DataToolbar',
    publicStories: 0,
    hiddenStories: 2,
    storyRole: 'visual-parity',
  }),
});

const PRODUCT_COMPOSITE_STORYBOOK_EXCEPTIONS = Object.freeze({
  'components/cards/Stat.jsx': Object.freeze({
    exportName: 'Stat',
    storybookTitle: 'LDS Product/Data/Display/Metric Card',
    importPath: './stories/DataAndStatus.stories.jsx',
    primaryOwner: 'MetricCard',
    family: 'application',
  }),
  'components/navigation/BottomNav.jsx': Object.freeze({
    exportName: 'BottomNav',
    storybookTitle: 'LDS Product/Navigation/Adaptive Navigation',
    importPath: './stories/NavigationAdaptive.stories.jsx',
    primaryOwner: 'NavRail',
    family: 'application',
    ownerRelation: 'ownerComponents',
  }),
  'components/navigation/Toolbar.jsx': Object.freeze({
    exportName: 'Toolbar',
    storybookTitle: 'LDS Product/Navigation/Top Bar',
    importPath: './stories/Navigation.stories.jsx',
    primaryOwner: 'TopBar',
    family: 'application',
  }),
});

const PRODUCT_CANONICAL_STORY_EVIDENCE_EXCEPTIONS = Object.freeze({
  'components/forms/FileUpload.jsx': Object.freeze({
    exportName: 'FileUpload',
    storybookTitle: 'LDS Product/Selection and Input/File Upload',
    importPath: './stories/FormFileUpload.stories.jsx',
    primaryOwner: 'FileUpload',
    family: 'application',
    substituteTitle: 'LDS Product/Selection and Input/File Upload Queue',
    substituteImportPath: './stories/FormFileUploadQueue.stories.jsx',
    substitutePrimaryOwner: 'FileUploadQueue',
  }),
});

const SPECIALIST_PACKAGE_PREFIXES = Object.freeze([
  '@lk-design-system/lds-robotics-ui',
  '@lk-design-system/lds-3d',
]);

export class LayerOwnerExactSetError extends Error {
  constructor(diagnostics) {
    const sorted = [...diagnostics].sort((left, right) => (
      left.category.localeCompare(right.category)
      || left.code.localeCompare(right.code)
      || left.subject.localeCompare(right.subject)
    ));
    super(`Layer owner exact-set contract failed:\n${sorted.map((item) => `- [${item.code}] ${item.subject}: ${item.message}`).join('\n')}`);
    this.name = 'LayerOwnerExactSetError';
    this.diagnostics = sorted;
  }
}

function normalizePath(value) {
  return String(value ?? '').replaceAll('\\', '/').replace(/^\.\//, '');
}

function normalizeEntrySource(value) {
  return normalizePath(value);
}

function normalizeStoryPath(value) {
  return normalizePath(value);
}

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function sameStringSet(left, right) {
  return JSON.stringify(sortedUnique(left)) === JSON.stringify(sortedUnique(right));
}

function collectDuplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].filter(([, count]) => count > 1).map(([value]) => value).sort();
}

function addDiagnostic(diagnostics, category, code, subject, message) {
  diagnostics.push({
    category: String(category),
    code: String(code),
    subject: String(subject ?? '<missing>'),
    message: String(message),
  });
}

function sourceKind(filename) {
  if (/\.tsx$/i.test(filename)) return ts.ScriptKind.TSX;
  if (/\.(?:d\.)?[cm]?ts$/i.test(filename)) return ts.ScriptKind.TS;
  if (/\.jsx$/i.test(filename)) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function sourceLocation(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${normalizePath(sourceFile.fileName)}:${position.line + 1}:${position.character + 1}`;
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

function specialistPackage(specifier) {
  return SPECIALIST_PACKAGE_PREFIXES.find((prefix) => (
    specifier === prefix || specifier.startsWith(`${prefix}/`) || specifier.startsWith(`${prefix}-`)
  ));
}

export function findProductSpecialistSpecifiers(source, filename = '<product-source>') {
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
    if (candidate && ts.isStringLiteralLike(candidate)) {
      const specialist = specialistPackage(candidate.text);
      if (specialist) {
        const position = sourceFile.getLineAndCharacterOfPosition(candidate.getStart(sourceFile));
        findings.push({
          specifier: candidate.text,
          specialist,
          line: position.line + 1,
          column: position.character + 1,
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

function canonicalProductEntrySource(specifier) {
  if (
    typeof specifier !== 'string'
    || specifier.includes('\\')
    || specifier.includes('\0')
    || specifier.includes('?')
    || specifier.includes('#')
    || !specifier.startsWith('./components/')
    || !/\.(?:[cm]?js|jsx|tsx?)$/i.test(specifier)
  ) {
    return null;
  }
  const normalized = path.posix.normalize(specifier);
  if (`./${normalized}` !== specifier || normalized === '..' || normalized.startsWith('../')) return null;
  return specifier;
}

export function parseProductPublicEntry(source, filename = PRODUCT_ENTRY_PATH) {
  const sourceFile = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    sourceKind(filename),
  );
  const diagnostics = (sourceFile.parseDiagnostics ?? []).map((item) => {
    const start = item.start ?? 0;
    const position = sourceFile.getLineAndCharacterOfPosition(start);
    return {
      category: 'conflict',
      code: 'PRODUCT_ENTRY_PARSE_ERROR',
      subject: `${normalizePath(filename)}:${position.line + 1}:${position.character + 1}`,
      message: ts.flattenDiagnosticMessageText(item.messageText, ' '),
    };
  });
  const rows = [];

  for (const statement of sourceFile.statements) {
    if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) continue;
    if (!ts.isExportDeclaration(statement)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_ENTRY_STATEMENT_CONFLICT', sourceLocation(sourceFile, statement), 'Product public entry may contain only named component re-exports.');
      continue;
    }
    if (!statement.moduleSpecifier || !ts.isStringLiteralLike(statement.moduleSpecifier)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_ENTRY_EXPORT_SYNTAX_CONFLICT', sourceLocation(sourceFile, statement), 'Product public re-export must use a static string-literal module specifier.');
      continue;
    }
    const specifier = statement.moduleSpecifier.text;
    if (!canonicalProductEntrySource(specifier)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_ENTRY_SOURCE_PATH_CONFLICT', `${sourceLocation(sourceFile, statement)}/${specifier}`, 'Product public source must be a canonical ./components/* JavaScript or TypeScript path without traversal, query, hash, or backslashes.');
      continue;
    }
    if (
      statement.isTypeOnly
      || !statement.exportClause
      || !ts.isNamedExports(statement.exportClause)
      || statement.exportClause.elements.length === 0
      || statement.exportClause.elements.some((element) => element.isTypeOnly || element.propertyName)
    ) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_ENTRY_EXPORT_SYNTAX_CONFLICT', sourceLocation(sourceFile, statement), 'Product public entry must use non-empty, non-aliased named runtime re-exports; export-star, namespace, type-only, and alias exports are unsupported.');
      continue;
    }
    rows.push({
      source: specifier,
      exports: statement.exportClause.elements.map((element) => element.name.text),
    });
  }

  return { rows, diagnostics };
}

function exactSetDiagnostics({ diagnostics, expected, actual, missingCode, extraCode, subject }) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  for (const value of [...expectedSet].filter((item) => !actualSet.has(item)).sort()) {
    addDiagnostic(diagnostics, 'conflict', missingCode, `${subject}/${value}`, 'required exact-set row is missing.');
  }
  for (const value of [...actualSet].filter((item) => !expectedSet.has(item)).sort()) {
    addDiagnostic(diagnostics, 'conflict', extraCode, `${subject}/${value}`, 'unexpected exact-set row is present.');
  }
}

function validateLayerMetadata(snapshot, diagnostics) {
  const layers = snapshot.ownerAuthority?.layers ?? [];
  for (const duplicate of collectDuplicates(layers.map((layer) => layer.id))) {
    addDiagnostic(diagnostics, 'duplicate', 'OWNER_LAYER_DUPLICATE', duplicate, 'owner layer id is declared more than once.');
  }
  for (const duplicate of collectDuplicates(layers.map((layer) => layer.package))) {
    addDiagnostic(diagnostics, 'duplicate', 'OWNER_PACKAGE_DUPLICATE', duplicate, 'owner package is declared by more than one layer.');
  }

  const productLayers = layers.filter((layer) => layer.id === PRODUCT_LAYER);
  const roboticsLayers = layers.filter((layer) => layer.id === 'robotics');
  if (productLayers.length !== 1) {
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_LAYER_CONFLICT', PRODUCT_LAYER, `expected exactly one Product layer; found ${productLayers.length}.`);
  }
  if (roboticsLayers.length !== 1) {
    addDiagnostic(diagnostics, 'conflict', 'ROBOTICS_LAYER_CONFLICT', 'robotics', `expected exactly one Robotics layer; found ${roboticsLayers.length}.`);
  }

  const productLayer = productLayers[0];
  const roboticsLayer = roboticsLayers[0];
  const familyContract = snapshot.productFamilyContract ?? {};
  if (familyContract.ownerBoundaryAuthority !== OWNER_BOUNDARY_REFERENCE) {
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_BOUNDARY_AUTHORITY_CONFLICT', PRODUCT_FAMILY_PATH, `ownerBoundaryAuthority must be ${OWNER_BOUNDARY_REFERENCE}.`);
  }
  if (productLayer && familyContract.package !== productLayer.package) {
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_PACKAGE_OWNER_CONFLICT', familyContract.package ?? '<missing>', `family package must match Product owner package ${productLayer.package}.`);
  }
  if (familyContract.package !== snapshot.productPackage?.name || familyContract.layer !== snapshot.productPackage?.lds?.layer) {
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_PACKAGE_METADATA_CONFLICT', PRODUCT_PACKAGE_PATH, 'package name/layer metadata must match the Product family contract.');
  }
  if (productLayer && (
    productLayer.publicEntry !== PRODUCT_ENTRY_PATH
    || productLayer.moduleRoot !== 'packages/product/src/components'
    || productLayer.storybookPrefix !== 'LDS Product'
  )) {
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_LAYER_METADATA_CONFLICT', PRODUCT_LAYER, 'public entry, module root, or Storybook prefix differs from the current Product surface.');
  }
  if (roboticsLayer?.externalSurface !== ROBOTICS_SURFACE_PATH) {
    addDiagnostic(diagnostics, 'conflict', 'ROBOTICS_SURFACE_POINTER_CONFLICT', 'robotics', `externalSurface must be ${ROBOTICS_SURFACE_PATH}.`);
  }

  return { productLayer, roboticsLayer };
}

function validateProductFamilies(snapshot, diagnostics) {
  for (const item of snapshot.productEntryDiagnostics ?? []) diagnostics.push({ ...item });
  const families = snapshot.productFamilyContract?.families ?? [];
  const familyIds = families.map((family) => family.id);
  for (const duplicate of collectDuplicates(familyIds)) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_FAMILY_DUPLICATE', duplicate, 'family id is declared more than once.');
  }

  const prefixRows = families.flatMap((family) => (family.sourcePrefixes ?? []).map((prefix) => ({
    family: family.id,
    prefix: normalizePath(prefix),
  })));
  for (const duplicate of collectDuplicates(prefixRows.map((row) => row.prefix))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_FAMILY_PREFIX_DUPLICATE', duplicate, 'source prefix is assigned more than once.');
  }
  for (let leftIndex = 0; leftIndex < prefixRows.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < prefixRows.length; rightIndex += 1) {
      const left = prefixRows[leftIndex];
      const right = prefixRows[rightIndex];
      if (left.prefix.startsWith(right.prefix) || right.prefix.startsWith(left.prefix)) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_FAMILY_PREFIX_CONFLICT', `${left.prefix} <> ${right.prefix}`, 'family prefixes overlap and cannot produce an exact classification.');
      }
    }
  }

  const compatibilityEntries = snapshot.ownerAuthority?.compatibilityProjections?.deprecatedPackageReexports?.entries ?? [];
  const rootedCompatibilityEntries = compatibilityEntries.filter((entry) => (entry.exports ?? []).length > 0);
  for (const duplicate of collectDuplicates(rootedCompatibilityEntries.map((entry) => normalizeEntrySource(entry.module)))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_COMPATIBILITY_SOURCE_DUPLICATE', duplicate, 'compatibility source is contracted more than once.');
  }
  for (const duplicate of collectDuplicates(rootedCompatibilityEntries.flatMap((entry) => entry.exports ?? []))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_COMPATIBILITY_EXPORT_DUPLICATE', duplicate, 'compatibility export is contracted more than once.');
  }
  const compatibilityBySource = new Map(
    rootedCompatibilityEntries
      .map((entry) => [normalizeEntrySource(entry.module), sortedUnique(entry.exports)]),
  );
  const allRows = snapshot.productEntryRows ?? [];
  const normalizedRows = allRows.map((row) => ({
    source: normalizeEntrySource(row.source),
    exports: [...(row.exports ?? [])],
    sourceExists: row.sourceExists,
  }));

  for (const row of normalizedRows) {
    if (row.sourceExists !== true) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_SOURCE_FILE_MISSING', row.source, 'Product public source must resolve to a regular file below packages/product/src/components.');
    }
  }

  for (const duplicate of collectDuplicates(normalizedRows.map((row) => row.source))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_SOURCE_DUPLICATE', duplicate, 'Product public source is exported more than once.');
  }
  for (const duplicate of collectDuplicates(normalizedRows.flatMap((row) => row.exports))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_EXPORT_DUPLICATE', duplicate, 'Product root export resolves from more than one source row.');
  }

  for (const [source, expectedExports] of compatibilityBySource) {
    const matches = normalizedRows.filter((row) => row.source === source);
    if (matches.length === 0) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_COMPATIBILITY_SOURCE_MISSING', source, 'contracted 0.1.x Core compatibility root export is missing.');
    } else if (matches.length === 1 && !sameStringSet(matches[0].exports, expectedExports)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_COMPATIBILITY_EXPORT_CONFLICT', source, `expected ${expectedExports.join(', ')}; found ${sortedUnique(matches[0].exports).join(', ')}.`);
    }
  }

  const ownedRows = normalizedRows.filter((row) => !compatibilityBySource.has(row.source));
  const exportOwners = new Map();
  const sourceFamilies = new Map();
  const familyCounts = new Map(familyIds.map((id) => [id, 0]));
  for (const row of ownedRows) {
    const matches = sortedUnique(prefixRows.filter(({ prefix }) => row.source.startsWith(prefix)).map(({ family }) => family));
    if (matches.length === 0) {
      addDiagnostic(diagnostics, 'unclassified', 'PRODUCT_SOURCE_UNCLASSIFIED', row.source, 'public Product source does not match any family prefix.');
      continue;
    }
    if (matches.length > 1) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_SOURCE_FAMILY_CONFLICT', row.source, `public Product source matches multiple families: ${matches.join(', ')}.`);
      continue;
    }
    sourceFamilies.set(row.source, matches[0]);
    familyCounts.set(matches[0], (familyCounts.get(matches[0]) ?? 0) + 1);
    for (const exportName of row.exports) {
      const current = exportOwners.get(exportName) ?? [];
      current.push({ source: row.source, family: matches[0] });
      exportOwners.set(exportName, current);
    }
  }
  for (const [family, count] of familyCounts) {
    if (count === 0) addDiagnostic(diagnostics, 'unclassified', 'PRODUCT_FAMILY_EMPTY', family, 'family owns no public Product source.');
  }

  return { allRows: normalizedRows, ownedRows, exportOwners, sourceFamilies, familyCounts, compatibilityBySource };
}

function validateProductRegistry(snapshot, productState, diagnostics) {
  const ownedSourceSet = new Set(productState.ownedRows.map((row) => row.source));
  const registryRows = (snapshot.componentEntries ?? []).filter((entry) => (
    entry.ownerLayer === PRODUCT_LAYER || ownedSourceSet.has(normalizeEntrySource(entry.source))
  ));
  const registrySources = registryRows.map((entry) => normalizeEntrySource(entry.source));
  for (const duplicate of collectDuplicates(registrySources)) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_REGISTRY_SOURCE_DUPLICATE', duplicate, 'component-content contains more than one owner row for the Product source.');
  }
  for (const duplicate of collectDuplicates(registryRows.map((entry) => entry.prompt))) {
    addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_PROMPT_DUPLICATE', duplicate, 'prompt is assigned to more than one Product source.');
  }

  exactSetDiagnostics({
    diagnostics,
    expected: [...ownedSourceSet],
    actual: registryRows.filter((entry) => entry.ownerLayer === PRODUCT_LAYER).map((entry) => normalizeEntrySource(entry.source)),
    missingCode: 'PRODUCT_REGISTRY_SOURCE_MISSING',
    extraCode: 'PRODUCT_REGISTRY_SOURCE_EXTRA',
    subject: 'component-content/product',
  });

  const rowBySource = new Map(registryRows.map((entry) => [normalizeEntrySource(entry.source), entry]));
  for (const publicRow of productState.ownedRows) {
    const registry = rowBySource.get(publicRow.source);
    if (!registry) continue;
    if (registry.ownerLayer !== PRODUCT_LAYER) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_REGISTRY_OWNER_CONFLICT', publicRow.source, `component-content ownerLayer is ${registry.ownerLayer ?? '<missing>'}, expected product.`);
    }
    if (!sameStringSet(registry.exports ?? [], publicRow.exports)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_REGISTRY_EXPORT_CONFLICT', publicRow.source, `component-content exports ${sortedUnique(registry.exports ?? []).join(', ') || '<none>'}; public entry exports ${sortedUnique(publicRow.exports).join(', ') || '<none>'}.`);
    }
    const expectedPrompt = publicRow.source.replace(/\.(?:jsx?|tsx?)$/, '.prompt.md');
    if (normalizeEntrySource(registry.prompt) !== expectedPrompt) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_PROMPT_CONFLICT', publicRow.source, `expected prompt ${expectedPrompt}; found ${registry.prompt ?? '<missing>'}.`);
    }
    if (registry.promptExists !== true) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_PROMPT_MISSING', expectedPrompt, 'declared Product prompt does not exist in current source.');
    }
    if (!Array.isArray(registry.storyEvidence) || registry.storyEvidence.length === 0) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_EVIDENCE_MISSING', publicRow.source, 'Product source has no Storybook source evidence.');
    }
    for (const duplicate of collectDuplicates(registry.storyEvidence ?? [])) {
      addDiagnostic(diagnostics, 'duplicate', 'PRODUCT_STORY_EVIDENCE_DUPLICATE', `${publicRow.source}/${duplicate}`, 'Storybook evidence is listed more than once.');
    }
  }

  return { registryRows, rowBySource };
}

function validateStorybook(snapshot, productState, registryState, diagnostics) {
  const allPages = snapshot.storybookPages ?? [];
  const productPages = allPages.filter((page) => page.layer === PRODUCT_STORYBOOK_LAYER || String(page.title ?? '').startsWith(PRODUCT_STORYBOOK_PREFIX));
  const guides = (snapshot.canonicalGuides ?? []).filter((guide) => guide.layer === PRODUCT_STORYBOOK_LAYER || String(guide.storybookTitle ?? '').startsWith(PRODUCT_STORYBOOK_PREFIX));

  for (const duplicate of collectDuplicates(productPages.map((page) => page.title))) {
    addDiagnostic(diagnostics, 'duplicate', 'STORYBOOK_TITLE_DUPLICATE', duplicate, 'Product Storybook title occurs more than once.');
  }
  for (const duplicate of collectDuplicates(productPages.map((page) => normalizeStoryPath(page.importPath)))) {
    addDiagnostic(diagnostics, 'duplicate', 'STORYBOOK_IMPORT_PATH_DUPLICATE', duplicate, 'Product Storybook source owns more than one page.');
  }
  for (const duplicate of collectDuplicates(guides.map((guide) => guide.storybookTitle))) {
    addDiagnostic(diagnostics, 'duplicate', 'STORYBOOK_CANONICAL_GUIDE_DUPLICATE', duplicate, 'canonical Product guide title occurs more than once.');
  }

  const pagesByTitle = new Map();
  for (const page of productPages) {
    const current = pagesByTitle.get(page.title) ?? [];
    current.push(page);
    pagesByTitle.set(page.title, current);
    if (page.layer !== PRODUCT_STORYBOOK_LAYER || !String(page.title ?? '').startsWith(PRODUCT_STORYBOOK_PREFIX)) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_LAYER_CONFLICT', page.title ?? '<missing>', 'Product title and IA layer must both identify LDS Product.');
    }
  }

  const canonicalTitles = new Set(guides.map((guide) => guide.storybookTitle));
  const familyPageCounts = new Map([...productState.familyCounts.keys()].map((family) => [family, 0]));
  for (const guide of guides) {
    const title = guide.storybookTitle;
    const pages = pagesByTitle.get(title) ?? [];
    if (pages.length === 0) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_PAGE_MISSING', title, 'canonical component guide has no current Storybook IA page.');
      continue;
    }
    if (guide.layer !== PRODUCT_STORYBOOK_LAYER || !String(title ?? '').startsWith(PRODUCT_STORYBOOK_PREFIX)) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_CANONICAL_LAYER_CONFLICT', title ?? '<missing>', 'canonical guide is not owned by LDS Product.');
    }
    const page = pages[0];
    const guideImportPath = normalizeStoryPath(guide.storybook?.importPath);
    if (guideImportPath !== normalizeStoryPath(page.importPath)) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_IMPORT_PATH_CONFLICT', title, `canonical guide points to ${guideImportPath || '<missing>'}; IA points to ${normalizeStoryPath(page.importPath) || '<missing>'}.`);
    }
    if (guide.primaryOwner !== page.primaryOwner) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_PRIMARY_OWNER_CONFLICT', title, `canonical guide owner ${guide.primaryOwner ?? '<missing>'}; IA owner ${page.primaryOwner ?? '<missing>'}.`);
    }
    const ownerRows = productState.exportOwners.get(guide.primaryOwner) ?? [];
    if (ownerRows.length !== 1) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_OWNER_CONFLICT', title, `primaryOwner ${guide.primaryOwner ?? '<missing>'} resolves to ${ownerRows.length} Product public sources.`);
    } else {
      familyPageCounts.set(ownerRows[0].family, (familyPageCounts.get(ownerRows[0].family) ?? 0) + 1);
    }
  }

  const nonCanonicalPages = productPages.filter((page) => !canonicalTitles.has(page.title));
  exactSetDiagnostics({
    diagnostics,
    expected: Object.keys(NON_CANONICAL_PRODUCT_STORYBOOK_PAGES),
    actual: nonCanonicalPages.map((page) => page.title),
    missingCode: 'STORYBOOK_INTERNAL_FIXTURE_MISSING',
    extraCode: 'STORYBOOK_NON_CANONICAL_PAGE_CONFLICT',
    subject: 'storybook/noncanonical-product-page',
  });
  for (const page of nonCanonicalPages) {
    const expected = NON_CANONICAL_PRODUCT_STORYBOOK_PAGES[page.title];
    if (!expected) continue;
    const stories = page.stories ?? [];
    const valid = normalizeStoryPath(page.importPath) === normalizeStoryPath(expected.importPath)
      && page.primaryOwner === expected.primaryOwner
      && page.visibility?.public === expected.publicStories
      && page.visibility?.hidden === expected.hiddenStories
      && stories.length === expected.hiddenStories
      && stories.every((story) => story.visibility === 'hidden' && story.role === expected.storyRole);
    if (!valid) {
      addDiagnostic(diagnostics, 'conflict', 'STORYBOOK_INTERNAL_FIXTURE_CONFLICT', page.title, 'the sole noncanonical Product page must retain its exact path, owner, public=0, hidden count, and visual-parity-only role.');
    }
  }

  const pageByImport = new Map(productPages.map((page) => [normalizeStoryPath(page.importPath), page]));
  const canonicalReferences = guides.flatMap((guide) => {
    const pages = pagesByTitle.get(guide.storybookTitle) ?? [];
    if (pages.length !== 1) return [];
    return [{
      title: guide.storybookTitle,
      importPath: normalizeStoryPath(guide.storybook?.importPath),
      primaryOwner: guide.primaryOwner,
      pagePrimaryOwner: pages[0].primaryOwner,
      guide,
    }];
  });
  const publicRowsBySource = new Map(productState.ownedRows.map((row) => [row.source, row]));
  for (const registry of registryState.registryRows) {
    if (registry.ownerLayer !== PRODUCT_LAYER) continue;
    const source = normalizeEntrySource(registry.source);
    for (const evidence of registry.storyEvidence ?? []) {
      const page = pageByImport.get(normalizeStoryPath(evidence));
      if (!page) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_EVIDENCE_UNRESOLVED', `${registry.source}/${evidence}`, 'Storybook evidence does not resolve to a Product IA page.');
      }
    }
    for (const title of registry.storybookPages ?? []) {
      if (!canonicalTitles.has(title)) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_PAGE_CONFLICT', `${registry.source}/${title}`, 'component-content page reference is not a canonical Product guide.');
      }
    }

    const publicRow = publicRowsBySource.get(source);
    if (!publicRow) continue;
    const evidencePaths = new Set((registry.storyEvidence ?? []).map(normalizeStoryPath));
    const referencedTitles = new Set(registry.storybookPages ?? []);
    const referencedCanonicalPages = canonicalReferences.filter((reference) => (
      evidencePaths.has(reference.importPath) && referencedTitles.has(reference.title)
    ));
    const directPrimaryPages = referencedCanonicalPages.filter((reference) => {
      const ownerRows = productState.exportOwners.get(reference.primaryOwner) ?? [];
      return reference.primaryOwner === reference.pagePrimaryOwner
        && publicRow.exports.includes(reference.primaryOwner)
        && ownerRows.length === 1
        && ownerRows[0].source === source;
    });
    const compositeException = PRODUCT_COMPOSITE_STORYBOOK_EXCEPTIONS[source];
    const evidenceException = PRODUCT_CANONICAL_STORY_EVIDENCE_EXCEPTIONS[source];

    if (directPrimaryPages.length > 0) {
      if (compositeException) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_COMPOSITE_STORY_EXCEPTION_STALE', source, 'source now has a direct canonical primary-owner page; remove the closed composite-only exception.');
      }
      if (evidenceException) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_EVIDENCE_EXCEPTION_STALE', source, 'canonical primary-owner page now has direct storyEvidence; remove the closed evidence exception.');
      }
      continue;
    }

    if (evidenceException) {
      const sourceFamily = productState.sourceFamilies.get(source);
      const ownerRows = productState.exportOwners.get(evidenceException.primaryOwner) ?? [];
      const canonicalTitleReferences = canonicalReferences.filter((reference) => (
        referencedTitles.has(reference.title)
        && reference.title === evidenceException.storybookTitle
        && reference.importPath === normalizeStoryPath(evidenceException.importPath)
        && reference.primaryOwner === evidenceException.primaryOwner
        && reference.pagePrimaryOwner === evidenceException.primaryOwner
      ));
      const substituteReferences = referencedCanonicalPages.filter((reference) => (
        reference.title === evidenceException.substituteTitle
        && reference.importPath === normalizeStoryPath(evidenceException.substituteImportPath)
        && reference.primaryOwner === evidenceException.substitutePrimaryOwner
        && reference.pagePrimaryOwner === evidenceException.substitutePrimaryOwner
      ));
      const validEvidenceException = publicRow.exports.length === 1
        && publicRow.exports[0] === evidenceException.exportName
        && sourceFamily === evidenceException.family
        && ownerRows.length === 1
        && ownerRows[0].source === source
        && ownerRows[0].family === sourceFamily
        && canonicalTitleReferences.length === 1
        && !evidencePaths.has(normalizeStoryPath(evidenceException.importPath))
        && substituteReferences.length === 1;
      if (!validEvidenceException) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_EVIDENCE_EXCEPTION_CONFLICT', source, `closed evidence exception must retain ${evidenceException.storybookTitle} as ${evidenceException.primaryOwner}, with substitute evidence ${evidenceException.substituteTitle} (${normalizeStoryPath(evidenceException.substituteImportPath)}, primaryOwner=${evidenceException.substitutePrimaryOwner}, family=${evidenceException.family}).`);
      }
      continue;
    }

    if (compositeException) {
      const sourceFamily = productState.sourceFamilies.get(source);
      const ownerRows = productState.exportOwners.get(compositeException.primaryOwner) ?? [];
      const matchingReferences = referencedCanonicalPages.filter((reference) => (
        reference.title === compositeException.storybookTitle
        && reference.importPath === normalizeStoryPath(compositeException.importPath)
        && reference.primaryOwner === compositeException.primaryOwner
        && reference.pagePrimaryOwner === compositeException.primaryOwner
      ));
      const hasOwnerRelation = !compositeException.ownerRelation
        || matchingReferences.some((reference) => (
          reference.guide?.[compositeException.ownerRelation] ?? []
        ).includes(compositeException.exportName));
      const validCompositeMapping = publicRow.exports.length === 1
        && publicRow.exports[0] === compositeException.exportName
        && sourceFamily === compositeException.family
        && ownerRows.length === 1
        && ownerRows[0].family === sourceFamily
        && ownerRows[0].source !== source
        && matchingReferences.length === 1
        && hasOwnerRelation;
      if (!validCompositeMapping) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_COMPOSITE_STORY_EXCEPTION_CONFLICT', source, `closed composite mapping must remain ${compositeException.exportName} -> ${compositeException.storybookTitle} (${normalizeStoryPath(compositeException.importPath)}, primaryOwner=${compositeException.primaryOwner}, family=${compositeException.family}).`);
      }
      continue;
    }

    const sourceFamily = productState.sourceFamilies.get(source);
    const referencedOwnerFamilies = sortedUnique(referencedCanonicalPages.flatMap((reference) => (
      productState.exportOwners.get(reference.primaryOwner) ?? []
    ).map((owner) => owner.family)));
    addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_PRIMARY_OWNER_CONFLICT', source, `no page referenced by both storyEvidence and storybookPages has a canonical primaryOwner from this source's public exports (${publicRow.exports.join(', ') || '<none>'}).`);
    if (referencedOwnerFamilies.length > 0 && !referencedOwnerFamilies.includes(sourceFamily)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_STORY_FAMILY_CONFLICT', source, `referenced canonical owners resolve to ${referencedOwnerFamilies.join(', ')}; source family is ${sourceFamily ?? '<unclassified>'}.`);
    }
  }
  for (const [family, count] of familyPageCounts) {
    if (count === 0) addDiagnostic(diagnostics, 'unclassified', 'PRODUCT_FAMILY_STORYBOOK_EMPTY', family, 'family has no canonical Product Storybook page.');
  }

  return { productPages, guides, nonCanonicalPages, familyPageCounts };
}

function validateDomainDecisions(snapshot, productState, roboticsExports, diagnostics) {
  const familyIds = new Set(snapshot.productFamilyContract?.families?.map((family) => family.id) ?? []);
  const decisions = snapshot.ownerAuthority?.domainDecisions ?? [];
  const productDecisions = decisions.filter((decision) => decision.ownerLayer === PRODUCT_LAYER);
  const roboticsDecisions = decisions.filter((decision) => decision.ownerLayer === 'robotics');
  if (productDecisions.length === 0) {
    addDiagnostic(diagnostics, 'unclassified', 'PRODUCT_DOMAIN_DECISION_MISSING', OWNER_AUTHORITY_PATH, 'no Product owner boundary decisions are declared.');
  }
  if (roboticsDecisions.length === 0) {
    addDiagnostic(diagnostics, 'unclassified', 'ROBOTICS_DOMAIN_DECISION_MISSING', OWNER_AUTHORITY_PATH, 'no Robotics owner boundary decisions are declared.');
  }
  for (const decision of productDecisions) {
    if (!familyIds.has(decision.productFamily)) {
      addDiagnostic(diagnostics, 'unclassified', 'PRODUCT_DECISION_FAMILY_UNCLASSIFIED', decision.id, `unknown Product family ${decision.productFamily ?? '<missing>'}.`);
    }
    for (const exportName of decision.representativePublicExports ?? []) {
      const owners = productState.exportOwners.get(exportName) ?? [];
      if (owners.length !== 1) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_DECISION_EXPORT_CONFLICT', `${decision.id}/${exportName}`, `representative export resolves to ${owners.length} Product sources.`);
      } else if (owners[0].family !== decision.productFamily) {
        addDiagnostic(diagnostics, 'conflict', 'PRODUCT_DECISION_FAMILY_CONFLICT', `${decision.id}/${exportName}`, `source family is ${owners[0].family}; decision says ${decision.productFamily}.`);
      }
    }
  }
  for (const decision of roboticsDecisions) {
    for (const exportName of decision.representativePublicExports ?? []) {
      if (!roboticsExports.has(exportName)) {
        addDiagnostic(diagnostics, 'conflict', 'ROBOTICS_DECISION_EXPORT_CONFLICT', `${decision.id}/${exportName}`, 'representative Robotics export is absent from the pinned external surface.');
      }
    }
  }
  return { productDecisions, roboticsDecisions };
}

function validateSpecialistBoundaries(snapshot, layerState, productState, diagnostics) {
  const robotics = snapshot.roboticsSurface ?? {};
  const lds3d = snapshot.lds3dSurface ?? {};
  const cross = snapshot.crossRepositoryStyleContract ?? {};
  const roboticsProfile = cross.profiles?.['robotics-ui'];
  const lds3dProfile = cross.profiles?.['lds3d-ui'];

  if (roboticsProfile?.externalSurface !== ROBOTICS_SURFACE_PATH
    || roboticsProfile?.repository !== robotics.package?.repository
    || roboticsProfile?.package?.name !== robotics.package?.name
    || roboticsProfile?.package?.version !== robotics.package?.version
    || layerState.roboticsLayer?.package !== robotics.package?.name) {
    addDiagnostic(diagnostics, 'conflict', 'ROBOTICS_METADATA_CONFLICT', ROBOTICS_SURFACE_PATH, 'owner authority, cross-repository profile, and pinned Robotics package identity must match exactly.');
  }
  const roboticsEntries = robotics.entries ?? [];
  for (const duplicate of collectDuplicates(roboticsEntries.map((entry) => normalizeEntrySource(entry.source)))) {
    addDiagnostic(diagnostics, 'duplicate', 'ROBOTICS_SOURCE_DUPLICATE', duplicate, 'Robotics external source is listed more than once.');
  }
  for (const entry of roboticsEntries) {
    if (!normalizeEntrySource(entry.source).startsWith('components/robotics/')) {
      addDiagnostic(diagnostics, 'conflict', 'ROBOTICS_SOURCE_NAMESPACE_CONFLICT', entry.source ?? '<missing>', 'Robotics external source must stay below components/robotics/.');
    }
    if (!Array.isArray(entry.exports) || entry.exports.length === 0) {
      addDiagnostic(diagnostics, 'unclassified', 'ROBOTICS_SOURCE_EXPORTS_MISSING', entry.source ?? '<missing>', 'Robotics external source must classify at least one public export.');
    }
  }
  const roboticsExportNames = roboticsEntries.flatMap((entry) => entry.exports ?? []);
  for (const duplicate of collectDuplicates(roboticsExportNames)) {
    addDiagnostic(diagnostics, 'duplicate', 'ROBOTICS_EXPORT_DUPLICATE', duplicate, 'Robotics external export resolves from more than one source.');
  }
  const roboticsExports = new Set(roboticsExportNames);
  for (const [exportName, ownerRows] of productState.exportOwners) {
    if (ownerRows.length > 0 && roboticsExports.has(exportName)) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_ROBOTICS_EXPORT_OVERLAP', exportName, 'symbol is claimed by both Product and Robotics public surfaces.');
    }
  }

  if (lds3dProfile?.externalSurface !== LDS3D_SURFACE_PATH
    || lds3dProfile?.repository !== lds3d.package?.repository
    || lds3dProfile?.workspacePackage?.manifest !== lds3d.package?.manifest
    || lds3dProfile?.workspacePackage?.name !== lds3d.package?.name
    || lds3dProfile?.workspacePackage?.version !== lds3d.package?.version) {
    addDiagnostic(diagnostics, 'conflict', 'LDS3D_METADATA_CONFLICT', LDS3D_SURFACE_PATH, 'cross-repository profile and pinned LDS3D workspace identity must match exactly.');
  }
  const lds3dPackages = lds3d.packages ?? [];
  for (const duplicate of collectDuplicates(lds3dPackages.map((entry) => entry.manifest))) {
    addDiagnostic(diagnostics, 'duplicate', 'LDS3D_MANIFEST_DUPLICATE', duplicate, 'LDS3D package manifest is listed more than once.');
  }
  for (const duplicate of collectDuplicates([lds3d.package?.name, ...lds3dPackages.map((entry) => entry.name)])) {
    addDiagnostic(diagnostics, 'duplicate', 'LDS3D_PACKAGE_DUPLICATE', duplicate, 'LDS3D package name is listed more than once.');
  }
  const qualifiedLds3dExports = lds3dPackages.flatMap((entry) => (entry.exports ?? []).map((exportPath) => (
    exportPath === '.' ? entry.name : `${entry.name}${exportPath.slice(1)}`
  )));
  for (const duplicate of collectDuplicates(qualifiedLds3dExports)) {
    addDiagnostic(diagnostics, 'duplicate', 'LDS3D_EXPORT_DUPLICATE', duplicate, 'qualified LDS3D package export is listed more than once.');
  }
  for (const packageEntry of lds3dPackages) {
    if (!String(packageEntry.name ?? '').startsWith('@lk-design-system/lds-3d-')) {
      addDiagnostic(diagnostics, 'conflict', 'LDS3D_PACKAGE_NAMESPACE_CONFLICT', packageEntry.name ?? '<missing>', 'headless LDS3D package must stay in the @lk-design-system/lds-3d-* namespace.');
    }
    if (packageEntry.version !== lds3d.package?.version) {
      addDiagnostic(diagnostics, 'conflict', 'LDS3D_PACKAGE_VERSION_CONFLICT', packageEntry.name ?? '<missing>', `package version ${packageEntry.version ?? '<missing>'} differs from workspace ${lds3d.package?.version ?? '<missing>'}.`);
    }
    if (!Array.isArray(packageEntry.exports) || packageEntry.exports.length === 0) {
      addDiagnostic(diagnostics, 'unclassified', 'LDS3D_PACKAGE_EXPORTS_MISSING', packageEntry.name ?? '<missing>', 'LDS3D package must classify at least one qualified export.');
    }
  }
  const localLayerPackages = new Set((snapshot.ownerAuthority?.layers ?? []).map((layer) => layer.package));
  for (const name of [lds3d.package?.name, ...lds3dPackages.map((entry) => entry.name)]) {
    if (localLayerPackages.has(name)) {
      addDiagnostic(diagnostics, 'conflict', 'LDS3D_OWNER_PACKAGE_OVERLAP', name ?? '<missing>', 'LDS3D package identity overlaps a DOM/Robotics owner package.');
    }
  }
  const lds3dHeadlessManifests = (lds3dProfile?.headlessPackages ?? []).map((entry) => entry.manifest);
  for (const duplicate of collectDuplicates(lds3dHeadlessManifests)) {
    addDiagnostic(diagnostics, 'duplicate', 'LDS3D_HEADLESS_PACKAGE_DUPLICATE', duplicate, 'cross-repository LDS3D headless package manifest is listed more than once.');
  }
  exactSetDiagnostics({
    diagnostics,
    expected: lds3dPackages.map((entry) => entry.manifest),
    actual: lds3dHeadlessManifests,
    missingCode: 'LDS3D_HEADLESS_PACKAGE_MISSING',
    extraCode: 'LDS3D_HEADLESS_PACKAGE_EXTRA',
    subject: 'cross-repository/lds3d-headless-package',
  });

  const expectedLocalPackages = (snapshot.ownerAuthority?.layers ?? [])
    .filter((layer) => ['core', 'theme', 'product'].includes(layer.id))
    .map((layer) => layer.package);
  const crossRepositoryLocalPackages = (cross.lds?.packages ?? []).map((entry) => entry.name);
  for (const duplicate of collectDuplicates(crossRepositoryLocalPackages)) {
    addDiagnostic(diagnostics, 'duplicate', 'CROSS_REPOSITORY_LOCAL_PACKAGE_DUPLICATE', duplicate, 'cross-repository LDS package name is listed more than once.');
  }
  exactSetDiagnostics({
    diagnostics,
    expected: expectedLocalPackages,
    actual: crossRepositoryLocalPackages,
    missingCode: 'CROSS_REPOSITORY_LOCAL_PACKAGE_MISSING',
    extraCode: 'CROSS_REPOSITORY_LOCAL_PACKAGE_EXTRA',
    subject: 'cross-repository/local-package',
  });

  for (const occurrence of snapshot.productSpecialistImports ?? []) {
    const specialist = SPECIALIST_PACKAGE_PREFIXES.find((prefix) => (
      occurrence.specifier === prefix || occurrence.specifier.startsWith(`${prefix}/`) || occurrence.specifier.startsWith(`${prefix}-`)
    ));
    if (specialist) {
      addDiagnostic(diagnostics, 'conflict', 'PRODUCT_SPECIALIST_DEPENDENCY_CONFLICT', `${occurrence.file}/${occurrence.specifier}`, `Product may not import specialist owner package ${specialist}.`);
    }
  }

  return { roboticsEntries, roboticsExports, lds3dPackages, qualifiedLds3dExports };
}

export function validateLayerOwnerExactSet(snapshot) {
  const diagnostics = [];
  const layerState = validateLayerMetadata(snapshot, diagnostics);
  const productState = validateProductFamilies(snapshot, diagnostics);
  const registryState = validateProductRegistry(snapshot, productState, diagnostics);
  const storybookState = validateStorybook(snapshot, productState, registryState, diagnostics);
  const specialistState = validateSpecialistBoundaries(snapshot, layerState, productState, diagnostics);
  const domainState = validateDomainDecisions(snapshot, productState, specialistState.roboticsExports, diagnostics);

  if (diagnostics.length > 0) throw new LayerOwnerExactSetError(diagnostics);

  return {
    product: {
      ownedSources: productState.ownedRows.length,
      ownedExports: productState.ownedRows.reduce((count, row) => count + row.exports.length, 0),
      compatibilitySources: productState.compatibilityBySource.size,
      familyCounts: Object.fromEntries(productState.familyCounts),
      canonicalStorybookPages: storybookState.guides.length,
      nonCanonicalHiddenPages: storybookState.nonCanonicalPages.length,
      ownerBoundaryDecisions: domainState.productDecisions.length,
    },
    robotics: {
      sources: specialistState.roboticsEntries.length,
      exports: specialistState.roboticsExports.size,
      ownerBoundaryDecisions: domainState.roboticsDecisions.length,
    },
    lds3d: {
      packages: specialistState.lds3dPackages.length,
      qualifiedExports: specialistState.qualifiedLds3dExports.length,
    },
    violations: { unclassified: 0, duplicate: 0, conflict: 0 },
  };
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

function repositoryDescendant(root, relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0 || relativePath.includes('\0')) return null;
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
  return target;
}

async function pathExists(root, relativePath) {
  try {
    const target = repositoryDescendant(root, relativePath);
    if (!target) return false;
    const metadata = await lstat(target);
    return metadata.isFile() && !metadata.isSymbolicLink();
  } catch {
    return false;
  }
}

async function listSourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listSourceFiles(absolute));
    else if (entry.isSymbolicLink()) throw new Error(`Product source scan rejects symbolic links: ${normalizePath(absolute)}.`);
    else if (/\.(?:[cm]?js|jsx|tsx?)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

async function scanProductSpecialistImports(root) {
  const sourceRoot = path.join(root, 'packages/product/src');
  const occurrences = [];
  for (const file of await listSourceFiles(sourceRoot)) {
    const source = await readFile(file, 'utf8');
    for (const finding of findProductSpecialistSpecifiers(source, file)) {
      occurrences.push({
        file: normalizePath(path.relative(root, file)),
        specifier: finding.specifier,
        line: finding.line,
        column: finding.column,
      });
    }
  }
  return occurrences;
}

export async function loadLayerOwnerExactSetSnapshot(root = repositoryRoot) {
  const [
    ownerAuthority,
    productFamilyContract,
    productEntrySource,
    productPackage,
    componentContent,
    storybookAudit,
    roboticsSurface,
    lds3dSurface,
    crossRepositoryStyleContract,
    productSpecialistImports,
  ] = await Promise.all([
    readJson(root, OWNER_AUTHORITY_PATH),
    readJson(root, PRODUCT_FAMILY_PATH),
    readFile(path.join(root, PRODUCT_ENTRY_PATH), 'utf8'),
    readJson(root, PRODUCT_PACKAGE_PATH),
    readJson(root, COMPONENT_CONTENT_PATH),
    readJson(root, STORYBOOK_IA_PATH),
    readJson(root, ROBOTICS_SURFACE_PATH),
    readJson(root, LDS3D_SURFACE_PATH),
    readJson(root, CROSS_REPOSITORY_CONTRACT_PATH),
    scanProductSpecialistImports(root),
  ]);

  const componentEntries = await Promise.all((componentContent.entries ?? []).map(async (entry) => ({
    ...entry,
    promptExists: typeof entry.prompt === 'string' && await pathExists(root, entry.prompt),
  })));
  const parsedProductEntry = parseProductPublicEntry(productEntrySource, PRODUCT_ENTRY_PATH);
  const productEntryRows = await Promise.all(parsedProductEntry.rows.map(async (row) => ({
    ...row,
    sourceExists: await pathExists(
      root,
      path.posix.join(path.posix.dirname(PRODUCT_ENTRY_PATH), row.source),
    ),
  })));

  return {
    ownerAuthority,
    productFamilyContract,
    productEntryRows,
    productEntryDiagnostics: parsedProductEntry.diagnostics,
    productPackage,
    componentEntries,
    canonicalGuides: componentContent.guides ?? [],
    storybookPages: storybookAudit.pages ?? [],
    roboticsSurface,
    lds3dSurface,
    crossRepositoryStyleContract,
    productSpecialistImports,
  };
}

export async function runLayerOwnerExactSetCli(root = repositoryRoot) {
  const summary = validateLayerOwnerExactSet(await loadLayerOwnerExactSetSnapshot(root));
  console.log(
    `Validated layer owner exact set: Product ${summary.product.ownedSources} sources/${summary.product.ownedExports} exports/`
      + `${summary.product.canonicalStorybookPages} canonical pages + ${summary.product.nonCanonicalHiddenPages} exact hidden fixture; `
      + `Robotics ${summary.robotics.sources} sources/${summary.robotics.exports} exports; `
      + `LDS3D ${summary.lds3d.packages} packages/${summary.lds3d.qualifiedExports} qualified exports; `
      + 'unclassified=0, duplicate=0, conflict=0.',
  );
  return summary;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) await runLayerOwnerExactSetCli();
