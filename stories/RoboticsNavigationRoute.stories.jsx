import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Button,
  RouteOverlay,
  TrajectoryOverlay,
  WaypointMarker,
  LaneOverlay,
  SpatialRegion,
  FacilityTransition,
  LayerPanel,
  NavigationAnnotationLayer,
  SelectionInspector,
  Legend,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';
import { assertNoLabelCollisions, assertPairwiseNonOverlap } from './RoboticsNavigationCollision.shared.jsx';
import {
  ACTIVE_ROUTE,
  ACTIVE_TRAJECTORY,
  L2_TRAJECTORY,
  StoryPage,
  PathMap,
  nextRender,
  assertNavigationStateGlyphGeometry,
  assertNavigationVectorGeometry,
} from './RoboticsNavigationRouteTrajectory.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Route',
  component: RouteOverlay,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-route--route-and-trajectory-overview',
      eyebrow: 'Robotics / Navigation / Route',
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

function ActivePathLayers({ viewportScale }) {
  return (
    <>
      <RouteOverlay route={ACTIVE_ROUTE} activeMapId="L1" viewportScale={viewportScale} />
      <TrajectoryOverlay trajectory={ACTIVE_TRAJECTORY} viewportScale={viewportScale} />
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
        <PathMap label="Light route와 trajectory 지도">
          {(cssViewBoxScale) => <ActivePathLayers viewportScale={cssViewBoxScale} />}
        </PathMap>
        <PathMap appearance="dark" label="Dark route와 trajectory 지도">
          {(cssViewBoxScale) => <ActivePathLayers viewportScale={cssViewBoxScale} />}
        </PathMap>
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
      assertNavigationStateGlyphGeometry(route, 'Overview Route');
      assertNavigationVectorGeometry(route, 'Overview Route');
    });
    trajectories.forEach((trajectory) => {
      const path = trajectory.querySelector('[data-trajectory-path]');
      if (!path?.getAttribute('d')?.includes('L 370 164')) throw new Error('Dense trajectory geometry is incomplete.');
      if (!trajectory.querySelector('[data-trajectory-current-heading]')) throw new Error('Current sample heading marker is missing.');
      assertNavigationStateGlyphGeometry(trajectory, 'Overview Trajectory');
      assertNavigationVectorGeometry(trajectory, 'Overview Trajectory');
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
      <PathMap label="route 상태와 조건 지도" height={500} svgHeight={480}>
        {(cssViewBoxScale) => (
          <>
            {ROUTE_STATE_ROWS.map(([status, phase, condition, y]) => (
              <RouteOverlay
                key={status}
                route={routeForState(status, phase, condition, y)}
                activeMapId="L1"
                viewportScale={cssViewBoxScale}
              />
            ))}
            <RouteOverlay
              route={{
                ...routeForState('active', 'current', 'normal', 426),
                id: 'route-invalid-stale',
                label: 'invalid · stale',
                segments: [{
                  ...routeForState('active', 'current', 'normal', 426).segments[0],
                  id: 'segment-invalid-stale',
                  label: 'invalid · stale',
                }],
              }}
              activeMapId="L1"
              viewportScale={cssViewBoxScale}
              invalid
              stale
            />
          </>
        )}
      </PathMap>
      <PathMap appearance="dark" label="rerouting trajectory 지도" height={220} svgHeight={200}>
        {(cssViewBoxScale) => (
          <TrajectoryOverlay
            trajectory={{
              ...ACTIVE_TRAJECTORY,
              id: 'trajectory-rerouting',
              label: '경로 재계산 중 궤적',
              status: 'rerouting',
              samples: ACTIVE_TRAJECTORY.samples.map((sample) => ({ ...sample, position: { x: sample.position.x, y: sample.position.y - 52 } })),
            }}
            viewportScale={cssViewBoxScale}
            invalid
            stale
          />
        )}
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
    const compoundRoute = canvasElement.querySelector('[data-route-id="route-invalid-stale"]');
    if (!compoundRoute?.querySelector('[data-route-overlay-state="invalid"]') || !compoundRoute.querySelector('[data-route-overlay-state="stale"]')) {
      throw new Error('Route invalid + stale needs independent ! and ~ visual evidence.');
    }
    if (compoundRoute.style.opacity !== '0.76') {
      throw new Error(`Stale Route opacity must match the shared 0.76 contract: ${compoundRoute.style.opacity}.`);
    }
    if (!trajectory.querySelector('[data-trajectory-overlay-state="invalid"]') || !trajectory.querySelector('[data-trajectory-overlay-state="stale"]')) {
      throw new Error('Trajectory invalid + stale needs independent ! and ~ visual evidence.');
    }
    assertNavigationStateGlyphGeometry(canvasElement, 'Route/Trajectory states');
    assertNavigationVectorGeometry(canvasElement, 'Route/Trajectory states');
    const renderedKinds = new Set(Array.from(canvasElement.querySelectorAll('[data-navigation-state-glyph]'))
      .map((glyph) => glyph.getAttribute('data-navigation-state-glyph')));
    for (const kind of ['planned', 'active', 'waiting', 'blocked', 'rerouting', 'completed', 'conflict', 'invalid', 'stale']) {
      if (!renderedKinds.has(kind)) throw new Error(`State glyph mapping is missing ${kind}.`);
    }
  },
};

