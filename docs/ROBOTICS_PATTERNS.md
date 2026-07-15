# Domain component contracts

| Field | Value |
| --- | --- |
| Type | Stable domain contract |
| Status | Current |
| Owner | Product and Robotics component owners |
| Last reviewed | 2026-07-14 |

이 문서는 완성된 화면이나 서비스 절차 예시를 정의하지 않는다. LK 디자인 시스템 안의 도메인 컴포넌트가 공통으로 지켜야 하는 상태 의미, 안전 문구, 단위 표기, 접근성 계약만 기록한다.

Waypoint·lane·route/trajectory·공간 구역·lift 전환의 Open-RMF/Nav2 근거, renderer 결정, 실행 순서는
[`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md)에서 관리한다. 아래 Navigation
reference renderer는 **LK Robotics Extension**으로 승인됐으며 WDS parity를 주장하지 않는다.

## Scope boundary

- Storybook에는 컴포넌트와 컴포넌트 상태를 둔다.
- 완성 화면과 서비스 절차는 애플리케이션 문서에서 다룬다.
- 도메인 맥락이 필요한 경우에도 `RobotStatusCard`, `Map2DCanvas`, `CanvasEditorShell`, `ManualControlSession`, `AnnotatedImage` 같은 독립 계약이 있는 컴포넌트 story 안에서 대표 상태만 보여준다.
- Do not publish end-to-end flow pages as design system stories.

## Status semantics and operational truth

로보틱스 상태는 하나의 포괄적인 `status`로 합치지 않는다. 사람이 “지금 이 장비를 믿고 조작할 수 있는가?”를 판단할 수 있도록 아래 의미 축을 독립적으로 전달한다. 허용 상태와 컴포넌트 소유권의 기계 판독 가능한 기준은 [`SEMANTIC_CONTRACTS.json`](./references/robotics/SEMANTIC_CONTRACTS.json)에 유지한다.

| 의미 축 | 답해야 하는 질문 | LDS 표현 책임 |
| --- | --- | --- |
| transport | 통신 경로가 연결되어 있는가? | `ConnectionBadge` |
| freshness | 이 값은 얼마나 최근에 관측되었는가? | `TelemetryValue`, timestamp 또는 labeled fact |
| health | 시스템이 정상·저하·고장 중 어느 상태인가? | 제품이 판정하고 `StatusBadge` 등으로 표현 |
| operability | 지금 안전하게 사용할 수 있는가? | 제품이 판정하고 control boundary에 표현 |
| authority | 누가 제어 권한을 갖는가? | `ManualControlSession`과 labeled fact |
| command | 요청이 수락·적용·확인되었는가? | `Timeline`, `StatusBadge` |
| evidence | 이 판단의 근거는 무엇인가? | `SourceDisclosure`, `DescriptionList` |
| review | 사람이 검토하거나 승인했는가? | 제품 workflow가 판정하고 LDS primitive로 조합 |
| urgency | 언제 사용자의 주의를 끌어야 하는가? | tone·live-region 정책으로 별도 표현 |

의미 계약에는 다음 불변 조건을 적용한다.

- `connected`는 fresh, healthy, operable 또는 authorized를 뜻하지 않는다.
- `unknown`은 누락값의 임시 대체가 아니라 모든 운영 의미 축의 명시적인 상태다.
- 마지막으로 알려진 값은 freshness 또는 관측 시각 없이 현재값처럼 표시하지 않는다.
- 제품은 telemetry, threshold, state machine과 policy에서 운영 진실을 계산하고 LDS는 그 결과를 일관되게 표현한다.
- semantic state, visual tone, announcement urgency를 하나의 enum으로 결합하지 않는다.
- 안정 상태와 `connecting`, `reconnecting` 같은 전이 상태를 구분한다.

새 `ConnectionBadge` 사용은 `connectionState`를 기준으로 한다. 기존 `status` prop은 호환을 위해 유지하지만 `online`, `ready`, `weak`, `stale`, `error`를 새 transport 계약으로 확장하지 않는다. 특히 `stale`은 freshness 축이므로 `TelemetryValue`, timestamp 또는 별도 labeled fact가 소유한다.

## Editor and map contracts

Editor 컴포넌트는 **LK Robotics Extension**이며 WDS parity로 주장하지 않는다. 공식 Figma, Unity, Blender, NVIDIA Omniverse, WAI-ARIA, WCAG 자료와 내부 LDS 형제 컴포넌트를 함께 검토한 근거와 의도적 제외 항목은 [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](./EDITOR_LAYOUT_REFERENCE_MATRIX.md)에 유지한다.

| 컴포넌트 | 계약 |
| --- | --- |
| `CanvasEditorShell` | title/description, headerStart, document toolbar, workspace mode subheader, tool rail, optional hierarchy panel, dominant viewport, selection Inspector/drawer, optional status 영역을 분리한다. `headerStart`는 뒤로가기 또는 실제 구조 패널 토글에 쓰고, `objects`/`pgm` 같은 편집 모드는 `subheader`에 둔다. 넓은 화면의 보조 패널은 resize/collapse/restore할 수 있고, 좁은 화면에서는 별도의 semantic region navigation으로 한 패널만 노출한다. responsive navigation을 workspace mode `subheader`로 재사용하지 않으며 모든 워크스페이스가 모든 슬롯을 쓴다고 가정하지 않는다. |
| `CanvasEditorCommandBar` | 우상단에는 실제 handler나 disabled 상태가 있는 문서/history command만 노출하고 LDS의 32px 소형 icon-button 규격으로 정렬한다. undo/redo/save/import/export는 문서 범위에 두고, zoom/fit/orbit/reset은 viewport-local viewer controls가 소유한다. 호환용 view action이 남아 있더라도 새 story와 조합에서는 command bar에 사용하지 않는다. |
| `EditorToolbar` | 상호 배타적인 고빈도 편집 도구만 두고 `ToggleIcon` 기반의 16px glyph/32px control을 사용한다. `ViewerToolbar`와 radius·hover·focus·disabled·roving-focus engine은 공유하되 public state model은 합치지 않는다. Toolbar는 한 번의 Tab으로 진입하고 방향키와 Home/End로 이동하며, 현재 선택 도구와 키보드 focus를 서로 다른 시각 상태로 전달한다. shortcut은 accessible name/`aria-keyshortcuts`와 함께 제공한다. |
| `LayerPanel` | 실제 레이어, 디스플레이, 토픽, 파일, 클래스, 엔티티의 hierarchy와 visibility/lock/active 상태가 있는 경우에만 사용한다. 캔버스와 선택을 공유하고 Tree의 펼침/접힘 및 방향키를 지원하되 focus와 selection을 구분한다. 원본 `lk_web_viz` 맵 편집은 `objects`/`pgm` 탭, 왼쪽 도구 레일, 오른쪽 속성 사이드바 중심이므로 `LayerPanel`을 기본 구조로 간주하지 않는다. |
| `SelectionInspector` | 레이어가 아니라 waypoint, lane, zone, point-cloud crop volume, annotation 같은 캔버스 객체의 선택을 따른다. 고정 header는 selection identity/status와 전체 선택 해제를, scroll body는 그룹화된 속성을, sticky footer는 선택 객체 action을 소유한다. no selection, single, same-type multi, mixed selection과 locked/read-only/stale/invalid를 구분하고 mixed 값은 `—`로 표시한다. 표준 field는 scalar `value`와 문자열 `unit`을 사용하고, 복합 ReactNode는 자동 단위 결합을 우회하는 `valueNode` escape로만 받는다. 반복적인 속성 편집은 docked panel, 가벼운 확인은 drawer를 사용한다. |
| `ViewportStatusBar` | mode, cursor/camera, zoom, selected count, snap, point count, FPS 중 현재 문맥에 필요한 항목만 우선순위에 따라 수동적인 한 줄로 표시한다. item 값은 string/number, 단위는 문자열로 제한해 표시·접근성 텍스트가 같은 결합 규칙을 쓰게 한다. 좁을 때 낮은 우선순위 항목을 줄이고 wrapping이나 command action을 허용하지 않는다. |
| `HistoryToolbar` | icon-only button은 accessible name을 갖고 undo/redo disabled 이유가 프로그램적으로 전달되어야 한다. document header에서만 사용하고 viewport action과 섞지 않는다. |
| `Map2DCanvas` | grid와 world transform, pan/zoom, viewer 상태·도구만 소유한다. waypoint, lane, route, trajectory, region, facility reference fragment는 같은 SVG 좌표계 안에 합성하되 viewport chrome을 다시 만들지 않는다. 선택/드로잉 모드에서는 pan interaction을 끌 수 있어야 한다. |
| `WaypointMarker` | 한 graph 지점의 identity, map/position, 중첩 가능한 holding·passthrough·parking·charger 역할과 별도 annotation을 표현한다. zoom과 무관한 24px hit area와 label을 유지하고 unavailable·unknown·stale·invalid·selected·focused를 색 외 slash·`?`·dash·ring으로 함께 표시한다. lift 접근은 annotation이며 cabin/transition이 아니다. |
| `LaneOverlay` | 방향성 `points`, entry/exit waypoint와 orientation/transition reference, paired lane relation, speed limit, mutex를 정적 graph data로 둔다. runtime `available/closed/unknown`과 conflict는 독립 prop이며 door/lift 상태를 lane에 합치지 않는다. 양방향은 boolean이 아니라 실제 반대 lane ID로 표현한다. |
| `RouteOverlay` / `TrajectoryOverlay` | Route는 층별 graph segment의 completed/current/upcoming phase와 normal/waiting/blocked/conflict condition, 명시적 segment progress를 소유한다. Trajectory는 한 map의 조밀한 position/time/heading sample을 소유한다. route와 path를 같은 선 variant로 합치거나 층 사이를 임의 직선으로 연결하지 않는다. |
| `SpatialRegion` | behavior rule(keep-out, speed limit, preferred, operation), facility area, terrain/traversability를 category·pattern·visible text로 분리한다. slope grade 값·단위·선택적 방향은 source data이며 category 자체를 성공/경고 status color로 취급하지 않는다. |
| `FacilityTransition` | door/lift/dock endpoint와 availability를 표현하되 실제 제어는 하지 않는다. lift phase, door state, motion, operating mode, session state, current/destination map은 독립 축이며 다른 축이나 marker 위치에서 추론하지 않는다. |
| Navigation semantic mirror pattern | SVG paint order는 region → lane → route/trajectory → waypoint/facility → selection/focus다. keyboard 탐색 순서는 SVG z-order에 맡기지 않고 이름 있는 목록, `LayerPanel`의 layer visibility, `SelectionInspector`의 선택 요약으로 같은 identity와 state를 제공한다. |
| `TopicTree` | 기본 Tree와 selection, density, expand affordance를 맞춘다. |

`CanvasEditorShell`은 임의 위치 docking, floating window manager, 사용자 layout 직렬화/복원, 제품별 workflow와 저장 정책을 의도적으로 소유하지 않는다. drag splitter나 reorder가 있으면 키보드 또는 버튼 기반 동등 조작을 함께 제공한다.

Editor/Viewer control family rules:

- `EditorToolbar`, `ViewerToolbar`, `HistoryToolbar`, `CanvasEditorCommandBar`의 icon control은 32px, glyph는 16px, 인접 간격은 `--space-1`이며 같은 roving-focus 엔진을 사용한다. 선택 필수 mode, 독립 toggle, 일회성 command라는 역할 차이만 state model에 남긴다.
- `LayerPanel`은 hierarchy scan을 위해 compact row 밀도를 유지하고 `SelectionInspector`는 identity와 form hierarchy를 위해 더 강한 header를 유지한다. 두 패널 모두 shell surface, typography token, 32px micro-action, `signal / positive / cautionary / negative` 상태 어휘를 공유한다.
- 선택 객체의 파괴적 액션은 danger control로 표시하고 적용/저장과 공간적으로 분리한 뒤 `ConfirmDialog`를 거친다. 문서 범위 삭제와 viewport-local reset을 같은 action cluster에 섞지 않는다.
- `warning`/`danger` tone은 이전 소비자를 위한 alias이며 새 Editor/Viewer 데이터와 스토리는 `cautionary`/`negative`를 사용한다.

## Viewer contracts

Viewer 컴포넌트는 **LK Robotics Extension**이며 Editor의 축소판이나 제품 화면 템플릿이 아니다. 장면·지도·영상이 시각적 위계를 지배하고, 해당 viewport에만 영향을 주는 조작과 상태만 가장자리에 둔다.

| 컴포넌트 | 계약 |
| --- | --- |
| `ViewerFrame` | 이름이 있는 media/canvas region, source identity, viewport-local toolbar, passive HUD, textual state/freshness, blocking/non-blocking state 배치를 공유한다. `loading`, `no-source`, `unavailable`, `disconnected`, `no-signal`, `error`처럼 콘텐츠를 사용할 수 없을 때만 중앙을 막고, 이때도 source identity와 recovery focus를 유지한다. `disconnected`·`no-signal`·`error`의 차단 전환만 `alert`/assertive로 알리고 예상 가능한 setup 차단은 `status`/polite로 알린다. `degraded`, `stale`, `paused`에서는 마지막 유효 콘텐츠를 유지한 채 polite compact edge status를 표시하며 빠르게 갱신되는 metadata는 live region에서 분리한다. |
| `Map2DCanvas` | 일반 이미지/SVG와 같은 좌상단 원점이 기본이다. 별도의 world/center 원점은 명시적으로 선택한다. 지도 키보드 조작은 내부 button/input/toolbar 이벤트를 가로채지 않고, drag와 wheel에 zoom button·방향키·reset 대안을 제공한다. fit bounds는 앱이 계산하고 `onFit`으로 built-in command에 위임한다. |
| `Scene3DFrame` | renderer-independent 3D viewport preset이다. orbit, pan, zoom, focus, home, orientation 같은 view 조작만 허용하며 scene hierarchy, inspector, transform gizmo는 Editor가 소유한다. |
| `VideoStreamTile` | source identity와 `connecting`, `live`, `degraded`, `stale`, `paused`, `no-signal`, `error` 표현을 소유한다. user pause와 source freeze를 구분하고 WebRTC/ROS transport, reconnect 알고리즘, recording/seek session은 앱에 남긴다. |
| `ViewerToolbar` | command와 toggle을 명시적으로 구분하고 기존 icon control의 32px, hover, focus, disabled 계약을 합성한다. 장면 위에서는 card-in-card surface 대신 최소 chrome 또는 on-dark presentation을 사용한다. |
| `TelemetryGauge` / `TelemetryValue` | 원래 numeric precision과 unit/freshness를 보존한다. 수치와 단위는 scalar/string 계약으로 받고 주변 공백을 정규화해 보이는 lockup과 접근 가능한 값 텍스트를 동일하게 만든다. severity와 threshold policy는 제품이 계산해 전달하며, gauge는 meter semantics와 formatter만 소유한다. 빠른 수치 갱신마다 live announcement를 만들지 않는다. |

Viewer appearance는 컴포넌트 종류를 구분하는 별도 시각 언어가 아니다. `ViewerFrame`, `Scene3DFrame`, `Map2DCanvas`는 모두 `light | dark` 축을 공유하고 3D는 dark, 2D map은 light를 기본값으로만 사용한다. 두 variant는 동일한 상태·slot·조작 계약을 유지하며 renderer children은 `--viewer-*` scoped role을 사용한다.

Viewer DS 범위에서 scene tree, property editing, free docking, robot command/E-stop, transport/retry policy, product threshold schema, recording archive와 renderer-specific diagnostics는 제외한다.

## Control contracts

| 컴포넌트 | 계약 |
| --- | --- |
| `Joystick` | 포인터 입력값만 소유한다. 연결, authority, arm, dead-man, keyboard focus, cadence, release는 `ManualControlSession`에서 구분한다. |
| `ManualControlSession` | 연결·authority·arm·dead-man·focus를 독립 축으로 두고, 해제 시 `onSafetyRelease`를 호출한다. 비상 정지는 confirmation 없이 즉시 실행한다. |
| `Button` / `ActionArea` / `Banner` | command eligibility와 request error는 제품 상태다. 현재 상태는 control boundary 상단의 Banner에 두고, action은 command rail에 배치하며 confirmation과 lifecycle result는 분리한다. |
| `Timeline` / `StatusBadge` / `DescriptionList` | 제품이 제공한 phase order를 그대로 표시하고 accepted, applied, confirmed, failure, timed-out, superseded와 late evidence의 의미는 제품 계약으로 유지한다. |
| `ConfirmDialog` / `Input` | typed phrase, blockers, affected resources, irreversible/external write 정책은 제품에서 조합한다. 즉시 안전 동작인 e-stop에는 confirmation을 사용하지 않는다. |
| `ConnectionBadge` / `DescriptionList` | transport 연결과 data freshness를 분리하고 stale 값을 현재값처럼 표시하지 않는다. freshness와 health 판정은 제품이 제공한다. |
| `EquipmentStatusCard` / `StatusBadge` / `ConnectionBadge` | 주변 설비의 identity → 보이는 대표 상태 → labeled facts → meta/action 순서를 제공한다. 연결·방향은 필요한 fact value로 조합하며 설비별 state machine, telemetry truth, command와 transport는 제품에 남긴다. 제품 저장소는 coverage inventory일 뿐 카드 anatomy·geometry·API 근거가 아니다. |
| `ViewerToolbar` | viewer control은 icon-only button으로 두고 tooltip 또는 label을 제공한다. |
| `Callout` | 작업 전에 항상 읽어야 하는 고정 안내에만 사용한다. 실시간 연결·권한·command eligibility 상태에는 `Banner`를 사용한다. |
| `ConfirmDialog` | 파괴적 또는 되돌릴 수 없는 action은 cancel과 confirm label을 명시한다. |

## Operations, content, and MLOps contracts

| 컴포넌트 | 계약 |
| --- | --- |
| `PropertyField` / `DescriptionList` / `ValidationSummary` / `DockPanel` / `ActionArea` | field renderer는 앱에 남기고 current/proposed evidence, validation/impact 요약, dirty close와 persistent action layout을 제품에서 조합한다. 저장·적용·재시작은 앱 소유다. |
| `LogViewer` | log의 filtering/follow/freshness/dropped data/recovery chrome을 소유하고 transport와 retention은 앱에 남긴다. DeviceOps 전용 xterm session은 `ConnectionBadge`, `DescriptionList`, `Callout`, `Button`을 제품에서 조합한다. |
| `AnnotatedImage` | normalized box/hotspot과 접근성 요약을 소유하고 inference와 이미지 pipeline은 앱에 남긴다. |
| `ReorderList` / `ValidationSummary` / `DatePicker` / `TimePicker` / `CheckboxGroup` | peer order와 form-level issue return path를 제공하고 recurrence/timezone input은 제품에서 조합한다. command schema, target picker, preview, conflict 계산은 앱에 남긴다. |
| `ConversationMessage` / `MessageFeed` / `MessageComposer` / `SourceDisclosure` / `TreePicker` / `ConfirmDialog` | message anatomy, additions-only feed, follow/unread/history anchoring, IME-safe composition, source provenance, active scope selection, reset guard를 재사용 계약으로 제공한다. 제품은 human/AI/operations 역할 정책, retrieval, transport, persistence, session reset과 backend completion truth를 소유하며 `ChatWindow` 같은 완성 workflow wrapper는 LDS에 추가하지 않는다. |
| `ValidationSummary` / `DescriptionList` / `ProgressBar` / `StatusBadge` / `Timeline` | product-provided preflight evidence와 장기 operation 결과를 제품에서 조합한다. admission, 실제 실행, publish, polling, cancel은 앱 소유다. |
| `DataGrid` / `SourceDisclosure` / `ValidationSummary` / `DescriptionList` | approval evidence와 state facts를 제공한다. verdict 계산, note, decision submit은 제품이 `ChoiceCard`, `Textarea`, `ActionArea`로 조합하고 transition policy·persistence를 소유한다. |

## Numeric readout contracts

| 항목 | 기준 |
| --- | --- |
| 값 | 숫자와 문자열 단위의 앞뒤 공백을 먼저 제거한다. UI 비율 기호 `%`, `‰`와 평면각 `°`는 값에 붙이고, `°C`, `°F`, `ms`, `Hz`, `m/s`, `N·m`, `dBm` 같은 SI·복합 단위는 한 칸 띄운다. 화면 DOM과 접근 가능한 값 텍스트는 같은 literal separator를 사용한다. 임의 ReactNode는 표준 unit lockup에 넣지 않고 컴포넌트가 제공하는 명시적 escape가 있을 때만 소비자가 완전한 시각·접근성 텍스트를 소유한다. Microsoft UI 표기 관례와 NIST SI 간 차이를 이 규칙으로 명시적으로 구분한다. |
| 임계치 | warning/danger 기준은 컴포넌트 props 또는 문서에 드러난다. |
| freshness | stale 값은 현재값처럼 보이지 않게 timestamp 또는 stale badge를 제공하되, 표에서는 freshness/status를 별도 컬럼으로 분리한다. |
| chart | Sparkline과 gauge는 summary text 또는 대체 설명을 제공한다. |
| readout | 좁은 패널은 `TelemetryValue`로 값, 단위, tone, freshness를 한 묶음으로 표시하고, 표 셀은 값과 단위만 두며 상태와 수집 시각은 독립 컬럼으로 둔다. |

## Release gate

- 도메인 컴포넌트는 normal, warning, danger, offline 또는 disabled 상태를 최소 하나 이상 포함한다.
- safety state는 색상만으로 구분하지 않는다.
- 숫자 readout 값은 단위를 포함하고, 표에서는 timestamp/freshness/status를 각각 독립 컬럼으로 분리한다.
- destructive 또는 irreversible action은 confirmation 정책을 따른다.
- 컴포넌트 story가 완성 화면처럼 보이면 story를 분리하지 말고 관련 컴포넌트의 상태 예시로 축소한다.
