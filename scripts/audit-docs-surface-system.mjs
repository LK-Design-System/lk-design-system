/**
 * Does a Docs page read as one document written in this design system?
 *
 * `audit-storybook-page-quality.mjs` treats a Docs page as what it technically is — a stack of
 * independent story previews — and forgives every inconsistency between them (see its
 * `outlineScopes` exemption). A reader does not see a stack. They see one page, and they judge it
 * as one: one title, one type ramp, one typeface, one rhythm, each thing said once. That gap is
 * how 68 of 68 LDS Core Docs pages broke while every gate stayed green. This audit takes the
 * reader's view.
 *
 * The document is everything OUTSIDE a story preview. Markup inside `.docs-story` is the demo
 * being shown — a mock dashboard's card title is content, not a heading of this page — so it is
 * measured for overflow and for how much of its frame it fills, and left alone otherwise.
 *
 * Rules
 *   foreign-typeface       document prose set in Storybook's typeface instead of the system's
 *   level-size-conflict    one heading level rendered at several sizes in the document
 *   level-size-inversion   a deeper heading level rendered larger than a shallower one
 *   multiple-h1            more than one document title
 *   heading-skip           a heading level skipped on the way down
 *   off-scale-font         a document font-size that is not a step of the LDS type scale
 *   off-scale-rhythm       space between document blocks that is not a step of the spacing scale
 *   empty-frame            a story frame mostly empty because it was sized for a viewport
 *   repeated-prose         the same sentence printed more than once
 *   dead-anchor            an in-page link whose target does not exist
 *   unscoped-anchor        an in-page link that will navigate the manager instead of scrolling
 *   container-mismatch     a guide that does not line up with the story frames above it
 *   page-overflow          the page scrolls sideways at phone width
 *
 * `--manager` additionally drives the real Storybook UI (`/?path=/docs/…`) and clicks a contents
 * link. Nothing else can see that class of bug: Storybook's preview template declares
 * `<base target="_parent">`, so a target-less anchor navigates the whole manager to the bare
 * iframe — and a gate that opens `iframe.html` directly has no parent to lose and passes.
 *
 * Usage
 *   node scripts/audit-docs-surface-system.mjs                       # every LDS Core page
 *   node scripts/audit-docs-surface-system.mjs --manager             # + real-UI anchor navigation
 *   node scripts/audit-docs-surface-system.mjs --pattern=foundation --json=out.json
 */
import { createReadStream } from 'node:fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';
import { assertDocsDedupSourceContract } from './docs-dedup-source-contract.mjs';

const args = process.argv.slice(2);
const argValue = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const requestedUrl = (argValue('url') || 'http://localhost:6006').replace(/\/$/, '');
let baseUrl = requestedUrl;
const pattern = argValue('pattern') ? new RegExp(argValue('pattern'), 'i') : null;
const titlePrefix = argValue('prefix') || 'LDS Core';
const limit = Number(argValue('limit') || 0);
const shard = argValue('shard');
const jsonOut = argValue('json');
const ruleFilter = argValue('rule')?.split(',').map((r) => r.trim()).filter(Boolean) ?? null;
const runManager = args.includes('--manager');
const managerSample = Number(argValue('manager-sample') || 6);
const runDedupContract = args.includes('--dedup-contract');
const sourceOnly = args.includes('--source-only');
const docsDedupContractPath = path.join(
  process.cwd(),
  'docs',
  'references',
  'quality',
  'STORYBOOK_DOCS_DEDUP_CONTRACT.json',
);
const [shardIndex, shardTotal] = shard
  ? shard.split('/').map(Number)
  : [1, 1];

if (
  !Number.isInteger(shardIndex)
  || !Number.isInteger(shardTotal)
  || shardIndex < 1
  || shardIndex > shardTotal
) {
  throw new Error(`Invalid --shard=${shard}; expected INDEX/TOTAL (for example 1/4).`);
}

/** The LDS type scale, in px. A size outside this set is not a decision the system can express. */
const TYPE_SCALE = new Set([56, 40, 36, 32, 28, 24, 22, 20, 18, 17, 16, 15, 14, 13, 12, 11]);
/** The LDS spacing scale, in px, including the declared half steps. */
const SPACE_SCALE = new Set([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64, 80, 112, 128]);
/** The system's own typeface. Anything else in the document is Storybook's chrome leaking in. */
const SYSTEM_FONT = /pretendard/i;
const MONO_FONT = /mono|menlo|consolas|courier/i;
/** A frame this much taller than its content was sized for a viewport it no longer owns. */
const FRAME_FILL_FLOOR = 0.35;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

/**
 * CI has no dev server, so the audit serves the built Storybook itself. `--url` still wins when a
 * dev server is up, which is how it is used while fixing things.
 */
