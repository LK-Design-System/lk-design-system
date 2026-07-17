# Handoff — `variant="embedded"` for nested surfaces

**Date:** 2026-07-17
**Branch:** feature branch off `main`
**Scope:** Add a sanctioned way to nest a Viewer/DataGrid/DataToolbar surface inside another LDS surface without a double perimeter, and record the `lk_web_viz` (3D viewer) consumer migration.

---

## TL;DR

- A full audit of every LDS surface (56 container-scale radius files) confirmed the "double border when a surface is nested inside another surface" problem is **systemic but already triaged** three ways: **(A)** child renders borderless content, parent owns surface; **(B)** child exposes `variant="embedded"` to drop its own perimeter (`Banner`, `FilterBar`, `ResourceState`); **(C)** child is contractually outermost ("don't nest"). See the classification table below.
- The only surfaces with a **genuine nested use case and no A/B/C** were the **Viewer family** (`ViewerFrame` → `Scene3DFrame`/`Map2DCanvas`/`VideoStreamTile`) and, with an in-repo proof, **`DataGrid`** + **`DataToolbar`** (the collection story was stripping each perimeter with a forbidden inline `border:0`/`borderRadius:0`).
- Shipped `variant="embedded"` on those surfaces and de-hacked the DataGrid collection story. Non-breaking (`standalone` default unchanged).
- **Consumer payoff, not yet done (documented here):** `lk_web_viz` can drop its **4 px viewport-inset workaround** and use `<Scene3DFrame variant="embedded" />`.

---

## The contract

> `variant="embedded"` = the parent surface owns the outer border/radius/overflow; the component drops **only** its own perimeter (border + radius) and keeps all layout, normalized state, HUD/toolbar, and accessibility roles. `DataToolbar` embedded additionally keeps a bottom divider so it reads as a header inside the parent. Default `standalone` draws its own perimeter (unchanged).

Do **not** override `border`/`borderRadius` through `style` to fake this inside a parent surface — that raw override is explicitly discouraged (see `Banner.prompt.md`). Use the variant.

---

## Audit classification (why only these surfaces)

| Strategy | Meaning | Representative components |
| --- | --- | --- |
| **A — borderless content** | Renders no own perimeter; container owns the surface | `Tree`, `LogViewer`, `StepList`, `SourceDisclosure`, `PrimaryDetail`, `TopicTree`, `AnnotatedImage`, `EmptyState`, `Notification` |
| **B — `embedded` variant** | Drops own perimeter to bond with parent | `Banner`, `FilterBar`, `ResourceState` → **now also** `ViewerFrame` (+presets), `DataGrid`, `DataToolbar` |
| **C — outermost contract** | Always the outermost surface; nesting discouraged | `Card`, `MetricCard`, `NewsCard`, `ChartFrame`, `EquipmentStatusCard`, `RobotStatusCard`, `ContentEditor`, `ManualControlSession`, `CanvasEditorShell` |
| not-a-surface | Overlays, dropdowns, bars, controls | Lightbox, Dimmer, CommandPalette, NavRail, SideNav, Toolbar, ViewerToolbar, Select/Combobox, etc. |

### Deferred latent gaps (draw own perimeter, no A/B/C, but **no in-repo nested usage** in their stories)

`ValidationSummary`, `FileUploadQueue`, `ReorderList`, `FileBrowser`. Give each `variant="embedded"` only when a real nested composition appears — adding it speculatively would dilute the convention.

---

## Shipped in this change

- `ViewerFrame` (`.jsx`/`.d.ts`/`.prompt.md`) — `variant="embedded"` drops border+radius, adds `data-viewer-variant`.
- `Scene3DFrame` / `Map2DCanvas` / `VideoStreamTile` — thread `variant` explicitly to `ViewerFrame`; documented in each `.d.ts` and `.prompt.md`.
- `DataGrid`, `DataToolbar` (`.jsx`/`.d.ts`/`.prompt.md`) — `variant="embedded"`; DataToolbar keeps a bottom divider as a header bond.
- `stories/DataGrid.stories.jsx` — collection pattern rewritten from inline `border:0`/`borderRadius:0` to `variant="embedded"` (now hack-free; still one continuous perimeter owned by the wrapping `section`).

### Verification

- `check:fast` gates pass for this change (types, type-consumer, type-surface, **api-drift**, api-grammar, dimension-literals, prompt-contracts, story-coverage, contracts, docs, visual-token-drift, story-subjects, deprecations, publish-policy, **consumer smoke (real Vite prod build + render)**, avatar-duplicates, wds-local-fig).
- Headless render assertion against built `dist`: all six surfaces draw their perimeter in `standalone` and drop border **and** radius in `embedded` (DataToolbar retains its bottom divider). 6/6 pass.
- Pre-existing and unrelated: `check:wds-alignment` fails on `stories/RoboticsViewerNavigationViewer.stories.jsx` (a mock-data `title: '영역'` mis-parsed as the story meta title). That file is committed/clean and outside this change.

---

## Consumer migration — `lk_web_viz` (the 3D viewer, a.k.a. "LDS3D")

**Not yet applied.** The 3D viewer currently avoids the double perimeter by insetting its inner viewport ~4 px inside `CanvasEditorShell`, which keeps two concentric borders 4 px apart. With `variant="embedded"` it can become a single continuous perimeter with no inset.

Likely site (verify against current source — path from the 2026-07-10 audit): `frontend/src/components/editor/PcdMap3DPanel.tsx` (and any other place a Viewer preset sits in a `CanvasEditorShell` canvas slot or a `Card`).

Before (workaround):

```tsx
// inner viewport inset by ~4px so the two borders don't overlap
<Scene3DFrame style={{ inset: 4 /* or margin/padding inset */ }}>
  <Canvas />
</Scene3DFrame>
```

After:

```tsx
// parent shell owns the single outer perimeter; no inset, no style border override
<Scene3DFrame variant="embedded">
  <Canvas />
</Scene3DFrame>
```

Result: no canvas shrink (same as the inset), a true single outermost perimeter (the inset still showed two borders), and no forced border removal. Requires bumping the `@lk-robotics/design-system-core` dependency to a build that includes this change.

---

## Follow-ups

1. **Apply the `lk_web_viz` migration above** and remove the 4 px inset.
2. Add a dedicated Viewer **embedded demo story** (standalone/embedded × light/dark) once the branch is stable — deferred here to avoid entangling the `report:inventory` / `report:storybook-ia` regeneration with concurrent in-progress story work.
3. Revisit the four deferred candidates if/when they gain a real nested composition.
