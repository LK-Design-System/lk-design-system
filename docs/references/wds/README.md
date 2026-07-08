# WDS Reference

This folder stores Wanted Design System reference material used by the LK
ROBOTICS design system.

## Relationship

LDS, the LK Design System, uses WDS Community as the baseline for structure,
generic component families, token hierarchy, and documentation conventions.
LDS then applies LK ROBOTICS brand decisions and separates additional product or
robotics work into explicit extension layers.

The rule is:
- `WDS Core` is the inherited baseline.
- `LK Theme Override` is LK's visual identity applied over WDS.
- `LK Product Extension` is reusable LK product UI beyond direct WDS coverage.
- `LK Robotics Extension` is domain-specific robotics/viewer/editor UI.
- Evidence, governance, and audit material lives in `docs/`, not in
  Storybook.

When a design or component does not fit WDS Core, it must be classified as an
LK override or extension rather than silently changing the WDS baseline.

- `Wanted Design System (Community).fig`: original WDS Community Figma file
- `CONFLICT_AUDIT.md`: WDS vs LK conflict and extension audit based on the
  Figma connector and local `.fig` content extraction
- `FIGMA_LOCAL_CONTENT_AUDIT.json`: decoded local `.fig` source content,
  including text, section labels, variant-like symbol names, dimensions, and
  visual samples for queued WDS nodes
- `TOKEN_MAP.json`: machine-readable WDS variable to LK token/CSS mapping
- `LAYER_CLASSIFICATION.json`: Storybook layer and story title source of truth
- `VISUAL_TOKEN_EXCEPTIONS.json`: documented exceptions for provider-owned
  visual values that must not be tokenized
- `COVERAGE_AUDIT.json`: machine-readable WDS page/section coverage matrix
- `COVERAGE_COMPLETION_GATE.json`: machine-readable gate that states whether
  LDS can truthfully claim complete WDS coverage parity
- `COVERAGE_DETAIL_AUDIT.json`: WDS component-family to LDS component/story
  evidence matrix
- `COMPONENT_SOURCE_SCREENSHOTS.json`: user-provided Figma section screenshots
  mapped to LDS component/story evidence where PDF or node-level evidence is not
  yet complete
- `FOUNDATION_SOURCE_PDFS.json` and `COMPONENT_SOURCE_PDFS.json`:
  machine-readable mappings from local WDS PDF evidence to LDS layer decisions
- `FOUNDATION_AUDIT.json`: WDS theme and element foundations mapped to LDS
  token files, Storybook pages, and LK theme overrides
- `FIGMA_NODE_AUDIT_QUEUE.json`: exact WDS source nodes, closure criteria, and
  next Figma reads required before `partial` rows can become parity claims
- `PUBLIC_EXPORT_CLASSIFICATION.json`: every public LDS export classified as
  WDS core, theme override, product extension, or robotics extension
- `VARIANT_AUDIT_CHECKLIST.json`: family-level WDS variant/state/slot checks
  with Storybook evidence refs for the next Figma parity pass
- `COVERAGE_GAPS.md`: WDS concepts found in Figma that need LDS coverage or
  have recently been brought into LDS
- `STYLE_PARITY_AUDIT.md`: style-level (radius, padding, typography, state
  treatment) comparison of all 869 WDS variant symbols against LDS component
  implementations, with ranked drift findings and the LK override register
- `source-screenshots/`: user-provided Figma section screenshots used as
  interim visual evidence for component taxonomy and state matrices

## Source evidence policy

Local WDS PDF exports are evidence for visible structure, taxonomy, and state
coverage. The checked-in `.fig` export can be decoded for node-level source
content with:

```bash
npm run extract:wds-fig-content
```

The generated `FIGMA_LOCAL_CONTENT_AUDIT.json` records source text, section
labels, variant-like symbol names, dimensions, and visual samples.

