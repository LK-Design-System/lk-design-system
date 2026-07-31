/**
 * Rendered WDS↔LDS parity for NESTED inner elements (checkbox box, radio ring,
 * tooltip bubble, alert modal, list-cell interaction) — the elements the shallow
 * top-level extractor could not see. The authoritative WDS values come from
 * docs/references/wds/COMPONENT_STYLES_DEEP.json, reconstructed by
 * extract-wds-styles-deep.mjs (which resolves INSTANCE → master symbol). This
 * harness renders each LDS component, measures the real computed style of the
 * *named inner element* (via an explicit selector), and diffs.
 *
 *   node scripts/check-wds-nested-styles.mjs [--check]
 *
 * Colors are an intentional LK rebrand and are not diffed; only dimensions are.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { readFileSync, createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from '@playwright/test';

const CHECK = process.argv.includes('--check');
const root = process.cwd();
const appDir = path.join(root, 'visual-artifacts', 'nested-style-measure');
const srcDir = path.join(appDir, 'src');
const outDir = path.join(appDir, 'dist');
const deep = JSON.parse(readFileSync('docs/references/wds/COMPONENT_STYLES_DEEP.json', 'utf8'));

// name -> { deepKey, JSX, inner selector (scoped to the wrapper), dims to diff }
const TARGETS = [
  { name: 'CheckboxMd', deepKey: 'Checkbox/box@md', jsx: '<Checkbox defaultChecked aria-label="c" />', sel: 'span[aria-hidden="true"]', dims: ['radius', 'height'] },
  { name: 'CheckboxSm', deepKey: 'Checkbox/box@sm', jsx: '<Checkbox size="sm" defaultChecked aria-label="c" />', sel: 'span[aria-hidden="true"]', dims: ['radius', 'height'] },
  { name: 'RadioMd', deepKey: 'Radio/box@md', jsx: '<Radio defaultChecked aria-label="r" />', sel: 'span[aria-hidden="true"]', dims: ['radius', 'height'] },
  { name: 'RadioSm', deepKey: 'Radio/box@sm', jsx: '<Radio size="sm" defaultChecked aria-label="r" />', sel: 'span[aria-hidden="true"]', dims: ['radius', 'height'] },
  { name: 'Tooltip', deepKey: 'Tooltip/bubble', jsx: '<Tooltip defaultOpen content="메시지"><button>t</button></Tooltip>', sel: '[role="tooltip"]', dims: ['radius', 'padX'] },
  { name: 'Alert', deepKey: 'Alert/modal@web', jsx: '<Alert open platform="web" title="제목" description="내용" />', sel: '[role="alertdialog"]', dims: ['radius'] },
  { name: 'ListCell', deepKey: 'ListCell/interaction', jsx: '<ListCell title="제목" onClick={() => {}} />', sel: ':scope > *', dims: ['radius', 'height'] },
];

const indexHtml = `<!doctype html><html><head><meta charset="UTF-8"/></head><body><div id="root"></div><script type="module" src="/src/App.jsx"></script></body></html>`;
const imports = 'Checkbox, Radio, Tooltip, Alert, ListCell';
const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { ${imports} } from '@lk-design-system/design-system-core';
import '@lk-design-system/design-system-core/styles.css';
function App(){ return (<div style={{padding:60,display:'grid',gap:60,alignItems:'start',justifyItems:'start'}}>
${TARGETS.map((t) => `  <div data-measure="${t.name}">${t.jsx}</div>`).join('\n')}
</div>); }
createRoot(document.getElementById('root')).render(<App/>);
`;

function contentType(f){ if(f.endsWith('.html'))return 'text/html;charset=utf-8'; if(f.endsWith('.js'))return 'text/javascript'; if(f.endsWith('.css'))return 'text/css'; if(f.endsWith('.woff2'))return 'font/woff2'; return 'application/octet-stream'; }
function serve(dir){ const s=createServer(async(req,res)=>{ try{ const u=new URL(req.url||'/','http://127.0.0.1'); const sp=decodeURIComponent(u.pathname).replace(/^\/+/, '')||'index.html'; const fp=path.resolve(dir,sp); if(!fp.startsWith(dir)){res.writeHead(403);res.end();return;} const st=await stat(fp); if(!st.isFile()){res.writeHead(404);res.end();return;} res.writeHead(200,{'content-type':contentType(fp)}); createReadStream(fp).pipe(res);}catch{res.writeHead(404);res.end();}}); return new Promise((r)=>{s.listen(0,'127.0.0.1',()=>r({s,origin:`http://127.0.0.1:${s.address().port}`}));}); }

await rm(appDir, { recursive: true, force: true });
await mkdir(srcDir, { recursive: true });
await writeFile(path.join(appDir, 'index.html'), indexHtml);
await writeFile(path.join(srcDir, 'App.jsx'), appSource);
await build({ root: appDir, base: './', logLevel: 'error', build: { outDir, emptyOutDir: true } });
const { s, origin } = await serve(outDir);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(origin, { waitUntil: 'networkidle' });

const measured = await page.evaluate((targets) => {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const out = {};
  for (const t of targets) {
    const w = document.querySelector(`[data-measure="${t.name}"]`);
    const el = w && w.querySelector(t.sel);
    if (!el) { out[t.name] = null; continue; }
    const cs = getComputedStyle(el);
    out[t.name] = { height: px(cs.height), width: px(cs.width), radius: px(cs.borderTopLeftRadius), padX: px(cs.paddingLeft) };
  }
  return out;
}, TARGETS);
await browser.close();
s.close();

const near = (a, b, tol) => a != null && b != null && Math.abs(a - b) <= tol;
let drift = 0;
console.log('Rendered WDS↔LDS NESTED inner-element parity (deep-reconstructed WDS reference)\n');
console.log('component'.padEnd(12), 'element'.padEnd(14), 'field'.padEnd(8), 'WDS'.padEnd(7), 'LDS'.padEnd(7), 'verdict');
for (const t of TARGETS) {
  const w = deep[t.deepKey]; const l = measured[t.name];
  if (!w) { console.log(t.name.padEnd(12), '(no WDS deep ref)'); continue; }
  if (!l) { console.log(t.name.padEnd(12), (w.element || '').padEnd(14), 'MISSING inner element ->', t.sel); drift++; continue; }
  const wField = { height: 'h', width: 'w', radius: 'radius', padX: 'padX', padY: 'padY' };
  for (const key of t.dims) {
    const wv = w[wField[key] || key], lv = l[key];
    if (wv == null || lv == null) continue;
    const tol = key === 'height' ? 2 : 0.6;
    // a radius >= half the height renders as a full pill/circle; compare "is round"
    const roundW = key === 'radius' && wv >= (w.h || 9999) / 2 - 1;
    const roundL = key === 'radius' && lv >= (l.height || 9999) / 2 - 1;
    const ok = key === 'radius' && roundW ? roundL : near(wv, lv, tol);
    if (!ok) drift++;
    console.log(t.name.padEnd(12), (w.element || '').padEnd(14), key.padEnd(8), String(roundW ? 'round' : wv).padEnd(7), String(roundL ? 'round' : lv).padEnd(7), ok ? '✅' : '❌');
  }
}
console.log(`\n${drift} nested drift(s).`);
if (CHECK && drift) process.exit(1);
