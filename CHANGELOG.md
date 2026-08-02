# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

## Unreleased

Repository-wide accessibility and convention sweep across the Core (55 areas) and Product (69 areas) layers, audited against WAI-ARIA APG, WCAG 2.2, and current industry systems, with every fix pinned by a hidden contract story. 481 stories are Axe-clean with 262 play contracts.

### Added

- `DataToolbar.filters` render context: `filters={({ size }) => ...}`가 검색과 같은 `sm`/`md` field control 밀도를 전달하며 기존 ReactNode 슬롯은 호환됩니다.
- `DashboardShell`에 계층형 좁은 화면 탐색을 위한 controlled `temporaryNavigation` Drawer 계약을 추가했습니다. 공용 modal 엔진의 스크림·focus containment·Escape·복원·scroll lock을 재사용하고 열린 동안 셸 배경을 `inert` 처리합니다.
- `SideNav autoExpandActiveGroup={false}`로 활성 route 표시와 disclosure 자동 펼침을 분리할 수 있습니다. 기본값 `true`는 기존 동작을 보존합니다.
- `StatusIndicator` Core 컴포넌트: 실시간 가용성·연결·freshness를 6px semantic dot과 필수 visible label로 표시하며, 실제 변화 중인 신호에만 reduced-motion-safe `pulse`를 명시합니다.
- `RecordHeader` Product Extension for person, robot, order, and other record identity: optional visual, required record title, badge, description, details, actions, composable heading level, and 320px action reflow.
- Scroll-surface governance: `check:scroll-surfaces` enforces the native default, standardized compact opt-in, forced-colors fallback, and explicit reasons for the only hidden-scrollbar exceptions; Storybook Axe now includes `scrollable-region-focusable`.
- Cross-repository contract governance for the editor/viz/robotics seam: `check:robotics-contract-drift` compares this repository's `.prompt.md` contracts against the implementations in the external Robotics repository (ratcheted via `docs/references/robotics/CONTRACT_DRIFT_BASELINE.json`), and `check:robotics-semantics` resolves type/story paths across both checkouts instead of failing on the split.
- `Table` semantics: `caption`, `tableLabel`, `tableLabelledBy`, `rowHeaderKey` (renders `<th scope="row">` at unchanged pixels), and `getRowId`. Column headers always carry `scope="col"`.
- Form autofill contracts: `PasswordInput autoComplete` (default `current-password`) with Caps Lock warning (`capsLockLabel`), spell-check/auto-correct suppression, and re-masking on form submit; `PinInput autoComplete` (default `one-time-code`) with full-code distribution across cells, `charset` filtering, `invalid`, and Arrow/Home/End cell navigation.
- `NumberField label/helper/error/invalid/fieldStyle` via the shared field metadata engine, plus a draft-edit model: typing may hold out-of-range values and clamping happens on commit (blur/Enter/steppers).
- `Calendar` Shift+PageUp/PageDown year navigation; `DatePicker invalid` (trigger `aria-invalid` + negative border) and focus-out close; `DateRangeField` feeds the start date as the end calendar's `minDate`.
- `Carousel` APG contract: `role="region"` + `aria-roledescription="carousel"`, per-slide `group`/`slide` roles with "N / 전체" labels, offscreen slides removed from the tab order via `inert`, opt-in `autoPlay` with a pause control and hover/focus suspension, and Korean control labels (all overridable).
- `Lightbox` slide announcements through a persistent polite region, visible position indicator, Korean `closeLabel`/`previousLabel`/`nextLabel`/`positionLabel`, and controls that stay mounted (`aria-disabled`) while an image loads.
- `LogViewer` follow-mode announcements (`announceNewLines`): only newly arrived lines are announced while tailing, the virtualized container is keyboard-scrollable with an accessible name, and copy results are announced.
- `Rating` rewrite: interactive mode is an APG slider (single tab stop, Arrow/Home/End, `aria-valuetext` "5점 만점에 N점"), read-only mode is `role="img"` named by its value, with `label`/`valueText` props. Fractional values fill by floor instead of rounding a 4.5 up to five stars.
- `ColorSwatch` rewrite as a `radiogroup`: roving tabindex, four-direction Arrow navigation, per-option labels/disabled, and a non-color selection cue (check glyph + halo) closing the WCAG 1.4.1 gap.
- `ChecklistItem stateLabel` (visually hidden 포함/제외 text) and `as` for list semantics; `SpecRow` renders `dl`/`dt`/`dd` with a `grouped` mode for composed spec tables.
- `FeatureCard`/`NewsCard`/`ProductCard` inherit the Card improvements: real headings with `headingLevel`, keyboard activation for interactive cards, links named by their headline instead of the full card text, and focus-visible affordances matching hover.
- `ResourceState headingLevel` (ChartFrame passes its own level + 1); `Fab type`; `TimePicker` labelled group; `WheelPicker` type-ahead and settle-commit (one commit per drum stop instead of per scroll frame); `IconPicker` grid-aware 2D keyboard movement with a single tab stop; `PropertyField`/`InputGroup` label and describedby wiring with consumer `onChange` passthrough.
- 44 hidden contract stories pinning the keyboard/ARIA/live-region contracts above; inventory grew to 481 implementation stories (public surface unchanged at 335).
### Fixed

