import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { build } from 'esbuild';

const root = process.cwd();
const artifactRoot = path.join(root, 'visual-artifacts', 'package-smoke');
const packDir = path.join(artifactRoot, 'pack');
const installDir = path.join(artifactRoot, 'install');
const baselineEvidencePath = path.join(
  root,
  'docs',
  'references',
  'package-split',
  'baselines',
  'WAVE0_AGGREGATE_ARTIFACT.json',
);
const baselineEvidenceRelativePath = path.relative(root, baselineEvidencePath).replaceAll('\\', '/');
const baselineSchemaPath = path.join(
  root,
  'docs',
  'references',
  'package-split',
  'PACKAGE_ARTIFACT_BASELINE.schema.json',
);
const migrationAuditPath = path.join(
  root,
  'docs',
  'references',
  'package-split',
  'MIGRATION_AUDIT.json',
);
const migrationAuditRelativePath = path.relative(root, migrationAuditPath).replaceAll('\\', '/');
const verificationSentinelPath = path.join(artifactRoot, 'WAVE0_ARTIFACT_VERIFIED.json');
const verificationSentinelRelativePath = path.relative(root, verificationSentinelPath).replaceAll('\\', '/');
const canonicalRuntime = {
  platform: 'win32',
  arch: 'x64',
  node: '22.17.1',
  npm: '10.9.2',
};
const captureBaseline = process.argv.includes('--capture-baseline');
const verifyBaseline = process.argv.includes('--verify-baseline');
const verifyBaselineIfPresent = process.argv.includes('--verify-baseline-if-present');
const baselineModeCount = [captureBaseline, verifyBaseline, verifyBaselineIfPresent].filter(Boolean).length;
const baselineRequested = captureBaseline || verifyBaseline || verifyBaselineIfPresent;
const packageName = '@lk-design-system/design-system-core';
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

assert(baselineModeCount <= 1, 'Choose only one package-artifact baseline mode.');

const expectedLifecycle = captureBaseline
  ? 'capture:pack:baseline'
  : verifyBaseline
    ? 'check:pack:baseline'
    : verifyBaselineIfPresent
      ? 'check:pack:baseline-if-present'
      : null;
if (expectedLifecycle) {
  assert(
    process.env.npm_lifecycle_event === expectedLifecycle,
    `${expectedLifecycle} must run through its package.json lifecycle; direct baseline-mode invocation is not authoritative.`,
  );
}

function optionValue(name) {
  const exactIndex = process.argv.indexOf(name);
  if (exactIndex >= 0) return process.argv[exactIndex + 1];
  const prefix = `${name}=`;
  const match = process.argv.find((value) => value.startsWith(prefix));
  return match?.slice(prefix.length);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function normalizePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '');
}

function formatSchemaErrors(errors) {
  return (errors || [])
    .map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ');
}

function createSchemaValidator(schema, label) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  return (value) => {
    assert(validate(value), `${label} schema validation failed: ${formatSchemaErrors(validate.errors)}`);
  };
}

function gitOutput(args) {
  return spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });
}

function gitText(args) {
  const result = gitOutput(args);
  assert(
    result.status === 0,
    `git ${args.join(' ')} failed:\n${result.error || ''}\n${result.stdout || ''}\n${result.stderr || ''}`,
  );
  return result.stdout.trim();
}

function isGitIgnored(relativePath) {
  return gitOutput(['check-ignore', '--quiet', '--', normalizePath(relativePath)]).status === 0;
}

