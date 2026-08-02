# Component API and state matrix

| Field | Value |
| --- | --- |
| Type | Stable contract and component register |
| Status | Current |
| Owner | Component owners · Design system owner |
| Last reviewed | 2026-07-27 |

## Canonical public API grammar

- Size values are `sm`, `md`, and `lg`. `small`, `medium`, and `large` remain compatibility aliases only and normalize at the component boundary.
- Status tone values are `positive`, `cautionary`, `negative`, `signal`, and `offline`. `success`, `warning`, `error`, `info`, `normal`, and `online` are compatibility aliases handled by `normalizeStatusTone`; unknown values fall back to `offline`.
- Reusable controlled state follows `value`, `defaultValue`, and `onChange(nextValue, metadata?)`. Native form wrappers may expose the native event when their contract explicitly says so; new composites must not introduce event-first callbacks.
- Native controls accept the platform `'aria-label'` attribute. Composite controls that need to forward a name to an internal focus target use `ariaLabel`. Do not add `accessibleLabel` or another synonym.
- CI ratchets existing exceptions in `API_GRAMMAR_BASELINE.json`; a new exception is a public API decision and requires versioning notes.

컴포넌트는 “예쁘게 보이는 예시”만으로 완료되지 않습니다. 제품 팀이 안전하게 재사용하려면 API, 상태, 접근성, 토큰, 금지 조합을 한 표로 볼 수 있어야 합니다.

전체 public entry의 source·type·prompt 추적과 Storybook 페이지별 Anatomy, 선택 기준, 정량 규칙,
Do/Don't, 접근성, token/API 문서는 [`components/README.md`](components/README.md)와
`npm run check:components`가 소유합니다. 이 문서는 family 공통 API grammar와 중요 상태
matrix를 유지하고, 개별 페이지의 생성 가이드를 중복 작성하지 않습니다.

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

## Navigation composition matrix

| 맥락 | 기본 조합 | 경계 |
| --- | --- | --- |
| 랜딩·콘텐츠 사이트 | `TopBar` + 전체형 `Footer` | TopBar가 전역 탐색을 맡고 Footer는 정보·정책 링크를 제공한다. |
| 계층형 운영 대시보드 | `DashboardShell` + `SideNav surface="docked"` + `UserMenu` | SideNav가 제품 identity와 목적지를 소유하면 TopBar에는 utility만 두고 로고·제품 경로를 중복하지 않는다. `surface="floating"`은 독립 panel/secondary navigation에서 명시적으로 선택한다. |
| 평면형 운영 런처 | `DashboardShell` + `TopBar` + `Card`/status composition | 계층형 SideNav나 KPI row를 강제하지 않는다. 제품 identity는 TopBar가 한 번만 소유하고 destination card는 route·permission을 판단하지 않는다. |
| 평면형 반응형 앱 | 데스크톱 `NavRail` ↔ 모바일 `BottomNav` | 동일한 주요 목적지 3–5개를 공유하며 `SideNav`와 동시에 쓰지 않는다. |
| 현재 위치와 페이지 목차 | `Breadcrumb` + 필요 시 `Anchor` | 각각 로컬 경로와 페이지 내 섹션을 보조하며 주 탐색을 대신하지 않는다. |
| 순서형 워크플로 | 표시 전용 `Steps` 또는 제어 포함 `Wizard` | 사이트·제품 탐색과 분리한다. |

Operations Dashboard의 기준은 루트 `DESIGN.md`다. Dashboard shell은 landmark, responsive navigation handoff와 layout containment만 소유한다. `MetricCard`, `ChartFrame`, `DataGrid`, `ResourceState`는 필요할 때 조합하는 독립 표면이며, 세 필수 LK 제품에서 공통 KPI row 요구는 확인되지 않았다. destination hierarchy, route, permission, query, KPI 수식·threshold, telemetry/freshness truth, map/video renderer와 side effect는 제품이 소유한다.

## Initial state matrix

