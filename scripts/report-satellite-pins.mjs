import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
  for (const section of ['dependencies', 'peerDependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(manifest[section] ?? {})) {
      if (ldsLayerPattern.test(name)) (pins[name] ??= []).push({ section, range });
    }
  }
  // 격차 판정은 버전을 실제로 주장하는 선언만 본다. `file:` 참조는 tgz
  // 경로일 뿐 버전 주장이 아니므로 제외한다.
  const pinned = Object.values(pins)
    .flat()
    .map(({ range }) => range)
    .filter((range) => !range.startsWith('file:'));
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
    : distinct.every((range) => range === releaseVersion)
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
    .flatMap(([name, declarations]) => declarations.map(({ section, range }) => {
      const label = range.startsWith('file:') ? '(vendored tgz)' : range;
      return `\`${name.replace('@lk-design-system/', '')}\` ${label} — ${section}`;
    }))
    .join('<br>') || '—';
  lines.push(`| \`${row.id}\` | ${row.axis} | ${row.version ?? '—'} | ${pins} | ${statusLabel[row.status]} |`);
}
lines.push('');
await writeFile(path.join(root, reportMarkdown), `${lines.join('\n')}\n`);

console.log(`Wrote satellite pin report for ${releaseVersion}: ${reportJson}, ${reportMarkdown}.`);
