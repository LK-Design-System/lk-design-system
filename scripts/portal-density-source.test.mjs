import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Source-only SSR contract checks. No emitted bundle, package projection,
// browser control or baseline generation occurs here.
const require = createRequire(import.meta.url);
const bundle = await build({
  stdin: {
    contents: `export { ListCell } from './components/content/ListCell.jsx';
      export { ResourceState } from './components/data/ResourceState.jsx';
      export { EmptyState } from './components/status/EmptyState.jsx';
      export { Table, getTableHeaderCellStyle, getTableDataCellStyle } from './components/data/Table.jsx';
      export { MessageComposer } from './components/communication/MessageComposer.jsx';
      export { ShellPanel } from './components/layout/ShellPanel.jsx';
      export { ConversationList } from './components/communication/ConversationList.jsx';`,
    resolveDir: process.cwd(),
  },
  bundle: true, write: false, format: 'cjs', platform: 'node',
  jsx: 'automatic', external: ['react', 'react/jsx-runtime'], logLevel: 'silent',
});
const compiled = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, compiled, compiled.exports);
const source = compiled.exports;
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test('empty reason changes meaning without changing polite state or heading', () => {
  const glyphs = new Set();
  for (const [emptyReason, title] of [
    ['initial', '아직 등록된 데이터가 없습니다'],
    ['search', '검색 결과가 없습니다'],
    ['filter', '조건에 맞는 데이터가 없습니다'],
  ]) {
    const html = render(source.ResourceState, { state: 'empty', density: 'compact', emptyReason, headingLevel: 3 });
    assert.ok(html.includes(title));
    assert.match(html, /role="status" aria-live="polite"/);
    assert.match(html, /<h3/);
    assert.doesNotMatch(html, /data-icon-missing/);
    const glyph = html.match(/<svg[^>]*>.*?<\/svg>/s)?.[0];
    assert.ok(glyph, 'An existing registry glyph conveys the empty reason');
    glyphs.add(glyph);
    assert.doesNotMatch(html, /emptyReason=|density=|role="alert"/);
  }
  assert.equal(glyphs.size, 3, 'Initial, search and filter do not share the same illustration');
});

test('compact state preserves real last-good content, product copy and assertive blocking errors', () => {
  const content = React.createElement('p', null, '지난 정상 자료');
  const preserved = render(source.ResourceState, { state: 'error', density: 'compact', children: content });
  assert.match(preserved, /data-preserves-content="true"/);
  assert.ok(preserved.includes('지난 정상 자료'));
  assert.doesNotMatch(preserved, /role="alert"/);
  const blocked = render(source.ResourceState, { state: 'error', density: 'compact' });
  assert.match(blocked, /role="alert"/);
  const custom = render(source.ResourceState, { state: 'empty', emptyReason: 'search', title: '자료를 찾지 못했습니다', description: '다른 이름을 검색하세요.' });
  assert.ok(custom.includes('자료를 찾지 못했습니다'));
  assert.ok(custom.includes('다른 이름을 검색하세요.'));
});

test('xs Table shares header/data helpers while preserving native naming and row headers', () => {
  const columns = [{ key: 'title', label: '자료', wrap: true }];
  const html = render(source.Table, { size: 'xs', caption: '자료 목록', columns, rows: [{ title: '긴 자료 이름' }], rowHeaderKey: 'title' });
  assert.match(html, /<caption[^>]*>자료 목록<\/caption>/);
  assert.match(html, /<th scope="col"/);
  assert.match(html, /<th scope="row"/);
  assert.ok(html.includes('overflow-wrap:anywhere'));
  assert.equal(source.getTableHeaderCellStyle({ size: 'xs' }).height, 'var(--space-8)');
  assert.equal(source.getTableDataCellStyle({ size: 'xs' }).height, 'calc(var(--space-8) + var(--space-1))');
  assert.notEqual(source.getTableHeaderCellStyle({ size: 'sm' }).height, source.getTableHeaderCellStyle({ size: 'xs' }).height);
});

test('small list preset is consumed and current creation action remains a quiet real link', () => {
  const cell = render(source.ListCell, { title: '문서', typography: 'small', verticalPadding: 'small', selected: true, selectedPresentation: 'tint' });
  assert.ok(cell.includes('font-size:var(--label1-size)'));
  assert.doesNotMatch(cell, /typography=/);
  const primary = render(source.ShellPanel, { title: '질문', primaryAction: { label: '새 질문', href: '/', current: true } });
  assert.match(primary, /<a[^>]*aria-current="page"[^>]*href="\/"/);
  assert.ok(primary.includes('font-weight:var(--fw-semibold)'));
  assert.doesNotMatch(primary, /background:var\(--component-shell-panel-active-surface\)/);
  const panel = render(source.ShellPanel, { title: '장치', density: 'compact', children: React.createElement(source.ListCell, { title: '장치 목록', typography: 'small', verticalPadding: 'small', paddingX: 'var(--space-2)' }) });
  assert.match(panel, /data-density="compact"/);
  assert.ok(panel.includes('min-height:var(--space-10)'));
  assert.ok(panel.includes('font-size:var(--label1-size)'));
  assert.doesNotMatch(panel, /\sdensity="compact"/);
});

