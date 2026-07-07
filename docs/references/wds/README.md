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
- `Documents` is evidence, governance, and audit material.

When a design or component does not fit WDS Core, it must be classified as an
LK override or extension rather than silently changing the WDS baseline.

- `Wanted Design System (Community).fig`: original WDS Community Figma file
- `CONFLICT_AUDIT.md`: WDS vs LK conflict and extension audit based on the
  Figma connector
- `TOKEN_MAP.json`: machine-readable WDS variable to LK token/CSS mapping
- `LAYER_CLASSIFICATION.json`: Storybook layer and story title source of truth
- `VISUAL_TOKEN_EXCEPTIONS.json`: documented exceptions for provider-owned
  visual values that must not be tokenized
- `COVERAGE_AUDIT.json`: machine-readable WDS page/section coverage matrix
- `COVERAGE_COMPLETION_GATE.json`: machine-readable gate that states whether
  LDS can truthfully claim complete WDS coverage parity
- `COVERAGE_DETAIL_AUDIT.json`: WDS component-family to LDS component/story
  evidence matrix
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

Use this folder to:
- compare WDS tokens, components, and documentation conventions with LK
- track where LK color and brand overrides preserve or diverge from WDS
- keep the boundary clear between WDS core, LK theme overrides, and LK Robotics
  extensions

Notes:
- The `.fig` file is a reference artifact.
- Do not include these files in runtime package output, npm distribution, or
  Storybook public builds.
