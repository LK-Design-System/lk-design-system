import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

// Render the real source, including resolved domains and scales; no duplicated chart math.
const bundled = await build({
  stdin: { contents: `import React from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    import {LineChart} from './components/data/LineChart.jsx';
    export const render = props => renderToStaticMarkup(React.createElement(LineChart, props));`,
    resolveDir: process.cwd(), loader: 'jsx' },
  bundle: true, write: false, platform: 'node', format: 'esm',
  external: ['react', 'react-dom'],
});
// Keep package imports relative to this repository, while avoiding generated artifacts.
const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
const temporary = await mkdtemp(new URL('../.line-chart-test-', import.meta.url));
let render;
try {
  await writeFile(`${temporary}/render.mjs`, bundled.outputFiles[0].text);
  ({ render } = await import(`${temporary}/render.mjs`));
} finally { await rm(temporary, { recursive: true, force: true }); }
const props = points => ({ width: 520, height: 180, xDomain: [0, 10], yDomain: [0, 10],
  showPoints: true, showLegend: false, series: [{ name: 'samples', points }] });
const circles = html => [...html.matchAll(/<circle\b[^>]*>/g)].map(match => match[0]);

test('boundary centers and singleton markers are whole without moving scales', () => {
  const html = render(props([{x:0,y:0},{x:5,y:0},{x:10,y:10},{x:0,y:10},{x:10,y:0}]));
  assert.equal(circles(html).length, 5);
  assert.match(html, /<rect x="46" y="14" width="452" height="142"/);
  assert.match(html, /cx="46" cy="156" r="3"/);
  assert.match(html, /cx="498" cy="14" r="3"/);
  assert.doesNotMatch(html, /<g[^>]*clip-path=/);
  assert.ok(circles(html).every(circle => !circle.includes('clip-path')));
  assert.match(html, /<path clip-path="url\(#[^"]+\)" d="M46.00 156.00/);
  assert.equal(circles(render({...props([{x:0,y:0}]), showPoints:false})).length, 1);
  assert.equal(circles(render({...props([{x:0,y:0},{x:10,y:10}]), showPoints:false})).length, 0);
});

test('outside centers are omitted while crossing segments retain exact plot clipping', () => {
  const points = [{x:-2,y:5},{x:5,y:5},{x:12,y:5},{x:5,y:12},{x:5,y:-2}];
  const snapshot = JSON.stringify(points);
  const html = render(props(points));
  assert.equal(circles(html).length, 1);
  assert.match(html, /cx="272" cy="85"/);
  assert.match(html, /d="M-44.40 85.00 L272.00 85.00 L588.40 85.00 L272.00 -14.40 L272.00 184.40"/);
  assert.match(html, /<path clip-path="url\(/);
  assert.equal(JSON.stringify(points), snapshot);
});

test('reversed explicit domains retain inclusive boundary markers', () => {
  const html = render({...props([{x:0,y:0},{x:10,y:10},{x:11,y:5}]),xDomain:[10,0],yDomain:[10,0]});
  assert.equal(circles(html).length, 2);
  assert.match(html, /cx="498" cy="14"/);
  assert.match(html, /cx="46" cy="156"/);
});