test('long conversation title and menu remain separate keyboard targets', () => {
  const title = '프로젝트 자료와 Model evaluation results의 긴 제목';
  const html = render(source.ConversationList, {
    'aria-label': '최근 대화', groups: [{ id: 'today', label: '오늘', items: [{ id: '1', title, href: '#1' }] }],
    itemActions: [{ id: 'rename', label: '이름 바꾸기' }],
  });
  assert.ok(html.includes(`title="${title}"`));
  assert.match(html, /<a[^>]*>.*?<\/a><span class="lk-conversation-list__action"/s);
  assert.match(html, /aria-haspopup="menu"/);
});

test('inline composer is opt-in, preserves native input/action order and expands for slots', () => {
  const props = { value: '', onValueChange: () => {}, onSubmit: () => {}, density: 'compact' };
  const stacked = render(source.MessageComposer, props);
  assert.match(stacked, /data-layout="stacked" data-composer-layout="stacked"/);
  assert.ok(stacked.includes('min-height:var(--space-8)'));
  assert.doesNotMatch(stacked, /grid-template-columns/);
  const inline = render(source.MessageComposer, { ...props, layout: 'inline', placeholder: '무엇을 도와드릴까요?' });
  assert.match(inline, /data-layout="inline" data-composer-layout="inline"/);
  assert.ok(inline.includes('grid-template-columns:minmax(0, 1fr) auto'));
  assert.ok(inline.includes('--lds-button-height:calc(var(--space-10) + var(--space-1))'));
  assert.match(inline, /<textarea[^>]*placeholder="무엇을 도와드릴까요\?"[^>]*>.*?<\/textarea>.*?<button(?=[^>]*type="submit")(?=[^>]*aria-label="메시지 보내기")(?=[^>]*disabled="")[^>]*>/s);
  assert.doesNotMatch(inline, /\slayout="inline"/);
  for (const slots of [
    { attachments: React.createElement('span', null, '첨부 자료') },
    { leadingActions: React.createElement('button', { type: 'button' }, '파일 추가') },
    { trailingActions: React.createElement('button', { type: 'button' }, '음성 입력') },
  ]) {
    const expanded = render(source.MessageComposer, { ...props, layout: 'inline', value: '유지할 초안', ...slots });
    assert.match(expanded, /data-layout="inline" data-composer-layout="stacked"/);
    assert.ok(expanded.includes('유지할 초안'));
    assert.ok(expanded.includes('--lds-button-height:calc(var(--space-10) + var(--space-1))'));
    assert.doesNotMatch(expanded, /grid-template-columns/);
  }
  const streaming = render(source.MessageComposer, { ...props, layout: 'inline', state: 'streaming', onStop: () => {} });
  assert.match(streaming, /aria-busy="true"/);
  assert.match(streaming, /type="button"[^>]*aria-label="응답 중지"/);
  assert.match(streaming, /role="status" aria-live="polite"/);
  const disabled = render(source.MessageComposer, { ...props, layout: 'inline', disabled: true, disabledReason: '연결을 확인하세요' });
  assert.ok(disabled.includes('연결을 확인하세요'));
  assert.match(disabled, /data-composer-shell=""[^>]*inert=/);
});

test('focused story modules parse without emitting generated output', async () => {
  const files = ['ContentListsMedia', 'FormSearchAutocomplete', 'LayoutShellPanel', 'LayoutDashboardShell', 'CommunicationMessageComposer', 'CommunicationConversationList', 'DataResourceState', 'DataTable'];
  const { transform } = await import('esbuild');
  for (const name of files) {
    const text = await readFile(`stories/${name}.stories.jsx`, 'utf8');
    await transform(text, { loader: 'jsx', jsx: 'automatic', sourcefile: `${name}.stories.jsx` });
  }
  await transform(await readFile('stories/CardsExtended.shared.jsx', 'utf8'), { loader: 'jsx', jsx: 'automatic', sourcefile: 'CardsExtended.shared.jsx' });
});

