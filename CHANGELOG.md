# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

## 0.1.0-rc.67.1 - 2026-08-09

Interim vendor drop from branch `chat-message-identity-actions` (built on rc.67 HEAD `6fea1752`, excluding the concurrent uncommitted worktree changes). Fold into the next full rc when the release line settles.

### Added

- `ConversationMessage identityVisibility="hidden"`: 정렬과 fill이 이미 화자를 말하는 표면(2자 대화의 outbound solid primary bubble 등)에서 작성자 행을 시각적으로만 숨깁니다. 접근 가능한 이름(author + 역할명)은 유지되고, grouped `middle | last`의 기존 숨김 동작은 그대로입니다.
- `ConversationMessage messageActionsVisibility="on-demand"`: 액션바를 opacity 0으로 쉬게 하고 hover 또는 focus-within에서 드러냅니다. 레이아웃 행과 접근성 트리는 유지되어 reflow가 없고, hover가 없는 coarse pointer와 실패 턴의 retry 바에는 적용되지 않습니다.

## Unreleased

- 기업 표기형의 `주식회사 엘케이로보틱스`를 Noto Sans KR ExtraBold 800 v2.004-H2, 자간 0.105em, 균일 스케일로 규정했습니다. 원본 가변 TTF·라이선스 해시와 `wght=800` 글리프·배치 골든 메트릭을 생성기에서 검증하고 기업 표기형 최소 디지털 크기를 160px로 고정합니다.

Repository-wide accessibility and convention sweep across the Core (55 areas) and Product (69 areas) layers, audited against WAI-ARIA APG, WCAG 2.2, and current industry systems, with every fix pinned by a hidden contract story. 481 stories are Axe-clean with 262 play contracts.

### Added

- 재현 가능한 LK ROBOTICS 로고 제작 규정을 추가했습니다. `ROBOTICS`는 해시로 고정한 Montserrat ExtraBold 800 v7.222와 기본 커닝·자간 0·균일 스케일에서 path로 생성하며, `check:brand`가 글꼴·라이선스·15개 배치용 SVG와 1개 시각 기준판(총 16개 생성 SVG)·런타임 윤곽의 드리프트를 차단합니다. 시각 기준판과 construction manifest는 package에 배포하지 않습니다.
- LK 심볼 geometry v1.0의 정규화 비율, 보호 여백, variant 선택, 최소 크기, 배경·단색·금지 사용, 공동 브랜딩, 인쇄 proof와 변경 승인 절차를 `docs/brand`의 브랜드 표준과 기계 판독 governance record로 고정했습니다. 별도 small-use redraw와 공식 CMYK/Pantone은 근거가 생기기 전까지 미승인 상태로 유지합니다.
- 같은 정본 SVG와 SHA-256에서 Figma 수동 import 명세, iOS vector imageset, Android fixed-color VectorDrawable, Web integrity manifest를 만드는 결정적 플랫폼 자산 계약을 추가했습니다. 이 계약은 live sync, 실제 제품 채택 또는 스토어 승인을 주장하지 않습니다.
- LK Web Viz, LK Control Full Daedeok, LK Context Hub의 실제 로고 소비 source를 commit·blob SHA로 고정하는 `check:brand-products`를 추가했습니다. Web Viz와 Control은 migration required, Context Hub의 `Lockup` 20px 합성은 contract-compatible이지만 최신 package upgrade가 필요합니다.
- 승인 제품 워드마크 `PORTAL`과 `Lockup variant="portal"`을 추가했습니다. 회사 워드마크와 같은 고정 글꼴·제작 규정·대문자 문법을 쓰고, 마크와의 간격만 `0.35X`입니다(`inline`의 `0.2X`는 20px 렌더에서 K 사선과 P가 붙어 한 단어로 읽혔습니다). 최소 크기 보정·intrinsic width·viewBox 검증은 회사 변형과 같은 계약을 받으며, 생성 출력 계약에 `portalInstances` 축이 추가되어 제품 워드마크가 회사 자산으로 새지 않도록 모든 출력이 명시적으로 0을 주장합니다.
- `AutoComplete startIcon`으로 컨트롤 앞에 아이콘을 놓을 수 있습니다. `SearchField`가 이미 쓰는 `startIcon` 슬롯과 같은 자리이며, 값이 채워져 `placeholder`가 사라진 뒤에도 그 칸이 목록을 뒤진다는 사실을 남깁니다. 기본값은 없으므로 기존 화면은 그대로입니다.
- `DataToolbar.filters` render context: `filters={({ size }) => ...}`가 검색과 같은 `sm`/`md` field control 밀도를 전달하며 기존 ReactNode 슬롯은 호환됩니다.
- `DashboardShell`에 계층형 좁은 화면 탐색을 위한 controlled `temporaryNavigation` Drawer 계약을 추가했습니다. 공용 modal 엔진의 스크림·focus containment·Escape·복원·scroll lock을 재사용하고 열린 동안 셸 배경을 `inert` 처리합니다.
- `SideNav autoExpandActiveGroup={false}`로 활성 route 표시와 disclosure 자동 펼침을 분리할 수 있습니다. 기본값 `true`는 기존 동작을 보존합니다.
- `SideNav appearance="brand"`을 추가했습니다. 브랜드 네이비(`--color-semantic-brand-surface`, `#05132B`) 평면 셸과 rest·hover·active·pressed·focus 색 역할을 컴포넌트 토큰으로 제공하며, 기존 `default` 외형과 `surface` geometry·ARIA 동작은 그대로입니다. 셸 표면에 그라데이션을 쓰지 않으므로 표면 색 변화가 상태 신호의 색 예산을 잠식하지 않고, 로고 자산이 설계된 네이비와 같은 값이라 화이트 lockup이 그대로 올라갑니다.
- `StatusIndicator` Core 컴포넌트: 실시간 가용성·연결·freshness를 6px semantic dot과 필수 visible label로 표시하며, 실제 변화 중인 신호에만 reduced-motion-safe `pulse`를 명시합니다.
- `RecordHeader` Product Extension for person, robot, order, and other record identity: optional visual, required record title, badge, description, details, actions, composable heading level, and 320px action reflow.
- Scroll-surface governance: `check:scroll-surfaces` enforces the native default, standardized compact opt-in, forced-colors fallback, and explicit reasons for the only hidden-scrollbar exceptions; Storybook Axe now includes `scrollable-region-focusable`.
- Cross-repository contract governance for the editor/viz/robotics seam: `check:robotics-contract-drift` compares this repository's `.prompt.md` contracts against the implementations in the external Robotics repository (ratcheted via `docs/references/robotics/CONTRACT_DRIFT_BASELINE.json`), and `check:robotics-semantics` resolves type/story paths across both checkouts instead of failing on the split.
- `Table` semantics: `caption`, `tableLabel`, `tableLabelledBy`, `rowHeaderKey` (renders `<th scope="row">` at unchanged pixels), and `getRowId`. Column headers always carry `scope="col"`.
- Form autofill contracts: `PasswordInput autoComplete` (default `current-password`) with Caps Lock warning (`capsLockLabel`), spell-check/auto-correct suppression, and re-masking on form submit; `PinInput autoComplete` (default `one-time-code`) with full-code distribution across cells, `charset` filtering, `invalid`, and Arrow/Home/End cell navigation.
- `NumberField label/helper/error/invalid/fieldStyle` via the shared field metadata engine, plus a draft-edit model: typing may hold out-of-range values and clamping happens on commit (blur/Enter/steppers).
- `Calendar` Shift+PageUp/PageDown year navigation; `DatePicker invalid` (trigger `aria-invalid` + negative border) and focus-out close; `DateRangeField` feeds the start date as the end calendar's `minDate`.
- `Carousel` APG contract: `role="region"` + `aria-roledescription="carousel"`, per-slide `group`/`slide` roles with "N / 전체" labels, offscreen slides removed from the tab order via `inert`, opt-in `autoPlay` with a pause control and hover/focus suspension, and Korean control labels (all overridable).
- `Lightbox` slide announcements through a persistent polite region, visible position indicator, Korean `closeLabel`/`previousLabel`/`nextLabel`/`positionLabel`, and controls that stay mounted (`aria-disabled`) while an image loads.
- `LogViewer` follow-mode announcements (`announceNewLines`): only newly arrived lines are announced while tailing, the virtualized container is keyboard-scrollable with an accessible name, and copy results are announced.
- `Rating` rewrite: interactive mode is an APG slider (single tab stop, Arrow/Home/End, `aria-valuetext` "5점 만점에 N점"), read-only mode is `role="img"` named by its value, with `label`/`valueText` props. Fractional values fill by floor instead of rounding a 4.5 up to five stars.
- `ColorSwatch` rewrite as a `radiogroup`: roving tabindex, four-direction Arrow navigation, per-option labels/disabled, and a non-color selection cue (check glyph + halo) closing the WCAG 1.4.1 gap.
- `ChecklistItem stateLabel` (visually hidden 포함/제외 text) and `as` for list semantics; `SpecRow` renders `dl`/`dt`/`dd` with a `grouped` mode for composed spec tables.
- `FeatureCard`/`NewsCard`/`ProductCard` inherit the Card improvements: real headings with `headingLevel`, keyboard activation for interactive cards, links named by their headline instead of the full card text, and focus-visible affordances matching hover.
- `ResourceState headingLevel` (ChartFrame passes its own level + 1); `Fab type`; `TimePicker` labelled group; `WheelPicker` type-ahead and settle-commit (one commit per drum stop instead of per scroll frame); `IconPicker` grid-aware 2D keyboard movement with a single tab stop; `PropertyField`/`InputGroup` label and describedby wiring with consumer `onChange` passthrough.
- 44 hidden contract stories pinning the keyboard/ARIA/live-region contracts above; inventory grew to 481 implementation stories (public surface unchanged at 335).
### Fixed

