import { access, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const artifactRoot = path.join(repositoryRoot, 'visual-artifacts');
const npmCommand = process.platform === 'win32' ? process.execPath : 'npm';
const npmPrefixArguments = process.platform === 'win32'
  ? [path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')]
  : [];

const workspaces = [
  { id: 'core', name: '@lk-robotics/lds-core', implementation: true },
  { id: 'theme', name: '@lk-robotics/lds-theme', implementation: true },
  { id: 'product', name: '@lk-robotics/lds-product', implementation: true },
  { id: 'robotics-ui', name: '@lk-robotics/lds-robotics-ui', implementation: true },
  { id: 'compat', name: '@lk-robotics/design-system-core', implementation: false },
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let executable = command;
    let executableArgs = args;
    if (process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command)) {
      const quote = (value) => {
        const text = String(value);
        return /[\s&|<>^]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
      };
      executable = process.env.ComSpec || 'cmd.exe';
      executableArgs = ['/d', '/s', '/c', [command, ...args.map(quote)].join(' ')];
    }
    const child = spawn(executable, executableArgs, {
      cwd: options.cwd ?? repositoryRoot,
      env: { ...process.env, ...options.env },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(
        `${command} ${args.join(' ')} exited with code ${code}.\n${stderr || stdout}`.trim(),
      ));
    });
  });
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function normalizeArchivePath(file) {
  return file.replaceAll('\\', '/').replace(/^package\//, '');
}

function exportTargets(value, conditions = {}) {
  if (typeof value === 'string') return [{ condition: 'default', target: value }];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([condition, nested]) => (
    exportTargets(nested, conditions).map((entry) => ({ ...entry, condition }))
  ));
}

function wildcardPattern(target) {
  const escaped = normalizeArchivePath(target)
    .replace(/^\.\//, '')
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '(.+)');
  return new RegExp(`^${escaped}$`);
}

