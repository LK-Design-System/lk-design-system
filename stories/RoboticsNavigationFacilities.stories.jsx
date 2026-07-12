import React from 'react';
import { Map2DCanvas, FacilityTransition, SpatialRegion } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Facility Transition',
  component: FacilityTransition,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-facility-transition--facility-transition-overview',
      eyebrow: 'Robotics / Facility Transition',
      title: '설비 전이는 문·승강기·도킹의 위치와 진행 상태를 분리해 보여줍니다',
      description:
        '경로가 문, 승강기, 도크를 통과하면서 어느 endpoint와 설비 상태를 기다리는지 확인해야 할 때 사용합니다. 면적을 가진 객실·로비에는 Spatial Region이, 실제 설비 명령과 세션 제어에는 제품 runtime이 적합합니다.',
    },
    docs: {
      description: {
        component: '제품이 제공한 door/lift/dock 상태를 독립 축으로 표시하는 renderer-neutral LK Robotics SVG fragment입니다.',
      },
    },
  },
};

export default meta;

function MapFloor({ width = 400, height = 260 }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      <rect x="12" y="12" width={width - 24} height={height - 24} rx="8" fill="var(--viewer-surface)" stroke="var(--viewer-border)" vectorEffect="non-scaling-stroke" />
      <path d={`M24 ${height - 70}H${width - 24}M${width - 112} 24V${height - 24}`} fill="none" stroke="var(--viewer-border)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

function TransitionMap({ children, appearance = 'light', width = 400, height = 260, label, testId }) {
  return (
    <Map2DCanvas
      data-testid={testId}
      label={label}
      appearance={appearance}
      controls={false}
      panEnabled={false}
      wheelZoom={false}
      keyboard={false}
      grid={false}
      style={{ width: '100%', maxWidth: width, height: 'auto', aspectRatio: `${width} / ${height}` }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="group" style={{ display: 'block', width: '100%', height: 'auto' }} aria-label={label}>
        <MapFloor width={width} height={height} />
        {children}
      </svg>
    </Map2DCanvas>
  );
}

function cabinRegion(mapId, id, label, center) {
  return {
    id,
    mapId,
    label,
    category: 'facility',
    kind: 'lift-cabin',
    facilityId: 'lift-a',
    shape: { kind: 'circle', center, radius: 44 },
  };
}

const liftTransition = {
  id: 'lift-a-1f-2f',
  kind: 'lift',
  label: '화물 승강기 A',
  facilityId: 'lift-a',
  from: {
    mapId: 'warehouse-1f',
    position: { x: 54, y: 188 },
    label: '1층 승강기 접근 지점',
    waypointId: 'lift-a-approach-1f',
    regionId: 'lift-cabin-1f',
    doorId: 'lift-a-door-1f',
  },
  to: {
    mapId: 'warehouse-2f',
    position: { x: 54, y: 188 },
    label: '2층 승강기 도착 지점',
    waypointId: 'lift-a-exit-2f',
    regionId: 'lift-cabin-2f',
    doorId: 'lift-a-door-2f',
  },
  availability: 'available',
  phase: 'approach',
  doorState: 'closed',
  motionState: 'stopped',
  operatingMode: 'agv',
  sessionState: 'requested',
  currentMapId: 'warehouse-1f',
  destinationMapId: 'warehouse-2f',
};

const arrivalLiftTransition = {
  ...liftTransition,
  phase: 'arrival',
  doorState: 'open',
  sessionState: 'owned',
  currentMapId: 'warehouse-2f',
  destinationMapId: 'warehouse-2f',
};

const firstFloorCabin = cabinRegion('warehouse-1f', 'lift-cabin-1f', '1층 객실', { x: 326, y: 88 });
const secondFloorCabin = cabinRegion('warehouse-2f', 'lift-cabin-2f', '2층 객실', { x: 326, y: 88 });

export const FacilityTransitionOverview = {
  name: '개요',
  parameters: storyDescription(
    '같은 설비 identity가 1층의 접근 상태에서 2층의 도착 상태로 바뀌는 compound 상황입니다. 각 map에서 from/to endpoint와 phase·문·이동·운영 모드·세션 상태가 독립적으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 880 }}>
      <section aria-labelledby="lift-map-1f" style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <strong id="lift-map-1f">1층 · 접근</strong>
        <TransitionMap label="1층 승강기 접근 지도" testId="lift-map-from">
          <path d="M54 188H264Q282 188 282 170V132" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="3" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" aria-hidden="true" />
          <SpatialRegion region={firstFloorCabin} />
          <FacilityTransition transition={liftTransition} activeMapId="warehouse-1f" selected />
        </TransitionMap>
      </section>
      <section aria-labelledby="lift-map-2f" style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <strong id="lift-map-2f">2층 · 도착 상태</strong>
        <TransitionMap label="2층 승강기 도착 지도" testId="lift-map-to">
          <path d="M54 188H264Q282 188 282 170V132" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="3" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" aria-hidden="true" />
          <SpatialRegion region={secondFloorCabin} />
          <FacilityTransition transition={arrivalLiftTransition} activeMapId="warehouse-2f" />
        </TransitionMap>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const transitions = Array.from(canvasElement.querySelectorAll('[data-transition-id="lift-a-1f-2f"]'));
    if (transitions.length !== 2) throw new Error(`Multi-map lift must render one endpoint per map: ${transitions.length}.`);
    if (transitions[0].dataset.visibleEndpoint !== 'from' || transitions[1].dataset.visibleEndpoint !== 'to') {
      throw new Error(`Lift endpoints are not mapped correctly: ${transitions.map((node) => node.dataset.visibleEndpoint).join(',')}`);
    }

    const from = transitions[0];
    const expectedAxes = {
      liftPhase: 'approach',
      doorState: 'closed',
      motionState: 'stopped',
      operatingMode: 'agv',
      sessionState: 'requested',
      currentMapId: 'warehouse-1f',
      destinationMapId: 'warehouse-2f',
    };
    for (const [key, value] of Object.entries(expectedAxes)) {
      if (from.dataset[key] !== value) throw new Error(`Lift axis ${key} must remain explicit: ${from.dataset[key]}`);
    }
    const name = from.getAttribute('aria-label') ?? '';
    if (!name.includes('접근 중') || !name.includes('문 닫힘') || !name.includes('정지') || !name.includes('AGV 모드') || !name.includes('세션 요청됨')) {
      throw new Error(`Lift axes must remain independently named: ${name}`);
    }
    if (!from.querySelector('[data-transition-selection-ring]')) throw new Error('Selected lift transition requires a distinct selection ring.');
  },
};

const unavailableDoor = {
  id: 'door-unavailable',
  kind: 'door',
  label: '서측 자동문',
  facilityId: 'door-west',
  from: { mapId: 'warehouse-1f', position: { x: 42, y: 54 }, label: '서측 통로', doorId: 'door-west' },
  to: { mapId: 'warehouse-1f', position: { x: 70, y: 54 }, label: '적재 구역', doorId: 'door-west' },
  availability: 'unavailable',
  doorState: 'open',
  event: 'pass',
};

const offlineLiftMode = {
  ...liftTransition,
  id: 'lift-offline-mode',
  label: '승강기 B',
  facilityId: 'lift-b',
  from: { mapId: 'warehouse-1f', position: { x: 56, y: 146 }, label: '1층 로비' },
  to: { mapId: 'warehouse-2f', position: { x: 56, y: 146 }, label: '2층 로비' },
  availability: 'available',
  phase: 'waiting',
  operatingMode: 'offline',
  sessionState: 'none',
};

const unknownDock = {
  id: 'dock-unknown',
  kind: 'dock',
  label: '도크 03',
  facilityId: 'dock-03',
  from: { mapId: 'warehouse-1f', position: { x: 42, y: 236 }, label: '도크 접근로' },
  availability: 'unknown',
  phase: 'approach',
};

export const AvailabilityAndSourceStates = {
  name: '변형·상태 · 가용성·오프라인·미확인',
  parameters: {
    ...storyDescription(
      '사용 불가이지만 열린 문, source가 available로 보낸 상태에서 operating mode만 offline인 승강기, 가용성을 알 수 없는 도크를 비교합니다. availability를 내부 축에서 추론하지 않고 slash·점선·물음표와 텍스트로 함께 전달해야 합니다.',
    ),
    backgrounds: { default: 'Navy' },
  },
  render: () => (
    <main style={{ width: 'min(100%, 680px)' }}>
      <TransitionMap appearance="dark" width={520} height={290} label="다크 설비 전이 상태 지도">
        <FacilityTransition transition={unavailableDoor} activeMapId="warehouse-1f" />
        <FacilityTransition transition={offlineLiftMode} activeMapId="warehouse-1f" selected />
        <FacilityTransition transition={unknownDock} activeMapId="warehouse-1f" />
      </TransitionMap>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const door = canvasElement.querySelector('[data-transition-id="door-unavailable"]');
    const lift = canvasElement.querySelector('[data-transition-id="lift-offline-mode"]');
    const dock = canvasElement.querySelector('[data-transition-id="dock-unknown"]');
    if (!door || !lift || !dock) throw new Error('Facility source-state examples are incomplete.');
    if (door.dataset.transitionAvailability !== 'unavailable' || door.dataset.doorState !== 'open' || !door.querySelector('[data-transition-unavailable-mark]')) {
      throw new Error('Door state and unavailable state must remain independent and color-independent.');
    }
    if (lift.dataset.transitionAvailability !== 'available' || lift.dataset.operatingMode !== 'offline') {
      throw new Error('Offline operating mode must not overwrite source-provided availability.');
    }
    if (dock.dataset.transitionAvailability !== 'unknown' || !dock.textContent?.includes('?')) {
      throw new Error('Unknown availability requires a question mark and text label.');
    }
  },
};

const activeDoor = {
  ...unavailableDoor,
  id: 'active-door',
  label: '동측 자동문',
  facilityId: 'door-east',
  from: { mapId: 'warehouse-1f', position: { x: 62, y: 70 }, label: '동측 통로', doorId: 'door-east' },
  to: { mapId: 'warehouse-1f', position: { x: 98, y: 70 }, label: '포장 구역', doorId: 'door-east' },
  availability: 'available',
  doorState: 'moving',
  event: 'open',
};

const otherMapLift = {
  ...liftTransition,
  id: 'other-map-lift',
  from: { mapId: 'warehouse-2f', position: { x: 60, y: 140 } },
  to: { mapId: 'warehouse-3f', position: { x: 60, y: 140 } },
  currentMapId: 'warehouse-2f',
  destinationMapId: 'warehouse-3f',
};

const hiddenDock = {
  ...unknownDock,
  id: 'hidden-dock',
  from: { mapId: 'warehouse-1f', position: { x: 60, y: 210 } },
};

const disabledLift = {
  ...liftTransition,
  id: 'disabled-lift',
  label: '권한 제한 승강기',
  from: { mapId: 'warehouse-1f', position: { x: 52, y: 200 } },
  to: undefined,
};

function InteractionFixture() {
  const [activation, setActivation] = React.useState({ id: '없음', count: 0 });
  const activate = (id) => setActivation((current) => ({ id, count: current.count + 1 }));
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 680px)' }}>
      <TransitionMap label="설비 전이 상호작용 지도" testId="facility-interaction-map">
        <FacilityTransition transition={activeDoor} activeMapId="warehouse-1f" onActivate={activate} />
        <FacilityTransition transition={otherMapLift} activeMapId="warehouse-1f" onActivate={activate} />
        <FacilityTransition transition={hiddenDock} activeMapId="warehouse-1f" hidden onActivate={activate} />
        <FacilityTransition transition={disabledLift} activeMapId="warehouse-1f" disabled tabIndex={0} onActivate={activate} />
      </TransitionMap>
      <output data-testid="facility-activation" data-activation-count={activation.count}>
        활성화: {activation.id} · {activation.count}회
      </output>
    </main>
  );
}

function waitForRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

export const InteractionAndMapFiltering = {
  name: '상호작용 · 활성화와 지도 필터',
  parameters: storyDescription(
    'activeMapId로 현재 map endpoint만 선택하고 hidden·disabled를 적용하는 상황입니다. pointer·Enter·Space는 같은 inspect callback을 호출하며, 다른 층 transition과 숨김 transition은 DOM에 남지 않아야 합니다.',
  ),
  render: () => <InteractionFixture />,
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelector('[data-transition-id="active-door"]');
    const disabled = canvasElement.querySelector('[data-transition-id="disabled-lift"]');
    if (!active || !disabled) throw new Error('Active and disabled facility transitions must render.');
    if (canvasElement.querySelector('[data-transition-id="other-map-lift"]') || canvasElement.querySelector('[data-transition-id="hidden-dock"]')) {
      throw new Error('Unrelated-map and hidden facility transitions must not render.');
    }
    if (disabled.tabIndex !== -1 || disabled.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled transition must override consumer tabIndex and expose aria-disabled.');
    }
    const hitArea = active.querySelector('[data-transition-hit-area]');
    if (!hitArea || Number(hitArea.getAttribute('r')) * Math.SQRT2 < 24) {
      throw new Error('Interactive facility transition needs a circular target containing 24×24 CSS px.');
    }

    const view = canvasElement.ownerDocument.defaultView;
    active.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    await waitForRender();
    active.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await waitForRender();
    active.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await waitForRender();

    const output = canvasElement.querySelector('[data-testid="facility-activation"]');
    if (output?.dataset.activationCount !== '3' || !output.textContent?.includes('active-door')) {
      throw new Error(`Pointer and keyboard activation must share one callback: ${output?.textContent}`);
    }
    disabled.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await waitForRender();
    if (output?.dataset.activationCount !== '3') throw new Error('Disabled transition activation must be blocked.');
  },
};

