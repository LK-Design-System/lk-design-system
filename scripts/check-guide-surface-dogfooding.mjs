/**
 * Guards that the pages which document the design system are built from the design system.
 *
 * The component and Foundation guides render the majority of the public Storybook surface.
 * When they hand-roll their own badge, table, card or callout, a reader is shown markup
 * that is not the system, the copies drift the moment a primitive changes, and none of the
 * existing gates notice: visual-token-drift only inspects colors, and dimension-literals
 * only scans components/.
 *
 * This check asserts three things for those surfaces:
 *   1. they import from the public entry point,
 *   2. they do not re-implement a primitive the public entry point already ships, and
 *   3. they size type and corners from tokens rather than raw literals.
 *
 * Responsive column minimums (`minmax(min(100%, 280px), 1fr)`) are deliberately untouched:
 * a breakpoint is a layout decision, not a spacing step on the 4px grid.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

/** Surfaces whose whole job is to present the system to a reader. */
const GUIDE_SURFACES = [
  'stories/ComponentGuide.shared.jsx',
  'stories/FoundationGuide.shared.jsx',
  'stories/LoadingPattern.stories.jsx',
  'stories/PatternGuide.shared.jsx',
];

/**
 * A local declaration that shadows a public component name. `function Badge(` or
 * `const Badge = ` in a guide surface means a second, unversioned copy of that primitive.
 */
const SHADOWABLE = ['Badge', 'Card', 'Callout', 'Table', 'Tag', 'Chip', 'Divider', 'Stack', 'PageHeader', 'Accordion', 'Collapsible'];

/** Type and corner values that bypass the scale, which is how the guides drifted before. */
const LITERAL_RULES = [
  [/fontSize\s*:\s*['"`]?\d/g, 'a raw fontSize literal', 'use a --*-size token'],
  [/font-size:\s*\d/g, 'a raw font-size literal', 'use a --*-size token'],
  [/fontWeight\s*:\s*\d/g, 'a raw fontWeight literal', 'use --fw-medium/semibold/bold'],
  [/font-weight:\s*\d/g, 'a raw font-weight literal', 'use --fw-medium/semibold/bold'],
  [/borderRadius\s*:\s*['"`]?\d/g, 'a raw borderRadius literal', 'use a --radius-* token'],
  [/border-radius:\s*\d/g, 'a raw border-radius literal', 'use a --radius-* token'],
  [/clamp\(\s*[\d.]+(?:rem|px)/g, 'a clamp() type ramp', 'use the display/title/heading scale'],
  // A hand-rolled eyebrow (small + letterspaced + uppercase) is Overline rebuilt by hand. It
  // slipped past the shadowing rule because it was a bare span rather than a named component.
  [/letterSpacing\s*:/g, 'a letterSpacing override', 'use Overline or a type-scale class'],
  [/textTransform\s*:\s*['"`]uppercase/g, 'a hand-rolled uppercase kicker', 'use Overline'],
  [/<select[\s>]/g, 'a native <select>', 'use Select from the public entry point'],
  [/type\s*=\s*['"`]checkbox['"`]/g, 'a native checkbox input', 'use Checkbox from the public entry point'],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const entry = await readFile(path.join(root, 'src', 'index.d.ts'), 'utf8');
const publicNames = new Set([...entry.matchAll(/export \{ (\w+) \}/g)].map((match) => match[1]));
assert(publicNames.size > 0, 'Could not read the public export surface from src/index.d.ts.');

const failures = [];

for (const relative of GUIDE_SURFACES) {
  const source = await readFile(path.join(root, relative), 'utf8');

  const importsEntry = /from '\.\.\/src\/index\.js'/.test(source);
  if (!importsEntry) {
    failures.push(`${relative}\n    imports no public component; a guide surface must be built from the system it documents.`);
    continue;
  }

  const imported = new Set(
    (source.match(/import \{([^}]+)\} from '\.\.\/src\/index\.js'/s)?.[1] ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
  );

  for (const name of SHADOWABLE) {
    if (!publicNames.has(name)) continue;
    const declared = new RegExp(`(?:^|\\n)\\s*(?:function|const|class)\\s+${name}\\b`).test(source);
    if (declared && !imported.has(name)) {
      failures.push(`${relative}\n    declares its own ${name}; import { ${name} } from '../src/index.js' instead.`);
    }
  }

  for (const [pattern, what, remedy] of LITERAL_RULES) {
    const hits = source.match(pattern);
    if (hits) {
      failures.push(`${relative}\n    ${hits.length}x ${what} (${hits.slice(0, 3).join(', ')}…) — ${remedy}.`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Guide surfaces must dogfood the public component set:\n- ${failures.join('\n- ')}`);
}

console.log(
  `Validated guide surface dogfooding: ${GUIDE_SURFACES.length} documentation surfaces build on the public component set, shadow none of ${SHADOWABLE.length} guarded primitives, and size type and corners from tokens.`,
);
