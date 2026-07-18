import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const auditPath = 'docs/references/package-split/MIGRATION_AUDIT.json';
const schemaPath = 'docs/references/package-split/MIGRATION_AUDIT.schema.json';
const classificationPath = 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json';
const productAuditPath = 'docs/references/product-frontends/COVERAGE_AUDIT.json';
const requireWave0 = process.argv.includes('--require-wave=0');
const requiredProductUsageKeys = [
  'dependencyDeclarations',
  'aggregateRootImports',
  'layerSubpathImports',
  'componentDeepImports',
  'stylesheetImports',
  'assetFilesystemPaths',
  'lds3dPackageImports',
  'cjsRequireOccurrences',
];
const requiredLds3dCommittedUsageKeys = [
  'aggregateRootImportFiles',
  'componentDeepSpecifiers',
  'stylesheetImports',
  'dependencyDeclarations',
  'assetFilesystemPaths',
  'layerSubpathImports',
  'cjsRequireOccurrences',
];
const requiredLds3dWorktreeUsageKeys = [
  'aggregateRootImportFiles',
  'aggregateRootBindings',
  'bindingsByTarget',
  'componentDeepSpecifiers',
  'deepSpecifiersByTarget',
  'stylesheetImports',
  'dependencyDeclarations',
  'assetFilesystemPaths',
  'layerSubpathImports',
  'cjsRequireOccurrences',
];
const requiredWave0MatrixIds = [
  'React 18',
  'React 19',
  'SSR',
  'tree-shaking',
  'Windows',
  'Linux',
  'Storybook visual',
  'tarball and consumer bundle size',
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function sameStringSet(actual, expected, label) {
  const actualSorted = sorted(actual);
  const expectedSorted = sorted(expected);
  if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
    fail(
      `${label} mismatch.\n  expected: ${expectedSorted.join(', ')}\n  actual: ${actualSorted.join(', ')}`,
    );
  }
}

function equalStringSet(actual, expected) {
  return JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected));
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function isFile(relativePath) {
  try {
    return (await stat(path.join(root, relativePath))).isFile();
  } catch {
    return false;
  }
}

async function walkFiles(relativeDirectory) {
  const absoluteDirectory = path.join(root, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = normalizePath(path.join(relativeDirectory, entry.name));
    if (entry.isDirectory()) files.push(...(await walkFiles(relativePath)));
    else if (entry.isFile()) files.push(relativePath);
  }
  return sorted(files);
}

function parseReexports(filePath, source) {
  const rows = [];
  const pattern = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;/g;
  let match;
  while ((match = pattern.exec(source))) {
    const names = match[1]
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.split(/\s+as\s+/).at(-1).trim());
    const absoluteSource = path.resolve(root, path.dirname(filePath), match[2]);
    rows.push({
      source: normalizePath(path.relative(root, absoluteSource)),
      names,
    });
  }
  const declarationCount = (source.match(/^\s*export\b/gm) || []).length;
  assert(
    rows.length === declarationCount,
    `${filePath}: parsed ${rows.length} re-exports but found ${declarationCount} export declarations.`,
  );
  return rows;
}

function validatePackageGraph(audit) {
  const packages = audit.packageCatalog || [];
  const requiredIds = ['core', 'theme', 'product', 'robotics-ui', 'compatibility'];
  const ids = packages.map((entry) => entry.id);
  const names = packages.map((entry) => entry.name);
  sameStringSet(ids, requiredIds, 'packageCatalog ids');
  assert(new Set(ids).size === ids.length, 'packageCatalog ids must be unique.');
  assert(new Set(names).size === names.length, 'packageCatalog names must be unique.');

  const packageById = new Map(packages.map((entry) => [entry.id, entry]));
  const expectedNames = {
    core: '@lk-robotics/lds-core',
    theme: '@lk-robotics/lds-theme',
    product: '@lk-robotics/lds-product',
    'robotics-ui': '@lk-robotics/lds-robotics-ui',
    compatibility: '@lk-robotics/design-system-core',
  };
  const expectedDependencies = {
    core: [],
    theme: ['core'],
    product: ['core'],
    'robotics-ui': ['core', 'product'],
    compatibility: ['core', 'theme', 'product', 'robotics-ui'],
  };

  for (const id of requiredIds) {
    const entry = packageById.get(id);
    if (!entry) continue;
    assert(entry.name === expectedNames[id], `${id}: package name drift.`);
    sameStringSet(entry.dependsOn || [], expectedDependencies[id], `${id}.dependsOn`);
    assert(entry.name.startsWith('@lk-robotics/'), `${id}: package name must use @lk-robotics.`);
    assert(
      entry.repository === audit.audit.source.repository,
      `${id}: repository must match the audited LDS repository.`,
    );
    assert(entry.ownerAssignmentStatus, `${id}: ownerAssignmentStatus is required.`);
    assert(entry.accountableOwnerRole, `${id}: accountableOwnerRole is required.`);
    assert(Object.hasOwn(entry, 'accountableOwner'), `${id}: accountableOwner field is required.`);
    assert(entry.moduleFormat?.esm, `${id}: ESM decision is required.`);
    assert(entry.moduleFormat?.types, `${id}: types decision is required.`);
    assert(entry.moduleFormat?.cjs, `${id}: CJS decision is required.`);
    assert(
      entry.stylesEntry === `${entry.name}/styles.css`,
      `${id}: stylesEntry must be the package styles.css subpath.`,
    );
    for (const dependency of entry.dependsOn || []) {
      assert(packageById.has(dependency), `${id}: unknown dependency ${dependency}.`);
      assert(dependency !== id, `${id}: package cannot depend on itself.`);
    }
  }

  assert(
    packageById.get('compatibility')?.ownsImplementation === false,
    'Compatibility package must explicitly own no implementation.',
  );
  assert(audit.decisions?.namespace === '@lk-robotics', 'Package namespace decision drift.');
  assert(
    audit.decisions?.registry === 'https://npm.pkg.github.com',
    'Package registry decision drift.',
  );
  assert(
    audit.decisions?.compatibility?.facadePackage === expectedNames.compatibility,
    'Compatibility facade decision must match the compatibility package.',
  );

  const states = new Map(ids.map((id) => [id, 'unvisited']));
  const stack = [];
  function visit(id) {
    states.set(id, 'visiting');
    stack.push(id);
    for (const dependency of packageById.get(id)?.dependsOn || []) {
      if (states.get(dependency) === 'visiting') {
        fail(`Package dependency cycle: ${[...stack, dependency].join(' -> ')}`);
      } else if (states.get(dependency) === 'unvisited') {
        visit(dependency);
      }
    }
    stack.pop();
    states.set(id, 'visited');
  }
  for (const id of ids) if (states.get(id) === 'unvisited') visit(id);
  return packageById;
}

