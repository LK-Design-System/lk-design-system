import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { findNonCoreCorePrivateImports } from './check-layer-private-imports.mjs';

const root = process.cwd();
const componentsRoot = 'components';
const ownerAuthorityPath = 'docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json';
const ownerAuthority = JSON.parse(await readFile(path.join(root, ownerAuthorityPath), 'utf8'));
const deprecatedReexports = ownerAuthority.compatibilityProjections?.deprecatedPackageReexports;
const compatibilitySourceModules = new Set(
  (deprecatedReexports?.entries ?? []).map((entry) => entry.module?.replaceAll('\\', '/')).filter(Boolean),
);
const compatibilityFacadeProjectionByModule = new Map([
  ['components/overlay/anchored-panel-style.js', {
    specifier: '@lk-design-system/lds-core/platform',
    exports: ['anchoredPanelStyle'],
  }],
]);
const authorityLayers = Array.isArray(ownerAuthority.layers) ? ownerAuthority.layers : [];
const layers = authorityLayers.map((layer) => layer.id);
const layerSet = new Set(layers);
const allowedDependencies = Object.fromEntries(
  authorityLayers.map((layer) => [layer.id, new Set(layer.allowedDependencies ?? [])]),
);
const classificationPath = ownerAuthority.compatibilityProjections?.historicalProvenanceRegistry;
const publicEntryPath = ownerAuthority.compatibilityProjections?.aggregateEntry;
const roboticsAuthority = authorityLayers.find((layer) => layer.id === 'robotics');
const roboticsEntryPath = 'src/robotics.js';
const roboticsExternalSurfacePath = roboticsAuthority?.externalSurface;
const roboticsExternalPackage = roboticsAuthority?.package;

const assetExtensions = new Set([
  '.avif',
  '.bmp',
  '.css',
  '.csv',
  '.dae',
  '.eot',
  '.fbx',
  '.gif',
  '.glb',
  '.gltf',
  '.glsl',
  '.ico',
  '.jpeg',
  '.jpg',
  '.json',
  '.las',
  '.laz',
  '.less',
  '.md',
  '.mp3',
  '.mp4',
  '.obj',
  '.ogg',
  '.otf',
  '.pcd',
  '.pdf',
  '.ply',
  '.png',
  '.sass',
  '.scss',
  '.stl',
  '.svg',
  '.tsv',
  '.ttf',
  '.txt',
  '.wav',
  '.wasm',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
  '.xml',
  '.yaml',
  '.yml',
]);

function toPosix(value) {
  return value.replaceAll('\\', '/');
}

function toRepoRelative(absolutePath) {
  return toPosix(path.relative(root, absolutePath));
}

function normalizeManifestPath(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const normalized = path.posix.normalize(toPosix(value.trim()).replace(/^\.\//, ''));
  if (
    path.posix.isAbsolute(normalized) ||
    path.win32.isAbsolute(value) ||
    normalized === '..' ||
    normalized.startsWith('../')
  ) {
    return null;
  }
  return normalized;
}

function isJavaScriptModule(modulePath) {
  return modulePath.endsWith('.js') || modulePath.endsWith('.jsx');
}

function isComponentsModule(modulePath) {
  return modulePath.startsWith(`${componentsRoot}/`) && isJavaScriptModule(modulePath);
}

function formatFailures(heading, failures) {
  const sorted = [...new Set(failures)].sort((a, b) => a.localeCompare(b));
  return `${heading}\n${sorted.map((failure) => `- ${failure}`).join('\n')}`;
}

async function collectModules(directoryRelative, output = []) {
  const directory = path.join(root, directoryRelative);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = toPosix(path.join(directoryRelative, entry.name));
    if (entry.isDirectory()) {
      await collectModules(relative, output);
    } else if (entry.isFile() && isJavaScriptModule(relative)) {
      output.push(relative);
    }
  }
  return output.sort((a, b) => a.localeCompare(b));
}

async function collectFiles(directoryRelative, predicate, output = []) {
  const directory = path.join(root, directoryRelative);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = toPosix(path.join(directoryRelative, entry.name));
    if (entry.isDirectory()) {
      await collectFiles(relative, predicate, output);
    } else if (entry.isFile() && predicate(relative)) {
      output.push(relative);
    }
  }
  return output.sort((a, b) => a.localeCompare(b));
}

async function isFile(absolutePath) {
  try {
    return (await stat(absolutePath)).isFile();
  } catch {
    return false;
  }
}

