import React from 'react';
import {
  NAVIGATION_DIRECTION_PATH,
  NAVIGATION_ENDPOINT_ARROW,
} from '../components/robotics/_navigationVectorGlyph.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// This page renders the REAL shared vector glyphs — the filled travel-direction
// chevron and the open lane-endpoint orientation arrow are drawn straight from
// the internal `_navigationVectorGlyph` path constants that the Navigation
// renderers consume. So the catalog is not a hand-drawn approximation: it IS the
// glyphs, and the play-test asserts the rendered path `d` equals the constants,
// which makes the geometry its own regression baseline.
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';

// The chevron centroid is the local origin, so rotating in place shows it is a
// direction indicator: the tip always points along the heading angle.
const DIRECTION_ROTATIONS = [
  { deg: 0, label: '동 (0°)' },
  { deg: 90, label: '남 (90°)' },
  { deg: 180, label: '서 (180°)' },
  { deg: 270, label: '북 (270°)' },
];

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

function Tile({ children, label, mono }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: 8,
        minHeight: 108,
        minWidth: 0,
        padding: 12,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-sm)',
        background: SURFACE,
      }}
    >
      {children}
      {mono ? <code style={{ fontSize: 11, color: MUTED, maxWidth: '100%', overflowWrap: 'anywhere' }}>{mono}</code> : null}
      <span style={{ fontSize: 11, color: INK, textAlign: 'center', maxWidth: '100%', overflowWrap: 'anywhere' }}>{label}</span>
    </div>
  );
}

// Filled travel-direction chevron rendered at four headings. Geometry lives near
// the origin (x[-2..4], y[-3.4..3.4]); the viewBox pads that so every rotation
// stays inside the tile.
function DirectionGlyphs() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
      {DIRECTION_ROTATIONS.map((row) => (
        <Tile key={row.deg} label={row.label} mono="NAVIGATION_DIRECTION_PATH">
          <svg width={56} height={56} viewBox="-6 -6 12 12" aria-hidden="true" style={{ display: 'block' }}>
            <path
              d={NAVIGATION_DIRECTION_PATH}
              transform={`rotate(${row.deg})`}
              fill={INK}
              data-vector-glyph="direction"
              data-rotation={row.deg}
            />
          </svg>
        </Tile>
      ))}
    </div>
  );
}

// Open lane-endpoint orientation arrow: line + arrowhead, no fill. Geometry spans
// x[-5..5], y[-3..3]; the viewBox pads that.
function EndpointGlyph() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
      <Tile label="종점 방향 화살표 (열린 선 + 화살촉)" mono="NAVIGATION_ENDPOINT_ARROW">
        <svg width={112} height={80} viewBox="-7 -5 14 10" aria-hidden="true" style={{ display: 'block' }}>
          <path
            d={NAVIGATION_ENDPOINT_ARROW}
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-vector-glyph="endpoint"
          />
        </svg>
      </Tile>
    </div>
  );
}

function VectorGlyphCatalog() {
  return (
    <main data-vector-glyph-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="이동 방향 셰브론"
        hint="차선·경로·궤적이 경로 위에 얹는 이동 방향(heading) 표식입니다. 무게중심이 로컬 원점이라 회전만으로 방향을 가리키며, 값은 NAVIGATION_DIRECTION_PATH에서 그대로 렌더됩니다."
      >
        <DirectionGlyphs />
      </Card>
      <Card
        title="종점 방향 화살표"
        hint="차선 종점이 어느 쪽을 향하는지 나타내는 열린 선 + 화살촉입니다. 채워진 이동 방향 셰브론과는 이동 방향 vs 종점 지향이라는 서로 다른 역할이라 별개 글리프로 유지합니다."
      >
        <EndpointGlyph />
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
        '차선·경로·궤적 렌더러가 경로 위에 그리는 이동 방향(heading) 셰브론과, 차선 종점이 향하는 방향을 나타내는 종점 방향 화살표는 서로 다른 의미(이동 방향 vs 종점 지향)를 가진 두 개의 공용 글리프입니다. 두 글리프의 path 기하는 내부 모듈 _navigationVectorGlyph가 단일 소스로 소유하며(NAVIGATION_DIRECTION_PATH·NAVIGATION_ENDPOINT_ARROW), 이 페이지는 그 상수를 그대로 렌더해 여러 회전에서 방향 지시자로 읽히는지 보여주고 play-test로 렌더된 path가 상수와 일치함을 단언합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 공유하는 방향·종점 지향 벡터 글리프의 path 기하를 내부 모듈 _navigationVectorGlyph에서 그대로 렌더해 문서화·회귀합니다: 채워진 이동 방향 셰브론(NAVIGATION_DIRECTION_PATH)과 열린 종점 방향 화살표(NAVIGATION_ENDPOINT_ARROW). 두 글리프는 이동 방향과 종점 지향이라는 서로 다른 역할이라 의도적으로 통합하지 않고 별개로 유지합니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '두 공용 벡터 글리프를 한 페이지에서 비교합니다. 이동 방향 셰브론은 NAVIGATION_DIRECTION_PATH를 네 방향으로 회전해 방향 지시자임을 보이고, 종점 방향 화살표는 NAVIGATION_ENDPOINT_ARROW를 열린 선 + 화살촉으로 렌더합니다. play-test가 렌더된 path의 d가 상수와 일치함을 단언하므로 이 페이지가 곧 기하의 회귀 기준입니다. 두 글리프는 이동 방향과 종점 지향으로 역할이 달라 별개로 유지됩니다.',
  ),
  render: () => <VectorGlyphCatalog />,
  play: async ({ canvasElement }) => {
    const root = canvasElement;

    // Travel-direction chevron — every rotated instance renders the exact
    // NAVIGATION_DIRECTION_PATH geometry (only the rotate() transform differs).
    const directionEls = Array.from(root.querySelectorAll('[data-vector-glyph="direction"]'));
    if (directionEls.length !== DIRECTION_ROTATIONS.length) {
      throw new Error('The direction catalog must render one chevron per heading rotation.');
    }
    for (const el of directionEls) {
      if (el.getAttribute('d') !== NAVIGATION_DIRECTION_PATH) {
        throw new Error('The direction chevron must render NAVIGATION_DIRECTION_PATH.');
      }
    }

    // Lane-endpoint orientation arrow — the open glyph renders its own geometry,
    // kept distinct from the chevron (endpoint facing vs travel direction).
    const endpoint = root.querySelector('[data-vector-glyph="endpoint"]');
    if (endpoint?.getAttribute('d') !== NAVIGATION_ENDPOINT_ARROW) {
      throw new Error('The endpoint arrow must render NAVIGATION_ENDPOINT_ARROW.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 벡터 글리프 카탈로그를 확인합니다. 카드와 글리프 그리드가 좁은 폭에서 접히되 가로 스크롤을 만들지 않아야 합니다.',
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
