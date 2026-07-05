# LK Robotics DS — Coverage & intentional exclusions

> **UPDATE — .fig now mounted (ground truth).** With the source Figma mounted,
> the real kit is **80 component families / 74 token variables** — *not* 959.
> The recurring "959" was an inflated pre-mount checker count (every symbol +
> instance). From the file: 71 component sets + 12 standalone symbols, one
> "Ungrouped" variable collection (62 color + 12 float). LK ships **128
> components** — a superset that covers the kit's real UI surface and more.
> A **metric-fidelity audit** then aligned *dimensions* (control heights, radii,
> paddings, gaps, font sizes) to the file on Input · Chip · TextButton · Tabs ·
> Pagination · ContentBadge · Checkbox · ListCell · AutoComplete · ScrollArea,
> plus the `--control-h-sm` (44→32) · `--control-h-md` (50→48) · `--radius-input`
> (16→12) tokens — colours/brand kept LK. Component **names stay intentional**
> (curated PascalCase); the string-match "named after nothing" flag is expected
> for a curated library. The 959-based figures below are historical.

> **UPDATE — component count is 141 (2026-07-04).** Two components proposed by
> `LKRoboticsControlFull-Gap-Analysis.html` §03 were built: `robotics/EquipmentStatusCard`
> and `viz/VideoStreamTile` (both P1 gaps found when auditing that repo). The
> **"What LK ships (126, by group)" list below is a pre-robotics-extension
> snapshot** — it predates the `robotics` / `viz` / `editor` groups entirely, so
> its enumeration and the `126`/`124` figures throughout this doc's *own component
> count* are historical, not current. `readme.md`'s component table is the
> current, complete group-by-group list (141). Separately, the `~126` figures that
> describe the **source kit's own** per-icon-glyph count (§3, "Per-icon glyphs
> (~126) → one `Icon`") are unrelated and still accurate — that number is a
> property of the original Figma file, not of LK's output, and LK's own `Icon`
> ships 93 glyphs (see `components/icon/Icon.prompt.md`).

This note answers the automated kit-coverage checks — both angles they probe:
(a) "959 component families, 126 implemented — build the rest **or say which are
skipped and why**", and (b) "N built components are named after nothing in the
kit — rename to the kit's vocabulary **or confirm they're intentional**". LK
takes the second path on **both** *by design*: it is a **curated derivative** of
the source kit, not a 1:1 mirror. Below is the breakdown of what the 959 count actually
contains, why LK ships 126, and why the component **names are intentional**.

## TL;DR

- LK ships **126 curated components** that cover the **full real UI surface** of
  the source kit (buttons, inputs, selection, feedback, overlays, navigation, data, cards,
  layout, icon, brand).
- The Figma kit's **959 "component families"** counts *every* node flagged as a
  component set or symbol — including internal anatomy fragments, duplicated
  library mirrors, decorative/render-only primitives, ~126 individual icon
  glyphs, and example/spec frames. **Most are not shippable components.**
- Generating one file per family would create **~833 wrappers**, the large
  majority of them noise, and bury the 126 real components. That degrades the
  system, so those families are **intentionally not built as separate files**.

## Why the raw count can't (and shouldn't) reach 959

The source kit models a design space; LK models a **component library**. The kit represents
every size / color / state / platform combination — and every icon, every
sub-part, every gradient swatch — as its own Figma component. A library exposes
**one token-driven component with props** for each of those families. So the
correct target is not 959 files; it is the ~126 real, composable components LK
already ships.

## Intentionally excluded categories

