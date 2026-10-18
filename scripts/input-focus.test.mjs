import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import esbuild from 'esbuild';

const require = createRequire(import.meta.url);
const directory = await mkdtemp(path.join(tmpdir(), 'lds-input-focus-ssr-'));
let fixture;
try {
  const outfile = path.join(directory, 'fixture.mjs');
  await esbuild.build({entryPoints: ['scripts/fixtures/input-focus/harness.jsx'], outfile,
    bundle: true, format: 'esm', platform: 'node', jsx: 'automatic', logLevel: 'silent',
    plugins: [{name: 'one-react', setup(build) {
      build.onResolve({filter: /^react(?:-dom)?(?:\/|$)/}, args => ({path: require.resolve(args.path), external: true}));
    }}]});
  fixture = await import(pathToFileURL(outfile));
} finally { await rm(directory, {recursive: true, force: true}); }

function nodes(html) {
  const stack = [], result = [], voidTags = new Set(['input', 'br', 'hr', 'img', 'meta', 'link']);
  for (const match of html.matchAll(/<\/?([a-z][\w:-]*)([^>]*)>/gi)) {
    if (match[0].startsWith('</')) {
      const index = stack.findLastIndex(node => node.tag === match[1]);
      if (index >= 0) stack.length = index;
      continue;
    }
    const node = {tag: match[1], attrs: match[2], parent: stack.at(-1)};
    result.push(node);
    if (!voidTags.has(node.tag) && !match[0].endsWith('/>')) stack.push(node);
  }
  return result;
}

for (const [kind, state, props] of fixture.fieldCases) test(`${kind} ${state} keeps one rounded frame owner and native semantics`, () => {
  const html = renderToStaticMarkup(React.createElement(fixture.FocusField, {kind, state, props}));
  const list = nodes(html), native = list.filter(node => node.tag === 'input');
  assert.equal(native.length, 1);
  const input = native[0], frame = input.parent;
  assert.match(frame.attrs, /data-lds-focus-within=""/);
  assert.match(frame.attrs, new RegExp(kind === 'input' ? 'lk-input-control' : 'lk-password-input-control'));
  assert.match(input.attrs, /data-lds-focus-target=""/);
  assert.match(frame.attrs, /border-radius:var\(--(?:lds-input-radius, var\(--component-input-radius\)|component-input-radius)\)/);
  assert.equal(list.filter(node => node.attrs.includes('data-lds-focus-within=')).length, 1);
  assert.equal(list.filter(node => node.attrs.includes('data-lds-focus-target=')).length, 1);
  if (kind === 'password') {
    assert.match(input.attrs, /type="password"/);
    assert.match(input.attrs, /class="consumer-native"/);
    assert.match(input.attrs, /autoComplete="current-password"/);
  }
  if (state === 'invalid') { assert.match(input.attrs, /aria-invalid="true"/); assert.match(html, /role="alert"/); }
  if (state === 'readonly') assert.match(input.attrs, /readOnly=""/);
  if (state === 'disabled') assert.match(input.attrs, /disabled=""/);
  for (const button of list.filter(node => node.tag === 'button')) {
    assert.ok(!button.attrs.includes('data-lds-focus-target='), 'nested actions retain an independent focus boundary');
    if (kind === 'password' && state === 'disabled') assert.match(button.attrs, /disabled=""/);
  }
});

test('standalone native controls and textarea are not transferred into the new password frame', () => {
  const list = nodes(renderToStaticMarkup(React.createElement(fixture.InputFocusSurface)));
  const standalone = list.find(node => node.tag === 'input' && node.attrs.includes('aria-label="standalone"'));
  assert.ok(standalone);
  assert.ok(!standalone.attrs.includes('data-lds-focus-target='));
  assert.ok(!standalone.parent.attrs.includes('data-lds-focus-within='));
  const textarea = list.find(node => node.tag === 'textarea');
  assert.ok(textarea);
  assert.ok(!textarea.attrs.includes('data-lds-focus-target='));
});
