import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Map2DCanvas, WaypointMarker } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Waypoint',
  component: WaypointMarker,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-waypoint--overview',
      eyebrow: 'Robotics / Waypoint',
      title: '웨이포인트는 지도 위치와 겹칠 수 있는 역할을 함께 설명합니다',
      description:
        '운영자가 내비게이션 그래프의 지점을 선택하고 holding·passthrough·parking·charger 역할과 시설 주석을 확인할 때 적합합니다. 면적을 가진 구역이나 실제 주행 궤적에는 Waypoint 대신 Region 또는 Trajectory 계열을 사용하세요.',
    },
    docs: {
      description: {
        component:
          'WaypointMarker는 renderer-neutral WaypointData를 한 SVG g 조각으로 표현합니다. 역할은 중첩 가능하고, availability와 선택·포커스·검증·freshness 상태는 색 외 표식과 접근 가능한 이름으로 함께 전달됩니다.',
      },
    },
  },
};

export default meta;

const ROLE_NAMES = {
  holding: '대기 가능',
  passthrough: '정차 금지 통과',
  parking: '비상 주차',
  charger: '충전',
};

const overviewWaypoints = [
  {
    id: 'wp-holding',
    label: 'Hold A',
    mapId: 'L1',
    position: { x: 78, y: 78 },
    roles: ['holding'],
    availability: 'available',
  },
  {
    id: 'wp-passthrough',
    label: 'Corridor 2',
    mapId: 'L1',
    position: { x: 260, y: 78 },
    roles: ['passthrough'],
    availability: 'available',
  },
  {
    id: 'wp-parking',
    label: 'Park 03',
    mapId: 'L1',
    position: { x: 420, y: 188 },
    roles: ['parking'],
    availability: 'available',
  },
  {
    id: 'wp-charger',
    label: 'Charge B',
    mapId: 'L1',
    position: { x: 610, y: 188 },
    roles: ['holding', 'charger'],
    annotations: [{ kind: 'dock', label: 'Charging dock B', sourceId: 'dock-b' }],
    availability: 'unknown',
  },
];

const comparisonWaypoints = [
  {
    id: 'wp-comparison-hold',
    label: 'Hold',
    mapId: 'L2',
    position: { x: 72, y: 70 },
    roles: ['holding'],
    availability: 'available',
  },
  {
    id: 'wp-comparison-lift',
    label: 'Lift A',
    mapId: 'L2',
    position: { x: 224, y: 142 },
    roles: ['holding', 'parking'],
    annotations: [{ kind: 'lift-approach', label: 'Lift A approach', sourceId: 'lift-a' }],
    availability: 'available',
  },
  {
    id: 'wp-comparison-dock',
    label: 'Dock 2',
    mapId: 'L2',
    position: { x: 386, y: 70 },
    roles: ['charger'],
    annotations: [{ kind: 'dock', label: 'Dock 2', sourceId: 'dock-2' }],
    availability: 'unavailable',
  },
];

const compoundWaypoints = [
  {
    id: 'wp-compound',
    label: 'Lift lobby A',
    mapId: 'L3',
    position: { x: 104, y: 74 },
    roles: ['holding', 'parking', 'charger'],
    annotations: [
      { kind: 'lift-approach', label: 'Lift A approach', sourceId: 'lift-a' },
      { kind: 'door-approach', label: 'Lift A outer door', sourceId: 'door-l3-a' },
      { kind: 'mutex', label: 'Lift A lobby mutex', sourceId: 'mutex-lift-a' },
    ],
    availability: 'available',
  },
  {
    id: 'wp-stale',
    label: 'Clean 4',
    mapId: 'L3',
    position: { x: 314, y: 74 },
    roles: ['holding'],
    annotations: [{ kind: 'cleaning', label: 'Cleaning station 4', sourceId: 'clean-4' }],
    availability: 'available',
  },
  {
    id: 'wp-invalid',
    label: 'Transfer',
    mapId: 'L3',
    position: { x: 492, y: 74 },
    roles: ['passthrough'],
    annotations: [
      { kind: 'dispenser', label: 'Material dispenser', sourceId: 'disp-1' },
      { kind: 'ingestor', label: 'Material ingestor', sourceId: 'ing-1' },
    ],
    availability: 'unknown',
  },
  {
    id: 'wp-unavailable',
    label: 'Dock 7',
    mapId: 'L3',
    position: { x: 210, y: 196 },
    roles: ['parking', 'charger'],
    annotations: [{ kind: 'dock', label: 'Dock 7', sourceId: 'dock-7' }],
    availability: 'unavailable',
  },
  {
    id: 'wp-disabled',
    label: 'Vendor point',
    mapId: 'L3',
    position: { x: 430, y: 196 },
    annotations: [{ kind: 'custom', label: 'Vendor calibration point', sourceId: 'vendor-17' }],
    availability: 'available',
  },
];

