/**
 * Full WDS→LDS component census.
 *
 * Enumerates every published WDS component set, deep-reconstructs its primary
 * container style (INSTANCE-resolved), and name-maps it to the LDS export
 * surface. Output: coverage inventory (matched / WDS-only=missing candidate /
 * LDS-only=extra) plus a candidate style snapshot for matched sets.
 *
 * Auto-mapping and auto-element-pick are heuristic — treat unmatched/diff rows
 * as CANDIDATES to verify, not conclusions.
 *
 *   node scripts/census-wds-components.mjs            # table
 *   node scripts/census-wds-components.mjs --json     # full JSON
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { sets, skeleton, pickDefault } from './extract-wds-styles-deep.mjs';

const OUT = 'docs/references/wds/COMPONENT_CENSUS.json';
const asJson = process.argv.includes('--json');

// ---- LDS export surface ----
const idx = readFileSync('src/index.js', 'utf8');
const ldsNames = [...new Set([...idx.matchAll(/\b([A-Z][A-Za-z0-9]+)\b/g)].map((m) => m[1]))]
  .filter((n) => !/^(BRAND|LOGO|NAMES|React|Fragment)$/i.test(n));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const ldsNorm = new Map(ldsNames.map((n) => [norm(n), n]));

// ---- WDS published sets (exclude internal/resource/icon primitives) ----
const EXCLUDE = /Resource|Knob|Ratio|Blur|Mask|Shadow|Interaction|Scroll ?Bar|Dummy|Gradient|Placeholder|^Icon\/|\bIcon\b\/[A-Z]| \/ |Handle|Cursor|Overlay\/|Status Bar|Home Bar/i;
// bare icon glyphs (single word, 24x24, no path) and Figma-internal/example artifacts
const ICON_OR_INTERNAL = /^(Business Bag|Camera|Chevron Left|Chevron Right|Face Smile|Heart|Home|Like|Message|Message Text|Person|Search|Send|Star|Thunder|Verified Check|Verified Star|Bookmark|Bubble|Document Person|Filter|Lock|Blank|Overlay|Image|Test|Name|Measure|Essential\/Essential|agent alt.*|Project_.*|Arrow with Texts.*|Decorate\/Opacity|Shape\/Pill|Inspect\/Measure|Spacing\/.*|Safari\/.*|GNB\/.*)$/;
// known WDS→LDS naming aliases (same component, different name)
const ALIAS = { 'Framed Style/Framed Style': 'ChoiceCard', 'Tab/Tab': 'Tabs', 'Navigation/Navigation': 'NavRail', 'Top Navigation/Top Navigation': 'TopBar', 'Navigation Bar/Navigation Bar': 'MobileSystemBars' };
const published = [...sets.keys()].filter((k) => !EXCLUDE.test(k) && !ICON_OR_INTERNAL.test(k)).sort();

// map a WDS set name to an LDS export, trying each path segment + the joined form
function mapToLds(setName) {
  if (ALIAS[setName] && ldsNorm.has(norm(ALIAS[setName]))) return ALIAS[setName];
  const segs = setName.split('/').map((s) => s.trim()).filter(Boolean);
  // try specific joined forms FIRST so "Chip/Filter" -> FilterChip, not Chip
  const ordered = [];
  if (segs.length >= 2) { ordered.push(norm(segs.at(-1) + segs[0]), norm(segs[0] + segs.at(-1)), norm(segs.at(-1) + segs.at(-2))); }
  for (const s of segs) ordered.push(norm(s));
  for (const c of ordered) if (ldsNorm.has(c)) return ldsNorm.get(c);
  const cands = new Set(ordered);
  // containment (either direction), longest LDS name wins to avoid over-broad hits
  let best = null;
  for (const c of cands) {
    for (const [ln, orig] of ldsNorm) {
      if (c.length >= 3 && (ln.includes(c) || c.includes(ln)) && (!best || orig.length > best.length)) best = orig;
    }
  }
  return best;
}

// primary container of a set: shallowest styled frame with radius|fill and width>=40
function primaryStyle(setName) {
  const set = sets.get(setName);
  const variant = pickDefault(set.vk);
  const sk = skeleton(variant);
  const cont = sk.find((e) => (e.radius != null || e.fill) && (e.w || 0) >= 40 && /FRAME|ROUNDED|SYMBOL|INSTANCE/.test(e.type)) || sk[0];
  const text = sk.filter((e) => e.type === 'TEXT' && e.fontSize).sort((a, b) => b.fontSize - a.fontSize)[0];
  return { variant: variant.name, w: cont.w, h: cont.h, radius: cont.radius, padX: cont.padX, padY: cont.padY, fontSize: text?.fontSize };
}

const matched = [], wdsOnly = [];
const usedLds = new Set();
for (const setName of published) {
  const lds = mapToLds(setName);
  const style = primaryStyle(setName);
  if (lds) { matched.push({ set: setName, lds, ...style }); usedLds.add(lds); }
  else wdsOnly.push({ set: setName, ...style });
}
const ldsOnly = ldsNames.filter((n) => !usedLds.has(n)).sort();

const report = { summary: { publishedWdsSets: published.length, ldsExports: ldsNames.length, matched: matched.length, wdsOnly: wdsOnly.length, ldsOnly: ldsOnly.length }, matched, wdsOnly, ldsOnly };
writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');

if (asJson) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }
console.log(`WDS→LDS component census  (wrote ${OUT})\n`);
console.log(`Published WDS sets: ${published.length}   LDS exports: ${ldsNames.length}`);
console.log(`  matched: ${matched.length}   WDS-only (missing candidates): ${wdsOnly.length}   LDS-only (extras): ${ldsOnly.length}\n`);
console.log(`── WDS-only (in WDS, no obvious LDS match — verify if missing) ──`);
for (const w of wdsOnly) console.log(`  ${w.set.padEnd(40)} ${w.w ?? '?'}x${w.h ?? '?'} r=${w.radius ?? '-'}`);
console.log(`\n── LDS-only (in LDS, no WDS set matched — LK additions) ──`);
console.log('  ' + ldsOnly.join(', '));
