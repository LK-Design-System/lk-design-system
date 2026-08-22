import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const workspaceArg = process.argv.find((argument) => argument.startsWith('--workspace-root='));
const workspaceRoot = workspaceArg ? path.resolve(workspaceArg.slice('--workspace-root='.length)) : null;
const forbidden = [
  { label: 'aggregate design-system package', pattern: /@lk-design-system\/design-system-core/ },
  { label: 'retired Editorial package', pattern: /@lk-design-system\/lds-editorial-ui/ },
  { label: 'pastel console archive package', pattern: /lk-design-system-console-pastel|lds-console-pastel/ },
];
const extensions = new Set(['.css', '.d.ts', '.html', '.js', '.jsx', '.json', '.mjs', '.ts', '.tsx', '.yaml', '.yml']);
const skipDirectoryNames = new Set(['.git', '.next', 'dist', 'node_modules', 'storybook-static', 'visual-artifacts', 'visual-baselines', 'vendor']);

async function collect(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirectoryNames.has(entry.name)) await collect(path.join(directory, entry.name), files);
      continue;
    }
    if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(path.join(directory, entry.name));
  }
  return files;
}

function shouldScan(filePath) {
  const normalized = filePath.replaceAll('\\', '/');
  if (normalized.endsWith('/package.json') && normalized.includes('/shared/lk-design-system/package.json')) return false;
  if (normalized.includes('/docs/') || normalized.includes('/references/')) return false;
  if (normalized.includes('/scripts/vendor_')) return false;
  return true;
}

async function scan(label, directories) {
  const files = [];
  for (const directory of directories) {
    try { files.push(...await collect(directory)); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const findings = [];
  for (const filePath of files.filter(shouldScan)) {
    const text = await readFile(filePath, 'utf8');
    for (const { label: forbiddenLabel, pattern } of forbidden) {
      if (pattern.test(text)) findings.push(`${label}: ${path.relative(root, filePath).replaceAll('\\', '/')} (${forbiddenLabel})`);
    }
  }
  return findings;
}

const findings = await scan('LDS', [
  path.join(root, 'components'),
  path.join(root, 'packages', 'core'),
  path.join(root, 'packages', 'theme'),
  path.join(root, 'packages', 'product'),
  path.join(root, 'src'),
  path.join(root, 'stories'),
  path.join(root, '.storybook'),
]);

if (workspaceRoot) {
  findings.push(...await scan('Portal', [path.join(workspaceRoot, 'ops', 'lk-portal', 'src')]));
  findings.push(...await scan('Portal manifest', [path.join(workspaceRoot, 'ops', 'lk-portal')]));
  findings.push(...await scan('Web Viz', [path.join(workspaceRoot, 'ops', 'lk_web_viz', 'frontend', 'src')]));
  findings.push(...await scan('Web Viz manifest', [
    path.join(workspaceRoot, 'ops', 'lk_web_viz', 'frontend'),
    path.join(workspaceRoot, 'ops', 'lk_web_viz', '.lds'),
  ]));
}

if (findings.length > 0) {
  throw new Error(`Legacy active references remain:\n- ${findings.join('\n- ')}`);
}

console.log(`Validated legacy active references: 0 retired aggregate/editorial/pastel references${workspaceRoot ? ' across LDS, Portal and Web Viz' : ' in LDS source'}.`);
