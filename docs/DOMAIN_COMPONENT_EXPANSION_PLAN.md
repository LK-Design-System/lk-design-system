# 도메인 컴포넌트 확장 계획

| Field | Value |
| --- | --- |
| Type | Completed implementation plan |
| Status | Completed · follow-up review active |
| Owner | Design system owner · Product design/engineering · Robotics domain engineering |
| Date | 2026-07-12 |
| Completed in | `e5b0f6c`, merged by `43ac938` |
| Result | [`handoff/2026-07-12-domain-expansion-completion-and-visual-review.md`](handoff/2026-07-12-domain-expansion-completion-and-visual-review.md) |

이 계획의 N1–N6, C1–C4, K1 구현 단계는 완료됐다. 아래 실행 순서와 당시 기준선은 historical decision evidence로 유지하며, 현재 컴포넌트 검토와 후속 보완은 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)를 따른다.

이 문서는 채팅·메시지, 로보틱스 경로·공간 의미, 가상 키패드/키보드의 확장 순서와
디자인 시스템 경계를 정의한다. 완성 앱 화면이나 백엔드 정책을 Storybook에 옮기는 계획이 아니며,
새 공개 API·공유 토큰·대량 분류 변경을 자동 승인하지 않는다.

## 결정 요약

| 트랙 | 판정 | 기본 계층 | 기본 우선순위 |
| --- | --- | --- | ---: |
| 로보틱스 내비게이션 의미 | 필수 확장 | `LDS Robotics/Navigation` | 1 |
| 채팅·메시지 | 재사용 계약으로 재검토 | `LDS Product/Communication` | 2 |
| 가상 입력 | 숫자 키패드부터 조건부 확장 | `LDS Product/Selection and Input` | 3 |
| 범용 가상 키보드 | 실제 장치 제약 확인 후 결정 | Product 또는 Robotics extension | 4 |

첫 구현 전에 현재 패밀리 안정화 작업의 static Storybook·IA·전체 검증을 끝내고 기준선을 고정한다.
상세 재개 순서는 [`handoff/2026-07-12-family-stabilization-verification.md`](handoff/2026-07-12-family-stabilization-verification.md)의
"다음 턴의 단일 최종 체크포인트"를 따른다.

## 현재 기준선과 실제 공백

| 영역 | 현재 재사용 표면 | 확인된 공백 |
| --- | --- | --- |
| 채팅 | `Bubble`, `Textarea`, `Button`, `Avatar`, `SourceDisclosure`, `FileUploadQueue` | `Bubble`은 주석 표면일 뿐 작성자·시간·그룹·전송·streaming·실패·재시도 계약이 없다. 기존 문서는 message feed와 composer를 제품 조합으로 전부 넘긴다. |
| 지도 | `Map2DCanvas`, `ViewerFrame`, `ViewerToolbar`, Editor 패널 | viewport shell은 있으나 navigation graph, waypoint 역할, lane, 계획 경로, 공간 구역, 시설 전환의 공용 의미 모델과 렌더 계약이 없다. |
| 가상 입력 | native `inputMode`, `PinInput`, `DirectionalPad` | 숫자·좌표·속도·각도용 화면 키패드가 없고, 범용 키보드가 필요한 장치 조건도 아직 원장화하지 않았다. |

기존 `Bubble`과 `Map2DCanvas`의 책임은 유지한다. 새 패밀리는 이 컴포넌트를 억지로 확장하지 않고
독립 계약으로 설계한다. `Bubble` 이름 변경이 필요하면 별도 deprecation과 migration 승인을 거친다.

## 공통 범위 원칙

### LDS가 소유하는 것

- 반복되는 anatomy, 시각 위계, 상태 표현, 선택·초점·키보드 계약
- normal, narrow, dark/inverse, disabled, loading, empty, error의 대표 렌더 상태
- 색 외의 상태 단서, 접근 가능한 이름·설명, live-region 및 focus 정책
- 제품 renderer가 동일한 의미를 표현할 수 있는 role token과 최소 데이터 계약
- 실제 제품 화면과 분리된 Storybook 컴포넌트/패턴 증거

### 제품 또는 로보틱스 런타임이 소유하는 것

