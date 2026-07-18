import React from 'react';
import { NAV_DIRECTION_CHEVRON, NAV_PROGRESS_TRIANGLE, NAV_ROBOT_POSE } from '../components/robotics/_navigationVectorGlyph.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Documents the three navigation vector-glyph atoms — one shape per meaning,
// side by side so the contract is self-enforcing: the line-cut direction
// chevron (static Lane travel direction — the line folds into an open V), the
// solid progress dart (dynamic Route/Trajectory current position), and the
// robot pose (round body + heading nose — the circle is what keeps a robot
// from ever reading as a path arrow). The dart's attachment contract
// (NAV_PROGRESS_HEAD) stays owned by Navigation Encoding Tokens; this page owns
// the raw geometry of all three.
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';
const PATHINK = 'var(--color-semantic-label-alternative)';

const RETIRED_OPEN_CHEVRON_PATH = 'M -14 -6.5 L 0 0 L -14 6.5';

function Card({ title, hint, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        padding: 16,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <header style={{ display: 'grid', gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--label1-size)', color: INK }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 'var(--caption1-size)', color: MUTED, lineHeight: 1.6 }}>{hint}</p>
      </header>
      {children}
    </section>
  );
}

function Frame({ children, caption, mono }) {
  return (
    <figure
      style={{
        margin: 0,
        minWidth: 0,
        display: 'grid',
        gap: 8,
        padding: 14,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-sm)',
        background: SURFACE,
      }}
    >
      {children}
      <figcaption style={{ display: 'grid', gap: 3, textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: INK }}>{caption}</span>
        <code style={{ fontSize: 11, color: MUTED, maxWidth: '100%', overflowWrap: 'anywhere' }}>{mono}</code>
      </figcaption>
    </figure>
  );
}

