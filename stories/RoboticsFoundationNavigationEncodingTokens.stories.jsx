import React from 'react';
import { NavigationStateGlyph } from '../components/robotics/_NavigationStateGlyph.js';
import {
  navStateOpacity,
  NAV_STATE_OPACITY,
  NAV_CURRENT_MARKER,
  NAV_DASH,
  NAV_HIT,
  NAV_STATE_BADGE,
  NAV_LABEL_HALO,
} from '../components/robotics/_navigationVocabulary.js';
import { NAVIGATION_DIRECTION_PATH } from '../components/robotics/_navigationVectorGlyph.js';
import { annotationPriority, KIND_WEIGHT } from '../components/robotics/_navigationAnnotations.js';
import { WaypointMarker, FacilityTransition, SpatialRegion } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// This page renders the REAL shared encoding tokens — every dash, opacity, badge,
// hit target, and halo swatch is drawn straight from the internal
// `_navigationVocabulary` constants. So the catalog is not a hand-drawn
// approximation: it IS the tokens, and the play-test asserts the rendered DOM
// equals the constants, which makes the vocabulary its own regression baseline.
// (The shared map-pin BODY, NAV_PIN, is a drawable marker silhouette rather than
// a scalar token, so it lives on its own Foundation/Marker Pin page.)
const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';

// The shared, unifiable dash tokens (small ring + region/shape outline). Path
// dashes stay component-local by design, so they are named here but not owned.
const DASH_ROWS = [
  { key: 'staleRing', label: '오래된 상태 링 (badge·indicator)' },
  { key: 'staleShape', label: '오래된 데이터 (구역·설비 외곽선)' },
  { key: 'unknown', label: '미확인 (traversability/availability)' },
  { key: 'invalid', label: '데이터 오류 (shape·ring)' },
];

const OPACITY_ROWS = [
  { key: 'default', disabled: false, stale: false, label: '기본' },
  { key: 'stale', disabled: false, stale: true, label: '지연 데이터' },
  { key: 'disabled', disabled: true, stale: false, label: '비활성' },
];

const HALO_ROWS = [
  { key: 'primary', label: '식별 라벨 (primary)' },
  { key: 'secondary', label: '상세 라벨 (secondary)' },
  { key: 'caption', label: '메타 라벨 (caption)' },
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
        padding: 12,
        border: `1px solid ${LINE}`,
        borderRadius: 'var(--radius-sm)',
        background: SURFACE,
      }}
    >
      {children}
      {mono ? <code style={{ fontSize: 11, color: MUTED }}>{mono}</code> : null}
      <span style={{ fontSize: 11, color: INK, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function DashSwatches() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {DASH_ROWS.map((row) => (
        <div key={row.key} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', gap: 12 }}>
          <code style={{ fontSize: 11, color: MUTED }}>{`NAV_DASH.${row.key} · ${NAV_DASH[row.key]}`}</code>
          <div style={{ display: 'grid', gap: 3 }}>
            <svg width="100%" height={14} viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
              <line
                x1="2"
                y1="7"
                x2="238"
                y2="7"
                stroke={INK}
                strokeWidth="2"
                strokeDasharray={NAV_DASH[row.key]}
                data-encoding-dash={row.key}
              />
            </svg>
            <span style={{ fontSize: 11, color: INK }}>{row.label}</span>
          </div>
        </div>
      ))}
      <p style={{ margin: '4px 0 0', fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
        availability-unavailable dash와 lane/route/trajectory의 path·segment·status dash는 서로 다른 stroke 기하에
        얹히는 component 고유 encoding이라 이 공용 집합에 넣지 않습니다.
      </p>
    </div>
  );
}

function OpacitySwatches() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
      {OPACITY_ROWS.map((row) => (
        <Tile key={row.key} label={row.label} mono={`${navStateOpacity(row.disabled, row.stale)}`}>
          <svg width={44} height={44} viewBox="-22 -22 44 44" aria-hidden="true" style={{ display: 'block' }}>
            <circle
              r="12"
              fill={ACCENT}
              opacity={navStateOpacity(row.disabled, row.stale)}
              data-encoding-opacity={row.key}
            />
          </svg>
        </Tile>
      ))}
    </div>
  );
}

