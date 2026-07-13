# TrajectoryOverlay

Classification: **LK Robotics Extension**. `TrajectoryOverlay`는 한 지도에 속한 조밀한 위치/time sample을 그리는 SVG reference renderer입니다. 정적 navigation graph lane이나 graph segment route를 대신하지 않습니다.

```jsx
<TrajectoryOverlay
  trajectory={{
    id: 'robot-2-prediction',
    label: 'Robot 2 예상 궤적',
    mapId: 'L1',
    status: 'active',
    samples: [
      { position: { x: 80, y: 180 }, timeMs: 0, headingRad: 0 },
      { position: { x: 92, y: 176 }, timeMs: 250, headingRad: -0.12 },
    ],
    currentSampleIndex: 1,
  }}
  onActivate={(id) => inspectTrajectory(id)}
/>
```

## Contract

- `TrajectoryData`는 `id`, optional label, 단일 `mapId`, `RouteStatus`, ordered `samples`, optional `currentSampleIndex`만 가진 직렬화 가능한 데이터입니다. finite position이 2개 미만이면 path/hit/focus 없이 role/tabindex만 남기지 않고 `null`을 반환합니다.
- 각 sample은 `position`, optional `timeMs`, optional `headingRad`입니다. renderer handle, velocity object, ROS message, arbitrary metadata를 넣지 않습니다.
- 하나의 trajectory는 하나의 map을 소유합니다. `activeMapId` prop이나 서로 다른 map sample을 추가하지 않고, owning renderer가 현재 map과 `trajectory.mapId`를 비교해 layer를 필터합니다. 이로써 cross-floor 가상 직선을 만들지 않습니다.
- `currentSampleIndex`는 source가 명시한 현재 sample입니다. phase나 시간에서 추론하지 않습니다. 해당 sample에 `headingRad`가 있을 때만 현재 marker 방향을 보이고, 모든 sample에 heading glyph를 반복해 밀도를 높이지 않습니다.
- time은 accessible summary에서 첫/마지막 범위와 현재 sample 시간을 읽는 데 사용합니다. component가 ETA, 속도, progress를 계산하거나 map 위 time label을 남발하지 않습니다.
- status는 planned/active/waiting/blocked/rerouting/completed path pattern과 glyph를 결정합니다. 색만 사용하지 않고 solid/dash/dot와 `NavigationStateGlyph`의 registry/adapted SVG geometry를 함께 둡니다. 문자 fallback이나 font baseline에 의존하지 않습니다. Status/validation hue는 path와 marker outline에 유지하고 내부 glyph는 appearance-aware viewer foreground를 사용합니다.
- 자산 suitability inventory에서 `assets/icons/pause.svg`, `close.svg`, `refresh.svg`, `check.svg`, `exclamation.svg`, `question.svg`, `clock.svg`와 생성된 `Icon` registry를 먼저 확인했습니다. lifecycle/validation/fallback은 registry path, stale은 registry clock hands 축약을 사용하고, planned/active/current heading만 조밀한 map badge에 맞는 중심 geometry로 유지합니다.
- `onActivate`가 있으면 pointer와 `Enter`/`Space`가 `(id, event)`를 호출하고 key repeat는 추가 activation을 만들지 않습니다. `disabled`는 callback을 막고 Tab 순서에서 제거하며 enabled 상태에서는 consumer `tabIndex`를 보존합니다. Disabled opacity는 `0.45`, stale opacity는 `0.76`입니다.
- `aria-hidden="true"` interactive trajectory는 pointer-only입니다. role, accessible name, pressed/disabled/invalid ARIA, tabindex를 제거하고 `focusable="false"`로 두며 pointer/mouse down의 기본 focus를 막습니다. pointer `onClick`은 유지하지만 keyboard activation은 차단하며 같은 trajectory identity의 이름 있는 mirror control이 semantic traversal을 소유합니다.
- 키보드 포커스는 trajectory path를 따르는 내부 `data-trajectory-focus-indicator` 하나로 표시합니다. `tokens/focus.css`의 Robotics Navigation 전용 opt-out이 전역 사각 outline을 제거해 label을 감싸는 두 번째 rectangle을 만들지 않습니다.
- path는 `vector-effect="non-scaling-stroke"`, 투명 hit path는 24 CSS px이며 `data-trajectory-actual-hit-core`의 35px 원형 core가 짧은 궤적에서도 24×24 CSS px 정사각형을 보장합니다. marker/label은 CSS/viewBox scale까지 포함한 실제 parent `viewportScale`의 inverse를 사용합니다.
- native `aria-label`은 계산 이름을 덮어쓸 수 있습니다. 계산 이름은 label → map → status → sample count/time range → current sample/time → selection → controlled focus → disabled → validation/freshness 순입니다. passive `focused`/`disabled`도 보이는 ring/0.45 opacity와 맞게 `포커스됨`/`선택할 수 없음`을 포함합니다. 실제 DOM focus에 따른 이름 변경은 요구하지 않으며 live region은 만들지 않습니다.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` / `ViewerFrame` | viewer surface/foreground roles와 owning renderer chrome | trajectory는 frame 안 SVG fragment이고 자체 panel/card를 만들지 않음 |
| `WaypointMarker` | inverse scale, 24px target, focus/selection/disabled/invalid/stale | dense polyline과 current-sample heading marker가 필요함 |
| `LaneOverlay` | non-scaling stroke, direction/state의 색 외 evidence | topology endpoint/relation/speed/mutex를 복제하지 않음 |
| `RouteOverlay` | shared RouteStatus vocabulary | segment phase/condition/progress를 복제하지 않고 ordered dense samples를 소유 |

새 token, map palette, icon set, card, radius, shadow, animation을 추가하지 않습니다. sample마다 badge나 label을 붙이지 않아 normal/narrow 지도 밀도를 보존합니다.

`invalid`와 `stale`은 각각 exclamation과 adapted clock-hand screen-space geometry를 추가해 negative color나 opacity만으로 전달하지 않습니다. status/current/invalid/stale의 자연 anchor를 실제 CSS 거리로 pairwise 비교하고, 거리가 outline 포함 반지름 합+4px보다 작으면 원 지름+4px gap으로 계산한 compact centered screen-space row를 사용합니다. 경로 길이는 충돌 판단의 대용물이 아닙니다. 각 자연 anchor 좌표는 data evidence로 보존하고 trajectory label은 badge row보다 위의 별도 screen-space row로 옮기며 status pattern은 그대로 보존합니다. 상태 glyph는 최소 10 CSS px의 `NavigationStateGlyph`이며 badge 내부 상태 `<text>`를 만들지 않습니다. glyph anchor와 내부 painted path/circle union 중심은 badge circle 중심에서 각 축 1px 이내이고 painted geometry는 circle 안 최소 1px 여백을 유지합니다. current heading arrow는 문자 glyph가 아닌 source heading SVG path이며 active/direction과 같은 `NAVIGATION_DIRECTION_PATH`를 공유합니다. triangle 면적 중심을 local anchor에 둬 heading 회전 후에도 optical anchor가 current circle 중심에 유지됩니다.

## Authoritative research and conclusions

- [Open-RMF visualization at `6c06184c3ec33441b2f94d356c2d43df4233b74a`](https://github.com/open-rmf/rmf_visualization/tree/6c06184c3ec33441b2f94d356c2d43df4233b74a): schedule trajectory는 navgraph와 별도 layer이고 sample은 time, position `[x,y,theta]`를 포함합니다. LDS는 trajectory를 독립 ordered sample 계약으로 두고 heading/time을 optional source data로 보존합니다.
- [Open-RMF `Graph.hpp` at `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): graph waypoint/lane topology는 schedule trajectory와 다른 구조입니다. LDS도 lane relation이나 endpoint event를 trajectory sample에 넣지 않습니다.
- [Nav2 Route Server at `4a40bb9357f3bd11414be6573522ef1613f1cdd3`](https://github.com/ros-navigation/navigation2/tree/4a40bb9357f3bd11414be6573522ef1613f1cdd3/nav2_route): node/edge route와 upsampled dense `nav_msgs/Path`가 구분됩니다. LDS는 graph route와 dense trajectory를 별도 component/API로 유지합니다.
- [Nav2 Route Server configuration](https://docs.nav2.org/configuration/packages/configuring-route-server.html): `path_density`는 route를 followable path로 upsample하는 별도 출력 설정입니다. LDS는 sample density를 topology semantics로 해석하지 않습니다.
- [MapLibre Style Spec — line and symbol layers](https://maplibre.org/maplibre-style-spec/layers/)는 line geometry와 symbol collision/priority를 별도 설정으로 두고 `symbol-sort-key`와 overlap policy로 placement 우선순위를 정합니다. LDS는 한 Trajectory 내부 badge/label 충돌만 분리하며 전체 sample label, 다른 layer와의 priority·suppression·paint order는 owning renderer에 남깁니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 축 정렬된 24×24 CSS px 정사각형이 target 내부에 실제로 들어가야 한다고 설명합니다. path stroke만으로 부족할 수 있는 짧은 trajectory를 stable actual core가 보완하며 renderer는 CSS/viewBox scale을 `viewportScale`에 포함합니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)는 상태를 이해하는 데 필요한 graphical object와 UI state indicator가 인접 색에 최소 3:1이어야 한다고 설명합니다. Trajectory는 dark viewer surface에서도 status/invalid glyph를 viewer foreground로 그리고 semantic status foreground는 outline에 유지합니다.

## Intentional exclusions

- trajectory prediction/interpolation, velocity/acceleration, collision calculation, ETA/progress inference
- multi-map sample set과 cross-floor connector, facility state/session
- robot footprint/pose history, occupancy/cost map, graph lane/waypoint
- playback controls, scrubber, live announcement, edit/drag, ROS transport

이 항목은 runtime planner/schedule, owning renderer, `RouteOverlay`, `FacilityTransition`, Product playback/inspection pattern의 책임입니다.
