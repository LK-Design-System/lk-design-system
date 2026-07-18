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
- `currentSampleIndex`는 source가 명시한 현재 sample입니다. phase나 시간에서 추론하지 않습니다. 해당 sample까지의 line은 strong으로 그리고 그 끝에 채움 삼각형 head 하나를 `marker-end`로 붙이며(incoming tangent를 따름), 이후의 recessed line은 tip 앞을 `futureGap`만큼 비운 뒤 다시 시작합니다. 몸통 선은 tip보다 `tipSetback`만큼 일찍 멈추고 marker `refX`가 같은 값만큼 이동해, 둥근 stroke cap이 화살촉 안에 숨은 채 tip은 정확히 current sample 위치에 그려집니다. index 0에서는 elapsed 선이 없으므로 head도 그리지 않습니다 — 합성 carrier 부착부를 만들지 않습니다. `headingRad`는 public source data로 보존하지만 progress head를 회전시키지 않습니다. robot bearing·pose·footprint는 `RobotMarker`가 소유합니다.
- time은 accessible summary에서 첫/마지막 범위와 현재 sample 시간을 읽는 데 사용합니다. component가 ETA, 속도, progress를 계산하거나 map 위 time label을 남발하지 않습니다.
- status는 planned/active/waiting/blocked/rerouting/completed path pattern과 별도 lifecycle badge glyph를 결정합니다. full path의 pattern을 recessed future에도 유지하고, strong elapsed line은 progress 연결성을 위해 solid로 그립니다. Status/validation hue는 line과 badge outline에 유지합니다.
- 자산 suitability inventory에서 `assets/icons/pause.svg`, `close.svg`, `refresh.svg`, `check.svg`, `exclamation.svg`, `question.svg`, `clock.svg`와 생성된 `Icon` registry를 먼저 확인했습니다. lifecycle/validation/fallback은 registry path를 유지하고 current progress는 Route와 같은 `NAV_PROGRESS_HEAD` 결합 계약과 `NAV_PROGRESS_TRIANGLE` 채움 화살촉 기하를 사용합니다. Lane의 선 절개 정적 방향 셰브론(`NAV_DIRECTION_CHEVRON`)과는 기하 자체가 달라 한 지도에서 정적 방향과 동적 진행이 혼동되지 않습니다.
- `onActivate`가 있으면 pointer와 `Enter`/`Space`가 `(id, event)`를 호출하고 key repeat는 추가 activation을 만들지 않습니다. `disabled`는 callback을 막고 Tab 순서에서 제거하며 enabled 상태에서는 consumer `tabIndex`를 보존합니다. Disabled opacity는 `0.45`, stale opacity는 `0.76`입니다. 공용 state opacity·dash·label halo·badge·hit·progress-head 값은 내부 `_navigationVocabulary`에서 소비합니다.
- `aria-hidden="true"` interactive trajectory는 pointer-only입니다. role, accessible name, pressed/disabled/invalid ARIA, tabindex를 제거하고 `focusable="false"`로 두며 pointer/mouse down의 기본 focus를 막습니다. pointer `onClick`은 유지하지만 keyboard activation은 차단하며 같은 trajectory identity의 이름 있는 mirror control이 semantic traversal을 소유합니다.
- 키보드 포커스는 trajectory path를 따르는 내부 `data-trajectory-focus-indicator` 하나로 표시합니다. `tokens/focus.css`의 Robotics Navigation 전용 opt-out이 전역 사각 outline을 제거해 label을 감싸는 두 번째 rectangle을 만들지 않습니다.
- path는 `vector-effect="non-scaling-stroke"`, 투명 hit path는 24 CSS px이며 `data-trajectory-actual-hit-core`의 35px 원형 core가 짧은 궤적에서도 24×24 CSS px 정사각형을 보장합니다. marker/label은 CSS/viewBox scale까지 포함한 실제 parent `viewportScale`의 inverse를 사용합니다.
- native `aria-label`은 계산 이름을 덮어쓸 수 있습니다. 계산 이름은 label → map → status → sample count/time range → current sample/time → selection → controlled focus → disabled → validation/freshness 순입니다. passive `focused`/`disabled`도 보이는 ring/0.45 opacity와 맞게 `포커스됨`/`선택할 수 없음`을 포함합니다. 실제 DOM focus에 따른 이름 변경은 요구하지 않으며 live region은 만들지 않습니다.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` / `ViewerFrame` | viewer surface/foreground roles와 owning renderer chrome | trajectory는 frame 안 SVG fragment이고 자체 panel/card를 만들지 않음 |
| `WaypointMarker` / `RobotMarker` | inverse scale, 24px target, focus/selection/disabled/invalid/stale | dense polyline과 path-bound current progress head가 필요함; 로봇의 현재 pose·heading·footprint는 `RobotMarker` 소관이라 제외 |
| `LaneOverlay` | non-scaling stroke, `_navigationVectorGlyph` 어휘, direction/state의 색 외 evidence | Lane은 선 절개 정적 방향 셰브론, Trajectory는 elapsed prefix 끝의 채움 화살촉 현재 sample이며 topology endpoint/relation/speed/mutex를 복제하지 않음 |
| `RouteOverlay` | shared RouteStatus vocabulary | segment phase/condition/progress를 복제하지 않고 ordered dense samples를 소유 |

새 public token, map palette, icon set, card, radius, shadow, animation을 추가하지 않습니다. 내부 `NAV_PROGRESS_HEAD`만 Route와 공유하며 sample마다 badge나 label을 붙이지 않습니다.

`invalid`와 `stale`은 각각 exclamation과 adapted clock-hand screen-space geometry를 추가해 negative color나 opacity만으로 전달하지 않습니다. progress head는 current sample에 고정된 obstacle이고 head와 같은 incoming path tangent로 회전하며 collision row로 이동하지 않습니다. status/invalid/stale badge는 선을 가리지 않도록 자기 path anchor의 위쪽 화면 법선으로 `NAV_STATE_BADGE.pathNormalOffset`만큼 떠 있고(anchor `data-*` 좌표는 실제 path 지점 유지), 실제 CSS 거리로 충돌을 판단하면 screen-space row로 이동합니다. 채움 화살촉은 circle·backing·shadow 없이 elapsed path의 끝에 붙고, 자체 surface 외곽선과 inverse `viewportScale`로 지도 배경 분리와 화면 크기를 유지하며, tip 앞의 미래 선은 간격을 두고 다시 시작합니다.

## Authoritative research and conclusions

- [Open-RMF visualization at `6c06184c3ec33441b2f94d356c2d43df4233b74a`](https://github.com/open-rmf/rmf_visualization/tree/6c06184c3ec33441b2f94d356c2d43df4233b74a): schedule trajectory는 navgraph와 별도 layer이고 sample은 time, position `[x,y,theta]`를 포함합니다. LDS는 trajectory를 독립 ordered sample 계약으로 두고 heading/time을 optional source data로 보존합니다.
- [Open-RMF `Graph.hpp` at `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): graph waypoint/lane topology는 schedule trajectory와 다른 구조입니다. LDS도 lane relation이나 endpoint event를 trajectory sample에 넣지 않습니다.
- [Nav2 Route Server at `4a40bb9357f3bd11414be6573522ef1613f1cdd3`](https://github.com/ros-navigation/navigation2/tree/4a40bb9357f3bd11414be6573522ef1613f1cdd3/nav2_route): node/edge route와 upsampled dense `nav_msgs/Path`가 구분됩니다. LDS는 graph route와 dense trajectory를 별도 component/API로 유지합니다.
- [Nav2 Route Server configuration](https://docs.nav2.org/configuration/packages/configuring-route-server.html): `path_density`는 route를 followable path로 upsample하는 별도 출력 설정입니다. LDS는 sample density를 topology semantics로 해석하지 않습니다.
- [Mapbox Navigation Route Arrow](https://docs.mapbox.com/android/navigation/guides/ui-components/route-arrow/), [Google Maps polyline symbols](https://developers.google.com/maps/documentation/javascript/symbols), [TomTom route display](https://developer.tomtom.com/navigation/android/guides/map-display/map-display-for-views/routes)는 direction/progress 표식을 line geometry에 결합합니다. LDS는 현재 sample까지의 elapsed line에 이 정보 구조만 적용합니다.
- [W3C SVG Markers](https://www.w3.org/TR/svg-markers/)의 `marker-end`와 `orient="auto"`가 채움 화살촉을 incoming path tangent에 정렬하는 구현 근거입니다.
- [MapLibre Style Spec — line and symbol layers](https://maplibre.org/maplibre-style-spec/layers/)는 line geometry와 symbol collision/priority를 별도 설정으로 두고 `symbol-sort-key`와 overlap policy로 placement 우선순위를 정합니다. LDS는 한 Trajectory 내부 badge/label 충돌만 분리하며 전체 sample label, 다른 layer와의 priority·suppression·paint order는 owning renderer에 남깁니다. 그 renderer 조각의 reference 구현은 `components/robotics/NavigationAnnotationLayer.jsx`이며, provider 없이 단독 렌더된 Trajectory는 오늘과 동일하게 동작합니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 축 정렬된 24×24 CSS px 정사각형이 target 내부에 실제로 들어가야 한다고 설명합니다. path stroke만으로 부족할 수 있는 짧은 trajectory를 stable actual core가 보완하며 renderer는 CSS/viewBox scale을 `viewportScale`에 포함합니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)는 상태를 이해하는 데 필요한 graphical object와 UI state indicator가 인접 색에 최소 3:1이어야 한다고 설명합니다. Trajectory는 dark viewer surface에서도 status/invalid glyph를 viewer foreground로 그리고 semantic status foreground는 outline에 유지합니다.

## Product workflow review

- LK Web Viz `a984def117c05acd213f494cbb8a42e990595505`: `TaskRunScreen`과 `Map2DViewer`가 observed history line과 robot pose를 별도 layer로 전달·렌더하므로 Trajectory progress-head는 `supported by composition`입니다.
- LK Control Full Daedeok `93802fc2aa5d29f930380ae58d51dcb68322b5e7`: `InteractiveMap`도 path history와 current robot+heading을 분리하므로 `supported by composition`입니다.
- LK Context Hub `de124084b7e50049350a46f92c4ea4476269c58c`: map/floor/navigation 진입점이 없어 `not applicable`입니다. 상세 blob pin과 product-owned reset/transport seam은 `docs/references/product-frontends/COVERAGE_AUDIT.json`이 소유합니다.

## Intentional exclusions

- trajectory prediction/interpolation, velocity/acceleration, collision calculation, ETA/progress inference
- multi-map sample set과 cross-floor connector, facility state/session
- robot footprint/pose history, occupancy/cost map, graph lane/waypoint
- playback controls, scrubber, live announcement, edit/drag, ROS transport

이 항목은 runtime planner/schedule, owning renderer, `RouteOverlay`, `FacilityTransition`, Product playback/inspection pattern의 책임입니다.