async function validateModuleOwnership(audit, packageById) {
  const classification = await readJson(classificationPath);
  const currentLayerToPackage = audit.ownership?.currentLayerToPackage || {};
  sameStringSet(
    Object.keys(currentLayerToPackage),
    ['core', 'theme', 'product', 'robotics'],
    'ownership.currentLayerToPackage keys',
  );
  for (const [layer, packageId] of Object.entries(currentLayerToPackage)) {
    assert(packageById.has(packageId), `${layer}: unknown target package ${packageId}.`);
    assert(packageId !== 'compatibility', `${layer}: compatibility cannot own implementation.`);
  }

  const classifiedExports = new Map();
  for (const group of classification.groups || []) {
    for (const exportName of group.exports || []) {
      const rows = classifiedExports.get(exportName) || [];
      rows.push({ ownerLayer: group.ownerLayer, group: group.name });
      classifiedExports.set(exportName, rows);
    }
  }

  const publicSource = await readFile(path.join(root, 'src/index.js'), 'utf8');
  const publicRows = parseReexports('src/index.js', publicSource);
  const publicSourcePaths = new Set();
  const publicSymbols = new Set();
  const publicRowsByLayer = new Map(
    ['core', 'theme', 'product', 'robotics'].map((layer) => [layer, []]),
  );
  const assignmentRows = [];
  const counts = new Map(
    ['core', 'theme', 'product', 'robotics-ui'].map((packageId) => [
      packageId,
      { publicSourceModules: 0, publicSymbols: 0, internalModules: 0, classifiedModules: 0 },
    ]),
  );

  for (const row of publicRows) {
    assert(!publicSourcePaths.has(row.source), `${row.source}: duplicate public source module.`);
    publicSourcePaths.add(row.source);
    const owners = new Set();
    for (const exportName of row.names) {
      assert(!publicSymbols.has(exportName), `${exportName}: duplicate public symbol.`);
      publicSymbols.add(exportName);
      const classifications = classifiedExports.get(exportName) || [];
      assert(
        classifications.length === 1,
        `${exportName}: expected exactly one current owner classification, found ${classifications.length}.`,
      );
      if (classifications.length === 1) owners.add(classifications[0].ownerLayer);
    }
    assert(owners.size === 1, `${row.source}: public symbols have multiple current owners.`);
    const ownerLayer = [...owners][0];
    if (!ownerLayer) continue;
    const packageId = currentLayerToPackage[ownerLayer];
    assert(packageId, `${row.source}: current layer ${ownerLayer} has no target package.`);
    publicRowsByLayer.get(ownerLayer)?.push(row);
    const packageCounts = counts.get(packageId);
    if (packageCounts) {
      packageCounts.publicSourceModules += 1;
      packageCounts.publicSymbols += row.names.length;
      packageCounts.classifiedModules += 1;
    }
    assignmentRows.push(
      `${row.source}|public|${ownerLayer}|${packageId}|${row.names.join(',')}`,
    );

    const declarationPath = row.source.replace(/\.jsx?$/, '.d.ts');
    const promptPath = row.source.replace(/\.jsx?$/, '.prompt.md');
    assert(await isFile(declarationPath), `${row.source}: missing ${declarationPath}.`);
    assert(await isFile(promptPath), `${row.source}: missing ${promptPath}.`);
  }

  for (const exportName of classifiedExports.keys()) {
    assert(publicSymbols.has(exportName), `${exportName}: stale public export classification.`);
  }

  for (const layer of ['core', 'theme', 'product', 'robotics']) {
    const layerPath = `src/${layer}.js`;
    const layerRows = parseReexports(
      layerPath,
      await readFile(path.join(root, layerPath), 'utf8'),
    );
    const rowKey = (row) => `${row.source}|${row.names.join(',')}`;
    sameStringSet(
      layerRows.map(rowKey),
      (publicRowsByLayer.get(layer) || []).map(rowKey),
      `${layerPath} public ownership`,
    );
  }

  const internalPaths = new Set();
  for (const row of classification.internalModules || []) {
    const modulePath = normalizePath(
      row.path.startsWith('components/') ? row.path : `components/${row.path}`,
    );
    assert(!internalPaths.has(modulePath), `${modulePath}: duplicate internal classification.`);
    assert(!publicSourcePaths.has(modulePath), `${modulePath}: both public and internal.`);
    internalPaths.add(modulePath);
    const packageId = currentLayerToPackage[row.ownerLayer];
    assert(packageId, `${modulePath}: unknown internal owner layer ${row.ownerLayer}.`);
    const packageCounts = counts.get(packageId);
    if (packageCounts) {
      packageCounts.internalModules += 1;
      packageCounts.classifiedModules += 1;
    }
    assignmentRows.push(`${modulePath}|internal|${row.ownerLayer}|${packageId}|`);
  }

  const componentModules = (await walkFiles('components')).filter((file) => /\.jsx?$/.test(file));
  sameStringSet(
    componentModules,
    [...publicSourcePaths, ...internalPaths],
    'classified component modules',
  );

  const snapshot = audit.ownership?.snapshot || {};
  assert(snapshot.publicSourceModules === publicRows.length, 'publicSourceModules snapshot drift.');
  assert(snapshot.publicSymbols === publicSymbols.size, 'publicSymbols snapshot drift.');
  assert(snapshot.internalModules === internalPaths.size, 'internalModules snapshot drift.');
  assert(snapshot.classifiedModules === componentModules.length, 'classifiedModules snapshot drift.');
  assert(
    snapshot.assignmentSha256 === sha256(sorted(assignmentRows).join('\n')),
    'Module target assignment digest drift.',
  );

  for (const [packageId, actual] of counts) {
    const expected = snapshot.byPackage?.[packageId];
    assert(expected, `Missing ownership snapshot for ${packageId}.`);
    if (!expected) continue;
    for (const key of Object.keys(actual)) {
      assert(
        actual[key] === expected[key],
        `${packageId}.${key}: expected ${expected[key]}, found ${actual[key]}.`,
      );
    }
  }

  const roboticsRows = publicRowsByLayer.get('robotics') || [];
  const roboticsSources = new Set(roboticsRows.map((row) => row.source));
  const categoryEntries = Object.values(audit.ownership.roboticsReview?.categories || {}).flat();
  assert(
    new Set(categoryEntries).size === categoryEntries.length,
    'Robotics review categories must not overlap.',
  );
  sameStringSet(categoryEntries, roboticsSources, 'Robotics review category coverage');
  assert(
    audit.ownership.roboticsReview?.disposition === 'move-to-robotics-ui',
    'Current Robotics disposition must remain move-to-robotics-ui.',
  );
  assert(
    audit.ownership.roboticsReview?.pendingProductCandidates?.targetPackageRemains ===
      'robotics-ui',
    'Pending Product candidates must remain assigned to robotics-ui.',
  );
  for (const candidate of
    audit.ownership.roboticsReview?.pendingProductCandidates?.publicModules || []) {
    assert(roboticsSources.has(candidate), `${candidate}: Product candidate is not Robotics-owned.`);
  }
  for (const candidate of
    audit.ownership.roboticsReview?.pendingProductCandidates?.internalModules || []) {
    assert(internalPaths.has(candidate.path), `${candidate.path}: unknown internal candidate.`);
  }

  return {
    publicSourceModules: publicRows.length,
    publicSymbols: publicSymbols.size,
    classifiedModules: componentModules.length,
    layerSymbols: Object.fromEntries(
      [...publicRowsByLayer.entries()].map(([layer, rows]) => [
        layer,
        rows.reduce((sum, row) => sum + row.names.length, 0),
      ]),
    ),
  };
}

async function validateCompatibilitySurface(audit, moduleSummary, assetSummary) {
  const surface = audit.ownership?.compatibilitySurface;
  const packageJson = await readJson('package.json');
  assert(surface?.packageId === 'compatibility', 'Compatibility surface package id drift.');
  assert(surface?.rootSymbols === moduleSummary.publicSymbols, 'Compatibility root symbol count drift.');
  for (const layer of ['core', 'theme', 'product', 'robotics']) {
    assert(
      surface?.layerSymbols?.[layer] === moduleSummary.layerSymbols[layer],
      `Compatibility ${layer} symbol count drift.`,
    );
  }
  assert(
    surface?.publicComponentDeepModules === moduleSummary.publicSourceModules,
    'Compatibility component deep-module count drift.',
  );
  const tokenFiles = await walkFiles('tokens');
  assert(surface?.tokenWildcardFiles === tokenFiles.length, 'Compatibility token file count drift.');
  assert(surface?.assetWildcardFiles === assetSummary.files, 'Compatibility asset file count drift.');
  assert(surface?.legacyStylesEntries === 1 && (await isFile('styles.css')), 'Compatibility styles entry drift.');
  sameStringSet(
    Object.keys(packageJson.exports || {}),
    surface?.requiredPackageExports || [],
    'Compatibility package export keys',
  );
}

function collectCssNames(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (typeof value.css === 'string') output.push(value.css);
  for (const child of Object.values(value)) collectCssNames(child, output);
  return output;
}

function normalizeCssSelector(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractCssRuleHeaders(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const headers = [];
  let segmentStart = 0;
  let depth = 0;
  for (let index = 0; index < clean.length; index += 1) {
    const character = clean[index];
    if (character === '{') {
      const header = normalizeCssSelector(clean.slice(segmentStart, index));
      if (header && !header.startsWith('@')) headers.push(header);
      depth += 1;
      segmentStart = index + 1;
    } else if (character === '}') {
      depth = Math.max(0, depth - 1);
      segmentStart = index + 1;
    } else if (character === ';' && depth === 0) {
      segmentStart = index + 1;
    }
  }
  return headers;
}

function hasCssDeclaration(source, selector, property) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  const normalizedSelector = normalizeCssSelector(selector);
  const propertyPattern = new RegExp(`(?:^|;)\\s*${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`, 'm');
  while ((match = pattern.exec(clean))) {
    if (normalizeCssSelector(match[1]) !== normalizedSelector) continue;
    if (propertyPattern.test(match[2])) return true;
  }
  return false;
}

