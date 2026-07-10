# Handoff - LDS gap components + Canvas editor workflow reset

**Date:** 2026-07-10
**Branch:** `main`
**Push target:** `origin/main`
**Scope:** control/MLOps/web-viz gap components, DS-fit redesigns, editor primitives, and a source-first rebuild of the Canvas editor Storybook workflows.

---

## TL;DR

- Added and then design-reviewed the reusable components identified by the control/MLOps/web-viz gap analysis. Each public component has a JSX implementation, `.d.ts` contract, `.prompt.md` guidance, and Storybook coverage.
- Replaced the overly generic `TreeSelect` proposal with `TreeSelectionPanel`, which better represents a persistent hierarchical selection surface instead of a form select.
- Rebuilt `CanvasEditorShell` around shared structural slots, then split task authoring and map editing into separate workflow compositions based on the latest inspected `lk_web_viz` source.
- Removed Storybook-only `Step N` and workflow-review labels from product frames. Workflow states are separate stories; product headers contain only real document context and commands.
- Added a mandatory AGENTS rule requiring sibling-component, token, story, common-pattern, and layer-classification review before new components or major redesigns.

---

## Shipped components

| Family | Components | Main contract work |
| --- | --- | --- |
| Action | `SpeedDial` | explicit open state, labeled actions, keyboard/focus behavior, destructive action treatment |
| Content | `LogViewer`, `ReorderList` | operational filtering/search/follow controls; ordered-item movement with clear disabled states and accessible commands |
| Data | `FileBrowser`, `Legend`, `LineChart`, `TreeSelectionPanel` | reusable data browsing, chart/legend composition, and persistent hierarchical selection rather than app-specific screens |
| Forms | `PropertyField` | label/help/error ownership, typed editors, read-only/disabled/invalid states |
| Layout | `DockPanel` | docked/collapsed/resizable panel contract with editor-oriented keyboard and accessibility behavior |
| Robotics | `DirectionalPad` | pressed/disabled direction states and robotics-specific control semantics |
| Selection | `IconPicker`, `WheelPicker` | selection semantics, disabled options, keyboard support, and LDS-aligned visual hierarchy |
| Editor | `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar` | shared command, layer, object-inspection, and passive viewport status primitives |

Generated package entry points and `dist/` were rebuilt after the public surface changed. WDS reference classification and inventory files were updated to keep automated coverage gates aligned.

---

## Canvas editor reset

### Product evidence

The workflow audit used `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505`, especially:

- `frontend/src/screens/TaskCreateScreen.tsx`
- `frontend/src/screens/MapEditScreen.tsx`
- `frontend/src/components/editor/PcdMap3DPanel.tsx`
- `frontend/docs/TASK_DESIGN.md`
- `docs/images/task_edit.png`
- `docs/images/map_edit_randmarks.png`
- `docs/images/map_eit_pgm.png`

### Resulting structure

- `CanvasEditorShell` shares only structural relationships: document header, optional subheader, tool rail, optional layers, viewport, docked/drawer contextual panel, and passive status.
- Task authoring remains a task form/step workflow: a left form and step list with topology and floor-map target selection on the right.
- Map editing remains an objects/PGM workflow: header commands, mode tabs, left tool rail, center viewport, and persistent right properties panel.
- PCD 3D is a split assist panel inside map editing, not a separate crop/classification workspace.
- Document save and undo/redo live in the header. Draw completion/cancel stays local to the transient canvas task. Selection clearing and deletion stay in the inspector.
- Map editing does not receive a default `LayerPanel`; the original product workflow does not expose one there.

### Storybook workflow states

| Story | Story id |
| --- | --- |
| Shell capability | `lds-robotics-editor-canvas-shell--canvas-editor-shell-contract` |
| Task - details | `lds-robotics-editor-canvas-shell--task-details` |
| Task - target selection | `lds-robotics-editor-canvas-shell--task-targets` |
| Task - parameter editing | `lds-robotics-editor-canvas-shell--task-parameters` |
| Map - no selection | `lds-robotics-editor-canvas-shell--map-object-idle` |
| Map - polygon drawing | `lds-robotics-editor-canvas-shell--map-polygon-drawing` |
| Map - selected-object properties | `lds-robotics-editor-canvas-shell--map-object-selected` |
| Map - PCD 3D assist | `lds-robotics-editor-canvas-shell--map-pcd-assist` |
| Map - PGM pixel editing | `lds-robotics-editor-canvas-shell--map-pgm-editing` |

The audit rationale and source hierarchy are recorded in `docs/EDITOR_LAYOUT_AUDIT.md` and `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`.

---

## Key decisions

- `CanvasEditorShell` and its workspace compositions are **LK Robotics Extension** work, not WDS parity components. WDS remains the source for lower-level control styling and interaction conventions only.
- A Storybook story may name a workflow state, but that name must not be rendered as an in-product header or overlay.
- Different workspaces may compose the shell differently. Shared slots do not imply shared workflow, persistent panels, CTA placement, or layer ownership.
- Selected map-object properties are docked in the source workflow. Drawer support remains an optional shell capability for genuinely temporary context.
- Small muted text was raised to AA-safe semantic label tokens across touched editor/navigation surfaces.
- `.claude/` is ignored because it contains machine-local launch settings, nested worktrees, and dependency copies; it is not a repository deliverable.

---

## Validation completed

- `pnpm run build`
- `pnpm run check:fast` - all package, WDS alignment, generated-entry, type, token, parity, and consumer gates passed
- `pnpm run check:types`
- `pnpm run check:storybook`
  - Storybook static build passed
  - 263 total implementation stories
  - 171 public stories
  - 92 hidden stories, including 82 visual-parity stories
  - 0 missing story names, 0 implicit button types, 0 console errors in the structural guard
- `pnpm run check:type-surface` - 173 implementations, 173 type contracts, 177 named exports, 0 public `any` leaks
- `pnpm run check:contracts`
- `pnpm run check:consumer`
- `pnpm run check:tokens`
- `pnpm run check:publish-policy`
- `pnpm run check:visual-token-drift` - 0 undocumented hardcoded visual values
- `git diff --check`
- Manual Storybook axe scan across all 9 public Canvas editor states: 0 violations in every state
- Manual interaction checks: mode tabs, selection clearing, PCD split open/close, and toolbar Arrow/Home/End roving focus
- Final Storybook reload: product story rendered, 0 new runtime errors, 0 product-frame `Step N` metadata

---

## Known boundaries / follow-ups

- Storybook map, topology, PGM, and point-cloud graphics are representative DS fixtures. They do not replace the production renderer or backend-connected product implementation.
- Backend persistence, ROS data flow, map mutation, and task execution are outside this repository and still require application integration tests.
- PCD conversion/cleanup screens and site authoring are separate product workflows; they should receive their own source-first audits before being added to this shell family.
- Continue applying the new `AGENTS.md` fit-review rule before adding components. Similar visual shape alone is not enough reason to share a component contract.

---

## Local verification environment

`node` and `pnpm` may be absent from the default PATH in Codex desktop. Use:

```powershell
$env:PATH = "C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;$env:PATH"
pnpm run build
pnpm run check:fast
pnpm run check:storybook
```

The development Storybook used during review remains configured for `http://localhost:6006/` when started with the repository `storybook` script.
