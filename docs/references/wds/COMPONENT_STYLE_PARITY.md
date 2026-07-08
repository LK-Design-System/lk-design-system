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

## Scope

- **Token-driven** components — guarded by `check:component-styles` (node-only).
- **Inline-styled** components — measured by `check:component-styles-rendered`
  (Playwright, 12 components, 0 drift). Extend `TARGETS` to add more; Checkbox /
  Radio / Tab need a targeted inner-element selector for their box/track (WDS only
  exposes a height for those, so radius/padding aren't comparable anyway).
- `COMPONENT_STYLES.json` holds the WDS reference for all 164 sets.

Excluded (unreliable to auto-diff): deeply nested / overlay components — List Cell,
Alert, Card, Menu, Auto Complete, Pagination. The WDS style extractor reads the
top-level frame, which is not the meaningful styled element for those layouts, so
the automated diff picks the wrong sub-frame. Their parity is covered by
`STYLE_PARITY_AUDIT.md` (manual) + the `visual-parity` regression stories.

**Net finding: across the 20 components with a reliable single styled root, LDS
matches WDS dimensions. Two real drifts were found and fixed — Filter Chip height
(38→32) and Multi-Select Chip padding (15→12).**
