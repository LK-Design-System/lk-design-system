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

- `points`의 첫 점에서 마지막 점으로 향하는 순서가 lane의 유일한 이동 방향입니다. 양방향 boolean은 두지 않습니다. 반대 방향 lane이 graph에 실제로 있을 때만 `relation: { kind: 'paired', pairedLaneId }`로 연결하고, 그렇지 않으면 `single`입니다. 유한한 point가 두 개보다 적으면 path와 hit geometry를 만들 수 없으므로 component는 빈 image/button을 남기지 않고 `null`을 반환합니다.
- `LaneData`는 정적이고 직렬화 가능한 topology입니다. identity, map, geometry, entry/exit waypoint reference, orientation, 중립적인 `transitionIds`, relation, `speedLimitMps`, `mutexGroupId`만 둡니다.
- `availability`와 `conflict`는 runtime render prop이며 서로 독립입니다. `availability`는 `available | closed | unknown`이고, `closed + conflict`와 `available + conflict`를 모두 표현합니다.
- entry/exit의 `transitionIds`는 `FacilityTransition` identity 참조일 뿐입니다. Lane은 ID에서 door/lift/dock 종류를 추론하지 않고 시설의 kind, door state, lift floor/session state를 소유하지 않습니다. 지도에는 중립 `T/count`만 표시합니다.
- `speedLimitMps`는 단위를 고정한 lane-wide 속성이고 `mutexGroupId`는 shared-resource 관계입니다. 제품별 unit object나 임의 metadata를 공개 계약에 넣지 않습니다.
- `onActivate`가 있을 때 pointer와 non-repeating `Enter`/`Space`가 같은 `(id, event)` callback을 호출합니다. `event.repeat`와 `disabled`는 callback을 막고, disabled interactive lane은 `aria-disabled`와 `tabIndex=-1`을 사용합니다. Disabled opacity는 `0.45`, stale opacity는 `0.76`으로 Facility/Waypoint 계열의 상태 계층과 맞춥니다.
- `aria-hidden="true"`는 named semantic mirror가 keyboard/accessibility ownership을 갖는 map fragment용 pointer-only mode입니다. 이 mode는 visual과 click callback을 유지하지만 role, accessible name, pressed/disabled/invalid ARIA, `tabIndex`를 제거하고 `focusable="false"`와 canceled mouse down으로 focus를 막으며 keyboard activation을 받지 않습니다.
- 키보드 포커스는 path를 따르는 내부 `data-lane-focus-ring` 하나로 표시합니다. `tokens/focus.css`의 Robotics Navigation 전용 opt-out이 전역 사각 outline을 제거하므로 path·endpoint·label 전체를 감싸는 두 번째 rectangle을 표시하지 않습니다. Primary label과 metadata는 midpoint segment의 위쪽 screen-space normal 양쪽에 놓고, 실제 text halo와 10px focus stroke 사이에 최소 3px painted clearance를 유지합니다.
- 색만으로 상태를 전달하지 않습니다. 폐쇄/미확인은 dash pattern과 registry close/question geometry, conflict·invalid는 별도 pattern과 registry exclamation geometry, stale은 adapted clock-hand geometry로 함께 표시합니다. 모든 상태 표식은 font fallback 없이 공통 `NavigationStateGlyph`의 최소 10px SVG geometry를 사용하고 `data-navigation-state-glyph`/source를 남깁니다. 상태 hue는 path와 badge 외곽선에 남기고 내부 geometry는 appearance-aware `--viewer-foreground`를 사용해 light/dark viewer surface에서 필요한 대비를 보존합니다. Direction은 같은 helper가 export하는 area-centroid-centered `NAVIGATION_DIRECTION_PATH`를 사용합니다.
- 자산 suitability inventory에서 `assets/icons/question.svg`, `exclamation.svg`, `close.svg`, `clock.svg`와 생성된 `Icon` registry를 먼저 확인했습니다. question/exclamation/close는 registry path를 직접 재사용하고, stale은 badge circle을 clock perimeter로 삼아 `clock.svg` hands만 축약합니다. 방향은 문자 `>`나 폰트 화살표 대신 면적 중심이 원점인 공통 map triangle을 사용합니다.
- endpoint label, transition count, lane label, metadata는 LDS `caption1`/`caption2` typography token과 viewer-surface paint-order halo를 사용합니다. `Tn` transition count는 `+16px`의 9px-radius circle 안에서 shared middle baseline을 사용하고 실제 painted text bbox 중심 오차를 축당 1px 이하, 내부 여백을 1px 이상 유지합니다. 상태 row는 별도 14px 원형 badge와 font-independent geometry를 사용합니다. 수평 lane에서는 상태가 있을 때 label `-56px` → state row `-32px` → path/direction/endpoint `0px` → endpoint transition `+16px` → metadata `+40px`의 hierarchy가 유지됩니다. 굽거나 대각선이면 상태 badge는 tangent를 따라 18px 간격, upper screen-space normal `+32px`에 놓고 label/metadata는 같은 normal의 `+56/-40px` 또는 상태가 없을 때 `+22/-28px`에 둡니다. Normal에 수평 성분이 있으면 text anchor를 바깥쪽으로 열어 긴 bbox가 focus path 쪽으로 되돌아오지 않게 합니다. 실제 focus stroke와 text halo/state circle은 최소 3px 떨어져야 합니다.
- 모든 선은 `vector-effect="non-scaling-stroke"`를 사용합니다. `viewportScale`에는 map zoom뿐 아니라 SVG `viewBox`가 CSS layout으로 축소·확대된 실제 화면 배율까지 포함해야 합니다. 24px 투명 path stroke와 `data-lane-actual-hit-core`의 35px 원형 core를 함께 제공해 짧거나 굽은 선에서도 24×24 CSS px 정사각형이 target 안에 들어갑니다. Storybook은 선언된 반지름이 아니라 실제 `getBoundingClientRect()`를 검사합니다.
- `showEndpoints={false}`는 같은 waypoint identity를 별도 `WaypointMarker` layer가 그리는 composed map에서만 사용합니다. 기본값은 `true`이며 단독 Lane은 진입·이탈·orientation·transition 참조를 계속 표시합니다. endpoint chrome을 숨겨도 lane accessible name과 named semantic mirror에는 entry/exit identity와 transition 참조가 남아야 합니다.
- native `aria-label`은 계산된 이름을 덮어쓸 수 있습니다. 계산 이름에는 visible controlled/DOM focus와 passive disabled도 각각 `포커스됨`, `선택할 수 없음`으로 포함됩니다. Passive lane은 image, interactive lane은 pressed/disabled를 가진 button으로 노출하며 component는 live region을 만들지 않습니다.