async function validateStyles(audit, packageById) {
  const styleFiles = audit.styles?.files || [];
  const tokenCssFiles = (await readdir(path.join(root, 'tokens')))
    .filter((name) => name.endsWith('.css'))
    .map((name) => `tokens/${name}`);
  sameStringSet(
    styleFiles.map((entry) => entry.path),
    tokenCssFiles,
    'Token CSS ownership files',
  );

  const runtimeNames = [];
  for (const entry of styleFiles) {
    assert(packageById.has(entry.defaultPackageId), `${entry.path}: unknown default package.`);
    assert(
      entry.defaultPackageId !== 'compatibility',
      `${entry.path}: compatibility cannot own token implementation.`,
    );
    const bytes = await readFile(path.join(root, entry.path));
    const source = bytes.toString('utf8');
    assert(sha256(bytes) === entry.sha256, `${entry.path}: content checksum drift.`);
    const properties = [...source.matchAll(/^\s*(--[a-zA-Z0-9_-]+)\s*:/gm)].map(
      (match) => match[1],
    );
    runtimeNames.push(...properties);
    assert(
      properties.length === entry.customPropertyDeclarations,
      `${entry.path}: expected ${entry.customPropertyDeclarations} custom-property declarations, found ${properties.length}.`,
    );

    const overrideCounts = new Map(
      (entry.propertyOverrides || []).map((override) => [override.prefix, 0]),
    );
    for (const property of properties) {
      const matches = (entry.propertyOverrides || []).filter((override) =>
        property.startsWith(override.prefix),
      );
      assert(matches.length <= 1, `${entry.path}: ${property} matches multiple owner overrides.`);
      const owner = matches[0]?.packageId || entry.defaultPackageId;
      assert(packageById.has(owner), `${entry.path}: ${property} has unknown owner ${owner}.`);
      assert(owner !== 'compatibility', `${entry.path}: ${property} cannot be compat-owned.`);
      if (matches[0]) overrideCounts.set(matches[0].prefix, overrideCounts.get(matches[0].prefix) + 1);
    }
    for (const override of entry.propertyOverrides || []) {
      assert(
        overrideCounts.get(override.prefix) === override.declarationCount,
        `${entry.path}: ${override.prefix} expected ${override.declarationCount} declarations, found ${overrideCounts.get(override.prefix)}.`,
      );
      assert(
        override.packageId !== entry.defaultPackageId,
        `${entry.path}: redundant property owner override ${override.prefix}.`,
      );
    }
    for (const packageId of entry.contractConsumerPackageIds || []) {
      assert(packageById.has(packageId), `${entry.path}: unknown contract consumer ${packageId}.`);
      assert(packageId !== 'compatibility', `${entry.path}: compatibility cannot own a token contract.`);
    }
    const declarationKeys = [];
    for (const override of entry.declarationOverrides || []) {
      assert(
        packageById.has(override.packageId),
        `${entry.path}: unknown declaration override package ${override.packageId}.`,
      );
      assert(
        override.packageId !== 'compatibility' && override.packageId !== entry.defaultPackageId,
        `${entry.path}: declaration override must target a non-default implementation package.`,
      );
      assert(
        hasCssDeclaration(source, override.selector, override.property),
        `${entry.path}: unknown declaration slice ${override.selector} / ${override.property}.`,
      );
      declarationKeys.push(
        `${normalizeCssSelector(override.selector)}|${override.property.trim().toLowerCase()}`,
      );
    }
    assert(
      new Set(declarationKeys).size === declarationKeys.length,
      `${entry.path}: declaration slices must not overlap.`,
    );
    if (
      (entry.propertyOverrides || []).length > 0 ||
      (entry.selectorOverrides || []).length > 0 ||
      (entry.declarationOverrides || []).length > 0
    ) {
      assert(entry.splitRequired === true, `${entry.path}: mixed ownership must set splitRequired=true.`);
    }

    const actualRuleHeaders = new Set(extractCssRuleHeaders(source));
    const assignedSelectors = [];
    const assignedAttributeRows = [];
    for (const override of entry.selectorOverrides || []) {
      assert(
        packageById.has(override.packageId),
        `${entry.path}: unknown selector override package ${override.packageId}.`,
      );
      assert(
        override.packageId !== 'compatibility',
        `${entry.path}: compatibility cannot own a selector slice.`,
      );
      assert(
        override.packageId !== entry.defaultPackageId,
        `${entry.path}: redundant selector owner override for ${override.packageId}.`,
      );
      assert(
        (override.selectors || []).length > 0 || (override.dataAttributes || []).length > 0,
        `${entry.path}: selector override must identify selectors or data attributes.`,
      );
      for (const selector of override.selectors || []) {
        const normalized = normalizeCssSelector(selector);
        assignedSelectors.push(normalized);
        assert(actualRuleHeaders.has(normalized), `${entry.path}: unknown selector slice ${selector}.`);
      }
      assignedAttributeRows.push(...(override.dataAttributes || []));
    }
    assert(
      new Set(assignedSelectors).size === assignedSelectors.length,
      `${entry.path}: selector slices must not overlap.`,
    );
    assert(
      new Set(assignedAttributeRows).size === assignedAttributeRows.length,
      `${entry.path}: data-attribute selector slices must not overlap.`,
    );

    const actualDataAttributes = sorted(
      new Set(
        [...source.matchAll(/\[(data-[a-zA-Z0-9_-]+)(?:[=\]])/g)].map((match) => match[1]),
      ),
    );
    const assignedDataAttributes = sorted(
      new Set(assignedAttributeRows),
    );
    if (assignedDataAttributes.length > 0) {
      sameStringSet(
        assignedDataAttributes,
        actualDataAttributes,
        `${entry.path} selector override data attributes`,
      );
    }
  }

  const legacy = audit.styles?.legacyFacade;
  const legacyBytes = await readFile(path.join(root, legacy.path));
  const legacySource = legacyBytes.toString('utf8');
  assert(sha256(legacyBytes) === legacy.sha256, `${legacy.path}: compatibility CSS checksum drift.`);
  const importOrder = [...legacySource.matchAll(/@import\s+url\(['"]([^'"]+)['"]\)\s*;/g)].map(
    (match) => match[1],
  );
  assert(
    JSON.stringify(importOrder) === JSON.stringify(legacy.importOrder),
    `${legacy.path}: @import order drift.`,
  );

  const tokenSourceBytes = await readFile(path.join(root, audit.styles.tokenSource.path));
  const tokenSource = JSON.parse(tokenSourceBytes.toString('utf8'));
  assert(
    sha256(tokenSourceBytes) === audit.styles.tokenSource.sha256,
    'tokens/source.json content checksum drift.',
  );
  const expectedSubtrees = [
    ...Object.keys(tokenSource.primitive || {})
      .filter((key) => key !== 'description')
      .map((key) => `primitive.${key}`),
    ...Object.keys(tokenSource.semantic || {})
      .filter((key) => key !== 'description')
      .map((key) => `semantic.${key}`),
    ...Object.keys(tokenSource.component || {})
      .filter((key) => key !== 'description')
      .map((key) => `component.${key}`),
    'modes',
  ];
  const subtreeAssignments = audit.styles.tokenSource.subtreeAssignments || [];
  sameStringSet(
    subtreeAssignments.map((entry) => entry.path),
    expectedSubtrees,
    'tokens/source.json subtree assignments',
  );
  assert(
    new Set(subtreeAssignments.map((entry) => entry.path)).size === subtreeAssignments.length,
    'tokens/source.json subtrees must be assigned exactly once.',
  );
  for (const entry of subtreeAssignments) {
    assert(packageById.has(entry.packageId), `${entry.path}: unknown token package ${entry.packageId}.`);
    assert(entry.packageId !== 'compatibility', `${entry.path}: compatibility cannot own token source.`);
  }

  const runtimeUnique = new Set(runtimeNames);
  const sourceUnique = new Set(collectCssNames(tokenSource));
  const runtimeOnly = [...runtimeUnique].filter((name) => !sourceUnique.has(name));
  const sourceOnly = [...sourceUnique].filter((name) => !runtimeUnique.has(name));
  assert(
    runtimeUnique.size === audit.styles.tokenSource.runtimeUniqueCustomProperties,
    'Runtime unique custom-property count drift.',
  );
  assert(
    sourceUnique.size === audit.styles.tokenSource.sourceUniqueCssNames,
    'tokens/source.json unique css-name count drift.',
  );
  assert(
    runtimeOnly.length === audit.styles.tokenSource.runtimeOnlyCssNames,
    'Runtime-only css-name count drift.',
  );
  assert(
    sourceOnly.length === audit.styles.tokenSource.sourceOnlyCssNames,
    'Source-only css-name count drift.',
  );

  return {
    cssFiles: styleFiles.length,
    runtimeCustomProperties: runtimeUnique.size,
    runtimeOnlyCustomProperties: runtimeOnly.length,
  };
}

