import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import semver from 'semver';

const root = process.cwd();

async function load(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function descendant(directory, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath || relativePath.includes('\\')) return null;
  const absolute = path.resolve(directory, relativePath);
  const relative = path.relative(directory, absolute);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? absolute : null;
}

async function walk(directory, output = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute, output);
    else if (entry.isFile()) output.push(absolute);
  }
  return output;
}

function contractWithoutProjectedReferences(contract) {
  return {
    ...contract,
    facets: (contract.facets ?? []).map((facet) => ({ ...facet, references: [] })),
    componentMapping: { ...contract.componentMapping, references: [] },
  };
}

function formatErrors(errors = []) {
  return errors.map((error) => `${error.instancePath || '/'} ${error.message}`).join('\n');
}

const contractPath = 'docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.json';
const contractSchemaPath = 'docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.schema.json';
const surfacePath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
const surfaceSchemaPath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.schema.json';
const lds3dSurfacePath = 'docs/references/package-split/LDS3D_EXTERNAL_SURFACE.json';
const lds3dSurfaceSchemaPath = 'docs/references/package-split/LDS3D_EXTERNAL_SURFACE.schema.json';
const fixtureContractPath = 'packages/conformance/fixtures/contract.json';
const fixtureSurfacePath = 'packages/conformance/fixtures/lds/external-surface.json';
const fixtureLds3dSurfacePath = 'packages/conformance/fixtures/lds/lds3d-external-surface.json';
const roboticsPolicyPath = 'docs/references/package-split/ROBOTICS_NAVIGATION_STATE_BADGE_CONTRACT.json';
const roboticsPolicySchemaPath = 'docs/references/package-split/ROBOTICS_POLICY_CONTRACT.schema.json';
const fixtureRoboticsPolicyPath = 'packages/conformance/fixtures/lds/robotics-policy.json';