test('metadata follow-up: inline story uses the public interaction prefix without changing its export', async () => {
  const text = await readFile('stories/CommunicationMessageComposer.stories.jsx', 'utf8');
  const file = ts.createSourceFile('composer.jsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const statement = file.statements.find((node) => ts.isVariableStatement(node)
    && node.declarationList.declarations.some((declaration) => declaration.name.getText(file) === 'InlineLayout'));
  assert.ok(statement?.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
  const story = statement.declarationList.declarations[0].initializer;
  const name = story.properties.find((property) => property.name?.getText(file) === 'name').initializer.text;
  assert.match(name, /^상호작용 · \S/);
  assert.ok(story.properties.some((property) => property.name?.getText(file) === 'play'));
  assert.ok(story.properties.some((property) => property.name?.getText(file) === 'render'));
  const census = JSON.parse(await readFile('docs/references/quality/STORYBOOK_DOCS_DEDUP_CONTRACT.json', 'utf8'));
  assert.equal(census.pendingSourceExtension.status, 'review-pending');
  assert.ok(census.pendingSourceExtension.addedStoryIds.includes('lds-product-communication-message-composer--inline-layout'));
  assert.equal(census.reviewedExtension.observedAt, '2026-10-05');
  assert.ok(!census.reviewedExtension.addedStoryIds.includes('lds-product-communication-message-composer--inline-layout'));
});

test('metadata follow-up: density owner decisions move only the three approved public axes', async () => {
  const text = await readFile('scripts/check-density-coverage.mjs', 'utf8');
  const file = ts.createSourceFile('density.mjs', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const declarations = file.statements.filter(ts.isVariableStatement).flatMap((node) => [...node.declarationList.declarations]);
  const items = (name) => declarations.find((node) => node.name.getText(file) === name).initializer.arguments[0].elements;
  const explicit = new Map([...items('EXPLICIT_AXIS_RULES')].map((item) => [item.elements[0].text, [...item.elements[1].elements].map((axis) => axis.text)]));
  const decisions = [
    ...[...explicit.keys()].map((id) => [id, 'explicit-size-density']),
    ...[...items('PROFILE_TOKEN_AUTOMATIC_IDS')].map((item) => [item.text, 'profile-token-automatic']),
    ...[...items('FIXED_IDS')].map((item) => [item.text, 'fixed']),
    ...[...items('NOT_APPLICABLE_RULES')].map((item) => [item.elements[0].text, 'not-applicable']),
  ];
  const byId = new Map(decisions);
  const previous = JSON.parse(await readFile('docs/references/architecture/DENSITY_COVERAGE_CONTRACT.json', 'utf8'));
  const approved = new Map([['shell-panel', 'density'], ['resource-state', 'density'], ['empty-state', 'size']]);
  assert.equal(decisions.length, previous.entries.length);
  assert.equal(byId.size, previous.entries.length);
  for (const entry of previous.entries) {
    assert.equal(byId.get(entry.id), approved.has(entry.id) ? 'explicit-size-density' : entry.category, entry.id);
    if (!approved.has(entry.id)) continue;
    assert.deepEqual(explicit.get(entry.id), [approved.get(entry.id)]);
    const declaration = await readFile(entry.source.replace(/\.jsx$/, '.d.ts'), 'utf8');
    assert.match(declaration, new RegExp(`\\b${approved.get(entry.id)}\\?:`));
  }
});

test('authoring public contracts typecheck on both supported React declaration majors', () => {
  for (const name of ['tsconfig.consumer-react18.json', 'tsconfig.consumer-react19.json']) {
    const config = ts.readConfigFile(name, ts.sys.readFile);
    assert.equal(config.error, undefined);
    const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
    const program = ts.createProgram(['scripts/type-tests/portal-density-source-contract.tsx'], { ...options, noEmit: true });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => process.cwd(), getCanonicalFileName: (file) => file, getNewLine: () => '\n',
    }));
  }
});

test('bounded review metadata pins all three product seams without declaring live adoption', async () => {
  const audit = JSON.parse(await readFile('docs/references/product-frontends/COVERAGE_AUDIT.json', 'utf8'));
  const review = audit.incrementalAuthoringReviews.find(({ id }) => id === 'portal-density-20261009');
  assert.equal(review.stage, 'implemented');
  assert.equal(new Set(review.scope).size, 10);
  assert.equal(review.assetReviews.length, 3);
  assert.match(review.verification.release, /pending/);
  for (const asset of review.assetReviews) {
    assert.match(asset.sourceRevision, /^[a-f0-9]{40}$/);
    assert.ok(asset.sourceFiles.length > 0);
  }
  const handoff = await readFile(review.evidence, 'utf8');
  assert.ok(handoff.includes('Primary references reviewed before implementation'));
});