function serveStatic(rootDir) {
  const server = createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
      let filePath = path.join(rootDir, requestPath === '/' ? 'index.html' : requestPath);
      if ((await stat(filePath).catch(() => null))?.isDirectory()) filePath = path.join(filePath, 'index.html');
      if (!(await stat(filePath).catch(() => null))?.isFile()) {
        response.writeHead(404).end('not found');
        return;
      }
      response.writeHead(200, { 'content-type': CONTENT_TYPES[path.extname(filePath)] || 'application/octet-stream' });
      createReadStream(filePath).pipe(response);
    } catch {
      if (!response.headersSent) response.writeHead(500);
      response.end('error');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` }));
  });
}

async function reachable(url) {
  try {
    const response = await fetch(`${url}/index.json`, { signal: AbortSignal.timeout(2500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function fetchIndex() {
  const response = await fetch(`${baseUrl}/index.json`);
  if (!response.ok) throw new Error(`Storybook index unavailable at ${baseUrl} (${response.status})`);
  return response.json();
}

/**
 * Runs inside the page. Reports what a reader would see, not what the component tree contains:
 * computed type, resolved text, and which block each thing belongs to.
 */
const PROBE = () => {
  const root = document.querySelector('.sbdocs-content') || document.querySelector('.sbdocs') || document.body;
  const view = document.defaultView;
  const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const isDemo = (node) => Boolean(node.closest('.docs-story'));

  const blocks = [...root.children].map((child, index) => ({
    index,
    tag: child.tagName,
    className: typeof child.className === 'string' ? child.className : '',
    height: Math.round(child.getBoundingClientRect().height),
    node: child,
  }));
  const ownerOf = (node) => {
    const block = blocks.find((b) => b.node === node || b.node.contains(node));
    if (!block) return 'unknown';
    if (block.className.includes('sbdocs-title')) return 'title';
    if (block.className.includes('sbdocs-subtitle')) return 'subtitle';
    if (block.tag === 'P') return 'description';
    if (block.node.querySelector('[data-foundation-guide]')) return 'foundation-guide';
    if (block.node.querySelector('[data-component-guide]')) return 'component-guide';
    if (block.className.includes('sb-anchor')) return `story-block-${block.index}`;
    return `block-${block.index}`;
  };

  const headings = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((h) => !isDemo(h))
    .map((h) => {
      const style = view.getComputedStyle(h);
      const rect = h.getBoundingClientRect();
      return {
        tag: h.tagName,
        level: Number(h.tagName.slice(1)),
        id: h.id || null,
        text: norm(h.textContent).slice(0, 60),
        owner: ownerOf(h),
        fontSize: Math.round(Number.parseFloat(style.fontSize)),
        fontFamily: style.fontFamily.split(',')[0].replace(/["']/g, ''),
        y: Math.round(rect.top + view.scrollY),
        visible: rect.width > 0 && rect.height > 0,
      };
    });

  // Document prose: leaf elements outside every demo. Their typeface is what the reader reads.
  const prose = [];
  const texts = new Map();
  for (const el of root.querySelectorAll('p,li,td,th,dt,dd,h1,h2,h3,h4,h5,h6,span,a,strong,em,code,label,figcaption')) {
    if (el.children.length > 0 || isDemo(el)) continue;
    const text = norm(el.textContent);
    if (!text) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = view.getComputedStyle(el);
    prose.push({
      tag: el.tagName,
      family: style.fontFamily.split(',')[0].replace(/["']/g, ''),
      size: Math.round(Number.parseFloat(style.fontSize)),
      owner: ownerOf(el),
      text: text.slice(0, 80),
    });
    /*
     * Table cells are exempt. Repeating a value down a column is what a table is for — two props
     * really do share a type — whereas a paragraph or list item repeated is the same thing said
     * twice. A column whose every cell is identical is handled where the table is rendered.
     */
    if (text.length >= 25 && !el.closest('td, th')) {
      const seen = texts.get(text) || { count: 0, owners: [] };
      seen.count += 1;
      const owner = ownerOf(el);
      if (!seen.owners.includes(owner)) seen.owners.push(owner);
      texts.set(text, seen);
    }
  }

  // Space between consecutive document blocks, as the reader perceives it.
  const rhythm = [];
  for (let index = 1; index < blocks.length; index += 1) {
    const previous = blocks[index - 1].node.getBoundingClientRect();
    const current = blocks[index].node.getBoundingClientRect();
    if (previous.height === 0 || current.height === 0) continue;
    rhythm.push({ gap: Math.round(current.top - previous.bottom), after: blocks[index - 1].tag, before: blocks[index].tag });
  }

  // How much of each story frame the demo actually fills.
  const frames = [...root.querySelectorAll('.docs-story')].map((frame) => {
    const shell = frame.querySelector('[data-theme]') || frame;
    const height = Math.round(shell.getBoundingClientRect().height);
    let content = 0;
    for (const child of shell.querySelectorAll('*')) {
      const rect = child.getBoundingClientRect();
      if (rect.height > 0) content = Math.max(content, Math.round(rect.bottom - shell.getBoundingClientRect().top));
    }
    return { height, content, fill: height > 0 ? content / height : 1 };
  });

  // Document anchors only. A placeholder `href="#"` inside a demo is the demo's markup.
  const anchors = [...root.querySelectorAll('a[href^="#"]')].filter((a) => !isDemo(a)).map((a) => ({
    href: a.getAttribute('href'),
    target: a.getAttribute('target'),
    inGuide: Boolean(a.closest('[data-foundation-guide],[data-component-guide],[data-pattern-guide]')),
    resolves: a.getAttribute('href') !== '#' && Boolean(document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))),
  }));

  const guide = root.querySelector('[data-foundation-guide],[data-component-guide],[data-pattern-guide]');
  const preview = root.querySelector('.sbdocs-preview');
  const guides = [...root.querySelectorAll('[data-foundation-guide],[data-component-guide],[data-pattern-guide]')];
  const guideLoading = [...root.querySelectorAll('[data-component-guide-loading]')];
  const guideErrors = [...root.querySelectorAll('[data-component-guide-error]')];
  const controls = [...root.querySelectorAll('.docblock-argstable,[data-testid="story-controls"]')];
  const controlsHeadings = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((heading) => norm(heading.textContent) === 'Controls');
  const componentGuide = root.querySelector('[data-component-guide]');
  const canonicalCallout = componentGuide?.querySelector('[data-canonical-guide-callout]');
  const canonicalLinks = canonicalCallout
    ? [...canonicalCallout.querySelectorAll('[data-canonical-guide-link]')]
    : [];
  const guideSectionCount = componentGuide?.querySelectorAll('section').length ?? 0;
  const guideNavLinks = componentGuide
    ? [...componentGuide.querySelectorAll('nav a[href^="#"]')]
    : [];
  const positiveDecisionPanels = componentGuide?.querySelectorAll('[data-decision-panel="do"]').length ?? 0;
  const negativeDecisionPanels = componentGuide?.querySelectorAll('[data-decision-panel="dont"]').length ?? 0;
  const decisionHeading = norm(componentGuide?.querySelector('#decision')?.textContent);

  /*
   * Titles are counted across the WHOLE page, demos included. A demo keeps its own type scale,
   * but it does not get to claim the document title: a screen reader reads one outline, and a
   * story that renders its own masthead gives the page a second and third h1.
   */
  const titles = [...root.querySelectorAll('h1')]
    .filter((h) => h.getBoundingClientRect().width > 0)
    .map((h) => ({ text: norm(h.textContent).slice(0, 50), demo: isDemo(h), owner: ownerOf(h) }));

  return {
    headings,
    titles,
    prose,
    rhythm,
    frames,
    anchors,
    repeated: [...texts].filter(([, v]) => v.count > 1).map(([text, v]) => ({ text: text.slice(0, 100), ...v })),
    containerWidth: Math.round(root.getBoundingClientRect().width),
    guideRight: guide ? Math.round(guide.getBoundingClientRect().right) : null,
    previewRight: preview ? Math.round(preview.getBoundingClientRect().right) : null,
    documentHeight: document.documentElement.scrollHeight,
    rootTextLength: norm(root.textContent).length,
    rootChildren: root.children.length,
    rootWidth: Math.round(root.getBoundingClientRect().width),
    rootHeight: Math.round(root.getBoundingClientRect().height),
    docsStories: root.querySelectorAll('.docs-story').length,
    controls: controls.length + controlsHeadings.length,
    guideLoading: guideLoading.map((item) => norm(item.textContent).slice(0, 160)),
    guideErrors: guideErrors.map((item) => norm(item.textContent).slice(0, 300)),
    componentGuideContract: componentGuide ? {
      sectionCount: guideSectionCount,
      navLinks: guideNavLinks.map((link) => {
        const href = link.getAttribute('href');
        return {
          href,
          label: norm(link.textContent),
          target: norm(componentGuide.querySelector(href)?.textContent),
        };
      }),
      positiveDecisionPanels,
      negativeDecisionPanels,
      decisionHeading,
      canonical: canonicalCallout ? {
        rawGuidePathVisible: norm(canonicalCallout.textContent).includes('docs/components/guides/'),
        links: canonicalLinks.map((link) => ({
          href: link.getAttribute('href'),
          target: link.getAttribute('target'),
          text: norm(link.textContent),
        })),
      } : null,
    } : null,
    guides: guides.map((item) => ({
      textLength: norm(item.textContent).length,
      width: Math.round(item.getBoundingClientRect().width),
      height: Math.round(item.getBoundingClientRect().height),
    })),
  };
};

const OVERFLOW_PROBE = () => {
  const clientWidth = document.documentElement.clientWidth;
  /*
   * A cell scrolled out of a table's own scroll region still reports a right edge past the
   * viewport, so naming the widest element by rect alone accuses the one thing that is already
   * contained. Only an element with no scrolling ancestor can push the page.
   */
  const contained = (el) => {
    let node = el.parentElement;
    while (node) {
      if (/auto|scroll|hidden/.test(getComputedStyle(node).overflowX)) return true;
      node = node.parentElement;
    }
    return false;
  };
  const culprit = [];
  for (const el of document.querySelectorAll('*')) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.right <= clientWidth + 1 || el.children.length > 0 || contained(el)) continue;
    culprit.push(`${el.tagName}.${(typeof el.className === 'string' ? el.className : '').slice(0, 34)} ${Math.round(rect.width)}px "${(el.textContent || '').trim().slice(0, 40)}"`);
    if (culprit.length >= 3) break;
  }
  return { scrollWidth: document.documentElement.scrollWidth, clientWidth, culprit };
};

function analyse(page, probe, overflow) {
  const findings = [];
  const add = (rule, detail, evidence = []) => findings.push({ page: page.title, rule, detail, evidence });
  const visible = probe.headings.filter((h) => h.visible);

  const foreign = probe.prose.filter((p) => !SYSTEM_FONT.test(p.family) && !MONO_FONT.test(p.family));
  if (foreign.length > 0) {
    const families = [...new Set(foreign.map((p) => p.family))];
    add('foreign-typeface', `문서 텍스트 ${foreign.length}개가 시스템 서체가 아닌 ${families.join(', ')}로 렌더링됩니다.`,
      foreign.slice(0, 5).map((p) => `${p.owner} ${p.tag} "${p.text.slice(0, 40)}" → ${p.family}`));
  }

  const byLevel = new Map();
  for (const h of visible) {
    if (!byLevel.has(h.level)) byLevel.set(h.level, new Map());
    const sizes = byLevel.get(h.level);
    sizes.set(h.fontSize, [...(sizes.get(h.fontSize) || []), h]);
  }
  for (const [level, sizes] of [...byLevel].sort((a, b) => a[0] - b[0])) {
    if (sizes.size > 1) {
      add('level-size-conflict', `h${level}이 한 문서에서 ${[...sizes.keys()].sort((a, b) => b - a).join('px, ')}px로 각각 렌더링됩니다.`,
        [...sizes].map(([size, list]) => `${size}px ← ${list.map((h) => `${h.owner}:"${h.text.slice(0, 24)}"`).join(', ')}`));
    }
  }

  const maxByLevel = new Map([...byLevel].map(([level, sizes]) => [level, Math.max(...sizes.keys())]));
  const levels = [...maxByLevel.keys()].sort((a, b) => a - b);
  for (let i = 0; i < levels.length - 1; i += 1) {
    for (let j = i + 1; j < levels.length; j += 1) {
      if (maxByLevel.get(levels[j]) > maxByLevel.get(levels[i])) {
        add('level-size-inversion', `h${levels[j]}(${maxByLevel.get(levels[j])}px)이 상위 레벨 h${levels[i]}(${maxByLevel.get(levels[i])}px)보다 큽니다.`);
      }
    }
  }

  const titles = probe.titles ?? [];
  if (titles.length > 1) {
    add('multiple-h1', `문서 제목이 ${titles.length}개입니다.`,
      titles.map((h) => `${h.owner}${h.demo ? ' (스토리 내부)' : ''}: "${h.text}"`));
  }

  let previous = 0;
  for (const h of visible) {
    if (previous && h.level > previous + 1) add('heading-skip', `h${previous} 다음에 h${h.level}이 옵니다.`, [`${h.owner}: "${h.text}"`]);
    previous = h.level;
  }

  const offScale = probe.prose.filter((p) => !TYPE_SCALE.has(p.size));
  if (offScale.length > 0) {
    const sizes = [...new Set(offScale.map((p) => p.size))].sort((a, b) => b - a);
    add('off-scale-font', `타입 스케일에 없는 크기 ${sizes.join('px, ')}px가 문서 텍스트 ${offScale.length}곳에 쓰였습니다.`,
      offScale.slice(0, 5).map((p) => `${p.owner} ${p.tag} ${p.size}px "${p.text.slice(0, 34)}"`));
  }

  const offRhythm = probe.rhythm.filter((r) => r.gap > 0 && !SPACE_SCALE.has(r.gap));
  if (offRhythm.length > 0) {
    const gaps = [...new Set(offRhythm.map((r) => r.gap))].sort((a, b) => b - a);
    add('off-scale-rhythm', `블록 사이 간격 ${gaps.join('px, ')}px가 간격 스케일에 없습니다 (${offRhythm.length}곳).`,
      offRhythm.slice(0, 4).map((r) => `${r.after} → ${r.before}: ${r.gap}px`));
  }

  const empty = probe.frames.filter((f) => f.height > 240 && f.fill < FRAME_FILL_FLOOR);
  if (empty.length > 0) {
    const wasted = empty.reduce((sum, f) => sum + (f.height - f.content), 0);
    add('empty-frame', `스토리 프레임 ${empty.length}개가 내용보다 훨씬 큽니다 — 빈 공간 ${wasted}px.`,
      empty.slice(0, 4).map((f) => `${f.height}px 프레임에 내용 ${f.content}px (${Math.round(f.fill * 100)}%)`));
  }

  if (probe.repeated.length > 0) {
    add('repeated-prose', `같은 문장이 한 문서에 여러 번 인쇄됩니다 (${probe.repeated.length}건).`,
      probe.repeated.slice(0, 5).map((r) => `${r.count}× [${r.owners.join(' + ')}] "${r.text.slice(0, 60)}"`));
  }

  const dead = probe.anchors.filter((a) => !a.resolves);
  if (dead.length > 0) {
    add('dead-anchor', `대상이 없는 페이지 내 링크가 ${dead.length}개입니다.`, dead.slice(0, 5).map((a) => a.href));
  }
  /*
   * Storybook's preview declares `<base target="_parent">`, so an anchor without an explicit
   * target navigates the manager window to the bare iframe. The link looks fine and the page
   * even scrolls when the iframe is opened directly — which is why this has to be asserted on
   * the attribute, not only on behaviour.
   */
  const unscoped = probe.anchors.filter((a) => a.inGuide && !a.target);
  if (unscoped.length > 0) {
    add('unscoped-anchor', `가이드 목차 링크 ${unscoped.length}개에 target이 없어 매니저 창을 이동시킵니다.`, unscoped.slice(0, 3).map((a) => a.href));
  }

  if (probe.guideRight != null && probe.previewRight != null && Math.abs(probe.guideRight - probe.previewRight) > 2) {
    add('container-mismatch', `가이드 오른쪽 끝 ${probe.guideRight}px가 스토리 프레임 ${probe.previewRight}px와 어긋납니다.`);
  }

  if (overflow && overflow.scrollWidth > overflow.clientWidth + 1) {
    add('page-overflow', `390px에서 페이지가 가로로 넘칩니다 (${overflow.scrollWidth} / ${overflow.clientWidth}).`, overflow.culprit);
  }

  return findings;
}

function analyseDedupPage(page, probe, allowGuideOmission = false, overflow = null) {
  const findings = [];
  const add = (rule, detail, evidence = []) => findings.push({ page: page.title, rule, detail, evidence });

  if (probe.docsStories > 0) {
    add('embedded-docs-story', `Docs route contains ${probe.docsStories} embedded story preview(s).`);
  }
  if (probe.controls > 0) {
    add('storybook-controls', `Docs route contains ${probe.controls} Storybook Controls surface(s).`);
  }
  if (probe.rootChildren === 0 || probe.rootTextLength < 20 || probe.rootWidth === 0 || probe.rootHeight === 0) {
    add(
      'blank-docs-page',
      'Docs route did not render substantive visible documentation.',
      [`children=${probe.rootChildren}`, `text=${probe.rootTextLength}`, `size=${probe.rootWidth}x${probe.rootHeight}`],
    );
  }
  if (probe.guideErrors.length > 0) {
    add('guide-runtime-error', 'Docs route rendered an explicit component-guide runtime error.', probe.guideErrors);
  }
  if (probe.guideLoading.length > 0) {
    add('guide-runtime-loading', 'Docs route remained on the component-guide loading placeholder.', probe.guideLoading);
  }
  if (!allowGuideOmission && (
    probe.guides.length === 0
    || probe.guides.every((guide) => guide.textLength < 20 || guide.width === 0 || guide.height === 0)
  )) {
    add('empty-guide', 'Docs route did not render a substantive visible decision guide.');
  }
  const contract = probe.componentGuideContract;
  if (contract) {
    const expectedNavLinks = contract.sectionCount > 1 ? contract.sectionCount : 0;
    if (contract.navLinks.length !== expectedNavLinks) {
      add(
        'guide-navigation-density',
        `Component guide rendered ${contract.navLinks.length} section link(s) for ${contract.sectionCount} section(s).`,
      );
    }
    const mismatchedNavLinks = contract.navLinks
      .filter((link) => link.label !== link.target);
    if (mismatchedNavLinks.length > 0) {
      add(
        'guide-navigation-label',
        'Component guide navigation labels must match their target section headings.',
        mismatchedNavLinks.map((link) => JSON.stringify(link)),
      );
    }
    if (
      contract.positiveDecisionPanels === 0
      && contract.negativeDecisionPanels > 0
      && contract.decisionHeading !== '사용하지 않는 경우'
    ) {
      add(
        'negative-only-decision-heading',
        `Negative-only decision guidance uses the heading "${contract.decisionHeading}".`,
      );
    }
    if (contract.canonical) {
      if (
        contract.canonical.links.length !== 1
        || contract.canonical.links[0]?.target !== '_parent'
        || !contract.canonical.links[0]?.href?.includes('?path=/docs/')
      ) {
        add(
          'canonical-guide-link',
          'Canonical guide must expose exactly one manager-targeted Storybook Docs link.',
          contract.canonical.links.map((link) => JSON.stringify(link)),
        );
      }
      if (contract.canonical.rawGuidePathVisible) {
        add('canonical-guide-raw-path', 'Canonical guide exposes an internal Markdown path.');
      }
      if (overflow && overflow.scrollWidth > overflow.clientWidth + 1) {
        add(
          'canonical-guide-overflow',
          `Canonical guide overflows at ${overflow.clientWidth}px (${overflow.scrollWidth}px scroll width).`,
          overflow.culprit,
        );
      }
    }
  }

  return findings;
}

async function auditRepresentativeCanvas(page, representative) {
  const findings = [];
  const storyId = representative.storyId;
  const url = `${baseUrl}/iframe.html?viewMode=story&id=${encodeURIComponent(storyId)}`;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(
      (expectedId) => {
        const root = document.querySelector('#storybook-root') || document.querySelector('#root');
        const render = window.__STORYBOOK_PREVIEW__?.currentRender;
        return render?.story?.id === expectedId
          && root?.children.length > 0
          && root.getBoundingClientRect().height > 0;
      },
      storyId,
      { timeout: 30000 },
    );
    if (representative.play) {
      await page.waitForFunction(
        (expectedId) => window.__LDS_DOCS_DEDUP_LIFECYCLE__?.finished
          ?.some((result) => result?.storyId === expectedId),
        storyId,
        { timeout: 30000 },
      );
    }
    const result = await page.evaluate((expected) => {
      const story = window.__STORYBOOK_PREVIEW__?.currentRender?.story;
      const lifecycle = window.__LDS_DOCS_DEDUP_LIFECYCLE__;
      return {
        hasArg: Object.hasOwn(story?.initialArgs || {}, expected.arg),
        hasControl: Object.hasOwn(story?.argTypes || {}, expected.control)
          && Boolean(story?.argTypes?.[expected.control]?.control),
        hasPlay: Boolean(story?.playFunction),
        playResult: lifecycle?.finished?.find((item) => item?.storyId === expected.storyId) || null,
        playErrors: [
          ...(lifecycle?.playErrors || []),
          ...(lifecycle?.unhandledPlayErrors || []),
          ...(lifecycle?.renderErrors || []),
        ],
      };
    }, representative);

    if (!result.hasArg) {
      findings.push({ page: storyId, rule: 'canvas-args-missing', detail: `Representative Canvas lost arg "${representative.arg}".`, evidence: [] });
    }
    if (!result.hasControl) {
      findings.push({ page: storyId, rule: 'canvas-controls-missing', detail: `Representative Canvas lost control "${representative.control}".`, evidence: [] });
    }
    if (representative.play && (!result.hasPlay || result.playResult?.status !== 'success' || result.playErrors.length > 0)) {
      findings.push({
        page: storyId,
        rule: 'canvas-play-failed',
        detail: 'Representative Canvas play function did not complete successfully.',
        evidence: [JSON.stringify(result).slice(0, 500)],
      });
    }
    if (result.hasArg && result.hasControl) {
      const mutation = await page.evaluate(async (expected) => {
        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        const story = window.__STORYBOOK_PREVIEW__?.currentRender?.story;
        const target = document.querySelector(expected.rendered.selector);
        const readRendered = () => {
          const element = document.querySelector(expected.rendered.selector);
          if (!element) return null;
          if (expected.rendered.property) return element[expected.rendered.property];
          if (expected.rendered.attribute) return element.getAttribute(expected.rendered.attribute);
          return element.textContent?.trim() || '';
        };
        if (!channel || typeof channel.emit !== 'function') {
          return { error: 'Storybook addons channel is unavailable.' };
        }
        if (!story || !target) {
          return { error: `Story or rendered target "${expected.rendered.selector}" is unavailable.` };
        }
        const before = readRendered();
        const lifecycle = window.__LDS_DOCS_DEDUP_LIFECYCLE__;
        const lifecycleCounts = {
          finished: lifecycle?.finished?.length || 0,
          playErrors: lifecycle?.playErrors?.length || 0,
          unhandledPlayErrors: lifecycle?.unhandledPlayErrors?.length || 0,
          renderErrors: lifecycle?.renderErrors?.length || 0,
        };
        channel.emit('updateStoryArgs', {
          storyId: expected.storyId,
          updatedArgs: { [expected.arg]: expected.updatedValue },
        });
        return { before, lifecycleCounts };
      }, representative);
      if (mutation.error) {
        findings.push({ page: storyId, rule: 'canvas-arg-update-failed', detail: mutation.error, evidence: [] });
      } else {
        try {
          await page.waitForFunction(
            (expected) => {
              const preview = window.__STORYBOOK_PREVIEW__;
              const story = preview?.currentRender?.story;
              const lifecycle = window.__LDS_DOCS_DEDUP_LIFECYCLE__;
              const element = document.querySelector(expected.rendered.selector);
              const currentArgs = story ? preview.storyStoreValue?.args?.get(story.id) : null;
              if (!story || !element || currentArgs?.[expected.arg] !== expected.updatedValue) return false;
              if (expected.play && lifecycle?.finished?.length <= expected.finishedCount) return false;
              const rendered = expected.rendered.property
                ? element[expected.rendered.property]
                : expected.rendered.attribute
                  ? element.getAttribute(expected.rendered.attribute)
                  : element.textContent?.trim() || '';
              return expected.rendered.includes
                ? String(rendered).includes(String(expected.updatedValue))
                : rendered === expected.updatedValue;
            },
            { ...representative, finishedCount: mutation.lifecycleCounts.finished },
            { timeout: 15000 },
          );
          const updated = await page.evaluate(({ expected, lifecycleCounts }) => {
            const preview = window.__STORYBOOK_PREVIEW__;
            const story = preview?.currentRender?.story;
            const element = document.querySelector(expected.rendered.selector);
            const lifecycle = window.__LDS_DOCS_DEDUP_LIFECYCLE__;
            const rendered = expected.rendered.property
              ? element?.[expected.rendered.property]
              : expected.rendered.attribute
                ? element?.getAttribute(expected.rendered.attribute)
                : element?.textContent?.trim() || '';
            return {
              arg: story ? preview.storyStoreValue?.args?.get(story.id)?.[expected.arg] : undefined,
              rendered,
              playErrors: [
                ...(lifecycle?.playErrors || []).slice(lifecycleCounts.playErrors),
                ...(lifecycle?.unhandledPlayErrors || []).slice(lifecycleCounts.unhandledPlayErrors),
                ...(lifecycle?.renderErrors || []).slice(lifecycleCounts.renderErrors),
              ],
            };
          }, { expected: representative, lifecycleCounts: mutation.lifecycleCounts });
          if (updated.rendered === mutation.before) {
            findings.push({
              page: storyId,
              rule: 'canvas-render-unchanged',
              detail: `Updating "${representative.arg}" changed Storybook args but not the rendered target.`,
              evidence: [JSON.stringify({ before: mutation.before, after: updated.rendered })],
            });
          }
          if (updated.playErrors.length > 0) {
            findings.push({
              page: storyId,
              rule: 'canvas-play-failed-after-arg-update',
              detail: `Representative ${representative.mode} Canvas play failed after its control arg changed.`,
              evidence: [JSON.stringify(updated.playErrors).slice(0, 500)],
            });
          }
        } catch (error) {
          findings.push({
            page: storyId,
            rule: 'canvas-arg-update-failed',
            detail: `Storybook channel update did not reach both story state and rendered output: ${String(error.message).slice(0, 220)}`,
            evidence: [],
          });
        }
      }
    }
  } catch (error) {
    findings.push({
      page: storyId,
      rule: 'canvas-contract-probe-failed',
      detail: String(error.message).slice(0, 300),
      evidence: [],
    });
  }
  return findings;
}

/**
 * The real UI, because the anchor bug is invisible anywhere else. Clicks a contents link inside
 * the manager and checks that the page scrolled rather than the manager navigating away.
 */
async function auditAnchorsInManager(page, entries) {
  const findings = [];
  for (const entry of entries) {
    try {
      await page.goto(`${baseUrl}/?path=/docs/${encodeURIComponent(entry.id)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForSelector('#storybook-preview-iframe', { timeout: 30000 });
      const frame = page.frameLocator('#storybook-preview-iframe');
      await frame.locator('.sbdocs-content').first().waitFor({ timeout: 30000 });
      await page.waitForTimeout(1800);

      const links = frame.locator('[data-foundation-contents] a, [data-component-guide] nav a');
      const linkCount = await links.count();
      if (linkCount === 0) {
        if (!runDedupContract) {
          findings.push({ page: entry.title, rule: 'no-contents-rail', detail: '문서에 목차가 없습니다.', evidence: [] });
        }
        console.log(`skip  manager anchor  ${entry.title} (no rendered sections)`);
        continue;
      }
      const link = links.nth(Math.min(2, linkCount - 1));
      const href = await link.getAttribute('href');
      await link.click();
      await page.waitForTimeout(1400);

      const sidebarAlive = await page.locator('#storybook-explorer-tree').count() > 0;
      const stillOnManager = page.url().includes('path=');
      const targetState = await page.evaluate((h) => {
        const iframe = document.querySelector('#storybook-preview-iframe');
        const doc = iframe?.contentDocument;
        const target = doc?.getElementById(decodeURIComponent(h.slice(1)));
        const rect = target?.getBoundingClientRect();
        return {
          hash: iframe?.contentWindow?.location.hash || '',
          top: rect ? Math.round(rect.top) : null,
          visible: Boolean(rect && rect.bottom > 0 && rect.top < iframe.contentWindow.innerHeight),
        };
      }, href);

      if (!sidebarAlive || !stillOnManager) {
        findings.push({
          page: entry.title,
          rule: 'anchor-navigates-manager',
          detail: `목차 "${href}" 클릭이 페이지를 스크롤하지 않고 매니저 창을 이동시킵니다.`,
          evidence: [`sidebar=${sidebarAlive}`, `url=${page.url().slice(0, 90)}`],
        });
      } else if (targetState.hash !== href || !targetState.visible) {
        findings.push({
          page: entry.title,
          rule: 'anchor-misses-target',
          detail: `목차 "${href}" 클릭 후 iframe hash 또는 대상 가시성이 일치하지 않습니다.`,
          evidence: [`hash=${targetState.hash}`, `targetTop=${targetState.top}`, `visible=${targetState.visible}`],
        });
      }
      console.log(`${sidebarAlive && stillOnManager && targetState.hash === href && targetState.visible ? 'ok  ' : '  ✗ '}  manager anchor  ${entry.title}`);
    } catch (error) {
      findings.push({ page: entry.title, rule: 'manager-probe-failed', detail: String(error.message).slice(0, 160), evidence: [] });
    }
  }
  return findings;
}

