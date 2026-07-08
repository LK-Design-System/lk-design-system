# WDS Style Parity Audit

Date: 2026-07-08
Scope: style-level (radius, padding, gaps, typography, strokes, shadows, state
treatments) comparison between the accepted local WDS `.fig` snapshot and LDS
component implementations. This audit goes one layer deeper than the
structure/taxonomy/dimension closure recorded in `FIGMA_NODE_AUDIT_QUEUE.json`.

Method: all 869 variant symbols across 29 WDS component sets were extracted
from the `.fig` with full style trees (per-corner radius, auto-layout
padding/gap, fill/stroke hex+alpha, shadow effects, fontSize/lineHeight/
letterSpacing, interaction-overlay structure) and compared against
`tokens/*.css` and component sources.

Verdict scale:
- **match** — value or role parity.
- **lk-override** — different but plausibly intentional; needs sign-off, not a fix.
- **drift** — different and looks unintended (wrong token step, flattened size
  grading, one-off hardcoded values, dead tokens).

Color rule: color *values* are intentionally rebranded (LK Theme Override) and
are never counted as drift; color *roles* and alpha steps are compared. The
LDS alpha ladder (0.61/0.28/0.16 labels, 0.08/0.16 fills) mirrors WDS exactly,
so role comparison is meaningful.

## Policy decisions (2026-07-08, WDS-first principle)

Owner direction: WDS is the styling authority; LK overrides must be explicit.
Decisions applied:

1. **Typography voice → WDS.** Per-size positive letter-spacing restored from
   the existing `--*-spacing` tokens; weights follow WDS steps (Medium 500 /
   SemiBold 600). The former "+1 weight step, tracking 0" voice is retired.
2. **Disabled convention → WDS.** Discrete token colors (fill 0.08 step,
   text 0.28 for solid / 0.16 for outlined) replace wrapper opacity. No
   element-level opacity dimming.
3. **Drift items are fixed to WDS values** (see resolution notes per finding).
4. **Retained LK overrides (signed off):** LK color rebrand (founding
   principle); Card outer surface (padded, elevated) with WDS internal rhythm;
   ToggleIcon boxed toggle; save-button-in-header Card affordance; shadow
   substitution for blur materials EXCEPT Toast/Snackbar which adopt the WDS
   translucent+blur material; MobileSystemBars iOS metrics for both platforms.
5. **Deferred to a dedicated pass:** WDS ink-overlay hover/pressed interaction
   layer (`#171719` overlay via the existing `--interaction-*` tokens) — a
   cross-cutting interaction change that needs its own visual QA round.
   Until then the "calm hover" stays.

## Fixed during this audit

- `--component-transient-feedback-bg` was referenced by
  `components/overlay/Toast.jsx:77` and `components/overlay/Snackbar.jsx:56`
  but defined nowhere — Toast/Snackbar backgrounds rendered fully transparent.
  Defined in `tokens/components.css` as `var(--surface-inverse)` (same inverse
  surface pattern as Tooltip). Verified in Storybook. Note: WDS's source
  surface is translucent dark + background blur (`#1B1C1E@52%`); adopting the
  translucent+blur material would additionally require `backdropFilter` in
  both components — recorded as an optional refinement.

## Resolution status (2026-07-08, same day)

All ranked drift findings below (1–15) and the secondary list were **fixed to
WDS values** in the WDS-first correction pass, with these exceptions:

- Deferred: ink-overlay hover/pressed layer (policy decision 5).
- Retained by sign-off: Card outer surface + save affordance + skeleton
  composition; ToggleIcon boxed chrome; PageIndicator "normal" counter surface
  (needs an over-media context); Pagination/IconButton 32px hit areas
  (a11y-positive); AvatarGroup size-key names (public API compat — mapping
  documented in code); Skeleton light tone stays on `--inverse-fill-normal`
  12% (WDS 28% would need a new inverse fill token); Alert iOS table (WDS iOS
  internals not decodable from the snapshot).
- Verified: `check:fast` suite green (except git-diff gates pending commit),
  `tsc`, consumer smoke, and Storybook renders (button matrix grading,
  Radio filled-circle pattern, Avatar rounded squares, Toast blur material).

The findings below are kept as the audit record; each is now historical.

## Top drift findings (ranked, cross-family)

1. **Radio checked treatment inverted** — WDS fills the 20px circle with the
   primary color and knocks out a white dot; LDS keeps a white 22px circle
   with a 1px ring (WDS stroke 1.5px) and a colored dot.
   `components/forms/Radio.jsx:36-40,73-79`.
