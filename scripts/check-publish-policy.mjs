import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const vendoredRoboticsRelease = {
  path: 'vendor/lk-robotics-lds-robotics-ui-0.1.0-rc.3.tgz',
  sha256: '011dc06b058efea94a58dc904dcebcb05379c003c3de40dcd39d15095d251216',
};
const workspacePackages = [
  { id: 'core', name: '@lk-robotics/lds-core', dependencies: [], resources: ['tokens', 'assets'] },
  { id: 'theme', name: '@lk-robotics/lds-theme', dependencies: ['@lk-robotics/lds-core'], resources: ['tokens', 'assets'] },
  { id: 'product', name: '@lk-robotics/lds-product', dependencies: ['@lk-robotics/lds-core'], resources: ['assets'] },
  {
    id: 'compat',
    name: '@lk-robotics/design-system-core',
    dependencies: ['@lk-robotics/lds-core', '@lk-robotics/lds-theme', '@lk-robotics/lds-product'],
    externalDependencies: ['@lk-robotics/lds-robotics-ui'],
    resources: ['tokens', 'assets'],
    compatibility: true,
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assertPeerDependencies(manifest, packageName) {
  assert(
    JSON.stringify(Object.keys(manifest.peerDependencies ?? {}).sort()) === JSON.stringify(['react', 'react-dom']),
    `${packageName}: peerDependencies must contain exactly react and react-dom.`,
  );
}

function assertEntry(manifest, packageInfo) {
  const packageName = packageInfo.name;
  assert(manifest.private !== true, `${packageName}: Wave 2 release packages must be publishable.`);
  assert(manifest.publishConfig?.registry === 'https://npm.pkg.github.com', `${packageName}: publishConfig must target GitHub Packages.`);
  assert(manifest.publishConfig?.access === 'restricted', `${packageName}: publishConfig must publish with restricted access.`);
  assert(manifest.type === 'module', `${packageName}: package type must be module.`);
  assert(manifest.types === './dist/index.d.ts', `${packageName}: types must point to dist/index.d.ts.`);
  assert(manifest.files?.includes('dist'), `${packageName}: files must include dist.`);
  assert(manifest.files?.includes('styles.css'), `${packageName}: files must include styles.css.`);
  assert(!manifest.files?.includes('src'), `${packageName}: raw source must not be published.`);
  assertPeerDependencies(manifest, packageName);

  const dependencies = Object.keys(manifest.dependencies ?? {}).sort();
  assert(
    JSON.stringify(dependencies) === JSON.stringify([...(packageInfo.dependencies || []), ...(packageInfo.externalDependencies || [])].sort()),
    `${packageName}: workspace dependency list is not the approved package DAG.`,
  );
  for (const dependency of packageInfo.dependencies) {
    assert(manifest.dependencies[dependency] === rootPackage.version, `${packageName}: ${dependency} must be pinned to the release-set version.`);
  }
  for (const dependency of packageInfo.externalDependencies || []) {
    assert(
      manifest.dependencies[dependency] === roboticsExternalSurface.package.version,
      `${packageName}: ${dependency} must be pinned to the approved external Robotics release.`,
    );
  }

  const expectedResources = new Set(['styles.css', ...packageInfo.resources]);
  for (const resource of ['styles.css', 'tokens', 'assets']) {
    const fileEntry = resource;
    const exportEntry = resource === 'styles.css' ? './styles.css' : `./${resource}/*`;
    const published = expectedResources.has(resource);
    assert(Boolean(manifest.files?.includes(fileEntry)) === published, `${packageName}: ${resource} files policy is inconsistent with its owner contract.`);
    assert(Boolean(manifest.exports?.[exportEntry]) === published, `${packageName}: ${resource} export policy is inconsistent with its owner contract.`);
  }

  const rootExport = manifest.exports?.['.'];
  const deepExport = manifest.exports?.['./components/*'];
  for (const [label, entry] of [['.', rootExport], ['./components/*', deepExport]]) {
    assert(entry?.types && entry?.import, `${packageName}: ${label} must expose ESM and types.`);
    assert(entry.types.startsWith('./dist/'), `${packageName}: ${label} types must resolve under dist.`);
    assert(entry.import.startsWith('./dist/'), `${packageName}: ${label} ESM must resolve under dist.`);
    if (packageInfo.compatibility) {
      assert(entry.require?.startsWith('./dist/'), `${packageName}: ${label} must preserve its CJS compatibility export.`);
    } else {
      assert(!entry.require, `${packageName}: implementation packages must not expose CJS.`);
    }
  }

  if (!packageInfo.compatibility) {
    assert(manifest.main === './dist/index.js' && manifest.module === './dist/index.js', `${packageName}: implementation entrypoints must be ESM.`);
    return;
  }

  assert(manifest.main === './dist/index.cjs' && manifest.module === './dist/index.js', `${packageName}: compatibility entrypoints must retain ESM and CJS.`);
  for (const layer of ['core', 'theme', 'product', 'robotics']) {
    const entry = manifest.exports?.[`./${layer}`];
    assert(entry?.types === `./dist/${layer}.d.ts`, `${packageName}: ${layer} types must resolve under dist.`);
    assert(entry?.import === `./dist/${layer}.js`, `${packageName}: ${layer} ESM must resolve under dist.`);
    assert(entry?.require === `./dist/${layer}.cjs`, `${packageName}: ${layer} CJS must resolve under dist.`);
  }
}

const rootPackage = JSON.parse(await read('package.json'));
const roboticsExternalSurface = JSON.parse(await read('docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json'));
const readme = await read('readme.md');
const inventory = await read('docs/REPOSITORY_INVENTORY.md');
const workflow = await read('docs/COMPONENT_WORKFLOW.md');
const changelog = await read('CHANGELOG.md');
const deprecations = await read('docs/DEPRECATIONS.md');

assert(rootPackage.private === true, 'The workspace orchestrator must remain private.');
assert(roboticsExternalSurface.package?.name === '@lk-robotics/lds-robotics-ui', 'External Robotics surface must name the published Robotics package.');
assert(typeof roboticsExternalSurface.package?.version === 'string' && roboticsExternalSurface.package.version.length > 0, 'External Robotics surface must pin a package version.');
assert(
  rootPackage.devDependencies?.[roboticsExternalSurface.package.name] === `file:${vendoredRoboticsRelease.path}`,
  'Workspace root must resolve the approved external Robotics release from the reproducible vendored tarball.',
);
assert(
  createHash('sha256').update(await readFile(path.join(root, vendoredRoboticsRelease.path))).digest('hex') === vendoredRoboticsRelease.sha256,
  'Vendored external Robotics release checksum drift.',
);
assert(!rootPackage.dependencies || Object.keys(rootPackage.dependencies).length === 0, 'Workspace runtime dependencies must remain empty.');
assertPeerDependencies(rootPackage, 'workspace root');
assert(changelog.includes(`## ${rootPackage.version} -`), `CHANGELOG.md must include the current workspace version ${rootPackage.version}.`);
assert(deprecations.includes('# Deprecations'), 'docs/DEPRECATIONS.md must exist as the generated public deprecation register.');

for (const packageInfo of workspacePackages) {
  const manifest = JSON.parse(await read(`packages/${packageInfo.id}/package.json`));
  assert(manifest.name === packageInfo.name, `packages/${packageInfo.id}: unexpected package name.`);
  assert(manifest.version === rootPackage.version, `${packageInfo.name}: Wave 1 packages must share the workspace candidate version.`);
  assertEntry(manifest, packageInfo);
}

const policyText = `${readme}\n${inventory}\n${workflow}`;
for (const expected of [
  'private: true',
  'npm publish',
  'GitHub Packages',
  '@lk-robotics/lds-core',
  '@lk-robotics/lds-theme',
  '@lk-robotics/lds-product',
  '@lk-robotics/lds-robotics-ui',
]) {
  assert(policyText.includes(expected), `Docs must state publish or workspace package policy phrase: ${expected}`);
}

console.log('Validated workspace publish policy: publishable GitHub Packages release set, approved dependency DAG, ESM/types implementation entries, CJS compatibility facade, resource ownership, changelog, deprecations, and package-consumer documentation.');
