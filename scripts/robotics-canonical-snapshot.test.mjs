import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  assertCurrentCanonicalSnapshot,
  canonicalSnapshotFromDocumentationManifest,
  canonicalSnapshotMode,
} from './robotics-canonical-snapshot.mjs';

const sha = 'a'.repeat(64);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const crossRepositoryCheck = path.join(scriptDirectory, 'check-cross-repository-style-contract.mjs');
const updateReleasePins = path.join(scriptDirectory, 'update-release-pins.mjs');
const packagedManifest = {
  source: {
    canonicalAdoption: {
      kind: 'lds-ui-adoption-contract',
      version: '1',
      snapshotManifestSha256: sha,
      source: {
        repository: 'LK-Design-System/lk-design-system',
        ref: 'lds-v0.1.0',
        refStatus: 'release-candidate',
        path: 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json',
        sha256: sha,
      },
    },
  },
};

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function copyFixturePath(fixtureRoot, relativePath) {
  const destination = path.join(fixtureRoot, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(repositoryRoot, relativePath), destination, { recursive: true });
}

async function createCrossRepositoryFixture() {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'lds-canonical-snapshot-'));
  for (const relativePath of [
    'package.json',
    'docs/references/package-split',
    'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json',
    'packages/conformance/fixtures',
    'packages/core/package.json',
    'packages/theme/package.json',
    'packages/product/package.json',
    'node_modules/@lk-design-system/lds-robotics-ui',
  ]) {
    await copyFixturePath(fixtureRoot, relativePath);
  }
  return fixtureRoot;
}

async function createReleasePinsFixture() {
  const fixtureRoot = await createCrossRepositoryFixture();
  await copyFixturePath(fixtureRoot, 'vendor');
  await copyFixturePath(fixtureRoot, 'packages/core/docs/manifest.json');
  return fixtureRoot;
}

async function readFixtureJson(fixtureRoot, relativePath) {
  return JSON.parse(await readFile(path.join(fixtureRoot, relativePath), 'utf8'));
}

async function writeFixtureJson(fixtureRoot, relativePath, value) {
  const bytes = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(path.join(fixtureRoot, relativePath), bytes, 'utf8');
  return Buffer.from(bytes);
}

function runCrossRepositoryCheck(fixtureRoot) {
  return spawnSync(process.execPath, [crossRepositoryCheck], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    windowsHide: true,
  });
}

function runReleasePins(fixtureRoot, args = []) {
  return spawnSync(process.execPath, [updateReleasePins, ...args], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    windowsHide: true,
  });
}

async function withCrossRepositoryFixture(callback) {
  const fixtureRoot = await createCrossRepositoryFixture();
  try {
    await callback(fixtureRoot);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
}

const installedManifestPath = 'node_modules/@lk-design-system/lds-robotics-ui/docs/package/manifest.json';
const installedPackagePath = 'node_modules/@lk-design-system/lds-robotics-ui/package.json';
const externalSurfacePath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';

async function writeInstalledManifestAndPin(fixtureRoot, manifest, mutateSurface = () => {}) {
  const manifestBytes = await writeFixtureJson(fixtureRoot, installedManifestPath, manifest);
  const surface = await readFixtureJson(fixtureRoot, externalSurfacePath);
  surface.documentation.files.manifest.sha256 = sha256(manifestBytes);
  mutateSurface(surface);
  await writeFixtureJson(fixtureRoot, externalSurfacePath, surface);
}

test('published manifest observation maps exactly to the external surface shape', () => {
  assert.deepEqual(canonicalSnapshotFromDocumentationManifest(packagedManifest), {
    kind: 'lds-ui-adoption-contract',
    contractVersion: '1',
    snapshotManifestSha256: sha,
    source: packagedManifest.source.canonicalAdoption.source,
  });
});

test('candidate accepts a different versioned snapshot only from the installed published package', () => {
  assert.equal(canonicalSnapshotMode({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.0',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), 'published-historical');
  assert.throws(() => canonicalSnapshotMode({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'main',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /neither the current ref nor an immutable published observation/);
  assert.throws(() => canonicalSnapshotMode({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.0',
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'published',
  }), /neither the current ref nor an immutable published observation/);
  assert.throws(() => canonicalSnapshotMode({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.0',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'release-candidate',
  }), /neither the current ref nor an immutable published observation/);
});

test('same-ref snapshot remains a current candidate contract', () => {
  assert.equal(canonicalSnapshotMode({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.1',
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'release-candidate',
  }), 'current');
});

test('release snapshot requires the exact current ref and Core documentation bytes', () => {
  assert.equal(assertCurrentCanonicalSnapshot({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.1',
    canonicalSnapshotManifestSha256: sha,
    currentSnapshotManifestSha256: sha,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), 'current');

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.0',
    canonicalSnapshotManifestSha256: sha,
    currentSnapshotManifestSha256: sha,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /must equal "lds-v0\.1\.1"/);

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.1',
    canonicalSnapshotManifestSha256: sha,
    currentSnapshotManifestSha256: 'b'.repeat(64),
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /must equal the current Core documentation manifest SHA-256/);

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.1',
    canonicalSnapshotManifestSha256: sha,
    currentSnapshotManifestSha256: sha,
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'published',
  }), /requires published external-surface and installed Robotics package observations/);
});

test('release snapshot rejects malformed release refs and hashes', () => {
  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'main',
    canonicalRef: 'main',
    canonicalSnapshotManifestSha256: sha,
    currentSnapshotManifestSha256: sha,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /release ref "main" is invalid/);

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'lds-v0.1.1',
    canonicalRef: 'lds-v0.1.1',
    canonicalSnapshotManifestSha256: 'not-a-hash',
    currentSnapshotManifestSha256: 'not-a-hash',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /must equal the current Core documentation manifest SHA-256/);
});

