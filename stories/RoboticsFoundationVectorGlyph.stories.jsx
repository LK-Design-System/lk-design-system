import React from 'react';
import { NAVIGATION_DIRECTION_PATH } from '../components/robotics/_navigationVectorGlyph.js';
import { NAV_PROGRESS_HEAD } from '../components/robotics/_navigationVocabulary.js';
import { NavigationProgressHeadDefs } from '../components/robotics/_navigationProgressHead.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// Renders the shared direction chevron where it actually appears — on a route's
// segments, rotated to each segment's travel direction — straight from the
// _navigationVectorGlyph constant, so the catalog is the atom in context. The
// play-test asserts every rendered path equals NAVIGATION_DIRECTION_PATH.
// (The lane endpoint-orientation arrow is LaneOverlay-local, not a shared atom,
// so it is documented on the lane renderer rather than promoted here.)
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';
const PATHINK = 'var(--color-semantic-label-alternative)';
const ROUTE_TONE = 'var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))';

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

// A route that bends through two turns; one filled chevron sits at each segment
// midpoint rotated to that segment's travel direction — exactly how the route,
// lane, and trajectory renderers place NAVIGATION_DIRECTION_PATH. Middle segment
// (120,104)->(196,58) runs about -31 deg.
function DirectionOnPath() {
  return (
    <svg width="100%" viewBox="0 0 316 140" role="img" aria-label="경로 세그먼트 중점의 진행 방향 셰브론" style={{ display: 'block' }}>
      <path d="M36 104 H120 L196 58 H280" fill="none" stroke={PATHINK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="104" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <circle cx="280" cy="58" r="4.5" fill={SURFACE} stroke={PATHINK} strokeWidth="2" />
      <path d={NAVIGATION_DIRECTION_PATH} transform="translate(78 104) scale(1.9)" fill={ACCENT} data-vector-glyph="direction" />
      <path d={NAVIGATION_DIRECTION_PATH} transform="translate(158 81) rotate(-31) scale(1.9)" fill={ACCENT} data-vector-glyph="direction" />
      <path d={NAVIGATION_DIRECTION_PATH} transform="translate(238 58) scale(1.9)" fill={ACCENT} data-vector-glyph="direction" />
    </svg>
  );
}

const PROGRESS_HEAD_REFERENCES = [
  {
    label: 'Mapbox Navigation · Route arrow',
    href: 'https://docs.mapbox.com/android/navigation/guides/ui-components/route-arrow/',
  },
  {
    label: 'TomTom · Route progress and instructions',
    href: 'https://developer.tomtom.com/navigation/android/guides/map-display/map-display-for-views/routes',
  },
  {
    label: 'W3C SVG · Path markers',
    href: 'https://www.w3.org/TR/svg-markers/',
  },
];

const PROGRESS_HEAD_STYLES = {
  open: {
    label: 'Line-integrated open progress head',
    note: 'active path 자체가 shaft이고 끝점에 열린 V만 marker-end로 붙습니다. Route와 Trajectory가 공유하는 확정된 현재 진행 문법입니다.',
  },
};

function ProgressHeadMarkerDefs({ idPrefix, scale = 1 }) {
  return (
    <>
      <NavigationProgressHeadDefs idPrefix={`${idPrefix}-route`} tone={ROUTE_TONE} surface={SURFACE} inverseScale={scale} role="route" />
      <NavigationProgressHeadDefs idPrefix={`${idPrefix}-trajectory`} tone={ACCENT} surface={SURFACE} inverseScale={scale} role="trajectory" />
    </>
  );
}

function ProgressHeadSpecimen({ kind }) {
  const idPrefix = `progress-specimen-${kind}`;
  return (
    <svg
      width="148"
      height="52"
      viewBox="0 0 148 52"
      role="img"
      aria-label={`${PROGRESS_HEAD_STYLES[kind].label} 확대 표본`}
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <ProgressHeadMarkerDefs idPrefix={idPrefix} />
      <line x1="8" y1="16" x2="66" y2="16" stroke={SURFACE} strokeWidth="7" strokeLinecap="round" markerEnd={`url(#${idPrefix}-route-casing)`} />
      <line x1="8" y1="16" x2="66" y2="16" stroke={ROUTE_TONE} strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${idPrefix}-route-core)`} />
      <line x1="76" y1="36" x2="136" y2="36" stroke={SURFACE} strokeWidth="6.5" strokeLinecap="round" markerEnd={`url(#${idPrefix}-trajectory-casing)`} />
      <line x1="76" y1="36" x2="136" y2="36" stroke={ACCENT} strokeWidth="3.5" strokeLinecap="round" markerEnd={`url(#${idPrefix}-trajectory-core)`} />
    </svg>
  );
}

function ProgressHeadScene({ headStyle }) {
  const svgRef = React.useRef(null);
  const [headScale, setHeadScale] = React.useState(1);
  const gridId = `progress-head-grid-${headStyle}`;
  const markerId = `progress-scene-${headStyle}`;

  React.useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const updateHeadScale = () => {
      const width = svg.getBoundingClientRect().width;
      if (width > 0) setHeadScale(720 / width);
    };
    updateHeadScale();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateHeadScale);
    observer?.observe(svg);
    window.addEventListener('resize', updateHeadScale);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeadScale);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox="0 0 720 250"
      role="img"
      aria-label={`${PROGRESS_HEAD_STYLES[headStyle].label}, active line과 결합한 Route 62% 및 Trajectory 현재 sample`}
      style={{ display: 'block' }}
      data-progress-head-scene={headStyle}
    >
      <defs>
        <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={LINE} strokeWidth="0.75" opacity="0.55" />
        </pattern>
      </defs>
      <ProgressHeadMarkerDefs idPrefix={markerId} scale={headScale} />
      <rect x="0.5" y="0.5" width="719" height="249" rx="12" fill="var(--color-semantic-background-normal-normal)" stroke={LINE} />
      <rect x="1" y="1" width="718" height="248" rx="12" fill={`url(#${gridId})`} />

      <text x="24" y="32" fill={INK} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 'var(--fw-bold)' }}>
        Route / Trajectory · active line + progress head
      </text>

      <path
        d="M48 176 L192 176 L316 92 L672 68"
        fill="none"
        stroke={SURFACE}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M48 176 L192 176 L316 92 L672 68"
        fill="none"
        stroke={ROUTE_TONE}
        strokeWidth="3"
        strokeDasharray="8 6"
        opacity="0.34"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-route-path=""
      />
      <path
        d="M48 176 L192 176 L316 92 L508 79"
        fill="none"
        stroke={SURFACE}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId}-route-casing)`}
      />
      <path
        d="M48 176 L192 176 L316 92 L508 79"
        fill="none"
        stroke={ROUTE_TONE}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-route-progress-path=""
        data-progress-head={headStyle}
        data-head-role="route"
        data-screen-fixed="true"
        data-head-rendering="marker-end"
        markerEnd={`url(#${markerId}-route-core)`}
      />
      <path
        d="M48 202 C188 202 250 190 346 136 S522 91 672 88"
        fill="none"
        stroke={SURFACE}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M48 202 C188 202 250 190 346 136 S522 91 672 88"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        opacity="0.28"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-trajectory-path=""
      />
      <path
        d="M48 202 C188 202 250 190 346 136"
        fill="none"
        stroke={SURFACE}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={`url(#${markerId}-trajectory-casing)`}
      />
      <path
        d="M48 202 C188 202 250 190 346 136"
        fill="none"
        stroke={ACCENT}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        data-trajectory-progress-path=""
        data-progress-head={headStyle}
        data-head-role="trajectory"
        data-screen-fixed="true"
        data-head-rendering="marker-end"
        markerEnd={`url(#${markerId}-trajectory-core)`}
      />

      <g transform="translate(24 226)" aria-hidden="true">
        <line x1="0" y1="0" x2="30" y2="0" stroke={ROUTE_TONE} strokeWidth="4" />
        <text x="40" y="4" fill={INK} style={{ fontFamily: 'var(--font-sans)', fontSize: 11 }}>Route · 진행 62%</text>
        <line x1="190" y1="0" x2="220" y2="0" stroke={ACCENT} strokeWidth="3.5" />
        <text x="230" y="4" fill={INK} style={{ fontFamily: 'var(--font-sans)', fontSize: 11 }}>Trajectory · current sample</text>
      </g>
    </svg>
  );
}