const [
  contract,
  contractSchema,
  surface,
  surfaceSchema,
  lds3dSurface,
  lds3dSurfaceSchema,
  fixtureContract,
  fixtureSurface,
  fixtureLds3dSurface,
  roboticsPolicy,
  roboticsPolicySchema,
  fixtureRoboticsPolicy,
] = await Promise.all([
  load(contractPath),
  load(contractSchemaPath),
  load(surfacePath),
  load(surfaceSchemaPath),
  load(lds3dSurfacePath),
  load(lds3dSurfaceSchemaPath),
  load(fixtureContractPath),
  load(fixtureSurfacePath),
  load(fixtureLds3dSurfacePath),
  load(roboticsPolicyPath),
  load(roboticsPolicySchemaPath),
  load(fixtureRoboticsPolicyPath),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

for (const [label, schema, value] of [
  ['cross-repository style contract', contractSchema, contract],
  ['Robotics external surface', surfaceSchema, surface],
  ['LDS3D external surface', lds3dSurfaceSchema, lds3dSurface],
  ['fixture style contract', contractSchema, fixtureContract],
  ['fixture Robotics external surface', surfaceSchema, fixtureSurface],
  ['fixture LDS3D external surface', lds3dSurfaceSchema, fixtureLds3dSurface],
  ['Robotics navigation state-badge policy', roboticsPolicySchema, roboticsPolicy],
  ['fixture Robotics policy', roboticsPolicySchema, fixtureRoboticsPolicy],
]) {
  const validate = ajv.compile(schema);
  if (!validate(value)) {
    throw new Error(`${label} does not match its schema:\n${formatErrors(validate.errors)}`);
  }
}

function assertSameStrings(label, left, right) {
  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();
  if (JSON.stringify(normalizedLeft) !== JSON.stringify(normalizedRight)) {
    throw new Error(`${label} differ between the style contract and external-surface manifest.`);
  }
}

function checkRoboticsProfile(styleContract, externalSurface, label) {
  const profile = styleContract.profiles['robotics-ui'];
  if (externalSurface.package.name !== profile.package.name
    || externalSurface.package.version !== profile.package.version
    || externalSurface.package.repository !== profile.repository) {
    throw new Error(`${label} package identity differs between the style contract and external-surface manifest.`);
  }
  assertSameStrings(`${label} local token definitions`, profile.localTokenDefinitions.names, externalSurface.localTokenDefinitions);
  assertSameStrings(
    `${label} inherited runtime custom properties`,
    profile.inheritedRuntimeCustomProperties.map((entry) => entry.name),
    externalSurface.inheritedRuntimeCustomProperties,
  );
}

async function checkRoboticsDocumentation(externalSurface, packageRoot, ldsSourceRoot, label) {
  const docs = externalSurface.documentation;
  const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  const bundleRoot = path.posix.dirname(docs.files.manifest.path);
  const canonicalPath = descendant(ldsSourceRoot, docs.canonicalContract.source.path);
  if (!canonicalPath) throw new Error(`${label} canonical adoption source escapes the LDS root.`);
  const canonicalBytes = await readFile(canonicalPath);
  if (sha256(canonicalBytes) !== docs.canonicalContract.source.sha256) {
    throw new Error(`${label} canonical adoption contract hash drift.`);
  }
  const canonicalContract = JSON.parse(canonicalBytes);
  if (canonicalContract.kind !== docs.canonicalContract.kind
    || canonicalContract.contractVersion !== docs.canonicalContract.contractVersion) {
    throw new Error(`${label} canonical adoption contract identity or version drift.`);
  }

  const declared = [...Object.values(docs.files), ...docs.domainDocuments];
  const paths = declared.map((entry) => entry.path);
  if (new Set(paths).size !== paths.length) throw new Error(`${label} documentation paths are not unique.`);
  for (const record of declared) {
    const target = descendant(packageRoot, record.path);
    if (!target) throw new Error(`${label} documentation path escapes its package: ${record.path}.`);
    const bytes = await readFile(target);
    if (sha256(bytes) !== record.sha256) throw new Error(`${label} documentation hash drift: ${record.path}.`);
  }

  const manifest = JSON.parse(await readFile(path.join(packageRoot, docs.files.manifest.path), 'utf8'));
  const expectedIdentity = { name: externalSurface.package.name, version: externalSurface.package.version, layer: 'robotics' };
  if (manifest.schemaVersion !== 1
    || manifest.kind !== 'lds-package-documentation'
    || JSON.stringify(manifest.package) !== JSON.stringify(expectedIdentity)) {
    throw new Error(`${label} packaged documentation manifest identity drift.`);
  }
  if (manifest.adoption?.contractKind !== docs.canonicalContract.kind
    || manifest.adoption?.contractVersion !== docs.canonicalContract.contractVersion) {
    throw new Error(`${label} packaged adoption identity or version drift.`);
  }
  if (JSON.stringify(manifest.publicDocs) !== JSON.stringify(docs.publicDocs)) {
    throw new Error(`${label} packaged and external-surface public documentation URLs differ.`);
  }
  const expectedCanonicalSource = {
    kind: docs.canonicalContract.kind,
    version: docs.canonicalContract.contractVersion,
    source: docs.canonicalContract.source,
    snapshotManifestSha256: docs.canonicalContract.snapshotManifestSha256,
  };
  if (JSON.stringify(manifest.source?.canonicalAdoption) !== JSON.stringify(expectedCanonicalSource)) {
    throw new Error(`${label} packaged canonical adoption source differs from the external surface.`);
  }
  if (JSON.stringify(manifest.source?.robotics) !== JSON.stringify({
    repository: externalSurface.package.repository,
    ref: `v${externalSurface.package.version}`,
    refStatus: externalSurface.package.refStatus,
  })) {
    throw new Error(`${label} packaged Robotics source identity or version drift.`);
  }
  const expectedEntrypoints = {
    llms: `./${path.posix.relative(bundleRoot, docs.files.llms.path)}`,
    adoptionChecklist: `./${path.posix.relative(bundleRoot, docs.files.checklist.path)}`,
    adoptionReportSchema: `./${path.posix.relative(bundleRoot, docs.files.reportSchema.path)}`,
    adoptionReportExample: `./${path.posix.relative(bundleRoot, docs.files.reportExample.path)}`,
    adoptionConfigSchema: `./${path.posix.relative(bundleRoot, docs.files.configSchema.path)}`,
    adoptionWorkflow: `./${path.posix.relative(bundleRoot, docs.files.workflow.path)}`,
    domainIndex: `./${path.posix.relative(bundleRoot, docs.files.domainIndex.path)}`,
    tokenManifest: `./${path.posix.relative(bundleRoot, docs.files.tokenManifest.path)}`,
    domainSymbolRegistry: `./${path.posix.relative(bundleRoot, docs.files.domainSymbolRegistry.path)}`,
  };
  if (JSON.stringify(manifest.entrypoints) !== JSON.stringify(expectedEntrypoints)) {
    throw new Error(`${label} packaged documentation entrypoint drift.`);
  }
  const expectedResources = {
    tokens: {
      path: `./${path.posix.relative(bundleRoot, docs.files.tokenManifest.path)}`,
      sha256: docs.files.tokenManifest.sha256,
    },
    domainSymbols: {
      path: `./${path.posix.relative(bundleRoot, docs.files.domainSymbolRegistry.path)}`,
      sha256: docs.files.domainSymbolRegistry.sha256,
    },
  };
  if (JSON.stringify(manifest.resources) !== JSON.stringify(expectedResources)) {
    throw new Error(`${label} packaged documentation resource records differ from the external surface.`);
  }

  const docsRoot = path.join(packageRoot, ...bundleRoot.split('/'));
  const actualFiles = (await walk(docsRoot))
    .map((file) => path.relative(docsRoot, file).replaceAll('\\', '/'))
    .filter((file) => file !== 'manifest.json')
    .sort();
  const records = Array.isArray(manifest.documents) ? manifest.documents : [];
  const recordPaths = records.map((record) => record.path).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(recordPaths)) {
    throw new Error(`${label} documentation manifest does not cover the complete docs directory.`);
  }
  const recordByPath = new Map();
  for (const record of records) {
    if (recordByPath.has(record.path)) throw new Error(`${label} duplicate documentation manifest record: ${record.path}.`);
    recordByPath.set(record.path, record);
    const target = descendant(docsRoot, record.path);
    if (!target || sha256(await readFile(target)) !== record.sha256) {
      throw new Error(`${label} documentation manifest hash drift: ${record.path}.`);
    }
  }
  for (const record of declared.filter((entry) => entry.path !== docs.files.manifest.path)) {
    const relative = path.posix.relative(bundleRoot, record.path);
    if (recordByPath.get(relative)?.sha256 !== record.sha256) {
      throw new Error(`${label} external-surface and manifest records differ: ${record.path}.`);
    }
  }
  const expectedDomainRecords = docs.domainDocuments.map((record) => ({
    path: path.posix.relative(bundleRoot, record.path),
    sha256: record.sha256,
  }));
  const actualDomainRecords = Array.isArray(manifest.domain?.documents)
    ? manifest.domain.documents.map((record) => ({ path: record.path, sha256: record.sha256 }))
    : [];
  if (JSON.stringify(actualDomainRecords) !== JSON.stringify(expectedDomainRecords)) {
    throw new Error(`${label} packaged domain document records differ from the external surface.`);
  }
  for (const record of manifest.domain?.documents ?? []) {
    if (typeof record.sourcePath !== 'string' || !/^[0-9a-f]{64}$/.test(record.sourceSha256 ?? '')) {
      throw new Error(`${label} packaged domain document source provenance is incomplete: ${record.path}.`);
    }
  }

  const checklist = JSON.parse(await readFile(path.join(packageRoot, docs.files.checklist.path), 'utf8'));
  if (JSON.stringify(contractWithoutProjectedReferences(checklist))
    !== JSON.stringify(contractWithoutProjectedReferences(canonicalContract))) {
    throw new Error(`${label} packaged checklist decisions differ from the canonical adoption contract.`);
  }
  const checklistFile = path.join(packageRoot, docs.files.checklist.path);
  const references = [
    ...(checklist.facets ?? []).flatMap((facet) => facet.references ?? []),
    ...(checklist.componentMapping?.references ?? []),
  ];
  for (const reference of references) {
    if (typeof reference !== 'string' || /^https?:/.test(reference) || reference.startsWith('@')) {
      throw new Error(`${label} checklist is not self-contained: ${reference}.`);
    }
    const target = path.resolve(path.dirname(checklistFile), reference);
    const relative = path.relative(packageRoot, target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`${label} checklist reference escapes the package: ${reference}.`);
    }
    await access(target).catch(() => {
      throw new Error(`${label} checklist reference does not resolve: ${reference}.`);
    });
  }

  const expectedExports = {
    './package.json': './package.json',
    './design-system.json': `./${docs.files.manifest.path}`,
    './llms.txt': `./${docs.files.llms.path}`,
    './adoption-checklist.json': `./${docs.files.checklist.path}`,
    './docs/*': `./${bundleRoot}/*`,
  };
  for (const [subpath, target] of Object.entries(expectedExports)) {
    if (packageJson.exports?.[subpath] !== target) throw new Error(`${label} package export ${subpath} must target ${target}.`);
  }
  const bundlePublished = packageJson.files?.some((entry) => entry === bundleRoot || bundleRoot.startsWith(`${entry.replace(/\/$/, '')}/`));
  const packageInstructions = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'llms.txt'];
  if (!packageInstructions.every((file) => packageJson.files?.includes(file)) || !bundlePublished) {
    throw new Error(`${label} package files must include ${packageInstructions.join(', ')} and cover ${bundleRoot}.`);
  }
  if (packageJson.lds?.layer !== 'robotics'
    || packageJson.lds?.manifest !== `./${docs.files.manifest.path}`
    || packageJson.lds?.llms !== `./${docs.files.llms.path}`
    || packageJson.lds?.adoptionChecklist !== `./${docs.files.checklist.path}`
    || packageJson.lds?.adoptionReportSchema !== `./${docs.files.reportSchema.path}`
    || packageJson.lds?.storybook !== docs.publicDocs.storybook
    || packageJson.homepage !== docs.publicDocs.storybook) {
    throw new Error(`${label} package LDS metadata or live documentation URL drift.`);
  }
}