| Component | Public states | Required evidence |
| --- | --- | --- |
| Button / TextButton | WDS variant/size axes, disabled, loading (Button boolean swap-for-spinner or `"inline"`; TextButton boolean), icon-only/on-dark where applicable; explicit LDS-only danger safety extension; generic `as` preserves anchor/custom-component props | Storybook variants, icon accessible name, danger extension label, React 18/19 polymorphic consumer type checks |
| ActionArea | default/compact padding, start/end/center/between alignment, divider, sticky, safe-area | action-area states and rendered 40px CTA/8px gap contract |
| ScrollArea | native `scrollbar="auto"` default, constrained-surface `compact`, `gutter="stable|auto"`, conditional `focusable="auto"`, vertical/horizontal/no-overflow, forced-colors fallback; no public hidden treatment | Storybook native/compact/horizontal/non-overflow comparison, `scrollable-region-focusable` axe rule, hidden-exception repository check |
| ChoiceCard | checked, unchecked, disabled, focus, keyboard selection | selection story, radio/checkbox semantics |
| Banner | standalone, LDS embedded composition extension, signal/positive/cautionary/negative, title/body, action, close | status semantics, registry icons, embedded parent-surface seam story |
| Callout | signal, positive, cautionary, negative, navy; optional semantic `headingLevel=2..6`, default non-heading title | tone default icon always present, custom icon size normalization, non-color label, heading-level story assertion |
| OverlayStatusChip | neutral/cautionary/negative tone, icon override, caller-positioned absolute anchor (top-center default), pointer-transparent, `role="status"`, outside-inert placement | overview play pins absolute + pointer-events:none + status role outside inert; tones story with STATUS_TONE_STYLE glyphs, truncation, bottom placement override |
| Tabs | hug/fill, small/medium/large, boolean legacy or number/CSS-length inline `padding`, optional trailing action, horizontal scrolling with full 2px indicator inside its scroll box | roving Tab stop and Arrow/Home/End keyboard contract; token-length padding alignment; constrained scroll fixture proves no indicator clipping or cross-axis scrollbar |
| SideNav | `surface="floating|docked"` (`floating` compatibility default), expanded/collapsed controlled or uncontrolled state, product-shell-owned collapse control, optional overlay peek with uncontrolled runtime mode synchronization, selected, nested group with child icon slots, `brandAlign`, footer render state/gap, collapsed rail scrolling | floating/docked surface contract; external toggle `aria-expanded`·`aria-controls`; focus retention; parent-owned persistence; reduced motion; overlay pointer+focus delayed close, outside click/Escape close and persistent-parent focus restore; runtime overlay entry/exit state; decorative aligned child icons; start/center brand, footer state, hidden-scrollbar rail stories |
| Card | polymorphic `as` root, default/subtle surface tone, elevation, interactive/dark, structured slots, semantic heading, `titleWrap="truncate|wrap"`, platform density, skeleton/save/toggle affordances | native section/list-item roots, light/dark inset-group ownership, heading and nested-interactive guards, long-title wrap assertion, desktop/mobile structured-card stories |
| Table | native static table, size/hover, caption or ARIA name, row header, stable row id, `getRowProps`, public header/data cell-style helpers | `<th scope>` semantics, row metadata without grid/focus semantics, public style-helper composition story |
| TopBar | non-shrinking brand, optional named horizontal navigation (`navigationLabel`), utility actions, long/overflowing destinations, dropdown open/close | navigation yields or scrolls between brand/actions; repeated landmarks have unique names; dropdown uses a viewport-clamped top layer and cannot be clipped by header/nav overflow; keyboard name/focus/Escape and narrow story |
| LanguageSwitcher | required controlled `value`, native-name locale options, per-locale disabled, adaptive intrinsic menu width with TopBar minimum, 36px icon-only globe trigger with light/inverse foreground, whole-control disabled | TopBar utility placement at normal/360px widths, translated trigger name/title, `lang` metadata, inline-end visible check plus `menuitemradio` checked state, Enter/Space/Arrow open, selection callback, close and trigger-focus restoration; translation, URL, persistence, formatting, and document `lang` are app-owned |
| DashboardShell | `topology="header-first|side-first"` (`header-first` compatibility default), skip link, header/nav/main landmarks, wide/narrow/auto navigation slots, omitted-narrow fallback, safe-area, single main, 320px no-overflow; docked or floating navigation is an explicit child composition | both desktop topologies, narrow single-column convergence, auto fallback, docked SideNav composition, one product-identity owner, one `main`/banner and 320px shell stories |
| DashboardGrid | auto-fit repeated peer cards, configurable minimum width/gap, min-width containment, one-column narrow flow; no built-in KPI, priority, query, or card-surface semantics | actual component subjects at normal and 320px; unequal hierarchy uses explicit section/span composition instead of DashboardGrid inference |
| SideNav/NavRail/BottomNav links | legacy button/onChange, native href anchors, aria-current, disabled destinations, renderLink router hook, long-label containment | native destination and router-renderer stories |
| Pagination | controlled page, synchronized page-jump, page size/counter, extended/compact/minimize, localized landmark/previous/next/page-size names | pagination patterns and synchronized page-jump story |
| PageIndicator / Carousel | counter or dots, standalone small/medium geometry, normal/alternative color-only change, LDS media presentation with 8px inactive dot·22×8px active pill·32×44px target, custom item labels, page versus slide `aria-current`, reduced motion; Carousel composes media presentation and retains viewport/scrim/rotation | PageIndicator overview and interactive dots; Carousel overview, APG and auto-rotation contract stories |
| PageHeader | breadcrumb, eyebrow, one page title, status, meta, actions; default `headingLevel=1`, composable 1–6 heading level; text/actions wrap into separate rows when inline space is insufficient | overview comparison under one guide `h1`, plus narrow long-title/multiple-action story with the default single `h1` |
| RecordHeader | optional visual, required record title, badge, description, details, actions; default `headingLevel=1`, composable 1–6 heading level; stable visual→content→actions read order and 320px action reflow; no breadcrumb/navigation/cover/tabs | profile identity overview plus 320px long robot identity/multiple-action story |
| StatusBadge / StatusIndicator | StatusBadge: 20px soft semantic pill, visible lifecycle/result label, no dot/pulse; StatusIndicator: 6px semantic dot + neutral visible live availability/connection/freshness label, explicit reduced-motion-safe pulse; shared canonical status tone aliases with unknown→offline fallback | Status Badge tone/Tag/dark stories; Status Indicator steady/pulse/offline/critical light/dark stories |
| PrimaryDetail | controlled open/selection handoff, inline named region, overlay Drawer, detail title/footer, presentation-stable close label and focus return, normal/narrow | inline and 320px overlay interaction/footer stories |
| MetricCard | value/unit, period/baseline, direction separated from semantic tone, zero-change flat/neutral, legacy delta compatibility, action/freshness, loading/empty/error/stale, narrow wrapping | semantic reversal and zero-change, resource states, normal and 300px stories |
| DataGrid | legacy/selectionModel page vs all-matching scope, row-level selection eligibility, entity labels, controlled column visibility/order/width/pinning, sticky header, single/multi-sort, expandable detail, controlled editor slot, loading/error/empty, pagination composition, keyboard activation with custom-control guard | legacy selection, eligibility/activation, 128-result selection, dashboard collection and 320px pinned-column stories |
| BarChart | accessible name/description, deterministic text summary, empty state, value formatting, narrow long labels | chart, empty and 320px stories |
| DonutChart | accessible name/description, deterministic total/segment/percentage summary, true zero-sum, empty state, narrow legend | chart, zero-sum and 320px stories |
| LineChart | accessible name/description, deterministic per-series start/min/max/end summary, summary override, empty state, formatting | chart summary and empty-state stories |
| Sparkline | accessible name/description, start/min/max/end summary, empty state, formatting | chart and empty-state stories |
| ChartFrame | named title/description region, composable heading level, actions, legend, loading/empty/error/stale with last-good chart and freshness, narrow wrapping; false/null conditional children do not count as preserved data | normal, conditional-child loading/error and 320px stale stories |
| FileBrowser | product-provided path and entries, explicit directory navigation versus file/folder selection, up action, selected ID, loading/error/empty, disabled navigation | file browser action-separation stories |
| DataToolbar | optional search (`searchable=false`), filter, selected bulk action, result count, compact density | toolbar with grid and searchless embedded-list stories |
| DataExportAction | controlled/uncontrolled valid format/scope, disappearing-selection fallback, selected/all-matching counts, processing progress, success/error, allowed disabled/hidden reason, narrow wrapping | callback, scope fallback and 320px permission/progress stories |
| FilterBar | controls, removable or read-only applied filters, clear all, result status, saved-view slot, embedded/standalone, narrow wrapping | interactive/read-only normal and 320px stories |
| ResourceState | ready, loading, refreshing, empty, error, stale, offline, restricted; preserved last-good data and freshness | normal and 320px composed resource-state stories |
| RefreshControl | refreshing, lastUpdated, controlled auto-refresh interval, disabled reason, narrow wrapping | callback and 320px operation stories |
| SavedViewControl | controlled native selection, callback-absent read-only, empty/dirty/saving/disabled, save/update/save-as/rename/delete product action slots, long labels | normal, empty/read-only and 320px callback/state stories |
| VisibilityManager | independently controlled visibility/order, callback-absent disabled axes, visible/locked items, reset slot, drag plus Alt+arrow and named up/down ordering, empty/disabled, column/widget reuse | normal, empty/read-only and 320px locked/reorder stories |
| DateRangeField | controlled/uncontrolled start and end, preset slot, range-order validation, visible/compact/rich labels with plain accessible names, disabled, narrow stacking | normal preset, rich-label disabled and 320px invalid-range stories |
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
| ViewerFrame | ready/live, connecting/loading, degraded, stale/frozen, paused, no-source/unavailable/disconnected/no-signal, error; source identity, surface/overlay chrome, always/interaction toolbar, HUD, edge status, blocking overlay | state matrix, stable dark/light surfaces, narrow frame, blocked-content focus restoration stories |
| ElevatorFleetOverview | read-only horizontally scrollable building groups, one compact vertical column per elevator, per-building floor order, discrete current floor, single up/down/idle direction signal, per-elevator live `StatusIndicator`, fleet/building attention `StatusBadge`, visible offline last-known floor, normal/maintenance/fault/offline/unknown status, fleet/building empty states; no selection, telemetry, filtering, detail drawer, or remote command policy | four-building mixed-status overview, 390px horizontal overflow, dark theme, empty state, read-only contract |
| Map2DCanvas | top-left/center origin, controlled/uncontrolled viewport, pan/keyboard/wheel toggles, zoom/reset, optional delegated fit, grid/controls off | pointer-focal zoom, fit delegation, nested-control keyboard isolation, disabled control, 320px viewer stories |
| WaypointMarker | renderer-neutral identity/map/position, composable roles, typed annotations, available/unavailable/unknown, selected/focused/disabled/invalid/stale, screen-space label and 24px target | light/dark, compound roles, pointer/Enter/Space, zoom 0.5–2, semantic-list parity and 320px stories |
| LaneOverlay | directed points, entry/exit orientation and transition IDs, single/paired relation, speedLimitMps, mutexGroupId; runtime available/closed/unknown and independent conflict; selected/focused/disabled/invalid/stale | direction/relation overview, closed+conflict patterns, activation/disabled, transition-count and 320px stories |
| RouteOverlay | planned/active/waiting/blocked/rerouting/completed route, per-segment phase/condition, active-map filtering, explicit segment progress/selection, path-tangent open progress head, position/fraction mismatch fail-closed, separate lifecycle badge | light/dark comparison, state matrix, exact-position tolerance/mismatch, multi-floor filtering, activation and 320px stories |
| TrajectoryOverlay | single-map ordered position samples, optional time/heading, currentSampleIndex, path-tangent open progress head, separate lifecycle/validation badges, selected/focused/disabled/invalid/stale | route-vs-trajectory comparison, lifecycle patterns, elapsed/future split, current time summary, activation and 320px stories |
| SpatialRegion | polygon/circle; behavior rule, facility kind, terrain kind/traversability/grade; selected/focused/disabled/invalid/stale/hidden, pattern and label | three-category overview, dark rule/state comparison, renderer map filtering, activation/disabled and 320px stories |
| FacilityTransition | door/lift/dock endpoint, source availability; independent door/event, lift phase/motion/mode/session/map, dock phase; selected/focused/disabled/invalid/stale/hidden | multi-floor lift compound, unavailable/offline/unknown, map filtering, activation/disabled and 320px stories |
| Scene3DFrame | ready, loading, empty/no-source, degraded, stale, unavailable, error; HUD and viewport-local toolbar | 3D state matrix, dark and narrow stories |
| VideoStreamTile | connecting, live, degraded, stale/frozen, paused, no-signal, error; persistent identity/live truth, interaction-revealed toolbar, optional delayed metadata and retry action | textual state, hover/focus toolbar reveal, delayed last-frame grouping, blocked-content focus suppression, compact tile stories |
| ViewerToolbar | command, pressed/unpressed toggle, horizontal/vertical, on-dark/minimal, disabled action, roving focus | arrow/Home/End, remembered focus, explicit aria-pressed stories |
| TelemetryGauge | exact value, min/max, formatter/precision/valueText, app-provided tone, compact size | meter semantics and non-rounded numeric story |
| TelemetryValue | value, unit, tone label, stale, timestamp and helper, compact density | responsive 320px, non-color state, numeric readout story |
| Modal/Drawer/Sheet | controlled open/close, visible title or ariaLabel, Drawer short `subtitle` associated with `aria-describedby`, localized close label where applicable, initialFocusRef, bidirectional Tab trap, topmost Escape/containment, returnFocusRef/automatic trigger restore, normal/narrow overflow | nested modal and normal/320px overlay focus stories; Drawer visible subtitle association assertion |
| ConfirmDialog | default, danger, warning text, cancel, confirm, pending/disabled, scrim/Escape dismiss, shared overlay stack, nested topmost Escape, initial focus/trap/restore | confirmation, nested overlay and safety-confirmation stories |
| Select | controlled/uncontrolled value, combobox/listbox naming, Arrow/Home/End navigation, Enter/Space commit, Escape close/focus return, disabled/invalid/helper | selection control and keyboard-contract stories |
| SearchableMultiSelect | async search, selected chip removal, keyboard option traversal that skips disabled options, loading/error/empty, max selection | searchable multi-select resource and disabled-option stories |
| SecretField | masked/revealed, timed reveal, copy feedback, disabled, external re-auth composition | secret field story |
| FileUploadQueue | queued/uploading/processing/succeeded/failed, progress, retry/remove/open, partial completion | upload queue states story |
| SourceDisclosure | product-provided availability, provenance, observed/updated time, excerpt, source action, missing/restricted/error, optional visually hidden title for already-labelled embedding surfaces, and a compact single-line citation chip mode (no card/availability/disclosure, opens the source on activation) for chat-answer references | source disclosure stories plus explicit ConversationMessage `sources` slot composition |
| LogViewer | level/search, pause/tail/latest, virtualized buffer, dropped line, reconnect/stale, copy/export/clear | log viewer stream states |
| AnnotatedImage | load/error/empty, normalized region/point, annotation toggle, object fit, caption, accessible annotation summary; no provenance/actions/metrics | annotated image renderer stories |
| ManualControlSession | independent link/authority/UI-arm/dead-man/focus axes, blocked reason, focus/visibility loss, safe-release reason, unmount release, re-arm request, emergency-stop request; no transport guarantee | manual control session stories |
| EquipmentStatusCard | required equipment identity and visible primary condition, optional decorative icon/description, semantic tone, labeled supporting facts in a description list, freshness/ownership metadata and composed actions; noninteractive article with no product transport or equipment state machine | equipment identity/status overview, connection composition, normal width, 300px long-content dark and hidden parity stories |
| FieldAction | one LDS field plus one separate action, shared sm/md/lg density mapped to 32/48/52px, optional shared label/helper/error, native form composition, field-before-action DOM order, automatic single-column reflow at 360px | 32/48px alignment, disabled/loading/long-label/error, native Enter submit, direct Tab order and 320px full-width action stories |
| ValidationSummary | one or more blocking errors, optional same-submit field-linked warnings, required issue `href`, automatic `label: message` action name, optional SPA activation, focus-led summary or opt-in count announcement; no warning-only/valid surface | summary-to-field focus, identical inline message/`aria-invalid`/`aria-describedby`, error-only announcement and 320px long-copy stories |
| ConversationMessage | `authorRole` defaults assistant to borderless `document`, user to solid primary `bubble`, human-agent to a neutral fill `bubble`, system to a centered neutral pill chip, with an `AI`/`상담원` role badge and optional `roleBadgeLabel`; explicit `presentation="document|bubble"` and optional non-system `direction` remain independent overrides; single/first/middle/last grouping, static/delivery/response lifecycle (delivery adds `read` with a bubble-foot time + read receipt), response complete and delivery sent silent by default, aria-busy only on response pending/streaming/stopping, failed-only retry, rich body plus generic attachment/source/action ReactNode slots; canonical completed-AI composition places the inline source and action group as footer siblings, orders actions copy→regenerate→positive/negative feedback, maps product-owned feedback selection through `pressed`/`aria-pressed`, disables those follow-up actions while streaming, and exposes only retry when failed; DOM order identity→body→response status→attachments→sources→delivery meta/static status→actions, with `inlineSources` moving sources after the action group in the final footer | role/presentation anatomy, lifecycle and conditional status order, grouping and explicit slots, canonical AI source/action recipe, general assistant composition, approximately 760px and 320px, dark, long rich assistant document and multiline user primary bubble stories |
| MessageFeed | transparent/chrome-free named viewport, role="log" polite additions-only live region, required controlled `following` with user-scroll/jump-to-latest reason, prepend scroll-anchor restoration, history load/busy, unread jump with focus retention, separate liveStatus status region, empty; focusable log supports Home/End/Page Up/Page Down viewport navigation without intercepting descendant controls; existing Core `Divider` composes named non-interactive date and first-unread boundaries while product owns their truth; parent owns app header/sidebar and outer panel surface | history anchoring, follow/unread, date/first-unread boundary composition, viewport keyboard navigation, empty/busy, transparent-feed composition, approximately 760px, 320px narrow and dark stories |
| MessageComposer | controlled value, idle/submitting/streaming/stopping, enter/modifier-enter/button-only submit modes, IME-safe Enter, Shift+Enter newline, Alt-free Ctrl/Meta+Enter with Ctrl+Alt/AltGr rejection, disabled requires disabledReason and makes the slot-bearing shell inert, canSubmit/readOnly, elevated one-shell containing attachments → full-width autosize textarea → wrapping leading/trailing/send-or-stop action band; `statusLabel={null}` suppresses the default phase label; never infers transport completion or clears value | submit-mode, IME and AltGr collision guard, streaming stop, disabled-slot blocking, elevated one-shell hierarchy, normal/dark, approximately 760px and 320px multi-action stress stories |
| VirtualKeypad | controlled canonical string value preserving `-`/`0.`/leading zeros, integer/decimal mode, optional sign, canonical `.` with localized display separator, min/max applied to confirmation validity only, maxLength, disabled/confirmDisabled, targetId focus preservation | integer/decimal and sign, range-invalid confirm, target-focus retention, 320px and landscape stories |