// LaneOverlay cuts the line on the midpoint of the longest straight run and
// folds it into an open V — the demo path's diagonal: midpoint (158, 81),
// tangent -31.19°. The specimen mirrors the component exactly: full line +
// surface cut window + chevron in the line's own tone and width.
function DirectionChevronOnPath() {
  return (
    <svg width="100%" viewBox="0 0 316 140" role="img" aria-label="레인 최장 직선 구간 중점의 선 절개 이동 방향 셰브론" style={{ display: 'block' }}>
      <defs>
        <mask id="vector-glyph-direction-cut" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="316" height="140" fill="white" />
          <g transform="translate(158 81) rotate(-31.19)">
            <rect
              data-direction-chevron-window=""
              x={NAV_DIRECTION_CHEVRON.window.from}
              y={-NAV_DIRECTION_CHEVRON.window.clearWidth / 2}
              width={NAV_DIRECTION_CHEVRON.window.to - NAV_DIRECTION_CHEVRON.window.from}
              height={NAV_DIRECTION_CHEVRON.window.clearWidth}
              fill="black"
            />
          </g>
        </mask>
      </defs>
      <path
        data-direction-chevron-demo-line=""
        d="M36 104 H120 L196 58 H280"
        fill="none"
        stroke={PATHINK}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        mask="url(#vector-glyph-direction-cut)"
      />
      <circle cx="36" cy="104" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <circle cx="280" cy="58" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <g
        data-direction-chevron-specimen=""
        data-navigation-direction-chevron="lane-direction"
        data-anchor-rule="longest-segment-midpoint"
        transform="translate(158 81) rotate(-31.19)"
      >
        <path
          data-direction-chevron-geometry=""
          d={NAV_DIRECTION_CHEVRON.path}
          fill="none"
          stroke={PATHINK}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// The progress triangle atom alone: a solid tip-anchored arrowhead. Its
// line-attachment contract (marker-end, elapsed shaft, future gap) is owned by
// Navigation Encoding Tokens as NAV_PROGRESS_HEAD.
function ProgressTriangleSpecimen() {
  return (
    <svg width="100%" viewBox="0 0 316 96" role="img" aria-label="진행 표식용 채움 삼각형 기하" style={{ display: 'block' }}>
      <path d="M56 48 H180" fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
      <g
        data-progress-triangle-specimen=""
        transform="translate(188 48)"
      >
        <path
          data-progress-triangle-geometry=""
          d={NAV_PROGRESS_TRIANGLE.path}
          fill={ACCENT}
          stroke={SURFACE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
      <path d="M214 48 H268" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// The robot pose atom: a round footprint body + heading nose. The CIRCLE is the
// differentiator — neither the chevron nor the dart carries a body, so a robot
// never reads as a path arrow. Rendered here from the same NAV_ROBOT_POSE the
// robot-marker renderer uses (surface casing halo under the marker-tone fill).
function RobotPoseSpecimen() {
  const nose = NAV_ROBOT_POSE.nosePath;
  const r = NAV_ROBOT_POSE.bodyRadius;
  return (
    <svg width="100%" viewBox="0 0 316 96" role="img" aria-label="로봇 pose용 원형 body와 heading 노즈 기하" style={{ display: 'block' }}>
      <g data-robot-pose-specimen="" transform="translate(158 48) scale(2.4) rotate(-25)">
        {/* casing halo */}
        <path d={nose} fill={SURFACE} stroke={SURFACE} strokeWidth={NAV_ROBOT_POSE.casingWidth * 2} strokeLinejoin="round" />
        <circle r={r} fill={SURFACE} stroke={SURFACE} strokeWidth={NAV_ROBOT_POSE.casingWidth * 2} />
        {/* body tone */}
        <path data-robot-pose-nose="" d={nose} fill={ACCENT} strokeLinejoin="round" />
        <circle data-robot-pose-body="" r={r} fill={ACCENT} />
      </g>
    </svg>
  );
}

function VectorGlyphCatalog() {
  return (
    <main data-vector-glyph-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="선 절개 이동 방향 셰브론 — 레인 위"
        hint="LaneOverlay가 최장 직선 구간의 중점에 한 번 배치하는 정적 방향 표식입니다. 선을 짧게 끊고 그 자리에서 선 자체가 같은 색·같은 두께의 열린 V로 꺾이므로, 별도 배지나 부풀림 없이 선 그 자체가 화살표로 읽힙니다. 기하는 NAV_DIRECTION_CHEVRON이 단일 소스로 소유합니다."
      >
        <Frame caption="레인 경로에 한 번 나타나는 이동 방향" mono="NAV_DIRECTION_CHEVRON">
          <DirectionChevronOnPath />
        </Frame>
        <p style={{ margin: 0, color: MUTED, fontSize: 11, lineHeight: 1.6 }}>
          사용 기준: 전체 레인의 진입→이탈 방향을 한 번 표시할 때 사용합니다. 현재 진행 위치나 로봇 자세에는 사용하지 않으며, 그 역할은 진행 삼각형과 별도 로봇 레이어가 맡습니다.
        </p>
      </Card>
      <Card
        title="진행 삼각형 — 선의 끝점"
        hint="Route·Trajectory의 현재 진행이 선 끝에 결합하는 채움 화살촉입니다. 끝점이 로컬 원점이라 marker-end로 붙으면 tip이 곧 현재 위치가 되고, 표식 앞의 미래 선은 간격을 두고 다시 시작합니다. 결합 계약(NAV_PROGRESS_HEAD)은 Navigation Encoding Tokens가 소유합니다."
      >
        <Frame caption="선에 결합된 현재 진행 화살촉" mono="NAV_PROGRESS_TRIANGLE.path">
          <ProgressTriangleSpecimen />
        </Frame>
        <p style={{ margin: 0, color: MUTED, fontSize: 11, lineHeight: 1.6 }}>
          사용 기준: source가 명시한 현재 진행 지점에만 사용합니다. 방향 셰브론과 모양이 달라 정적 방향과 동적 진행이 지도에서 혼동되지 않습니다.
        </p>
      </Card>
      <Card
        title="로봇 pose — 원형 body + heading 노즈"
        hint="로봇의 실시간 위치와 방향입니다. 둥근 footprint body에 heading 방향으로 노즈가 돋아나며, 원형 body가 있다는 점이 방향 셰브론·진행 다트와의 결정적 차이라 로봇이 경로 화살표로 읽히지 않습니다. 기하는 NAV_ROBOT_POSE가 소유하고 로봇 마커 렌더러가 그립니다."
      >
        <Frame caption="지도 위 로봇의 현재 위치와 방향" mono="NAV_ROBOT_POSE">
          <RobotPoseSpecimen />
        </Frame>
        <p style={{ margin: 0, color: MUTED, fontSize: 11, lineHeight: 1.6 }}>
          사용 기준: 로봇의 현재 자세에만 사용합니다. 세 글리프가 나란히 놓여 방향(접힌 선)·진행(다트)·로봇(원+노즈)이 한 지도에서 구분됩니다.
        </p>
      </Card>
    </main>
  );
}

const meta = {
  title: 'LDS Robotics/Foundation/Vector Glyph',
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-foundation-vector-glyph--overview',
      eyebrow: 'Foundation / Vector Glyph',
      title: '방향 셰브론·진행 다트·로봇 pose를 원자 단위로 문서화합니다',
      description:
        '내부 모듈 _navigationVectorGlyph가 소유하는 세 벡터 글리프를 한 페이지에 나란히 문서화합니다. NAV_DIRECTION_CHEVRON은 LaneOverlay가 최장 직선 구간 중점에 배치하는 정적 이동 방향(선을 끊고 선 자체가 열린 V로 꺾임), NAV_PROGRESS_TRIANGLE은 Route·Trajectory의 동적 현재 진행이 선 끝에 결합하는 채움 화살촉, NAV_ROBOT_POSE는 로봇 마커 렌더러가 그리는 로봇의 실시간 pose(원형 body + heading 노즈)입니다. 셋이 나란히 놓여 방향·진행·로봇이 한 지도에서 절대 혼동되지 않는 "의미당 모양 하나" 계약을 시각적으로 강제합니다. 결합 계약 NAV_PROGRESS_HEAD는 Navigation Encoding Tokens 페이지가 소유합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내부 모듈 _navigationVectorGlyph의 세 기하를 그대로 렌더해 문서화·회귀합니다: LaneOverlay 정적 방향의 NAV_DIRECTION_CHEVRON(선 절개 + 선 자체의 열린 V), Route·Trajectory 현재 진행의 NAV_PROGRESS_TRIANGLE(채움 화살촉), 로봇 실시간 pose의 NAV_ROBOT_POSE(원형 body + heading 노즈). 결합 계약은 Navigation Encoding Tokens가 소유합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '선 절개 방향 셰브론을 Lane과 같은 연속 경로 위에서, 진행 삼각형을 선 끝 결합 형태로 봅니다. play-test가 절개 창·선과 동일한 셰브론·채움 삼각형 기하를 소스 상수와 대조하고, 폐기된 떠 있는 open chevron과 casing 이중 표식이 돌아오지 않도록 단언합니다.',
  ),
  render: () => <VectorGlyphCatalog />,
  play: async ({ canvasElement }) => {
    const root = canvasElement;
    const specimen = root.querySelector('[data-direction-chevron-specimen]');
    const cutWindow = root.querySelector('[data-direction-chevron-window]');
    const chevron = specimen?.querySelector('[data-direction-chevron-geometry]');
    const demoPath = root.querySelector('[data-direction-chevron-demo-line]');
    if (!specimen || !cutWindow || !chevron || !demoPath
      || specimen.getAttribute('data-anchor-rule') !== 'longest-segment-midpoint') {
      throw new Error('The Lane-like specimen must render one line-cut direction chevron on the longest-segment midpoint.');
    }
    const cutMask = cutWindow.closest('mask');
    if (
      Number(cutWindow.getAttribute('x')) !== NAV_DIRECTION_CHEVRON.window.from
      || Number(cutWindow.getAttribute('width')) !== NAV_DIRECTION_CHEVRON.window.to - NAV_DIRECTION_CHEVRON.window.from
      || Number(cutWindow.getAttribute('height')) !== NAV_DIRECTION_CHEVRON.window.clearWidth
      || cutWindow.getAttribute('fill') !== 'black'
      || !cutMask
      || !demoPath.getAttribute('mask')?.includes(cutMask.id)
    ) {
      throw new Error('The cut window must be a self-only mask clearing the NAV_DIRECTION_CHEVRON run.');
    }
    const chevronPath = chevron.getAttribute('d') ?? '';
    if (
      chevronPath !== NAV_DIRECTION_CHEVRON.path
      || chevron.getAttribute('fill') !== 'none'
      || chevron.getAttribute('stroke') !== demoPath?.getAttribute('stroke')
      || chevron.getAttribute('stroke-width') !== demoPath?.getAttribute('stroke-width')
      || /z/i.test(chevronPath)
    ) {
      throw new Error('The direction chevron must be the line itself folding into the open V — same tone, same width.');
    }
    const triangle = root.querySelector('[data-progress-triangle-geometry]');
    const trianglePath = triangle?.getAttribute('d') ?? '';
    if (
      !triangle
      || trianglePath !== NAV_PROGRESS_TRIANGLE.path
      || triangle.getAttribute('fill') === 'none'
      || !/z/i.test(trianglePath)
    ) {
      throw new Error('The progress triangle must be the closed, filled NAV_PROGRESS_TRIANGLE geometry.');
    }
    if (root.querySelector(`path[d="${RETIRED_OPEN_CHEVRON_PATH}"]`)) {
      throw new Error('The retired floating open-chevron direction glyph must not return.');
    }
    if (root.querySelector('path[d="M -2 -3.4 L 4 0 L -2 3.4 Z"]')) {
      throw new Error('The retired standalone closed triangular direction glyph must not return.');
    }
    // The robot pose atom: a round body (the differentiator) + heading nose.
    const robotBody = root.querySelector('[data-robot-pose-body]');
    const robotNose = root.querySelector('[data-robot-pose-nose]');
    if (
      !robotBody
      || Number(robotBody.getAttribute('r')) !== NAV_ROBOT_POSE.bodyRadius
      || robotNose?.getAttribute('d') !== NAV_ROBOT_POSE.nosePath
    ) {
      throw new Error('The robot pose must render the NAV_ROBOT_POSE round body and heading nose.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 벡터 글리프 카탈로그를 확인합니다. 도해가 좁은 폭에 맞춰 줄되 가로 스크롤을 만들지 않아야 합니다.',
  ),
  render: () => (
    <div data-vector-glyph-narrow style={{ width: 320, maxWidth: '100%' }}>
      <VectorGlyphCatalog />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-vector-glyph-narrow]');
    if (!fixture) throw new Error('The narrow vector-glyph fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('The vector-glyph catalog must not create horizontal overflow at 320px.');
    }
  },
};

export const VectorGlyphVisualParity = {
  ...Overview,
  name: 'Vector glyph visual parity',
  tags: ['!dev', 'visual-parity'],
};