function withoutQueryOrHash(specifier) {
  return specifier.split(/[?#]/, 1)[0];
}

async function resolveModuleSpecifier(importerPath, specifier) {
  if (!specifier.startsWith('.')) return { kind: 'external' };

  const cleanSpecifier = withoutQueryOrHash(specifier);
  const extension = path.posix.extname(cleanSpecifier).toLowerCase();
  if (assetExtensions.has(extension)) return { kind: 'asset' };
  if (extension && extension !== '.js' && extension !== '.jsx') {
    return {
      kind: 'error',
      message: `unsupported relative module type ${JSON.stringify(specifier)}`,
    };
  }

  const base = path.resolve(root, path.dirname(importerPath), cleanSpecifier);
  const candidates = extension
    ? [base]
    : [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')];

  for (const candidate of candidates) {
    if (!(await isFile(candidate))) continue;
    const relative = toRepoRelative(candidate);
    if (relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) {
      return {
        kind: 'error',
        message: `relative module ${JSON.stringify(specifier)} resolves outside the repository`,
      };
    }
    if (!isJavaScriptModule(relative)) {
      return {
        kind: 'error',
        message: `relative module ${JSON.stringify(specifier)} does not resolve to .js or .jsx`,
      };
    }
    return { kind: 'module', path: relative };
  }

  return {
    kind: 'error',
    message: `cannot resolve relative module ${JSON.stringify(specifier)}`,
  };
}

function parseJavaScript(modulePath, source) {
  const scriptKind = modulePath.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
  const sourceFile = ts.createSourceFile(
    modulePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  const failures = (sourceFile.parseDiagnostics || []).map((diagnostic) => {
    const position = sourceFile.getLineAndCharacterOfPosition(diagnostic.start || 0);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
    return `${modulePath}:${position.line + 1}:${position.character + 1}: ${message}`;
  });
  return { sourceFile, failures };
}

function sourceLocation(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${sourceFile.fileName}:${position.line + 1}`;
}

function collectDependencySpecifiers(sourceFile) {
  const dependencies = [];
  const failures = [];

  function addLiteral(moduleSpecifier, node, kind) {
    if (!moduleSpecifier || !ts.isStringLiteralLike(moduleSpecifier)) {
      failures.push(`${sourceLocation(sourceFile, node)}: ${kind} must use a string literal module path`);
      return;
    }
    dependencies.push({
      specifier: moduleSpecifier.text,
      location: sourceLocation(sourceFile, node),
      kind,
    });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      addLiteral(node.moduleSpecifier, node, 'import');
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      addLiteral(node.moduleSpecifier, node, 're-export');
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addLiteral(node.moduleReference.expression, node, 'import-equals require');
    } else if (ts.isCallExpression(node)) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      if (isDynamicImport || isRequire) {
        if (node.arguments.length !== 1) {
          failures.push(
            `${sourceLocation(sourceFile, node)}: ${isDynamicImport ? 'import()' : 'require()'} must have exactly one string literal argument`,
          );
        } else {
          addLiteral(
            node.arguments[0],
            node,
            isDynamicImport ? 'dynamic import()' : 'require()',
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { dependencies, failures };
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function readSource(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function extractStoryTitle(source, storyPath) {
  const match = source.match(
    /(?:^|\r?\n)\s*(?:const\s+meta\s*=\s*|export\s+default\s*)\{\s*(?:id:\s*(?:'[^']*'|"[^"]*"),\s*)?title:\s*(['"])(.*?)\1/,
  );
  return match ? match[2] : null;
}

async function validateLiveOwnerAuthority(componentModules) {
  const failures = [];
  const packageModuleOwnerRows = new Map();
  const requiredLayers = ['core', 'theme', 'product', 'robotics'];

  if (
    ownerAuthority.schemaVersion !== 1
    || ownerAuthority.kind !== 'lds-owner-authority-contract'
    || ownerAuthority.status !== 'active'
    || ownerAuthority.authority !== 'live'
  ) {
    failures.push(`${ownerAuthorityPath} must be the active schemaVersion 1 live owner authority.`);
  }
  if (new Set(layers).size !== layers.length || layers.some((layer) => typeof layer !== 'string')) {
    failures.push(`${ownerAuthorityPath} layer ids must be unique non-empty strings.`);
  }
  if (JSON.stringify([...layers].sort()) !== JSON.stringify([...requiredLayers].sort())) {
    failures.push(`${ownerAuthorityPath} layers must be ${requiredLayers.join(', ')}.`);
  }
  if (!classificationPath || !publicEntryPath || !roboticsExternalSurfacePath || !roboticsExternalPackage) {
    failures.push(`${ownerAuthorityPath} must name the compatibility projection and Robotics external surface.`);
  }

  const storyPrefixes = new Map();
  for (const layer of authorityLayers) {
    if (!Array.isArray(layer.allowedDependencies) || layer.allowedDependencies.length === 0) {
      failures.push(`${layer.id || '<missing layer>'}: allowedDependencies must be a non-empty array.`);
    }
    for (const dependency of layer.allowedDependencies ?? []) {
      if (!layerSet.has(dependency)) {
        failures.push(`${layer.id}: unknown allowed dependency ${JSON.stringify(dependency)}.`);
      }
    }
    if (typeof layer.storybookPrefix !== 'string' || layer.storybookPrefix.trim() === '') {
      failures.push(`${layer.id}: storybookPrefix must be a non-empty string.`);
    } else {
      const rows = storyPrefixes.get(layer.storybookPrefix) ?? [];
      rows.push(layer.id);
      storyPrefixes.set(layer.storybookPrefix, rows);
    }

    if (layer.externalSurface) {
      if (layer.id !== 'robotics' || layer.packageRoot || layer.moduleRoot || layer.tokenRoot) {
        failures.push(`${layer.id}: only Robotics may use an externalSurface instead of local package roots.`);
      }
      continue;
    }

    const requiredPaths = ['packageRoot', 'moduleRoot', 'publicEntry', 'tokenRoot', 'styleEntry'];
    for (const field of requiredPaths) {
      if (!normalizeManifestPath(layer[field])) failures.push(`${layer.id}: ${field} must be a repository-relative path.`);
    }
    if (requiredPaths.some((field) => !normalizeManifestPath(layer[field]))) continue;

    const packageManifestPath = `${normalizeManifestPath(layer.packageRoot)}/package.json`;
    const packageManifest = await readJson(packageManifestPath);
    if (packageManifest.name !== layer.package || packageManifest.lds?.layer !== layer.id) {
      failures.push(`${packageManifestPath} must declare ${layer.package} with lds.layer ${layer.id}.`);
    }

    const moduleRoot = normalizeManifestPath(layer.moduleRoot);
    const packageModules = await collectModules(moduleRoot);
    if (packageModules.length === 0) failures.push(`${layer.id}: ${moduleRoot} contains no JavaScript modules.`);
    for (const packageModule of packageModules) {
      const relative = packageModule.slice(`${moduleRoot}/`.length);
      const compatibilityPath = `${componentsRoot}/${relative}`;
      if (layer.id === deprecatedReexports?.sourceLayer && compatibilitySourceModules.has(compatibilityPath)) {
        continue;
      }
      const rows = packageModuleOwnerRows.get(compatibilityPath) ?? [];
      rows.push({ ownerLayer: layer.id, packageModule });
      packageModuleOwnerRows.set(compatibilityPath, rows);
    }
  }

  for (const [prefix, owners] of storyPrefixes) {
    if (owners.length !== 1) failures.push(`Storybook prefix ${JSON.stringify(prefix)} has ${owners.length} owners.`);
  }
  for (const modulePath of componentModules) {
    const rows = packageModuleOwnerRows.get(modulePath) ?? [];
    if (rows.length !== 1) {
      failures.push(`${modulePath}: live package projection must assign exactly one owner; found ${rows.map((row) => row.ownerLayer).join(', ') || 'none'}.`);
    }
  }
  for (const [modulePath, rows] of packageModuleOwnerRows) {
    if (!componentModules.includes(modulePath)) {
      failures.push(`${modulePath}: live package projection is stale (${rows.map((row) => row.packageModule).join(', ')}).`);
    }
  }

  const tokenRows = new Map();
  const tokenGroupIds = new Set();
  for (const group of ownerAuthority.tokenGroups ?? []) {
    if (typeof group?.id !== 'string' || group.id.trim() === '' || tokenGroupIds.has(group.id)) {
      failures.push(`Token group id must be unique and non-empty: ${JSON.stringify(group?.id)}.`);
    } else {
      tokenGroupIds.add(group.id);
    }
    if (!layerSet.has(group?.ownerLayer)) failures.push(`${group?.id || '<token group>'}: unknown ownerLayer ${JSON.stringify(group?.ownerLayer)}.`);
    if (!Array.isArray(group?.sources) || group.sources.length === 0) {
      failures.push(`${group?.id || '<token group>'}: sources must be a non-empty array.`);
      continue;
    }
    for (const source of group.sources) {
      const normalized = normalizeManifestPath(source);
      if (!normalized || !normalized.endsWith('.css')) {
        failures.push(`${group.id}: invalid token source ${JSON.stringify(source)}.`);
        continue;
      }
      const rows = tokenRows.get(normalized) ?? [];
      rows.push({ group: group.id, ownerLayer: group.ownerLayer });
      tokenRows.set(normalized, rows);
    }
    if (group.profileContract) {
      const profileContractPath = normalizeManifestPath(group.profileContract);
      if (!profileContractPath) {
        failures.push(`${group.id}: profileContract must be a repository-relative path.`);
      } else {
        const profileContract = await readJson(profileContractPath);
        if (profileContract.ownerLayer !== group.ownerLayer) {
          failures.push(`${group.id}: ${profileContractPath} ownerLayer must be ${group.ownerLayer}.`);
        }
      }
    }
  }

  let tokenSourceCount = 0;
  for (const layer of authorityLayers.filter((entry) => entry.tokenRoot)) {
    const tokenRoot = normalizeManifestPath(layer.tokenRoot);
    const actualSources = await collectFiles(tokenRoot, (file) => file.endsWith('.css'));
    tokenSourceCount += actualSources.length;
    const actualSet = new Set(actualSources);
    for (const source of actualSources) {
      const rows = tokenRows.get(source) ?? [];
      if (rows.length !== 1 || rows[0]?.ownerLayer !== layer.id) {
        failures.push(`${source}: token source must have exactly one ${layer.id} owner group; found ${rows.map((row) => `${row.group}=${row.ownerLayer}`).join(', ') || 'none'}.`);
      }
    }
    for (const [source, rows] of tokenRows) {
      if (rows.some((row) => row.ownerLayer === layer.id) && !actualSet.has(source)) {
        failures.push(`${source}: ${layer.id} token group source is stale or outside ${tokenRoot}.`);
      }
    }

    const styleEntry = normalizeManifestPath(layer.styleEntry);
    const styleSource = await readSource(styleEntry);
    const imports = [...styleSource.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)]
      .map((match) => path.posix.normalize(path.posix.join(path.posix.dirname(styleEntry), match[1])));
    const duplicateImports = imports.filter((source, index) => imports.indexOf(source) !== index);
    if (duplicateImports.length > 0) {
      failures.push(`${styleEntry}: duplicate token imports ${[...new Set(duplicateImports)].join(', ')}.`);
    }
    const missingImports = actualSources.filter((source) => !imports.includes(source));
    const staleImports = imports.filter((source) => !actualSet.has(source));
    if (missingImports.length > 0 || staleImports.length > 0) {
      failures.push(`${styleEntry}: token imports must equal the ${layer.id} token group (missing ${missingImports.join(', ') || 'none'}; stale ${staleImports.join(', ') || 'none'}).`);
    }
  }
  for (const [source, rows] of tokenRows) {
    if (rows.length !== 1) failures.push(`${source}: token source is assigned to ${rows.length} groups.`);
  }

  const storyRoot = normalizeManifestPath(ownerAuthority.storybook?.sourceRoot);
  const storyFiles = storyRoot
    ? await collectFiles(storyRoot, (file) => file.endsWith('.stories.jsx'))
    : [];
  if (!storyRoot || storyFiles.length === 0) failures.push(`${ownerAuthorityPath} must identify local Storybook sources.`);
  const exceptionRows = new Map();
  for (const exception of ownerAuthority.storybook?.ownerExceptions ?? []) {
    const source = normalizeManifestPath(exception?.source);
    if (!source) {
      failures.push(`Storybook owner exception has an invalid source: ${JSON.stringify(exception?.source)}.`);
      continue;
    }
    const rows = exceptionRows.get(source) ?? [];
    rows.push(exception);
    exceptionRows.set(source, rows);
  }
  for (const storyFile of storyFiles) {
    const title = extractStoryTitle(await readSource(storyFile), storyFile);
    if (!title) {
      failures.push(`${storyFile}: canonical Storybook page is missing a literal meta title.`);
      continue;
    }
    const matchedOwners = authorityLayers
      .filter((layer) => title.startsWith(`${layer.storybookPrefix}/`))
      .map((layer) => layer.id);
    const exceptions = exceptionRows.get(storyFile) ?? [];
    if (matchedOwners.length === 1 && exceptions.length === 0) continue;
    if (
      matchedOwners.length === 0
      && exceptions.length === 1
      && exceptions[0].title === title
      && layerSet.has(exceptions[0].ownerLayer)
      && typeof exceptions[0].reason === 'string'
      && exceptions[0].reason.trim().length >= 24
    ) {
      continue;
    }
    failures.push(`${storyFile}: canonical Storybook page must have exactly one owner; title ${JSON.stringify(title)} maps to ${matchedOwners.join(', ') || 'none'} and has ${exceptions.length} exception rows.`);
  }
  for (const [source, rows] of exceptionRows) {
    if (rows.length !== 1) failures.push(`${source}: Storybook owner exception is registered ${rows.length} times.`);
    if (!storyFiles.includes(source)) failures.push(`${source}: Storybook owner exception references a missing local story.`);
  }

  return {
    failures,
    packageModuleOwners: new Map(
      [...packageModuleOwnerRows]
        .filter(([, rows]) => rows.length === 1)
        .map(([modulePath, rows]) => [modulePath, rows[0].ownerLayer]),
    ),
    storyCount: storyFiles.length,
    tokenSourceCount,
  };
}

async function readPublicExports() {
  const source = await readSource(publicEntryPath);
  const { sourceFile, failures: parseFailures } = parseJavaScript(publicEntryPath, source);
  const failures = [...parseFailures];
  const exports = [];

  for (const statement of sourceFile.statements) {
    if (
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression)
    ) {
      continue;
    }
    if (!ts.isExportDeclaration(statement)) {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: public entry statements must be component re-exports`,
      );
      continue;
    }
    if (!statement.moduleSpecifier || !ts.isStringLiteralLike(statement.moduleSpecifier)) {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: public export must re-export from a string literal module path`,
      );
      continue;
    }
    if (!statement.exportClause) {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: main public entry must not use export-star`,
      );
      continue;
    }

    const resolution = await resolveModuleSpecifier(publicEntryPath, statement.moduleSpecifier.text);
    if (resolution.kind !== 'module') {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: public re-export ${JSON.stringify(statement.moduleSpecifier.text)} ${resolution.message || `is ${resolution.kind} and not a component module`}`,
      );
      continue;
    }
    if (!isComponentsModule(resolution.path)) {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: public re-export resolves outside components/: ${resolution.path}`,
      );
      continue;
    }

    if (ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        exports.push({
          name: element.name.text,
          source: resolution.path,
          location: sourceLocation(sourceFile, element),
        });
      }
    } else if (ts.isNamespaceExport(statement.exportClause)) {
      exports.push({
        name: statement.exportClause.name.text,
        source: resolution.path,
        location: sourceLocation(sourceFile, statement.exportClause),
      });
    } else {
      failures.push(
        `${sourceLocation(sourceFile, statement)}: unsupported public re-export syntax`,
      );
    }
  }

  return { exports, failures };
}