async function validateAssets(audit, packageById) {
  const assetFiles = await walkFiles('assets');
  const rules = audit.assets?.rules || [];
  for (const file of assetFiles) {
    const matches = rules.filter((rule) => file.startsWith(rule.pathPrefix));
    assert(matches.length === 1, `${file}: expected one asset owner rule, found ${matches.length}.`);
  }
  for (const rule of rules) {
    assert(packageById.has(rule.packageId), `${rule.pathPrefix}: unknown asset package.`);
    assert(rule.packageId !== 'compatibility', `${rule.pathPrefix}: compatibility cannot own assets.`);
    const files = assetFiles.filter((file) => file.startsWith(rule.pathPrefix));
    const rows = [];
    for (const file of files) {
      const bytes = await readFile(path.join(root, file));
      rows.push(`${file}|${bytes.length}|${sha256(bytes)}`);
    }
    assert(
      files.length === rule.fileCount,
      `${rule.pathPrefix}: expected ${rule.fileCount} files, found ${files.length}.`,
    );
    assert(
      sha256(sorted(rows).join('\n')) === rule.inventorySha256,
      `${rule.pathPrefix}: inventory checksum drift.`,
    );
  }
  assert(assetFiles.length === audit.assets.totalFiles, 'Total asset file count drift.');
  const roboticsFiles = assetFiles.filter((file) => {
    const rule = rules.find((candidate) => file.startsWith(candidate.pathPrefix));
    return rule?.packageId === 'robotics-ui';
  });
  assert(
    roboticsFiles.length === audit.assets.roboticsUiCurrentFiles,
    'Robotics UI asset count drift.',
  );
  assert(audit.assets.lds3dCurrentFiles === 0, 'No current LDS asset may be assigned to LDS3D.');
  return { files: assetFiles.length, rules: rules.length };
}

async function validateConsumers(audit, packageById) {
  const sourceAudit = await readJson(productAuditPath);
  assert(
    audit.consumers.sourceAudit.path === productAuditPath,
    'Consumer source audit path mismatch.',
  );
  assert(
    audit.consumers.sourceAudit.schemaVersion === sourceAudit.schemaVersion,
    'Consumer source audit schema version drift.',
  );
  const sourceRepositories = sourceAudit.repositories || [];
  const products = audit.consumers.products || [];
  sameStringSet(
    products.map((entry) => entry.id),
    sourceRepositories.map((entry) => entry.id),
    'Pinned product consumers',
  );
  const productById = new Map(products.map((entry) => [entry.id, entry]));
  let unverifiedCount = 0;
  let localSnapshotCount = 0;
  let preparedSnapshotCount = 0;
  let trackedSnapshotCount = 0;
  let portableCount = 0;
  for (const source of sourceRepositories) {
    const consumer = productById.get(source.id);
    if (!consumer) continue;
    assert(consumer.repository === source.repository, `${source.id}: repository slug drift.`);
    assert(consumer.expectedPin === source.commit, `${source.id}: pinned commit drift.`);
    assert(consumer.frontendRoot === source.frontendRoot, `${source.id}: frontend root drift.`);
    assert(consumer.framework === source.framework, `${source.id}: framework drift.`);
    assert(/^[0-9a-f]{40}$/.test(consumer.expectedPin), `${source.id}: invalid commit pin.`);
    for (const packageId of consumer.intendedPackageSet || []) {
      assert(packageById.has(packageId), `${source.id}: unknown intended package ${packageId}.`);
      assert(packageId !== 'compatibility', `${source.id}: intended set must not use compatibility.`);
    }
    if (consumer.verificationStatus === 'unverified') {
      unverifiedCount += 1;
      assert(
        consumer.verificationReason === 'checkout-missing',
        `${source.id}: unverified consumer must record checkout-missing.`,
      );
      assert(
        consumer.currentUsage === null,
        `${source.id}: missing checkout must use null, not zero, for currentUsage.`,
      );
    } else if (
      consumer.verificationStatus === 'verified-local-snapshot' ||
      consumer.verificationStatus === 'verified-prepared-snapshot' ||
      consumer.verificationStatus === 'verified-tracked-snapshot' ||
      consumer.verificationStatus === 'verified-portable'
    ) {
      if (consumer.verificationStatus === 'verified-local-snapshot') localSnapshotCount += 1;
      else if (consumer.verificationStatus === 'verified-prepared-snapshot') {
        preparedSnapshotCount += 1;
      }
      else if (consumer.verificationStatus === 'verified-tracked-snapshot') trackedSnapshotCount += 1;
      else portableCount += 1;
      assert(consumer.currentUsage, `${source.id}: verified consumer needs currentUsage.`);
      assert(consumer.checkout?.pinMatches === true, `${source.id}: verified checkout pin mismatch.`);
      assert(consumer.checkout?.dirty === false, `${source.id}: verified checkout must be clean.`);
      assert(
        consumer.checkout?.headCommit === consumer.expectedPin,
        `${source.id}: verified checkout HEAD must equal the audit pin.`,
      );
      if (consumer.verificationStatus !== 'verified-local-snapshot') {
        assert(
          consumer.scanEvidence?.commit === consumer.expectedPin &&
            typeof consumer.scanEvidence?.path === 'string' &&
            hasSha256(consumer.scanEvidence?.sha256),
          `${source.id}: prepared or published snapshot needs pinned scan evidence.`,
        );
      }
      sameStringSet(
        Object.keys(consumer.currentUsage || {}),
        requiredProductUsageKeys,
        `${source.id} current usage fields`,
      );
      for (const [key, value] of Object.entries(consumer.currentUsage || {})) {
        assert(Number.isInteger(value) && value >= 0, `${source.id}.${key}: usage must be >= 0.`);
      }
    } else {
      fail(`${source.id}: unknown verificationStatus ${consumer.verificationStatus}.`);
    }
  }

  const lds3d = (audit.consumers.integrations || []).find((entry) => entry.id === 'lds3d-docs');
  assert(lds3d, 'Missing lds3d-docs integration consumer.');
  if (lds3d) {
    assert(/^[0-9a-f]{40}$/.test(lds3d.headCommit), 'lds3d-docs: invalid HEAD commit.');
    if (
      lds3d.verificationStatus === 'unverified-portability' ||
      lds3d.verificationStatus === 'verified-prepared-snapshot' ||
      lds3d.verificationStatus === 'verified-tracked-snapshot'
    ) {
      assert(lds3d.workingTree?.dirty === true, 'lds3d-docs dirty worktree must remain explicit.');
      assert(
        lds3d.linkDependency?.specifier?.startsWith('link:'),
        'lds3d-docs mutable link dependency must be recorded.',
      );
      assert(lds3d.linkDependency?.portable === false, 'lds3d-docs mutable link must be nonportable.');
    } else if (lds3d.verificationStatus === 'verified-portable') {
      assert(lds3d.workingTree?.dirty === false, 'Portable LDS3D evidence must use a clean tree.');
      assert(
        !/^(link:|file:)/.test(lds3d.linkDependency?.specifier || ''),
        'Portable LDS3D evidence must use an immutable dependency.',
      );
      assert(lds3d.linkDependency?.portable === true, 'Portable LDS3D evidence must be marked portable.');
    } else {
      fail(`lds3d-docs: unknown verificationStatus ${lds3d.verificationStatus}.`);
    }
    if (
      ['verified-prepared-snapshot', 'verified-tracked-snapshot', 'verified-portable'].includes(
        lds3d.verificationStatus,
      )
    ) {
      assert(
        lds3d.scanEvidence?.commit === lds3d.headCommit &&
          typeof lds3d.scanEvidence?.path === 'string' &&
          hasSha256(lds3d.scanEvidence?.sha256),
        'lds3d-docs prepared or published snapshot needs pinned scan evidence.',
      );
    }
    sameStringSet(
      Object.keys(lds3d.committedHeadUsage || {}),
      requiredLds3dCommittedUsageKeys,
      'lds3d-docs committed usage fields',
    );
    sameStringSet(
      Object.keys(lds3d.worktreeUsage || {}),
      requiredLds3dWorktreeUsageKeys,
      'lds3d-docs worktree usage fields',
    );
    for (const [key, value] of Object.entries(lds3d.committedHeadUsage || {})) {
      assert(
        Number.isInteger(value) && value >= 0,
        `lds3d-docs committedHeadUsage.${key} must be >= 0.`,
      );
    }
    for (const [key, value] of Object.entries(lds3d.worktreeUsage || {})) {
      if (key === 'bindingsByTarget' || key === 'deepSpecifiersByTarget') continue;
      assert(
        Number.isInteger(value) && value >= 0,
        `lds3d-docs worktreeUsage.${key} must be >= 0.`,
      );
    }
    for (const mapName of ['bindingsByTarget', 'deepSpecifiersByTarget']) {
      const targetCounts = lds3d.worktreeUsage?.[mapName];
      assert(
        targetCounts && typeof targetCounts === 'object' && !Array.isArray(targetCounts),
        `lds3d-docs ${mapName} must be an object.`,
      );
      for (const [packageId, count] of Object.entries(targetCounts || {})) {
        assert(packageById.has(packageId), `lds3d-docs ${mapName}: unknown package ${packageId}.`);
        assert(
          packageId !== 'compatibility',
          `lds3d-docs ${mapName}: compatibility is not a migration target.`,
        );
        assert(
          Number.isInteger(count) && count >= 0,
          `lds3d-docs ${mapName}.${packageId} must be >= 0.`,
        );
      }
    }
    assert(
      lds3d.deepSpecifiers?.length === lds3d.worktreeUsage?.componentDeepSpecifiers,
      'lds3d-docs deep specifier inventory count drift.',
    );
    const deepSpecifierNames = (lds3d.deepSpecifiers || []).map((entry) => entry.specifier);
    assert(
      deepSpecifierNames.every(
        (specifier) =>
          typeof specifier === 'string' &&
          specifier.startsWith(`${audit.audit.source.packageName}/components/`),
      ),
      'lds3d-docs deep specifiers must be non-empty legacy component paths.',
    );
    assert(
      new Set(deepSpecifierNames).size === deepSpecifierNames.length,
      'lds3d-docs deep specifiers must be unique.',
    );
    for (const entry of lds3d.deepSpecifiers || []) {
      assert(packageById.has(entry.targetPackageId), `${entry.specifier}: unknown migration target.`);
      assert(
        entry.targetPackageId !== 'compatibility',
        `${entry.specifier}: legacy deep import must target a real package.`,
      );
    }
    const sumValues = (value) => Object.values(value || {}).reduce((sum, count) => sum + count, 0);
    assert(
      sumValues(lds3d.worktreeUsage?.bindingsByTarget) ===
        lds3d.worktreeUsage?.aggregateRootBindings,
      'lds3d-docs aggregate binding target counts drift.',
    );
    assert(
      sumValues(lds3d.worktreeUsage?.deepSpecifiersByTarget) ===
        lds3d.worktreeUsage?.componentDeepSpecifiers,
      'lds3d-docs deep specifier target counts drift.',
    );
    const deepTargets = {};
    for (const entry of lds3d.deepSpecifiers || []) {
      deepTargets[entry.targetPackageId] = (deepTargets[entry.targetPackageId] || 0) + 1;
    }
    assert(
      isDeepStrictEqual(deepTargets, lds3d.worktreeUsage?.deepSpecifiersByTarget),
      'lds3d-docs deep specifier rows must match target counts.',
    );
  }
  return {
    products: products.length,
    unverifiedProducts: unverifiedCount,
    localSnapshotProducts: localSnapshotCount,
    preparedSnapshotProducts: preparedSnapshotCount,
    trackedSnapshotProducts: trackedSnapshotCount,
    portableProducts: portableCount,
    integrationTrackedSnapshot: lds3d?.verificationStatus === 'verified-tracked-snapshot',
    integrations: 1,
  };
}

