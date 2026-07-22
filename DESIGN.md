# Design

## Source of truth

- Status: Draft — WF-16 is implemented but its complete narrow-navigation and interaction evidence is not yet verified.
- Last refreshed: 2026-07-21
- Primary product surfaces: LK operations dashboards, product application shells, data-heavy monitoring and investigation surfaces, and the shared component layers that support them.
- Evidence reviewed: `readme.md`, `docs/OPERATING_MODEL.md`, `docs/PRODUCT_FRONTEND_COVERAGE.md`, `docs/AI_DESIGN_SYSTEM_GUIDE.md`, `docs/COMPONENT_API_STATE_MATRIX.md`, `docs/STORYBOOK_INFORMATION_ARCHITECTURE.md`, `components/layout/DashboardShell.*`, `components/layout/DashboardGrid.*`, and their Storybook stories.
- Decision: Operations Dashboard is an **LDS Product pattern family**, not a separate design system, repository, theme, or complete screen template.
- Governance: this file is the design decision contract for LDS UI work. Component prompts and detailed audit documents may add evidence, but they must not contradict the ownership boundaries here.

## Brand

- Personality: precise, calm, industrial, dependable, and operationally focused.
- Trust signals: current entity and scope are explicit; freshness and connectivity are visible; dangerous or unavailable actions explain why; product identity appears once; recovery paths remain near the affected surface.
- Avoid: decorative “control-room” styling, neon or cyberpunk effects, color-only status, excessive glow, nested cards, ornamental charts, and a wall of equally prominent KPI tiles.

## Product goals

- Goals:
  - Help an operator understand the current situation and choose the next safe action quickly.
  - Reuse one shell, navigation, data-state, and responsive vocabulary across LK products.
  - Keep monitoring, investigation, recovery, and navigation compositions consistent without copying complete product screens into LDS.
  - Preserve light/dark theme compatibility and a readable 320px narrow fallback.
- Non-goals:
  - A generic admin-template system for every back-office or analytics product.
  - Product routes, permissions, queries, KPI formulae, thresholds, transport, persistence, command execution, or domain state machines.
  - A mandatory KPI row, chart grid, sidebar topology, or dark-only visual theme.
  - A second set of foundations, primitives, colors, typography, or icons.
- Success signals:
  - LK Web Viz, LK Control, and other consumers can compose the pattern from the same public LDS components.
  - A shell has one product-identity owner, one banner/header owner, one `main`, and an operable skip link.
  - Loading, refreshing, stale, offline, restricted, error, and last-good-data behavior remain distinguishable.
  - Normal, dark, and 320px stories have no page-level horizontal overflow or lost navigation context.

## Personas and jobs

- Primary personas: control-room operators, fleet or facility supervisors, field and maintenance engineers, and product engineers configuring an operational workspace.
- User jobs:
  - Confirm which product, workspace, facility, fleet, robot, or resource is in scope.
  - Detect attention-worthy state and distinguish live, stale, degraded, offline, and restricted information.
  - Move from overview to evidence, history, or detail without losing the current entity and time context.
  - Start a permitted action only after prerequisites and likely impact are visible.
  - Recover from partial failure while retaining the last trustworthy data and investigation context.
- Key contexts of use: long-running desktop sessions, mixed light/dark environments, information-dense monitoring, intermittent connectivity, keyboard-heavy navigation, and occasional narrow or touch access.

## Information architecture

- Primary navigation:
  - Product identity belongs to either `TopBar` or `SideNav`, never both.
  - Hierarchical destinations use a docked `SideNav` on wide screens. Its persistent 36px collapse control stays inside the logical end divider while the panel changes between the expanded width and a 64px icon rail.
  - Global utilities such as workspace, search, notifications, help, and account remain separate from product destinations.
  - Narrow layouts replace wide navigation with an explicit temporary or compact navigation surface and restore focus when it closes.
- Core routes/screens: overview or launcher, resource/status collection, monitoring or analysis, primary-detail investigation, history, and product-owned configuration/action flows.
- Content hierarchy:
  1. Scope and current entity.
  2. Attention, safety, availability, and freshness truth.
  3. The highest-priority task, status, or investigation entry point.
  4. Supporting metrics, charts, collections, and history.
  5. Secondary utilities and personalization.
