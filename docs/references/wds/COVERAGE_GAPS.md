# WDS Coverage Audit

This document tracks whether LDS covers the visible structure of the Wanted
Design System Community Figma source.

The machine-readable source for this report is
`docs/references/wds/COVERAGE_AUDIT.json`.

The completion gate is
`docs/references/wds/COVERAGE_COMPLETION_GATE.json`. On 2026-07-08 the
checked-in `Wanted Design System (Community).fig` export (decoded to
`FIGMA_LOCAL_CONTENT_AUDIT.json`) was accepted as the authoritative WDS source
snapshot, every node-level queue row was closed against that snapshot, and the
gate moved to `ready`.

The node-level closure record is
`docs/references/wds/FIGMA_NODE_AUDIT_QUEUE.json`. Each row keeps its Figma
node, local LDS evidence, closure criteria, and a `closureNote` describing what
was verified against the local snapshot.

## Source Structure

Figma source: `Wanted Design System Community`

File key: `4e0301GrjO6P8fOQpLUrrG`

Accepted snapshot: local `.fig` export decoded on 2026-07-07
(101,534 node changes, 35 target summaries, 57 component sections).

| WDS page | Figma node | Audit status |
| --- | --- | --- |
| `1 Theme` | `16222:137703` | Closed against local snapshot |
| `2 Element` | `16222:137704` | Closed against local snapshot |
| `3 Component` | `16222:137705` | Closed against local snapshot |

Live Figma MCP reads remain blocked by the Starter plan call limit. Live
re-verification is optional and only matters if the upstream community file
changes; in that case re-export, run `npm run extract:wds-fig-content`, and
re-audit affected rows.

## Section Coverage

| WDS source | Status | LDS coverage | Closure summary |
| --- | --- | --- | --- |
| `1 Theme / 1 Icon` | Covered | `Iconography`, `Icon`, `assets/icons/manifest.json` | All 339 WDS icon SVGs imported 1:1 (kebab-case renames; `navigationX` → `nav-*`); `logoGoogle` served through `BrandLogo`; `lds-legacy` glyphs are LK product extensions. |
| `1 Theme / 2 Logo` | Theme-overridden | `Brand`, `BrandPlatform`, LK brand assets | WDS Color/Variant/symbol roles map to `Lockup` tone/variant; Language and Partnership sections intentionally excluded for the single-language LK brand. |
| `2 Element / 1 Basic` | Covered | `Foundations`, `FoundationBasic`, ratio tokens, `TOKEN_MAP` | The WDS Basic node contains only Ratio; all 17 aspect-ratio presets map 1:1 to `--ratio-*` tokens. Color/typography live on Foundation guideline pages tracked by `FOUNDATION_AUDIT.json`. |
| `2 Element / 2 Spacing` | Covered | `FoundationSpacing`, grid/spacing tokens | The WDS Spacing node is Safe Area only; iOS minima (44/34) and web `env()` insets are tokenized. Android fixed constants intentionally not tokenized for web runtime. |
| `2 Element / 3 Decorate` | Covered | `FoundationDecorate`, effects tokens, visual-token exceptions | WDS Decorate is exactly Gradient + Interaction, mapped to `--decorate-*` and `--interaction-*` tokens. |
| `3 Component / 1 Layout` | Covered | `LayoutEssentials`, `MobileSystemBars`, `Divider` | Layout is Essential + Divider only. LK overrides: thick divider 8px (WDS 12px), iOS bar metrics for both platforms. PageHeader stays a product extension. |
| `3 Component / 2 Action` | Covered | `ActionArea`, button stories, `components/buttons` | All six Action children map with exact size parity; `Disable`→`disabled`, `Active`→`pressed/selected`. See follow-ups for focus-visible and ActionArea story demos. |
| `3 Component / 3 Selection and Input` | Covered | form/selection stories and components | Textinput, Select, Control, Segmented Control, Framed Style map axis-by-axis. DateTime/ColorSwatch/PinInput/FileUpload confirmed absent from WDS — product extensions. |
| `3 Component / 4 Content` | Covered | card/content stories and components | Icon, Badge, Thumbnail (17 ratios exact), Avatar (sizes exact), List Cell (141 variants, px-exact) map axis-complete. Avatar `Official/원티드` badges are Wanted-brand assets, intentionally excluded. |
| `3 Component / 5 Loading` | Covered | loading/progress stories and status components | Wanted/Circular loading, Skeleton axes, rect/circle customize covered; `Animate=False` maps to reduced-motion handling. Meter stays a product extension. |
| `3 Component / 6 Navigation` | Covered | navigation stories and components | WDS Navigation is exactly Category, Tab, Page Indicator, Pagination — all mapped. TopBar/Footer/SideNav/Steps have no WDS counterpart and are product extensions. |
| `3 Component / 7 Feedback` | Covered | feedback/overlay/status stories and components | Toast severities, Snackbar resource axes, Alert platform×variant×heading covered. WDS keeps Snackbar separate, matching LDS. |
| `3 Component / 8 Presentation` | Covered | tooltip/menu stories and components | Presentation is Tooltip + Menu only, both mapped; arrow alignment guarded by `check-tooltip-alignment.mjs`. Lightbox/CommandPalette/Popover/HoverCard are product extensions. |