const narrowLift = {
  ...liftTransition,
  id: 'narrow-lift',
  label: '승강기 A',
  from: { ...liftTransition.from, position: { x: 24, y: 62 } },
  phase: 'moving',
  motionState: 'up',
  sessionState: 'owned',
};

const narrowDoor = {
  ...activeDoor,
  id: 'narrow-door',
  label: '자동문 B',
  from: { mapId: 'warehouse-1f', position: { x: 16, y: 192 } },
  to: { mapId: 'warehouse-1f', position: { x: 32, y: 192 } },
};

export const NarrowWidth = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 지도에서 이동 중 승강기와 문 전이 라벨을 함께 읽는 상황입니다. screen-space marker와 다중 상태 라벨이 viewport 밖 페이지 overflow를 만들지 않아야 합니다.',
  ),
  render: () => (
    <div data-testid="narrow-facility-shell" style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
      <TransitionMap width={320} height={280} label="320px 설비 전이 지도" testId="narrow-facility-map">
        <FacilityTransition transition={narrowLift} activeMapId="warehouse-1f" />
        <FacilityTransition transition={narrowDoor} activeMapId="warehouse-1f" />
      </TransitionMap>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-testid="narrow-facility-shell"]');
    const map = canvasElement.querySelector('[data-testid="narrow-facility-map"]');
    if (!shell || !map) throw new Error('Narrow facility fixture is missing.');
    if (shell.scrollWidth > shell.clientWidth || map.scrollWidth > map.clientWidth) {
      throw new Error(`Facility map must not create horizontal overflow: shell ${shell.scrollWidth}/${shell.clientWidth}, map ${map.scrollWidth}/${map.clientWidth}.`);
    }
    if (shell.getBoundingClientRect().width > 320.5) throw new Error('Narrow facility shell exceeds 320px.');
  },
};

export const FacilityTransitionVisualParity = {
  ...AvailabilityAndSourceStates,
  name: 'Facility transition visual parity',
  tags: ['!dev', 'visual-parity'],
};
