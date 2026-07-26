import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function requireText(source, expected, message) {
  if (!source.includes(expected)) failures.push(message);
}

async function collectFiles(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(relativePath);
    return /\.(jsx?|tsx?)$/.test(entry.name) ? [relativePath] : [];
  }));
  return nested.flat();
}

const [scrollArea, types, componentCss, prompt] = await Promise.all([
  read('components/layout/ScrollArea.jsx'),
  read('components/layout/ScrollArea.d.ts'),
  read('tokens/components.css'),
  read('components/layout/ScrollArea.prompt.md'),
]);

requireText(scrollArea, "scrollbar = 'auto'", 'ScrollArea must preserve the platform scrollbar by default.');
requireText(scrollArea, "gutter = 'stable'", 'ScrollArea must reserve scrollbar space by default.');
requireText(scrollArea, "'lk-scroll-surface'", 'ScrollArea must consume the shared scroll-surface contract.');
requireText(scrollArea, "focusable = 'auto'", 'ScrollArea must keep conditional keyboard focus.');
requireText(types, "scrollbar?: 'auto' | 'compact'", 'ScrollArea types must expose only auto and compact scrollbar treatments.');
requireText(types, "gutter?: 'stable' | 'auto'", 'ScrollArea types must expose stable and auto gutter policies.');
requireText(componentCss, ".lk-scroll-surface[data-scrollbar='compact']", 'Compact native scrollbar styling is missing.');
requireText(componentCss, '@media (forced-colors: active)', 'Scroll surfaces must defer to forced-colors preferences.');
requireText(prompt, 'LDS Core / WDS-adjacent', 'ScrollArea provenance must be documented as LDS Core / WDS-adjacent.');

if (/scrollbar\s*=\s*['"]hidden['"]/.test(scrollArea) || /scrollbar\?:[^;]*hidden/.test(types)) {
  failures.push('ScrollArea must not expose a public hidden-scrollbar option.');
}
if (/::-webkit-scrollbar/.test(scrollArea) || /::-webkit-scrollbar/.test(componentCss)) {
  failures.push('Shared scroll surfaces must use standardized CSS Scrollbars properties, not WebKit pseudo-elements.');
}

const hiddenScrollbarPatterns = [
  /scrollbarWidth\s*:\s*['"]none['"]/,
  /scrollbar-width\s*:\s*none/,
  /msOverflowStyle\s*:\s*['"]none['"]/,
  /::-webkit-scrollbar[^}]*\{[^}]*display\s*:\s*none/s,
];
const allowedHiddenFiles = new Map([
  ['components/navigation/TopBar.jsx', [
    'data-scrollbar-exception="single-row-global-navigation"',
    'data-scrollbar-exception="single-row-global-actions"',
  ]],
  ['components/selection/WheelPicker.jsx', [
    'data-scrollbar-exception="wheel-picker-selection-plane"',
  ]],
]);

for (const relativePath of await collectFiles('components')) {
  const normalizedPath = relativePath.replaceAll('\\', '/');
  const source = await read(normalizedPath);
  if (!hiddenScrollbarPatterns.some((pattern) => pattern.test(source))) continue;

  const exceptionMarkers = allowedHiddenFiles.get(normalizedPath);
  if (!exceptionMarkers) {
    failures.push(`${normalizedPath}: hidden scrollbar is not an approved product-pattern exception.`);
    continue;
  }
  for (const marker of exceptionMarkers) {
    requireText(source, marker, `${normalizedPath}: missing explicit hidden-scrollbar exception marker ${marker}.`);
  }
}

if (failures.length > 0) {
  console.error('Scroll surface contract check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Scroll surface contracts verified: native default, compact opt-in, forced-colors fallback, and explicit hidden exceptions.');