function BadgeAndHit() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
      <Tile label={`상태 badge · r=${NAV_STATE_BADGE.radius}, stroke=${NAV_STATE_BADGE.strokeWidth}`} mono="NAV_STATE_BADGE">
        <svg width={44} height={44} viewBox="-16 -16 32 32" aria-hidden="true" style={{ display: 'block' }}>
          <circle
            r={NAV_STATE_BADGE.radius}
            fill={SURFACE}
            stroke={MUTED}
            strokeWidth={NAV_STATE_BADGE.strokeWidth}
            vectorEffect="non-scaling-stroke"
            data-encoding-badge=""
          />
          <NavigationStateGlyph kind="unknown" size={10} color={INK} />
        </svg>
      </Tile>
      <Tile label={`현재 위치 marker · r=${NAV_CURRENT_MARKER.radius}, stroke=${NAV_CURRENT_MARKER.strokeWidth}`} mono="NAV_CURRENT_MARKER">
        <svg width={44} height={44} viewBox="-16 -16 32 32" aria-hidden="true" style={{ display: 'block' }}>
          <circle
            r={NAV_CURRENT_MARKER.radius}
            fill={SURFACE}
            stroke={ACCENT}
            strokeWidth={NAV_CURRENT_MARKER.strokeWidth}
            vectorEffect="non-scaling-stroke"
            data-encoding-current-marker=""
          />
          <circle r="3" fill={INK} />
        </svg>
      </Tile>
      <Tile label={`hit target · r=${NAV_HIT.radius}, 최소 ${NAV_HIT.screenTargetSize} CSS px`} mono="NAV_HIT">
        <svg width={60} height={60} viewBox="-26 -26 52 52" aria-hidden="true" style={{ display: 'block' }}>
          <circle
            r={NAV_HIT.radius}
            fill="none"
            stroke={LINE}
            strokeWidth="1"
            strokeDasharray="2 3"
            data-encoding-hit=""
            data-screen-target-size={NAV_HIT.screenTargetSize}
          />
          <circle r="6.5" fill={ACCENT} />
        </svg>
      </Tile>
    </div>
  );
}

function HaloSwatches() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
      {HALO_ROWS.map((row) => (
        <Tile key={row.key} label={row.label} mono={`NAV_LABEL_HALO.${row.key} · ${NAV_LABEL_HALO[row.key]}`}>
          <svg width={160} height={30} viewBox="0 0 160 30" aria-hidden="true" style={{ display: 'block' }}>
            <text
              x="80"
              y="20"
              textAnchor="middle"
              fill={INK}
              stroke="var(--color-semantic-background-normal-normal)"
              strokeWidth={NAV_LABEL_HALO[row.key]}
              paintOrder="stroke"
              vectorEffect="non-scaling-stroke"
              data-encoding-halo={row.key}
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}
            >
              라벨 halo
            </text>
          </svg>
        </Tile>
      ))}
    </div>
  );
}

// Screen-constant markers under zoom. Both panels share one map (grid + path
// drawn in the same world coordinates); the right panel wraps that map in a
// scale(2) group so the LINE and GRID grow with the zoom, while the marker is
// drawn OUTSIDE the zoomed group at a constant size — exactly what every
// renderer achieves with `transform: scale(1/viewportScale)` +
// `vector-effect: non-scaling-stroke` on the marker.
const ZOOM_PANELS = [
  { z: 1, label: '줌 1×' },
  { z: 2, label: '줌 2×' },
];