const SHORT_COMPOUND_ROUTE = {
  id: 'route-short-compound',
  label: '짧은 복합 상태 경로',
  status: 'active',
  segments: [{
    id: 'segment-short-compound',
    mapId: 'L1',
    label: '짧은 충돌 구간',
    points: [{ x: 260, y: 96 }, { x: 268, y: 96 }, { x: 276, y: 96 }],
    phase: 'current',
    condition: 'conflict',
  }],
  progress: { segmentId: 'segment-short-compound', fraction: 0.5 },
};

const SHORT_COMPOUND_TRAJECTORY = {
  id: 'trajectory-short-compound',
  label: '짧은 복합 상태 궤적',
  mapId: 'L1',
  status: 'active',
  samples: [
    { position: { x: 260, y: 190 }, timeMs: 0, headingRad: 0 },
    { position: { x: 268, y: 190 }, timeMs: 200, headingRad: 0 },
    { position: { x: 276, y: 190 }, timeMs: 400, headingRad: 0 },
  ],
  currentSampleIndex: 1,
};

const MID_LENGTH_EXACT_COLLISION_ROUTE = {
  id: 'route-mid-exact-collision',
  label: '중간 길이 exact-anchor 경로',
  status: 'active',
  segments: [{
    id: 'segment-mid-exact-collision',
    mapId: 'L1',
    label: '중간 길이 충돌 구간',
    points: [{ x: 54, y: 310 }, { x: 270, y: 310 }, { x: 486, y: 310 }],
    phase: 'current',
    condition: 'conflict',
  }],
  progress: { segmentId: 'segment-mid-exact-collision', fraction: 0.5 },
};

const NORMAL_PROGRESS_ROUTE = {
  id: 'route-normal-progress-spacing',
  label: '일반 진행률 경로',
  status: 'active',
  segments: [{
    id: 'segment-normal-progress-spacing',
    mapId: 'L1',
    label: '일반 진행 구간',
    points: [{ x: 54, y: 430 }, { x: 270, y: 430 }, { x: 486, y: 430 }],
    phase: 'current',
    condition: 'normal',
  }],
  progress: { segmentId: 'segment-normal-progress-spacing', fraction: 0.3 },
};

function assertProgressTextSpacing(route, label) {
  const badge = route.querySelector('[data-route-marker-badge="progress"]');
  const progressText = route.querySelector('[data-route-progress-label]');
  const path = route.querySelector('[data-route-path]');
  if (!badge || !progressText || !path) throw new Error(`${label} progress spacing evidence is incomplete.`);
  const badgeRect = badge.getBoundingClientRect();
  const textRect = progressText.getBoundingClientRect();
  const pathRect = path.getBoundingClientRect();
  const badgeGap = textRect.top - badgeRect.bottom;
  const pathGap = textRect.top - pathRect.bottom;
  if (badgeGap < 3.9 || pathGap < 3.9) {
    throw new Error(`${label} progress text needs 4 CSS px clearance: badge ${badgeGap}, path ${pathGap}.`);
  }
}

