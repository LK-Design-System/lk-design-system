# WDS ↔ LDS Component Axis Coverage — corrected

## Method correction (important)

An earlier pass built a "gap inventory" from `FIGMA_LOCAL_CONTENT_AUDIT.json`
→ `componentSections[].variantAxes`. **That intermediate extraction is not a
reliable source of a component's variant axes:** the `.fig` section decode merges
variant symbols from *adjacent* components, so axes and values bleed across
components (e.g. a component's axis list picks up neighbours' values).

Trusting that data produced four **phantom gaps** that do not exist in the real
WDS designs. They were implemented and then **reverted** once each component was
checked against its *rendered* source (the design exports under
`docs/references/wds/source-pdfs/*.pdf` and `source-screenshots/*.png`, which are
ground truth).

## Verified against the authoritative `.fig` component-set definitions

Read directly from each component set via `scripts/extract-wds-component-variants.mjs`
(bleed-free — scoped to one set's own variant children). Rendered PDFs/PNG were a
secondary cross-check only.

| Component set | Authoritative variant axes | LDS coverage |
|---|---|---|
| `Toast/Toast` | Variant = Normal/Positive/Cautionary/Negative | ✅ exact — **no `assistive`** |
| `Tab/Tab` | Horizontal Padding · Resize (Fill/Hug) · Size (S/M/L) | ✅ covered — **no `variant` axis exists** |
| `Select/Select` | Active · Disable · Focus · Negative · Overflow · Render (Chip/Text) | ✅ covered — **no trailing `icon`/`icon-button` variant** |
| `Textinput/Textfield` | Active · Disable · Focus · Status · Trailing Button | ✅ covered — **no `Character Counter` / `Timer`** (compose via the `actionRight` slot + helper) |
| `Textinput/Textarea` | Active · Disable · Focus · Resize · Status | ✅ exact |

Reproduce: `node scripts/extract-wds-component-variants.mjs "Toast/Toast" "Tab/Tab" "Select/Select" "Textinput/Textfield" "Textinput/Textarea"`

## Retracted phantom implementations (reverted)

- Input/Textarea `showCount` + Input `timer` — not WDS axes. Timer/counter are
  composed via the existing `actionRight` slot + helper text (see the
  `TextInputTimerAndCounter` story).
- Select `variant: "icon" | "icon-button"` + `trailingIcon` — WDS Select has no
  such axis; its icon axis is `leadingIcon` (already covered by `iconLeft`).
- Toast `assistive` variant — WDS Toast has 4 variants, no assistive.
- Tabs `variant: "alternative"` — WDS Tab has no variant axis at all.

## Open

None. The authoritative component-set read shows the checked components are fully
aligned; the four reverted items were phantom. (An earlier note about a Textinput
`assistive` variant came from the rendered example page, not the `Textinput/Textfield`
set, which has no such axis — so there is nothing to implement.)

## Takeaway

Audit component variants against the **authoritative `.fig` component-set
definition** (`scripts/extract-wds-component-variants.mjs`), not the section-level
`variantAxes` of the local-fig content decode (which bleeds) and not rendered
screenshots. The decode is reliable for foundations (typography/grid/color) only.
Codified in `AGENTS.md`.
