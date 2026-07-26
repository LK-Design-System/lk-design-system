import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Guards page-level element duplication in Storybook:
//
// 1. Subject-home exclusivity — a Latin component export name may appear in at
//    most ONE story file's docs description. The page that names a component is
//    its home; every other page refers to it with Korean prose (e.g. "상단 바",
//    "데이터 표") instead of the Latin name. This is the generalized form of the
//    old Avatar duplication bug (see check-avatar-duplicates.mjs).
// 2. Visual-parity subject uniqueness — each hidden "<X> card parity" story may
//    exist only once across all story files, so a component's pixel-parity
//    evidence has a single owner page.

const root = process.cwd();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function read(rel) {
  return readFile(path.join(root, rel), 'utf8');
}

const indexSource = await read('src/index.js');
const exportNames = [...indexSource.matchAll(/export \{([^}]+)\}/g)]
  .flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop().trim()))
  .filter((n) => /^[A-Z]/.test(n) && !/^[A-Z_]+$/.test(n)); // components only, skip constants

const storyFiles = (await readdir(path.join(root, 'stories')))
  .filter((f) => f.endsWith('.stories.jsx'))
  .sort();

const failures = [];

// Rule 1: subject-home exclusivity across docs descriptions.
const subjectPages = new Map();
for (const file of storyFiles) {
  const source = await read(path.join('stories', file));
  const match =
    source.match(/component:\s*\n?\s*'([^']+)'/) || source.match(/component:\s*"([^"]+)"/);
  if (!match) continue;
  const description = match[1];
  for (const name of exportNames) {
    if (!new RegExp(`\\b${name}\\b`).test(description)) continue;
    const pages = subjectPages.get(name) || [];
    pages.push(file);
    subjectPages.set(name, pages);
  }
}
for (const [name, pages] of subjectPages) {
  if (pages.length > 1) {
    failures.push(
      `component "${name}" is named as a subject in ${pages.length} page descriptions (one home page only; use Korean prose elsewhere):\n  ${pages.join('\n  ')}`
    );
  }
}

// Rule 2: visual-parity subject uniqueness.
const paritySubjects = new Map();
for (const file of storyFiles) {
  const source = await read(path.join('stories', file));
  for (const match of source.matchAll(/name:\s*(['"])(.+? card parity)\1/g)) {
    const subject = match[2];
    const pages = paritySubjects.get(subject) || [];
    pages.push(file);
    paritySubjects.set(subject, pages);
  }
}
for (const [subject, pages] of paritySubjects) {
  if (pages.length > 1) {
    failures.push(
      `visual parity story "${subject}" is defined in ${pages.length} files:\n  ${pages.join('\n  ')}`
    );
  }
}

assert(
  failures.length === 0,
  `Story subject duplication guard failed:\n${failures.join('\n')}`
);

console.log(
  `Validated story subject duplication guard: ${subjectPages.size} description-named components (all single-home), ${paritySubjects.size} parity subjects (all unique) across ${storyFiles.length} story files.`
);
