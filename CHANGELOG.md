# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

## Unreleased

Repository-wide accessibility and convention sweep across the Core (55 areas) and Product (69 areas) layers, audited against WAI-ARIA APG, WCAG 2.2, and current industry systems, with every fix pinned by a hidden contract story. 481 stories are Axe-clean with 262 play contracts.

### Added

- `AutoComplete startIcon`으로 컨트롤 앞에 아이콘을 놓을 수 있습니다. `SearchField`가 이미 쓰는 `startIcon` 슬롯과 같은 자리이며, 값이 채워져 `placeholder`가 사라진 뒤에도 그 칸이 목록을 뒤진다는 사실을 남깁니다. 기본값은 없으므로 기존 화면은 그대로입니다.
- `DataToolbar.filters` render context: `filters={({ size }) => ...}`가 검색과 같은 `sm`/`md` field control 밀도를 전달하며 기존 ReactNode 슬롯은 호환됩니다.
- `DashboardShell`에 계층형 좁은 화면 탐색을 위한 controlled `temporaryNavigation` Drawer 계약을 추가했습니다. 공용 modal 엔진의 스크림·focus containment·Escape·복원·scroll lock을 재사용하고 열린 동안 셸 배경을 `inert` 처리합니다.
- `SideNav autoExpandActiveGroup={false}`로 활성 route 표시와 disclosure 자동 펼침을 분리할 수 있습니다. 기본값 `true`는 기존 동작을 보존합니다.
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
