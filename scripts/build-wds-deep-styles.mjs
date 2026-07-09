/**
 * Build docs/references/wds/COMPONENT_STYLES_DEEP.json — the authoritative
 * reconstructed style of the *meaningful inner element* of each component whose
 * geometry lives inside a referenced/nested symbol (so the shallow top-level
 * extractor can't see it). Uses extract-wds-styles-deep.mjs, which resolves
 * INSTANCE → master symbol, so these values are the real rendered styles.
 *
 *   node scripts/build-wds-deep-styles.mjs
 *
 * Each entry names the WDS set, the variant pick, and the element to read; the
 * output feeds the rendered parity harness (check-wds-component-styles-rendered)
 * which measures the corresponding LDS inner element and diffs.
 */
import { writeFileSync } from 'node:fs';
import { elementStyle } from './extract-wds-styles-deep.mjs';

const OUT = 'docs/references/wds/COMPONENT_STYLES_DEEP.json';

// key -> how to reconstruct its authoritative inner element from the .fig
const SPEC = {
  'Checkbox/box@md': { set: 'Control/Checkbox', pick: 'Size=Medium, State=Checked, Tight=False, Bold=False, Disable=False', name: /^Box$/ },
  'Checkbox/box@sm': { set: 'Control/Checkbox', pick: 'Size=Small, State=Checked, Tight=False, Bold=False, Disable=False', name: /^Box$/ },
  'Radio/box@md': { set: 'Control/Radio', pick: 'Size=Medium, State=Checked, Tight=False, Disable=False', name: /^Box$/ },
  'Radio/box@sm': { set: 'Control/Radio', pick: 'Size=Small, State=Checked, Tight=False, Disable=False', name: /^Box$/ },
  'Menu/container': { set: 'Menu/Menu', pick: 'Variant=Normal', name: /^Container$/, minW: 100, has: 'radius' },
  'AutoComplete/container': { set: 'Auto Complete/Auto Complete', pick: 'Variant=Normal', name: /^Container$/, minW: 100, has: 'radius' },
  'Tooltip/bubble': { set: 'Tooltip/Tooltip', pick: 'Position=Bottom', name: /^Container$/, minW: 40, has: 'radius' },
  'Alert/modal@web': { set: 'Alert/Alert', pick: 'Platform=Web', name: /^Modal$/, has: 'radius' },
  'ListCell/interaction': { set: 'List Cell/List Cell', pick: 'Selected=False, Disable=False', name: /^Interaction$/, minW: 100, has: 'radius' },
  'Pagination/chip': { set: 'Pagination/Navigation', pick: 'Variant=Extended', name: /^Background$/, minW: 40, has: 'radius' },
};

const out = {};
for (const [key, s] of Object.entries(SPEC)) {
  const el = elementStyle(s.set, { pick: s.pick, name: s.name, minW: s.minW, minH: s.minH, has: s.has });
  if (!el) { console.log(`⚠ ${key}: element not found in ${s.set}`); continue; }
  out[key] = {
    set: s.set, variant: el.variant, element: el.name,
    w: el.w, h: el.h, radius: el.radius, padX: el.padX, padY: el.padY, gap: el.gap,
    fill: el.fill, stroke: el.stroke, strokeWeight: el.strokeWeight, fontSize: el.fontSize,
  };
}
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${OUT} (${Object.keys(out).length} reconstructed inner elements)\n`);
for (const [k, v] of Object.entries(out)) {
  console.log(`${k.padEnd(24)} ${v.w}x${v.h} r=${v.radius} pad=${v.padX ?? '-'}/${v.padY ?? '-'} sw=${v.strokeWeight ?? '-'} fs=${v.fontSize ?? '-'}  (${v.set} · ${v.element})`);
}