function ZoomPanel({ z, label }) {
  const gridLines = [];
  for (let g = 12; g < 132; g += 24) {
    gridLines.push(<line key={`v${g}`} x1={g} y1="0" x2={g} y2="96" stroke={LINE} strokeWidth="1" />);
  }
  for (let g = 12; g < 96; g += 24) {
    gridLines.push(<line key={`h${g}`} x1="0" y1={g} x2="132" y2={g} stroke={LINE} strokeWidth="1" />);
  }
  return (
    <figure data-zoom-panel={z} style={{ margin: 0, display: 'grid', gap: 8, justifyItems: 'center' }}>
      <svg width={132} height={96} viewBox="0 0 132 96" aria-hidden="true" style={{ display: 'block', border: `1px solid ${LINE}`, borderRadius: 'var(--radius-sm)', background: SURFACE }}>
        <g transform={z === 1 ? undefined : `translate(66 48) scale(${z}) translate(-66 -48)`}>
          {gridLines}
          {/* The path scales with the map (no non-scaling-stroke), so it reads
              thicker and longer at higher zoom. */}
          <path data-zoom-path="" d="M18 68 L66 48 L114 40" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Marker drawn outside the zoomed group → constant screen size. */}
        <g transform="translate(66 48)">
          <circle
            data-zoom-marker=""
            r={NAV_CURRENT_MARKER.radius}
            fill={SURFACE}
            stroke={ACCENT}
            strokeWidth={NAV_CURRENT_MARKER.strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <path d={NAVIGATION_DIRECTION_PATH} transform="rotate(-22)" fill={INK} />
        </g>
      </svg>
      <span style={{ fontSize: 11, color: INK, fontVariantNumeric: 'tabular-nums' }}>{label}</span>
    </figure>
  );
}

function ZoomCard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, max-content))', gap: 16, justifyContent: 'center' }}>
      {ZOOM_PANELS.map((panel) => (
        <ZoomPanel key={panel.z} z={panel.z} label={panel.label} />
      ))}
    </div>
  );
}

// Label priority ladder. When two labels contend for one slot, the higher
// annotationPriority wins; ties break by KIND_WEIGHT (paint order), then id.
// Both scales are rendered straight from the source functions.
const STATE_WEIGHTS = [
  { key: 'selected', label: '선택됨' },
  { key: 'focused', label: '포커스됨' },
  { key: 'alarm', label: '경보' },
  { key: 'emphasized', label: '강조' },
];
const KIND_LADDER = [
  { label: '영역', kind: 'region-label' },
  { label: '레인', kind: 'lane-label' },
  { label: '경로', kind: 'route-segment-label' },
  { label: '궤적', kind: 'trajectory-label' },
  { label: '웨이포인트', kind: 'waypoint-label' },
  { label: '설비', kind: 'facility-label' },
];

function Pill({ children, hook }) {
  return (
    <span
      {...hook}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '3px 9px', borderRadius: 'var(--radius-sm)', border: `1px solid ${LINE}`, background: SURFACE, fontSize: 'var(--caption1-size)', color: INK }}
    >
      {children}
    </span>
  );
}

