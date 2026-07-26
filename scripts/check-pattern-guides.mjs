import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { patternGuides } from '../stories/PatternGuide.data.mjs';

const root = process.cwd();
const storiesRoot = path.join(root, 'stories');
const PATTERN_TITLE = /title:\s*['"](LDS Core\/Patterns\/[^'"]+)['"]/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string.`);
}

function assertStringList(value, label) {
  assert(Array.isArray(value) && value.length > 0, `${label} must contain at least one item.`);
  value.forEach((item, index) => assertNonEmptyString(item, `${label}[${index}]`));
}

const guidesByTitle = new Map();
for (const guide of patternGuides) {
  for (const field of [
    'id',
    'storybookTitle',
    'authority',
    'type',
    'title',
    'applicability',
    'problem',
    'primaryRule',
  ]) {
    assertNonEmptyString(guide[field], `${guide.id || 'Pattern'}.${field}`);
  }
  assert(guide.authority === 'LDS Core', `${guide.storybookTitle} must declare LDS Core authority.`);
  assert(guide.type === 'Pattern', `${guide.storybookTitle} must declare the Pattern document type.`);
  assert(!guidesByTitle.has(guide.storybookTitle), `Duplicate Pattern guide title ${guide.storybookTitle}.`);

  assert(Array.isArray(guide.decisions) && guide.decisions.length > 0, `${guide.storybookTitle}.decisions must not be empty.`);
  guide.decisions.forEach((decision, index) => {
    for (const field of ['condition', 'signal', 'detail']) {
      assertNonEmptyString(decision[field], `${guide.storybookTitle}.decisions[${index}].${field}`);
    }
  });

  assert(Array.isArray(guide.components) && guide.components.length > 0, `${guide.storybookTitle}.components must not be empty.`);
  guide.components.forEach((component, index) => {
    assertNonEmptyString(component.name, `${guide.storybookTitle}.components[${index}].name`);
    assertNonEmptyString(component.relationship, `${guide.storybookTitle}.components[${index}].relationship`);
  });

  assert(Array.isArray(guide.restrictedVariants), `${guide.storybookTitle}.restrictedVariants must be an array.`);
  guide.restrictedVariants.forEach((variant, index) => {
    for (const field of ['name', 'owner', 'baseSignal', 'when', 'avoid', 'storybookDocsId']) {
      assertNonEmptyString(variant[field], `${guide.storybookTitle}.restrictedVariants[${index}].${field}`);
    }
    assert(
      /^lds-[a-z0-9-]+--docs$/.test(variant.storybookDocsId),
      `${guide.storybookTitle}.restrictedVariants[${index}].storybookDocsId must be a Storybook Docs ID.`,
    );
    assert(
      guide.components.some((component) => component.name === variant.baseSignal),
      `${guide.storybookTitle}.restrictedVariants[${index}].baseSignal must reference a Pattern component.`,
    );
    assert(
      guide.decisions.some((decision) => decision.signal === variant.baseSignal),
      `${guide.storybookTitle}.restrictedVariants[${index}].baseSignal must reference a primary signal.`,
    );
  });

  assertStringList(guide.failure, `${guide.storybookTitle}.failure`);
  assertStringList(guide.accessibility, `${guide.storybookTitle}.accessibility`);
  assertStringList(guide.avoid, `${guide.storybookTitle}.avoid`);
  guidesByTitle.set(guide.storybookTitle, guide);
}

const storyFiles = (await readdir(storiesRoot))
  .filter((file) => file.endsWith('.stories.jsx'))
  .sort();
const patternPages = [];

for (const file of storyFiles) {
  const source = await readFile(path.join(storiesRoot, file), 'utf8');
  const title = source.match(PATTERN_TITLE)?.[1];
  if (!title) continue;
  patternPages.push({ file, source, title });
}

assert(patternPages.length > 0, 'Storybook must expose at least one LDS Core Pattern page.');
assert(
  patternPages.length === guidesByTitle.size,
  `Pattern page/guide mismatch: ${patternPages.length} Storybook pages and ${guidesByTitle.size} structured guides.`,
);

for (const page of patternPages) {
  assert(guidesByTitle.has(page.title), `${page.title} has no structured Pattern guide.`);
  assert(
    /\bpatternGuide\s*:\s*[A-Za-z_$][\w$]*/.test(page.source),
    `${page.file} must connect its meta parameters to a structured Pattern guide.`,
  );
  assert(
    /eyebrow:\s*['"]LDS Core · Pattern['"]/.test(page.source),
    `${page.file} must identify the Canvas as LDS Core · Pattern.`,
  );
  assert(/name:\s*['"]개요['"]/.test(page.source), `${page.file} must expose a public 개요 story.`);
  assert(
    /name:\s*['"]사용법 · [^'"]+['"]/.test(page.source),
    `${page.file} must expose a usage story outside the concise overview.`,
  );
  assert(
    /<PatternOverview\s+pattern=\{[A-Za-z_$][\w$]*\}\s*\/>/.test(page.source),
    `${page.file} overview must render the shared PatternOverview.`,
  );
}

const loadingGuide = guidesByTitle.get('LDS Core/Patterns/Loading');
const brandSpinnerVariant = loadingGuide?.restrictedVariants.find(
  (variant) => variant.name === 'Brand Spinner',
);
assert(
  brandSpinnerVariant?.owner === 'LDS Theme'
    && brandSpinnerVariant?.baseSignal === 'Spinner'
    && brandSpinnerVariant?.storybookDocsId === 'lds-theme-status-brand-spinner--docs',
  'Loading Pattern must document Brand Spinner as an LDS Theme restriction of the Spinner signal.',
);

const brandSpinnerSource = await readFile(
  path.join(storiesRoot, 'ThemeBrandSpinner.stories.jsx'),
  'utf8',
);
assert(
  /\brelatedPatterns\s*:\s*\[/.test(brandSpinnerSource)
    && /docsId:\s*['"]lds-core-patterns-loading--docs['"]/.test(brandSpinnerSource),
  'Brand Spinner must link back to the Loading Pattern usage contract.',
);

console.log(
  `Validated Pattern guides: ${patternPages.length} Storybook page(s) declare authority, applicability, decisions, restricted variants, composition, failure, accessibility, and avoidance guidance.`,
);
