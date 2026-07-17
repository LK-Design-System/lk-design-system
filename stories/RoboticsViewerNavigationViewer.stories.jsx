import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  RouteOverlay,
  TrajectoryOverlay,
  WaypointMarker,
  LaneOverlay,
  SpatialRegion,
  FacilityTransition,
  LayerPanel,
  SelectionInspector,
  Legend,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';
import { StoryPage, PathMap } from './RoboticsNavigationRouteTrajectory.shared.jsx';

function nextRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

// A composed navigation-viewer scene: a single pointer-only map mirrors the same
// identity and state to a named list, a LayerPanel owns controlled visibility,
// and a SelectionInspector echoes the selected object. This is a PRODUCT
// composition — the overlays are the design-system renderers, but the parallel
// named list / panel / inspector wiring is how a product assembles a viewer — so
// it lives in the Viewer group, not on a single renderer page. See
// docs/NAVIGATION_EXPRESSION_CONVENTIONS.md.
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
const mirrorRouteSegmentKey = (segmentId) => `paths:${MIRROR_ROUTE.id}:${segmentId}`;

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
// mirror can never drift from what the map renders. Inspector field values use the
// Korean vocabulary; raw enums/ids stay in the fixture props only.
const MIRROR_FEATURES = [
  {
    key: 'regions:zone-keepout',
    layerId: 'regions',
    listName: '충전 구역 진입 금지',
    item: { label: '충전 구역 진입 금지', kind: '동작 영역', status: '진입 금지', statusTone: 'cautionary' },
    sections: [{ title: '영역', fields: [{ label: '분류', value: '동작 · 진입 금지' }, { label: '형태', value: '다각형 4점' }] }],
  },
  {
    key: 'regions:zone-lift-lobby',
    layerId: 'regions',
    listName: '승강기 로비',
    item: { label: '승강기 로비', kind: '시설 영역', status: '승강기 A', statusTone: 'signal' },
    sections: [{ title: '영역', fields: [{ label: '분류', value: '시설 · 승강기 로비' }, { label: '설비', value: '화물 승강기 A' }, { label: '형태', value: '원형 r40' }] }],
  },
  {
    key: 'lanes:lane-corridor',
    layerId: 'lanes',
    listName: '주 통로 A→B',
    item: { label: '주 통로 A→B', kind: '레인', status: '통행 가능', statusTone: 'positive' },
    sections: [{ title: '토폴로지', fields: [{ label: '방향', value: 'A → B (단방향)' }, { label: '속도 제한', value: 0.8, unit: 'm/s' }, { label: '상호 배제', value: '통로 그룹 2' }] }],
  },
  {
    key: mirrorRouteSegmentKey('route-seg-completed'),
    layerId: 'paths',
    routeId: MIRROR_ROUTE.id,
    segmentId: 'route-seg-completed',
    listName: '배송 경로 17 · 픽업 → 교차로',
    item: { label: '배송 경로 17 · 픽업 → 교차로', kind: '계획 경로 구간', status: '통과 완료', statusTone: 'positive' },
    sections: [{ title: '구간 identity', fields: [{ label: '경로', value: MIRROR_ROUTE.label }, { label: '구간', value: '픽업 → 교차로' }, { label: '단계', value: '완료' }, { label: '조건', value: '정상' }] }],
  },
  {
    key: mirrorRouteSegmentKey(MIRROR_ROUTE_CURRENT_SEGMENT_ID),
    layerId: 'paths',
    routeId: MIRROR_ROUTE.id,
    segmentId: MIRROR_ROUTE_CURRENT_SEGMENT_ID,
    listName: '배송 경로 17 · 교차로 → 승강기 A',
    item: { label: '배송 경로 17 · 교차로 → 승강기 A', kind: '계획 경로 구간', status: '현재 · 대기', statusTone: 'cautionary' },
    sections: [{ title: '구간 identity', fields: [{ label: '경로', value: MIRROR_ROUTE.label }, { label: '구간', value: '교차로 → 승강기 A' }, { label: '단계', value: '현재' }, { label: '조건', value: '대기', tone: 'cautionary' }, { label: '진행률', value: '42%' }] }],
  },
  {
    key: 'paths:trajectory-amr-7',
    layerId: 'paths',
    listName: 'AMR 7 예상 궤적',
    item: { label: 'AMR 7 예상 궤적', kind: '궤적', status: '이동 중', statusTone: 'signal' },
    sections: [{ title: '샘플', fields: [{ label: '표본 수', value: 6 }, { label: '현재 표본', value: 3 }, { label: '소속 지도', value: '1층 작업장' }] }],
  },
  {
    key: 'waypoints:wp-pick',
    layerId: 'waypoints',
    listName: '픽업 지점 P1',
    item: { label: '픽업 지점 P1', kind: '웨이포인트', status: '사용 가능', statusTone: 'positive' },
    sections: [{ title: '지점', fields: [{ label: '역할', value: '대기 가능' }, { label: '좌표', value: '96, 210' }] }],
  },
  {
    key: 'waypoints:wp-lift',
    layerId: 'waypoints',
    listName: '승강기 접근 지점',
    item: { label: '승강기 접근 지점', kind: '웨이포인트', status: '사용 가능', statusTone: 'positive' },
    sections: [{ title: '지점', fields: [{ label: '역할', value: '정차 금지 통과' }, { label: '주석', value: '승강기 A 접근' }] }],
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
  { id: 'route', label: '현재 경로 구간 · 대기 (점선)', color: 'var(--color-semantic-status-cautionary-foreground)', shape: 'line', dashed: true },
  { id: 'trajectory', label: '현재 궤적 · 이동 중 (실선)', color: 'var(--color-semantic-primary-normal)', shape: 'line' },
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

  const selectedRouteSegmentId = selectedFeature?.routeId === MIRROR_ROUTE.id
    ? selectedFeature.segmentId
    : undefined;
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
      description="지도의 도형은 포인터로만 선택되고, aria-hidden 처리로 role·name·tabindex를 제거해 접근성 트리와 포커스 순서에서는 빠집니다. 키보드·스크린 리더 사용자는 오른쪽의 이름 있는 목록으로 같은 객체를 선택하고, LayerPanel은 표시 여부를 제어하며, 선택 요약과 범례는 색뿐 아니라 형태·패턴으로 계층을 구분합니다."
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
        {/* Every map fragment receives the measured CSS/viewBox scale so visual
            glyphs and pointer cores keep their intended screen-space size. */}
        <section aria-label="내비게이션 지도" style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
          <PathMap label="레이어·목록·선택이 연동된 내비게이션 지도" testId="mirror-map" height={300} svgHeight={290}>
            {(cssViewBoxScale) => (
              <>
                {isVisible('regions') && (
                  <>
                    <SpatialRegion
                      region={MIRROR_KEEPOUT_REGION}
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1} showLabel={false}
                      aria-hidden="true"
                      selected={selectedKey === 'regions:zone-keepout'}
                      onActivate={() => setSelectedKey('regions:zone-keepout')}
                    />
                    <SpatialRegion
                      region={MIRROR_LOBBY_REGION}
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1} showLabel={false}
                      aria-hidden="true"
                      selected={selectedKey === 'regions:zone-lift-lobby'}
                      onActivate={() => setSelectedKey('regions:zone-lift-lobby')}
                    />
                  </>
                )}
                {isVisible('lanes') && (
                  <LaneOverlay
                    lane={MIRROR_LANE}
                    viewportScale={cssViewBoxScale}
                    tabIndex={-1}
                    aria-hidden="true"
                    showEndpoints={false}
                    selected={selectedKey === 'lanes:lane-corridor'}
                    onActivate={() => setSelectedKey('lanes:lane-corridor')}
                  />
                )}
                {isVisible('paths') && (
                  <>
                    <RouteOverlay
                      route={MIRROR_ROUTE}
                      activeMapId={MIRROR_MAP_ID}
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1}
                      aria-hidden="true"
                      showLabel={false}
                      selectedSegmentId={selectedRouteSegmentId}
                      onActivate={({ segmentId }) => setSelectedKey(mirrorRouteSegmentKey(segmentId))}
                    />
                    <TrajectoryOverlay
                      trajectory={MIRROR_TRAJECTORY}
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1}
                      aria-hidden="true"
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
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1} showLabel={false}
                      aria-hidden="true"
                      selected={selectedKey === 'waypoints:wp-pick'}
                      onActivate={() => setSelectedKey('waypoints:wp-pick')}
                    />
                    <WaypointMarker
                      waypoint={MIRROR_LIFT_WAYPOINT}
                      viewportScale={cssViewBoxScale}
                      tabIndex={-1} showLabel={false}
                      aria-hidden="true"
                      selected={selectedKey === 'waypoints:wp-lift'}
                      onActivate={() => setSelectedKey('waypoints:wp-lift')}
                    />
                  </>
                )}
                {isVisible('facilities') && (
                  <FacilityTransition
                    transition={MIRROR_FACILITY}
                    activeMapId={MIRROR_MAP_ID}
                    viewportScale={cssViewBoxScale}
                    tabIndex={-1}
                    aria-hidden="true"
                    showLabel={false}
                    selected={selectedKey === 'facilities:facility-lift'}
                    onActivate={() => setSelectedKey('facilities:facility-lift')}
                  />
                )}
              </>
            )}
          </PathMap>
          <div data-testid="mirror-legend">
            <Legend items={MIRROR_LEGEND_ITEMS} direction="horizontal" size="sm" aria-label="지도 계층 범례" />
          </div>
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

