# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

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
- Selecting one `Category` chip no longer leaves a previously `active` chip selected as well, and the same duplicate-selection defect is fixed in `Tabs`. `item.active` now seeds the initial uncontrolled selection instead of being merged into every render, so exactly one chip or tab is ever current.
- Navigation semantics that were visual-only are now exposed to assistive technology: `Steps` and the `Wizard` indicator are an ordered list with `aria-current="step"` and visually hidden 완료/현재 단계/예정 state text, `Breadcrumb` and `SideNav`/`TopBar`/`Footer` navigation render real `ol`/`ul` lists, `Anchor` nests its list by heading level, and `Category` exposes a `radiogroup` with arrow-key selection. `PageIndicator` announces its position instead of rendering empty dots, and interactive dots meet the 24px target size.
- `Wizard footer` is rendered again. The prop was declared as a `ReactNode` but only ever read as a null check, so a custom footer was accepted and then discarded.
- `SideNav` collapsed rail labels use the design system `Tooltip` instead of the native `title` attribute, so they are reachable by keyboard and touch rather than pointer-only.
- `Menubar` drill mode keeps a valid ARIA menu: the back control is a `menuitem` inside the roving order, drill triggers expose `aria-expanded`, and radio runs are grouped.
- Republished the release set to repair the `@lk-robotics/lds-core@0.1.0-rc.0` artifact, which shipped without `dist/` although its export map pointed at `./dist/*`, making every deep component subpath unresolvable for consumers (including `lds-robotics-ui` and this repository's own Storybook). `lds-core`, `lds-theme`, `lds-product`, and the `design-system-core` facade are released as `0.1.0-rc.1`; `lds-robotics-ui` is released as `0.1.0-rc.2` against them from its own repository.
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
- New imports should use the owning layer subpath. Existing imports from `@lk-robotics/design-system-core` remain compatible during the migration window.
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
