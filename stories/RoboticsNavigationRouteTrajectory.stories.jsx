import React from 'react';
import { waitFor } from 'storybook/test';
import {
  Button,
  RouteOverlay,
  TrajectoryOverlay,
  WaypointMarker,
  LaneOverlay,
  SpatialRegion,
  FacilityTransition,
  LayerPanel,
  SelectionInspector,
  Legend,
  Map2DCanvas,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Route and Trajectory',
  component: RouteOverlay,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-route-and-trajectory--route-and-trajectory-overview',
      eyebrow: 'Robotics / Navigation / Route and Trajectory',
      title: '계획된 그래프 경로와 로봇의 조밀한 궤적은 서로 다른 계층입니다',
      description:
        'Route는 graph segment의 phase와 condition을, Trajectory는 한 지도에서 시간 순서로 이어진 조밀한 sample을 보여줍니다. 두 선이 비슷해 보여도 상태와 진행 의미를 합치지 마세요. 정적 그래프 연결에는 Lane이, 자유 공간의 조밀한 궤적에는 Trajectory가 적합합니다.',
    },
    docs: {
      description: {
        component:
          '층별 planned graph segment와 single-map dense trajectory를 구분해 표현하는 LK Robotics Navigation Extension입니다.',
      },
    },
  },
};

export default meta;

const ACTIVE_ROUTE = {
  id: 'route-delivery-17',
  label: '배송 경로 17',
  status: 'active',
  segments: [
    {
      id: 'segment-l1-completed',
      mapId: 'L1',
      label: '입구 → 교차로',
      points: [{ x: 44, y: 196 }, { x: 130, y: 196 }, { x: 190, y: 154 }],
      laneIds: ['lane-entry', 'lane-corridor-a'],
      phase: 'completed',
      condition: 'normal',
    },
    {
      id: 'segment-l1-current',
      mapId: 'L1',
      label: '교차로 → Lift A',
      points: [{ x: 190, y: 154 }, { x: 284, y: 112 }, { x: 456, y: 112 }],
      laneIds: ['lane-corridor-b'],
      exitTransitionId: 'transition-lift-a',
      phase: 'current',
      condition: 'waiting',
    },
    {
      id: 'segment-l2-upcoming',
      mapId: 'L2',
      label: 'Lift A → 목적지',
      points: [{ x: 72, y: 196 }, { x: 230, y: 196 }, { x: 328, y: 92 }, { x: 470, y: 92 }],
      laneIds: ['lane-l2-main'],
      entryTransitionId: 'transition-lift-a',
      phase: 'upcoming',
      condition: 'normal',
    },
  ],
  progress: { segmentId: 'segment-l1-current', fraction: 0.42 },
};

const ACTIVE_TRAJECTORY = {
  id: 'trajectory-robot-2-l1',
  label: 'Robot 2 예상 궤적',
  mapId: 'L1',
  status: 'active',
  samples: [
    { position: { x: 42, y: 218 }, timeMs: 0, headingRad: 0 },
    { position: { x: 84, y: 214 }, timeMs: 250, headingRad: -0.08 },
    { position: { x: 128, y: 204 }, timeMs: 500, headingRad: -0.18 },
    { position: { x: 170, y: 184 }, timeMs: 750, headingRad: -0.42 },
    { position: { x: 214, y: 158 }, timeMs: 1000, headingRad: -0.52 },
    { position: { x: 262, y: 136 }, timeMs: 1250, headingRad: -0.31 },
    { position: { x: 314, y: 126 }, timeMs: 1500, headingRad: -0.12 },
    { position: { x: 370, y: 124 }, timeMs: 1750, headingRad: 0 },
  ],
  currentSampleIndex: 5,
};

const L2_TRAJECTORY = {
  id: 'trajectory-robot-2-l2',
  label: 'Robot 2 L2 예상 궤적',
  mapId: 'L2',
  status: 'planned',
  samples: [
    { position: { x: 70, y: 218 }, timeMs: 2000, headingRad: 0 },
    { position: { x: 142, y: 214 }, timeMs: 2400, headingRad: -0.06 },
    { position: { x: 216, y: 198 }, timeMs: 2800, headingRad: -0.28 },
    { position: { x: 286, y: 158 }, timeMs: 3200, headingRad: -0.62 },
    { position: { x: 354, y: 112 }, timeMs: 3600, headingRad: -0.32 },
    { position: { x: 458, y: 104 }, timeMs: 4000, headingRad: 0 },
  ],
};

function StoryPage({ title, description, children, maxWidth = 1040 }) {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth, minWidth: 0 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)', maxWidth: 760 }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title3-size)', lineHeight: 'var(--title3-line)' }}>{title}</h2>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>{description}</p>
      </section>
      {children}
    </main>
  );
}

function PathMap({ appearance = 'light', label, children, height = 270, svgHeight = 250, testId }) {
  return (
    <Map2DCanvas
      appearance={appearance}
      label={label}
      controls={false}
      panEnabled={false}
      wheelZoom={false}
      keyboard={false}
      grid
      defaultViewport={{ x: 0, y: 0, z: 1 }}
      data-testid={testId}
      style={{ width: '100%', minWidth: 0, height }}
    >
      <svg
        width="540"
        height={svgHeight}
        viewBox={`0 0 540 ${svgHeight}`}
        role="group"
        aria-label={`${label}의 route와 trajectory 계층`}
        style={{ display: 'block', width: 'min(540px, calc(100cqw - 32px))', height: 'auto' }}
      >
        <path d={`M24 ${svgHeight - 26} H516 M24 28 H516`} stroke="var(--viewer-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {children}
      </svg>
    </Map2DCanvas>
  );
}

