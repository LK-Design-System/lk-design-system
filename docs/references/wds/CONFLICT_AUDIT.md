# WDS Conflict Audit

This audit compares the LK ROBOTICS design system against the Wanted Design
System Community file using the Figma connector and the checked-in local `.fig`
export.

Source:
- Figma file: Wanted Design System Community
- File key: `4e0301GrjO6P8fOQpLUrrG`
- Checked on: 2026-07-07

## Read Method

The full WDS page metadata is too large for a single `get_metadata` request and
timed out at page scope. A read-only `use_figma` inspection succeeded and
returned pages, variable collections, styles, and component-set names.

On 2026-07-08, a live Figma MCP read against file key
`9ztwRZsoXNAuTP7TYSFO1e` and node `16222:137705` was blocked by the Figma MCP
Starter plan call limit. As a fallback, `npm run extract:wds-fig-content`
decoded the checked-in `Wanted Design System (Community).fig` export and wrote
`FIGMA_LOCAL_CONTENT_AUDIT.json` with node text, section labels, variant-like
symbol names, dimensions, and visual samples.

Observed WDS structure:
- Pages include `Overview`, `1 Theme`, `2 Element`, `3 Component`, `Resource`,
  and guideline pages.
- Variable collections include `Atomic`, `Theme`, `Frame`, and `Component`.
- `Theme` has Light and Dark modes with semantic names such as
  `Primary/Normal`, `Label/Normal`, `Background/Normal/Normal`,
  `Line/Normal/Normal`, `Fill/Normal`, and `Status/Positive`.
- `Frame` defines radius and padding by size. Radius values are Small 12,
  Medium 14, Large 16, and Xlarge 20.
- `Component` defines responsive component variables such as viewport width,
  normal gap, card tiny padding, and platform variant.
- `3 Component` is organized as `Layout`, `Action`, `Selection and Input`,
  `Content`, `Loading`, `Navigation`, `Feedback`, and `Presentation`.
- Representative WDS component sets include Button, Textinput, Select,
  Checkbox, Radio, Switch, Segmented Control, Card, List Cell, Avatar, Thumbnail,
  Skeleton, Circular, Tab, Category, Pagination, Menu, Tooltip, Toast, Snackbar,
  and Alert.

## Main Finding

The current LK system is not just "WDS with LK colors." It is closer to a
WDS-inspired system with LK color decisions, additional local token names, and a
large robotics/product extension layer.

That can be valid, but only if the repo explicitly separates:
- `WDS Core`: WDS-derived foundations and generic UI components.
- `LK Theme Override`: LK color, brand, status, typography, and token
  substitutions over the WDS structure.
- `LK Product Extension`: generic LK product components that are useful but not
  direct WDS core matches.
- `LK Robotics Extension`: robotics, viewer, map, telemetry, editor, and domain
  components.

Without that separation, product-specific components and custom visual choices
look like accidental deviations from WDS.

## Conflicts

### 1. Token Vocabulary Drift

WDS uses variable names like:
- `Atomic/Common/100`
- `Theme/Primary/Normal`
- `Theme/Label/Alternative`
- `Theme/Background/Elevated/Normal`
- `Theme/Line/Solid/Normal`
- `Frame/Radius`

The LK repo uses a different vocabulary:
- `primitive.color.brandAzure`
- `semantic.action.primary`
- `semantic.surface.raised`
- `semantic.border.subtle`
- CSS variables such as `--lk-primary`, `--color-primary`, `--surface-card`

This is not fatal, but it means the implementation is not a direct WDS token
recolor. A stable mapping table is required if the intent is to preserve WDS as
the source model.

### 2. Partial Component Tokenization

`tokens/source.json` defines component tokens mainly for Button, Input, and
Card. WDS has a much broader generic component surface, including Select,
Checkbox, Radio, Switch, Segmented Control, List Cell, Skeleton, Tooltip, Menu,
Toast, Snackbar, Alert, Pagination, and Tabs.

