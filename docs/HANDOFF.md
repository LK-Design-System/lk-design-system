# LK Design System Handoff

Date: 2026-07-07
Branch: `main`
Remote: `origin` (`https://github.com/LK-ROBOTICS/lk-design-system-core.git`)
Working area: `lk-design-system-core`

## Current Direction

This repository is the LK ROBOTICS Design System Core. The intended relationship to Wanted Design System Community (WDS) is:

- LDS should follow WDS structure, component taxonomy, interaction model, and primitive behavior.
- LDS may replace WDS colors with LK ROBOTICS brand tokens.
- Domain-specific robotics/product examples should demonstrate components, but should not become the design system's source of truth.
- Full WDS parity must not be claimed until Figma node-level checks are complete or explicit LK theme overrides are documented.

The current Storybook is running around the WDS/LDS audit and component expansion work. The in-app browser may already be open at `http://127.0.0.1:6006`.

## Major Work Completed In This Pass

### WDS relationship and audit model

- Added visible WDS/LDS relationship documentation in `readme.md` and audit stories.
- Added WDS alignment data under `docs/references/wds/`.
- Added machine-readable coverage files:
  - `COVERAGE_AUDIT.json`
  - `FOUNDATION_AUDIT.json`
  - `TOKEN_MAP.json`
  - `COVERAGE_DETAIL_AUDIT.json`
  - `VARIANT_AUDIT_CHECKLIST.json`
  - `PUBLIC_EXPORT_CLASSIFICATION.json`
  - `FIGMA_NODE_AUDIT_QUEUE.json`
  - `COVERAGE_COMPLETION_GATE.json`
- Added `scripts/check-wds-alignment.mjs` to validate these references together.

### Figma/PDF source evidence

Local WDS PDF exports from Figma are preserved in:

- `docs/references/wds/source-pdfs/1basic.pdf`
- `docs/references/wds/source-pdfs/2spacing.pdf`
- `docs/references/wds/source-pdfs/3decorate.pdf`
- `docs/references/wds/source-pdfs/1layout.pdf`
- `docs/references/wds/source-pdfs/2action.pdf`

Mapped evidence files:

- `docs/references/wds/FOUNDATION_SOURCE_PDFS.json`
- `docs/references/wds/COMPONENT_SOURCE_PDFS.json`

Important constraint: the local PDF evidence is useful, but it is not a complete replacement for direct WDS Figma node checks.

### Icon adoption

- Imported the local icon export folder into `assets/icons/`.
- Added/generated the icon registry and public icon surface.
- `scripts/generate-icons.mjs` is present.
- `components/icon/Icon.jsx` and related type/prompt files now use the LDS icon registry instead of ad hoc hand-drawn SVGs.

### Component additions and corrections

New or significantly updated primitives include:

- `components/buttons/ActionArea.jsx`
- `components/buttons/ToggleIcon.jsx`
- `components/content/ContentEditor.jsx`
- `components/content/Divider.jsx`
- `components/data/DataToolbar.jsx`
- `components/layout/MobileSystemBars.jsx`
- `components/layout/PageHeader.jsx`
- `components/overlay/ConfirmDialog.jsx`
- `components/viz/TelemetryValue.jsx`

Notable design corrections:

- Viewer/editor toolbar icons should use the icon registry, not newly invented SVGs.
- Editor action cluster alignment was corrected toward a more conventional toolbar pattern.
- Navigation stories were split and SideNav behavior documented more carefully.
- Status/feedback pages were split so unrelated patterns do not sit on one mixed page.
- Viewer/telemetry pages were reorganized.
- Telemetry data should prefer table-like separation for comparable data. One column should hold one primary datum where possible; avoid packing value and timestamp into the same data column.
- Robotics workflow examples were moved toward product-extension/documentation status instead of being treated as core design-system output.

### Storybook reorganization

Many mixed Storybook pages were split into narrower stories. Important new story files include:

- `stories/WdsCoverageAudit.stories.jsx`
- `stories/FoundationBasic.stories.jsx`
- `stories/FoundationSpacing.stories.jsx`
- `stories/FoundationDecorate.stories.jsx`
- `stories/LayoutEssentials.stories.jsx`
- `stories/ActionArea.stories.jsx`
- `stories/ContentEditor.stories.jsx`
- `stories/DataToolbar.stories.jsx`
- `stories/LayoutPageHeader.stories.jsx`
- `stories/OverlayConfirmDialog.stories.jsx`
- `stories/ViewerTelemetry.stories.jsx`
- `stories/ViewerTelemetryValue.stories.jsx`

Shared story modules were added to keep public stories focused while preserving examples:

