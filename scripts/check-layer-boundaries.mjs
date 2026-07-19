import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const componentsRoot = 'components';
const classificationPath = 'docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json';
const publicEntryPath = 'src/index.js';
const roboticsExternalSurfacePath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
const roboticsExternalPackage = '@lk-robotics/lds-robotics-ui';

const layers = ['core', 'theme', 'product', 'robotics'];
const layerSet = new Set(layers);
const allowedDependencies = {
  core: new Set(['core']),
  theme: new Set(['core', 'theme']),
  product: new Set(['core', 'product']),
  robotics: new Set(['core', 'product', 'robotics']),
};

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

async function readPublicExports(externalRoboticsExports) {
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
      if (statement.moduleSpecifier.text !== roboticsExternalPackage) {
        failures.push(
          `${sourceLocation(sourceFile, statement)}: export-star cannot be mapped to explicit public export ownership`,
        );
        continue;
      }
      for (const entry of externalRoboticsExports) {
        for (const name of entry.exports) {
          exports.push({ name, source: entry.source, location: sourceLocation(sourceFile, statement), external: true });
        }
      }
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

async function main() {
  const manifest = await readJson(classificationPath);
  const roboticsExternalSurface = await readJson(roboticsExternalSurfacePath);
  const externalRoboticsExports = roboticsExternalSurface.entries ?? [];
  if (roboticsExternalSurface.package?.name !== roboticsExternalPackage || externalRoboticsExports.length === 0) {
    throw new Error(`${roboticsExternalSurfacePath} must define the external Robotics public surface.`);
  }
  const componentModules = await collectModules(componentsRoot);
  const componentModuleSet = new Set(componentModules);
  const ownershipFailures = [];

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

  const { exports: publicExports, failures: publicEntryFailures } = await readPublicExports(externalRoboticsExports);
  ownershipFailures.push(...publicEntryFailures);
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

  if (ownershipFailures.length > 0) {
    throw new Error(formatFailures('LDS layer ownership check failed:', ownershipFailures));
  }

  const dependencyFailures = [];
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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
