import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputPath = path.join(root, 'docs', 'DEPRECATIONS.md');
const ownerAuthorityPath = 'docs/references/architecture/OWNER_AUTHORITY_CONTRACT.json';
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
const ownerAuthority = JSON.parse(await readFile(path.join(root, ownerAuthorityPath), 'utf8'));
const packageProjection = ownerAuthority.compatibilityProjections?.deprecatedPackageReexports;
if (packageProjection?.status === 'active') {
  const targetLayer = (ownerAuthority.layers ?? []).find((layer) => layer.id === packageProjection.targetLayer);
  const targetPackage = targetLayer?.package ?? `@lk-design-system/lds-${packageProjection.targetLayer}`;
  for (const entry of packageProjection.entries ?? []) {
    const subjects = entry.exports?.length ? entry.exports : [entry.module.replace(/^components\//, '').replace(/\.(jsx|js)$/, '')];
    for (const subject of subjects) {
      rows.push({
        file: ownerAuthorityPath,
        declaration: `${subject} Product compatibility re-export`,
        reason: `Import from ${targetPackage}. Product root/deep compatibility remains through ${packageProjection.supportWindow} and may be removed in ${packageProjection.earliestRemoval}.`,
      });
    }
  }
}
rows.sort((a, b) => a.file.localeCompare(b.file) || a.declaration.localeCompare(b.declaration));

const markdown = `# Deprecations

| Field | Value |
| --- | --- |
| Type | Generated register |
| Status | Generated · do not edit rows by hand |
| Owner | Component owners |
| Source | public declarations marked \`@deprecated\` and active package compatibility projections |
| Generator | \`npm run report:deprecations\` |

This generated register is the release-facing inventory of public compatibility contracts marked with \`@deprecated\` or declared by the live owner authority. Update the declaration or compatibility projection first, then run \`npm run report:deprecations\`.

| Declaration | Source | Migration |
| --- | --- | --- |
${rows.map((row) => `| \`${row.declaration}\` | \`${row.file}\` | ${row.reason} |`).join('\n')}
`;

if (checkOnly) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== markdown) {
    throw new Error('docs/DEPRECATIONS.md is stale. Run npm run report:deprecations.');
  }
} else {
  await writeFile(outputPath, markdown, 'utf8');
}

console.log(`${checkOnly ? 'Validated' : 'Generated'} ${rows.length} deprecated public contracts.`);
