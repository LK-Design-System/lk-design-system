# Component API and state matrix

컴포넌트는 “예쁘게 보이는 예시”만으로 완료되지 않습니다. 제품 팀이 안전하게 재사용하려면 API, 상태, 접근성, 토큰, 금지 조합을 한 표로 볼 수 있어야 합니다.

## Required component contract

| 항목 | 내용 |
| --- | --- |
| Purpose | 컴포넌트가 해결하는 제품 문제 |
| Public API | props, slots, events, default value |
| Visual states | default, hover, focus, active, selected, disabled, loading, invalid, empty |
| Accessibility | role, name, keyboard, focus, aria state |
| Tokens | semantic/component token 의존성 |
| Composition | 함께 쓰는 컴포넌트와 금지 nesting |
| Responsive | mobile, desktop, dense mode 기준 |
| Migration | 이전 컴포넌트나 정적 HTML parity와의 관계 |

## Initial state matrix

| Component | Public states | Required evidence |
| --- | --- | --- |
| Button | WDS variant/size axes, disabled, loading, icon-only, on-dark; explicit LDS-only danger safety extension | Storybook variants, icon accessible name, danger extension label |
| ActionArea | default/compact padding, start/end/center/between alignment, divider, sticky, safe-area | action-area states and rendered 40px CTA/8px gap contract |
| ChoiceCard | checked, unchecked, disabled, focus, keyboard selection | selection story, radio/checkbox semantics |
| Callout | signal, positive, cautionary, negative, navy | tone default icon always present, custom icon size normalization, non-color label |
| SideNav | expanded, compact hover, selected, nested group, overflow | hover behavior, hidden scrollbar policy |
| PageHeader | breadcrumb, eyebrow, title, status, meta, action alignment | layout page header story |
| DataGrid | controlled/manual sort, stable row ID selection, activation, loading/error/empty, pagination composition, keyboard focus | table hierarchy와 controlled resource states story |
| FileBrowser | product-provided path and entries, explicit directory navigation versus file/folder selection, up action, selected ID, loading/error/empty, disabled navigation | file browser action-separation stories |
| DataToolbar | search, filter, selected bulk action, result count, compact density | toolbar with grid story |
| Tree | expanded, collapsed, selected, nested, keyboard | data tree story |
| TreePicker | controlled/uncontrolled selected IDs, controlled/uncontrolled expanded IDs, descendant/independent selection, search, disabled branch, empty/no-result | hierarchy selection input stories, disabled-first roving-focus evidence |
| TopicTree | same as Tree plus topic metadata | domain topic tree story |
| ContentEditor | title/body, toolbar, draft status, readonly, invalid, action slots | writing editor story |
| CanvasEditorShell | title/description, headerStart, document toolbar, workspace subheader, separate responsiveNavigation, tool rail, collapsible/resizable layer and inspector panels, dominant canvas, passive status | Canvas Shell의 기본 셸, 통합 편집 워크스페이스, 뷰포트 오버레이 인스펙터, 좁은 화면 영역 전환 stories |
| CanvasEditorCommandBar | document/history commands, undo, redo, disabled history, extra command slot; deprecated viewActions compatibility only | Command Bar의 문서 명령과 비활성 히스토리 stories; zoom/fit/camera/reset은 ViewerToolbar stories |
| EditorToolbar | vertical/horizontal orientation, selected tool, disabled item/group, arrow/Home/End roving focus | Editor Toolbar의 세로, 가로, 전체 비활성 stories |
| LayerPanel | visible, locked, active, nested/expanded controlled and uncontrolled, disabled, empty, one roving tree Tab stop, typeahead, F2 row-action mode | Layer Panel의 상호작용, 접힌/제어 확장, 빈 상태, 전체 비활성, mixed availability stories |
| SelectionInspector | selected object, empty state, clear selection, status, sections, fields, action slots | Selection Inspector의 선택 객체, 선택 없음, 액션 푸터 stories |
| ViewportStatusBar | mode, cursor/camera, zoom, selected count, snap, FPS, passive trailing readout | Viewport Status Bar의 기본 readout, 상태 tone, 후행 슬롯 stories |
| ViewerFrame | ready/live, connecting/loading, degraded, stale/frozen, paused, no-source/unavailable/disconnected/no-signal, error; source identity, toolbar, HUD, edge status, blocking overlay | state matrix, stable dark/light surfaces, narrow frame, blocked-content focus restoration stories |
| Map2DCanvas | top-left/center origin, controlled/uncontrolled viewport, pan/keyboard/wheel toggles, zoom/reset, optional delegated fit, grid/controls off | pointer-focal zoom, fit delegation, nested-control keyboard isolation, disabled control, 320px viewer stories |
| Scene3DFrame | ready, loading, empty/no-source, degraded, stale, unavailable, error; HUD and viewport-local toolbar | 3D state matrix, dark and narrow stories |
| VideoStreamTile | connecting, live, degraded, stale/frozen, paused, no-signal, error; source identity and optional retry action | textual state, reduced motion, blocked-content focus suppression, compact tile stories |
| ViewerToolbar | command, pressed/unpressed toggle, horizontal/vertical, on-dark/minimal, disabled action, roving focus | arrow/Home/End, remembered focus, explicit aria-pressed stories |
| TelemetryGauge | exact value, min/max, formatter/precision/valueText, app-provided tone, compact size | meter semantics and non-rounded numeric story |
| TelemetryValue | value, unit, tone label, stale, timestamp and helper, compact density | responsive 320px, non-color state, numeric readout story |
| Modal/Drawer/Sheet | open, close, focus trap, escape, restore | overlay stories |
| ConfirmDialog | default, danger, warning text, cancel, confirm, pending/disabled, scrim/Escape dismiss, initial focus/trap/restore | confirmation dialog and safety-confirmation stories |
| SearchableMultiSelect | async search, selected chip removal, keyboard option traversal that skips disabled options, loading/error/empty, max selection | searchable multi-select resource and disabled-option stories |
| SecretField | masked/revealed, timed reveal, copy feedback, disabled, external re-auth composition | secret field story |
| FileUploadQueue | queued/uploading/processing/succeeded/failed, progress, retry/remove/open, partial completion | upload queue states story |
| SourceDisclosure | product-provided availability, provenance, observed/updated time, excerpt, source action, missing/restricted/error | source disclosure stories |
| LogViewer | level/search, pause/tail/latest, virtualized buffer, dropped line, reconnect/stale, copy/export/clear | log viewer stream states |
| AnnotatedImage | load/error/empty, normalized region/point, annotation toggle, object fit, caption, accessible annotation summary; no provenance/actions/metrics | annotated image renderer stories |
| ManualControlSession | independent link/authority/UI-arm/dead-man/focus axes, blocked reason, focus/visibility loss, safe-release reason, unmount release, re-arm request, emergency-stop request; no transport guarantee | manual control session stories |
| ValidationSummary | error/warning issue, label/message, field or step return path, empty, optional announcement | form validation summary stories |

## Disallowed patterns

- UI card 안에 또 다른 page section card를 넣지 않는다. 반복 item이나 modal/frame만 card로 쓴다.
- icon-only action을 label 없이 노출하지 않는다.
- status를 색상만으로 구분하지 않는다.
- primitive token을 앱 화면에서 직접 쓰지 않는다.
- toolbar action icon을 새로 그리지 않는다. `Icon` registry에 있는 이름을 우선한다.
- command eligibility button, conversation message list/composer, single-product terminal frame, approval transition처럼 기존 요소의 단순 조합이거나 제품 policy를 포함하는 wrapper를 public component로 추가하지 않는다.
- disabled control을 설명 없이 주요 flow의 유일한 경로로 두지 않는다.

## Storybook evidence rules

- Public story는 사람이 쓰는 이름을 가진다.
- visual parity story는 `!dev`와 `visual-parity` tag를 유지한다.
- 상태가 많은 컴포넌트는 single playground와 state matrix story를 분리한다.
- domain/editor/viewer 컴포넌트의 제품 통합은 제품 저장소에서 검증하고, LDS Storybook에는 애플리케이션 워크스페이스를 추가하지 않는다.
