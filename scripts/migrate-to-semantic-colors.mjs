/**
 * One-shot migration: rewrite internal references from the legacy hand-tuned
 * color token names to the generated --color-semantic-* layer, so components
 * consume the semantic system directly (the color-mapping.css bridge is then
 * retired). Deterministic, boundary-safe find/replace over source files.
 *
 *   node scripts/migrate-to-semantic-colors.mjs [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');

// legacy token -> semantic token (name only, without the leading --)
const MAP = {
  'lk-primary-strong': 'color-semantic-primary-strong',
  'lk-primary-heavy': 'color-semantic-primary-heavy',
  'lk-primary': 'color-semantic-primary-normal',
  'lk-accent-ink': 'color-semantic-primary-normal',
  'lk-accent': 'color-semantic-primary-normal',
  'label-strong': 'color-semantic-label-strong',
  'label-normal': 'color-semantic-label-normal',
  'label-neutral': 'color-semantic-label-neutral',
  'label-alternative': 'color-semantic-label-alternative',
  'label-assistive': 'color-semantic-label-assistive',
  'label-disable': 'color-semantic-label-disable',
  'text-body': 'color-semantic-label-normal',
  'text-strong': 'color-semantic-label-strong',
  'text-muted': 'color-semantic-label-alternative',
  'text-link': 'color-semantic-primary-normal',
  'surface-page': 'color-semantic-background-normal-normal',
  'surface-card': 'color-semantic-background-elevated-normal',
  'surface-raised': 'color-semantic-background-elevated-normal',
  'surface-subtle': 'color-semantic-background-normal-alternative',
  'surface-sunken': 'color-semantic-background-normal-alternative',
  'surface-inverse': 'color-semantic-inverse-background',
  'color-bg-subtle': 'color-semantic-background-normal-alternative',
  'color-bg': 'color-semantic-background-normal-normal',
  'border-subtle': 'color-semantic-line-normal-normal',
  'border-strong': 'color-semantic-line-solid-normal',
  'line-normal': 'color-semantic-line-normal-normal',
  'line-neutral': 'color-semantic-line-normal-neutral',
  'line-strong': 'color-semantic-line-solid-normal',
  'fill-normal': 'color-semantic-fill-normal',
  'fill-strong': 'color-semantic-fill-strong',
  'fill-alt': 'color-semantic-fill-alternative',
};
// Longest keys first so prefixes (color-bg vs color-bg-subtle) never mis-match.
const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) { if (name === 'node_modules' || name === 'dist') continue; walk(p, out); }
    else if (/\.(jsx?|css)$/.test(name)) out.push(p);
  }
  return out;
}

const targets = [
  ...walk('components'),
  ...walk('stories'),
  'tokens/components.css',
  'tokens/base.css',
];

let totalFiles = 0, totalHits = 0;
const perToken = {};
for (const file of targets) {
  let text = readFileSync(file, 'utf8');
  const before = text;
  for (const key of KEYS) {
    // match --key only when NOT followed by another identifier char (so
    // --color-bg does not eat --color-bg-subtle, --line-normal not --line-normal-x)
    const re = new RegExp(`--${key}(?![a-zA-Z0-9-])`, 'g');
    text = text.replace(re, (m) => { perToken[key] = (perToken[key] || 0) + 1; totalHits++; return `--${MAP[key]}`; });
  }
  if (text !== before) { totalFiles++; if (!DRY) writeFileSync(file, text); }
}

console.log(`${DRY ? '[dry] ' : ''}Migrated ${totalHits} references across ${totalFiles} files.`);
console.log(Object.entries(perToken).sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${k.padEnd(20)} ${n}`).join('\n'));