On 2026-07-08 the checked-in `.fig` export was accepted as the authoritative
WDS source snapshot. Every Figma node queue row was closed by verifying its
closure criteria against the decoded local content and LDS sources, and
`COVERAGE_COMPLETION_GATE.json` moved to `ready`. The snapshot cannot attest
that the live Figma community file is unchanged upstream; if the upstream file
is updated, re-export it, re-run `npm run extract:wds-fig-content`, and
re-audit affected rows. Residual follow-up items from the closure pass are
listed in `COVERAGE_GAPS.md`.

Operating rules:

1. Preserve WDS Core as the inherited structure, component taxonomy, and token
   hierarchy.
2. Apply LK Theme Override only to visual identity values such as brand, color,
   typography, status tone, radius, and effects.
3. Keep reusable LK product UI outside direct WDS coverage under LK Product
   Extension.
4. Keep robotics, viewer, map, telemetry, and editor UI under LK Robotics
   Extension.
5. Treat PDFs as local evidence and keep detailed mappings in
   `FOUNDATION_SOURCE_PDFS.json` and `COMPONENT_SOURCE_PDFS.json`.

High-risk component mappings, especially Action controls, must map WDS axes to
existing LDS API names instead of replacing API names wholesale. For example,
WDS `disable` maps to React `disabled`; `active` maps to the role-appropriate
`selected`, `pressed`, or `active`; color axes map to semantic/LK theme tokens,
not raw WDS values.

Current applied PDF progress:

- `Button` and `TextButton` cover the WDS Action loading state with `loading`
  and `loadingLabel`.
- `IconButton` requires an accessible `label` in its public type contract.
- `Button`, `TextButton`, `IconButton`, and `Chip` public contracts document
  their WDS Action roles and LK theme-token boundary.
- `Chip` covers WDS Action size, variant, active, disabled, icon content, and
  thumbnail content axes with LDS props.
- Foundation spacing evidence now tracks `--mobile-bottom-bar-min-height` as
  `64px`, matching runtime spacing tokens.

## Visual style checks

WDS style review must include rendered Storybook screenshots, not only token or
type checks. Run:

```bash
npm run check:visual
```

The smoke capture writes to `visual-artifacts/smoke/` and includes WDS-facing
matrices for Action buttons, Textinput interactions, Control states, Segmented
Control resize modes, and Content card patterns. These captures are evidence
for local visual review only; they do not close live Figma parity items in
`COVERAGE_COMPLETION_GATE.json`.

Tooltip arrow alignment is also guarded by:

```bash
npm run check:tooltip-alignment
```

This renders the WDS Tooltip patterns from `storybook-static` and verifies that
vertical and horizontal arrow alignment examples match the WDS PDF behavior:
the arrow stays centered on the tooltip box edge while the tooltip box aligns
leading/center/trailing or top/center/bottom against the target.

## Avatar duplicate audit

Avatar duplication is managed through documentation and an automated guard, not
through a Storybook audit page.

| Area | Target | File | Decision |
| --- | --- | --- | --- |
| Component definition | Avatar | `components/feedback/Avatar.jsx` | Single definition |
| Component definition | AvatarGroup | `components/feedback/AvatarGroup.jsx` | Single definition |
| Public export | Avatar, AvatarGroup | `src/index.js`, `src/index.d.ts` | One export each |
| Storybook page | AvatarPatterns | `stories/Feedback.stories.jsx` | One design-system page |
| Hidden parity | AvatarCard, AvatarGroupCard | `stories/Feedback.shared.jsx` | Visual regression only, hidden from sidebar |
| Usage | UserMenu | `components/navigation/UserMenu.jsx` | Consumer only |

Run:

```bash
npm run check:avatar-duplicates
```

The guard blocks duplicate Avatar/AvatarGroup implementations, duplicate
public exports, duplicate Avatar Storybook titles, duplicate public export
classification rows, and unexpected Avatar source cards beyond the approved
legacy references.

Use this folder to:
- compare WDS tokens, components, and documentation conventions with LK
- track where LK color and brand overrides preserve or diverge from WDS
- keep the boundary clear between WDS core, LK theme overrides, and LK Robotics
  extensions

Notes:
- The `.fig` file is a reference artifact.
- Do not include these files in runtime package output, npm distribution, or
  Storybook public builds.
