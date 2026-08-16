import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

/**
 * 릴리스 파생값 재계산 — 쓰기(기본)와 검산(`--check`)이 같은 코드 경로다.
 *
 * 릴리스 때 손으로 고쳐야 했던 기록 32곳 중 31곳은 입력 두 개(LDS 버전,
 * robotics 버전)에서 계산할 수 있다. 남는 1곳은 CHANGELOG 산문이고, 그건
 * 사람이 쓴다.
 *
 * `--check`는 같은 계산을 하고 파일에 쓰는 대신 비교만 한다. 쓰기 로직이
 * 틀리면 검산도 같이 틀리지 않냐는 지적이 가능한데, 방향이 반대라서 그렇지
 * 않다 — 검산은 "파일에 있는 값"과 "지금 계산한 값"을 대조하므로, 쓰기가
 * 한 번 잘못 나간 뒤 입력이 바뀌면 즉시 어긋난다. 손 동기화 실수가 조용한
 * 드리프트가 아니라 CI 실패가 되는 것이 목적이다.
 *
 * **자동화하지 않는 것**: 위성이 자기 package.json에 박아둔 LDS 핀
 * (`CROSS_REPOSITORY_STYLE_CONTRACT.json`의 `profiles.*.packageDependencies`).
 * 그것은 우리가 정하는 값이 아니라 위성 저장소를 관측한 사실이므로, 여기서
 * 덮어쓰면 계약이 실제와 달라진다. 그 축은 `check:satellite-pins`가 본다.
 */

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const workspacePackages = ['core', 'theme', 'product'];
const roboticsName = '@lk-design-system/lds-robotics-ui';