function ActivePathLayers() {
  return (
    <>
      <RouteOverlay route={ACTIVE_ROUTE} activeMapId="L1" />
      <TrajectoryOverlay trajectory={ACTIVE_TRAJECTORY} />
    </>
  );
}

export const RouteAndTrajectoryOverview = {
  name: '개요',
  parameters: storyDescription(
    '같은 이동을 표현하는 planned route와 dense trajectory를 light/dark 지도에서 비교합니다. Route의 segment pattern과 현재 구간 진행 marker, Trajectory의 조밀한 geometry와 현재 heading marker가 서로 다른 의미로 남는지 확인하세요.',
  ),
  render: () => (
    <StoryPage
      title="Route는 선택된 graph 구간을, Trajectory는 시간 순 sample을 보여줍니다"
      description="경로의 완료·현재·예정과 대기·차단·충돌은 segment에 속합니다. 궤적은 한 지도 안 sample 순서와 선택적인 현재 heading/time을 보존하며 route 진행률을 대신 계산하지 않습니다."
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: 'var(--space-4)', minWidth: 0 }}>
        <PathMap label="Light route와 trajectory 지도"><ActivePathLayers /></PathMap>
        <PathMap appearance="dark" label="Dark route와 trajectory 지도"><ActivePathLayers /></PathMap>
      </section>
    </StoryPage>
  ),
  play: async ({ canvasElement }) => {
    const routes = canvasElement.querySelectorAll('[data-lk-route-overlay]');
    const trajectories = canvasElement.querySelectorAll('[data-lk-trajectory-overlay]');
    if (routes.length !== 2 || trajectories.length !== 2) {
      throw new Error(`Light/dark layer parity failed: ${routes.length} routes, ${trajectories.length} trajectories.`);
    }
    routes.forEach((route) => {
      const paths = route.querySelectorAll('[data-route-path]');
      if (paths.length !== 2) throw new Error('L1 route must render only its two L1 segments.');
      if (!route.querySelector('[data-route-progress-marker][data-current-segment-id="segment-l1-current"]')) {
        throw new Error('Explicit current-segment progress marker is missing.');
      }
    });
    trajectories.forEach((trajectory) => {
      const path = trajectory.querySelector('[data-trajectory-path]');
      if (!path?.getAttribute('d')?.includes('L 370 124')) throw new Error('Dense trajectory geometry is incomplete.');
      if (!trajectory.querySelector('[data-trajectory-current-heading]')) throw new Error('Current sample heading marker is missing.');
    });
  },
};

const ROUTE_STATE_ROWS = [
  ['planned', 'upcoming', 'normal', 48],
  ['active', 'current', 'normal', 108],
  ['waiting', 'current', 'waiting', 168],
  ['blocked', 'current', 'blocked', 228],
  ['rerouting', 'current', 'conflict', 288],
  ['completed', 'completed', 'normal', 348],
];

function routeForState(status, phase, condition, y) {
  return {
    id: `route-${status}`,
    label: status,
    status,
    segments: [{
      id: `segment-${status}`,
      mapId: 'L1',
      label: `${phase} · ${condition}`,
      points: [{ x: 48, y }, { x: 220, y }, { x: 310, y: y - 18 }, { x: 488, y: y - 18 }],
      phase,
      condition,
    }],
    progress: status === 'active' ? { segmentId: 'segment-active', fraction: 0.55 } : undefined,
  };
}

export const RouteAndTrajectoryStates = {
  name: '변형·상태 · 구간 조건과 궤적 수명주기',
  parameters: storyDescription(
    'route status, segment phase, segment condition을 독립 조합합니다. 각 행은 색뿐 아니라 다른 line pattern과 glyph를 사용하며 rerouting trajectory도 별도 dense layer로 유지합니다.',
  ),
  render: () => (
    <StoryPage
      title="Route status와 segment phase·condition은 서로 다른 질문에 답합니다"
      description="전체 경로가 rerouting이어도 특정 segment는 conflict이고, 현재 segment가 waiting이어도 route identity와 명시적 진행 위치는 보존됩니다. 상태를 하나의 색 enum으로 압축하지 않습니다."
      maxWidth={820}
    >
      <PathMap label="route 상태와 조건 지도" height={430} svgHeight={410}>
        {ROUTE_STATE_ROWS.map(([status, phase, condition, y]) => (
          <RouteOverlay key={status} route={routeForState(status, phase, condition, y)} activeMapId="L1" />
        ))}
      </PathMap>
      <PathMap appearance="dark" label="rerouting trajectory 지도" height={220} svgHeight={200}>
        <TrajectoryOverlay
          trajectory={{
            ...ACTIVE_TRAJECTORY,
            id: 'trajectory-rerouting',
            label: '경로 재계산 중 궤적',
            status: 'rerouting',
            samples: ACTIVE_TRAJECTORY.samples.map((sample) => ({ ...sample, position: { x: sample.position.x, y: sample.position.y - 52 } })),
          }}
        />
      </PathMap>
    </StoryPage>
  ),
  play: async ({ canvasElement }) => {
    for (const condition of ['waiting', 'blocked', 'conflict']) {
      const segment = canvasElement.querySelector(`[data-condition="${condition}"]`);
      const path = segment?.querySelector('[data-route-path]');
      if (!path?.getAttribute('stroke-dasharray')) throw new Error(`${condition} segment needs a non-color line pattern.`);
      if (!segment.querySelector(`[data-route-condition-glyph="${condition}"]`)) {
        throw new Error(`${condition} segment needs a matching glyph.`);
      }
    }
    const trajectory = canvasElement.querySelector('[data-trajectory-status="rerouting"]');
    if (!trajectory?.querySelector('[data-trajectory-path]')?.getAttribute('stroke-dasharray')) {
      throw new Error('Rerouting trajectory needs a non-color dash pattern.');
    }
  },
};

