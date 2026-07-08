# WDS ↔ LDS Component STYLE Parity (real values, not axis names)

Compares the **actual rendered style** of each component, not whether a variant
axis name exists. Two authoritative, reproducible sources:

- **WDS side** — `scripts/extract-wds-component-styles.mjs` reads each component
  set's representative default variant directly from the decoded `.fig` and
  records real pixel style: height, corner radius, auto-layout padding + gap,
  fill/stroke hex+alpha, stroke weight, label font size/weight/color. Full output:
  `docs/references/wds/COMPONENT_STYLES.json` (164 component sets).
- **LDS side** — measured in Storybook via `getComputedStyle` on the actual
  rendered component (ground truth, includes inline styles + resolved tokens).

Color fills are an intentional LK rebrand (see STYLE_PARITY_AUDIT.md policy) — for
color, compare role/alpha, not hex. **Dimensions (radius/padding/height/gap/font)
must match.**

## Measured so far

| Component | WDS (r / padX / padY / h / font) | LDS measured | Verdict |
|---|---|---|---|
| **Button** (solid/primary/md) | r10 · padX20 · padY9 · h40 · 15/SemiBold | r12 · padX28 · h48 · 16/600 | ❌ **drift** — LDS is larger (r+2, padX+8, h+8, font+1) |
| **Textfield** | r12 · padX12 · h48 · value 16 | r12 · padX12 · h48 · 16 | ✅ match |
| **Toast** | r12 · padX16 · padY11 · h54(content) | r12 · padX16 · padY11 · h44(content) | ✅ match (radius/padding exact; height is content-driven) |

The Button drift confirms the size-grading finding already noted in
`STYLE_PARITY_AUDIT.md` (WDS radius 12/10/8 + padding-x 28/20/14 per size vs the
LDS grading). It is a **real dimensional drift**, invisible to name-based axis
checks (which report Button as "covered").

## How to extend (reproducible full sweep)

1. `node scripts/extract-wds-component-styles.mjs` → refresh `COMPONENT_STYLES.json`.
2. For each component, open its Storybook story and read `getComputedStyle` of the
   primary element; diff dimensions against the JSON. Colors: compare role/alpha only.
3. Record drifts here; fix in `tokens/components.css` (token-driven) and re-measure.

## Status

- Full WDS style reference: ✅ extracted (164 sets).
- LDS measurement: core components spot-checked (Button drift; Input/Toast match).
  Remaining components: measure and record per the steps above.
