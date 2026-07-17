import React from 'react';
import { NAVIGATION_DIRECTION_PATH, NAVIGATION_ENDPOINT_ARROW } from '../components/robotics/_navigationVectorGlyph.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Renders the two vector glyphs where they actually appear — the filled chevron
// on a route's segments (travel direction), the open arrow at a lane terminus
// (endpoint facing) — straight from the _navigationVectorGlyph constants, so the
// catalog is the atom in context. The play-test asserts each rendered path
// equals its source constant.
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';
const PATHINK = 'var(--color-semantic-label-alternative)';

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

// A two-segment route; one filled chevron sits at each segment midpoint rotated
// to that segment's travel direction — exactly how RouteOverlay/LaneOverlay place
// NAVIGATION_DIRECTION_PATH. seg2 goes (150,98)->(266,44), i.e. about -25 deg.
function DirectionOnPath() {
  return (
    <svg width="100%" viewBox="0 0 300 132" role="img" aria-label="경로 세그먼트 중점의 진행 방향 셰브론" style={{ display: 'block' }}>
      <path d="M36 98 H150 L266 44" fill="none" stroke={PATHINK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="98" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <circle cx="266" cy="44" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <path d={NAVIGATION_DIRECTION_PATH} transform="translate(93 98) scale(1.9)" fill={ACCENT} data-vector-glyph="direction" />
      <path d={NAVIGATION_DIRECTION_PATH} transform="translate(208 71) rotate(-25) scale(1.9)" fill={ACCENT} data-vector-glyph="direction" />
    </svg>
  );
}

// A lane stub ending at a node; the open arrow sits just past the terminus,
// pointing the way the lane faces — as LaneOverlay renders NAVIGATION_ENDPOINT_ARROW.
function EndpointOnLane() {
  return (
    <svg width="100%" viewBox="0 0 300 92" role="img" aria-label="차선 종점의 방향 화살표" style={{ display: 'block' }}>
      <line x1="34" y1="48" x2="206" y2="48" stroke={PATHINK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="206" cy="48" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <path
        d={NAVIGATION_ENDPOINT_ARROW}
        transform="translate(230 48) scale(1.8)"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-vector-glyph="endpoint"
      />
    </svg>
  );
}

function VectorGlyphCatalog() {
  return (
    <main data-vector-glyph-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="이동 방향 셰브론 — 경로 위"
        hint="차선·경로·궤적이 경로 위에 얹는 진행(heading) 표식입니다. 무게중심이 로컬 원점이라 회전만으로 각 세그먼트의 방향을 가리키며, 값은 NAVIGATION_DIRECTION_PATH에서 그대로 렌더됩니다."
      >
        <Frame caption="세그먼트 중점에서 진행 방향" mono="NAVIGATION_DIRECTION_PATH">
          <DirectionOnPath />
        </Frame>
      </Card>
      <Card
        title="종점 방향 화살표 — 차선 종점"
        hint="차선 종점이 어느 쪽을 향하는지 나타내는 열린 선 + 화살촉입니다. 채워진 이동 방향 셰브론과는 이동 방향 vs 종점 지향이라는 서로 다른 역할이라 별개 글리프로 유지합니다."
      >
        <Frame caption="종점 너머로 차선이 향하는 방향" mono="NAVIGATION_ENDPOINT_ARROW">
          <EndpointOnLane />
        </Frame>
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
      title: '내비게이션 방향·종점 지향 벡터 글리프를 원자 단위로 문서화합니다',
      description:
        '차선·경로·궤적 렌더러가 경로 위에 그리는 이동 방향(heading) 셰브론과, 차선 종점이 향하는 방향을 나타내는 종점 방향 화살표는 서로 다른 의미(이동 방향 vs 종점 지향)를 가진 두 개의 공용 글리프입니다. 두 글리프의 path 기하는 내부 모듈 _navigationVectorGlyph가 단일 소스로 소유하며(NAVIGATION_DIRECTION_PATH·NAVIGATION_ENDPOINT_ARROW), 이 페이지는 그 상수를 실제 쓰임(경로 세그먼트·차선 종점) 위에 그대로 렌더해 방향 지시자로 읽히는지 보이고 play-test로 렌더된 path가 상수와 일치함을 단언합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 공유하는 방향·종점 지향 벡터 글리프의 path 기하를 내부 모듈 _navigationVectorGlyph에서 실제 쓰임 위에 그대로 렌더해 문서화·회귀합니다: 채워진 이동 방향 셰브론(NAVIGATION_DIRECTION_PATH)과 열린 종점 방향 화살표(NAVIGATION_ENDPOINT_ARROW). 두 글리프는 이동 방향과 종점 지향이라는 서로 다른 역할이라 의도적으로 통합하지 않고 별개로 유지합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '두 공용 벡터 글리프를 실제 쓰임 위에서 봅니다. 이동 방향 셰브론은 경로 세그먼트 중점에 얹혀 진행 방향을 가리키고, 종점 방향 화살표는 차선 종점 너머로 차선이 향하는 방향을 나타냅니다. play-test가 렌더된 path의 d가 상수와 일치함을 단언하므로 이 페이지가 곧 기하의 회귀 기준입니다.',
  ),
  render: () => <VectorGlyphCatalog />,
  play: async ({ canvasElement }) => {
    const root = canvasElement;
    const directions = Array.from(root.querySelectorAll('[data-vector-glyph="direction"]'));
    if (directions.length < 1) {
      throw new Error('The route illustration must render at least one direction chevron.');
    }
    for (const el of directions) {
      if (el.getAttribute('d') !== NAVIGATION_DIRECTION_PATH) {
        throw new Error('The direction chevron must render NAVIGATION_DIRECTION_PATH.');
      }
    }
    const endpoint = root.querySelector('[data-vector-glyph="endpoint"]');
    if (endpoint?.getAttribute('d') !== NAVIGATION_ENDPOINT_ARROW) {
      throw new Error('The endpoint arrow must render NAVIGATION_ENDPOINT_ARROW.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 벡터 글리프 카탈로그를 확인합니다. 경로·차선 도해가 좁은 폭에 맞춰 줄되 가로 스크롤을 만들지 않아야 합니다.',
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
