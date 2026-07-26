/**
 * Extract the full WDS color architecture (atomic ramps + semantic role tokens,
 * light/dark) from the local `.fig` into a blueprint JSON. This is the skeleton
 * that the LK-branded two-tier color system is generated from.
 *
 *   node scripts/extract-wds-color-architecture.mjs
 *   -> docs/references/wds/COLOR_ARCHITECTURE.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const FIG = 'docs/references/wds/Wanted Design System (Community).fig';
const OUT = 'docs/references/wds/COLOR_ARCHITECTURE.json';

const rU16 = (b, o) => b.readUInt16LE(o);
const rU32 = (b, o) => b.readUInt32LE(o);
function findEOCD(b){const s=0x06054b50,m=Math.max(0,b.length-0xffff-22);for(let o=b.length-22;o>=m;o--)if(rU32(b,o)===s)return o;throw new Error('no EOCD');}
function zEntries(b){const e=findEOCD(b);const c=rU16(b,e+10);let o=rU32(b,e+16);const m=new Map();for(let i=0;i<c;i++){const fnl=rU16(b,o+28),el=rU16(b,o+30),cl=rU16(b,o+32),method=rU16(b,o+10),cs=rU32(b,o+20),lho=rU32(b,o+42);m.set(b.subarray(o+46,o+46+fnl).toString('utf8'),{method,compressedSize:cs,localHeaderOffset:lho});o+=46+fnl+el+cl;}return m;}
function zRead(b,e,fn){const x=e.get(fn),o=x.localHeaderOffset,lfnl=rU16(b,o+26),lel=rU16(b,o+28),d=o+30+lfnl+lel,comp=b.subarray(d,d+x.compressedSize);if(x.method===0)return Buffer.from(comp);if(x.method===8)return inflateRawSync(comp);throw new Error('bad zip');}
function kiwi(b){let o=12;const ch=[];while(o+4<b.length){const s=rU32(b,o);o+=4;ch.push(b.subarray(o,o+s));o+=s;}const schema=decodeBinarySchema(inflateRawSync(ch[0]));const dc=ch[1];const data=dc[0]===0x28&&dc[1]===0xb5?zstdDecompressSync(dc):inflateRawSync(dc);return compileSchema(schema).decodeMessage(data);}
const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : undefined);

const buf = readFileSync(FIG);
const message = kiwi(zRead(buf, zEntries(buf), 'canvas.fig'));
const vars = (message.nodeChanges || []).filter((n) => n.type === 'VARIABLE');
const byId = new Map(vars.map((v) => [gid(v.guid), v]));

const hex = (c) => (c ? '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase() : null);
const alpha = (c) => (c && c.a != null ? Math.round(c.a * 100) / 100 : 1);

// Resolve a variable's per-mode values to {hex, alpha} (following one alias hop).
function resolveEntries(v, depth = 0) {
  const out = [];
  for (const e of v.variableDataValues?.entries || []) {
    const d = e.variableData;
    const mode = gid(e.modeID);
    if (d?.value?.colorValue) out.push({ mode, hex: hex(d.value.colorValue), alpha: alpha(d.value.colorValue) });
    else if (d?.value?.alias && depth < 4) {
      const ref = byId.get(gid(d.value.alias?.guid || d.value.alias));
      if (ref) { const r = resolveEntries(ref, depth + 1)[0]; out.push({ mode, hex: r?.hex, alpha: r?.alpha, via: ref.name }); }
      else out.push({ mode, alias: gid(d.value.alias?.guid || d.value.alias) });
    }
  }
  return out;
}

const HUES = ['Neutral', 'Cool Neutral', 'Blue', 'Red', 'Green', 'Orange', 'Red Orange', 'Lime', 'Cyan', 'Light Blue', 'Violet', 'Purple', 'Pink'];
const SEMANTIC_TOP = /^(Static|Primary|Label|Background|Interaction|Line|Status|Accent|Inverse|Fill|Material|Shadow|Elevation)\b/;

// --- Atomic ramps -----------------------------------------------------------
const atomic = {};
for (const v of vars) {
  const m = (v.name || '').match(/^(.+?)\/(\d+)$/);
  if (!m) continue;
  const hue = m[1].trim();
  if (!HUES.includes(hue)) continue;
  const step = Number(m[2]);
  const val = resolveEntries(v)[0];
  if (!val?.hex) continue;
  (atomic[hue] ||= {})[step] = val.hex;
}
// sort steps descending (WDS lists light→dark high→low)
for (const hue of Object.keys(atomic)) {
  atomic[hue] = Object.fromEntries(Object.entries(atomic[hue]).sort((a, b) => Number(b[0]) - Number(a[0])));
}

// --- Semantic tokens (light/dark) -------------------------------------------
const semantic = {};
for (const v of vars) {
  if (!SEMANTIC_TOP.test(v.name || '')) continue;
  const res = resolveEntries(v);
  if (!res.length) continue;
  // dedupe by mode; first distinct mode = light, second = dark (WDS convention)
  const seen = new Map();
  for (const r of res) if (!seen.has(r.mode)) seen.set(r.mode, r);
  const modes = [...seen.values()];
  const entry = {};
  if (modes[0]) entry.light = { hex: modes[0].hex, alpha: modes[0].alpha, ...(modes[0].via ? { via: modes[0].via } : {}) };
  if (modes[1]) entry.dark = { hex: modes[1].hex, alpha: modes[1].alpha, ...(modes[1].via ? { via: modes[1].via } : {}) };
  // keep the richest definition if the name repeats across collections
  if (!semantic[v.name] || (!semantic[v.name].light?.hex && entry.light?.hex)) semantic[v.name] = entry;
}

// --- Opacity ladder ---------------------------------------------------------
const opacity = [];
for (const v of vars) {
  const m = (v.name || '').match(/^Opacity\/(\d+)$/);
  if (!m) continue;
  opacity.push(Number(m[1]));
}
const opacitySteps = [...new Set(opacity)].sort((a, b) => a - b);

const out = {
  source: 'Wanted Design System (Community).fig — local snapshot',
  generatedBy: 'scripts/extract-wds-color-architecture.mjs',
  note: 'Blueprint only. LK generates a two-tier system with this structure but rebranded atomic values.',
  counts: {
    atomicHues: Object.keys(atomic).length,
    atomicTokens: Object.values(atomic).reduce((n, r) => n + Object.keys(r).length, 0),
    semanticTokens: Object.keys(semantic).length,
    opacitySteps: opacitySteps.length,
  },
  opacitySteps,
  atomic,
  semantic,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${OUT}`);
console.log(JSON.stringify(out.counts, null, 2));
console.log('\nhues:', Object.keys(atomic).map((h) => `${h}(${Object.keys(atomic[h]).length})`).join(', '));
console.log('\nsemantic sample:');
for (const k of Object.keys(semantic).slice(0, 14)) console.log(`  ${k.padEnd(30)} L:${semantic[k].light?.hex}@${semantic[k].light?.alpha}  D:${semantic[k].dark?.hex}@${semantic[k].dark?.alpha}`);