function semanticsText(waypoint) {
  const roles = (waypoint.roles || []).map((role) => ROLE_NAMES[role]).join(' · ');
  const annotations = (waypoint.annotations || []).map((annotation) => annotation.label).join(' · ');
  return [roles, annotations, `가용성 ${waypoint.availability || 'unknown'}`].filter(Boolean).join(' / ');
}

function WaypointGraphic({
  waypoints,
  viewportScale,
  selectedId,
  markerStates = {},
  onActivate,
  width = 700,
  height = 260,
  label = '내비게이션 그래프 웨이포인트',
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="group"
      aria-label={label}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <rect
        x="20"
        y="20"
        width={width - 40}
        height={height - 40}
        rx="8"
        fill="var(--viewer-surface)"
        stroke="var(--viewer-border)"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M42 ${height * 0.32} H${width * 0.72} V${height * 0.74} H${width - 42}`}
        fill="none"
        stroke="var(--viewer-muted)"
        strokeWidth="2"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />
      {waypoints.map((waypoint) => (
        <WaypointMarker
          key={waypoint.id}
          waypoint={waypoint}
          viewportScale={viewportScale}
          selected={selectedId === waypoint.id || markerStates[waypoint.id]?.selected}
          onActivate={onActivate}
          {...markerStates[waypoint.id]}
        />
      ))}
    </svg>
  );
}

function MapSurface({
  waypoints,
  selectedId,
  markerStates,
  onActivate,
  appearance = 'light',
  width = 700,
  height = 300,
  label,
}) {
  return (
    <Map2DCanvas
      label={label || `${appearance === 'dark' ? '어두운' : '밝은'} 웨이포인트 지도`}
      appearance={appearance}
      controls={false}
      grid={false}
      style={{ width: '100%', height }}
    >
      {({ viewport }) => (
        <WaypointGraphic
          waypoints={waypoints}
          viewportScale={viewport.z}
          selectedId={selectedId}
          markerStates={markerStates}
          onActivate={onActivate}
          width={width}
          height={height}
        />
      )}
    </Map2DCanvas>
  );
}

function SemanticWaypointList({ waypoints, selectedId, onSelect, compact = false }) {
  return (
    <section aria-labelledby={compact ? 'narrow-waypoint-list' : 'waypoint-list'} style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
      <h2
        id={compact ? 'narrow-waypoint-list' : 'waypoint-list'}
        style={{ margin: 0, fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)' }}
      >
        같은 순서의 목록 선택
      </h2>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          gap: 'var(--space-2)',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {waypoints.map((waypoint) => (
          <li key={waypoint.id} style={{ minWidth: 0 }}>
            <Button
              data-semantic-waypoint={waypoint.id}
              type="button"
              variant={selectedId === waypoint.id ? 'secondary' : 'ghost'}
              size="sm"
              full
              aria-pressed={selectedId === waypoint.id}
              onClick={(event) => onSelect(waypoint.id, event)}
              style={{ height: 'auto', minHeight: 'var(--control-h-sm)', justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal' }}
            >
              <span style={{ display: 'grid', gap: 'var(--space-0)', minWidth: 0 }}>
                <strong>{waypoint.label} · {waypoint.mapId}</strong>
                <span style={{
                  // When selected the item flips to the `secondary` button
                  // variant, whose fill is a dark graphite (secondary-normal).
                  // The light-theme neutral label has no contrast on that fill,
                  // so on selection mute the button's own inverse (white) label
                  // instead — keeping the subtext legible and below the title.
                  color: selectedId === waypoint.id
                    ? 'color-mix(in srgb, var(--color-semantic-inverse-label) 80%, transparent)'
                    : 'var(--color-semantic-label-neutral)',
                  fontSize: 'var(--caption1-size)',
                  lineHeight: 'var(--caption1-line)',
                }}>
                  {semanticsText(waypoint)}
                </span>
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OverviewFixture() {
  const [selectedId, setSelectedId] = React.useState('wp-holding');
  const [activation, setActivation] = React.useState('선택 대기');

  const selectWaypoint = (waypointId, event) => {
    setSelectedId(waypointId);
    setActivation(`${waypointId} · ${event.type}`);
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 900, minWidth: 0 }}>
      <MapSurface
        waypoints={overviewWaypoints}
        selectedId={selectedId}
        onActivate={selectWaypoint}
        height={300}
        label="1층 웨이포인트 역할 지도"
      />
      <SemanticWaypointList waypoints={overviewWaypoints} selectedId={selectedId} onSelect={selectWaypoint} />
      <p data-activation-log style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', fontVariantNumeric: 'tabular-nums' }}>
        마지막 선택: {activation}
      </p>
    </main>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '같은 내비게이션 그래프에서 대기·통과·주차·충전 역할과 중첩 역할을 비교하고 지도 또는 목록에서 선택합니다. 지도 표식과 목록의 순서·이름·상태가 일치하고 어느 입력 경로에서도 같은 waypoint id가 선택되는지 확인하세요.',
  ),
  render: () => <OverviewFixture />,
  play: async ({ canvasElement }) => {
    const holding = canvasElement.querySelector('[data-waypoint-id="wp-holding"]');
    const passthrough = canvasElement.querySelector('[data-waypoint-id="wp-passthrough"]');
    if (!holding || !passthrough) throw new Error('Waypoint overview markers are incomplete.');

    const name = holding.getAttribute('aria-label') || '';
    if (!name.includes('Hold A') || !name.includes('map L1') || !name.includes('holding point') || !name.includes('availability available')) {
      throw new Error(`Waypoint accessible name lost identity or semantics: ${name}`);
    }

    await userEvent.click(passthrough);
    await waitFor(() => {
      if (passthrough.getAttribute('aria-pressed') !== 'true') throw new Error('Pointer activation did not select the waypoint.');
    });

    holding.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (holding.getAttribute('aria-pressed') !== 'true') throw new Error('Enter did not activate the focused waypoint.');
    });

    passthrough.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => {
      if (passthrough.getAttribute('aria-pressed') !== 'true') throw new Error('Space did not activate the focused waypoint.');
    });

    const listChoice = canvasElement.querySelector('[data-semantic-waypoint="wp-charger"]');
    await userEvent.click(listChoice);
    await waitFor(() => {
      const marker = canvasElement.querySelector('[data-waypoint-id="wp-charger"]');
      if (marker?.getAttribute('aria-pressed') !== 'true') throw new Error('The semantic list did not select the matching map waypoint.');
    });

    if (canvasElement.querySelector('[aria-live], [role="status"], [role="alert"]')) {
      throw new Error('Waypoint selection must not create a redundant live region.');
    }
  },
};

export const LightAndDark = {
  name: '변형·상태 · 밝은·어두운 지도',
  parameters: storyDescription(
    '같은 웨이포인트와 운영 상태를 light·dark 지도에서 나란히 비교합니다. 배경이 바뀌어도 지점·라벨·역할 코드·unavailable 사선의 상대 우선순위와 의미가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 940 }}>
      <section aria-labelledby="waypoint-light" style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <strong id="waypoint-light">Light</strong>
        <MapSurface waypoints={comparisonWaypoints} appearance="light" width={460} height={260} />
      </section>
      <section aria-labelledby="waypoint-dark" style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0 }}>
        <strong id="waypoint-dark">Dark</strong>
        <MapSurface waypoints={comparisonWaypoints} appearance="dark" width={460} height={260} />
      </section>
    </main>
  ),
};

function CompoundStateFixture() {
  const [activation, setActivation] = React.useState('none');
  const markerStates = {
    'wp-compound': { selected: true },
    'wp-stale': { stale: true },
    'wp-invalid': { invalid: true },
    'wp-unavailable': { focused: true },
    'wp-disabled': { disabled: true },
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 760, minWidth: 0 }}>
      <MapSurface
        waypoints={compoundWaypoints}
        markerStates={markerStates}
        onActivate={(waypointId) => setActivation(waypointId)}
        width={620}
        height={280}
        label="중첩 역할과 운영 상태 지도"
      />
      <p hidden data-compound-activation>
        activated: {activation}
      </p>
    </main>
  );
}

export const CompoundRolesAndStates = {
  name: '변형·상태 · 중첩 역할과 운영 상태',
  parameters: storyDescription(
    '여러 역할·시설 주석이 겹친 지점과 selected·focused·stale·invalid·unavailable·disabled 상태를 한 지도에서 비교합니다. 역할이 한 kind로 축약되지 않고 각 상태가 색 이외의 링·점선·사선·X로 구분되는지 확인하세요.',
  ),
  render: () => <CompoundStateFixture />,
  play: async ({ canvasElement }) => {
    const disabled = canvasElement.querySelector('[data-waypoint-id="wp-disabled"]');
    const unavailable = canvasElement.querySelector('[data-waypoint-id="wp-unavailable"]');
    const log = canvasElement.querySelector('[data-compound-activation]');
    if (!disabled || !unavailable || !log) throw new Error('Compound waypoint fixture is incomplete.');

    const before = log.textContent;
    await userEvent.click(disabled);
    const view = canvasElement.ownerDocument.defaultView;
    disabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    disabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await waitFor(() => {
      if (log.textContent !== before) throw new Error('Disabled waypoint emitted an activation.');
    });

    await userEvent.click(unavailable);
    await waitFor(() => {
      if (!log.textContent.includes('wp-unavailable')) throw new Error('Unavailable waypoint must remain inspectable.');
    });

    if (!canvasElement.querySelector('[data-waypoint-selected-indicator]')) throw new Error('Selected waypoint lost its solid ring.');
    if (!canvasElement.querySelector('[data-waypoint-focus-indicator]')) throw new Error('Focused waypoint lost its focus indicator.');
    if (!canvasElement.querySelector('[data-waypoint-stale-indicator]')) throw new Error('Stale waypoint lost its dashed halo.');
    if (!canvasElement.querySelector('[data-waypoint-invalid-indicator]')) throw new Error('Invalid waypoint lost its X indicator.');
    if (!canvasElement.querySelector('[data-waypoint-unavailable-indicator]')) throw new Error('Unavailable waypoint lost its slash indicator.');
  },
};

const zoomWaypoint = {
  id: 'wp-zoom',
  label: 'Zoom target',
  mapId: 'L4',
  position: { x: 60, y: 52 },
  roles: ['holding'],
  availability: 'available',
};

export const ZoomAndHitArea = {
  name: '상호작용 · 확대·축소와 입력 면적',
  parameters: storyDescription(
    '50%·100%·200% 세계 배율에서 같은 waypoint를 비교합니다. 위치는 world transform을 따르되 marker와 24px 투명 입력 면적은 화면 크기를 유지하고 stroke가 배율에 따라 두꺼워지지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', width: '100%', maxWidth: 720 }}>
      {[0.5, 1, 2].map((zoom) => (
        <figure key={zoom} data-zoom-sample={zoom} style={{ display: 'grid', gap: 'var(--space-2)', margin: 0 }}>
          <svg
            width="180"
            height="120"
            viewBox="0 0 180 120"
            role="group"
            aria-label={`${Math.round(zoom * 100)}% waypoint 배율`}
            style={{ display: 'block', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}
          >
            <g transform={`scale(${zoom})`}>
              <WaypointMarker waypoint={zoomWaypoint} viewportScale={zoom} showLabel={false} onActivate={() => {}} />
            </g>
          </svg>
          <figcaption style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>
            {Math.round(zoom * 100)}%
          </figcaption>
        </figure>
      ))}
    </main>
  ),
  play: async ({ canvasElement }) => {
    const samples = [...canvasElement.querySelectorAll('[data-zoom-sample]')];
    if (samples.length !== 3) throw new Error('Zoom samples are incomplete.');

    samples.forEach((sample) => {
      const zoom = Number(sample.dataset.zoomSample);
      const screenSpace = sample.querySelector('[data-waypoint-screen-space]');
      const hitArea = sample.querySelector('[data-waypoint-hit-area]');
      const point = sample.querySelector('[data-waypoint-point]');
      if (!screenSpace || !hitArea || !point) throw new Error(`Zoom ${zoom} marker anatomy is incomplete.`);

      const expectedTransform = `scale(${1 / zoom})`;
      if (screenSpace.getAttribute('transform') !== expectedTransform) {
        throw new Error(`Zoom ${zoom} did not apply inverse screen scaling.`);
      }
      if (hitArea.getAttribute('data-screen-target-size') !== '24' || Number(hitArea.getAttribute('r')) * 2 < 24) {
        throw new Error(`Zoom ${zoom} lost the 24px activation target.`);
      }
      if (point.getAttribute('vector-effect') !== 'non-scaling-stroke') {
        throw new Error(`Zoom ${zoom} point stroke scales with the world.`);
      }

      const bounds = hitArea.getBoundingClientRect();
      if (bounds.width < 23.5 || bounds.height < 23.5) {
        throw new Error(`Zoom ${zoom} rendered hit area below 24 CSS px: ${bounds.width}×${bounds.height}.`);
      }
    });
  },
};

const narrowWaypoints = [
  { ...overviewWaypoints[0], position: { x: 58, y: 58 } },
  { ...overviewWaypoints[3], position: { x: 190, y: 142 } },
];

function NarrowFixture() {
  const [selectedId, setSelectedId] = React.useState('wp-holding');
  return (
    <div data-narrow-waypoint-frame style={{ display: 'grid', gap: 'var(--space-4)', width: 320, maxWidth: '100%', minWidth: 0 }}>
      <MapSurface
        waypoints={narrowWaypoints}
        selectedId={selectedId}
        onActivate={setSelectedId}
        width={300}
        height={220}
        label="320px 웨이포인트 지도"
      />
      <SemanticWaypointList compact waypoints={narrowWaypoints} selectedId={selectedId} onSelect={setSelectedId} />
    </div>
  );
}

export const NarrowWidth = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 작업 영역에서 지도와 동일 순서의 목록 선택 경로를 세로로 배치합니다. waypoint 라벨과 역할 정보가 가로 overflow를 만들지 않고 지도 표식이 좁아져도 목록에서 같은 항목을 선택할 수 있는지 확인하세요.',
  ),
  render: () => <NarrowFixture />,
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-narrow-waypoint-frame]');
    if (!frame) throw new Error('Narrow waypoint frame is missing.');
    if (frame.scrollWidth > frame.clientWidth) {
      throw new Error(`Waypoint narrow layout overflowed: ${frame.scrollWidth}px > ${frame.clientWidth}px.`);
    }

    const listChoice = canvasElement.querySelector('[data-semantic-waypoint="wp-charger"]');
    await userEvent.click(listChoice);
    await waitFor(() => {
      const marker = canvasElement.querySelector('[data-waypoint-id="wp-charger"]');
      if (marker?.getAttribute('aria-pressed') !== 'true') throw new Error('Narrow semantic selection did not reach the map marker.');
    });
  },
};
