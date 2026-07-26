/**
 * Authoritative WDS component STYLE reader (not axis names — real pixel styles).
 *
 * For each component set, picks a representative default variant symbol and reads
 * its actual style tree from the decoded `.fig`: corner radius, auto-layout
 * padding + gap, height, fill/stroke hex+alpha, stroke weight, and the primary
 * label's font size / weight / color. This is the authoritative style source per
 * AGENTS.md — used to compare real WDS styling against LDS component tokens /
 * rendered output, not just variant-axis presence.
 *
 *   node scripts/extract-wds-component-styles.mjs            # all sets -> JSON + table
 *   node scripts/extract-wds-component-styles.mjs Button/Button Chip/Chip
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const FIG = 'docs/references/wds/Wanted Design System (Community).fig';
const OUT = 'docs/references/wds/COMPONENT_STYLES.json';
const argNames = process.argv.slice(2);

const rU16 = (b, o) => b.readUInt16LE(o), rU32 = (b, o) => b.readUInt32LE(o);
function findEOCD(b){const s=0x06054b50,m=Math.max(0,b.length-0xffff-22);for(let o=b.length-22;o>=m;o--)if(rU32(b,o)===s)return o;throw new Error('no EOCD');}
function zE(b){const e=findEOCD(b);const c=rU16(b,e+10);let o=rU32(b,e+16);const m=new Map();for(let i=0;i<c;i++){const fnl=rU16(b,o+28),el=rU16(b,o+30),cl=rU16(b,o+32),me=rU16(b,o+10),cs=rU32(b,o+20),lho=rU32(b,o+42);m.set(b.subarray(o+46,o+46+fnl).toString('utf8'),{method:me,compressedSize:cs,localHeaderOffset:lho});o+=46+fnl+el+cl;}return m;}
function zR(b,e,fn){const x=e.get(fn),o=x.localHeaderOffset,lfnl=rU16(b,o+26),lel=rU16(b,o+28),d=o+30+lfnl+lel,c=b.subarray(d,d+x.compressedSize);if(x.method===0)return Buffer.from(c);if(x.method===8)return inflateRawSync(c);throw new Error('bad zip');}
function kiwi(b){let o=12;const ch=[];while(o+4<b.length){const s=rU32(b,o);o+=4;ch.push(b.subarray(o,o+s));o+=s;}const sc=decodeBinarySchema(inflateRawSync(ch[0]));const dc=ch[1];const data=dc[0]===0x28&&dc[1]===0xb5?zstdDecompressSync(dc):inflateRawSync(dc);return compileSchema(sc).decodeMessage(data);}
const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : undefined);
const round = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 100) / 100 : undefined);

const buf = readFileSync(FIG);
const nodes = kiwi(zR(buf, zE(buf), 'canvas.fig')).nodeChanges || [];
const kids = new Map();
for (const n of nodes) { const p = gid(n.parentIndex?.guid); if (!p) continue; if (!kids.has(p)) kids.set(p, []); kids.get(p).push(n); }
function desc(id) { const o = []; const st = [...(kids.get(id) || [])]; while (st.length) { const n = st.shift(); o.push(n); const c = kids.get(gid(n.guid)); if (c) st.push(...c); } return o; }
const hex = (c) => (c ? '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase() + (c.a != null && c.a < 1 ? `@${c.a.toFixed(2)}` : '') : null);
const fills = (n) => (n.fillPaints || []).filter((p) => p.visible !== false && p.color).map((p) => hex(p.color));
const strokes = (n) => (n.strokePaints || []).filter((p) => p.visible !== false && p.color).map((p) => hex(p.color));

const isVariant = (n) => n.type === 'SYMBOL' && /[^,]+=[^,]+/.test(n.name || '');
const sets = new Map();
for (const n of nodes) {
  const vk = (kids.get(gid(n.guid)) || []).filter(isVariant);
  if (vk.length >= 2) { const name = (n.name || '').trim(); if (name && (!sets.has(name) || sets.get(name).vk.length < vk.length)) sets.set(name, { node: n, vk }); }
}

// pick a representative default variant: prefer default-ish axis values
const PREFER = [/Disable=False/, /Disabled=False/, /Status=Normal/, /State=Unchecked|State=Normal/, /Variant=Solid|Variant=Normal/, /Color=Primary/, /Size=Medium/, /Active=False/, /Focus=False/, /Selected=False/, /Icon( Only)?=False/, /Platform=Normal|Platform=Web/];
function pickDefault(vk) {
  return [...vk].map((s) => ({ s, score: PREFER.reduce((n, re) => n + (re.test(s.name || '') ? 1 : 0), 0) })).sort((a, b) => b.score - a.score)[0].s;
}
function styleOf(name) {
  const set = sets.get(name) || [...sets].find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
  if (!set) return null;
  const variant = pickDefault(set.vk);
  const tree = [variant, ...desc(gid(variant.guid))];
  // the styled container: prefer the variant symbol node itself if it carries frame style, else the largest filled/rounded frame
  const cand = tree.filter((n) => (n.cornerRadius !== undefined || fills(n).length || n.stackHorizontalPadding !== undefined) && (n.size?.x || 0) > 24);
  const frame = cand.sort((a, b) => (b.size?.x || 0) * (b.size?.y || 0) - (a.size?.x || 0) * (a.size?.y || 0))[0] || variant;
  // primary label = the text with the largest font size (not a tiny helper/caption)
  const text = tree.filter((n) => n.type === 'TEXT' && n.fontSize).sort((a, b) => b.fontSize - a.fontSize)[0];
  return {
    variant: variant.name,
    height: round(frame.size?.y),
    radius: round(frame.cornerRadius),
    padX: round(frame.stackHorizontalPadding),
    padY: round(frame.stackVerticalPadding),
    gap: round(frame.stackSpacing),
    fill: fills(frame)[0] || null,
    stroke: strokes(frame)[0] || null,
    strokeWeight: round(frame.strokeWeight),
    fontSize: round(text?.fontSize),
    fontWeight: text?.fontName?.style || null,
    textColor: fills(text || {})[0] || null,
  };
}

const names = argNames.length ? argNames : [...sets.keys()].filter((n) => !/Resource|Knob|\.|Icon\//i.test(n)).sort();
const out = {};
for (const name of names) { const st = styleOf(name); if (st) out[name] = st; }
if (!argNames.length) { writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n'); console.log(`Wrote ${OUT} (${Object.keys(out).length} component sets)\n`); }
for (const [name, s] of Object.entries(out)) {
  console.log(`${name}`);
  console.log(`  h=${s.height} r=${s.radius} padX=${s.padX} padY=${s.padY} gap=${s.gap} fill=${s.fill} stroke=${s.stroke}/${s.strokeWeight} font=${s.fontSize}/${s.fontWeight}/${s.textColor}`);
}
