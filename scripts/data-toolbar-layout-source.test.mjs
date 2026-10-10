import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Compile only this component in memory, without generated source/dist writes.
// Test-only exports exercise the real private layout functions.
const require = createRequire(import.meta.url);
const result = await build({
  entryPoints: ['components/data/DataToolbar.jsx'],
  bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime'], logLevel: 'silent',
  plugins: [{ name: 'toolbar-test-functions', setup(builder) {
    builder.onLoad({ filter: /[\\/]data[\\/]DataToolbar\.jsx$/ }, async ({ path }) => ({
      contents: await readFile(path, 'utf8') + '\nexport { resolveControlFlow, measureControlFlow };', loader: 'jsx',
    }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, module, module.exports);
const { DataToolbar, resolveControlFlow, measureControlFlow } = module.exports;

test('actual minimum search plus whole filter/sort group chooses complete rows', () => {
  assert.equal(resolveControlFlow(843, 564, 200, 8, true), 'inline');
  assert.equal(resolveControlFlow(854, 564, 200, 8, true), 'inline');
  assert.equal(resolveControlFlow(843, 700, 200, 8, true), 'stacked');
  assert.equal(resolveControlFlow(908, 700, 200, 8, true), 'inline');
  assert.equal(resolveControlFlow(907, 700, 200, 8, true), 'stacked');
});

test('long groups and phone containers use the existing filter drawer', () => {
  assert.equal(resolveControlFlow(843, 844, 200, 8, true), 'narrow');
  assert.equal(resolveControlFlow(843, 843, 200, 8, true), 'stacked');
  assert.equal(resolveControlFlow(767, 150, 200, 8, true), 'narrow');
  assert.equal(resolveControlFlow(768, 150, 200, 8, true), 'inline');
  assert.equal(resolveControlFlow(364, 150, 200, 8, true), 'narrow');
});

test('searchless toolbars do not reserve a phantom search row', () => {
  assert.equal(resolveControlFlow(800, 790, 200, 8, false), 'inline');
  assert.equal(resolveControlFlow(800, 801, 200, 8, false), 'narrow');
});

function fixture({ width = 843, children = [201, 191], sortWidth = 159.296875, search = true, narrow = false } = {}) {
  const element = (width, styles = {}) => ({ getBoundingClientRect: () => ({ width }), styles });
  const controls = element(width, { columnGap: '8px' });
  const filters = children.length ? { children: children.map((w) => element(w)), styles: { columnGap: '6px' } } : null;
  const sort = sortWidth ? element(sortWidth) : null;
  const searchElement = search ? element(200, { minWidth: narrow ? '0px' : '200px' }) : null;
  controls.querySelector = () => searchElement;
  const wide = { styles: { columnGap: '6px' }, querySelector: (selector) => selector.includes('filters') ? filters : sort };
  return {
    ownerDocument: { defaultView: { getComputedStyle: (el) => el.styles } },
    querySelector: (selector) => selector.includes('data-data-toolbar-controls') ? controls : wide,
  };
}

test('measure child widths rather than percentage-clamped max-content basis', () => {
  // Original max-content host was 395.640625, while Select roots need 201+191+6.
  assert.deepEqual(measureControlFlow(fixture()), { mode: 'inline', wideWidth: 564 });
});

test('0/1/2/3 filters count only their existing gaps', () => {
  assert.equal(measureControlFlow(fixture({ children: [] })).wideWidth, 160);
  assert.equal(measureControlFlow(fixture({ children: [201] })).wideWidth, 367);
  assert.equal(measureControlFlow(fixture({ children: [201, 191] })).wideWidth, 564);
  assert.deepEqual(measureControlFlow(fixture({ children: [201, 191, 180] })), { mode: 'stacked', wideWidth: 750 });
});

test('narrow measurement keeps the wide minimum so growing a viewport recovers', () => {
  assert.deepEqual(measureControlFlow(fixture({ width: 800, children: [240, 240], narrow: true })), { mode: 'stacked', wideWidth: 652 });
  assert.equal(measureControlFlow(fixture({ children: [500, 500] })).mode, 'narrow');
  assert.equal(measureControlFlow(fixture({ width: 0 })), null);
});

test('SSR preserves public layout and root contract without browser APIs', () => {
  const markup = renderToStaticMarkup(React.createElement(DataToolbar, {
    layout: 'wide', variant: 'embedded', size: 'sm', 'aria-label': '리포지토리 검색', searchPlaceholder: '리포지토리 검색',
  }));
  assert.match(markup, /data-layout="wide"/);
  assert.match(markup, /data-variant="embedded"/);
  assert.match(markup, /aria-label="리포지토리 검색"/);
  assert.doesNotMatch(markup, /data-control-flow=/);
  assert.equal(renderToStaticMarkup(React.createElement(DataToolbar, { searchable: false })), '');
});
