import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';

/**
 * 위성 핀 리포트 — "스킵은 가능하되 침묵은 불가"(R4-2)의 강제 장치.
 *
 * 위성이 LDS를 몇 버전에 핀하고 있는지는 위성 저장소의 package.json에만
 * 있고, 우리 쪽에는 아무 데도 없다. 그래서 격차가 벌어져도 아무도 모른다 —
 * slides-ui가 rc.4를 핀한 채 릴리스 라인이 rc.69까지 가는 동안(65버전)
 * 어떤 기록도 남지 않았다.
 *
 * 이 스크립트는 격차를 **없애지 않는다.** 격차를 아는 채로 스킵하는 것은
 * 소유자 권한이다. 없애는 것은 격차가 보이지 않는 상태뿐이다.
 *
 * - 기본 실행: 위성 package.json을 읽어 리포트 2종(JSON·MD)을 생성한다.
 *   네트워크가 필요하므로 사람이 로컬에서 돌린다.
 * - `--check`: 네트워크 없이 리포트 파일의 **신선도**만 본다. 현재 릴리스
 *   버전이 리포트에 없으면 실패 — 즉 릴리스 때 리포트를 갱신하지 않으면
 *   CI가 막는다. 격차 값 자체는 실패 사유가 아니다.
 */

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const reportJson = 'docs/references/SATELLITE_PIN_REPORT.json';
const reportMarkdown = 'docs/references/SATELLITE_PIN_REPORT.md';

/**
 * 활성 위성. 아카이브·삭제된 저장소는 여기서 뺀다
 * (editorial은 2026-08-16 slides-ui에 흡수 후 삭제).
 */
const satellites = [
  { id: 'robotics-ui', repository: 'LK-Design-System/lk-design-system-robotics', axis: 'domain-pack' },
  { id: 'slides-ui', repository: 'LK-Design-System/lk-design-system-slides', axis: 'domain-pack' },
  { id: 'motion', repository: 'LK-Design-System/lk-design-system-motion', axis: 'capability-layer' },
  { id: '3d', repository: 'LK-Design-System/lk-design-system-3d', axis: 'capability-layer' },
];

const ldsLayerPattern = /^@lk-design-system\/lds-(core|theme|product)$/u;

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

const rootManifest = await readJson('package.json');
const releaseVersion = rootManifest.version;

if (checkOnly) {
  let report;
  try {
    report = await readJson(reportJson);
  } catch {
    console.error(
      `${reportJson}가 없다. \`npm run report:satellite-pins\`로 생성한다.\n`
      + '위성 핀 격차는 허용되지만, 기록되지 않은 격차는 허용되지 않는다 (R4-2).',
    );
    process.exit(1);
  }
  if (report.releaseVersion !== releaseVersion) {
    console.error(
      `위성 핀 리포트가 낡았다 — 리포트는 ${report.releaseVersion} 기준인데 현재 릴리스는 ${releaseVersion}이다.\n`
      + '`npm run report:satellite-pins`로 갱신한다. 격차를 좁힐 필요는 없다.\n'
      + '스킵은 가능하되 침묵은 불가라는 것이 계약이다 (R4-2).',
    );
    process.exit(1);
  }
  const behind = report.satellites.filter((entry) => entry.status === 'behind').length;
  console.log(
    `Validated satellite pin report for ${releaseVersion}: `
    + `${report.satellites.length} satellites recorded, ${behind} behind the release line (recorded, not blocking).`,
  );
  process.exit(0);
}

async function fetchManifest(repository) {
  for (const branch of ['main', 'master']) {
    const url = `https://raw.githubusercontent.com/${repository}/${branch}/package.json`;
    const response = await fetch(url);
    if (response.ok) return { manifest: await response.json(), branch };
  }
  return null;
}

