# LK Design System

LK ROBOTICS UI and brand design system bundle.

This repository is a preserved design-system export. It contains design tokens, React component sources, HTML preview cards, templates, brand assets, and generated bundle/manifest files.

## Current Status

- This is not currently an npm package.
- There is no `package.json` or build script yet.
- The browser bundle is provided as `_ds_bundle.js`.
- The exported namespace is `LKRoboticsDesignSystem_4f14ff`.
- The manifest reports capture metadata from `2026-07-04T15:55:21.505Z`.
- Some original Korean documentation was mojibake-corrupted during export. The original files are preserved under `docs/original-mojibake/`.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `tokens/` | CSS design tokens for fonts, colors, typography, spacing, grid, effects, and base styles. |
| `styles.css` | Top-level stylesheet that imports the token files. |
| `components/` | React component sources with matching `.d.ts` and `.prompt.md` files. |
| `assets/` | Brand SVGs, Pretendard font files, product images, industry images, and technology images. |
| `guidelines/` | Static HTML cards for foundation guidelines such as color, type, logo, icon, spacing, and grid. |
| `templates/` | Starter templates for login, list-table, master-detail, and form-settings screens. |
| `templates-cards/` | Static preview cards for the starter templates. |
| `screenshots/` | Visual QA screenshots and review images. |
| `scratch/` | Experimental previews and temporary visual checks retained for traceability. |
| `uploads/` | Uploaded reference images retained from the export workflow. |
| `_ds_bundle.js` | Generated browser bundle exposing the design system namespace. |
| `_ds_manifest.json` | Generated manifest with component, card, token, theme, and font metadata. |
| `_adherence.oxlintrc.json` | Generated adherence/lint configuration from the design-system workflow. |

## Component Coverage Snapshot

The `components/` directory currently contains 145 React `.jsx` source files. Each checked component source has a matching `.d.ts` file and `.prompt.md` file.

Major component groups:

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

## How To Use

For static HTML previews:

1. Open the relevant `.html` file from `guidelines/`, `components/**`, or `templates-cards/` in a browser.
2. Keep files in their current relative locations so asset and script references continue to resolve.

For project adoption:

1. Import `styles.css` or the specific files under `tokens/`.
2. Copy the needed component files from `components/`.
3. Copy required assets from `assets/`.
4. Use `_ds_manifest.json` as an inventory reference, but treat the source files as the primary implementation.

For browser-bundle usage:

1. Load `_ds_bundle.js`.
2. Read components from `window.LKRoboticsDesignSystem_4f14ff`.

## Maintenance Notes

- Do not delete or rename existing folders casually. Many preview cards use relative paths.
- Keep `_ds_bundle.js` and `_ds_manifest.json` together with the source tree unless a new generation process is introduced.
- Keep `screenshots/`, `scratch/`, and `uploads/` until the team decides which visual evidence is still needed.
- If this becomes a real package, add `package.json`, explicit exports, dependency declarations, and a repeatable build command.

More repository notes are in `docs/REPOSITORY_INVENTORY.md` and `docs/UPLOAD_CHECKLIST.md`.