- 채팅 transport, provider, retrieval, citation truth, persistence, moderation, 권한
- 경로 계획, 충돌·통행 가능성·ETA·도달 판정, 재계획, ROS 메시지 변환
- lift session 획득, watchdog, door/lift command, lane closure와 mutex 점유 판단
- 지도 투영·좌표 변환·tile/source 로딩과 Canvas/Konva/WebGL renderer 수명주기
- 한글·다국어 IME 엔진, 예측 입력, OS 보안 키보드, 입력 정책

### Storybook 경계

- `Chat Window`, 관제 화면, 경로 편집 워크스페이스, lift 운행 workflow를 public story로 만들지 않는다.
- 실제로 export되는 컴포넌트의 상태와 작은 조합 패턴만 공개한다.
- 전송·경로 계획·설비 제어는 fixture callback으로만 표현하고 성공한 실제 제어처럼 보이지 않게 한다.
- WDS 내부 component-set 근거가 없는 이 계획의 후보는 모두 LK Product/Robotics extension이며
  WDS parity를 주장하지 않는다.

## 공통 실행 게이트

| Gate | 필요한 산출물 | 통과 기준 |
| --- | --- | --- |
| G0 · 기준선 고정 | 기존 안정화 static build, IA 재생성·검토 승격, 전체 check | 현재 dirty diff가 전체 green인 한 체크포인트로 닫힘 |
| G1 · 소비 근거 | 실제 제품/장치별 사용자 문제, 데이터 소스, 실패·복구, renderer/OS 제약 | 화면 모양이 아니라 반복되는 계약이 확인됨 |
| G2 · 의미 모델 | 용어, anatomy, state matrix, 제품 소유 seam, 접근성 순서 | 서로 다른 개념을 하나의 variant 축에 합치지 않음 |
| G3 · 설계 근거 | LDS 형제 delta, 권위 외부 자료, 분류, 의도적 제외 | 시각·행동 차이마다 근거가 있음 |
| G4 · 표적 prototype | component, `.d.ts`, prompt, normal/narrow/dark story, play | 대표 실제 콘텐츠에서 overflow·초점·상태 위계가 확인됨 |
| G5 · 공개 준비 | API/state/accessibility 문서, inventory/IA/분류 원장, 최종 전체 check | 공개 경로와 패키지 surface가 동기화됨 |

### G0 실행 기록 · 2026-07-12

- Storybook static build와 IA 168페이지·470스토리의 source/role/visibility human review를 완료했다.
- consumer, rendered style parity, public surface, 접근성 470/470, 37개 visual smoke, package artifact 설치·
  ESM/CJS/subpath/SSR 검증이 통과했다.
- `check:generated`는 의도된 미커밋 `src`/`dist` 차이를 금지하는 clean-worktree gate라 현재 병렬 작업 상태에서
  격리했다. Windows의 `spawnSync npm ENOENT`는 같은 package smoke를 `npm-cli.js`로 실행해 통과를 확인했다.
- 이후 N/C/K 구현 중에는 component/story별 표적 검증만 실행하고, 전체 suite는 G5에서 한 번 다시 실행한다.

G1에서 공통 소비자가 확인되지 않으면 완성 wrapper를 만들지 않는다. 다만 로보틱스 내비게이션처럼
LDS 정체성에 필수적인 도메인 의미는 한 제품만 사용하더라도 독립 계약과 런타임 경계가 명확하면
Robotics extension 후보가 될 수 있다.

## Track N — 로보틱스 내비게이션 의미

### 용어를 먼저 고정한다

Open-RMF와 Nav2는 `route`와 `path`를 같은 뜻으로 쓰지 않는다. 구현 전에 LDS 공개 용어를 아래처럼
분리하고, 제품 데이터 이름을 그대로 public prop 이름으로 복사하지 않는다.

