# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

## Unreleased

### Added

- `NavigationAnnotationLayer`: an SVG `<g>` provider that coordinates cross-entity label collisions across the six navigation overlays (`RouteOverlay`, `TrajectoryOverlay`, `LaneOverlay`, `WaypointMarker`, `SpatialRegion`, `FacilityTransition`). Colliding labels nudge vertically (≤56 CSS px by default, direction-constrained to preserve each overlay's row contracts) and, when no slot remains, only the lowest-priority label is hidden — markers, state badges, accessible names, true anchor `data-*` coordinates, and the semantic mirror never change. Priority is state-first (selected > focused > alarm > active) with paint-order kind weight as tie-break; layout is measured from real DOM rects via `getScreenCTM()` and is deterministic. Overlays rendered without the provider behave exactly as before.
- `variant="embedded"` on `ViewerFrame` (and its `Scene3DFrame` / `Map2DCanvas` / `VideoStreamTile` presets), `DataGrid`, and `DataToolbar`. When one of these surfaces is nested inside another surface — a `CanvasEditorShell` canvas slot, a `Card`, a wrapping collection `section`, or a `DockPanel` body — `embedded` drops the component's own border and radius so the parent owns one continuous perimeter. Viewport/grid chrome, normalized state, HUD/toolbar, and accessibility roles are unchanged; `DataToolbar` keeps only a bottom divider as a header bond. Default `standalone` is unchanged, so this is non-breaking. Extends the existing `variant="embedded"` convention (`Banner`, `FilterBar`, `ResourceState`) to container/frame surfaces.

### Fixed

- Cross-entity label overlaps on dense navigation maps: a route's progress label could cover a trajectory's label, and adjacent `FacilityTransition` markers could cover each other's label blocks. Both cases are now coordinated (and gated by story play assertions) when composed under `NavigationAnnotationLayer`.

### Changed

- Reworked the communication family around a general AI conversation hierarchy: assistant turns use a borderless document presentation while participant turns read at a glance—the user's own turns use a solid primary bubble (`primary-heavy`/`static-white`, AA in both themes) with a bubble-foot send time and `read` receipt, human-agent turns use a neutral fill bubble, and system events use a centered neutral pill chip (distinct from the blue role badge); `AI`/`상담원` role badges (overridable via `roleBadgeLabel`) name the speaker type, the feed stays chrome-free with a circular icon scroll-to-latest control that carries an unread-count badge (its history control stays a text action so its loading state reads clearly), and the composer exposes generic leading/trailing action slots.
- Added a `compact` presentation to `SourceDisclosure` that renders each source as a single-line, attachment-weight link chip—no card surface, inline disclosure, or availability badge—for contexts where every listed source is expected to be usable, such as citations under a chat answer; the conversation examples cite sources with it and surface message quick-actions as icon-only controls.
- Reworked `EquipmentStatusCard` as a semantic equipment identity, visible status, and labeled-facts card derived from LDS and authoritative status/summary-list references rather than a product-specific ledger row.
- Clarified that pinned product frontends are authoritative only for component/workflow coverage, states, density, and ownership seams—not LDS anatomy, styling, tokens, or public API design.
- Added a canonical `ConnectionBadge connectionState` transport axis and a machine-readable robotics semantic registry that keeps connectivity, freshness, health, operability, authority, command, evidence, review, and urgency independent.

### Migration

- Replace `ConversationMessage variant="soft|solid"` with `presentation="document|bubble"`; omit it for the role defaults. Replace `sourcePresentation` and source arrays with an explicit `SourceDisclosure` (or other provenance node) passed to the `sources` slot. Move response cancellation to `MessageComposer onStop`.
- Replace `MessageComposer attachmentAction`/`secondaryActions` with `leadingActions`/`trailingActions`.
- Replace `EquipmentStatusCard ringLabel`, `ringCaption`, `tone`, `direction`, `connection`, and `chips` with `status`, `statusTone`, and labeled `details`; compose direction or connection indicators inside detail values.
- Use `ConnectionBadge connectionState="unknown|connecting|connected|degraded|reconnecting|disconnected|failed"` in new code. The legacy `status` prop remains compatible; represent `stale` as freshness evidence outside the badge.
- Nesting a Viewer preset (`Scene3DFrame`, `Map2DCanvas`, `VideoStreamTile`) inside a `CanvasEditorShell` or `Card`: pass `variant="embedded"` instead of insetting the viewport or overriding `border`/`borderRadius` through `style`. For the `DataToolbar` + `DataGrid` + `Pagination` collection pattern, pass `variant="embedded"` on the toolbar and grid instead of stripping each part's perimeter with inline `border:0`/`borderRadius:0`.

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
