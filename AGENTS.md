# Repository Working Rules

## Storybook Scope

- Storybook is reserved for actual design-system components, patterns, variants, states, and visual parity examples.
- Do not add audit dashboards, duplicate-check pages, implementation status pages, coverage reports, planning pages, or operational notes to Storybook.
- If information can live as Markdown, JSON, or a script output, keep it out of Storybook.
- When a user asks for duplicate checks, coverage checks, source mapping, WDS/LDS audit evidence, or process notes, add or update files under `docs/` and/or `scripts/`; do not create a Storybook story for that purpose.
- Public Storybook titles use audience-facing navigation groups such as `LDS Core/Foundation` and `LDS Core/Components/Action`; keep numbered WDS source labels such as `1 Theme` or `3 Component / 2 Action` in `docs/references/wds/` only.
- `LDS Product` and `LDS Robotics` are for reusable extension components and patterns. Do not add application screens, templates, workflows, demos, or example pages there.
- Hidden visual parity stories are allowed only when they exist to support visual regression of a real component surface and are tagged with `!dev` and `visual-parity`.

## WDS Evidence Handling

- Reflect WDS source evidence in the existing LDS component/story that owns that component. Do not create a new Storybook page just to show comparison or audit data.
- Do not present inferred behavior as WDS behavior. If the source PDF, screenshot, resource folder, or Figma node does not show it, label it as LDS compatibility or leave it out of the WDS-facing story.
- Keep source evidence traceable in `docs/references/wds/` and guard important claims with scripts where practical.

## Component Variant/Axis Parity — authoritative source (MANDATORY)

- A component's variant axes MUST be read from the `.fig` **internal component-set definition**: decode `docs/references/wds/Wanted Design System (Community).fig`, locate that one component's COMPONENT_SET (variant container), and read ONLY its own direct variant children / component-property definitions. Scope strictly to that component set.
- Do NOT derive variant axes from `docs/references/wds/FIGMA_LOCAL_CONTENT_AUDIT.json` `variantAxes`. That extraction aggregates at the SECTION level and **bleeds adjacent components' axis values**, producing phantom axes. It is unreliable for per-component variant analysis (it is fine for foundations: typography, grid, color).
- Do NOT treat rendered screenshots or PDF exports (`source-pdfs/`, `source-screenshots/`) as authoritative for axis completeness. They are rendered pictures of example pages, not the component's own variant definition — use them only as a secondary visual cross-check.
- Before implementing a "missing variant/axis", confirm the value exists in that component set's own variant definition. If it cannot be confirmed there, it is NOT WDS parity: treat it as absent, or ship it only as an explicit, labeled LDS extension.

## Duplicate And Coverage Checks

- Prefer automated guards under `scripts/` and package scripts over visual audit pages.
- For Avatar specifically, use `npm run check:avatar-duplicates` and the Avatar duplicate audit section in `docs/references/wds/README.md`.
- If a guard is added, wire it into `npm run check` unless it is intentionally experimental.

## Markdown Documentation Changes

- Before adding a new Markdown file, inspect the existing Markdown structure and nearby docs to understand where the information belongs.
- Prefer updating an existing Markdown file when the new content fits an established document, section, or workflow.
- Add a new Markdown file only when the content has a distinct owner, lifecycle, or lookup path that would make an existing file unclear or overloaded.
- When creating a new Markdown file is justified, link it from the nearest existing index, README, audit, or workflow document when that improves discoverability.
