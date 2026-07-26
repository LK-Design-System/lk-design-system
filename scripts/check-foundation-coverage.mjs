import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const foundationRoot = path.join(root, 'docs', 'foundations');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const expected = [
  ['design-token', 'Design Token'],
  ['color', 'Color'],
  ['typography', 'Typography'],
  ['iconography', 'Iconography'],
  ['elevation', 'Elevation'],
  ['gradient', 'Gradient'],
  ['inclusive-design', 'Inclusive Design'],
  ['international-design', 'International Design'],
  ['layout', 'Layout'],
  ['motion', 'Motion'],
  ['radius', 'Radius'],
  ['spacing', 'Spacing'],
  ['state', 'State'],
  ['voice-and-tone', 'Voice and Tone'],
  ['writing', 'Writing'],
  ['aspect-ratio', 'Aspect Ratio'],
];

const content = JSON.parse(await readFile(path.join(foundationRoot, 'foundation-content.json'), 'utf8'));
const schema = JSON.parse(await readFile(path.join(foundationRoot, 'foundation-content.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
assert(validate(content), `Foundation content schema violations:\n${ajv.errorsText(validate.errors, { separator: '\n' })}`);

const bySlug = new Map(content.foundations.map((foundation) => [foundation.slug, foundation]));
for (const [slug, title] of expected) {
  const foundation = bySlug.get(slug);
  assert(foundation, `Missing foundation content: ${slug}`);
  assert(foundation.title === title, `${slug}: expected title "${title}", received "${foundation.title}".`);
  assert(foundation.principles.length >= 3, `${slug}: at least 3 principles are required.`);
  assert(foundation.semanticModel.length >= 3, `${slug}: at least 3 semantic model rows are required.`);
  assert(foundation.selectionCriteria.length >= 3, `${slug}: at least 3 selection rows are required.`);
  assert(foundation.quantitativeRules.length >= 3, `${slug}: at least 3 quantitative rules are required.`);
  assert(foundation.doDont.length >= 4, `${slug}: at least 2 Do and 2 Don't examples are required.`);
  assert(foundation.doDont.length % 2 === 0, `${slug}: Do/Don't rows must form complete comparison pairs.`);
  foundation.doDont.forEach(([kind, guidance], index) => {
    const expectedKind = index % 2 === 0 ? 'Do' : "Don't";
    assert(kind === expectedKind, `${slug}: Do/Don't row ${index + 1} must be "${expectedKind}".`);
    assert(guidance !== kind, `${slug}: Do/Don't row ${index + 1} needs a concrete example.`);
  });
  for (let index = 0; index < foundation.doDont.length; index += 2) {
    assert(
      foundation.doDont[index][1] !== foundation.doDont[index + 1][1],
      `${slug}: Do/Don't pair ${index / 2 + 1} must contrast different decisions.`,
    );
  }
  assert(foundation.exceptions.length >= 2, `${slug}: at least 2 exceptions are required.`);
  assert(foundation.accessibility.length >= 2, `${slug}: at least 2 accessibility rules are required.`);
  assert(foundation.internationalization.length >= 1, `${slug}: internationalization guidance is required.`);
  assert(foundation.examples.length >= 2, `${slug}: at least 2 LDS examples are required.`);
  assert(foundation.tokens.length >= 1 && foundation.apis.length >= 1, `${slug}: token and API references are required.`);
  assert(foundation.purpose.length >= 40, `${slug}: purpose must explain the user or system outcome, not only name the topic.`);
  for (const [field, rows] of [
    ['semanticModel', foundation.semanticModel],
    ['selectionCriteria', foundation.selectionCriteria],
    ['quantitativeRules', foundation.quantitativeRules],
    ['examples', foundation.examples],
  ]) {
    rows.forEach((row, index) => {
      const minimumLength = field === 'quantitativeRules' ? 3 : 4;
      assert(
        row.slice(1).every((cell) => cell.length >= minimumLength),
        `${slug}: ${field} row ${index + 1} needs decision-supporting detail in every value cell.`,
      );
    });
  }
}

const storyFiles = (await readdir(path.join(root, 'stories')))
  .filter((name) => name.endsWith('.stories.jsx'))
  .map((name) => path.join(root, 'stories', name));
const storySource = (await Promise.all(storyFiles.map((file) => readFile(file, 'utf8')))).join('\n');

for (const [slug, title] of expected) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert(
    new RegExp(`title:\\s*['"]LDS Core/Foundation/${escapedTitle}['"]`).test(storySource),
    `Missing public Storybook Foundation page: ${title}`,
  );
}

/*
 * Canvas shows the foundation itself; the ten-section guide lives on the Docs tab — the same
 * split every component page uses. Both halves are asserted so a page cannot lose either one,
 * and the guide cannot drift back onto a canvas story.
 */
const perFile = await Promise.all(storyFiles.map(async (file) => ({ file, source: await readFile(file, 'utf8') })));
// Only pages backed by a structured guide are in scope. Every Foundation page is now one of
// them, so the filter is what keeps a non-Foundation story file from being judged by this rule.
const guidedTitles = new Set(expected.map(([, title]) => `LDS Core/Foundation/${title}`));
const foundationFiles = perFile.filter(({ source }) => {
  const title = /title:\s*['"](LDS Core\/Foundation\/[^'"]+)['"]/.exec(source)?.[1];
  return title != null && guidedTitles.has(title);
});

const onCanvas = foundationFiles.filter(({ source }) => source.includes('foundationGuideStory('));
assert(
  onCanvas.length === 0,
  `The Foundation guide belongs on the Docs tab, not a story canvas:\n- ${onCanvas.map(({ file }) => path.relative(root, file)).join('\n- ')}`,
);

const withoutDocs = foundationFiles.filter(({ source }) => !/tags:\s*\[[^\]]*'autodocs'/.test(source));
assert(
  withoutDocs.length === 0,
  `Every Foundation page needs a Docs tab for its guide:\n- ${withoutDocs.map(({ file }) => path.relative(root, file)).join('\n- ')}`,
);

const preview = await readFile(path.join(root, '.storybook', 'preview.jsx'), 'utf8');
let previousIndex = -1;
for (const [, title] of expected) {
  const currentIndex = preview.indexOf(`'${title}'`, previousIndex + 1);
  assert(currentIndex > previousIndex, `Storybook Foundation navigation is missing or misordered: ${title}`);
  previousIndex = currentIndex;
}

const generatedArtifacts = [
  'README.md',
  'TOKEN_REFERENCE.md',
  'llms.txt',
  ...expected.map(([slug]) => `${slug}.md`),
];
for (const artifact of generatedArtifacts) {
  const text = await readFile(path.join(foundationRoot, artifact), 'utf8');
  assert(text.trim().length > 0, `Generated Foundation artifact is empty: ${artifact}`);
}

console.log(`Validated Foundation completeness: ${expected.length}/16 structured guides, ${expected.length}/16 public Storybook pages, required depth and generated surfaces present.`);
