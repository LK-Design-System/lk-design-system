import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = process.cwd();
const artifactRoot = path.join(root, 'visual-artifacts', 'package-smoke');
const packDir = path.join(artifactRoot, 'pack');
const installDir = path.join(artifactRoot, 'install');
const packageName = '@lk-robotics/design-system-core';
const layerRepresentatives = {
  core: 'Button',
  theme: 'ThemeToggle',
  product: 'Table',
  robotics: 'RobotStatusCard',
};
const entryNames = ['index', ...Object.keys(layerRepresentatives)];
const maxButtonBundleBytes = 150 * 1024;
const maxSvgBytes = 50 * 1024;
const maxTarballBytes = 8 * 1024 * 1024;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exportNames(moduleNamespace) {
  return Object.keys(moduleNamespace)
    .filter((name) => name !== '__esModule' && name !== 'default')
    .sort((a, b) => a.localeCompare(b));
}

function assertRootIsLayerUnion(rootModule, layerModules, format) {
  const rootNames = exportNames(rootModule);
  const layerNames = [...new Set(layerModules.flatMap(exportNames))]
    .sort((a, b) => a.localeCompare(b));
  assert(
    JSON.stringify(rootNames) === JSON.stringify(layerNames),
    `${format} root exports must equal the exact union of Core, Theme, Product, and Robotics exports.`,
  );
}

// Resolve the npm CLI bundled with the running Node. npm_execpath is honored
// only when it actually points at npm's own CLI — under pnpm/yarn it points at
// that package manager instead, and `pnpm pack` rejects npm's flags (e.g.
// --ignore-scripts). Fall back to the npm shipped alongside process.execPath so
// the artifact check runs identically regardless of the launching manager.
function resolveNpmCli() {
  const execpath = process.env.npm_execpath;
  if (execpath && /npm-cli\.js$/i.test(execpath)) return execpath;
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) || null;
}

