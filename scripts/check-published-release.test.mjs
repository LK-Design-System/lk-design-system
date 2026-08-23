import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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
  assert.match(workflow, /version\.Contains\('-'\).*'rc'.*'latest'/s);
  assert.match(
    workflow,
    /Verify tag and package-set identity[\s\S]*node scripts\/update-release-pins\.mjs --check --require-current-canonical-snapshot[\s\S]*Verify package versions are unpublished[\s\S]*Run release gate[\s\S]*Publish package set in dependency order/,
  );
  assert.equal((workflow.match(/npm publish \.\/packages\/(?:core|theme|product) --tag \$env:RELEASE_NPM_TAG --ignore-scripts/g) ?? []).length, 3);
  assert.match(workflow, /verify-published:\s*\n\s+needs: publish/);
  assert.match(workflow, /RELEASE_NPM_TAG: \$\{\{ needs\.publish\.outputs\.npm_tag \}\}/);
  assert.match(workflow, /LDS_PUBLISHED_RELEASE_ATTEMPTS: 30/);
  assert.match(workflow, /LDS_PUBLISHED_RELEASE_RETRY_DELAY_MS: 5000/);
  assert.match(workflow, /verify-published:[\s\S]*npm run check:published-release/);
});