/*
 * A monorepo satellite declares nothing at its root.
 *
 * Reading only the root manifest reported lds-3d as `no-lds-pin` — "LDS 미사용" —
 * while its `apps/docs` package pinned core/theme/product at rc.4, sixty-five
 * versions behind the line. That is worse than a stale record: the report
 * asserted there was nothing to record, so the drift could not be seen even by
 * someone reading carefully. A report whose blind spot looks like a clean bill
 * is the one failure mode this file exists to prevent (R4-2: 스킵은 가능하되
 * 침묵은 불가).
 *
 * So when the root declares a workspace, its members are fetched and their
 * declarations fold into the satellite's. `git/trees?recursive=1` costs one
 * request and needs no per-directory guessing; a satellite whose tree is not
 * readable falls back to the root manifest alone, which is exactly today's
 * behaviour.
 */
function declaresWorkspace(manifest) {
  return Array.isArray(manifest.workspaces)
    || typeof manifest.workspaces === 'object'
    || typeof manifest.packageManager === 'string';
}

async function fetchWorkspaceManifests(repository, branch) {
  const treeUrl = `https://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`;
  const headers = { accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN || process.env.NODE_AUTH_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN ?? process.env.NODE_AUTH_TOKEN}`;
  }
  const response = await fetch(treeUrl, { headers });
  if (!response.ok) return [];
  const { tree } = await response.json();
  // One level under a workspace root — deeper nesting is not a shape any
  // satellite uses, and walking arbitrarily deep would pull in fixtures.
  const paths = (tree ?? [])
    .filter((entry) => entry.type === 'blob' && /^[^/]+\/[^/]+\/package\.json$/.test(entry.path))
    .map((entry) => entry.path);
  const manifests = await Promise.all(paths.map(async (relative) => {
    const url = `https://raw.githubusercontent.com/${repository}/${branch}/${relative}`;
    const member = await fetch(url);
    if (!member.ok) return null;
    return { path: relative, manifest: await member.json() };
  }));
  return manifests.filter(Boolean);
}

const rows = [];
for (const satellite of satellites) {
  const fetched = await fetchManifest(satellite.repository);
  if (!fetched) {
    rows.push({ ...satellite, status: 'unreachable', pins: {}, version: null });
    console.warn(`  ${satellite.id}: package.json을 읽지 못했다 (${satellite.repository})`);
    continue;
  }
  const { manifest, branch } = fetched;
  // 한 패키지가 여러 섹션에 동시에 선언되는 것이 정상이다 — Phase 3 계약상
  // 퍼블리시 위성은 LDS 레이어를 peerDependencies로 선언하고, 같은 이름을
  // devDependencies에 vendored tgz로 둔다. 섹션별로 모으지 않고 이름으로
  // 덮어쓰면 그 peer 선언이 리포트에서 사라진다.
  const pins = {};
  const collect = (source, workspace) => {
    for (const section of ['dependencies', 'peerDependencies', 'devDependencies']) {
      for (const [name, range] of Object.entries(source[section] ?? {})) {
        if (ldsLayerPattern.test(name)) (pins[name] ??= []).push({ section, range, ...(workspace ? { workspace } : {}) });
      }
    }
  };
  collect(manifest, null);
  // A monorepo satellite declares its LDS layers in members, not at the root.
  const members = declaresWorkspace(manifest) ? await fetchWorkspaceManifests(satellite.repository, branch) : [];
  for (const member of members) collect(member.manifest, member.path.replace(/\/package\.json$/, ''));
  // 격차 판정은 **소비자에게 하는 호환성 주장**만 본다.
  //
  // - `file:` 참조는 tgz 경로일 뿐 버전 주장이 아니다.
  // - `devDependencies`는 위성이 자기 개발·테스트에 쓰는 것이지 소비자에게
  //   하는 약속이 아니다. 게다가 아직 퍼블리시되지 않은 버전은 설치할 수
  //   없으므로 devDependency는 구조적으로 항상 한 릴리스 뒤처진다 — 그걸
  //   격차로 세면 영원히 `behind`가 되어 신호가 죽는다.
  const pinned = Object.entries(pins)
    .flatMap(([, declarations]) => declarations)
    .filter(({ section }) => section !== 'devDependencies')
    .map(({ range }) => range)
    .filter((range) => !range.startsWith('file:'));
  // 정확한 버전이 아니라 **범위**로 선언하는 것이 peerDependencies의 정상
  // 형태다. 정확히 핀하면 호스트가 한 버전만 올라가도 npm이 별도 사본을
  // 중첩 설치해 디자인 시스템이 두 벌이 된다. 게다가 위성은 아직 퍼블리시되지
  // 않은 버전을 핀할 수 없으므로(레지스트리에서 설치한다), 정확한 핀은
  // 구조적으로 항상 한 릴리스 뒤처진다. 범위면 두 문제가 동시에 사라진다.
  const satisfiesRelease = (range) => {
    if (range === releaseVersion) return true;
    try {
      return semver.satisfies(releaseVersion, range, {includePrerelease: true});
    } catch {
      return false;
    }
  };
  const distinct = [...new Set(pinned)];
  const hasVendored = Object.values(pins).flat().some(({ range }) => range.startsWith('file:'));
  // `private: true`면 퍼블리시되지 않으므로 vendored `file:` 의존이 옳다 —
  // clone 소비에서 인증 없이 설치되는 이점이 있고, 퍼블리시하지 않으니 T3가
  // 발동할 수 없다. 퍼블리시하는 위성이 같은 모양이면 그때는 함정이다:
  // npm pack이 vendor의 tgz를 제외해 소비자 설치가 반드시 깨진다.
  // 그래서 같은 `file:` 의존이라도 private 여부로 판정이 갈린다.
  const isPrivate = manifest.private === true;
  const status = pinned.length === 0
    ? (hasVendored ? (isPrivate ? 'vendored-app' : 'vendored-only') : 'no-lds-pin')
    : distinct.every(satisfiesRelease)
      ? 'current'
      : 'behind';
  rows.push({ ...satellite, branch, version: manifest.version ?? null, pins, status });
  console.log(`  ${satellite.id}: ${manifest.version ?? '(버전 없음)'} — ${status}`);
}

