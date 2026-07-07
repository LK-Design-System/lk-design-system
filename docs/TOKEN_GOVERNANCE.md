# Token governance

`tokens/source.json` is the source of truth for LK ROBOTICS design tokens.
Figma Variables, Storybook examples, React components, static preview cards,
and AI-generated UI must all resolve back to this token contract.

## Token layers

| Layer | Role | Product usage |
| --- | --- | --- |
| Primitive | Brand raw values, scales, type, radius, shadow, motion | Only referenced by semantic or component tokens |
| Semantic | Product meaning such as surface, text, action, status, border, focus | Preferred token layer for general UI |
| Component | Component-specific contracts such as Button, Input, Card | Preferred inside that component implementation |
| Runtime CSS | Importable CSS variables and base styles | Shipped through `styles.css` and `tokens/*.css` |

Rules:

- Do not use primitive values directly in components.
- Prefer role names over visual names, for example `semantic.action.primary`
  instead of `blue500`.
- Use modes for density or theme differences rather than inventing unrelated
  token names.
- Component tokens must point back to semantic or primitive tokens unless a
  documented exception exists.

## Lifecycle

| State | Meaning | Allowed usage |
| --- | --- | --- |
| proposed | Experimental or draft token | Prototype and Storybook exploration only |
| active | Approved product token | Public components and templates |
| deprecated | Replaced token that still exists for compatibility | Keep with migration note for at least one minor cycle |
| removed | No longer available | Remove only in an explicit breaking change |

Deprecation notes must state the replacement token, affected components, and
the planned removal timing.

## Figma sync contract

Figma Variables and code tokens must stay aligned.

1. Keep Primitive, Semantic, and Component collections separate in Figma.
2. Semantic and Component variables should alias Primitive variables where
   Figma supports aliases.
3. Exported Figma Variables must be normalized into `tokens/source.json`.
4. Runtime CSS changes must be generated from, or justified against,
   `tokens/source.json`.
5. Token change reviews must include affected component and Storybook evidence.

### Figma Variables workflow

Use these Figma collections and modes:

| Collection | Purpose | Examples |
| --- | --- | --- |
| Primitive | Brand raw values and scales | `color/brand/navy`, `space/4`, `radius/md` |
| Semantic | Product meaning | `surface/card`, `text/body`, `action/primary`, `status/danger` |
| Component | Component contracts | `button/primary/bg`, `input/border/focus`, `card/shadow/md` |

Supported modes are `light`, `dark`, and `auto`. Use `auto` only as
documentation when the tool cannot directly resolve OS mode.

Figma names must map predictably:

| Figma | JSON | CSS |
| --- | --- | --- |
| `primitive/color/brand/navy` | `primitive.color.brandNavy` | `--bw-ink` |
| `semantic/action/primary` | `semantic.action.primary` | `--color-primary` |
| `component/button/primary/bg` | `component.button.tokens.primaryBg` | `--component-button-primary-bg` |
| `component/input/border/focus` | `component.input.tokens.borderColorFocus` | `--component-input-border-color-focus` |
| `component/card/shadow/md` | `component.card.tokens.shadowMd` | `--component-card-shadow-md` |

Export flow:

1. Designers update reviewed Figma Variables.
2. Export through a reviewed plugin or Figma API script.
3. Normalize the export into the `tokens/source.json` structure.
4. Regenerate or update runtime CSS under `tokens/`.
5. Run `npm run check:tokens` and the relevant component checks.

Import flow:

1. Start from `tokens/source.json`, not generated CSS.
2. Preserve Primitive, Semantic, and Component boundaries.
3. Preserve light/dark modes.
4. Preserve aliases wherever Figma supports them.
5. Validate visual impact in Storybook before replacing shared Variables.

Review checklist:

- Raw values belong first in Primitive tokens.
- Product roles are expressed as Semantic tokens.
- Component-only values belong under Component tokens.
- Component CSS must not introduce untracked hex, rgba, shadow, radius, or
  control-height decisions.
- Affected Storybook stories show the token impact.
- `npm run check:tokens` passes.

Automation backlog:

- Figma Variables export script or documented plugin preset
- `tokens/source.json` to CSS transformer
- Generated CSS versus committed CSS drift check
- Token-change report for reviews

## Change impact levels

| Level | Example | Requirement |
| --- | --- | --- |
| Patch | Description or alias metadata change | Token check passes |
| Minor | New semantic or component token | Storybook usage evidence |
| Minor with migration | Token deprecation | Replacement token and migration note |
| Major | Active token removal or role change | Migration guide and visual diff |

## Release gate

- `npm run check:tokens` must pass.
- Component token changes must be verified in the relevant Storybook story.
- Color and status token changes must include light/dark or surface contrast
  review.
- Removed tokens must have a deprecation period and migration note.
- Figma Variables workflow changes are updated in this document, not in a
  separate Markdown file.