## Confirmed Covered Findings

| WDS source | LDS coverage | Notes |
| --- | --- | --- |
| `2 Element / 1 Basic / Ratio`, local PDF `1basic.pdf` | `stories/FoundationBasic.stories.jsx`, `components/layout/AspectRatio.jsx`, `tokens/spacing.css`, `tokens/source.json` | Adds WDS horizontal and vertical ratio presets as runtime aspect-ratio tokens. |
| `2 Element / 2 Spacing / Status and Bottom`, Figma node `16285:163253`, local PDF `2spacing.pdf` | `stories/FoundationSpacing.stories.jsx`, `tokens/spacing.css`, `tokens/source.json` | Adds mobile status bar, home indicator, bottom bar, and bottom action safe-area spacing guidance. |
| `2 Element / 3 Decorate / Gradient and Interaction`, local PDF `3decorate.pdf` | `stories/FoundationDecorate.stories.jsx`, `tokens/effects.css`, `tokens/source.json` | Adds WDS Solid/Multiple/Mask gradient and Interaction variant/state tokens. |
| `3 Component / 1 Layout / Essential and Divider`, local PDF `1layout.pdf` | `stories/LayoutEssentials.stories.jsx`, `components/layout/MobileSystemBars.jsx`, `components/content/Divider.jsx`, `tokens/components.css` | Adds WDS Essential mobile system bars and Divider normal/thick, horizontal/vertical variants. |
| `3 Component / 2 Action / Action Area and Controls`, local PDF `2action.pdf` | `stories/ActionArea.stories.jsx`, `components/buttons/ActionArea.jsx`, `components/buttons/ToggleIcon.jsx`, `components/buttons`, `components/feedback/Chip.jsx` | Adds WDS Action Area and Toggle Icon primitives and documents the Action taxonomy. |

## Post-Closure Follow-Ups

A deeper style-level pass (radius, padding, typography, state treatments over
all 869 WDS variant symbols) was run after closure; its ranked drift findings
and LK-override register live in `STYLE_PARITY_AUDIT.md`. The items below are
the structural follow-ups from the closure pass itself.

These are the residual items recorded during the 2026-07-08 snapshot closure.
None of them block the parity claim; each is either a small evidence gap or an
intentional LK deviation that should eventually get its own demo or contract
note.

**Resolution status (2026-07-09):** follow-ups 1–5 are closed; item 6 is an
intentional-override register (no action).

1. **Focus-visible styling** — ✅ RESOLVED. `tokens/focus.css` adds one
   token-driven, theme-aware `:where(...):focus-visible` ring (with
   `!important` so it shows even over inline `outline:none`), wired into
   `styles.css`. No per-component edits.
2. **ActionArea story demos** — ✅ RESOLVED. `sticky`, `compact`,
   `divider={false}`, and checkbox/chip/information extra-content are
   demonstrated in the "Action area states" story (`stories/ActionArea.stories.jsx`).
3. **Card contract deltas** — ✅ RESOLVED. `Card` gained a `toggleIcon` prop
   and a third caption tier (`metaCaption`); the "CardAffordances" story
   demonstrates both plus a `Thumbnail` `overlay` inside a card. `Card.d.ts` +
   `Card.prompt.md` updated.
4. **Brand clear-space rule** — ✅ RESOLVED. `stories/Brand.shared.jsx`
   documents an explicit lockup clear-space rule (≥ ½ × height on all sides,
   min height 20px) with a visual spec.
5. **Textinput Timer / Character Counter** — ✅ RESOLVED. Dedicated timer
   (`actionRight` countdown) and live character-counter tiles in the
   "타이머 · 문자 수 카운터" story (`stories/FormsFull.stories.jsx`).
6. **Intentional LK overrides recorded during closure**: thick divider 8px
   (WDS 12px); iOS bar metrics used for both `MobileSystemBars` platforms; no
   chromeless IconButton `normal` style; TextButton icons via composition;
   `ListCell` default inversion on `fillWidth`/`textEllipsis`.