## Disallowed patterns

- UI card 안에 또 다른 page section card를 넣지 않는다. 반복 item이나 modal/frame만 card로 쓴다.
- icon-only action을 label 없이 노출하지 않는다.
- status를 색상만으로 구분하지 않는다.
- primitive token을 앱 화면에서 직접 쓰지 않는다.
- toolbar action icon을 새로 그리지 않는다. `Icon` registry에 있는 이름을 우선한다.
- command eligibility button, conversation message list/composer, single-product terminal frame, approval transition처럼 기존 요소의 단순 조합이거나 제품 policy를 포함하는 wrapper를 public component로 추가하지 않는다.
- conversation의 독립 message/feed/composer 계약은 위 금지 규칙의 예외로 즉시 승인하지 않는다. 반복 소비 근거와
  자체 interaction/accessibility 계약이 [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md)의
  Track C gate를 통과할 때만 별도 Product extension으로 재판정한다.
- disabled control을 설명 없이 주요 flow의 유일한 경로로 두지 않는다.

## Storybook evidence rules

- Public story는 사람이 쓰는 이름을 가진다.
- visual parity story는 `!dev`와 `visual-parity` tag를 유지한다.
- 상태가 많은 컴포넌트는 single playground와 state matrix story를 분리한다.
- domain/editor/viewer 컴포넌트의 제품 통합은 제품 저장소에서 검증하고, LDS Storybook에는 애플리케이션 워크스페이스를 추가하지 않는다.