function matchesForTarget(files, target) {
  const normalized = normalizeArchivePath(target).replace(/^\.\//, '');
  if (!normalized.includes('*')) return files.has(normalized) ? [normalized] : [];
  const pattern = wildcardPattern(normalized);
  return [...files].filter((file) => pattern.test(file));
}

function assertExportFiles(workspace, manifest, files) {
  invariant(manifest.exports && typeof manifest.exports === 'object', `${workspace.id}: exports map is missing.`);
  for (const [subpath, value] of Object.entries(manifest.exports)) {
    for (const { condition, target } of exportTargets(value)) {
      const matches = matchesForTarget(files, target);
      invariant(
        matches.length > 0,
        `${workspace.id}: export ${subpath} (${condition}) promises ${target}, but the tarball has no matching file.`,
      );
    }
  }
}

function assertImplementationContract(workspace, manifest, files) {
  const serializedExports = JSON.stringify(manifest.exports);
  invariant(!serializedExports.includes('"require"'), `${workspace.id}: implementation exports must not expose CommonJS.`);
  invariant(![...files].some((file) => file.endsWith('.cjs')), `${workspace.id}: implementation tarball contains CommonJS output.`);
  invariant(manifest.exports?.['.']?.import && manifest.exports?.['.']?.types, `${workspace.id}: root ESM/types exports are required.`);
  invariant(
    manifest.exports?.['./components/*']?.import && manifest.exports?.['./components/*']?.types,
    `${workspace.id}: deep component ESM/types exports are required.`,
  );
}

function assertCompatContract(manifest, files) {
  for (const subpath of ['.', './core', './theme', './product', './robotics', './components/*']) {
    const entry = manifest.exports?.[subpath];
    invariant(entry?.import && entry?.require && entry?.types, `compat: ${subpath} must expose import, require, and types.`);
  }
  for (const extension of ['.js', '.cjs', '.d.ts']) {
    invariant(
      [...files].some((file) => file.startsWith('dist/components/') && file.endsWith(extension)),
      `compat: deep component ${extension} output is missing.`,
    );
  }
}

function firstStaticSubpath(files, directory) {
  const prefix = `${directory}/`;
  const file = [...files].find((candidate) => candidate.startsWith(prefix) && !candidate.endsWith('/'));
  invariant(file, `compat: no ${directory} file was packed for legacy path smoke testing.`);
  return file;
}

function firstDeepComponent(files) {
  const file = [...files].find((candidate) => candidate.startsWith('dist/components/') && candidate.endsWith('.js'));
  invariant(file, 'No compiled deep component ESM file was packed.');
  return file.slice('dist/'.length, -'.js'.length);
}

async function packWorkspace(workspace, destination) {
  const workspaceDirectory = path.join(repositoryRoot, 'packages', workspace.id);
  const manifest = await readJson(path.join(workspaceDirectory, 'package.json'));
  invariant(manifest.name === workspace.name, `${workspace.id}: expected package name ${workspace.name}, received ${manifest.name}.`);

  const { stdout } = await run(
    npmCommand,
    [...npmPrefixArguments, 'pack', '--json', '--ignore-scripts', '--pack-destination', destination],
    {
      cwd: workspaceDirectory,
      env: { npm_config_cache: path.join(path.dirname(destination), 'npm-cache') },
    },
  );
  let result;
  try {
    [result] = JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${workspace.id}: npm pack did not return valid JSON: ${error.message}\n${stdout}`);
  }
  invariant(result?.filename, `${workspace.id}: npm pack did not report a tarball filename.`);
  const files = new Set((result.files ?? []).map(({ path: file }) => normalizeArchivePath(file)));
  invariant(files.size > 0, `${workspace.id}: npm pack reported an empty tarball.`);
  invariant(![...files].some((file) => file === 'src' || file.startsWith('src/')), `${workspace.id}: raw src files leaked into the tarball.`);
  assertExportFiles(workspace, manifest, files);
  if (workspace.implementation) assertImplementationContract(workspace, manifest, files);
  else assertCompatContract(manifest, files);

  return {
    ...workspace,
    manifest,
    files,
    tarball: path.join(destination, result.filename),
    deepSubpath: firstDeepComponent(files),
  };
}

async function linkRuntimePeer(consumerDirectory, peerName) {
  const source = path.join(repositoryRoot, 'node_modules', peerName);
  await access(source);
  const destination = path.join(consumerDirectory, 'node_modules', peerName);
  await rm(destination, { force: true, recursive: true });
  await symlink(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
}

async function smokeConsumer(packed, consumerDirectory) {
  await writeFile(
    path.join(consumerDirectory, 'package.json'),
    `${JSON.stringify({ name: 'lds-workspace-artifact-smoke', private: true, type: 'module' }, null, 2)}\n`,
  );
  await run(
    npmCommand,
    [...npmPrefixArguments, 'install', '--ignore-scripts', '--legacy-peer-deps', ...packed.map(({ tarball }) => tarball)],
    {
      cwd: consumerDirectory,
      env: { npm_config_cache: path.join(path.dirname(consumerDirectory), 'npm-cache') },
    },
  );
  await linkRuntimePeer(consumerDirectory, 'react');
  await linkRuntimePeer(consumerDirectory, 'react-dom');

  const compat = packed.find(({ id }) => id === 'compat');
  const tokenFile = firstStaticSubpath(compat.files, 'tokens');
  const assetFile = firstStaticSubpath(compat.files, 'assets');
  const smoke = `
import { access } from 'node:fs/promises';
import { createRequire } from 'node:module';

const packages = ${JSON.stringify(packed.map(({ name, deepSubpath }) => ({ name, deepSubpath })))};
for (const item of packages) {
  await import(item.name);
  await import(\`${'${item.name}'}/\${item.deepSubpath}\`);
}

const require = createRequire(import.meta.url);
const legacy = ${JSON.stringify(compat.name)};
require(legacy);
for (const layer of ['core', 'theme', 'product', 'robotics']) require(\`${'${legacy}'}/\${layer}\`);
require(\`${'${legacy}'}/${compat.deepSubpath}\`);

for (const subpath of ${JSON.stringify(['styles.css', tokenFile, assetFile])}) {
  const resolved = import.meta.resolve(\`${'${legacy}'}/\${subpath}\`);
  await access(new URL(resolved));
}
console.log('workspace artifact consumer smoke passed');
`;
  const smokeFile = path.join(consumerDirectory, 'smoke.mjs');
  await writeFile(smokeFile, smoke.trimStart());
  const { stdout } = await run(process.execPath, [smokeFile], { cwd: consumerDirectory });
  invariant(stdout.includes('workspace artifact consumer smoke passed'), 'Consumer smoke did not reach its success marker.');
}

async function main() {
  await mkdir(artifactRoot, { recursive: true });
  const runDirectory = await mkdtemp(path.join(artifactRoot, 'workspace-artifacts-'));
  const tarballDirectory = path.join(runDirectory, 'tarballs');
  const consumerDirectory = path.join(runDirectory, 'consumer');
  await mkdir(tarballDirectory, { recursive: true });
  await mkdir(consumerDirectory, { recursive: true });

  try {
    const packed = [];
    for (const workspace of workspaces) packed.push(await packWorkspace(workspace, tarballDirectory));
    await smokeConsumer(packed, consumerDirectory);
    console.log('LDS Wave 1 workspace tarballs verified: ESM/types packages, compat ESM+CJS, and isolated consumer smoke passed.');
  } finally {
    const relative = path.relative(artifactRoot, runDirectory);
    invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Refusing to clean an artifact path outside visual-artifacts.');
    await rm(runDirectory, { recursive: true, force: true, maxRetries: 3 });
  }
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});
