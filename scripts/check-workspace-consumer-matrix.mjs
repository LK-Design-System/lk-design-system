import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build as esbuildBuild } from 'esbuild';
import { build as viteBuild } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const artifactRoot = path.join(repositoryRoot, 'visual-artifacts');
const matrixRoot = path.join(artifactRoot, 'workspace-consumer-matrix');
const expectedPackages = [
  { id: 'core', name: '@lk-robotics/lds-core' },
  { id: 'theme', name: '@lk-robotics/lds-theme' },
  { id: 'product', name: '@lk-robotics/lds-product' },
  { id: 'compat', name: '@lk-robotics/design-system-core' },
];
const compatName = '@lk-robotics/design-system-core';
const versions = [
  { id: 'React 18', fixture: 'react18', react: '18.3.1', reactDom: '18.3.1' },
  { id: 'React 19', fixture: 'react19', react: '19.2.3', reactDom: '19.2.3' },
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function optionValue(name) {
  const direct = process.argv.indexOf(name);
  if (direct >= 0) {
    invariant(process.argv[direct + 1] && !process.argv[direct + 1].startsWith('--'), `${name} requires a value.`);
    return process.argv[direct + 1];
  }
  const prefix = `${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
  if (value !== undefined) invariant(value, `${name} requires a value.`);
  return value;
}

function normalizePath(value) {
  return value.replaceAll('\\', '/');
}

function strictDescendant(parent, candidate, label) {
  const relative = path.relative(parent, candidate);
  invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `${label} is outside ${normalizePath(parent)}.`);
}

function npmCliPath() {
  if (process.env.npm_execpath && /npm-cli\.js$/i.test(process.env.npm_execpath)) return process.env.npm_execpath;
  const candidates = [
    path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  const candidate = candidates.find((value) => spawnSync(process.execPath, ['-e', `require('node:fs').accessSync(${JSON.stringify(value)})`], {
    stdio: 'ignore',
    shell: false,
  }).status === 0);
  invariant(candidate, 'Could not resolve the npm CLI bundled with the active Node runtime.');
  return candidate;
}

function run(command, args, cwd, { quiet = false, env = {} } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    shell: false,
    stdio: quiet ? 'pipe' : 'inherit',
  });
  invariant(
    result.status === 0,
    `${path.basename(command)} ${args.join(' ')} failed in ${normalizePath(path.relative(repositoryRoot, cwd) || '.')}\n${result.stderr || result.error || ''}`,
  );
  return quiet ? result.stdout.trim() : '';
}

function runNpm(args, cwd, options = {}) {
  return run(process.execPath, [npmCliPath(), ...args], cwd, options);
}

function gitText(args) {
  return run('git', args, repositoryRoot, { quiet: true });
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function loadPackageSet(value) {
  invariant(value, '--package-set=<dir> is required.');
  const packageSetDirectory = path.resolve(repositoryRoot, value);
  const manifestPath = path.join(packageSetDirectory, 'package-set.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  invariant(manifest.schemaVersion === 1, 'Package-set schemaVersion must be 1.');
  invariant(manifest.kind === 'lds-workspace-package-set', 'Package-set kind is invalid.');
  invariant(typeof manifest.sourceCommit === 'string' && /^[a-f0-9]{40}$/.test(manifest.sourceCommit), 'Package-set sourceCommit must be a full Git commit.');
  invariant(manifest.sourceCommit === gitText(['rev-parse', 'HEAD']), 'Package-set sourceCommit does not match the current checkout.');
  invariant(Array.isArray(manifest.packages) && manifest.packages.length === expectedPackages.length, 'Package set must contain exactly four packages.');

  const expectedByName = new Map(expectedPackages.map((item) => [item.name, item]));
  const tarballs = [];
  for (const item of manifest.packages) {
    const expected = expectedByName.get(item.name);
    invariant(expected, `Unexpected package in package set: ${item.name}`);
    invariant(item.id === expected.id, `${item.name} package id must be ${expected.id}.`);
    invariant(typeof item.version === 'string' && item.version, `${item.name} version is missing.`);
    invariant(typeof item.file === 'string' && /^tarballs\/[^/\\]+\.tgz$/.test(item.file), `${item.name} tarball path is unsafe.`);
    invariant(Number.isSafeInteger(item.size) && item.size > 0, `${item.name} tarball size is invalid.`);
    invariant(typeof item.sha256 === 'string' && /^[a-f0-9]{64}$/.test(item.sha256), `${item.name} sha256 is invalid.`);
    const tarball = path.resolve(packageSetDirectory, ...item.file.split('/'));
    strictDescendant(packageSetDirectory, tarball, `${item.name} tarball`);
    const bytes = await readFile(tarball);
    invariant(bytes.byteLength === item.size, `${item.name} tarball size does not match package-set.json.`);
    invariant(sha256(bytes) === item.sha256, `${item.name} tarball sha256 does not match package-set.json.`);
    tarballs.push({ ...item, tarball });
    expectedByName.delete(item.name);
  }
  invariant(expectedByName.size === 0, `Package set is missing: ${[...expectedByName.keys()].join(', ')}`);
  invariant(new Set(tarballs.map((item) => item.version)).size === 1, 'All workspace package tarballs must belong to the same release version.');
  for (const expected of expectedPackages) {
    const workspaceManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'packages', expected.id, 'package.json'), 'utf8'));
    const packaged = tarballs.find((item) => item.id === expected.id);
    invariant(workspaceManifest.name === packaged.name && workspaceManifest.version === packaged.version, `${expected.name} package-set identity does not match the current checkout.`);
  }
  const diskTarballs = (await readdir(path.join(packageSetDirectory, 'tarballs'))).sort();
  const declaredTarballs = tarballs.map((item) => path.basename(item.tarball)).sort();
  invariant(JSON.stringify(diskTarballs) === JSON.stringify(declaredTarballs), 'tarballs/ must contain exactly the four files declared by package-set.json.');
  return { directory: packageSetDirectory, manifest, tarballs };
}

async function prepareConsumer(appDirectory, version, packageSet, cacheDirectory) {
  const fixtureDirectory = path.join(repositoryRoot, 'scripts', 'fixtures', 'wave0-consumer', version.fixture);
  await rm(appDirectory, { recursive: true, force: true, maxRetries: 3 });
  await mkdir(path.join(appDirectory, 'src'), { recursive: true });
  await copyFile(path.join(fixtureDirectory, 'package.json'), path.join(appDirectory, 'package.json'));
  await copyFile(path.join(fixtureDirectory, 'package-lock.json'), path.join(appDirectory, 'package-lock.json'));
  await copyFile(path.join(repositoryRoot, '.npmrc'), path.join(appDirectory, '.npmrc'));
  const npmEnvironment = { npm_config_cache: cacheDirectory };
  runNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], appDirectory, { env: npmEnvironment });
  runNpm([
    'install',
    ...packageSet.tarballs.map((item) => item.tarball),
    '--no-save',
    '--package-lock=false',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--legacy-peer-deps',
  ], appDirectory, { env: npmEnvironment });
}

async function verifyEsmImports(appDirectory) {
  const smokeFile = path.join(appDirectory, 'esm-smoke.mjs');
  await writeFile(smokeFile, `
import * as Core from '@lk-robotics/lds-core';
import * as Theme from '@lk-robotics/lds-theme';
import * as Product from '@lk-robotics/lds-product';
import * as Robotics from '@lk-robotics/lds-robotics-ui';
import * as Compat from '@lk-robotics/design-system-core';
import * as CompatCore from '@lk-robotics/design-system-core/core';
import * as CompatTheme from '@lk-robotics/design-system-core/theme';
import * as CompatProduct from '@lk-robotics/design-system-core/product';
import * as CompatRobotics from '@lk-robotics/design-system-core/robotics';
import { Button as CoreDeepButton } from '@lk-robotics/lds-core/components/buttons/Button';
import { Button as CompatDeepButton } from '@lk-robotics/design-system-core/components/buttons/Button';
if (typeof Core.Button !== 'function') throw new Error('Core Button ESM export is missing.');
if (typeof Theme.ThemeToggle !== 'function') throw new Error('ThemeToggle ESM export is missing.');
if (typeof Product.Table !== 'function') throw new Error('Product Table ESM export is missing.');
if (typeof Robotics.RobotStatusCard !== 'function') throw new Error('Robotics ESM export is missing.');
if (Compat.Button !== Core.Button || CompatCore.Button !== Core.Button) throw new Error('Core ESM facade identity drift.');
if (Compat.ThemeToggle !== Theme.ThemeToggle || CompatTheme.ThemeToggle !== Theme.ThemeToggle) throw new Error('Theme ESM facade identity drift.');
if (Compat.Table !== Product.Table || CompatProduct.Table !== Product.Table) throw new Error('Product ESM facade identity drift.');
if (Compat.RobotStatusCard !== Robotics.RobotStatusCard || CompatRobotics.RobotStatusCard !== Robotics.RobotStatusCard) throw new Error('Robotics ESM facade identity drift.');
if (CompatDeepButton !== CoreDeepButton || CompatDeepButton !== Core.Button) throw new Error('Deep ESM facade identity drift.');
console.log('workspace ESM facade identity passed');
`.trimStart(), 'utf8');
  const stdout = run(process.execPath, [smokeFile], appDirectory, { quiet: true });
  invariant(stdout.includes('workspace ESM facade identity passed'), 'Workspace ESM identity smoke did not reach its success marker.');
}

async function bundleMetrics(appDirectory) {
  const bundle = async (contents) => {
    const result = await esbuildBuild({
      stdin: { contents, resolveDir: appDirectory, sourcefile: 'workspace-tree-shaking.jsx', loader: 'jsx' },
      bundle: true,
      format: 'esm',
      minify: true,
      metafile: true,
      write: false,
      logLevel: 'silent',
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    });
    const inputs = new Set(Object.values(result.metafile.outputs).flatMap((output) => Object.keys(output.inputs || {})));
    return {
      bytes: result.outputFiles.reduce((total, file) => total + file.contents.byteLength, 0),
      inputCount: inputs.size,
    };
  };
  const selected = await bundle(`import { Button } from '${compatName}'; console.log(Button);`);
  const namespace = await bundle(`import * as LDS from '${compatName}'; const key = globalThis.__workspaceUnknownExport; console.log(LDS[key]);`);
  invariant(namespace.bytes > selected.bytes, 'Namespace import must be larger than the selected Button import.');
  invariant(namespace.inputCount > selected.inputCount, 'Namespace import must include more source inputs than the selected Button import.');
  return { selected, namespace };
}

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}

function startStaticServer(directory) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (request, response) => {
      try {
        const relative = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname).replace(/^\/+/, '') || 'index.html';
        const file = path.resolve(directory, relative);
        const boundary = path.relative(directory, file);
        if (boundary.startsWith('..') || path.isAbsolute(boundary)) throw new Error('Forbidden');
        const metadata = await stat(file);
        if (!metadata.isFile()) throw new Error('Not a file');
        response.writeHead(200, { 'content-type': contentType(file) });
        createReadStream(file).pipe(response);
      } catch {
        response.writeHead(404);
        response.end('Not found');
      }
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function verifyConsumer(appDirectory, version, packageSet, requireBrowser) {
  await verifyEsmImports(appDirectory);
  const consumerRequire = createRequire(path.join(appDirectory, 'consumer.cjs'));
  const nodeModules = path.join(appDirectory, 'node_modules');
  for (const packageName of [compatName, 'react', 'react-dom']) {
    const resolution = consumerRequire.resolve(packageName);
    const relative = path.relative(nodeModules, resolution);
    invariant(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `${packageName} resolved outside the isolated consumer.`);
  }

  const React = consumerRequire('react');
  const { renderToStaticMarkup } = consumerRequire('react-dom/server');
  const rootEntry = consumerRequire(compatName);
  const coreEntry = consumerRequire(`${compatName}/core`);
  const themeEntry = consumerRequire(`${compatName}/theme`);
  const productEntry = consumerRequire(`${compatName}/product`);
  const roboticsEntry = consumerRequire(`${compatName}/robotics`);
  const deepButton = consumerRequire(`${compatName}/components/buttons/Button`);
  const deepButtonExport = deepButton.Button || deepButton.default;
  invariant(typeof rootEntry.Button === 'function', 'Compat root Button CJS export is missing.');
  invariant(typeof coreEntry.Button === 'function', 'Compat Core layer CJS export is missing.');
  invariant(typeof themeEntry.ThemeToggle === 'function', 'Compat Theme layer CJS export is missing.');
  invariant(typeof productEntry.Table === 'function', 'Compat Product layer CJS export is missing.');
  invariant(typeof roboticsEntry.RobotStatusCard === 'function', 'Compat Robotics layer CJS export is missing.');
  invariant(typeof deepButtonExport === 'function', 'Compat deep Button CJS export is missing.');
  invariant(rootEntry.Button === coreEntry.Button, 'Compat root and Core Button references differ.');
  invariant(rootEntry.Button === deepButtonExport, 'Compat root and deep Button references differ.');
  invariant(rootEntry.ThemeToggle === themeEntry.ThemeToggle, 'Compat root and Theme references differ.');
  invariant(rootEntry.Table === productEntry.Table, 'Compat root and Product references differ.');
  invariant(rootEntry.RobotStatusCard === roboticsEntry.RobotStatusCard, 'Compat root and Robotics references differ.');
  const rootMarkup = renderToStaticMarkup(React.createElement(rootEntry.Button, null, `SSR ${version.id}`));
  const layerMarkup = renderToStaticMarkup(React.createElement(coreEntry.Button, null, `SSR ${version.id}`));
  invariant(rootMarkup.includes('<button') && rootMarkup.includes(`SSR ${version.id}`), `${version.id} SSR failed.`);
  invariant(layerMarkup === rootMarkup, `${version.id} CJS root and Core render output differ.`);

  const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@lk-robotics/lds-core';
import { ThemeToggle } from '@lk-robotics/lds-theme';
import { Table } from '@lk-robotics/lds-product';
import { RobotStatusCard } from '${compatName}/robotics';
import '${compatName}/styles.css';
const imports = [ThemeToggle, Table, RobotStatusCard].filter(Boolean).length;
function App() { return <main data-testid="workspace-consumer"><h1>Workspace ${version.id} consumer</h1><Button>Root button</Button><span data-testid="layer-count">{imports}</span></main>; }
createRoot(document.getElementById('root')).render(<App />);
`;
  await writeFile(path.join(appDirectory, 'index.html'), '<!doctype html><div id="root"></div><script type="module" src="/src/App.jsx"></script>\n', 'utf8');
  await writeFile(path.join(appDirectory, 'src', 'App.jsx'), appSource, 'utf8');
  const outputDirectory = path.join(appDirectory, 'dist');
  await viteBuild({ root: appDirectory, mode: 'production', logLevel: 'silent', build: { outDir: outputDirectory, emptyOutDir: true } });
  const outputFiles = await collectFiles(outputDirectory);
  const javaScriptBytes = (await Promise.all(outputFiles.filter((file) => file.endsWith('.js')).map(async (file) => (await stat(file)).size)))
    .reduce((total, bytes) => total + bytes, 0);
  invariant(javaScriptBytes > 0, `${version.id} Vite build emitted no JavaScript.`);

  let browser = 'not-run';
  if (requireBrowser) {
    const { chromium } = await import('@playwright/test');
    const { server, origin } = await startStaticServer(outputDirectory);
    let instance;
    const errors = [];
    try {
      instance = await chromium.launch();
      const page = await instance.newPage({ viewport: { width: 1280, height: 720 } });
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${origin}/index.html`, { waitUntil: 'networkidle' });
      await page.getByTestId('workspace-consumer').waitFor({ timeout: 10000 });
      invariant(await page.getByTestId('layer-count').innerText() === '3', `${version.id} browser layer imports failed.`);
    } finally {
      if (instance) await instance.close();
      await new Promise((resolve) => server.close(resolve));
    }
    invariant(errors.length === 0, `${version.id} browser consumer emitted errors:\n${errors.join('\n')}`);
    browser = 'passed';
  }

  const bundles = await bundleMetrics(appDirectory);
  for (const item of packageSet.tarballs) {
    const installed = JSON.parse(await readFile(path.join(appDirectory, 'node_modules', ...item.name.split('/'), 'package.json'), 'utf8'));
    invariant(installed.name === item.name && installed.version === item.version, `${item.name} installed package identity drift.`);
  }
  const compatManifest = JSON.parse(await readFile(path.join(appDirectory, 'node_modules', '@lk-robotics', 'design-system-core', 'package.json'), 'utf8'));
  const roboticsManifest = JSON.parse(await readFile(path.join(appDirectory, 'node_modules', '@lk-robotics', 'lds-robotics-ui', 'package.json'), 'utf8'));
  invariant(
    roboticsManifest.name === '@lk-robotics/lds-robotics-ui' && roboticsManifest.version === compatManifest.dependencies?.['@lk-robotics/lds-robotics-ui'],
    'Registry-installed Robotics dependency does not match the compat package contract.',
  );
  invariant(consumerRequire('react/package.json').version === version.react, `${version.id} React version drift.`);
  invariant(consumerRequire('react-dom/package.json').version === version.reactDom, `${version.id} React DOM version drift.`);
  return {
    id: version.id,
    reactVersion: version.react,
    reactDomVersion: version.reactDom,
    status: 'passed',
    checks: { esm: 'passed', cjs: 'passed', ssr: 'passed', viteBuild: 'passed', browser },
    bundles: { ...bundles, consumerJavaScriptBytes: javaScriptBytes },
  };
}

async function main() {
  const platform = optionValue('--platform');
  invariant(platform === 'windows' || platform === 'linux', '--platform must be windows or linux.');
  const expectedPlatform = process.platform === 'win32' ? 'windows' : 'linux';
  invariant(platform === expectedPlatform, `Platform argument ${platform} does not match ${process.platform}.`);
  invariant(process.arch === 'x64', 'Workspace consumer matrix requires x64.');
  if (process.env.npm_lifecycle_event) {
    invariant(process.env.npm_lifecycle_event === 'check:workspace-consumer:matrix', 'Workspace consumer matrix must run through npm run check:workspace-consumer:matrix.');
    invariant(process.versions.node === '22.17.1', `Workspace consumer matrix requires Node 22.17.1; found ${process.versions.node}.`);
    invariant(runNpm(['--version'], repositoryRoot, { quiet: true }) === '10.9.2', 'Workspace consumer matrix requires npm 10.9.2.');
  }
  const packageSet = await loadPackageSet(optionValue('--package-set'));
  const requireBrowser = process.argv.includes('--require-browser');
  const workDirectory = path.join(matrixRoot, `.work-${platform}-${process.pid}`);
  const cacheDirectory = path.join(workDirectory, 'npm-cache');
  const reportPath = path.join(matrixRoot, `${platform}.json`);
  strictDescendant(matrixRoot, workDirectory, 'Workspace consumer temp directory');
  strictDescendant(matrixRoot, reportPath, 'Workspace consumer report');
  await mkdir(matrixRoot, { recursive: true });
  await rm(reportPath, { force: true });
  await rm(workDirectory, { recursive: true, force: true, maxRetries: 3 });
  await mkdir(workDirectory, { recursive: true });
  try {
    const consumers = [];
    for (const version of versions) {
      const appDirectory = path.join(workDirectory, version.fixture);
      await prepareConsumer(appDirectory, version, packageSet, cacheDirectory);
      consumers.push(await verifyConsumer(appDirectory, version, packageSet, requireBrowser));
    }
    const report = {
      schemaVersion: 1,
      kind: 'lds-workspace-consumer-platform-run',
      checkedAt: new Date().toISOString(),
      sourceCommit: packageSet.manifest.sourceCommit ?? null,
      platform,
      arch: process.arch,
      node: process.versions.node,
      npm: runNpm(['--version'], repositoryRoot, { quiet: true }),
      status: 'passed',
      packageSet: packageSet.tarballs.map(({ id, name, version, file, size, sha256: digest }) => ({ id, name, version, file, size, sha256: digest })),
      checks: { packageSetIntegrity: 'passed', packageInstall: 'passed', esm: 'passed', cjs: 'passed', ssr: 'passed', treeShaking: 'passed', viteBuild: 'passed', browser: requireBrowser ? 'passed' : 'not-run' },
      consumers,
    };
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`Validated ${platform} workspace package-set consumers for React 18 and React 19: ${normalizePath(path.relative(repositoryRoot, reportPath))}.`);
  } finally {
    strictDescendant(matrixRoot, workDirectory, 'Workspace consumer temp directory');
    await rm(workDirectory, { recursive: true, force: true, maxRetries: 3 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