export const ShortPathCompoundMarkers = {
  name: '변형·상태 · 기준점 충돌 복합 표식',
  parameters: storyDescription(
    '자연 marker anchor의 실제 CSS 거리가 outline 포함 반지름과 gap보다 작을 때 Route·Trajectory badge를 compact screen-space row로 분리합니다. 경로 길이와 무관한 exact-anchor 충돌도 포함합니다.',
  ),
  render: () => (
    <div data-testid="short-path-stress" style={{ width: 320, maxWidth: '100%', minWidth: 0 }}>
      <StoryPage
        title="자연 anchor가 충돌하는 독립 상태 badge와 label은 겹치지 않습니다"
        description="각 상태의 실제 path anchor 좌표는 보존하고, 충돌한 경우에만 원 지름과 4px gap으로 계산한 중앙 badge row와 별도 상단 label row를 사용합니다."
      >
        <PathMap label="anchor 충돌 route와 trajectory 복합 상태 지도" height={510} svgHeight={480}>
          {(cssViewBoxScale) => (
            <NavigationAnnotationLayer>
              <RouteOverlay
                route={SHORT_COMPOUND_ROUTE}
                activeMapId="L1"
                viewportScale={cssViewBoxScale}
                invalid
                stale
              />
              <TrajectoryOverlay
                trajectory={SHORT_COMPOUND_TRAJECTORY}
                viewportScale={cssViewBoxScale}
                invalid
                stale
              />
              <RouteOverlay
                route={MID_LENGTH_EXACT_COLLISION_ROUTE}
                activeMapId="L1"
                viewportScale={cssViewBoxScale}
                invalid
                stale
              />
              <RouteOverlay
                route={NORMAL_PROGRESS_ROUTE}
                activeMapId="L1"
                viewportScale={cssViewBoxScale}
              />
            </NavigationAnnotationLayer>
          )}
        </PathMap>
      </StoryPage>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const stress = canvasElement.querySelector('[data-testid="short-path-stress"]');
    await waitFor(() => {
      const svg = stress?.querySelector('svg[data-css-viewbox-scale]');
      const cssScale = Number(svg?.getAttribute('data-css-viewbox-scale'));
      const route = stress?.querySelector('[data-route-id="route-short-compound"]');
      const trajectory = stress?.querySelector('[data-trajectory-id="trajectory-short-compound"]');
      const midRoute = stress?.querySelector('[data-route-id="route-mid-exact-collision"]');
      const normalRoute = stress?.querySelector('[data-route-id="route-normal-progress-spacing"]');
      if (!svg || !Number.isFinite(cssScale) || cssScale >= 0.95) {
        throw new Error(`Short-path stress did not render at a reduced CSS/viewBox scale: ${cssScale}.`);
      }
      if (route?.getAttribute('data-route-marker-layout') !== 'screen-slots'
        || trajectory?.getAttribute('data-trajectory-marker-layout') !== 'screen-slots'
        || midRoute?.getAttribute('data-route-marker-layout') !== 'screen-slots') {
        throw new Error('Every colliding Route and Trajectory fixture must opt into screen-space marker slots.');
      }
      if (normalRoute?.getAttribute('data-route-marker-layout') !== 'path-anchored') {
        throw new Error('A naturally separated normal progress marker should remain path-anchored.');
      }

      const routeMarkers = Array.from(route.querySelectorAll('[data-route-marker-badge]'));
      const trajectoryMarkers = Array.from(trajectory.querySelectorAll('[data-trajectory-marker-badge]'));
      const midRouteMarkers = Array.from(midRoute.querySelectorAll('[data-route-marker-badge]'));
      if (routeMarkers.length !== 4 || trajectoryMarkers.length !== 4 || midRouteMarkers.length !== 4) {
        throw new Error('Short-path compound state is missing a Route or Trajectory marker.');
      }
      const anchoredMarkerGroups = [
        ...route.querySelectorAll('[data-route-anchor-x]'),
        ...trajectory.querySelectorAll('[data-trajectory-anchor-x]'),
        ...midRoute.querySelectorAll('[data-route-anchor-x]'),
      ];
      anchoredMarkerGroups.forEach((marker) => {
        if (!Number.isFinite(Number(marker.getAttribute(marker.hasAttribute('data-route-anchor-x') ? 'data-route-anchor-x' : 'data-trajectory-anchor-x')))) {
          throw new Error('A slotted marker lost its actual path anchor coordinates.');
        }
      });
      const routeLabel = route.querySelector('[data-route-segment-label][data-route-screen-row="label"]');
      const trajectoryLabel = trajectory.querySelector('[data-trajectory-label][data-trajectory-screen-row="label"]');
      const midRouteLabel = midRoute.querySelector('[data-route-segment-label][data-route-screen-row="label"]');
      if (!routeLabel || !trajectoryLabel || !midRouteLabel) {
        throw new Error('A colliding fixture did not move its visual label to the dedicated upper row.');
      }
      assertPairwiseNonOverlap([...routeMarkers, routeLabel], 'Route');
      assertPairwiseNonOverlap([...trajectoryMarkers, trajectoryLabel], 'Trajectory');
      assertPairwiseNonOverlap([...midRouteMarkers, midRouteLabel], 'Mid-length Route');

      const routeRowWidth = Number(route.getAttribute('data-route-marker-row-width'));
      const trajectoryRowWidth = Number(trajectory.getAttribute('data-trajectory-marker-row-width'));
      if (!(routeRowWidth > 0 && routeRowWidth < 100 && trajectoryRowWidth > 0 && trajectoryRowWidth < 100)) {
        throw new Error(`Collision rows are not compact diameter+gap layouts: ${routeRowWidth}/${trajectoryRowWidth}.`);
      }
      const routeStateGlyphs = Array.from(route.querySelectorAll('[data-navigation-state-glyph]'));
      if (routeStateGlyphs.length < 4 || routeStateGlyphs.some((glyph) => !glyph.style.color)) {
        throw new Error('Route marker outlines must retain status hue while internal SVG glyphs use viewer foreground.');
      }
      const midPathRect = midRoute.querySelector('[data-route-path]')?.getBoundingClientRect();
      const midConditionAnchor = Number(midRoute.querySelector('[data-route-condition-glyph]')?.getAttribute('data-route-anchor-x'));
      const midProgressAnchor = Number(midRoute.querySelector('[data-route-progress-marker]')?.getAttribute('data-route-anchor-x'));
      if (!midPathRect || midPathRect.width < 180 || midConditionAnchor !== midProgressAnchor) {
        throw new Error('Medium-length route did not preserve the exact natural condition/progress anchor collision.');
      }
      assertProgressTextSpacing(route, 'Short Route');
      assertProgressTextSpacing(midRoute, 'Mid-length Route');
      assertProgressTextSpacing(normalRoute, 'Normal Route');
      for (const [fixtureLabel, fixture] of [
        ['Short Route', route],
        ['Short Trajectory', trajectory],
        ['Mid-length Route', midRoute],
        ['Normal Route', normalRoute],
      ]) {
        assertNavigationStateGlyphGeometry(fixture, fixtureLabel);
        assertNavigationVectorGeometry(fixture, fixtureLabel);
      }

      // Cross-entity contract: coordinated labels never overlap each other or
      // a registered marker footprint, and the coordinator actually engaged
      // (the short route's progress label collides naturally with the short
      // trajectory's label row without it).
      assertNoLabelCollisions(stress, 'Cross-entity');
      const progressLabelRect = route.querySelector('[data-route-progress-label]')?.getBoundingClientRect();
      const trajectoryLabelRect = trajectory.querySelector('[data-trajectory-label]')?.getBoundingClientRect();
      if (!progressLabelRect || !trajectoryLabelRect) {
        throw new Error('Cross-entity fixture labels must both render.');
      }
      const defectPairOverlaps = progressLabelRect.left < trajectoryLabelRect.right - 0.5
        && progressLabelRect.right > trajectoryLabelRect.left + 0.5
        && progressLabelRect.top < trajectoryLabelRect.bottom - 0.5
        && progressLabelRect.bottom > trajectoryLabelRect.top + 0.5;
      if (defectPairOverlaps) {
        throw new Error('Route progress label and trajectory label still overlap across entities.');
      }
      if (!stress.querySelector('[data-annotation-displaced="true"], [data-annotation-suppressed="true"]')) {
        throw new Error('Cross-entity coordination did not engage on the colliding fixtures.');
      }
      const normalRouteLabels = normalRoute.querySelectorAll('[data-annotation-displaced="true"], [data-annotation-suppressed="true"]');
      if (normalRouteLabels.length > 0) {
        throw new Error('Naturally separated labels must not be displaced or suppressed.');
      }
    });
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
        {(cssViewBoxScale) => (
          <>
            <RouteOverlay route={ACTIVE_ROUTE} activeMapId={activeMapId} viewportScale={cssViewBoxScale} />
            <RouteOverlay route={ACTIVE_ROUTE} activeMapId="missing-map" viewportScale={cssViewBoxScale} data-empty-route-probe="" />
            <RouteOverlay
              route={{
                id: 'route-insufficient-geometry',
                label: '불충분 경로 geometry',
                status: 'planned',
                segments: [{
                  id: 'segment-insufficient-geometry',
                  mapId: activeMapId,
                  points: [{ x: 20, y: 20 }, { x: Number.NaN, y: 30 }],
                  phase: 'upcoming',
                  condition: 'normal',
                }],
              }}
              activeMapId={activeMapId}
              viewportScale={cssViewBoxScale}
              onActivate={() => {}}
              data-insufficient-route-probe=""
            />
            <TrajectoryOverlay
              trajectory={{
                id: 'trajectory-insufficient-geometry',
                label: '불충분 궤적 geometry',
                mapId: activeMapId,
                status: 'planned',
                samples: [
                  { position: { x: 20, y: 40 }, timeMs: 0 },
                  { position: { x: Number.NaN, y: 50 }, timeMs: 100 },
                ],
              }}
              viewportScale={cssViewBoxScale}
              onActivate={() => {}}
              data-insufficient-trajectory-probe=""
            />
            {trajectory.mapId === activeMapId && (
              <TrajectoryOverlay trajectory={trajectory} viewportScale={cssViewBoxScale} />
            )}
          </>
        )}
      </PathMap>
      <output data-testid="active-map-output">현재 층: {activeMapId}</output>
    </StoryPage>
  );
}

