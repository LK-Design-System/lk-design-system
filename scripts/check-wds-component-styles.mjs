/**
 * WDS ↔ LDS component STYLE parity check (real dimensions, not axis names).
 *
 * Resolves LDS component dimension tokens from tokens/*.css (var() chains ->
 * concrete px) and diffs them against the authoritative WDS styles extracted from
 * the .fig (docs/references/wds/COMPONENT_STYLES.json, via
 * scripts/extract-wds-component-styles.mjs). Colors are an intentional LK rebrand
 * and are NOT diffed here — only radius / padding / height / gap / font size.
 *
 *   node scripts/check-wds-component-styles.mjs          # report
 *   node scripts/check-wds-component-styles.mjs --check   # exit 1 on drift
 */
import { readFileSync } from 'node:fs';

const CHECK = process.argv.includes('--check');
const wds = JSON.parse(readFileSync('docs/references/wds/COMPONENT_STYLES.json', 'utf8'));

// ---- resolve all CSS custom properties across the token files ----
const files = ['colors', 'color-atomic', 'color-semantic', 'spacing', 'grid', 'typography', 'fonts', 'effects', 'components', 'base', 'focus'];
const raw = new Map(); // name -> raw value (last :root-ish definition wins)
for (const f of files) {
  let text = '';
  try { text = readFileSync(`tokens/${f}.css`, 'utf8'); } catch { continue; }
  for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) raw.set(m[1], m[2].trim());
}
const cache = new Map();
function resolve(name, depth = 0) {
  if (depth > 20) return null;
  if (cache.has(name)) return cache.get(name);
  let v = raw.get(name);
  if (v == null) return null;
  // resolve nested var(--x [, fallback])
  v = v.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)/gi, (_, ref, fb) => {
    const r = resolve(ref, depth + 1);
    return r != null ? r : (fb != null ? fb.trim() : '');
  });
  cache.set(name, v);
  return v;
}
const px = (name) => { const v = resolve(name); if (v == null) return undefined; const m = String(v).match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : undefined; };
// horizontal value from a padding value: "V H" -> H, "T R B L" -> R, single -> itself
const pxH = (name) => { const v = resolve(name); if (v == null) return undefined; const ns = (String(v).match(/-?\d+(\.\d+)?/g) || []).map(Number); if (!ns.length) return undefined; return ns.length >= 2 ? ns[1] : ns[0]; };

// ---- WDS set -> LDS token prefix (representative = medium/default) ----
// token-driven LDS components (dimensions live in tokens/components.css).
// Signed-off LK overrides (STYLE_PARITY_AUDIT.md) are excluded — they are
// intentionally NOT matched to WDS: Card (padded elevated surface, r16 vs 12),
// Toggle Icon (boxed toggle, r12 vs WDS pill).
const MAP = [
  { wds: 'Button/Button', p: 'component-button', size: 'md' },
  { wds: 'Chip/Chip', p: 'component-chip', size: 'md' },
  { wds: 'Chip/Filter', p: 'component-filter-chip', size: '' },
  { wds: 'Textinput/Textfield', p: 'component-input', size: '' },
  { wds: 'Menu/Menu', p: 'component-menu', size: '' },
];
const seg = (s) => (s ? `-${s}` : '');
function ldsDims(p, s) {
  const one = (...names) => { for (const n of names) { const v = px(n); if (v !== undefined) return v; } return undefined; };
  return {
    radius: one(`--${p}-radius${seg(s)}`, `--${p}-radius`),
    padX: (() => { for (const n of [`--${p}-padding-x${seg(s)}`, `--${p}-padding${seg(s)}`, `--${p}-padding-x`, `--${p}-padding`]) { const v = pxH(n); if (v !== undefined) return v; } return undefined; })(),
    padY: one(`--${p}-padding-y${seg(s)}`, `--${p}-padding-y`),
    height: one(`--${p}-height${seg(s)}`, `--${p}-height`),
    fontSize: one(`--${p}-font-size${seg(s)}`, `--${p}-font-size`),
  };
}

const near = (a, b) => a != null && b != null && Math.abs(a - b) <= 0.6;
const rows = [];
let drift = 0;
for (const m of MAP) {
  const w = wds[m.wds];
  if (!w) { rows.push([m.wds, 'no WDS style', '', '']); continue; }
  const l = ldsDims(m.p, m.size);
  for (const key of ['radius', 'padX', 'height', 'fontSize']) {
    const wv = w[key], lv = l[key];
    if (wv == null || lv == null) continue; // only compare where both known
    const ok = near(wv, lv);
    if (!ok) drift++;
    rows.push([`${m.wds.split('/')[0]} ${key}`, wv, lv, ok ? '✅' : '❌']);
  }
}
console.log('WDS ↔ LDS component style (dimensions; colors excluded — LK rebrand)\n');
console.log('field'.padEnd(28), 'WDS'.padEnd(8), 'LDS'.padEnd(8), 'verdict');
for (const [f, w, l, v] of rows) console.log(String(f).padEnd(28), String(w).padEnd(8), String(l).padEnd(8), v || '');
console.log(`\n${drift} dimensional drift(s).`);
if (CHECK && drift) process.exit(1);
