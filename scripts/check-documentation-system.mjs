import { spawnSync } from 'node:child_process';
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
  path.join(root, 'CLAUDE.md'),
  path.join(root, 'llms.txt'),
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

// HANDOFF.md는 2026-08-16에 현재 상태 권위에서 내려왔다. 손으로 갱신하는
// 숫자(robotics 버전·소스 엔트리 수·스토리 수)를 담고 있어 반드시 낡는데,
// "Current"를 달고 있으면 새 문서를 무력화한다 — 이관 시험에서 실제로
// 그렇게 작동하는 것이 확인됐다. 현재 상태의 권위는 docs/README.md의 표이고,
// 그 표는 전부 스크립트 산출물이나 실물 파일을 가리킨다.
//
// 이 검사는 이제 반대를 강제한다: HANDOFF.md는 스스로 폐기됨을 밝히고
// 대체 문서로 안내해야 한다.
const handoff = await read('docs/HANDOFF.md');
assert(handoff.includes('| Type | Historical handoff pointer |'), 'HANDOFF.md must declare itself a historical pointer, not the current-state authority.');
assert(/Status \| \*\*Superseded/.test(handoff), 'HANDOFF.md must carry a superseded status.');
assert(handoff.includes('[`OPERATIONS.md`](OPERATIONS.md)'), 'HANDOFF.md must redirect to the operations entry point.');
assert(handoff.includes('[`README.md`](README.md)'), 'HANDOFF.md must link the documentation index.');
assert(handoff.includes('[`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)'), 'HANDOFF.md must link the canonical component workflow.');

const rootReadme = await read('readme.md');
assert(rootReadme.includes('docs/README.md'), 'Root readme must link the documentation index.');
assert(rootReadme.includes('docs/COMPONENT_WORKFLOW.md'), 'Root readme must link the canonical component workflow.');

const adoptionContract = JSON.parse(await read('docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json'));
const adoptionWorkflow = await read('docs/LDS_UI_ADOPTION_WORKFLOW.md');
const rootLlms = await read('llms.txt');
const agents = await read('AGENTS.md');
const claude = await read('CLAUDE.md');
const aiGuide = await read('docs/AI_DESIGN_SYSTEM_GUIDE.md');
const migrationGuide = await read('docs/PACKAGE_MIGRATION_GUIDE.md');
const adoptionEntrypoints = [
  ['readme.md', rootReadme],
  ['AGENTS.md', agents],
  ['docs/README.md', index],
  ['docs/AI_DESIGN_SYSTEM_GUIDE.md', aiGuide],
];