| LDS 개념 후보 | 의미 | 포함하지 않는 것 |
| --- | --- | --- |
| Navigation graph | 정적인 waypoint/node와 방향성 lane/edge의 연결 | 현재 실행 경로와 실제 robot trajectory |
| Waypoint | 이름·좌표와 중첩 가능한 역할을 가진 그래프 지점 | 면적을 가진 zone이나 lift cabin |
| Lane | 두 waypoint 사이의 방향성 연결과 진입/이탈 제약 | 자유 공간에서 계산된 조밀한 path |
| Planned route | 선택된 graph node/edge 또는 층별 구간의 순서 | 현재 위치만으로 추론한 진행 상태 |
| Trajectory/path | 로봇이 따라갈 조밀한 기하 또는 시간 기반 궤적 | 정적 graph topology |
| Spatial region | 면적과 행동·시설·지형 의미가 있는 영역 | 점 marker와 단순 polyline |
| Facility transition | door/lift/dock처럼 구간 진입·이탈에서 발생하는 시설 이벤트 | 설비 명령 실행과 session 획득 |

### Open-RMF를 번역하는 기준

Open-RMF는 복제 대상 UI가 아니라 도메인 의미의 권위 참고 자료다. 구현 시작 시 사용하는 repo의
정확한 commit SHA를 기록하고, 다음 결론만 LDS 계약으로 번역한다.