function MultiFloorFixture() {
  const [activeMapId, setActiveMapId] = React.useState('L1');
  const trajectory = activeMapId === 'L1' ? ACTIVE_TRAJECTORY : L2_TRAJECTORY;
  return (
    <StoryPage
      title="층을 바꾸면 해당 층 segment와 trajectory만 남고 가상 연결선은 생기지 않습니다"
      description="Route는 activeMapId로 segment를 필터합니다. Trajectory는 하나의 map만 소유하므로 renderer가 mapId를 비교해 하나만 마운트합니다. 층 사이 이동은 Lift Facility Transition으로 이어집니다."
      maxWidth={820}
    >
      <div role="group" aria-label="표시할 층" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {['L1', 'L2'].map((mapId) => (
          <Button
            key={mapId}
            type="button"
            size="sm"
            variant={activeMapId === mapId ? 'primary' : 'secondary'}
            aria-pressed={activeMapId === mapId}
            onClick={() => setActiveMapId(mapId)}
            style={{ minWidth: 48 }}
          >
            {mapId}
          </Button>
        ))}
      </div>
      <PathMap label={`${activeMapId} route와 trajectory 지도`} testId="multi-floor-path-map">
        <RouteOverlay route={ACTIVE_ROUTE} activeMapId={activeMapId} />
        {trajectory.mapId === activeMapId && <TrajectoryOverlay trajectory={trajectory} />}
      </PathMap>
      <output data-testid="active-map-output">현재 층: {activeMapId}</output>
    </StoryPage>
  );
}

function nextRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

export const MultiFloorFiltering = {
  name: '사용법 · 층별 경로',
  parameters: storyDescription(
    'L1/L2를 전환해 route segment와 single-map trajectory가 현재 층만 렌더하는지 확인합니다. 필터 후 남은 서로 다른 층의 끝점을 이어 붙이는 path가 없어야 합니다.',
  ),
  render: () => <MultiFloorFixture />,
  play: async ({ canvasElement }) => {
    const assertMap = (mapId, routeCount, trajectoryId) => {
      const segments = Array.from(canvasElement.querySelectorAll('[data-route-segment]'));
      if (segments.length !== routeCount || segments.some((segment) => segment.getAttribute('data-map-id') !== mapId)) {
        throw new Error(`${mapId} route filtering failed: ${segments.map((segment) => segment.getAttribute('data-map-id')).join(',')}`);
      }
      const trajectory = canvasElement.querySelector('[data-lk-trajectory-overlay]');
      if (trajectory?.getAttribute('data-trajectory-id') !== trajectoryId || trajectory.getAttribute('data-map-id') !== mapId) {
        throw new Error(`${mapId} trajectory renderer filtering failed.`);
      }
    };
    assertMap('L1', 2, 'trajectory-robot-2-l1');
    canvasElement.querySelector('button[aria-pressed="false"]')?.click();
    await nextRender();
    assertMap('L2', 1, 'trajectory-robot-2-l2');
    const l2Path = canvasElement.querySelector('[data-route-path]')?.getAttribute('d') ?? '';
    if (!l2Path.startsWith('M 72 196') || l2Path.includes('190 154')) {
      throw new Error(`Cross-floor geometry was synthesized or L1 geometry leaked into L2: ${l2Path}`);
    }
  },
};

function PathActivationFixture() {
  const [selected, setSelected] = React.useState('');
  const [count, setCount] = React.useState(0);
  const select = (id) => {
    setSelected(id);
    setCount((value) => value + 1);
  };
  return (
    <StoryPage
      title="Route segment와 trajectory는 각각의 identity로 선택됩니다"
      description="segment activation은 routeId와 segmentId를 함께 전달하고 trajectory는 자체 id를 전달합니다. 선택 halo는 공유하지만 서로의 phase, progress, sample 상태를 변경하지 않습니다."
      maxWidth={820}
    >
      <PathMap label="route와 trajectory 선택 지도">
        <RouteOverlay
          route={ACTIVE_ROUTE}
          activeMapId="L1"
          selectedSegmentId={selected.startsWith('segment:') ? selected.slice(8) : undefined}
          onActivate={({ segmentId }) => select(`segment:${segmentId}`)}
        />
        <TrajectoryOverlay
          trajectory={ACTIVE_TRAJECTORY}
          selected={selected === `trajectory:${ACTIVE_TRAJECTORY.id}`}
          onActivate={(id) => select(`trajectory:${id}`)}
        />
        <RouteOverlay
          route={{
            id: 'route-disabled',
            label: '비활성 경로',
            status: 'blocked',
            segments: [{
              id: 'segment-disabled',
              mapId: 'L1',
              points: [{ x: 50, y: 232 }, { x: 480, y: 232 }],
              phase: 'current',
              condition: 'blocked',
            }],
          }}
          activeMapId="L1"
          disabled
          onActivate={({ segmentId }) => select(`segment:${segmentId}`)}
        />
      </PathMap>
      <output data-testid="path-activation-output">선택: {selected || '없음'} · activation {count}회</output>
    </StoryPage>
  );
}