test('ordinary validation accepts an immutable published historical snapshot without comparing current LDS bytes', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });
});

test('ordinary validation rejects an unpublished historical snapshot', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const packageManifest = await readFixtureJson(fixtureRoot, installedPackagePath);
    packageManifest.lds.refStatus = 'release-candidate';
    await writeFixtureJson(fixtureRoot, installedPackagePath, packageManifest);

    const documentationManifest = await readFixtureJson(fixtureRoot, installedManifestPath);
    documentationManifest.source.robotics.refStatus = 'release-candidate';
    await writeInstalledManifestAndPin(fixtureRoot, documentationManifest, (surface) => {
      surface.package.refStatus = 'release-candidate';
    });

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /neither the current ref nor an immutable published observation/);
  });
});

test('ordinary validation rejects a malformed historical observation', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const documentationManifest = await readFixtureJson(fixtureRoot, installedManifestPath);
    documentationManifest.source.canonicalAdoption.source.ref = 'main';
    await writeInstalledManifestAndPin(fixtureRoot, documentationManifest);

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid canonical LDS snapshot observation/);
  });
});

test('ordinary validation rejects a historical installed/external observation mismatch', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const documentationManifest = await readFixtureJson(fixtureRoot, installedManifestPath);
    documentationManifest.source.canonicalAdoption.snapshotManifestSha256 = 'b'.repeat(64);
    await writeInstalledManifestAndPin(fixtureRoot, documentationManifest);

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /installed canonical LDS snapshot differs from the external surface/);
  });
});

test('ordinary current-mode validation still rejects drift in current LDS bytes', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const rootManifest = await readFixtureJson(fixtureRoot, 'package.json');
    rootManifest.version = '0.1.0';
    await writeFixtureJson(fixtureRoot, 'package.json', rootManifest);

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical adoption contract hash drift/);
  });
});

test('release-pin first write without an installed package preserves canonical provenance and hash', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const before = await readFixtureJson(fixtureRoot, externalSurfacePath);
    await rm(path.join(fixtureRoot, 'node_modules/@lk-design-system/lds-robotics-ui'), {
      recursive: true,
      force: true,
      maxRetries: 3,
    });

    const result = runReleasePins(fixtureRoot);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /1차만 끝났다/);
    const after = await readFixtureJson(fixtureRoot, externalSurfacePath);
    assert.deepEqual(
      after.documentation.canonicalContract,
      before.documentation.canonicalContract,
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release-only gate remains strict for a published historical observation', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const result = runReleasePins(fixtureRoot, ['--check', '--require-current-canonical-snapshot']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must equal "lds-v0\.1\.1"/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release-pin ordinary current mode rejects local canonical contract hash drift', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const result = runReleasePins(fixtureRoot, ['--check', '--lds', '0.1.0']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical contract hash does not match the local canonical path/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release-only current mode rejects local canonical contract hash drift', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const result = runReleasePins(fixtureRoot, [
      '--check',
      '--lds',
      '0.1.0',
      '--require-current-canonical-snapshot',
    ]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical contract hash does not match the local canonical path/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});
