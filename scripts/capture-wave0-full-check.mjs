import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const evidenceRelativePath = 'docs/references/package-split/baselines/WAVE0_FULL_CHECK.json';
const evidencePath = path.join(root, evidenceRelativePath);
const canonicalRuntime = {
  platform: 'win32',
  arch: 'x64',
  node: '22.17.1',
  npm: '10.9.2',
  packageManager: 'npm@10.9.2',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function optionValue(name) {
  const direct = process.argv.indexOf(name);
  if (direct >= 0) return process.argv[direct + 1];
  const prefix = `${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function git(args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false });
}

function gitText(args) {
  const result = git(args);
  assert(
    result.status === 0,
    `git ${args.join(' ')} failed:\n${result.stderr || result.error || ''}`,
  );
  return result.stdout.trim();
}

function resolveNpmCli() {
  const execPath = process.env.npm_execpath;
  if (execPath && /npm-cli\.js$/i.test(execPath)) return execPath;
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function npmText(args) {
  const npmCli = resolveNpmCli();
  assert(npmCli, 'Could not resolve the npm CLI bundled with the active Node runtime.');
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });
  assert(
    result.status === 0,
    `npm ${args.join(' ')} failed:\n${result.stderr || result.error || ''}`,
  );
  return result.stdout.trim();
}

function runNpm(args) {
  const npmCli = resolveNpmCli();
  assert(npmCli, 'Could not resolve the npm CLI bundled with the active Node runtime.');
  return new Promise((resolve, reject) => {
    const outputHash = createHash('sha256');
    const child = spawn(process.execPath, [npmCli, ...args], {
      cwd: root,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
    child.stdout.on('data', (chunk) => {
      outputHash.update(chunk);
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      outputHash.update(chunk);
      process.stderr.write(chunk);
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve(outputHash.digest('hex'));
      else reject(new Error(`npm ${args.join(' ')} failed${signal ? ` with ${signal}` : ` with exit code ${code}`}.`));
    });
  });
}

function assertCleanSource() {
  assert(gitText(['diff', '--name-only']) === '', 'Full-check capture requires no unstaged source changes.');
  assert(gitText(['diff', '--cached', '--name-only']) === '', 'Full-check capture requires no staged source changes.');
  const allowedUntracked = new Set([
    'docs/references/package-split/baselines/WAVE0_AGGREGATE_ARTIFACT.json',
  ]);
  const untracked = gitText(['ls-files', '--others', '--exclude-standard'])
    .split(/\r?\n/)
    .filter(Boolean)
    .map((value) => value.replaceAll('\\', '/'));
  const unexpected = untracked.filter((value) => !allowedUntracked.has(value));
  assert(
    unexpected.length === 0,
    `Full-check capture found unexpected untracked files: ${unexpected.join(', ')}`,
  );
}

async function main() {
  assert(
    process.env.npm_lifecycle_event === 'capture:wave0:full-check',
    'Wave 0 full-check capture must run through npm run capture:wave0:full-check.',
  );
  assert(process.platform === canonicalRuntime.platform, 'Wave 0 full-check capture is canonical on Windows only.');
  assert(process.arch === canonicalRuntime.arch, 'Wave 0 full-check capture requires x64.');
  assert(process.versions.node === canonicalRuntime.node, `Expected Node ${canonicalRuntime.node}.`);
  assert(npmText(['--version']) === canonicalRuntime.npm, `Expected npm ${canonicalRuntime.npm}.`);
  const packageJson = JSON.parse(await import('node:fs/promises').then(({ readFile }) => readFile(path.join(root, 'package.json'), 'utf8')));
  assert(packageJson.packageManager === canonicalRuntime.packageManager, 'package.json packageManager drift.');

  const baselineTag = optionValue('--baseline-tag');
  assert(baselineTag, 'capture:wave0:full-check requires --baseline-tag=<immutable-tag>.');
  assert(gitText(['branch', '--show-current']) === 'main', 'Wave 0 full-check capture must run on main.');
  assertCleanSource();
  assert(!existsSync(evidencePath), `${evidenceRelativePath} already exists; capture must not overwrite evidence.`);
  assert(
    git(['ls-files', '--error-unmatch', '--', evidenceRelativePath]).status !== 0,
    'Full-check capture must start before its evidence is tracked.',
  );

  const sourceCommit = gitText(['rev-parse', 'HEAD']);
  assert(
    gitText(['rev-parse', `${baselineTag}^{commit}`]) === sourceCommit,
    `Baseline tag ${baselineTag} must resolve to the current source commit.`,
  );
  assert(
    typeof packageJson.scripts?.check === 'string' && packageJson.scripts.check.includes('check:storybook') && packageJson.scripts.check.includes('check:pack'),
    'npm run check must cover Storybook visual and package artifact verification.',
  );

  const startedAt = new Date().toISOString();
  const outputSha256 = await runNpm(['run', 'check']);
  const evidence = {
    $schema: '../WAVE0_FULL_CHECK.schema.json',
    schemaVersion: 1,
    kind: 'lds-wave0-full-check',
    capturedAt: new Date().toISOString(),
    repository: 'LK-ROBOTICS/lk-design-system',
    sourceCommit,
    sourceTag: baselineTag,
    status: 'passed',
    canonicalEnvironment: canonicalRuntime,
    commands: [
      {
        command: 'npm run check',
        status: 'passed',
        startedAt,
        outputSha256,
      },
    ],
    coverage: {
      storybookVisual: 'passed',
      accessibility: 'passed',
      consumerSmoke: 'passed',
      packageArtifact: 'passed',
    },
  };
  await mkdir(path.dirname(evidencePath), { recursive: true });
  await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(`Captured Wave 0 full-check evidence at ${evidenceRelativePath} (${sha256(JSON.stringify(evidence))}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
