/**
 * Components must spend spacing from the scale the Spacing foundation declares.
 *
 * The foundation published one scale while 63 components shipped a second, undeclared one —
 * every value a half step (2·6·10·14·18). Nothing caught it: check:dimension-literals only
 * inspects px inside strings and templates, so a bare `gap: 6` was invisible. Both scales are
 * now declared and tokenised, and this keeps a third one from appearing.
 *
 * The scale is read from tokens/spacing.css, never hardcoded: change the ramp and this follows.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const SPACE_PROPS = [
  'gap', 'rowGap', 'columnGap',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingBlock', 'paddingInline',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginBlock', 'marginInline',
];

const spacingCss = await readFile(path.join(root, 'tokens', 'spacing.css'), 'utf8');
const scale = new Set([...spacingCss.matchAll(/--space-[\w-]+:\s*(-?[\d.]+)px/g)].map((m) => Number(m[1])));
if (scale.size === 0) throw new Error('No --space-* declarations found in tokens/spacing.css.');

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.jsx')) out.push(full);
  }
  return out;
}

const pattern = new RegExp(`\\b(${SPACE_PROPS.join('|')})\\s*:\\s*(\\d+)\\b`, 'g');
const violations = [];
let inspected = 0;

// Stories are presentation too: a page that teaches the scale while spending values off it
// is the same defect, just one layer out.
const targets = [...await walk(path.join(root, 'components')), ...await walk(path.join(root, 'stories'))];

for (const file of targets) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  const relative = path.relative(root, file).replace(/\\/g, '/');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(pattern)) {
      inspected += 1;
      const value = Number(match[2]);
      if (scale.has(value)) continue;
      violations.push(`${relative}:${index + 1}  ${match[1]}: ${value}`);
    }
  });
}

if (violations.length > 0) {
  const ramp = [...scale].sort((a, b) => a - b).join(' · ');
  throw new Error(
    `${violations.length} spacing value(s) are not on the scale the Spacing foundation declares (${ramp}px).\n`
    + 'Use a --space-* token, or add the step to tokens/spacing.css and declare it in the foundation:\n- '
    + violations.join('\n- '),
  );
}

console.log(`Validated spacing scale: ${inspected} spacing declarations across components resolve to the ${scale.size}-step scale.`);
