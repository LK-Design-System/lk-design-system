import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();
const baselineDirectory = path.join(root, 'docs', 'references', 'package-split', 'baselines');
const fullCheckPath = path.join(baselineDirectory, 'WAVE0_FULL_CHECK.json');
const artifactPath = path.join(baselineDirectory, 'WAVE0_AGGREGATE_ARTIFACT.json');
const matrixPath = path.join(baselineDirectory, 'WAVE0_CONSUMER_MATRIX.json');
const schemaPath = path.join(root, 'docs', 'references', 'package-split', 'WAVE0_CONSUMER_MATRIX.schema.json');
const matrixRoot = path.join(root, 'visual-artifacts', 'wave0-consumer-matrix');
const requiredMatrixIds = [
  'React 18',
  'React 19',
  'SSR',
  'tree-shaking',
  'Windows',
  'Linux',
  'Storybook visual',
  'tarball and consumer bundle size',
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

function gitText(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', shell: false });
  assert(result.status === 0, `git ${args.join(' ')} failed:\n${result.stderr || result.error || ''}`);
  return result.stdout.trim();
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function formatSchemaErrors(errors) {
  return (errors || []).map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ');
}

function validateMatrix(matrix, schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert(validate(matrix), `Wave 0 consumer matrix schema validation failed: ${formatSchemaErrors(validate.errors)}`);
}

function validatePlatformRun(run, platform, sourceCommit, sourceTag, tarball) {
  assert(run?.kind === 'lds-wave0-consumer-platform-run', `${platform} report kind drift.`);
  assert(run.sourceCommit === sourceCommit && run.sourceTag === sourceTag, `${platform} report source tag/commit drift.`);
  assert(run.platform === platform && run.arch === 'x64', `${platform} report platform/arch drift.`);
  assert(run.node === '22.17.1' && run.npm === '10.9.2', `${platform} report runtime drift.`);
  assert(run.command === 'npm run capture:consumer:matrix' && run.status === 'passed', `${platform} report capture status drift.`);
  assert(run.tarball?.sha256 === tarball.sha256 && run.tarball?.sizeBytes === tarball.sizeBytes, `${platform} report tarball drift.`);
  assert(run.checks?.tarballInstall === 'passed' && run.checks?.ssr === 'passed' && run.checks?.treeShaking === 'passed' && run.checks?.consumerBundle === 'passed', `${platform} report checks drift.`);
  assert(platform === 'windows' ? run.checks?.browser === 'passed' : run.checks?.browser === 'not-run', `${platform} browser policy drift.`);
  const consumers = run.consumers || [];
  assert(consumers.length === 2, `${platform} report must include React 18 and React 19.`);
  const expected = new Map([['React 18', ['18.3.1', '18.3.1']], ['React 19', ['19.2.3', '19.2.3']]]);
  for (const consumer of consumers) {
    const versions = expected.get(consumer.id);
    assert(versions, `${platform} report has unknown consumer ${consumer.id}.`);
    assert(consumer.reactVersion === versions[0] && consumer.reactDomVersion === versions[1], `${platform} ${consumer.id} runtime versions drift.`);
    assert(consumer.status === 'passed' && consumer.cjs === 'passed' && consumer.ssr === 'passed' && consumer.viteBuild === 'passed', `${platform} ${consumer.id} result drift.`);
    assert(consumer.bundles?.selectedButtonBytes > 0 && consumer.bundles?.selectedButtonBytes <= 153600, `${platform} ${consumer.id} selected bundle budget drift.`);
    assert(consumer.bundles?.namespaceBytes > consumer.bundles?.selectedButtonBytes, `${platform} ${consumer.id} tree-shaking evidence drift.`);
    assert(consumer.bundles?.namespaceInputCount > consumer.bundles?.selectedInputCount, `${platform} ${consumer.id} tree-shaking input evidence drift.`);
    assert(consumer.bundles?.consumerJavaScriptBytes > 0, `${platform} ${consumer.id} consumer bundle size is missing.`);
    assert(platform === 'windows' ? consumer.browser === 'passed' : consumer.browser === 'not-run', `${platform} ${consumer.id} browser policy drift.`);
  }
}

function assertCleanSource() {
  assert(gitText(['diff', '--name-only']) === '', 'Matrix assembly requires no unstaged source changes.');
  assert(gitText(['diff', '--cached', '--name-only']) === '', 'Matrix assembly requires no staged source changes.');
  const allowedUntracked = new Set([
    'docs/references/package-split/baselines/WAVE0_AGGREGATE_ARTIFACT.json',
    'docs/references/package-split/baselines/WAVE0_FULL_CHECK.json',
  ]);
  const untracked = gitText(['ls-files', '--others', '--exclude-standard'])
    .split(/\r?\n/)
    .filter(Boolean)
    .map((value) => value.replaceAll('\\', '/'));
  const unexpected = untracked.filter((value) => !allowedUntracked.has(value));
  assert(unexpected.length === 0, `Matrix assembly found unexpected untracked files: ${unexpected.join(', ')}`);
}

async function main() {
  assert(
    process.env.npm_lifecycle_event === 'assemble:consumer:matrix',
    'Wave 0 consumer matrix assembly must run through npm run assemble:consumer:matrix.',
  );
  const baselineTag = optionValue('--baseline-tag');
  assert(baselineTag, 'assemble:consumer:matrix requires --baseline-tag=<immutable-tag>.');
  assert(gitText(['branch', '--show-current']) === 'main', 'Wave 0 matrix assembly must run on main.');
  assertCleanSource();
  assert(!existsSync(matrixPath), 'Matrix assembly must not overwrite tracked or pre-existing evidence.');
  const sourceCommit = gitText(['rev-parse', 'HEAD']);
  assert(gitText(['rev-parse', `${baselineTag}^{commit}`]) === sourceCommit, `Baseline tag ${baselineTag} does not match HEAD.`);

  const [fullBytes, artifactBytes, windows, linux, schema] = await Promise.all([
    readFile(fullCheckPath),
    readFile(artifactPath),
    readJson(path.join(matrixRoot, 'windows.json')),
    readJson(path.join(matrixRoot, 'linux.json')),
    readJson(schemaPath),
  ]);
  const full = JSON.parse(fullBytes.toString('utf8'));
  const artifact = JSON.parse(artifactBytes.toString('utf8'));
  assert(full.kind === 'lds-wave0-full-check' && full.status === 'passed', 'Full-check evidence is missing or failed.');
  assert(full.sourceCommit === sourceCommit && full.sourceTag === baselineTag, 'Full-check evidence source drift.');
  const tarball = artifact.tarballs?.[0];
  assert(artifact.kind === 'lds-wave0-aggregate-artifact' && artifact.sourceCommit === sourceCommit && artifact.sourceTag === baselineTag, 'Artifact evidence source drift.');
  assert(tarball?.package === '@lk-robotics/design-system-core' && tarball.sizeBytes > 0 && typeof tarball.sha256 === 'string', 'Artifact tarball evidence is incomplete.');
  validatePlatformRun(windows, 'windows', sourceCommit, baselineTag, tarball);
  validatePlatformRun(linux, 'linux', sourceCommit, baselineTag, tarball);

  const matrix = {
    $schema: '../WAVE0_CONSUMER_MATRIX.schema.json',
    schemaVersion: 1,
    kind: 'lds-wave0-consumer-matrix',
    capturedAt: new Date().toISOString(),
    repository: 'LK-ROBOTICS/lk-design-system',
    sourceCommit,
    sourceTag: baselineTag,
    status: 'passed',
    inputs: {
      fullCheck: {
        path: 'docs/references/package-split/baselines/WAVE0_FULL_CHECK.json',
        sha256: sha256(fullBytes),
      },
      packageArtifact: {
        path: 'docs/references/package-split/baselines/WAVE0_AGGREGATE_ARTIFACT.json',
        sha256: sha256(artifactBytes),
        package: tarball.package,
        version: tarball.version,
        sizeBytes: tarball.sizeBytes,
        tarballSha256: tarball.sha256,
      },
    },
    thresholds: {
      maxTarballBytes: 8388608,
      maxSelectedButtonBytes: 153600,
    },
    platformRuns: [windows, linux],
    results: requiredMatrixIds.map((id) => ({
      id,
      status: 'passed',
      evidence: id === 'Storybook visual'
        ? 'canonical Windows npm run check'
        : id === 'tarball and consumer bundle size'
          ? 'canonical tarball plus isolated Vite consumer bundle measurements'
          : 'isolated React tarball consumer platform runs',
    })),
  };
  validateMatrix(matrix, schema);
  await mkdir(path.dirname(matrixPath), { recursive: true });
  await writeFile(matrixPath, `${JSON.stringify(matrix, null, 2)}\n`, 'utf8');
  console.log(`Assembled Wave 0 consumer matrix evidence at ${path.relative(root, matrixPath).replaceAll('\\', '/')}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
