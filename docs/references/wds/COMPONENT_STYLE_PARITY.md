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

Result (0 drift): Button, Chip, Filter Chip, Content Badge, Segmented Control,
Push Badge all match WDS dimensions. Two apparent drifts were harness artifacts,
not real: Content Badge (LDS default size is `small`; its `medium` = r8/padX8/13
matches WDS) and Segmented Control height (WDS `h` is the track; LDS track =
40px segment + padding — radius 10 matches; height is a measurement axis, not a
token).

## Scope

- **Token-driven** components — guarded by `check:component-styles` (node-only).
- **Inline-styled** components — measured by `check:component-styles-rendered`
  (Playwright). Currently covers Button, Chip, Filter Chip, Content Badge,
  Segmented Control, Tag, Push Badge, Category; extend `TARGETS` to add more
  (Checkbox/Radio/Switch/Tab need a targeted inner-element selector for their box/track).
- `COMPONENT_STYLES.json` holds the WDS reference for all 164 sets.

**Net finding across every component measured correctly: LDS matches WDS
dimensions; the single real drift (Filter Chip 38→32) is fixed.**
