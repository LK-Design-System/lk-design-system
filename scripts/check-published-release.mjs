import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as wait } from 'node:timers/promises';

const DEFAULT_REGISTRY = 'https://npm.pkg.github.com';
const DEFAULT_ATTEMPTS = 8;
const DEFAULT_RETRY_DELAY_MS = 2_000;
const RELEASE_PACKAGES = [
  { id: 'core', name: '@lk-design-system/lds-core' },
  { id: 'theme', name: '@lk-design-system/lds-theme' },
  { id: 'product', name: '@lk-design-system/lds-product' },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function positiveInteger(value, fallback, label) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  assert(Number.isInteger(parsed) && parsed > 0, `${label} must be a positive integer.`);
  return parsed;
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

export function expectedDistTagForVersion(version) {
  assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version), `Invalid release version: ${version}.`);
  return version.includes('-') ? 'rc' : 'latest';
}

function registryView({ spec, fields, registry, root }) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(
    npmCommand,
    ['view', spec, ...fields, '--json', '--registry', registry],
    { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' },
  );
  const output = `${result.stdout || ''}\n${result.stderr || ''}\n${result.error?.message || ''}`.trim();
  if (result.status !== 0) {
    throw new Error(`npm view ${spec} failed against ${registry}: ${output || `exit ${result.status}`}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`npm view ${spec} returned invalid JSON from ${registry}: ${result.stdout.trim() || '(empty)'}`);
  }
}

async function readReleaseIdentity(root) {
  const rootPackage = await readJson(root, 'package.json');
  const version = rootPackage.version;
  const packages = [];

  for (const packageInfo of RELEASE_PACKAGES) {
    const manifest = await readJson(root, `packages/${packageInfo.id}/package.json`);
    assert(manifest.name === packageInfo.name, `packages/${packageInfo.id} must be ${packageInfo.name}.`);
    assert(manifest.version === version, `${manifest.name} must use workspace release version ${version}.`);
    packages.push({ name: manifest.name, version: manifest.version });
  }

  return { version, packages };
}

async function verifyAttempt({ packages, releaseTag, registry, root, view }) {
  const verified = [];

  for (const expected of packages) {
    const metadata = await view({
      spec: `${expected.name}@${expected.version}`,
      fields: ['name', 'version', 'dist.integrity'],
      registry,
      root,
    });
    const integrity = metadata?.['dist.integrity'] ?? metadata?.dist?.integrity;
    assert(metadata?.name === expected.name, `${expected.name}@${expected.version} registry name mismatch: ${metadata?.name ?? '(missing)'}.`);
    assert(metadata?.version === expected.version, `${expected.name} registry version mismatch: ${metadata?.version ?? '(missing)'}.`);
    assert(typeof integrity === 'string' && integrity.length > 0, `${expected.name}@${expected.version} must expose registry integrity metadata.`);

    const distTags = await view({
      spec: expected.name,
      fields: ['dist-tags'],
      registry,
      root,
    });
    const actualTagVersion = distTags?.[releaseTag] ?? distTags?.['dist-tags']?.[releaseTag];
    assert(
      actualTagVersion === expected.version,
      `${expected.name} dist-tag ${releaseTag} must identify ${expected.version}; received ${actualTagVersion ?? '(missing)'}.`,
    );
    verified.push({ ...expected, integrity });
  }

  return verified;
}

export async function verifyPublishedRelease({
  root = process.cwd(),
  registry = DEFAULT_REGISTRY,
  releaseTag,
  attempts = DEFAULT_ATTEMPTS,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  view = registryView,
  sleep = wait,
  logger = console,
} = {}) {
  const normalizedAttempts = positiveInteger(attempts, DEFAULT_ATTEMPTS, 'attempts');
  const normalizedRetryDelayMs = positiveInteger(retryDelayMs, DEFAULT_RETRY_DELAY_MS, 'retryDelayMs');
  const identity = await readReleaseIdentity(root);
  const expectedReleaseTag = expectedDistTagForVersion(identity.version);
  assert(
    releaseTag === undefined || releaseTag === expectedReleaseTag,
    `Release ${identity.version} must use npm dist-tag ${expectedReleaseTag}; received ${releaseTag}.`,
  );

  let lastError;
  for (let attempt = 1; attempt <= normalizedAttempts; attempt += 1) {
    try {
      const packages = await verifyAttempt({
        packages: identity.packages,
        releaseTag: expectedReleaseTag,
        registry,
        root,
        view,
      });
      logger.log(
        `Validated published LDS package set: ${identity.version} via ${expectedReleaseTag} in ${registry}; `
        + `${packages.length} package identities expose integrity metadata.`,
      );
      return { ...identity, releaseTag: expectedReleaseTag, packages };
    } catch (error) {
      lastError = error;
      if (attempt < normalizedAttempts) {
        logger.warn(`Published package set is not yet consistent (attempt ${attempt}/${normalizedAttempts}): ${error.message}`);
        await sleep(normalizedRetryDelayMs);
      }
    }
  }

  throw new Error(
    `Published LDS package set ${identity.version} was not available with a consistent ${expectedReleaseTag} identity `
    + `after ${normalizedAttempts} attempts. Last error: ${lastError?.message ?? '(unknown)'}`,
    { cause: lastError },
  );
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) {
  verifyPublishedRelease({
    releaseTag: process.env.RELEASE_NPM_TAG,
    attempts: process.env.LDS_PUBLISHED_RELEASE_ATTEMPTS,
    retryDelayMs: process.env.LDS_PUBLISHED_RELEASE_RETRY_DELAY_MS,
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
