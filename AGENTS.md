# Repository Working Rules

## Concurrent Agent Coordination

- Assume that other agents may be inspecting, generating, or editing files in the same worktree at the same time, even when their activity is not visible in the current task.
- Before editing, inspect the current worktree status and re-read every target file. When delegating parallel work, assign the narrowest practical, non-overlapping file ownership and state those paths explicitly.
- Treat unexpected or newly appearing changes as another contributor's work. Do not reset, revert, overwrite, mass-format, or regenerate them merely because they were not present at the start of the task.
- Immediately before applying a patch to a file that may have changed, re-read the relevant section and adapt the patch to the latest contents. Immediately before handoff, inspect the target files and diff/status again; do not make claims from a stale snapshot.
- If concurrent edits overlap and their intent cannot be preserved with a confident merge, stop editing the overlapping file, coordinate with the active agent when possible, and report the conflict instead of choosing one version silently.
- Keep verification scoped to the files and contracts owned by the current task while parallel work is active. A failure or diff in an unrelated agent-owned area is not authorization to modify that area.

## Storybook Scope

- Storybook is reserved for actual design-system components, patterns, variants, states, and visual parity examples.
- Do not add audit dashboards, duplicate-check pages, implementation status pages, coverage reports, planning pages, or operational notes to Storybook.
- If information can live as Markdown, JSON, or a script output, keep it out of Storybook.
- When a user asks for duplicate checks, coverage checks, source mapping, WDS/LDS audit evidence, or process notes, add or update files under `docs/` and/or `scripts/`; do not create a Storybook story for that purpose.
- Public Storybook titles use audience-facing navigation groups such as `LDS Core/Foundation` and `LDS Core/Components/Action`; keep numbered WDS source labels such as `1 Theme` or `3 Component / 2 Action` in `docs/references/wds/` only.
- `LDS Product` and `LDS Robotics` are for reusable extension components and patterns. Do not add application screens, templates, workflows, demos, or example pages there.
- Hidden visual parity stories are allowed only when they exist to support visual regression of a real component surface and are tagged with `!dev` and `visual-parity`.

## LK Product Asset Workflow Coverage (MANDATORY)

- Complete the product-workflow gate in `docs/COMPONENT_WORKFLOW.md` for every new component, substantial redesign, and domain-component review. At minimum, explicitly consider **LK Web Viz**, **LK Control Full Daedeok**, and **LK Context Hub**; record `not applicable` with a concrete reason instead of silently omitting an asset.
- Inspect and pin the actual repository revision and relevant frontend source before claiming `supported` or `supported by composition`. Missing source evidence means `unverified`, never assumed coverage; store pins and detailed results in `docs/references/product-frontends/COVERAGE_AUDIT.json` and `docs/PRODUCT_FRONTEND_COVERAGE.md`.
- Keep product routes, backend/transport policy, domain state machines, and complete screens outside LDS. Final notes must identify the workflow seam, coverage classification, gaps, and LDS-versus-product ownership; automated component checks do not replace this review.

## WDS Evidence Handling

- Reflect WDS source evidence in the existing LDS component/story that owns that component. Do not create a new Storybook page just to show comparison or audit data.
- Do not present inferred behavior as WDS behavior. If the source PDF, screenshot, resource folder, or Figma node does not show it, label it as LDS compatibility or leave it out of the WDS-facing story.
- Keep source evidence traceable in `docs/references/wds/` and guard important claims with scripts where practical.

## New Component / Redesign Fit

