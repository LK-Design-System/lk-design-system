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
- `progress`는 source가 명시한 `{ segmentId, fraction, position? }`입니다. component는 phase, status, segment 개수로 전체 진행률을 계산하지 않습니다. `fraction` label도 **현재 구간 진행**만 뜻합니다. `position`이 있으면 그 좌표를 그대로 쓰고, 없을 때만 해당 segment geometry에서 fraction 위치를 구합니다.
- `activeMapId`와 일치하는 segment만 렌더합니다. 다른 층 segment를 필터한 뒤 양 끝을 잇지 않으므로 층간 가상 직선을 만들지 않습니다. lift/door 연결은 `FacilityTransition`에서 설명합니다.
- 색만으로 상태를 전달하지 않습니다. phase와 condition마다 다른 dash pattern을 쓰고 waiting `Ⅱ`, blocked `×`, conflict `!`, route status glyph를 함께 표시합니다.
- `onActivate`가 있으면 segment별 pointer와 `Enter`/`Space`가 `{ routeId, segmentId }`를 전달합니다. `disabled`는 callback을 막고 Tab 순서에서 빼며 consumer `tabIndex`는 enabled segment에서 보존합니다.
- path stroke는 `vector-effect="non-scaling-stroke"`, hit path는 `viewportScale`과 무관한 24 CSS px입니다. 각 interactive segment에는 보이지 않는 최소 24px bounds도 포함해 가로·세로로 거의 평평한 SVG 경로의 role target box가 stroke를 제외하고 8px처럼 축소되지 않게 합니다. glyph와 label은 inverse scale을 적용합니다.
- native `aria-label`은 계산된 route 이름의 base를 덮어씁니다. 계산 이름은 route label → status → 명시적 current-segment fraction → selection/validation/freshness 순입니다. component는 live region을 만들지 않습니다.

## Reading order and state evidence

route group 이름 다음에 각 interactive segment가 segment label → phase → condition 순으로 읽힙니다. 시각 paint order는 selection/focus halo → segment path/pattern → direction → condition glyph → explicit progress/status marker입니다.

- completed: long dash + positive support color
- current: solid, thicker path
- upcoming: dotted path
- waiting: long-short pattern + `Ⅱ`
- blocked: short-dot pattern + `×`
- conflict: mixed pattern + `!`
- selected/focused: 별도 solid halo와 shared focus indicator

N6 semantic mirror가 같은 route/segment identity, status, phase, condition을 ordinary list/button으로 제공해야 합니다. SVG segment만을 유일한 키보드 탐색 경로로 사용하지 않습니다.

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

## Intentional exclusions

- route 계산, edge scoring, collision detection, reroute command, ROS action feedback transport
- cross-floor connector 합성, lift/door state와 session, map projection
- dense sample interpolation, heading/time, robot pose/footprint
- segment edit/drag, context menu, global keyboard traversal, layer panel

이 항목은 planner/runtime, `FacilityTransition`, `TrajectoryOverlay`, owning renderer, Editor/Product pattern의 책임입니다.
