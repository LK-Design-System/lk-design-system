import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const staticRoot = path.join(root, 'storybook-static');
const indexPath = path.join(staticRoot, 'index.json');
const forbiddenStorybookName = /\bwds\b/i;
const allowedDuplicateNames = new Set(['플레이그라운드']);
const requiredPublicStoryNames = new Map([
  ['IconRegistry', 'Base icon registry'],
  ['TabsAndBreadcrumb', 'Breadcrumb routes'],
  ['ContentBadgePatterns', 'Content badge patterns'],
]);
const forbiddenPublicTitles = new Map([
  ['LDS Core/3 Component/4 Content/Badges', 'Use Content Badge for ContentBadge and Badges and Tags for Badge/Tag grouping.'],
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isPublicStory(entry) {
  return entry.type === 'story' && Array.isArray(entry.tags) && entry.tags.includes('dev');
}

function storyLabel(entry) {
  return `${entry.title} / ${entry.name} (${entry.importPath}::${entry.exportName || '-'})`;
}

async function collectStaticTextFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(staticRoot, fullPath).replaceAll(path.sep, '/');

    if (entry.isDirectory()) {
      await collectStaticTextFiles(fullPath, files);
      continue;
    }

    if (!entry.isFile()) continue;
    if (relativePath.endsWith('.map')) continue;
    if (/\.(html|js|json|css|txt)$/.test(entry.name)) files.push(fullPath);
  }

  return files;
}

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const stories = Object.values(index.entries || {}).filter((entry) => entry.type === 'story');
const publicStories = stories.filter(isPublicStory);
const hiddenStories = stories.filter((entry) => !isPublicStory(entry));
const parityStories = stories.filter((entry) => /card parity/i.test(entry.name || ''));

const failures = [];

const titleNameCounts = new Map();
for (const story of stories) {
  const key = `${story.title} / ${story.name}`;
  const current = titleNameCounts.get(key) || [];
  current.push(story);
  titleNameCounts.set(key, current);
}
for (const [key, duplicates] of titleNameCounts) {
  if (duplicates.length > 1) failures.push(`duplicate story title/name: ${key}`);
}

const publicNameCounts = new Map();
for (const story of publicStories) {
  const current = publicNameCounts.get(story.name) || [];
  current.push(story);
  publicNameCounts.set(story.name, current);
}
for (const [name, duplicates] of publicNameCounts) {
  if (duplicates.length > 1 && !allowedDuplicateNames.has(name)) {
    failures.push(`duplicate public story name "${name}": ${duplicates.map(storyLabel).join(' | ')}`);
  }
}

for (const story of publicStories) {
  if (/card parity/i.test(story.name || '')) failures.push(`visual parity story is public: ${storyLabel(story)}`);
  if (String(story.title || '').includes('상세')) failures.push(`public Storybook title still uses 상세 split: ${storyLabel(story)}`);
  if (forbiddenPublicTitles.has(story.title)) {
    failures.push(`ambiguous duplicate-prone public Storybook title: ${storyLabel(story)}. ${forbiddenPublicTitles.get(story.title)}`);
  }
  if (requiredPublicStoryNames.has(story.exportName) && story.name !== requiredPublicStoryNames.get(story.exportName)) {
    failures.push(
      `public Storybook story lost duplicate-cleanup ownership name: ${storyLabel(story)} should be "${requiredPublicStoryNames.get(story.exportName)}"`
    );
  }
}

for (const story of stories) {
  const labelSurface = [story.id, story.title, story.name, story.exportName].filter(Boolean).join(' ');
  if (forbiddenStorybookName.test(labelSurface)) {
    failures.push(`Storybook label includes forbidden source-system name: ${storyLabel(story)}`);
  }
}

for (const story of parityStories) {
  const tags = story.tags || [];
  if (tags.includes('dev')) failures.push(`visual parity story must be hidden from sidebar with !dev: ${storyLabel(story)}`);
  if (!tags.includes('visual-parity')) failures.push(`visual parity story is missing visual-parity tag: ${storyLabel(story)}`);
}

const forbiddenPublicExports = new Set(['BrandLogos', 'Banners', 'RobotStatus']);
for (const story of publicStories) {
  if (forbiddenPublicExports.has(story.exportName)) failures.push(`known duplicate public story still visible: ${storyLabel(story)}`);
}

assert(publicStories.length > 0, 'No public Storybook stories found.');
assert(parityStories.length > 0, 'No visual parity stories found; visual diff coverage may have been removed.');

const staticTextFiles = await collectStaticTextFiles(staticRoot);
for (const file of staticTextFiles) {
  const text = await readFile(file, 'utf8');
  if (forbiddenStorybookName.test(text)) {
    failures.push(`Storybook static output includes forbidden source-system name: ${path.relative(root, file)}`);
  }
}

assert(failures.length === 0, `Storybook public surface cleanup guard failed:\n${failures.join('\n')}`);

console.log(
  `Validated Storybook public surface: ${publicStories.length} public stories, ${hiddenStories.length} hidden stories, ${parityStories.length} hidden visual parity stories, 0 duplicate public cleanup violations.`
);