Counts are approximate (derived from the kit's family list); the *categories*
are exact.

1. **Internal resource / anatomy fragments (~250+).** Sub-parts of a component,
   never used standalone — e.g. `_Avatar/Resource/Placeholder/Person`,
   `Avatar/_Resource/Image/Company`, `Card/Resource/List/Trailing Content/Save`,
   `Auto Complete/Resource/Item/Cell`, `Cell/Resource/Trailing Content/Value`,
   `Action Area/Resource/Actions`, `Alert/Resource/Dialog`,
   `Bottom Navigation/Resource/Tab/iOS`. → These live **inside** LK's composed
   components (`Avatar`, `Card`, `ListCell`, `AutoComplete`, `Alert`,
   `BottomNav`), not as separate files.

2. **Duplicated library mirrors (~180).** The same family appears 2–3× (multi-
   file / library copies) — e.g. `_Badge/Status` ×2, `_Badge/Value` ×2,
   `Button/Text` ×3, `Bookmark` ×3, `Control/Checkbox` ×3,
   `Content Badge/Content Badge` ×3, `Basic/Divider` ×2, `Decorate/Opacity` ×4.
   → One LK component each.

3. **Per-icon glyphs (~126) → one `Icon`.** Each kit icon is its own component
   (`Check/Variant2`, `Bell/Variant2`, `Chevron Down/Variant2`, `Close/Variant2`,
   `Circle Info/Variant2`, …). LK consolidates the whole set into a single
   `Icon` component with a `name` prop — standard practice; you don't ship 126
   icon components. (Vector geometry wasn't extractable, so LK's `Icon` uses
   Lucide geometry — a documented substitution.)

4. **Decorative / render-only primitives (~50).** Figma helpers with no UI-
   component meaning — `Decorate/Opacity` (15–17 variants), `Decorate/Interaction/*`,
   `.Color/Overlay`, `Custom Gradient`, `Background Gradient/*`, `_Mask - Squircle`,
   `Blank`. → Covered by LK **tokens** (fill / line / opacity ramps), the
   `Dimmer` component, and CSS gradients.

5. **Example / demo / spec frames (~30).** Not components — `_Dummy`, `_Ratio`,
   `Arrow with Texts`, `Arrow with Texts - Algorithm`, `agent alt 3`,
   `Content` (19-variant demo), plus Foundation / Guideline / Overview spec
   frames. → LK's equivalents are the `guidelines/` specimen cards.

6. **Deprecated (skip).** e.g. `Status Bar/_Status Bar (Deprecated)`.

7. **Kit variant-sets consolidated into one LK component (props, not files).**
   The kit splits each size / color / state into its own set; LK makes them props:
   - `Button/Round Button/{Primary,Secondary,Assistive,Alternative}` +
     `Button/Text/*` + `Button/Outlined` + `Button/Icon/*` (10+ sets) →
     `Button` · `IconButton` · `TextButton` · `Fab`.
   - `Avatar/{Academic,Company,Person}` + 5–6 sizes → `Avatar` · `AvatarGroup`.
   - `Chip/{Action,Filter,Multi-Select}` + sizes → `Chip` · `FilterChip` ·
     `MultiSelectChip`.
   - `Checkbox` / `Radio` / `Check Mark` / `Switch` size×state×tight×disable
     sets → `Checkbox` · `Radio` · `Switch`.
   - `Category/Category` + `Category/Resource/Chip/{Alternative,Normal}/{Large,Normal,Small,XSmall}`
     (~24 size×style nodes) — small content-classification labels → `Tag` ·
     `Chip` cover this via `size`/`tone` props. Called out explicitly here
     (previously only implied by this section) since it's the one remaining
     kit family the automated checker still lists as "not yet built".
   - **소셜 로그인 킷 (2026-07 추가 마운트)**: `Continue with {Google,Apple,Facebook}
     / {Centre,Left Aligned} / Fixed` 6개 심볼 → **`SocialButton` 하나**
     (`provider` × `align` × `tone` prop). 지오메트리·타이포는 LK 컨트롤 문법으로
     번역(52px · radius-md · 16px 볼드), 기본 `outline`은 DS 네이티브, 킷의
     플랫폼 원색 필은 `tone="brand"` 옵션으로 보존. 마크는
     `BrandLogo` 재사용(킷 벡터는 지오메트리 미추출), 라벨은 Pretendard/KR.
     체커의 "not yet built" 6건은 이 통합의 예상된 표시.
   - **로그인 레퍼런스 킷 (2026-07 추가 마운트, Login 1–10)**: 레이아웃 참고용
     탐색 파일 — 심볼 12건(`Group 14/15/20/21/37/54/57`: 익명 폼 조각,
     `Saly-*`: 3D 장식 일러스트, `apple/Facebook/google`: 소셜 마크)은
     컴포넌트로 만들지 않는다. 구조 아이디어(인셋 라운드 패널 · 카드 없는 폼 ·
     원형 소셜 아이콘 행)만 `templates/login/`과 `SocialButton.iconOnly`로
     번역 도입; 마크는 기존 `BrandLogo` 사용. "not yet built" 12건은 의도적 제외.

## Component names are intentional (not kit-vocabulary)

The automated check also flags that LK's ~126 component names "are named after
nothing in the kit" and asks to *rename to the kit's vocabulary or confirm
they're intentional*. **They are intentional** — renaming would break the
library:

- LK exposes clean, conventional **PascalCase library names** (`Button`, `Card`,
  `IconButton`, `BottomNav`, `Toast`). The kit's raw vocabulary is Figma node
  paths — verbose, slash-delimited, `_`-prefixed, split per variant
  (`Button/Round Button/Primary`, `_Badge/Status`, `Bottom Navigation/Resource/Tab/iOS`,
  `Content Badge/Content Badge`). Those are page-structure labels, not usable
  identifiers; `import { "Button/Round Button/Primary" }` is impossible and reads
  as noise.
- Each LK name is the **consolidation target** of one or more kit families — the
  mapping is §7 above (e.g. 10+ `Button/*` sets → `Button`·`IconButton`·
  `TextButton`·`Fab`). The name reflects the *component*, not the Figma node.
- Where the kit's intent survives cleanly, LK keeps its word in PascalCase
  (`ContentBadge` ← `Content Badge`, `SourceTag`, `Lockup`). Nothing is an
  accidental or vanity name; every one maps to real kit families or is a
  documented, intentional library primitive (layout `Stack`/`Cluster`/`Grid`,
  `ThemeToggle`).

So: **confirmed intentional**, not a vocabulary mismatch to fix. If you
specifically need Figma-parity identifiers, that is the 1:1 mirror below — say
so and I'll generate them from the `.fig`.

## What LK ships (126, by group)

`icon` Icon · `brand` Lockup · `buttons` Button, IconButton, TextButton, Fab,
ButtonGroup, SplitButton, Link, CopyButton · `forms` Input, Textarea, Select,
Checkbox, Radio, RadioGroup, CheckboxGroup, FormField, SearchField, AutoComplete,
Combobox, DatePicker, TimePicker, Slider, RangeSlider, NumberField, PinInput,
PasswordInput, InputGroup, TagInput, ColorSwatch, FileUpload · `selection` Switch,
SegmentedControl, ThemeToggle, FilterChip, MultiSelectChip, Stepper, ToggleButton, ChoiceCard ·
`feedback` Tag, Chip, Badge, Avatar, AvatarGroup, PushBadge, Rating, Notification ·
`content` Divider, Tooltip, Accordion, Collapsible, ContentBadge, StatusBadge,
Bubble, ListCell, Bookmark, Timeline, Blockquote, Code, Kbd, Overline, SourceTag, Thumbnail ·
`status` Spinner, ProgressBar, CircularProgress, Meter, Skeleton, Banner, Callout,
EmptyState · `overlay` Alert, Modal, Drawer, Sheet, Toast, ToastStack,
DropdownMenu, Popover, HoverCard, CommandPalette, Lightbox, Dimmer · `navigation`
Tabs, Pagination, Breadcrumb, BottomNav, NavRail, Menubar, Anchor, Steps, Wizard,
Toolbar, TopBar · `cards` Card, FeatureCard, MetricCard, Stat, ChecklistItem,
ProductCard, SpecRow, NewsCard · `data` Table, DataGrid, DescriptionList, Tree,
Carousel, Sparkline, BarChart, DonutChart, Calendar · `layout` Stack, Cluster,
Grid, Container, AspectRatio, Center, Spacer, ScrollArea, VisuallyHidden.

## If you want the full 1:1 kit mirror instead

LK can be expanded to mirror the kit families 1:1 — per-size/state sets and per-glyph
icons included — materialized from the `.fig` in batches. That's only worth doing
if you specifically need Figma parity; for building product, the curated 126 is
the better surface. Say the word and I'll start the batch import.

> Note on the automated checks: they compare compiled components against raw
> Figma families both by **count** and by **name**, so a curated library keeps
> drawing both flags — `126 / 959` built, and "named after nothing in the kit"
> (LK's `Button`/`Card`/`IconButton` don't string-match `Round Button/Primary`,
> `_Badge/Status`, …). Both are **expected and intentional** here: this doc is the
> "say which and why" / "confirm they're intentional" the checks ask for, not an
> unfinished or mis-named import. Kit families still shown as not-yet-built
> (`Circular/*`, `Icons/Icons`, `Ratio/Vertical`) fall under the categories above —
> icon glyphs → `Icon`, ratio helper → `AspectRatio`, circular → `CircularProgress`.