const meta = {
  title: 'LDS Robotics/Viewer/Navigation Viewer',
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-viewer-navigation-viewer--overview',
      eyebrow: 'Robotics / Viewer / Navigation Viewer',
      title: '내비게이션 오버레이를 지도·목록·레이어·선택 요약으로 합성한 뷰어입니다',
      description:
        '영역·레인·경로·궤적·웨이포인트·설비 전이 오버레이를 한 지도에 얹고, 같은 선택 identity를 이름 있는 목록·LayerPanel·SelectionInspector가 공유하는 합성 뷰어 씬입니다. 지도 도형은 pointer 전용(aria-hidden)이고 키보드·스크린 리더 탐색은 이름 있는 목록에 위임합니다. 이 병렬 컨트롤·패널 배선은 제품이 뷰어를 조립하는 방식이므로 개별 렌더러 페이지가 아니라 Viewer 그룹에 둡니다. 렌더러의 값·표현 어휘는 Foundation 원자가, 표현/경계 규약은 NAVIGATION_EXPRESSION_CONVENTIONS가 소유합니다.',
    },
    docs: {
      description: {
        component:
          '내비게이션 오버레이 렌더러들을 지도 + 이름 있는 목록 + 레이어 패널 + 선택 검사기로 합성한 제품형 뷰어 씬입니다. 한 선택 identity·상태를 네 표면이 공유하고, 지도는 pointer 전용이며 접근성 탐색은 이름 목록이 담당합니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '지도, 이름 있는 목록, LayerPanel, SelectionInspector가 하나의 선택 identity와 상태를 공유합니다. 목록에서 객체를 고르면 지도의 data-selected와 선택 요약이 함께 바뀌고, LayerPanel 표시 토글은 해당 계층만 감춥니다. 지도 도형은 pointer로만 선택되고 Tab 순서와 접근성 트리에서는 빠집니다.',
  ),
  render: () => <SemanticMirrorFixture />,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('[data-testid="mirror-map"]');
    const list = canvasElement.querySelector('[data-testid="mirror-list"]');
    const legend = canvasElement.querySelector('[data-testid="mirror-legend"]');
    const root = canvasElement.querySelector('[data-testid="semantic-mirror"]');
    if (!map || !list || !legend || !root) throw new Error('Semantic mirror scaffold is incomplete.');

    const inspectorHeading = () => canvasElement.querySelector('[data-testid="mirror-selection"]')?.textContent ?? '';
    const clickListItem = (key) => canvasElement.querySelector(`[data-list-item="${key}"]`)?.click();

    const legendItems = Array.from(legend.querySelectorAll('li'));
    const routeLegend = legendItems.find((item) => item.textContent?.includes('현재 경로 구간 · 대기'));
    const trajectoryLegend = legendItems.find((item) => item.textContent?.includes('현재 궤적 · 이동 중'));
    if (!routeLegend || !trajectoryLegend
      || getComputedStyle(routeLegend.firstElementChild).borderTopStyle !== 'dashed'
      || getComputedStyle(trajectoryLegend.firstElementChild).borderTopStyle !== 'solid') {
      throw new Error('Legend must mirror the current waiting route dash and active trajectory solid encoding.');
    }

    // 1. Selecting from the named list drives the map data-selected and the summary.
    const listSelections = [
      ['lanes:lane-corridor', '[data-lane-id="lane-corridor"]', '주 통로'],
      [mirrorRouteSegmentKey('route-seg-completed'), '[data-segment-id="route-seg-completed"]', '배송 경로 17 · 픽업 → 교차로'],
      [mirrorRouteSegmentKey(MIRROR_ROUTE_CURRENT_SEGMENT_ID), `[data-segment-id="${MIRROR_ROUTE_CURRENT_SEGMENT_ID}"]`, '배송 경로 17 · 교차로 → 승강기 A'],
      ['paths:trajectory-amr-7', '[data-trajectory-id="trajectory-amr-7"]', 'AMR 7 예상 궤적'],
      ['waypoints:wp-pick', '[data-waypoint-id="wp-pick"]', '픽업 지점 P1'],
      ['facilities:facility-lift', '[data-lds-facility-transition][data-transition-id="facility-lift"]', '화물 승강기 A'],
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

    // 2. Pointer selection preserves route segment identity, and trajectory
    // selection works in the reverse map -> list direction as well.
    const mapSelections = [
      ['[data-segment-id="route-seg-completed"]', mirrorRouteSegmentKey('route-seg-completed'), '배송 경로 17 · 픽업 → 교차로'],
      [`[data-segment-id="${MIRROR_ROUTE_CURRENT_SEGMENT_ID}"]`, mirrorRouteSegmentKey(MIRROR_ROUTE_CURRENT_SEGMENT_ID), '배송 경로 17 · 교차로 → 승강기 A'],
      ['[data-trajectory-id="trajectory-amr-7"]', 'paths:trajectory-amr-7', 'AMR 7 예상 궤적'],
    ];
    for (const [mapSelector, key, name] of mapSelections) {
      const mapFeature = map.querySelector(mapSelector);
      if (!mapFeature) throw new Error(`Missing pointer-only map feature ${mapSelector}.`);
      await userEvent.click(mapFeature);
      const activeElement = canvasElement.ownerDocument.activeElement;
      if (activeElement === mapFeature || mapFeature.contains(activeElement)) {
        throw new Error(`Pointer-only map feature ${mapSelector} became document.activeElement.`);
      }
      await waitFor(() => {
        const listItem = list.querySelector(`[data-list-item="${key}"]`);
        if (mapFeature?.getAttribute('data-selected') !== 'true' || listItem?.getAttribute('aria-pressed') !== 'true') {
          throw new Error(`Selecting ${mapSelector} on the map did not preserve identity in the named list.`);
        }
        if (!inspectorHeading().includes(name)) {
          throw new Error(`Selection summary did not preserve map identity for ${key}: ${inspectorHeading()}`);
        }
      });
      if (key === mirrorRouteSegmentKey('route-seg-completed')
        && map.querySelector(`[data-segment-id="${MIRROR_ROUTE_CURRENT_SEGMENT_ID}"]`)?.getAttribute('data-selected') !== 'false') {
        throw new Error('Selecting the completed route segment also selected the current segment.');
      }
      if (key === mirrorRouteSegmentKey(MIRROR_ROUTE_CURRENT_SEGMENT_ID)
        && map.querySelector('[data-segment-id="route-seg-completed"]')?.getAttribute('data-selected') !== 'false') {
        throw new Error('Selecting the current route segment also selected the completed segment.');
      }
    }
    const pointerOnlyRoute = map.querySelector('[data-segment-id="route-seg-current"]');
    const selectionBeforeHiddenKey = inspectorHeading();
    pointerOnlyRoute?.dispatchEvent(new canvasElement.ownerDocument.defaultView.KeyboardEvent('keydown', {
      key: 'Enter', bubbles: true, cancelable: true,
    }));
    await nextRender();
    if (inspectorHeading() !== selectionBeforeHiddenKey) {
      throw new Error('aria-hidden pointer-only Route responded to keyboard activation.');
    }

    // 3. Pointer-selectable map identities are counted by stable data identity.
    const mapSvg = map.querySelector('svg');
    const mapIdentities = [
      ...Array.from(mapSvg?.querySelectorAll('[data-lds-spatial-region]') ?? []),
      mapSvg?.querySelector('[data-lk-lane-overlay]'),
      ...Array.from(mapSvg?.querySelectorAll('[data-route-segment]') ?? []),
      mapSvg?.querySelector('[data-lk-trajectory-overlay]'),
      ...Array.from(mapSvg?.querySelectorAll('[data-waypoint-id]') ?? []),
      mapSvg?.querySelector('[data-lds-facility-transition]'),
    ].filter(Boolean);
    if (mapIdentities.length !== 9) {
      throw new Error(`Expected 9 pointer-selectable map identities, received ${mapIdentities.length}.`);
    }
    if (mapSvg?.querySelector('[data-lane-endpoint]')) {
      throw new Error('Waypoint-owned endpoint identities must not duplicate Lane endpoint chrome in the composed map.');
    }
    for (const identity of mapIdentities) {
      if (!identity.closest('[aria-hidden="true"]')) {
        throw new Error('Every pointer-selectable map identity must defer screen-reader traversal to the named list.');
      }
    }
    const pointerOnlyPaths = [
      ...Array.from(mapSvg?.querySelectorAll('[data-route-segment]') ?? []),
      mapSvg?.querySelector('[data-lk-trajectory-overlay]'),
    ].filter(Boolean);
    for (const identity of pointerOnlyPaths) {
      if (identity.hasAttribute('role')
        || identity.hasAttribute('tabindex')
        || identity.hasAttribute('aria-label')
        || identity.hasAttribute('aria-pressed')
        || identity.getAttribute('focusable') !== 'false') {
        throw new Error('Pointer-only Route/Trajectory must not expose button semantics or focusability.');
      }
    }
    const listButtons = Array.from(list.querySelectorAll('button[data-list-item]'));
    if (!listButtons.some((button) => (button.tabIndex ?? 0) >= 0)) {
      throw new Error('Named list must expose keyboard-focusable controls.');
    }
    if (listButtons.length !== mapIdentities.length) {
      throw new Error(`Named list must mirror every pointer-selectable map identity: map ${mapIdentities.length}, list ${listButtons.length}.`);
    }

    // 4. LayerPanel visibility toggle hides only the targeted layer's fragments.
    if (!map.querySelector('[data-waypoint-id="wp-pick"]')) throw new Error('Waypoint fragment should start visible.');
    const visibilityButtons = Array.from(canvasElement.querySelectorAll('[data-layer-action="visibility"]'));
    const waypointToggle = visibilityButtons.find((button) => (button.getAttribute('aria-label') ?? '').startsWith('웨이포인트'));
    if (!waypointToggle) throw new Error('LayerPanel waypoint visibility toggle is missing.');
    waypointToggle.click();
    await waitFor(() => {
      if (map.querySelector('[data-waypoint-id="wp-pick"]') || map.querySelector('[data-waypoint-id="wp-lift"]')) {
        throw new Error('Hiding the waypoint layer must remove its map fragments.');
      }
    });
    if (!map.querySelector('[data-lane-id="lane-corridor"]') || !map.querySelector('[data-lds-facility-transition][data-transition-id="facility-lift"]')) {
      throw new Error('Hiding one layer must not remove the others.');
    }

    // 5. A selection retained on a now-hidden layer is explicitly marked 숨김.
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
      if (!map.querySelector('[data-waypoint-id="wp-pick"]')) {
        throw new Error('Restoring the layer must re-render its fragments.');
      }
    });

    // 6. The composed layout does not create horizontal overflow.
    if (root.scrollWidth > root.clientWidth + 1) {
      throw new Error(`Semantic mirror overflowed horizontally: ${root.scrollWidth}/${root.clientWidth}.`);
    }
  },
};

