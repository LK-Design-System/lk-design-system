import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Map2DCanvas, RobotMarker } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';
import { NavigationMapStage } from './RoboticsNavigationStage.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Robot Marker',
  component: RobotMarker,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-robot-marker--overview',
      eyebrow: 'Robotics / Robot Marker',
      title: '로봇 마커는 실시간 위치와 방향을 지도 위에 표시합니다',
      description:
        '운영자가 로봇의 현재 pose(위치 + 방향)와 물리 footprint를 한 평면에서 확인할 때 적합합니다. 계획 경로나 예측·관측 궤적에는 RobotMarker 대신 Route 또는 Trajectory 계열을 사용하세요 — RobotMarker는 현재 한 점의 자세만 소유하고 경로·진행을 그리지 않습니다.',
    },
    docs: {
      description: {
        component:
          'RobotMarker는 renderer-neutral RobotPoseData를 한 SVG g 조각으로 표현합니다. 화면 고정 원형 body + heading 노즈로 위치·방향을, 옵션 world-space footprint로 물리 크기를 전달하며, 선택·포커스·검증·freshness는 색 외 표식과 접근 가능한 이름으로 함께 전달됩니다. Lane·Route·Trajectory가 위임해 온 로봇 자세 레이어의 reference 구현입니다.',
      },
    },
  },
};

export default meta;

const OVERVIEW_POSES = [
  { id: 'amr-7', label: 'AMR 7', mapId: 'L1', position: { x: 150, y: 170 }, headingRad: 0.4, footprintRadius: 24 },
  { id: 'amr-3', label: 'AMR 3', mapId: 'L1', position: { x: 380, y: 96 }, headingRad: -1.9 },
  { id: 'amr-9', label: 'AMR 9', mapId: 'L1', position: { x: 470, y: 200 }, headingRad: 3.1 },
];

const STATE_POSES = [
  { key: 'default', label: '실시간', props: {} },
  { key: 'selected', label: '선택', props: { selected: true } },
  { key: 'focused', label: '포커스', props: { focused: true } },
  { key: 'stale', label: '지연 데이터', props: { stale: true } },
  { key: 'invalid', label: '데이터 오류', props: { invalid: true } },
  { key: 'disabled', label: '비활성', props: { disabled: true, onActivate: () => {} } },
];

function RobotMapSurface({ poses, selectedId, markerStates = {}, onActivate, appearance = 'light', width = 640, height = 280, label }) {
  return (
    <Map2DCanvas
      appearance={appearance}
      label={label || `${appearance === 'dark' ? '어두운' : '밝은'} 로봇 위치 지도`}
      controls={false}
      grid={false}
      style={{ width: '100%', height }}
    >
      {({ viewport }) => (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="group" aria-label={label} style={{ display: 'block', overflow: 'visible' }}>
          <NavigationMapStage width={width} height={height} eyebrow="MAP L1" north />
          {poses.map((pose) => (
            <RobotMarker
              key={pose.id}
              pose={pose}
              viewportScale={viewport.z}
              selected={selectedId === pose.id || markerStates[pose.id]?.selected}
              focused={markerStates[pose.id]?.focused}
              disabled={markerStates[pose.id]?.disabled}
              invalid={markerStates[pose.id]?.invalid}
              stale={markerStates[pose.id]?.stale}
              onActivate={onActivate}
            />
          ))}
        </svg>
      )}
    </Map2DCanvas>
  );
}

function OverviewFixture() {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 900, minWidth: 0 }}>
      <RobotMapSurface poses={OVERVIEW_POSES} height={300} label="1층 로봇 위치·방향 지도" />
      <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 1.6 }}>
        원형 body는 화면 크기 고정, footprint(AMR 7)는 지도 좌표라 줌과 함께 커집니다. heading 노즈가 방향을, 색이 실시간·지연·오류를 전달합니다.
      </p>
    </main>
  );
}

function SelectionFixture() {
  const [selectedId, setSelectedId] = React.useState('amr-7');
  const [count, setCount] = React.useState(0);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 900, minWidth: 0 }}>
      <RobotMapSurface
        poses={OVERVIEW_POSES}
        selectedId={selectedId}
        onActivate={(id) => { setSelectedId(id); setCount((c) => c + 1); }}
        height={300}
        label="로봇 선택 지도"
      />
      <p data-activation-log style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', fontVariantNumeric: 'tabular-nums' }}>
        선택 활성화 <span data-activation-count="">{count}</span>회
      </p>
    </main>
  );
}

