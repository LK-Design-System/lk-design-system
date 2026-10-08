import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { dispatchPackageRelease, selectReleaseRunner } from './dispatch-package-release.mjs';
import { expectedDistTagForVersion, verifyPublishedRelease } from './check-published-release.mjs';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptRoot);
const packageNames = {
  core: '@lk-design-system/lds-core',
  theme: '@lk-design-system/lds-theme',
  product: '@lk-design-system/lds-product',
};
const silentLogger = { log() {}, warn() {} };

async function createWorkspace(version) {
  const root = await mkdtemp(path.join(tmpdir(), 'lds-published-release-'));
  await writeFile(path.join(root, 'package.json'), `${JSON.stringify({ version }, null, 2)}\n`);
  for (const [id, name] of Object.entries(packageNames)) {
    await mkdir(path.join(root, 'packages', id), { recursive: true });
    await writeFile(path.join(root, 'packages', id, 'package.json'), `${JSON.stringify({ name, version }, null, 2)}\n`);
  }
  return root;
}

function successfulView(version, tag, onCall = () => {}) {
  return async ({ spec, fields }) => {
    onCall({ spec, fields });
    if (fields[0] === 'dist-tags') return { [tag]: version };
    const name = Object.values(packageNames).find((candidate) => spec === `${candidate}@${version}`);
    return { name, version, 'dist.integrity': 'sha512-test-integrity' };
  };
}

test('stable and prerelease versions select latest and rc respectively', () => {
  assert.equal(expectedDistTagForVersion('1.2.3'), 'latest');
  assert.equal(expectedDistTagForVersion('1.2.3-rc.4'), 'rc');
});

