import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const workspacePackages = [
  { id: 'core', layer: 'core', name: '@lk-design-system/lds-core', dependencies: [], resources: ['tokens', 'assets'] },
  { id: 'theme', layer: 'theme', name: '@lk-design-system/lds-theme', dependencies: ['@lk-design-system/lds-core'], resources: ['tokens', 'assets'] },
  // Product ships tokens because it owns a component tier of its own — the
  // `--component-viewer-*` surfaces every viewer frame and its consumers read.
  // That is not the semantic tier: Core and Theme still own `--color-`,
  // `--space-`, `--radius-`, and `--font-`, and product only composes them.
  { id: 'product', layer: 'product', name: '@lk-design-system/lds-product', dependencies: ['@lk-design-system/lds-core'], resources: ['tokens', 'assets'] },
  {
    id: 'compat',
    layer: 'compatibility',
    name: '@lk-design-system/design-system-core',
    dependencies: ['@lk-design-system/lds-core', '@lk-design-system/lds-theme', '@lk-design-system/lds-product'],
    externalDependencies: ['@lk-design-system/lds-robotics-ui'],
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
  assert(manifest.files?.includes('README.md'), `${packageName}: files must include the generated README.`);
  assert(manifest.files?.includes('docs'), `${packageName}: files must include generated package docs.`);
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

  for (const [subpath, target] of Object.entries({
    './package.json': './package.json',
    './design-system.json': './docs/manifest.json',
    './llms.txt': './docs/llms.txt',
    './adoption-checklist.json': './docs/adoption-checklist.json',
    './docs/*': './docs/*',
  })) {
    assert(manifest.exports?.[subpath] === target, `${packageName}: ${subpath} must publish ${target}.`);
  }
  assert(manifest.lds?.schemaVersion === 1, `${packageName}: lds.schemaVersion must be 1.`);
  assert(manifest.lds?.layer === packageInfo.layer, `${packageName}: lds.layer must be ${packageInfo.layer}.`);
  for (const [field, target] of Object.entries({
    manifest: './docs/manifest.json',
    llms: './docs/llms.txt',
    adoptionChecklist: './docs/adoption-checklist.json',
    adoptionReportSchema: './docs/adoption-report.schema.json',
  })) {
    assert(manifest.lds?.[field] === target, `${packageName}: lds.${field} must target ${target}.`);
  }
  assert(
    manifest.lds?.storybook?.startsWith('https://lk-design-system.github.io/lk-design-system/'),
    `${packageName}: lds.storybook must expose the live documentation.`,
  );
  assert(manifest.homepage === manifest.lds.storybook, `${packageName}: homepage must match lds.storybook.`);

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
const vendoredRoboticsRelease = roboticsExternalSurface.vendoredArtifact;
const readme = await read('readme.md');
const vendorReadme = await read('vendor/README.md');
const inventory = await read('docs/REPOSITORY_INVENTORY.md');
const workflow = await read('docs/COMPONENT_WORKFLOW.md');
const changelog = await read('CHANGELOG.md');
const deprecations = await read('docs/DEPRECATIONS.md');

assert(rootPackage.private === true, 'The workspace orchestrator must remain private.');
assert(roboticsExternalSurface.package?.name === '@lk-design-system/lds-robotics-ui', 'External Robotics surface must name the published Robotics package.');
assert(typeof roboticsExternalSurface.package?.version === 'string' && roboticsExternalSurface.package.version.length > 0, 'External Robotics surface must pin a package version.');
assert(roboticsExternalSurface.schemaVersion === 3 && roboticsExternalSurface.documentation, 'External Robotics surface must expose the v3 documentation contract.');
assert(vendoredRoboticsRelease?.path && vendoredRoboticsRelease?.sha256, 'External Robotics surface must pin the vendored tarball path and SHA-256.');
assert(vendoredRoboticsRelease.path.includes(roboticsExternalSurface.package.version), 'Vendored Robotics filename must include the external package version.');
assert(
  rootPackage.devDependencies?.[roboticsExternalSurface.package.name] === `file:${vendoredRoboticsRelease.path}`,
  'Workspace root must resolve the approved external Robotics release from the reproducible vendored tarball.',
);
assert(
  createHash('sha256').update(await readFile(path.join(root, vendoredRoboticsRelease.path))).digest('hex') === vendoredRoboticsRelease.sha256,
  'Vendored external Robotics release checksum drift.',
);
const vendorTarballs = (await readdir(path.join(root, 'vendor'))).filter((entry) => entry.endsWith('.tgz')).sort();
assert(
  JSON.stringify(vendorTarballs) === JSON.stringify([path.basename(vendoredRoboticsRelease.path)]),
  'vendor/ must contain exactly the Robotics tarball declared by the external surface.',
);
for (const expected of [
  path.basename(vendoredRoboticsRelease.path),
  `${roboticsExternalSurface.package.name}@${roboticsExternalSurface.package.version}`,
  vendoredRoboticsRelease.sha256,
]) {
  assert(vendorReadme.includes(expected), `vendor/README.md must identify the approved Robotics artifact: ${expected}`);
}
const installedRoboticsRoot = path.join(root, 'node_modules', '@lk-design-system', 'lds-robotics-ui');
const installedRobotics = JSON.parse(await readFile(path.join(installedRoboticsRoot, 'package.json'), 'utf8'));
const roboticsDocumentation = roboticsExternalSurface.documentation;
const roboticsBundleRoot = path.posix.dirname(roboticsDocumentation.files.manifest.path);
assert(
  installedRobotics.name === roboticsExternalSurface.package.name
    && installedRobotics.version === roboticsExternalSurface.package.version,
  'Installed Robotics identity must match the external surface.',
);
assert(
  ['README.md', 'AGENTS.md', 'CLAUDE.md', 'llms.txt'].every((file) => installedRobotics.files?.includes(file))
    && installedRobotics.files?.some((entry) => entry === roboticsBundleRoot || roboticsBundleRoot.startsWith(`${entry.replace(/\/$/, '')}/`)),
  `Robotics must publish README.md, AGENTS.md, CLAUDE.md, llms.txt and cover ${roboticsBundleRoot}.`,
);
for (const [subpath, target] of Object.entries({
  './package.json': './package.json',
  './design-system.json': `./${roboticsDocumentation.files.manifest.path}`,
  './llms.txt': `./${roboticsDocumentation.files.llms.path}`,
  './adoption-checklist.json': `./${roboticsDocumentation.files.checklist.path}`,
  './docs/*': `./${roboticsBundleRoot}/*`,
})) {
  assert(installedRobotics.exports?.[subpath] === target, `Robotics ${subpath} must publish ${target}.`);
}
assert(
  installedRobotics.lds?.schemaVersion === 1
    && installedRobotics.lds?.layer === 'robotics'
    && installedRobotics.lds?.manifest === `./${roboticsDocumentation.files.manifest.path}`
    && installedRobotics.lds?.llms === `./${roboticsDocumentation.files.llms.path}`
    && installedRobotics.lds?.adoptionChecklist === `./${roboticsDocumentation.files.checklist.path}`
    && installedRobotics.lds?.adoptionReportSchema === `./${roboticsDocumentation.files.reportSchema.path}`
    && installedRobotics.lds?.storybook === roboticsDocumentation.publicDocs.storybook
    && installedRobotics.homepage === roboticsDocumentation.publicDocs.storybook,
  'Robotics LDS metadata or public documentation URL drift.',
);
for (const record of [
  ...Object.values(roboticsDocumentation.files),
  ...roboticsDocumentation.domainDocuments,
]) {
  const absolute = path.resolve(installedRoboticsRoot, record.path);
  const relative = path.relative(installedRoboticsRoot, absolute);
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `Unsafe Robotics documentation path: ${record.path}.`);
  const bytes = await readFile(absolute);
  assert(createHash('sha256').update(bytes).digest('hex') === record.sha256, `Robotics documentation hash drift: ${record.path}.`);
}
assert(!rootPackage.dependencies || Object.keys(rootPackage.dependencies).length === 0, 'Workspace runtime dependencies must remain empty.');
assertPeerDependencies(rootPackage, 'workspace root');
assert(changelog.includes(`## ${rootPackage.version} -`), `CHANGELOG.md must include the current workspace version ${rootPackage.version}.`);
assert(deprecations.includes('# Deprecations'), 'docs/DEPRECATIONS.md must exist as the generated public deprecation register.');

for (const packageInfo of workspacePackages) {
  const manifest = JSON.parse(await read(`packages/${packageInfo.id}/package.json`));
  assert(manifest.name === packageInfo.name, `packages/${packageInfo.id}: unexpected package name.`);
  assert(manifest.version === rootPackage.version, `${packageInfo.name}: Wave 1 packages must share the workspace candidate version.`);
  assertEntry(manifest, packageInfo);
  for (const relative of [
    'README.md',
    'docs/manifest.json',
    'docs/llms.txt',
    'docs/adoption-checklist.json',
    'docs/adoption-report.schema.json',
  ]) await read(`packages/${packageInfo.id}/${relative}`);
  const docsManifest = JSON.parse(await read(`packages/${packageInfo.id}/docs/manifest.json`));
  assert(docsManifest.package?.name === manifest.name, `${packageInfo.name}: documentation manifest name drift.`);
  assert(docsManifest.package?.version === manifest.version, `${packageInfo.name}: documentation manifest version drift.`);
  assert(docsManifest.package?.layer === packageInfo.layer, `${packageInfo.name}: documentation manifest layer drift.`);
}

const policyText = `${readme}\n${inventory}\n${workflow}`;
for (const expected of [
  'private: true',
  'npm publish',
  'GitHub Packages',
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
  '@lk-design-system/lds-robotics-ui',
]) {
  assert(policyText.includes(expected), `Docs must state publish or workspace package policy phrase: ${expected}`);
}

console.log('Validated workspace publish policy: publishable GitHub Packages release set, approved dependency DAG, ESM/types implementation entries, CJS compatibility facade, resource ownership, generated adoption docs, changelog, deprecations, and package-consumer documentation.');
