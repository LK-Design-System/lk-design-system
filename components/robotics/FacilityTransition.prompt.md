# FacilityTransition

`FacilityTransition`은 **LK Robotics Extension**입니다. 문·승강기·도킹·경사로·충전·보안 게이트·핸드오프처럼 lane 진입/이탈에 연결되는 설비 전이·지점을 제품이 제공한 상태 그대로 보여주는 renderer-neutral SVG fragment입니다. 설비 제어, 세션 획득, 상태 추론은 하지 않습니다.

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

- `transition`은 `kind="door" | "lift" | "dock" | "ramp" | "charging" | "gate" | "handoff"`으로 구분되는 직렬화 가능한 데이터입니다. `facilityId`는 필수이고, `from`과 선택적 `to`는 map identity, position, 선택적 waypoint/region/door identity를 소유합니다.
- `activeMapId`가 from/to 어느 쪽과도 맞지 않으면 렌더링하지 않습니다. 한 map에 양 endpoint가 있으면 midpoint, multi-floor 전이면 현재 map의 endpoint에 reference marker를 놓습니다.
- `availability`는 `available | unavailable | unknown`이며 door/lift/dock 내부 상태와 독립입니다. `doorState="offline"`나 lift `operatingMode="offline"`이 들어와도 availability를 자동으로 바꾸지 않습니다.
- door는 `doorState`와 선택적 event(`open | close | pass`)를 분리합니다. event는 Open-RMF lane event의 표시 정보일 뿐 명령 callback이 아닙니다.
- lift phase는 operator reading order인 `approach | waiting | boarding | moving | arrival | exiting`만 표현합니다. `doorState`는 필수이고, `motionState`, `operatingMode`, `sessionState`(`none | requested | owned | other | unknown`)는 source가 제공할 때만 쓰는 선택적 독립 축입니다. phase로 합치거나 누락을 unknown으로 추론하지 않습니다. current/destination도 선택적 floor 표시 문자열이 아니라 명시적 `currentMapId`/`destinationMapId`로 유지합니다.
- dock phase는 `approach | docking | docked | undocking | complete`입니다. offline/unknown을 phase로 만들지 않고 source adapter가 availability로 전달합니다.
- ramp(경사로)·charging(충전 지점)·gate(보안 게이트)·handoff(핸드오프 지점)는 movable part가 없거나 세부 상태를 제품이 소유하는 passive 설비라 phase/state 축 없이 `availability`만 사용합니다. ramp는 두 map을 잇는 수동 층간 전이(승강기의 정적 대안), charging은 dock 계열 충전 지점, gate는 인증으로 열리는 access-controlled 통로(door의 보안 버전), handoff는 적재물을 싣고 내리는 이송 지점입니다. 개폐·점유·충전·이송 진행 같은 세부 상태는 제품이 소유하며 marker는 유추하지 않습니다. AGV가 통과할 수 없는 **계단** 같은 배리어는 전이가 아니므로 여기 두지 않고 `HazardMarker`가 소유합니다. 같은 경사로라도 해당 fleet가 오를 수 없다면 제품이 `HazardMarker`의 `ramp` kind로 분류합니다 — 두 컴포넌트는 같은 LDS 경사로 실루엣 글리프를 공유합니다.
- availability는 solid/dashed/dotted ring, unavailable slash, unknown question SVG와 텍스트를 함께 사용합니다. 지도 라벨은 `출발/도착/연결 → identity → phase·availability → 장치 상태` 순서로 읽히며, 세션과 map identity를 포함한 전체 독립 상태 축은 `data-*`, 접근성 이름, semantic mirror/inspector에 남습니다.
- marker와 label은 `viewportScale`의 역수를 적용하고 stroke는 `vector-effect="non-scaling-stroke"`를 사용합니다. 소비자는 world zoom만이 아니라 실제 SVG CSS 크기/viewBox 비율까지 합친 scale을 전달합니다. 투명 hit circle은 최종 화면에서 34 CSS px로, 원 안에 24×24 CSS px 정사각형이 들어가도록 유지하며 story는 `getBoundingClientRect()`로 최종 target을 측정합니다.
- `onActivate`는 pointer, Enter, Space로 같은 `onActivate(id, event)`를 호출하는 선택/검사 callback입니다. lift call, door open, dock 시작, session request/end 같은 command API는 의도적으로 없습니다.
- interactive marker의 `disabled`는 활성화를 막고 `aria-disabled`를 노출하며 소비자가 넘긴 `tabIndex`도 `-1`로 덮어씁니다. passive marker에는 불필요한 disabled ARIA를 붙이지 않습니다. `hidden`은 DOM과 접근성 트리에서 제거하고, native `aria-label`은 자동 생성된 전체 상태 이름을 덮어쓸 수 있습니다.
- 이름 있는 semantic mirror가 키보드·스크린 리더 탐색을 소유하는 composed map에서는 `aria-hidden`을 pointer-only 모드로 사용합니다. 이 모드는 map fragment의 role/name/state ARIA와 tabindex를 제거하고 `focusable="false"` 및 mouse-down 기본 포커스 방지로 pointer 선택 뒤 숨겨진 SVG에 포커스가 남지 않게 합니다. pointer `onActivate`는 유지하지만 Enter/Space activation은 만들지 않습니다.
- 키보드 포커스는 marker 형상을 따르는 내부 `data-transition-focus-ring` 하나로 표시합니다. `tokens/focus.css`의 Robotics Navigation 전용 opt-out이 전역 사각 outline을 제거하므로 라벨까지 둘러싸는 두 번째 ring을 함께 표시하지 않습니다.
- 선택·포커스·오류·지연은 availability 및 door/lift/dock source state와 독립입니다. 각 ring/badge를 동시에 보존하고 자동 접근성 이름에도 동일한 상태를 넣으며 오류에는 `aria-invalid`를 노출합니다. unknown은 LDS `question`, invalid는 `exclamation`, stale은 `clock` hands를 재사용·축약한 공통 SVG geometry이며 font 문자와 baseline에 의존하지 않습니다. 세 상태가 함께 있으면 분리된 screen-space 슬롯을 사용하고, 상태 색은 badge 외곽선에 두되 내부 glyph는 appearance-aware viewer foreground를 사용합니다. passive selected/focused transition은 `role="img"`를 유지하고 `aria-pressed`를 만들지 않습니다. `disabled` opacity는 `0.45`, `stale` opacity는 `0.76`입니다.

