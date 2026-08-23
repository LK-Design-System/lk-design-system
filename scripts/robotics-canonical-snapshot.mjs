const SHA256 = /^[0-9a-f]{64}$/;
const VERSIONED_LDS_REF = /^lds-v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;

/** Translate the immutable observation stored in a published package manifest
 * to the external-surface shape. Invalid or incomplete observations are never
 * repaired from the current checkout: callers must stop instead. */
export function canonicalSnapshotFromDocumentationManifest(manifest) {
  const canonical = manifest?.source?.canonicalAdoption;
  if (
    canonical?.kind !== 'lds-ui-adoption-contract'
    || typeof canonical.version !== 'string'
    || canonical.version.length === 0
    || !SHA256.test(canonical.snapshotManifestSha256 ?? '')
    || canonical.source?.repository !== 'LK-Design-System/lk-design-system'
    || !VERSIONED_LDS_REF.test(canonical.source?.ref ?? '')
    || canonical.source?.path !== 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json'
    || !SHA256.test(canonical.source?.sha256 ?? '')
  ) {
    throw new TypeError('Published Robotics documentation has an invalid canonical LDS snapshot observation.');
  }
  return {
    kind: canonical.kind,
    contractVersion: canonical.version,
    snapshotManifestSha256: canonical.snapshotManifestSha256,
    source: { ...canonical.source },
  };
}

/** Current candidates may consume an older snapshot only when it came from a
 * versioned ref embedded in the content-addressed published Robotics package. */
export function canonicalSnapshotMode({
  currentRef,
  canonicalRef,
  surfacePackageRefStatus,
  installedPackageRefStatus,
}) {
  if (canonicalRef === currentRef) return 'current';
  if (
    VERSIONED_LDS_REF.test(canonicalRef ?? '')
    && surfacePackageRefStatus === 'published'
    && installedPackageRefStatus === 'published'
  ) {
    return 'published-historical';
  }
  throw new TypeError(
    `Canonical LDS snapshot ${JSON.stringify(canonicalRef)} is neither the current ref nor an immutable published observation.`,
  );
}

/** Publishing an LDS package set is stricter than validating an ordinary
 * source candidate. The immutable Robotics observation must point at this
 * exact LDS release identity and at the Core documentation bytes that will be
 * published from the tagged checkout. */
export function assertCurrentCanonicalSnapshot({
  currentRef,
  canonicalRef,
  canonicalSnapshotManifestSha256,
  currentSnapshotManifestSha256,
  surfacePackageRefStatus,
  installedPackageRefStatus,
}) {
  if (!VERSIONED_LDS_REF.test(currentRef ?? '')) {
    throw new TypeError(`Current LDS release ref ${JSON.stringify(currentRef)} is invalid.`);
  }
  if (canonicalRef !== currentRef) {
    throw new TypeError(
      `Release canonical LDS snapshot ref ${JSON.stringify(canonicalRef)} must equal ${JSON.stringify(currentRef)}.`,
    );
  }
  if (
    !SHA256.test(canonicalSnapshotManifestSha256 ?? '')
    || !SHA256.test(currentSnapshotManifestSha256 ?? '')
    || canonicalSnapshotManifestSha256 !== currentSnapshotManifestSha256
  ) {
    throw new TypeError(
      'Release canonical LDS snapshot hash must equal the current Core documentation manifest SHA-256.',
    );
  }
  if (surfacePackageRefStatus !== 'published' || installedPackageRefStatus !== 'published') {
    throw new TypeError(
      'Release canonical LDS snapshot requires published external-surface and installed Robotics package observations.',
    );
  }
  return 'current';
}
