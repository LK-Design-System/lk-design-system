import React from 'react';
import { Map2DCanvas, SpatialRegion } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Regions',
  component: SpatialRegion,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-regions--spatial-region-overview',
      eyebrow: 'Robotics / Navigation Regions',
      title: '공간 영역은 행동 규칙·설비 범위·지형 통행성을 서로 다른 의미로 보여줍니다',
      description:
        '운영자가 지도에서 진입 금지, 승강기 객실, 경사면처럼 면적을 가진 조건을 구분해야 할 때 사용합니다. 점 위치에는 Waypoint, 선 연결에는 Lane, 설비의 진행 상태에는 Facility Transition이 적합합니다.',
    },
    docs: {
      description: {
        component: '행동·설비·지형 영역을 renderer-neutral 데이터와 SVG reference fragment로 표현하는 LK Robotics extension입니다.',
      },
    },
  },
};

export default meta;

const keepOutRegion = {
  id: 'keep-out-west',
  mapId: 'warehouse-1f',
  label: '서측 적재 구역',
  category: 'behavior',
  rule: { kind: 'keep-out' },
  shape: {
    kind: 'polygon',
    points: [
      { x: 32, y: 38 },
      { x: 194, y: 38 },
      { x: 184, y: 126 },
      { x: 44, y: 126 },
    ],
  },
};

const liftCabinRegion = {
  id: 'lift-cabin-a',
  mapId: 'warehouse-1f',
  label: '화물 승강기 A',
  category: 'facility',
  kind: 'lift-cabin',
  facilityId: 'lift-a',
  shape: { kind: 'circle', center: { x: 318, y: 84 }, radius: 48 },
};

const slopeRegion = {
  id: 'slope-east',
  mapId: 'warehouse-1f',
  label: '동측 램프',
  category: 'terrain',
  kind: 'slope',
  traversability: 'restricted',
  grade: { value: 8, unit: 'percent', directionRad: 1.57 },
  shape: {
    kind: 'polygon',
    points: [
      { x: 88, y: 178 },
      { x: 412, y: 178 },
      { x: 390, y: 254 },
      { x: 112, y: 254 },
    ],
  },
};

function MapFloor({ width = 480, height = 288 }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      <rect x="12" y="12" width={width - 24} height={height - 24} rx="8" fill="var(--viewer-surface)" stroke="var(--viewer-border)" vectorEffect="non-scaling-stroke" />
      <path d={`M24 ${height / 2}H${width - 24}M${width / 2} 24V${height - 24}`} fill="none" stroke="var(--viewer-border)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

function RegionMap({ children, appearance = 'light', width = 480, height = 288, label = '공간 영역 지도', testId }) {
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

function OverviewFixture() {
  const [selectedId, setSelectedId] = React.useState(liftCabinRegion.id);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 720px)' }}>
      <RegionMap testId="region-overview-map">
        {[keepOutRegion, liftCabinRegion, slopeRegion].map((region) => (
          <SpatialRegion
            key={region.id}
            region={region}
            selected={selectedId === region.id}
            onActivate={setSelectedId}
          />
        ))}
      </RegionMap>
      <output data-testid="selected-region" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>
        선택: {selectedId}
      </output>
    </main>
  );
}

export const SpatialRegionOverview = {
  name: '개요',
  parameters: storyDescription(
    '진입 금지 행동 영역, 승강기 객실 설비 영역, 8% 경사 지형 영역을 한 지도에서 비교합니다. category는 서로 다른 pattern과 라벨로 구분되고, 선택은 원래 의미 stroke를 지우지 않는 별도 외곽선으로 표시되어야 합니다.',
  ),
  render: () => <OverviewFixture />,
  play: async ({ canvasElement }) => {
    const regions = Array.from(canvasElement.querySelectorAll('[data-lds-spatial-region]'));
    if (regions.length !== 3) throw new Error(`Expected three region categories, received ${regions.length}.`);

    const patterns = new Map(regions.map((region) => [region.dataset.regionCategory, region.dataset.regionPattern]));
    if (patterns.get('behavior') !== 'diagonal' || patterns.get('facility') !== 'grid' || patterns.get('terrain') !== 'contour') {
      throw new Error(`Region category patterns are incomplete: ${JSON.stringify(Object.fromEntries(patterns))}`);
    }

    const slope = canvasElement.querySelector('[data-region-id="slope-east"]');
    const slopeName = slope?.getAttribute('aria-label') ?? '';
    if (!slopeName.includes('8%') || !slopeName.includes('1.57 rad') || !slopeName.includes('제한 통행')) {
      throw new Error(`Slope grade, direction, and traversability must remain explicit: ${slopeName}`);
    }

    const scalingStrokes = canvasElement.querySelectorAll('[data-lds-spatial-region] [vector-effect]');
    if (scalingStrokes.length === 0 || Array.from(scalingStrokes).some((node) => node.getAttribute('vector-effect') !== 'non-scaling-stroke')) {
      throw new Error('Every region stroke must remain non-scaling.');
    }
  },
};

const speedRegion = {
  ...keepOutRegion,
  id: 'speed-zone',
  label: '교차 통로',
  rule: { kind: 'speed-limit', speedLimitMps: 0.8 },
};

const unknownTerrain = {
  ...slopeRegion,
  id: 'terrain-unknown',
  label: '검사 전 램프',
  traversability: 'unknown',
};

