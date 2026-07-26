# Handoff — Storybook taxonomy cleanup

Date: 2026-07-11

Repository: `LK Design System`

Branch at handoff: `main`

HEAD at handoff: `3ead26d`

Implementation status: **not started; this document is the execution handoff**

## Objective

Reorganize the complete public Storybook taxonomy so that it works as a
component-first catalogue, preserves the LDS layer boundaries, and avoids
duplicate or ambiguous component homes.

The four provenance layers remain:

- `LDS Core`: WDS-derived foundations and generic component contracts.
- `LDS Theme`: LK ROBOTICS identity and visual overrides over Core.
- `LDS Product`: reusable product extensions outside direct WDS coverage.
- `LDS Robotics`: robotics, control, viewer, telemetry, and editor extensions.

This task is not complete after renaming a few sidebar labels. It includes the
Storybook sort tree, title ownership, duplicate story consolidation, layer
purity, classification evidence, public story names, and final runtime
inspection.

## Completion definition

All of the following must be true before this work is called complete:

1. Every public component has one clear public home. A composed pattern may
   own multiple components only when the composition itself is the reusable
   contract and the individual components remain independently findable.
2. No self-repeating paths remain, especially `LDS Robotics/Robotics/*` and
   `LDS Theme/Theme/*`.
3. `.storybook/preview.jsx` explicitly orders every real public group and does
   not retain dead groups.
4. Story titles, `LAYER_CLASSIFICATION.json`, and
   `PUBLIC_EXPORT_CLASSIFICATION.json` agree with the implemented ownership.
5. Core stories do not present Product, Theme, or Robotics extensions as Core.
6. Product implementations do not depend on Robotics implementations.
7. Public sidebar names describe user-facing components or states. Test terms
   such as `contract`, `guard`, `callback`, `fallback`, and `roving focus` stay
   in play functions or docs descriptions, not public labels.
8. Hidden visual-parity stories remain tagged with both `!dev` and
   `visual-parity`, have one owner, and remain hidden.
9. Audit, coverage, planning, and taxonomy explanation pages remain in `docs/`
   rather than becoming Storybook stories.
10. Targeted checks and one final full verification pass succeed, and the
    rendered sidebar is inspected directly.

## Verified starting snapshot

The runtime `index.json` snapshot contained:

| Measure | Count |
| --- | ---: |
| Story titles / story files | 129 |
| Total stories | 382 |
| Public stories | 289 |
| Hidden stories | 93 |
| Hidden visual-parity stories | 82 |

At handoff, these checks passed:

- `npm run check:wds-alignment`: 129 classified titles.
- `npm run check:story-subjects`: 117 named subject homes and 82 unique parity subjects.
- `npm run check:storybook-public`: 289 public, 93 hidden, 82 hidden visual-parity stories.

Those passes do **not** prove that the taxonomy is good. The current guards do
not detect semantic misclassification, repeated path segments, missing
`storySort` child groups, or an overly broad catch-all folder.

## Worktree and concurrency warning

The repository is heavily dirty and other agents may still be working in the
same directory. At this snapshot there were 108 tracked modifications and 43
untracked files. Treat every existing or newly appearing change as another
contributor's work.

Mandatory handling:

- Run `git status --short` before starting and again before every handoff.
- Re-read each target file immediately before patching it.
- Do not reset, revert, mass-format, clean, or overwrite the worktree.
- Do not regenerate `dist/`, `src/index.*`, inventories, or broad audit files
  merely to make unrelated diffs disappear.
- Manually merge overlapping story changes. Do not replace a modified story
  file with an older snapshot from this document.
- Keep taxonomy edits narrow until concurrent implementation work settles.

Highest-conflict files at this snapshot:

- `docs/references/wds/LAYER_CLASSIFICATION.json` is already modified.
- `stories/NavigationAdaptive.stories.jsx` is untracked, while
  `NavigationFull.stories.jsx` and `NavigationFull.shared.jsx` are modified.