function findLayerCycles(layerGraph) {
  const state = new Map(layers.map((layer) => [layer, 'unvisited']));
  const stack = [];
  const cycleKeys = new Set();
  const cycles = [];

  function canonicalize(cycle) {
    const openCycle = cycle.slice(0, -1);
    const rotations = openCycle.map((_, index) => [
      ...openCycle.slice(index),
      ...openCycle.slice(0, index),
    ]);
    const canonical = rotations
      .map((rotation) => rotation.join(' -> '))
      .sort((a, b) => a.localeCompare(b))[0];
    return { key: canonical, label: `${canonical} -> ${canonical.split(' -> ')[0]}` };
  }

  function visit(layer) {
    state.set(layer, 'visiting');
    stack.push(layer);
    for (const dependency of layerGraph.get(layer) || []) {
      if (state.get(dependency) === 'unvisited') {
        visit(dependency);
      } else if (state.get(dependency) === 'visiting') {
        const start = stack.lastIndexOf(dependency);
        const canonical = canonicalize([...stack.slice(start), dependency]);
        if (!cycleKeys.has(canonical.key)) {
          cycleKeys.add(canonical.key);
          cycles.push(canonical.label);
        }
      }
    }
    stack.pop();
    state.set(layer, 'visited');
  }

  for (const layer of layers) {
    if (state.get(layer) === 'unvisited') visit(layer);
  }
  return cycles.sort((a, b) => a.localeCompare(b));
}

