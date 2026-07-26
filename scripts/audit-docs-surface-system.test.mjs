import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { assertDocsDedupSourceContract } from './docs-dedup-source-contract.mjs';

const auditSource = await readFile(new URL('./audit-docs-surface-system.mjs', import.meta.url), 'utf8');
const guideSource = await readFile(new URL('../stories/ComponentGuide.shared.jsx', import.meta.url), 'utf8');
const foundationGuideSource = await readFile(new URL('../stories/FoundationGuide.shared.jsx', import.meta.url), 'utf8');
const patternGuideSource = await readFile(new URL('../stories/PatternGuide.shared.jsx', import.meta.url), 'utf8');
const patternGuideDataSource = await readFile(new URL('../stories/PatternGuide.data.mjs', import.meta.url), 'utf8');
const designTokenStorySource = await readFile(new URL('../stories/FoundationDesignToken.stories.jsx', import.meta.url), 'utf8');
const managerHeadSource = await readFile(new URL('../.storybook/manager-head.html', import.meta.url), 'utf8');
const mainSource = await readFile(new URL('../.storybook/main.js', import.meta.url), 'utf8');
const previewSource = await readFile(new URL('../.storybook/preview.jsx', import.meta.url), 'utf8');
const contract = JSON.parse(
  await readFile(new URL('../docs/references/quality/STORYBOOK_DOCS_DEDUP_CONTRACT.json', import.meta.url), 'utf8'),
);

