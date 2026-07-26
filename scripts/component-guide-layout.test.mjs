import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  decisionSectionTitle,
  publicGuideText,
  shouldShowDecisionPanels,
  shouldRenderSectionNavigation,
  storybookManagerHref,
} from '../stories/ComponentGuide.logic.mjs';

const guideSource = await readFile(
  new URL('../stories/ComponentGuide.shared.jsx', import.meta.url),
  'utf8',
);
const brandStorySource = await readFile(
  new URL('../stories/ThemeBrandSpinner.stories.jsx', import.meta.url),
  'utf8',
);
const brandSpinner = JSON.parse(
  await readFile(
    new URL('../docs/components/runtime/theme-status-brand-spinner.json', import.meta.url),
    'utf8',
  ),
);
const dashboardShell = JSON.parse(
  await readFile(
    new URL(
      '../docs/components/runtime/product-operations-dashboard-dashboard-shell.json',
      import.meta.url,
    ),
    'utf8',
  ),
);

test('decision section titles describe the evidence that is actually rendered', () => {
  assert.equal(decisionSectionTitle(['use'], ['avoid']), '사용 판단');
  assert.equal(decisionSectionTitle(['use'], []), '사용하는 경우');
  assert.equal(decisionSectionTitle([], ['avoid']), '사용하지 않는 경우');
  assert.equal(decisionSectionTitle([], []), '');
});

test('section navigation is useful only when it has at least two destinations', () => {
  assert.equal(shouldRenderSectionNavigation([]), false);
  assert.equal(shouldRenderSectionNavigation([['decision', '사용 판단']]), false);
  assert.equal(
    shouldRenderSectionNavigation([
      ['decision', '사용 판단'],
      ['api', 'Properties'],
    ]),
    true,
  );
});

test('decision panels stay paired and concise; incomplete or dense evidence is progressive', () => {
  assert.equal(shouldShowDecisionPanels(['use'], ['avoid']), true);
  assert.equal(shouldShowDecisionPanels(['use'], []), false);
  assert.equal(shouldShowDecisionPanels([], ['avoid']), false);
  assert.equal(
    shouldShowDecisionPanels(
      ['one', 'two', 'three'],
      ['four', 'five', 'six'],
    ),
    false,
  );
  assert.equal(shouldShowDecisionPanels(['x'.repeat(221)], ['avoid']), false);
});

test('public guide copy replaces maintenance-only state descriptions', () => {
  assert.equal(
    publicGuideText('Static interaction state for examples and visual parity checks.'),
    'Static interaction state for examples and state comparisons.',
  );
  assert.equal(
    publicGuideText('Storybook/state rendering aid for interaction states.'),
    'Static rendering aid for interaction states.',
  );
  assert.equal(
    publicGuideText('Use interaction only to render fixed visual states in Storybook or tests.'),
    'Use interaction only to render fixed visual states in examples.',
  );
  assert.equal(
    publicGuideText('포커스 링은 tokens/focus.css 전역 규칙을 따릅니다.'),
    '포커스 링은 전역 포커스 규칙을 따릅니다.',
  );
  assert.equal(
    publicGuideText('근거와 전체 스코프는 PROSESURFACEPROPOSAL.md.'),
    '',
  );
  assert.equal(
    publicGuideText('Internal Product — 93802fc2aa5d29f930380ae58d51dcb68322b5e7, frontend/src/views/user/index.jsx (8912b51c6eb612bd2beb2ed0206ee78ae6f03f2d): internal workflow evidence'),
    '',
  );
});

test('canonical Storybook links preserve the manager base path', () => {
  const id = 'lds-core-components-status-spinner--docs';
  assert.equal(storybookManagerHref(id, '/iframe.html'), `/?path=/docs/${id}`);
  assert.equal(
    storybookManagerHref(id, '/design-system/iframe.html'),
    `/design-system/?path=/docs/${id}`,
  );
  assert.throws(() => storybookManagerHref('spinner', '/iframe.html'), /Docs ID/);
});

test('embedded canonical guides prioritize the decision without implementation metadata', () => {
  assert.doesNotMatch(guideSource, /data-component-guide-meta/);
  assert.match(guideSource, /data-component-guide-decision-summary/);
  assert.doesNotMatch(guideSource, /title="구현 상태와 소유 컴포넌트"/);
  assert.doesNotMatch(guideSource, /docs\/components\/guides\/\{guide\.slug\}\.md/);
  assert.match(guideSource, /data-canonical-guide-link/);
  assert.match(guideSource, /target="_parent"/);
  assert.match(guideSource, /target="_parent"\s+tone="neutral"/);
  assert.match(guideSource, /정본 열기/);
  assert.doesNotMatch(
    guideSource,
    /docs\/components\/guides\/\{guide\.canonicalGuide\.slug\}\.md/,
  );
});

test('canonical runtime metadata names its actual Storybook Docs target', () => {
  assert.equal(
    brandSpinner.canonicalGuide.storybookDocsId,
    'lds-core-components-status-spinner--docs',
  );
  assert.equal(
    dashboardShell.canonicalGuide.storybookDocsId,
    'lds-product-navigation-dashboard-navigation--docs',
  );
});

test('Brand Spinner page description owns the positive purpose without repeating the avoid rule', () => {
  const componentDescription = brandStorySource.match(
    /docs:\s*\{\s*description:\s*\{\s*component:\s*'([^']+)'/s,
  )?.[1];
  assert.equal(
    componentDescription,
    '브랜드 진입점이나 제품 전환처럼 출처를 함께 강조하는 짧은 대기에 적합합니다.',
  );
  assert.doesNotMatch(componentDescription, /사용하지 않고/);
  assert.equal(brandSpinner.purpose, componentDescription);
  assert.equal(brandSpinner.avoidWhen.length, 1);
  assert.doesNotMatch(brandSpinner.purpose, /사용하지 않고/);
});
