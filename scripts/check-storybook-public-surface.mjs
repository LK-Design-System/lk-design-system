import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'storybook-static', 'index.json');
const allowedDuplicateNames = new Set(['플레이그라운드']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isPublicStory(entry) {
  return entry.type === 'story' && Array.isArray(entry.tags) && entry.tags.includes('dev');
}

function storyLabel(entry) {
  return `${entry.title} / ${entry.name} (${entry.importPath}::${entry.exportName || '-'})`;
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
assert(failures.length === 0, `Storybook public surface cleanup guard failed:\n${failures.join('\n')}`);

console.log(
  `Validated Storybook public surface: ${publicStories.length} public stories, ${hiddenStories.length} hidden stories, ${parityStories.length} hidden visual parity stories, 0 duplicate public cleanup violations.`
);
