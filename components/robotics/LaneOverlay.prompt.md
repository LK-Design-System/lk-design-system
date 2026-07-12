# LaneOverlay

Classification: **LK Robotics Extension**. `LaneOverlay`는 waypoint 사이의 방향성 navigation-graph lane 하나를 그리는 reference renderer입니다. 단독 SVG나 지도 엔진이 아니라 `Map2DCanvas` 또는 제품 renderer의 `<svg>` 안에 넣는 `<g>` fragment입니다.

```jsx
<LaneOverlay
  lane={{
    id: 'lane-a-b',
    label: 'A → B',
    mapId: 'L1',
    points: [{ x: 80, y: 180 }, { x: 320, y: 120 }],
    entry: { waypointId: 'A', orientation: 'forward', transitionIds: ['door-a'] },
    exit: { waypointId: 'B', orientation: 'forward' },
    relation: { kind: 'paired', pairedLaneId: 'lane-b-a' },
    speedLimitMps: 0.8,
  }}
  availability="available"
  conflict={false}
  onActivate={(id) => selectLane(id)}
/>
```

## Contract

- `points`의 첫 점에서 마지막 점으로 향하는 순서가 lane의 유일한 이동 방향입니다. 양방향 boolean은 두지 않습니다. 반대 방향 lane이 graph에 실제로 있을 때만 `relation: { kind: 'paired', pairedLaneId }`로 연결하고, 그렇지 않으면 `single`입니다.
- `LaneData`는 정적이고 직렬화 가능한 topology입니다. identity, map, geometry, entry/exit waypoint reference, orientation, 중립적인 `transitionIds`, relation, `speedLimitMps`, `mutexGroupId`만 둡니다.
- `availability`와 `conflict`는 runtime render prop이며 서로 독립입니다. `availability`는 `available | closed | unknown`이고, `closed + conflict`와 `available + conflict`를 모두 표현합니다.
- entry/exit의 `transitionIds`는 `FacilityTransition` identity 참조일 뿐입니다. Lane은 ID에서 door/lift/dock 종류를 추론하지 않고 시설의 kind, door state, lift floor/session state를 소유하지 않습니다. 지도에는 중립 `T/count`만 표시합니다.
- `speedLimitMps`는 단위를 고정한 lane-wide 속성이고 `mutexGroupId`는 shared-resource 관계입니다. 제품별 unit object나 임의 metadata를 공개 계약에 넣지 않습니다.
- `onActivate`가 있을 때 pointer와 `Enter`/`Space`가 같은 `(id, event)` callback을 호출합니다. `disabled`는 callback을 막고 `aria-disabled`를 노출하며 Tab 순서에서 제거합니다. consumer가 지정한 `tabIndex`는 enabled 상태에서 보존합니다.
- 색만으로 상태를 전달하지 않습니다. 폐쇄/미확인은 dash pattern과 `×`/`?`, conflict는 별도 점선과 `!`, 방향은 arrow glyph로 함께 표시합니다.
- 모든 선은 `vector-effect="non-scaling-stroke"`를 사용합니다. `viewportScale`은 endpoint·glyph·label 크기를 지도 zoom에서 보정합니다. 24px 투명 path stroke와 midpoint의 34px 원형 core를 함께 제공해 짧거나 굽은 선에서도 24×24 CSS px 정사각형이 target 안에 들어갑니다.
- native `aria-label`은 계산된 이름을 덮어쓸 수 있습니다. passive lane은 image, interactive lane은 pressed/disabled를 가진 button으로 노출합니다. component는 live region을 만들지 않습니다.

## Reading order and state evidence

접근 가능한 읽기 순서는 lane label → entry에서 exit 방향 → availability → paired relation → speed/mutex → transition count → conflict → selection/validation/freshness입니다. 시각적으로도 방향 arrow, endpoint, transition count, path 상태, label 순으로 같은 의미를 제공합니다.

- selected: solid outer halo
- focused: shared solid `focus-indicator`
- stale: opacity와 `~` glyph
- invalid: negative path와 `!`
- closed: dashed path와 `×`
- unknown: dotted path와 `?`
- conflict: 독립 negative dot pattern과 `!`

N6의 semantic mirror list는 동일 identity와 runtime 상태를 ordinary text/button으로 제공해야 합니다. SVG lane만을 유일한 탐색 경로로 사용하지 않습니다.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` / `ViewerFrame` | viewer surface/foreground roles, renderer ownership, no app workflow | lane은 frame 안 SVG fragment이며 card, border, shadow, toolbar를 추가하지 않음 |
| `WaypointMarker` | inverse viewport scale, 24px target, selected/focused/disabled/invalid/stale vocabulary | point 대신 방향 polyline이므로 path halo와 arrow를 사용 |
| `LayerPanel` / `SelectionInspector` | selection identity와 focus-indicator token | 속성 편집·action은 panel에 남기고 지도에는 compact label만 둠 |
| `AnnotatedImage` | label과 ordinary-text mirror가 색을 보완 | box annotation chrome을 복제하지 않고 line pattern/glyph로 표현 |

임의 map palette, token, icon set, radius, shadow, animation은 추가하지 않습니다. Route 진행률과 dense trajectory도 lane visual state로 접지 않습니다.

## Authoritative research and conclusions

- [Open-RMF `Graph.hpp` at `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): Lane은 entry/exit Node를 가지며 각각 orientation constraint와 event reference가 있고, speed limit와 mutex group은 lane property입니다. LDS는 endpoint reference와 lane-wide 속성을 분리하고 event의 실행 상태는 소유하지 않습니다.
- [Open-RMF visualization at `6c06184c3ec33441b2f94d356c2d43df4233b74a`](https://github.com/open-rmf/rmf_visualization/tree/6c06184c3ec33441b2f94d356c2d43df4233b74a): navgraph lane, building systems, schedule trajectory는 별도 source/layer입니다. LDS도 facility state와 trajectory를 Lane에 합치지 않습니다.
- [Nav2 Route Server source at `4a40bb9357f3bd11414be6573522ef1613f1cdd3`](https://github.com/ros-navigation/navigation2/tree/4a40bb9357f3bd11414be6573522ef1613f1cdd3/nav2_route): graph edge는 모두 방향성이며 sparse node/edge route와 dense path를 구분합니다. LDS는 `bidirectional` boolean 대신 명시적인 paired lane identity를 사용합니다.
- [Nav2 Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html): route operation, speed limit, dynamic blocked edge는 서로 다른 graph semantics입니다. LDS도 transition reference, static speed, runtime availability/conflict를 한 enum으로 압축하지 않습니다.
- [MapLibre Style Spec — line and symbol layers](https://maplibre.org/maplibre-style-spec/layers/)는 line geometry와 symbol placement/collision을 별도 layer 계약으로 둡니다. LDS도 lane geometry와 endpoint/label collision 처리를 분리하며, owning renderer가 zoom별 label priority를 결정합니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 target 내부에 24×24 CSS px 정사각형이 들어가야 하며 지도 밀도에는 essential/equivalent 예외가 있음을 설명합니다. Lane은 midpoint core와 semantic mirror를 모두 유지합니다.

## Intentional exclusions

- map projection, pixel/world transform, pan/zoom, layer ordering, overlap resolution
- waypoint renderer, planned-route progress, dense path interpolation, robot pose/footprint
- door/lift kind와 실시간 상태, 시설 명령, session 획득
- lane edit handle, drag/create/delete workflow, ROS subscription

이 항목은 owning renderer, `WaypointMarker`, `RouteOverlay`/`TrajectoryOverlay`, `FacilityTransition`, Editor/Product runtime의 책임입니다.
