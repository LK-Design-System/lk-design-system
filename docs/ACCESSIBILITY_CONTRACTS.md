# Accessibility contracts

| Field | Value |
| --- | --- |
| Type | Stable contract |
| Status | Current |
| Owner | Design system owner · Accessibility reviewer |
| Last reviewed | 2026-07-14 |

LK 디자인 시스템의 접근성 기준은 컴포넌트를 사용하는 제품 팀이 매번 새로 판단하지 않도록 하는 계약입니다. 모든 interactive 컴포넌트는 아래 항목을 Storybook 예시, 코드, 또는 테스트 근거로 증명해야 합니다.

## Required contract

| 항목 | 기준 | 증거 |
| --- | --- | --- |
| Semantic | 가능한 경우 native HTML element를 우선 사용한다. custom role은 native로 표현할 수 없을 때만 쓴다. | 컴포넌트 JSX, Storybook accessibility 패널 |
| Keyboard | Tab 순서, Enter/Space, Escape, Arrow key 동작을 명시한다. | Storybook interaction 또는 prompt 문서 |
| Focus | focus visible, focus trap, focus restore, disabled focus 정책을 명시한다. | 컴포넌트 예시와 수동 QA |
| Screen reader | accessible name, aria state, live region 문구를 명시한다. | JSX와 Storybook text |
| State | default, hover, focus, active, selected, disabled, loading, invalid 상태를 가능한 범위에서 노출한다. | 상태 매트릭스 |
| Motion | 중요한 상태 변화는 색상만으로 전달하지 않는다. motion은 prefers-reduced-motion을 존중한다. | CSS token 또는 component style |

## Keyboard baseline

| 컴포넌트 계열 | 필수 키보드 동작 |
| --- | --- |
| Button, IconButton, SplitButton | Tab으로 진입, Enter/Space로 실행, disabled는 실행 불가 |
| Checkbox, Switch, Radio | Space로 토글, RadioGroup은 Arrow key로 이동 |
| Select, Combobox, AutoComplete | Arrow key로 옵션 이동, Enter로 선택, Escape로 닫기 |
| Tabs, SegmentedControl | Arrow key로 인접 항목 이동, Home/End는 첫/마지막 항목 |
| Modal, Drawer, Sheet, Alert, ConfirmDialog | Escape 닫기, 내부 focus trap, 닫힌 뒤 trigger로 focus restore |
| Toast, Notification, Banner, Callout | 자동 소멸 정보는 live region 정책을 명시, 중요한 알림은 수동 dismiss 제공 |
| DataGrid, Table, Tree, TopicTree | row/cell/treeitem focus 기준, 확장/축소 키, 선택 상태를 명시 |
| SearchableMultiSelect, DataGrid, FileBrowser | stable item name/ID, listbox 또는 row activation, 선택 상태, bulk action 진입 순서, 빈/loading/error announcement를 명시 |
| Button, ActionArea, ConfirmDialog | product-owned disabled reason과 blocker를 action보다 먼저 읽을 수 있고 pending 중 중복 실행이 차단되어야 함 |
| StatusBadge, Timeline, ProgressBar, ConnectionBadge, EquipmentStatusCard | 상태 이름과 시간/freshness/result를 텍스트로 제공하고, 설비 카드는 heading → visible status → labeled facts → actions 순서를 유지하며 live region이 과도하게 반복되지 않아야 함 |
| ManualControlSession | keyboard 입력은 focus 범위 안에서만 처리하고 textarea/input 입력과 단축키가 충돌하지 않아야 함 |
| Tree, ReorderList | treeitem/listitem은 키보드로 탐색 가능하고 expand/collapse 또는 move action에 accessible name이 있어야 함 |
| ValidationSummary | 오류·주의를 텍스트로 구분하고 native anchor 또는 명시적 activation으로 원래 field/step에 돌아갈 수 있어야 함 |
| AnnotatedImage, SourceDisclosure | 시각 overlay와 source provenance에는 텍스트 요약, availability, 원본으로 돌아가는 경로가 있어야 함 |
| Product-owned conversation composition, SourceDisclosure, TreePicker, ConfirmDialog | message role과 streaming/error 상태를 semantic list에서 텍스트로 제공하고 unavailable composer는 이유를 연결하며 scope reset은 확인 가능해야 함 |
| ContentEditor | 제목 input, 본문 textarea, toolbar button, 상태 live region 순서가 자연스러워야 함 |
| CanvasEditorShell, CanvasEditorCommandBar, EditorToolbar, LayerPanel, SelectionInspector, ViewerToolbar | viewport와 toolbar/panel 사이 이동 순서, collapse/restore handle과 keyboard splitter의 accessible name, 방향키 scope, LayerPanel의 단일 roving Tab stop·typeahead·F2 row-action mode, 단축키 충돌, undo/redo 상태, 선택 해제 버튼의 accessible name |
| Map2DCanvas, Scene3DFrame | viewport region name, keyboard zoom/pan 정책, 앱 캔버스 이벤트와 DS pan interaction 충돌 방지 |
| WaypointMarker, LaneOverlay, RouteOverlay, TrajectoryOverlay, SpatialRegion, FacilityTransition, NavigationAnnotationLayer | SVG fragment의 이름, pointer와 Enter/Space activation parity, disabled Tab 제외, selected/invalid state, zoom과 무관한 hit/stroke, 색 외 pattern·glyph·visible state text, 이름 있는 semantic mirror 목록. annotation layer의 라벨 이동·숨김은 aria-hidden 장식 텍스트에만 적용되고 accessible name·24px target·Tab 순서·목록 선택 경로·live region 부재 계약은 그대로 유지 |
| ConversationMessage, MessageFeed, MessageComposer | feed만 role="log" polite live-region을 소유하고 개별 message·날짜/첫 미읽음 separator는 live region이 없음, feed 자체에 focus가 있을 때만 Home/End/Page Up/Page Down viewport 이동, document/bubble presentation과 optional direction은 읽기 의미를 대체하지 않으며 author identity를 텍스트로 유지, 기본 message DOM 순서는 identity→body→response status→attachments→sources→delivery/static status→actions이고 `inlineSources` footer는 actions→sources 형제 순서, 완료 AI 응답의 복사·재생성·긍정/부정 평가 action과 failed-only retry, 선택형 평가의 aria-pressed+시각 selected surface, response pending/streaming/stopping만 aria-busy, stop은 composer가 소유, composer는 IME 조합 중 Enter 오발송 방지·Shift+Enter 줄바꿈·disabled 시 disabledReason을 shell/control 앞에 두고 aria-describedby로 연결·submit/stop 후 상태 미추론 |
| VirtualKeypad | role="group"과 접근 가능한 이름, 각 키의 이름 있는 label과 48px touch target, aria-controls로 대상 input 연결, targetId input이 이미 focus된 경우에만 pointer preventDefault로 focus 보존, min/max는 confirm 유효성에만 적용, document/global keydown·long-press·VirtualKeyboard API 의존 없음 |

