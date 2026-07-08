# Handoff — Legacy layer removal + LDS Robotics design review

**Date:** 2026-07-08
**Branch:** `main` (all work below is pushed)
**Scope:** (1) removed the legacy static-card / `_ds_bundle.js` preview layer, (2) design-reviewed the whole **LDS Robotics** sidebar group and brought it onto the token system.

---

## TL;DR

- The Claude Design `@ds-bundle` + static-preview layer is **gone**; Storybook + the accepted local `.fig` snapshot are the only sources of truth. Re-importing this repo into Claude Design no longer restores old DS state.
- Every **LDS Robotics** component (robotics + viewer + editor) now uses **semantic / AA-contrast tokens** instead of raw `--bw-*` palette primitives, with consistent font-weight tokens, a shared viewer toolbar, a new `--font-mono` token, and corrected undo/redo/reset icons.
- All gates green (`check:fast`, `check:storybook`, `check:consumer`). No open regressions.

---

## Shipped (commits on `main`)

| Commit | What |
| --- | --- |
| `c463327` | **Remove legacy static-card + `_ds_bundle.js` preview layer** — deleted `_ds_bundle.js`, 93 `*.card.html`, `guidelines/` (20), `templates-cards/` (4), `templates/` starter scaffolds, and 6 card-only scripts. Rewired `package.json`, `.storybook/main.js`, gates, WDS audit JSON, and docs. |
| `219e7b4` | **Status colours → semantic + AA tokens** — marks (bars/dots/arcs/arrows) use `--color-positive/cautionary/danger`; text (battery %, telemetry values) uses AA variants `--color-cautionary-strong` / `--color-danger-text`. Completed `--color-danger-text` across all theme blocks. |
| `7a77f1f` | **Polish** — `--fw-*` weight tokens; unified sibling leading-tile fill; `Map2DCanvas` now composes `ViewerToolbar`/`ViewerToolbarButton`+`Icon`; new `--font-mono` token (fonts.css + source.json). |
| `905fae2` | **Story markup cleanup** — same token discipline applied to `stories/RoboticsAndViz.shared.jsx` (the component sweep only touched `components/`). |
| `ee105fa` | **HistoryToolbar icons** — undo/redo/reset were nav arrows + close-X; now `flip-backward` / mirrored / `reset`. |

---

## Key decisions & rationale

- **Marks vs text split.** `--color-positive/cautionary/danger` are defined as `var(--bw-green/amber/red)` in every theme, so remapping *marks* from raw `--bw-*` was a **zero-visual-change** cleanup. Only *text* changed appearance — intentionally, to reach WCAG-AA (`--bw-amber` ≈ 2.6:1 and `--bw-red` ≈ 3.3:1 on white both failed as text; the DS already shipped AA variants that weren't being used).
- **`--color-danger-text` made theme-complete.** It was light-only (`#AE4E4B`). Using it for text on cards that flip dark would have regressed dark mode, so `#E08A88` was added to the dark/auto/light-island blocks.
- **CanvasEditorShell / EditorShell is NOT a WDS component.** It is a **4th-layer LK Robotics Extension** — WDS has no canvas/mission-path editor, so there is no WDS parity source. Its frame + toolbars + badge are real DS components on theme tokens; the demo panel markup had drifted and was cleaned in `905fae2`.
- **Sibling card sizes left unequal on purpose.** RobotStatusCard's 48px avatar vs EquipmentStatusCard's 38px icon tile are role-appropriate; only the tile *fill* token was unified.
- **Redo icon is a mirrored `flip-backward`.** No `flip-forward` glyph ships; a mirrored undo is the standard redo affordance.

---

## Known gotchas / things to watch

- **The drift gate has a blind spot.** `scripts/check-visual-token-drift.mjs` only flags hardcoded **hex/rgb literals**, not raw `--bw-*` *token* misuse. That's why all of the above passed CI while being wrong. Everything here was caught by **manual review**, not the gate. See follow-ups.
- **node/pnpm are off PATH.** Prepend the codex runtime bins to run any build/gate (see "How to verify").
- **`check:generated` fails pre-commit whenever `dist/` is rebuilt** (it diffs `src dist`). That's expected — commit `dist` and it goes green. Story-only changes don't touch `dist`.
- Preview console shows Storybook manager `storyRenderPhaseChanged` noise — not a real error.

---

## Follow-ups (not done)

1. **Extend the drift gate** to flag raw `--bw-*` (and other primitive-layer tokens) used directly in `components/**` and `stories/**`, so semantic-layer violations are caught by CI instead of by eye. This is the highest-leverage follow-up.
2. **Sweep the other sidebar groups** (`LDS Core`, `LDS Theme`, `LDS Product`) for the same raw-`--bw-*` / raw-`fontWeight` drift. Known instance: the **forms** group (`Input`/`Select`/`Combobox`) uses `--bw-red` for the invalid-input ring — same class of issue, not addressed here.
3. **`--font-mono` adoption** — token now exists; `TopicTree`, `content/Code`, `SourceTag` use it. Audit for any other hardcoded mono stacks.
4. `--color-danger-strong` (`#FF4242`, safety-critical) is still light-only; dark-tune it if it ever lands on a dark surface.
5. Uppercase eyebrow labels in the robotics demos stay at `--label-assistive` (0.28) by intent — revisit if they read too faint.

---

## How to build & verify (env-specific)

`node` and `pnpm` are not on PATH. Prepend the codex runtime bins first:

```powershell
$env:PATH = "C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\MSI\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;$env:PATH"
pnpm run build
pnpm run check:fast        # tokens, parity, type-surface, token-drift, types, generated, consumer
pnpm run check:storybook   # build:storybook + inventory + tooltip-alignment + storybook-public + a11y
```

Package scripts call `node scripts/run-package-scripts.mjs ...` internally (not `npm run`), so `pnpm run <script>` is a drop-in. Storybook preview runs on **port 6016** (`.claude/launch.json`).
