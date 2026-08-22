import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(new URL('./check-release-immutability.mjs', import.meta.url));
const version = '1.2.3-rc.4';

function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

async function createTaggedWorkspace() {
  const root = await mkdtemp(path.join(tmpdir(), 'lds-release-identity-'));
  const lock = { version, packages: { '': { version } } };
  await writeFile(path.join(root, 'package.json'), `${JSON.stringify({ version }, null, 2)}\n`);
  for (const id of ['core', 'theme', 'product']) {
    const name = `@lk-design-system/lds-${id}`;
    await mkdir(path.join(root, 'packages', id), { recursive: true });
    await writeFile(path.join(root, 'packages', id, 'package.json'), `${JSON.stringify({ name, version }, null, 2)}\n`);
    lock.packages[`packages/${id}`] = { version };
  }
  await writeFile(path.join(root, 'package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);
  await writeFile(path.join(root, 'CHANGELOG.md'), `# Changelog\n\n## ${version} - 2026-08-22\n`);

  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'LDS Release Test']);
  git(root, ['config', 'user.email', 'release-test@example.invalid']);
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'release candidate']);
  git(root, ['tag', `lds-v${version}`]);
  await writeFile(path.join(root, 'AFTER_TAG.md'), 'later main work\n');
  git(root, ['add', 'AFTER_TAG.md']);
  git(root, ['commit', '-m', 'later work']);
  return root;
}

function runCheck(root, args = []) {
  const env = { ...process.env };
  delete env.GITHUB_REF_NAME;
  return spawnSync(process.execPath, [scriptPath, ...args], { cwd: root, encoding: 'utf8', env });
}

test('non-tag mode never claims an existing release tag resolves to HEAD', async () => {
  const root = await createTaggedWorkspace();
  try {
    const candidateCheck = runCheck(root);
    assert.equal(candidateCheck.status, 0, candidateCheck.stderr || candidateCheck.stdout);
    assert.match(candidateCheck.stdout, /tag exists; pass --tag to verify its HEAD identity/);
    assert.doesNotMatch(candidateCheck.stdout, /-> HEAD/);

    const releaseCheck = runCheck(root, ['--tag']);
    assert.notEqual(releaseCheck.status, 0);
    assert.match(releaseCheck.stderr, /must bump the package-set version instead of reusing/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