async function validateDeprecatedPackageReexports(manifest, liveAuthority) {
  const failures = [];
  const projection = deprecatedReexports;
  const decisionPath = normalizeManifestPath(ownerAuthority.compatibilityProjections?.ownerApiDecisionRegister);
  if (!projection || !decisionPath) {
    return [`${ownerAuthorityPath} must define the R3B decision register and deprecated package re-exports.`];
  }

  const layerById = new Map(authorityLayers.map((layer) => [layer.id, layer]));
  const sourceLayer = layerById.get(projection.sourceLayer);
  const targetLayer = layerById.get(projection.targetLayer);
  if (!sourceLayer?.packageRoot || !targetLayer?.packageRoot || sourceLayer.id === targetLayer.id) {
    failures.push(`${projection.id || '<compatibility projection>'}: sourceLayer and targetLayer must name distinct local packages.`);
    return failures;
  }
  if (projection.status !== 'active' || projection.supportWindow !== 'all-0.1.x-releases' || projection.earliestRemoval !== '0.2.0') {
    failures.push(`${projection.id}: compatibility must remain active for every 0.1.x release and cannot be removed before 0.2.0.`);
  }
  if (typeof projection.removalGate !== 'string' || projection.removalGate.trim().length < 24) {
    failures.push(`${projection.id}: removalGate must name the consumer and release evidence required for removal.`);
  }
  if (!allowedDependencies[sourceLayer.id]?.has(targetLayer.id)) {
    failures.push(`${projection.id}: ${sourceLayer.id} must allow a dependency on ${targetLayer.id}.`);
  }

  const sourceEntry = await readSource(normalizeManifestPath(sourceLayer.publicEntry));
  const classifiedOwnerByExport = new Map(
    (manifest.groups ?? []).flatMap((group) => (group.exports ?? []).map((name) => [name, group.ownerLayer])),
  );
  const seenModules = new Set();
  const movedSubjects = new Set();
  for (const [index, entry] of (projection.entries ?? []).entries()) {
    const modulePath = normalizeManifestPath(entry?.module);
    if (!modulePath || !modulePath.startsWith('components/') || !/\.(jsx|js)$/.test(modulePath)) {
      failures.push(`${projection.id}.entries[${index}]: module must name a canonical components/ JavaScript module.`);
      continue;
    }
    if (seenModules.has(modulePath)) failures.push(`${projection.id}: duplicate compatibility module ${modulePath}.`);
    seenModules.add(modulePath);
    if (!liveAuthority.packageModuleOwners.has(modulePath) || liveAuthority.packageModuleOwners.get(modulePath) !== targetLayer.id) {
      failures.push(`${modulePath}: compatibility target must be live-owned by ${targetLayer.id}.`);
    }
    const wrapperPath = `${normalizeManifestPath(sourceLayer.moduleRoot)}/${modulePath.slice('components/'.length)}`;
    const declarationPath = wrapperPath.replace(/\.(jsx|js)$/, '.d.ts');
    const wrapper = await readSource(wrapperPath).catch(() => null);
    const declaration = await readSource(declarationPath).catch(() => null);
    const facadeProjection = compatibilityFacadeProjectionByModule.get(modulePath);
    const targetSpecifier = facadeProjection?.specifier
      ?? `${targetLayer.package}/${modulePath.replace(/\.(jsx|js)$/, '')}`;
    if (!wrapper || !wrapper.includes('@deprecated') || !wrapper.includes(targetSpecifier)) {
      failures.push(`${wrapperPath}: generated compatibility wrapper must be deprecated and re-export ${targetSpecifier}.`);
    }
    if (!declaration || !declaration.includes('@deprecated') || !declaration.includes(targetSpecifier)) {
      failures.push(`${declarationPath}: generated compatibility declaration must be deprecated and re-export ${targetSpecifier}.`);
    }
    if (facadeProjection) {
      const exactProjection = `export { ${facadeProjection.exports.join(', ')} } from '${targetSpecifier}';`;
      if (!wrapper?.includes(exactProjection) || /export\s+\*/.test(wrapper)) {
        failures.push(`${wrapperPath}: compatibility facade projection must be exactly ${exactProjection}`);
      }
      if (!declaration?.includes(exactProjection) || /export\s+\*/.test(declaration)) {
        failures.push(`${declarationPath}: compatibility facade projection must be exactly ${exactProjection}`);
      }
    }
    if (!Array.isArray(entry.exports)) {
      failures.push(`${modulePath}: compatibility exports must be an array.`);
      continue;
    }
    for (const exportName of entry.exports) {
      movedSubjects.add(exportName);
      if (classifiedOwnerByExport.get(exportName) !== targetLayer.id) {
        failures.push(`${exportName}: compatibility export must be classified to ${targetLayer.id}.`);
      }
      if (!sourceEntry.includes(`export { ${entry.exports.join(', ')} } from './${modulePath}';`)) {
        failures.push(`${sourceLayer.publicEntry}: missing deprecated root compatibility re-export for ${entry.exports.join(', ')}.`);
        break;
      }
    }
    if (entry.exports.length === 0) movedSubjects.add(path.posix.basename(modulePath).replace(/\.(jsx|js)$/, ''));
  }
  if (seenModules.size === 0) failures.push(`${projection.id}: compatibility entries cannot be empty.`);

  const decisionRegister = await readJson(decisionPath).catch(() => null);
  const schemaPath = decisionRegister?.$schema?.startsWith('./')
    ? path.posix.join(path.posix.dirname(decisionPath), decisionRegister.$schema.slice(2))
    : null;
  const decisionSchema = schemaPath ? await readJson(schemaPath).catch(() => null) : null;
  if (!decisionRegister || !decisionSchema) {
    failures.push(`${decisionPath}: decision register and its relative schema must be readable.`);
    return failures;
  }
  try {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    addFormats(ajv);
    const validate = ajv.compile(decisionSchema);
    if (!validate(decisionRegister)) {
      failures.push(`${decisionPath}: schema validation failed (${(validate.errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ')}).`);
    }
  } catch (error) {
    failures.push(`${decisionPath}: schema could not be compiled (${error.message}).`);
  }
  if (decisionRegister.supportWindow?.policy !== projection.supportWindow || decisionRegister.supportWindow?.earliestRemoval !== projection.earliestRemoval) {
    failures.push(`${decisionPath}: support window must match ${ownerAuthorityPath}.`);
  }
  const decisions = decisionRegister.decisions ?? [];
  const decisionIds = decisions.map((decision) => decision.id);
  if (new Set(decisionIds).size !== decisionIds.length) failures.push(`${decisionPath}: decision ids must be unique.`);
  const moveNowSubjects = new Set(
    decisions.filter((decision) => decision.decision === 'move-now').flatMap((decision) => decision.subjects ?? []),
  );
  for (const subject of movedSubjects) {
    if (!moveNowSubjects.has(subject)) failures.push(`${decisionPath}: moved compatibility subject ${subject} lacks a move-now decision.`);
  }
  for (const decision of decisions) {
    if (decision.decision === 'defer' && (!decision.reviewTrigger || !decision.nextReview)) {
      failures.push(`${decision.id}: deferred decisions require a reviewTrigger and nextReview.`);
    }
    for (const subject of decision.subjects ?? []) {
      const classifiedOwner = classifiedOwnerByExport.get(subject);
      if (classifiedOwner && classifiedOwner !== decision.ownerLayer) {
        failures.push(`${decision.id}: ${subject} decision owner ${decision.ownerLayer} differs from classified owner ${classifiedOwner}.`);
      }
    }
  }
  return failures;
}