const diffs = [];
const writes = new Map();
let writesNeedSecondPass = false;
let installedRoboticsVersion = null;

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function record(file, field, actual, expected) {
  if (actual !== expected) diffs.push({ file, field, actual, expected });
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function sha256(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

async function sha256Absolute(absolutePath) {
  return createHash('sha256').update(await readFile(absolutePath)).digest('hex');
}

/** JSON은 파싱 후 다시 직렬화하지 않고, 값만 제자리 치환해 서식을 보존한다. */
function queueJsonWrite(relativePath, mutate) {
  writes.set(relativePath, mutate);
}

const rootManifest = await readJson('package.json');
const ldsVersion = argValue('--lds') ?? rootManifest.version;

const vendorFiles = await readdir(path.join(root, 'vendor'));
const roboticsTarballs = vendorFiles.filter(
  (file) => file.startsWith('lk-design-system-lds-robotics-ui-') && file.endsWith('.tgz'),
);
if (roboticsTarballs.length !== 1) {
  throw new Error(
    `vendor/ must hold exactly one Robotics tarball; found ${roboticsTarballs.length}. `
    + '릴리스 순서상 새 tgz를 넣고 옛 tgz를 지운 뒤에 이 스크립트를 돌린다.',
  );
}
const roboticsTarball = roboticsTarballs[0];
const roboticsVersion = argValue('--robotics')
  ?? roboticsTarball.slice('lk-design-system-lds-robotics-ui-'.length, -'.tgz'.length);
const vendoredPath = `vendor/lk-design-system-lds-robotics-ui-${roboticsVersion}.tgz`;

if (roboticsTarball !== path.posix.basename(vendoredPath)) {
  throw new Error(`vendor/${roboticsTarball} does not match the requested Robotics version ${roboticsVersion}.`);
}

// ── 1. 루트 package.json — 버전과 vendored 참조
record('package.json', 'version', rootManifest.version, ldsVersion);
record('package.json', `devDependencies["${roboticsName}"]`, rootManifest.devDependencies?.[roboticsName], `file:${vendoredPath}`);
queueJsonWrite('package.json', (manifest) => {
  manifest.version = ldsVersion;
  if (manifest.devDependencies?.[roboticsName]) manifest.devDependencies[roboticsName] = `file:${vendoredPath}`;
});

// ── 2. 워크스페이스 패키지 — 자기 버전과 상호 참조 핀
const workspaceNames = new Set();
for (const id of workspacePackages) {
  const manifest = await readJson(`packages/${id}/package.json`);
  workspaceNames.add(manifest.name);
}
for (const id of workspacePackages) {
  const file = `packages/${id}/package.json`;
  const manifest = await readJson(file);
  record(file, 'version', manifest.version, ldsVersion);
  for (const section of ['dependencies', 'peerDependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(manifest[section] ?? {})) {
      if (workspaceNames.has(name)) record(file, `${section}["${name}"]`, range, ldsVersion);
    }
  }
  queueJsonWrite(file, (draft) => {
    draft.version = ldsVersion;
    for (const section of ['dependencies', 'peerDependencies', 'devDependencies']) {
      for (const name of Object.keys(draft[section] ?? {})) {
        if (workspaceNames.has(name)) draft[section][name] = ldsVersion;
      }
    }
  });
}

// ── 3. 저장소 간 스타일 계약 — LDS 3 + robotics 1
{
  const file = 'docs/references/package-split/CROSS_REPOSITORY_STYLE_CONTRACT.json';
  const contract = await readJson(file);
  for (const entry of contract.lds?.packages ?? []) {
    record(file, `lds.packages["${entry.name}"].version`, entry.version, ldsVersion);
  }
  const roboticsProfile = contract.profiles?.['robotics-ui']?.package;
  if (roboticsProfile) {
    record(file, 'profiles["robotics-ui"].package.version', roboticsProfile.version, roboticsVersion);
  }
  queueJsonWrite(file, (draft) => {
    for (const entry of draft.lds?.packages ?? []) entry.version = ldsVersion;
    if (draft.profiles?.['robotics-ui']?.package) {
      draft.profiles['robotics-ui'].package.version = roboticsVersion;
    }
    // profiles.*.packageDependencies 는 위성 관측값이므로 건드리지 않는다.
  });
}

// ── 4. Robotics 외부 표면 — 버전·경로와 해시 파생값 전부
{
  const file = 'docs/references/package-split/ROBOTICS_EXTERNAL_SURFACE.json';
  const surface = await readJson(file);
  const packageRoot = path.join(root, 'node_modules', ...roboticsName.split('/'));

  // 문서 해시는 **설치된** robotics에서 계산한다. vendor에 새 tgz를 넣고
  // `npm install` 없이 해시를 쓰면 옛 버전의 해시가 새 버전 기록에 들어가고,
  // 검사도 같은 옛 파일을 읽으므로 조용히 통과해버린다.
  //
  // 그런데 설치를 먼저 할 수도 없다 — `npm install`은 루트 package.json의
  // devDependency가 새 tgz 경로를 가리켜야 하고, 그 경로를 쓰는 것이 바로 이
  // 스크립트다. 순환이다.
  //
  // 그래서 두 번 돌린다. 1차는 경로·버전만 쓰고 해시는 건드리지 않은 채
  // 멈춘다. `npm install` 후 2차에서 해시까지 완성한다. 어느 쪽이든 마지막에
  // `check:release-pins`가 전부 대조하므로, 2차를 잊으면 CI가 막는다.
  // 아직 설치조차 안 된 경우도 1차 실행이다 (node_modules를 지우고 시작하는 것이
  // 흔한 릴리스 절차다).
  const installed = await readFile(path.join(packageRoot, 'package.json'), 'utf8')
    .then(JSON.parse)
    .catch(() => ({version: '(설치 안 됨)'}));
  const installedMatches = installed.version === roboticsVersion;
  if (!installedMatches && checkOnly) {
    diffs.push({
      file: '(설치본)',
      field: `${roboticsName} 설치 버전`,
      actual: installed.version,
      expected: roboticsVersion,
    });
  }

  const artifactHash = await sha256(vendoredPath);
  const canonicalPath = surface.documentation?.canonicalContract?.source?.path;
  const canonicalHash = canonicalPath ? await sha256(canonicalPath) : undefined;
  const snapshotHash = await sha256('packages/core/docs/manifest.json');

  record(file, 'package.version', surface.package?.version, roboticsVersion);
  record(file, 'vendoredArtifact.path', surface.vendoredArtifact?.path, vendoredPath);
  record(file, 'vendoredArtifact.sha256', surface.vendoredArtifact?.sha256, artifactHash);
  record(file, 'canonicalContract.source.ref', surface.documentation?.canonicalContract?.source?.ref, `lds-v${ldsVersion}`);
  record(file, 'canonicalContract.source.sha256', surface.documentation?.canonicalContract?.source?.sha256, canonicalHash);
  record(file, 'canonicalContract.snapshotManifestSha256', surface.documentation?.canonicalContract?.snapshotManifestSha256, snapshotHash);

  // 설치된 robotics 패키지 안의 문서 해시. node_modules가 현재 tgz로 설치돼
  // 있어야 의미가 있으므로, 없으면 계산을 건너뛰지 않고 실패시킨다.
  const installedHashes = new Map();
  const hashInstalled = async (relative) => {
    if (!installedHashes.has(relative)) {
      installedHashes.set(relative, await sha256Absolute(path.join(packageRoot, ...relative.split('/'))));
    }
    return installedHashes.get(relative);
  };

  if (installedMatches) {
    for (const [key, entry] of Object.entries(surface.documentation?.files ?? {})) {
      record(file, `documentation.files.${key}.sha256`, entry.sha256, await hashInstalled(entry.path));
    }
    for (const entry of surface.documentation?.domainDocuments ?? []) {
      record(file, `domainDocuments["${entry.path}"].sha256`, entry.sha256, await hashInstalled(entry.path));
    }
  }

  queueJsonWrite(file, async (draft) => {
    draft.package.version = roboticsVersion;
    draft.vendoredArtifact.path = vendoredPath;
    draft.vendoredArtifact.sha256 = artifactHash;
    const canonical = draft.documentation.canonicalContract;
    canonical.source.ref = `lds-v${ldsVersion}`;
    if (canonicalHash) canonical.source.sha256 = canonicalHash;
    canonical.snapshotManifestSha256 = snapshotHash;
    if (!installedMatches) return;   // 해시는 2차 실행에서 쓴다
    for (const entry of Object.values(draft.documentation.files ?? {})) {
      entry.sha256 = await hashInstalled(entry.path);
    }
    for (const entry of draft.documentation.domainDocuments ?? []) {
      entry.sha256 = await hashInstalled(entry.path);
    }
  });
  writesNeedSecondPass = !installedMatches;
  installedRoboticsVersion = installed.version;
}

// ── 5. vendor/README.md — 파일명·패키지 버전·SHA-256
{
  const file = 'vendor/README.md';
  const current = await readFile(path.join(root, file), 'utf8');
  const artifactHash = await sha256(vendoredPath);
  const basename = path.posix.basename(vendoredPath);

  const next = current
    .replaceAll(/lk-design-system-lds-robotics-ui-[0-9A-Za-z.\-]+\.tgz/gu, basename)
    .replaceAll(new RegExp(`${roboticsName.replace('/', '\\/')}@[0-9A-Za-z.\\-]+`, 'gu'), `${roboticsName}@${roboticsVersion}`)
    .replaceAll(/SHA-256: `[0-9a-f]{64}`/gu, `SHA-256: \`${artifactHash}\``);

  if (next !== current) diffs.push({ file, field: '(텍스트 참조)', actual: '드리프트', expected: '재계산본' });
  writes.set(file, () => next);
}

if (checkOnly) {
  if (diffs.length > 0) {
    console.error(`릴리스 파생값 드리프트 ${diffs.length}건 — \`npm run update:release-pins\`로 재계산한다.\n`);
    for (const { file, field, actual, expected } of diffs) {
      console.error(`  ${file}  ${field}`);
      console.error(`    현재: ${actual}`);
      console.error(`    기대: ${expected}`);
    }
    process.exit(1);
  }
  console.log(
    `Validated release pins: LDS ${ldsVersion}, Robotics ${roboticsVersion}; `
    + '31 derived records match their inputs.',
  );
} else {
  for (const [file, mutate] of writes) {
    const absolute = path.join(root, file);
    if (file.endsWith('.json')) {
      const draft = JSON.parse(await readFile(absolute, 'utf8'));
      await mutate(draft);
      await writeFile(absolute, `${JSON.stringify(draft, null, 2)}\n`);
    } else {
      await writeFile(absolute, await mutate());
    }
  }
  console.log(
    `Recalculated release pins: LDS ${ldsVersion}, Robotics ${roboticsVersion}; `
    + `${diffs.length} record(s) updated across ${writes.size} files.`,
  );
  if (writesNeedSecondPass) {
    console.log(
      `\n⚠ 1차만 끝났다 — 설치된 robotics는 아직 ${installedRoboticsVersion}다.\n`
      + '  경로와 버전은 썼고 **문서 해시는 쓰지 않았다.** 이어서:\n'
      + '    npm install\n'
      + `    npm run update:release-pins -- --lds ${ldsVersion} --robotics ${roboticsVersion}\n`
      + '  2차를 잊어도 check:release-pins가 CI에서 막는다.',
    );
  } else if (diffs.length > 0) {
    console.log('CHANGELOG.md는 사람이 쓴다 — 이 스크립트가 다루지 않는 유일한 릴리스 기록이다.');
  }
}
