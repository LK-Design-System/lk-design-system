# FacilityTransition

`FacilityTransition`은 **LK Robotics Extension**입니다. 문·승강기·도킹처럼 lane 진입/이탈에 연결되는 설비 전이를 제품이 제공한 상태 그대로 보여주는 renderer-neutral SVG fragment입니다. 설비 제어, 세션 획득, 상태 추론은 하지 않습니다.

```jsx
<svg viewBox="0 0 480 320">
  <FacilityTransition
    activeMapId="warehouse-1f"
    transition={{
      id: 'lift-a-1f-2f',
      kind: 'lift',
      label: '화물 승강기 A',
      facilityId: 'lift-a',
      from: { mapId: 'warehouse-1f', position: { x: 180, y: 120 }, label: '1층 승강기 로비' },
      to: { mapId: 'warehouse-2f', position: { x: 210, y: 96 }, label: '2층 승강기 로비' },
      availability: 'available',
      phase: 'moving',
      doorState: 'closed',
      motionState: 'up',
      operatingMode: 'agv',
      sessionState: 'owned',
      currentMapId: 'warehouse-1f',
      destinationMapId: 'warehouse-2f',
    }}
    onActivate={(id) => inspectTransition(id)}
  />
</svg>
```

## Contract

- `transition`은 `kind="door" | "lift" | "dock"`으로 구분되는 직렬화 가능한 데이터입니다. `facilityId`는 필수이고, `from`과 선택적 `to`는 map identity, position, 선택적 waypoint/region/door identity를 소유합니다.
- `activeMapId`가 from/to 어느 쪽과도 맞지 않으면 렌더링하지 않습니다. 한 map에 양 endpoint가 있으면 midpoint, multi-floor 전이면 현재 map의 endpoint에 reference marker를 놓습니다.
- `availability`는 `available | unavailable | unknown`이며 door/lift/dock 내부 상태와 독립입니다. `doorState="offline"`나 lift `operatingMode="offline"`이 들어와도 availability를 자동으로 바꾸지 않습니다.
- door는 `doorState`와 선택적 event(`open | close | pass`)를 분리합니다. event는 Open-RMF lane event의 표시 정보일 뿐 명령 callback이 아닙니다.
- lift phase는 operator reading order인 `approach | waiting | boarding | moving | arrival | exiting`만 표현합니다. `doorState`는 필수이고, `motionState`, `operatingMode`, `sessionState`(`none | requested | owned | other | unknown`)는 source가 제공할 때만 쓰는 선택적 독립 축입니다. phase로 합치거나 누락을 unknown으로 추론하지 않습니다. current/destination도 선택적 floor 표시 문자열이 아니라 명시적 `currentMapId`/`destinationMapId`로 유지합니다.
- dock phase는 `approach | docking | docked | undocking | complete`입니다. offline/unknown을 phase로 만들지 않고 source adapter가 availability로 전달합니다.
- availability는 solid/dashed/dotted ring, slash/question mark, 텍스트를 함께 사용합니다. 지도 라벨은 `출발/도착/연결 → identity → phase·availability → 장치 상태` 순서로 읽히며, 세션과 map identity를 포함한 전체 독립 상태 축은 `data-*`, 접근성 이름, semantic mirror/inspector에 남습니다.
- marker와 label은 `viewportScale`의 역수를 적용하고 stroke는 `vector-effect="non-scaling-stroke"`를 사용합니다. 투명 32 CSS px hit circle을 유지합니다.
- `onActivate`는 pointer, Enter, Space로 같은 `onActivate(id, event)`를 호출하는 선택/검사 callback입니다. lift call, door open, dock 시작, session request/end 같은 command API는 의도적으로 없습니다.
- interactive marker의 `disabled`는 활성화를 막고 `aria-disabled`를 노출하며 소비자가 넘긴 `tabIndex`도 `-1`로 덮어씁니다. passive marker에는 불필요한 disabled ARIA를 붙이지 않습니다. `hidden`은 DOM과 접근성 트리에서 제거하고, native `aria-label`은 자동 생성된 전체 상태 이름을 덮어쓸 수 있습니다.