async function main() {
  const manifest = await readJson(classificationPath);
  const roboticsExternalSurface = await readJson(roboticsExternalSurfacePath);
  const externalRoboticsExports = roboticsExternalSurface.entries ?? [];
  if (roboticsExternalSurface.package?.name !== roboticsExternalPackage || externalRoboticsExports.length === 0) {
    throw new Error(`${roboticsExternalSurfacePath} must define the external Robotics public surface.`);
  }
  const roboticsEntry = await readSource(roboticsEntryPath);
  if (!new RegExp(`export\\s+\\*\\s+from\\s+['"]${roboticsExternalPackage.replace('/', '\\/')}['"]`).test(roboticsEntry)) {
    throw new Error(`${roboticsEntryPath} must re-export ${roboticsExternalPackage}.`);
  }
  const componentModules = await collectModules(componentsRoot);
  const componentModuleSet = new Set(componentModules);
  const ownershipFailures = [];
  const liveAuthority = await validateLiveOwnerAuthority(componentModules);
  ownershipFailures.push(...liveAuthority.failures);
  ownershipFailures.push(...await validateDeprecatedPackageReexports(manifest, liveAuthority));

  if (!Array.isArray(manifest.groups)) {
    throw new Error(`${classificationPath} must define groups[].`);
  }
  if (!Array.isArray(manifest.internalModules)) {
    ownershipFailures.push(`${classificationPath} must define internalModules[].`);
  }
  if (manifest.source?.entrypoint !== publicEntryPath) {
    ownershipFailures.push(
      `${classificationPath} source.entrypoint must be ${JSON.stringify(publicEntryPath)}.`,
    );
  }

  const classifiedExports = new Map();
  for (const [groupIndex, group] of manifest.groups.entries()) {
    const groupLabel = group?.name || `groups[${groupIndex}]`;
    if (!layerSet.has(group?.ownerLayer)) {
      ownershipFailures.push(
        `${groupLabel}: ownerLayer must be one of ${layers.join(', ')}; found ${JSON.stringify(group?.ownerLayer)}`,
      );
    }
    if (!Array.isArray(group?.exports)) {
      ownershipFailures.push(`${groupLabel}: exports must be an array.`);
      continue;
    }
    for (const exportName of group.exports) {
      if (typeof exportName !== 'string' || exportName.trim() === '') {
        ownershipFailures.push(`${groupLabel}: export names must be non-empty strings.`);
        continue;
      }
      const rows = classifiedExports.get(exportName) || [];
      rows.push({ ownerLayer: group.ownerLayer, group: groupLabel });
      classifiedExports.set(exportName, rows);
    }
  }

  const { exports: publicExports, failures: publicEntryFailures } = await readPublicExports();
  ownershipFailures.push(...publicEntryFailures);
  for (const entry of externalRoboticsExports) {
    for (const name of entry.exports) {
      publicExports.push({
        name,
        source: entry.source,
        location: roboticsEntryPath,
        external: true,
      });
    }
  }
  const indexedExports = new Map();
  for (const publicExport of publicExports) {
    const rows = indexedExports.get(publicExport.name) || [];
    rows.push(publicExport);
    indexedExports.set(publicExport.name, rows);
  }

  for (const [exportName, rows] of indexedExports) {
    if (rows.length > 1) {
      ownershipFailures.push(
        `${publicEntryPath}: public export ${exportName} is re-exported ${rows.length} times (${rows.map((row) => row.location).join(', ')})`,
      );
    }
    const classifications = classifiedExports.get(exportName) || [];
    if (classifications.length === 0) {
      ownershipFailures.push(`${exportName}: public export is missing an ownerLayer classification.`);
    } else if (classifications.length > 1) {
      ownershipFailures.push(
        `${exportName}: public export is classified ${classifications.length} times (${classifications.map((row) => row.group).join(', ')})`,
      );
    } else {
      const physicalOwners = rows.map((row) => (
        row.external ? 'robotics' : liveAuthority.packageModuleOwners.get(row.source)
      )).filter(Boolean);
      const uniquePhysicalOwners = [...new Set(physicalOwners)];
      if (uniquePhysicalOwners.length !== 1) {
        ownershipFailures.push(`${exportName}: live package surface must resolve exactly one owner; found ${uniquePhysicalOwners.join(', ') || 'none'}.`);
      } else if (classifications[0].ownerLayer !== uniquePhysicalOwners[0]) {
        ownershipFailures.push(
          `${exportName}: historical provenance projection says ${classifications[0].ownerLayer}, but live package owner is ${uniquePhysicalOwners[0]}.`,
        );
      }
    }
  }
  for (const [exportName, rows] of classifiedExports) {
    if (!indexedExports.has(exportName)) {
      ownershipFailures.push(
        `${exportName}: stale export classification (${rows.map((row) => row.group).join(', ')}) is not present in ${publicEntryPath}.`,
      );
    }
  }

  const publicSources = new Map();
  for (const publicExport of publicExports) {
    if (publicExport.external) continue;
    const classifications = classifiedExports.get(publicExport.name) || [];
    if (classifications.length !== 1 || !layerSet.has(classifications[0].ownerLayer)) continue;
    const sourceRows = publicSources.get(publicExport.source) || [];
    sourceRows.push({
      exportName: publicExport.name,
      ownerLayer: classifications[0].ownerLayer,
    });
    publicSources.set(publicExport.source, sourceRows);
  }

  const moduleOwners = new Map();
  for (const [source, rows] of publicSources) {
    const owners = [...new Set(rows.map((row) => row.ownerLayer))];
    if (owners.length !== 1) {
      ownershipFailures.push(
        `${source}: public exports assign multiple owners (${rows.map((row) => `${row.exportName}=${row.ownerLayer}`).join(', ')})`,
      );
      continue;
    }
    const liveOwner = liveAuthority.packageModuleOwners.get(source);
    if (liveOwner !== owners[0]) {
      ownershipFailures.push(`${source}: historical provenance projection says ${owners[0]}, but live package owner is ${liveOwner || 'missing'}.`);
      continue;
    }
    moduleOwners.set(source, owners[0]);
  }

  const internalPathRows = new Map();
  const internalModules = Array.isArray(manifest.internalModules) ? manifest.internalModules : [];
  for (const [index, row] of internalModules.entries()) {
    const modulePath = normalizeManifestPath(row?.path);
    if (!modulePath) {
      ownershipFailures.push(`internalModules[${index}]: path must be a repository-relative path.`);
      continue;
    }
    if (!layerSet.has(row?.ownerLayer)) {
      ownershipFailures.push(
        `${modulePath}: internal ownerLayer must be one of ${layers.join(', ')}; found ${JSON.stringify(row?.ownerLayer)}`,
      );
    }
    const rows = internalPathRows.get(modulePath) || [];
    rows.push(row);
    internalPathRows.set(modulePath, rows);
  }

  for (const [modulePath, rows] of internalPathRows) {
    if (rows.length > 1) {
      ownershipFailures.push(`${modulePath}: internal module is classified ${rows.length} times.`);
      continue;
    }
    if (!componentModuleSet.has(modulePath)) {
      if (rows[0].ownerLayer === 'robotics') continue;
      ownershipFailures.push(`${modulePath}: stale internal module classification does not match a components/ .js or .jsx file.`);
      continue;
    }
    if (moduleOwners.has(modulePath)) {
      ownershipFailures.push(`${modulePath}: module is classified as both public and internal.`);
      continue;
    }
    const liveOwner = liveAuthority.packageModuleOwners.get(modulePath);
    if (liveOwner !== rows[0].ownerLayer) {
      ownershipFailures.push(`${modulePath}: historical internal projection says ${rows[0].ownerLayer}, but live package owner is ${liveOwner || 'missing'}.`);
      continue;
    }
    if (layerSet.has(rows[0].ownerLayer)) moduleOwners.set(modulePath, rows[0].ownerLayer);
  }

  for (const modulePath of componentModules) {
    if (!moduleOwners.has(modulePath)) {
      ownershipFailures.push(`${modulePath}: component module is missing exactly one owner classification.`);
    }
  }
  for (const modulePath of moduleOwners.keys()) {
    if (!componentModuleSet.has(modulePath)) {
      ownershipFailures.push(`${modulePath}: owner classification is stale; component module does not exist.`);
    }
  }

  const liveExportOwners = new Map();
  for (const [exportName, rows] of indexedExports) {
    const owners = [...new Set(rows.map((row) => (
      row.external ? 'robotics' : liveAuthority.packageModuleOwners.get(row.source)
    )).filter(Boolean))];
    if (owners.length === 1) liveExportOwners.set(exportName, owners[0]);
  }
  const requiredDomainDecisions = [
    'generic-command-primitives',
    'generic-navigation-input-and-overlay-primitives',
    'generic-progress-and-measurement-primitives',
    'application-navigation',
    'workspace-command-chrome',
    'renderer-neutral-telemetry',
    'renderer-neutral-equipment',
    'renderer-neutral-viewer',
    'robotics-command-and-status',
    'robotics-spatial-navigation',
  ];
  const domainDecisionIds = new Set();
  for (const decision of ownerAuthority.domainDecisions ?? []) {
    if (typeof decision?.id !== 'string' || decision.id.trim() === '' || domainDecisionIds.has(decision.id)) {
      ownershipFailures.push(`Domain decision id must be unique and non-empty: ${JSON.stringify(decision?.id)}.`);
      continue;
    }
    domainDecisionIds.add(decision.id);
    if (!layerSet.has(decision.ownerLayer)) {
      ownershipFailures.push(`${decision.id}: unknown ownerLayer ${JSON.stringify(decision.ownerLayer)}.`);
    }
    if (!Array.isArray(decision.representativePublicExports) || decision.representativePublicExports.length === 0) {
      ownershipFailures.push(`${decision.id}: representativePublicExports must be a non-empty array.`);
      continue;
    }
    const seenExports = new Set();
    for (const exportName of decision.representativePublicExports) {
      if (seenExports.has(exportName)) ownershipFailures.push(`${decision.id}: duplicate representative export ${exportName}.`);
      seenExports.add(exportName);
      const liveOwner = liveExportOwners.get(exportName);
      if (liveOwner !== decision.ownerLayer) {
        ownershipFailures.push(`${decision.id}: ${exportName} must be owned by ${decision.ownerLayer}; live package owner is ${liveOwner || 'missing'}.`);
      }
    }
    if (typeof decision.owns !== 'string' || decision.owns.trim().length < 24) {
      ownershipFailures.push(`${decision.id}: owns must state the owned responsibility.`);
    }
    if (typeof decision.excludes !== 'string' || decision.excludes.trim().length < 24) {
      ownershipFailures.push(`${decision.id}: excludes must state the non-owned responsibility.`);
    }
  }
  for (const decisionId of requiredDomainDecisions) {
    if (!domainDecisionIds.has(decisionId)) ownershipFailures.push(`${ownerAuthorityPath} is missing required domain decision ${decisionId}.`);
  }

  if (ownershipFailures.length > 0) {
    throw new Error(formatFailures('LDS layer ownership check failed:', ownershipFailures));
  }

  const dependencyFailures = [];
  const privateImportFindings = await findNonCoreCorePrivateImports(root);
  for (const finding of privateImportFindings) {
    dependencyFailures.push(
      `${finding.file}:${finding.line}:${finding.column}: non-Core packages must use a supported Core subpath instead of ${JSON.stringify(finding.specifier)}.`,
    );
  }
  const moduleEdges = new Map(componentModules.map((modulePath) => [modulePath, new Set()]));

  for (const modulePath of componentModules) {
    const source = await readSource(modulePath);
    const { sourceFile, failures: parseFailures } = parseJavaScript(modulePath, source);
    dependencyFailures.push(...parseFailures);
    const { dependencies, failures } = collectDependencySpecifiers(sourceFile);
    dependencyFailures.push(...failures);

    for (const dependency of dependencies) {
      const resolution = await resolveModuleSpecifier(modulePath, dependency.specifier);
      if (resolution.kind === 'external' || resolution.kind === 'asset') continue;
      if (resolution.kind === 'error') {
        dependencyFailures.push(`${dependency.location}: ${resolution.message}`);
        continue;
      }
      if (!componentModuleSet.has(resolution.path)) {
        dependencyFailures.push(
          `${dependency.location}: relative JavaScript dependency resolves outside the classified components/ graph: ${resolution.path}`,
        );
        continue;
      }
      moduleEdges.get(modulePath).add(resolution.path);
    }
  }

  const layerGraph = new Map(layers.map((layer) => [layer, new Set()]));
  const edgeCounts = new Map(layers.map((layer) => [layer, 0]));
  const layerPairCounts = new Map();

  for (const [source, targets] of moduleEdges) {
    const sourceLayer = moduleOwners.get(source);
    for (const target of targets) {
      const targetLayer = moduleOwners.get(target);
      edgeCounts.set(sourceLayer, edgeCounts.get(sourceLayer) + 1);
      const pair = `${sourceLayer} -> ${targetLayer}`;
      layerPairCounts.set(pair, (layerPairCounts.get(pair) || 0) + 1);
      if (sourceLayer !== targetLayer) layerGraph.get(sourceLayer).add(targetLayer);
      if (!allowedDependencies[sourceLayer].has(targetLayer)) {
        dependencyFailures.push(
          `${source} (${sourceLayer}) -> ${target} (${targetLayer}) is not an allowed layer dependency.`,
        );
      }
    }
  }

  for (const cycle of findLayerCycles(layerGraph)) {
    dependencyFailures.push(`layer dependency cycle detected: ${cycle}`);
  }

  if (dependencyFailures.length > 0) {
    throw new Error(formatFailures('LDS layer dependency check failed:', dependencyFailures));
  }

  const moduleCounts = new Map(layers.map((layer) => [layer, 0]));
  for (const ownerLayer of moduleOwners.values()) {
    moduleCounts.set(ownerLayer, moduleCounts.get(ownerLayer) + 1);
  }

  console.log('LDS layer boundary summary:');
  for (const layer of layers) {
    console.log(
      `- ${layer}: ${moduleCounts.get(layer)} modules, ${edgeCounts.get(layer)} internal JavaScript edges`,
    );
  }
  const crossLayerPairs = [...layerPairCounts.entries()]
    .filter(([pair]) => {
      const [sourceLayer, targetLayer] = pair.split(' -> ');
      return sourceLayer !== targetLayer;
    })
    .sort(([a], [b]) => a.localeCompare(b));
  if (crossLayerPairs.length > 0) {
    console.log('- cross-layer edges:');
    for (const [pair, count] of crossLayerPairs) console.log(`  - ${pair}: ${count}`);
  } else {
    console.log('- cross-layer edges: none');
  }

  const totalEdges = [...moduleEdges.values()].reduce((sum, targets) => sum + targets.size, 0);
  console.log(
    `LDS layer boundary check passed: ${componentModules.length} modules and ${totalEdges} internal JavaScript edges are classified and valid.`,
  );
  console.log(
    `Validated live owner authority: ${liveAuthority.tokenSourceCount} token sources, ${liveAuthority.storyCount} canonical Storybook pages and ${domainDecisionIds.size} domain boundaries have exactly one owner.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