Current risk:
- Some LK components are tokenized as first-class components.
- Many other components rely on semantic tokens plus local inline values.
- The WDS-derived contract is therefore uneven across the catalog.

### 3. Hardcoded Visual Values

A scan of `components` and `stories` found 229 direct visual values across 59
files, including hex colors, rgba colors, gradients, and shadows.

Top examples:
- `stories/RoboticsAndViz.shared.jsx`
- `stories/Content.shared.jsx`
- `components/buttons/SocialButton.jsx`
- `components/brand/BrandLogo.jsx`
- `components/navigation/Footer.jsx`
- `components/cards/ProductCard.jsx`
- `components/feedback/Tag.jsx`
- `components/overlay/Lightbox.jsx`

Some exceptions are legitimate, such as third-party brand logos and social
login colors. Other values should become semantic or component tokens if the
system is meant to remain WDS-derived.

### 4. Domain Layer Mixed Into Core

WDS is a general product UI system. The LK repo includes domain-specific areas:
- `robotics`
- `viz`
- `editor`
- viewer/map/telemetry components
- robotics task and operation examples

These should be documented as LK Robotics extensions, not as WDS core
components. This also explains prior Storybook discomfort around workflow pages:
end-to-end robotics screens are examples or product patterns, not base design
system primitives.

### 5. Radius Policy Needs One Source

WDS `Frame/Radius` values are 12, 14, 16, and 20. LK tokens currently include:
- `--radius-sm`: 6
- `--radius-md`: 12
- `--radius-input`: 12
- `--radius-xl`: 16
- `--radius-pill`: 999

This mostly fits WDS small/large values, but LK lacks explicit Medium 14 and
Xlarge 20 in the primitive radius scale. If LK intentionally tightens cards or
tool surfaces, document that as an LK override. Otherwise add WDS-compatible
radius tokens.

### 6. Typography Mostly Aligns, But Legacy Tokens Compete

WDS text styles use Pretendard JP and the Display, Title, Heading, Headline,
Body, Label, Caption vocabulary. LK already exposes this scale, which is good.

However, LK also keeps older `--fs-h1`, `--fs-h2`, `--lh-*`, and `--ls-*`
tokens with stronger editorial styling and negative tracking. For a WDS-derived
system, component stories should prefer the WDS-like type scale unless a brand
page explicitly needs the older display tokens.

### 7. Storybook Taxonomy Extends Beyond WDS

The LK catalog has many useful additions, but the sidebar currently makes the
core system and extension system feel equally canonical. That weakens the
"WDS recolored for LK" premise.

Recommended taxonomy:
- WDS Core
- LK Theme Override
- LK Product Extension
- LK Robotics Extension

Evidence, governance, and audit records should stay under `docs/` rather than
being exposed as Storybook pages.

## Recommended Cleanup Order

1. Create a WDS-to-LK token map:
   - WDS variable name
   - LK token name
   - CSS variable
   - Light value
   - Dark value
   - override reason

2. Mark component families as one of:
   - `wds-core`
   - `lk-theme-override`
   - `lk-product-extension`
   - `lk-robotics-extension`
   - `example-only`

3. Move robotics, viewer, telemetry, map, and editor stories under an explicit
   LK Robotics Extension section.

4. Convert non-exempt hardcoded colors and shadows to tokens.

5. Expand component tokens beyond Button, Input, and Card for the generic WDS
   component families already present in the repo.

6. Keep product workflow stories out of the design system surface unless they
   demonstrate a reusable component contract.

## Decision

There is no single catastrophic conflict. The larger issue is classification.
The LK repo can remain WDS-based if WDS Core, LK Theme Override, LK Product
Extension, and LK Robotics Extension are separated and documented. If those
layers stay mixed, the result reads as a custom design system inspired by WDS
rather than WDS with LK colors.