async function validatePackageManager(audit) {
  const packageJson = await readJson('package.json');
  const decision = audit.decisions?.packageManager;
  const repositorySlug = audit.audit.source.repository;
  const expectedRepositoryUrl = `git+https://github.com/${repositorySlug}.git`;
  assert(packageJson.name === audit.audit.source.packageName, 'Audited package name drift.');
  assert(packageJson.version === audit.audit.source.packageVersion, 'Audited package version drift.');
  assert(packageJson.repository?.url === expectedRepositoryUrl, 'package.json repository URL drift.');
  assert(
    packageJson.publishConfig?.registry === audit.decisions.registry,
    'package.json publish registry drift.',
  );
  assert(packageJson.packageManager === decision.packageJsonValue, 'package.json packageManager drift.');
  assert(
    decision.packageJsonValue === `${decision.name}@${decision.version}`,
    'Package-manager name/version decision is internally inconsistent.',
  );
  assert(await isFile(decision.lockfile), `Canonical lockfile missing: ${decision.lockfile}.`);
  const rootFiles = await readdir(root);
  const secondaryLockfiles = rootFiles.filter(
    (name) => /^(pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(name) && name !== decision.lockfile,
  );
  sameStringSet(
    decision.knownSecondaryLockfiles || [],
    secondaryLockfiles,
    'Known secondary lockfiles',
  );
  const ciSource = await readFile(path.join(root, decision.ciWorkflow), 'utf8');
  assert(/cache:\s*npm/.test(ciSource), 'CI must cache npm.');
  assert(
    ciSource.includes(`npm install --global npm@${decision.version}`),
    `CI must install canonical npm ${decision.version}.`,
  );
  assert(
    ciSource.includes(`Expected npm ${decision.version}.`),
    `CI must verify canonical npm ${decision.version}.`,
  );
  assert(/run:\s*npm ci\b/.test(ciSource), 'CI must use npm ci.');
  assert(!/pnpm\/action-setup/.test(ciSource), 'CI must not set up pnpm.');
  assert(!/run:\s*pnpm\b/.test(ciSource), 'CI must not execute pnpm.');
  if (secondaryLockfiles.length > 0) {
    assert(
      (audit.audit.readiness.blockers || []).some((entry) => entry.id === 'single-lockfile'),
      'A tracked secondary lockfile requires the single-lockfile readiness blocker.',
    );
  }
  return { canonical: decision.packageJsonValue, secondaryLockfiles };
}

function validateTopLevelSchema(audit, schema) {
  assert(audit.$schema === './MIGRATION_AUDIT.schema.json', 'Audit $schema path mismatch.');
  assert(audit.schemaVersion === 1, 'Audit schemaVersion must be 1.');
  for (const key of schema.required || []) {
    assert(Object.hasOwn(audit, key), `Audit is missing required top-level key ${key}.`);
  }
  const allowed = new Set(Object.keys(schema.properties || {}));
  for (const key of Object.keys(audit)) {
    assert(allowed.has(key), `Audit has unknown top-level key ${key}.`);
  }
  assert(
    audit.audit.source.classification === classificationPath,
    'Audit classification source path mismatch.',
  );
  assert(
    audit.verificationContract.cleanMainMeaning ===
      'baselines.cleanMain.commit is the tagged source baseline. The ready audit may be committed later on synchronized main/origin-main only when every post-baseline path is an audit or tracked evidence attestation.',
    'Clean-main baseline and attestation relationship drift.',
  );
  for (const evidenceScript of [
    'scripts/check-package-migration.mjs',
    'scripts/scan-package-consumer.mjs',
    'scripts/scan-lds3d-integration.mjs',
  ]) {
    assert(
      audit.verificationContract.authoritativeInputs?.includes(evidenceScript),
      `${evidenceScript} must remain an authoritative migration input.`,
    );
  }
}

function hasSha256(value) {
  return /^[0-9a-f]{64}$/.test(value || '');
}

function hasCommit(value) {
  return /^[0-9a-f]{40}$/.test(value || '');
}

function gitOutput(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

async function readJsonEvidence(record) {
  const missing = { json: false, tracked: false };
  if (!record || typeof record.path !== 'string' || !hasSha256(record.sha256)) return missing;
  const relativePath = normalizePath(record.path);
  if (relativePath === '..' || relativePath.startsWith('../') || path.isAbsolute(relativePath)) {
    return missing;
  }
  try {
    const bytes = await readFile(path.join(root, relativePath));
    if (sha256(bytes) !== record.sha256) return missing;
    let tracked = false;
    try {
      gitOutput(['ls-files', '--error-unmatch', relativePath]);
      tracked = true;
    } catch {
      tracked = false;
    }
    return { json: JSON.parse(bytes.toString('utf8')), tracked };
  } catch {
    return missing;
  }
}

function uniqueRows(rows) {
  return Array.isArray(rows) && new Set(rows.map((entry) => JSON.stringify(entry))).size === rows.length;
}

function validProductScanEvidence(evidence, consumer, aggregateName) {
  const matches = evidence?.matches;
  if (
    evidence?.scanner !== 'scripts/scan-package-consumer.mjs' ||
    evidence?.scannerVersion !== 1 ||
    !matches ||
    !equalStringSet(Object.keys(matches), requiredProductUsageKeys)
  ) {
    return false;
  }
  for (const key of requiredProductUsageKeys) {
    const rows = matches[key];
    if (!uniqueRows(rows) || rows.length !== consumer.currentUsage[key]) return false;
    if (!rows.every((entry) => typeof entry.file === 'string' && entry.file.length > 0)) {
      return false;
    }
  }
  const isUiSpecifier = (specifier) =>
    typeof specifier === 'string' &&
    (specifier === aggregateName ||
      specifier.startsWith(`${aggregateName}/`) ||
      /^@lk-robotics\/lds-(?:core|theme|product|robotics-ui)(?:\/|$)/.test(specifier));
  return (
    matches.dependencyDeclarations.every(
      (entry) =>
        isUiSpecifier(entry.specifier) &&
        typeof entry.field === 'string' &&
        typeof entry.version === 'string',
    ) &&
    matches.aggregateRootImports.every((entry) => entry.specifier === aggregateName) &&
    matches.layerSubpathImports.every(
      (entry) =>
        new RegExp(`^${aggregateName.replace('/', '\\/')}\/(?:core|theme|product|robotics)$`).test(
          entry.specifier,
        ) || /^@lk-robotics\/lds-(?:core|theme|product|robotics-ui)(?:\/|$)/.test(entry.specifier),
    ) &&
    matches.componentDeepImports.every((entry) =>
      entry.specifier.startsWith(`${aggregateName}/components/`),
    ) &&
    matches.stylesheetImports.every(
      (entry) =>
        entry.specifier === `${aggregateName}/styles.css` ||
        entry.specifier.startsWith(`${aggregateName}/tokens/`) ||
        /^@lk-robotics\/lds-(?:core|theme|product|robotics-ui)\/styles\.css$/.test(
          entry.specifier,
        ),
    ) &&
    matches.assetFilesystemPaths.every(
      (entry) =>
        typeof entry.path === 'string' ||
        entry.specifier?.startsWith(`${aggregateName}/assets/`),
    ) &&
    matches.lds3dPackageImports.every((entry) =>
      /^@lk-robotics\/design-system-3d-[a-z0-9-]+(?:\/|$)/.test(entry.specifier),
    ) &&
    matches.cjsRequireOccurrences.every(
      (entry) => entry.kind === 'cjs-require' && isUiSpecifier(entry.specifier),
    )
  );
}

function countRowsByPackage(rows, field) {
  const counts = {};
  for (const row of rows || []) counts[row[field]] = (counts[row[field]] || 0) + 1;
  return counts;
}

function validLds3dMatchSet(matches, usage, aggregateName, worktree) {
  const requiredKeys = [
    'dependencyDeclarations',
    'aggregateImports',
    'rootBindings',
    'deepSpecifiers',
    'stylesheetImports',
    'assetFilesystemPaths',
    'layerSubpathImports',
    'cjsRequireOccurrences',
  ];
  if (!matches || !equalStringSet(Object.keys(matches), requiredKeys)) return false;
  if (!requiredKeys.every((key) => uniqueRows(matches[key]))) return false;
  const rootFiles = new Set(matches.aggregateImports.map((entry) => entry.file));
  const commonCountsMatch =
    rootFiles.size === usage.aggregateRootImportFiles &&
    matches.deepSpecifiers.length === usage.componentDeepSpecifiers &&
    matches.stylesheetImports.length === usage.stylesheetImports &&
    matches.dependencyDeclarations.length === usage.dependencyDeclarations &&
    matches.assetFilesystemPaths.length === usage.assetFilesystemPaths &&
    matches.layerSubpathImports.length === usage.layerSubpathImports &&
    matches.cjsRequireOccurrences.length === usage.cjsRequireOccurrences;
  if (!commonCountsMatch) return false;
  if (
    !matches.aggregateImports.every((entry) => entry.specifier === aggregateName) ||
    !matches.deepSpecifiers.every((entry) =>
      entry.specifier.startsWith(`${aggregateName}/components/`),
    ) ||
    !matches.stylesheetImports.every(
      (entry) =>
        entry.specifier === `${aggregateName}/styles.css` ||
        entry.specifier.startsWith(`${aggregateName}/tokens/`),
    ) ||
    !matches.dependencyDeclarations.every(
      (entry) => entry.specifier === aggregateName && typeof entry.version === 'string',
    ) ||
    !matches.assetFilesystemPaths.every(
      (entry) => typeof entry.file === 'string' && typeof entry.path === 'string',
    ) ||
    !matches.cjsRequireOccurrences.every(
      (entry) =>
        entry.kind === 'cjs-require' &&
        (entry.specifier === aggregateName || entry.specifier.startsWith(`${aggregateName}/`)),
    )
  ) {
    return false;
  }
  if (!worktree) return true;
  return (
    matches.rootBindings.length === usage.aggregateRootBindings &&
    isDeepStrictEqual(
      countRowsByPackage(matches.rootBindings, 'packageId'),
      usage.bindingsByTarget,
    ) &&
    isDeepStrictEqual(
      countRowsByPackage(matches.deepSpecifiers, 'targetPackageId'),
      usage.deepSpecifiersByTarget,
    )
  );
}

function collectExportTargets(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectExportTargets);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectExportTargets);
  }
  return [];
}

