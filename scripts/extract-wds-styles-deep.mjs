/**
 * Deep WDS component STYLE reconstructor (resolves INSTANCE references).
 *
 * The shallow extractor (extract-wds-component-styles.mjs) reads only the
 * variant symbol's own descendants and picks the largest filled frame. That
 * misses the real styled element for components whose geometry lives in a
 * referenced component: WDS's published controls (Checkbox / Radio / Check
 * Mark) delegate their box to a "Resource/Control" symbol via an INSTANCE, and
 * nested/overlay layouts (List Cell, Alert, …) nest several instances deep.
 *
 * This reader walks the variant tree AND, on every INSTANCE, resolves
 * `symbolData.symbolID` to the master SYMBOL and recurses into it — so the full
 * styled skeleton (every rounded/filled/stroked rect + every text) is
 * reconstructed exactly as it renders. Cycles are guarded by a per-path symbol
 * set and a depth cap.
 *
 *   node scripts/extract-wds-styles-deep.mjs "Control/Checkbox"          # skeleton
 *   node scripts/extract-wds-styles-deep.mjs "Control/Checkbox" --pick Type=Checked
 *   node scripts/extract-wds-styles-deep.mjs "List Cell/List Cell" --json
 */
import { readFileSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';

const FIG = 'docs/references/wds/Wanted Design System (Community).fig';
const rU16 = (b, o) => b.readUInt16LE(o), rU32 = (b, o) => b.readUInt32LE(o);
function findEOCD(b){const s=0x06054b50,m=Math.max(0,b.length-0xffff-22);for(let o=b.length-22;o>=m;o--)if(rU32(b,o)===s)return o;throw new Error('no EOCD');}
function zE(b){const e=findEOCD(b);const c=rU16(b,e+10);let o=rU32(b,e+16);const m=new Map();for(let i=0;i<c;i++){const fnl=rU16(b,o+28),el=rU16(b,o+30),cl=rU16(b,o+32),me=rU16(b,o+10),cs=rU32(b,o+20),lho=rU32(b,o+42);m.set(b.subarray(o+46,o+46+fnl).toString('utf8'),{method:me,compressedSize:cs,localHeaderOffset:lho});o+=46+fnl+el+cl;}return m;}
function zR(b,e,fn){const x=e.get(fn),o=x.localHeaderOffset,lfnl=rU16(b,o+26),lel=rU16(b,o+28),d=o+30+lfnl+lel,c=b.subarray(d,d+x.compressedSize);if(x.method===0)return Buffer.from(c);if(x.method===8)return inflateRawSync(c);throw new Error('bad zip');}
function kiwi(b){let o=12;const ch=[];while(o+4<b.length){const s=rU32(b,o);o+=4;ch.push(b.subarray(o,o+s));o+=s;}const sc=decodeBinarySchema(inflateRawSync(ch[0]));const dc=ch[1];const data=dc[0]===0x28&&dc[1]===0xb5?zstdDecompressSync(dc):inflateRawSync(dc);return compileSchema(sc).decodeMessage(data);}

const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : undefined);
const round = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 100) / 100 : undefined);
const hex = (c) => (c ? '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase() + (c.a != null && c.a < 1 ? `@${c.a.toFixed(2)}` : '') : null);
const fills = (n) => (n.fillPaints || []).filter((p) => p.visible !== false && p.color).map((p) => hex(p.color));
const strokes = (n) => (n.strokePaints || []).filter((p) => p.visible !== false && p.color).map((p) => hex(p.color));

const buf = readFileSync(FIG);
const nodes = kiwi(zR(buf, zE(buf), 'canvas.fig')).nodeChanges || [];
const byId = new Map(nodes.map((n) => [gid(n.guid), n]));
const kids = new Map();
for (const n of nodes) { const p = gid(n.parentIndex?.guid); if (!p) continue; if (!kids.has(p)) kids.set(p, []); kids.get(p).push(n); }
const isVariant = (n) => n.type === 'SYMBOL' && /[^,]+=[^,]+/.test(n.name || '');

export const sets = new Map();
for (const n of nodes) {
  const vk = (kids.get(gid(n.guid)) || []).filter(isVariant);
  if (vk.length >= 2) { const name = (n.name || '').trim(); if (name && (!sets.has(name) || sets.get(name).vk.length < vk.length)) sets.set(name, { node: n, vk }); }
}

// styled skeleton with INSTANCE resolution. Each entry: {depth,type,name,w,h,radius,padX,padY,gap,fill,stroke,strokeWeight,fontSize,text,via}
export function skeleton(variant, { maxDepth = 10 } = {}) {
  const out = [];
  function styled(n) { return n.cornerRadius !== undefined || fills(n).length || strokes(n).length || n.stackHorizontalPadding !== undefined || (n.type === 'TEXT' && n.fontSize); }
  function emit(n, depth, via) {
    out.push({
      depth, type: n.type, name: (n.name || '').slice(0, 28), via,
      w: round(n.size?.x), h: round(n.size?.y),
      radius: round(n.cornerRadius),
      padX: round(n.stackHorizontalPadding), padY: round(n.stackVerticalPadding), gap: round(n.stackSpacing),
      fill: fills(n)[0] || null, stroke: strokes(n)[0] || null, strokeWeight: round(n.strokeWeight),
      fontSize: round(n.fontSize), fontWeight: n.fontName?.style || null,
      text: n.type === 'TEXT' ? (n.textData?.characters || '').slice(0, 20) : undefined,
    });
  }
  function walk(id, depth, symPath) {
    if (depth > maxDepth) return;
    for (const c of (kids.get(id) || [])) {
      if (styled(c) || c.type === 'INSTANCE' || c.type === 'FRAME') emit(c, depth, undefined);
      if (c.type === 'INSTANCE') {
        const masterId = gid(c.symbolData?.symbolID);
        const master = byId.get(masterId);
        if (master && !symPath.has(masterId)) {
          const next = new Set(symPath); next.add(masterId);
          // recurse into the master's children, tagging them as resolved-from-instance
          for (const mc of (kids.get(masterId) || [])) {
            if (styled(mc) || mc.type === 'INSTANCE' || mc.type === 'FRAME') emit(mc, depth + 1, '↳' + (c.name || '').slice(0, 14));
            walkInto(mc, depth + 1, next);
          }
        }
      } else {
        walk(gid(c.guid), depth + 1, symPath);
      }
    }
  }
  function walkInto(n, depth, symPath) {
    if (depth > maxDepth) return;
    if (n.type === 'INSTANCE') {
      const masterId = gid(n.symbolData?.symbolID); const master = byId.get(masterId);
      if (master && !symPath.has(masterId)) { const next = new Set(symPath); next.add(masterId);
        for (const mc of (kids.get(masterId) || [])) { if (styled(mc) || mc.type === 'INSTANCE' || mc.type === 'FRAME') emit(mc, depth + 1, '↳' + (n.name || '').slice(0, 14)); walkInto(mc, depth + 1, next); } }
    } else {
      for (const c of (kids.get(gid(n.guid)) || [])) { if (styled(c) || c.type === 'INSTANCE' || c.type === 'FRAME') emit(c, depth, undefined); walkInto(c, depth, symPath); }
    }
  }
  emit(variant, 0, undefined);
  walk(gid(variant.guid), 1, new Set([gid(variant.guid)]));
  return out;
}

const PREFER = [/Disable=False/, /Disabled=False/, /Status=Normal/, /State=Checked|State=Selected|Type=Checked|Type=Selected/, /Variant=Solid|Variant=Normal/, /Color=Primary/, /Size=Medium|Size=Normal/, /Active=True/, /Selected=True/];
export function pickDefault(vk, pickRe) {
  if (pickRe) return vk.find((s) => pickRe.test(s.name || '')) || vk[0];
  return [...vk].map((s) => ({ s, score: PREFER.reduce((n, re) => n + (re.test(s.name || '') ? 1 : 0), 0) })).sort((a, b) => b.score - a.score)[0].s;
}

/**
 * Authoritative reconstructed style of a *named* element inside a component
 * (instances resolved). e.g. elementStyle('Control/Checkbox', {name:/^Box$/})
 * returns the checkbox box's real {w,h,radius,strokeWeight,fill,…}. When several
 * entries match, the first (shallowest, document order) wins; pass minW/minH to
 * skip wrapper frames. Returns null if the set or element is absent.
 */
export function elementStyle(setName, { pick, name, minW = 0, minH = 0, has } = {}) {
  const set = sets.get(setName) || [...sets].find(([k]) => k.toLowerCase() === setName.toLowerCase())?.[1];
  if (!set) return null;
  const variant = pickDefault(set.vk, pick ? new RegExp(pick) : null);
  const sk = skeleton(variant);
  const re = name instanceof RegExp ? name : new RegExp(name);
  const needs = has ? (Array.isArray(has) ? has : [has]) : [];
  const hit = sk.find((e) => re.test(e.name) && (e.w || 0) >= minW && (e.h || 0) >= minH && needs.every((f) => e[f] != null));
  return hit ? { variant: variant.name, ...hit } : null;
}

// CLI
if ((process.argv[1] || '').endsWith('extract-wds-styles-deep.mjs')) {
  const args = process.argv.slice(2);
  const name = args.find((a) => !a.startsWith('--'));
  const asJson = args.includes('--json');
  const pickIdx = args.indexOf('--pick');
  const pickRe = pickIdx >= 0 ? new RegExp(args[pickIdx + 1]) : null;
  const set = sets.get(name) || [...sets].find(([k]) => k.toLowerCase() === name?.toLowerCase())?.[1];
  if (!set) { console.log('no set:', name); console.log('available checkbox/radio/cell/alert-ish:'); [...sets.keys()].filter((k) => /check|radio|cell|alert|menu|card|complete|pag/i.test(k)).forEach((k) => console.log('  ', k)); process.exit(1); }
  const variant = pickDefault(set.vk, pickRe);
  const sk = skeleton(variant);
  if (asJson) { console.log(JSON.stringify({ set: name, variant: variant.name, skeleton: sk }, null, 2)); process.exit(0); }
  console.log(`SET "${name}"  variant="${variant.name}"  (${set.vk.length} variants)\n`);
  for (const e of sk) {
    const p = '  '.repeat(e.depth);
    const g = [e.w != null ? `${e.w}x${e.h}` : null, e.radius != null ? `r${e.radius}` : null,
      e.padX != null ? `padX${e.padX}` : null, e.padY != null ? `padY${e.padY}` : null, e.gap != null ? `gap${e.gap}` : null,
      e.fill ? `fill${e.fill}` : null, e.stroke ? `stroke${e.stroke}/${e.strokeWeight}` : null,
      e.fontSize ? `fs${e.fontSize}/${e.fontWeight}` : null, e.text ? `"${e.text}"` : null].filter(Boolean).join(' ');
    console.log(`${p}${e.type}${e.via ? ' ' + e.via : ''}  ${g}  ${e.name}`);
  }
}