test('published package verification checks every exact identity and stable dist-tag', async () => {
  const root = await createWorkspace('1.2.3');
  const calls = [];
  try {
    const result = await verifyPublishedRelease({
      root,
      attempts: 1,
      retryDelayMs: 1,
      view: successfulView('1.2.3', 'latest', (call) => calls.push(call)),
      logger: silentLogger,
    });
    assert.equal(result.releaseTag, 'latest');
    assert.equal(result.packages.length, 3);
    assert.equal(calls.length, 6);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('published package verification retries an eventually consistent rc dist-tag', async () => {
  const root = await createWorkspace('1.2.3-rc.4');
  let coreTagReads = 0;
  let sleeps = 0;
  const view = successfulView('1.2.3-rc.4', 'rc', ({ spec, fields }) => {
    if (spec === packageNames.core && fields[0] === 'dist-tags') coreTagReads += 1;
  });
  try {
    await verifyPublishedRelease({
      root,
      releaseTag: 'rc',
      attempts: 2,
      retryDelayMs: 1,
      view: async (request) => {
        const result = await view(request);
        if (request.spec === packageNames.core && request.fields[0] === 'dist-tags' && coreTagReads === 1) {
          return { rc: '1.2.3-rc.3' };
        }
        return result;
      },
      sleep: async () => { sleeps += 1; },
      logger: silentLogger,
    });
    assert.equal(coreTagReads, 2);
    assert.equal(sleeps, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('published package verification rejects a release-channel mismatch before registry access', async () => {
  const root = await createWorkspace('1.2.3-rc.4');
  let registryReads = 0;
  try {
    await assert.rejects(
      verifyPublishedRelease({
        root,
        releaseTag: 'latest',
        attempts: 1,
        retryDelayMs: 1,
        view: async () => { registryReads += 1; },
        logger: silentLogger,
      }),
      /must use npm dist-tag rc/,
    );
    assert.equal(registryReads, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('release workflow publishes all packages and isolates retryable registry verification', async () => {
  const workflow = await readFile(path.join(repositoryRoot, '.github', 'workflows', 'release-packages.yml'), 'utf8');
  assert.match(workflow, /release_npm_tag=latest[\s\S]*"\$version" == \*-\*[\s\S]*release_npm_tag=rc/);
  assert.equal((workflow.match(/runs-on: \[self-hosted, linux, x64, lk-lds-release-linux-x64\]/g) ?? []).length, 2);
  assert.doesNotMatch(workflow, /windows-latest|shell: pwsh/);
  assert.match(workflow, /github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /git merge-base --is-ancestor HEAD origin\/main/);
  assert.match(workflow, /GITHUB_REF_NAME="\$RELEASE_TAG" npm run check:release-immutability -- --tag/);
  assert.match(
    workflow,
    /Verify tag and package-set identity[\s\S]*node scripts\/update-release-pins\.mjs --check --require-current-canonical-snapshot[\s\S]*Verify package versions are unpublished[\s\S]*Run release gate[\s\S]*Publish package set in dependency order/,
  );
  assert.deepEqual([...workflow.matchAll(/npm publish \.\/packages\/(core|theme|product) --tag "\$RELEASE_NPM_TAG" --ignore-scripts/g)].map((match) => match[1]), ['core', 'theme', 'product']);
  assert.match(workflow, /Publish package set in dependency order[\s\S]*NODE_AUTH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(workflow, /verify-published:[\s\S]*needs: publish/);
  assert.match(workflow, /RELEASE_NPM_TAG: \$\{\{ needs\.publish\.outputs\.npm_tag \}\}/);
  assert.match(workflow, /LDS_PUBLISHED_RELEASE_ATTEMPTS: 30/);
  assert.match(workflow, /LDS_PUBLISHED_RELEASE_RETRY_DELAY_MS: 5000/);
  assert.match(workflow, /verify-published:[\s\S]*npm run check:published-release/);
});

const qualifiedRunner = {
  name: 'lk-lds-release-server04-test', status: 'online', busy: false,
  labels: ['self-hosted', 'Linux', 'X64', 'lk-lds-release-linux-x64'].map(name => ({ name })),
};

test('release preflight refuses missing, offline, busy, ambiguous and foreign-host runners', () => {
  for (const runners of [[], [qualifiedRunner, qualifiedRunner],
    [{ ...qualifiedRunner, status: 'offline' }], [{ ...qualifiedRunner, busy: true }],
    [{ ...qualifiedRunner, name: 'lk-lds-release-laptop' }],
    [{ ...qualifiedRunner, labels: qualifiedRunner.labels.filter(item => item.name !== 'Linux') }]]) {
    assert.throws(() => selectReleaseRunner(runners), /release_environment_unavailable/);
  }
  assert.equal(selectReleaseRunner([qualifiedRunner]).name, qualifiedRunner.name);
});

function releaseApi(runners, comparison = 'ahead') {
  const calls = [];
  return { calls, run(args) {
    calls.push(args);
    if (args[0] === 'workflow') return '';
    if (args[1].includes('/commits/')) return JSON.stringify({ sha: 'a'.repeat(40) });
    if (args[1].includes('/compare/')) return JSON.stringify({ status: comparison });
    return JSON.stringify([{ runners }]);
  } };
}

test('readonly preflight never dispatches; publish uses canonical main and exact tag', () => {
  const readonly = releaseApi([qualifiedRunner]);
  assert.equal(dispatchPackageRelease(['--preflight', 'lds-v1.2.3'], readonly).mode, 'preflight');
  assert.equal(readonly.calls.some(args => args[0] === 'workflow'), false);
  const publish = releaseApi([qualifiedRunner]);
  dispatchPackageRelease(['lds-v1.2.3'], publish);
  assert.deepEqual(publish.calls.at(-1), ['workflow', 'run', 'release-packages.yml', '--repo',
    'LK-Design-System/lk-design-system', '--ref', 'main', '-f', 'release_tag=lds-v1.2.3']);
});

test('unavailable runner or divergent source cannot enqueue a release', () => {
  for (const api of [releaseApi([]), releaseApi([qualifiedRunner], 'diverged')]) {
    assert.throws(() => dispatchPackageRelease(['lds-v1.2.3'], api), /unavailable/);
    assert.equal(api.calls.some(args => args[0] === 'workflow'), false);
  }
  const api = releaseApi([qualifiedRunner]);
  assert.throws(() => dispatchPackageRelease(['main'], api), /usage/);
  assert.equal(api.calls.length, 0);
});

test('both release jobs reject a foreign runner before checkout', async () => {
  const workflow = await readFile(path.join(repositoryRoot, '.github/workflows/release-packages.yml'), 'utf8');
  assert.equal((workflow.match(/Verify server04 release runner identity/g) ?? []).length, 2);
  for (const job of workflow.split('    steps:').slice(1)) {
    assert.ok(job.indexOf('lk-lds-release-server04-*') < job.indexOf('Checkout tagged source'));
  }
});
