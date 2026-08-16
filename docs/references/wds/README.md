# WDS Reference (역사 아카이브 — 2026-08-16 재앵커링)

> **이 폴더는 2026-08-16부로 역사 기록이다.** 치수·해부학·파운데이션 값의
> 살아있는 권위는 [`../lds-baseline/`](../lds-baseline/README.md)의 LDS 소유
> 기준선으로 이동했다 (재앵커링 결정:
> [`OPERATING_MODEL.md`](../../OPERATING_MODEL.md) "Reference authority").
> 채택 시점에 기준선은 이 아카이브의 추출본과 바이트 단위로 같았다 —
> 재앵커링은 값이 아니라 근거를 바꿨다.
>
> 이 아카이브가 계속 답하는 질문은 **"이 값은 어디서 왔나"**(출처)이지,
> **"이 값이 맞나"**(권위)가 아니다. provenance 분류 4종(`WDS Core` /
> `LK Theme Override` / `LK Product Extension` / `LK Robotics Extension`)은
> 설계 근거의 역사로 유지된다. `check:wds-local-fig`는 이 아카이브의 내부
> 정합성(기록 무결성)을 지키는 검사이지, 현행 토큰의 정오를 판정하지 않는다.

This folder stores Wanted Design System reference material that seeded the LK
ROBOTICS design system.

## Relationship (historical)

LDS, the LK Design System, used WDS Community as the bootstrap baseline for
structure, generic component families, token hierarchy, and documentation
conventions. LDS then applied LK ROBOTICS brand decisions and separated
additional product or robotics work into explicit extension layers. Since the
2026-08-16 re-anchoring, LDS is its own reference; this relationship describes
origin, not current authority.

Runtime ownership (`core`, `theme`, `product`, `robotics`) and design provenance
are independent axes. `PUBLIC_EXPORT_CLASSIFICATION.json` is authoritative for
both; WDS provenance does not automatically place an export in the Core package
or Storybook layer.

The rule is:
- `WDS Core` is the inherited baseline.
- `LK Theme Override` is LK's visual identity applied over WDS.
- `LK Product Extension` is reusable LK product UI beyond direct WDS coverage.
- `LK Robotics Extension` is domain-specific robotics/viewer/editor UI.
- Evidence, governance, and audit material lives in `docs/`, not in
  Storybook.

When a design or component does not fit WDS Core, it must be classified as an
LK override or extension rather than silently changing the WDS baseline.

### Action family taxonomy

The WDS action system groups Action Area, Button, Text Button, Icon Button,
Chip, and Toggle Icon as one family with explicit roles. LDS keeps each role's
contract separate so action styling stays consistent across stories:

- Button, Text Button, Icon Button, Toggle Icon, and grouped actions
  (ButtonGroup, SplitButton, Fab) are demonstrated in
  `stories/Button.stories.jsx`, `stories/ActionButtonGroup.stories.jsx`,
  `stories/ActionSplitButton.stories.jsx`, and `stories/ActionFab.stories.jsx`.
- ButtonGroup and SplitButton reuse those primitives but have no direct WDS
  component set; their public stories and exports are classified as LK Product
  Extension evidence, not WDS Core parity.
- Action Area (bottom placement, divider, caption, sticky, safe-area padding)
  is demonstrated in `stories/ActionArea.stories.jsx`.
- Chip variants live in the Selection and Input Chip page and the content
  badge pages.

- `Wanted Design System (Community).fig`: original WDS Community Figma file
- `CONFLICT_AUDIT.md`: WDS vs LK conflict and extension audit based on the
  Figma connector and local `.fig` content extraction
- `FIGMA_LOCAL_CONTENT_AUDIT.json`: decoded local `.fig` source content,
  including text, section labels, variant-like symbol names, dimensions, and
  visual samples for queued WDS nodes
- `TOKEN_MAP.json`: machine-readable WDS variable to LK token/CSS mapping
  and family-level crosswalk. Its component-family rows map source families to LDS
  surfaces; export-level owner/provenance remains authoritative only in
  `PUBLIC_EXPORT_CLASSIFICATION.json`.
- `LAYER_CLASSIFICATION.json`: Storybook owner layer, explicit cross-layer evidence exceptions, and story title source of truth
- `VISUAL_TOKEN_EXCEPTIONS.json`: documented exceptions for provider-owned
  visual values that must not be tokenized
- `COVERAGE_AUDIT.json`: machine-readable WDS page/section coverage matrix
- `COVERAGE_COMPLETION_GATE.json`: machine-readable gate that states whether
  LDS can truthfully claim complete WDS coverage parity
- `COVERAGE_DETAIL_AUDIT.json`: WDS component-family to LDS component/story
  evidence matrix
- `COMPONENT_SOURCE_SCREENSHOTS.json`: user-provided Figma section screenshots
  mapped to LDS component/story evidence where PDF or node-level evidence is not
  yet complete
- `FOUNDATION_SOURCE_PDFS.json` and `COMPONENT_SOURCE_PDFS.json`:
  machine-readable mappings from local WDS PDF evidence to LDS layer decisions
- `FOUNDATION_AUDIT.json`: WDS theme and element foundations mapped to LDS
  token files, Storybook pages, and LK theme overrides
- `FIGMA_NODE_AUDIT_QUEUE.json`: exact WDS source nodes, closure criteria, and
  next Figma reads required before `partial` rows can become parity claims