function archiveTargetExists(target, archiveEntries) {
  const archiveTarget = `package/${normalizePath(target)}`;
  if (!archiveTarget.includes('*')) return archiveEntries.includes(archiveTarget);
  const pattern = archiveTarget
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.+');
  const matcher = new RegExp(`^${pattern}$`);
  return archiveEntries.some((entry) => matcher.test(entry));
}

async function matchesPackageArtifact(entry) {
  if (!entry || typeof entry.artifactPath !== 'string' || !hasSha256(entry.sha256)) return false;
  const relativePath = normalizePath(entry.artifactPath);
  if (
    relativePath === '..' ||
    relativePath.startsWith('../') ||
    path.isAbsolute(relativePath) ||
    !relativePath.endsWith('.tgz')
  ) {
    return false;
  }
  try {
    const absolutePath = path.join(root, relativePath);
    const bytes = await readFile(absolutePath);
    if (
      bytes.length !== entry.sizeBytes ||
      sha256(bytes) !== entry.sha256 ||
      bytes[0] !== 0x1f ||
      bytes[1] !== 0x8b
    ) {
      return false;
    }
    const archiveEntries = execFileSync('tar', ['-tf', absolutePath], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    })
      .split(/\r?\n/)
      .map((value) => normalizePath(value.trim()))
      .filter(Boolean);
    if (
      !archiveEntries.includes('package/package.json') ||
      archiveEntries.some((value) => value !== 'package' && !value.startsWith('package/'))
    ) {
      return false;
    }
    const archivePackageJson = JSON.parse(
      execFileSync('tar', ['-xOf', absolutePath, 'package/package.json'], {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
      }),
    );
    const sourcePackageJson = await readJson('package.json');
    const manifestFields = [
      'name',
      'version',
      'type',
      'main',
      'module',
      'types',
      'exports',
      'files',
      'sideEffects',
      'peerDependencies',
      'dependencies',
      'publishConfig',
    ];
    if (
      archivePackageJson.name !== entry.package ||
      archivePackageJson.version !== entry.version ||
      !manifestFields.every((field) =>
        isDeepStrictEqual(archivePackageJson[field], sourcePackageJson[field]),
      )
    ) {
      return false;
    }
    const exportTargets = collectExportTargets(sourcePackageJson.exports);
    if (!exportTargets.every((target) => archiveTargetExists(target, archiveEntries))) return false;
    const declaredFilesPresent = (sourcePackageJson.files || []).every((file) => {
      const archivePath = `package/${normalizePath(file)}`;
      return (
        archiveEntries.includes(archivePath) ||
        archiveEntries.some((candidate) => candidate.startsWith(`${archivePath}/`))
      );
    });
    if (!declaredFilesPresent) return false;
    const forbiddenEntries = archiveEntries.filter((value) => {
      const packagePath = value.replace(/^package\//, '');
      return /^(components|src)\/|\.stories\.|\.prompt\.md$|\.jsx$/.test(packagePath);
    });
    return forbiddenEntries.length === 0;
  } catch {
    return false;
  }
}

