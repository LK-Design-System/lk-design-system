import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const aggregatePackage = '@lk-design-system/design-system-core';
const splitPackagePattern = /^(?:@lk-design-system|@lk-robotics)\/lds-(?:core|theme|product|robotics-ui)(?:\/|$)/;
const lds3dPackagePattern = /^@lk-robotics\/lds-3d-[a-z0-9-]+(?:\/|$)/;
const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const sourceExtensions = new Set([
  '.cjs',
  '.cts',
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.less',
  '.mdx',
  '.mjs',
  '.mts',
  '.sass',
  '.scss',
  '.svelte',
  '.ts',
  '.tsx',
  '.vue',
]);

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
  const safeDirectory = normalizePath(checkout);
  return execFileSync(
    'git',
    ['-c', `safe.directory=${safeDirectory}`, '-C', checkout, ...args],
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
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

function isUiSpecifier(specifier) {
  return specifier === aggregatePackage ||
    specifier.startsWith(`${aggregatePackage}/`) ||
    splitPackagePattern.test(specifier);
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
      const specifier = match[1];
      const key = `${match.index}|${specifier}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ kind, specifier, index: match.index });
    }
  }
  return matches;
}

function sortMatches(matches) {
  return matches.sort((left, right) =>
    left.file.localeCompare(right.file) ||
    left.line - right.line ||
    (left.specifier || left.path).localeCompare(right.specifier || right.path),
  );
}

function pushUnique(collection, seen, entry) {
  const key = JSON.stringify(entry);
  if (seen.has(key)) return;
  seen.add(key);
  collection.push(entry);
}

const args = parseArgs(process.argv.slice(2));
for (const required of ['checkout', 'repository', 'commit', 'frontend-root']) {
  if (!args[required]) throw new Error(`--${required} is required.`);
}

const checkout = path.resolve(args.checkout);
const frontendRoot = normalizePath(args['frontend-root']);
const headCommit = git(checkout, ['rev-parse', 'HEAD']);
if (headCommit !== args.commit) {
  throw new Error(`Expected ${args.commit}, found ${headCommit}.`);
}
if (git(checkout, ['status', '--porcelain']) !== '') {
  throw new Error('Consumer checkout must be clean.');
}

const trackedFiles = git(checkout, ['ls-files', '-z'])
  .split('\0')
  .map(normalizePath)
  .filter(Boolean);
const sourcePrefix = frontendRoot === '.' ? '' : `${frontendRoot}/`;
const sourceFiles = trackedFiles.filter((file) =>
  (sourcePrefix === '' || file === frontendRoot || file.startsWith(sourcePrefix)) &&
  sourceExtensions.has(path.extname(file).toLowerCase()),
);
const manifestFiles = trackedFiles.filter((file) => path.basename(file) === 'package.json');
const sourceTree = git(checkout, ['ls-tree', '-r', '--full-tree', 'HEAD', '--', frontendRoot]);
const sourceTreeEntryCount = sourceTree.split(/\r?\n/).filter(Boolean).length;
if (sourceTreeEntryCount === 0) {
  throw new Error(`Frontend root ${frontendRoot} has no tracked entries at ${headCommit}.`);
}
if (sourceFiles.length === 0) {
  throw new Error(`Frontend root ${frontendRoot} has no supported source files.`);
}
if (manifestFiles.length === 0) throw new Error('Consumer checkout has no tracked package.json.');

const matches = {
  dependencyDeclarations: [],
  aggregateRootImports: [],
  layerSubpathImports: [],
  componentDeepImports: [],
  stylesheetImports: [],
  assetFilesystemPaths: [],
  lds3dPackageImports: [],
  cjsRequireOccurrences: [],
};
const matchKeys = Object.fromEntries(Object.keys(matches).map((key) => [key, new Set()]));

for (const manifestFile of manifestFiles) {
  const manifest = JSON.parse(await readFile(path.join(checkout, manifestFile), 'utf8'));
  for (const field of dependencyFields) {
    for (const [specifier, version] of Object.entries(manifest[field] || {})) {
      if (!isUiSpecifier(specifier) && !lds3dPackagePattern.test(specifier)) continue;
      pushUnique(matches.dependencyDeclarations, matchKeys.dependencyDeclarations, {
        file: manifestFile,
        field,
        specifier,
        version,
      });
    }
  }
}

for (const file of sourceFiles) {
  const bytes = await readFile(path.join(checkout, file));
  if (bytes.includes(0)) continue;
  const source = bytes.toString('utf8');
  for (const found of importSpecifiers(source)) {
    const entry = {
      file,
      line: lineNumber(source, found.index),
      kind: found.kind,
      specifier: found.specifier,
    };
    if (found.specifier === aggregatePackage) {
      pushUnique(matches.aggregateRootImports, matchKeys.aggregateRootImports, entry);
    }
    if (
      new RegExp(`^${aggregatePackage.replace('/', '\\/')}\/(?:core|theme|product|robotics)$`).test(
        found.specifier,
      ) ||
      splitPackagePattern.test(found.specifier)
    ) {
      pushUnique(matches.layerSubpathImports, matchKeys.layerSubpathImports, entry);
    }
    if (found.specifier.startsWith(`${aggregatePackage}/components/`)) {
      pushUnique(matches.componentDeepImports, matchKeys.componentDeepImports, entry);
    }
    if (
      found.specifier === `${aggregatePackage}/styles.css` ||
      found.specifier.startsWith(`${aggregatePackage}/tokens/`) ||
      /^(?:@lk-design-system|@lk-robotics)\/lds-(?:core|theme|product|robotics-ui)\/styles\.css$/.test(
        found.specifier,
      )
    ) {
      pushUnique(matches.stylesheetImports, matchKeys.stylesheetImports, entry);
    }
    if (found.specifier.startsWith(`${aggregatePackage}/assets/`)) {
      pushUnique(matches.assetFilesystemPaths, matchKeys.assetFilesystemPaths, entry);
    }
    if (lds3dPackagePattern.test(found.specifier)) {
      pushUnique(matches.lds3dPackageImports, matchKeys.lds3dPackageImports, entry);
    }
    if (
      found.kind === 'cjs-require' &&
      (isUiSpecifier(found.specifier) || lds3dPackagePattern.test(found.specifier))
    ) {
      pushUnique(matches.cjsRequireOccurrences, matchKeys.cjsRequireOccurrences, entry);
    }
  }
  const assetPattern = /(?:node_modules[\\/])?(?:@lk-design-system|@lk-robotics)[\\/]design-system-core[\\/]assets(?:[\\/][^'"`\s)]+)?/g;
  for (const found of source.matchAll(assetPattern)) {
    pushUnique(matches.assetFilesystemPaths, matchKeys.assetFilesystemPaths, {
      file,
      line: lineNumber(source, found.index),
      path: normalizePath(found[0]),
    });
  }
}

for (const value of Object.values(matches)) sortMatches(value);
const currentUsage = Object.fromEntries(
  Object.entries(matches).map(([key, value]) => [key, value.length]),
);

const report = {
  kind: 'lds-consumer-import-scan',
  scanner: 'scripts/scan-package-consumer.mjs',
  scannerVersion: 1,
  repository: args.repository,
  commit: headCommit,
  frontendRoot,
  sourceTreeEntryCount,
  sourceFileCount: sourceFiles.length,
  sourceTreeSha256: sha256(`${sourceTree}\n`),
  currentUsage,
  matches,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
