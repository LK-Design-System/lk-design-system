# Token governance

| Field | Value |
| --- | --- |
| Type | Governance policy |
| Status | Current |
| Owner | Foundation owner |
| Last reviewed | 2026-07-12 |
| Source | `tokens/source.json` |

`tokens/source.json` is the source of truth for LK ROBOTICS design tokens.
Figma Variables, Storybook examples, React components,
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

## Color architecture

`tokens/source.json` is also the only editable runtime source for color. The
WDS `.fig`, PDFs, screenshots, and `docs/references/wds/COLOR_ARCHITECTURE.json`
are traceable evidence, not runtime inputs.

The generated color flow is:

```text
tokens/source.json
  -> tokens/color-atomic.css
  -> tokens/color-semantic.css
  -> tokens/color-components.css
  -> stories/color-system.data.js
```

Run `npm run generate:colors` after editing the source contract. Generated
files must not be edited by hand. `npm run check:colors` verifies generated
drift, layer boundaries, and the approved light/dark contrast pairs.

Color usage rules:

- Atomic tokens (`--color-atomic-*`) exist for palette construction. Component
  implementations must not reference them directly.
- Semantic tokens (`--color-semantic-*`) express product meaning and are the
  default choice for general UI.
- Component tokens (`--component-*`) bind a reusable component to a stable
  combination of semantic roles.
- Status is a four-role family: `foreground`, `surface`, `border`, and `text`.
  Do not reuse one status value for all four jobs.
- Data visualization uses `--color-semantic-data-viz-series-*`. A chart series
  must not use positive, cautionary, or negative unless that series actually
  communicates that status.
- Decorative colors such as ratings and categorical tags use accent or
  data-visualization roles, not status roles.
- Light and dark values are mandatory for every semantic color. Component
  color contracts are emitted in light, dark, and auto selectors so aliases
  resolve inside the correct theme scope.

### Removed compatibility names

The former `--bw-*` palette and `tokens/colors.css` compatibility layer are not
shipped. Product and design-system code must migrate directly to semantic or
component roles. `npm run check:colors` blocks reintroduction of the removed
names. This is an intentional breaking cleanup; no new compatibility aliases
may be added without an explicit product migration decision.

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
| `semantic/color/brand/ink` | `semantic.colorRoles.brand-ink` | `--color-semantic-brand-ink` |
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