async function validateReadiness(audit, consumerSummary, packageManagerSummary) {
  const readiness = audit.audit?.readiness;
  const blockers = readiness?.blockers || [];
  const blockerIds = blockers.map((entry) => entry.id);
  assert(new Set(blockerIds).size === blockerIds.length, 'Readiness blocker ids must be unique.');
  sameStringSet(
    audit.baselines.consumerMatrix?.required || [],
    requiredWave0MatrixIds,
    'Wave 0 consumer matrix requirements',
  );

  const ownersAssigned = audit.packageCatalog.every(
    (entry) =>
      entry.ownerAssignmentStatus === 'assigned' &&
      typeof entry.accountableOwner === 'string' &&
      entry.accountableOwner.trim().length > 0,
  );
  const requiredApprovalRoles = [
    'design-system-owner',
    'frontend-platform-owner',
    'robotics-domain-owner',
    'lds3d-maintainer',
  ];
  const approvalRoles = new Set((audit.approvals || []).map((entry) => entry.role));
  const approvalsComplete =
    requiredApprovalRoles.every((role) => approvalRoles.has(role)) &&
    (audit.approvals || []).every(
      (entry) =>
        typeof entry.approver === 'string' &&
        entry.approver.trim().length > 0 &&
        /^\d{4}-\d{2}-\d{2}$/.test(entry.approvedAt || ''),
    );
  const decisionApprovalsClosed =
    audit.decisions.namingApprovalStatus === 'approved' &&
    audit.decisions.registryVersioning?.approvalStatus === 'approved' &&
    audit.decisions.compatibility?.approvalStatus === 'approved' &&
    audit.decisions.repositoryPolicy?.approvalStatus === 'approved' &&
    audit.packageCatalog.every((entry) => !entry.moduleFormat.cjs.includes('pending')) &&
    approvalsComplete;
  const products = audit.consumers.products || [];
  const integrations = audit.consumers.integrations || [];
  const consumerReportsMetadata =
    integrations.every(
      (entry) =>
        [
          'verified-prepared-snapshot',
          'verified-tracked-snapshot',
          'verified-portable',
        ].includes(entry.verificationStatus) &&
        entry.scanEvidence?.commit === entry.headCommit &&
        hasSha256(entry.scanEvidence?.sha256) &&
        typeof entry.scanEvidence?.path === 'string',
    ) &&
    products.every(
      (entry) =>
        [
          'verified-prepared-snapshot',
          'verified-tracked-snapshot',
          'verified-portable',
        ].includes(entry.verificationStatus) &&
        entry.scanEvidence?.commit === entry.expectedPin &&
        hasSha256(entry.scanEvidence?.sha256) &&
        typeof entry.scanEvidence?.path === 'string',
  );
  const consumerPublicationMetadata =
    consumerSummary.trackedSnapshotProducts + consumerSummary.portableProducts ===
      consumerSummary.products &&
    integrations.every((entry) =>
      ['verified-tracked-snapshot', 'verified-portable'].includes(entry.verificationStatus),
    );
  let consumerInventoriesCaptured = false;
  if (consumerReportsMetadata) {
    const productEvidenceRecords = await Promise.all(
      products.map((entry) => readJsonEvidence(entry.scanEvidence)),
    );
    const integrationEvidenceRecords = await Promise.all(
      integrations.map((entry) => readJsonEvidence(entry.scanEvidence)),
    );
    const productEvidenceValid = products.every((entry, index) => {
      const evidence = productEvidenceRecords[index].json;
      return (
        evidence?.kind === 'lds-consumer-import-scan' &&
        evidence.repository === entry.repository &&
        evidence.commit === entry.expectedPin &&
        evidence.frontendRoot === entry.frontendRoot &&
        Number.isInteger(evidence.sourceTreeEntryCount) &&
        evidence.sourceTreeEntryCount > 0 &&
        Number.isInteger(evidence.sourceFileCount) &&
        evidence.sourceFileCount > 0 &&
        hasSha256(evidence.sourceTreeSha256) &&
        isDeepStrictEqual(evidence.currentUsage, entry.currentUsage) &&
        validProductScanEvidence(evidence, entry, audit.audit.source.packageName)
      );
    });
    const integrationEvidenceValid = integrations.every((entry, index) => {
      const evidence = integrationEvidenceRecords[index].json;
      return (
        evidence?.kind === 'lds-consumer-import-scan' &&
        evidence.scanner === 'scripts/scan-lds3d-integration.mjs' &&
        evidence.scannerVersion === 1 &&
        evidence.repository === entry.repository &&
        evidence.commit === entry.headCommit &&
        evidence.docsRoot === 'apps/docs' &&
        evidence.capturedAt === entry.workingTree?.capturedAt &&
        evidence.linkSpecifier === entry.linkDependency?.specifier &&
        evidence.linkResolution?.declaredRelativePath ===
          entry.linkDependency?.declaredRelativePath &&
        evidence.linkResolution?.filesystemLink === true &&
        evidence.linkResolution?.resolvedPathRelativeToIntegrationRepository ===
          entry.linkDependency?.resolvedPathRelativeToIntegrationRepository &&
        evidence.linkResolution?.sameAsScannerWorkspace ===
          entry.linkDependency?.sameAsAuditWorkspace &&
        evidence.linkResolution?.resolvedRepository ===
          entry.linkDependency?.resolvedRepository &&
        evidence.linkResolution?.resolvedCommit === entry.linkDependency?.resolvedCommit &&
        evidence.linkResolution?.resolvedBranch === entry.linkDependency?.resolvedBranch &&
        hasSha256(evidence.sourceTreeSha256) &&
        hasSha256(evidence.worktreeTreeSha256) &&
        (!entry.workingTree?.dirty || hasSha256(evidence.worktreeInventorySha256)) &&
        evidence.workingTree?.dirty === entry.workingTree?.dirty &&
        evidence.workingTree?.trackedChanges === entry.workingTree?.trackedChanges &&
        evidence.workingTree?.untrackedPaths === entry.workingTree?.untrackedPaths &&
        isDeepStrictEqual(evidence.committedHeadUsage, entry.committedHeadUsage) &&
        isDeepStrictEqual(evidence.worktreeUsage, entry.worktreeUsage) &&
        isDeepStrictEqual(evidence.deepSpecifiers, entry.deepSpecifiers) &&
        isDeepStrictEqual(evidence.committedMatches?.deepSpecifiers, entry.deepSpecifiers) &&
        isDeepStrictEqual(evidence.worktreeMatches?.deepSpecifiers, entry.deepSpecifiers) &&
        validLds3dMatchSet(
          evidence.committedMatches,
          entry.committedHeadUsage,
          audit.audit.source.packageName,
          false,
        ) &&
        validLds3dMatchSet(
          evidence.worktreeMatches,
          entry.worktreeUsage,
          audit.audit.source.packageName,
          true,
        )
      );
    });
    const evidenceTracked = [...productEvidenceRecords, ...integrationEvidenceRecords].every(
      (entry) => entry.tracked,
    );
    assert(productEvidenceValid, 'Prepared product consumer evidence is semantically invalid.');
    assert(integrationEvidenceValid, 'Prepared LDS3D consumer evidence is semantically invalid.');
    consumerInventoriesCaptured =
      productEvidenceValid &&
      integrationEvidenceValid &&
      evidenceTracked &&
      consumerPublicationMetadata;
  }
  const cleanMainMetadata =
    audit.baselines.cleanMain?.status === 'captured' &&
    hasCommit(audit.baselines.cleanMain?.commit) &&
    typeof audit.baselines.cleanMain?.tag === 'string' &&
    audit.baselines.cleanMain.tag.length > 0;
  let cleanMainCaptured = false;
  if (cleanMainMetadata) {
    try {
      const baselineCommit = audit.baselines.cleanMain.commit;
      cleanMainCaptured =
        gitOutput(['rev-parse', `${audit.baselines.cleanMain.tag}^{commit}`]) === baselineCommit;
      gitOutput(['merge-base', '--is-ancestor', baselineCommit, 'main']);
      gitOutput(['merge-base', '--is-ancestor', baselineCommit, 'origin/main']);
    } catch {
      cleanMainCaptured = false;
    }
  }
  const fullRegressionMetadata =
    audit.baselines.fullCheck?.status === 'passed-on-clean-main' &&
    audit.baselines.fullCheck?.sourceCommit === audit.baselines.cleanMain?.commit &&
    typeof audit.baselines.fullCheck?.evidencePath === 'string' &&
    hasSha256(audit.baselines.fullCheck?.evidenceSha256) &&
    audit.baselines.consumerMatrix?.status === 'passed' &&
    audit.baselines.consumerMatrix?.sourceCommit === audit.baselines.cleanMain?.commit &&
    typeof audit.baselines.consumerMatrix?.evidencePath === 'string' &&
    hasSha256(audit.baselines.consumerMatrix?.evidenceSha256);
  let fullRegressionCaptured = false;
  if (fullRegressionMetadata) {
    const [fullCheckEvidenceRecord, consumerMatrixEvidenceRecord] = await Promise.all([
      readJsonEvidence({
        path: audit.baselines.fullCheck.evidencePath,
        sha256: audit.baselines.fullCheck.evidenceSha256,
      }),
      readJsonEvidence({
        path: audit.baselines.consumerMatrix.evidencePath,
        sha256: audit.baselines.consumerMatrix.evidenceSha256,
      }),
    ]);
    const fullCheckEvidence = fullCheckEvidenceRecord.json;
    const consumerMatrixEvidence = consumerMatrixEvidenceRecord.json;
    const commands = fullCheckEvidence?.commands;
    const requiredMatrix = requiredWave0MatrixIds;
    const matrixResults = consumerMatrixEvidence?.results;
    const matrixIds = Array.isArray(matrixResults)
      ? matrixResults.map((entry) => entry.id)
      : [];
    const exactMatrixCoverage =
      matrixIds.length === requiredMatrix.length &&
      new Set(matrixIds).size === matrixIds.length &&
      requiredMatrix.every((id) => matrixIds.includes(id));
    fullRegressionCaptured =
      fullCheckEvidenceRecord.tracked &&
      consumerMatrixEvidenceRecord.tracked &&
      fullCheckEvidence?.kind === 'lds-wave0-full-check' &&
      fullCheckEvidence.sourceCommit === audit.baselines.cleanMain.commit &&
      fullCheckEvidence.status === 'passed' &&
      Array.isArray(commands) &&
      commands.length > 0 &&
      commands.every(
        (entry) => typeof entry.command === 'string' && entry.status === 'passed',
      ) &&
      commands.some((entry) => entry.command === 'npm run check') &&
      consumerMatrixEvidence?.kind === 'lds-wave0-consumer-matrix' &&
      consumerMatrixEvidence.sourceCommit === audit.baselines.cleanMain.commit &&
      consumerMatrixEvidence.status === 'passed' &&
      exactMatrixCoverage &&
      matrixResults.every((entry) => entry.status === 'passed');
  }
  const tarballs = audit.baselines.packageArtifacts?.tarballs || [];
  const aggregateTarball = tarballs[0];
  const packageArtifactsMetadata =
    audit.baselines.packageArtifacts?.status === 'captured' &&
    audit.baselines.packageArtifacts?.sourceCommit === audit.baselines.cleanMain?.commit &&
    typeof audit.baselines.packageArtifacts?.lastKnownGoodReleaseSet === 'string' &&
    audit.baselines.packageArtifacts.lastKnownGoodReleaseSet.length > 0 &&
    typeof audit.baselines.packageArtifacts?.evidencePath === 'string' &&
    hasSha256(audit.baselines.packageArtifacts?.evidenceSha256) &&
    tarballs.length === 1 &&
    aggregateTarball?.package === audit.audit.source.packageName &&
    aggregateTarball?.version === audit.audit.source.packageVersion &&
    aggregateTarball?.sourceCommit === audit.baselines.cleanMain?.commit &&
    typeof aggregateTarball?.artifactPath === 'string' &&
    Number.isInteger(aggregateTarball?.sizeBytes) &&
    aggregateTarball.sizeBytes > 0 &&
    hasSha256(aggregateTarball?.sha256);
  let packageArtifactsCaptured = false;
  if (packageArtifactsMetadata) {
    const artifactEvidenceRecord = await readJsonEvidence({
      path: audit.baselines.packageArtifacts.evidencePath,
      sha256: audit.baselines.packageArtifacts.evidenceSha256,
    });
    const artifactEvidence = artifactEvidenceRecord.json;
    const evidenceTarballs = artifactEvidence?.tarballs;
    const evidenceTarball = Array.isArray(evidenceTarballs) ? evidenceTarballs[0] : undefined;
    packageArtifactsCaptured =
      artifactEvidenceRecord.tracked &&
      (await matchesPackageArtifact(aggregateTarball)) &&
      artifactEvidence?.kind === 'lds-wave0-aggregate-artifact' &&
      artifactEvidence.sourceCommit === audit.baselines.cleanMain.commit &&
      artifactEvidence.lastKnownGoodReleaseSet ===
        audit.baselines.packageArtifacts.lastKnownGoodReleaseSet &&
      Array.isArray(evidenceTarballs) &&
      evidenceTarballs.length === 1 &&
      evidenceTarball?.package === aggregateTarball.package &&
      evidenceTarball?.version === aggregateTarball.version &&
      evidenceTarball?.sourceCommit === aggregateTarball.sourceCommit &&
      evidenceTarball?.artifactPath === aggregateTarball.artifactPath &&
      evidenceTarball?.sizeBytes === aggregateTarball.sizeBytes &&
      evidenceTarball?.sha256 === aggregateTarball.sha256;
  }
  const singleLockfile =
    packageManagerSummary.secondaryLockfiles.length === 0 &&
    audit.decisions.packageManager?.status === 'approved-single-lockfile';

  const expectedOpenBlockers = [
    ['clean-main-baseline', cleanMainCaptured],
    ['consumer-checkouts', consumerInventoriesCaptured],
    ['owner-assignments', ownersAssigned],
    ['decision-approvals', decisionApprovalsClosed],
    ['full-regression-baseline', fullRegressionCaptured],
    ['package-artifact-baseline', packageArtifactsCaptured],
    ['single-lockfile', singleLockfile],
  ]
    .filter(([, closed]) => !closed)
    .map(([id]) => id);
  sameStringSet(blockerIds, expectedOpenBlockers, 'Wave 0 readiness blockers');

  if (expectedOpenBlockers.length > 0) {
    assert(readiness?.wave0Gate === 'blocked', 'Open evidence gates require wave0Gate=blocked.');
    assert(audit.audit.status === 'wave-0-in-progress', 'Blocked gate must remain in progress.');
  } else {
    assert(readiness?.wave0Gate === 'ready', 'Closed evidence gates require wave0Gate=ready.');
    assert(audit.audit.status === 'wave-0-approved', 'Ready gate requires wave-0-approved status.');
    try {
      assert(gitOutput(['status', '--porcelain']) === '', 'Ready Wave 0 requires a clean worktree.');
      assert(gitOutput(['branch', '--show-current']) === 'main', 'Ready Wave 0 must run on main.');
      const headCommit = gitOutput(['rev-parse', 'HEAD']);
      assert(
        gitOutput(['rev-parse', 'main']) === headCommit,
        'Ready Wave 0 HEAD must equal local main.',
      );
      assert(
        gitOutput(['rev-parse', 'origin/main']) === headCommit,
        'Ready Wave 0 HEAD must equal origin/main.',
      );
      assert(
        gitOutput(['rev-parse', `${audit.baselines.cleanMain.tag}^{commit}`]) ===
          audit.baselines.cleanMain.commit,
        'Recorded baseline tag must resolve to the clean-main commit.',
      );
      gitOutput([
        'merge-base',
        '--is-ancestor',
        audit.baselines.cleanMain.commit,
        headCommit,
      ]);
      const allowedAttestationPaths = new Set(
        [
          auditPath,
          audit.baselines.fullCheck.evidencePath,
          audit.baselines.consumerMatrix.evidencePath,
          audit.baselines.packageArtifacts.evidencePath,
          ...products.map((entry) => entry.scanEvidence?.path),
          ...integrations.map((entry) => entry.scanEvidence?.path),
        ]
          .filter((value) => typeof value === 'string')
          .map(normalizePath),
      );
      const postBaselinePaths = gitOutput([
        'diff',
        '--name-only',
        `${audit.baselines.cleanMain.commit}..${headCommit}`,
      ])
        .split(/\r?\n/)
        .map(normalizePath)
        .filter(Boolean);
      const unexpectedPostBaselinePaths = postBaselinePaths.filter(
        (value) => !allowedAttestationPaths.has(value),
      );
      assert(
        unexpectedPostBaselinePaths.length === 0,
        `Only tracked Wave 0 attestation files may change after the baseline commit: ${unexpectedPostBaselinePaths.join(', ')}`,
      );
    } catch (error) {
      fail(`Unable to verify clean main/tag evidence: ${error.message}`);
    }
  }
  if (requireWave0 && expectedOpenBlockers.length > 0) {
    fail(`Wave 0 gate is blocked; close: ${expectedOpenBlockers.join(', ')}`);
  }
  return blockerIds;
}