## Internal LDS inspection and visual-delta inventory

- `Map2DCanvas`와 `ViewerFrame`을 확인해 viewport/frame ownership을 유지했습니다. 이 컴포넌트는 `<g>` 조각만 반환하며 grid, toolbar, panel, recovery action을 만들지 않습니다.
- `SpatialRegion`과 같은 map feature 순서 및 `--viewer-*` 역할 token을 사용합니다. facility marker는 region보다 위에서 읽히지만 별도 palette나 shadow를 추가하지 않습니다.
- `EquipmentStatusCard`는 설비 목록에서 heading identity, 보이는 대표 상태와 labeled facts를 semantic article로 묶습니다. `FacilityTransition`은 지도 annotation이므로 카드 radius·border·description-list layout을 복제하지 않고 marker + 직접 상태 라벨만 둡니다.
- `DirectionalPad`의 handler/disabled/keyboard 차단을 비교했습니다. 여기서는 제어가 아니라 inspect activation만 제공하므로 press-and-hold, repeat, 명령 상태를 가져오지 않습니다.
- `assets/icons/question.svg`, `exclamation.svg`, `clock.svg`와 생성된 `Icon` registry를 먼저 확인했습니다. 상태 badge는 `_NavigationStateGlyph.js`에서 이 geometry를 화면 중심 원점에 배치하며, stale은 badge 외곽을 clock perimeter로 사용해 이중 원을 피하고 registry clock의 hands만 축약합니다. 그래서 글꼴별 `?`, `!`, `~` 폭·baseline 차이가 없습니다.
- 유지한 시각 차이: door의 평행 boundary, lift의 상하 이동 축, dock의 접근 bracket, ramp의 incline silhouette, charging의 bolt, gate의 shield, handoff의 적재(load-into-box) 글리프는 공간 전이 종류를 작은 map marker에서 구분하기 위한 기능적 geometry입니다. ramp·handoff를 뺀 글리프는 Material Symbols(Apache 2.0) 원본이고, ramp·handoff는 Material Symbols에 층간 경사로·filled transfer 글리프가 없어 LDS가 같은 960 grid로 그린 것입니다(`docs/references/ATTRIBUTIONS.md`). 작은 지도 라벨에서는 종류명보다 현재 endpoint(`출발/도착/연결`)를 먼저 보여 두 map의 역할을 즉시 구분하고, 종류와 전체 상태는 glyph·접근성 이름·inspector로 보존합니다. availability의 dash/slash/question은 색 외 단서입니다. 그 외 icon set, card chrome, 독자 radius는 도입하지 않았습니다.