- 브랜드 SVG `viewBox` 직렬화가 `Array.map`의 index를 소수점 정밀도로 잘못 전달해 일부 좌표를 반올림하던 문제를 고쳤습니다. mark·favicon까지 단일 생성기 inventory에 포함하고 모든 path가 viewBox 안에 있는지 검증해 inline 로크업의 잘림·overflow 회귀를 차단합니다.
- `SideNav`의 접힌 레일 행이 38px, 펼친 행이 44px이고 브랜드 아래 패딩도 10/18px로 달라 overlay peek 때 목적지가 세로로 이동하던 문제를 고쳤습니다. 두 상태는 44px 행과 같은 브랜드 아래 패딩을 공유합니다.
- `DataToolbar size="md"`가 48px field형 필터 옆 검색만 40px로 축소하던 문제를 고쳤습니다. 기본 검색은 다시 48px field 척도를 사용하고 `filters` render context로 같은 밀도를 전달합니다.
- `Calendar` could not leave the selected month: the view snapped back on every render, disabling previous/next, PageUp/PageDown, and month-boundary arrows (also through `DatePicker`). The displayed month is now owned by user navigation, and the header buttons keep focus so they can be pressed repeatedly.
- `CopyButton` reported "복사됨" even when the clipboard write failed; failures now render and announce a distinct error state through an always-mounted status region.
- `HoverCard` could not be dismissed with Escape: restoring focus to the trigger re-fired the open-on-focus rule and reopened the card. The shared dismiss engine now latches the trigger until focus actually leaves, which also hardens `Tooltip` and `Popover`.
- `ProgressBar` and `CircularProgress` ignored `prefers-reduced-motion` because the sweep/rotation is an inline style; the override now declares `animation: none !important` (same fix Skeleton/Spinner received).
- `TreePicker` regression from the native Checkbox rewrite (`aria-hidden` around a focusable input): the row indicator is now a purely decorative element that replicates the Checkbox visuals, so no form control exists inside the tree.
- `NumberField` clamped on every keystroke (typing 25 under max 20 or clearing the field was impossible) and remounted its steppers on each render, dropping focus mid-interaction.
- `Tooltip` bubbles no longer grow a scrollbar at their preferred size, and the arrow stays attached to the bubble edge while leaning toward the trigger when an edge-aligned bubble is shorter than its target (`check:tooltip-alignment` now guards attachment per axis).
- `PageHeader` pushed its actions below the description on ordinary desktop panes; the title-row wrap threshold dropped from 32rem to 18rem so page actions stay title-aligned until genuinely narrow layouts.
- Conditionally mounted live regions across `DataExportAction`, `FilterBar`, `SavedViewControl`, `MessageComposer`, `MessageFeed`, and `CommandPalette` are now persistently mounted so assistive technology hears every transition; `CommandPalette` also moved "결과 없음" out of the listbox (axe `aria-required-children`) and gained two-stage Escape (clear query, then close).
- End-of-range focus loss when a control disables itself after activation: `ReorderList` move buttons, `DataExportAction` export, `FileBrowser` up-navigation, and the `MessageComposer` stop control keep or hand off focus instead of dropping to `<body>`.
- Core-layer sweep: `Checkbox`/`Switch` are native inputs wrapped in labels (pixel-identical), `Dimmer` makes covered content `inert`, `Alert` exposes `alertdialog`, `Toast`/`Snackbar` use persistent live regions with duration/pause contracts, `DropdownMenu` drill re-entry no longer loses the first keystroke and typeahead accumulates multi-character queries, `Icon` is decorative by default, `ContentBadge` solid fills meet AA via status text tokens, and `IconPicker`'s empty-state text meets contrast (was 1.67:1).

### Changed

- LK 심볼은 기존 커스텀 벡터를 유지하고 `ROBOTICS`는 규정된 Montserrat ExtraBold 800 아웃라인으로 교체했습니다. 모든 사각·stacked·inline·banner 자산과 React `Lockup`/`Spinner`가 같은 생성 원본을 공유하며, UI 본문 글꼴은 Pretendard로 유지합니다.
- `Lockup`은 variant별 정책 최소 높이, 실제 `viewBox` 기반 intrinsic width, 비율을 유지하는 반응형 축소를 적용합니다. 제약된 검정 단색 출력은 기존 `tone="current"`와 명시적 `color="#000000"` 조합으로 표현합니다. 좁은 슬롯에서는 overflow 대신 함께 축소되므로, 생성된 최소 슬롯 폭 계약을 확보하거나 `inline`/`stacked`에서 `mark`로 전환해야 합니다. 유효하지 않은 variant fallback은 진단 metadata로 노출됩니다.
- `StatusBadge`는 dot과 pulse를 제거하고 20px soft semantic pill + 명시적 상태 라벨로 재설계했습니다. 진행·마감·게시·검토 같은 lifecycle/result 상태는 StatusBadge가, 실시간 연결 신호는 StatusIndicator가 소유합니다.
- `PageHeader` is now limited to page context and task actions; record/profile identity moved to `RecordHeader` and the former `avatar` prop was removed.
- `ScrollArea` now preserves the OS/browser scrollbar by default, exposes `scrollbar="compact"` only for constrained surfaces, reserves a stable gutter by default, and no longer injects a hard-coded 7px WebKit scrollbar. Shared scroll consumers use the same contract; SideNav, Tabs, and Category no longer hide overflow indicators.
- `ResourceState messageVariant` now defaults to `standalone`, so a preserved-data message rendered outside a card or panel keeps its own perimeter and radius. Container compositions must opt into `messageVariant="embedded"`; `ChartFrame` and the Resource State card examples do so explicitly.
- `BrandLogo` is decorative by default and exposes `role="img"` only with an explicit `aria-label`/`title`, eliminating double announcements such as "google logo Google로 계속하기" in `SocialButton`.
- `ButtonGroup` no longer injects the generic default group name '보기 또는 모드 선택'; missing names warn in development builds.
- `Meter` exposes `role="meter"` with values in the caller's units, and threshold bands announce and render a word (위험/주의/양호, overridable) instead of relying on color alone.
- `SpeedDial` renders trigger-then-actions in DOM order (visual stacking unchanged via `column-reverse`) and restores focus to the trigger on Escape or action activation.
- `Bubble` is scoped to non-conversational annotations; chat surfaces belong to `ConversationMessage`/`MessageFeed`.
- Visual baselines updated for the intended changes only: dashboard-shell header (Korean eyebrow + RefreshControl + change tone), card titles as real headings, the new ActionArea sticky-footer tile, tooltip arrows now attached, and ColorSwatch selection checks. Checkbox/Switch scenes are pixel-identical to their pre-rewrite baselines.

### Migration

- `StatusBadge pulse` 사용은 `StatusIndicator pulse`로 옮기세요. 단순 `StatusBadge tone` 사용은 API 변경 없이 새 tinted presentation을 받으며, 실시간 가용성·연결·freshness만 StatusIndicator로 교체합니다.
- Replace `PageHeader avatar={...}` profile or record compositions with `RecordHeader visual={...}`; move verification/status to `badge`, profile stats to `details`, and keep page breadcrumb/context in a separate `PageHeader` only when the screen needs both.
- `ResourceState`: add `messageVariant="embedded"` when the component is intentionally flush with a parent card or panel. No change is needed for independent placements; they now receive the safer `standalone` presentation by default.
- `BrandLogo`: pass `aria-label` (or `title`) where the logo itself is the information; compositions like `SocialButton` need no change.
- `ButtonGroup`: provide a purpose-specific `aria-label`; the silent generic default is gone.
- `Meter` consumers targeting `role="progressbar"` should target `role="meter"`; `aria-valuenow` is now in caller units rather than a 0–100 projection.
- `Rating` interactive usages render a slider control; keyboard and announcement behavior is new, `value` semantics are unchanged, and half-star rendering was never real — floor fill is now explicit.
- `Bubble` chat usages should move to `ConversationMessage`/`MessageFeed`.

## 0.1.0-rc.69.4 - 2026-08-10

### Added

