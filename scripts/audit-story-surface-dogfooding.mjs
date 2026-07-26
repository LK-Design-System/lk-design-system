/**
 * Does the Storybook surface itself follow LDS?
 *
 * Every story file is presentation: a demo plus the chrome that frames it (headers, section
 * labels, panels, comparison tables, status pills). That chrome is what a reader actually sees
 * when they come to learn the system, so when it is hand-rolled the docs teach something the
 * system does not ship — and it drifts the moment a primitive changes.
 *
 * This reports, per file, the places where LDS already ships an answer that the file declined:
 *
 *   no-lds-import      the file renders presentation without importing any public component
 *   shadowed-primitive a local component redefines a public one (Badge, Card, Table, …)
 *   hand-rolled-*      raw markup where a public component exists (table, callout, pill, …)
 *   raw-type           a font size / weight / letter-spacing literal instead of the type scale
 *   raw-radius         a corner literal instead of a --radius-* token
 *   raw-surface        a border+radius+background triple that is what Card already is
 *
 * Usage: node scripts/audit-story-surface-dogfooding.mjs [--full] [--file=Name]
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = process.argv.slice(2);
const showAll = args.includes('--full');
const onlyFile = args.find((a) => a.startsWith('--file='))?.slice(7);

const entry = await readFile(path.join(root, 'src', 'index.d.ts'), 'utf8');
const publicNames = new Set([...entry.matchAll(/export \{ (\w+) \}/g)].map((m) => m[1]));

const SHADOWABLE = [
  'Badge', 'Card', 'Callout', 'Table', 'Tag', 'Chip', 'Divider', 'Stack', 'PageHeader',
  'Overline', 'Prose', 'Section', 'Container', 'Grid', 'ListCell', 'Avatar', 'Icon',
].filter((name) => publicNames.has(name));

const RULES = [
  ['no-lds-import', null, null],
  ['hand-rolled-table', /<table[\s>]/g, 'Table'],
  ['hand-rolled-pill', /borderRadius:\s*(?:999|9999|'999px'|'9999px')/g, 'Tag / Chip / Badge'],
  ['hand-rolled-callout', /borderInlineStart:\s*['"`]\d|borderLeft:\s*['"`]\d/g, 'Callout'],
  ['raw-type', /fontSize:\s*(?:\d|['"`]\d)/g, 'a --*-size token'],
  ['raw-weight', /fontWeight:\s*\d/g, '--fw-* tokens'],
  ['raw-letterspacing', /letterSpacing:\s*(?!['"`]?var)/g, 'Overline or the type scale'],
  ['raw-uppercase', /textTransform:\s*['"`]uppercase/g, 'Overline'],
  ['raw-radius', /borderRadius:\s*(?:\d|['"`]\d)/g, 'a --radius-* token'],
];

const files = (await readdir(path.join(root, 'stories')))
  .filter((name) => /\.(stories|shared)\.jsx$/.test(name))
  .filter((name) => (onlyFile ? name.includes(onlyFile) : true));

const report = [];
for (const name of files) {
  const source = await readFile(path.join(root, 'stories', name), 'utf8');
  const findings = [];

  const importsLds = /from '\.\.\/src\/index\.js'/.test(source);
  // A file that renders nothing visual (pure data or re-export) is not presentation.
  const rendersMarkup = /<[a-z]+[\s/>]/.test(source) || /render:/.test(source);
  if (!importsLds && rendersMarkup) findings.push(['no-lds-import', 1, 'public components']);

  for (const name2 of SHADOWABLE) {
    if (new RegExp(`(?:^|\\n)\\s*function\\s+${name2}\\b`).test(source)) {
      findings.push(['shadowed-primitive', 1, `local ${name2}()`]);
    }
  }

  for (const [rule, pattern, remedy] of RULES) {
    if (!pattern) continue;
    const hits = source.match(pattern);
    if (hits) findings.push([rule, hits.length, remedy]);
  }

  // border + radius + background on one element is Card, spelled out by hand.
  const surfaces = source.match(/border:\s*['"`]1px solid[^'"`]*['"`],[^}]{0,160}?borderRadius/g);
  if (surfaces) findings.push(['raw-surface', surfaces.length, 'Card']);

  if (findings.length) {
    const score = findings.reduce((sum, [rule, count]) => sum + (rule === 'no-lds-import' ? 25 : rule === 'shadowed-primitive' ? 10 : count), 0);
    report.push({ name, importsLds, findings, score });
  }
}

report.sort((a, b) => b.score - a.score);

const totals = new Map();
for (const row of report) {
  for (const [rule, count] of row.findings) totals.set(rule, (totals.get(rule) || 0) + count);
}

console.log(`\nScanned ${files.length} story surfaces. ${report.length} declined an answer LDS already ships.\n`);
console.log('rule'.padEnd(22) + 'occurrences   files');
for (const [rule, count] of [...totals.entries()].sort((a, b) => b[1] - a[1])) {
  const fileCount = report.filter((r) => r.findings.some(([f]) => f === rule)).length;
  console.log(`${rule.padEnd(22)}${String(count).padStart(11)}${String(fileCount).padStart(8)}`);
}

console.log('\n--- worst offenders ---');
for (const row of report.slice(0, showAll ? report.length : 18)) {
  const detail = row.findings.map(([rule, count, remedy]) => `${rule}${count > 1 ? `×${count}` : ''}${remedy ? ` (→ ${remedy})` : ''}`).join(', ');
  console.log(`${String(row.score).padStart(4)}  ${row.name.padEnd(40)} ${detail}`);
}
if (!showAll && report.length > 18) console.log(`      …and ${report.length - 18} more (use --full)`);

const noImport = report.filter((r) => !r.importsLds);
console.log(`\nSurfaces rendering presentation with no LDS component at all: ${noImport.length}`);
for (const row of noImport.slice(0, 12)) console.log(`   ${row.name}`);
if (noImport.length > 12) console.log(`   …and ${noImport.length - 12} more`);