export const DarkPatternsAndStates = {
  name: '변형·상태 · 다크와 패턴',
  parameters: {
    ...storyDescription(
      '다크 지도에서 0.8m/s 속도 제한, 상태 미확인 지형, 선택·지연·오류 설비 영역을 비교합니다. category 자체가 성공/경고색이 되지 않고 실제 rule과 traversability가 상태 tone을 결정하는지 확인하세요.',
    ),
    backgrounds: { default: 'Navy' },
  },
  render: () => (
    <main style={{ width: 'min(100%, 720px)' }}>
      <RegionMap appearance="dark" label="다크 공간 영역 지도">
        <SpatialRegion region={speedRegion} />
        <SpatialRegion region={unknownTerrain} />
        <SpatialRegion region={liftCabinRegion} selected stale />
        <SpatialRegion
          region={{
            ...liftCabinRegion,
            id: 'invalid-door-area',
            label: '좌표 검증 필요',
            kind: 'door-area',
            shape: { kind: 'circle', center: { x: 420, y: 214 }, radius: 30 },
          }}
          invalid
        />
      </RegionMap>
    </main>
  ),
};

const filteredRegion = {
  ...keepOutRegion,
  id: 'other-map-region',
  mapId: 'warehouse-2f',
};

const hiddenRegion = {
  ...liftCabinRegion,
  id: 'hidden-region',
};

const disabledRegion = {
  ...liftCabinRegion,
  id: 'disabled-region',
  label: '권한 없는 충전 구역',
  kind: 'charger-area',
  shape: { kind: 'circle', center: { x: 370, y: 210 }, radius: 42 },
};

function InteractionFixture() {
  const activeMapId = 'warehouse-1f';
  const [activation, setActivation] = React.useState({ id: '없음', count: 0 });
  const regions = [slopeRegion, filteredRegion, hiddenRegion, disabledRegion];
  const activate = (id) => setActivation((current) => ({ id, count: current.count + 1 }));

  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: 'min(100%, 720px)' }}>
      <RegionMap testId="region-interaction-map" label="영역 상호작용 지도">
        {regions
          .filter((region) => region.mapId === activeMapId)
          .map((region) => (
            <SpatialRegion
              key={region.id}
              region={region}
              hidden={region.id === hiddenRegion.id}
              disabled={region.id === disabledRegion.id}
              tabIndex={region.id === disabledRegion.id ? 0 : undefined}
              onActivate={activate}
            />
          ))}
      </RegionMap>
      <output hidden data-testid="region-activation" data-activation-count={activation.count}>
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
    'renderer가 active map에 속한 region만 전달하고, 컴포넌트는 hidden과 disabled를 적용하는 상황입니다. pointer·Enter·Space가 같은 inspect callback을 호출하며 disabled region은 소비자가 tabIndex 0을 넘겨도 초점 순서와 실행에서 제외되어야 합니다.',
  ),
  render: () => <InteractionFixture />,
  play: async ({ canvasElement }) => {
    const visible = canvasElement.querySelector('[data-region-id="slope-east"]');
    const disabled = canvasElement.querySelector('[data-region-id="disabled-region"]');
    if (!visible || !disabled) throw new Error('Visible and disabled active-map regions must render.');
    if (canvasElement.querySelector('[data-region-id="other-map-region"]') || canvasElement.querySelector('[data-region-id="hidden-region"]')) {
      throw new Error('Renderer filtering and hidden behavior must remove unrelated regions.');
    }
    if (disabled.tabIndex !== -1 || disabled.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled interactive regions must override consumer tabIndex and expose aria-disabled.');
    }

    const view = canvasElement.ownerDocument.defaultView;
    visible.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    await waitForRender();
    visible.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await waitForRender();
    visible.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await waitForRender();

    const output = canvasElement.querySelector('[data-testid="region-activation"]');
    if (output?.dataset.activationCount !== '3' || !output.textContent?.includes('slope-east')) {
      throw new Error(`Pointer, Enter, and Space must activate the same region callback: ${output?.textContent}`);
    }

    disabled.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await waitForRender();
    if (output?.dataset.activationCount !== '3') throw new Error('Disabled region activation must be blocked.');
  },
};

const narrowSpeedRegion = {
  ...speedRegion,
  id: 'narrow-speed',
  shape: {
    kind: 'polygon',
    points: [
      { x: 18, y: 34 },
      { x: 300, y: 34 },
      { x: 286, y: 112 },
      { x: 30, y: 112 },
    ],
  },
};

const narrowSlopeRegion = {
  ...slopeRegion,
  id: 'narrow-slope',
  shape: {
    kind: 'polygon',
    points: [
      { x: 28, y: 164 },
      { x: 292, y: 164 },
      { x: 270, y: 248 },
      { x: 48, y: 248 },
    ],
  },
};

export const NarrowWidth = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 지도에서 속도 제한과 경사 라벨을 함께 읽는 상황입니다. SVG fragment와 screen-space 라벨이 페이지 가로 스크롤을 만들지 않고 viewport 안에서 잘리는지 확인하세요.',
  ),
  render: () => (
    <div data-testid="narrow-region-shell" style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
      <RegionMap width={320} height={280} label="320px 공간 영역 지도" testId="narrow-region-map">
        <SpatialRegion region={narrowSpeedRegion} />
        <SpatialRegion region={narrowSlopeRegion} />
      </RegionMap>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-testid="narrow-region-shell"]');
    const map = canvasElement.querySelector('[data-testid="narrow-region-map"]');
    if (!shell || !map) throw new Error('Narrow region fixture is missing.');
    if (shell.scrollWidth > shell.clientWidth || map.scrollWidth > map.clientWidth) {
      throw new Error(`Region map must not create horizontal overflow: shell ${shell.scrollWidth}/${shell.clientWidth}, map ${map.scrollWidth}/${map.clientWidth}.`);
    }
    if (shell.getBoundingClientRect().width > 320.5) throw new Error('Narrow region shell exceeds 320px.');
  },
};

export const SpatialRegionVisualParity = {
  ...DarkPatternsAndStates,
  name: 'Spatial region visual parity',
  tags: ['!dev', 'visual-parity'],
};
