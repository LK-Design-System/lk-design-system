# RouteOverlay

Classification: **LK Robotics Extension**. `RouteOverlay`는 graph에서 선택된 planned route의 segment를 현재 지도 층에 그리는 SVG reference renderer입니다. 정적 lane topology나 조밀한 robot trajectory와 같은 layer가 아닙니다.

```jsx
<RouteOverlay
  activeMapId="L1"
  route={{
    id: 'delivery-17',
    label: '배송 경로 17',
    status: 'active',
    segments: [
      { id: 's1', mapId: 'L1', points: [...], phase: 'completed', condition: 'normal' },
      { id: 's2', mapId: 'L1', points: [...], phase: 'current', condition: 'waiting' },
      { id: 's3', mapId: 'L2', points: [...], phase: 'upcoming', condition: 'normal' },
    ],
    progress: { segmentId: 's2', fraction: 0.42 },
  }}
  onActivate={({ routeId, segmentId }) => inspectRouteSegment(routeId, segmentId)}
/>
```

## Contract

- `status`는 route 전체의 `planned | active | waiting | blocked | rerouting | completed` 수명주기입니다.
- 각 segment의 `phase` (`completed | current | upcoming`)와 `condition` (`normal | waiting | blocked | conflict`)은 독립입니다. 예를 들어 현재 구간이 waiting이거나 완료 구간이 conflict evidence를 보존할 수 있습니다.
- `laneIds`는 planned segment가 따르는 static graph lane identity를 보존합니다. `entryTransitionId`와 `exitTransitionId`는 경계의 `FacilityTransition` 중립 참조이며 ID에서 시설 종류나 상태를 추론하지 않습니다.
- `progress`는 source가 명시한 `{ segmentId, fraction, position? }`입니다. component는 phase, status, segment 개수로 전체 진행률을 계산하지 않습니다. `fraction` label도 **현재 구간 진행**만 뜻합니다. `position`이 있으면 그 좌표를 그대로 쓰고, 없을 때만 해당 segment geometry에서 fraction 위치를 구합니다. `activeMapId` 필터가 그 segment를 제거하면 progress marker, accessible name, `data-progress-*`도 함께 제거합니다.
- `activeMapId`와 일치하고 finite point가 2개 이상인 segment만 렌더합니다. 다른 층 segment를 필터한 뒤 양 끝을 잇지 않으므로 층간 가상 직선을 만들지 않습니다. 렌더 가능한 segment가 0개면 role/tabindex/name만 남는 invisible control을 만들지 않고 `null`을 반환합니다. lift/door 연결은 `FacilityTransition`에서 설명합니다.
- `selectedSegmentId`는 route 전체 `selected`와 별개인 segment-level selection identity입니다. 이 prop은 선택 halo와 `aria-pressed`만 바꾸며 route/segment lifecycle이나 progress를 추론하지 않습니다.
- 색만으로 상태를 전달하지 않습니다. phase와 condition마다 다른 dash pattern을 쓰고 waiting/pause, blocked/close, conflict/exclamation과 route status를 `NavigationStateGlyph` SVG geometry로 함께 표시합니다. 문자 fallback이나 font baseline에 의존하지 않습니다.
- 자산 suitability inventory에서 `assets/icons/pause.svg`, `close.svg`, `exclamation.svg`, `refresh.svg`, `check.svg`, `question.svg`, `clock.svg`와 생성된 `Icon` registry를 먼저 확인했습니다. waiting/blocked/conflict/rerouting/completed/fallback은 registry path, stale은 registry clock hands 축약을 사용하고, planned/active와 direction만 badge·map용 중심 geometry로 유지합니다.
- `onActivate`가 있으면 segment별 pointer와 `Enter`/`Space`가 `{ routeId, segmentId }`를 전달합니다. key repeat는 추가 activation을 만들지 않습니다. `disabled`는 callback을 막고 Tab 순서에서 빼며 consumer `tabIndex`는 enabled segment에서 보존합니다.
- `aria-hidden="true"`와 `onActivate`를 함께 쓰는 semantic-mirror map fragment는 pointer-only입니다. route/segment의 role, accessible name, pressed/disabled/invalid ARIA, tabindex를 제거하고 `focusable="false"`로 두며 pointer/mouse down의 기본 focus를 막습니다. pointer `onClick`은 유지하지만 keyboard activation과 focus state는 만들지 않습니다. 이름 있는 ordinary control이 같은 `routeId`/`segmentId`의 keyboard·screen-reader 경로를 소유해야 합니다.
- 키보드 포커스는 segment path를 따르는 내부 `data-route-focus-ring` 하나로 표시합니다. `tokens/focus.css`의 Robotics Navigation 전용 opt-out이 전역 사각 outline을 제거해 segment label까지 감싸는 이중 focus chrome을 만들지 않습니다.
- path stroke는 `vector-effect="non-scaling-stroke"`, hit path는 `viewportScale`과 무관한 24 CSS px입니다. 각 interactive segment에는 midpoint의 34px 원형 core도 포함해 짧거나 굽은 구간에서도 24×24 CSS px 정사각형이 target 안에 들어갑니다. `viewportScale`에는 map zoom뿐 아니라 CSS에서 SVG viewBox를 축소한 실제 비율도 포함해야 하며, glyph·label·core는 그 값의 inverse scale을 적용합니다.
- native `aria-label`은 계산된 route 이름의 base를 덮어씁니다. 계산 이름은 route label → status → 명시적 current-segment fraction → selection → controlled focus → disabled → validation/freshness 순입니다. passive `focused`/`disabled`도 보이는 ring/0.45 opacity와 맞게 `포커스됨`/`선택할 수 없음`을 포함합니다. 실제 DOM focus에 따른 이름 변경은 요구하지 않으며 component는 live region을 만들지 않습니다.

