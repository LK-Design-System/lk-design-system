import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const docsRoot = path.join(root, 'docs', 'components');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

const [contentSource, schemaSource, entrySource, auditSource, preview] = await Promise.all([
  read('docs/components/component-content.json'),
  read('docs/components/component-content.schema.json'),
  read('src/index.js'),
  read('docs/references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json'),
  read('.storybook/preview.jsx'),
]);
const content = JSON.parse(contentSource);
const schema = JSON.parse(schemaSource);
const audit = JSON.parse(auditSource);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
assert(validate(content), `Component content schema violations:\n${ajv.errorsText(validate.errors, { separator: '\n' })}`);

const entryLines = [...entrySource.matchAll(/^export\s+\{\s*([^}]+?)\s*\}\s+from\s+'(\.\.\/components\/([^']+?)\.jsx)';$/gm)];
const expectedExports = new Set(entryLines.flatMap((match) => match[1].split(',').map((item) => item.trim().split(/\s+as\s+/).at(-1))));
assert(content.summary.componentEntries === entryLines.length, `Component entry census drifted: ${content.summary.componentEntries}/${entryLines.length}.`);
assert(content.entries.length === entryLines.length, `Compiled component entries drifted: ${content.entries.length}/${entryLines.length}.`);
assert(content.summary.publicExports === expectedExports.size, `Named export census drifted: ${content.summary.publicExports}/${expectedExports.size}.`);

const entryIds = new Set();
const compiledExports = new Set();
for (const entry of content.entries) {
  assert(!entryIds.has(entry.id), `Duplicate component entry id: ${entry.id}`);
  entryIds.add(entry.id);
  entry.exports.forEach((name) => compiledExports.add(name));
  for (const contractPath of [entry.source, entry.typeContract, entry.prompt]) {
    await access(path.join(root, contractPath));
  }
  assert(entry.promptSha256.length === 64, `${entry.title}: prompt source fingerprint is missing.`);
}
assert(
  [...expectedExports].every((name) => compiledExports.has(name)) && compiledExports.size === expectedExports.size,
  'Every named public export must appear exactly in the compiled component registry.',
);

const generatedSystemPages = new Set([
  'LDS Core/Components/Overview',
  'LDS Core/Components/Progress Board',
]);
const expectedPages = audit.pages.filter((page) => page.layer !== 'Foundation' && !generatedSystemPages.has(page.title));
const guideTitles = new Set();
const guideSlugs = new Set();
for (const guide of content.guides) {
  assert(!guideTitles.has(guide.storybookTitle), `Duplicate component guide title: ${guide.storybookTitle}`);
  assert(!guideSlugs.has(guide.slug), `Duplicate component guide slug: ${guide.slug}`);
  guideTitles.add(guide.storybookTitle);
  guideSlugs.add(guide.slug);
  assert(guide.purpose.length >= 30, `${guide.slug}: purpose is too shallow.`);
  for (const [field, minimum] of [
    ['useWhen', 3],
    ['avoidWhen', 3],
    ['anatomy', 1],
    ['states', 1],
    ['behavior', 3],
    ['quantitativeRules', 1],
    ['responsive', 2],
    ['contentGuidance', 2],
    ['accessibility', 3],
    ['doDont', 4],
    ['exceptions', 2],
    ['related', 1],
    ['examples', 1],
    ['tokens', 1],
    ['apiLinks', 1],
    ['migration', 2],
    ['sources', 2],
  ]) {
    assert(guide[field].length >= minimum, `${guide.slug}: ${field} requires at least ${minimum} entries.`);
  }
  guide.doDont.forEach(([kind, rule], index) => {
    const expectedKind = index % 2 === 0 ? 'Do' : "Don't";
    assert(kind === expectedKind, `${guide.slug}: Do/Don't row ${index + 1} must be ${expectedKind}.`);
    assert(rule.length >= 8, `${guide.slug}: Do/Don't row ${index + 1} is too shallow.`);
  });
  assert(guide.storybook.publicStories.length >= 1, `${guide.slug}: public Storybook evidence is required.`);
  assert(guide.storybook.entryStoryId, `${guide.slug}: an audience entry story id is required.`);
  assert(guide.platformStatus.react === 'implemented', `${guide.slug}: React status must match public implementation evidence.`);
  assert(
    guide.platformStatus.ios === 'not-tracked' && guide.platformStatus.android === 'not-tracked',
    `${guide.slug}: this repository must not invent external platform status.`,
  );
  const generatedGuide = path.join(docsRoot, 'guides', `${guide.slug}.md`);
  const guideText = await readFile(generatedGuide, 'utf8');
  for (const heading of [
    '## 사용 판단',
    '## Anatomy',
    '## Properties',
    '## States',
    '## Behavior and interaction',
    '## 정량 규칙',
    '## Responsive',
    '## Content and writing',
    '## Accessibility',
    "## Do / Don't",
    '## Related components',
    '## Tokens and API',
    '## Migration',
  ]) {
    assert(guideText.includes(heading), `${guide.slug}: generated guide is missing ${heading}.`);
  }
}

assert(content.guides.length === expectedPages.length, `Component guide page census drifted: ${content.guides.length}/${expectedPages.length}.`);
for (const page of expectedPages) {
  assert(guideTitles.has(page.title), `Missing structured component guide: ${page.title}`);
}
assert(content.summary.seedBenchmarkedGuides >= 25, 'At least 25 overlapping component guides need an explicit SEED benchmark trace.');
assert(content.benchmark.url === 'https://seed-design.io/components', 'SEED Components benchmark must remain explicit.');
assert(preview.includes('componentGuideByTitle'), 'Storybook preview must connect overview stories to structured component guides.');
assert(preview.includes('<ComponentGuideForStory slug={componentGuideSlug}'), 'Storybook preview must render the complete component guide.');
assert(preview.includes("'Overview', 'Progress Board'"), 'Component Overview and Progress Board must lead the sidebar order.');

const generated = await readdir(path.join(docsRoot, 'guides'));
assert(generated.filter((name) => name.endsWith('.md')).length === content.guides.length, 'Generated component guide files do not match the registry.');
const runtimeGuides = await readdir(path.join(docsRoot, 'runtime'));
assert(runtimeGuides.filter((name) => name.endsWith('.json')).length === content.guides.length, 'Lazy component guide runtime files do not match the registry.');
for (const artifact of [
  'README.md',
  'COMPONENT_REFERENCE.md',
  'PROGRESS_BOARD.md',
  'component-guide-index.json',
  'component-guide-runtime.json',
  'llms.txt',
]) {
  const text = await readFile(path.join(docsRoot, artifact), 'utf8');
  assert(text.trim().length > 100, `Generated component artifact is empty: ${artifact}`);
}
const llms = await readFile(path.join(docsRoot, 'llms.txt'), 'utf8');
assert(content.guides.every((guide) => llms.includes(`# ${guide.title}`)), 'LLM bundle must contain every component decision guide.');

console.log(
  `Validated Component completeness: ${content.entries.length} entries / ${content.summary.publicExports} exports, `
  + `${content.guides.length} decision guides, ${content.summary.seedBenchmarkedGuides} SEED traces, all required sections present.`,
);