export const PathSelectionAndActivation = {
  name: '상호작용 · 구간과 궤적 선택',
  parameters: storyDescription(
    'route segment와 trajectory의 accessible name, pointer·Enter/Space activation, disabled prevention과 선택 halo를 확인합니다.',
  ),
  render: () => <PathActivationFixture />,
  play: async ({ canvasElement }) => {
    const routeSegment = canvasElement.querySelector('[data-segment-id="segment-l1-current"]');
    const trajectory = canvasElement.querySelector('[data-trajectory-id="trajectory-robot-2-l1"]');
    const disabledSegment = canvasElement.querySelector('[data-segment-id="segment-disabled"]');
    const output = () => canvasElement.querySelector('[data-testid="path-activation-output"]')?.textContent ?? '';
    const view = canvasElement.ownerDocument.defaultView;
    if (!routeSegment?.getAttribute('aria-label')?.includes('현재 구간') || !trajectory?.getAttribute('aria-label')?.includes('sample')) {
      throw new Error('Route segment and trajectory need meaningful accessible names.');
    }
    routeSegment.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    await nextRender();
    routeSegment.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextRender();
    trajectory.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await nextRender();
    if (!output().includes('activation 3회') || trajectory.getAttribute('data-selected') !== 'true') {
      throw new Error(`Path activation or trajectory selection failed: ${output()}`);
    }
    if (disabledSegment.getAttribute('tabindex') !== '-1' || disabledSegment.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled route segment must expose aria-disabled and leave the Tab order.');
    }
    disabledSegment.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabledSegment.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextRender();
    if (!output().includes('activation 3회')) throw new Error('Disabled route segment invoked onActivate.');
  },
};

// ---------------------------------------------------------------------------
// N6 · Semantic mirror
//
// The map is never the only navigation path. A named, keyboard-focusable list
// mirrors the same identity and state, a LayerPanel owns controlled visibility,
// and a SelectionInspector echoes the selected object. Map fragments keep pointer
// activation but are removed from the Tab order (tabIndex={-1}); the list owns
// keyboard selection.
// ---------------------------------------------------------------------------

const MIRROR_MAP_ID = 'ops-1f';

const MIRROR_KEEPOUT_REGION = {
  id: 'zone-keepout',
  mapId: MIRROR_MAP_ID,
  label: '충전 구역 진입 금지',
  category: 'behavior',
  rule: { kind: 'keep-out' },
  shape: {
    kind: 'polygon',
    points: [{ x: 40, y: 26 }, { x: 150, y: 26 }, { x: 150, y: 94 }, { x: 40, y: 94 }],
  },
};

const MIRROR_LOBBY_REGION = {
  id: 'zone-lift-lobby',
  mapId: MIRROR_MAP_ID,
  label: '승강기 로비',
  category: 'facility',
  kind: 'lift-lobby',
  facilityId: 'lift-a',
  shape: { kind: 'circle', center: { x: 496, y: 96 }, radius: 40 },
};

const MIRROR_LANE = {
  id: 'lane-corridor',
  label: '주 통로 A→B',
  mapId: MIRROR_MAP_ID,
  points: [{ x: 96, y: 210 }, { x: 236, y: 210 }, { x: 330, y: 120 }, { x: 452, y: 110 }],
  entry: { waypointId: 'wp-pick', orientation: 'forward' },
  exit: { waypointId: 'wp-lift', orientation: 'forward', transitionIds: ['facility-lift'] },
  relation: { kind: 'single' },
  speedLimitMps: 0.8,
  mutexGroupId: 'corridor-2',
};

const MIRROR_ROUTE = {
  id: 'route-delivery-17',
  label: '배송 경로 17',
  status: 'active',
  segments: [
    {
      id: 'route-seg-completed',
      mapId: MIRROR_MAP_ID,
      label: '픽업 → 교차로',
      points: [{ x: 96, y: 210 }, { x: 200, y: 210 }, { x: 236, y: 210 }],
      laneIds: ['lane-corridor'],
      phase: 'completed',
      condition: 'normal',
    },
    {
      id: 'route-seg-current',
      mapId: MIRROR_MAP_ID,
      label: '교차로 → 승강기 A',
      points: [{ x: 236, y: 210 }, { x: 330, y: 120 }, { x: 430, y: 112 }],
      laneIds: ['lane-corridor'],
      exitTransitionId: 'facility-lift',
      phase: 'current',
      condition: 'waiting',
    },
  ],
  progress: { segmentId: 'route-seg-current', fraction: 0.42 },
};

const MIRROR_ROUTE_CURRENT_SEGMENT_ID = 'route-seg-current';

const MIRROR_TRAJECTORY = {
  id: 'trajectory-amr-7',
  label: 'AMR 7 예상 궤적',
  mapId: MIRROR_MAP_ID,
  status: 'active',
  samples: [
    { position: { x: 100, y: 224 }, timeMs: 0, headingRad: 0 },
    { position: { x: 178, y: 222 }, timeMs: 300, headingRad: -0.08 },
    { position: { x: 244, y: 210 }, timeMs: 600, headingRad: -0.4 },
    { position: { x: 312, y: 156 }, timeMs: 900, headingRad: -0.7 },
    { position: { x: 388, y: 124 }, timeMs: 1200, headingRad: -0.3 },
    { position: { x: 448, y: 118 }, timeMs: 1500, headingRad: 0 },
  ],
  currentSampleIndex: 3,
};