function checkLds3dProfile(styleContract, externalSurface, label) {
  const profile = styleContract.profiles['lds3d-ui'];
  const workspaceIdentity = profile.workspacePackage;
  if (externalSurface.package.manifest !== workspaceIdentity.manifest
    || externalSurface.package.name !== workspaceIdentity.name
    || externalSurface.package.version !== workspaceIdentity.version
    || externalSurface.package.repository !== profile.repository) {
    throw new Error(`${label} workspace identity differs between the style contract and external-surface manifest.`);
  }
  assertSameStrings(
    `${label} runtime custom properties`,
    profile.runtimeCustomProperties.map((entry) => entry.name),
    externalSurface.runtimeCustomProperties,
  );
  assertSameStrings(
    `${label} headless package manifests`,
    profile.headlessPackages.map((entry) => entry.manifest),
    externalSurface.packages.map((entry) => entry.manifest),
  );
}

function checkProfileDependencyPins(styleContract, label) {
  const canonicalPackages = new Set(styleContract.lds.packages.map((entry) => entry.name));
  const roboticsPackage = styleContract.profiles['robotics-ui'].package;
  canonicalPackages.add(roboticsPackage.name);
  for (const [profileName, profile] of Object.entries(styleContract.profiles)) {
    for (const dependency of profile.packageDependencies) {
      if (!canonicalPackages.has(dependency.name)) {
        throw new Error(`${label} ${profileName} dependency ${dependency.name} has no canonical package identity.`);
      }
      // Consumer profiles record the exact version they have verified; they do
      // not move in lockstep with every additive LDS release. The corresponding
      // external-surface checks above prove that the profile and consumer
      // snapshot agree. Reject ranges and local links while allowing an older
      // immutable release to remain pinned until that consumer is upgraded.
      if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(dependency.version)) {
        throw new Error(`${label} ${profileName} dependency ${dependency.name} must use an exact immutable version; received ${dependency.version}.`);
      }
      // `declaredRange` is what the satellite writes in package.json, and it
      // answers a different question than `version`: not "what did we verify"
      // but "what will this install against". A peer declared as an exact
      // version makes npm nest a second copy of the design system the moment
      // the host moves one release ahead — and a satellite can never name the
      // release being cut, because it installs LDS from the registry and that
      // version is not published yet. Only peers may widen this way, and the
      // range must still cover the verified version.
      if (dependency.declaredRange !== undefined) {
        if (dependency.section !== 'peerDependencies') {
          throw new Error(`${label} ${profileName} dependency ${dependency.name} declares a range in ${dependency.section}; only peerDependencies may widen.`);
        }
        if (!semver.validRange(dependency.declaredRange)) {
          throw new Error(`${label} ${profileName} dependency ${dependency.name} declaredRange is not a valid semver range; received ${dependency.declaredRange}.`);
        }
        if (!semver.satisfies(dependency.version, dependency.declaredRange, { includePrerelease: true })) {
          throw new Error(`${label} ${profileName} dependency ${dependency.name} declaredRange ${dependency.declaredRange} does not cover the verified version ${dependency.version}.`);
        }
      }
    }
  }
}

