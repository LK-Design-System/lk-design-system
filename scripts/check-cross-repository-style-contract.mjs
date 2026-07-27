import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();

async function load(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
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
  assertSameStrings(`${label} local token definitions`, profile.localTokenDefinitions.names, externalSurface.localTokenDefinitions);
  assertSameStrings(
    `${label} inherited runtime custom properties`,
    profile.inheritedRuntimeCustomProperties.map((entry) => entry.name),
    externalSurface.inheritedRuntimeCustomProperties,
  );
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
  const canonicalVersions = new Map(
    styleContract.lds.packages.map((entry) => [entry.name, entry.version]),
  );
  const roboticsPackage = styleContract.profiles['robotics-ui'].package;
  canonicalVersions.set(roboticsPackage.name, roboticsPackage.version);
  for (const [profileName, profile] of Object.entries(styleContract.profiles)) {
    for (const dependency of profile.packageDependencies) {
      const expectedVersion = canonicalVersions.get(dependency.name);
      if (!expectedVersion) {
        throw new Error(`${label} ${profileName} dependency ${dependency.name} has no canonical package identity.`);
      }
      if (dependency.version !== expectedVersion) {
        throw new Error(`${label} ${profileName} dependency ${dependency.name} must pin ${expectedVersion}; received ${dependency.version}.`);
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