## Internal LDS inspection and visual-delta inventory

- `Map2DCanvas`와 `ViewerFrame`을 확인해 viewport/frame ownership을 유지했습니다. 이 컴포넌트는 `<g>` 조각만 반환하며 grid, toolbar, panel, recovery action을 만들지 않습니다.
- `SpatialRegion`과 같은 map feature 순서 및 `--viewer-*` 역할 token을 사용합니다. facility marker는 region보다 위에서 읽히지만 별도 palette나 shadow를 추가하지 않습니다.
- `EquipmentStatusCard`는 설비 목록에서 icon tile, 상태 서브라인, trailing 상태를 소유합니다. `FacilityTransition`은 지도 annotation이므로 카드 radius·border·shadow·행 layout을 복제하지 않고 marker + 직접 상태 라벨만 둡니다.
- `DirectionalPad`의 handler/disabled/keyboard 차단을 비교했습니다. 여기서는 제어가 아니라 inspect activation만 제공하므로 press-and-hold, repeat, 명령 상태를 가져오지 않습니다.
- 유지한 시각 차이: door의 평행 boundary, lift의 상하 이동 축, dock의 접근 bracket은 공간 전이 종류를 작은 map marker에서 구분하기 위한 기능적 geometry입니다. 작은 지도 라벨에서는 종류명보다 현재 endpoint(`출발/도착/연결`)를 먼저 보여 두 map의 역할을 즉시 구분하고, 종류와 전체 상태는 glyph·접근성 이름·inspector로 보존합니다. availability의 dash/slash/question은 색 외 단서입니다. 그 외 icon set, card chrome, 독자 radius는 도입하지 않았습니다.

## Authoritative external basis

- [Open-RMF `Graph.hpp`, pinned `39f09e7`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): lane node에는 entry/exit event가 연결되고 lift session begin, lift move, lift door open, lift session end, dock가 독립 event입니다. 그래서 facility transition을 waypoint나 lane availability로 축약하지 않았습니다.
- [Open-RMF `LiftState.msg`, pinned `26a7f2`](https://github.com/open-rmf/rmf_internal_msgs/blob/26a7f25740ad28c7a838ef7407dba38304a564f5/rmf_lift_msgs/msg/LiftState.msg): current/destination floor, door state, motion state, operating mode, session id가 서로 다른 필드입니다. LDS는 backend floor name을 map identity로 번역하되 상태 축은 독립으로 유지하고 위치·색·phase에서 다른 축을 유추하지 않습니다.
- [Open-RMF `DoorMode.msg`, pinned `26a7f2`](https://github.com/open-rmf/rmf_internal_msgs/blob/26a7f25740ad28c7a838ef7407dba38304a564f5/rmf_door_msgs/msg/DoorMode.msg): closed, moving, open, offline, unknown을 door controller의 별도 mode로 정의합니다. door state를 transition availability와 합치지 않았습니다.
- [Nav2 Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html): route graph의 node/edge와 조밀한 `nav_msgs/Path`, route operation은 다른 층입니다. 이 컴포넌트는 설비 event 상태만 표현하고 route/path geometry와 command 실행을 포함하지 않습니다.

## Intentional exclusions

- lift/door/dock request 발행, session token 획득·종료, retry, 권한, 장치 연결, 상태 polling은 제품 runtime 책임입니다.
- lane direction, planned route, dense trajectory, cabin/lobby 면적은 각각 `LaneOverlay`, route/trajectory overlay, `SpatialRegion`의 책임입니다.
- SVG marker는 유일한 탐색 경로가 아닙니다. 제품은 같은 identity와 독립 상태 축을 이름 있는 semantic mirror/선택 inspector에서도 제공해야 합니다.
- WDS `.fig` component-set 근거가 없는 Robotics 확장이므로 LDS Core 또는 WDS parity로 표현하지 않습니다.