- `SideNav`의 접힌 레일 행이 38px, 펼친 행이 44px이고 브랜드 아래 패딩도 10/18px로 달라 overlay peek 때 목적지가 세로로 이동하던 문제를 고쳤습니다. 두 상태는 44px 행과 같은 브랜드 아래 패딩을 공유합니다.
- `DataToolbar size="md"`가 48px field형 필터 옆 검색만 40px로 축소하던 문제를 고쳤습니다. 기본 검색은 다시 48px field 척도를 사용하고 `filters` render context로 같은 밀도를 전달합니다.
- `Calendar` could not leave the selected month: the view snapped back on every render, disabling previous/next, PageUp/PageDown, and month-boundary arrows (also through `DatePicker`). The displayed month is now owned by user navigation, and the header buttons keep focus so they can be pressed repeatedly.
- `CopyButton` reported "복사됨" even when the clipboard write failed; failures now render and announce a distinct error state through an always-mounted status region.
- `HoverCard` could not be dismissed with Escape: restoring focus to the trigger re-fired the open-on-focus rule and reopened the card. The shared dismiss engine now latches the trigger until focus actually leaves, which also hardens `Tooltip` and `Popover`.
- `ProgressBar` and `CircularProgress` ignored `prefers-reduced-motion` because the sweep/rotation is an inline style; the override now declares `animation: none !important` (same fix Skeleton/Spinner received).
- `TreePicker` regression from the native Checkbox rewrite (`aria-hidden` around a focusable input): the row indicator is now a purely decorative element that replicates the Checkbox visuals, so no form control exists inside the tree.
- `NumberField` clamped on every keystroke (typing 25 under max 20 or clearing the field was impossible) and remounted its steppers on each render, dropping focus mid-interaction.
- `Tooltip` bubbles no longer grow a scrollbar at their preferred size, and the arrow stays attached to the bubble edge while leaning toward the trigger when an edge-aligned bubble is shorter than its target (`check:tooltip-alignment` now guards attachment per axis).
- `PageHeader` pushed its actions below the description on ordinary desktop panes; the title-row wrap threshold dropped from 32rem to 18rem so page actions stay title-aligned until genuinely narrow layouts.
- Conditionally mounted live regions across `DataExportAction`, `FilterBar`, `SavedViewControl`, `MessageComposer`, `MessageFeed`, and `CommandPalette` are now persistently mounted so assistive technology hears every transition; `CommandPalette` also moved "결과 없음" out of the listbox (axe `aria-required-children`) and gained two-stage Escape (clear query, then close).
- End-of-range focus loss when a control disables itself after activation: `ReorderList` move buttons, `DataExportAction` export, `FileBrowser` up-navigation, and the `MessageComposer` stop control keep or hand off focus instead of dropping to `<body>`.
- Core-layer sweep: `Checkbox`/`Switch` are native inputs wrapped in labels (pixel-identical), `Dimmer` makes covered content `inert`, `Alert` exposes `alertdialog`, `Toast`/`Snackbar` use persistent live regions with duration/pause contracts, `DropdownMenu` drill re-entry no longer loses the first keystroke and typeahead accumulates multi-character queries, `Icon` is decorative by default, `ContentBadge` solid fills meet AA via status text tokens, and `IconPicker`'s empty-state text meets contrast (was 1.67:1).