2. **Button size grading flattened** — WDS radius 12/10/8 and padding-x
   28/20/14 per size vs LDS flat radius 12 and padding 20/16/12; content gap
   9px flat vs 6/5/4. `tokens/components.css:13-16,22`.
3. **Font-size mappings shifted one scale step, in opposite directions** —
   Button 17/16/14 vs WDS 16/15/13 (up); Chip md/sm 14/13 vs WDS 15/14 (down);
   Tab Medium 15 vs WDS 17; Menu item 14 vs WDS 16; Tooltip Medium 12.5 vs 14;
   PageIndicator counter 14/12 vs 15/13. Opposite directions across components
   indicate mapping accidents, not policy. `tokens/components.css:17-19,106-107`,
   `components/navigation/Tabs.jsx:3-10`, `components/overlay/DropdownMenu.jsx:133`,
   `components/content/Tooltip.jsx:138`, `components/navigation/PageIndicator.jsx:3-8`.
4. **Avatar Company/Academy shape** — WDS gives non-person avatars a
   size-graded rounded-square radius (6/8/10/12/14); LDS renders all variants
   as full circles. Most visible single divergence.
   `components/feedback/Avatar.jsx:152`.
5. **Select ignores the input token set** — 15px value font (WDS 16 = body1),
   15px bold label (WDS 14 semibold), `'0 16px 0 18px'` padding (WDS 12),
   while Input.jsx correctly consumes `--component-input-*`. Select and Input
   visibly disagree in the same form. `components/forms/Select.jsx:76,93,98`.
6. **No `::placeholder` styling anywhere** — WDS placeholder = value color at
   the 0.28 alpha step; `--label-assistive` is documented for placeholders in
   `tokens/colors.css:133` but no `::placeholder` rule exists repo-wide.
7. **Alert platform radii collapsed** — WDS Web r=12 / Android r=16; LDS 8 for
   both; widths 420/360 vs WDS 335/320; title 17px/800 vs WDS 18-20/600.
   `components/overlay/Alert.jsx` platform tables.
8. **Tab spacing model diverges** — WDS: zero item padding, 24px inter-tab
   gap, constant 2px indicator; LDS: padded items (12/16/20), 8px gap,
   size-scaled indicator 2/2.5/3. `components/navigation/Tabs.jsx:54,148-160`.
9. **ListCell typography/metrics** — title 15px/700/lh1.35 vs WDS 16px/400/
   lh1.5; horizontal padding 14 vs 20; slot gap 12 vs 8; selected pattern is a
   tinted row vs WDS accent-text + trailing check; disabled opacity 0.55 vs
   0.43. `components/content/ListCell.jsx:41,139,199-201,82,153`.
10. **Badge geometric scale** — heights −2px across sizes, Medium radius 6 vs
    8, pad-x +2px on S/M, weight 700 vs WDS 500, icon sizes one step down.
    `components/content/ContentBadge.jsx:14-22,119,121`.
11. **SegmentedControl inner geometry** — container radius fixed 12 (WDS
    8/10/12), segment radius 6 (WDS ≈ container), segment pad-x 18 vs 9, track
    pad 4 vs 2-3. `components/selection/SegmentedControl.jsx:39,42,63,69`.
12. **Disabled patterns doubled and inconsistent** — WDS uses discrete
    disabled fills/text tokens with no transparency; LDS combines token fills
    with wrapper opacity that differs per component (0.45 buttons, 0.5
    controls, 0.55 ListCell, 0.62 ChoiceCard, 0.65 inputs). Also solid Button
    disabled text uses the 0.16 step where WDS solid-disabled is 0.28
    (`tokens/components.css:26`).
13. **Divider color roles** — LDS has exact-equivalent tokens (`--line-normal`
    0.22 for normal, `--fill-normal` 0.08 for thick) but Divider uses
    `--line-neutral` 0.16 for both. `tokens/components.css:125-127`.
14. **Outlined-primary Button border** — WDS outlines are always the neutral
    hairline with primary only in the label; LDS draws the border in
    `var(--color-primary)`. `components/buttons/Button.jsx:81`.
15. **Letter-spacing dropped** — components hardcode `letterSpacing: 0` while
    WDS carries positive tracking per size and the exact matching tokens exist
    in `tokens/typography.css:74-85`. Combined with a systematic +1 weight
    step (WDS Medium→LDS bold, SemiBold→bold/extra) this is the main "feel"
    difference; if intentional it should be signed off as the LK typography
    voice, if not it is a one-line fix per component.

