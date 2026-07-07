# WDS Coverage Audit

This document tracks whether LDS covers the visible structure of the Wanted
Design System Community Figma source.

The machine-readable source for this report is
`docs/references/wds/COVERAGE_AUDIT.json`.

The completion gate is
`docs/references/wds/COVERAGE_COMPLETION_GATE.json`. It must remain
`not-ready` while any node-level WDS parity row is unresolved.

The node-level follow-up source is
`docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json`. It lists the exact Figma
node, local LDS evidence, and closure criteria for every WDS section row that
cannot yet be treated as complete parity.

## Source Structure

Figma source: `Wanted Design System Community`

File key: `4e0301GrjO6P8fOQpLUrrG`

Inspected pages:

| WDS page | Figma node | Audit status |
| --- | --- | --- |
| `1 Theme` | `16222:137703` | Section-level audit started |
| `2 Element` | `16222:137704` | Section-level audit started |
| `3 Component` | `16222:137705` | Section-level audit started |

The Figma MCP Starter plan rate limit stopped the deeper subsection-title
extraction during this pass. Rows marked `partial` are not complete parity
claims; they mean LDS has relevant coverage and still needs node-level variant
confirmation.

## Section Coverage

| WDS source | Status | LDS coverage | Gap |
| --- | --- | --- | --- |
| `1 Theme / 1 Icon` | Partial | `Iconography`, `Icon`, `assets/icons/manifest.json` | WDS icon export folder is imported locally; compare manifest and sizing states against the Figma source node. |
| `1 Theme / 2 Logo` | Theme-overridden | `Brand`, `BrandPlatform`, LK brand assets | WDS logo is intentionally replaced by LK ROBOTICS marks; verify structural usage guidance. |
| `2 Element / 1 Basic` | Partial | `Foundations`, `FoundationBasic`, typography/color/ratio tokens, `TOKEN_MAP` | PDF confirms Basic/Ratio coverage; remaining Basic source sections still need node-level detail audit. |
| `2 Element / 2 Spacing` | Partial | `FoundationSpacing`, grid/spacing tokens, local PDF evidence | Base spacing, grid, and Safe Area Status/Bottom coverage exists; remaining spacing examples need detail audit. |
| `2 Element / 3 Decorate` | Partial | `FoundationDecorate`, effects tokens, visual-token exceptions | PDF confirms Gradient/Mask/Interaction coverage; remaining WDS decorative examples need node-level detail audit. |
| `3 Component / 1 Layout` | Partial | `LayoutEssentials`, layout stories, `MobileSystemBars`, `Divider`, `components/layout` | PDF confirms Essential and Divider; verify remaining WDS layout subsections and examples. |
| `3 Component / 2 Action` | Partial | `ActionArea`, button/action stories, `components/buttons` | PDF confirms Action Area, Button, Text Button, Icon Button, Chip, and Toggle Icon; verify full state/size variants. |
| `3 Component / 3 Selection and Input` | Partial | form/selection stories and components plus screenshot evidence in `docs/references/wds/source-screenshots/3selectionandinput.png` | Screenshot confirms Textinput, Select, Control, Segmented Control, and Framed Style groups. Local state matrices now cover the visible PNG states through existing LDS components, including `Checkbox variant="mark"` and `ChoiceCard presentation="frame"`; verify exact child-node properties through Figma reads. |
| `3 Component / 4 Content` | Partial | card/content stories and components | Verify card/list/media/badge/disclosure variants one by one. |
| `3 Component / 5 Loading` | Partial | loading/progress stories and status components | Local stories cover skeleton line/block/avatar shapes, spinner labels, determinate/indeterminate linear progress, determinate/indeterminate circular progress, values, and reduced-motion handling; verify exact WDS state and size variants through Figma reads. |
| `3 Component / 6 Navigation` | Partial | navigation stories and components | Local story wrappers now expose readable TopBar, app navigation, compact navigation, tabs/routes, footer, menu, steps, and wizard evidence; verify hover-collapse, mobile navigation, footer, menu, route, step, and wizard behavior through Figma reads. |
| `3 Component / 7 Feedback` | Partial | feedback/overlay/status stories and components | Verify exact WDS feedback taxonomy and state variants. |
| `3 Component / 8 Presentation` | Partial | tooltip/menu/overlay stories and components | Verify tooltip/menu/overlay roles and presentation states. |

## Confirmed Covered Findings

| WDS source | LDS coverage | Notes |
| --- | --- | --- |
| `2 Element / 1 Basic / Ratio`, local PDF `1basic.pdf` | `stories/FoundationBasic.stories.jsx`, `components/layout/AspectRatio.jsx`, `tokens/spacing.css`, `tokens/source.json` | Adds WDS horizontal and vertical ratio presets as runtime aspect-ratio tokens. |
| `2 Element / 2 Spacing / Status and Bottom`, Figma node `16285:163253`, local PDF `2spacing.pdf` | `stories/FoundationSpacing.stories.jsx`, `tokens/spacing.css`, `tokens/source.json` | Adds mobile status bar, home indicator, bottom bar, and bottom action safe-area spacing guidance. |
| `2 Element / 3 Decorate / Gradient and Interaction`, local PDF `3decorate.pdf` | `stories/FoundationDecorate.stories.jsx`, `tokens/effects.css`, `tokens/source.json` | Adds WDS Solid/Multiple/Mask gradient and Interaction variant/state tokens. |
| `3 Component / 1 Layout / Essential and Divider`, local PDF `1layout.pdf` | `stories/LayoutEssentials.stories.jsx`, `components/layout/MobileSystemBars.jsx`, `components/content/Divider.jsx`, `tokens/components.css` | Adds WDS Essential mobile system bars and Divider normal/thick, horizontal/vertical variants. |
| `3 Component / 2 Action / Action Area and Controls`, local PDF `2action.pdf` | `stories/ActionArea.stories.jsx`, `components/buttons/ActionArea.jsx`, `components/buttons/ToggleIcon.jsx`, `components/buttons`, `components/feedback/Chip.jsx` | Adds WDS Action Area and Toggle Icon primitives and documents the Action taxonomy. |

## Next Detail Audit Targets

1. `1 Theme / 1 Icon`: compare `assets/icons/manifest.json` and `components/icon/Icon.jsx` with the Figma source node.
2. `2 Element / 1 Basic`: Ratio is covered from local PDF evidence; verify remaining basic foundation subsections against `tokens/colors.css`, `tokens/typography.css`, `tokens/effects.css`, and `tokens/source.json`.
3. `2 Element / 3 Decorate`: Gradient and Interaction are covered from local PDF evidence; verify remaining radius, shadow, line, and decorative examples.
4. `3 Component / 1 Layout`: Essential and Divider are covered from local PDF evidence; verify remaining layout child sections.
5. `3 Component / 2 Action`: Action Area and Toggle Icon are covered from local PDF evidence; map any remaining WDS child sections to LDS button/action components.
6. `3 Component / 3 Selection and Input`: local Textinput, Select, Control, Segmented Control, Check Mark, Switch, and Framed Style matrices are implemented from the source screenshot through existing LDS components; verify exact child-node properties through Figma node reads.
7. `3 Component / 6 Navigation`: verify hover-collapse, mobile navigation, and route/step behavior.
8. `3 Component / 8 Presentation`: verify Tooltip/Menu/Overlay coverage and states.
