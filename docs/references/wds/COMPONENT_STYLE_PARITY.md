# WDS ↔ LDS Component STYLE Parity (real values, not axis names)

Compares the **actual rendered style** of each component (radius / padding /
height / gap / font size), not whether a variant axis name exists.

Two authoritative, reproducible sources:

- **WDS side** — `scripts/extract-wds-component-styles.mjs` reads each component
  set's representative default variant directly from the decoded `.fig` and
  records real pixel style. Full output: `docs/references/wds/COMPONENT_STYLES.json`
  (164 component sets).
- **LDS side** — for token-driven components, `scripts/check-wds-component-styles.mjs`
  resolves `tokens/components.css` var() chains to px and diffs against the WDS
  JSON (`npm run check:component-styles`). Verified equal to Storybook
  `getComputedStyle` measurements (e.g. Button md renders exactly 40/10/20/15).

Colors are an intentional LK rebrand (STYLE_PARITY_AUDIT.md policy) — compare
role/alpha, not hex. Only dimensions are diffed here.

## Findings (token-driven components)

| Component | WDS r / padX / h / font | LDS | Verdict |
|---|---|---|---|
| Button (solid/primary/md) | 10 / 20 / 40 / 15 | 10 / 20 / 40 / 15 | ✅ match |
| Chip (md) | 10 / 11 / 36 / 15 | 10 / 11 / 36 / 15 | ✅ match |
| Textfield | 12 / 12 / 48 / 16 | 12 / 12 / 48 / 16 | ✅ match |
| Menu | radius 16 | radius 16 | ✅ match |
| **Filter Chip** | height 32 (pill) | ~~38~~ → **32** | 🔧 **fixed** (`--component-filter-chip-height` 38→32) |
| Toast | r12 / padX16 / padY11 | r12 / padX16 / padY11 | ✅ match (measured) |
| Content Badge (md) | r8 / padX8 / font13 | r8 / padX8 / font13 | ✅ match (measured; height 30 vs 28 is content-driven) |

`check:component-styles` guards the token-driven rows going forward (0 drift).

Every component measured correctly matches WDS across action / selection / form /
feedback / content families — strong evidence the WDS-first size pass is intact.
The one real drift found (Filter Chip) is fixed.

### Correction

An earlier note in this file claimed a "Button drift" (r12/padX28/h48). That was a
**measurement error** — the value measured was the **large** button, compared to
the WDS **medium** default. LDS Button size grading actually matches WDS exactly:
S 32/8/14/13 · M 40/10/20/15 · L 48/12/28/16.

## Signed-off LK overrides (intentionally NOT matched — excluded from the check)

- **Card** — `--component-card-radius` = 16 vs WDS 12. Retained per STYLE_PARITY_AUDIT.md
  (Card is a padded elevated surface, not a bare content stack).
- **Toggle Icon** — boxed toggle (r12) vs WDS pill. Retained per STYLE_PARITY_AUDIT.md.

## Rendered measurement harness (inline-styled components)

`scripts/check-wds-component-styles-rendered.mjs` (`npm run check:component-styles-rendered`)
builds a tiny consumer app that renders each component in a controlled
`<div data-measure="…">` wrapper, Vite-builds + serves it, and uses Playwright to
read the **real computed style** of the component root — then diffs against the
WDS `.fig` reference. Reliable (controlled wrapper + direct child; no ad-hoc
selectors). Each component is rendered at the **medium** size to match the WDS
representative variant.

Result — **0 drift** across 20 measured components (action / selection / form /
feedback / content): Button (solid + outlined), Text Button, Fab, Chip, Filter
Chip, Multi-Select Chip, Content Badge, Segmented Control, Tag, Push Badge,
Category, Choice Card, Page Indicator, Skeleton, Avatar, Toast, Select, Textarea,
Switch — all match WDS dimensions (radius / padding / height / font as available).

Notes:
- Radius is compared as "is it a pill/circle" when the value ≥ half the height
  (Fab/Avatar/pill chips render round regardless of the raw radius value).
- Each component is rendered at the **medium** size to match the WDS representative
  variant; comparing LDS defaults directly gave false size-mismatch drifts
  (e.g. Content Badge default is `small`).

## Nested / overlay components — deep reconstruction (INSTANCE-resolving)

The shallow extractor reads only a variant's own top-level frame, so it cannot see
the real styled element of components whose geometry lives inside a *referenced*
symbol. WDS's published controls (Checkbox / Radio / Check Mark) delegate their box
to a `Resource/Control` symbol via an INSTANCE, and overlay layouts (List Cell,
Alert, Menu, Tooltip…) nest several instances deep.