export const MultiFloorFiltering = {
  name: '사용법 · 층별 경로',
  parameters: storyDescription(
    'L1/L2를 전환해 route segment와 single-map trajectory가 현재 층만 렌더하는지 확인합니다. 필터 후 남은 서로 다른 층의 끝점을 이어 붙이는 path가 없어야 합니다.',
  ),
  render: () => <MultiFloorFixture />,
  play: async ({ canvasElement }) => {
    const assertMap = (mapId, routeCount, trajectoryId, expectProgress) => {
      const segments = Array.from(canvasElement.querySelectorAll('[data-route-segment]'));
      if (segments.length !== routeCount || segments.some((segment) => segment.getAttribute('data-map-id') !== mapId)) {
        throw new Error(`${mapId} route filtering failed: ${segments.map((segment) => segment.getAttribute('data-map-id')).join(',')}`);
      }
      const route = canvasElement.querySelector('[data-lk-route-overlay]');
      const progressSegmentId = route?.getAttribute('data-progress-segment-id');
      const progressFraction = route?.getAttribute('data-progress-fraction');
      const progressInName = route?.getAttribute('aria-label')?.includes('현재 구간 42%');
      if (expectProgress && (progressSegmentId !== 'segment-l1-current' || progressFraction !== '0.42' || !progressInName)) {
        throw new Error(`${mapId} visible progress was not preserved.`);
      }
      if (!expectProgress && (progressSegmentId != null || progressFraction != null || progressInName)) {
        throw new Error(`${mapId} retained progress from a segment hidden by activeMapId.`);
      }
      const trajectory = canvasElement.querySelector('[data-lk-trajectory-overlay]');
      if (trajectory?.getAttribute('data-trajectory-id') !== trajectoryId || trajectory.getAttribute('data-map-id') !== mapId) {
        throw new Error(`${mapId} trajectory renderer filtering failed.`);
      }
    };
    if (canvasElement.querySelector('[data-empty-route-probe]')) {
      throw new Error('A route with zero visible segments must not leave an empty accessibility object.');
    }
    if (canvasElement.querySelector('[data-insufficient-route-probe], [data-insufficient-trajectory-probe]')) {
      throw new Error('Route/Trajectory with fewer than two finite points must not leave an invisible control.');
    }
    assertMap('L1', 2, 'trajectory-robot-2-l1', true);
    canvasElement.querySelector('button[aria-pressed="false"]')?.click();
    await nextRender();
    assertMap('L2', 1, 'trajectory-robot-2-l2', false);
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
      <PathMap label="route와 trajectory 선택 지도" height={460} svgHeight={440}>
        {(cssViewBoxScale) => (
          <>
            <RouteOverlay
              route={ACTIVE_ROUTE}
              activeMapId="L1"
              viewportScale={cssViewBoxScale}
              selectedSegmentId={selected.startsWith('segment:') ? selected.slice(8) : undefined}
              onActivate={({ segmentId }) => select(`segment:${segmentId}`)}
            />
            <TrajectoryOverlay
              trajectory={ACTIVE_TRAJECTORY}
              viewportScale={cssViewBoxScale}
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
                  points: [{ x: 50, y: 272 }, { x: 480, y: 272 }],
                  phase: 'current',
                  condition: 'blocked',
                }],
              }}
              activeMapId="L1"
              viewportScale={cssViewBoxScale}
              disabled
              onActivate={({ segmentId }) => select(`segment:${segmentId}`)}
            />
            <TrajectoryOverlay
              trajectory={{
                id: 'trajectory-disabled',
                label: '비활성 궤적',
                mapId: 'L1',
                status: 'blocked',
                samples: [
                  { position: { x: 50, y: 314 }, timeMs: 0, headingRad: 0 },
                  { position: { x: 260, y: 308 }, timeMs: 500, headingRad: 0 },
                  { position: { x: 480, y: 314 }, timeMs: 1000, headingRad: 0 },
                ],
                currentSampleIndex: 1,
              }}
              viewportScale={cssViewBoxScale}
              disabled
              onActivate={(id) => select(`trajectory:${id}`)}
            />
            <RouteOverlay
              route={{
                id: 'route-passive-disabled',
                label: '비활성 참조 경로',
                status: 'blocked',
                segments: [{
                  id: 'segment-passive-disabled',
                  mapId: 'L1',
                  points: [{ x: 50, y: 366 }, { x: 480, y: 366 }],
                  phase: 'current',
                  condition: 'blocked',
                }],
              }}
              activeMapId="L1"
              viewportScale={cssViewBoxScale}
              focused
              disabled
              data-passive-disabled-route=""
            />
            <TrajectoryOverlay
              trajectory={{
                id: 'trajectory-passive-disabled',
                label: '비활성 참조 궤적',
                mapId: 'L1',
                status: 'blocked',
                samples: [
                  { position: { x: 50, y: 414 }, timeMs: 0, headingRad: 0 },
                  { position: { x: 260, y: 408 }, timeMs: 500, headingRad: 0 },
                  { position: { x: 480, y: 414 }, timeMs: 1000, headingRad: 0 },
                ],
                currentSampleIndex: 1,
              }}
              viewportScale={cssViewBoxScale}
              focused
              disabled
              data-passive-disabled-trajectory=""
            />
          </>
        )}
      </PathMap>
      <output data-testid="path-activation-output">선택: {selected || '없음'} · activation {count}회</output>
    </StoryPage>
  );
}

