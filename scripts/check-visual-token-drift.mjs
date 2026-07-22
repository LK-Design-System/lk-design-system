import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
// Hex colors must end at a CSS-token boundary so fragments such as `#account`
// are not misread as the three-digit color `#acc`.
const visualValuePattern = /#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{3})(?![0-9A-Za-z_-])|rgba?\([^)]*\)|0\s+\d+px\s+\d+px\s+rgba?\([^)]*\)/g;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const [name, source, expected] of [
  ['anchor fragment', "href: '#account'", []],
  ['three-digit hex', "color: '#acc'", ['#acc']],
  ['four-digit hex', "color: '#accf'", ['#accf']],
  ['six-digit hex', "color: '#aabbcc'", ['#aabbcc']],
  ['eight-digit hex', "color: '#aabbccff'", ['#aabbccff']],
  ['identifier suffix', "href: '#abcdef-route'", []],
]) {
  const actual = source.match(visualValuePattern) || [];
  assert(JSON.stringify(actual) === JSON.stringify(expected), `Visual token matcher regression: ${name}.`);
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

const exceptions = JSON.parse(await read('docs/references/wds/VISUAL_TOKEN_EXCEPTIONS.json'));
const allowedComponentFiles = new Set(Object.keys(exceptions.allowedComponentFiles || {}));
const allowedStoryFiles = new Set(Object.keys(exceptions.allowedStoryFiles || {}));
const componentFiles = await collect('components', (rel) => rel.endsWith('.jsx'));
const storyFiles = await collect('stories', (rel) => rel.endsWith('.jsx'));
const failures = [];
const exceptionHits = [];

async function checkFiles(files, allowed, label) {
  for (const file of files) {
    const source = await read(file);
    const matches = source.match(visualValuePattern) || [];
    if (matches.length === 0) continue;

    if (allowed.has(file)) {
      exceptionHits.push(`${file}: ${matches.length}`);
    } else {
      failures.push(`${label} ${file}: ${[...new Set(matches)].join(', ')}`);
    }
  }
}

await checkFiles(componentFiles, allowedComponentFiles, 'Component implementation file');
await checkFiles(storyFiles, allowedStoryFiles, 'Storybook file');

for (const file of allowedComponentFiles) {
  assert(componentFiles.includes(file), `Visual token exception references missing component file: ${file}`);
}

for (const file of allowedStoryFiles) {
  assert(storyFiles.includes(file), `Visual token exception references missing Storybook file: ${file}`);
}

for (const file of [...allowedComponentFiles, ...allowedStoryFiles]) {
  const source = await read(file);
  const matches = source.match(visualValuePattern) || [];
  assert(matches.length > 0, `Visual token exception no longer has hardcoded values and should be removed: ${file}`);
}

assert(
  failures.length === 0,
  `Files contain hardcoded visual values outside documented exceptions:\n${failures.join('\n')}`
);

console.log(
  `Validated visual token drift: ${componentFiles.length} component files, ${storyFiles.length} Storybook files, ${exceptionHits.length} documented exception files, 0 undocumented hardcoded visual values.`
);
