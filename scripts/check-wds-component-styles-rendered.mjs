/**
 * Rendered WDS↔LDS component STYLE parity (reliable measurement harness).
 *
 * Builds a tiny consumer app that renders each target component at its default,
 * each wrapped in <div data-measure="Name">, Vite-builds it, serves it, and uses
 * Playwright (Chromium) to read the real computed style of the component root —
 * then diffs radius/padX/height/font against the authoritative WDS styles from
 * the .fig (docs/references/wds/COMPONENT_STYLES.json). Reliable because the
 * wrapper is controlled and the component is its direct child (no ad-hoc
 * selectors). Colors are an intentional LK rebrand and are not diffed.
 *
 *   node scripts/check-wds-component-styles-rendered.mjs [--check]
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from '@playwright/test';

const CHECK = process.argv.includes('--check');
const root = process.cwd();
const appDir = path.join(root, 'visual-artifacts', 'style-measure');
const srcDir = path.join(appDir, 'src');
const outDir = path.join(appDir, 'dist');
const wds = JSON.parse(readFileSync('docs/references/wds/COMPONENT_STYLES.json', 'utf8'));

// name -> { wds set, JSX render, what to measure (root|innerBoxSelector), which dims to diff }
const TARGETS = [
  { name: 'Button', set: 'Button/Button', jsx: '<Button>텍스트</Button>', dims: ['radius', 'padX', 'height', 'fontSize'] },
  { name: 'Chip', set: 'Chip/Chip', jsx: '<Chip>텍스트</Chip>', dims: ['radius', 'padX', 'height', 'fontSize'] },
  { name: 'FilterChip', set: 'Chip/Filter', jsx: '<FilterChip>텍스트</FilterChip>', dims: ['radius', 'height'] },
  { name: 'ContentBadge', set: 'Content Badge/Content Badge', jsx: '<ContentBadge size="medium">텍스트</ContentBadge>', dims: ['radius', 'padX', 'fontSize'] },
  // Segmented: WDS h/r are the TRACK; LDS track = segment(40) + track padding, so
  // compare radius only (height is a track-vs-segment measurement axis, not a token).
  { name: 'SegmentedControl', set: 'Segmented Control/Segmented Control', jsx: "<SegmentedControl options={['하나','둘','셋']} />", dims: ['radius'] },
  { name: 'Tag', set: 'Content Badge/Content Badge', jsx: '<Tag>TAG</Tag>', dims: [] },
  { name: 'PushBadge', set: 'Badge/Push', jsx: '<PushBadge count={3} />', dims: ['radius', 'height'] },
  { name: 'Category', set: 'Category/Category', jsx: "<Category items={['전체','로봇','배차']} />", dims: [] },
  { name: 'Toast', set: 'Toast/Toast', jsx: '<Toast>알림 메시지입니다.</Toast>', dims: ['radius', 'padX'] },
  { name: 'Select', set: 'Select/Select', jsx: "<Select options={['하나','둘']} defaultValue=\"하나\" />", dims: ['radius', 'padX', 'height', 'fontSize'] },
  { name: 'Textarea', set: 'Textinput/Textarea', jsx: '<Textarea defaultValue="여러 줄 텍스트 값" />', dims: ['radius', 'padX', 'fontSize'] },
  { name: 'Switch', set: 'Switch/Switch', jsx: '<Switch defaultChecked />', dims: ['height'] },
  { name: 'ButtonOutlined', set: 'Button/Outlined', jsx: '<Button variant="outlined">텍스트</Button>', dims: ['radius', 'padX', 'height', 'fontSize'] },
  { name: 'TextButton', set: 'Button/Text', jsx: '<TextButton>텍스트</TextButton>', dims: ['height', 'fontSize'] },
  { name: 'Fab', set: 'Button/Floating Action Button', jsx: '<Fab>+</Fab>', dims: ['radius', 'height'] },
  { name: 'MultiSelectChip', set: 'Chip/Multi-Select', jsx: '<MultiSelectChip>텍스트</MultiSelectChip>', dims: ['radius', 'padX', 'height', 'fontSize'] },
  { name: 'Avatar', set: 'Avatar/Avatar', jsx: '<Avatar name="김철수" />', dims: ['radius'] },
  { name: 'ChoiceCard', set: 'Framed Style/Framed Style', jsx: '<ChoiceCard title="텍스트" />', dims: ['padX'] },
  { name: 'PageIndicator', set: 'Page Indicator/Counter', jsx: '<PageIndicator variant="counter" page={1} count={5} />', dims: ['padX', 'fontSize'] },
  { name: 'Skeleton', set: 'Skeleton/Rectangle', jsx: '<Skeleton />', dims: ['radius'] },
  // Batch 2 — previously census-covered but not style-diffed (single-root, measurable).
  // Input value font (16=body1) is token-checked, not measured here: the largest
  // styled element is the field row, whose font is inherited noise, not the input's.
  { name: 'Input', set: 'Textinput/Textfield', jsx: '<Input placeholder="값" />', dims: ['radius', 'height', 'padX'] },
  { name: 'Divider', set: 'Basic/Divider', jsx: '<div style={{ width: 220 }}><Divider /></div>', dims: ['height'] },
  { name: 'Badge', set: '_Badge/Value', jsx: '<Badge>3</Badge>', dims: ['radius', 'height', 'padX', 'fontSize'] },
  // Excluded from auto-measure (verified manually / documented override instead):
  //  - StatusBadge: current WDS usage evidence supersedes the historical `_Badge/Status`
  //    r4 snapshot; lifecycle statuses intentionally use an LDS semantic soft pill,
  //    while live dots are split into StatusIndicator.
  //  - Tabs: the "largest styled element" is the 2px indicator, not the 48px tab; and
  //    Tab spacing is a signed-off LK override (STYLE_PARITY_AUDIT.md).
  // NOTE: nested/overlay components (List Cell, Alert, Card, Menu, Auto Complete,
  // Pagination) are excluded — the WDS style extractor reads the top-level frame,
  // which is not the meaningful styled element for deeply-nested layouts, so the
  // automated diff is unreliable there. Their parity is covered by STYLE_PARITY_AUDIT.md.
];

const indexHtml = `<!doctype html><html><head><meta charset="UTF-8"/></head><body><div id="root"></div><script type="module" src="/src/App.jsx"></script></body></html>`;
const imports = 'Button, Chip, FilterChip, ContentBadge, SegmentedControl, Tag, PushBadge, Category, Toast, Select, Textarea, Switch, TextButton, Fab, MultiSelectChip, Avatar, ListCell, ChoiceCard, PageIndicator, Skeleton, Alert, Input, Divider, Badge';
const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { ${imports} } from '@lk-design-system/design-system-core';
import '@lk-design-system/design-system-core/styles.css';
function App(){ return (<div style={{padding:40,display:'grid',gap:24,alignItems:'start',justifyItems:'start'}}>
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

const measured = await page.evaluate(() => {
  const px = (v) => Math.round(parseFloat(v));
  const out = {};
  for (const w of document.querySelectorAll('[data-measure]')) {
    // styled root = the wrapper's descendant with the largest area that has a radius or background/border
    const cands = [...w.querySelectorAll('*')].filter((e) => {
      const cs = getComputedStyle(e);
      const rect = e.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
      return px(cs.borderTopLeftRadius) > 0 || cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderTopStyle !== 'none';
    });
    const el = cands.sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0] || w.firstElementChild;
    const cs = getComputedStyle(el);
    out[w.getAttribute('data-measure')] = { height: px(cs.height), radius: px(cs.borderTopLeftRadius), padX: px(cs.paddingLeft), fontSize: px(cs.fontSize) };
  }
  return out;
});
await browser.close();
s.close();

const near = (a, b, tol) => a != null && b != null && Math.abs(a - b) <= tol;
let drift = 0;
console.log('Rendered WDS↔LDS style parity (measured via Playwright)\n');
console.log('component'.padEnd(18), 'field'.padEnd(9), 'WDS'.padEnd(6), 'LDS'.padEnd(6), 'verdict');
for (const t of TARGETS) {
  const w = wds[t.set]; const l = measured[t.name];
  if (!w || !l) { console.log(t.name.padEnd(18), '(no data)'); continue; }
  for (const key of t.dims) {
    const tol = key === 'height' ? 3 : 0.6; // height is content-driven; allow small
    const wv = w[key], lv = l[key];
    if (wv == null || lv == null) continue;
    // a radius >= half the height renders as a full pill/circle; compare "is round"
    const roundW = wv >= (w.height || 9999) / 2 - 1, roundL = lv >= (l.height || 9999) / 2 - 1;
    const ok = key === 'radius' && roundW && roundL ? true : near(wv, lv, tol);
    if (!ok) drift++;
    console.log(t.name.padEnd(18), key.padEnd(9), String(wv).padEnd(6), String(lv).padEnd(6), ok ? '✅' : '❌');
  }
}
console.log(`\n${drift} dimensional drift(s).`);
if (CHECK && drift) process.exit(1);
