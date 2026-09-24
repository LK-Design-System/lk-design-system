import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// LDS does not mark rows, cards, chips or callouts with a colored bar on the
// leading edge. Status is carried by the sibling that owns it: Banner's tonal
// icon, StatusBadge's tonal surface, SideNav's selected text. A 1px hairline
// divider is fine; a 2px-or-wider leading border or inset stripe is not.
// See docs/TOKEN_GOVERNANCE.md "Color usage rules".

const root = process.cwd();
const SCAN = ['components', 'stories', 'tokens'];
const EXTENSIONS = new Set(['.jsx', '.js', '.css']);

const RULES = [
  /border(?:Left|InlineStart)(?:Width)?\s*:\s*[`'"]?\s*(?:[2-9]|[1-9]\d)(?:px)?\b/,
  /border-(?:left|inline-start)(?:-width)?\s*:\s*(?:[2-9]|[1-9]\d)px/,
  /inset\s+(?:[2-9]|[1-9]\d)px\s+0\s+0/,
];

const matches = (line) => RULES.some((rule) => rule.test(line));

// The rules must keep catching the bars removed in 0.2.12 and keep passing dividers.
const MUST_FAIL = [
  "borderLeft: `4px solid ${palette.foreground}`,",
  'borderLeftWidth: 3,',
  "borderLeft: `2px solid ${on ? 'var(--color-semantic-primary-normal)' : 'x'}`,",
  'border-left: 3px solid var(--color-semantic-status-negative);',
  "boxShadow: 'inset 4px 0 0 var(--color-semantic-primary-normal)',",
];
const MUST_PASS = [
  "borderLeft: '1px solid var(--color-semantic-line-normal-normal)',",
  "borderInlineStart: '1px solid var(--color-semantic-line-normal-normal)',",
  'borderLeft: 0,',
  "[isLeft ? 'borderLeft' : 'borderRight']: 'none',",
  "boxShadow: 'inset 0 0 0 1px var(--color-semantic-line-normal-normal)',",
];
const selfTest = [
  ...MUST_FAIL.filter((line) => !matches(line)).map((line) => `not caught: ${line}`),
  ...MUST_PASS.filter((line) => matches(line)).map((line) => `false positive: ${line}`),
];
if (selfTest.length > 0) {
  throw new Error(`check-no-leading-bars self-test failed:\n- ${selfTest.join('\n- ')}`);
}

async function collect(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      await collect(full, out);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const files = (await Promise.all(SCAN.map((dir) => collect(path.join(root, dir))))).flat();
const violations = [];
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
  lines.forEach((line, index) => {
    if (matches(line)) violations.push(`${path.relative(root, file).split(path.sep).join('/')}:${index + 1}: ${line.trim()}`);
  });
}

if (violations.length > 0) {
  throw new Error(
    'Leading color bars are not an LDS pattern. Carry status with the sibling that owns it '
    + '(Banner tonal icon, StatusBadge surface, SideNav selected text):\n- '
    + violations.join('\n- '),
  );
}
console.log(`Validated ${files.length} component, story and token files: no leading color bars.`);