- `DataAndStatus`, `DataDisplay`, `DataLineChart`, and `DataToolbar` stories are
  modified.
- `DataChartFrame`, `DataFilterBar`, `DataOperations`, `DataResourceState`, and
  `DataViewPreferences` stories are untracked.
- `.storybook/preview.jsx` was clean and still omitted the existing Robotics
  `Control` group.

## Taxonomy principles to apply

1. Use the component or reusable pattern as the leaf, not the implementation
   task, product screen, test name, or a generic word such as `Overview`.
2. A title answers both “where does this contract belong?” and “what should a
   consumer search for?”.
3. Preserve WDS Core taxonomy where the accepted local `.fig` or mapped WDS
   evidence confirms it. Do not relocate a WDS component based only on generic
   dashboard conventions.
4. Product and Robotics folders describe reusable extension ownership, not
   visual styling.
5. Theme contains only actual LK identity or visual-override surfaces. Third
   party platform marks and generic theme persistence behavior are not
   automatically LK brand assets.
6. Split a combined page when its components can be consumed independently and
   otherwise lose their own discoverable home. Keep a combined page when the
   composition itself is the contract, such as adaptive `NavRail + BottomNav`.
7. Do not change component UI, tokens, or public API merely to make a story
   title cleaner. The one required implementation exception is removing a
   confirmed cross-layer dependency while preserving behavior and API.

## Target sidebar structure

Use this as the target order in `.storybook/preview.jsx`:

```text
LDS Core
  Foundation
    Aspect Ratio
    Color
    Typography
    Spacing
    Effects and Interaction
    Iconography
  Components
    Layout
    Action
    Selection and Input
    Content
    Navigation
    Status
    Feedback
    Overlay

LDS Theme
  Brand
  Controls
  Status

LDS Product
  Action
  Content
  Data
    Display
    Visualization
    Collections
    Operations
  Feedback
  Layout
  Navigation
  Overlay
  Selection and Input

LDS Robotics
  Assets
  Control
  Status
  Data
  Editor
  Viewer
```

If WDS evidence requires a Core family to retain a different name, record that
evidence and adapt only that Core branch. Do not use that exception to keep
Product or Robotics catch-all folders.

## P0 — fix layer purity and broken hierarchy

### Robotics catch-all removal

| Story file | Current title | Target title |
| --- | --- | --- |
| `stories/RoboticsAndViz.stories.jsx` | `LDS Robotics/Robotics/Robot State` | `LDS Robotics/Status/Robot State` |
| `stories/RoboticsBatteryGauge.stories.jsx` | `LDS Robotics/Robotics/Battery Gauge` | `LDS Robotics/Status/Battery Gauge` |
| `stories/RoboticsConnectionBadge.stories.jsx` | `LDS Robotics/Robotics/Connection Badge` | `LDS Robotics/Status/Connection Badge` |
| `stories/RoboticsEquipment.stories.jsx` | `LDS Robotics/Robotics/Equipment State` | `LDS Robotics/Status/Equipment State` |
| `stories/RoboticsDirectionalPad.stories.jsx` | `LDS Robotics/Robotics/Directional Pad` | `LDS Robotics/Control/Directional Pad` |
| `stories/RoboticsJoystick.stories.jsx` | `LDS Robotics/Robotics/Joystick` | `LDS Robotics/Control/Joystick` |
| `stories/RoboticsTopicTree.stories.jsx` | `LDS Robotics/Robotics/Topic Tree` | `LDS Robotics/Data/Topic Tree` |
| `stories/RoboticsManualControlSession.stories.jsx` | `LDS Robotics/Control/Manual Control Session` | keep |

Also:

- Change `LDS Robotics/Viewer/Frame` to
  `LDS Robotics/Viewer/Shared Viewer Frame`.