function PriorityLadder() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 11, color: MUTED }}>상태 가중치 · annotationPriority()</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATE_WEIGHTS.map((state) => (
            <Pill key={state.key} hook={{ 'data-priority-state': state.key }}>
              <span>{state.label}</span>
              <code style={{ fontSize: 11, color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{annotationPriority({ [state.key]: true })}</code>
            </Pill>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 11, color: MUTED }}>동점 tie-break · KIND_WEIGHT (paint order)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          {KIND_LADDER.map((entry, index) => (
            <React.Fragment key={entry.kind}>
              {index > 0 && <span aria-hidden="true" style={{ color: MUTED }}>›</span>}
              <Pill hook={{ 'data-kind-weight': entry.kind }}>
                <span>{entry.label}</span>
                <code style={{ fontSize: 11, color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{KIND_WEIGHT[entry.kind]}</code>
              </Pill>
            </React.Fragment>
          ))}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
        최종 규칙: 우선순위 내림차순 → 같으면 KIND_WEIGHT 내림차순(위에 그려지는 점 개체가 라벨을 지킴) → 그래도 같으면 id 오름차순. 마커·배지·핀은 부동 장애물이고 <b style={{ color: INK }}>라벨만</b> 재배치됩니다.
      </p>
    </div>
  );
}

// Keyboard focus indicator. The SHARED rule: a focused marker draws an
// indicator that traces its OWN silhouette in --color-semantic-focus-indicator
// with non-scaling-stroke, and the browser's rectangular outline is suppressed.
// The geometry (radius / stroke) hugs each marker's shape, so the three tiles
// show the real, visually distinct focus treatments — circle ring, path halo,
// and shape-tracing outline — rather than one generic ring.
const FOCUS_INDICATOR = 'var(--color-semantic-focus-indicator)';

function FocusTile({ label, geom, children }) {
  return (
    <figure style={{ margin: 0, display: 'grid', gap: 7, justifyItems: 'center', minWidth: 0 }}>
      <svg width={104} height={76} viewBox="-26 -19 52 38" aria-hidden="true" style={{ display: 'block', border: `1px solid ${LINE}`, borderRadius: 'var(--radius-sm)', background: SURFACE }}>
        {children}
      </svg>
      <span style={{ fontSize: 11, color: INK, fontWeight: 'var(--fw-semibold)', textAlign: 'center' }}>{label}</span>
      <code style={{ fontSize: 10, color: MUTED, textAlign: 'center' }}>{geom}</code>
    </figure>
  );
}

function FocusCard() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={{ margin: 0, fontSize: 'var(--caption1-size)', color: MUTED, lineHeight: 1.6 }}>
        키보드 포커스를 받은 마커는 자기 실루엣을 따라 <code style={{ color: INK }}>--color-semantic-focus-indicator</code> 윤곽선을 그리고 브라우저 사각 outline은 억제합니다. 모두 non-scaling-stroke이며, 아래처럼 크기·모양은 마커에 맞춰 렌더러마다 다릅니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(112px, max-content))', gap: 16, justifyContent: 'center' }}>
        <FocusTile label="웨이포인트" geom="다이아몬드 껍데기 ×1.5">
          {/* focus traces the diamond silhouette (shell scaled 1.5x), not a circle */}
          <polygon points="0,-7 7,0 0,7 -7,0" fill={ACCENT} />
          <polygon data-encoding-focus-ring="" points="0,-7 7,0 0,7 -7,0" transform="scale(1.5)" fill="none" stroke={FOCUS_INDICATOR} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </FocusTile>
        <FocusTile label="경로 (레인·궤적·루트)" geom="halo stroke 10~11">
          {/* a thick focus-colored halo behind the thin path line */}
          <path d="M-19 10 L-1 -2 L19 -9" fill="none" stroke={FOCUS_INDICATOR} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d="M-19 10 L-1 -2 L19 -9" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </FocusTile>
        <FocusTile label="영역" geom="도형 추적 · stroke 6.5">
          {/* the focus stroke traces the region silhouette */}
          <rect x="-19" y="-11" width="38" height="22" rx="3" fill="var(--color-semantic-fill-normal)" stroke={FOCUS_INDICATOR} strokeWidth="6.5" vectorEffect="non-scaling-stroke" />
          <rect x="-19" y="-11" width="38" height="22" rx="3" fill="none" stroke={INK} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
        </FocusTile>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
        핀(시설·해저드)은 자기 실루엣을 <code style={{ color: INK }}>scale 1.34</code>로 키운 링(stroke 2.5)을 씁니다 — Marker Pin 페이지 참고.
      </p>
    </div>
  );
}

// State layering, rendered with the REAL components (not hand-drawn) so the
// catalog is exactly what ships. Each renderer is shown in four states — base,
// focused, selected, focused+selected — proving focus (blue silhouette, outer)
// and selection (accent, inner) are independent axes that compose.
const SL_MAP = 'sl';
const SL_WAYPOINT = { id: 'sl-wp', mapId: SL_MAP, position: { x: 24, y: 26 }, roles: ['holding'], availability: 'available' };
const SL_REGION = { id: 'sl-rg', mapId: SL_MAP, category: 'behavior', rule: { kind: 'speed-limit' }, shape: { kind: 'circle', center: { x: 24, y: 24 }, radius: 13 } };
const SL_FACILITY = {
  id: 'sl-fc', kind: 'lift', label: '승강기', facilityId: 'lift',
  from: { mapId: SL_MAP, position: { x: 28, y: 30 } },
  availability: 'available', phase: 'approach', doorState: 'closed',
  motionState: 'stopped', operatingMode: 'agv', sessionState: 'requested',
  currentMapId: SL_MAP, destinationMapId: SL_MAP,
};

