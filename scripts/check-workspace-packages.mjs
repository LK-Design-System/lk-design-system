import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const notes = [];
const sourceOnly = process.argv.includes('--source-only');

const packages = [
  {
    id: 'core',
    layer: 'core',
    name: '@lk-robotics/lds-core',
    dependencies: [],
    resources: ['styles.css', 'tokens', 'assets'],
  },
  {
    id: 'theme',
    layer: 'theme',
    name: '@lk-robotics/lds-theme',
    dependencies: ['@lk-robotics/lds-core'],
    resources: ['styles.css', 'tokens', 'assets'],
  },
  {
    id: 'product',
    layer: 'product',
    name: '@lk-robotics/lds-product',
    dependencies: ['@lk-robotics/lds-core'],
    resources: ['styles.css', 'assets'],
  },
  {
    id: 'robotics-ui',
    layer: 'robotics',
    name: '@lk-robotics/lds-robotics-ui',
    dependencies: ['@lk-robotics/lds-core', '@lk-robotics/lds-product'],
    resources: ['styles.css', 'tokens'],
  },
  {
    id: 'compat',
    name: '@lk-robotics/design-system-core',
    dependencies: [
      '@lk-robotics/lds-core',
      '@lk-robotics/lds-theme',
      '@lk-robotics/lds-product',
      '@lk-robotics/lds-robotics-ui',
    ],
    resources: ['styles.css', 'tokens', 'assets'],
  },
];

const implementationPackages = packages.filter(({ id }) => id !== 'compat');
const implementationNames = new Set(implementationPackages.map(({ name }) => name));

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
    if ('require' in target) fail(`${packageInfo.name}: ${key} must not expose CommonJS; CJS belongs only to compat.`);
  }

  if (stringsIn(manifest.exports).some((target) => target.endsWith('.cjs')) || manifest.main?.endsWith('.cjs')) {
    fail(`${packageInfo.name}: implementation package contains a CommonJS target.`);
  }
}

