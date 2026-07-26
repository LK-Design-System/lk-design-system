import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const removedAliases = [
  '--lk-accent-tint', '--lk-accent-tint-2', '--color-bg-band', '--surface-overlay',
  '--text-on-dark-muted', '--color-secondary', '--status-positive-tint',
  '--status-cautionary-tint', '--status-danger-tint', '--focus-ring',
  '--inverse-label-strong', '--inverse-label-neutral', '--inverse-label-alternative',
  '--inverse-label-assistive', '--inverse-label-disable', '--inverse-icon-muted',
  '--inverse-fill-normal', '--inverse-fill-hover', '--inverse-fill-strong',
  '--inverse-line-normal', '--inverse-line-strong', '--static-white', '--static-black',
  '--cyan-40', '--accent-foreground-cyan',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function collect(directory, predicate, result = []) {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(relative, predicate, result);
    else if (entry.isFile() && predicate(relative)) result.push(relative);
  }
  return result.sort();
}

const implementationFiles = [
  ...await collect('.storybook', (file) => /\.(jsx|js|tsx|ts|css)$/.test(file)),
  ...await collect('components', (file) => /\.(jsx|js|tsx|ts|css)$/.test(file)),
  ...await collect('stories', (file) => /\.(jsx|js|tsx|ts|css)$/.test(file)),
];
const failures = [];
for (const file of implementationFiles) {
  const text = await readFile(path.join(root, file), 'utf8');
  if (/var\(\s*--bw-[a-zA-Z0-9_-]+/.test(text)) failures.push(`${file}: removed --bw-* color variable`);
  for (const alias of removedAliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`var\\(\\s*${escaped}(?:\\s*[,)]|\\s*$)`).test(text)) failures.push(`${file}: deprecated alias ${alias}`);
  }
  if (file.startsWith('components/') && text.includes('--color-atomic-')) {
    failures.push(`${file}: component implementation references an atomic color directly`);
  }
  if (/var\(\s*--component-(?:banner|callout)-/.test(text)) {
    failures.push(`${file}: --component-banner-*/--component-callout-* aliases are deprecated; consume status surface colors via statusToneStyle`);
  }
  if (file.startsWith('stories/') && file !== 'stories/Foundations.shared.jsx' && text.includes('--color-atomic-')) {
    failures.push(`${file}: only the Color foundation story may render atomic colors directly`);
  }
}

const tokenCssFiles = await collect('tokens', (file) => file.endsWith('.css') && file !== 'tokens/color-atomic.css');
for (const file of tokenCssFiles) {
  const text = await readFile(path.join(root, file), 'utf8');
  if (/var\(\s*--bw-[a-zA-Z0-9_-]+/.test(text) || /--bw-[a-zA-Z0-9_-]+\s*:/.test(text)) failures.push(`${file}: removed --bw-* color variable`);
  for (const alias of removedAliases) {
    if (text.includes(`var(${alias})`)) failures.push(`${file}: runtime token depends on deprecated alias ${alias}`);
  }
}

assert(failures.length === 0, `Color layer violations:\n${failures.join('\n')}`);
console.log(`Validated color layering across ${implementationFiles.length} component/story files and ${tokenCssFiles.length} runtime token files; 0 removed-color or atomic-layer violations.`);
