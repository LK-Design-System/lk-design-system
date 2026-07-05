# AI Design System Guide

Use this guide as the first context file when asking an AI tool to design or implement LK Robotics UI. The goal is to make the design system a shared language for designers, engineers, and AI instead of a loose collection of CSS values.

## Source Of Truth

- Runtime CSS entry: `styles.css`
- Machine-readable token source: `tokens/source.json`
- Component token runtime layer: `tokens/components.css`
- Component implementations: `components/**`
- Interactive documentation: `stories/**`

`styles.css` is the runtime contract that product apps import. `tokens/source.json` is the structured token map that AI tools, Figma workflows, and future token transforms should read.

## Token Layers

1. Primitive tokens define raw decisions: brand colors, spacing scale, radii, typography, shadows, and motion.
2. Semantic tokens define product meaning: surface, text, action, status, border, focus, and control size.
3. Component tokens define reusable component contracts: Button, Input, Card, and future component families.

Use the highest useful layer:

- Product UI should prefer semantic tokens.
- Component source should prefer component tokens.
- Primitive tokens should be used only when defining or revising semantic/component tokens.

## AI Usage Rules

When generating UI code:

- Import `@lk-robotics/design-system-core/styles.css` once at the app entry.
- Use exported React components before recreating common UI.
- Use component tokens for Button/Input/Card internals.
- Use semantic tokens for product layout, copy, status, and surfaces.
- Do not invent new hex colors, arbitrary shadows, or one-off spacing unless the design system is being extended.
- Do not bypass `tokens/source.json` when describing token hierarchy to another AI tool.
- Keep LK Robotics visual tone: cool navy base, restrained azure signal, muted status colors, dense but calm operational UI.

## Component Token Contracts

### Button

Implementation: `components/buttons/Button.jsx`

Primary component tokens:

- `--component-button-height-sm`
- `--component-button-height-md`
- `--component-button-height-lg`
- `--component-button-radius`
- `--component-button-primary-bg`
- `--component-button-primary-bg-hover`
- `--component-button-primary-fg`
- `--component-button-secondary-bg`
- `--component-button-signal-bg`
- `--component-button-disabled-opacity`

### Input

Implementation: `components/forms/Input.jsx`

Primary component tokens:

- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-focus-shadow`
- `--component-input-label-font-size`

### Card

Implementation: `components/cards/Card.jsx`

Primary component tokens:

- `--component-card-bg`
- `--component-card-bg-dark`
- `--component-card-fg`
- `--component-card-border`
- `--component-card-radius`
- `--component-card-padding`
- `--component-card-shadow-md`
- `--component-card-shadow-lg`

## Prompt Template

Use this structure when prompting an AI tool:

```text
You are designing with the LK Robotics design system.
Read docs/AI_DESIGN_SYSTEM_GUIDE.md and tokens/source.json first.
Import @lk-robotics/design-system-core/styles.css.
Prefer exported components from @lk-robotics/design-system-core.
Use semantic tokens for product UI and component tokens for Button/Input/Card behavior.
Do not invent colors, spacing, shadows, or control dimensions unless adding a reviewed token.
Output production React code.
```

## Extension Rules

When adding a token:

1. Add or update the runtime CSS token in `tokens/*.css`.
2. Add the structured token entry in `tokens/source.json`.
3. If the token is component-specific, place it in `tokens/components.css`.
4. Use the token in the relevant component implementation.
5. Add or update a Storybook story that shows the token behavior.
6. Run `npm run check` before pushing.

## Current Scope

The first structured component-token pass covers Button, Input, and Card. The rest of the component library still uses a mix of semantic tokens and local values. Future passes should move each component family to the same primitive -> semantic -> component structure.