const MIRROR_PICK_WAYPOINT = {
  id: 'wp-pick',
  label: '픽업 지점 P1',
  mapId: MIRROR_MAP_ID,
  position: { x: 96, y: 210 },
  roles: ['holding'],
  availability: 'available',
};

const MIRROR_LIFT_WAYPOINT = {
  id: 'wp-lift',
  label: '승강기 접근 지점',
  mapId: MIRROR_MAP_ID,
  position: { x: 452, y: 104 },
  roles: ['passthrough'],
  annotations: [{ kind: 'lift-approach', label: '승강기 A 접근' }],
  availability: 'available',
};

const MIRROR_FACILITY = {
  id: 'facility-lift',
  kind: 'lift',
  label: '화물 승강기 A',
  facilityId: 'lift-a',
  from: {
    mapId: MIRROR_MAP_ID,
    position: { x: 496, y: 96 },
    label: '1층 승강기 접근 지점',
    waypointId: 'wp-lift',
    regionId: 'zone-lift-lobby',
    doorId: 'lift-a-door-1f',
  },
  to: {
    mapId: 'ops-2f',
    position: { x: 496, y: 96 },
    label: '2층 승강기 도착 지점',
    doorId: 'lift-a-door-2f',
  },
  availability: 'available',
  phase: 'approach',
  doorState: 'closed',
  motionState: 'stopped',
  operatingMode: 'agv',
  sessionState: 'requested',
  currentMapId: MIRROR_MAP_ID,
  destinationMapId: 'ops-2f',
};

// Layer identity shared by the map, the LayerPanel, the named list and the legend.
const MIRROR_LAYERS = [
  { id: 'regions', label: '영역', description: '동작·시설·지형', color: 'var(--color-semantic-status-cautionary)' },
  { id: 'lanes', label: '레인', description: '방향 그래프 연결', color: 'var(--color-semantic-primary-normal)' },
  { id: 'paths', label: '경로·궤적', description: '계획 구간과 조밀 궤적', color: 'var(--color-semantic-status-positive)' },
  { id: 'waypoints', label: '웨이포인트', description: '그래프 지점', color: 'var(--color-semantic-label-strong)' },
  { id: 'facilities', label: '설비 전이', description: '문·승강기·도크', color: 'var(--color-semantic-status-informative, var(--color-semantic-primary-normal))' },
];

// One registry drives the list, the inspector and the selection identity so the
// mirror can never drift from what the map renders.
const MIRROR_FEATURES = [
  {
    key: 'regions:zone-keepout',
    layerId: 'regions',
    listName: '충전 구역 진입 금지',
    item: { label: '충전 구역 진입 금지', kind: '동작 영역', status: '진입 금지', statusTone: 'cautionary' },
    sections: [{ title: '영역', fields: [{ label: '분류', value: '동작 · keep-out' }, { label: '형태', value: '다각형 4점' }] }],
  },
  {
    key: 'regions:zone-lift-lobby',
    layerId: 'regions',
    listName: '승강기 로비',
    item: { label: '승강기 로비', kind: '시설 영역', status: 'lift-a', statusTone: 'signal' },
    sections: [{ title: '영역', fields: [{ label: '분류', value: '시설 · lift-lobby' }, { label: '설비', value: 'lift-a' }, { label: '형태', value: '원형 r40' }] }],
  },
  {
    key: 'lanes:lane-corridor',
    layerId: 'lanes',
    listName: '주 통로 A→B',
    item: { label: '주 통로 A→B', kind: '레인', status: '통행 가능', statusTone: 'positive' },
    sections: [{ title: '토폴로지', fields: [{ label: '방향', value: 'A → B (단방향)' }, { label: '속도 제한', value: 0.8, unit: 'm/s' }, { label: '상호 배제', value: 'corridor-2' }] }],
  },
  {
    key: 'paths:route-delivery-17',
    layerId: 'paths',
    listName: '배송 경로 17',
    item: { label: '배송 경로 17', kind: '계획 경로', status: '이동 중', statusTone: 'signal' },
    sections: [{ title: '진행', fields: [{ label: '현재 구간', value: '교차로 → 승강기 A' }, { label: '구간 조건', value: '대기', tone: 'cautionary' }, { label: '진행률', value: '42%' }] }],
  },
  {
    key: 'paths:trajectory-amr-7',
    layerId: 'paths',
    listName: 'AMR 7 예상 궤적',
    item: { label: 'AMR 7 예상 궤적', kind: '궤적', status: '이동 중', statusTone: 'signal' },
    sections: [{ title: '샘플', fields: [{ label: 'sample 수', value: 6 }, { label: '현재 sample', value: 3 }, { label: '소속 지도', value: MIRROR_MAP_ID }] }],
  },
  {
    key: 'waypoints:wp-pick',
    layerId: 'waypoints',
    listName: '픽업 지점 P1',
    item: { label: '픽업 지점 P1', kind: '웨이포인트', status: '사용 가능', statusTone: 'positive' },
    sections: [{ title: '지점', fields: [{ label: '역할', value: 'holding' }, { label: '좌표', value: '96, 210' }] }],
  },
  {
    key: 'waypoints:wp-lift',
    layerId: 'waypoints',
    listName: '승강기 접근 지점',
    item: { label: '승강기 접근 지점', kind: '웨이포인트', status: '사용 가능', statusTone: 'positive' },
    sections: [{ title: '지점', fields: [{ label: '역할', value: 'passthrough' }, { label: '주석', value: '승강기 A 접근' }] }],
  },
  {
    key: 'facilities:facility-lift',
    layerId: 'facilities',
    listName: '화물 승강기 A',
    item: { label: '화물 승강기 A', kind: '설비 전이 · 승강기', status: '접근 중', statusTone: 'signal' },
    sections: [{ title: '독립 상태', fields: [{ label: '단계', value: '접근' }, { label: '문', value: '닫힘' }, { label: '세션', value: '요청됨' }, { label: '운영 모드', value: 'AGV' }] }],
  },
];