- `stories/*.shared.jsx`

## Current Verification Status

The following commands passed most recently:

```bash
node scripts/check-wds-alignment.mjs
node scripts/check-token-source.mjs
node scripts/check-visual-token-drift.mjs
node scripts/check-type-surface.mjs
pnpm exec tsc --noEmit
pnpm exec storybook build
```

Observed `check-wds-alignment` summary:

```text
Validated WDS alignment: 87 story titles, 20 token map refs, 11 component-family mappings, 13 coverage rows, 13 foundation rows, 3 foundation PDF rows, 2 component PDF rows, 14 Figma node queue rows, 11 detail families, 157 public exports, 357 icons, 39 variant checks, completion gate not-ready.
```

Storybook static build passed. It still prints a Vite chunk-size warning around the large bundle/icon surface; this is currently a warning, not a failing gate.

## Build Notes

In this desktop environment, `npm` may not be available even though `pnpm` is. If `pnpm run build` fails because the script shells out to `npm run generate:entry`, use the equivalent direct build sequence:

```bash
node scripts/generate-entry.mjs
pnpm exec tsup
node scripts/copy-types.mjs
```

Generated files updated by this flow:

- `src/index.js`
- `src/index.d.ts`
- `dist/index.js`
- `dist/index.cjs`
- `dist/index.d.ts`
- source maps under `dist/`

## Remaining Risks And Next Work

### WDS parity is not complete

`docs/references/wds/COVERAGE_COMPLETION_GATE.json` intentionally remains:

```json
"claimStatus": "not-ready"
```

Reason:

- Figma MCP rate limits prevented complete node-level source reads.
- 13 node-level WDS reads remain pending in `FIGMA_NODE_AUDIT_QUEUE.json`.
- Local PDF exports cover some WDS foundations/components, but they do not prove total parity.

Next agent should prioritize:

1. Continue Figma node-level reads from `FIGMA_NODE_AUDIT_QUEUE.json`.
2. For each confirmed node, update the corresponding audit row and variant checklist.
3. Only move the completion gate toward ready when all node reads are closed or documented as LK-approved theme overrides.

### Check product-extension boundaries

Some stories are intentionally product/domain examples, not core WDS primitives. Keep this distinction sharp:

- Core WDS/LDS primitives belong in component/foundation sections.
- Robotics-specific flows, mission planning, and application-like pages should stay under product-extension, pattern documentation, or examples.
- Do not promote finished application screens into the design-system source of truth.

### Review component semantics

The user has repeatedly flagged cases where examples were visually invented rather than derived from WDS. Future edits should check:

- Is this component present in WDS?
- Is the story showing a primitive, a variant, or an application result?
- Are colors/tokens coming from LDS token overrides rather than local ad hoc values?
- Does a data table separate values into clear columns?
- Are icons from the LDS registry?

## Useful Commands

Run focused gates:

```bash
node scripts/check-wds-alignment.mjs
node scripts/check-token-source.mjs
node scripts/check-visual-token-drift.mjs
node scripts/check-type-surface.mjs
pnpm exec tsc --noEmit
pnpm exec storybook build
```

Run Storybook locally:

```bash
pnpm exec storybook dev -p 6006 --host 127.0.0.1 --no-open
```

If the generated entrypoints drift:

```bash
node scripts/generate-entry.mjs
pnpm exec tsup
node scripts/copy-types.mjs
```

## Files To Inspect First

For WDS coverage state:

- `docs/references/wds/COVERAGE_COMPLETION_GATE.json`
- `docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json`
- `docs/references/wds/COVERAGE_AUDIT.json`
- `docs/references/wds/COVERAGE_DETAIL_AUDIT.json`
- `docs/references/wds/VARIANT_AUDIT_CHECKLIST.json`
- `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`

For source evidence:

- `docs/references/wds/FOUNDATION_SOURCE_PDFS.json`
- `docs/references/wds/COMPONENT_SOURCE_PDFS.json`
- `docs/references/wds/source-pdfs/`

For generated/public API surface:

- `src/index.js`
- `src/index.d.ts`
- `dist/index.d.ts`
- `scripts/check-type-surface.mjs`

For Storybook organization:

- `stories/WdsCoverageAudit.stories.jsx`
- `stories/Audit.data.jsx`
- `stories/*shared.jsx`

## Handoff Summary

This handoff captures a large WDS alignment pass. The codebase now has broader component coverage, a clearer audit model, imported icon assets, PDF-backed WDS evidence, and several new validation gates. The most important open item is still direct WDS Figma node parity. Treat the current system as locally well-instrumented but not yet fully WDS-certified.