test('component guide runtime exposes stable loading and rejected-module states', () => {
  assert.match(guideSource, /data-component-guide-loading/);
  assert.match(guideSource, /data-component-guide-error/);
  assert.match(guideSource, /\.catch\(\(error\) =>/);
  assert.match(guideSource, /No component guide runtime module exists/);
});

test('component guide omits a wholly empty property Contract column', () => {
  assert.match(guideSource, /propertyRows\.some\(\(property\) => property\.description\?\.trim\(\)\)/);
  assert.match(
    guideSource,
    /\.\.\.\(hasPropertyDescriptions \? \[\{ key: 'description', label: 'Contract' \}\] : \[\]\)/,
  );
});

test('component guide opens on a concise decision and progressively reveals reference detail', () => {
  assert.match(guideSource, /data-component-guide-decision-summary/);
  assert.match(guideSource, /shouldShowDecisionPanels/);
  assert.match(guideSource, /title="판단 근거 자세히 보기"/);
  assert.match(guideSource, /title="API와 상태 표 보기"/);
  assert.match(guideSource, /title="사용 토큰 보기"/);
  assert.doesNotMatch(guideSource, /전체 가이드:/);
  assert.doesNotMatch(guideSource, /구현 상태와 소유 컴포넌트/);
  assert.doesNotMatch(guideSource, /React 구현 완료/);
  assert.doesNotMatch(guideSource, /Figma 상태 미추적/);
});

test('dedup audit counts resolved guides, not layout or loading wrappers', () => {
  assert.match(
    auditSource,
    /const guides = \[\.\.\.root\.querySelectorAll\('\[data-foundation-guide\],\[data-component-guide\],\[data-pattern-guide\]'\)\]/,
  );
  assert.doesNotMatch(
    auditSource,
    /const guides = \[\.\.\.root\.querySelectorAll\([\s\S]{0,120}data-component-guide-layout/,
  );
  assert.match(auditSource, /guide-runtime-timeout/);
  assert.match(auditSource, /guide-runtime-error/);
  assert.match(auditSource, /guide-runtime-missing/);
  assert.match(auditSource, /canonical-guide-link/);
  assert.match(auditSource, /canonical-guide-overflow/);
  assert.match(auditSource, /guide-navigation-density/);
  assert.match(auditSource, /guide-navigation-label/);
  assert.match(auditSource, /negative-only-decision-heading/);
  assert.match(auditSource, /runDedupContract \? 320 : 390/);
});

test('Pattern Docs share one authority, applicability and decision contract', () => {
  assert.match(patternGuideSource, /data-pattern-guide/);
  assert.match(patternGuideSource, /data-pattern-applicability/);
  assert.match(patternGuideSource, /상태·실패 처리/);
  assert.match(patternGuideSource, /접근성/);
  assert.match(patternGuideSource, /data-pattern-restricted-variants/);
  assert.match(patternGuideDataSource, /name: 'Brand Spinner'/);
  assert.match(patternGuideDataSource, /storybookDocsId: 'lds-theme-status-brand-spinner--docs'/);
  assert.match(patternGuideDataSource, /authority: 'LDS Core'/);
  assert.match(patternGuideDataSource, /type: 'Pattern'/);
  assert.match(previewSource, /patternGuideByTitle/);
  assert.match(previewSource, /<PatternGuide pattern=\{patternGuide\}/);
});

test('Docs source contract keeps the page summary and rejects story-bound Description blocks', () => {
  assert.doesNotThrow(() => assertDocsDedupSourceContract(previewSource));
  assert.doesNotThrow(() => assertDocsDedupSourceContract('<Description />'));
  assert.throws(
    () => assertDocsDedupSourceContract('<Description />\n<Description of={primary.moduleExport} />'),
    /Description with an of prop/,
  );
  assert.throws(
    () => assertDocsDedupSourceContract('<Title />'),
    /retain the bare <Description \/> page summary/,
  );
});

test('Design Token is a decision-first Docs page with no empty specimen Canvas', () => {
  assert.match(foundationGuideSource, /data-design-token-primer/);
  assert.match(foundationGuideSource, /data-design-token-flow/);
  assert.match(foundationGuideSource, /data-design-token-decisions/);
  assert.match(foundationGuideSource, /slug === 'design-token'/);
  assert.match(designTokenStorySource, /data-canonical-docs-entry/);
  assert.doesNotMatch(designTokenStorySource, /foundationSpecimenStory/);
});

test('Color exposes semantic roles before its exhaustive contents', () => {
  assert.match(foundationGuideSource, /data-color-primer/);
  assert.match(foundationGuideSource, /data-color-role-grid/);
  assert.match(foundationGuideSource, /Semantic color roles/);
  assert.match(foundationGuideSource, /slug === 'color'/);
  assert.match(foundationGuideSource, /--color-semantic-primary-normal/);
  assert.match(foundationGuideSource, /--color-semantic-status-negative/);
});

test('legacy Design Token Canvas bookmarks resolve to the canonical Docs route', () => {
  assert.match(
    managerHeadSource,
    /'\/story\/lds-core-foundation-design-token--overview':\s*[\r\n\s]*'\/docs\/lds-core-foundation-design-token--docs'/,
  );
  assert.match(managerHeadSource, /window\.location\.replace\(url\)/);
  assert.match(designTokenStorySource, /target="_parent"/);
  assert.match(designTokenStorySource, /storybookManagerHref\(DOCS_ID\)/);
  assert.match(designTokenStorySource, /React\.useEffect\(\(\) =>/);
  assert.match(designTokenStorySource, /window\.parent\.location\.replace\(managerUrl\)/);
  assert.match(designTokenStorySource, /searchParams\.get\('path'\) !== `\/story\/\$\{OVERVIEW_ID\}`/);
  assert.match(mainSource, /sidebarOnboardingChecklist:\s*false/);
  assert.match(mainSource, /menuOnboardingChecklist:\s*false/);
  assert.match(managerHeadSource, /window\.FEATURES\s*=\s*\{/);
  assert.match(managerHeadSource, /sidebarOnboardingChecklist:\s*false/);
});

test('Canvas contract covers controlled and uncontrolled runtime updates', () => {
  assert.deepEqual(
    contract.representativeCanvas.map(({ mode }) => mode).sort(),
    ['controlled', 'uncontrolled'],
  );
  for (const representative of contract.representativeCanvas) {
    assert.equal(representative.play, true);
    assert.ok(representative.arg);
    assert.ok(representative.control);
    assert.ok(representative.rendered?.selector);
    assert.notEqual(representative.updatedValue, undefined);
  }
  assert.match(auditSource, /channel\.emit\('updateStoryArgs'/);
  assert.doesNotMatch(auditSource, /channel\.emit\('forceReRender'\)/);
  assert.match(auditSource, /preview\.storyStoreValue\?\.args\?\.get\(story\.id\)/);
  assert.match(auditSource, /canvas-render-unchanged/);
});

test('Docs contract pins both canonical manager navigation targets', () => {
  assert.deepEqual(contract.canonicalDocs, [
    {
      sourceId: 'lds-theme-status-brand-spinner--docs',
      targetId: 'lds-core-components-status-spinner--docs',
    },
    {
      sourceId: 'lds-product-layout-dashboard-shell--docs',
      targetId: 'lds-product-navigation-dashboard-navigation--docs',
    },
  ]);
  const canonicalAuditSource = auditSource.match(
    /async function auditCanonicalLinksInManager[\s\S]*?\n}\n\nasync function main/,
  )?.[0] || '';
  assert.match(canonicalAuditSource, /canonical-manager-navigation/);
  assert.match(canonicalAuditSource, /searchParams\.get\('path'\) === path/);
  assert.match(canonicalAuditSource, /\[data-component-guide\]/);
  assert.doesNotMatch(canonicalAuditSource, /waitForURL/);
  assert.match(auditSource, /canonical-docs-index/);
});