function run(command, args, cwd = root) {
  let executable = command;
  let commandArgs = args;
  if (command === 'npm') {
    const npmCli = resolveNpmCli();
    assert(npmCli, 'Could not resolve the npm CLI to validate the packaged artifact.');
    executable = process.execPath;
    commandArgs = [npmCli, ...args];
  }
  const result = spawnSync(executable, commandArgs, { cwd, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.error || ''}\n${result.stdout || ''}\n${result.stderr || ''}`);
  }
  return result.stdout.trim();
}

async function collectFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

await rm(artifactRoot, { recursive: true, force: true });
await mkdir(packDir, { recursive: true });
await mkdir(installDir, { recursive: true });
await writeFile(path.join(installDir, 'package.json'), '{"name":"lk-ds-packed-consumer","private":true}\n', 'utf8');

const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
assert(!pkg.dependencies || Object.keys(pkg.dependencies).length === 0, 'Published package must not carry runtime dependencies.');
assert(JSON.stringify(Object.keys(pkg.peerDependencies || {}).sort()) === JSON.stringify(['react', 'react-dom']), 'Peer dependencies must be exactly react and react-dom.');
assert(!pkg.files.includes('components'), 'Raw component source must not be included in the package files list.');

for (const entryName of entryNames) {
  const esmSource = await readFile(path.join(root, 'dist', `${entryName}.js`), 'utf8');
  const cjsSource = await readFile(path.join(root, 'dist', `${entryName}.cjs`), 'utf8');
  assert(
    esmSource.startsWith('"use client";') || esmSource.startsWith('"use client"'),
    `${entryName} ESM entry must preserve the React client boundary directive.`,
  );
  assert(
    cjsSource.slice(0, 200).includes('"use client"'),
    `${entryName} CJS entry must preserve the React client boundary directive near the entry prologue.`,
  );
}

async function buttonBundleBytes(entryName) {
  const bundle = await build({
    stdin: {
      contents: `import { Button } from './${entryName}.js'; console.log(Button);`,
      resolveDir: path.join(root, 'dist'),
      sourcefile: `${entryName}-button-consumer.jsx`,
      loader: 'jsx',
    },
    bundle: true,
    write: false,
    minify: true,
    format: 'esm',
    logLevel: 'silent',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  });
  return bundle.outputFiles[0].contents.byteLength;
}

const rootButtonBundleBytes = await buttonBundleBytes('index');
const coreButtonBundleBytes = await buttonBundleBytes('core');
for (const [entryName, size] of [['root', rootButtonBundleBytes], ['core', coreButtonBundleBytes]]) {
  assert(size <= maxButtonBundleBytes, `${entryName} Button-only bundle is ${size} bytes; limit is ${maxButtonBundleBytes}.`);
}

const svgFiles = (await collectFiles(path.join(root, 'assets', 'icons'))).filter((file) => file.endsWith('.svg'));
const oversizedSvgs = [];
for (const file of svgFiles) {
  const size = (await stat(file)).size;
  if (size > maxSvgBytes) oversizedSvgs.push(`${path.relative(root, file)} (${size} bytes)`);
}
assert(oversizedSvgs.length === 0, `Individual icon assets exceed ${maxSvgBytes} bytes:\n${oversizedSvgs.join('\n')}`);

const packOutput = run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packDir]);
const packed = JSON.parse(packOutput)[0];
assert(packed?.filename, 'npm pack did not report a tarball filename.');
assert(packed.size <= maxTarballBytes, `Packed tarball is ${packed.size} bytes; limit is ${maxTarballBytes}.`);
const packedNames = packed.files.map((file) => file.path.replaceAll('\\', '/'));
const forbidden = packedNames.filter((name) => /^(components|src)\/|\.stories\.|\.prompt\.md$|\.jsx$/.test(name));
assert(forbidden.length === 0, `Packed tarball includes raw source or authoring files:\n${forbidden.join('\n')}`);
const requiredEntryFiles = entryNames.flatMap((entryName) => [
  `dist/${entryName}.js`,
  `dist/${entryName}.cjs`,
  `dist/${entryName}.d.ts`,
]);
for (const required of [...requiredEntryFiles, 'dist/components/buttons/Button.js', 'dist/components/buttons/Button.cjs', 'dist/components/buttons/Button.d.ts']) {
  assert(packedNames.includes(required), `Packed tarball is missing ${required}.`);
}

const tarball = path.join(packDir, packed.filename);
run('npm', ['install', tarball, '--ignore-scripts', '--legacy-peer-deps', '--no-package-lock', '--no-audit', '--no-fund'], installDir);
const consumerRequire = createRequire(path.join(installDir, 'consumer.cjs'));
const cjsPackage = consumerRequire(packageName);
const cjsLayers = Object.keys(layerRepresentatives).map((layer) => consumerRequire(`${packageName}/${layer}`));
const cjsButtonSubpath = consumerRequire(`${packageName}/components/buttons/Button`);
assert(typeof cjsPackage.Button === 'function', 'Installed CJS root did not expose Button.');
assert(typeof (cjsButtonSubpath.Button || cjsButtonSubpath.default) === 'function', 'Installed CJS Button subpath did not expose Button.');
for (const [index, [layer, representative]] of Object.entries(layerRepresentatives).entries()) {
  assert(
    typeof cjsLayers[index][representative] !== 'undefined',
    `Installed CJS ${layer} entry did not expose ${representative}.`,
  );
  assert(
    cjsPackage[representative] === cjsLayers[index][representative],
    `Installed CJS root and ${layer} entries must expose the same ${representative} reference.`,
  );
}
assert(typeof cjsLayers[0].RobotStatusCard === 'undefined', 'Core entry must not expose Robotics components.');
assertRootIsLayerUnion(cjsPackage, cjsLayers, 'CJS');

const installedRoot = path.join(installDir, 'node_modules', '@lk-robotics', 'design-system-core');
const esmPackage = await import(`${pathToFileURL(path.join(installedRoot, 'dist', 'index.js')).href}?smoke=${Date.now()}`);
assert(typeof esmPackage.Button === 'function', 'Installed ESM root did not expose Button.');
const esmLayers = await Promise.all(Object.keys(layerRepresentatives).map((layer) => (
  import(`${pathToFileURL(path.join(installedRoot, 'dist', `${layer}.js`)).href}?smoke=${Date.now()}`)
)));
assert(typeof esmLayers[0].RobotStatusCard === 'undefined', 'Core ESM entry must not expose Robotics components.');
assertRootIsLayerUnion(esmPackage, esmLayers, 'ESM');

const React = consumerRequire('react');
const { renderToStaticMarkup } = consumerRequire('react-dom/server');
const html = renderToStaticMarkup(React.createElement(cjsPackage.Button, null, 'SSR 확인'));
assert(html.includes('SSR 확인') && html.includes('<button'), 'React DOM server rendering failed for the packed CJS artifact.');

console.log(
  `Validated package artifact: actual tarball install, aggregate/layer/deep ESM+CJS+type entries, `
    + `exact root union, SSR, client boundary, ${rootButtonBundleBytes}/${coreButtonBundleBytes}-byte `
    + `root/core Button bundles, and ${svgFiles.length} icon assets.`,
);