- A screen does not need to start with KPI cards. `DashboardGrid` is only for peer surfaces of comparable priority.

## Design principles

- Truth before action: show authority, connectivity, freshness, and prerequisites before presenting a consequential action as available.
- Shell composes; products decide: LDS owns spatial, interaction, state-presentation, and accessibility contracts. Product repositories own workflow meaning and side effects.
- Dense, not cramped: reduce decorative chrome before reducing legibility, hit area, focus visibility, or state explanation.
- Preserve context during recovery: refreshing, stale, offline, and recoverable error states retain last-good content whenever it is safe to do so.
- One semantic source: use existing Core, Theme, Product, and Robotics components and tokens instead of dashboard-only copies.
- Tradeoffs: operational clarity over visual novelty; stable reading order over maximum information per viewport; explicit recovery over transient notification-only feedback.

## Visual language

- Color: use LDS semantic tokens. Dark mode is the same semantic system rebound by theme scope, not a separate dashboard palette. Status always combines color with text, iconography, shape, or state language.
- Typography: use the existing LDS type scale. Metrics may emphasize the value, but label, unit, period, baseline, and freshness remain readable and structurally distinct.
- Spacing/layout rhythm: use existing spacing and grid tokens. Compact compositions may reduce unused whitespace but must not introduce an undocumented global “dense mode” or bypass component padding contracts.
- Shape/radius/elevation: the application shell is a canvas, not a card. Docked navigation uses a dividing edge rather than a floating panel treatment. Data modules own their own single surface; avoid cards nested inside cards.
- Motion: use motion for navigation handoff, disclosure, progress, and state continuity. Do not animate live data merely to attract attention. Respect reduced-motion preferences.
- Imagery/iconography: use the shared `Icon` registry and LK brand assets. Do not invent dashboard-only status glyphs or use decorative illustrations in place of operational evidence.

## Components

- Existing components to reuse:
  - Structure: `DashboardShell`, `DashboardGrid`, `Container`, `PageHeader`, `PrimaryDetail`.
  - Navigation: `TopBar`, `SideNav`, `NavRail`, `BottomNav`, `UserMenu`, `Breadcrumb`.
  - Data and state: `MetricCard`, `ChartFrame`, `DataGrid`, `ResourceState`, `RefreshControl`, `FilterBar`, `DataToolbar`, `Pagination`.
  - Feedback and action: `StatusBadge`, `Banner`, `Callout`, `Button`, `IconButton`, `ConfirmDialog`, `ActionArea`.
- New/changed components: no new public component is required for the initial Operations Dashboard system pass. `DashboardShell` and `DashboardGrid` keep their existing API names and are reclassified in Storybook as the Operations Dashboard pattern family.
- Variants and states:
  - Shell: header-first and side-first wide topology; auto, wide, and narrow layout; explicit narrow-navigation fallback.
  - Side navigation: expanded or 64px rail; controlled or uncontrolled ownership; stable boundary control; nested-parent expansion; separate persistent and overlay behavior.
  - Data surfaces: ready, initial loading, refreshing, empty, error, stale, offline, restricted, disabled, and last-good-data preservation where applicable.
  - Theme: light, dark, and intentional nested theme islands without hard-coded surface colors.
- Token/component ownership:
  - Core owns generic primitives, layout mechanics, accessibility behavior, and foundation tokens.
  - Theme owns LK brand, typography, semantic color values, and brand assets.
  - Product owns reusable Operations Dashboard composition and state-presentation patterns.
  - Robotics owns reusable robot, telemetry, map, viewer, and safety-domain presentation semantics.
  - Product applications own routes, domain truth, permissions, policy, persistence, commands, and final screen composition.

## Accessibility

- Target standard: WCAG 2.2 AA for user-facing text, controls, focus, status communication, and keyboard operation.
- Keyboard/focus behavior: skip-to-main is the first shell shortcut; destinations use links; local view changes may use buttons; the same named SideNav collapse button retains focus across width changes; overlays support Escape and deterministic focus return; collapsed navigation remains operable without pointer hover.
- Contrast/readability: meaningful text uses AA-safe semantic label tokens. Disabled and assistive tokens do not carry essential instructions. Dense layouts preserve readable wrapping and line height.
- Screen-reader semantics: one `main`; one owning banner/header; uniquely named repeated navigation landmarks; live updates are announced without repeatedly reading the entire dashboard; charts provide names, descriptions, and deterministic text summaries.
- Reduced motion and sensory considerations: honor reduced motion, never encode severity or change by motion or color alone, and avoid continuous decorative animation on monitoring screens.

