import React from 'react';
import { FacilityTransition, HazardMarker, WaypointMarker } from '../src/index.js';
import { NavigationStateGlyph } from '../components/robotics/_NavigationStateGlyph.js';
import {
  navStateOpacity,
  NAV_STATE_OPACITY,
  NAV_DASH,
  NAV_PIN,
  NAV_HIT,
  NAV_STATE_BADGE,
  NAV_LABEL_HALO,
} from '../components/robotics/_navigationVocabulary.js';
import { storyDescription } from './StoryGuide.shared.jsx';

// This page renders the REAL shared vocabulary — every dash, opacity, badge,
// hit target, and halo swatch is drawn straight from the internal
// `_navigationVocabulary` constants, and the pin family renders the production
// marker fragments. So the catalog is not a hand-drawn approximation: it IS the
// atoms, and the play-test asserts the rendered DOM equals the constants, which
// makes the vocabulary its own regression baseline.
const STAGE = 'stage';

const INK = 'var(--color-semantic-label-strong)';
const MUTED = 'var(--color-semantic-label-neutral)';
const LINE = 'var(--color-semantic-line-normal-normal)';
const SURFACE = 'var(--color-semantic-background-elevated-normal)';
const ACCENT = 'var(--viewer-accent, var(--color-semantic-primary-normal))';

// The map-pin family (Facility + Hazard share NAV_PIN); the waypoint origin is
// the contrasting circle marker, not a pin.
const ORIGIN_WAYPOINT = {
  id: 'enc-wp',
  label: '원점',
  mapId: STAGE,
  position: { x: 28, y: 26 },
  roles: ['holding'],
  availability: 'available',
};
const ACCENT_FACILITY = {
  id: 'enc-fac',
  kind: 'door',
  label: '자동문',
  facilityId: 'door',
  from: { mapId: STAGE, position: { x: 28, y: 30 } },
  availability: 'available',
  event: 'open',
  doorState: 'moving',
};
const HAZARD_PIN = {
  id: 'enc-hz',
  kind: 'stairs',
  label: '계단',
  mapId: STAGE,
  position: { x: 28, y: 26 },
  severity: 'danger',
};

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

function PinFamily() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
      <Tile label="웨이포인트 원점 (원형 마커)" mono="circle">
        <svg width={88} height={92} viewBox="0 0 56 52" aria-hidden="true" style={{ display: 'block' }}>
          <WaypointMarker waypoint={ORIGIN_WAYPOINT} showLabel={false} />
        </svg>
      </Tile>
      <Tile label="설비 핀 (accent · NAV_PIN)" mono="NAV_PIN">
        <svg width={88} height={100} viewBox="0 -14 56 64" aria-hidden="true" style={{ display: 'block' }}>
          <FacilityTransition transition={ACCENT_FACILITY} activeMapId={STAGE} showLabel={false} />
        </svg>
      </Tile>
      <Tile label="해저드 핀 (severity · NAV_PIN)" mono="NAV_PIN">
        <svg width={88} height={92} viewBox="0 0 56 52" aria-hidden="true" style={{ display: 'block' }}>
          <HazardMarker hazard={HAZARD_PIN} showLabel={false} />
        </svg>
      </Tile>
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

function EncodingCatalog() {
  return (
    <main data-encoding-catalog style={{ width: 'min(880px, 100%)', display: 'grid', gap: 16 }}>
      <Card title="핀 패밀리" hint="설비·해저드 마커는 같은 map-pin 실루엣(NAV_PIN)을 공유하고 accent·severity 색과 knockout 글리프로만 구분됩니다. 웨이포인트 원점은 핀이 아닌 원형 마커입니다.">
        <PinFamily />
      </Card>
      <Card title="선(dash) 어휘" hint="작은 링과 구역·설비 외곽선에서 같은 상태는 같은 dash로 읽힙니다. 값은 NAV_DASH에서 그대로 렌더됩니다.">
        <DashSwatches />
      </Card>
      <Card title="상태 opacity" hint="비활성 0.45, 지연 0.76, 기본 1 — navStateOpacity() 한 함수를 일곱 렌더러가 공유합니다.">
        <OpacitySwatches />
      </Card>
      <Card title="상태 badge · hit target" hint="상태 글리프 뒤 원형 chip(NAV_STATE_BADGE)과 투명 WCAG 2.2 타깃(NAV_HIT). 화면 타깃은 data-screen-target-size 계약으로 고정됩니다.">
        <BadgeAndHit />
      </Card>
      <Card title="라벨 halo 계층" hint="paint-order stroke로 텍스트 뒤에 깔리는 legibility halo. 식별·상세·메타 세 단계를 NAV_LABEL_HALO가 소유합니다.">
        <HaloSwatches />
      </Card>
    </main>
  );
}

const meta = {
  title: 'LDS Robotics/Foundation/Line & State Vocabulary',
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-foundation-line-state-vocabulary--overview',
      eyebrow: 'Foundation / Line & State Vocabulary',
      title: '내비게이션 렌더러가 공유하는 선·상태 어휘를 원자 단위로 문서화합니다',
      description:
        '웨이포인트·설비·해저드·차선·경로·궤적·구역 렌더러가 한 지도에서 하나의 시스템으로 읽히도록, 이들이 공유하는 선·상태 인코딩 값을 내부 모듈 _navigationVocabulary가 단일 소스로 소유합니다. 이 페이지는 그 값(상태 opacity·dash·map-pin 기하·hit target·상태 badge·label halo 계층)을 프로덕션 조각과 실제 마커로 그대로 렌더해, 어휘 자체가 회귀 기준이 되도록 합니다. path·segment·status dash처럼 component 고유 encoding은 각 렌더러 로컬로 남습니다. 공개 API가 아닌 내부 모듈입니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 렌더러들이 공유하는 선·상태 인코딩 값을 내부 모듈 _navigationVocabulary에서 그대로 렌더해 문서화·회귀합니다: 상태 opacity(navStateOpacity), NAV_DASH, NAV_PIN, NAV_HIT, NAV_STATE_BADGE, NAV_LABEL_HALO. 공개 API가 아닌 내부 어휘 모듈입니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '공유 어휘 원자를 한 페이지에서 비교합니다. 각 swatch는 _navigationVocabulary 상수에서 직접 렌더되고, 핀 패밀리는 실제 마커 조각입니다. play-test가 렌더된 DOM이 상수와 일치함을 단언하므로 이 페이지가 곧 어휘의 회귀 기준입니다.',
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
    const hit = root.querySelector('[data-encoding-hit]');
    if (
      hit?.getAttribute('r') !== String(NAV_HIT.radius) ||
      hit?.getAttribute('data-screen-target-size') !== String(NAV_HIT.screenTargetSize)
    ) {
      throw new Error('The hit-target swatch must render NAV_HIT radius and screen target size.');
    }

    // Pin family — the real hazard marker consumes the shared NAV_PIN silhouette,
    // and the facility + waypoint markers render alongside it.
    const hazardSign = root.querySelector('[data-hazard-sign]');
    if (hazardSign?.getAttribute('d') !== NAV_PIN.path) {
      throw new Error('The hazard pin must consume the shared NAV_PIN.path silhouette.');
    }
    if (!root.querySelector('[data-transition-kind]') || !root.querySelector('[data-waypoint-point]')) {
      throw new Error('The pin family must render the facility pin and the waypoint origin.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 어휘 카탈로그를 확인합니다. 카드와 swatch 그리드가 좁은 폭에서 접히되 가로 스크롤을 만들지 않아야 합니다.',
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