function ProgressHeadCandidate({ headStyle }) {
  const style = PROGRESS_HEAD_STYLES[headStyle];
  return (
    <section
      style={{
        display: 'grid',
        gap: 12,
        padding: 14,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-sm)',
        background: SURFACE,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 360px' }}>
          <h3 style={{ margin: 0, color: INK, fontSize: 'var(--body2-size)' }}>{style.label}</h3>
          <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 11, lineHeight: 1.6 }}>{style.note}</p>
        </div>
        <ProgressHeadSpecimen kind={headStyle} />
      </header>
      <ProgressHeadScene headStyle={headStyle} />
    </section>
  );
}

function CurrentPositionComparisonDemo() {
  return (
    <main data-progress-head-standard style={{ width: 'min(980px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="현재 진행 방향 · line-integrated standard"
        hint="별도 puck을 경로 위에 얹지 않습니다. 현재 지점까지의 active line이 local tangent를 따라 open V로 끝나는 확정 문법입니다."
      >
        <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>
          <ProgressHeadCandidate headStyle="open" />
        </div>
        <p style={{ margin: 0, color: MUTED, fontSize: 11, lineHeight: 1.6 }}>
          progress head의 방향은 robot bearing이 아니라 경로 접선입니다. pose가 필요하면 별도 robot/avatar layer가 맡고, 이 표식에는 circle·backing·shadow를 사용하지 않습니다.
        </p>
        <nav data-progress-head-references aria-label="경로 진행 화살표 시각 레퍼런스" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
          {PROGRESS_HEAD_REFERENCES.map((reference) => (
            <a key={reference.href} href={reference.href} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontSize: 11, fontWeight: 'var(--fw-semibold)' }}>
              {reference.label}
            </a>
          ))}
        </nav>
      </Card>
    </main>
  );
}

