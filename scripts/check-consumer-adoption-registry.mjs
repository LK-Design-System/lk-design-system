import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const registryPath = path.join(root, 'docs/references/adoption/LDS_CONSUMER_REGISTRY.json');
const schemaPath = path.join(root, 'docs/references/adoption/LDS_CONSUMER_REGISTRY.schema.json');
const workspaceArg = process.argv.find((argument) => argument.startsWith('--workspace-root='));
const workspaceRoot = workspaceArg ? path.resolve(workspaceArg.slice('--workspace-root='.length)) : null;
const expectedIds = new Set(['portal', 'web-viz']);
const expectedRepositories = {
  portal: 'LK-ROBOTICS-AX/lk_portal',
  'web-viz': 'LK-ROBOTICS/lk_web_viz',
};
const consumerRoots = {
  portal: ['ops', 'lk-portal'],
  'web-viz': ['ops', 'lk_web_viz', 'frontend'],
};

function fail(message) {
  throw new Error(`Consumer adoption registry failed: ${message}`);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${label} is not valid JSON (${error.message})`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

const schema = readJson(schemaPath, 'LDS_CONSUMER_REGISTRY.schema.json');
const registry = readJson(registryPath, 'LDS_CONSUMER_REGISTRY.json');
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
const validate = ajv.compile(schema);
assert(validate(registry), (validate.errors || []).map((error) => `${error.instancePath || '/'} ${error.message}`).join('; '));

assert(registry.entries.length === expectedIds.size, 'registry must contain exactly portal and web-viz entries');
const ids = new Set();
for (const entry of registry.entries) {
  assert(!ids.has(entry.id), `duplicate consumer id ${entry.id}`);
  ids.add(entry.id);
  assert(expectedIds.has(entry.id), `unexpected consumer id ${entry.id}`);
  assert(entry.repository === expectedRepositories[entry.id], `${entry.id} repository identity drifted`);
  assert(entry.evidenceFreshness === 'current' || (entry.evidenceFreshness === 'stale' && entry.staleReason), `${entry.id} evidence freshness needs a current value or staleReason`);
  assert(entry.packages.some((item) => item.name === '@lk-design-system/lds-core'), `${entry.id} must pin lds-core`);
  assert(entry.packages.some((item) => item.name === '@lk-design-system/lds-theme'), `${entry.id} must pin lds-theme`);
  assert(entry.packages.some((item) => item.name === '@lk-design-system/lds-product'), `${entry.id} must pin lds-product`);
  for (const item of entry.packages) {
    if (['@lk-design-system/lds-core', '@lk-design-system/lds-theme', '@lk-design-system/lds-product'].includes(item.name)) {
      assert(item.version === registry.ldsVersion, `${entry.id} ${item.name} must match registry ldsVersion`);
    }
  }
  const attestationPath = path.join(root, 'docs/references/adoption', entry.attestation);
  assert(existsSync(attestationPath), `${entry.id} attestation is missing: ${entry.attestation}`);
  const attestation = readJson(attestationPath, `${entry.id} attestation`);
  assert(attestation.kind === 'lds-consumer-attestation', `${entry.id} attestation kind is invalid`);
  assert(attestation.consumerId === entry.id, `${entry.id} attestation consumerId drifted`);
  assert(attestation.profile === entry.profile, `${entry.id} attestation profile drifted`);
  assert(entry.legacyActiveReferences === 0, `${entry.id} still has active legacy references`);
}

if (workspaceRoot) {
  for (const entry of registry.entries) {
    const consumerRoot = path.join(workspaceRoot, ...consumerRoots[entry.id]);
    const packageJsonPath = path.join(consumerRoot, 'package.json');
    assert(existsSync(packageJsonPath), `${entry.id} package.json is missing at ${path.relative(workspaceRoot, packageJsonPath)}`);
    const packageJson = readJson(packageJsonPath, `${entry.id} package.json`);
    const dependencies = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
    for (const item of entry.packages) {
      assert(dependencies[item.name] === `file:${item.artifactPath.split('/').slice(entry.id === 'portal' ? 2 : 3).join('/')}`
        || dependencies[item.name]?.endsWith(`/${path.basename(item.artifactPath)}`),
      `${entry.id} dependency ${item.name} does not point at ${path.basename(item.artifactPath)}`);
      const artifactPath = path.join(workspaceRoot, ...item.artifactPath.split('/'));
      assert(existsSync(artifactPath), `${entry.id} artifact is missing: ${item.artifactPath}`);
      assert(sha256(artifactPath) === item.sha256, `${entry.id} artifact checksum drifted: ${item.artifactPath}`);
    }

    const sourceFiles = entry.id === 'portal'
      ? ['src/app/layout.tsx', 'src/components/layout/LdsRuntimeBoundary.tsx', 'src/app/globals.css']
      : ['index.html', 'src/contexts/ThemeContext.tsx', 'src/index.css', 'src/screens/LdsOrganizationScreen.tsx'];
    const source = sourceFiles.map((relative) => readFileSync(path.join(consumerRoot, relative), 'utf8')).join('\n');
    assert(source.includes(`data-lds-profile="${entry.profile}"`) || source.includes(`defaultProfile="${entry.profile}"`), `${entry.id} source does not activate profile ${entry.profile}`);
    assert(source.includes('@lk-design-system/lds-core/styles.css'), `${entry.id} is missing Core styles`);
    assert(source.includes('@lk-design-system/lds-theme/styles.css'), `${entry.id} is missing Theme styles`);
    assert(source.includes('@lk-design-system/lds-product/styles.css'), `${entry.id} is missing Product styles`);
    assert(!source.includes('@lk-design-system/lds-editorial-ui'), `${entry.id} has an active retired Editorial reference`);
    assert(!source.includes('@design-system/core'), `${entry.id} has an active aggregate design-system reference`);
  }
}

console.log(`Validated LDS consumer registry: ${registry.entries.length} consumers, ${registry.entries.reduce((sum, entry) => sum + entry.packages.length, 0)} package pins${workspaceRoot ? ' with workspace checks' : ''}.`);