## Conversation accessibility contract

- `authorRole`은 user·assistant·human-agent·system의 기본 시각 presentation을 고르지만 작성자 이름과 역할 텍스트를 대체하지 않는다. assistant의 borderless document, user의 solid primary bubble, human-agent의 neutral fill bubble과 alignment·색만으로 발신자를 구분하지 않고 이름·역할 텍스트를 함께 제공한다.
- `direction`은 non-system message의 선택적 배치 override일 뿐 DOM 순서, 작성자 의미, delivery/response lifecycle을 바꾸지 않는다. system role은 avatar나 bubble 없이 이름 있는 중앙 neutral 칩으로 읽힌다.
- 한 message article의 기본 순서는 identity → body → response status → attachments → sources → delivery/static status → actions다. `inlineSources`에서는 본문 뒤 단일 footer 안에 action group → sources 순서로 두 요소를 형제로 렌더해, provenance가 action group에 포함되지 않으면서 화면의 canonical action 순서를 먼저 유지한다. action group 안에서는 `응답 복사` → `응답 다시 생성` → 긍정 평가 → 부정 평가 순서를 유지한다. 선택형 평가는 제품 상태를 `aria-pressed`와 시각 selected surface로 함께 노출하고, streaming 중에는 이 후속 action을 비활성화하며, failed 상태에는 오류와 재시도만 둔다. response stop은 `MessageComposer` 한 곳이 소유해 중복 control을 만들지 않는다.
- `MessageFeed` 하나만 이름 있는 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`를 소유한다. history prepend 중에는 live announcement를 억제하고 scroll anchor 복원 뒤 다시 polite로 전환한다. 무결과·실패·`hasPrevious=false` 경로에서도 억제를 해제한다. 날짜와 첫 미읽음 경계는 기존 `Divider`의 이름 있는 `role="separator"` 조합이며 focus target이나 별도 announcement region이 아니다.
- `MessageFeed` viewport 자체에 focus가 있을 때만 Home/End로 처음·끝, Page Up/Page Down으로 한 viewport를 이동하고 `aria-keyshortcuts`로 이를 노출한다. modifier가 있거나 message 내부 action에 focus가 있으면 키를 가로채지 않는다.
- `MessageComposer`는 label → description → disabled reason → 한 elevated shell 안 attachments → textarea → 하단 leading actions → trailing actions → send-or-stop → status/counter 순서로 읽힌다. 32px icon action은 이름을 가지며, `disabled` shell의 slot control도 inert subtree에서 focus와 activation이 차단된다. 한글·일본어·중국어 IME 확정 Enter를 submit으로 재처리하지 않으며 Enter/modifier-enter/button-only 제출 정책을 명시적으로 선택한다. modifier-enter는 Alt가 없는 Ctrl/Meta+Enter만 허용해 AltGr 문자 입력과 충돌하지 않는다.
- 약 760px reading column과 320px narrow, light/dark에서 긴 rich assistant document, multiline user solid primary bubble, human-agent neutral fill bubble, streaming/error, disabled composer, 날짜/미읽음 separator를 확인하고 source/action wrapping이 DOM·keyboard 순서를 바꾸지 않는지, bubble·칩·배지 대비가 WCAG AA를 유지하는지 검증한다.

## Viewer accessibility contract

- `ViewerFrame`, `Map2DCanvas`, `Scene3DFrame`, `VideoStreamTile`은 고유한 accessible region name을 가진다.
- blocking state에서는 가려진 media와 control을 접근성 트리 및 keyboard focus 순서에서 제외하되 source identity는 유지한다. 현재 focus가 가려지면 recovery action 또는 blocking-state group으로 이동하고, 복구 후 원래 control이 남아 있으면 그 정확한 위치로 돌아간다. `degraded`, `stale`, `paused`는 콘텐츠를 가리지 않고 텍스트 상태와 freshness를 함께 제공한다.
- edge state live region은 상태 전환 문구만 포함한다. FPS, resolution, freshness처럼 자주 바뀌는 passive metadata는 live region 밖에 둔다.
- `Map2DCanvas`는 toolbar, button, input, slider에서 발생한 방향키를 pan으로 재처리하지 않는다. drag와 wheel만으로 가능한 조작에는 button 및 keyboard 대안이 있어야 한다.
- Navigation SVG fragment는 `onActivate`가 있을 때만 interactive button semantics를 갖고 pointer와 Enter/Space가 같은 identity callback을 호출한다. disabled feature는 activation과 Tab 순서에서 제외하되 ordinary text mirror에서 상태와 identity를 계속 읽을 수 있어야 한다.
- waypoint marker의 투명 hit area와 lane/route/trajectory hit stroke는 zoom과 무관하게 최소 24 CSS px를 유지한다. 겹치거나 조밀해져 SVG 자체 keyboard traversal이 불안정한 지도는 모든 feature를 Tab stop으로 만들지 않고 동일 순서·이름·상태의 목록 선택 경로를 제공한다.
- Navigation paint order는 screen-reader와 keyboard order가 아니다. `LayerPanel`은 layer 표시/잠금, 이름 있는 semantic mirror는 feature 선택, `SelectionInspector`는 선택 객체 세부 정보를 맡으며 세 표면은 같은 stable ID를 공유한다.
- closed/conflict/waiting/blocked/rerouting, unavailable/unknown/stale/invalid, region rule/traversability는 색 외 dash, slash, glyph, pattern, label을 함께 사용한다. SVG fragment는 live region을 만들지 않으며 source/runtime 상태 announcement는 제품이 소유한다.
- `ViewerToolbar`는 한 개의 Tab stop을 사용하고 orientation에 맞는 Arrow key와 Home/End를 지원한다. command에는 `aria-pressed`를 붙이지 않고 toggle은 `true`와 `false`를 모두 노출한다.
- `TelemetryGauge`는 `meter` name, min, max, current value와 사람이 읽는 `aria-valuetext`를 제공한다. 빠른 telemetry 값 자체는 live region으로 반복 발표하지 않는다.
- live, loading, stale, no-signal, error는 색이나 motion만으로 구분하지 않는다. pulse/spinner는 `prefers-reduced-motion`에서 정지하며 visible text를 함께 제공한다.

## Focus policy

- Focus ring은 브랜드 색상보다 `semantic.control.focusRing` 또는 동등한 component token을 우선 사용한다.
- Focus ring은 hover style과 별도로 보여야 한다.
- Disabled control은 focusable하지 않게 두는 것을 기본값으로 한다. 설명이 필요한 disabled 항목은 tooltip이나 adjacent text로 이유를 제공한다.
- Modal 계열은 열린 순간 첫 interactive element 또는 heading에 focus를 보낸다.
- Overlay가 닫히면 원래 trigger로 focus를 복귀시킨다.

## Screen reader policy

- icon-only button은 `aria-label` 또는 visible hidden label이 필요하다.
- 상태 badge는 색상과 텍스트를 함께 제공한다.
- loading은 `aria-busy` 또는 live text를 제공한다.
- progress는 `aria-valuemin`, `aria-valuemax`, `aria-valuenow`를 갖는다.
- domain safety state는 축약어만 쓰지 않는다. 예: 긴급 정지, 위치 기준, 연결 상태는 주변 문맥에서 풀어 쓴다.

## Release gate

새 컴포넌트 또는 interactive 상태를 추가할 때 PR은 아래를 충족해야 한다.

- Storybook에 keyboard/focus가 확인 가능한 예시가 있다.
- component prompt 문서에 접근성 계약이 있다.
- `pnpm run check:a11y` 또는 Storybook accessibility 패널에서 blocking violation이 없다.
- icon-only control은 accessible name이 있다.
- 색상만으로 상태를 전달하지 않는다.
