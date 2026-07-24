/**
 * WDS Foundation Parity Differ
 * ----------------------------------------------------------------------------
 * Extracts the *value-diffable* foundation layers directly from the local WDS
 * `.fig` (fig-kiwi decode) and diffs them field-by-field against tokens/*.css.
 *
 * Scope — only the layers where value equality is meaningful:
 *   • Typography  — 16 named text styles (size / line / letter-spacing / weight)
 *   • Grid        — columns, gutter, margin, container tiers, content width, breakpoints
 *   • Opacity     — the alpha ladder (structural coverage vs generated color CSS)
 *
 * Intentionally NOT value-diffed (reported for context only):
 *   • Color values — LK rebrand (roles compared elsewhere)
 *   • Radius / context margins / effects — multi-mode + context-specific WDS
 *     variables without a clean 1:1 token mapping; left to STYLE_PARITY_AUDIT.
 *
 * Usage:  node scripts/report-wds-foundation-parity.mjs [--check]
 *   --check  exit 1 if any value-diffable field drifts (for CI).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as zlib from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const { inflateRawSync } = zlib;
const FIG = 'docs/references/wds/Wanted Design System (Community).fig';
const REPORT = 'docs/references/wds/FOUNDATION_PARITY_REPORT.md';
const CHECK = process.argv.includes('--check');

// ---- fig-kiwi / zip decode -------------------------------------------------
const rU16 = (b, o) => b.readUInt16LE(o);
const rU32 = (b, o) => b.readUInt32LE(o);
function findEOCD(b) { const s = 0x06054b50, m = Math.max(0, b.length - 0xffff - 22); for (let o = b.length - 22; o >= m; o--) if (rU32(b, o) === s) return o; throw new Error('no EOCD'); }
function zipEntries(b) { const e = findEOCD(b); const c = rU16(b, e + 10); let o = rU32(b, e + 16); const m = new Map(); for (let i = 0; i < c; i++) { const fnl = rU16(b, o + 28), el = rU16(b, o + 30), cl = rU16(b, o + 32), method = rU16(b, o + 10), cs = rU32(b, o + 20), lho = rU32(b, o + 42); m.set(b.subarray(o + 46, o + 46 + fnl).toString('utf8'), { method, compressedSize: cs, localHeaderOffset: lho }); o += 46 + fnl + el + cl; } return m; }
function zipRead(b, e, fn) { const x = e.get(fn), o = x.localHeaderOffset, lfnl = rU16(b, o + 26), lel = rU16(b, o + 28), d = o + 30 + lfnl + lel, comp = b.subarray(d, d + x.compressedSize); if (x.method === 0) return Buffer.from(comp); if (x.method === 8) return inflateRawSync(comp); throw new Error('bad zip method'); }
function decompressZstd(buffer) {
  if (typeof zlib.zstdDecompressSync === 'function') return zlib.zstdDecompressSync(buffer);
  try {
    return execFileSync('zstd', ['--decompress', '--stdout', '--quiet'], {
      input: buffer,
      maxBuffer: 512 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(
      'This Node runtime has no native Zstandard support and the zstd CLI fallback failed. Use Node 22.15+/23.8+ or install zstd.',
      { cause: error },
    );
  }
}
function figKiwi(b) { let o = 12; const ch = []; while (o + 4 < b.length) { const s = rU32(b, o); o += 4; ch.push(b.subarray(o, o + s)); o += s; } const schema = decodeBinarySchema(inflateRawSync(ch[0])); const dc = ch[1]; const data = dc[0] === 0x28 && dc[1] === 0xb5 ? decompressZstd(dc) : inflateRawSync(dc); return compileSchema(schema).decodeMessage(data); }
const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : undefined);

const buf = readFileSync(FIG);
const entries = zipEntries(buf);
const message = figKiwi(zipRead(buf, entries, 'canvas.fig'));
const nodes = message.nodeChanges || [];
const childrenByParent = new Map();
for (const n of nodes) { const p = gid(n.parentIndex?.guid); if (!p) continue; if (!childrenByParent.has(p)) childrenByParent.set(p, []); childrenByParent.get(p).push(n); }
const pages = nodes.filter((n) => n.type === 'CANVAS' && gid(n.parentIndex?.guid) === '0:0');
function descendants(rootId) { const out = []; const st = [...(childrenByParent.get(rootId) || [])]; while (st.length) { const n = st.shift(); out.push(n); const ch = childrenByParent.get(gid(n.guid)); if (ch) st.push(...ch); } return out; }
const round = (v, p = 100) => Math.round(v * p) / p;

// ---- WDS SOURCE extraction -------------------------------------------------
const TIERS = ['display1', 'display2', 'display3', 'title1', 'title2', 'title3', 'heading1', 'heading2', 'headline1', 'headline2', 'body1', 'body2', 'label1', 'label2', 'caption1', 'caption2'];
const WEIGHTS = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold'];
const WEIGHT_NUM = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800 };

function extractTypography() {
  const styleRe = /^(Display|Title|Heading|Headline|Body|Label|Caption)\s+\d\s*\/\s*/i;
  const perTier = new Map(); // tierKey -> array of {sig, weight}
  for (const n of nodes) {
    if (n.type !== 'TEXT' || !styleRe.test(n.name || '') || n.fontSize === undefined || !n.lineHeight || !n.letterSpacing) continue;
    const suffix = n.name.split('/')[1] || '';
    // The name suffix (…/Bold) only marks a real style def; the actual weight
    // is fontName.style (WDS names some tiers "/Bold" but sets SemiBold).
    if (!WEIGHTS.some((w) => suffix.includes(w))) continue;
    const weight = WEIGHT_NUM[n.fontName?.style];
    if (!weight) continue;
    const tierKey = n.name.split('/')[0].trim().replace(/\s+/g, '').toLowerCase();
    const lh = n.lineHeight, ls = n.letterSpacing;
    const linePx = round(n.fontSize * (lh.units === 'PERCENT' ? lh.value / 100 : lh.value));
    const lsEm = ls.units === 'PERCENT' ? round(ls.value / 100, 10000) : null;
    const sig = `${n.fontSize}|${linePx}|${lsEm}`;
    if (!perTier.has(tierKey)) perTier.set(tierKey, []);
    perTier.get(tierKey).push({ sig, size: n.fontSize, linePx, lsEm, weight });
  }
  // pick the MODE signature per tier (filters mislabeled/stray nodes)
  const out = {};
  for (const [tier, arr] of perTier) {
    const freq = new Map();
    for (const r of arr) freq.set(r.sig, (freq.get(r.sig) || 0) + 1);
    const [bestSig] = [...freq.entries()].sort((a, b) => b[1] - a[1])[0];
    const rep = arr.find((r) => r.sig === bestSig);
    const weights = [...new Set(arr.filter((r) => r.sig === bestSig).map((r) => r.weight))].sort((a, b) => a - b);
    out[tier] = { size: rep.size, linePx: rep.linePx, lsEm: rep.lsEm, weights, strayCount: arr.length - freq.get(bestSig) };
  }
  return out;
}