## Responsive behavior

- Supported breakpoints/devices: desktop is the primary operational surface; all public patterns must remain usable at 320px and under container-constrained embedding.
- Layout adaptations: wide hierarchical navigation becomes an explicit temporary or compact destination surface; content becomes a single readable column unless a component owns its own bounded horizontal scroll; actions and filters wrap without reordering their semantic sequence.
- Touch/hover differences: hover may enhance discovery but cannot be the only entry point. Touch and keyboard users receive visible controls for navigation, disclosure, menus, and recovery.

## Interaction states

- Loading: initial loading replaces unavailable content with a named loading state; it does not fabricate zero values.
- Empty: explain whether there is no data, no result for the active filters, or no configured resource, and provide an appropriate next step.
- Error: identify the affected surface and preserve unaffected or last-good content; expose retry or recovery only when the product can perform it.
- Success: confirm the actual applied or verified outcome, not merely transport acceptance. Important outcomes remain inspectable after a toast disappears.
- Disabled: state why an action is unavailable and what prerequisite can make it available; do not rely on reduced opacity alone.
- Offline/slow network: distinguish refreshing, stale, offline, timed out, and partially available states. Keep freshness and last-updated evidence adjacent to the data it qualifies.

## Content voice

- Tone: concise, factual, calm, and action-oriented. Prefer operational nouns and verbs over marketing language.
- Terminology: distinguish request, sent, accepted, applied, confirmed, failed, timed out, stale, offline, and restricted. Do not call an ACK or HTTP success “completed” unless the domain outcome is confirmed.
- Microcopy rules: name the affected entity and scope, state the reason, then give the next safe action. Use consistent units and timestamps, and avoid unexplained abbreviations.

## Implementation constraints

- Framework/styling system: React components, CSS custom-property tokens, generated ESM/CJS/type artifacts, and Storybook as the public decision surface.
- Design-token constraints: reuse existing semantic and component tokens. A new Operations Dashboard token requires repeated cross-product need, an owner, light/dark values, and a documented fallback; local screen values are not promoted automatically.
- Performance constraints: avoid screen-sized component state machines and unnecessary animated data churn; virtualization, polling, streaming, and renderer lifecycle remain product or specialist-package concerns.
- Compatibility constraints: preserve the current `DashboardShell` and `DashboardGrid` names, props, exports, CSS classes, and story IDs during taxonomy reorganization.
- Persistence constraint: SideNav exposes controlled and uncontrolled collapse state but does not read or write browser storage; product applications own per-user persistence.
- Test/screenshot expectations: validate source contracts, public exports, Storybook IA, accessibility, normal/dark/narrow stories, visual regression, types, and generated artifacts before release.

## Open questions

- [ ] Decide whether hierarchical narrow navigation is a focus-managed temporary drawer or whether v1 supports `BottomNav` only for four or fewer flat destinations; owner: product design + component owner; impact: WF-16 verification and mobile continuity.
- [ ] Keep account actions out of primary `BottomNav` unless product evidence proves they are a top-level destination; owner: product design; impact: mobile identity and utility ownership.
- [ ] Validate whether any product should default to an all-dark operations shell; owner: product design; impact: theme defaults and visual-regression coverage.
- [ ] Validate the inferred supervisor, operator, and responder personas with product owners; owner: product design; impact: priority and measurable success criteria.
- [ ] Decide whether repeated consumer evidence justifies a documented compact-density token set; owner: design-system owner; impact: spacing and table/toolbar consistency.
- [ ] Identify the second non-robotics consumer before expanding Operations Dashboard into a general admin/analytics system; owner: product design; impact: scope and naming.
- [ ] Reassess a separate `@lk-robotics/lds-dashboard` package only if ownership and release cadence diverge from `lds-product`; owner: frontend platform; impact: package and migration cost.
