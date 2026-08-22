import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const releasePackages = ['core', 'theme', 'product'];

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
const enforceTagIdentity = process.argv.includes('--tag');

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

// 태그 동일성(태그 == HEAD)은 `--tag`로만 검사한다. 태그를 찍은 뒤의 모든
// 커밋이 구조적으로 이 조건을 깨므로, 상시 스위트(check:fast)에 두면 main이
// 릴리스 사이 내내 빨간불이 된다. 그러면 "이 빨간불은 정상"이라는 걸러 읽기가
// 습관이 되고, 진짜 고장이 그 틈에 숨는다 — 실제로 14연속 빨간불 기간에
// 실고장 1건이 묻혀 있었다.
//
// 보호력은 그대로다. 이 조건이 실제로 막는 것은 "같은 버전 재출시"이고 그
// 순간은 퍼블리시뿐인데, 퍼블리시는 릴리스 워크플로를 통해서만 일어나며
// 그 워크플로가 이 스크립트를 `--tag`로 전용 실행한다
// (`.github/workflows/release-packages.yml`).
//
// 위쪽 버전 일관성 검사(lockfile·CHANGELOG·패키지 버전)는 상시 유효하고
// 언제나 만족 가능하므로 check:fast에 그대로 남는다.
if (enforceTagIdentity) {
  const pushedTag = process.env.GITHUB_REF_NAME || matchingTag;
  assert(pushedTag === releaseTag, `Release tag ${pushedTag || '(missing)'} must equal ${releaseTag}.`);
  assert(matchingTag === releaseTag, `${releaseTag} must exist and resolve to the release source commit.`);

  const taggedCommit = git(['rev-list', '-n', '1', releaseTag]).stdout;
  const headCommit = git(['rev-parse', 'HEAD']).stdout;
  assert(
    taggedCommit === headCommit,
    `${releaseTag} already identifies ${taggedCommit}; HEAD ${headCommit} must bump the package-set version instead of reusing ${version}.`,
  );
}

const identityStatus = enforceTagIdentity
  ? ' -> HEAD'
  : matchingTag
    ? ' (tag exists; pass --tag to verify its HEAD identity)'
    : ' (unpublished candidate)';

console.log(`Validated immutable release identity: ${version} -> ${releaseTag}${identityStatus}.`);