function isGitTracked(relativePath) {
  return gitOutput(['ls-files', '--error-unmatch', '--', normalizePath(relativePath)]).status === 0;
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

function assertCanonicalRuntime(pkg, npmVersion) {
  assert(
    process.platform === canonicalRuntime.platform,
    `Canonical package baseline requires ${canonicalRuntime.platform}; found ${process.platform}.`,
  );
  assert(
    process.arch === canonicalRuntime.arch,
    `Canonical package baseline requires ${canonicalRuntime.arch}; found ${process.arch}.`,
  );
  assert(
    process.versions.node === canonicalRuntime.node,
    `Canonical package baseline requires Node ${canonicalRuntime.node}; found ${process.versions.node}.`,
  );
  assert(
    npmVersion === canonicalRuntime.npm,
    `Canonical package baseline requires npm ${canonicalRuntime.npm}; found ${npmVersion}.`,
  );
  assert(
    pkg.packageManager === `npm@${canonicalRuntime.npm}`,
    `package.json packageManager must be npm@${canonicalRuntime.npm}.`,
  );
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
const npmVersion = run('npm', ['--version']);
const packageLockBytes = await readFile(path.join(root, 'package-lock.json'));
const verifierBytes = await readFile(path.join(root, 'scripts', 'check-package-artifact.mjs'));
const validateBaselineEvidence = baselineRequested
  ? createSchemaValidator(
    JSON.parse(await readFile(baselineSchemaPath, 'utf8')),
    'Package artifact baseline',
  )
  : null;
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
const tarballRelativePath = normalizePath(path.relative(root, tarball));
const tarballBytes = await readFile(tarball);
const tarballSha256 = sha256(tarballBytes);
assert(isGitIgnored(tarballRelativePath), `Generated tarball must stay ignored: ${tarballRelativePath}.`);
assert(!isGitTracked(tarballRelativePath), `Generated tarball must not be tracked: ${tarballRelativePath}.`);
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

const installedRoot = path.join(installDir, 'node_modules', '@lk-design-system', 'design-system-core');
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

const baselineExists = existsSync(baselineEvidencePath);

if (baselineRequested && (captureBaseline || verifyBaseline || baselineExists)) {
  assertCanonicalRuntime(pkg, npmVersion);
}

if (captureBaseline) {
  const baselineTag = optionValue('--baseline-tag');
  const releaseSet = optionValue('--release-set');
  assert(baselineTag, '--capture-baseline requires --baseline-tag=<tag>.');
  assert(releaseSet, '--capture-baseline requires --release-set=<immutable-id>.');
  assert(gitText(['status', '--porcelain']) === '', 'Baseline capture requires a clean worktree.');
  assert(gitText(['branch', '--show-current']) === 'main', 'Baseline capture must run on main.');
  const sourceCommit = gitText(['rev-parse', 'HEAD']);
  assert(
    gitText(['rev-parse', `${baselineTag}^{commit}`]) === sourceCommit,
    `Baseline tag ${baselineTag} must resolve to the current source commit.`,
  );
  assert(!isGitTracked(baselineEvidenceRelativePath), 'Capture must start before the evidence attestation is tracked.');

  const evidence = {
    $schema: '../PACKAGE_ARTIFACT_BASELINE.schema.json',
    schemaVersion: 1,
    kind: 'lds-wave0-aggregate-artifact',
    capturedAt: new Date().toISOString(),
    repository: 'LK-ROBOTICS/lk-design-system',
    sourceCommit,
    sourceTag: baselineTag,
    lastKnownGoodReleaseSet: releaseSet,
    canonicalEnvironment: {
      ...canonicalRuntime,
      packageManager: pkg.packageManager,
    },
    inputs: {
      lockfile: 'package-lock.json',
      lockfileSha256: sha256(packageLockBytes),
      artifactVerifier: 'scripts/check-package-artifact.mjs',
      artifactVerifierSha256: sha256(verifierBytes),
      installCommand: 'npm ci',
      buildCommand: 'npm run build',
      generatedCheckCommand: 'npm run check:generated',
      packCommand: 'npm pack --json --ignore-scripts --pack-destination visual-artifacts/package-smoke/pack',
    },
    tarballs: [{
      package: pkg.name,
      version: pkg.version,
      sourceCommit,
      artifactPath: tarballRelativePath,
      storage: 'ignored-regenerated',
      sizeBytes: packed.size,
      sha256: tarballSha256,
      fileCount: packed.files.length,
      unpackedSizeBytes: packed.unpackedSize,
    }],
    smoke: {
      rootButtonBundleBytes,
      coreButtonBundleBytes,
      iconAssets: svgFiles.length,
      esm: 'passed',
      cjs: 'passed',
      types: 'passed',
      ssr: 'passed',
    },
    verification: {
      command: 'npm run check:pack:baseline',
      result: 'passed',
    },
  };
  validateBaselineEvidence(evidence);
  await mkdir(path.dirname(baselineEvidencePath), { recursive: true });
  await writeFile(baselineEvidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(
    `Captured canonical package baseline evidence at ${baselineEvidenceRelativePath}: `
      + `${packed.size} bytes, sha256 ${tarballSha256}.`,
  );
}

if (verifyBaseline || (verifyBaselineIfPresent && baselineExists)) {
  assert(baselineExists, `Missing package baseline evidence: ${baselineEvidenceRelativePath}.`);
  const evidenceBytes = await readFile(baselineEvidencePath);
  const evidence = JSON.parse(evidenceBytes.toString('utf8'));
  validateBaselineEvidence(evidence);
  const recorded = Array.isArray(evidence.tarballs) ? evidence.tarballs[0] : undefined;
  assert(evidence.$schema === '../PACKAGE_ARTIFACT_BASELINE.schema.json', 'Package baseline schema path drift.');
  assert(evidence.schemaVersion === 1, 'Package baseline schema version drift.');
  assert(evidence.kind === 'lds-wave0-aggregate-artifact', 'Package baseline kind drift.');
  assert(evidence.repository === 'LK-ROBOTICS/lk-design-system', 'Package baseline repository drift.');
  assert(evidence.canonicalEnvironment?.platform === canonicalRuntime.platform, 'Package baseline platform drift.');
  assert(evidence.canonicalEnvironment?.arch === canonicalRuntime.arch, 'Package baseline architecture drift.');
  assert(evidence.canonicalEnvironment?.node === canonicalRuntime.node, 'Package baseline Node version drift.');
  assert(evidence.canonicalEnvironment?.npm === canonicalRuntime.npm, 'Package baseline npm version drift.');
  assert(evidence.canonicalEnvironment?.packageManager === pkg.packageManager, 'Package baseline packageManager drift.');
  assert(evidence.inputs?.lockfile === 'package-lock.json', 'Package baseline lockfile path drift.');
  assert(evidence.inputs?.lockfileSha256 === sha256(packageLockBytes), 'Package baseline lockfile checksum drift.');
  assert(
    evidence.inputs?.artifactVerifierSha256 === sha256(verifierBytes),
    'Package baseline verifier checksum drift.',
  );
  assert(evidence.verification?.command === 'npm run check:pack:baseline', 'Package baseline verification command drift.');
  assert(evidence.verification?.result === 'passed', 'Package baseline verification result drift.');
  assert(recorded?.package === pkg.name, 'Package baseline package name drift.');
  assert(recorded?.version === pkg.version, 'Package baseline package version drift.');
  assert(recorded?.sourceCommit === evidence.sourceCommit, 'Package baseline source commit drift.');
  assert(recorded?.artifactPath === tarballRelativePath, 'Package baseline artifact path drift.');
  assert(recorded?.storage === 'ignored-regenerated', 'Package baseline storage contract drift.');
  assert(recorded?.sizeBytes === packed.size, `Package baseline size drift: ${packed.size} != ${recorded?.sizeBytes}.`);
  assert(recorded?.sha256 === tarballSha256, `Package baseline checksum drift: ${tarballSha256} != ${recorded?.sha256}.`);
  assert(recorded?.fileCount === packed.files.length, 'Package baseline file-count drift.');
  assert(recorded?.unpackedSizeBytes === packed.unpackedSize, 'Package baseline unpacked-size drift.');
  assert(
    gitText(['rev-parse', `${evidence.sourceTag}^{commit}`]) === evidence.sourceCommit,
    'Package baseline source tag no longer resolves to its recorded commit.',
  );
  assert(
    gitOutput(['merge-base', '--is-ancestor', evidence.sourceCommit, 'HEAD']).status === 0,
    'Package baseline source commit must be an ancestor of the current checkout.',
  );
  console.log(
    `Reproduced canonical package baseline ${evidence.lastKnownGoodReleaseSet}: `
      + `${packed.size} bytes, sha256 ${tarballSha256}.`,
  );
  if (verifyBaseline) {
    assert(
      isGitTracked(baselineEvidenceRelativePath),
      'Wave 0 artifact verification requires tracked baseline evidence.',
    );
    const auditBytes = await readFile(migrationAuditPath);
    const sentinel = {
      schemaVersion: 1,
      kind: 'lds-wave0-artifact-verification',
      verifiedAt: new Date().toISOString(),
      currentCommit: gitText(['rev-parse', 'HEAD']),
      evidenceSourceCommit: evidence.sourceCommit,
      auditPath: migrationAuditRelativePath,
      auditSha256: sha256(auditBytes),
      evidencePath: baselineEvidenceRelativePath,
      evidenceSha256: sha256(evidenceBytes),
      artifactPath: tarballRelativePath,
      artifactSizeBytes: packed.size,
      artifactSha256: tarballSha256,
      verifierPath: 'scripts/check-package-artifact.mjs',
      verifierSha256: sha256(verifierBytes),
      lifecycle: 'check:pack:baseline',
      canonicalEnvironment: {
        ...canonicalRuntime,
        packageManager: pkg.packageManager,
      },
    };
    await writeFile(verificationSentinelPath, `${JSON.stringify(sentinel, null, 2)}\n`, 'utf8');
    assert(
      isGitIgnored(verificationSentinelRelativePath),
      `Wave 0 verification sentinel must stay ignored: ${verificationSentinelRelativePath}.`,
    );
    assert(
      !isGitTracked(verificationSentinelRelativePath),
      `Wave 0 verification sentinel must not be tracked: ${verificationSentinelRelativePath}.`,
    );
    console.log(`Wrote commit- and audit-bound verification proof at ${verificationSentinelRelativePath}.`);
  }
} else if (verifyBaselineIfPresent) {
  console.log(`Package baseline evidence is not captured yet; completed functional artifact smoke only.`);
}

console.log(
  `Validated package artifact: actual tarball install, aggregate/layer/deep ESM+CJS+type entries, `
    + `exact root union, SSR, client boundary, ${rootButtonBundleBytes}/${coreButtonBundleBytes}-byte `
    + `root/core Button bundles, and ${svgFiles.length} icon assets.`,
);
