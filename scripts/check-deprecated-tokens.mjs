// Blocks LDS's own components, stories and hand-written token CSS from
// referencing a token that tokens/source.json marks as deprecated.
//
// A deprecated token keeps working for consumers until its removal release,
// but LDS itself must already be off it — otherwise the removal breaks LDS
// first, and every story that uses it teaches the old name. The deprecated
// set is read from source.json ($description starting with "Deprecated"),
// so marking a token there is enough to turn this guard on for it.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { loadTokenRetention, retainedTokenReferences } from './token-deprecation-retention.mjs';

const root = process.cwd();
const source = JSON.parse(await readFile(path.join(root, 'tokens/source.json'), 'utf8'));
const retained = await loadTokenRetention(root, source);

const deprecated = new Map();
const isDeprecated = (node) => typeof node?.$description === 'string' && /^Deprecated\b/.test(node.$description);
const collectCss = (node, reason) => {
  if (!node || typeof node !== 'object') return;
  if (typeof node.css === 'string' && node.css.startsWith('--')) deprecated.set(node.css, reason);
  for (const value of Object.values(node)) collectCss(value, reason);
};
const walk = (node) => {
  if (!node || typeof node !== 'object') return;
  if (isDeprecated(node)) {
    collectCss(node, node.$description);
    return;
  }
  for (const value of Object.values(node)) walk(value);
};
walk(source);

// tokens/color-*.css are generated from source.json and define the deprecated
// aliases themselves; everything else under tokens/ is hand-written.
const roots = ['components', 'stories', 'tokens', '.storybook'];
const generated = new Set(['tokens/color-atomic.css', 'tokens/color-semantic.css', 'tokens/color-components.css']);
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.md', '.mdx']);

async function collectFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const findings = [];
for (const dir of roots) {
  for (const file of await collectFiles(path.join(root, dir))) {
    const rel = path.relative(root, file).replaceAll('\\', '/');
    const contents = await readFile(file, 'utf8');
    // Registered compatibility names are checked even in generated files and
    // preview configuration; only their exact retained declaration is allowed.
    findings.push(...retainedTokenReferences(contents, rel, retained)
      .map(({ name, line }) => `${rel}:${line} uses deprecated ${name}`));
    if (dir === '.storybook') continue; // Preserve legacy deprecation scope.
    if (generated.has(rel) || rel === 'stories/color-system.data.js') continue;
    const lines = contents.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const name of deprecated.keys()) {
        if (retained.has(name)) continue; // Already checked without generated-file exceptions.
        const at = line.indexOf(name);
        if (at === -1) continue;
        const next = line[at + name.length];
        if (next !== undefined && /[\w-]/.test(next)) continue; // a longer, different token
        findings.push(`${rel}:${index + 1} uses deprecated ${name}`);
      }
    });
  }
}

if (findings.length) {
  console.error(findings.join('\n'));
  console.error(`\n${findings.length} reference(s) to deprecated tokens. Move each to the replacement named in tokens/source.json and docs/TOKEN_GOVERNANCE.md.`);
  process.exit(1);
}
console.log(`Validated components, stories and token CSS: 0 references to ${deprecated.size} deprecated tokens.`);
