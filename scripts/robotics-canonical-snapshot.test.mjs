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
  computeDerivedInputsFingerprint,
} from './robotics-canonical-snapshot.mjs';

const sha = 'a'.repeat(64);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const crossRepositoryCheck = path.join(scriptDirectory, 'check-cross-repository-style-contract.mjs');
const updateReleasePins = path.join(scriptDirectory, 'update-release-pins.mjs');
const externalSurfacePath = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
const workspaceManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'));
const currentLdsVersion = workspaceManifest.version;
const currentLdsRef = `lds-v${currentLdsVersion}`;
const historicalLdsRef = currentLdsVersion === '0.1.0' ? 'lds-v0.0.0' : 'lds-v0.1.0';
const derivedInputs = [
  { path: 'adoption-checklist.json', sha256: sha },
  { path: 'adoption-report.schema.json', sha256: 'c'.repeat(64) },
];
const derivedInputsSha256 = computeDerivedInputsFingerprint(derivedInputs);
const otherFingerprint = 'b'.repeat(64);
const packagedManifest = {
  source: {
    canonicalAdoption: {
      kind: 'lds-ui-adoption-contract',
      version: '1',
      derivedInputs,
      derivedInputsSha256,
      source: {
        repository: 'LK-Design-System/lk-design-system',
        ref: currentLdsRef,
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
    'packages/core/docs',
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

async function changeCoreDerivedInput(fixtureRoot) {
  const examplePath = path.join(fixtureRoot, 'packages/core/docs/adoption-report.example.json');
  await writeFile(examplePath, `${await readFile(examplePath, 'utf8')}\n`);
}

const installedManifestPath = 'node_modules/@lk-design-system/lds-robotics-ui/docs/package/manifest.json';
const installedPackagePath = 'node_modules/@lk-design-system/lds-robotics-ui/package.json';
const canonicalContractPath = 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json';

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
    derivedInputs,
    derivedInputsSha256,
    source: packagedManifest.source.canonicalAdoption.source,
  });
});

test('observation must carry the checklist and a fingerprint that matches its records', () => {
  const withInputs = (inputs, fingerprint = computeDerivedInputsFingerprint(inputs)) => ({
    source: {
      canonicalAdoption: {
        ...packagedManifest.source.canonicalAdoption,
        derivedInputs: inputs,
        derivedInputsSha256: fingerprint,
      },
    },
  });
  assert.throws(
    () => canonicalSnapshotFromDocumentationManifest(withInputs([{ path: 'adoption-report.schema.json', sha256: sha }])),
    /must be valid records that include adoption-checklist.json/,
  );
  assert.throws(
    () => canonicalSnapshotFromDocumentationManifest(withInputs(derivedInputs, otherFingerprint)),
    /fingerprint does not match its records/,
  );
});

test('a Core documentation change outside the derived inputs keeps the observation current', () => {
  // The ref no longer matters: the observation was taken at an older LDS
  // version, but the Core inputs Robotics derives from are unchanged.
  assert.equal(canonicalSnapshotMode({
    canonicalRef: historicalLdsRef,
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: derivedInputsSha256,
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'release-candidate',
  }), 'current');
});

test('changed derived inputs are accepted only from the installed published package', () => {
  const changed = {
    canonicalRef: historicalLdsRef,
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: otherFingerprint,
  };
  assert.equal(canonicalSnapshotMode({
    ...changed,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), 'published-historical');
  assert.throws(() => canonicalSnapshotMode({
    ...changed,
    canonicalRef: 'main',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /does not match the current Core derived inputs and is not an immutable published observation/);
  assert.throws(() => canonicalSnapshotMode({
    ...changed,
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'published',
  }), /is not an immutable published observation/);
  assert.throws(() => canonicalSnapshotMode({
    ...changed,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'release-candidate',
  }), /is not an immutable published observation/);
});

test('release gate requires the current derived inputs, not the current LDS ref', () => {
  assert.equal(assertCurrentCanonicalSnapshot({
    currentRef: currentLdsRef,
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: derivedInputsSha256,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), 'current');

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: currentLdsRef,
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: otherFingerprint,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /derived from the current Core adoption inputs/);

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: currentLdsRef,
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: derivedInputsSha256,
    surfacePackageRefStatus: 'release-candidate',
    installedPackageRefStatus: 'published',
  }), /requires published external-surface and installed Robotics package observations/);
});

