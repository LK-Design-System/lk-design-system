# LK Design System Core

Core LK ROBOTICS design system package: tokens, React components, brand assets, templates, and static preview cards.

## Package

```tsx
import { Button, ProductCard, TopBar } from '@lk-robotics/design-system-core';
import '@lk-robotics/design-system-core/styles.css';
```

Package metadata:

- Package name: `@lk-robotics/design-system-core`
- Runtime peer dependency: `react`
- Optional peer dependency: `react-dom`
- ESM entry: `dist/index.js`
- CJS entry: `dist/index.cjs`
- Types entry: `dist/index.d.ts`

## Repository Layout

| Path | Purpose |
| --- | --- |
| `components/` | React component sources, `.d.ts` contracts, prompt notes, and static component cards. |
| `tokens/` | CSS design tokens for fonts, colors, typography, spacing, grid, effects, and base styles. |
| `styles.css` | CSS entry that imports the token files. |
| `assets/` | Brand SVGs, Pretendard fonts, product images, industry images, and technology images. |
| `src/` | Generated package entry files. |
| `dist/` | Built ESM/CJS/type outputs. Committed for direct Git consumption. |
| `scripts/` | Entry generation and type-copy scripts. |
| `guidelines/` | Static foundation preview cards. |
| `templates/` | Starter templates for login, list-table, master-detail, and form-settings screens. |
| `templates-cards/` | Static preview cards for starter templates. |
| `_ds_bundle.js` | Legacy browser bundle used by static cards and templates. |

## Development

```powershell
npm install
npm run build
```

Useful checks:

```powershell
npx tsc --noEmit
npm audit --omit=dev
npm pack --dry-run
```

The package entry files are generated from `components/**/*.jsx`:

```powershell
npm run generate:entry
```

Do not edit `src/index.js` or `src/index.d.ts` by hand.

## Component Coverage

The package exports 145 React component source files across these groups:

- `brand`
- `buttons`
- `cards`
- `content`
- `data`
- `editor`
- `feedback`
- `forms`
- `icon`
- `layout`
- `navigation`
- `overlay`
- `robotics`
- `selection`
- `status`
- `viz`

## Static Previews

Open `.html` files under `guidelines/`, `components/**`, or `templates-cards/` directly in a browser. Keep `_ds_bundle.js`, `styles.css`, `tokens/`, and `assets/` at their current relative paths because these previews load them directly.

## Cleanup Policy

The initial raw export is preserved in Git history. Current `main` is package-oriented and intentionally excludes export-only clutter such as scratch previews, uploaded references, screenshots, gap analyses, and invalid generated manifests.

More details are in `docs/REPOSITORY_INVENTORY.md`.
