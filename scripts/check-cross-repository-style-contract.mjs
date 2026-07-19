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
const fixtureContractPath = 'packages/conformance/fixtures/contract.json';
const fixtureSurfacePath = 'packages/conformance/fixtures/lds/external-surface.json';

const [contract, contractSchema, surface, surfaceSchema, fixtureContract, fixtureSurface] = await Promise.all([
  load(contractPath),
  load(contractSchemaPath),
  load(surfacePath),
  load(surfaceSchemaPath),
  load(fixtureContractPath),
  load(fixtureSurfacePath),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

for (const [label, schema, value] of [
  ['cross-repository style contract', contractSchema, contract],
  ['Robotics external surface', surfaceSchema, surface],
  ['fixture style contract', contractSchema, fixtureContract],
  ['fixture Robotics external surface', surfaceSchema, fixtureSurface],
]) {
  const validate = ajv.compile(schema);
  if (!validate(value)) {
    throw new Error(`${label} does not match its schema:\n${formatErrors(validate.errors)}`);
  }
}

const profile = contract.profiles['robotics-ui'];
const contractLocal = [...profile.localTokenDefinitions.names].sort();
const surfaceLocal = [...surface.localTokenDefinitions].sort();
if (JSON.stringify(contractLocal) !== JSON.stringify(surfaceLocal)) {
  throw new Error('Robotics local token definitions differ between the style contract and external-surface manifest.');
}

for (const packageContract of contract.lds.packages) {
  const packageJson = await load(`${packageContract.workspace}/package.json`);
  if (packageJson.name !== packageContract.name || packageJson.version !== packageContract.version) {
    throw new Error(`LDS package contract mismatch for ${packageContract.workspace}.`);
  }
}

console.log(`Cross-repository style contract is valid (schema v${contract.schemaVersion}, Robotics profile).`);