`scripts/extract-wds-styles-deep.mjs` resolves every INSTANCE → its master symbol
and recurses, reconstructing the full styled skeleton exactly as it renders.
`scripts/build-wds-deep-styles.mjs` (`npm run build:wds-deep-styles`) writes the
authoritative inner-element values to `COMPONENT_STYLES_DEEP.json`, and
`scripts/check-wds-nested-styles.mjs` (`npm run check:nested-styles`) renders each
LDS component and diffs its real computed inner-element style against them.

Result — **0 drift** across the reconstructed inner elements:

| Element (WDS reconstructed) | WDS | LDS | Verdict |
|---|---|---|---|
| Checkbox Box (md / sm) | 18 · 16, r5, 1.5px, primary fill | 18 · 16, r5, 1.5px | ✅ match |
| Radio Box (md / sm) | 20 · 16, circle, 1.5px | 20 · 16, circle, 1.5px | ✅ match |
| Check Mark row | control 24 + label fs15/14, gap | fs15/14 | ✅ match |
| Tooltip bubble | r8, padX12 padY8, dark, fs14 | r8, padX12 | ✅ match |
| Alert modal (web) | r12, pad20, title fs18/body fs15 | r12, headline1/body2 | ✅ match |
| List Cell | h48, padY12, gap8, title fs16/desc fs13 | h48, r12, body1/label2 | ✅ match |
| Menu / Auto Complete | container r16, 1px stroke | r16 | ✅ match |
| Pagination chip | r8, padX8, h32 | r8, padX8, h32 | ✅ match |

The earlier "r3 checkbox drift" was a **false positive** — r3 belongs to a minor
3-variant atomic control; the canonical published Checkbox (48-variant
`Control/Checkbox` → `Checkbox/Resource/Control`) box is **r5**, which LDS matches.

### Signed-off LK overrides (intentional, verified against the deep reconstruction)

- **Card radius 16** vs WDS 12 (padded elevated surface — see above).
- **List Cell leading = 36px accent-tinted icon tile** (`--lk-accent-tint`) vs WDS
  bare 24px icon. This is the LK icon-tile wash used consistently across FeatureCard,
  StepList, DataGrid, ButtonGroup — a deliberate brand pattern, not a drift.
- **+1 weight step / positive letter-spacing** — the documented LK typography feel
  (`STYLE_PARITY_AUDIT.md`); only sizes/metrics are aligned to WDS.

### Real drift found + fixed

- **Alert action button font** — LDS used 14px on every platform; WDS actions are
  16 (web / Android) and 17 (iOS), all SemiBold. Fixed with a per-platform
  `buttonFontSize` (web 16 / android 16 / ios 17). `components/overlay/Alert.jsx`.

## Coverage — what is style-verified vs coverage-only

Honest split (see `COMPONENT_CENSUS.json` for the full 103-component name census):

- **Style-verified (real WDS↔LDS diff, 0 drift): ~26 components.**
  - `check:component-styles` — token-driven (node), incl. Button/Input/Chip/Textfield/Menu.
  - `check:component-styles-rendered` — Playwright, **22 components** (adds Input, Divider).
  - `check:nested-styles` — Playwright, 7 INSTANCE-resolved inner elements (Checkbox/Radio
    box, Tooltip, Alert, List Cell) vs `COMPONENT_STYLES_DEEP.json`.
- **Coverage-only (exists in LDS, WDS reference captured, NOT pixel-diffed): the rest.**
  These are (a) **documented LK overrides** (Card r16, ToggleIcon r12, Tabs spacing,
  Segmented inner geometry), (b) **overlays needing interaction** (Modal, Popover,
  DropdownMenu), (c) **layout/platform** (Grid, Footer, BottomNav, TopBar,
  MobileSystemBars), (d) **LK extensions** with no WDS counterpart. Their WDS reference
  lives in `COMPONENT_STYLES.json` (164 sets) but auto-diffing them is unreliable.

A batch-2 auto-diff attempt (Tabs, StatusBadge, Input font) surfaced **only false
positives, 0 real drift**: the harness measured the 2px Tab indicator instead of the
48px tab; StatusBadge is a pill status chip, not WDS Content Badge (that maps to the
already-verified `ContentBadge`); the Input "font 17" was the field row's inherited
font, not the input's token-set 16 (`--component-input-font-size` = body1). This is why
the coverage-only set is not force-diffed — noise would masquerade as findings.

**Net finding: across every component measured with a reliable single styled root
(~26), LDS matches WDS (0 drift). Real drifts found and fixed across the whole sweep —
Filter Chip height (38→32), Multi-Select Chip padding (15→12), Alert action button
font (14→16/17). Remaining divergences are documented, deliberate LK overrides; the
un-diffed remainder is coverage-verified (exists) but not claimed as pixel-matched.**