### Changed

- `StatusBadge`는 dot과 pulse를 제거하고 20px soft semantic pill + 명시적 상태 라벨로 재설계했습니다. 진행·마감·게시·검토 같은 lifecycle/result 상태는 StatusBadge가, 실시간 연결 신호는 StatusIndicator가 소유합니다.
- `PageHeader` is now limited to page context and task actions; record/profile identity moved to `RecordHeader` and the former `avatar` prop was removed.
- `ScrollArea` now preserves the OS/browser scrollbar by default, exposes `scrollbar="compact"` only for constrained surfaces, reserves a stable gutter by default, and no longer injects a hard-coded 7px WebKit scrollbar. Shared scroll consumers use the same contract; SideNav, Tabs, and Category no longer hide overflow indicators.
- `ResourceState messageVariant` now defaults to `standalone`, so a preserved-data message rendered outside a card or panel keeps its own perimeter and radius. Container compositions must opt into `messageVariant="embedded"`; `ChartFrame` and the Resource State card examples do so explicitly.
- `BrandLogo` is decorative by default and exposes `role="img"` only with an explicit `aria-label`/`title`, eliminating double announcements such as "google logo Google로 계속하기" in `SocialButton`.
- `ButtonGroup` no longer injects the generic default group name '보기 또는 모드 선택'; missing names warn in development builds.
- `Meter` exposes `role="meter"` with values in the caller's units, and threshold bands announce and render a word (위험/주의/양호, overridable) instead of relying on color alone.
- `SpeedDial` renders trigger-then-actions in DOM order (visual stacking unchanged via `column-reverse`) and restores focus to the trigger on Escape or action activation.
- `Bubble` is scoped to non-conversational annotations; chat surfaces belong to `ConversationMessage`/`MessageFeed`.
- Visual baselines updated for the intended changes only: dashboard-shell header (Korean eyebrow + RefreshControl + change tone), card titles as real headings, the new ActionArea sticky-footer tile, tooltip arrows now attached, and ColorSwatch selection checks. Checkbox/Switch scenes are pixel-identical to their pre-rewrite baselines.

### Migration

- `StatusBadge pulse` 사용은 `StatusIndicator pulse`로 옮기세요. 단순 `StatusBadge tone` 사용은 API 변경 없이 새 tinted presentation을 받으며, 실시간 가용성·연결·freshness만 StatusIndicator로 교체합니다.
- Replace `PageHeader avatar={...}` profile or record compositions with `RecordHeader visual={...}`; move verification/status to `badge`, profile stats to `details`, and keep page breadcrumb/context in a separate `PageHeader` only when the screen needs both.
- `ResourceState`: add `messageVariant="embedded"` when the component is intentionally flush with a parent card or panel. No change is needed for independent placements; they now receive the safer `standalone` presentation by default.
- `BrandLogo`: pass `aria-label` (or `title`) where the logo itself is the information; compositions like `SocialButton` need no change.
- `ButtonGroup`: provide a purpose-specific `aria-label`; the silent generic default is gone.
- `Meter` consumers targeting `role="progressbar"` should target `role="meter"`; `aria-valuenow` is now in caller units rather than a 0–100 projection.
- `Rating` interactive usages render a slider control; keyboard and announcement behavior is new, `value` semantics are unchanged, and half-star rendering was never real — floor fill is now explicit.
- `Bubble` chat usages should move to `ConversationMessage`/`MessageFeed`.