const SL_STATES = [
  { key: 'base', label: '기본', props: {} },
  { key: 'focused', label: '포커스', props: { focused: true } },
  { key: 'selected', label: '선택', props: { selected: true } },
  { key: 'both', label: '포커스+선택', props: { focused: true, selected: true } },
];

const SL_ROWS = [
  { key: 'waypoint', label: '웨이포인트', viewBox: '2 4 44 44',
    render: (p) => <WaypointMarker waypoint={SL_WAYPOINT} showLabel={false} {...p} /> },
  { key: 'facility', label: '핀 (시설·해저드)', viewBox: '0 -14 56 64',
    render: (p) => <FacilityTransition transition={SL_FACILITY} activeMapId={SL_MAP} showLabel={false} {...p} /> },
  { key: 'region', label: '영역', viewBox: '0 0 48 48',
    render: (p) => <SpatialRegion region={SL_REGION} showLabel={false} {...p} /> },
];

function StateLayerCard() {
  return (
    <div data-state-layer style={{ display: 'grid', gap: 12, minWidth: 0 }}>
      <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(64px, auto) repeat(4, 64px)', gap: 8, alignItems: 'center', width: 'min-content' }}>
        <span />
        {SL_STATES.map((s) => (
          <span key={s.key} style={{ fontSize: 11, fontWeight: 'var(--fw-semibold)', color: MUTED, textAlign: 'center' }}>{s.label}</span>
        ))}
        {SL_ROWS.map((row) => (
          <React.Fragment key={row.key}>
            <span style={{ fontSize: 12, fontWeight: 'var(--fw-semibold)', color: INK }}>{row.label}</span>
            {SL_STATES.map((s) => (
              <figure key={s.key} data-state-cell={`${row.key}:${s.key}`} style={{ margin: 0, display: 'grid', placeItems: 'center', padding: 4, border: `1px solid ${LINE}`, borderRadius: 'var(--radius-sm)', background: SURFACE }}>
                <svg width={64} height={64} viewBox={row.viewBox} aria-hidden="true" style={{ display: 'block' }}>
                  {row.render(s.props)}
                </svg>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </div>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.6 }}>
        파랑 = 포커스(실루엣 추적, 바깥) · accent = 선택(피처 강조, 안쪽). 둘은 독립이라 마지막 열처럼 동시에 성립하며, 포커스가 선택보다 바깥/위에 렌더됩니다. 실제 컴포넌트를 그대로 렌더한 것입니다.
      </p>
    </div>
  );
}

function EncodingCatalog() {
  return (
    <main data-encoding-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card title="선(dash) 어휘" hint="작은 링과 구역·설비 외곽선에서 같은 상태는 같은 dash로 읽힙니다. 값은 NAV_DASH에서 그대로 렌더됩니다.">
        <DashSwatches />
      </Card>
      <Card title="상태 opacity" hint="비활성 0.45, 지연 0.76, 기본 1 — navStateOpacity() 한 함수를 일곱 렌더러가 공유합니다.">
        <OpacitySwatches />
      </Card>
      <Card title="상태 badge · 현재 위치 marker · hit target" hint="상태 글리프 뒤 원형 chip(NAV_STATE_BADGE), 경로·궤적의 현재 위치 badge(NAV_CURRENT_MARKER — 상태 chip보다 한 단계 크게), 투명 WCAG 2.2 타깃(NAV_HIT). 화면 타깃은 data-screen-target-size 계약으로 고정됩니다. 배지 안에 들어가는 상태 글리프 11종 세트는 State Badge 페이지를 참고하세요.">
        <BadgeAndHit />
      </Card>
      <Card title="라벨 halo 계층" hint="paint-order stroke로 텍스트 뒤에 깔리는 legibility halo. 식별·상세·메타 세 단계를 NAV_LABEL_HALO가 소유합니다.">
        <HaloSwatches />
      </Card>
      <Card title="화면 고정 크기 · scale(1/viewportScale)" hint="지도를 확대·축소해도 마커·배지·글리프는 화면상 같은 크기를 유지하고 선·도형만 지도와 함께 커집니다. 마커가 scale(1/viewportScale) + non-scaling-stroke로 자기 크기를 되돌리기 때문입니다. 두 패널은 같은 지도를 줌 1×·2×로 보여줍니다 — 격자와 선은 커지고 마커는 그대로입니다.">
        <ZoomCard />
      </Card>
      <Card title="라벨 우선순위 사다리" hint="두 라벨이 한 자리를 다투면 더 중요한 개체의 라벨이 이깁니다. 상태 가중치(annotationPriority)와 동점 tie-break(KIND_WEIGHT)를 소스 함수에서 그대로 렌더합니다. 실제 재배치 동작은 Navigation/Annotation Layer 페이지가 보여줍니다.">
        <PriorityLadder />
      </Card>
      <Card title="포커스 인디케이터" hint="키보드 포커스 시 마커가 자기 실루엣을 따라 그리는 focus-indicator 윤곽선. 색과 non-scaling-stroke·outline 억제는 공유 규칙이고, 기하는 렌더러 모양에 맞춰 다릅니다.">
        <FocusCard />
      </Card>
      <Card title="상태 계층 · 포커스 vs 선택" hint="포커스(파랑, 실루엣 추적, 바깥)와 선택(accent, 피처 강조, 안쪽)은 독립 축이라 동시에 성립합니다. 실제 컴포넌트를 기본·포커스·선택·포커스+선택으로 렌더합니다 — 손으로 그린 근사가 아닙니다.">
        <StateLayerCard />
      </Card>
    </main>
  );
}

const meta = {
  title: 'LDS Robotics/Foundation/Navigation Encoding Tokens',
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-foundation-navigation-encoding-tokens--overview',
      eyebrow: 'Foundation / Navigation Encoding Tokens',
      title: '내비게이션 렌더러가 공유하는 인코딩 토큰을 원자 단위로 문서화합니다',
      description:
        '웨이포인트·설비·해저드·차선·경로·궤적·구역 렌더러가 한 지도에서 하나의 시스템으로 읽히도록, 이들이 공유하는 선·상태·상호작용·라벨 인코딩 스칼라 토큰을 내부 모듈 _navigationVocabulary가 단일 소스로 소유합니다. 이 페이지는 그 값(상태 opacity·dash·hit target·상태 badge와 현재 위치 marker 기하·label halo 계층)을 상수에서 그대로 렌더하고, 줌에도 마커가 화면 크기를 유지하는 화면 고정 메커니즘·라벨 우선순위 사다리·키보드 포커스 인디케이터 규칙도 소스에서 그대로 보여줘, 토큰과 규칙 자체가 회귀 기준이 되도록 합니다. 공유되는 map-pin 몸통 기하(NAV_PIN)는 스칼라 토큰이 아니라 그려지는 마커 실루엣이라 Marker Pin 페이지로, path·segment·status dash처럼 component 고유 encoding은 각 렌더러 로컬로 남습니다. 공개 API가 아닌 내부 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 공유하는 인코딩 스칼라 토큰을 내부 모듈 _navigationVocabulary에서 그대로 렌더해 문서화·회귀합니다: 상태 opacity(navStateOpacity), NAV_DASH, NAV_HIT, NAV_STATE_BADGE, NAV_CURRENT_MARKER, NAV_LABEL_HALO. 공유 map-pin 몸통(NAV_PIN)은 별도 핀 페이지에서, 배지 글리프 세트는 별도 상태 글리프 페이지에서 다룹니다. 공개 API가 아닌 내부 어휘 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '공유 인코딩 토큰을 한 페이지에서 비교합니다. 각 swatch는 _navigationVocabulary 상수에서 직접 렌더됩니다. play-test가 렌더된 DOM이 상수와 일치함을 단언하므로 이 페이지가 곧 토큰의 회귀 기준입니다.',
  ),
  render: () => <EncodingCatalog />,
  play: async ({ canvasElement }) => {
    const root = canvasElement;

    // Dash vocabulary — every shared dash renders its exact NAV_DASH value, and
    // the swatch set matches the module's key set (a dropped key breaks this).
    const dashEls = Array.from(root.querySelectorAll('[data-encoding-dash]'));
    if (dashEls.length !== Object.keys(NAV_DASH).length) {
      throw new Error('The dash catalog must render exactly one swatch per NAV_DASH token.');
    }
    for (const el of dashEls) {
      const key = el.getAttribute('data-encoding-dash');
      if (el.getAttribute('stroke-dasharray') !== NAV_DASH[key]) {
        throw new Error(`Dash swatch "${key}" must render NAV_DASH.${key}.`);
      }
    }

    // Label halo tiers — each text carries its tier stroke width.
    for (const tier of Object.keys(NAV_LABEL_HALO)) {
      const el = root.querySelector(`[data-encoding-halo="${tier}"]`);
      if (el?.getAttribute('stroke-width') !== String(NAV_LABEL_HALO[tier])) {
        throw new Error(`Halo tier "${tier}" must render NAV_LABEL_HALO.${tier}.`);
      }
    }

    // State opacity — the stale swatch renders the shared stale opacity.
    const staleDot = root.querySelector('[data-encoding-opacity="stale"]');
    if (Number(staleDot?.getAttribute('opacity')) !== NAV_STATE_OPACITY.stale) {
      throw new Error('The stale opacity swatch must render NAV_STATE_OPACITY.stale.');
    }

    // State badge + hit target contracts.
    const badge = root.querySelector('[data-encoding-badge]');
    if (badge?.getAttribute('r') !== String(NAV_STATE_BADGE.radius)) {
      throw new Error('The state-badge swatch must render NAV_STATE_BADGE.radius.');
    }
    const currentMarker = root.querySelector('[data-encoding-current-marker]');
    if (
      currentMarker?.getAttribute('r') !== String(NAV_CURRENT_MARKER.radius) ||
      currentMarker?.getAttribute('stroke-width') !== String(NAV_CURRENT_MARKER.strokeWidth)
    ) {
      throw new Error('The current-position marker swatch must render NAV_CURRENT_MARKER geometry.');
    }
    const hit = root.querySelector('[data-encoding-hit]');
    if (
      hit?.getAttribute('r') !== String(NAV_HIT.radius) ||
      hit?.getAttribute('data-screen-target-size') !== String(NAV_HIT.screenTargetSize)
    ) {
      throw new Error('The hit-target swatch must render NAV_HIT radius and screen target size.');
    }

    // Screen-constant marker: the two zoom panels render the SAME marker size on
    // screen while the map path grows with zoom — proving markers hold their CSS
    // size across scale.
    const zoomMarkers = Array.from(root.querySelectorAll('[data-zoom-marker]'));
    const zoomPaths = Array.from(root.querySelectorAll('[data-zoom-path]'));
    if (zoomMarkers.length !== 2 || zoomPaths.length !== 2) {
      throw new Error('The zoom card must render two panels each with a marker and a map path.');
    }
    const [markerA, markerB] = zoomMarkers.map((el) => el.getBoundingClientRect().width);
    if (!(markerA > 0) || Math.abs(markerA - markerB) > 1) {
      throw new Error(`Markers must hold a constant screen size across zoom: ${markerA} vs ${markerB}.`);
    }
    const [pathA, pathB] = zoomPaths.map((el) => el.getBoundingClientRect().width);
    if (!(pathB > pathA + 1)) {
      throw new Error(`The map path must grow with zoom (screen-scaled), not stay constant: ${pathA} vs ${pathB}.`);
    }

    // Priority ladder: state weights and kind weights render straight from the
    // source functions, so the page is the ladder's regression baseline.
    for (const state of ['selected', 'focused', 'alarm', 'emphasized']) {
      const pill = root.querySelector(`[data-priority-state="${state}"]`);
      if (!pill?.textContent?.includes(String(annotationPriority({ [state]: true })))) {
        throw new Error(`Priority pill "${state}" must render annotationPriority({${state}: true}).`);
      }
    }
    // Focus indicator: traces the silhouette in the focus-indicator color with
    // non-scaling-stroke (the shared rule; geometry is per-renderer).
    const focusRing = root.querySelector('[data-encoding-focus-ring]');
    if (
      !focusRing?.getAttribute('stroke')?.includes('focus-indicator') ||
      focusRing?.getAttribute('vector-effect') !== 'non-scaling-stroke'
    ) {
      throw new Error('The focus-indicator swatch must trace with --color-semantic-focus-indicator and non-scaling-stroke.');
    }

    const kinds = Array.from(root.querySelectorAll('[data-kind-weight]'));
    if (kinds.length !== KIND_LADDER.length) {
      throw new Error('The kind-weight ladder must render one pill per rung.');
    }
    let previousWeight = -1;
    for (const pill of kinds) {
      const weight = KIND_WEIGHT[pill.getAttribute('data-kind-weight')];
      if (!pill.textContent?.includes(String(weight))) {
        throw new Error('Each kind-weight pill must render its KIND_WEIGHT value.');
      }
      if (weight < previousWeight) {
        throw new Error('The kind-weight ladder must render in ascending paint-order weight.');
      }
      previousWeight = weight;
    }

    // State layering — the real components render focus and selection as
    // independent axes that compose. Verify each renderer's focus/selection
    // indicator appears exactly in the states that should have it.
    const SL_INDICATORS = {
      waypoint: { focus: '[data-waypoint-focus-indicator]', select: '[data-waypoint-selected-indicator]' },
      facility: { focus: '[data-transition-focus-ring]', select: '[data-transition-selection-ring]' },
      region: { focus: '[data-region-focus-ring]', select: '[data-region-selection-ring]' },
    };
    for (const [renderer, sel] of Object.entries(SL_INDICATORS)) {
      const cellHas = (state, indicator) => {
        const cell = root.querySelector(`[data-state-cell="${renderer}:${state}"]`);
        if (!cell) throw new Error(`State-layer cell ${renderer}:${state} must render.`);
        return Boolean(cell.querySelector(indicator));
      };
      if (cellHas('base', sel.focus) || cellHas('base', sel.select)) {
        throw new Error(`${renderer} base state must show no focus or selection indicator.`);
      }
      if (!cellHas('focused', sel.focus) || cellHas('focused', sel.select)) {
        throw new Error(`${renderer} focused state must show only the focus indicator.`);
      }
      if (!cellHas('selected', sel.select) || cellHas('selected', sel.focus)) {
        throw new Error(`${renderer} selected state must show only the selection indicator.`);
      }
      if (!cellHas('both', sel.focus) || !cellHas('both', sel.select)) {
        throw new Error(`${renderer} focused+selected state must show BOTH indicators (independent axes).`);
      }
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 인코딩 토큰 카탈로그를 확인합니다. 카드와 swatch 그리드가 좁은 폭에서 접히되 가로 스크롤을 만들지 않아야 합니다.',
  ),
  render: () => (
    <div data-encoding-narrow style={{ width: 320, maxWidth: '100%' }}>
      <EncodingCatalog />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-encoding-narrow]');
    if (!fixture) throw new Error('The narrow encoding fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('The encoding catalog must not create horizontal overflow at 320px.');
    }
  },
};

export const EncodingVisualParity = {
  ...Overview,
  name: 'Navigation encoding visual parity',
  tags: ['!dev', 'visual-parity'],
};
