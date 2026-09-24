import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SHA256 = /^[0-9a-f]{64}$/;
const VERSIONED_LDS_REF = /^lds-v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;
const REQUIRED_DERIVED_INPUT = 'adoption-checklist.json';

/** Robotics no longer bundles a copy of Core docs. It records only the Core
 * documentation inputs it derives output from (the adoption checklist and the
 * schemas it re-ships) and their fingerprint, so a Core documentation change
 * outside those inputs needs no paired Robotics release.
 *
 * Mirrors derivedInputsFingerprint in lk-design-system-robotics
 * scripts/derived-inputs.mjs; change both together. */
export function computeDerivedInputsFingerprint(inputs) {
  const lines = [...inputs]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map(({ path: inputPath, sha256 }) => `${inputPath}\n${sha256}\n`)
    .join('');
  return createHash('sha256').update(lines).digest('hex');
}

function assertDerivedInputs(inputs) {
  if (
    !Array.isArray(inputs)
    || !inputs.some(({ path: inputPath } = {}) => inputPath === REQUIRED_DERIVED_INPUT)
    || inputs.some((record) => (
      typeof record?.path !== 'string'
      || path.posix.isAbsolute(record.path)
      || path.posix.normalize(record.path).startsWith('../')
      || !SHA256.test(record.sha256 ?? '')
    ))
  ) {
    throw new TypeError(`Robotics derived inputs must be valid records that include ${REQUIRED_DERIVED_INPUT}.`);
  }
}

/** The fingerprint the given derived inputs have in a Core docs directory
 * (packages/core/docs of this checkout, or an extracted package). */
export async function currentDerivedInputsFingerprint(coreDocsRoot, inputs) {
  assertDerivedInputs(inputs);
  const current = await Promise.all(inputs.map(async ({ path: inputPath }) => ({
    path: inputPath,
    sha256: createHash('sha256')
      .update(await readFile(path.join(coreDocsRoot, ...inputPath.split('/'))))
      .digest('hex'),
  })));
  return computeDerivedInputsFingerprint(current);
}

/** Translate the immutable observation stored in a published package manifest
 * to the external-surface shape. Invalid or incomplete observations are never
 * repaired from the current checkout: callers must stop instead. */
export function canonicalSnapshotFromDocumentationManifest(manifest) {
  const canonical = manifest?.source?.canonicalAdoption;
  if (
    canonical?.kind !== 'lds-ui-adoption-contract'
    || typeof canonical.version !== 'string'
    || canonical.version.length === 0
    || !SHA256.test(canonical.derivedInputsSha256 ?? '')
    || canonical.source?.repository !== 'LK-Design-System/lk-design-system'
    || !VERSIONED_LDS_REF.test(canonical.source?.ref ?? '')
    || canonical.source?.path !== 'docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json'
    || !SHA256.test(canonical.source?.sha256 ?? '')
  ) {
    throw new TypeError('Published Robotics documentation has an invalid canonical LDS snapshot observation.');
  }
  assertDerivedInputs(canonical.derivedInputs);
  if (computeDerivedInputsFingerprint(canonical.derivedInputs) !== canonical.derivedInputsSha256) {
    throw new TypeError('Published Robotics derived-input fingerprint does not match its records.');
  }
  return {
    kind: canonical.kind,
    contractVersion: canonical.version,
    derivedInputs: canonical.derivedInputs.map((record) => ({ path: record.path, sha256: record.sha256 })),
    derivedInputsSha256: canonical.derivedInputsSha256,
    source: { ...canonical.source },
  };
}

/** A Robotics observation is current when the Core inputs it derived from are
 * byte-identical in this checkout, whatever LDS version it was taken at. An
 * older observation is still accepted from a content-addressed published
 * Robotics package, so a Core change to those inputs can land before the
 * paired Robotics release. */
export function canonicalSnapshotMode({
  canonicalRef,
  canonicalDerivedInputsSha256,
  currentDerivedInputsSha256,
  surfacePackageRefStatus,
  installedPackageRefStatus,
}) {
  if (
    SHA256.test(canonicalDerivedInputsSha256 ?? '')
    && canonicalDerivedInputsSha256 === currentDerivedInputsSha256
  ) {
    return 'current';
  }
  if (
    VERSIONED_LDS_REF.test(canonicalRef ?? '')
    && surfacePackageRefStatus === 'published'
    && installedPackageRefStatus === 'published'
  ) {
    return 'published-historical';
  }
  throw new TypeError(
    `Canonical LDS snapshot ${JSON.stringify(canonicalRef)} does not match the current Core derived inputs and is not an immutable published observation.`,
  );
}

/** Publishing an LDS package set is stricter than validating an ordinary
 * source candidate: the published Robotics observation must have been derived
 * from the Core inputs that this tagged checkout will publish. It no longer
 * has to name this exact LDS version — that rule forced a Robotics release on
 * every LDS release even when nothing Robotics consumes had changed. */
export function assertCurrentCanonicalSnapshot({
  currentRef,
  canonicalDerivedInputsSha256,
  currentDerivedInputsSha256,
  surfacePackageRefStatus,
  installedPackageRefStatus,
}) {
  if (!VERSIONED_LDS_REF.test(currentRef ?? '')) {
    throw new TypeError(`Current LDS release ref ${JSON.stringify(currentRef)} is invalid.`);
  }
  if (
    !SHA256.test(canonicalDerivedInputsSha256 ?? '')
    || !SHA256.test(currentDerivedInputsSha256 ?? '')
    || canonicalDerivedInputsSha256 !== currentDerivedInputsSha256
  ) {
    throw new TypeError(
      'Release Robotics observation must be derived from the current Core adoption inputs; release a paired Robotics package.',
    );
  }
  if (surfacePackageRefStatus !== 'published' || installedPackageRefStatus !== 'published') {
    throw new TypeError(
      'Release canonical LDS snapshot requires published external-surface and installed Robotics package observations.',
    );
  }
  return 'current';
}
