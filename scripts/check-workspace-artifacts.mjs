import { access, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
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
  { id: 'core', name: '@lk-design-system/lds-core', implementation: true },
  { id: 'theme', name: '@lk-design-system/lds-theme', implementation: true },
  { id: 'product', name: '@lk-design-system/lds-product', implementation: true },
  { id: 'compat', name: '@lk-design-system/design-system-core', implementation: false },
  {
    id: 'robotics',
    name: '@lk-design-system/lds-robotics-ui',
    implementation: true,
    external: true,
  },
];
const selectOnly = process.argv.includes('--select-only');

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function optionValue(name) {
  const direct = process.argv.indexOf(name);
  if (direct >= 0) {
    invariant(process.argv[direct + 1] && !process.argv[direct + 1].startsWith('--'), `${name} requires a path.`);
    return process.argv[direct + 1];
  }
  const prefix = `${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
  if (value !== undefined) invariant(value, `${name} requires a path.`);
  return value;
}

function strictArtifactDescendant(value) {
  const absolute = path.resolve(repositoryRoot, value);
  const relative = path.relative(artifactRoot, absolute);
  invariant(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative),
    `Refusing to use an output path outside or equal to visual-artifacts: ${value}`,
  );
  return absolute;
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

async function sourceCommit() {
  const { stdout } = await run('git', ['rev-parse', 'HEAD']);
  const commit = stdout.trim();
  invariant(/^[a-f0-9]{40}$/.test(commit), `git rev-parse HEAD returned an invalid commit: ${commit}`);
  return commit;
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
  const workspaceDirectory = workspace.external
    ? path.join(repositoryRoot, 'node_modules', ...workspace.name.split('/'))
    : path.join(repositoryRoot, 'packages', workspace.id);
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

async function resolveLocalModule(fromFile, specifier) {
  const direct = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [direct, `${direct}.js`, path.join(direct, 'index.js')];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next valid ESM resolution candidate.
    }
  }
  throw new Error(`Unable to resolve packed Select dependency ${specifier} from ${fromFile}.`);
}

async function readLocalModuleGraph(entryFile, visited = new Set()) {
  const normalized = path.resolve(entryFile);
  if (visited.has(normalized)) return '';
  visited.add(normalized);
  const source = await readFile(normalized, 'utf8');
  const relativeImports = [
    ...source.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](\.[^'"]+)['"]/g),
  ].map((match) => match[1]);
  const dependencies = await Promise.all(relativeImports.map(async (specifier) => (
    readLocalModuleGraph(await resolveLocalModule(normalized, specifier), visited)
  )));
  return [source, ...dependencies].join('\n');
}

async function readCssImportGraph(entryFile, visited = new Set()) {
  const normalized = path.resolve(entryFile);
  if (visited.has(normalized)) return '';
  visited.add(normalized);
  const source = await readFile(normalized, 'utf8');
  const relativeImports = [
    ...source.matchAll(/@import\s+(?:url\()?['"](\.[^'"]+\.css)['"][^;]*;/g),
  ].map((match) => match[1]);
  const dependencies = await Promise.all(relativeImports.map((specifier) => (
    readCssImportGraph(path.resolve(path.dirname(normalized), specifier), visited)
  )));
  return [source, ...dependencies].join('\n');
}

function cssCustomProperties(source) {
  return new Set([...source.matchAll(/(?<![A-Za-z0-9-])(--[A-Za-z0-9-]+)\s*:/g)].map((match) => match[1]));
}

function cssVariableReferences(source) {
  return [...source.matchAll(/var\(\s*(--[A-Za-z0-9-]+)(?:\s*,[^)]*)?\)/g)].map((match) => ({
    name: match[1],
    hasFallback: match[0].includes(','),
  }));
}

async function assertPackedSelectTokenContract(packed, consumerDirectory) {
  const core = packed.find(({ id }) => id === 'core');
  const theme = packed.find(({ id }) => id === 'theme');
  invariant(core && theme, 'Packed Select token contract requires the Core and Theme packages.');

  const installedCore = path.join(consumerDirectory, 'node_modules', ...core.name.split('/'));
  const installedTheme = path.join(consumerDirectory, 'node_modules', ...theme.name.split('/'));
  const selectSource = await readLocalModuleGraph(
    path.join(installedCore, 'dist', 'components', 'forms', 'Select.js'),
  );
  invariant(selectSource.includes('listbox') && selectSource.includes('option'), 'Packed Core Select must retain its listbox and option implementation.');

  const css = [
    await readCssImportGraph(path.join(installedCore, 'styles.css')),
    await readCssImportGraph(path.join(installedTheme, 'styles.css')),
  ].join('\n');
  const definitions = cssCustomProperties(css);
  const unresolved = [...new Set(
    cssVariableReferences(selectSource)
      .filter(({ name, hasFallback }) => !hasFallback && !definitions.has(name))
      .map(({ name }) => name),
  )].sort();
  invariant(
    unresolved.length === 0,
    `Packed Core Select references fallback-free CSS variables missing from Core + Theme styles: ${unresolved.join(', ')}.`,
  );
  console.log(`Validated packed Select token contract: ${definitions.size} Core + Theme tokens cover the Select module graph.`);
}

async function installPackedDependencies(packed, consumerDirectory) {
  const localDependencies = Object.fromEntries(packed.map(({ name, tarball }) => [
    name,
    `file:${path.relative(consumerDirectory, tarball).replaceAll('\\', '/')}`,
  ]));
  const includesLockedRobotics = packed.some(({ id }) => id === 'robotics');
  await writeFile(
    path.join(consumerDirectory, 'package.json'),
    `${JSON.stringify({
      name: 'lds-workspace-artifact-smoke',
      private: true,
      type: 'module',
      dependencies: localDependencies,
      ...(includesLockedRobotics ? {
        // The locked external Robotics package was published against an older
        // Core/Product release. This smoke is about the candidate package set
        // as one unit, so keep those edges local and registry-independent.
        overrides: {
          '@lk-design-system/lds-core': '$@lk-design-system/lds-core',
          '@lk-design-system/lds-product': '$@lk-design-system/lds-product',
        },
      } : {}),
    }, null, 2)}\n`,
  );
  await writeFile(
    path.join(consumerDirectory, '.npmrc'),
    await readFile(path.join(repositoryRoot, '.npmrc'), 'utf8'),
  );
  await run(
    npmCommand,
    [...npmPrefixArguments, 'install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps'],
    {
      cwd: consumerDirectory,
      env: { npm_config_cache: path.join(path.dirname(consumerDirectory), 'npm-cache') },
    },
  );
  await linkRuntimePeer(consumerDirectory, 'react');
  await linkRuntimePeer(consumerDirectory, 'react-dom');
}

async function smokePackedSelect(packed, consumerDirectory) {
  await installPackedDependencies(packed, consumerDirectory);
  await assertPackedSelectTokenContract(packed, consumerDirectory);
}

async function smokeConsumer(packed, consumerDirectory) {
  await installPackedDependencies(packed, consumerDirectory);
  await assertPackedSelectTokenContract(packed, consumerDirectory);

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
  const outputValue = optionValue('--output-dir');
  const persistent = outputValue !== undefined;
  const runDirectory = persistent
    ? strictArtifactDescendant(outputValue)
    : await mkdtemp(path.join(artifactRoot, 'workspace-artifacts-'));
  if (persistent) {
    await rm(runDirectory, { recursive: true, force: true, maxRetries: 3 });
    await mkdir(runDirectory, { recursive: true });
  }
  const tarballDirectory = path.join(runDirectory, 'tarballs');
  const consumerDirectory = path.join(runDirectory, 'consumer');
  await mkdir(tarballDirectory, { recursive: true });
  await mkdir(consumerDirectory, { recursive: true });

  let completed = false;
  try {
    const packed = [];
    const selectedWorkspaces = selectOnly
      ? workspaces.filter(({ id }) => id === 'core' || id === 'theme')
      : workspaces;
    for (const workspace of selectedWorkspaces) packed.push(await packWorkspace(workspace, tarballDirectory));
    if (selectOnly) {
      await smokePackedSelect(packed, consumerDirectory);
      completed = true;
      console.log('Packed Select token smoke passed: the Core + Theme tarballs install together and cover every fallback-free Select CSS variable.');
      return;
    }
    await smokeConsumer(packed, consumerDirectory);
    if (persistent) {
      const packages = [];
      for (const item of packed) {
        const bytes = await readFile(item.tarball);
        packages.push({
          id: item.id,
          name: item.name,
          version: item.manifest.version,
          file: `tarballs/${path.basename(item.tarball)}`,
          size: bytes.byteLength,
          sha256: createHash('sha256').update(bytes).digest('hex'),
          source: item.external ? 'locked-external-package' : 'workspace',
        });
      }
      const manifest = {
        schemaVersion: 1,
        kind: 'lds-workspace-package-set',
        sourceCommit: await sourceCommit(),
        packages,
      };
      await writeFile(path.join(runDirectory, 'package-set.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      await rm(consumerDirectory, { recursive: true, force: true, maxRetries: 3 });
      await rm(path.join(runDirectory, 'npm-cache'), { recursive: true, force: true, maxRetries: 3 });
      invariant(
        JSON.stringify((await readdir(runDirectory)).sort()) === JSON.stringify(['package-set.json', 'tarballs']),
        'Persistent package-set output must contain only package-set.json and tarballs/.',
      );
      console.log(`Preserved verified LDS workspace package set: ${path.relative(repositoryRoot, runDirectory).replaceAll('\\', '/')}`);
    }
    completed = true;
    console.log('LDS package set verified: Core/Theme/Product ESM+types, compat ESM+CJS, the locked external Robotics tarball, and isolated consumer smoke passed.');
  } finally {
    if (!persistent || !completed) {
      const relative = path.relative(artifactRoot, runDirectory);
      invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Refusing to clean an artifact path outside visual-artifacts.');
      await rm(runDirectory, { recursive: true, force: true, maxRetries: 3 });
    }
  }
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});