test('release gate rejects malformed release refs and fingerprints', () => {
  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: 'main',
    canonicalDerivedInputsSha256: derivedInputsSha256,
    currentDerivedInputsSha256: derivedInputsSha256,
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /release ref "main" is invalid/);

  assert.throws(() => assertCurrentCanonicalSnapshot({
    currentRef: currentLdsRef,
    canonicalDerivedInputsSha256: 'not-a-hash',
    currentDerivedInputsSha256: 'not-a-hash',
    surfacePackageRefStatus: 'published',
    installedPackageRefStatus: 'published',
  }), /derived from the current Core adoption inputs/);
});

test('ordinary validation accepts the installed Robotics observation', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  });
});

test('ordinary validation rejects changed derived inputs from an unpublished Robotics package', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const packageManifest = await readFixtureJson(fixtureRoot, installedPackagePath);
    packageManifest.lds.refStatus = 'release-candidate';
    await writeFixtureJson(fixtureRoot, installedPackagePath, packageManifest);

    const documentationManifest = await readFixtureJson(fixtureRoot, installedManifestPath);
    documentationManifest.source.robotics.refStatus = 'release-candidate';
    await writeInstalledManifestAndPin(fixtureRoot, documentationManifest, (surface) => {
      surface.package.refStatus = 'release-candidate';
    });
    await changeCoreDerivedInput(fixtureRoot);

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /is not an immutable published observation/);
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
    documentationManifest.source.canonicalAdoption.source.sha256 = 'b'.repeat(64);
    await writeInstalledManifestAndPin(fixtureRoot, documentationManifest);

    const result = runCrossRepositoryCheck(fixtureRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /installed canonical LDS snapshot differs from the external surface/);
  });
});

test('ordinary current-mode validation still rejects drift in current LDS bytes', async () => {
  await withCrossRepositoryFixture(async (fixtureRoot) => {
    const canonicalContract = await readFixtureJson(fixtureRoot, canonicalContractPath);
    canonicalContract.contractVersion = 'drifted';
    await writeFixtureJson(fixtureRoot, canonicalContractPath, canonicalContract);

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

test('release gate stays green when Core docs change outside the derived inputs', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const coreManifestPath = path.join(fixtureRoot, 'packages/core/docs/manifest.json');
    await writeFile(coreManifestPath, `${await readFile(coreManifestPath, 'utf8')}\n`);
    const result = runReleasePins(fixtureRoot, ['--check', '--require-current-canonical-snapshot']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release gate fails when a derived Core input changes without a paired Robotics release', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    await changeCoreDerivedInput(fixtureRoot);
    const result = runReleasePins(fixtureRoot, ['--check', '--require-current-canonical-snapshot']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /derived from the current Core adoption inputs/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release-pin ordinary current mode rejects local canonical contract hash drift', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const canonicalContract = await readFixtureJson(fixtureRoot, canonicalContractPath);
    canonicalContract.contractVersion = 'drifted';
    await writeFixtureJson(fixtureRoot, canonicalContractPath, canonicalContract);
    const result = runReleasePins(fixtureRoot, ['--check', '--lds', currentLdsVersion]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical contract hash does not match the local canonical path/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});

test('release-only current mode rejects local canonical contract hash drift', async () => {
  const fixtureRoot = await createReleasePinsFixture();
  try {
    const canonicalContract = await readFixtureJson(fixtureRoot, canonicalContractPath);
    canonicalContract.contractVersion = 'drifted';
    await writeFixtureJson(fixtureRoot, canonicalContractPath, canonicalContract);
    const result = runReleasePins(fixtureRoot, [
      '--check',
      '--lds',
      currentLdsVersion,
      '--require-current-canonical-snapshot',
    ]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical contract hash does not match the local canonical path/);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true, maxRetries: 3 });
  }
});
