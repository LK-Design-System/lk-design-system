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
| Button | variant, size, disabled, loading, icon-only, on-dark | Storybook variants, icon accessible name |
| ChoiceCard | checked, unchecked, disabled, focus, keyboard selection | selection story, radio/checkbox semantics |
| Callout | info, success, warning, danger, dismissible, action | icon size normalization, non-color label |
| SideNav | expanded, compact hover, selected, nested group, overflow | hover behavior, hidden scrollbar policy |
| PageHeader | breadcrumb, eyebrow, title, status, meta, action alignment | layout page header story |
| DataGrid | sort, select, empty, pagination, keyboard focus | table hierarchy story |
| DataToolbar | search, filter, selected bulk action, result count, compact density | toolbar with grid story |
| Tree | expanded, collapsed, selected, nested, keyboard | data tree story |
| TopicTree | same as Tree plus topic metadata | domain topic tree story |
| ContentEditor | title/body, toolbar, draft status, readonly, invalid, action slots | writing editor story |
| CanvasEditorShell | title/description, headerStart navigation or frame toggle, toolbar, subheader, tool rail, optional layer panel, canvas, docked/contextual drawer panel, optional status | neutral shell contract plus task-authoring and map-editor state stories |
| CanvasEditorCommandBar | right-side viewer actions with handlers, undo, redo, reset, disabled history, extra command slot | editor workspace stories |
| LayerPanel | visible, hidden by headerStart frame toggle, locked, active, nested, disabled, empty | editor shell story |
| SelectionInspector | selected object drawer, empty state when docked, clear selection, status, sections, fields, action slots | editor shell story |
| ViewportStatusBar | mode, cursor/camera, zoom, selected count, snap, FPS, passive trailing readout | editor shell story |
| ViewerToolbar | zoom, layer toggle, fullscreen, code view, disabled action | viewer toolbar story |
| TelemetryValue | value, unit, tone, stale, timestamp, compact density | numeric readout story |
| Modal/Drawer/Sheet | open, close, focus trap, escape, restore | overlay stories |
| ConfirmDialog | default, danger, warning, cancel, confirm, scrim/Escape dismiss | confirmation dialog story |

## Disallowed patterns

- UI card 안에 또 다른 page section card를 넣지 않는다. 반복 item이나 modal/frame만 card로 쓴다.
- icon-only action을 label 없이 노출하지 않는다.
- status를 색상만으로 구분하지 않는다.
- primitive token을 앱 화면에서 직접 쓰지 않는다.
- toolbar action icon을 새로 그리지 않는다. `Icon` registry에 있는 이름을 우선한다.
- disabled control을 설명 없이 주요 flow의 유일한 경로로 두지 않는다.

## Storybook evidence rules

- Public story는 사람이 쓰는 이름을 가진다.
- visual parity story는 `!dev`와 `visual-parity` tag를 유지한다.
- 상태가 많은 컴포넌트는 single playground와 state matrix story를 분리한다.
- domain/editor/viewer 컴포넌트는 맵/포인트클라우드 편집 워크스페이스에서 한 번 더 검증한다.
