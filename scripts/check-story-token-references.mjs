/**
 * Guards that every custom property a Storybook surface references actually exists.
 *
 * A `var(--typo)` is not a CSS error: the browser drops the whole declaration and the
 * element silently falls back to its inherited or initial value. That failure mode is
 * invisible to type checks, story plays that only assert structure, and Axe. It shows
 * up only as spacing that collapses to 0 or a status color that never paints, so it is
 * cheapest to catch as a source-level reference check.
 *
 * Definitions come from the same runtime CSS files that tokens/source.json inventories,
 * plus any property a surface defines locally for its own use.
 */
import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const SURFACE_DIRS = ['stories', '.storybook'];
const SOURCE_EXTENSIONS = /\.(jsx?|tsx?|css)$/;
// The optional quote is what makes the local-definition rule true for JSX. A surface
// that mints its own property does it as a style-object key — `'--foo': `${x}%`` — and
// without allowing that closing quote every such property read back in the same file
// was reported as never defined.
const DECLARATION = /(--[a-zA-Z0-9_-]+)['"`]?\s*:/g;
// The trailing capture spots `var(--prefix-${expr})`, where the name is assembled at
// runtime and cannot be resolved statically.
const REFERENCE = /var\(\s*(--[a-zA-Z0-9_-]+)(.?)/g;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function listSourceFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSourceFiles(full, found);
    else if (SOURCE_EXTENSIONS.test(entry.name)) found.push(full);
  }
  return found;
}

const source = JSON.parse(await readFile(path.join(root, 'tokens', 'source.json'), 'utf8'));
const runtimeCssFiles = source.metadata?.runtimeCssFiles;
assert(
  Array.isArray(runtimeCssFiles) && runtimeCssFiles.length > 0,
  'tokens/source.json must list metadata.runtimeCssFiles so token definitions have one authority.',
);

const defined = new Set();
for (const file of runtimeCssFiles) {
  const css = await readFile(path.join(root, file), 'utf8');
  for (const match of css.matchAll(DECLARATION)) defined.add(match[1]);
}

// A component may also publish custom properties to its own subtree, which is
// a real contract rather than a private detail: ViewerFrame mints `--viewer-*`
// from the appearance it was given, and everything rendered inside it — story
// content included — is meant to read those and follow light/dark for free.
// Counting only runtime CSS reported such references as undefined, and the
// tempting "fix" is to rewrite them to the underlying `--component-viewer-*`,
// which silently pins the subtree to one appearance.
for (const file of listSourceFiles(path.join(root, 'components'))) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(DECLARATION)) defined.add(match[1]);
}
assert(defined.size > 0, 'No custom properties were parsed from the runtime CSS files; the definition source is wrong.');

const surfaceFiles = SURFACE_DIRS.flatMap((dir) => listSourceFiles(path.join(root, dir)));
const dead = new Map();
let referenceCount = 0;

for (const file of surfaceFiles) {
  const text = await readFile(file, 'utf8');
  // A surface may mint its own property (`--foo: 4px`) and read it back in the same file.
  const local = new Set([...text.matchAll(DECLARATION)].map((match) => match[1]));
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const lines = text.split('\n');

  lines.forEach((line, index) => {
    for (const match of line.matchAll(REFERENCE)) {
      const [, token, next] = match;
      if (next === '$') continue;
      referenceCount += 1;
      if (defined.has(token) || local.has(token)) continue;
      if (!dead.has(token)) dead.set(token, []);
      dead.get(token).push(`${relative}:${index + 1}`);
    }
  });
}

if (dead.size > 0) {
  const report = [...dead.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([token, locations]) => `- ${token}\n    ${locations.join('\n    ')}`)
    .join('\n');
  throw new Error(
    `Storybook surfaces reference ${dead.size} custom propert${dead.size === 1 ? 'y that is' : 'ies that are'} never defined.\n` +
    'A missing custom property drops the whole declaration, so spacing collapses and colors never paint.\n' +
    `Use a defined token or add the property to a runtime CSS file:\n${report}`,
  );
}

console.log(
  `Validated Storybook token references: ${referenceCount} var() references across ${surfaceFiles.length} surface files resolve to ${defined.size} defined custom properties.`,
);