## Authoritative external basis

- [Open-RMF `Graph.hpp`, pinned `39f09e7`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp): lane node에는 entry/exit event가 연결되고 lift session begin, lift move, lift door open, lift session end, dock가 독립 event입니다. 그래서 facility transition을 waypoint나 lane availability로 축약하지 않았습니다.
- [Open-RMF `LiftState.msg`, pinned `26a7f2`](https://github.com/open-rmf/rmf_internal_msgs/blob/26a7f25740ad28c7a838ef7407dba38304a564f5/rmf_lift_msgs/msg/LiftState.msg): current/destination floor, door state, motion state, operating mode, session id가 서로 다른 필드입니다. LDS는 backend floor name을 map identity로 번역하되 상태 축은 독립으로 유지하고 위치·색·phase에서 다른 축을 유추하지 않습니다.
- [Open-RMF `DoorMode.msg`, pinned `26a7f2`](https://github.com/open-rmf/rmf_internal_msgs/blob/26a7f25740ad28c7a838ef7407dba38304a564f5/rmf_door_msgs/msg/DoorMode.msg): closed, moving, open, offline, unknown을 door controller의 별도 mode로 정의합니다. door state를 transition availability와 합치지 않았습니다.
- [Nav2 Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html): route graph의 node/edge와 조밀한 `nav_msgs/Path`, route operation은 다른 층입니다. 이 컴포넌트는 설비 event 상태만 표현하고 route/path geometry와 command 실행을 포함하지 않습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 원형 target의 bounding box가 아니라 실제 shape 안에 24×24 CSS px 정사각형이 들어가야 함을 설명합니다. 따라서 marker보다 넓은 34px 투명 원과 동일 identity의 semantic mirror를 사용합니다.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): marker 경계와 선택·포커스·오류·지연처럼 상태를 식별하는 데 필요한 graphical cue는 인접 색과 3:1 이상 대비가 필요합니다. 따라서 opacity만으로 상태를 구분하지 않고 semantic focus/status stroke, dash, slash/question, 독립 badge를 함께 쓰며 각 viewer appearance에서 대비를 검증합니다.
- [MapLibre Style Specification — Layers](https://maplibre.org/maplibre-style-spec/layers/): symbol collision은 `text/icon-allow-overlap`, placement, sort key 등 map-wide layer 정책이 결정합니다. `FacilityTransition`은 endpoint marker와 직접 라벨만 제공하며, 다른 annotation과의 우선순위·충돌·라벨 숨김은 전체 feature 집합을 아는 제품 renderer가 소유합니다. renderer는 라벨을 숨겨도 marker identity와 semantic mirror 상태를 유지합니다. 그 renderer 조각의 reference 구현은 `components/robotics/NavigationAnnotationLayer.jsx`이며, provider 없이 단독 렌더된 marker는 오늘과 동일하게 동작합니다.

## Intentional exclusions

- lift/door/dock request 발행, session token 획득·종료, retry, 권한, 장치 연결, 상태 polling은 제품 runtime 책임입니다.
- lane direction, planned route, dense trajectory, cabin/lobby 면적은 각각 `LaneOverlay`, route/trajectory overlay, `SpatialRegion`의 책임입니다.
- SVG marker는 유일한 탐색 경로가 아닙니다. 제품은 같은 identity와 독립 상태 축을 이름 있는 semantic mirror/선택 inspector에서도 제공해야 합니다.
- WDS `.fig` component-set 근거가 없는 Robotics 확장이므로 LDS Core 또는 WDS parity로 표현하지 않습니다.
