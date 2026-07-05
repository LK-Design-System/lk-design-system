import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

async function collectJsxFiles(dirRel, out = []) {
  const dir = path.join(root, dirRel);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(dirRel, entry.name);
    if (entry.isDirectory()) {
      await collectJsxFiles(rel, out);
    } else if (entry.isFile() && entry.name.endsWith('.jsx')) {
      out.push(rel);
    }
  }
  return out;
}

function assertIncludes(source, needle, label) {
  assert(source.includes(needle), `${label} must include: ${needle}`);
}

const jsxFiles = await collectJsxFiles('components');
const negativeLetterSpacing = [];
for (const rel of jsxFiles) {
  const source = await read(rel);
  const matches = source.matchAll(/letterSpacing:\s*'-[0-9.]+px'/g);
  for (const match of matches) {
    negativeLetterSpacing.push(`${rel}:${match.index}: ${match[0]}`);
  }
}

assert(
  negativeLetterSpacing.length === 0,
  `React components must not reintroduce negative letterSpacing:\n${negativeLetterSpacing.join('\n')}`
);

const card = await read('components/cards/Card.jsx');
const newsCard = await read('components/cards/NewsCard.jsx');
const productCard = await read('components/cards/ProductCard.jsx');
const componentTokens = await read('tokens/components.css');
const originalBundle = await read('_ds_bundle.js');

// The static original previews execute _ds_bundle.js. Keep the public React
// components aligned with those original card motion values until a new visual
// decision is recorded in the parity ledger.
const motionContracts = [
  [componentTokens, '--component-card-hover-transform: translateY(-4px);', 'tokens/components.css card hover token'],
  [card, "boxShadow: interactive && hover ? 'var(--component-card-shadow-lg)' : shadows[elevation]", 'Card interactive shadow'],
  [card, "transform: interactive && hover ? 'var(--component-card-hover-transform)' : 'none'", 'Card interactive transform'],
  [newsCard, "boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)'", 'NewsCard hover shadow'],
  [newsCard, "transform: hover ? 'translateY(-2px)' : 'none'", 'NewsCard card lift'],
  [newsCard, "transform: hover ? 'scale(1.03)' : 'scale(1)'", 'NewsCard image zoom'],
  [newsCard, "transform: hover ? 'translateX(2px)' : 'none'", 'NewsCard CTA arrow nudge'],
  [productCard, "boxShadow: hover ? 'var(--shadow-xl)' : 'var(--shadow-sm)'", 'ProductCard hover shadow'],
  [productCard, "transform: hover ? 'scale(1.05)' : 'scale(1)'", 'ProductCard image zoom'],
  [originalBundle, "transform: hover ? 'translateY(-2px)' : 'none'", 'Original bundle NewsCard lift'],
  [originalBundle, "transform: hover ? 'scale(1.03)' : 'scale(1)'", 'Original bundle NewsCard zoom'],
  [originalBundle, "transform: hover ? 'scale(1.05)' : 'scale(1)'", 'Original bundle ProductCard zoom'],
];

for (const [source, needle, label] of motionContracts) {
  assertIncludes(source, needle, label);
}

console.log(`Validated visual parity invariants: ${jsxFiles.length} React components, card motion contracts, and typography spacing.`);