| Open-RMF 근거 | 도메인 결론 | LDS 적용 |
| --- | --- | --- |
| [`Graph::Waypoint`](https://github.com/open-rmf/rmf_traffic/blob/main/rmf_traffic/include/rmf_traffic/agv/Graph.hpp) | holding, passthrough, parking, charger는 상호 배타적 type이 아니라 독립 속성이다. | `WaypointMarker`를 단일 `kind` enum만으로 제한하지 않고 중첩 가능한 role/annotation과 우선순위 규칙을 검토한다. |
| [`Traffic Editor` vertex parameters](https://github.com/open-rmf/rmf_traffic_editor/blob/main/rmf_traffic_editor/gui/vertex.cpp) | waypoint에는 dock, cleaning, dispenser/ingestor, mutex 같은 제품 annotation이 추가될 수 있다. | 핵심 역할과 제품 확장 metadata를 분리하고 임의 metadata가 새 시각 언어를 만들지 않게 한다. |
| [`Graph::Lane::Node`와 event](https://github.com/open-rmf/rmf_traffic/blob/main/rmf_traffic/include/rmf_traffic/agv/Graph.hpp) | lane entry/exit에는 orientation constraint와 door/lift/dock/wait event가 연결된다. | `Lane`의 방향·상태와 `FacilityTransition`을 분리하되 관계를 표시할 수 있게 한다. |
| [`LiftSessionBegin`, `LiftMove`, `LiftDoorOpen`, `LiftSessionEnd`](https://github.com/open-rmf/rmf_traffic/blob/main/rmf_traffic/include/rmf_traffic/agv/Graph.hpp) | 엘리베이터는 하나의 waypoint variant가 아니라 접근 지점, cabin 영역, door, 층간 event의 결합이다. | 탑승 지점은 waypoint annotation, cabin/로비는 facility region, 층간 이동은 transition으로 분리한다. |
| [`LiftState`](https://github.com/open-rmf/rmf_internal_msgs/blob/main/rmf_lift_msgs/msg/LiftState.msg) / [`LiftRequest`](https://github.com/open-rmf/rmf_internal_msgs/blob/main/rmf_lift_msgs/msg/LiftRequest.msg) | current/destination floor, door, motion, operating mode, session ownership은 독립 상태다. | `FacilityTransition`은 이 상태를 제품에서 명시적으로 전달받고 위치나 색만으로 추론하지 않는다. request/session 제어는 런타임에 남긴다. |
| [`DoorMode`](https://github.com/open-rmf/rmf_internal_msgs/blob/main/rmf_door_msgs/msg/DoorMode.msg) | door는 closed, moving, open, offline, unknown의 독립 설비 상태를 가진다. | door 상태를 lane의 available/closed와 합치지 않고 연결된 facility state로 표시한다. |
| [`rmf_visualization`](https://github.com/open-rmf/rmf_visualization) | 정적 graph, 예정 trajectory, robot 위치, door/lift 상태는 서로 다른 source와 layer다. | 하나의 `routeStatus` 객체로 합치지 않고 layer별 freshness·availability를 제품에서 전달받는다. |
| [`rmf_demos`](https://github.com/open-rmf/rmf_demos) | multi-floor 이동과 lift/door는 공유 자원 및 교통 충돌과 연결된다. | lift 상태를 장식 아이콘으로 축소하지 않고 unavailable, waiting, occupied, moving, door 상태를 텍스트와 함께 표현한다. |

Open-RMF의 색·선 두께를 그대로 복사하지 않는다. 예를 들어 closed lane과 speed-limited lane의
표현은 LDS token, line pattern, label/icon을 함께 사용해 색 외 단서가 남도록 재설계한다.

### Nav2로 보완하는 기준

- [Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html)는 graph의 node/edge route와
  조밀한 `nav_msgs/Path`를 분리한다. LDS도 route graph와 trajectory/path를 다른 layer와 상태로 둔다.
- [Navigation Concepts](https://docs.nav2.org/concepts/index.html)는 keep-out, speed restriction, preferred lane을
  서로 다른 공간 행동으로 정의하고 gradient map을 경사 traversability 표현으로 구분한다.
- [Vector Objects](https://docs.nav2.org/tutorials/docs/navigation2_with_vector_objects.html)는 polygon/circle 같은
  공간 객체가 keep-out 외에도 speed, binary behavior, custom spatial rule에 쓰일 수 있음을 보여준다.

따라서 `zone` 하나에 모든 의미를 색 variant로 넣지 않는다. 최소한 아래 세 의미군을 독립적으로
판정한다.

- behavior zone: keep-out, speed limit, preferred corridor, operation area
- facility region: lift cabin/lobby, door vicinity, dock/charger area
- terrain region: slope/grade, roughness, clearance처럼 traversability에 영향을 주는 영역

경사 영역은 단순 warning tone이 아니라 grade, 방향, 단위, 적용 대상과 통행 가능 여부를 읽을 수 있어야 한다.

### 후보 계약과 구현 순서

| 단계 | 후보 | 첫 계약 |
| --- | --- | --- |
| N0 | renderer strategy | semantic types/token과 SVG reference renderer를 분리할지 결정한다. Canvas/Konva 전용 API를 public 기본값으로 만들지 않는다. |
| N1 | `WaypointMarker` | identity, label, 중첩 role, selected/focused/disabled/invalid/stale, 넓은 hit area |
| N2 | `LaneOverlay` | direction, bidirectional relation, available/closed/speed-limited/conflict, entry/exit event 표시 |
| N3 | `RouteOverlay` / `TrajectoryOverlay` | planned/current/completed/waiting/blocked/rerouting, 층별 구간과 현재 진행 위치 |
| N4 | `SpatialRegion` 계열 | behavior/facility/terrain 의미, polygon/shape, label, rule, selected/hidden/invalid |
| N5 | `FacilityTransition` | approach, waiting, session, door, moving, arrival, unavailable를 제품 제공 상태로 표현 |
| N6 | legend/semantic mirror pattern | map legend, layer toggle, 선택 객체 요약을 `LayerPanel`·`SelectionInspector`와 연결 |

`N0`에서 SVG/DOM reference component와 renderer-neutral appearance helper의 경계를 먼저 결정한다.
모든 제품 renderer가 React DOM marker를 직접 쓸 수 있다고 가정하지 않는다.

### N0 결정 · renderer와 의미 모델 경계 (2026-07-12)

- 공개 데이터는 React, SVG, Canvas 명령, 색상 값과 무관한 직렬화 가능한 의미 모델로 둔다.
- `WaypointMarker`, `LaneOverlay`, `RouteOverlay`, `TrajectoryOverlay`, `SpatialRegion`,
  `FacilityTransition`의 reference renderer는 독립 `<svg>`가 아니라 `<g>`, `<path>`, `<circle>` 조각을
  반환한다. `Map2DCanvas`의 transformed children이나 제품 renderer adapter가 최종 viewport를 소유한다.
- 선은 `vector-effect="non-scaling-stroke"`를 사용하고, waypoint의 보이는 크기와 투명 hit area는
  `viewportScale` 역수를 적용해 zoom과 무관한 화면 크기를 유지한다. 최소 hit area는 24 CSS px다.
- 기본 paint order는 `region → lane → route/trajectory → waypoint/facility → selection/focus`다.
  이 순서는 시각 z-order이며 키보드 순서가 아니다.
- SVG/Canvas feature 자체를 유일한 탐색 경로로 만들지 않는다. N6의 이름 있는 semantic mirror 목록과
  `SelectionInspector` 요약이 같은 identity·state를 제공한다.
- Canvas/Konva/WebGL 제품은 같은 의미 모델을 adapter로 번역한다. 공개 API에 renderer 명령이나
  임의 metadata 기반 색상 규칙을 넣지 않는다.
- backend source-of-truth가 RMF/Nav2/LK 중 무엇인지 제품별로 확정되기 전에는 이 문서의 타입을
  의미 경계 후보로 사용하고, backend schema를 그대로 공개 API로 고정하지 않는다.

검토에 사용한 upstream 기준 SHA는 다음과 같다.

- `rmf_traffic` `39f09e7971c8e666e12c8e9b12199014f631c0bb`
- `rmf_traffic_editor` `922a66315fb374a8c4640a4f25ad447c4c58b218`
- `rmf_internal_msgs` `26a7f25740ad28c7a838ef7407dba38304a564f5`
- `rmf_visualization` `6c06184c3ec33441b2f94d356c2d43df4233b74a`
- `rmf_ros2` `75594b75d99b7b0686d2ef2f302f425c261153a9`
- `navigation2` `4a40bb9357f3bd11414be6573522ef1613f1cdd3`

### 필수 스토리와 접근성

- normal: 여러 waypoint 역할, 방향 lane, planned route, 세 종류 region을 같은 지도에서 구분
- compound: lift 접근 waypoint → cabin region → 층간 transition → 도착 층 route
- state: closed/conflict/rerouting/stale/unavailable와 제품 제공 복구 설명
- narrow: 320px에서 toolbar, legend, 선택 정보가 viewport를 가리지 않는지 확인
- dark: 같은 의미·우선순위를 유지하고 색 외 선 패턴·glyph·label이 남는지 확인
- selection: pointer hit area와 keyboard/목록 기반 선택 경로를 함께 제공
- semantic mirror: 순수 canvas/SVG 정보가 이름 있는 목록·선택 요약에서도 같은 순서와 상태로 읽힘

## Track C — 채팅·메시지

### 기존 판정의 재검토 범위

기존 문서가 `ScopedConversation` 같은 제품 workflow wrapper를 제거한 결정은 유지한다. 다만 message와
composer를 단순 조합으로만 본 판정은 다음 독립 계약 때문에 재검토한다.

- 작성자/발신 방향, 시간, 연속 메시지 그룹, attachment/source/action slot
- sending, queued, streaming, complete, failed, cancelled와 retry/stop action
- 새 메시지 announcement, history loading, scroll anchoring, unread jump
- multiline submit, Enter/Shift+Enter, IME composition 중 오발송 방지, disabled 이유

[WAI-ARIA `log`](https://www.w3.org/TR/wai-aria/#log)는 chat log와 messaging history를 의미 있는 순서로
추가되는 polite live region의 예로 든다. [Carbon AI Chat hierarchy](https://chat.carbondesignsystem.com/tag/latest/docs/hierarchy.html)는
message input과 response item을 분리하고, [server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)은
streaming, loading, timeout, stop/cancel, final state를 독립 수명주기로 다룬다. LDS는 이 구조에서 시각·접근성
계약만 취하고 provider API나 transport를 복제하지 않는다.

### 후보 계약과 구현 순서

| 단계 | 후보 | 첫 계약 |
| --- | --- | --- |
| C0 | 소비 모델 audit | 사람 간 채팅, 운영 메시지, AI assistant 중 실제 공통 상태와 차이를 분리 |
| C1 | `ConversationMessage` | author/role, content, metadata, grouping, attachment/source/action slot, delivery/stream state |
| C2 | `MessageFeed` | `role="log"`, labelled region, busy/history, follow/unread를 controlled state로 제공 |
| C3 | `MessageComposer` | value/submit, multiline, IME, pending/streaming stop, disabled reason, attachment/action slot |
| C4 | composition story | Message + Feed + Composer + SourceDisclosure 조합을 보여주되 `ChatWindow` export는 만들지 않음 |

`Bubble`은 annotation/coach-mark 성격을 유지한다. 대화 메시지를 `Bubble` variant로 넣지 않으며,
나중에 `AnnotationBubble`로 이름을 명확히 할지는 별도 breaking/deprecation 판단으로 남긴다.

### 필수 스토리와 접근성

- inbound/outbound/system, 동일 작성자 연속 그룹, 긴 한글·영문·코드·링크
- queued/sending/streaming/complete/failed/cancelled와 retry/stop
- attachment/source disclosure, action 유무, timestamp/delivery text
- history loading 중 `aria-busy`, 새 항목 polite announcement, 사용자가 과거 기록을 읽을 때 자동 scroll 금지
- IME 조합 중 Enter, Shift+Enter 줄바꿈, disabled reason, offline/retry
- normal/narrow와 가상 키보드가 올라온 viewport에서 composer가 가려지지 않는지 확인

## Track K — 가상 입력

### native-first 원칙

[HTML `inputmode`](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute)는
사용자 에이전트가 text, numeric, decimal 등 목적에 맞는 입력 방식을 제공하게 한다. `inputmode="none"`은
페이지가 자체 키보드 control을 렌더할 때만 사용한다. 따라서 모든 LDS field가 native input attributes를
전달하는지 먼저 확인한다.

[W3C VirtualKeyboard API](https://www.w3.org/TR/virtual-keyboard/)는 키보드 가시성과 viewport inset 대응을
다루지만 현재 Working Draft다. optional enhancement로만 사용하고 public component의 필수 의존성으로 두지 않는다.

### 후보 계약과 구현 순서

| 단계 | 후보 | 첫 계약 |
| --- | --- | --- |
| K0 | native field audit | `inputMode`, `enterKeyHint`, IME/composition, mobile viewport 전달 여부 확인 |
| K1 | `VirtualKeypad` | numeric/decimal/sign, backspace/clear/confirm, controlled value, locale separator, hardware-key parity |
| K2 | `OperatorKeypad` 판단 | 로봇 명령 단축 입력이 실제 공통 문제일 때만 Robotics/Control extension으로 분리 |
| K3 | `VirtualKeyboard` 판단 | OS keyboard가 없거나 제어할 수 없는 kiosk/embedded 장치 근거가 있을 때만 진행 |

범용 한글 키보드, 후보 단어, 언어 전환, password 보안 surface를 자체 구현하지 않는다. 제품 장치가 OS IME를
사용할 수 있으면 `VirtualKeypad`보다 native keyboard를 우선한다.

### 필수 스토리와 접근성

- integer/decimal/signed 입력, min/max 오류, clear/backspace/confirm disabled
- 44–48px 이상 touch target, pressed/focus/disabled, 반복 입력 정책
- 물리 키보드와 touch 입력 결과 일치, focus가 대상 field에서 예기치 않게 이탈하지 않음
- locale decimal separator와 단위는 값과 분리하고 접근 가능한 설명에 함께 제공
- 320px, landscape kiosk, keyboard inset에서 대상 field와 확인 action이 가려지지 않음

## 제안 Storybook 경로

| 후보 | 제안 경로 |
| --- | --- |
| `ConversationMessage` | `LDS Product/Communication/Message` |
| `MessageFeed` | `LDS Product/Communication/Message Feed` |
| `MessageComposer` | `LDS Product/Communication/Message Composer` |
| `WaypointMarker` | `LDS Robotics/Navigation/Waypoint` |
| `LaneOverlay` | `LDS Robotics/Navigation/Lane` |
| `RouteOverlay` / `TrajectoryOverlay` | `LDS Robotics/Navigation/Route and Trajectory` 또는 검토 후 분리 |
| `SpatialRegion` 계열 | `LDS Robotics/Navigation/Regions` 또는 의미군별 분리 |
| `FacilityTransition` | `LDS Robotics/Navigation/Facility Transition` |
| `VirtualKeypad` | `LDS Product/Selection and Input/Virtual Keypad` |
| `OperatorKeypad` | `LDS Robotics/Control/Operator Keypad` |

첫 공개 스토리는 `개요`, 이후 상태·행동 역할 접두어를 사용한다. 한 페이지에 서로 다른 독립 컴포넌트의
홈을 합치지 않고, 통합 예시는 해당 family의 작은 composition story로 제한한다.

## 권장 실행 순서

1. G0: 현재 패밀리 안정화 final checkpoint를 먼저 닫는다.
2. N0: Open-RMF/Nav2 source commit과 LDS 용어·renderer 전략을 결정한다.
3. N1–N3: waypoint → lane → route/trajectory의 read-only 의미와 선택 계약을 만든다.
4. N4–N6: behavior/facility/terrain region과 lift transition, semantic mirror를 추가한다.
5. C0–C4: 실제 소비 모델을 확인하고 message → feed → composer 순으로 만든다.
6. K0–K1: native input 전달을 감사한 뒤 숫자 `VirtualKeypad`를 만든다.
7. K2–K3: 실제 장치 증거가 있을 때만 operator keypad 또는 범용 keyboard를 승인한다.

Navigation을 먼저 두는 이유는 `Map2DCanvas`와 Editor/Viewer shell이 이미 있지만 그 위에 올라가는 로보틱스
의미가 비어 있기 때문이다. 채팅은 여러 제품에서 반복될 가능성이 높지만 C0에서 human/AI/operations 상태를
섞지 않아야 한다. 범용 keyboard는 OS/장치 제약이 없으면 불필요한 플랫폼 재구현이므로 마지막이다.

## 컴포넌트별 완료 조건

- 가장 가까운 LDS 형제, prompt, story, token을 비교한 visual-delta inventory가 있다.
- 권위 외부 자료 2종 이상과 구체적인 적용/제외 결론을 prompt 또는 이 문서에서 추적할 수 있다.
- WDS Core, Theme Override, Product Extension, Robotics Extension 중 분류가 명시돼 있다.
- normal, compound, error/disabled, narrow, dark/inverse 중 관련 상태가 실제 콘텐츠로 렌더된다.
- DOM/keyboard order와 시각 reading order가 같고 색만으로 상태를 구분하지 않는다.
- 타입, API, prompt, story coverage, 접근성 play를 표적 검증한다.
- 최종 checkpoint에서 Storybook IA, inventory, public 분류, full check를 한 번 갱신한다.

## 구현 전에 답해야 할 질문

- 채팅 소비자는 human chat, operations log, AI assistant 중 무엇이며 공통 상태는 어디까지인가?
- 실제 지도 renderer는 SVG, Canvas, Konva, WebGL 중 무엇이고 공통 semantic adapter가 가능한가?
- waypoint 역할과 lane 상태의 source of truth는 Open-RMF, Nav2, LK backend 중 무엇인가?
- lift boarding point, cabin, lobby, door, session 상태를 현재 API가 각각 제공하는가?
- slope는 polygon metadata, gradient raster, mesh 중 어떤 source이며 grade 단위와 방향을 제공하는가?
- kiosk/embedded 장치에 OS keyboard와 한글 IME가 있는가? 화면 키보드가 필요한 입력은 숫자인가 문자인가?

이 질문이 닫히기 전에는 prop 이름과 variant 축을 확정하지 않는다.

## 권위 참고 자료

- [Open-RMF Traffic Editor](https://github.com/open-rmf/rmf_traffic_editor)
- [Open-RMF traffic graph source](https://github.com/open-rmf/rmf_traffic/blob/main/rmf_traffic/include/rmf_traffic/agv/Graph.hpp)
- [Open-RMF LiftState and LiftRequest messages](https://github.com/open-rmf/rmf_internal_msgs/tree/main/rmf_lift_msgs/msg)
- [Open-RMF DoorMode message](https://github.com/open-rmf/rmf_internal_msgs/blob/main/rmf_door_msgs/msg/DoorMode.msg)
- [Open-RMF visualization](https://github.com/open-rmf/rmf_visualization)
- [Open-RMF demos](https://github.com/open-rmf/rmf_demos)
- [Nav2 Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html)
- [Nav2 Navigation Concepts](https://docs.nav2.org/concepts/index.html)
- [Nav2 Vector Objects](https://docs.nav2.org/tutorials/docs/navigation2_with_vector_objects.html)
- [WAI-ARIA 1.2 `log`](https://www.w3.org/TR/wai-aria/#log)
- [Carbon AI Chat hierarchy](https://chat.carbondesignsystem.com/tag/latest/docs/hierarchy.html)
- [Carbon AI Chat server communication](https://chat.carbondesignsystem.com/tag/latest/docs/documents/Server_communication.html)
- [WHATWG `inputmode`](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute)
- [W3C VirtualKeyboard API](https://www.w3.org/TR/virtual-keyboard/)