checkRoboticsProfile(contract, surface, 'Robotics');
checkLds3dProfile(contract, lds3dSurface, 'LDS3D');
checkRoboticsProfile(fixtureContract, fixtureSurface, 'Fixture Robotics');
checkLds3dProfile(fixtureContract, fixtureLds3dSurface, 'Fixture LDS3D');
checkProfileDependencyPins(contract, 'Production contract');
checkProfileDependencyPins(fixtureContract, 'Fixture contract');
await checkRoboticsDocumentation(
  surface,
  path.join(root, 'node_modules', '@lk-design-system', 'lds-robotics-ui'),
  root,
  'Robotics',
);
await checkRoboticsDocumentation(
  fixtureSurface,
  path.join(root, 'packages', 'conformance', 'fixtures', 'robotics'),
  path.join(root, 'packages', 'conformance', 'fixtures', 'lds'),
  'Fixture Robotics',
);

if (contract.profiles['robotics-ui'].policyContracts.length !== 1
  || contract.profiles['robotics-ui'].policyContracts[0] !== roboticsPolicyPath
  || roboticsPolicy.profile !== 'robotics-ui') {
  throw new Error('Production Robotics profile must consume the authoritative navigation state-badge policy.');
}
if (fixtureContract.profiles['robotics-ui'].policyContracts.length !== 1
  || fixtureContract.profiles['robotics-ui'].policyContracts[0] !== 'robotics-policy.json'
  || fixtureRoboticsPolicy.profile !== 'robotics-ui') {
  throw new Error('Fixture Robotics profile must consume its policy fixture.');
}

for (const packageContract of contract.lds.packages) {
  const packageJson = await load(`${packageContract.workspace}/package.json`);
  if (packageJson.name !== packageContract.name || packageJson.version !== packageContract.version) {
    throw new Error(`LDS package contract mismatch for ${packageContract.workspace}.`);
  }
}

console.log(`Cross-repository style contract is valid (schema v${contract.schemaVersion}, Robotics + LDS3D profiles).`);
