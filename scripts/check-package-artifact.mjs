import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = process.cwd();
const artifactRoot = path.join(root, 'visual-artifacts', 'package-smoke');
const packDir = path.join(artifactRoot, 'pack');
const installDir = path.join(artifactRoot, 'install');
const packageName = '@lk-robotics/design-system-core';
const maxButtonBundleBytes = 150 * 1024;
const maxSvgBytes = 50 * 1024;
const maxTarballBytes = 8 * 1024 * 1024;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(command, args, cwd = root) {
  const useNpmCli = command === 'npm' && process.env.npm_execpath;
  const executable = useNpmCli ? process.execPath : command;
  const commandArgs = useNpmCli ? [process.env.npm_execpath, ...args] : args;
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

const esmSource = await readFile(path.join(root, 'dist', 'index.js'), 'utf8');
const cjsSource = await readFile(path.join(root, 'dist', 'index.cjs'), 'utf8');
assert(esmSource.startsWith('"use client";') || esmSource.startsWith('"use client"'), 'ESM entry must preserve the React client boundary directive.');
assert(cjsSource.slice(0, 200).includes('"use client"'), 'CJS entry must preserve the React client boundary directive near the entry prologue.');

const bundle = await build({
  stdin: {
    contents: "import { Button } from './dist/index.js'; console.log(Button);",
    resolveDir: root,
    sourcefile: 'button-consumer.jsx',
    loader: 'jsx',
  },
  bundle: true,
  write: false,
  minify: true,
  format: 'esm',
  logLevel: 'silent',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
const buttonBundleBytes = bundle.outputFiles[0].contents.byteLength;
assert(buttonBundleBytes <= maxButtonBundleBytes, `Button-only bundle is ${buttonBundleBytes} bytes; limit is ${maxButtonBundleBytes}.`);

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
for (const required of ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/components/buttons/Button.js', 'dist/components/buttons/Button.cjs', 'dist/components/buttons/Button.d.ts']) {
  assert(packedNames.includes(required), `Packed tarball is missing ${required}.`);
}

const tarball = path.join(packDir, packed.filename);
run('npm', ['install', tarball, '--ignore-scripts', '--legacy-peer-deps', '--no-package-lock', '--no-audit', '--no-fund'], installDir);
const consumerRequire = createRequire(path.join(installDir, 'consumer.cjs'));
const cjsPackage = consumerRequire(packageName);
const cjsButtonSubpath = consumerRequire(`${packageName}/components/buttons/Button`);
assert(typeof cjsPackage.Button === 'function', 'Installed CJS root did not expose Button.');
assert(typeof (cjsButtonSubpath.Button || cjsButtonSubpath.default) === 'function', 'Installed CJS Button subpath did not expose Button.');

const installedRoot = path.join(installDir, 'node_modules', '@lk-robotics', 'design-system-core');
const esmPackage = await import(`${pathToFileURL(path.join(installedRoot, 'dist', 'index.js')).href}?smoke=${Date.now()}`);
assert(typeof esmPackage.Button === 'function', 'Installed ESM root did not expose Button.');

const React = consumerRequire('react');
const { renderToStaticMarkup } = consumerRequire('react-dom/server');
const html = renderToStaticMarkup(React.createElement(cjsPackage.Button, null, 'SSR 확인'));
assert(html.includes('SSR 확인') && html.includes('<button'), 'React DOM server rendering failed for the packed CJS artifact.');

console.log(`Validated package artifact: actual tarball install, ESM/CJS and compiled subpath imports, SSR, client boundary, ${buttonBundleBytes}-byte Button bundle, and ${svgFiles.length} icon assets.`);