## 0.1.0-rc.18 - 2026-08-02

### Fixed

- The Windows release availability probe now invokes `npm.cmd` through the shell, so it can distinguish an explicit registry 404 from process-launch errors before publishing immutable packages.

## 0.1.0-rc.17 - 2026-08-02

### Fixed

- `Select` now has a packed Core + Theme artifact gate: every fallback-free CSS custom property referenced by its shipped module graph must be defined by the two shipped stylesheets, preventing listbox and option layout tokens from silently falling back to browser defaults.
- The immutable-package release workflow now distinguishes an explicit registry 404 from authentication or transport failures; it never treats an unverified package lookup as permission to reuse a version.

## 0.1.0-rc.16 - 2026-08-02

### Added

- `IconButton` now provides a token-backed 24px `xs` density while retaining the 28px WDS-compatible `custom` size, with explicit `sm` and `md` size tokens.
- `Table` columns can opt into `truncate` so constrained tables ellipsize header and body content without forcing horizontal overflow.

### Fixed

- `Select size="sm"` keeps its hidden option-width measurement out of layout flow, so the root and trigger remain at the 32px compact height.

## 0.1.0-rc.15 - 2026-08-02

### Fixed

- The LanguageSwitcher interaction contract now waits for its portalled menu to finish fixed-position layout before clicking an option, removing a Windows CI timing race without changing component behavior.

## 0.1.0-rc.14 - 2026-08-02

### Fixed

- Portalled root and nested menus now preserve the nearest explicit light, dark, or automatic theme, so escaping an overflow container does not reset overlay colors.
- Storybook portal contracts now query the owner document, keep the visual comparison story isolated from the Table overflow regression, and ignore hidden measurement controls in rendered-style checks.
- Development dependency overrides resolve the current PostCSS path-traversal and brace-expansion denial-of-service advisories.

## 0.1.0-rc.13 - 2026-08-02

### Fixed

- Source line endings are normalized to LF before package generation so legacy root bundles are byte-identical between long-lived Windows checkouts and clean GitHub runners.
- `DropdownMenu` root panels now portal to the owner document with fixed viewport positioning, so row-action menus escape `Table` and other scroll-container clipping without changing the container's scroll height. Existing trigger/menu ARIA wiring, keyboard focus, flip, shift, and constrained-height behavior are preserved.

## 0.1.0-rc.12 - 2026-08-02

### Fixed

- Release artifacts are regenerated with the repository's canonical Node 22.17.1 and npm 10.9.2 runtime so the clean-runner generated-artifact gate is deterministic.
- `size="sm"` input controls now use component-owned label1 typography tokens (14px/20px) while the existing body1 tokens remain the medium-size default. `Input`, `SearchField`, `Select`, `AutoComplete`, `Combobox`, `PasswordInput`, `InputGroup`, `NumberField`, `TimePicker`, `DatePicker`, and `Textarea` share the compact density contract.

## 0.1.0-rc.11 - 2026-08-02

### Fixed

- The immutable release job now installs the pinned Playwright Chromium runtime before running browser-backed color-contrast checks on a clean GitHub Actions runner.
- `Select` now derives its intrinsic minimum width from the complete option set instead of the current value, so choosing a shorter label no longer shifts neighboring toolbar controls; narrow containers still cap the control at their available width.

## 0.1.0-rc.10 - 2026-08-02

### Fixed

- The immutable release probe now clears the expected `npm view` miss exit code before the PowerShell step completes, so a genuinely unpublished release candidate can proceed to validation and publication.

## 0.1.0-rc.9 - 2026-08-02

### Fixed

- The immutable release workflow now treats an unpublished `npm view` result as the expected probe outcome on current PowerShell runners instead of failing before inspecting the native exit code.

## 0.1.0-rc.8 - 2026-08-02

### Fixed

- `DataToolbar` now omits an empty header row, keeping controls-only toolbars vertically symmetric, and renders no surface when both header and controls are absent.

