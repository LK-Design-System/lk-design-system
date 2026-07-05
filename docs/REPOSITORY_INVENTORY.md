# Repository Inventory

This repository is the package-oriented LK Robotics core design system.

## Package Scope

- Package name: `@lk-robotics/design-system-core`
- React component source files: 145
- Component groups: `brand`, `buttons`, `cards`, `content`, `data`, `editor`, `feedback`, `forms`, `icon`, `layout`, `navigation`, `overlay`, `robotics`, `selection`, `status`, `viz`
- Runtime peer dependency: `react`
- Optional peer dependency: `react-dom`
- Build output: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`

## Primary Source Areas

- `components/`: React components, component type declarations, prompt notes, and static component cards.
- `tokens/`: CSS design tokens and base styles.
- `assets/`: brand SVGs, Pretendard font files, product images, industry images, and technology images.
- `styles.css`: top-level CSS entry for token imports.
- `src/`: generated package entry files.
- `scripts/`: package maintenance scripts.
- `guidelines/`: static foundation cards.
- `templates/`: reusable starter templates.
- `templates-cards/`: static cards for starter templates.

## Generated Areas

- `dist/`: package build output committed so internal Git consumers can import the package without a publish step.
- `_ds_bundle.js`: legacy browser bundle used by static HTML preview cards and starter templates.

## Removed From Current Head

The initial raw export is still available in the repository history. The current `main` removes export-only clutter that is not needed for the design-system package:

- `scratch/`
- `screenshots/`
- `uploads/`
- root audit, gap-analysis, and direction HTML documents
- corrupted/export-only Markdown documents
- invalid `_ds_manifest.json`
- generated adherence config
- ad hoc equipment-detail demo files

## Maintenance Notes

- Do not edit `src/index.js` or `src/index.d.ts` manually. Run `npm run generate:entry`.
- Keep `_ds_bundle.js` while static preview cards and templates load it directly.
- Keep `dist/` in Git unless the team switches to a formal package publishing workflow.
- If a component is added under `components/`, add the matching `.d.ts` and run `npm run build`.