- Change `LDS Robotics/Viewer/3D Frame` to
  `LDS Robotics/Viewer/3D Scene`.
- Create a dedicated `LDS Robotics/Viewer/Floor Selector` story and move
  `FloorSelector` from the Product Navigation export group to the Robotics
  Viewer group. Its prompt describes a map/floor viewer control.
- Extract `RoboticsExtensionIcons` from the Core Iconography page into
  `LDS Robotics/Assets/Icons`. Keep the shared `Icon` implementation and
  registry public API unchanged.
- Remove the obsolete `Robotics` child from `storySort`; add `Assets`,
  `Control`, `Status`, `Data`, `Editor`, and `Viewer` explicitly.

### Confirmed layer leaks

1. `components/content/LogViewer.jsx` is a Product component but imports
   `components/robotics/ConnectionBadge.jsx`. Remove that dependency while
   preserving the LogViewer API and visible status information. Use a generic
   Core/Product status primitive or an existing presentational slot; do not
   reclassify LogViewer as Robotics merely to hide the dependency inversion.
2. `stories/ContentCarousel.stories.jsx` exposes Product export `Carousel` as
   Core. Move its title to `LDS Product/Data/Carousel`.
3. `stories/FormSelectionControls.stories.jsx` is Core but directly presents
   Product export `ColorSwatch`. Extract that example into a dedicated
   `LDS Product/Selection and Input/Color Swatch` story.
4. `stories/BrandPlatform.stories.jsx` contains third-party platform marks,
   not the LK ROBOTICS identity override. Move it to
   `LDS Product/Content/Platform Marks` and split `BrandLogo` /
   `BRAND_LOGO_NAMES` out of the Theme export group. Keep `Lockup` and the LK
   logo story under `LDS Theme/Brand`.
5. `stories/StatusLoading.stories.jsx` mixes the Theme-only
   `Spinner variant="brand"` with Core loading primitives. Keep generic Spinner
   and Skeleton states in Core and move the brand treatment to
   `LDS Theme/Status/Brand Spinner`.
6. `stories/ContentBadgesAnnotations.stories.jsx` mixes `ContentBadge` and
   `StatusBadge`. Keep `ContentBadge` at
   `LDS Core/Components/Content/Content Badge` and give `StatusBadge` a public
   home at `LDS Core/Components/Status/Status Badge`.

Update `PUBLIC_EXPORT_CLASSIFICATION.json` whenever these decisions change an
export's layer or its `storyEvidence`. Updating the story title alone is not
enough.

## P1 — normalize Product and Theme taxonomy

### Product Data

Product Data is already the largest user-facing branch and becomes less
searchable when every concept is a flat sibling. Use these subgroups and split
combined homes where indicated:

| Current title / file | Target ownership |
| --- | --- |
| `Data/Dashboard Metrics` — `DataAndStatus.stories.jsx` | `Data/Display/Metric Card` |
| `Data/Description List` | `Data/Display/Description List` |
| `Data/Resource State` | `Data/Display/Resource State` |
| `Data/Annotated Image` | `Data/Visualization/Annotated Image` |
| `Data/Chart Frame` | `Data/Visualization/Chart Frame` |
| `Data/Charts` — `DataDisplay.stories.jsx` | split into `Data/Visualization/Bar Chart`, `Donut Chart`, and `Sparkline` |
| `Data/Line Chart` | `Data/Visualization/Line Chart` |
| `Data/Legend` | `Data/Visualization/Legend` |
| `Data/File Browser` | `Data/Collections/File Browser` |
| `Data/Table` — `DataTablesHierarchy.stories.jsx` | split into `Data/Collections/Data Grid` and `Data/Collections/Table`; assign each story to its actual rendered subject |
| `Data/Tree` | `Data/Collections/Tree` |
| `Data/Filter Bar` | `Data/Operations/Filter Bar` |
| `Data/Toolbar and Filters` | `Data/Operations/Data Toolbar`; Filter Bar keeps its own home |
| `Data/Refresh and Export` | split into `Data/Operations/Refresh Control` and `Data/Operations/Export Action` |
| `Data/Data View Preferences` | split into `Data/Operations/Saved View` and `Data/Operations/Visibility Manager` |