function validateCompatExports(manifest) {
  const conditional = ['.', './core', './theme', './product', './robotics', './components/*'];
  for (const key of conditional) {
    const target = manifest.exports?.[key];
    if (!target || typeof target !== 'object') {
      fail(`@lk-robotics/design-system-core: exports is missing conditional entry ${key}.`);
      continue;
    }
    for (const condition of ['types', 'import', 'require']) {
      if (!target[condition]) fail(`@lk-robotics/design-system-core: ${key} is missing ${condition}.`);
    }
  }
  for (const key of ['./styles.css', './tokens/*', './assets/*']) {
    if (!(key in (manifest.exports ?? {}))) fail(`@lk-robotics/design-system-core: exports is missing ${key}.`);
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

  const expected = packageInfo.id === 'compat'
    ? (await walkFiles(path.join(packageRoot, 'src')))
      .filter((file) => file.endsWith('.js'))
      .flatMap((file) => {
        const relative = path.relative(path.join(packageRoot, 'src'), file).replace(/\.js$/, '');
        return [`${relative}.js`, `${relative}.cjs`, `${relative}.d.ts`];
      })
    : [
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

  if (packageInfo.id !== 'compat') {
    const cjsFiles = (await walkFiles(dist)).filter((file) => file.endsWith('.cjs'));
    if (cjsFiles.length > 0) fail(`${packageInfo.name}: implementation dist contains CommonJS files (${cjsFiles.length}).`);
  }
}

async function validateFacade(ownershipRows) {
  const compatRoot = path.join(root, 'packages', 'compat', 'src');
  const files = (await walkFiles(compatRoot)).filter((file) => /\.(?:js|d\.ts)$/.test(file));
  if (files.length === 0) {
    fail('Compatibility facade has no source files; run npm run generate:compat-facade.');
    return;
  }

  const expectedDeepSpecifiers = new Set(
    ownershipRows.map(({ packageName, source }) => `${packageName}/${source.replace(/^\.\//, '').replace(/\.jsx$/, '')}`),
  );
  const expectedFacades = new Map([
    ['index', implementationPackages.map(({ name }) => name)],
    ...implementationPackages.map(({ layer, name }) => [layer, [name]]),
    ...ownershipRows.map(({ packageName, source }) => [
      source.replace(/^\.\//, '').replace(/\.jsx$/, ''),
      [`${packageName}/${source.replace(/^\.\//, '').replace(/\.jsx$/, '')}`],
    ]),
  ]);
  const seenDeepSpecifiers = new Set();

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const statements = source.split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'));
    if (statements.length === 0) fail(`${path.relative(root, file)}: facade file has no re-export.`);
    const actualSpecifiers = [];
    for (const statement of statements) {
      const match = statement.match(/^export \* from ['"](@lk-robotics\/lds-(?:core|theme|product|robotics-ui)(?:\/components\/[^'"]+)?)['"];$/);
      if (!match) {
        fail(`${path.relative(root, file)}: facade source may contain only implementation-package re-exports (${statement}).`);
        continue;
      }
      actualSpecifiers.push(match[1]);
      if (match[1].includes('/components/')) seenDeepSpecifiers.add(match[1]);
    }
    const relative = path.relative(compatRoot, file).replaceAll('\\', '/').replace(/(?:\.d\.ts|\.js)$/, '');
    const expectedSpecifiers = expectedFacades.get(relative);
    if (!expectedSpecifiers) fail(`${path.relative(root, file)}: unexpected compatibility facade file.`);
    else if (JSON.stringify([...actualSpecifiers].sort()) !== JSON.stringify([...expectedSpecifiers].sort())) {
      fail(`${path.relative(root, file)}: re-exports ${actualSpecifiers.join(', ') || '(none)'}; expected ${expectedSpecifiers.join(', ')}.`);
    }
  }

  for (const specifier of expectedDeepSpecifiers) {
    if (!seenDeepSpecifiers.has(specifier)) fail(`Compatibility facade is missing deep re-export ${specifier}.`);
  }
  for (const specifier of seenDeepSpecifiers) {
    if (!expectedDeepSpecifiers.has(specifier)) fail(`Compatibility facade has unexpected deep re-export ${specifier}.`);
  }

  const jsFiles = new Set(files.filter((file) => file.endsWith('.js')).map((file) => file.replace(/\.js$/, '')));
  const declarationFiles = new Set(files.filter((file) => file.endsWith('.d.ts')).map((file) => file.replace(/\.d\.ts$/, '')));
  for (const stem of jsFiles) if (!declarationFiles.has(stem)) fail(`${path.relative(root, stem)} is missing its .d.ts facade pair.`);
  for (const stem of declarationFiles) if (!jsFiles.has(stem)) fail(`${path.relative(root, stem)} is missing its .js facade pair.`);
}

const manifests = new Map();
const ownershipRows = [];

for (const packageInfo of packages) {
  const packageRoot = path.join(root, 'packages', packageInfo.id);
  const manifest = await readJson(path.join(packageRoot, 'package.json'), `${packageInfo.name} manifest`);
  if (!manifest) continue;
  manifests.set(packageInfo.id, manifest);

  if (manifest.name !== packageInfo.name) fail(`packages/${packageInfo.id}: expected name ${packageInfo.name}, found ${manifest.name}.`);
  if (manifest.version !== '0.1.0') fail(`${packageInfo.name}: expected version 0.1.0, found ${manifest.version}.`);

  const internalDependencies = Object.keys(manifest.dependencies ?? {}).filter((name) => implementationNames.has(name)).sort();
  const expectedDependencies = [...packageInfo.dependencies].sort();
  if (JSON.stringify(internalDependencies) !== JSON.stringify(expectedDependencies)) {
    fail(`${packageInfo.name}: internal dependency DAG is ${internalDependencies.join(', ') || '(none)'}; expected ${expectedDependencies.join(', ') || '(none)'}.`);
  }
  for (const dependency of expectedDependencies) {
    if (manifest.dependencies?.[dependency] !== '0.1.0') fail(`${packageInfo.name}: ${dependency} must use version 0.1.0.`);
  }

  if (packageInfo.id === 'compat') validateCompatExports(manifest);
  else validateImplementationExports(manifest, packageInfo);

  for (const resource of packageInfo.resources) {
    const exportKey = `./${resource === 'styles.css' ? resource : `${resource}/*`}`;
    if (!(await exists(path.join(packageRoot, resource)))) fail(`${packageInfo.name}: exported ${resource} is missing from the package root.`);
    if (!manifest.files?.includes(resource)) fail(`${packageInfo.name}: files is missing ${resource}.`);
    if (!(exportKey in (manifest.exports ?? {}))) fail(`${packageInfo.name}: exports is missing ${exportKey}.`);
  }

  if (packageInfo.id !== 'compat') {
    const publicRows = await readPublicEntry(path.join(packageRoot, 'src', 'index.js'), `${packageInfo.name} public entry`);
    for (const row of publicRows) ownershipRows.push({ ...row, owner: packageInfo.layer, packageName: packageInfo.name });
    await validateBuild(packageInfo, publicRows);
  }
}

const classification = await readJson(
  path.join(root, 'docs', 'references', 'wds', 'PUBLIC_EXPORT_CLASSIFICATION.json'),
  'PUBLIC_EXPORT_CLASSIFICATION.json',
);
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

await validateFacade(ownershipRows);
const compat = packages.find(({ id }) => id === 'compat');
await validateBuild(compat, []);

for (const note of notes) console.log(`NOTE: ${note}`);
if (errors.length > 0) {
  console.error(`Workspace package check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const checkedSurface = sourceOnly ? 'source contracts' : 'source contracts and available build outputs';
  console.log(`Workspace package check passed: ${packages.length} manifests, ${ownershipRows.reduce((count, row) => count + row.names.length, 0)} owned exports, compatibility facade, and ${checkedSurface}.`);
}