- Treat `docs/COMPONENT_WORKFLOW.md` as the canonical end-to-end checklist for new components, substantial redesigns, reusable patterns, and new or changed icons/assets/map symbols. Complete its evidence, product-workflow, contract, visual, accessibility, asset-suitability, Storybook, and verification gates; the rules below add detail but do not replace that checklist.
- Before adding a new component, or materially redesigning an existing one, inspect the closest existing LDS components in the same family, their `.prompt.md` files, Storybook stories, and relevant docs/tokens. Treat existing spacing, typography, divider alignment, radius, hover/focus/disabled behavior, icon usage, and Storybook naming conventions as design-system constraints.
- Before choosing the design, make an explicit visual-delta inventory against the closest sibling components. Compare control and icon size, spacing, typography, radius, border/divider, fill and foreground, selected/active markers, hover, focus, disabled, orientation, and surrounding chrome. Small decorative differences such as an extra edge line, inset border, or shadow are part of this inventory; do not dismiss them as polish.
- Every retained visual difference must be justified by at least one concrete source: an established LDS component/token convention, a functional state that must be communicated, an accessibility requirement, confirmed WDS evidence, or an authoritative external category reference. A different component name, product area, or public state model is not by itself sufficient reason to introduce different styling.
- When a visual difference has no concrete justification, remove it or align the component with the existing sibling rather than preserving or inventing an ad hoc visual language. Prefer expressing semantic differences through the existing component variants and state treatments before adding new markers or chrome.
- Before handoff, render the changed component and its closest siblings side by side in equivalent states and re-check every recorded delta. Review agents must independently challenge the premise that an existing or proposed difference should be preserved; the current implementation, prompt wording, and prior agent decision are not evidence on their own.
- External web research is MANDATORY for every new component, material redesign, or reusable UI-pattern change before coding begins. This is the default workflow for all component categories, not only robotics, safety, niche, or unfamiliar domains. Do not wait for the user to request web research.
- Research at least two authoritative external references when suitable sources exist. Prefer official design-system documentation, platform human-interface guidelines, accessibility guidance, standards/specifications, and official product or vendor documentation. Use galleries, blogs, and community examples only as secondary visual evidence; technical and behavioral claims must come from primary sources. If only one suitable authoritative source exists, record that limitation instead of padding the research with weak references.
- Use the external research to identify the category's expected anatomy, information hierarchy, required user-visible information and actions, state/interaction model, placement and layout conventions, keyboard/ARIA behavior, responsive behavior, and common failure modes. Before coding, explicitly decide what is required, what is unnecessary or scope creep, and what should remain intentionally omitted from the DS layer.
- Complete both the internal LDS inspection and the external reference review before choosing the UI structure or writing implementation code. External references define the category expectations; existing LDS components, tokens, and conventions define the local visual language. Do not copy another system's styling verbatim, and document any intentional conflict or adaptation.
- Keep external source links and the concrete design conclusions they influenced in the component `.prompt.md` or the nearest existing design-system document. Do not create a Storybook audit or reference-only story for this evidence. If web research cannot be completed, stop and report the blocker rather than silently implementing from memory.
- Implement the comparison outcome, not just the requested surface: add missing states, props, ARIA behavior, and stories that belong to the reusable component contract; avoid app-specific extras; and document intentional exclusions as Product or LK Robotics extensions when needed.
- Classify the work before implementation as WDS Core, LK Theme Override, LK Product Extension, or LK Robotics Extension. Do not introduce ad hoc visual language or screen-specific UI patterns as if they were core design-system components.
- If the requested component overlaps with an existing component, prefer extending or composing the existing component. If a new component is still needed, document the distinction in its prompt/story so future agents do not duplicate the pattern.
- For new components and substantial redesigns, the final notes or PR summary must name the sibling components/docs that were checked, link the authoritative external references reviewed, summarize the design conclusions drawn from them, and identify any intentional deviation from either the references or LDS conventions.

### Composed UI Visual Hierarchy Gate (MANDATORY)

- Apply this gate to components and reusable patterns that combine multiple information or control regions, such as status, identity, metadata, progress, selection, navigation, and row-level or global actions.
- Before coding, define the intended visual and interaction reading order and assign each element to a clear role group. The semantic DOM order and keyboard order must support the same sequence; do not place status, metadata, and actions together merely because they fit in one trailing region.
- Extract layout anatomy from both LDS siblings and authoritative external references, not only behavior, ARIA, color, or state meaning. Compare grouping, alignment, density, relative sizing, width allocation, wrapping, and the placement relationship among labels, status, supporting text, progress, and actions.
- After implementation, inspect representative real content in the affected Storybook stories at both the normal target width and a narrow target width. Include the compound states that stress the layout, such as long labels, mixed statuses, progress with a visible value, errors, disabled controls, and multiple actions. Check reading order, wrapping, truncation, vertical rhythm, alignment, overflow, card-within-card effects, and whether related information still reads as one unit.
- Passing type, accessibility, token, or interaction checks is not evidence that the composition is visually complete. Judge the rendered result against the sibling and reference on its own merits, not only as an improvement over the previous implementation. If the conclusion is merely "better than before," continue the visual review.
- Use focused Storybook rendering and representative viewport checks while iterating; do not substitute repeated repository-wide verification. Follow the repository's Verification Cadence and run the full suite only at the final checkpoint unless broader impact requires it sooner.
- Final notes for a composed UI change must identify the representative story, states, and normal/narrow widths that were visually checked, along with any intentional hierarchy or responsive deviation.