Move input contracts out of Data:

- `LDS Product/Data/Calendar` →
  `LDS Product/Selection and Input/Calendar`.
- `LDS Product/Data/Tree Picker` →
  `LDS Product/Selection and Input/Tree Picker`.

After renaming `Dashboard Metrics`, update or remove the old hard-coded
`Dashboard Metrics` / `Stats` assumptions in
`scripts/check-storybook-public-surface.mjs`. This is maintenance of the
existing guard, not permission to expand the guard's scope.

### Product Navigation

1. Consolidate `LDS Product/Navigation/Compact Navigation` into
   `LDS Product/Navigation/Adaptive Navigation`. Both currently own the same
   `NavRail + BottomNav` destination contract.
2. Preserve native-link, router-renderer, disabled, long-label, desktop rail,
   mobile bottom navigation, and hidden parity coverage in the single home.
3. Extract `Anchor` from the old combined navigation story into
   `LDS Product/Navigation/Anchor` if it would otherwise lose its public home.
4. Delete the obsolete public `Compact Navigation` title and its duplicate
   ownership, not merely hide it.
5. Split `Steps and Wizard` into `Steps` and `Wizard` public homes unless the
   accepted source evidence proves they are a single component contract.

### Product Layout and Overlay

- Split `Dashboard Shell and Grid` into `Dashboard Shell` and `Dashboard Grid`.
  Assign shell/navigation stories to the former and card-flow/grid stories to
  the latter.
- Split `Drawer and Sheet` into independent `Drawer` and `Sheet` homes while
  retaining their shared focus-contract evidence in one documented owner.
- Rename `LDS Core/Components/Overlay/Confirm Alert` to
  `LDS Core/Components/Overlay/Alert`. It is the `Alert` component and must not
  appear to be a second confirmation-dialog implementation.

### Theme

- Change `LDS Theme/Theme/Theme Toggle` to
  `LDS Theme/Controls/Theme Toggle`.
- Keep Theme limited to LK identity and actual visual overrides after moving
  Platform Marks out and splitting Brand Spinner from Core.
- Do not rename the public `ThemeToggle` API in this taxonomy task.

## P2 — component-home and public-label cleanup

### Unambiguous title changes

| Current | Target |
| --- | --- |
| `LDS Core/Foundation/Basic` | `LDS Core/Foundation/Aspect Ratio` |
| `LDS Core/Foundation/Decorate` | `LDS Core/Foundation/Effects and Interaction` |
| `LDS Core/Foundation/Icon` | `LDS Core/Foundation/Iconography` |
| `LDS Core/Components/Action/Action Overview` | `LDS Core/Components/Action/Action Area` |
| `LDS Product/Data/Dashboard Metrics` | `LDS Product/Data/Display/Metric Card` |
| `LDS Product/Data/Toolbar and Filters` | `LDS Product/Data/Operations/Data Toolbar` |
| `LDS Robotics/Viewer/Frame` | `LDS Robotics/Viewer/Shared Viewer Frame` |
| `LDS Robotics/Viewer/3D Frame` | `LDS Robotics/Viewer/3D Scene` |

`ActionTaxonomy` in `stories/ActionArea.stories.jsx` is a catalogue of other
components rather than an ActionArea state. Move its durable WDS taxonomy
content into the nearest existing WDS reference document and remove the public
Storybook story. Update references to
`stories/ActionArea.stories.jsx#ActionTaxonomy` in at least:

- `docs/references/wds/COMPONENT_SOURCE_PDFS.json`
- `docs/references/wds/VARIANT_AUDIT_CHECKLIST.json`
- any other result returned by `rg -n "ActionTaxonomy" docs scripts stories`

