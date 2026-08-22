import { access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const notes = [];
const sourceOnly = process.argv.includes('--source-only');
// Read, never restated. Both versions used to be literals here, and both went
// stale the moment a release advanced the manifests without also editing this
// file — which is exactly the drift this check exists to catch, reported
// against the wrong side. The workspace root versions its packages (publish
// policy asserts they match), and the external surface names the Robotics
// release, so those two files are the sources and this one only compares.
const releaseVersion = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version;
// Set from the external surface the first time it is read; the dependency
// check below compares consumer manifests against whatever it names.
let externalRoboticsVersion;
let roboticsExternalSurface;
const roboticsExternalSurfacePath = path.join(
  root,
  'docs',
  'references',
  'package-split',
  'ROBOTICS_EXTERNAL_SURFACE.json',
);

const packages = [
  {
    id: 'core',
    layer: 'core',
    name: '@lk-design-system/lds-core',
    dependencies: [],
    resources: ['styles.css', 'tokens', 'assets'],
    docsOrigin: 'https://lk-design-system.github.io/lk-design-system/',
  },
  {
    id: 'theme',
    layer: 'theme',
    name: '@lk-design-system/lds-theme',
    dependencies: ['@lk-design-system/lds-core'],
    resources: ['styles.css', 'tokens', 'assets'],
    docsOrigin: 'https://lk-design-system.github.io/lk-design-system/',
  },
  {
    id: 'product',
    layer: 'product',
    name: '@lk-design-system/lds-product',
    dependencies: ['@lk-design-system/lds-core'],
    resources: ['styles.css', 'tokens', 'assets'],
    docsOrigin: 'https://lk-design-system.github.io/lk-design-system/',
  },
  {
    id: 'robotics-ui',
    layer: 'robotics',
    name: '@lk-design-system/lds-robotics-ui',
    dependencies: ['@lk-design-system/lds-core', '@lk-design-system/lds-product'],
    resources: ['styles.css', 'tokens'],
    external: true,
    docsOrigin: 'https://lk-design-system.github.io/lk-design-system-robotics/',
  },
];

const implementationPackages = packages;
const implementationNames = new Set(implementationPackages.map(({ name }) => name));
const documentationExports = {
  './package.json': './package.json',
  './design-system.json': './docs/manifest.json',
  './llms.txt': './docs/llms.txt',
  './adoption-checklist.json': './docs/adoption-checklist.json',
  './docs/*': './docs/*',
};

function fail(message) {
  errors.push(message);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file, label) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    fail(`${label}: ${error.message}`);
    return null;
  }
}

function getExportedNames(clause) {
  return clause.split(',').map((part) => {
    const segments = part.trim().split(/\s+as\s+/);
    return segments.at(-1).trim();
  });
}

async function readPublicEntry(file, label) {
  let source;
  try {
    source = await readFile(file, 'utf8');
  } catch (error) {
    fail(`${label}: ${error.message}`);
    return [];
  }

  const rows = [];
  const exportPattern = /^export\s+\{\s*([^}]+?)\s*\}\s+from\s+['"](\.\/components\/[^'"]+)['"];?\s*$/gm;
  for (const match of source.matchAll(exportPattern)) {
    rows.push({ names: getExportedNames(match[1]), source: match[2] });
  }
  if (rows.length === 0) fail(`${label}: no public component re-exports found.`);
  return rows;
}

async function readExternalPublicEntry(file, label) {
  const surface = await readJson(file, label);
  if (!surface) return [];
  roboticsExternalSurface = surface;
  if (surface.package?.name !== '@lk-design-system/lds-robotics-ui') {
    fail(`${label}: expected the external surface to name @lk-design-system/lds-robotics-ui.`);
    return [];
  }
  externalRoboticsVersion = surface.package?.version;
  if (!externalRoboticsVersion) {
    fail(`${label}: external surface must pin a Robotics release version.`);
    return [];
  }
  const rows = [];
  for (const entry of surface.entries ?? []) {
    if (typeof entry?.source !== 'string' || !Array.isArray(entry.exports) || entry.exports.length === 0) {
      fail(`${label}: contains an invalid external entry.`);
      continue;
    }
    rows.push({ names: entry.exports, source: `./${entry.source}` });
  }
  if (rows.length === 0) fail(`${label}: no external public component re-exports found.`);
  return rows;
}

function stringsIn(value, found = []) {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => stringsIn(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => stringsIn(item, found));
  return found;
}

