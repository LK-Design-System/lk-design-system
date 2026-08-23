import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertCurrentCanonicalSnapshot,
  canonicalSnapshotFromDocumentationManifest,
  canonicalSnapshotMode,
} from './robotics-canonical-snapshot.mjs';

const sha = 'a'.repeat(64);
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