## 0.1.0-rc.7 - 2026-08-02

### Fixed

- Restored the nested `@lk-design-system/lds-core` and `lds-product` rc.4 lock entries required by the vendored Robotics rc.4 package, so the immutable release workflow can install the tagged source with `npm ci`.

## 0.1.0-rc.6 - 2026-08-02

### Added

- `SegmentedControl` options accept `count`, allowing a named `radiogroup` to expose per-value result totals without falling back to independent toggle chips or tab semantics.
- Counted segments retain the existing roving tab stop, Arrow/Home/End selection contract, disabled-option skipping, hover, selected state, and focus ring.

### Migration

- Replace hand-composed single-select `FilterChip` groups that display counts with `SegmentedControl` options shaped as `{ value, label, count }`.

## 0.1.0-rc.5 - 2026-08-02

### Added

- `FieldAction` provides the supported field-plus-action composition contract at compact and default densities.
- `Card as` preserves native `article`, `section`, and `li` roots; `Card surface="subtle"` provides a flat inset group surface in light and dark themes.
- `DataToolbar searchable={false}` supports count/filter/action-only collection headers without an inert search control or empty controls row.
- Immutable package release workflow: the `lds-v<version>` tag identifies the exact source commit, every package in the set shares that version, and CI rejects a tag/version that already exists in GitHub Packages.

### Fixed

- Portal workarounds for Card semantics, inset group surfaces, searchless collection headers, and field/action height alignment can now be removed without local surface or dimension overrides.

### Release

- `0.1.0-rc.4` is retired and will not be overwritten again. This release is the first package set governed by the tag and registry preflight checks above.

## 0.1.0-rc.4 - 2026-07-31

### Changed

- **Breaking — package scope.** The four published packages move from `@lk-robotics/*` to `@lk-design-system/*`, matching the GitHub organization that owns this repository. GitHub Packages files a scoped npm package under the organization named by its scope, so the old names placed the design system under LK-ROBOTICS while its source lived under LK-Design-System.

  | before | after |
  | --- | --- |
  | `@lk-robotics/lds-core` | `@lk-design-system/lds-core` |
  | `@lk-robotics/lds-theme` | `@lk-design-system/lds-theme` |
  | `@lk-robotics/lds-product` | `@lk-design-system/lds-product` |
  | `@lk-robotics/design-system-core` | `@lk-design-system/design-system-core` |

  There is no registry-level redirect for a scope rename. Consumers must add `@lk-design-system:registry=https://npm.pkg.github.com` to `.npmrc` and update their dependencies. The `@lk-robotics/*` packages stay published through the transition so a consumer that has not moved keeps resolving instead of failing with a 404.

  `@lk-robotics/lds-robotics-ui` is unchanged in this release; it moves once the Robotics repository republishes under the new scope, after which the vendored tarball here is replaced.

  Cross-repository governance recognises both scopes for the duration: the conformance CLI's LDS-package predicate, the consumer scanners, and the migration checks match either namespace, so a repository the migration has not reached is still checked rather than silently skipped.

### Added

- Every published manifest now declares `repository` (with `directory`), `homepage`, and `bugs`. Package and repository finally share an owner, so GitHub can link them; the workspace root previously pointed at `lk-design-system.github.io` rather than this repository.

## 0.1.0-rc.3 - 2026-07-30

### Fixed

- `Button`: `aria-busy` stays a boolean when `loading` is the string `'inline'`. The prop value was reaching the attribute directly, so an inline-loading button announced `aria-busy="inline"` — not a valid boolean, and assistive technology read it as absent.

## 0.1.0-rc.2 - 2026-07-30

### Added

- `OverlayStatusChip`: the Status-family chip promoted from Robotics after the proposal review, for status that must stay legible over a viewport rather than on a panel surface.
- `loading="inline"` on `Button`: a busy state that keeps the label in place instead of swapping it for a spinner.
- `status-negative` in the Robotics upstream token manifest.

### Changed