function StatesFixture() {
  return (
    <main data-robot-states style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-3)', width: '100%', maxWidth: 900, minWidth: 0 }}>
      {STATE_POSES.map((state) => (
        <figure key={state.key} data-robot-state-cell={state.key} style={{ margin: 0, display: 'grid', gap: 8, justifyItems: 'center', padding: 12, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <svg width={72} height={72} viewBox="0 0 72 72" aria-hidden="true" style={{ display: 'block' }}>
            <RobotMarker
              pose={{ id: `state-${state.key}`, label: state.label, mapId: 'L1', position: { x: 36, y: 36 }, headingRad: -0.5 }}
              viewportScale={1}
              showLabel={false}
              {...state.props}
            />
          </svg>
          <figcaption style={{ fontSize: 11, color: 'var(--color-semantic-label-strong)' }}>{state.label}</figcaption>
        </figure>
      ))}
    </main>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '같은 지도에서 여러 로봇의 실시간 pose를 비교하는 대표 뷰입니다. 원형 body·heading 노즈·footprint·색이 위치·방향·물리 크기·freshness를 전달하는지, 그리고 이 모양이 경로 진행 화살표와 구분되는지 확인하세요.',
  ),
  render: () => <OverviewFixture />,
  play: async ({ canvasElement }) => {
    const robot = canvasElement.querySelector('[data-robot-id="amr-7"]');
    if (!robot) throw new Error('Robot overview marker is missing.');
    const name = robot.getAttribute('aria-label') || '';
    if (!name.includes('AMR 7') || !name.includes('지도 L1') || !name.includes('방향') || !name.includes('실시간 위치')) {
      throw new Error(`Robot accessible name lost identity or pose semantics: ${name}`);
    }
    if (robot.getAttribute('data-has-heading') !== 'true' || !robot.querySelector('[data-robot-body] circle')) {
      throw new Error('Robot pose must render a round body with a heading.');
    }
    if (!robot.querySelector('[data-robot-footprint]')) {
      throw new Error('AMR 7 must render its world-space footprint ring.');
    }
    // One shape per meaning: the robot must not reuse the path-arrow vocabulary.
    if (robot.querySelector('[data-navigation-progress-head], [data-lane-direction], [data-navigation-direction-chevron]')) {
      throw new Error('Robot pose must not reuse the direction chevron or progress dart vocabulary.');
    }
  },
};

export const Selection = {
  name: '상호작용 · 선택과 활성화',
  parameters: storyDescription(
    '지도의 로봇을 포인터·키보드로 선택·활성화하는 계약을 확인합니다. 클릭·Enter가 로봇을 선택(aria-pressed)하고, :focus-visible 미러링과 반복 keydown 억제가 지켜져야 합니다.',
  ),
  render: () => <SelectionFixture />,
  play: async ({ canvasElement }) => {
    const target = canvasElement.querySelector('[data-robot-id="amr-3"]');
    if (!target) throw new Error('Robot selection marker is missing.');
    await userEvent.click(target);
    await waitFor(() => {
      if (target.getAttribute('aria-pressed') !== 'true') throw new Error('Pointer activation did not select the robot.');
    });
    target.focus();
    await waitFor(() => {
      if (!target.querySelector('[data-robot-selected-indicator]')) throw new Error('Selected robot lost its selection indicator.');
    });
  },
};

export const States = {
  name: '변형·상태 · 실시간·선택·포커스·지연·오류·비활성',
  parameters: storyDescription(
    '로봇 pose의 상태 어휘를 나란히 비교합니다. 포커스(파랑 실루엣, 바깥)와 선택(accent 실루엣, 안쪽)은 독립 축이고, 지연은 점선 링 + opacity, 오류는 danger body + exclamation, 비활성은 opacity로 색 외 표식과 함께 전달됩니다.',
  ),
  render: () => <StatesFixture />,
  play: async ({ canvasElement }) => {
    const selected = canvasElement.querySelector('[data-robot-state-cell="selected"] [data-robot-selected-indicator]');
    const focused = canvasElement.querySelector('[data-robot-state-cell="focused"] [data-robot-focus-indicator]');
    const stale = canvasElement.querySelector('[data-robot-state-cell="stale"] [data-robot-stale-indicator]');
    const invalid = canvasElement.querySelector('[data-robot-state-cell="invalid"] [data-robot-invalid-indicator]');
    const disabledCell = canvasElement.querySelector('[data-robot-state-cell="disabled"] [data-robot-marker]');
    if (!selected || !focused || !stale || !invalid) {
      throw new Error('Robot state matrix is missing a non-color state indicator.');
    }
    if (disabledCell?.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled robot must expose aria-disabled.');
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 뷰포트 폭에서 로봇 지도가 페이지를 밀어내지 않고, 시각 label을 감춰도 접근성 이름이 위치·방향을 유지하는지 확인합니다.',
  ),
  render: () => (
    <div data-robot-narrow style={{ width: 320, maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <RobotMapSurface poses={OVERVIEW_POSES} height={220} label="320px 로봇 지도" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-robot-narrow]');
    if (!fixture) throw new Error('The narrow robot fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('The robot map must not create horizontal overflow at 320px.');
    }
  },
};
