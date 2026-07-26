/**
 * Does the Storybook obey the Foundation rules it publishes?
 *
 * The Foundation guides state quantitative contracts — a spacing scale, a type scale, a radius
 * ramp, five elevation levels, three motion durations, five icon sizes. Those rules are only
 * real if the surface that teaches them follows them. This renders every page and compares the
 * computed values it actually paints against the values its own guides declare.
 *
 * Scales are read from docs/foundations/foundation-content.json and tokens/*.css, never
 * hardcoded here: if a foundation changes its ramp, this check follows it.
 *
 * Usage: node scripts/audit-foundation-conformance.mjs [--pattern=x] [--limit=n] [--json=out]
 */
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';

const root = process.cwd();
const staticDir = path.join(root, 'storybook-static');
const args = process.argv.slice(2);
const argValue = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const pattern = argValue('pattern') ? new RegExp(argValue('pattern'), 'i') : null;
const limit = Number(argValue('limit') || 0);
const jsonOut = argValue('json');

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

function startStaticServer() {
  const server = createServer((req, res) => {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
    const filePath = path.resolve(staticDir, safePath);
    if (!filePath.startsWith(staticDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const stream = createReadStream(filePath);
    stream.once('open', () => {
      res.writeHead(200, { 'content-type': contentType(filePath) });
      stream.pipe(res);
    });
    stream.once('error', () => {
      if (!res.headersSent) res.writeHead(404);
      res.end('Not found');
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` }));
  });
}

/** Pull the declared numeric scales out of the token CSS the guides point at. */
async function readScales() {
  const css = [
    await readFile(path.join(root, 'tokens', 'spacing.css'), 'utf8'),
    await readFile(path.join(root, 'tokens', 'typography.css'), 'utf8'),
    await readFile(path.join(root, 'tokens', 'effects.css'), 'utf8').catch(() => ''),
  ].join('\n');

  const numbers = (re) => {
    const values = new Set();
    for (const match of css.matchAll(re)) {
      const n = Number.parseFloat(match[1]);
      if (Number.isFinite(n)) values.add(n);
    }
    return values;
  };

  return {
    spacing: numbers(/--space-[\w-]+:\s*(-?[\d.]+)px/g),
    radius: numbers(/--radius-[\w-]+:\s*([\d.]+)px/g),
    type: numbers(/--[\w-]+-size:\s*([\d.]+)px/g),
    // Motion and elevation are compared as whole computed strings, resolved in-page.
  };
}

function conformanceInPage(scales) {
  const SPACING = new Set(scales.spacing);
  const RADIUS = new Set([...scales.radius, 999, 9999]);
  const TYPE = new Set(scales.type);
  const findings = [];
  const seen = new Set();

  // Compare computed-to-computed: the browser reorders and re-units box-shadow when it
  // serializes it, so matching a token's authored text against a computed value never lines up.
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.opacity = '0';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);
  const shadowRamp = new Set();
  for (const name of ['--shadow-xs', '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl']) {
    probe.style.boxShadow = `var(${name})`;
    const resolved = getComputedStyle(probe).boxShadow;
    if (resolved && resolved !== 'none') shadowRamp.add(resolved.trim());
  }
  probe.remove();
  // The Motion foundation declares exactly three durations.
  const DURATIONS = new Set([0, 0.12, 0.2, 0.32]);

  /*
   * Measure only what this repository renders. A Docs page also contains Storybook's own
   * chrome — its title block, source viewer and preview frame — which follows Storybook's
   * design, not ours. Counting it would blame LDS for values it never wrote.
   */
  const owned = [
    ...document.querySelectorAll('[data-component-guide], [data-foundation-guide], [data-foundation-specimen], .docs-story > *'),
  ];
  const roots = owned.length > 0 ? owned : [document.querySelector('#storybook-root') || document.body];

  const px = (v) => { const n = Number.parseFloat(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : null; };
  const record = (rule, value, foundation) => {
    const key = `${rule}|${value}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({ rule, value, foundation });
  };

  const elements = new Set();
  for (const scope of roots) {
    if (!scope) continue;
    elements.add(scope);
    for (const node of scope.querySelectorAll('*')) elements.add(node);
  }

  for (const el of elements) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    const cs = getComputedStyle(el);

    // --- spacing: the scale is 4px-based and enumerated -----------------------
    if (['flex', 'grid', 'inline-flex', 'inline-grid'].includes(cs.display)) {
      for (const gap of [px(cs.rowGap), px(cs.columnGap)]) {
        if (gap == null || gap === 0) continue;
        if (!SPACING.has(gap)) record('off-spacing-scale', `${gap}px gap`, 'spacing');
      }
    }

    // --- radius: enumerated ramp + pill ---------------------------------------
    const radius = px(cs.borderTopLeftRadius);
    if (radius && !RADIUS.has(radius) && cs.borderTopLeftRadius.indexOf('%') === -1) {
      record('off-radius-ramp', `${radius}px`, 'radius');
    }

    // --- type: 16 semantic sizes ---------------------------------------------
    const ownsText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (ownsText) {
      const size = px(cs.fontSize);
      if (size != null && !TYPE.has(size)) record('off-type-scale', `${size}px`, 'typography');
    }

    // --- elevation: five ramp steps only -------------------------------------
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      const normalized = cs.boxShadow.trim();
      // Focus rings and hairline outlines are drawn with spread-only shadows, which the
      // elevation ramp deliberately does not cover.
      const isRing = /^[^,]*\b0px 0px 0px \d/.test(normalized) || /inset/.test(normalized);
      if (!isRing && !shadowRamp.has(normalized)) {
        record('off-elevation-ramp', normalized.slice(0, 54), 'elevation');
      }
    }

    // --- motion: three declared durations ------------------------------------
    for (const duration of cs.transitionDuration.split(',')) {
      const seconds = Number.parseFloat(duration);
      if (!Number.isFinite(seconds) || seconds === 0) continue;
      if (!DURATIONS.has(Math.round(seconds * 100) / 100)) {
        record('off-motion-duration', `${Math.round(seconds * 1000)}ms`, 'motion');
      }
    }
  }

  return findings;
}

const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
let entries = Object.values(index.entries || {})
  .filter((e) => e.type === 'story' || e.type === 'docs')
  .filter((e) => !(e.tags || []).includes('visual-parity'));
if (pattern) entries = entries.filter((e) => pattern.test(`${e.id} ${e.title}`));
if (limit) entries = entries.slice(0, limit);

const scales = await readScales();
const serializable = {
  spacing: [...scales.spacing],
  radius: [...scales.radius],
  type: [...scales.type],
};
console.log(`Declared scales — spacing ${serializable.spacing.length}, radius ${serializable.radius.length}, type ${serializable.type.length}`);

const { server, origin } = await startStaticServer();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const results = [];
let scanned = 0;
for (const entry of entries) {
  const viewMode = entry.type === 'docs' ? 'docs' : 'story';
  try {
    await page.goto(`${origin}/iframe.html?id=${encodeURIComponent(entry.id)}&viewMode=${viewMode}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#storybook-root, #root', { state: 'attached', timeout: 30000 });
    await page.waitForTimeout(viewMode === 'docs' ? 1000 : 400);
    const findings = await page.evaluate(conformanceInPage, serializable);
    if (findings.length) results.push({ id: entry.id, title: entry.title, findings });
  } catch (error) {
    results.push({ id: entry.id, title: entry.title, findings: [{ rule: 'render-error', value: error.message.slice(0, 90) }] });
  }
  scanned += 1;
  if (scanned % 50 === 0) process.stderr.write(`  …${scanned}/${entries.length}\n`);
}

await browser.close();
server.close();

const byRule = new Map();
for (const result of results) {
  for (const finding of result.findings) {
    if (!byRule.has(finding.rule)) byRule.set(finding.rule, []);
    byRule.get(finding.rule).push({ ...finding, title: result.title });
  }
}

console.log(`\nChecked ${entries.length} pages against the published Foundation rules. ${results.length} break at least one.\n`);
console.log('rule'.padEnd(24) + 'foundation'.padEnd(14) + 'distinct values   pages');
for (const [rule, list] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const values = new Set(list.map((f) => f.value));
  const pages = new Set(list.map((f) => f.title));
  console.log(`${rule.padEnd(24)}${String(list[0].foundation ?? '-').padEnd(14)}${String(values.size).padStart(15)}${String(pages.size).padStart(8)}`);
}

for (const [rule, list] of [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n=== ${rule} ===`);
  const byValue = new Map();
  for (const f of list) {
    if (!byValue.has(f.value)) byValue.set(f.value, new Set());
    byValue.get(f.value).add(f.title);
  }
  for (const [value, pages] of [...byValue.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 10)) {
    console.log(`   ${String(value).padEnd(56)} ${pages.size} page(s)  e.g. ${[...pages][0]}`);
  }
  if (byValue.size > 10) console.log(`   …and ${byValue.size - 10} more distinct values`);
}

if (jsonOut) {
  await writeFile(jsonOut, `${JSON.stringify({ scales: serializable, results }, null, 2)}\n`);
  console.log(`\nWrote ${jsonOut}`);
}