- `PUBLIC_EXPORT_CLASSIFICATION.json`: every public LDS export assigned one
  runtime owner layer and one independent WDS/LK provenance
- `VARIANT_AUDIT_CHECKLIST.json`: family-level WDS variant/state/slot checks
  with Storybook evidence refs for the next Figma parity pass
- `COVERAGE_GAPS.md`: WDS concepts found in Figma that need LDS coverage or
  have recently been brought into LDS
- `STYLE_PARITY_AUDIT.md`: style-level (radius, padding, typography, state
  treatment) comparison of all 869 WDS variant symbols against LDS component
  implementations, with ranked drift findings and the LK override register
- `source-screenshots/`: user-provided Figma section screenshots used as
  interim visual evidence for component taxonomy and state matrices

## Source evidence policy

Local WDS PDF exports are evidence for visible structure, taxonomy, and state
coverage. The checked-in `.fig` export can be decoded for node-level source
content with:

```bash
npm run extract:wds-fig-content
```

The generated `FIGMA_LOCAL_CONTENT_AUDIT.json` records source text, section
labels, variant-like symbol names, dimensions, and visual samples.

On 2026-07-08 the checked-in `.fig` export was accepted as the authoritative
WDS source snapshot. Every Figma node queue row was closed by verifying its
closure criteria against the decoded local content and LDS sources, and
`COVERAGE_COMPLETION_GATE.json` moved to `ready`. The snapshot cannot attest
that the live Figma community file is unchanged upstream; if the upstream file
is updated, re-export it, re-run `npm run extract:wds-fig-content`, and
re-audit affected rows. Residual follow-up items from the closure pass are
listed in `COVERAGE_GAPS.md`.

Operating rules:

1. Preserve WDS Core as the inherited structure, component taxonomy, and token
   hierarchy.
2. Apply LK Theme Override only to visual identity values such as brand, color,
   typography, status tone, radius, and effects.
3. Keep reusable LK product UI outside direct WDS coverage under LK Product
   Extension.
4. Keep robotics, viewer, map, telemetry, and editor UI under LK Robotics
   Extension.
5. Treat PDFs as local evidence and keep detailed mappings in
   `FOUNDATION_SOURCE_PDFS.json` and `COMPONENT_SOURCE_PDFS.json`.

High-risk component mappings, especially Action controls, must map WDS axes to
existing LDS API names instead of replacing API names wholesale. For example,
WDS `disable` maps to React `disabled`; `active` maps to the role-appropriate
`selected`, `pressed`, or `active`; color axes map to semantic/LK theme tokens,
not raw WDS values.

Current applied PDF progress:

- `Button` and `TextButton` cover the WDS Action loading state with `loading`
  and `loadingLabel`.
- `IconButton` requires an accessible `label` in its public type contract.
- `Button`, `TextButton`, `IconButton`, and `Chip` public contracts document
  their WDS Action roles and LK theme-token boundary.
- `Chip` covers WDS Action size, variant, active, disabled, icon content, and
  thumbnail content axes with LDS props.
- Foundation spacing evidence now tracks `--mobile-bottom-bar-min-height` as
  `64px`, matching runtime spacing tokens.

## Visual style checks

WDS style review must include rendered Storybook screenshots, not only token or
type checks. Run:

```bash
npm run check:visual
```

The smoke capture writes to `visual-artifacts/smoke/` and includes WDS-facing
matrices for Action buttons, Textinput interactions, Control states, Segmented
Control resize modes, and Content card patterns. These captures are evidence
for local visual review only; they do not close live Figma parity items in
`COVERAGE_COMPLETION_GATE.json`.

Tooltip arrow alignment is also guarded by:

```bash
npm run check:tooltip-alignment
```

This renders the WDS Tooltip patterns from `storybook-static` and verifies that
vertical and horizontal arrow alignment examples match the WDS PDF behavior:
the arrow stays centered on the tooltip box edge while the tooltip box aligns
leading/center/trailing or top/center/bottom against the target.

## Avatar duplicate audit

Avatar duplication is managed through documentation and an automated guard, not
through a Storybook audit page.

| Area | Target | File | Decision |
| --- | --- | --- | --- |
| Component definition | Avatar | `components/feedback/Avatar.jsx` | Single definition |
| Component definition | AvatarGroup | `components/feedback/AvatarGroup.jsx` | Single definition |
| Public export | Avatar, AvatarGroup | `src/index.js`, `src/index.d.ts` | One export each |
| Storybook page | AvatarPatterns | `stories/Feedback.stories.jsx` | One design-system page |
| Hidden parity | AvatarCard, AvatarGroupCard | `stories/Feedback.shared.jsx` | Visual regression only, hidden from sidebar |
| Usage | UserMenu | `components/navigation/UserMenu.jsx` | Consumer only |

Run:

```bash
npm run check:avatar-duplicates
```

The guard blocks duplicate Avatar/AvatarGroup implementations, duplicate
public exports, duplicate Avatar Storybook titles, duplicate public export
classification rows, and unexpected Avatar source cards beyond the approved
legacy references.

Use this folder to:
- compare WDS tokens, components, and documentation conventions with LK
- track where LK color and brand overrides preserve or diverge from WDS
- keep the boundary clear between WDS core, LK theme overrides, and LK Robotics
  extensions

Notes:
- The `.fig` file is a reference artifact.
- Do not include these files in runtime package output, npm distribution, or
  Storybook public builds.