const MIRROR_LEGEND_ITEMS = [
  { id: 'regions', label: '영역', color: 'var(--color-semantic-status-cautionary)', shape: 'square' },
  { id: 'lanes', label: '레인 (방향선)', color: 'var(--color-semantic-primary-normal)', shape: 'line' },
  { id: 'route', label: '계획 경로 (실선)', color: 'var(--color-semantic-status-positive)', shape: 'line' },
  { id: 'trajectory', label: '궤적 (점선)', color: 'var(--color-semantic-status-positive)', shape: 'line', dashed: true },
  { id: 'waypoints', label: '웨이포인트', color: 'var(--color-semantic-label-strong)', shape: 'dot' },
  { id: 'facilities', label: '설비 전이', color: 'var(--color-semantic-primary-normal)', shape: 'dot' },
];

function featureByKey(key) {
  return MIRROR_FEATURES.find((feature) => feature.key === key);
}

function SemanticMirrorListItem({ feature, color, hidden, selected, onSelect }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-list-item={feature.key}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={onSelect}
      style={{
        display: 'grid',
        gridTemplateColumns: '10px minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        minWidth: 0,
        minHeight: 'var(--control-h-md)',
        padding: 'var(--space-1) var(--space-2)',
        border: 0,
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'var(--color-semantic-fill-normal)' : 'transparent',
        color: hidden ? 'var(--color-semantic-label-alternative)' : 'var(--color-semantic-label-normal)',
        boxShadow: focused ? 'inset 0 0 0 2px var(--color-semantic-focus-indicator)' : 'none',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--label2-size)',
        lineHeight: 'var(--label2-line)',
        textAlign: 'left',
      }}
    >
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: color, opacity: hidden ? 0.4 : 1 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feature.listName}</span>
      {hidden && (
        <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-semibold)' }}>
          숨김
        </span>
      )}
    </button>
  );
}

