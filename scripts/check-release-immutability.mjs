import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const releasePackages = ['core', 'theme', 'product', 'compat'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (!allowFailure && result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout).trim()}`);
  }
  return { status: result.status, stdout: result.stdout.trim() };
}

const rootPackage = await readJson('package.json');
const packageLock = await readJson('package-lock.json');
const changelog = await readFile(path.join(root, 'CHANGELOG.md'), 'utf8');
const version = rootPackage.version;
const releaseTag = `lds-v${version}`;

assert(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version), `Invalid release version: ${version}.`);
assert(packageLock.version === version && packageLock.packages?.['']?.version === version, 'Root lockfile version must match the workspace release version.');
assert(changelog.includes(`## ${version} -`), `CHANGELOG.md must contain a dated ${version} release section.`);

for (const packageId of releasePackages) {
  const manifest = await readJson(`packages/${packageId}/package.json`);
  const locked = packageLock.packages?.[`packages/${packageId}`];
  assert(manifest.version === version, `${manifest.name} must use workspace release version ${version}.`);
  assert(locked?.version === version, `package-lock.json must pin ${manifest.name} to ${version}.`);
}

const matchingTag = git(['tag', '--list', releaseTag]).stdout;
if (matchingTag) {
  const taggedCommit = git(['rev-list', '-n', '1', releaseTag]).stdout;
  const headCommit = git(['rev-parse', 'HEAD']).stdout;
  assert(
    taggedCommit === headCommit,
    `${releaseTag} already identifies ${taggedCommit}; HEAD ${headCommit} must bump the package-set version instead of reusing ${version}.`,
  );
}

if (process.argv.includes('--tag')) {
  const pushedTag = process.env.GITHUB_REF_NAME || matchingTag;
  assert(pushedTag === releaseTag, `Release tag ${pushedTag || '(missing)'} must equal ${releaseTag}.`);
  assert(matchingTag === releaseTag, `${releaseTag} must exist and resolve to the release source commit.`);
}

console.log(`Validated immutable release identity: ${version} -> ${releaseTag}${matchingTag ? ' -> HEAD' : ' (unpublished candidate)'}.`);
