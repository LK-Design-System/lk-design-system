/**
 * Freeze the LDS-owned dimension baseline from the historical WDS extraction.
 *
 * Re-anchoring (2026-08-16, OPERATING_MODEL.md "Reference authority"): the live
 * dimension gates no longer compare against WDS as an external authority — LDS
 * owns its own baseline. This script copies the historical extraction artifacts
 * (docs/references/wds/COMPONENT_STYLES{,_DEEP}.json) into
 * docs/references/lds-baseline/ with an adoption record, preserving provenance
 * without keeping the archive on the live gate path.
 *
 * Values are copied byte-for-byte — adoption changes authority, not values.
 * Re-run only if the baseline files are lost; changing a baseline VALUE is a
 * design-owner decision recorded in the baseline README, never a re-freeze.
 *
 *   node scripts/freeze-lds-baseline.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'docs/references/lds-baseline';
const ADOPTION = {
  authority: 'lds',
  adoptedFrom: 'WDS parity extraction (docs/references/wds/, fig-derived); values byte-matched at adoption',
  adoptedAt: '2026-08-16',
  releaseLine: '0.1.0-rc.69.19',
  decision: 'docs/OPERATING_MODEL.md — Reference authority',
};

mkdirSync(OUT_DIR, { recursive: true });

const jobs = [
  ['docs/references/wds/COMPONENT_STYLES.json', `${OUT_DIR}/COMPONENT_DIMENSIONS.json`],
  ['docs/references/wds/COMPONENT_STYLES_DEEP.json', `${OUT_DIR}/COMPONENT_DIMENSIONS_DEEP.json`],
];
for (const [src, dst] of jobs) {
  const sets = JSON.parse(readFileSync(src, 'utf8'));
  writeFileSync(dst, `${JSON.stringify({ ...ADOPTION, sets }, null, 2)}\n`);
  console.log(`Froze ${Object.keys(sets).length} sets: ${src} -> ${dst}`);
}