for (const [file, source] of adoptionEntrypoints) {
  assert(source.includes(adoptionContract.invariant), `${file} must state the LDS adoption invariant.`);
  assert(source.includes('LDS_UI_ADOPTION_WORKFLOW.md'), `${file} must link the canonical LDS adoption workflow.`);
}
assert(rootReadme.includes('llms.txt'), 'Root readme must link the root AI entry.');
assert(index.includes('../llms.txt'), 'Documentation index must link the root AI entry.');
assert(aiGuide.includes('../llms.txt'), 'AI guide must link the root AI entry.');
for (const roboticsEntry of [
  '@lk-design-system/lds-robotics-ui/llms.txt',
  '@lk-design-system/lds-robotics-ui/design-system.json',
  'https://lk-design-system.github.io/lk-design-system-robotics/?path=/docs/lds-robotics-foundation-viewer-tokens--docs',
]) {
  assert(rootReadme.includes(roboticsEntry), `Root readme must expose Robotics documentation entry ${roboticsEntry}.`);
  assert(index.includes(roboticsEntry), `Documentation index must expose Robotics documentation entry ${roboticsEntry}.`);
}
for (const roboticsAgentEntry of [
  '@lk-design-system/lds-robotics-ui/llms.txt',
  '@lk-design-system/lds-robotics-ui/design-system.json',
  'https://lk-design-system.github.io/lk-design-system-robotics/?path=/docs/lds-robotics-foundation-viewer-tokens--docs',
]) {
  assert(agents.includes(roboticsAgentEntry), `AGENTS.md must route Robotics consumers to ${roboticsAgentEntry}.`);
}
for (const migrationEntry of [
  'ROBOTICS_EXTERNAL_SURFACE.json',
  '@lk-design-system/lds-robotics-ui/llms.txt',
  '@lk-design-system/lds-robotics-ui/design-system.json',
  '@lk-design-system/lds-robotics-ui/docs/*',
]) {
  assert(migrationGuide.includes(migrationEntry), `Package migration guide must expose current Robotics entry ${migrationEntry}.`);
}
assert(
  migrationGuide.includes('immutable historical attestation, not the current release pointer'),
  'Package migration guide must distinguish the historical Wave 2 attestation from current package manifests.',
);
assert(
  claude.includes('@AGENTS.md'),
  'CLAUDE.md must import AGENTS.md instead of duplicating repository instructions.',
);
assert(
  adoptionWorkflow.includes('직접 수정하지 않습니다.'),
  'Generated LDS adoption workflow must declare that its machine contract is the editable source.',
);
assert(
  rootLlms.includes('docs/references/adoption/LDS_UI_ADOPTION_CONTRACT.json'),
  'Root llms.txt must identify the canonical machine adoption contract.',
);
assert(rootLlms.includes(adoptionContract.invariant), 'Root llms.txt must include the LDS adoption invariant.');
assert(
  adoptionContract.scopeModes?.default === 'full-surface',
  'The canonical adoption scope must fail safe to full-surface.',
);
assert(
  adoptionWorkflow.includes('`full-surface`') && adoptionWorkflow.includes('`changed-ui`'),
  'Generated adoption workflow must explain the full-surface default and bounded changed-ui exception.',
);
assert(
  agents.includes('Use `full-surface`') && agents.includes('Use `changed-ui` only'),
  'AGENTS.md must route existing-surface migration to full-surface review.',
);
for (const requiredConsumerEntry of [
  '.lds/adoption.config.json',
  'LDS_UI_ADOPTION_REPORT.example.json',
  'check-adoption',
  '.github/actions/lds-adoption/action.yml',
  'fetch-depth: 0',
]) {
  assert(
    adoptionWorkflow.includes(requiredConsumerEntry),
    `Generated adoption workflow must expose consumer enforcement entry ${requiredConsumerEntry}.`,
  );
}

for (const { id } of adoptionContract.facets) {
  for (const [file, source] of adoptionEntrypoints) {
    assert(
      !source.includes(`\`${id}\``),
      `${file} duplicates adoption facet ${id}; detailed facet ids belong only in generated adoption surfaces.`,
    );
  }
}

assert(
  !aiGuide.includes('@lk-design-system/design-system-core'),
  'AI guide must not direct new code to the legacy compatibility facade.',
);
for (const ownerPackage of [
  '@lk-design-system/lds-core',
  '@lk-design-system/lds-theme',
  '@lk-design-system/lds-product',
  '@lk-design-system/lds-robotics-ui',
]) {
  assert(aiGuide.includes(ownerPackage), `AI guide must name owner package ${ownerPackage}.`);
}

const generatedAdoptionCheck = spawnSync(
  process.execPath,
  ['scripts/generate-lds-adoption-docs.mjs', '--check'],
  { cwd: root, encoding: 'utf8' },
);
assert(
  generatedAdoptionCheck.status === 0,
  `Generated LDS adoption docs are stale or invalid:\n${generatedAdoptionCheck.stderr || generatedAdoptionCheck.stdout}`,
);

assert(
  !/\b\d+개(?:의)? React 컴포넌트|\b\d+개 story|\b\d+개 public entry/.test(rootReadme),
  'Root readme must not hard-code volatile component or Storybook counts.',
);
assert(
  !/\b\d+개 Foundation|\b\d+개 public entry|\b\d+개 컴포넌트 의사결정/.test(index),
  'Documentation index must not hard-code volatile Foundation or component counts.',
);

const productCoverage = await read('docs/PRODUCT_FRONTEND_COVERAGE.md');
for (const asset of ['LK Web Viz', 'LK Control Full Daedeok', 'LK Portal']) {
  assert(productCoverage.includes(asset), `Product coverage must explicitly include ${asset}.`);
}

console.log(`Validated documentation system: ${topLevelDocs.length} indexed top-level docs, ${markdownFiles.length} Markdown files, current IA ${summary.pages}/${summary.stories}.`);
