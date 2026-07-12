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

- `TrajectoryData`는 `id`, optional label, 단일 `mapId`, `RouteStatus`, ordered `samples`, optional `currentSampleIndex`만 가진 직렬화 가능한 데이터입니다.
- 각 sample은 `position`, optional `timeMs`, optional `headingRad`입니다. renderer handle, velocity object, ROS message, arbitrary metadata를 넣지 않습니다.
- 하나의 trajectory는 하나의 map을 소유합니다. `activeMapId` prop이나 서로 다른 map sample을 추가하지 않고, owning renderer가 현재 map과 `trajectory.mapId`를 비교해 layer를 필터합니다. 이로써 cross-floor 가상 직선을 만들지 않습니다.
- `currentSampleIndex`는 source가 명시한 현재 sample입니다. phase나 시간에서 추론하지 않습니다. 해당 sample에 `headingRad`가 있을 때만 현재 marker 방향을 보이고, 모든 sample에 heading glyph를 반복해 밀도를 높이지 않습니다.
- time은 accessible summary에서 첫/마지막 범위와 현재 sample 시간을 읽는 데 사용합니다. component가 ETA, 속도, progress를 계산하거나 map 위 time label을 남발하지 않습니다.
- status는 planned/active/waiting/blocked/rerouting/completed path pattern과 glyph를 결정합니다. 색만 사용하지 않고 solid/dash/dot와 `○/▶/Ⅱ/×/↻/✓` evidence를 함께 둡니다.
- `onActivate`가 있으면 pointer와 `Enter`/`Space`가 `(id, event)`를 호출합니다. `disabled`는 callback을 막고 Tab 순서에서 제거하며 enabled 상태에서는 consumer `tabIndex`를 보존합니다.
- path는 `vector-effect="non-scaling-stroke"`, 투명 hit target은 24 CSS px, marker/label은 inverse `viewportScale`을 사용합니다.
- native `aria-label`은 계산 이름을 덮어쓸 수 있습니다. 계산 이름은 label → map → status → sample count/time range → current sample/time → selection/validation/freshness 순입니다. live region은 만들지 않습니다.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` / `ViewerFrame` | viewer surface/foreground roles와 owning renderer chrome | trajectory는 frame 안 SVG fragment이고 자체 panel/card를 만들지 않음 |
| `WaypointMarker` | inverse scale, 24px target, focus/selection/disabled/invalid/stale | dense polyline과 current-sample heading marker가 필요함 |
| `LaneOverlay` | non-scaling stroke, direction/state의 색 외 evidence | topology endpoint/relation/speed/mutex를 복제하지 않음 |
| `RouteOverlay` | shared RouteStatus vocabulary | segment phase/condition/progress를 복제하지 않고 ordered dense samples를 소유 |

새 token, map palette, icon set, card, radius, shadow, animation을 추가하지 않습니다. sample마다 badge나 label을 붙이지 않아 normal/narrow 지도 밀도를 보존합니다.

## Authoritative research and conclusions

- [Open-RMF visualization at `6c06184c3ec33441b2f94d356c2d43df4233b74a`](https://github.com/open-rmf/rmf_visualization/tree/6c06184c3ec33441b2f94d356c2d43df4233b74a): schedule trajectory는 navgraph와 별도 layer이고 sample은 time, position `[x,y,theta]`를 포함합니다. LDS는 trajectory를 독립 ordered sample 계약으로 두고 heading/time을 optional source data로 보존합니다.
- [Open-RMF `Graph.hpp` at `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): graph waypoint/lane topology는 schedule trajectory와 다른 구조입니다. LDS도 lane relation이나 endpoint event를 trajectory sample에 넣지 않습니다.
- [Nav2 Route Server at `4a40bb9357f3bd11414be6573522ef1613f1cdd3`](https://github.com/ros-navigation/navigation2/tree/4a40bb9357f3bd11414be6573522ef1613f1cdd3/nav2_route): node/edge route와 upsampled dense `nav_msgs/Path`가 구분됩니다. LDS는 graph route와 dense trajectory를 별도 component/API로 유지합니다.
- [Nav2 Route Server configuration](https://docs.nav2.org/configuration/packages/configuring-route-server.html): `path_density`는 route를 followable path로 upsample하는 별도 출력 설정입니다. LDS는 sample density를 topology semantics로 해석하지 않습니다.

## Intentional exclusions

- trajectory prediction/interpolation, velocity/acceleration, collision calculation, ETA/progress inference
- multi-map sample set과 cross-floor connector, facility state/session
- robot footprint/pose history, occupancy/cost map, graph lane/waypoint
- playback controls, scrubber, live announcement, edit/drag, ROS transport

이 항목은 runtime planner/schedule, owning renderer, `RouteOverlay`, `FacilityTransition`, Product playback/inspection pattern의 책임입니다.
