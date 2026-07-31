import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstat, readFile, readlink, realpath } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const aggregatePackage = '@lk-design-system/design-system-core';
const sourceExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.less',
  '.mdx',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
]);
const packageOrder = ['core', 'theme', 'product', 'robotics-ui'];

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) throw new Error(`Unexpected argument: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}`);
    result[argument.slice(2)] = value;
    index += 1;
  }
  return result;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function git(checkout, args) {
  return execFileSync(
    'git',
    ['-c', `safe.directory=${normalizePath(checkout)}`, '-C', checkout, ...args],
    {
      encoding: 'utf8',
      maxBuffer: 100 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  ).trim();
}

function lineNumber(source, index) {
  let line = 1;
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source.charCodeAt(cursor) === 10) line += 1;
  }
  return line;
}

function importSpecifiers(source) {
  const patterns = [
    ['esm-from', /\bfrom\s*['"]([^'"]+)['"]/g],
    ['esm-side-effect', /\bimport\s*['"]([^'"]+)['"]/g],
    ['dynamic-import', /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g],
    ['cjs-require', /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g],
    ['css-import', /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g],
  ];
  const matches = [];
  const seen = new Set();
  for (const [kind, pattern] of patterns) {
    for (const match of source.matchAll(pattern)) {
      const key = `${match.index}|${match[1]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ kind, specifier: match[1], index: match.index });
    }
  }
  return matches;
}

function parseStatus(raw) {
  const chunks = raw.split('\0').filter(Boolean);
  const entries = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const row = chunks[index];
    const status = row.slice(0, 2);
    const entry = { status, path: normalizePath(row.slice(3)) };
    if (status.includes('R') || status.includes('C')) {
      entry.originalPath = normalizePath(chunks[index + 1]);
      index += 1;
    }
    entries.push(entry);
  }
  return entries;
}

async function worktreeInventory(checkout) {
  const statusRaw = git(checkout, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  const entries = parseStatus(statusRaw);
  const contentRows = [];
  for (const entry of entries) {
    const absolutePath = path.join(checkout, entry.path);
    try {
      const info = await lstat(absolutePath);
      if (info.isFile()) {
        const bytes = await readFile(absolutePath);
        contentRows.push(`${entry.status}|${entry.path}|file|${bytes.length}|${sha256(bytes)}`);
      } else if (info.isSymbolicLink()) {
        contentRows.push(`${entry.status}|${entry.path}|symlink|${await readlink(absolutePath)}`);
      } else {
        contentRows.push(`${entry.status}|${entry.path}|other`);
      }
    } catch {
      contentRows.push(`${entry.status}|${entry.path}|missing`);
    }
  }
  contentRows.sort((left, right) => left.localeCompare(right));
  return {
    dirty: entries.length > 0,
    trackedChanges: entries.filter((entry) => entry.status !== '??').length,
    untrackedPaths: entries.filter((entry) => entry.status === '??').length,
    sha256: sha256(`${statusRaw}\n${contentRows.join('\n')}\n`),
    untrackedFiles: entries
      .filter((entry) => entry.status === '??')
      .map((entry) => entry.path),
  };
}

function parseLayerReexports(filePath, source, packageId, symbolTargets, specifierTargets) {
  const pattern = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;/g;
  for (const match of source.matchAll(pattern)) {
    const modulePath = normalizePath(
      path.relative(root, path.resolve(root, path.dirname(filePath), match[2])),
    ).replace(/\.(?:js|jsx)$/, '');
    specifierTargets.set(`${aggregatePackage}/${modulePath}`, packageId);
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).at(-1)?.trim();
      if (name) symbolTargets.set(name, packageId);
    }
  }
}

async function buildOwnershipMaps() {
  const symbolTargets = new Map();
  const specifierTargets = new Map();
  const layers = [
    ['src/core.js', 'core'],
    ['src/theme.js', 'theme'],
    ['src/product.js', 'product'],
    ['src/robotics.js', 'robotics-ui'],
  ];
  for (const [file, packageId] of layers) {
    parseLayerReexports(
      file,
      await readFile(path.join(root, file), 'utf8'),
      packageId,
      symbolTargets,
      specifierTargets,
    );
  }
  return { symbolTargets, specifierTargets };
}

function countByPackage(items, getPackageId) {
  const counts = Object.fromEntries(packageOrder.map((packageId) => [packageId, 0]));
  for (const item of items) {
    const packageId = getPackageId(item);
    if (!packageOrder.includes(packageId)) throw new Error(`Unknown package target: ${packageId}`);
    counts[packageId] += 1;
  }
  return Object.fromEntries(Object.entries(counts).filter(([, count]) => count > 0));
}

function rootBindings(source, file, symbolTargets) {
  const escapedPackage = aggregatePackage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\bimport\\s*\\{([^}]+)\\}\\s*from\\s*['"]${escapedPackage}['"]`,
    'gs',
  );
  const bindings = [];
  for (const match of source.matchAll(pattern)) {
    for (const part of match[1].split(',')) {
      const imported = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (!imported) continue;
      const packageId = symbolTargets.get(imported);
      if (!packageId) throw new Error(`${file}: no package target for root binding ${imported}.`);
      bindings.push({ file, line: lineNumber(source, match.index), imported, packageId });
    }
  }
  return bindings;
}

async function scanFiles(files, readSource, docsRoot, manifestSource, ownershipMaps) {
  const importMatches = [];
  const bindings = [];
  const assetMatches = [];
  for (const file of files) {
    if (!sourceExtensions.has(path.extname(file).toLowerCase())) continue;
    let bytes;
    try {
      bytes = await readSource(file);
    } catch {
      continue;
    }
    if (bytes.includes(0)) continue;
    const source = bytes.toString('utf8');
    for (const found of importSpecifiers(source)) {
      importMatches.push({
        file,
        line: lineNumber(source, found.index),
        kind: found.kind,
        specifier: found.specifier,
      });
    }
    bindings.push(...rootBindings(source, file, ownershipMaps.symbolTargets));
    const assetPattern = /(?:LK Design System|lk-design-system|(?:@lk-design-system|@lk-robotics)[\\/]design-system-core)[\\/]assets(?:[\\/][^'"`\s)]+)?/gi;
    for (const found of source.matchAll(assetPattern)) {
      assetMatches.push({
        file,
        line: lineNumber(source, found.index),
        path: normalizePath(found[0]),
      });
    }
  }

  const manifest = JSON.parse(manifestSource);
  const dependencyDeclarations = ['dependencies', 'devDependencies', 'peerDependencies']
    .flatMap((field) =>
      Object.entries(manifest[field] || {})
        .filter(([specifier]) => specifier === aggregatePackage)
        .map(([specifier, version]) => ({
          file: `${docsRoot}/package.json`,
          field,
          specifier,
          version,
        })),
    );
  const aggregateMatches = importMatches.filter((entry) => entry.specifier === aggregatePackage);
  const deepSpecifierNames = [...new Set(
    importMatches
      .map((entry) => entry.specifier)
      .filter((specifier) => specifier.startsWith(`${aggregatePackage}/components/`)),
  )].sort((left, right) => left.localeCompare(right));
  const deepSpecifiers = deepSpecifierNames.map((specifier) => {
    const targetPackageId = ownershipMaps.specifierTargets.get(specifier);
    if (!targetPackageId) throw new Error(`No package target for ${specifier}.`);
    return { specifier, targetPackageId };
  });
  const stylesheetMatches = importMatches.filter(
    (entry) =>
      entry.specifier === `${aggregatePackage}/styles.css` ||
      entry.specifier.startsWith(`${aggregatePackage}/tokens/`),
  );
  const layerMatches = importMatches.filter((entry) =>
    new RegExp(`^${aggregatePackage.replace('/', '\\/')}\/(?:core|theme|product|robotics)$`).test(
      entry.specifier,
    ),
  );
  const requireMatches = importMatches.filter(
    (entry) =>
      entry.kind === 'cjs-require' &&
      (entry.specifier === aggregatePackage || entry.specifier.startsWith(`${aggregatePackage}/`)),
  );
  const rootFiles = [...new Set(aggregateMatches.map((entry) => entry.file))];
  const committedUsage = {
    aggregateRootImportFiles: rootFiles.length,
    componentDeepSpecifiers: deepSpecifiers.length,
    stylesheetImports: stylesheetMatches.length,
    dependencyDeclarations: dependencyDeclarations.length,
    assetFilesystemPaths: assetMatches.length,
    layerSubpathImports: layerMatches.length,
    cjsRequireOccurrences: requireMatches.length,
  };
  const worktreeUsage = {
    aggregateRootImportFiles: rootFiles.length,
    aggregateRootBindings: bindings.length,
    bindingsByTarget: countByPackage(bindings, (entry) => entry.packageId),
    componentDeepSpecifiers: deepSpecifiers.length,
    deepSpecifiersByTarget: countByPackage(deepSpecifiers, (entry) => entry.targetPackageId),
    stylesheetImports: stylesheetMatches.length,
    dependencyDeclarations: dependencyDeclarations.length,
    assetFilesystemPaths: assetMatches.length,
    layerSubpathImports: layerMatches.length,
    cjsRequireOccurrences: requireMatches.length,
  };
  return {
    committedUsage,
    worktreeUsage,
    deepSpecifiers,
    matches: {
      dependencyDeclarations,
      aggregateImports: aggregateMatches,
      rootBindings: bindings,
      deepSpecifiers,
      stylesheetImports: stylesheetMatches,
      assetFilesystemPaths: assetMatches,
      layerSubpathImports: layerMatches,
      cjsRequireOccurrences: requireMatches,
    },
  };
}

const args = parseArgs(process.argv.slice(2));
for (const required of ['checkout', 'repository', 'commit', 'docs-root']) {
  if (!args[required]) throw new Error(`--${required} is required.`);
}
const checkout = path.resolve(args.checkout);
const docsRoot = normalizePath(args['docs-root']);
const headCommit = git(checkout, ['rev-parse', 'HEAD']);
if (headCommit !== args.commit) throw new Error(`Expected ${args.commit}, found ${headCommit}.`);

const before = await worktreeInventory(checkout);
const committedFiles = git(checkout, [
  'ls-tree',
  '-r',
  '--name-only',
  '-z',
  'HEAD',
  '--',
  docsRoot,
])
  .split('\0')
  .map(normalizePath)
  .filter(Boolean);
const trackedWorktreeFiles = git(checkout, ['ls-files', '-z', '--', docsRoot])
  .split('\0')
  .map(normalizePath)
  .filter(Boolean);
const worktreeFiles = [...new Set([
  ...trackedWorktreeFiles,
  ...before.untrackedFiles.filter(
    (file) => file === docsRoot || file.startsWith(`${docsRoot}/`),
  ),
])].sort((left, right) => left.localeCompare(right));
const ownershipMaps = await buildOwnershipMaps();
const committedManifest = git(checkout, ['show', `HEAD:${docsRoot}/package.json`]);
const worktreeManifest = await readFile(path.join(checkout, docsRoot, 'package.json'), 'utf8');
const linkSpecifier = JSON.parse(worktreeManifest).dependencies?.[aggregatePackage] || null;
let linkResolution = null;
if (linkSpecifier?.startsWith('link:')) {
  const declaredRelativePath = normalizePath(linkSpecifier.slice('link:'.length));
  const declaredAbsolutePath = path.resolve(checkout, docsRoot, declaredRelativePath);
  const [declaredInfo, resolvedLinkPath, resolvedWorkspacePath] = await Promise.all([
    lstat(declaredAbsolutePath),
    realpath(declaredAbsolutePath),
    realpath(root),
  ]);
  const resolvedOrigin = git(resolvedLinkPath, ['remote', 'get-url', 'origin']);
  linkResolution = {
    declaredRelativePath,
    filesystemLink: declaredInfo.isSymbolicLink(),
    resolvedPathRelativeToIntegrationRepository: normalizePath(
      path.relative(checkout, resolvedLinkPath),
    ),
    sameAsScannerWorkspace: resolvedLinkPath.toLowerCase() === resolvedWorkspacePath.toLowerCase(),
    resolvedRepository: resolvedOrigin
      .replace(/^https:\/\/github\.com\//, '')
      .replace(/^git@github\.com:/, '')
      .replace(/\.git$/, ''),
    resolvedCommit: git(resolvedLinkPath, ['rev-parse', 'HEAD']),
    resolvedBranch: git(resolvedLinkPath, ['branch', '--show-current']),
  };
}
const committedScan = await scanFiles(
  committedFiles,
  async (file) => Buffer.from(git(checkout, ['show', `HEAD:${file}`]), 'utf8'),
  docsRoot,
  committedManifest,
  ownershipMaps,
);
const worktreeScan = await scanFiles(
  worktreeFiles,
  (file) => readFile(path.join(checkout, file)),
  docsRoot,
  worktreeManifest,
  ownershipMaps,
);
const after = await worktreeInventory(checkout);
if (before.sha256 !== after.sha256) {
  throw new Error('LDS3D worktree changed during the integration scan; retry on a stable snapshot.');
}

const sourceTree = git(checkout, ['ls-tree', '-r', '--full-tree', 'HEAD', '--', docsRoot]);
const worktreeRows = [];
for (const file of worktreeFiles) {
  try {
    const bytes = await readFile(path.join(checkout, file));
    worktreeRows.push(`${file}|${bytes.length}|${sha256(bytes)}`);
  } catch {
    worktreeRows.push(`${file}|missing`);
  }
}

const report = {
  kind: 'lds-consumer-import-scan',
  scanner: 'scripts/scan-lds3d-integration.mjs',
  scannerVersion: 1,
  repository: args.repository,
  commit: headCommit,
  docsRoot,
  capturedAt: new Date().toISOString(),
  sourceTreeSha256: sha256(`${sourceTree}\n`),
  worktreeTreeSha256: sha256(`${worktreeRows.join('\n')}\n`),
  worktreeInventorySha256: before.sha256,
  workingTree: {
    dirty: before.dirty,
    trackedChanges: before.trackedChanges,
    untrackedPaths: before.untrackedPaths,
  },
  linkSpecifier,
  linkResolution,
  committedHeadUsage: committedScan.committedUsage,
  worktreeUsage: worktreeScan.worktreeUsage,
  deepSpecifiers: worktreeScan.deepSpecifiers,
  committedMatches: committedScan.matches,
  worktreeMatches: worktreeScan.matches,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
