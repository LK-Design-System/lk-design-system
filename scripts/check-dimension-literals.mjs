import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const baselinePath = path.join(root, 'docs', 'references', 'quality', 'DIMENSION_LITERAL_BASELINE.json');
const updateBaseline = process.argv.includes('--update-baseline');
const dimensionalProperties = /^(gap|rowGap|columnGap|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|margin|marginTop|marginRight|marginBottom|marginLeft|width|height|minWidth|maxWidth|minHeight|maxHeight|top|right|bottom|left|inset|borderRadius)$/;
// Spacing properties answer to the ramp the Spacing foundation publishes, not to
// the 4px grid below. The foundation has since declared the half steps
// (2·6·10·14·18) and tokenised them, so `gap: 6` is on the scale — this check was
// the last place still asserting the old grid, and it reported correct code as
// off-grid. Non-spacing dimensions (width, height, radius, offsets) keep the 4px
// rule: no ramp declares them.
const spacingProperties = /^(gap|rowGap|columnGap|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|margin|marginTop|marginRight|marginBottom|marginLeft)$/;
const spacingCss = await readFile(path.join(root, 'tokens', 'spacing.css'), 'utf8');
const spacingScale = new Set(
  [...spacingCss.matchAll(/--space-[\w-]+:\s*(-?[\d.]+)px/g)].map((match) => Math.abs(Number(match[1]))),
);
if (spacingScale.size === 0) throw new Error('No --space-* declarations found in tokens/spacing.css.');

async function collect(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, out);
    else if (entry.isFile() && entry.name.endsWith('.jsx')) out.push(absolute);
  }
  return out.sort();
}

function numericPxValues(node) {
  if (ts.isNumericLiteral(node)) return [Number(node.text)];
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [...node.text.matchAll(/(-?\d+(?:\.\d+)?)px\b/g)].map((match) => Number(match[1]));
  }
  return [];
}

const violations = [];
for (const absolute of await collect(path.join(root, 'components'))) {
  const rel = path.relative(root, absolute).replaceAll('\\', '/');
  const source = await readFile(absolute, 'utf8');
  const file = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);

  function visit(node) {
    if (ts.isPropertyAssignment(node)) {
      const property = node.name?.text;
      if (property && dimensionalProperties.test(property)) {
        for (const value of numericPxValues(node.initializer)) {
          const magnitude = Math.abs(value);
          const onGrid = spacingProperties.test(property)
            ? spacingScale.has(magnitude)
            : magnitude % 4 === 0;
          if (magnitude > 2 && !onGrid) {
            violations.push(`${rel}:${property}:${value}px`);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
}

const counts = Object.fromEntries([...new Set(violations)].sort().map((violation) => [
  violation,
  violations.filter((candidate) => candidate === violation).length,
]));
if (updateBaseline) {
  await mkdir(path.dirname(baselinePath), { recursive: true });
  await writeFile(baselinePath, `${JSON.stringify({
    schemaVersion: 1,
    description: 'Known off-grid component dimensions. New non-4px literals above 2px are rejected.',
    violations: counts,
  }, null, 2)}\n`, 'utf8');
  console.log(`Updated dimension literal baseline with ${violations.length} known occurrences across ${Object.keys(counts).length} signatures.`);
  process.exit(0);
}

const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const regressions = Object.entries(counts)
  .filter(([violation, count]) => count > (baseline.violations?.[violation] || 0))
  .map(([violation, count]) => `${violation} (${count} > ${baseline.violations?.[violation] || 0})`);
if (regressions.length > 0) {
  throw new Error(`New off-grid dimension literals detected:\n- ${regressions.join('\n- ')}`);
}
console.log(`Validated dimension literal ratchet: ${violations.length} known occurrences, 0 new violations.`);