- `FeatureCard tone="moss"`를 추가했다. `steel`(#336CA1)은 `signal`(#3878B3)과 같은 파랑 계열이라 카드 셋 이상을 나란히 두고 색으로 구분할 때 사실상 한 색으로 읽힌다. `amber`와 같은 파생 규칙(accent 전경 + 전경색 14% 틴트 배경)으로 초록 색상축을 제공한다.

### Changed

- 승인 제품 워드마크를 title-case `Portal`에서 대문자 `PORTAL`로 바꾸고, LK 심볼과의 간격을 심볼 보이는 폭의 0.2배에서 0.35배로 넓혔다. 회사 락업(`LK ROBOTICS`)과 대소문자 문법을 맞추고, 20px 사이드바 렌더에서 0.2배(약 3.8px)일 때 K 사선과 P가 붙어 한 단어로 읽히던 문제를 해소한다. 글리프 핀과 잉크 경계는 대문자 기준으로 갱신했다.

## 0.1.0-rc.69.3 - 2026-08-10

### Changed

- `ConversationMessage`의 quick action·retry 아이콘 평시 톤을 label-normal에서 `label-alternative`(같은 컴포넌트의 메타 아이콘 톤)로 낮췄다. 본문과 같은 진한 톤은 읽기 흐름과 경쟁한다(ChatGPT·Claude의 muted 액션 관례). pressed 상태를 갖는 `ToggleIcon` 액션은 자체 팔레트를 유지한다.

## 0.1.0-rc.69.2 - 2026-08-10

### Added

- `ListCell selectedPresentation="tint"`: 체크·액센트 없이 중립 fill만 지속시키는 selected 표시 값. 기본 `accent-check`(WDS 선택 패턴)는 "여럿 중 하나 고름"의 시맨틱이라, 대화 목록·내비게이션처럼 "지금 열려 있는 항목"을 표시하는 목록에서는 체크가 선택 과업으로 오독된다. aria/키보드 계약은 변하지 않는다.

## 0.1.0-rc.69.1 - 2026-08-10

### Changed

- `MessageFeed` comfortable 밀도의 세로 viewport 패딩을 12px에서 24px(`--space-6`)로 올렸다. comfortable은 읽기 밀도인데 세로 인셋만 임베드 패널 값에 머물러, 전체 높이 표면에서 첫 턴이 창 상단에 붙었다. compact(8px)는 그대로다.

## 0.1.0-rc.69 - 2026-08-10

### Added

- `ConversationMessage`, `MessageFeed`, `MessageComposer`에 기본 렌더링을 보존하는 additive `density="compact"` 축을 추가했습니다. 좁은 대화 패널은 24px avatar slot, 16px message gap, 40px 한 줄 작성기를 사용할 수 있으며 typography, DOM/ARIA, 32px primary action은 유지됩니다.
- `Popover`와 `DropdownMenu`에 `collisionBoundary`/`collisionPadding`을 추가했습니다. owner-document Portal은 그대로 사용하면서 viewport와 지정 container의 교집합 안에서 flip, shift, max width/height를 계산합니다.
- 460px, 360px, 296px의 짧은 대화 열에서 추가·출처 메뉴, 읽기 전용 안내, 응답 방식 설정을 실제로 여닫는 Storybook 조합과 키보드·focus return·reflow 계약을 추가했습니다.

### Fixed

- compact `MessageComposer`의 32px utility·send/stop action radius를 12px로 맞춰 16px shell 안쪽 모서리 마감을 일관되게 했습니다. comfortable의 기존 8px primary radius는 변하지 않습니다.
- 지정한 `collisionBoundary` 안에서 세로 스크롤바가 생긴 Popover·DropdownMenu의 위치 계산이 콘텐츠 폭을 외곽 폭으로 오인해 우측 여백을 침범하던 문제를 고쳤습니다. 실제 border-box와 scrollbar gutter를 포함해 padded boundary 안에 유지합니다.

## 0.1.0-rc.68.2 - 2026-08-09

### Added

- `Select render="chip-trigger"`: 트리거 전체를 보더 없는 단일 알약(칩)으로 그리는 표시 값. 기존 `chip`(선택 값을 트리거 안 캡슐로 강조)과 달리 인풋 크롬과 캡슐이 겹치는 이중 표면을 만들지 않으며, 작성창 동작 띠처럼 폼 필드가 아닌 자리의 옵션 컨트롤용이다. 포커스 링·invalid 보더·키보드/ARIA 계약은 기존 필드와 동일하다.

## 0.1.0-rc.68.1 - 2026-08-09

### Added

- `ConversationMessage identityVisibility="hidden"`: 정렬과 fill이 이미 화자를 말하는 표면(2자 대화의 outbound solid primary bubble 등)에서 작성자 행을 시각적으로만 숨깁니다. 접근 가능한 이름(author + 역할명)은 유지되고, grouped `middle | last`의 기존 숨김 동작은 그대로입니다.
- `ConversationMessage messageActionsVisibility="on-demand"`: 액션바를 opacity 0으로 쉬게 하고 hover 또는 focus-within에서 드러냅니다. 레이아웃 행과 접근성 트리는 유지되어 reflow가 없고, hover가 없는 coarse pointer와 실패 턴의 retry 바에는 적용되지 않습니다.

## 0.1.0-rc.68 - 2026-08-09

### Added

- `DrawerSection` provides a semantic Drawer-body subsection with a required title, optional description and actions, configurable heading level, optional divider, and density-aware section rhythm.

### Changed

- Drawer body now establishes an internal, bounded density scope. With `density="compact"`, eligible `Input`, `Select`, `Textarea`, `Checkbox`/`CheckboxGroup`, `Radio`/`RadioGroup`, `ChoiceCard`, `Callout`, `FileUpload`, and `SecretField` descendants resolve their existing compact axis when the corresponding prop is omitted; explicit `size`, `padding`, or `density` always wins, and `comfortable` output remains unchanged.
- The scope does not reach Drawer header or footer chrome. `Button` does not consume inherited density and `LdsProvider` gains no density setting, so the close control and footer actions keep their established target and `md` sizing.

### Fixed

- `Radio` keeps a minimum 24×24 CSS px native pointer target at compact density without enlarging its visual glyph, matching the existing Checkbox target contract.

## 0.1.0-rc.67 - 2026-08-09

### Added

- `Card density="compact"` adds an opt-in 16px desktop information surface with tighter internal spacing while preserving `comfortable` as the default, explicit `padding` precedence, the existing mobile platform contract, typography, semantics, and interaction.
- `FeatureCard density="compact"` adds an opt-in launcher density with 16px boxed padding, 12px group spacing, a 40px icon tile, and unchanged title/body typography.
- `RecordHeader size="sm"` adds a compact record-identity header aligned with the existing small `PageHeader` scale while preserving heading level, description/details typography, DOM order, and actions.

## 0.1.0-rc.66 - 2026-08-09

### Added

- `Drawer density="compact"` adds an explicit product-form density for tighter header, body, and footer chrome while keeping `comfortable` as the backward-compatible default. Child control sizes remain application-owned.

### Fixed

- `ChoiceCard padding` now applies to the selectable presentation as documented, and its title and description use explicit line-height utilities so overlay typography cannot inflate card geometry.

## 0.1.0-rc.65 - 2026-08-09

### Fixed

- `model` 아이콘을 Material Symbols `deployed_code`의 FILL=0 원본으로 교체했습니다. 획 두께 2.25 · 잉크 26.8%로 base 외곽선 중위값(2.25)과 같고, 손으로 그린 판보다 꼭짓점 처리가 정확합니다 — 직접 그린 판은 이음매를 축에 맞춘 정사각형으로 덮어 위·아래 꼭짓점이 벌어져 있었습니다. 소비자가 볼 수 있는 변화는 그 두 꼭짓점이 닫히는 것뿐입니다.

### Changed

- `model`의 출처를 `lds-authored`에서 `material-symbols`로 되돌렸습니다. 업스트림이 관리하는 원본을 쓰므로 저장소가 좌표를 들고 있지 않습니다.

### Corrected

- rc.64는 "`deployed_code`에는 외곽선 변형이 없으므로 직접 그렸다"고 적었습니다. 사실이 아닙니다. 같은 glyph에 FILL 축이 있고 `.../deployed_code/default/`가 FILL=0(외곽선), `.../deployed_code/fill1/`이 FILL=1(채움)입니다. rc.62가 들여온 것이 FILL=1이었고, rc.64는 처음 받은 파일을 측정하지 않고 path 구조만 보고 채움 디자인이라 단정한 뒤 대체 후보만 측정했습니다. 두 변형을 구분해 받으라는 근거를 생성기 주석에 남겼습니다.

## 0.1.0-rc.64 - 2026-08-09

### Added

- `check:icon-drawing-style` — 아이콘이 같은 손으로 그려졌는지 수치로 보는 검사입니다. 이름·정렬 검사는 있었지만 드로잉 스타일을 보는 검사가 없어, 획 두께가 base의 3.5배인 글리프가 경고 없이 들어왔습니다. Storybook 시각 회귀와 같은 chromium으로 각 글리프를 rasterize해 획 두께 중위값(24 그리드에서 1.5–3)과 잉크 비율(36% 이하)을 재고, base 이름이 stroke로 그려지는 것을 막습니다. solid가 의도인 글리프는 `-fill`·`-thick`·`nav-*` 접미사나 `SOLID_BY_DESIGN` 등록으로 가릅니다.

### Fixed

- `model` 아이콘을 base 외곽선 두께로 다시 그렸습니다. rc.62가 들여온 Material Symbols `deployed_code`는 세 면을 채우는 디자인이라 획 두께가 7.0, 잉크 비율이 40%였고, base 외곽선(중위값 2.25, 15–31%) 사이에서 그 글리프만 두껍고 어둡게 보였습니다. `deployed_code`에는 외곽선 변형이 없으므로 아이소메트릭 정육면체의 실루엣과 내부 모서리를 base 두께의 채운 path로 직접 그렸습니다 — 두께 2.25, 잉크 25.8%로 `storage`(26.6%)와 같은 자리입니다.
- 로봇·지도 의미 17개(`robot`·`joystick`·`waypoint`·`route`·`zone`·`layers`·`lidar`·`battery`·`battery-charging`·`gauge`·`signal`·`crosshair`·`map`·`cpu`·`volume-x`·`maximize`·`volume-2`)를 base와 같은 채운 path로 갈았습니다. 이전 구현은 `components/icon/Icon.jsx`에 남은 `stroke-width="2"` 선 그림 fallback이었고, iconography 문서가 인정한 Robotics extension이 아니라 옛 컴포넌트의 잔재였습니다. Apache 2.0 Material Symbols outlined 원본에 출처를 명시해 `assets/icon-source-overrides/`로 옮겼습니다. `ldsLegacyFallbacks`는 18에서 1(`apple`, 브랜드 마크)로 줄었습니다.

### Changed

- Iconography 가이드에 획 두께와 잉크 비율 기준을 적었습니다. 검사가 막는 값과 문서가 말하는 값이 같은 자리에서 나옵니다.

## 0.1.0-rc.63 - 2026-08-08

### Fixed

- `SideNav` 항목의 pointer hover가 보이지 않던 것을 고쳤습니다. hover 배경이 `fill-alternative`(elevated 표면 위 5% 중회색)였는데, 이 값은 지각 하한 아래라 셸에서 가장 큰 히트 타깃인 44px 행이 마우스에 반응하지 않는 것처럼 읽혔습니다. hover를 `fill-normal`(8%), pressed를 `fill-strong`(16%)로 한 단계씩 올려 hover < pressed 순서와, hover가 선택 wash(primary 14%)보다 약하다는 위계를 함께 유지합니다.

### Changed

- `SideNav` disclosure 자식 행 높이를 44px에서 36px로 낮추고 `--lds-side-nav-child-item-height`로 노출했습니다. 자식이 부모와 같은 높이면 위계가 들여쓰기와 1px 폰트 차이로만 남아 열린 그룹이 트리로 읽히지 않았고, `multiple={false}` accordion 소비자에서는 그룹 하나가 패널 세로를 과하게 차지했습니다. 자식 행은 접힌 레일에 존재하지 않으므로 레일↔패널 44px 행 높이 계약은 그대로이며, 36px는 WCAG 2.5.8 최소 타깃(24px)을 넘습니다. 이전 밀도가 필요한 소비자는 이 변수를 `44px`로 되돌립니다.
- rc.61이 세운 `check:surface-ownership`가 요구하는 후속 정리입니다. 상태를 들고 있는 액션이 `IconButton`에 인라인 `style`로 pressed 팔레트를 직접 칠하던 자리를 `ToggleIcon`으로 되돌렸습니다 — `aria-pressed`와 활성 팔레트는 프리미티브가 이미 소유한 계약이라, 소비 컴포넌트가 사본을 들고 있으면 갈라집니다. `ConversationMessage`(메시지 액션), `LogViewer`, `SelectionInspector`, `CanvasEditorCommandBar`, `HistoryToolbar`, `LayerPanel`, `FileUploadQueue`, `SearchableMultiSelect`가 대상이며, `pressed`가 없는 fire-and-forget 액션은 `IconButton`으로 남습니다. `SelectionInspector`는 지역 `IconButton` 재구현을 지우고 공용 프리미티브를 씁니다.

## 0.1.0-rc.62 - 2026-08-08

### Added

- `ConnectionRow` Product 컴포넌트: 연결 이름, 설명, 상태, 장식 시각 요소와 작업 슬롯을 한 행에 배치하고 420px 이하에서 작업을 별도 행으로 재배치합니다. 상태는 공용 `StatusIndicator`를 합성하며 제품이 권한·변경·확인 흐름을 소유합니다. (#43)
- AI/ML 모델을 나타내는 `model` 아이콘을 Apache 2.0 Material Symbols `deployed_code` 원본과 명시적 출처 정보로 아이콘 생성 파이프라인에 추가했습니다. (#44)

### Fixed

- `NetworkGraph`의 노드 클릭 표식과 edge control이 축소된 SVG 안에서도 최소 포인터 목표를 유지하고, 중첩 interactive semantics 없이 각각 독립된 컨트롤이 되도록 수정했습니다.
- 비활성 `TagInput`이 wrapper opacity로 텍스트 대비를 잃던 문제를 없애고, 읽기 가능한 비활성 표면과 `aria-disabled` 계약을 유지합니다.
- Docs surface 감사의 제거된 Source Disclosure story ID를 현재 `AvailabilityAndProvenance` 대표 Canvas로 교체하고, uncontrolled arg 갱신·play lifecycle을 다시 검증합니다.

### Verified

- 기존 `DataCollectionPanel` 구현·타입·반응형 스토리·접근성 계약과 공개 export가 rc.26부터 존재함을 재검증했습니다. (#34)
- 698개 Storybook story의 Axe 감사, 194개 Docs 표면, public/hidden IA 원장, 타입 소비자, 아이콘 정렬과 시각 회귀 검사를 통과했습니다.


## 0.1.0-rc.61 - 2026-08-07

### Added

- `check:surface-ownership` — 표면 소유 분류를 코드와 대조하는 검사입니다. A/B/C 분류는 2026-07-17 핸드오프 문서에만 있었고 어떤 검사도 코드와 비교하지 않았습니다. 그래서 `SourceDisclosure`가 「테두리 없는 콘텐츠」로 분류된 채 최초 공개 릴리스부터 rc.59까지 자기 둘레를 그렸고, 이미 테두리가 있는 제품 카드 안에서 두 번째 테두리를 만들고 있었습니다. 분류를 `docs/references/quality/SURFACE_OWNERSHIP_CONTRACT.json`으로 옮기고 `check:fast`에 연결했습니다.

  검사 범위를 정직하게 좁혔습니다. **borderless로 분류된 컴포넌트의 루트 요소가 테두리나 모서리를 선언하지 않는지**만 단언합니다 — 위의 실패 양상이고 루트의 style 객체만으로 건전하게 판정됩니다. `embedded-variant`와 `outermost`는 둘레를 그리는 게 맞지만 그리는 **위치**가 컴포넌트마다 달라(`ResourceState`는 안쪽 메시지 표면, `DataToolbar`는 아래 구분선만) 일괄 단언이 맞을 때보다 틀릴 때가 많으므로, 분류만 유지하고 자동 검증하지 않습니다. 파서가 루트를 찾지 못하면 통과가 아니라 실패이며 `rootUnresolved`와 사유를 계약에 적어야 합니다 — 침묵을 준수로 읽지 않기 위해서입니다.

  이 검사로 나머지 borderless 컴포넌트 8종(`Tree`·`LogViewer`·`StepList`·`PrimaryDetail`·`AnnotatedImage`·`EmptyState`·`Notification`·`SourceDisclosure`) 감사도 함께 끝났습니다. 루트에 둘레를 그리는 곳은 없었습니다 — rc.59에서 고친 것이 유일한 위반이었습니다.

## 0.1.0-rc.60 - 2026-08-07

### Fixed

- `SourceDisclosure`가 래칫 baseline에 묻어 두고 있던 계약 부채를 갚았습니다. `API_DRIFT_BASELINE`은 이 컴포넌트의 `emptyMessage`·`headingLevel`·`onSourceActivate`를 「문서화되지 않은 prop」으로 등재해 검사를 통과시키고 있었고, 네 번째 항목 `openLabel`은 rc.57에서 삭제된 prop이라 존재하지도 않는 것을 계속 면제하고 있었습니다. 셋을 `prompt.md`에 문서화하고 죽은 항목을 지워 baseline에서 이 컴포넌트 항목을 통째로 제거했습니다.
- `STORY_COVERAGE_BASELINE`의 `emptyStateGaps`에 올라 있던 것도 해소했습니다. `emptyMessage` prop이 있는데 `sources={[]}`를 보여 주는 스토리가 없었습니다. 빈 목록이 목록·토글·액션을 만들지 않고 한 줄로만 알리는지, 그리고 그 줄이 권한 때문에 비었을 때의 집계 줄과 섞이지 않는지 검증하는 스토리를 더했습니다(7건 → 6건).
- `list` 변형 설명에 rc.59에서 제거한 「테두리 있는」이 남아 계약이 자기모순이던 것을 고쳤습니다.

## 0.1.0-rc.59 - 2026-08-07

### Fixed

- `SourceDisclosure`의 `list` 변형이 자기 테두리·모서리·배경을 그리던 것을 제거했습니다. 2026-07-17 표면 감사는 이 컴포넌트를 **A 전략(테두리 없는 콘텐츠 — 컨테이너가 표면을 소유)** 으로 분류해 `Tree`·`LogViewer`·`StepList`와 같은 자리에 두었지만, 코드는 최초 공개 릴리스부터 자기 둘레를 그리고 있어 분류와 맞은 적이 없었습니다. provenance는 언제나 무언가 안에서 읽히므로(문서 카드, `Collapsible`, 상세 패널) 이 둘레는 감싸는 표면의 테두리 몇 px 안쪽에 두 번째 테두리를 만들었습니다 — 감사가 막으려던 바로 그 이중 둘레입니다. 행의 좌우 패딩도 함께 없애 목록이 위의 제목과 같은 축에 정렬됩니다. 그룹 표시는 행 사이 구분선이 소유합니다.

`ChartFrame`·`MetricCard`처럼 「제목을 카드 안 헤더로」 두는 배치는 C 전략(항상 최외곽)의 계약이라 이 컴포넌트의 모델이 아닙니다. 계약을 `SourceDisclosure.prompt.md`에 명시하고, 목록이 둘레를 다시 그리거나 제목 축에서 벗어나면 실패하는 단언을 스토리에 넣었습니다.

## 0.1.0-rc.58 - 2026-08-07

### Changed

- 인용 표현을 시스템 전체에서 조용한 채움 상자 하나로 통일했습니다. `Blockquote`와 `Prose`의 마크다운 `blockquote`가 그리던 3px primary 좌측 룰을 제거하고 `--color-semantic-fill-alternative` 배경 + `--radius-sm` 표면으로 바꿨습니다 — primary는 이 시스템의 인터랙션 잉크라 인용이 링크나 선택 강조로 읽혔고, 채움 상자는 「다른 문서에서 떠온 글」이라는 스니펫 관용구입니다. `SourceDisclosure`의 발췌(rc.57에서 Blockquote의 룰을 물려받아 같은 문제를 안고 있던 곳)도 목록 패널과 인라인 팝오버 양쪽에서 같은 표면을 씁니다. API 변경은 없습니다.

## 0.1.0-rc.57 - 2026-08-07

### Changed

- `SourceDisclosure`: replaced the `compact`/`collapsible` booleans with a single `variant: 'inline' | 'list' | 'chips'` (default `'inline'`) — a recessive "출처 N개" toggle that opens an anchored Popover, the resting shape the surveyed AI-assistant products (ChatGPT, Claude.ai, Gemini, Copilot, NotebookLM) converge on. `availability` no longer draws a badge for `available` or an omitted value; only the exception states (`stale`/`missing`/`error`/`unknown`) do, so a reachable source stays silent instead of competing for attention with the ones that need it. A new `badge` field carries a product-owned, always-visible verdict (a verification result, a sensitivity class) — a separate axis from reachability, since one source can be both 확인됨 and 오래됨 at once.

### Removed

- `SourceDisclosure` no longer renders a row for `availability: 'restricted'`. A source the user cannot open is withheld rather than listed — showing its title discloses that it exists, which is exactly what the permission check exists to prevent (RFC 9110 §15.5.5; every permission-aware search product surveyed omits rather than shows a locked placeholder). Withheld sources are reported as one aggregate line (`hiddenMessage`, combined with any upstream `hiddenCount`) and never folded into a visible source count. Native `details`/`summary` is gone in favor of a real disclosure button with `aria-expanded`/`aria-controls`: hiding the default marker to draw a custom chevron was breaking expanded-state announcement in VoiceOver/JAWS/NVDA, and iOS Safari + VoiceOver does not expose `summary`'s role or state at all. The button owns a 24×24 target per WCAG 2.2 SC 2.5.8; the source label itself is now the link, so the heaviest element in the row is the one that goes somewhere.

### Migration

- `compact` → `variant="chips"`. `collapsible` → drop the prop; it is now the default (`variant="inline"`). A bordered comparison list is `variant="list"`.
- `availability: 'available'` no longer needs to be set — omit it. Product-owned verdicts previously carried on `availability`/`availabilityLabel` (e.g. 확인됨/이견 있음) move to the new `badge` field.
- Sources already filtered out for lack of permission should stop being passed with `availability: 'restricted'` and instead be counted into `hiddenCount`; the row never rendered regardless, but its label text is no longer read at all.

## 0.1.0-rc.56 - 2026-08-07

### Fixed

- `FileBrowser`의 선택된 행에 테두리가 돌아왔습니다. 램프에 없는 `--color-semantic-line-normal-strong`을 참조한 탓에 `border` 단축 속성이 통째로 무효가 되어 테두리가 아예 그려지지 않았고, 선택은 배경 틴트와 글자 굵기로만 전달되고 있었습니다. 같은 일을 하는 `Tree`와 같은 `--color-semantic-primary-normal`을 씁니다 — 선택은 구분선이 아니라 강조 상태입니다. 흰 바탕 대비 4.66:1로 WCAG 2.2 1.4.11(3:1)을 넘습니다.
- `SourceDisclosure`의 인용문 좌측 규칙이 돌아왔습니다. 같은 원인으로 `borderLeft`가 무효가 되어 발췌가 패널 본문과 나란히 붙은 채 인용이라는 표시가 사라져 있었습니다. 똑같은 3px 좌측 규칙을 그리는 `Blockquote`와 같은 `--color-semantic-primary-normal`을 씁니다.
- `AnnotatedImage`의 관심 영역 상자와 지점 라벨이 다시 둥글어집니다. `--radius-xs`가 정의되지 않아 `borderRadius`가 무효가 되고 초깃값 0으로 떨어져 모서리가 각져 있었습니다.
- `MobileSystemBars`의 배터리 윤곽이 각진 사각형으로 그려지던 것을 고쳤습니다. 같은 `--radius-xs` 결함이었습니다. 이 글리프는 제품 UI가 아니라 OS 크롬을 흉내 낸 것이라 주변과 같이 raw 픽셀로 그리며, 램프의 4px은 8px 높이의 절반이라 끝이 캡슐이 되므로 2px을 명시합니다.

### Added

- `--radius-xs: 4px`. 명명 반지름 램프가 `sm`(6px)에서 시작해 그 아래 단계가 없었는데, 두 컴포넌트가 각각 `--radius-xs`를 참조하고 있었습니다 — 램프에 그 단계가 있는 것처럼 읽힌다는 뜻이라 사용처가 아니라 램프의 빈자리가 결함이었습니다. `--radius-4`(WDS 배지 패리티용 별칭)로 바꿔 쓰면 다음 사람이 다시 `--radius-xs`를 찾게 됩니다.

## 0.1.0-rc.55 - 2026-08-07

### Fixed

- `ConfirmDialog`의 제목이 본문과 같은 크기로 그려지던 것을 고쳤습니다. 제목이 램프에 없는 `--heading3-*`을 참조하고 있었고, 정의되지 않은 커스텀 속성을 폴백 없이 쓴 `font-size` 선언은 계산 시점에 무효가 되어 상속값으로 떨어집니다 — 18px이어야 할 제목이 본문과 똑같은 14px로 그려져 위계가 굵기 하나에만 걸려 있었습니다. 본문이 두 줄만 되어도 제목보다 커 보였습니다. 이제 형제인 `Modal`·`Sheet`·`Drawer`와 같은 단을 씁니다 — 제목 `--headline1-*`(18px) `--fw-extra`, 본문 `--body2-size`(15px) `line-height: 1.7`.

### Added

- `check:token-hygiene`에 `danglingReferences` 검사를 더했습니다. 이 파일의 나머지 검사는 전부 「정의해 놓고 안 쓰는」 방향만 보았기 때문에 위 `--heading3-size` 같은 반대 방향 — 「참조하는데 정의가 없는」 — 결함이 조용히 살아남았습니다. 폴백 없는 `var(--x)`가 어디에도 정의되지 않으면 이제 실패합니다. 컴포넌트가 자기 루트에 심는 지역 변수(`ViewerFrame`의 `--viewer-*` 등)는 정의로 인정합니다. 기존 4건(`--radius-xs` 2파일, `--color-semantic-line-normal-strong` 2파일)은 알려진 부채로 baseline에 기록했습니다.

## 0.1.0-rc.54 - 2026-08-06

### Fixed

- `NetworkGraph`가 그림이 바뀐 것을 보조기술에 알립니다. 이웃을 펼쳐 대상이 늘거나 필터로 그림이 비는 순간을 상시 마운트된 polite 영역이 말합니다 — 종전에는 큐를 눌러 대상이 6개에서 9개가 되어도 아무 말이 없었습니다. 이 컴포넌트가 더한 바로 그 상호작용이 보조기술에는 일어나지 않은 일이었습니다. 첫 렌더에는 말하지 않습니다.

## 0.1.0-rc.53 - 2026-08-06

### Fixed

- `NetworkGraph`의 빈 그림도 «이름»을 갖습니다. 종전에는 이름을 SVG만 갖고 있어 그릴 것이 없으면 이름도 함께 사라졌고, 스크린 리더에는 「표시할 관계가 없습니다」만 남아 무엇이 비었는지 알 수 없었습니다 — 한 화면에 관계도가 둘이면 어느 쪽 이야기인지조차 알 수 없었습니다.
- `NetworkGraph`의 빈 그림에서 `description`이 다시 이어집니다. `aria-describedby`를 들고 있던 것이 그 사라진 SVG였으므로, 숨은 설명은 아무도 가리키지 않는 죽은 마크업이었습니다.
- `NetworkGraph`가 빈 상태에서 같은 문장을 두 번 말하지 않습니다. 자동 요약은 빈 상태 문구 그 자체입니다.

## 0.1.0-rc.52 - 2026-08-06

### Fixed

- `NetworkGraph`의 관계가 «양 끝»을 말합니다 — 「LK Portal에서 Context Gateway로, 사용함」. 종전에는 라벨만 이름으로 써서 스크린 리더에 「사용함, 버튼」이라고만 들렸고, 같은 라벨을 가진 관계가 여럿이면 서로 구별조차 되지 않았습니다. 관계가 전부인 그림에서 관계의 자리가 아무 정보도 나르지 않던 셈입니다. `directed={false}`는 「A와 B 사이」, 자기 참조는 「A 자기 자신」으로 말합니다.

## 0.1.0-rc.51 - 2026-08-06

### Fixed

- `NetworkGraph`에서 `onSelectEdge`를 준 관계를 키보드로 고를 수 있습니다. 종전에는 관계선에 `role="button"`과 이름을 주고도 `tabIndex={-1}`이라 마우스로만 고를 수 있었습니다 — 같은 동작에 두 등급의 접근이 생기던 자리입니다. 관계는 «떠나는 노드» 뒤에 자리를 잡아 「이 대상 — 이 대상에서 나가는 관계들 — 다음 대상」으로 읽히고, 포커스 링도 붙습니다. 탭 스톱은 여전히 하나입니다.

## 0.1.0-rc.50 - 2026-08-06

계약 문서만 바뀝니다. 구현은 rc.49와 같습니다.

- `NetworkGraph`의 `force` 비용을 실측해 적었습니다: 노드 100개 43ms, 200개 55ms, 400개 160ms, 800개 395ms. 격자로 이웃만 보는 근사를 시험했으나 매 틱 격자를 세우는 비용이 더 커서 되돌렸습니다.
- 노드 끌기가 마우스와 손가락 둘 다에서 동작한다는 것을 계약에 적었습니다. 이미 그렇게 되어 있었지만 적혀 있지 않았습니다.
- 미니맵은 만들지 않습니다. 「보는 창」을 소유한 것은 액자이므로, 액자·확대 조절·범례와 같은 경계에 둡니다.

## 0.1.0-rc.49 - 2026-08-06

### Fixed

- `NetworkGraph`의 기본 `edgeColor`가 대비를 갖는 선 색으로 바뀌었습니다. 종전에는 구분선용 hairline 토큰이라 색을 주지 않은 소비자의 관계선이 배경 대비 1.3:1이었습니다 — 관계가 사실상 보이지 않았습니다. 관계선은 내용을 이해하는 데 필요한 그래픽이므로 배경과 3:1을 지켜야 합니다(WCAG 1.4.11). 측정 4.74:1입니다. `edge.color`를 주는 소비자는 영향받지 않습니다.

## 0.1.0-rc.48 - 2026-08-06

### Fixed

- `NetworkGraph`의 선택 표시가 유형 색이 아니라 강한 중립색으로 그려집니다. 종전에는 유형 색을 40% 불투명도로 둘러 배경 대비가 1.6:1까지 떨어졌습니다 — 비텍스트 표시가 지켜야 하는 3:1의 절반입니다. 색은 앱이 소유하므로 그 색에 대비를 맡길 수 없습니다. 무엇을 골랐는지는 링 안의 채움색이 이미 말합니다. `card`도 테두리 굵기만 바뀌던 것에서 같은 링을 받습니다.

## 0.1.0-rc.47 - 2026-08-06

### Fixed

- `NetworkGraph`의 포커스가 «보입니다». 순회의 모든 자리(노드와 펼치기 큐)가 `:focus-visible`에서 켜지는 링을 갖습니다. 종전에는 포커스가 가도 `outline`이 `none`이라 화면에 아무 표시가 없었습니다 — 거의 전부가 키보드 계약인 컴포넌트에서 자기 자리를 볼 수 없었습니다(WCAG 2.4.7). 선택 링과 다른 색을 씁니다: 「지금 여기 있다」와 「이것을 골랐다」는 다른 말입니다.

## 0.1.0-rc.46 - 2026-08-06

### Fixed

- `NetworkGraph`의 `layout="force"`가 `card`에서 층 배치로 돌아갑니다. 계약은 「`force`도 `dot` 전용」이라 못박고 있었지만 구현이 `nodeShape`을 보지 않아, `card`에 주면 카드가 실제로 떠다녔습니다 — 흐름도에서 위치는 곧 의미이고 사용자가 놓은 자리는 사용자의 저작물입니다.
- `NetworkGraph`의 `layout="manual"`이 좌표를 주지 않은 노드를 놓인 것들 «아래»에 한 줄로 늘어놓습니다. 종전에는 원점에 몰아 두어, 좌표 없는 노드끼리 쌓이고 그 자리의 노드 아래로 숨었습니다. 같은 좌표를 «일부러» 준 경우는 그대로 겹칩니다.
- `NetworkGraph`의 `card` 세로 관계가 사이에 «낀» 노드가 있을 때만 옆으로 돌아갑니다. 종전에는 피할 것이 없어도 늘 부풀어, 나란한 카드 둘 사이에 74px짜리 활이 생겼습니다.

## 0.1.0-rc.45 - 2026-08-06

### Fixed

- `NetworkGraph`가 같은 두 노드를 잇는 관계들을 부채처럼 «각자 다른» 곡률로 벌립니다. 종전에는 모두에게 같은 곡률을 주어 같은 방향으로 난 둘이 정확히 포개졌습니다 — 화면에 관계 셋이 있는데 눈에는 둘만 보였습니다. 부채는 쌍을 기준으로 펴므로 반대로 흐르는 관계도 남의 자리에 앉지 않고, 홀수 개일 때 한가운데 것은 곧게 남습니다.
- `NetworkGraph`가 관계 이름도 담길 자리에 맞춰 자릅니다. 담길 상자가 없어 보이지만 그대로 두면 라벨 하나가 그림 밖으로 뻗어 액자에 잘리거나 가로 스크롤을 만듭니다. 전체 이름은 관계의 접근성 이름과 `<title>`에 남습니다.

## 0.1.0-rc.44 - 2026-08-06

### Added

- `NetworkGraph`의 `root`가 «탐색 시작점»으로 드러납니다. `dot`에서 파선 링과 접근성 이름이 함께 붙어, 그림이 무엇을 중심으로 펼쳐진 것인지 보는 사람과 듣는 사람 모두에게 전해집니다. 크기로 말하지 않습니다 — 반지름은 `size`가 쓰는 축입니다. `card`에서는 첫 단계라는 사실을 왼쪽 끝이라는 자리가 이미 말하므로 아무것도 덧그리지 않습니다.

### Fixed

- `NetworkGraph`가 자기 자신을 잇는 관계를 노드 위의 고리로 그립니다. 종전에는 2차 베지어로 그려져 시작점과 끝점이 같아 길이 0의 path가 되었고, 관계가 화면에서 사라지면서도 탭으로는 닿았습니다. 같은 노드에 고리가 여럿이면 각도를 돌립니다.
- `NetworkGraph`가 중복된 노드·관계 `id`를 그리지 않습니다. 먼저 온 것만 남깁니다 — 같은 `id`가 둘이면 `tabindex="0"`인 노드가 둘이 되어 「탭 한 번에 그림 안으로」라는 계약이 깨졌습니다.
- `NetworkGraph`의 방향키가 화면에 놓인 자리를 따라 돕니다. 위에서 아래로, 같은 줄 안에서는 왼쪽에서 오른쪽으로. 종전에는 입력 배열 순서를 따라, →를 눌렀는데 왼쪽 노드로 가는 일이 있었습니다.
- `NetworkGraph`가 이름을 담길 자리에 맞춰 자릅니다(`…`). `card`에서 긴 이름이 면 밖으로 흘러나오고 있었습니다. 전체 이름은 접근성 이름과 `<title>`에 남습니다. 글자 폭은 넓은 글자와 좁은 글자를 나눠 세어 어림합니다 — 글자 수에 평균값을 곱하면 「LK Portal」과 「플랫폼·개발자 도구」가 같은 폭으로 계산됩니다.
- `NetworkGraph`의 펼치기 큐가 24×24로 눌립니다. 보이는 칩은 노드를 가리지 않도록 18px로 두고, 관계선이 쓰는 것과 같은 방식으로 투명한 표적을 겹칩니다.
- `NetworkGraph`의 자동 요약이 규모를 말하고 내용을 옮겨 적지 않습니다. 앞의 열 개만 이름으로 부릅니다 — 노드 300개에서 3,204자를 읽던 것이 81자가 됩니다.
- `NetworkGraph`가 모션이 꺼져 있을 때 같은 물리 계산을 두 번 돌리지 않습니다. 노드 800개에서 0.5초를 한 번 더 물던 일입니다.

## 0.1.0-rc.43 - 2026-08-06

### Fixed

- `NetworkGraph`의 관계 라벨이 빈자리를 못 찾을 때 «가장 덜 겹치는» 후보로 갑니다. 종전에는 곡선 한가운데로 되돌렸는데, 그 자리는 하필 이미 막힌다고 판정한 첫 번째 후보였습니다. 그렇게 놓은 자리도 차지한 것으로 기록해 뒤따르는 라벨이 같은 자리에 쌓이지 않게 합니다.

## 0.1.0-rc.42 - 2026-08-06

### Fixed

- `NetworkGraph`의 `dot` 노드가 이름이 차지하는 자리까지를 몸집으로 칩니다. 이름은 원 «밖»에 있고 원보다 훨씬 넓은데(반지름 16px 점에 붙은 「플랫폼·개발자 도구」는 110px가 넘습니다) 충돌 힘이 반지름만 보고 밀어, 점 둘은 안 닿는데 이름끼리 포개졌습니다. `card`도 상자 크기로 밀립니다 — 종전에는 점의 기본 반지름으로 밀리고 있었습니다.
- `NetworkGraph`의 `dot` 노드 이름과 캡션에 배경색 후광을 둡니다(`paint-order`). 관계선은 직선이라 돌아가지 않으므로, 선이 이름 위를 지나도 글자가 계속 읽힙니다.
- `NetworkGraph`의 관계 라벨이 피해 가는 상자를 글자가 실제로 놓이는 자리에 맞췄습니다. 캡션 상자가 2px 위에 잡혀 있어 스침이 남았습니다.

## 0.1.0-rc.41 - 2026-08-06

### Added

- `NetworkGraph`에 `layout="force"` — 물리로 자리를 잡는 노드-링크 장르의 표준 배치입니다. 관계는 고무줄처럼 당기고, 노드끼리는 밀어내고, 겹치면 튕겨나고, 전체는 중심에 묶입니다. 격자에서 출발해 고정 틱 수만큼 돌리고 난수를 쓰지 않으므로 수렴 좌표는 여전히 결정론적이며, 움직임만 선택입니다 — `prefers-reduced-motion`이거나 `motion="none"`이면 수렴한 자리를 바로 그립니다. 노드를 끌면 그 노드는 포인터가 소유하고 물리는 이웃으로 흐릅니다.
- `NetworkGraph`의 `+N` 펼치기 큐가 «컨트롤»이 되었습니다. 이름과 `aria-expanded`를 갖고 roving 포커스 순회에 들어와, 클릭과 키보드가 같은 표적을 씁니다. 펼친 뒤에도 사라지지 않고 `−`로 남아 왕복이 대칭입니다. 새 노드는 이웃 둘레에서 태어나 물리에 밀려 퍼집니다(`node.expanded`로 상태를 알려주세요).

### Fixed

- `NetworkGraph`의 `dot` 관계선을 직선으로 되돌렸습니다. 곡률은 같은 두 노드를 잇는 관계가 여럿일 때만 씁니다 — 구조를 읽는 그림에서 그 외의 곡률은 정보가 아니라 장식입니다.
- `NetworkGraph`에서 선택과 펼침이 한 컨트롤을 나눠 쓰던 문제를 고쳤습니다. 노드는 더 이상 `aria-expanded`를 들지 않습니다 — 스크린 리더가 「축소됨, 버튼」으로 읽는데 누르면 선택되어 기대와 어긋났습니다.
- `layout="force"`와 펼치기 큐는 `nodeShape="dot"`에서만 동작합니다. 흐름도에서는 위치가 의미이고 배치가 사용자의 저작물이라 무엇도 노드를 스스로 옮겨서는 안 되며, 플로우에서 접히는 것은 이웃이 아니라 한 노드 안의 서브그래프라 개념이 다릅니다.

## 0.1.0-rc.40 - 2026-08-06

### Fixed

- `Icon.unlink` now uses the official Material Symbols outlined `link_off` asset instead of a custom-drawn glyph. The public icon name and API are unchanged.

## 0.1.0-rc.39 - 2026-08-06

### Added

- `Icon` adds `unlink`, a semantic broken-link glyph for disconnect and unbind actions.

## 0.1.0-rc.38 - 2026-08-06

### Added

- `NetworkGraph` — 대상과 관계를 노드·엣지로 그리는 관계도. 두 소비 제품이 각각 손으로 구현하던 것(합쳐 2000줄 남짓)을 하나로 모았습니다. `nodeShape`로 업계의 두 관행을 모두 그립니다: `dot`은 노드-링크 다이어그램(색이 찬 원 + 바깥 라벨, 색은 범주·반지름은 양), `card`는 플로우 에디터(이름을 담는 카드 + 좌우 포트). 배치는 `layered`·`columns`·`manual` 전략이고 셋 다 결정론적이라 시각 회귀 비교가 성립합니다. 노드·관계의 상태(`live`/`degraded`/`blocked`/`idle`/`disabled`)는 유형 색을 건드리지 않고 불투명도와 파선으로만 표현합니다 — 「무엇인가」와 「지금 어떤가」가 한 색에 섞이면 둘 다 읽을 수 없습니다. 유형 색은 값을 구분하는 데이터이므로 앱이 소유하고 컴포넌트는 받기만 합니다. 노드 묶음은 하나의 roving tab stop이고 방향키로 이동, Enter/Space로 선택하며, 접힌 이웃은 왼쪽 위 `+N` 확장 큐와 접근 가능한 이름이 함께 알립니다. 액자·확대 조절·범례는 그리지 않습니다 — `ViewerFrame`·`ViewerToolbar`·`Legend`와 조합하세요.

## 0.1.0-rc.37 - 2026-08-05

### Fixed

- `Input` narrows instead of overflowing a container it does not fit. Both of the field's flex boxes carried the default `min-width: auto`, so the field could not shrink below its content's minimum size — with an `actionRight` that minimum is the text area plus every action button, and the field spilled out of any container narrower than roughly 310px. Measured against `SecretField` (reveal + copy) inside a 271px callout: the field was 307px and overflowed by 36px, and now matches its container. Every composition built on `Input` inherits the fix.

## 0.1.0-rc.36 - 2026-08-05

### Fixed

- `SecretField` copies where the Clipboard API does not exist. `navigator.clipboard` is exposed only in a secure context, so a product served over plain HTTP on a LAN hostname had a copy button that could do nothing but report failure — on a field whose value is typically shown once. The component now falls back to the legacy selection command, which needs no secure context and which browsers still honour inside a user gesture. Behaviour is unchanged wherever the Clipboard API is present.

## 0.1.0-rc.35 - 2026-08-05

### Fixed

- Synced the Storybook inventory, information-architecture audit, primary-description review, and generated component registry to the current 680-story release surface.
- Added reviewed coverage for the SideNav single-open scenario and the Data Collection Panel implementation-contract stories.

## 0.1.0-rc.34 - 2026-08-05

### Added

- `SideNav multiple={false}` supports accordion navigation so only one disclosure group remains open at a time. The Portal sidebar opts into this mode.

### Fixed

- Regenerated the tracked legacy distribution artifacts so the SideNav accordion release is reproducible in CI.

## 0.1.0-rc.33 - 2026-08-05

### Added

- `SideNav multiple={false}` supports accordion navigation so only one disclosure group remains open at a time. The Portal sidebar now opts into this mode.

## 0.1.0-rc.32 - 2026-08-04

### Fixed

- Aligned brand-surface foreground roles and generic control mappings with the official navy color system, including generated package artifacts and contrast guardrails.

## 0.1.0-rc.29 - 2026-08-04

### Fixed

- Regenerated the tracked artifacts from the exact rc.29 source revision after the release version bump so bundle hashes match the canonical Windows build.

## 0.1.0-rc.31 - 2026-08-04

### Added

- Added the Korean UI copy review contract, deterministic validation, and cross-repository product copy integration.

## 0.1.0-rc.30 - 2026-08-04

### Fixed

- Removed stale generated bundle chunks so the tracked package artifacts exactly match the canonical Windows build used by the immutable release gate.

## 0.1.0-rc.28 - 2026-08-04

### Fixed

- Updated the package-split contract pins and workspace dependency identities for the immutable rc.28 package set.

## 0.1.0-rc.27 - 2026-08-04

### Fixed

- Regenerated the tracked Windows package artifacts from the canonical CI toolchain so the immutable release gate and consumer package set use reproducible hashes.

## 0.1.0-rc.26 - 2026-08-04

### Added

- `DataCollectionPanel` Product extension composes an embedded `DataToolbar`, `ResourceState`, wide and compact collection content, and an optional footer into one continuous LDS surface.
- Container-responsive collection content switches to a consumer-supplied semantic compact view below 768px while preserving the native wide view when no compact representation is provided.

### Fixed

- Initial and preserved loading, refreshing, error, stale, offline, empty, and restricted states now apply deterministic content and footer visibility rules.
- Empty or rendered-null footers no longer leave a bordered strip, allowing single-page consumers to omit pagination cleanly.

### Validation

- Added interaction and Axe-guarded stories for layout boundaries, state policy, semantic narrow content, surface customization, and null-footer suppression; validated the packaged Product extension in the LK Portal project directory.

## 0.1.0-rc.25 - 2026-08-04

### Added

- Button, Input, Textarea, SearchField, Select, FieldAction, SegmentedControl, Tabs, Card, DataToolbar, SideNav, DropdownMenu, Popover, Tooltip, and Modal now expose typed root/ref, named-part `classNames`/`styles`, component-scoped `vars`, and stable `data-slot` contracts.
- `LdsProvider`, `useLdsRuntime`, `createLocalStorageManager`, and `LdsColorSchemeScript` provide additive color-scheme, direction, locale, storage, Portal-target, and z-index runtime composition.
- `MessageFeed viewportInset="compact|comfortable"` provides a semantic content-inset axis while preserving the chrome-free viewport and compact default.

### Fixed

- `SideNav` now supports opt-in single-group disclosure plus controlled and uncontrolled expanded-group state. Active route changes and collapsed-rail expansion respect the selected policy without changing the existing multiple-group default.
- `UserMenu` pointer opening no longer moves focus onto the first menu item, so the open trigger and menu do not compete for emphasis. Keyboard opening retains first/last-item entry focus.
- Docked `SideNav` footer `UserMenu` popovers now align their inline start with the account trigger by default. Consumers can override the `viewportPadding` clamp inset when a different viewport gutter is required.
- DropdownMenu, Popover, Tooltip, and Select popups now use the shared owner-document Portal, overlay stack, four-side flip/shift positioning, topmost dismiss, nearest theme/`dir` inheritance, and component-variable propagation outside clipping ancestors.
- Modal, Drawer, Sheet, and ConfirmDialog now share Portal layering, nested topmost focus containment, background inerting, body scroll locking, and deterministic focus restoration.
- Public refs now target the documented native control or semantic root, including polymorphic Button/Card/FieldAction roots and separate field `rootRef` targets.

## 0.1.0-rc.20 - 2026-08-03

### Fixed

- `Table` and `DataGrid` no longer reserve a stable scrollbar gutter when they only scroll horizontally, so full-width row dividers reach the card edge again. Consumers can still opt into a stable gutter with `style.scrollbarGutter`.
- Added a fast source-level regression gate for the default auto-gutter contract.

## 0.1.0-rc.19 - 2026-08-02

### Fixed

- Regenerated the tracked `dist` bundle with the clean CI dependency install so the release gate sees the same packed artifact set that GitHub Actions will publish.

## 0.1.0-rc.18 - 2026-08-02

### Fixed

- The Windows release availability probe now invokes `npm.cmd` through the shell, so it can distinguish an explicit registry 404 from process-launch errors before publishing immutable packages.

## 0.1.0-rc.17 - 2026-08-02

### Fixed

- `Select` now has a packed Core + Theme artifact gate: every fallback-free CSS custom property referenced by its shipped module graph must be defined by the two shipped stylesheets, preventing listbox and option layout tokens from silently falling back to browser defaults.
- The immutable-package release workflow now distinguishes an explicit registry 404 from authentication or transport failures; it never treats an unverified package lookup as permission to reuse a version.

## 0.1.0-rc.16 - 2026-08-02

### Added

- `IconButton` now provides a token-backed 24px `xs` density while retaining the 28px WDS-compatible `custom` size, with explicit `sm` and `md` size tokens.
- `Table` columns can opt into `truncate` so constrained tables ellipsize header and body content without forcing horizontal overflow.

### Fixed

- `Select size="sm"` keeps its hidden option-width measurement out of layout flow, so the root and trigger remain at the 32px compact height.

## 0.1.0-rc.15 - 2026-08-02

### Fixed

- The LanguageSwitcher interaction contract now waits for its portalled menu to finish fixed-position layout before clicking an option, removing a Windows CI timing race without changing component behavior.

## 0.1.0-rc.14 - 2026-08-02

### Fixed

- Portalled root and nested menus now preserve the nearest explicit light, dark, or automatic theme, so escaping an overflow container does not reset overlay colors.
- Storybook portal contracts now query the owner document, keep the visual comparison story isolated from the Table overflow regression, and ignore hidden measurement controls in rendered-style checks.
- Development dependency overrides resolve the current PostCSS path-traversal and brace-expansion denial-of-service advisories.

## 0.1.0-rc.13 - 2026-08-02

### Fixed

- Source line endings are normalized to LF before package generation so legacy root bundles are byte-identical between long-lived Windows checkouts and clean GitHub runners.
- `DropdownMenu` root panels now portal to the owner document with fixed viewport positioning, so row-action menus escape `Table` and other scroll-container clipping without changing the container's scroll height. Existing trigger/menu ARIA wiring, keyboard focus, flip, shift, and constrained-height behavior are preserved.

## 0.1.0-rc.12 - 2026-08-02

### Fixed

- Release artifacts are regenerated with the repository's canonical Node 22.17.1 and npm 10.9.2 runtime so the clean-runner generated-artifact gate is deterministic.
- `size="sm"` input controls now use component-owned label1 typography tokens (14px/20px) while the existing body1 tokens remain the medium-size default. `Input`, `SearchField`, `Select`, `AutoComplete`, `Combobox`, `PasswordInput`, `InputGroup`, `NumberField`, `TimePicker`, `DatePicker`, and `Textarea` share the compact density contract.

## 0.1.0-rc.11 - 2026-08-02

### Fixed

- The immutable release job now installs the pinned Playwright Chromium runtime before running browser-backed color-contrast checks on a clean GitHub Actions runner.
- `Select` now derives its intrinsic minimum width from the complete option set instead of the current value, so choosing a shorter label no longer shifts neighboring toolbar controls; narrow containers still cap the control at their available width.

## 0.1.0-rc.10 - 2026-08-02

### Fixed

- The immutable release probe now clears the expected `npm view` miss exit code before the PowerShell step completes, so a genuinely unpublished release candidate can proceed to validation and publication.

## 0.1.0-rc.9 - 2026-08-02

### Fixed

- The immutable release workflow now treats an unpublished `npm view` result as the expected probe outcome on current PowerShell runners instead of failing before inspecting the native exit code.

## 0.1.0-rc.8 - 2026-08-02

### Fixed

- `DataToolbar` now omits an empty header row, keeping controls-only toolbars vertically symmetric, and renders no surface when both header and controls are absent.

## 0.1.0-rc.7 - 2026-08-02

### Fixed

- Restored the nested `@lk-design-system/lds-core` and `lds-product` rc.4 lock entries required by the vendored Robotics rc.4 package, so the immutable release workflow can install the tagged source with `npm ci`.

## 0.1.0-rc.6 - 2026-08-02

### Added

- `SegmentedControl` options accept `count`, allowing a named `radiogroup` to expose per-value result totals without falling back to independent toggle chips or tab semantics.
- Counted segments retain the existing roving tab stop, Arrow/Home/End selection contract, disabled-option skipping, hover, selected state, and focus ring.

### Migration

- Replace hand-composed single-select `FilterChip` groups that display counts with `SegmentedControl` options shaped as `{ value, label, count }`.

## 0.1.0-rc.5 - 2026-08-02

### Added

- `FieldAction` provides the supported field-plus-action composition contract at compact and default densities.
- `Card as` preserves native `article`, `section`, and `li` roots; `Card surface="subtle"` provides a flat inset group surface in light and dark themes.
- `DataToolbar searchable={false}` supports count/filter/action-only collection headers without an inert search control or empty controls row.
- Immutable package release workflow: the `lds-v<version>` tag identifies the exact source commit, every package in the set shares that version, and CI rejects a tag/version that already exists in GitHub Packages.

### Fixed

- Portal workarounds for Card semantics, inset group surfaces, searchless collection headers, and field/action height alignment can now be removed without local surface or dimension overrides.

### Release

- `0.1.0-rc.4` is retired and will not be overwritten again. This release is the first package set governed by the tag and registry preflight checks above.

## 0.1.0-rc.4 - 2026-07-31

### Changed

- **Breaking — package scope.** The four published packages move from `@lk-robotics/*` to `@lk-design-system/*`, matching the GitHub organization that owns this repository. GitHub Packages files a scoped npm package under the organization named by its scope, so the old names placed the design system under LK-ROBOTICS while its source lived under LK-Design-System.

  | before | after |
  | --- | --- |
  | `@lk-robotics/lds-core` | `@lk-design-system/lds-core` |
  | `@lk-robotics/lds-theme` | `@lk-design-system/lds-theme` |
  | `@lk-robotics/lds-product` | `@lk-design-system/lds-product` |
  | `@lk-robotics/design-system-core` | `@lk-design-system/design-system-core` |

  There is no registry-level redirect for a scope rename. Consumers must add `@lk-design-system:registry=https://npm.pkg.github.com` to `.npmrc` and update their dependencies. The `@lk-robotics/*` packages stay published through the transition so a consumer that has not moved keeps resolving instead of failing with a 404.

  `@lk-robotics/lds-robotics-ui` is unchanged in this release; it moves once the Robotics repository republishes under the new scope, after which the vendored tarball here is replaced.

  Cross-repository governance recognises both scopes for the duration: the conformance CLI's LDS-package predicate, the consumer scanners, and the migration checks match either namespace, so a repository the migration has not reached is still checked rather than silently skipped.

### Added

- Every published manifest now declares `repository` (with `directory`), `homepage`, and `bugs`. Package and repository finally share an owner, so GitHub can link them; the workspace root previously pointed at `lk-design-system.github.io` rather than this repository.

## 0.1.0-rc.3 - 2026-07-30

### Fixed

- `Button`: `aria-busy` stays a boolean when `loading` is the string `'inline'`. The prop value was reaching the attribute directly, so an inline-loading button announced `aria-busy="inline"` — not a valid boolean, and assistive technology read it as absent.

## 0.1.0-rc.2 - 2026-07-30

### Added

- `OverlayStatusChip`: the Status-family chip promoted from Robotics after the proposal review, for status that must stay legible over a viewport rather than on a panel surface.
- `loading="inline"` on `Button`: a busy state that keeps the label in place instead of swapping it for a spinner.
- `status-negative` in the Robotics upstream token manifest.

### Changed

- The severed-link indicator draws its slash from the shared icon source rather than a local path.
- Viewer overlay surfaces resolve their opacity from one source (`_viewerOverlaySurface.js`, strong/soft), so `ViewerToolbar` and the Robotics kit consume levels instead of each redefining them.

## 0.1.0-rc.1 - 2026-07-22

### Added

- `DescriptionList variant="stacked"`: the term sits above a regular-weight value with spacing instead of hairline rows, for narrow detail panels and cards where a fixed term column wastes width and uniform bold flattens emphasis. The default row presentation is unchanged, so this is additive.
- `Tabs` tab/panel wiring: each tab now carries a generated id (overridable per item with `tabId`) and points at its panel through `panelId`, so consumers can complete the APG tab ↔ `tabpanel` relationship that the component previously made impossible to express.
- `Wizard onComplete` and `completeLabel`: on the last step the next control becomes the completion action instead of a dead disabled button. Without `onComplete` the previous behaviour is kept.
- `RefreshControl refreshLabel` now names an icon-only refresh action, and `PageIndicator groupLabel` replaces the previously hardcoded English group name.

- Nested submenus for `DropdownMenu` and `Menubar` through recursive `items`: `submenuMode="flyout"` (portaled beside the parent panel) and `submenuMode="drill"` (same-panel swap with a back control), sharing one keyboard/aria contract.
- `Calendar` and `DatePicker` blocked dates via `minDate` and `isDateDisabled`; disabled days stay focus-traversable but cannot be selected.
- `DashboardGrid fillLastRow` and the Dashboard Navigation pattern page (fixed panel, overlay peek rail, top-bar collapse toggle, 320px fallback).
- Added additive `/core`, `/theme`, `/product`, and `/robotics` package subpaths with matching ESM, CJS, and type entries. The aggregate root remains the exact compatibility union of all four layers.
- `NavigationAnnotationLayer`: an SVG `<g>` provider that coordinates cross-entity label collisions across the six navigation overlays (`RouteOverlay`, `TrajectoryOverlay`, `LaneOverlay`, `WaypointMarker`, `SpatialRegion`, `FacilityTransition`). Colliding labels nudge vertically (≤56 CSS px by default, direction-constrained to preserve each overlay's row contracts) and, when no slot remains, only the lowest-priority label is hidden — markers, state badges, accessible names, true anchor `data-*` coordinates, and the semantic mirror never change. Priority is state-first (selected > focused > alarm > active) with paint-order kind weight as tie-break; layout is measured from real DOM rects via `getScreenCTM()` and is deterministic. Overlays rendered without the provider behave exactly as before.
- `variant="embedded"` on `ViewerFrame` (and its `Scene3DFrame` / `Map2DCanvas` / `VideoStreamTile` presets), `DataGrid`, and `DataToolbar`. When one of these surfaces is nested inside another surface — a `CanvasEditorShell` canvas slot, a `Card`, a wrapping collection `section`, or a `DockPanel` body — `embedded` drops the component's own border and radius so the parent owns one continuous perimeter. Viewport/grid chrome, normalized state, HUD/toolbar, and accessibility roles are unchanged; `DataToolbar` keeps only a bottom divider as a header bond. Default `standalone` is unchanged, so this is non-breaking. Extends the existing `variant="embedded"` convention (`Banner`, `FilterBar`, `ResourceState`) to container/frame surfaces.

### Fixed

- Menu keyboard navigation no longer loses a keystroke to the queued entry focus. `DropdownMenu`, `Menubar`, and `SplitButton` share a roving-focus engine that focuses the edge item one animation frame after the menu (or a drill level) renders; a key pressed before that frame arrived was silently undone when it fired, so drilling into a submenu a second time left focus on the first item and the submenu never opened. The queued frame is now cancelled as soon as keyboard navigation moves focus.
- Selecting one `Category` chip no longer leaves a previously `active` chip selected as well, and the same duplicate-selection defect is fixed in `Tabs`. `item.active` now initializes the uncontrolled selection instead of being merged into every render, so exactly one chip or tab is ever current.
- Navigation semantics that were visual-only are now exposed to assistive technology: `Steps` and the `Wizard` indicator are an ordered list with `aria-current="step"` and visually hidden 완료/현재 단계/예정 state text, `Breadcrumb` and `SideNav`/`TopBar`/`Footer` navigation render real `ol`/`ul` lists, `Anchor` nests its list by heading level, and `Category` exposes a `radiogroup` with arrow-key selection. `PageIndicator` announces its position instead of rendering empty dots, and interactive dots meet the 24px target size.
- `Wizard footer` is rendered again. The prop was declared as a `ReactNode` but only ever read as a null check, so a custom footer was accepted and then discarded.
- `SideNav` collapsed rail labels use the design system `Tooltip` instead of the native `title` attribute, so they are reachable by keyboard and touch rather than pointer-only.
- `Menubar` drill mode keeps a valid ARIA menu: the back control is a `menuitem` inside the roving order, drill triggers expose `aria-expanded`, and radio runs are grouped.
- Republished the release set to repair the `@lk-design-system/lds-core@0.1.0-rc.0` artifact, which shipped without `dist/` although its export map pointed at `./dist/*`, making every deep component subpath unresolvable for consumers (including `lds-robotics-ui` and this repository's own Storybook). `lds-core`, `lds-theme`, `lds-product`, and the `design-system-core` facade are released as `0.1.0-rc.1`; `lds-robotics-ui` is released as `0.1.0-rc.2` against them from its own repository.
- Accordion and Collapsible collapsed content is now removed from the accessibility tree and tab order (`inert`) and each trigger names its panel via `aria-controls`, closing the benchmark-flagged disclosure defect.
- Cross-entity label overlaps on dense navigation maps: a route's progress label could cover a trajectory's label, and adjacent `FacilityTransition` markers could cover each other's label blocks. Both cases are now coordinated (and gated by story play assertions) when composed under `NavigationAnnotationLayer`.

### Changed

- **Removed `SideNav collapsible`.** The panel no longer renders any internal collapse toggle; the shell's top-bar toggle driving `collapsed`/`onCollapsedChange` is the only supported control. See Migration.
- `AnnotatedImage` region labels are now detection-tool tags: the label is filled with the region's tone colour and attached to the box edge, so a label belongs to its box by colour rather than by proximity. Labels sit outside the top edge by default, fall back inside when the frame leaves no room above, and flip below when another region covers the top strip — overlapping detections (a part inside a whole) no longer stack their labels or truncate them to the small box's width.
- `ChartFrame` header is a two-row anatomy — title with inline meta and vertically centred actions on the first row, description across the second — instead of a three-line text stack with a toolbar floating beside it. `RefreshControl` orders its parts as freshness text, interval select, then an icon-only refresh action, so the corner-most element is the action rather than a passive timestamp (AWS console and Grafana convention).
- `PrimaryDetail detailFooter` is a right-aligned action row in both inline and overlay presentations, matching the Drawer footer it already used in overlay mode.
- Elevation is now governed by how a surface attaches: floating popups keep an all-round shadow, edge-attached overlays clip the shadow to the edge that actually covers content, and in-flow surfaces use a divider instead of a shadow. `SideNav` overlay peek follows this on both `floating` and `docked` surfaces; the rule is recorded in `docs/TOKEN_GOVERNANCE.md`.
- Reworked the communication family around a general AI conversation hierarchy: assistant turns use a borderless document presentation while participant turns read at a glance—the user's own turns use a solid primary bubble (`primary-heavy`/`static-white`, AA in both themes) with a bubble-foot send time and `read` receipt, human-agent turns use a neutral fill bubble, and system events use a centered neutral pill chip (distinct from the blue role badge); `AI`/`상담원` role badges (overridable via `roleBadgeLabel`) name the speaker type, the feed stays chrome-free with a circular icon scroll-to-latest control that carries an unread-count badge (its history control stays a text action so its loading state reads clearly), and the composer exposes generic leading/trailing action slots.
- Added a `compact` presentation to `SourceDisclosure` that renders each source as a single-line, attachment-weight link chip—no card surface, inline disclosure, or availability badge—for contexts where every listed source is expected to be usable, such as citations under a chat answer; the conversation examples cite sources with it and surface message quick-actions as icon-only controls.
- Reworked `EquipmentStatusCard` as a semantic equipment identity, visible status, and labeled-facts card derived from LDS and authoritative status/summary-list references rather than a product-specific ledger row.
- Clarified that pinned product frontends are authoritative only for component/workflow coverage, states, density, and ownership seams—not LDS anatomy, styling, tokens, or public API design.
- Added a canonical `ConnectionBadge connectionState` transport axis and a machine-readable robotics semantic registry that keeps connectivity, freshness, health, operability, authority, command, evidence, review, and urgency independent.

### Migration

- Remove `collapsible` from `SideNav`. Own the collapsed state in the shell and pass `collapsed`/`onCollapsedChange`, then render the toggle at the start of the top bar (`SidebarTrigger` placement for side-first shells, `SideNavToggleButton` placement for header-first shells) with `aria-expanded` and `aria-controls` pointing at the `SideNav` id. Keyboard, focus restore, and the collapsed icon rail are unchanged; only the panel-internal button is gone.
- New imports should use the owning layer subpath. Existing imports from `@lk-design-system/design-system-core` remain compatible during the migration window.
- Replace `ConversationMessage variant="soft|solid"` with `presentation="document|bubble"`; omit it for the role defaults. Replace `sourcePresentation` and source arrays with an explicit `SourceDisclosure` (or other provenance node) passed to the `sources` slot. Move response cancellation to `MessageComposer onStop`.
- Replace `MessageComposer attachmentAction`/`secondaryActions` with `leadingActions`/`trailingActions`.
- Replace `EquipmentStatusCard ringLabel`, `ringCaption`, `tone`, `direction`, `connection`, and `chips` with `status`, `statusTone`, and labeled `details`; compose direction or connection indicators inside detail values.
- Use `ConnectionBadge connectionState="unknown|connecting|connected|degraded|reconnecting|disconnected|failed"` in new code. The legacy `status` prop remains compatible; represent `stale` as freshness evidence outside the badge.
- Nesting a Viewer preset (`Scene3DFrame`, `Map2DCanvas`, `VideoStreamTile`) inside a `CanvasEditorShell` or `Card`: pass `variant="embedded"` instead of insetting the viewport or overriding `border`/`borderRadius` through `style`. For the `DataToolbar` + `DataGrid` + `Pagination` collection pattern, pass `variant="embedded"` on the toolbar and grid instead of stripping each part's perimeter with inline `border:0`/`borderRadius:0`.

## 0.1.0-rc.0 - 2026-07-19

### Added

- Published-package manifests for Core, Theme, Product, Robotics UI, and the legacy compatibility facade. All internal dependencies are pinned to this immutable release-set version.

## 0.1.0 - 2026-07-11

### Added

- Automated accessibility lifecycle, target-size, API grammar, token hygiene, motion, prompt, story coverage, pixel regression, package artifact, and strict React consumer checks.
- Compiled per-component package subpaths and React 18/19 strict declaration coverage.

### Changed

- Split the package build into tree-shakeable component entries and preserved the `"use client"` boundary in ESM and CJS output.
- Normalized modal focus handling, menu keyboard behavior, field sizing, status semantics, overlay surfaces, copy conventions, and composed layout hierarchy.
- Replaced the oversized traced Instagram asset with a compact equivalent vector.

### Fixed

- Removed accidental runtime dependency pollution and raw JSX/prompt publication.
- Resolved global JSX namespace and intrinsic HTML prop conflicts in public declarations.
- Corrected Dimmer contrast, table numeric alignment, viewer fallback icons, focus trapping, and multiple keyboard interaction gaps.

### Deprecated

- See [the generated deprecation register](docs/DEPRECATIONS.md).