## Reading order and state evidence

route group 이름 다음에 각 interactive segment가 segment label → phase → condition 순으로 읽힙니다. 시각 paint order는 selection/focus halo → segment path/pattern → direction → condition glyph → explicit progress/status marker입니다. 자연 condition/progress/invalid/stale anchor의 실제 CSS 거리를 outline 포함 반지름 합과 4px gap으로 pairwise 비교하고, 하나라도 부족하면 원 지름+4px gap으로 계산한 compact centered screen-space row를 사용합니다. 따라서 긴 path의 condition과 fraction 0.5 progress가 같은 좌표인 경우나 중간 길이의 invalid/stale도 path 길이와 무관하게 분리됩니다. 각 자연 anchor 좌표는 data evidence로 보존하며 segment label은 badge row보다 위의 별도 screen-space row로 옮깁니다. explicit current-segment fraction은 progress badge와 route path 모두에서 최소 4 CSS px 떨어진 아래쪽 screen-space row에 유지합니다. 상태 glyph는 LDS icon registry 또는 동일한 centered 24-unit map geometry를 사용하는 `NavigationStateGlyph`로 렌더하며 요청 크기는 최소 10 CSS px입니다. 상태 badge 내부에는 상태 `<text>`가 없고 glyph anchor와 painted bbox 중심은 circle 중심에서 각 축 1px 이내, painted geometry는 circle 안쪽에 최소 1px 여백을 둡니다. direction triangle은 active 상태와 같은 `NAVIGATION_DIRECTION_PATH`를 공유하고 면적 중심을 local anchor에 둬 회전 방향과 무관하게 optical anchor가 유지됩니다. condition/validation/progress outline에는 status hue를 남기고 내부 SVG geometry는 appearance-aware viewer foreground를 사용합니다. transition의 `T`는 상태 glyph가 아니라 topology metadata이므로 caption token text로 유지합니다.

- completed: long dash + positive support color
- current: solid, thicker path
- upcoming: dotted path
- waiting: long-short pattern + pause geometry
- blocked: short-dot pattern + close geometry
- conflict: mixed pattern + exclamation geometry
- selected/focused: 별도 solid halo와 shared focus indicator
- invalid/stale: route-level exclamation/clock-hand geometry와 각각 solid/dashed outline. segment phase·condition pattern은 그대로 보존

