/**
 * Structural and visual audit across every Storybook page.
 *
 * The existing gates each guard one narrow property (tokens exist, Axe is quiet, targets are
 * big enough). None of them answers "does this page read as a well-built page", which is how
 * a whole documentation surface drifted while every check stayed green. This script renders
 * each story and measures the defect classes that drift produced:
 *
 *   page-overflow        the page scrolls sideways
 *   multiple-h1          more than one document title
 *   heading-skip         a heading level is skipped (h2 -> h4)
 *   duplicate-heading    the same heading text appears twice on one page
 *   collapsed-gap        a multi-child flex/grid container renders with no gap at all
 *   off-scale-gap        a gap/padding that is not on the 4px spacing scale
 *   off-scale-font       a font-size that is not on the type scale
 *   truncated-text       generated prose cut mid-sentence ("...." / "…." artifacts)
 *   clipped-content      content overflows a fixed-height box that hides it
 *   invisible-canvas     the story rendered nothing measurable
 *
 * Usage:
 *   node scripts/audit-storybook-page-quality.mjs               # audit every story
 *   node scripts/audit-storybook-page-quality.mjs --pattern=foundation
 *   node scripts/audit-storybook-page-quality.mjs --rule=collapsed-gap
 *   node scripts/audit-storybook-page-quality.mjs --limit=40 --json=out.json
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
const ruleFilter = argValue('rule')?.split(',').map((r) => r.trim()).filter(Boolean) ?? null;
const limit = Number(argValue('limit') || 0);
const jsonOut = argValue('json');
const viewportWidth = Number(argValue('width') || 1280);
const includeScale = args.includes('--include-scale');

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
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(staticDir, safePath);
      if (!filePath.startsWith(staticDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      // Headers must wait until the file actually opens: writing them up front makes a read
      // error unrecoverable ("headers already sent") and takes the whole audit down with it.
      const stream = createReadStream(filePath);
      stream.once('open', () => {
        res.writeHead(200, { 'content-type': contentType(filePath) });
        stream.pipe(res);
      });
      stream.once('error', () => {
        if (!res.headersSent) res.writeHead(404);
        res.end('Not found');
      });
    } catch {
      res.writeHead(500);
      res.end('Error');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

/** The audit runs inside the page; it must be self-contained. */
function auditInPage() {
  const SPACING = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 112, 128]);
  const TYPE_SCALE = new Set([56, 40, 36, 32, 28, 24, 22, 20, 18, 17, 16, 15, 14, 13, 12, 11]);
  const findings = [];
  const add = (rule, detail, extra) => findings.push({ rule, detail, ...extra });

  // A Docs page renders into Storybook's docs container, not the story root. Only reach for it
  // in docs mode: on a story page that container exists but is empty, which would report every
  // canvas as blank.
  const root = (window.__auditDocsMode && document.querySelector('#storybook-docs, .sbdocs-wrapper'))
    || document.querySelector('#storybook-root')
    || document.body;
  const px = (v) => { const n = Number.parseFloat(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : null; };
  const label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : '';
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ''}`;
  };

  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    // Name the widest offender so the finding is actionable.
    let worst = null;
    for (const el of root.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > de.clientWidth + 1 && (!worst || r.right > worst.right)) worst = { el, right: r.right };
    }
    add('page-overflow', `${de.scrollWidth}px content in a ${de.clientWidth}px viewport`, {
      culprit: worst ? label(worst.el) : null,
    });
  }

  // Icon-only components legitimately render no text, so emptiness is judged by painted area.
  const painted = [...root.querySelectorAll('*')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  });
  if (painted.length === 0) {
    add('invisible-canvas', 'the story painted nothing measurable');
  }

  /*
   * A Docs page is a collection of story previews, not one document. Each embedded demo is a
   * self-contained page — a dashboard shell demo rightly owns an h1 — so the heading outline
   * is judged per preview there and across the whole canvas everywhere else. Measuring the
   * collection as one document reports five correct demos as five duplicate titles.
   *
   * The reverse is also true and is NOT this script's job: a reader sees the Docs page as one
   * document and judges its title, type ramp and rhythm as one. This exemption once meant
   * nothing checked that, and 68 of 68 LDS Core Docs pages drifted while this reported zero.
   * `scripts/audit-docs-surface-system.mjs` (npm run check:docs-surface) now owns it, measuring
   * everything OUTSIDE `.docs-story` — exactly what this scope deliberately skips.
   */
  const previewFrames = [...document.querySelectorAll('.docs-story')];
  const outlineScopes = window.__auditDocsMode && previewFrames.length > 0 ? previewFrames : [root];

  for (const scope of outlineScopes) {
    const headings = [...scope.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter((h) => h.offsetParent !== null || h.getClientRects().length > 0);

    const h1s = headings.filter((h) => h.tagName === 'H1');
    if (h1s.length > 1) {
      add('multiple-h1', `${h1s.length} document titles`, {
        culprit: h1s.map((h) => (h.textContent || '').trim().slice(0, 40)).join(' | '),
      });
    }

    let previous = 0;
    for (const heading of headings) {
      const level = Number(heading.tagName.slice(1));
      if (previous && level > previous + 1) {
        add('heading-skip', `h${previous} -> h${level}`, { culprit: label(heading) });
        break;
      }
      previous = level;
    }

    const seenHeading = new Map();
    for (const heading of headings) {
      const text = (heading.textContent || '').trim().replace(/\s+/g, ' ');
      if (text.length < 4) continue;
      seenHeading.set(text, (seenHeading.get(text) || 0) + 1);
    }
    for (const [text, count] of seenHeading) {
      if (count > 1) add('duplicate-heading', `"${text.slice(0, 50)}" appears ${count}x`, {});
    }
  }

  // --- spacing and type -----------------------------------------------------
  const offScaleGaps = new Map();
  const offScaleFonts = new Map();
  let collapsed = 0;
  let collapsedSample = null;

  for (const el of root.querySelectorAll('*')) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const cs = getComputedStyle(el);

    if (cs.display === 'flex' || cs.display === 'grid' || cs.display === 'inline-flex') {
      const kids = [...el.children].filter((c) => c.getBoundingClientRect().height > 0);
      if (kids.length > 1) {
        const rowGap = px(cs.rowGap);
        const colGap = px(cs.columnGap);
        for (const gap of [rowGap, colGap]) {
          if (gap == null || Number.isNaN(gap)) continue;
          if (!SPACING.has(gap)) {
            const key = `${gap}px`;
            offScaleGaps.set(key, (offScaleGaps.get(key) || 0) + 1);
          }
        }
        // A stack of blocks that touch exactly is almost always a dropped declaration.
        const stacked = cs.flexDirection === 'column' || cs.display === 'grid';
        if (stacked && rowGap === 0 && kids.length > 2) {
          const rects = kids.map((k) => k.getBoundingClientRect());
          const touching = rects.every((r, i) => i === 0 || Math.abs(r.top - rects[i - 1].bottom) < 0.5);
          const noMargin = kids.every((k) => px(getComputedStyle(k).marginTop) === 0 && px(getComputedStyle(k).marginBottom) === 0);
          const noPadding = kids.every((k) => px(getComputedStyle(k).paddingTop) === 0 && px(getComputedStyle(k).paddingBottom) === 0);
          if (touching && noMargin && noPadding) {
            collapsed += 1;
            if (!collapsedSample) collapsedSample = label(el);
          }
        }
      }
    }

    // Only score type on elements that actually own visible text.
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (ownText) {
      const size = px(cs.fontSize);
      if (size != null && !TYPE_SCALE.has(size)) {
        const key = `${size}px`;
        offScaleFonts.set(key, (offScaleFonts.get(key) || 0) + 1);
      }
    }

    // Content taller than a clipping box is content the reader never sees — unless the box is
    // deliberately hidden (screen-reader-only text) or deliberately clamped (line-clamp).
    const visuallyHidden = rect.width <= 2 || rect.height <= 2 || cs.clipPath !== 'none' || cs.clip !== 'auto';
    const clamped = cs.webkitLineClamp !== 'none' && cs.webkitLineClamp !== '' || cs.lineClamp !== 'none';
    if (!visuallyHidden && !clamped
      && (cs.overflowY === 'hidden' || cs.overflow === 'hidden')
      && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
      const hidden = el.scrollHeight - el.clientHeight;
      if (hidden > 8) add('clipped-content', `${hidden}px hidden below a ${el.clientHeight}px box`, { culprit: label(el) });
    }
  }

  if (collapsed > 0) add('collapsed-gap', `${collapsed} stacked container(s) with 0px separation`, { culprit: collapsedSample });

  /*
   * A separator only reads as one when it has room on both sides. Content resting directly on
   * a rule looks like a mistake even when every token is correct, so measure from the last
   * painted pixel above the rule to the first below it rather than from box edges — padding
   * lives inside the boxes, so box-to-box distance is always zero and proves nothing.
   */
  const inkEdge = (el, side) => {
    let best = side === 'bottom' ? -Infinity : Infinity;
    for (const node of el.querySelectorAll('*')) {
      const box = node.getBoundingClientRect();
      if (box.height <= 0 || box.width <= 0) continue;
      best = side === 'bottom' ? Math.max(best, box.bottom) : Math.min(best, box.top);
    }
    if (!Number.isFinite(best)) return el.getBoundingClientRect()[side];
    return best;
  };
  for (const rule of root.querySelectorAll('hr, [role="separator"]')) {
    const box = rule.getBoundingClientRect();
    if (box.width < 24) continue;
    const previous = rule.previousElementSibling;
    const next = rule.nextElementSibling;
    const above = previous ? Math.round(box.top - inkEdge(previous, 'bottom')) : null;
    const below = next ? Math.round(inkEdge(next, 'top') - box.bottom) : null;
    // A negative distance means the neighbours overlap the rule — sticky headers, absolutely
    // positioned chronology markers — where linear box order says nothing about breathing room.
    const tight = [['above', above], ['below', below]].filter(([, gap]) => gap != null && gap >= 0 && gap < 8);
    if (tight.length > 0) {
      add('crowded-divider', tight.map(([side, gap]) => `${gap}px ${side}`).join(', '), {
        culprit: label(previous || next || rule),
      });
    }
  }
  // Off-scale gaps and font sizes overwhelmingly resolve to micro-spacing inside shipped
  // components, which source-level gates already ratchet. They are opt-in so the default run
  // reports page composition rather than 300 lines of component internals.
  if (window.__auditIncludeScale) {
    for (const [value, count] of offScaleGaps) add('off-scale-gap', `${value} x${count}`, {});
    for (const [value, count] of offScaleFonts) add('off-scale-font', `${value} x${count}`, {});
  }

  // --- generated prose cut mid-sentence -------------------------------------
  const text = root.innerText || '';
  const truncated = text.match(/[^\n]{0,40}(?:…\.|\.{4,})/g);
  if (truncated) {
    add('truncated-text', `${truncated.length} sentence(s) cut mid-word`, {
      culprit: truncated[0].trim().slice(-46),
    });
  }

  return findings;
}

async function main() {
  const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
  // Docs pages carry the component decision guides, so they are audited alongside stories.
  let entries = Object.values(index.entries || {})
    .filter((entry) => entry.type === 'story' || entry.type === 'docs')
    .filter((entry) => !(entry.tags || []).includes('visual-parity'));
  if (pattern) entries = entries.filter((e) => pattern.test(`${e.id} ${e.title} ${e.name}`));
  if (limit) entries = entries.slice(0, limit);
  if (entries.length === 0) throw new Error('No stories matched.');

  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 900 } });

  const results = [];
  let scanned = 0;

  for (const entry of entries) {
    const viewMode = entry.type === 'docs' ? 'docs' : 'story';
    const url = `${origin}/iframe.html?id=${encodeURIComponent(entry.id)}&viewMode=${viewMode}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector('#storybook-root, #root', { state: 'attached', timeout: 30000 });
      // Let play functions, fonts, lazy guide loads and layout settle before measuring.
      await page.waitForTimeout(viewMode === 'docs' ? 1200 : 450);
      await page.evaluate(([scale, docs]) => {
        window.__auditIncludeScale = scale;
        window.__auditDocsMode = docs;
      }, [includeScale, viewMode === 'docs']);
      let findings = await page.evaluate(auditInPage);
      if (ruleFilter) findings = findings.filter((f) => ruleFilter.includes(f.rule));
      if (findings.length) results.push({ id: entry.id, title: entry.title, name: entry.name, findings });
    } catch (error) {
      results.push({ id: entry.id, title: entry.title, name: entry.name, findings: [{ rule: 'render-error', detail: error.message.slice(0, 120) }] });
    }
    scanned += 1;
    if (scanned % 25 === 0) process.stderr.write(`  …${scanned}/${entries.length}\n`);
  }

  await browser.close();
  server.close();

  const byRule = new Map();
  for (const result of results) {
    for (const finding of result.findings) {
      if (!byRule.has(finding.rule)) byRule.set(finding.rule, []);
      byRule.get(finding.rule).push({ ...finding, story: result.id, title: result.title, name: result.name });
    }
  }

  console.log(`\nAudited ${entries.length} stories at ${viewportWidth}px. ${results.length} with findings.\n`);
  const ordered = [...byRule.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [rule, list] of ordered) {
    const pages = new Set(list.map((f) => f.title)).size;
    console.log(`${rule.padEnd(20)} ${String(list.length).padStart(5)} finding(s) across ${pages} page(s)`);
  }
  console.log('');
  for (const [rule, list] of ordered) {
    console.log(`\n=== ${rule} ===`);
    const byTitle = new Map();
    for (const f of list) {
      if (!byTitle.has(f.title)) byTitle.set(f.title, []);
      byTitle.get(f.title).push(f);
    }
    for (const [title, list2] of [...byTitle.entries()].slice(0, 12)) {
      const sample = list2[0];
      console.log(`  ${title} (${list2.length})`);
      console.log(`      ${sample.detail}${sample.culprit ? `  <- ${sample.culprit}` : ''}`);
    }
    if (byTitle.size > 12) console.log(`  …and ${byTitle.size - 12} more page(s)`);
  }

  if (jsonOut) {
    await writeFile(jsonOut, `${JSON.stringify({ viewportWidth, scanned: entries.length, results }, null, 2)}\n`);
    console.log(`\nWrote ${jsonOut}`);
  }
}

await main();
