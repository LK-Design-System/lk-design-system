/**
 * Authoritative WDS component variant-axis reader.
 *
 * Per AGENTS.md ("Component Variant/Axis Parity — authoritative source"): variant
 * axes are read from the `.fig` INTERNAL component-set definition, scoped strictly
 * to one component set's own direct variant children — NOT the section-level
 * FIGMA_LOCAL_CONTENT_AUDIT.json variantAxes (which bleeds adjacent components),
 * and NOT rendered screenshots.
 *
 *   node scripts/extract-wds-component-variants.mjs [Name ...]
 *   node scripts/extract-wds-component-variants.mjs Toast Tab Select Textinput
 */
import { readFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const FIG = 'docs/references/wds/Wanted Design System (Community).fig';
const targets = process.argv.slice(2);

const rU16 = (b, o) => b.readUInt16LE(o);
const rU32 = (b, o) => b.readUInt32LE(o);
function findEOCD(b){const s=0x06054b50,m=Math.max(0,b.length-0xffff-22);for(let o=b.length-22;o>=m;o--)if(rU32(b,o)===s)return o;throw new Error('no EOCD');}
function zEntries(b){const e=findEOCD(b);const c=rU16(b,e+10);let o=rU32(b,e+16);const m=new Map();for(let i=0;i<c;i++){const fnl=rU16(b,o+28),el=rU16(b,o+30),cl=rU16(b,o+32),method=rU16(b,o+10),cs=rU32(b,o+20),lho=rU32(b,o+42);m.set(b.subarray(o+46,o+46+fnl).toString('utf8'),{method,compressedSize:cs,localHeaderOffset:lho});o+=46+fnl+el+cl;}return m;}
function zRead(b,e,fn){const x=e.get(fn),o=x.localHeaderOffset,lfnl=rU16(b,o+26),lel=rU16(b,o+28),d=o+30+lfnl+lel,comp=b.subarray(d,d+x.compressedSize);if(x.method===0)return Buffer.from(comp);if(x.method===8)return inflateRawSync(comp);throw new Error('bad zip');}
function kiwi(b){let o=12;const ch=[];while(o+4<b.length){const s=rU32(b,o);o+=4;ch.push(b.subarray(o,o+s));o+=s;}const schema=decodeBinarySchema(inflateRawSync(ch[0]));const dc=ch[1];const data=dc[0]===0x28&&dc[1]===0xb5?zstdDecompressSync(dc):inflateRawSync(dc);return compileSchema(schema).decodeMessage(data);}
const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : undefined);

const buf = readFileSync(FIG);
const nodes = kiwi(zRead(buf, zEntries(buf), 'canvas.fig')).nodeChanges || [];
const byId = new Map(nodes.map((n) => [gid(n.guid), n]));
const childrenByParent = new Map();
for (const n of nodes) { const p = gid(n.parentIndex?.guid); if (!p) continue; if (!childrenByParent.has(p)) childrenByParent.set(p, []); childrenByParent.get(p).push(n); }

// A component set = a node whose DIRECT children are variant symbols ("Prop=Value, ...").
// Figma stores components as SYMBOL; the set groups them. Detect by children shape.
const isVariantSymbol = (n) => n.type === 'SYMBOL' && /[^,]+=[^,]+/.test(n.name || '');
const componentSets = [];
for (const n of nodes) {
  const kids = childrenByParent.get(gid(n.guid)) || [];
  const variantKids = kids.filter(isVariantSymbol);
  if (variantKids.length >= 2) componentSets.push({ node: n, name: (n.name || '').trim(), variantKids });
}

function axesOf(variantKids) {
  const axes = new Map();
  for (const k of variantKids) {
    for (const part of (k.name || '').split(',')) {
      const [rawK, ...rawV] = part.split('=');
      const key = (rawK || '').trim(); const val = rawV.join('=').trim();
      if (!key || !val) continue;
      if (!axes.has(key)) axes.set(key, new Set());
      axes.get(key).add(val);
    }
  }
  return [...axes.entries()].map(([name, vals]) => ({ name, values: [...vals].sort() })).sort((a, b) => a.name.localeCompare(b.name));
}

// Group sets by exact name; keep the richest (most variant children) per name.
const byName = new Map();
for (const cs of componentSets) {
  if (!cs.name) continue;
  if (!byName.has(cs.name) || byName.get(cs.name).variantKids.length < cs.variantKids.length) byName.set(cs.name, cs);
}

const want = targets.length ? targets : [...byName.keys()].sort();
for (const name of want) {
  const cs = byName.get(name) || [...byName.entries()].find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
  if (!cs) { console.log(`\n## ${name}\n(no component set found with that exact name)`); continue; }
  console.log(`\n## ${cs.name}  (${cs.variantKids.length} variants, set ${gid(cs.node.guid)})`);
  for (const a of axesOf(cs.variantKids)) console.log(`  ${a.name}: ${a.values.join(', ')}`);
}
if (!targets.length) console.log(`\n(${byName.size} component sets total — pass names as args to scope)`);