N6 semantic mirror가 route 전체 이름만이 아니라 각 `segmentId`, status, phase, condition을 ordinary list/button과 SelectionInspector에 보존해야 합니다. completed/current segment의 map↔list 선택은 서로 다른 identity를 유지하고 trajectory도 양방향 선택을 제공합니다. 범례는 현재 route segment의 실제 condition pattern과 trajectory의 실제 lifecycle encoding을 설명해야 합니다. pointer-only SVG와 이름 있는 목록이 같은 identity를 반복하는 composition에서는 map fragment를 `aria-hidden="true"`로 두고 role/name/state ARIA/tabindex를 제거하며 `focusable="false"`로 접근성 탐색에서 제외합니다. 목록이 keyboard·screen-reader 순서를 소유합니다. 독립적으로 사용되는 SVG segment는 계산된 이름과 button/image 의미를 그대로 유지합니다.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` / `ViewerFrame` | viewer color roles, owning-renderer chrome | route는 frame 안 SVG fragment이며 자체 card/toolbar/status panel을 만들지 않음 |
| `WaypointMarker` / `LaneOverlay` | inverse scale, 24px target, focus/selection vocabulary | route는 segment phase/condition과 명시적 progress marker가 필요함 |
| `ProgressBar` / `Meter` | 진행 의미를 source 값으로 명시 | 전체 task progress chrome을 복제하지 않고 현재 segment fraction만 지도에 표시 |
| `LayerPanel` / `SelectionInspector` | identity와 상태/속성의 읽기 순서 | segment action과 상세 metadata는 inspector에 남김 |

새 token, map palette, icon family, card, radius, shadow, motion을 추가하지 않습니다. lane closure나 facility state를 route status로 재해석하지 않습니다.

## Authoritative research and conclusions

- [Open-RMF visualization at `6c06184c3ec33441b2f94d356c2d43df4233b74a`](https://github.com/open-rmf/rmf_visualization/tree/6c06184c3ec33441b2f94d356c2d43df4233b74a): navgraph, schedule trajectory, building systems가 별도 source/layer입니다. LDS도 planned graph route를 lane·dense trajectory·facility에서 분리합니다.
- [Open-RMF `Graph.hpp` at `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): lane과 event는 graph topology이고 lift 이동은 여러 event의 결합입니다. route renderer는 cross-floor facility 상태를 하나의 선으로 축약하지 않습니다.
- [Nav2 Route Server at `4a40bb9357f3bd11414be6573522ef1613f1cdd3`](https://github.com/ros-navigation/navigation2/tree/4a40bb9357f3bd11414be6573522ef1613f1cdd3/nav2_route): predefined node/edge route와 upsampled `nav_msgs/Path`는 다른 출력이며 route tracking은 edge 진행을 따릅니다. LDS는 Route와 Trajectory를 독립 계약으로 둡니다.
- [Nav2 Route Server configuration](https://docs.nav2.org/configuration/packages/configuring-route-server.html): speed operations, collision-blocked edges, rerouting은 서로 다른 runtime 정보입니다. LDS도 route status와 segment condition을 한 enum으로 합치지 않습니다.
- [MapLibre Style Spec — line and symbol layers](https://maplibre.org/maplibre-style-spec/layers/)는 line paint와 symbol placement·collision priority를 분리합니다. LDS는 한 Route 내부의 서로 충돌하는 badge/label row만 결정하고 다른 layer symbol과의 priority, suppression, paint order는 owning renderer가 실제 density에서 결정하게 합니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 target 내부 24×24 CSS px 정사각형과 dense map의 equivalent path를 함께 설명합니다. 각 segment의 midpoint core와 N6 semantic mirror가 이 두 경로를 제공합니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)는 control·selection·focus와 이해에 필요한 graphical object가 인접색 대비 3:1을 유지하도록 요구합니다. Route의 path, direction, condition/status glyph, selected/focus halo는 semantic foreground와 viewer surface를 조합하고, 작은 text/glyph에는 surface halo를 더합니다. inactive route는 이 기준의 예외지만 LDS의 공용 disabled opacity `0.45`, stale opacity `0.76`을 사용해 sibling과 상태 위계를 맞춥니다.

## Intentional exclusions

- route 계산, edge scoring, collision detection, reroute command, ROS action feedback transport
- cross-floor connector 합성, lift/door state와 session, map projection
- dense sample interpolation, heading/time, robot pose/footprint
- segment edit/drag, context menu, global keyboard traversal, layer panel
- 다른 layer와의 label collision, symbol priority, overlap suppression, map layer ordering. Route 내부 badge/label 충돌은 component가 해결하며 `showLabel`은 renderer가 결정할 수 있지만 동일 identity/state의 semantic mirror는 제거할 수 없음

이 항목은 planner/runtime, `FacilityTransition`, `TrajectoryOverlay`, owning renderer, Editor/Product pattern의 책임입니다.