function SemanticMirrorFixture() {
  const [selectedKey, setSelectedKey] = React.useState('');
  const [visibleLayerIds, setVisibleLayerIds] = React.useState(MIRROR_LAYERS.map((layer) => layer.id));

  const isVisible = (layerId) => visibleLayerIds.includes(layerId);
  const selectedFeature = selectedKey ? featureByKey(selectedKey) : undefined;
  const selectedLayerHidden = selectedFeature ? !isVisible(selectedFeature.layerId) : false;

  const routeSelected = selectedKey === 'paths:route-delivery-17';
  const layerPanelLayers = MIRROR_LAYERS.map((layer) => ({
    id: layer.id,
    label: layer.label,
    description: layer.description,
    visible: isVisible(layer.id),
    tone: 'neutral',
  }));

  const inspectorItem = selectedFeature
    ? {
        ...selectedFeature.item,
        status: selectedLayerHidden ? '숨김 레이어' : selectedFeature.item.status,
        statusTone: selectedLayerHidden ? undefined : selectedFeature.item.statusTone,
      }
    : undefined;
  const inspectorSections = selectedFeature
    ? (selectedLayerHidden
        ? [{ title: '표시', fields: [{ label: '레이어', value: '숨김', tone: 'cautionary' }] }, ...selectedFeature.sections]
        : selectedFeature.sections)
    : [];

  return (
    <StoryPage
      title="지도, 이름 있는 목록, 레이어, 선택 요약이 같은 identity와 상태를 공유합니다"
      description="지도의 도형은 pointer로 선택되지만 Tab 순서에서는 빠집니다(tabindex=-1). 키보드 사용자는 오른쪽의 이름 있는 목록으로 같은 객체를 선택하고, LayerPanel은 표시 여부를 제어하며, 선택 요약과 범례는 색뿐 아니라 형태·패턴으로 계층을 구분합니다."
      maxWidth={1120}
    >
      <div
        data-testid="semantic-mirror"
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          width: '100%',
          minWidth: 0,
        }}
      >
        {/* The map spans the full width so its inverse-scaled SVG features render
            at their intended screen size (>=24 CSS px); a cramped column would
            downscale the whole SVG and shrink the pointer targets below 24px. */}
        <section aria-label="내비게이션 지도" style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
          <PathMap label="레이어·목록·선택이 연동된 내비게이션 지도" testId="mirror-map" height={300} svgHeight={290}>
            {isVisible('regions') && (
              <>
                <SpatialRegion
                  region={MIRROR_KEEPOUT_REGION}
                  tabIndex={-1} showLabel={false}
                  selected={selectedKey === 'regions:zone-keepout'}
                  onActivate={() => setSelectedKey('regions:zone-keepout')}
                />
                <SpatialRegion
                  region={MIRROR_LOBBY_REGION}
                  tabIndex={-1} showLabel={false}
                  selected={selectedKey === 'regions:zone-lift-lobby'}
                  onActivate={() => setSelectedKey('regions:zone-lift-lobby')}
                />
              </>
            )}
            {isVisible('lanes') && (
              <LaneOverlay
                lane={MIRROR_LANE}
                tabIndex={-1}
                selected={selectedKey === 'lanes:lane-corridor'}
                onActivate={() => setSelectedKey('lanes:lane-corridor')}
              />
            )}
            {isVisible('paths') && (
              <>
                <RouteOverlay
                  route={MIRROR_ROUTE}
                  activeMapId={MIRROR_MAP_ID}
                  tabIndex={-1}
                  showLabel={false}
                  selectedSegmentId={routeSelected ? MIRROR_ROUTE_CURRENT_SEGMENT_ID : undefined}
                  onActivate={() => setSelectedKey('paths:route-delivery-17')}
                />
                <TrajectoryOverlay
                  trajectory={MIRROR_TRAJECTORY}
                  tabIndex={-1}
                  showLabel={false}
                  selected={selectedKey === 'paths:trajectory-amr-7'}
                  onActivate={() => setSelectedKey('paths:trajectory-amr-7')}
                />
              </>
            )}
            {isVisible('waypoints') && (
              <>
                <WaypointMarker
                  waypoint={MIRROR_PICK_WAYPOINT}
                  tabIndex={-1} showLabel={false}
                  selected={selectedKey === 'waypoints:wp-pick'}
                  onActivate={() => setSelectedKey('waypoints:wp-pick')}
                />
                <WaypointMarker
                  waypoint={MIRROR_LIFT_WAYPOINT}
                  tabIndex={-1} showLabel={false}
                  selected={selectedKey === 'waypoints:wp-lift'}
                  onActivate={() => setSelectedKey('waypoints:wp-lift')}
                />
              </>
            )}
            {isVisible('facilities') && (
              <FacilityTransition
                transition={MIRROR_FACILITY}
                activeMapId={MIRROR_MAP_ID}
                tabIndex={-1}
                showLabel={false}
                selected={selectedKey === 'facilities:facility-lift'}
                onActivate={() => setSelectedKey('facilities:facility-lift')}
              />
            )}
          </PathMap>
          <Legend items={MIRROR_LEGEND_ITEMS} direction="horizontal" size="sm" aria-label="지도 계층 범례" />
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 'var(--space-4)',
            alignItems: 'start',
            minWidth: 0,
          }}
        >
        <nav aria-label="내비게이션 객체 목록" data-testid="mirror-list" style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
          {MIRROR_LAYERS.map((layer) => {
            const features = MIRROR_FEATURES.filter((feature) => feature.layerId === layer.id);
            const hidden = !isVisible(layer.id);
            return (
              <section key={layer.id} aria-label={layer.label} style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)' }}>
                  {layer.label}
                  {hidden && <span data-hidden-tag style={{ padding: '0 var(--space-1)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-fill-normal)', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption2-size)' }}>숨김</span>}
                </span>
                {features.map((feature) => (
                  <SemanticMirrorListItem
                    key={feature.key}
                    feature={feature}
                    color={layer.color}
                    hidden={hidden}
                    selected={selectedKey === feature.key}
                    onSelect={() => setSelectedKey(feature.key)}
                  />
                ))}
              </section>
            );
          })}
        </nav>

        <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
          <LayerPanel
            title="레이어"
            label="지도 레이어 표시"
            layers={layerPanelLayers}
            visibleLayerIds={visibleLayerIds}
            onVisibleLayerIdsChange={(ids) => setVisibleLayerIds(ids)}
          />
          <SelectionInspector
            item={inspectorItem}
            sections={inspectorSections}
            emptyLabel="목록이나 지도에서 객체를 선택하세요"
            onClearSelection={selectedFeature ? () => setSelectedKey('') : undefined}
          />
        </div>
        </div>
      </div>
      <output hidden data-testid="mirror-selection">
        선택: {selectedFeature ? selectedFeature.item.label : '없음'}{selectedLayerHidden ? ' · 숨김 레이어' : ''}
      </output>
    </StoryPage>
  );
}

