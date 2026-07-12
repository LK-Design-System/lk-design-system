import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputPath = path.join(root, 'docs', 'DEPRECATIONS.md');
const checkOnly = process.argv.includes('--check');

async function collectDeclarations(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectDeclarations(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) files.push(fullPath);
  }
  return files;
}

const rows = [];
for (const file of await collectDeclarations(path.join(root, 'components'))) {
  const source = await readFile(file, 'utf8');
  const pattern = /\/\*\*([\s\S]*?@deprecated[\s\S]*?)\*\/\s*([^\r\n]+)/g;
  for (const match of source.matchAll(pattern)) {
    const comment = match[1]
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*\*?\s?/, '').trim())
      .join(' ');
    const reason = comment.replace(/^.*?@deprecated\s*/i, '').trim() || 'Deprecated compatibility contract.';
    const declaration = match[2].trim().replace(/\|/g, '\\|');
    rows.push({ file: path.relative(root, file).replaceAll('\\', '/'), declaration, reason: reason.replace(/\|/g, '\\|') });
  }
}
rows.sort((a, b) => a.file.localeCompare(b.file) || a.declaration.localeCompare(b.declaration));

const markdown = `# Deprecations\n\nThis generated register is the release-facing inventory of public compatibility contracts marked with \`@deprecated\`. Update the declaration comment first, then run \`npm run report:deprecations\`.\n\n| Declaration | Source | Migration |\n| --- | --- | --- |\n${rows.map((row) => `| \`${row.declaration}\` | \`${row.file}\` | ${row.reason} |`).join('\n')}\n`;

if (checkOnly) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== markdown) {
    throw new Error('docs/DEPRECATIONS.md is stale. Run npm run report:deprecations.');
  }
} else {
  await writeFile(outputPath, markdown, 'utf8');
}

console.log(`${checkOnly ? 'Validated' : 'Generated'} ${rows.length} deprecated public contracts.`);
