import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function listMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listMarkdown(absolute));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(absolute);
  }
  return files;
}

function countDocumentHeadings(markdown) {
  let fenced = false;
  let count = 0;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (!fenced && /^#\s+\S/.test(line)) count += 1;
  }
  return count;
}

const topLevelDocs = (await readdir(docsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

const index = await read('docs/README.md');
for (const name of topLevelDocs) {
  const source = await read(`docs/${name}`);
  assert(source.includes('| Type |'), `${name} must declare Type metadata.`);
  assert(source.includes('| Status |'), `${name} must declare Status metadata.`);
  assert(source.includes('| Owner |'), `${name} must declare Owner metadata.`);
  assert(countDocumentHeadings(source) === 1, `${name} must contain exactly one document H1 outside code fences.`);
  if (name !== 'README.md') assert(index.includes(`(${name})`), `docs/README.md must link ${name}.`);
}

const markdownFiles = [
  ...await listMarkdown(docsRoot),
  path.join(root, 'readme.md'),
  path.join(root, 'AGENTS.md'),
];

for (const file of markdownFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:\/\/|mailto:|#)/.test(target)) continue;
    target = target.split('#')[0];
    if (!target) continue;
    try {
      target = decodeURIComponent(target);
    } catch {
      throw new Error(`Invalid encoded Markdown link in ${path.relative(root, file)}: ${target}`);
    }
    try {
      await access(path.resolve(path.dirname(file), target));
    } catch {
      throw new Error(`Broken Markdown link in ${path.relative(root, file)}: ${match[1]}`);
    }
  }
}

const design = await read('DESIGN.md');
const designComponentsSection = design.split(/^## Components$/m)[1]?.split(/^## /m)[0] ?? '';
assert(designComponentsSection.length > 0, 'DESIGN.md must contain a "## Components" section.');
const publicClassification = JSON.parse(await read('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'));
const classifiedExportNames = new Set((publicClassification.groups || []).flatMap((group) => group.exports || []));
for (const match of designComponentsSection.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)) {
  assert(
    classifiedExportNames.has(match[1]),
    `DESIGN.md Components section references a component that is not a classified public export: ${match[1]}`,
  );
}

const audit = JSON.parse(await read('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json'));
const ia = await read('docs/STORYBOOK_INFORMATION_ARCHITECTURE.md');
const { summary } = audit;
const iaClaims = [
  `${summary.pages}개 페이지와 ${summary.stories}개 스토리`,
  `공개 스토리: ${summary.publicStories}개`,
  `숨김 스토리: ${summary.hiddenStories}개`,
  `숨김 visual parity: ${summary.roles['visual-parity']}개`,
  `숨김 internal contract: ${summary.roles['internal-contract']}개`,
  `검토 완료 페이지 ${summary.reviewedPages}/${summary.pages}개`,
  `스토리 ${summary.reviewedStories}/${summary.stories}개`,
];
for (const claim of iaClaims) assert(ia.includes(claim), `Storybook IA Markdown is stale; missing: ${claim}`);

const domainPlan = await read('docs/DOMAIN_COMPONENT_EXPANSION_PLAN.md');
assert(!/implementation not started/i.test(domainPlan), 'Completed domain expansion plan still claims implementation not started.');
assert(domainPlan.includes('| Status | Completed · follow-up review active |'), 'Domain expansion plan must declare its completed status.');

const handoff = await read('docs/HANDOFF.md');
assert(handoff.includes('| Type | Current-state pointer |'), 'HANDOFF.md must remain a current-state pointer.');
assert(handoff.includes('[`README.md`](README.md)'), 'HANDOFF.md must link the documentation index.');
assert(handoff.includes('[`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)'), 'HANDOFF.md must link the canonical component workflow.');

const rootReadme = await read('readme.md');
assert(rootReadme.includes('docs/README.md'), 'Root readme must link the documentation index.');
assert(rootReadme.includes('docs/COMPONENT_WORKFLOW.md'), 'Root readme must link the canonical component workflow.');

const productCoverage = await read('docs/PRODUCT_FRONTEND_COVERAGE.md');
for (const asset of ['LK Web Viz', 'LK Control Full Daedeok', 'LK Portal']) {
  assert(productCoverage.includes(asset), `Product coverage must explicitly include ${asset}.`);
}

console.log(`Validated documentation system: ${topLevelDocs.length} indexed top-level docs, ${markdownFiles.length} Markdown files, current IA ${summary.pages}/${summary.stories}.`);