Keep `BottomActionArea` and `ActionAreaStates` in the Action Area home.

### Combined Core pages requiring source-backed resolution

These pages hide independent component names. Inspect the accepted local WDS
component-set definitions and existing prompt/story evidence before splitting
them. If the source defines separate component contracts, create separate
component homes; if it defines a single family contract, retain the family and
record that evidence in the story description.

- `Action Controls`: `ButtonGroup`, `SplitButton`, `IconButton`, `TextButton`,
  `Fab`, and `ToggleIcon` must remain independently findable.
- `Page Indicator and Pagination`.
- `Tabs and Category`.
- `Slider and Range`.
- `Search and Autocomplete`.
- `Essential and Divider`.
- `Scroll and Accessibility`.
- `Advanced Inputs`: `NumberField` and `PinInput` are Product extensions and
  normally warrant separate homes.
- `Date and Time`: `DatePicker` and `TimePicker` normally warrant separate
  homes.

Do not perform a mechanical split that duplicates visual-parity subjects or
turns a composed interaction contract into several incomplete pages.

### Feedback / Status decision gate

The current locations are semantically surprising:

- `Feedback/Avatar`
- `Feedback/Badges and Tags`
- `Feedback/Notifications`
- `Status/Notices and Callouts`

Before moving Core components, inspect the accepted WDS source evidence. If WDS
explicitly owns these under Feedback, retain the Core family name and improve
the leaf labels only. If it does not, use the following semantic homes:

- Avatar / AvatarGroup → `Content/Avatar` or an evidence-backed Identity group.
- Badge / PushBadge / Tag → `Status/Badges and Tags`.
- Notification → `Status/Notification`.

Record the decision and source; do not move them from intuition alone.

### Public story display names

Change consumer-visible names while keeping test details in the code:

| File | Current public name | Target public name |
| --- | --- | --- |
| `stories/ViewerToolbar.stories.jsx` | `Roving focus · Toggle contract` | `키보드 탐색과 토글` |
| `stories/DataTablesHierarchy.stories.jsx` | `선택 불가 행 · custom control guard` | `선택할 수 없는 행과 행 내부 조작` |
| `stories/DataViewPreferences.stories.jsx` | `빈 보기 · callback 없는 읽기 전용 관리` | `빈 보기와 읽기 전용 상태` |
| `stories/LayoutDashboardShell.stories.jsx` | `auto · 좁은 탐색 생략 시 안전한 fallback` | `자동 레이아웃의 좁은 화면 대체 탐색` |

Run the same audit over every public display name and remove comparable test
implementation language.

## Files that must stay synchronized

For every title edit:

1. Edit the story file's `meta.title`.
2. Make the identical change in
   `docs/references/wds/LAYER_CLASSIFICATION.json`.
3. If a story file is split, merged, added, deleted, or changes layer, update
   all affected `storyEvidence` arrays in
   `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`.
4. Search WDS evidence JSON/Markdown and scripts for the old title, file, story
   export, or story ID.
   This includes component prompts that name the old Storybook home, especially
   `components/data/SavedViewControl.prompt.md` and
   `components/data/VisibilityManager.prompt.md` after splitting Data View
   Preferences.
5. Update `.storybook/preview.jsx` after the final branch structure is known.
6. Build Storybook before running checks that consume
   `storybook-static/index.json`.

Do not modify generated runtime entry points merely because story files moved;
public component exports are not being renamed in this task.

## Recommended execution order

1. Re-read `AGENTS.md`, status, all target stories, and both classification
   JSON files.
2. Fix the Robotics hierarchy and `storySort` first; this is the least
   ambiguous structural correction.
3. Fix the confirmed layer leaks: LogViewer dependency, Carousel, ColorSwatch,
   Platform Marks, Brand Spinner, robotics icons, and FloorSelector.
4. Reorganize Product Data in one batch so partial intermediate titles do not
   linger.