## Reading order and state evidence

접근 가능한 읽기 순서는 lane label → entry에서 exit 방향 → availability → paired relation → speed/mutex → transition count → conflict → selection/validation/freshness입니다. 시각적으로도 방향 arrow, endpoint, transition count, path 상태, label 순으로 같은 의미를 제공합니다.

- selected: solid outer halo
- focused: shared solid `focus-indicator`
- stale: opacity와 adapted clock-hand geometry
- invalid: negative path와 registry exclamation geometry
- closed: dashed path와 registry close geometry
- unknown: dotted path와 registry question geometry
- conflict: 독립 negative dot pattern과 registry exclamation geometry

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
- [MapLibre Style Spec — line and symbol layers](https://maplibre.org/maplibre-style-spec/layers/)는 line geometry와 symbol placement/collision을 별도 layer 계약으로 두고, `symbol-sort-key` 및 allow-overlap 설정으로 placement 우선순위를 정합니다. LDS fragment는 모든 label을 강제로 표시하거나 충돌 순위를 추론하지 않으며, owning renderer가 zoom·density·selection에 따라 label priority와 suppression을 결정합니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 target 내부에 축 정렬된 24×24 CSS px 정사각형이 실제로 들어가야 하며 지도 밀도에는 essential/equivalent 예외가 있음을 설명합니다. Lane은 actual midpoint core와 semantic mirror를 모두 유지하고 CSS/viewBox 축소 후의 rendered bounds를 검증합니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)는 상태를 식별하는 데 필요한 graphical object가 인접 색과 최소 3:1이어야 한다고 설명합니다. Lane은 dark viewer에서 light-theme용 status text token을 재사용하지 않고 viewer foreground glyph와 status foreground outline을 분리합니다.

## Intentional exclusions

- map projection, pixel/world transform, pan/zoom, layer ordering, overlap resolution
- waypoint renderer, planned-route progress, dense path interpolation, robot pose/footprint
- door/lift kind와 실시간 상태, 시설 명령, session 획득
- lane edit handle, drag/create/delete workflow, ROS subscription

이 항목은 owning renderer, `WaypointMarker`, `RouteOverlay`/`TrajectoryOverlay`, `FacilityTransition`, Editor/Product runtime의 책임입니다.