async function main() {
  const [audit, schema] = await Promise.all([readJson(auditPath), readJson(schemaPath)]);
  validateTopLevelSchema(audit, schema);
  const packageById = validatePackageGraph(audit);
  const moduleSummary = await validateModuleOwnership(audit, packageById);
  const styleSummary = await validateStyles(audit, packageById);
  const assetSummary = await validateAssets(audit, packageById);
  await validateCompatibilitySurface(audit, moduleSummary, assetSummary);
  const consumerSummary = await validateConsumers(audit, packageById);
  const packageManagerSummary = await validatePackageManager(audit);
  const blockerIds = await validateReadiness(audit, consumerSummary, packageManagerSummary);

  if (failures.length > 0) {
    throw new Error(`LDS package migration audit failed:\n- ${failures.join('\n- ')}`);
  }

  console.log('LDS package migration audit summary:');
  console.log(
    `- ownership: ${moduleSummary.publicSourceModules} public source modules, ${moduleSummary.publicSymbols} public symbols, ${moduleSummary.classifiedModules} classified modules`,
  );
  console.log(
    `- styles: ${styleSummary.cssFiles} token CSS files, ${styleSummary.runtimeCustomProperties} runtime custom properties (${styleSummary.runtimeOnlyCustomProperties} not represented by source.json css fields)`,
  );
  console.log(`- assets: ${assetSummary.files} files across ${assetSummary.rules} non-overlapping rules`);
  console.log(
    `- consumers: ${consumerSummary.products} pinned products (${consumerSummary.unverifiedProducts} checkout-missing, ${consumerSummary.localSnapshotProducts} local-only, ${consumerSummary.preparedSnapshotProducts} prepared-untracked, ${consumerSummary.trackedSnapshotProducts} repository-tracked, ${consumerSummary.portableProducts} migrated-portable) and ${consumerSummary.integrations} LDS3D docs integration`,
  );
  console.log(
    `- package manager: ${packageManagerSummary.canonical}; secondary lockfiles: ${packageManagerSummary.secondaryLockfiles.join(', ') || 'none'}`,
  );
  console.log(`- Wave 0 gate: ${audit.audit.readiness.wave0Gate}`);
  if (blockerIds.length > 0) console.log(`  - blockers: ${blockerIds.join(', ')}`);
  console.log('LDS package migration audit integrity check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