## Secondary drift (fix opportunistically)

- Menu shell: radius 12 vs 16; container padding uniform 20 vs WDS 20H/8V.
- Pagination: active page is a filled pill vs WDS text emphasis; item font 14
  vs 15; page-size control r=12 vs WDS chip r=8.
- Category: chip pad-x 8/12/14/16 vs 7/8/11/12; fixed 8px gap vs size-scaled
  4/6/8/10; Large radius 9 vs 10; weight 700 vs 500.
- Tooltip Medium: padding 10×7 vs 12×8 (Small is pixel-exact).
- Checkbox: check glyph 13/11 vs WDS 16/14; label gap 12/8 vs WDS 8/4.
- Textarea: one-off 14×18 padding, 15px font vs Input's tokenized 12px/16px.
- Helper text hardcoded 13px/1.45 vs WDS caption 12/1.33 (token exists) in
  Input/Select/Textarea.
- ChoiceCard frame: WDS always carries a hairline drop shadow at rest and
  16H/4V padding; LDS defaults shadow=none, uniform 16.
- Skeleton radii 6 (text) / 12 (rect) vs WDS 3 both; Card skeleton omits WDS
  rects and fourth line.
- Card: section gaps 12/10 vs WDS 8/6; caption 12 vs 13; save affordance is a
  32px bordered header button vs WDS bare 24/20px thumbnail toggle; overlay
  caption + bottom gradient not implemented.
- Thumbnail: WDS bakes a 1px inside hairline border into every thumbnail;
  LDS defaults `border=false`.
- PageIndicator: dot gaps 8.5/4.5 vs 10/6; "normal" counter surface is an
  opaque light pill vs WDS translucent dark over-media pill.
- Toast/Snackbar: icon 18 vs 22; Snackbar content↔action gap 12 vs 32.
- AvatarGroup: ring 2px vs 1.5px; overlap −30% proportional vs fixed −8px;
  "small"=40 inverts WDS naming.
- Spinner defaults 24/2 vs WDS 28/3.
- Dead tokens: `--component-button-icon-size` (18px, never applied, no per-size
  grading vs WDS 20/18/16), `--component-toggle-icon-bg-hover` (unused).

## LK overrides needing explicit sign-off (not drift)

- Calm hover (no ink overlay) across all interactive components — documented
  in `Button.jsx` header comment.
- Uniform wrapper-opacity disabled convention (if kept, unify the value; see
  drift item 12).
- Typography voice: letter-spacing 0 + one-step-heavier weights (see item 15).
- ToggleIcon re-imagined as a boxed toggle button (WDS is a chromeless 24px
  glyph with a circular halo).
- IconButton default rounded-square (WDS always circular; `round` prop opts in).
- Card as a padded elevated surface (WDS Card is a bare content stack) —
  already documented in Card JSDoc.
- Rest shadow on solid buttons; blur-material surfaces replaced by shadows
  (Tooltip/Toast/Snackbar/Alert scrim).
- MobileSystemBars uses iOS metrics for both platforms; Android 36/14 not
  tokenized (web-delivery rationale, recorded in the coverage closure).

## Faithful areas (verified, no action)

Input field geometry (48/12/12, 8px stack rhythm, label1/body1 slots),
checkbox box (18/16, r5, 1.5px), switch tracks (52×32, ~40×24), segmented
height ladder, Category heights/roles, Tab track hairline + text roles,
PageIndicator counter geometry + dot sizes, Tooltip Small + arrow geometry +
radius, Menu item-height rhythm (48/40/70/62), Toast/Snackbar radius 12,
badge solid/outlined roles, avatar size ladder + deactivate pattern, ListCell
padding tiers + press pattern, divider/track hairline roles, skeleton fill
roles, and the entire alpha-role color architecture.

## Recommended order of work

1. ~~Define `--component-transient-feedback-bg`~~ — done in this audit.
2. Decide the two policy questions (letter-spacing/weight voice; disabled
   convention). Every later fix depends on which way these go.
3. Fix the mapping accidents that produce visible inconsistency between
   sibling components: font-size step errors (item 3), Select↔Input token
   unification (5), Radio treatment (1), Button size grading (2).
4. Batch the secondary geometry corrections per component family, updating
   `tokens/components.css` first so fixes stay token-driven.
5. Re-run `npm run check:visual` and the visual-diff pipeline after each batch.