// 계약 JSON과 달리 스키마 파일을 두지 않는다. 이 파일은 손으로 유지하는
// 계약이 아니라 스크립트가 매번 덮어쓰는 산출물이고, 스키마를 두면 손으로
// 관리할 파일이 하나 늘어난다 — 줄이려는 것이 정확히 그 비용이다.
const report = {
  kind: 'lds-satellite-pin-report',
  generatedBy: 'npm run report:satellite-pins',
  releaseVersion,
  satellites: rows,
};
await writeFile(path.join(root, reportJson), `${JSON.stringify(report, null, 2)}\n`);

const statusLabel = {
  current: '현행',
  behind: '뒤처짐',
  'vendored-only': '⚠ vendored 전용 — 퍼블리시하면 깨진다 (T3)',
  'vendored-app': 'vendored 앱 (private, 퍼블리시 안 함)',
  'no-lds-pin': 'LDS 미사용',
  unreachable: '읽기 실패',
};

const lines = [
  '# 위성 핀 리포트',
  '',
  `릴리스 라인: \`${releaseVersion}\` · 위성 ${rows.length}개`,
  '',
  '`npm run report:satellite-pins`로 생성된다. **격차 자체는 실패가 아니다** —',
  '기록되지 않은 격차만 CI가 막는다 (R4-2, 침묵 불가).',
  '',
  '| 위성 | 축 | 자기 버전 | LDS 핀 | 상태 |',
  '| --- | --- | --- | --- | --- |',
];
for (const row of rows) {
  const pins = Object.entries(row.pins)
    .flatMap(([name, declarations]) => declarations.map(({ section, range, workspace }) => {
      const label = range.startsWith('file:') ? '(vendored tgz)' : range;
      // Where the pin lives matters as much as its value: a root declaration is
      // the satellite's promise to consumers, one inside a workspace member is
      // that member's own. Without the path a monorepo row reads as if the
      // repository itself declared it.
      const site = workspace ? ` (\`${workspace}\`)` : '';
      return `\`${name.replace('@lk-design-system/', '')}\` ${label} — ${section}${site}`;
    }))
    .join('<br>') || '—';
  lines.push(`| \`${row.id}\` | ${row.axis} | ${row.version ?? '—'} | ${pins} | ${statusLabel[row.status]} |`);
}
lines.push('');
await writeFile(path.join(root, reportMarkdown), `${lines.join('\n')}\n`);

console.log(`Wrote satellite pin report for ${releaseVersion}: ${reportJson}, ${reportMarkdown}.`);