export const PathSelectionAndActivation = {
  name: '상호작용 · 구간과 궤적 선택',
  parameters: storyDescription(
    'route segment와 trajectory의 accessible name, pointer·Enter/Space activation, Route·Trajectory disabled prevention과 선택 halo를 확인합니다.',
  ),
  render: () => <PathActivationFixture />,
  play: async ({ canvasElement }) => {
    const routeSegment = canvasElement.querySelector('[data-segment-id="segment-l1-current"]');
    const trajectory = canvasElement.querySelector('[data-trajectory-id="trajectory-robot-2-l1"]');
    const disabledSegment = canvasElement.querySelector('[data-segment-id="segment-disabled"]');
    const disabledTrajectory = canvasElement.querySelector('[data-trajectory-id="trajectory-disabled"]');
    const passiveDisabledRoute = canvasElement.querySelector('[data-passive-disabled-route]');
    const passiveDisabledTrajectory = canvasElement.querySelector('[data-passive-disabled-trajectory]');
    const output = () => canvasElement.querySelector('[data-testid="path-activation-output"]')?.textContent ?? '';
    const view = canvasElement.ownerDocument.defaultView;
    if (!routeSegment?.getAttribute('aria-label')?.includes('현재 구간') || !trajectory?.getAttribute('aria-label')?.includes('sample')) {
      throw new Error('Route segment and trajectory need meaningful accessible names.');
    }
    const routeHitCore = routeSegment.querySelector('[data-route-hit-target-core]');
    const trajectoryHitCore = trajectory.querySelector('[data-trajectory-hit-target-core]');
    if (!routeHitCore || Number(routeHitCore.getAttribute('r')) * Math.SQRT2 < 24) {
      throw new Error('Interactive route segment needs a target core containing 24×24 CSS px.');
    }
    if (!trajectoryHitCore || Number(trajectoryHitCore.getAttribute('r')) * Math.SQRT2 < 24) {
      throw new Error('Interactive trajectory needs a target core containing 24×24 CSS px.');
    }
    await userEvent.click(routeSegment);
    const routeFocusVisible = routeSegment.matches(':focus-visible');
    await waitFor(() => {
      const hasRouteFocusRing = Boolean(routeSegment.querySelector('[data-route-focus-ring]'));
      if (hasRouteFocusRing !== routeFocusVisible) {
        throw new Error('Route focus ring must mirror the native :focus-visible state.');
      }
      if (routeFocusVisible && view.getComputedStyle(routeSegment).outlineStyle !== 'none') {
        throw new Error('Route segment must not duplicate its focus ring with the global rectangular outline.');
      }
    });
    routeSegment.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextRender();
    if (!routeSegment.querySelector('[data-route-focus-ring]') || view.getComputedStyle(routeSegment).outlineStyle !== 'none') {
      throw new Error('Route keyboard input must restore only its shape-managed focus ring after pointer modality.');
    }
    await userEvent.click(trajectory);
    const trajectoryFocusVisible = trajectory.matches(':focus-visible');
    await waitFor(() => {
      const hasTrajectoryFocusRing = Boolean(trajectory.querySelector('[data-trajectory-focus-indicator]'));
      if (hasTrajectoryFocusRing !== trajectoryFocusVisible) {
        throw new Error('Trajectory focus indicator must mirror the native :focus-visible state.');
      }
      if (trajectoryFocusVisible && view.getComputedStyle(trajectory).outlineStyle !== 'none') {
        throw new Error('Trajectory must not duplicate its focus ring with the global rectangular outline.');
      }
    });
    trajectory.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await nextRender();
    if (!trajectory.querySelector('[data-trajectory-focus-indicator]') || view.getComputedStyle(trajectory).outlineStyle !== 'none') {
      throw new Error('Trajectory keyboard input must restore only its shape-managed focus ring after pointer modality.');
    }
    if (!output().includes('activation 4회') || trajectory.getAttribute('data-selected') !== 'true') {
      throw new Error(`Path activation or trajectory selection failed: ${output()}`);
    }
    routeSegment.dispatchEvent(new view.KeyboardEvent('keydown', {
      key: 'Enter', repeat: true, bubbles: true, cancelable: true,
    }));
    trajectory.dispatchEvent(new view.KeyboardEvent('keydown', {
      key: ' ', repeat: true, bubbles: true, cancelable: true,
    }));
    await nextRender();
    if (!output().includes('activation 4회')) {
      throw new Error('Repeated Route/Trajectory keydown invoked onActivate.');
    }
    if (disabledSegment.getAttribute('tabindex') !== '-1' || disabledSegment.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled route segment must expose aria-disabled and leave the Tab order.');
    }
    if (disabledSegment.closest('[data-lk-route-overlay]')?.style.opacity !== '0.45') {
      throw new Error('Disabled Route opacity must match the shared 0.45 contract.');
    }
    if (disabledTrajectory?.getAttribute('tabindex') !== '-1' || disabledTrajectory.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled trajectory must expose aria-disabled and leave the Tab order.');
    }
    if (disabledTrajectory.style.opacity !== '0.45') {
      throw new Error('Disabled Trajectory opacity must match the shared 0.45 contract.');
    }
    for (const [name, overlay] of [
      ['Route', passiveDisabledRoute],
      ['Trajectory', passiveDisabledTrajectory],
    ]) {
      if (overlay?.getAttribute('role') !== 'img'
        || !overlay.getAttribute('aria-label')?.includes('포커스됨')
        || !overlay.getAttribute('aria-label')?.includes('선택할 수 없음')
        || overlay.style.opacity !== '0.45') {
        throw new Error(`Passive controlled-focused disabled ${name} needs explicit computed states and 0.45 opacity.`);
      }
    }
    disabledSegment.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabledSegment.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    disabledTrajectory.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabledTrajectory.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await nextRender();
    if (!output().includes('activation 4회')) throw new Error('A disabled Route or Trajectory invoked onActivate.');
  },
};