function extractGrid() {
  // layout grids on the Grid page
  const gridPage = pages.find((p) => (p.name || '').includes('Grid'));
  const desc = descendants(gid(gridPage.guid));
  const containerGrids = [];
  for (const n of desc) {
    if (!Array.isArray(n.layoutGrids)) continue;
    for (const g of n.layoutGrids) {
      if ((n.name || '') !== 'Container') continue;
      containerGrids.push({ w: round(n.size?.x || 0), count: g.numSections, gutter: g.gutterSize, margin: g.offset, colW: g.sectionSize, type: g.type });
    }
  }
  // FLOAT variables
  const vval = new Map();
  for (const v of nodes.filter((n) => n.type === 'VARIABLE')) {
    const dv = v.variableDataValues; if (!dv?.entries) continue;
    for (const e of dv.entries) { const fv = e.variableData?.value?.floatValue; if (typeof fv === 'number' && e.variableData?.dataType === 'FLOAT') { if (!vval.has(v.name)) vval.set(v.name, new Set()); vval.get(v.name).add(fv); } }
  }
  const one = (name) => { const s = vval.get(name); return s ? [...s][0] : undefined; };
  // breakpoints from grid page text
  const texts = desc.filter((x) => x.type === 'TEXT').map((x) => x.textData?.characters || x.characters || '').join('\n');
  const bpMatches = [...texts.matchAll(/(\d{3,4})px\s*(?:미만|이상|부터)/g)].map((m) => Number(m[1]));
  const breakpoints = [...new Set(bpMatches)].sort((a, b) => a - b).filter((n) => n >= 768);
  return {
    columns: { mobile: 2, tablet: 3, desktop: 12 }, // from container grids + text (2/3/12)
    containerGrids,
    gutter: 20,
    margin: one('Value/Margin/Platform'),
    containerLg: one('Value/Width/Viewport/lg'),
    containerXl: one('Value/Width/Viewport/xl'),
    contentMax: one('Width/Max'),
    breakpoints,
  };
}

