import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { createReadStream } from 'node:fs';
import { mkdir, copyFile, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { build as viteBuild } from 'vite';
import { build as esbuildBuild } from 'esbuild';
import { chromium } from '@playwright/test';

const root = process.cwd();
const packageName = '@lk-design-system/design-system-core';
const matrixRoot = path.join(root, 'visual-artifacts', 'wave0-consumer-matrix');
const maxTarballBytes = 8 * 1024 * 1024;
const maxSelectedButtonBytes = 150 * 1024;
const versions = [
  { id: 'React 18', fixture: 'react18', react: '18.3.1', reactDom: '18.3.1' },
  { id: 'React 19', fixture: 'react19', react: '19.2.3', reactDom: '19.2.3' },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function optionValue(name) {
  const direct = process.argv.indexOf(name);
  if (direct >= 0) return process.argv[direct + 1];
  const prefix = `${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function normalizePath(value) {
  return value.replaceAll('\\', '/');
}

function gitText(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false });
  assert(result.status === 0, `git ${args.join(' ')} failed:\n${result.stderr || result.error || ''}`);
  return result.stdout.trim();
}

function npmCliPath() {
  const execPath = process.env.npm_execpath;
  if (execPath && /npm-cli\.js$/i.test(execPath)) return execPath;
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  const candidate = candidates.find((value) => {
    const result = spawnSync(process.execPath, ['-e', `require('node:fs').accessSync(${JSON.stringify(value)})`], {
      stdio: 'ignore',
      shell: false,
    });
    return result.status === 0;
  });
  assert(candidate, 'Could not resolve the npm CLI bundled with the active Node runtime.');
  return candidate;
}

function runNpm(args, cwd = root, { quiet = false } = {}) {
  const result = spawnSync(process.execPath, [npmCliPath(), ...args], {
    cwd,
    encoding: 'utf8',
    shell: false,
    stdio: quiet ? 'pipe' : 'inherit',
  });
  assert(
    result.status === 0,
    `npm ${args.join(' ')} failed in ${normalizePath(path.relative(root, cwd) || '.')}\n${result.stderr || result.error || ''}`,
  );
  return quiet ? result.stdout.trim() : '';
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}

function startStaticServer(directory) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', 'http://127.0.0.1');
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
      const filePath = path.resolve(directory, relative);
      if (!filePath.startsWith(directory)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) throw new Error('Not a file');
      response.writeHead(200, { 'content-type': contentType(filePath) });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
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

async function bundleMetrics(appDir) {
  const run = async (contents) => {
    const result = await esbuildBuild({
      stdin: {
        contents,
        resolveDir: appDir,
        sourcefile: 'wave0-tree-shaking.jsx',
        loader: 'jsx',
      },
      bundle: true,
      format: 'esm',
      minify: true,
      metafile: true,
      write: false,
      logLevel: 'silent',
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    });
    const outputContributors = new Set(
      Object.values(result.metafile.outputs).flatMap((output) => Object.keys(output.inputs || {})),
    );
    return {
      bytes: result.outputFiles.reduce((total, file) => total + file.contents.byteLength, 0),
      inputs: outputContributors.size,
    };
  };
  const selected = await run(`import { Button } from '${packageName}'; console.log(Button);`);
  // An unknown property access deliberately keeps the namespace live. A plain
  // console.log(LDS) can still be statically reduced by newer esbuild versions.
  const namespace = await run(`import * as LDS from '${packageName}'; const key = globalThis.__wave0UnknownExport; console.log(LDS[key]);`);
  assert(selected.bytes <= maxSelectedButtonBytes, `Selected Button bundle is ${selected.bytes} bytes; limit is ${maxSelectedButtonBytes}.`);
  assert(namespace.bytes > selected.bytes, 'Namespace import must be larger than the selected Button import.');
  assert(namespace.inputs > selected.inputs, 'Namespace import must include more source inputs than the selected Button import.');
  return {
    selectedButtonBytes: selected.bytes,
    selectedInputCount: selected.inputs,
    namespaceBytes: namespace.bytes,
    namespaceInputCount: namespace.inputs,
  };
}

async function prepareConsumer(appDir, version, tarball) {
  const fixtureDir = path.join(root, 'scripts', 'fixtures', 'wave0-consumer', version.fixture);
  await rm(appDir, { recursive: true, force: true });
  await mkdir(path.join(appDir, 'src'), { recursive: true });
  await copyFile(path.join(fixtureDir, 'package.json'), path.join(appDir, 'package.json'));
  await copyFile(path.join(fixtureDir, 'package-lock.json'), path.join(appDir, 'package-lock.json'));
  runNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], appDir);
  runNpm([
    'install',
    tarball,
    '--no-save',
    '--package-lock=false',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--legacy-peer-deps',
  ], appDir);
}

async function verifyConsumer(appDir, version, tarballInfo, requireBrowser) {
  const consumerRequire = createRequire(path.join(appDir, 'consumer.cjs'));
  const expectedNodeModules = path.join(appDir, 'node_modules');
  const reactResolution = consumerRequire.resolve('react');
  const reactDomResolution = consumerRequire.resolve('react-dom');
  const packageResolution = consumerRequire.resolve(packageName);
  for (const [label, resolved] of [
    ['react', reactResolution],
    ['react-dom', reactDomResolution],
    [packageName, packageResolution],
  ]) {
    assert(
      path.relative(expectedNodeModules, resolved) && !path.relative(expectedNodeModules, resolved).startsWith('..'),
      `${label} resolved outside the isolated consumer node_modules: ${resolved}`,
    );
  }

  const React = consumerRequire('react');
  const { renderToStaticMarkup } = consumerRequire('react-dom/server');
  const rootEntry = consumerRequire(packageName);
  const coreEntry = consumerRequire(`${packageName}/core`);
  const themeEntry = consumerRequire(`${packageName}/theme`);
  const productEntry = consumerRequire(`${packageName}/product`);
  const roboticsEntry = consumerRequire(`${packageName}/robotics`);
  const deepButton = consumerRequire(`${packageName}/components/buttons/Button`);
  assert(typeof rootEntry.Button === 'function', 'Packed root Button is missing.');
  assert(rootEntry.Button === coreEntry.Button, 'Root and Core Button references must match.');
  assert(typeof themeEntry.ThemeToggle === 'function', 'Packed Theme entry is missing ThemeToggle.');
  assert(typeof productEntry.Table === 'function', 'Packed Product entry is missing Table.');
  assert(typeof roboticsEntry.RobotStatusCard === 'function', 'Packed Robotics entry is missing RobotStatusCard.');
  assert(typeof (deepButton.Button || deepButton.default) === 'function', 'Packed deep Button entry is missing.');
  const markup = renderToStaticMarkup(React.createElement(rootEntry.Button, null, `SSR ${version.id}`));
  assert(markup.includes(`SSR ${version.id}`) && markup.includes('<button'), `${version.id} SSR failed.`);

  const appSource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button as RootButton } from '${packageName}';
import { Button as CoreButton } from '${packageName}/core';
import { ThemeToggle } from '${packageName}/theme';
import { Table } from '${packageName}/product';
import { RobotStatusCard } from '${packageName}/robotics';
import '${packageName}/styles.css';

const importedLayers = [ThemeToggle, Table, RobotStatusCard].filter(Boolean).length;
function App() {
  return <main data-testid="wave0-consumer"><h1>Wave 0 ${version.id} consumer</h1><RootButton>Root button</RootButton><CoreButton>Core button</CoreButton><span data-testid="layer-count">{importedLayers}</span></main>;
}
createRoot(document.getElementById('root')).render(<App />);
`;
  await writeFile(path.join(appDir, 'index.html'), '<!doctype html><div id="root"></div><script type="module" src="/src/App.jsx"></script>\n', 'utf8');
  await writeFile(path.join(appDir, 'src', 'App.jsx'), appSource, 'utf8');
  const outDir = path.join(appDir, 'dist');
  await viteBuild({
    root: appDir,
    logLevel: 'silent',
    build: { outDir, emptyOutDir: true },
  });
  const bundleFiles = await collectFiles(outDir);
  const consumerJavaScriptBytes = (await Promise.all(
    bundleFiles.filter((file) => file.endsWith('.js')).map(async (file) => (await stat(file)).size),
  )).reduce((total, value) => total + value, 0);
  assert(consumerJavaScriptBytes > 0, `${version.id} Vite consumer emitted no JavaScript.`);

  let browser = 'not-run';
  if (requireBrowser) {
    const { server, origin } = await startStaticServer(outDir);
    const instance = await chromium.launch();
    const page = await instance.newPage({ viewport: { width: 1280, height: 720 } });
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(`${origin}/index.html`, { waitUntil: 'networkidle' });
      await page.getByTestId('wave0-consumer').waitFor({ timeout: 10000 });
      await page.getByText(`Wave 0 ${version.id} consumer`).waitFor({ timeout: 5000 });
      await page.getByRole('button', { name: 'Root button' }).waitFor({ timeout: 5000 });
      assert((await page.getByTestId('layer-count').innerText()) === '3', `${version.id} layer import wiring failed.`);
    } finally {
      await instance.close();
      server.close();
    }
    assert(errors.length === 0, `${version.id} browser consumer emitted errors:\n${errors.join('\n')}`);
    browser = 'passed';
  }

  const bundles = await bundleMetrics(appDir);
  const installedPackage = JSON.parse(await readFile(path.join(appDir, 'node_modules', '@lk-design-system', 'design-system-core', 'package.json'), 'utf8'));
  assert(installedPackage.name === tarballInfo.package, 'Installed tarball package name drift.');
  assert(installedPackage.version === tarballInfo.version, 'Installed tarball package version drift.');
  const installedReact = consumerRequire('react/package.json').version;
  const installedReactDom = consumerRequire('react-dom/package.json').version;
  assert(installedReact === version.react, `${version.id} resolved React ${installedReact}, expected ${version.react}.`);
  assert(installedReactDom === version.reactDom, `${version.id} resolved React DOM ${installedReactDom}, expected ${version.reactDom}.`);

  return {
    id: version.id,
    reactVersion: installedReact,
    reactDomVersion: installedReactDom,
    status: 'passed',
    cjs: 'passed',
    ssr: 'passed',
    viteBuild: 'passed',
    browser,
    resolution: {
      react: normalizePath(path.relative(appDir, reactResolution)),
      reactDom: normalizePath(path.relative(appDir, reactDomResolution)),
      package: normalizePath(path.relative(appDir, packageResolution)),
    },
    bundles: {
      ...bundles,
      consumerJavaScriptBytes,
    },
  };
}

async function resolveTarball(value) {
  if (value) {
    const absolute = path.resolve(value);
    await stat(absolute);
    return absolute;
  }
  const packDir = path.join(root, 'visual-artifacts', 'package-smoke', 'pack');
  const candidates = (await readdir(packDir))
    .filter((name) => name.endsWith('.tgz'))
    .sort((left, right) => left.localeCompare(right));
  assert(candidates.length === 1, `Expected one Windows package tarball in ${normalizePath(packDir)}; found ${candidates.length}.`);
  return path.join(packDir, candidates[0]);
}

async function main() {
  const capture = process.argv.includes('--capture');
  const expectedLifecycle = capture ? 'capture:consumer:matrix' : 'check:consumer:matrix';
  assert(
    process.env.npm_lifecycle_event === expectedLifecycle,
    `Consumer matrix must run through npm run ${expectedLifecycle}.`,
  );
  const expectedPlatform = process.platform === 'win32' ? 'windows' : 'linux';
  const platform = optionValue('--platform') || expectedPlatform;
  assert(platform === expectedPlatform, `Platform argument ${platform} does not match ${process.platform}.`);
  assert(process.arch === 'x64', 'Consumer matrix requires x64.');
  assert(process.versions.node === '22.17.1', `Consumer matrix requires Node 22.17.1; found ${process.versions.node}.`);
  assert(runNpm(['--version'], root, { quiet: true }) === '10.9.2', 'Consumer matrix requires npm 10.9.2.');
  const baselineTag = optionValue('--baseline-tag');
  if (capture) assert(baselineTag, 'capture:consumer:matrix requires --baseline-tag=<immutable-tag>.');
  const sourceCommit = gitText(['rev-parse', 'HEAD']);
  if (baselineTag) {
    assert(gitText(['rev-parse', `${baselineTag}^{commit}`]) === sourceCommit, `Baseline tag ${baselineTag} does not match HEAD.`);
  }
  const tarball = await resolveTarball(optionValue('--tarball'));
  const tarballBytes = await readFile(tarball);
  const tarballInfo = {
    package: packageName,
    version: JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version,
    sizeBytes: tarballBytes.byteLength,
    sha256: sha256(tarballBytes),
  };
  assert(tarballInfo.sizeBytes <= maxTarballBytes, `Tarball is ${tarballInfo.sizeBytes} bytes; limit is ${maxTarballBytes}.`);

  const platformRoot = path.join(matrixRoot, platform);
  assert(path.relative(matrixRoot, platformRoot) && !path.relative(matrixRoot, platformRoot).startsWith('..'), 'Consumer matrix temp path is unsafe.');
  await rm(platformRoot, { recursive: true, force: true });
  await mkdir(platformRoot, { recursive: true });
  const requireBrowser = process.argv.includes('--require-browser');
  const consumers = [];
  for (const version of versions) {
    const appDir = path.join(platformRoot, version.fixture);
    await prepareConsumer(appDir, version, tarball);
    consumers.push(await verifyConsumer(appDir, version, tarballInfo, requireBrowser));
  }

  const report = {
    schemaVersion: 1,
    kind: 'lds-wave0-consumer-platform-run',
    capturedAt: new Date().toISOString(),
    sourceCommit,
    sourceTag: baselineTag || null,
    platform,
    arch: process.arch,
    node: process.versions.node,
    npm: runNpm(['--version'], root, { quiet: true }),
    command: capture ? 'npm run capture:consumer:matrix' : 'npm run check:consumer:matrix',
    status: 'passed',
    tarball: tarballInfo,
    checks: {
      tarballInstall: 'passed',
      ssr: 'passed',
      treeShaking: 'passed',
      consumerBundle: 'passed',
      browser: requireBrowser ? 'passed' : 'not-run',
    },
    consumers,
  };
  const reportPath = path.resolve(optionValue('--report') || path.join(matrixRoot, `${platform}.json`));
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Validated ${platform} isolated tarball consumers for React 18 and React 19: ${normalizePath(reportPath)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