- The severed-link indicator draws its slash from the shared icon source rather than a local path.
- Viewer overlay surfaces resolve their opacity from one source (`_viewerOverlaySurface.js`, strong/soft), so `ViewerToolbar` and the Robotics kit consume levels instead of each redefining them.

## 0.1.0-rc.1 - 2026-07-22

### Added

- `DescriptionList variant="stacked"`: the term sits above a regular-weight value with spacing instead of hairline rows, for narrow detail panels and cards where a fixed term column wastes width and uniform bold flattens emphasis. The default row presentation is unchanged, so this is additive.
- `Tabs` tab/panel wiring: each tab now carries a generated id (overridable per item with `tabId`) and points at its panel through `panelId`, so consumers can complete the APG tab ↔ `tabpanel` relationship that the component previously made impossible to express.
- `Wizard onComplete` and `completeLabel`: on the last step the next control becomes the completion action instead of a dead disabled button. Without `onComplete` the previous behaviour is kept.
- `RefreshControl refreshLabel` now names an icon-only refresh action, and `PageIndicator groupLabel` replaces the previously hardcoded English group name.

- Nested submenus for `DropdownMenu` and `Menubar` through recursive `items`: `submenuMode="flyout"` (portaled beside the parent panel) and `submenuMode="drill"` (same-panel swap with a back control), sharing one keyboard/aria contract.
- `Calendar` and `DatePicker` blocked dates via `minDate` and `isDateDisabled`; disabled days stay focus-traversable but cannot be selected.
- `DashboardGrid fillLastRow` and the Dashboard Navigation pattern page (fixed panel, overlay peek rail, top-bar collapse toggle, 320px fallback).
- Added additive `/core`, `/theme`, `/product`, and `/robotics` package subpaths with matching ESM, CJS, and type entries. The aggregate root remains the exact compatibility union of all four layers.
- `NavigationAnnotationLayer`: an SVG `<g>` provider that coordinates cross-entity label collisions across the six navigation overlays (`RouteOverlay`, `TrajectoryOverlay`, `LaneOverlay`, `WaypointMarker`, `SpatialRegion`, `FacilityTransition`). Colliding labels nudge vertically (≤56 CSS px by default, direction-constrained to preserve each overlay's row contracts) and, when no slot remains, only the lowest-priority label is hidden — markers, state badges, accessible names, true anchor `data-*` coordinates, and the semantic mirror never change. Priority is state-first (selected > focused > alarm > active) with paint-order kind weight as tie-break; layout is measured from real DOM rects via `getScreenCTM()` and is deterministic. Overlays rendered without the provider behave exactly as before.
- `variant="embedded"` on `ViewerFrame` (and its `Scene3DFrame` / `Map2DCanvas` / `VideoStreamTile` presets), `DataGrid`, and `DataToolbar`. When one of these surfaces is nested inside another surface — a `CanvasEditorShell` canvas slot, a `Card`, a wrapping collection `section`, or a `DockPanel` body — `embedded` drops the component's own border and radius so the parent owns one continuous perimeter. Viewport/grid chrome, normalized state, HUD/toolbar, and accessibility roles are unchanged; `DataToolbar` keeps only a bottom divider as a header bond. Default `standalone` is unchanged, so this is non-breaking. Extends the existing `variant="embedded"` convention (`Banner`, `FilterBar`, `ResourceState`) to container/frame surfaces.

### Fixed

- Menu keyboard navigation no longer loses a keystroke to the queued entry focus. `DropdownMenu`, `Menubar`, and `SplitButton` share a roving-focus engine that focuses the edge item one animation frame after the menu (or a drill level) renders; a key pressed before that frame arrived was silently undone when it fired, so drilling into a submenu a second time left focus on the first item and the submenu never opened. The queued frame is now cancelled as soon as keyboard navigation moves focus.
- Selecting one `Category` chip no longer leaves a previously `active` chip selected as well, and the same duplicate-selection defect is fixed in `Tabs`. `item.active` now initializes the uncontrolled selection instead of being merged into every render, so exactly one chip or tab is ever current.
- Navigation semantics that were visual-only are now exposed to assistive technology: `Steps` and the `Wizard` indicator are an ordered list with `aria-current="step"` and visually hidden 완료/현재 단계/예정 state text, `Breadcrumb` and `SideNav`/`TopBar`/`Footer` navigation render real `ol`/`ul` lists, `Anchor` nests its list by heading level, and `Category` exposes a `radiogroup` with arrow-key selection. `PageIndicator` announces its position instead of rendering empty dots, and interactive dots meet the 24px target size.
- `Wizard footer` is rendered again. The prop was declared as a `ReactNode` but only ever read as a null check, so a custom footer was accepted and then discarded.
- `SideNav` collapsed rail labels use the design system `Tooltip` instead of the native `title` attribute, so they are reachable by keyboard and touch rather than pointer-only.
- `Menubar` drill mode keeps a valid ARIA menu: the back control is a `menuitem` inside the roving order, drill triggers expose `aria-expanded`, and radio runs are grouped.
- Republished the release set to repair the `@lk-design-system/lds-core@0.1.0-rc.0` artifact, which shipped without `dist/` although its export map pointed at `./dist/*`, making every deep component subpath unresolvable for consumers (including `lds-robotics-ui` and this repository's own Storybook). `lds-core`, `lds-theme`, `lds-product`, and the `design-system-core` facade are released as `0.1.0-rc.1`; `lds-robotics-ui` is released as `0.1.0-rc.2` against them from its own repository.
- Accordion and Collapsible collapsed content is now removed from the accessibility tree and tab order (`inert`) and each trigger names its panel via `aria-controls`, closing the benchmark-flagged disclosure defect.
- Cross-entity label overlaps on dense navigation maps: a route's progress label could cover a trajectory's label, and adjacent `FacilityTransition` markers could cover each other's label blocks. Both cases are now coordinated (and gated by story play assertions) when composed under `NavigationAnnotationLayer`.

### Changed

- **Removed `SideNav collapsible`.** The panel no longer renders any internal collapse toggle; the shell's top-bar toggle driving `collapsed`/`onCollapsedChange` is the only supported control. See Migration.
- `AnnotatedImage` region labels are now detection-tool tags: the label is filled with the region's tone colour and attached to the box edge, so a label belongs to its box by colour rather than by proximity. Labels sit outside the top edge by default, fall back inside when the frame leaves no room above, and flip below when another region covers the top strip — overlapping detections (a part inside a whole) no longer stack their labels or truncate them to the small box's width.
- `ChartFrame` header is a two-row anatomy — title with inline meta and vertically centred actions on the first row, description across the second — instead of a three-line text stack with a toolbar floating beside it. `RefreshControl` orders its parts as freshness text, interval select, then an icon-only refresh action, so the corner-most element is the action rather than a passive timestamp (AWS console and Grafana convention).
- `PrimaryDetail detailFooter` is a right-aligned action row in both inline and overlay presentations, matching the Drawer footer it already used in overlay mode.
- Elevation is now governed by how a surface attaches: floating popups keep an all-round shadow, edge-attached overlays clip the shadow to the edge that actually covers content, and in-flow surfaces use a divider instead of a shadow. `SideNav` overlay peek follows this on both `floating` and `docked` surfaces; the rule is recorded in `docs/TOKEN_GOVERNANCE.md`.
- Reworked the communication family around a general AI conversation hierarchy: assistant turns use a borderless document presentation while participant turns read at a glance—the user's own turns use a solid primary bubble (`primary-heavy`/`static-white`, AA in both themes) with a bubble-foot send time and `read` receipt, human-agent turns use a neutral fill bubble, and system events use a centered neutral pill chip (distinct from the blue role badge); `AI`/`상담원` role badges (overridable via `roleBadgeLabel`) name the speaker type, the feed stays chrome-free with a circular icon scroll-to-latest control that carries an unread-count badge (its history control stays a text action so its loading state reads clearly), and the composer exposes generic leading/trailing action slots.
- Added a `compact` presentation to `SourceDisclosure` that renders each source as a single-line, attachment-weight link chip—no card surface, inline disclosure, or availability badge—for contexts where every listed source is expected to be usable, such as citations under a chat answer; the conversation examples cite sources with it and surface message quick-actions as icon-only controls.
- Reworked `EquipmentStatusCard` as a semantic equipment identity, visible status, and labeled-facts card derived from LDS and authoritative status/summary-list references rather than a product-specific ledger row.
- Clarified that pinned product frontends are authoritative only for component/workflow coverage, states, density, and ownership seams—not LDS anatomy, styling, tokens, or public API design.
- Added a canonical `ConnectionBadge connectionState` transport axis and a machine-readable robotics semantic registry that keeps connectivity, freshness, health, operability, authority, command, evidence, review, and urgency independent.

### Migration

- Remove `collapsible` from `SideNav`. Own the collapsed state in the shell and pass `collapsed`/`onCollapsedChange`, then render the toggle at the start of the top bar (`SidebarTrigger` placement for side-first shells, `SideNavToggleButton` placement for header-first shells) with `aria-expanded` and `aria-controls` pointing at the `SideNav` id. Keyboard, focus restore, and the collapsed icon rail are unchanged; only the panel-internal button is gone.
- New imports should use the owning layer subpath. Existing imports from `@lk-design-system/design-system-core` remain compatible during the migration window.
- Replace `ConversationMessage variant="soft|solid"` with `presentation="document|bubble"`; omit it for the role defaults. Replace `sourcePresentation` and source arrays with an explicit `SourceDisclosure` (or other provenance node) passed to the `sources` slot. Move response cancellation to `MessageComposer onStop`.
- Replace `MessageComposer attachmentAction`/`secondaryActions` with `leadingActions`/`trailingActions`.
- Replace `EquipmentStatusCard ringLabel`, `ringCaption`, `tone`, `direction`, `connection`, and `chips` with `status`, `statusTone`, and labeled `details`; compose direction or connection indicators inside detail values.
- Use `ConnectionBadge connectionState="unknown|connecting|connected|degraded|reconnecting|disconnected|failed"` in new code. The legacy `status` prop remains compatible; represent `stale` as freshness evidence outside the badge.
- Nesting a Viewer preset (`Scene3DFrame`, `Map2DCanvas`, `VideoStreamTile`) inside a `CanvasEditorShell` or `Card`: pass `variant="embedded"` instead of insetting the viewport or overriding `border`/`borderRadius` through `style`. For the `DataToolbar` + `DataGrid` + `Pagination` collection pattern, pass `variant="embedded"` on the toolbar and grid instead of stripping each part's perimeter with inline `border:0`/`borderRadius:0`.

## 0.1.0-rc.0 - 2026-07-19

### Added

- Published-package manifests for Core, Theme, Product, Robotics UI, and the legacy compatibility facade. All internal dependencies are pinned to this immutable release-set version.

## 0.1.0 - 2026-07-11

### Added

- Automated accessibility lifecycle, target-size, API grammar, token hygiene, motion, prompt, story coverage, pixel regression, package artifact, and strict React consumer checks.
- Compiled per-component package subpaths and React 18/19 strict declaration coverage.

### Changed

- Split the package build into tree-shakeable component entries and preserved the `"use client"` boundary in ESM and CJS output.
- Normalized modal focus handling, menu keyboard behavior, field sizing, status semantics, overlay surfaces, copy conventions, and composed layout hierarchy.
- Replaced the oversized traced Instagram asset with a compact equivalent vector.

### Fixed

- Removed accidental runtime dependency pollution and raw JSX/prompt publication.
- Resolved global JSX namespace and intrinsic HTML prop conflicts in public declarations.
- Corrected Dimmer contrast, table numeric alignment, viewer fallback icons, focus trapping, and multiple keyboard interaction gaps.

### Deprecated

- See [the generated deprecation register](docs/DEPRECATIONS.md).