async function auditCanonicalLinksInManager(page, canonicalDocs) {
  const findings = [];
  for (const contract of canonicalDocs) {
    try {
      await page.goto(`${baseUrl}/?path=/docs/${encodeURIComponent(contract.sourceId)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForSelector('#storybook-preview-iframe', { timeout: 30000 });
      const frame = page.frameLocator('#storybook-preview-iframe');
      const link = frame.locator('[data-canonical-guide-link]');
      await link.waitFor({ timeout: 30000 });
      const href = await link.getAttribute('href');
      const expectedPath = `/docs/${contract.targetId}`;
      if (!href?.includes(expectedPath)) {
        findings.push({
          page: contract.sourceId,
          rule: 'canonical-manager-target',
          detail: `Canonical link "${href}" does not name ${contract.targetId}.`,
          evidence: [],
        });
        continue;
      }
      await link.click();
      await page.waitForFunction(
        (path) => new URL(window.location.href).searchParams.get('path') === path,
        expectedPath,
        { timeout: 30000 },
      );
      await Promise.all([
        page.locator('#storybook-explorer-tree').waitFor({ state: 'attached', timeout: 30000 }),
        page.waitForFunction(
          (targetId) => document.querySelector('#storybook-preview-iframe')
            ?.getAttribute('src')
            ?.includes(targetId),
          contract.targetId,
          { timeout: 30000 },
        ),
      ]);
      const sidebarAlive = await page.locator('#storybook-explorer-tree').count() > 0;
      const iframeSrc = await page.locator('#storybook-preview-iframe').getAttribute('src');
      const targetFrame = page.frameLocator('#storybook-preview-iframe');
      await targetFrame.locator('.sbdocs-content').first().waitFor({ timeout: 30000 });
      await targetFrame.locator('[data-component-guide]').first().waitFor({ timeout: 30000 });
      const guideErrors = await targetFrame.locator('[data-component-guide-error]').count();
      if (!sidebarAlive || !iframeSrc?.includes(contract.targetId) || guideErrors > 0) {
        findings.push({
          page: contract.sourceId,
          rule: 'canonical-manager-navigation',
          detail: 'Canonical link did not preserve the Storybook manager and render the target Docs guide.',
          evidence: [`sidebar=${sidebarAlive}`, `iframe=${iframeSrc}`, `guideErrors=${guideErrors}`],
        });
      }
      console.log(`${sidebarAlive && iframeSrc?.includes(contract.targetId) && guideErrors === 0 ? 'ok  ' : '  ✗ '}  canonical link  ${contract.sourceId}`);
    } catch (error) {
      findings.push({
        page: contract.sourceId,
        rule: 'canonical-manager-probe-failed',
        detail: String(error.message).slice(0, 200),
        evidence: [],
      });
    }
  }
  return findings;
}

function validateCanonicalDocsContract(entries, canonicalDocs) {
  const docsIds = new Set(entries.filter((entry) => entry.type === 'docs').map((entry) => entry.id));
  return canonicalDocs.flatMap((contract) => [
    ['source', contract.sourceId],
    ['target', contract.targetId],
  ].filter(([, id]) => !docsIds.has(id)).map(([role, id]) => ({
    page: contract.sourceId,
    rule: 'canonical-docs-index',
    detail: `Canonical ${role} Docs ID is missing from the Storybook index: ${id}.`,
    evidence: [],
  })));
}

async function main() {
  if (runDedupContract) {
    const previewSource = await readFile(path.join(process.cwd(), '.storybook', 'preview.jsx'), 'utf8');
    assertDocsDedupSourceContract(previewSource);
    if (sourceOnly) {
      console.log(
        'Validated Docs dedup source contract: bare page Description retained; no story-bound Description, DocsStory, or Controls blocks.',
      );
      return;
    }
  }

  let staticServer = null;
  if (!(await reachable(baseUrl))) {
    const staticDir = path.join(process.cwd(), 'storybook-static');
    if (!(await stat(path.join(staticDir, 'index.json')).catch(() => null))?.isFile()) {
      throw new Error(`No Storybook at ${requestedUrl} and no build in storybook-static — run \`npm run build-storybook\` first.`);
    }
    const served = await serveStatic(staticDir);
    staticServer = served.server;
    baseUrl = served.origin;
    console.log(`No server at ${requestedUrl}; serving storybook-static at ${baseUrl}`);
  }

  const index = await fetchIndex();
  const entries = Object.values(index.entries);
  const docsDedupContract = runDedupContract
    ? JSON.parse(await readFile(docsDedupContractPath, 'utf8'))
    : null;
  const allowedGuideOmissions = new Set(docsDedupContract?.allowedGuideOmissions || []);
  const docsPages = entries.filter((e) => e.type === 'docs' && (runDedupContract || e.title.startsWith(titlePrefix))
    && (!pattern || pattern.test(e.title)));

  const shardedDocsPages = docsPages.filter((_, index) => index % shardTotal === shardIndex - 1);
  const targets = limit ? shardedDocsPages.slice(0, limit) : shardedDocsPages;
  console.log(
    runDedupContract
      ? `Auditing Docs dedup contract across ${targets.length} routes${shardTotal > 1 ? ` (shard ${shardIndex}/${shardTotal})` : ''} at ${baseUrl}\n`
      : `Auditing ${targets.length} Docs pages under "${titlePrefix}" at ${baseUrl}\n`,
  );

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  if (runDedupContract) {
    await context.addInitScript(() => {
      const lifecycle = { finished: [], playErrors: [], unhandledPlayErrors: [], renderErrors: [] };
      Object.defineProperty(window, '__LDS_DOCS_DEDUP_LIFECYCLE__', {
        configurable: true,
        value: lifecycle,
      });
      const attach = () => {
        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if (!channel || typeof channel.on !== 'function') return false;
        channel.on('storyFinished', (result) => lifecycle.finished.push(result));
        channel.on('playFunctionThrewException', (error) => lifecycle.playErrors.push(error));
        channel.on('unhandledErrorsWhilePlaying', (errors) => lifecycle.unhandledPlayErrors.push(...(errors || [])));
        channel.on('storyThrewException', (error) => lifecycle.renderErrors.push(error));
        channel.on('storyErrored', (error) => lifecycle.renderErrors.push(error));
        return true;
      };
      if (!attach()) {
        const interval = window.setInterval(() => {
          if (attach()) window.clearInterval(interval);
        }, 0);
      }
    });
  }
  const page = await context.newPage();
  const narrow = await context.newPage();
  await narrow.setViewportSize({ width: runDedupContract ? 320 : 390, height: 844 });
  const allFindings = [];
  const pageReports = [];
  if (runDedupContract) {
    allFindings.push(...validateCanonicalDocsContract(entries, docsDedupContract.canonicalDocs || []));
  }
  if (
    runDedupContract
    && !pattern
    && !limit
    && docsPages.length !== docsDedupContract.expected.docs
  ) {
    allFindings.push({
      page: 'Storybook index',
      rule: 'docs-route-count',
      detail: `Expected ${docsDedupContract.expected.docs} Docs routes; found ${docsPages.length}.`,
      evidence: [],
    });
  }

  for (const entry of targets) {
    const url = `${baseUrl}/iframe.html?viewMode=docs&id=${encodeURIComponent(entry.id)}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector('.sbdocs-content, .sbdocs', { timeout: 30000 });
      if (runDedupContract && !allowedGuideOmissions.has(entry.id)) {
        try {
          await page.waitForFunction(
            () => Boolean(document.querySelector('[data-component-guide],[data-foundation-guide],[data-component-guide-error]')),
            null,
            { timeout: 15000 },
          );
        } catch {
          const runtimeState = await page.evaluate(() => ({
            loading: Boolean(document.querySelector('[data-component-guide-loading]')),
            componentLayout: Boolean(document.querySelector('[data-component-guide-layout]')),
            foundationLayout: Boolean(document.querySelector('[data-foundation-guide-layout]')),
          }));
          allFindings.push({
            page: entry.title,
            rule: runtimeState.loading ? 'guide-runtime-timeout' : 'guide-runtime-missing',
            detail: runtimeState.loading
              ? 'Component guide runtime module did not resolve before the audit timeout.'
              : 'Docs route did not resolve a component or foundation guide runtime module.',
            evidence: [JSON.stringify(runtimeState)],
          });
        }
      } else {
        await page.waitForTimeout(runDedupContract ? 100 : 900);
      }
      const probe = await page.evaluate(PROBE);

      let overflow = null;
      if (!runDedupContract || probe.componentGuideContract?.canonical) {
        await narrow.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await narrow.waitForSelector('.sbdocs-content, .sbdocs', { timeout: 30000 });
        if (runDedupContract) {
          await narrow.waitForFunction(
            () => Boolean(document.querySelector('[data-component-guide],[data-component-guide-error]')),
            null,
            { timeout: 15000 },
          );
        } else {
          await narrow.waitForTimeout(700);
        }
        overflow = await narrow.evaluate(OVERFLOW_PROBE);
      }

      const findings = (runDedupContract
        ? analyseDedupPage(entry, probe, allowedGuideOmissions.has(entry.id), overflow)
        : analyse(entry, probe, overflow))
        .filter((f) => !ruleFilter || ruleFilter.includes(f.rule));
      allFindings.push(...findings);
      pageReports.push({ title: entry.title, id: entry.id, ...probe, overflow, findings });
      const mark = findings.length === 0 ? 'ok  ' : `${String(findings.length).padStart(2)} ✗`;
      console.log(`${mark}  ${entry.title}${findings.length ? `  [${[...new Set(findings.map((f) => f.rule))].join(', ')}]` : ''}`);
    } catch (error) {
      allFindings.push({ page: entry.title, rule: 'probe-failed', detail: String(error.message).slice(0, 160), evidence: [] });
      console.log(` ERR  ${entry.title} — ${String(error.message).slice(0, 100)}`);
    }
  }

  if (runManager) {
    console.log('');
    const step = Math.max(1, Math.floor(targets.length / managerSample));
    const sample = targets.filter((_, index) => index % step === 0).slice(0, managerSample);
    allFindings.push(...(await auditAnchorsInManager(page, sample)));
  }
  if (runManager && runDedupContract) {
    allFindings.push(...(await auditCanonicalLinksInManager(page, docsDedupContract.canonicalDocs || [])));
  }
  if (runDedupContract) {
    const representatives = docsDedupContract.representativeCanvas;
    const modes = new Set(representatives.map((item) => item.mode));
    for (const requiredMode of ['controlled', 'uncontrolled']) {
      if (!modes.has(requiredMode)) {
        allFindings.push({
          page: 'Canvas contract',
          rule: 'canvas-mode-missing',
          detail: `Representative Canvas contract is missing a ${requiredMode} story.`,
          evidence: [],
        });
      }
    }
    for (const representative of representatives) {
      allFindings.push(...(await auditRepresentativeCanvas(page, representative)));
    }
  }

  await browser.close();
  staticServer?.close();

  const byRule = new Map();
  for (const finding of allFindings) byRule.set(finding.rule, (byRule.get(finding.rule) || 0) + 1);
  console.log(`\n${targets.length} pages, ${allFindings.length} findings`);
  for (const [rule, count] of [...byRule].sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(4)}  ${rule}`);

  if (jsonOut) {
    await writeFile(jsonOut, JSON.stringify({ baseUrl, pages: pageReports, findings: allFindings }, null, 2));
    console.log(`\nwrote ${jsonOut}`);
  }
  process.exitCode = allFindings.length > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
