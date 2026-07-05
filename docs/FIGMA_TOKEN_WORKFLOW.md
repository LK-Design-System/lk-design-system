# Figma Token Workflow

This workflow keeps Figma Variables, `tokens/source.json`, and runtime CSS aligned without damaging the current design system.

## Collections

Use three Figma Variable collections:

| Collection | Purpose | Examples |
| --- | --- | --- |
| Primitive | Raw brand and scale values | `color/brand/navy`, `space/4`, `radius/md` |
| Semantic | Product meaning | `surface/card`, `text/body`, `action/primary`, `status/danger` |
| Component | Component contracts | `button/primary/bg`, `input/border/focus`, `card/shadow/md` |

Use modes inside the same collections:

- `light`
- `dark`
- `auto` only as documentation if Figma cannot resolve OS mode directly

## Naming Mapping

Figma variable names should map predictably to CSS and JSON:

| Figma | JSON | CSS |
| --- | --- | --- |
| `primitive/color/brand/navy` | `primitive.color.brandNavy` | `--bw-ink` |
| `semantic/action/primary` | `semantic.action.primary` | `--color-primary` |
| `component/button/primary/bg` | `component.button.tokens.primaryBg` | `--component-button-primary-bg` |
| `component/input/border/focus` | `component.input.tokens.borderColorFocus` | `--component-input-border-color-focus` |
| `component/card/shadow/md` | `component.card.tokens.shadowMd` | `--component-card-shadow-md` |

## Export Direction

Preferred path:

1. Designers update Figma Variables.
2. Export variables as JSON through a reviewed plugin or Figma API script.
3. Normalize the export into `tokens/source.json`.
4. Update runtime CSS in `tokens/*.css`.
5. Run `npm run check`.

Until an automated transform exists, treat `tokens/source.json` as the reviewed structured source and `styles.css` plus `tokens/*.css` as the runtime contract.

## Import Direction

When sending tokens back to Figma:

1. Start from `tokens/source.json`, not generated CSS.
2. Preserve collection boundaries: Primitive, Semantic, Component.
3. Preserve modes: light and dark.
4. Preserve aliases where Figma supports variable references.
5. Review visual changes in Storybook before replacing shared Figma Variables.

## Review Checklist

- New colors are added as primitive tokens first.
- Product roles are expressed as semantic tokens.
- Component-only values live under component tokens.
- No component source introduces new hardcoded hex, rgba, shadow, radius, or control height values without a matching token.
- Storybook shows the affected token behavior.
- `npm run check:tokens` passes.

## Automation Backlog

The current repository has the structure needed for AI and Figma workflows, but not a full token transform pipeline yet. A future automation pass should add:

- Figma Variables export script or documented plugin preset.
- JSON-to-CSS generation from `tokens/source.json`.
- Token drift check between generated CSS and committed CSS.
- Token change report for reviewers.
