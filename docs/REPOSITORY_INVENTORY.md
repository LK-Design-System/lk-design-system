# Repository Inventory

This document records the current shape of the design-system export without changing the design-system files.

## Snapshot

- Root path: `C:\Users\seoul\Downloads\LK Design System`
- Total files at cleanup time: 668
- Approximate size: 11 MB
- React component source files: 145
- `.jsx` files with matching `.d.ts`: 145 / 145
- `.jsx` files with matching `.prompt.md`: 145 / 145
- Manifest namespace: `LKRoboticsDesignSystem_4f14ff`
- Manifest capture timestamp: `2026-07-04T15:55:21.505Z`

## Primary Source Areas

- `tokens/`: design tokens and base CSS.
- `components/`: React component implementation files.
- `assets/`: brand, font, product, industry, and technology assets.
- `templates/`: reusable starter templates.
- `guidelines/`: design foundation preview cards.

## Generated Or Derived Areas

- `_ds_bundle.js`: generated browser bundle.
- `_ds_manifest.json`: generated metadata inventory. It is useful as an index, but some localized card metadata appears corrupted enough that strict JSON parsing may fail.
- `_adherence.oxlintrc.json`: generated adherence rules.
- `screenshots/`: visual review output.
- `scratch/`: temporary previews and visual experiments.
- `uploads/`: reference images from the export workflow.
- `templates-cards/`: generated or curated previews for templates.

## Original Corrupted Docs

The original exported docs with mojibake-corrupted Korean text were preserved here:

- `docs/original-mojibake/readme.md`
- `docs/original-mojibake/SKILL.md`
- `docs/original-mojibake/TODO.md`
- `docs/original-mojibake/COVERAGE.md`

The root `readme.md` was replaced with a clean repository overview so a private Git host shows useful project context.

## Known Issues

- Several original Markdown and HTML documents contain mojibake-corrupted Korean text.
- `_ds_manifest.json` is useful for simple inventory extraction, but strict JSON parsers can fail because some localized card strings appear malformed.
- Package metadata and a repeatable build command now exist on the package-conversion branch.
- The package entry is generated from component source files by `scripts/generate-entry.mjs`.

## Non-Destructive Cleanup Policy

This cleanup intentionally did not delete, rename, or move existing design-system folders. Relative paths in static preview cards are preserved.