function VectorGlyphCatalog() {
  return (
    <main data-vector-glyph-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card
        title="이동 방향 셰브론 — 경로 위"
        hint="차선·경로·궤적이 경로 위에 공통으로 얹는 진행(heading) 표식입니다. 무게중심이 로컬 원점이라 회전만으로 각 세그먼트의 방향을 가리키며, 값은 NAVIGATION_DIRECTION_PATH에서 그대로 렌더됩니다."
      >
        <Frame caption="꺾이는 세그먼트마다 진행 방향" mono="NAVIGATION_DIRECTION_PATH">
          <DirectionOnPath />
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
      title: '내비게이션 이동 방향 벡터 글리프를 원자 단위로 문서화합니다',
      description:
        '차선·경로·궤적 렌더러가 경로 위에 공통으로 그리는 이동 방향(heading) 셰브론을 문서화합니다. 이 글리프의 path 기하는 내부 모듈 _navigationVectorGlyph가 단일 소스로 소유하며(NAVIGATION_DIRECTION_PATH), 무게중심이 로컬 원점이라 회전만으로 각 세그먼트의 진행 방향을 가리킵니다. 이 페이지는 그 상수를 실제 쓰임(경로 세그먼트 중점) 위에 그대로 렌더해 방향 지시자로 읽히는지 보이고 play-test로 렌더된 모든 셰브론의 path가 상수와 일치함을 단언합니다. 차선 종점 방향 화살표는 소비자가 차선 렌더러 하나뿐이라 공용 원자로 승격하지 않고 해당 컴포넌트 로컬 geometry로 둡니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 공유하는 이동 방향 벡터 글리프의 path 기하를 내부 모듈 _navigationVectorGlyph에서 실제 쓰임 위에 그대로 렌더해 문서화·회귀합니다: 채워진 이동 방향 셰브론(NAVIGATION_DIRECTION_PATH, lane·route·trajectory 공유). 차선 종점 방향 화살표는 소비자가 차선 렌더러 하나뿐이라 공용 원자로 올리지 않고 컴포넌트 로컬 geometry로 둡니다. 공개 API가 아닌 내부 글리프 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '공용 이동 방향 셰브론을 실제 쓰임 위에서 봅니다. 경로가 꺾이는 각 세그먼트 중점에 얹혀 진행 방향을 가리키며, play-test가 렌더된 모든 셰브론의 d가 NAVIGATION_DIRECTION_PATH와 일치함을 단언하므로 이 페이지가 곧 기하의 회귀 기준입니다.',
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
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 벡터 글리프 카탈로그를 확인합니다. 경로 도해가 좁은 폭에 맞춰 줄되 가로 스크롤을 만들지 않아야 합니다.',
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

export const CurrentPositionComparison = {
  name: '현재 진행 방향 · line-integrated',
  parameters: storyDescription(
    'Route와 Trajectory의 current progress를 별도 puck이 아니라 active line과 결합된 open progress head로 표현합니다. 방향은 robot bearing이 아닌 path local tangent를 사용합니다.',
  ),
  render: () => <CurrentPositionComparisonDemo />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-progress-head-standard]');
    if (!root) throw new Error('The progress-head standard fixture is missing.');

    const scenes = Array.from(root.querySelectorAll('[data-progress-head-scene]'));
    if (scenes.length !== 1 || scenes[0].dataset.progressHeadScene !== 'open') {
      throw new Error('The standard must render only the selected open progress head.');
    }
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error('The current-position comparison must not create horizontal overflow.');
    }

    const routeGeometry = 'M48 176 L192 176 L316 92 L508 79';
    for (const scene of scenes) {
      const routeProgressPath = scene.querySelector('[data-route-progress-path]');
      const heads = Array.from(scene.querySelectorAll('[data-progress-head]'));
      if (routeProgressPath?.getAttribute('d') !== routeGeometry || routeProgressPath.getAttribute('stroke') !== ROUTE_TONE) {
        throw new Error('The progress-head standard must keep the approved active route geometry and tone.');
      }
      if (
        heads.length !== 2
        || heads.some((head) => head.dataset.progressHead !== scene.dataset.progressHeadScene)
        || heads.some((head) => head.dataset.screenFixed !== 'true')
        || heads.some((head) => head.dataset.headRendering !== 'marker-end')
        || heads.some((head) => !head.getAttribute('marker-end')?.startsWith('url(#progress-scene-'))
        || !heads.some((head) => head.dataset.headRole === 'route')
        || !heads.some((head) => head.dataset.headRole === 'trajectory')
      ) {
        throw new Error('The scene must join the shared marker-end progress head to both active lines.');
      }
      const definitions = Array.from(scene.querySelectorAll('[data-navigation-progress-head-definition="core"]'));
      if (definitions.length !== 2 || definitions.some((definition) => definition.getAttribute('d') !== NAV_PROGRESS_HEAD.path)) {
        throw new Error('The specimen must render the production NAV_PROGRESS_HEAD geometry.');
      }
      if (scene.querySelector('[data-current-position-marker]')) throw new Error('Detached current-position markers must not return.');
    }

    const references = Array.from(root.querySelectorAll('[data-progress-head-references] a'));
    if (references.length !== PROGRESS_HEAD_REFERENCES.length || references.some((link) => !link.href.startsWith('https://'))) {
      throw new Error('The comparison must expose every authoritative reference as an HTTPS link.');
    }
  },
};

export const VectorGlyphVisualParity = {
  ...Overview,
  name: 'Vector glyph visual parity',
  tags: ['!dev', 'visual-parity'],
};