export const NarrowViewport = {
  name: '반응형 · 320px 의미 목록 연동',
  parameters: storyDescription(
    '320px 폭에서도 모든 지도 fragment가 측정된 CSS/viewBox scale을 받아 pointer core를 24 CSS px로 유지하고, 접근성 탐색은 이름 있는 목록에 위임합니다.',
  ),
  render: () => (
    <div data-testid="semantic-mirror-narrow" style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
      <SemanticMirrorFixture />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const narrow = canvasElement.querySelector('[data-testid="semantic-mirror-narrow"]');
    const map = narrow?.querySelector('[data-testid="mirror-map"]');
    const root = narrow?.querySelector('[data-testid="semantic-mirror"]');
    if (!narrow || !map || !root) throw new Error('Narrow semantic mirror scaffold is incomplete.');

    await waitFor(() => {
      const svg = map.querySelector('svg[data-css-viewbox-scale]');
      const cssScale = Number(svg?.getAttribute('data-css-viewbox-scale'));
      if (!svg || !Number.isFinite(cssScale) || cssScale >= 0.95) {
        throw new Error(`Semantic mirror did not render at a narrow CSS/viewBox scale: ${cssScale}.`);
      }

      for (const selector of ['[data-lk-route-overlay]', '[data-lk-trajectory-overlay]']) {
        const overlayScale = Number(map.querySelector(selector)?.getAttribute('data-viewport-scale'));
        if (!Number.isFinite(overlayScale) || Math.abs(overlayScale - cssScale) > 0.01) {
          throw new Error(`${selector} did not receive the measured CSS/viewBox scale: ${overlayScale}/${cssScale}.`);
        }
      }

      const circleCoreSelectors = [
        ['Lane', '[data-lane-actual-hit-core]'],
        ['Route', '[data-route-hit-target-core]'],
        ['Trajectory', '[data-trajectory-actual-hit-core]'],
        ['Waypoint', '[data-waypoint-hit-area]'],
        ['FacilityTransition', '[data-transition-hit-area]'],
      ];
      for (const [name, selector] of circleCoreSelectors) {
        const cores = Array.from(map.querySelectorAll(selector));
        if (cores.length === 0) throw new Error(`${name} actual pointer core is missing.`);
        for (const core of cores) {
          const rect = core.getBoundingClientRect();
          if (Math.min(rect.width, rect.height) / Math.SQRT2 < 23.9) {
            throw new Error(`${name} core does not contain a 24×24 CSS px square: ${rect.width}×${rect.height}.`);
          }
        }
      }

      const regionTargets = Array.from(map.querySelectorAll('[data-region-geometry]'));
      if (regionTargets.length !== 2 || regionTargets.some((target) => {
        const rect = target.getBoundingClientRect();
        return Math.min(rect.width, rect.height) < 23.9;
      })) {
        throw new Error('SpatialRegion pointer geometry must retain a 24×24 CSS px target at 320px.');
      }
    });

    const mapIdentities = [
      ...map.querySelectorAll('[data-lds-spatial-region]'),
      map.querySelector('[data-lk-lane-overlay]'),
      ...map.querySelectorAll('[data-route-segment]'),
      map.querySelector('[data-lk-trajectory-overlay]'),
      ...map.querySelectorAll('[data-waypoint-id]'),
      map.querySelector('[data-lds-facility-transition]'),
    ].filter(Boolean);
    if (mapIdentities.length !== 9 || mapIdentities.some((identity) => !identity.closest('[aria-hidden="true"]'))) {
      throw new Error('Narrow map identities must be aria-hidden and mirrored by the named list.');
    }
    const pointerOnlyPaths = [
      ...map.querySelectorAll('[data-route-segment]'),
      map.querySelector('[data-lk-trajectory-overlay]'),
    ].filter(Boolean);
    if (pointerOnlyPaths.some((identity) => (
      identity.hasAttribute('role')
      || identity.hasAttribute('tabindex')
      || identity.hasAttribute('aria-label')
      || identity.getAttribute('focusable') !== 'false'
    ))) {
      throw new Error('Narrow pointer-only Route/Trajectory retained hidden button semantics.');
    }
    if (root.scrollWidth > root.clientWidth + 1 || narrow.scrollWidth > narrow.clientWidth + 1) {
      throw new Error(`Narrow semantic mirror overflowed: root ${root.scrollWidth}/${root.clientWidth}, wrapper ${narrow.scrollWidth}/${narrow.clientWidth}.`);
    }
  },
};