function validateImplementationExports(manifest, packageInfo) {
  const required = ['.', './components/*', ...packageInfo.resources.map((resource) => `./${resource === 'styles.css' ? resource : `${resource}/*`}`)];
  for (const key of required) {
    if (!(key in (manifest.exports ?? {}))) fail(`${packageInfo.name}: exports is missing ${key}.`);
  }

  for (const key of ['.', './components/*']) {
    const target = manifest.exports?.[key];
    if (!target || typeof target !== 'object') {
      fail(`${packageInfo.name}: ${key} must provide conditional exports.`);
      continue;
    }
    if (!target.types || !target.import) fail(`${packageInfo.name}: ${key} must provide types and import targets.`);
    if ('require' in target) fail(`${packageInfo.name}: ${key} must not expose CommonJS.`);
  }

  if (stringsIn(manifest.exports).some((target) => target.endsWith('.cjs')) || manifest.main?.endsWith('.cjs')) {
    fail(`${packageInfo.name}: implementation package contains a CommonJS target.`);
  }
}

async function validateStorybookSurface(manifest) {
  const target = manifest.exports?.['./storybook'];
  if (!target || typeof target !== 'object') {
    fail('@lk-design-system/lds-product: exports is missing the shared ./storybook Docs surface.');
    return;
  }
  if (target.types !== './storybook/index.d.ts' || target.import !== './storybook/index.js') {
    fail('@lk-design-system/lds-product: ./storybook must expose its canonical types and import entry.');
  }
  if (!manifest.files?.includes('storybook')) {
    fail('@lk-design-system/lds-product: files is missing storybook.');
  }
  for (const filename of ['index.js', 'index.d.ts']) {
    if (!(await exists(path.join(root, 'packages', 'product', 'storybook', filename)))) {
      fail(`@lk-design-system/lds-product: shared Storybook Docs surface is missing storybook/${filename}.`);
    }
  }
}

async function validateDocumentationSurface(manifest, packageInfo, packageRoot = path.join(root, 'packages', packageInfo.id)) {
  const externalDocs = packageInfo.external ? roboticsExternalSurface.documentation : null;
  const bundleRoot = packageInfo.external ? path.posix.dirname(externalDocs.files.manifest.path) : 'docs';
  const packageInstructions = packageInfo.external ? ['README.md', 'AGENTS.md', 'CLAUDE.md', 'llms.txt'] : ['README.md'];
  for (const file of packageInstructions) {
    if (!manifest.files?.includes(file)) fail(`${packageInfo.name}: files is missing ${file}.`);
  }
  if (!manifest.files?.some((entry) => entry === bundleRoot || bundleRoot.startsWith(`${entry.replace(/\/$/, '')}/`))) {
    fail(`${packageInfo.name}: files does not cover ${bundleRoot}.`);
  }
  const expectedExports = packageInfo.external ? {
    './package.json': './package.json',
    './design-system.json': `./${externalDocs.files.manifest.path}`,
    './llms.txt': `./${externalDocs.files.llms.path}`,
    './adoption-checklist.json': `./${externalDocs.files.checklist.path}`,
    './docs/*': `./${bundleRoot}/*`,
  } : documentationExports;
  for (const [subpath, target] of Object.entries(expectedExports)) {
    if (manifest.exports?.[subpath] !== target) {
      fail(`${packageInfo.name}: documentation export ${subpath} must target ${target}.`);
    }
  }
  const lds = manifest.lds;
  if (lds?.schemaVersion !== 1) fail(`${packageInfo.name}: lds.schemaVersion must be 1.`);
  if (lds?.layer !== packageInfo.layer) fail(`${packageInfo.name}: lds.layer must be ${packageInfo.layer}.`);
  for (const [field, target] of Object.entries({
    manifest: packageInfo.external ? `./${externalDocs.files.manifest.path}` : './docs/manifest.json',
    llms: packageInfo.external ? `./${externalDocs.files.llms.path}` : './docs/llms.txt',
    adoptionChecklist: packageInfo.external ? `./${externalDocs.files.checklist.path}` : './docs/adoption-checklist.json',
    adoptionReportSchema: packageInfo.external ? `./${externalDocs.files.reportSchema.path}` : './docs/adoption-report.schema.json',
  })) {
    if (lds?.[field] !== target) fail(`${packageInfo.name}: lds.${field} must target ${target}.`);
  }
  if (!lds?.storybook?.startsWith(packageInfo.docsOrigin)) {
    fail(`${packageInfo.name}: lds.storybook must expose the live LDS documentation.`);
  }
  if (manifest.homepage !== lds?.storybook) fail(`${packageInfo.name}: homepage must match lds.storybook.`);

  const requiredFiles = packageInfo.external
    ? [...packageInstructions, ...Object.values(externalDocs.files).map(({ path: file }) => file), ...externalDocs.domainDocuments.map(({ path: file }) => file)]
    : [
      'README.md',
      'docs/manifest.json',
      'docs/llms.txt',
      'docs/adoption-checklist.json',
      'docs/adoption-report.schema.json',
    ];
  for (const relative of requiredFiles) {
    if (!(await exists(path.join(packageRoot, relative)))) fail(`${packageInfo.name}: generated ${relative} is missing.`);
  }
  const docsManifest = await readJson(
    packageInfo.external ? path.join(packageRoot, externalDocs.files.manifest.path) : path.join(packageRoot, 'docs', 'manifest.json'),
    `${packageInfo.name} documentation manifest`,
  );
  if (docsManifest) {
    if (docsManifest.package?.name !== manifest.name) fail(`${packageInfo.name}: documentation manifest package name drift.`);
    if (docsManifest.package?.version !== manifest.version) fail(`${packageInfo.name}: documentation manifest version drift.`);
    if (docsManifest.package?.layer !== packageInfo.layer) fail(`${packageInfo.name}: documentation manifest layer drift.`);
  }
}

function withoutReferenceProjection(contract) {
  return {
    ...contract,
    facets: (contract.facets ?? []).map((facet) => ({ ...facet, references: [] })),
    componentMapping: { ...contract.componentMapping, references: [] },
  };
}

function safeDescendant(directory, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath || relativePath.includes('\\')) return null;
  const absolute = path.resolve(directory, relativePath);
  const relative = path.relative(directory, absolute);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? absolute : null;
}

async function validateExternalDocumentation(packageInfo) {
  const surface = roboticsExternalSurface;
  if (surface?.schemaVersion !== 3 || !surface.documentation) {
    fail(`${packageInfo.name}: external surface must use the v3 documentation contract.`);
    return;
  }
  const rootManifest = await readJson(path.join(root, 'package.json'), 'workspace root manifest');
  if (surface.documentation.canonicalContract?.source?.ref !== `lds-v${rootManifest?.version}`) {
    fail(`${packageInfo.name}: canonical documentation ref must match the current LDS package-set version.`);
  }
  const canonicalPath = safeDescendant(root, surface.documentation.canonicalContract?.source?.path);
  const canonicalBytes = canonicalPath ? await readFile(canonicalPath).catch(() => null) : null;
  if (!canonicalBytes || createHash('sha256').update(canonicalBytes).digest('hex') !== surface.documentation.canonicalContract?.source?.sha256) {
    fail(`${packageInfo.name}: canonical adoption contract hash drift.`);
  }
  const coreDocsManifestPath = safeDescendant(root, 'packages/core/docs/manifest.json');
  const coreDocsManifestBytes = coreDocsManifestPath
    ? await readFile(coreDocsManifestPath).catch(() => null)
    : null;
  if (!coreDocsManifestBytes
    || createHash('sha256').update(coreDocsManifestBytes).digest('hex')
      !== surface.documentation.canonicalContract?.snapshotManifestSha256) {
    fail(`${packageInfo.name}: current Core documentation manifest differs from the Robotics snapshot pin.`);
  }

  const vendored = surface.vendoredArtifact;
  if (!vendored?.path || !vendored?.sha256) {
    fail(`${packageInfo.name}: external surface must pin the vendored package artifact and SHA-256.`);
  } else {
    const artifact = safeDescendant(root, vendored.path);
    const bytes = artifact ? await readFile(artifact).catch(() => null) : null;
    if (!bytes || createHash('sha256').update(bytes).digest('hex') !== vendored.sha256) {
      fail(`${packageInfo.name}: vendored artifact hash drift.`);
    }
    if (!vendored.path.includes(surface.package.version)) {
      fail(`${packageInfo.name}: vendored artifact filename must include ${surface.package.version}.`);
    }
    if (rootManifest?.devDependencies?.[packageInfo.name] !== `file:${vendored.path}`) {
      fail(`${packageInfo.name}: workspace devDependency must resolve the declared vendored artifact.`);
    }
  }

  const packageRoot = path.join(root, 'node_modules', ...packageInfo.name.split('/'));
  const manifest = await readJson(path.join(packageRoot, 'package.json'), `${packageInfo.name} installed manifest`);
  if (!manifest) return;
  if (manifest.name !== surface.package.name || manifest.version !== surface.package.version) {
    fail(`${packageInfo.name}: installed package identity differs from the external surface.`);
  }
  validateImplementationExports(manifest, packageInfo);
  await validateDocumentationSurface(manifest, packageInfo, packageRoot);

  const docsManifest = await readJson(path.join(packageRoot, surface.documentation.files.manifest.path), `${packageInfo.name} installed documentation manifest`);
  const canonicalContract = canonicalBytes ? JSON.parse(canonicalBytes) : null;
  const checklist = await readJson(path.join(packageRoot, surface.documentation.files.checklist.path), `${packageInfo.name} installed checklist`);
  if (canonicalContract && checklist && JSON.stringify(withoutReferenceProjection(canonicalContract)) !== JSON.stringify(withoutReferenceProjection(checklist))) {
    fail(`${packageInfo.name}: packaged checklist decisions differ from the canonical contract.`);
  }
  if (docsManifest) {
    if (JSON.stringify(docsManifest.publicDocs) !== JSON.stringify(surface.documentation.publicDocs)) {
      fail(`${packageInfo.name}: installed documentation public URLs differ from the external surface.`);
    }
    const expectedCanonicalSource = {
      kind: surface.documentation.canonicalContract.kind,
      version: surface.documentation.canonicalContract.contractVersion,
      source: surface.documentation.canonicalContract.source,
      snapshotManifestSha256: surface.documentation.canonicalContract.snapshotManifestSha256,
    };
    if (JSON.stringify(docsManifest.source?.canonicalAdoption) !== JSON.stringify(expectedCanonicalSource)) {
      fail(`${packageInfo.name}: installed documentation canonical source drift.`);
    }
    if (JSON.stringify(docsManifest.source?.robotics) !== JSON.stringify({
      repository: surface.package.repository,
      ref: `v${surface.package.version}`,
      refStatus: surface.package.refStatus,
    })) {
      fail(`${packageInfo.name}: installed documentation Robotics source drift.`);
    }
    const bundleRoot = path.posix.dirname(surface.documentation.files.manifest.path);
    const docsRoot = path.join(packageRoot, ...bundleRoot.split('/'));
    const actualPaths = (await walkFiles(docsRoot))
      .map((file) => path.relative(docsRoot, file).replaceAll('\\', '/'))
      .filter((file) => file !== 'manifest.json')
      .sort();
    const records = Array.isArray(docsManifest.documents) ? docsManifest.documents : [];
    const recordPaths = records.map(({ path: file }) => file).sort();
    if (JSON.stringify(actualPaths) !== JSON.stringify(recordPaths)) {
      fail(`${packageInfo.name}: installed documentation manifest file set drift.`);
    }
    for (const record of records) {
      const target = safeDescendant(docsRoot, record.path);
      const bytes = target ? await readFile(target).catch(() => null) : null;
      if (!bytes || createHash('sha256').update(bytes).digest('hex') !== record.sha256) {
        fail(`${packageInfo.name}: installed documentation hash drift for docs/${record.path}.`);
      }
    }
    const expectedResources = {
      tokens: {
        path: `./${path.posix.relative(bundleRoot, surface.documentation.files.tokenManifest.path)}`,
        sha256: surface.documentation.files.tokenManifest.sha256,
      },
      domainSymbols: {
        path: `./${path.posix.relative(bundleRoot, surface.documentation.files.domainSymbolRegistry.path)}`,
        sha256: surface.documentation.files.domainSymbolRegistry.sha256,
      },
    };
    if (JSON.stringify(docsManifest.resources) !== JSON.stringify(expectedResources)) {
      fail(`${packageInfo.name}: installed documentation resource records differ from the external surface.`);
    }
    const expectedDomainDocuments = surface.documentation.domainDocuments.map((record) => ({
      path: path.posix.relative(bundleRoot, record.path),
      sha256: record.sha256,
    }));
    const actualDomainDocuments = Array.isArray(docsManifest.domain?.documents)
      ? docsManifest.domain.documents.map((record) => ({ path: record.path, sha256: record.sha256 }))
      : [];
    if (JSON.stringify(actualDomainDocuments) !== JSON.stringify(expectedDomainDocuments)) {
      fail(`${packageInfo.name}: installed domain documentation records differ from the external surface.`);
    }
  }
  const declared = [
    ...Object.values(surface.documentation.files),
    ...surface.documentation.domainDocuments,
  ];
  for (const record of declared) {
    const target = safeDescendant(packageRoot, record.path);
    const bytes = target ? await readFile(target).catch(() => null) : null;
    if (!bytes || createHash('sha256').update(bytes).digest('hex') !== record.sha256) {
      fail(`${packageInfo.name}: external-surface documentation hash drift for ${record.path}.`);
    }
  }
}

async function walkFiles(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(full));
    else files.push(full);
  }
  return files;
}

async function validateBuild(packageInfo, publicRows) {
  const packageRoot = path.join(root, 'packages', packageInfo.id);
  const dist = path.join(packageRoot, 'dist');
  if (!(await exists(dist))) {
    notes.push(`${packageInfo.name}: dist not present; build artifact checks skipped (run npm run build:workspaces).`);
    return;
  }
  if (sourceOnly) {
    notes.push(`${packageInfo.name}: build artifact checks skipped by --source-only.`);
    return;
  }

  const expected = [
    'index.js',
    'index.d.ts',
    ...publicRows.flatMap(({ source }) => {
      const relative = source.replace(/^\.\//, '').replace(/\.jsx$/, '');
      return [`${relative}.js`, `${relative}.d.ts`];
    }),
  ];

  const missing = [];
  for (const relative of new Set(expected)) {
    if (!(await exists(path.join(dist, relative)))) missing.push(relative.replaceAll('\\', '/'));
  }
  if (missing.length > 0) {
    const sample = missing.slice(0, 5).map((relative) => `dist/${relative}`).join(', ');
    const remainder = missing.length > 5 ? `, and ${missing.length - 5} more` : '';
    fail(`${packageInfo.name}: ${missing.length} built artifact(s) are missing (${sample}${remainder}); run npm run build:workspaces.`);
  }

  const cjsFiles = (await walkFiles(dist)).filter((file) => file.endsWith('.cjs'));
  if (cjsFiles.length > 0) fail(`${packageInfo.name}: implementation dist contains CommonJS files (${cjsFiles.length}).`);
}

const classification = await readJson(
  path.join(root, 'docs', 'references', 'wds', 'PUBLIC_EXPORT_CLASSIFICATION.json'),
  'PUBLIC_EXPORT_CLASSIFICATION.json',
);
const ownerAuthority = await readJson(
  path.join(root, 'docs', 'references', 'architecture', 'OWNER_AUTHORITY_CONTRACT.json'),
  'OWNER_AUTHORITY_CONTRACT.json',
);
const deprecatedReexports = ownerAuthority?.compatibilityProjections?.deprecatedPackageReexports;
const compatibilitySourceLayer = deprecatedReexports?.sourceLayer;
const compatibilityRowsBySource = new Map(
  (deprecatedReexports?.entries ?? [])
    .filter((entry) => (entry.exports ?? []).length > 0)
    .map((entry) => [
      `./${entry.module}`.replace(/\.(jsx|js)$/, '.jsx'),
      new Set(entry.exports),
    ]),
);
const classifiedOwnerByExport = new Map(
  (classification?.groups ?? []).flatMap((group) =>
    (group.exports ?? []).map((name) => [name, group.ownerLayer])),
);

const manifests = new Map();
const ownershipRows = [];

for (const packageInfo of packages) {
  if (packageInfo.external) {
    const publicRows = await readExternalPublicEntry(roboticsExternalSurfacePath, `${packageInfo.name} external surface`);
    await validateExternalDocumentation(packageInfo);
    for (const row of publicRows) {
      const names = row.names.filter((name) => {
        const classifiedOwner = classifiedOwnerByExport.get(name);
        return classifiedOwner == null || classifiedOwner === packageInfo.layer;
      });
      if (names.length > 0) {
        ownershipRows.push({ ...row, names, owner: packageInfo.layer, packageName: packageInfo.name });
      }
    }
    continue;
  }
  const packageRoot = path.join(root, 'packages', packageInfo.id);
  const manifest = await readJson(path.join(packageRoot, 'package.json'), `${packageInfo.name} manifest`);
  if (!manifest) continue;
  manifests.set(packageInfo.id, manifest);

  if (manifest.name !== packageInfo.name) fail(`packages/${packageInfo.id}: expected name ${packageInfo.name}, found ${manifest.name}.`);
  if (manifest.version !== releaseVersion) fail(`${packageInfo.name}: expected release version ${releaseVersion}, found ${manifest.version}.`);

  const internalDependencies = Object.keys(manifest.dependencies ?? {}).filter((name) => implementationNames.has(name)).sort();
  const expectedDependencies = [...packageInfo.dependencies].sort();
  if (JSON.stringify(internalDependencies) !== JSON.stringify(expectedDependencies)) {
    fail(`${packageInfo.name}: internal dependency DAG is ${internalDependencies.join(', ') || '(none)'}; expected ${expectedDependencies.join(', ') || '(none)'}.`);
  }
  for (const dependency of expectedDependencies) {
    const expectedVersion = dependency === '@lk-design-system/lds-robotics-ui'
      ? externalRoboticsVersion
      : releaseVersion;
    if (manifest.dependencies?.[dependency] !== expectedVersion) fail(`${packageInfo.name}: ${dependency} must use release version ${expectedVersion}.`);
  }

  validateImplementationExports(manifest, packageInfo);
  if (packageInfo.id === 'product') await validateStorybookSurface(manifest);
  await validateDocumentationSurface(manifest, packageInfo);

  for (const resource of packageInfo.resources) {
    const exportKey = `./${resource === 'styles.css' ? resource : `${resource}/*`}`;
    if (!(await exists(path.join(packageRoot, resource)))) fail(`${packageInfo.name}: exported ${resource} is missing from the package root.`);
    if (!manifest.files?.includes(resource)) fail(`${packageInfo.name}: files is missing ${resource}.`);
    if (!(exportKey in (manifest.exports ?? {}))) fail(`${packageInfo.name}: exports is missing ${exportKey}.`);
  }

  const publicRows = await readPublicEntry(path.join(packageRoot, 'src', 'index.js'), `${packageInfo.name} public entry`);
  const seenCompatibilitySources = new Set();
  for (const row of publicRows) {
    const ownedNames = row.names.filter((name) => classifiedOwnerByExport.get(name) === packageInfo.layer);
    const compatibilityNames = row.names.filter((name) => classifiedOwnerByExport.get(name) !== packageInfo.layer);
    if (ownedNames.length > 0) {
      ownershipRows.push({ ...row, names: ownedNames, owner: packageInfo.layer, packageName: packageInfo.name });
    }
    if (compatibilityNames.length > 0) {
      const expectedNames = compatibilityRowsBySource.get(row.source);
      const validCompatibility = packageInfo.id === compatibilitySourceLayer
        && expectedNames
        && compatibilityNames.every((name) => expectedNames.has(name))
        && expectedNames.size === compatibilityNames.length;
      if (!validCompatibility) {
        fail(`${packageInfo.name}: ${row.source} exports non-owned names without an exact deprecated compatibility contract (${compatibilityNames.join(', ')}).`);
      } else {
        seenCompatibilitySources.add(row.source);
      }
    }
  }
  if (packageInfo.id === compatibilitySourceLayer) {
    for (const source of compatibilityRowsBySource.keys()) {
      if (!seenCompatibilitySources.has(source)) fail(`${packageInfo.name}: missing deprecated compatibility root re-export ${source}.`);
    }
  }
  await validateBuild(packageInfo, publicRows);
}

if (classification) {
  const expectedOwners = new Map();
  for (const group of classification.groups ?? []) {
    for (const name of group.exports ?? []) {
      if (expectedOwners.has(name)) fail(`Classification assigns ${name} more than once.`);
      expectedOwners.set(name, group.ownerLayer);
    }
  }

  const actualOwners = new Map();
  for (const row of ownershipRows) {
    for (const name of row.names) {
      if (actualOwners.has(name)) fail(`Workspace implementation packages export ${name} more than once.`);
      actualOwners.set(name, row.owner);
    }
  }

  for (const [name, owner] of expectedOwners) {
    if (!actualOwners.has(name)) fail(`Workspace ownership union is missing classified export ${name} (${owner}).`);
    else if (actualOwners.get(name) !== owner) fail(`${name}: package owner is ${actualOwners.get(name)}, classification owner is ${owner}.`);
  }
  for (const [name, owner] of actualOwners) {
    if (!expectedOwners.has(name)) fail(`Workspace ownership union has unclassified export ${name} (${owner}).`);
  }
}

for (const note of notes) console.log(`NOTE: ${note}`);
if (errors.length > 0) {
  console.error(`Workspace package check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const checkedSurface = sourceOnly ? 'source contracts' : 'source contracts and available build outputs';
  console.log(`Workspace package check passed: ${packages.length} manifests, ${ownershipRows.reduce((count, row) => count + row.names.length, 0)} owned exports, generated adoption documentation, and ${checkedSurface}.`);
}