// ---------------------------------------------------------------------------
// N6 · Semantic mirror
//
// The map is never the only navigation path. A named, keyboard-focusable list
// mirrors the same identity and state, a LayerPanel owns controlled visibility,
// and a SelectionInspector echoes the selected object. Map fragments keep pointer
// activation but remove role/name/tabindex under aria-hidden; the list owns
// keyboard and screen-reader selection.
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
    key: mirrorRouteSegmentKey('route-seg-completed'),
    layerId: 'paths',
    routeId: MIRROR_ROUTE.id,
    segmentId: 'route-seg-completed',
    listName: '배송 경로 17 · 픽업 → 교차로',
    item: { label: '배송 경로 17 · 픽업 → 교차로', kind: '계획 경로 구간', status: '통과 완료', statusTone: 'positive' },
    sections: [{ title: '구간 identity', fields: [{ label: '경로', value: MIRROR_ROUTE.id }, { label: '구간', value: 'route-seg-completed' }, { label: '단계', value: 'completed' }, { label: '조건', value: '정상' }] }],
  },
  {
    key: mirrorRouteSegmentKey(MIRROR_ROUTE_CURRENT_SEGMENT_ID),
    layerId: 'paths',
    routeId: MIRROR_ROUTE.id,
    segmentId: MIRROR_ROUTE_CURRENT_SEGMENT_ID,
    listName: '배송 경로 17 · 교차로 → 승강기 A',
    item: { label: '배송 경로 17 · 교차로 → 승강기 A', kind: '계획 경로 구간', status: '현재 · 대기', statusTone: 'cautionary' },
    sections: [{ title: '구간 identity', fields: [{ label: '경로', value: MIRROR_ROUTE.id }, { label: '구간', value: MIRROR_ROUTE_CURRENT_SEGMENT_ID }, { label: '단계', value: 'current' }, { label: '조건', value: '대기', tone: 'cautionary' }, { label: '진행률', value: '42%' }] }],
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
      description="지도의 도형은 pointer로 선택되지만 aria-hidden pointer-only 모드에서 role·name·tabindex를 제거해 접근성 트리와 focus 순서에서는 빠집니다. 키보드·스크린 리더 사용자는 오른쪽의 이름 있는 목록으로 같은 객체를 선택하고, LayerPanel은 표시 여부를 제어하며, 선택 요약과 범례는 색뿐 아니라 형태·패턴으로 계층을 구분합니다."
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

export const SemanticMirror = {
  name: '사용법 · 레이어·목록·선택 요약',
  parameters: storyDescription(
    '지도, 이름 있는 목록, LayerPanel, SelectionInspector가 하나의 선택 identity와 상태를 공유하는 semantic mirror입니다. 목록에서 객체를 고르면 지도의 data-selected와 선택 요약이 함께 바뀌고, LayerPanel 표시 토글은 해당 계층만 감춥니다. 지도 도형은 pointer로만 선택되고 Tab 순서와 접근성 트리에서는 빠집니다.',
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
    // Match the interactive feature root by role="button": data-waypoint-id and
    // data-transition-id also appear on non-interactive lane endpoint references.
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

    // 3. Pointer-selectable map identities are counted by stable data identity,
    // not by button role. Route/Trajectory remove role/name/state ARIA entirely
    // in aria-hidden pointer-only mode; the named list owns semantic traversal.
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

export const SemanticMirrorNarrow320 = {
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
          {(cssViewBoxScale) => (
            <>
              <RouteOverlay
                route={ACTIVE_ROUTE}
                activeMapId="L1"
                showLabel={false}
                viewportScale={cssViewBoxScale}
                tabIndex={-1}
                onActivate={() => {}}
              />
              <TrajectoryOverlay
                trajectory={ACTIVE_TRAJECTORY}
                showLabel={false}
                viewportScale={cssViewBoxScale}
                tabIndex={-1}
                onActivate={() => {}}
              />
            </>
          )}
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
    await waitFor(() => {
      const svg = narrow.querySelector('svg[data-css-viewbox-scale]');
      const cssScale = Number(svg?.getAttribute('data-css-viewbox-scale'));
      const routeScale = Number(route?.getAttribute('data-viewport-scale'));
      if (!svg || !Number.isFinite(cssScale) || cssScale >= 0.95 || Math.abs(cssScale - routeScale) > 0.01) {
        throw new Error(`Narrow SVG scale was not passed to RouteOverlay: css=${cssScale}, route=${routeScale}.`);
      }

      const assertCircleContainsTarget = (selector, name) => {
        const core = narrow.querySelector(selector);
        const rect = core?.getBoundingClientRect();
        if (!rect || Math.min(rect.width, rect.height) / Math.SQRT2 < 23.9) {
          throw new Error(`${name} hit core does not contain a 24×24 CSS px square: ${rect?.width}×${rect?.height}.`);
        }
      };
      assertCircleContainsTarget('[data-route-hit-target-core]', 'Route');
      assertCircleContainsTarget('[data-trajectory-hit-target-core]', 'Trajectory');
      assertNavigationStateGlyphGeometry(route, '320px Route');
      assertNavigationStateGlyphGeometry(trajectory, '320px Trajectory');
      assertNavigationVectorGeometry(route, '320px Route');
      assertNavigationVectorGeometry(trajectory, '320px Trajectory');
    });
  },
};

export const RouteTrajectoryVisualParity = {
  ...RouteAndTrajectoryStates,
  name: 'Route and trajectory visual parity',
  tags: ['!dev', 'visual-parity'],
};