### Icon, Asset, And Map-Symbol Suitability Gate (MANDATORY)

- Complete the icon/asset/map-symbol suitability gate in `docs/COMPONENT_WORKFLOW.md` whenever a change adds or alters reusable visual assets or map geometry. Inventory the affected symbols, search existing registries/assets first, and research authoritative category conventions; current code and screenshots are not authority by themselves.
- Review geometry, asset provenance/accessibility, and the combined map hierarchy across representative zoom, width, appearance, collision, label, and interaction states. Compare the current and candidate treatments in real LK product density.
- A visual difference without established LDS, product, accessibility, or authoritative external evidence is `provisional`, not finished. Record the evidence and decision in the component prompt or nearest stable contract.

## Component Variant/Axis Parity — authoritative source (MANDATORY)

- A component's variant axes MUST be read from the `.fig` **internal component-set definition**: decode `docs/references/wds/Wanted Design System (Community).fig`, locate that one component's COMPONENT_SET (variant container), and read ONLY its own direct variant children / component-property definitions. Scope strictly to that component set.
- Do NOT derive variant axes from `docs/references/wds/FIGMA_LOCAL_CONTENT_AUDIT.json` `variantAxes`. That extraction aggregates at the SECTION level and **bleeds adjacent components' axis values**, producing phantom axes. It is unreliable for per-component variant analysis (it is fine for foundations: typography, grid, color).
- Do NOT treat rendered screenshots or PDF exports (`source-pdfs/`, `source-screenshots/`) as authoritative for axis completeness. They are rendered pictures of example pages, not the component's own variant definition — use them only as a secondary visual cross-check.
- Before implementing a "missing variant/axis", confirm the value exists in that component set's own variant definition. If it cannot be confirmed there, it is NOT WDS parity: treat it as absent, or ship it only as an explicit, labeled LDS extension.

## Duplicate And Coverage Checks

- Prefer automated guards under `scripts/` and package scripts over visual audit pages.
- For Avatar specifically, use `npm run check:avatar-duplicates` and the Avatar duplicate audit section in `docs/references/wds/README.md`.
- If a guard is added, wire it into `npm run check` unless it is intentionally experimental.

## Scope Escalation Gate (MANDATORY)

- A request to review or fix a specific component, story, or area authorizes work on that area. It is not blanket approval for whatever larger work is discovered along the way — "전부 수정해줘" approves the findings that were just reported, not a new, larger scope.
- Stop and ask before any fix whose blast radius exceeds the requested area. This includes at minimum: expanding a repository-wide quality gate (new rules, new coverage, stricter thresholds), changing the value of a shared semantic/component token, mass edits across many components, renaming or restructuring public APIs, and brand-color adjustments.
- Expanding a binary pass/fail gate silently converts "fix the gate" into "fix everything the gate now covers". When newly exposed violations exceed the requested area, present options before proceeding — for example: fix everything now, freeze existing violations in a baseline and block only regressions, or scope the fix to the requested area and record the rest as follow-up work.
- Shared token *value* changes shift visuals across the entire design system and are design-owner decisions. Propose the change with the affected surfaces and contrast/measurement evidence, and wait for approval; do not bundle it silently into an unrelated fix.
- When the user approves an escalation, keep the escalated work in its own commit(s) with the measurement that justified it, so the original scoped fix remains reviewable on its own.

## Verification Cadence

- During implementation, use the smallest relevant targeted checks for the files and contracts being changed, such as the affected Storybook story/play function, focused accessibility check, component test, type check, or package build.
- Do not rerun repository-wide builds, the full Storybook accessibility sweep, the complete visual-smoke capture, or `npm run check` after every incremental edit.
- Batch related edits and run the appropriate full verification suite once at the final checkpoint before handoff. Run it earlier only when the user explicitly asks, a shared foundation change cannot be validated safely with targeted checks, or a failure indicates broader repository impact.
- When a full-suite failure is being fixed, iterate with the specific failing check first; rerun the full suite only after the focused check passes and the work is ready for final verification.

## Markdown Documentation Changes

- Before adding a new Markdown file, inspect the existing Markdown structure and nearby docs to understand where the information belongs.
- Prefer updating an existing Markdown file when the new content fits an established document, section, or workflow.
- Add a new Markdown file only when the content has a distinct owner, lifecycle, or lookup path that would make an existing file unclear or overloaded.
- When creating a new Markdown file is justified, link it from the nearest existing index, README, audit, or workflow document when that improves discoverability.