5. Consolidate Navigation and split the confirmed Layout/Overlay homes.
6. Apply foundation and public-label renames.
7. Resolve the source-gated Core and Feedback decisions.
8. Synchronize every classification/evidence reference and search for stale
   titles.
9. Run targeted checks, inspect the runtime sidebar, then run the final suite
   once.

## Verification cadence

Use focused checks while editing. Do not rerun the full repository suite after
each title change.

After each coherent batch:

```powershell
npm run check:wds-alignment
npm run check:story-subjects
```

If LogViewer implementation changes, also run the smallest relevant type and
contract checks:

```powershell
npm run check:types
npm run check:contracts
```

At the final Storybook checkpoint:

```powershell
npm run build:storybook
npm run check:inventory
npm run check:storybook-public
npm run check:a11y
```

Then run the full suite exactly once, after the taxonomy and concurrent work
are stable:

```powershell
npm run check
```

Inspect the rendered sidebar and representative pages directly. At minimum:

- expand all four top-level layers;
- verify `Control`, `Status`, and `Data` ordering under Robotics;
- verify the Product Data subgroups and component-first leaf names;
- search for `Frame`, `Calendar`, `Tree Picker`, `Alert`, `Metric Card`, and
  `Theme Toggle` and confirm a single intended result;
- confirm Adaptive Navigation contains the retained Compact coverage;
- confirm hidden parity stories remain absent from the public sidebar.

## Stale-title search

Before declaring completion, this search should return no unintended public
taxonomy references:

```powershell
rg -n "LDS Robotics/Robotics|LDS Theme/Theme|Compact Navigation|Dashboard Metrics|Toolbar and Filters|Confirm Alert|LDS Core/Foundation/Basic|LDS Core/Foundation/Decorate|LDS Robotics/Viewer/Frame|LDS Robotics/Viewer/3D Frame|LDS Product/Data/Calendar|LDS Product/Data/Tree Picker" .storybook stories docs scripts
```

Review every result rather than deleting historical evidence blindly.

## Completion checklist

- [ ] Current status and concurrent edits re-audited.
- [ ] `storySort` matches the final real hierarchy.
- [ ] `Robotics/Robotics` removed and Robotics ownership split.
- [ ] Viewer Frame names clarified and FloorSelector given a Robotics home.
- [ ] Product-to-Robotics LogViewer dependency removed.
- [ ] Carousel, ColorSwatch, Platform Marks, Brand Spinner, and robotics icons
      moved to truthful layers.
- [ ] Product Data grouped into Display, Visualization, Collections, and
      Operations.
- [ ] Calendar and Tree Picker moved to Selection and Input.
- [ ] Compact Navigation consolidated into Adaptive Navigation.
- [ ] Dashboard Shell/Grid and Drawer/Sheet ownership resolved.
- [ ] Foundation and ambiguous component titles renamed.
- [ ] Action taxonomy catalogue removed from Storybook and evidence updated.
- [ ] Source-gated Core/Feedback decisions completed and documented.
- [ ] Public test-language labels rewritten for consumers.
- [ ] `LAYER_CLASSIFICATION.json` synchronized one-to-one with story titles.
- [ ] `PUBLIC_EXPORT_CLASSIFICATION.json` synchronized with story ownership.
- [ ] Hidden parity ownership/tags preserved.
- [ ] Stale-title search reviewed.
- [ ] Targeted checks passed.
- [ ] Runtime sidebar and representative stories inspected.
- [ ] One final `npm run check` passed or every unrelated concurrent failure
      was isolated and reported with evidence.

## Explicit non-goals

- Do not redesign component visuals during taxonomy cleanup.
- Do not change shared tokens or brand colors.
- Do not rename public component APIs.
- Do not add audit or planning stories.
- Do not introduce application screens, dashboard templates, or workflows.
- Do not use this task as permission to clean unrelated dirty files.