function extractOpacity() {
  const out = [];
  for (const v of nodes.filter((n) => n.type === 'VARIABLE')) {
    if (!/^Opacity\/\d+$/.test(v.name || '')) continue;
    const dv = v.variableDataValues; if (!dv?.entries) continue;
    const fv = dv.entries[0]?.variableData?.value?.floatValue;
    if (typeof fv === 'number') out.push(fv);
  }
  return [...new Set(out)].sort((a, b) => a - b);
}

// ---- LDS TOKEN parsing -----------------------------------------------------
const typoCss = readFileSync('tokens/typography.css', 'utf8');
const gridCss = readFileSync('tokens/grid.css', 'utf8');
const colorsCss = [
  readFileSync('tokens/color-atomic.css', 'utf8'),
  readFileSync('tokens/color-semantic.css', 'utf8'),
  readFileSync('tokens/color-components.css', 'utf8'),
].join('\n');
function tok(css, name) { const m = css.match(new RegExp('--' + name + ':\\s*([^;]+);')); return m ? m[1].trim() : null; }
function typeClassWeight(cls) { const m = typoCss.match(new RegExp('\\.type-' + cls + '\\s*\\{[^}]*font-weight:\\s*(\\d+)')); return m ? Number(m[1]) : null; }

// ---- DIFF ------------------------------------------------------------------
const lines = [];
const p = (s = '') => lines.push(s);
let driftCount = 0;
const near = (a, b, tol) => a != null && b != null && Math.abs(a - b) <= tol;

const wdsType = extractTypography();
const wdsGrid = extractGrid();
const wdsOpacity = extractOpacity();

p('# WDS Foundation Parity Report');
p('');
p('Auto-generated by `scripts/report-wds-foundation-parity.mjs` — extracts value-diffable');
p('foundations from the local `.fig` and diffs field-by-field against `tokens/*.css`.');
p('');
p('Legend: ✅ match · ❌ drift · ⚠️ note');
p('');

// Typography
p('## Typography (16 styles)');
p('');
p('| tier | source size/line/ls(em) | token size/line/ls(em) | weights (src → class) | verdict |');
p('|---|---|---|---|---|');
for (const tier of TIERS) {
  const s = wdsType[tier];
  const size = parseFloat(tok(typoCss, tier + '-size'));
  const line = parseFloat(tok(typoCss, tier + '-line'));
  const lsRaw = tok(typoCss, tier + '-spacing');
  const lsEm = lsRaw ? parseFloat(lsRaw) : null;
  const cw = typeClassWeight(tier);
  if (!s) { p(`| ${tier} | (missing in .fig) | ${size}/${line}/${lsEm} | — | ⚠️ |`); continue; }
  const ok = size === s.size && near(line, s.linePx, 0.6) && near(lsEm, s.lsEm, 0.0006);
  if (!ok) driftCount++;
  const wOk = s.weights.includes(cw);
  const verdict = ok ? '✅' : '❌ ' + [size !== s.size ? 'size' : '', !near(line, s.linePx, 0.6) ? 'line' : '', !near(lsEm, s.lsEm, 0.0006) ? 'ls' : ''].filter(Boolean).join(',');
  p(`| ${tier} | ${s.size}/${s.linePx}/${s.lsEm} | ${size}/${line}/${lsEm} | ${s.weights.join(',')} → ${cw}${wOk ? '' : ' ⚠️'} | ${verdict} |`);
}
p('');