export const SemanticMirror = {
  name: '사용법 · 레이어·목록·선택 요약',
  parameters: storyDescription(
    '지도, 이름 있는 목록, LayerPanel, SelectionInspector가 하나의 선택 identity와 상태를 공유하는 semantic mirror입니다. 목록에서 객체를 고르면 지도의 data-selected와 선택 요약이 함께 바뀌고, LayerPanel 표시 토글은 해당 계층만 감춥니다. 지도 도형은 pointer로만 선택되고 Tab 순서에서는 빠집니다.',
  ),
  render: () => <SemanticMirrorFixture />,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('[data-testid="mirror-map"]');
    const list = canvasElement.querySelector('[data-testid="mirror-list"]');
    const root = canvasElement.querySelector('[data-testid="semantic-mirror"]');
    if (!map || !list || !root) throw new Error('Semantic mirror scaffold is incomplete.');

    const inspectorHeading = () => canvasElement.querySelector('[data-testid="mirror-selection"]')?.textContent ?? '';
    const clickListItem = (key) => canvasElement.querySelector(`[data-list-item="${key}"]`)?.click();

    // 1. Selecting from the named list drives the map data-selected and the summary.
    // Match the interactive feature root by role="button": data-waypoint-id and
    // data-transition-id also appear on non-interactive lane endpoint references.
    const listSelections = [
      ['lanes:lane-corridor', '[data-lane-id="lane-corridor"]', '주 통로'],
      ['waypoints:wp-pick', '[data-waypoint-id="wp-pick"][role="button"]', '픽업 지점 P1'],
      ['facilities:facility-lift', '[data-transition-id="facility-lift"][role="button"]', '화물 승강기 A'],
    ];
    for (const [key, mapSelector, name] of listSelections) {
      clickListItem(key);
      await waitFor(() => {
        const feature = map.querySelector(mapSelector);
        if (feature?.getAttribute('data-selected') !== 'true') {
          throw new Error(`Selecting "${key}" from the list did not mark ${mapSelector} as selected.`);
        }
        if (!inspectorHeading().includes(name)) {
          throw new Error(`Selection summary did not follow the list selection for ${key}: ${inspectorHeading()}`);
        }
      });
    }

    // 2. Every interactive map fragment is out of the Tab order; the list owns keyboard.
    const mapSvg = map.querySelector('svg');
    const mapButtons = Array.from(mapSvg?.querySelectorAll('[role="button"]') ?? []);
    if (mapButtons.length === 0) throw new Error('Expected interactive map fragments.');
    for (const button of mapButtons) {
      if (button.getAttribute('tabindex') !== '-1') {
        throw new Error(`Map fragment ${button.getAttribute('aria-label') ?? ''} must be tabindex=-1.`);
      }
    }
    const listButtons = Array.from(list.querySelectorAll('button'));
    if (!listButtons.some((button) => (button.tabIndex ?? 0) >= 0)) {
      throw new Error('Named list must expose keyboard-focusable controls.');
    }

    // 3. LayerPanel visibility toggle hides only the targeted layer's fragments.
    if (!map.querySelector('[data-waypoint-id="wp-pick"][role="button"]')) throw new Error('Waypoint fragment should start visible.');
    const visibilityButtons = Array.from(canvasElement.querySelectorAll('[data-layer-action="visibility"]'));
    const waypointToggle = visibilityButtons.find((button) => (button.getAttribute('aria-label') ?? '').startsWith('웨이포인트'));
    if (!waypointToggle) throw new Error('LayerPanel waypoint visibility toggle is missing.');
    waypointToggle.click();
    await waitFor(() => {
      if (map.querySelector('[data-waypoint-id="wp-pick"][role="button"]') || map.querySelector('[data-waypoint-id="wp-lift"][role="button"]')) {
        throw new Error('Hiding the waypoint layer must remove its map fragments.');
      }
    });
    if (!map.querySelector('[data-lane-id="lane-corridor"]') || !map.querySelector('[data-transition-id="facility-lift"][role="button"]')) {
      throw new Error('Hiding one layer must not remove the others.');
    }

    // 4. A selection retained on a now-hidden layer is explicitly marked 숨김.
    clickListItem('waypoints:wp-pick');
    await waitFor(() => {
      if (!inspectorHeading().includes('숨김')) {
        throw new Error(`Selecting a feature on a hidden layer must surface a 숨김 state: ${inspectorHeading()}`);
      }
    });
    const hiddenTaggedItem = list.querySelector('[data-list-item="waypoints:wp-pick"]');
    if (!hiddenTaggedItem?.textContent?.includes('숨김')) {
      throw new Error('Hidden-layer list items must be labelled 숨김.');
    }
    waypointToggle.click();
    await waitFor(() => {
      if (!map.querySelector('[data-waypoint-id="wp-pick"][role="button"]')) {
        throw new Error('Restoring the layer must re-render its fragments.');
      }
    });

    // 5. The composed layout does not create horizontal overflow.
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error(`Semantic mirror overflowed horizontally: ${root.scrollWidth}/${root.clientWidth}.`);
    }
  },
};

export const RouteAndTrajectoryNarrow320 = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 route/trajectory viewport가 페이지를 밀어내지 않고 시각 label이 잘려도 ordinary-text mirror가 같은 identity와 상태를 제공하는지 확인합니다.',
  ),
  render: () => (
    <div data-testid="path-narrow" style={{ width: 320, maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <StoryPage
        title="좁은 화면에서도 경로 계층은 겹치지 않고 상세 정보는 목록으로 이어집니다"
        description="지도 안에 card를 겹쳐 넣지 않습니다. route와 trajectory의 선·glyph를 보존하고 아래 semantic mirror가 선택과 상세 확인의 안정적인 경로를 제공합니다."
      >
        <PathMap label="320px route와 trajectory 지도" height={230}>
          <RouteOverlay route={ACTIVE_ROUTE} activeMapId="L1" showLabel={false} viewportScale={0.8} />
          <TrajectoryOverlay trajectory={ACTIVE_TRAJECTORY} showLabel={false} viewportScale={0.8} />
        </PathMap>
        <ul aria-label="현재 경로 계층 요약" style={{ margin: 0, paddingLeft: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)' }}>
          <li>배송 경로 17 · 이동 중 · 현재 구간 42%</li>
          <li>Robot 2 예상 궤적 · sample 8개 · 현재 sample 6</li>
        </ul>
      </StoryPage>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const narrow = canvasElement.querySelector('[data-testid="path-narrow"]');
    if (!narrow || narrow.scrollWidth > narrow.clientWidth) {
      throw new Error(`Route/trajectory narrow story overflowed: ${narrow?.scrollWidth}/${narrow?.clientWidth}`);
    }
    const route = narrow.querySelector('[data-lk-route-overlay]');
    const trajectory = narrow.querySelector('[data-lk-trajectory-overlay]');
    if (!route?.getAttribute('aria-label')?.includes('현재 구간 42%')) {
      throw new Error('Hiding visual labels removed explicit route progress from the accessible name.');
    }
    if (!trajectory?.getAttribute('aria-label')?.includes('현재 sample 6')) {
      throw new Error('Hiding visual labels removed current trajectory sample from the accessible name.');
    }
  },
};
