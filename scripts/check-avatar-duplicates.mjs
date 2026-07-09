import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

async function collect(dirRel, predicate, out = []) {
  const dir = path.join(root, dirRel);
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(dirRel, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(rel, predicate, out);
    else if (entry.isFile() && predicate(rel)) out.push(rel);
  }
  return out.sort();
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function uniqueSorted(items) {
  return [...new Set(items)].sort();
}

const componentFiles = await collect('components', (rel) => rel.endsWith('.jsx'));
const storyFiles = await collect('stories', (rel) => rel.endsWith('.stories.jsx'));

const definitionChecks = [
  {
    name: 'Avatar',
    expected: 'components/feedback/Avatar.jsx',
    pattern: /export\s+function\s+Avatar\s*\(/g,
  },
  {
    name: 'AvatarGroup',
    expected: 'components/feedback/AvatarGroup.jsx',
    pattern: /export\s+function\s+AvatarGroup\s*\(/g,
  },
];

const failures = [];

for (const check of definitionChecks) {
  const matches = [];
  for (const file of componentFiles) {
    const source = await read(file);
    if (countMatches(source, check.pattern) > 0) matches.push(file);
  }

  if (matches.length !== 1 || matches[0] !== check.expected) {
    failures.push(`${check.name} must be defined only in ${check.expected}; found ${matches.length ? matches.join(', ') : 'none'}.`);
  }
}

const storyTitleMatches = [];
for (const file of storyFiles) {
  const source = await read(file);
  const titleMatches = [...source.matchAll(/title:\s*['"]([^'"]*Avatar[^'"]*)['"]/g)].map((match) => match[1]);
  for (const title of titleMatches) storyTitleMatches.push(`${file}: ${title}`);
}

const expectedStoryTitle = 'stories/Feedback.stories.jsx: LDS Core/Components/Feedback/Avatar';
if (storyTitleMatches.length !== 1 || storyTitleMatches[0] !== expectedStoryTitle) {
  failures.push(`Avatar Storybook page must be unique; found:\n${storyTitleMatches.join('\n') || 'none'}`);
}

const srcIndex = await read('src/index.js');
const srcTypes = await read('src/index.d.ts');
for (const name of ['Avatar', 'AvatarGroup']) {
  const componentFile = name === 'Avatar' ? 'Avatar' : 'AvatarGroup';
  const indexCount = countMatches(srcIndex, new RegExp(`^export\\s+\\{\\s*${name}\\s*\\}\\s+from\\s+'\\.\\.\\/components\\/feedback\\/${componentFile}\\.jsx';$`, 'gm'));
  const typeCount = countMatches(srcTypes, new RegExp(`^export\\s+\\{\\s*${name}\\s*\\}\\s+from\\s+'\\.\\.\\/components\\/feedback\\/${componentFile}';$`, 'gm'));
  if (indexCount !== 1) failures.push(`src/index.js must export ${name} once from components/feedback/${componentFile}.jsx; found ${indexCount}.`);
  if (typeCount !== 1) failures.push(`src/index.d.ts must export ${name} once from components/feedback/${componentFile}; found ${typeCount}.`);
}

const classification = JSON.parse(await read('docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json'));
const classifiedExports = classification.groups.flatMap((group) => group.exports || []);
for (const name of ['Avatar', 'AvatarGroup']) {
  const count = classifiedExports.filter((item) => item === name).length;
  if (count !== 1) failures.push(`PUBLIC_EXPORT_CLASSIFICATION.json must classify ${name} once; found ${count}.`);
}

assert(failures.length === 0, `Avatar duplication guard failed:\n${failures.join('\n')}`);

const definitionSummary = definitionChecks.map((check) => `${check.name}=${check.expected}`).join(', ');
console.log(
  [
    `Validated Avatar duplication guard: ${definitionSummary}.`,
    `Unique Storybook page: ${expectedStoryTitle}.`,
    `Public exports classified once: ${uniqueSorted(['Avatar', 'AvatarGroup']).join(', ')}.`,
  ].join(' ')
);