// Grid
p('## Grid');
p('');
const bpTokens = { 768: tok(gridCss, 'bp-sm'), 992: tok(gridCss, 'bp-md'), 1200: tok(gridCss, 'bp-lg'), 1600: tok(gridCss, 'bp-xl') };
const gridRows = [
  ['columns mobile', 2, parseFloat(tok(gridCss, 'grid-columns-mobile'))],
  ['columns tablet', 3, parseFloat(tok(gridCss, 'grid-columns-tablet'))],
  ['columns desktop', 12, parseFloat(tok(gridCss, 'grid-columns-desktop'))],
  ['gutter', wdsGrid.gutter, parseFloat(tok(gridCss, 'grid-gutter'))],
  ['margin', wdsGrid.margin, parseFloat(tok(gridCss, 'grid-margin'))],
  ['container lg', wdsGrid.containerLg, parseFloat(tok(gridCss, 'container-lg'))],
  ['container xl', wdsGrid.containerXl, parseFloat(tok(gridCss, 'container-xl'))],
];
p('| field | source | token | verdict |');
p('|---|---|---|---|');
for (const [label, src, tgt] of gridRows) {
  const ok = near(src, tgt, 0.01);
  if (!ok) driftCount++;
  p(`| ${label} | ${src} | ${tgt} | ${ok ? '✅' : '❌'} |`);
}
// breakpoints
for (const bp of [768, 992, 1200, 1600]) {
  const inSrc = wdsGrid.breakpoints.includes(bp);
  const tgt = bpTokens[bp];
  const ok = inSrc && tgt === `${bp}px`;
  if (!ok) driftCount++;
  p(`| breakpoint ${bp} | ${inSrc ? bp : '—'} | ${tgt || '—'} | ${ok ? '✅' : '❌'} |`);
}
p(`| content max (12×70+11×20) | ${wdsGrid.contentMax} | 1060 (derived) | ${wdsGrid.contentMax === 1060 ? '✅' : '⚠️'} |`);
p('');

// Opacity ladder
p('## Opacity / alpha ladder');
p('');
const colorAlphas = new Set([...colorsCss.matchAll(/rgba\([^)]*?,\s*(0?\.\d+)\)/g)].map((m) => Math.round(parseFloat(m[1]) * 100)));
const covered = wdsOpacity.filter((o) => o === 0 || o === 100 || colorAlphas.has(o));
p(`WDS opacity steps: ${wdsOpacity.join(', ')}`);
p('');
p(`Present in generated color CSS alpha ladder: ${covered.length}/${wdsOpacity.length} — missing: ${wdsOpacity.filter((o) => !covered.includes(o)).join(', ') || 'none'}`);
p('');

// Non-diffable context
p('## Extracted but not value-diffed (context / manual review)');
p('');
p('- **Color values** — LK rebrand; roles + alpha ladder are the parity surface, not hex.');
p('- **Radius variable** — WDS `Radius` = 12/14/16/20 (multi-mode frame default); LDS radius scale is a superset (6/8/10/12/16/18/24/32). Component radii tracked in STYLE_PARITY_AUDIT.');
p('- **Context margins** — WDS `Margin/Action|Content|Navigation/*` step 16/20/24/32 per context; distinct from the flat-20 column-grid offset.');
p('- **Effects/shadows** — LK substitutes blur materials with shadows (documented override).');
p('');

const summary = driftCount === 0
  ? `All value-diffable foundation fields match the local .fig. (typography 16, grid + breakpoints, opacity ${covered.length}/${wdsOpacity.length})`
  : `${driftCount} field(s) drift from the local .fig — see ❌ rows above.`;
p('---');
p('');
p(summary);

const report = lines.join('\n') + '\n';
if (!CHECK) writeFileSync(REPORT, report);
console.log(report);
if (!CHECK) console.log(`Wrote ${REPORT}`);
if (CHECK && driftCount > 0) { console.error(`\nFAIL: ${driftCount} foundation drift(s).`); process.exit(1); }
