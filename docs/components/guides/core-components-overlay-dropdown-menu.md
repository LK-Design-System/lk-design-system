# Dropdown Menu

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `DropdownMenu` |
| Storybook | `LDS Core/Components/Overlay/Dropdown Menu` |
| Source | `../component-content.json#core-components-overlay-dropdown-menu` |

버튼이나 항목에 연결된 짧은 명령 목록과 단일·다중 선택 메뉴를 제공할 때 적합합니다. 항상 보이는 앱 수준 메뉴나 즉시 노출해야 할 핵심 action에는 Dropdown Menu 대신 Menubar 또는 Button을 사용하세요.

## 사용 판단

### 사용

- Use for trigger-bound command menus. Use Menubar for a horizontal application menu.
- submenuMode — 서브메뉴 표현 방식(flyout 기본, drill).
- Because the panel leaves its physical ancestor, the root portal copies the nearest explicit data-theme or .theme-light|dark|auto scope onto the portal wrapper. Semantic CSS variables therefore resolve against the same theme as the trigger even when document.body uses a different theme.

### 사용하지 않음

- React Aria Menu — 복합 menu의 방향키 이동, 명령/선택 item 역할, disabled item 제외를 따릅니다. WDS의 normal/radio/checkbox 시각 축은 변경하지 않습니다.
- Floating UI flip, shift, size — preferred bottom을 우선하고 공간이 없으면 top으로 flip한 뒤 viewport 16px 안으로 shift하고, 남은 높이는 scrollable menu region의 max-height로 사용합니다.
- Menubar의 persistent horizontal top-level chrome은 포함하지 않고 단일 trigger 관계만 유지합니다.
- CSS Overflow Module Level 3 confirms that visible on one axis computes to auto when the other axis is scrollable, so an absolutely positioned descendant cannot reliably escape a horizontal scroll wrapper.

## Anatomy

| Part | Contract |
| --- | --- |
| menuActionArea | Show generated action controls for staged selection when onApply or onCancel is provided. @default false |
| action | Custom action region. Replaces generated apply/cancel controls. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes |  |
| `items` | `DropdownMenuItem[]` | Yes |  |
| `align` | `"left" \| "right"` | No |  |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | Preferred side; flips when space is insufficient. @default "bottom" |
| `offset` | `number` | No | Trigger-to-panel gap in pixels. @default 8 |
| `variant` | `"normal" \| "radio" \| "checkbox"` | No | menu variant axis. @default "normal" |
| `submenuMode` | `"flyout" \| "drill"` | No | 중첩 서브메뉴 표현 방식. flyout은 부모 옆으로 겹겹이 뜨고(데스크톱 표준), drill은 같은 패널이 하위 목록으로 전환되며 상단에 뒤로 컨트롤을 둡니다(폭 고정·터치 친화). @default "flyout" |
| `density` | `"compact" \| "default" \| "comfortable"` | No | Semantic menu row density. @default "default" |
| `cellPadding` | `8 \| 12 \| "8px" \| "12px" \| "small" \| "medium"` | No | Legacy WDS cell-padding compatibility axis. Prefer density. |
| `verticalPadding` | `8 \| 12 \| "8px" \| "12px" \| "small" \| "medium"` | No | Legacy vertical-padding compatibility axis. Prefer density. |
| `menuActionArea` | `boolean` | No | Show generated action controls for staged selection when onApply or onCancel is provided. @default false |
| `action` | `React.ReactNode` | No | Custom action region. Replaces generated apply/cancel controls. |
| `onApply` | `() = void` | No | Apply callback. The generated control closes the menu and restores trigger focus. |
| `onCancel` | `() = void` | No | Cancel callback. The generated control closes the menu and restores trigger focus. |
| `applyLabel` | `React.ReactNode` | No |  |
| `cancelLabel` | `React.ReactNode` | No |  |
| `width` | `number \| string` | No | Explicit menu width. Omit for the adaptive 176–320px content-width policy. |
| `minWidth` | `number \| string` | No | Minimum menu width override. Adaptive menus default to 176px within the viewport. |
| `maxHeight` | `number \| string` | No |  |
| `open` | `boolean` | No |  |
| `defaultOpen` | `boolean` | No |  |
| `onOpenChange` | `(open: boolean) = void` | No |  |
| `withinPortal` | `boolean` | No | Escape clipping ancestors through the owner-document Portal. @default true |
| `portalTarget` | `HTMLElement \| null` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | menu variant axis. @default "normal" |

## Behavior and interaction

- 명령과 checkbox 선택은 기본적으로 누르는 즉시 반영하므로 action area를 붙이지 않습니다.
- WAI-ARIA Menu Button Pattern — menu button의 trigger 상태와 열림 시 첫/마지막 항목 focus 이동을 적용했습니다.
- Menubar submenu와 check/radio glyph, elevated surface, keyboard engine, action button 순서를 공유합니다.
- Popover는 임의의 interactive content surface이므로 16px content padding을 유지하고, 명령·선택 row를 담는 DropdownMenu의 8px shell과 구분합니다.
- Geometry overrides are limited to --lds-dropdown-menu-width, --lds-dropdown-menu-min-width, and --lds-dropdown-menu-max-height. Menu roles, roving focus, nested stack, Escape, and focus restoration remain LDS-owned.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 기본 밀도 규약 — 모든 DropdownMenu·TopBar menu·LanguageSwitcher는 panel padding 8px, item gap 4px, panel radius 12px, 기본 item 14/20px·최소 높이 40px, item padding 10px 16px, item radius 10px를 공유합니다. 설명이 있는 item은 이 최소 높이를 유지한 채 콘텐츠 높이에 따라 자연스럽게 늘어납니다. |
| 명시 규칙 2 | 스크롤이 필요한 메뉴는 scrollbar-gutter: stable로 폭 변화를 막고, 항목 배경과 scrollbar 사이에 --component-menu-scrollbar-gap 4px을 유지합니다. |
| 명시 규칙 3 | compact는 pointer 중심의 13/18px·32px item과 6px 12px padding, comfortable은 touch 중심의 16/24px·48px item과 12px 16px padding을 사용합니다. cellPadding·verticalPadding은 WDS/기존 소비자 호환용이며 새 사용처의 밀도 선택 수단으로 권장하지 않습니다. |
| 명시 규칙 4 | 텍스트 menu button trigger는 16px trailing chevron-down-small로 펼침 가능성을 명시합니다. 이미 범주가 명확한 overflow·utility icon trigger에는 chevron을 중복하지 않습니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- WDS axes: variant (normal, radio, checkbox)과 기존 cellPadding. LDS의 새 코드는 raw padding 대신 density="compact | default | comfortable"를 사용합니다. 긴 목록은 maxHeight로 scroll 영역을 제한합니다.
- 뒤로 행은 16px leading chevron, 14/20px semibold label, default 40px 높이를 사용합니다. 하위 명령과는 1px low-contrast divider와 공통 4px item gap만으로 구분하며 별도 여백을 중복하지 않습니다.
- 문자 탐색(typeahead) — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면 버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 다음부터 찾아 같은 초성 항목을 순환하고, 두 글자 이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에 포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 SplitButton·Menubar와 공유합니다.
- 기본 너비 규약 — width를 생략하면 normal·radio·checkbox·flyout·drill 모두 가장 긴 item·shortcut·action 영역에 맞춰 max-content로 늘어나되 --component-menu-min-width 176px과 --component-menu-max-width 320px 사이에서만 변합니다. viewport 양쪽 16px 여백보다 넓어지지 않으며, 최대 폭에 도달한 긴 label·description은 줄바꿈합니다.

## Content and writing

- menuActionArea는 서버 반영 비용이 크거나 여러 설정을 원자적으로 확정해야 하는 명시적인 staged workflow에서만 onCancel·onApply 중 제공된 실제 동작을 Cancel/Apply 버튼으로 만듭니다. 단순한 다중 선택이나 열기·복제·삭제처럼 선택 즉시 실행되는 메뉴에는 사용하지 않습니다. 기본 문구는 cancelLabel="취소", applyLabel="적용"이며 제품 문맥에 맞게 바꿀 수 있습니다. 콜백이나 custom action이 없으면 무동작 버튼을 만들지 않습니다.
- Carbon Menu와 Menu Button — menu item 높이를 24/32/40/48px size 축으로 관리하고, 짧은 메뉴는 최소 160px에서 시작해 긴 label에 따라 최대 288px까지 확장합니다. LDS는 14/20px·40px을 desktop default로 두고 32/48px을 compact/comfortable density로 분리하며, 기존 LDS 리듬에 맞춰 적응형 폭을 176–320px로 조정합니다.
- ref, className, and style target the anchor root. Stable parts are root, trigger, panel, menu, item, divider, and actionArea; per-item class/style composes after the shared item part.
- React createPortal documents portals as the escape hatch for clipping ancestors while retaining React-tree context and event propagation.

## Accessibility

- 선택 상태 표시 — radio·checkbox의 checked는 glyph와 medium weight로만 표시하며, 배경 하이라이트는 hover/focus·열린 서브메뉴 trigger 전용입니다(여러 항목이 checked여도 포인터·focus 위치가 구분됩니다). variant="normal"의 active(aria-current) 항목만 glyph가 없으므로 hover보다 옅은 --component-menu-item-selected-bg(fill-alternative) 상시 배경을 가집니다. Menubar와 같은 계약입니다.
- 중첩 서브메뉴 — item에 items(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다: 오른쪽 chevron과 aria-haspopup="menu"를 갖고 Arrow Right로 진입, Arrow Left로 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히고 최상위 trigger로 focus가 돌아옵니다.
- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다.
- drill — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙습니다. 각 단계도 공통 176–320px 적응형 폭을 사용해 짧은 계층에 불필요한 빈 공간을 만들지 않습니다. 제품 레이아웃이 전환 중 같은 폭을 요구할 때만 width를 명시합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
- 뒤로 컨트롤은 role="menu"의 직계 자식이므로 role="menuitem"을 갖고 roving 대상에 포함됩니다 (ARIA menu required-children 위반과 포인터 전용 컨트롤을 동시에 없앱니다). Arrow Up/Down으로 다른 항목처럼 도달하고, data-menu-back 표시 덕분에 레벨 진입 focus만 첫 명령으로 건너뜁니다. Menubar의 data-menubar-drill-back과 같은 계약입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Table` | 대표 시나리오에서 조합 |
| `Alert` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `Dimmer` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Snackbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DropdownMenu trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, { divider: true }, { label: 'Delete', danger: true }]} />
<DropdownMenu
  variant="checkbox"
  density="compact"
  items={[{ label: 'Option', checked: true }]}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-negative-text`
- `--component-menu-gap`
- `--component-menu-header-font-size`
- `--component-menu-header-font-weight`
- `--component-menu-header-line-height`
- `--component-menu-item-font-size`
- `--component-menu-item-hover-bg`
- `--component-menu-item-line-height`
- `--component-menu-item-min-height`
- `--component-menu-item-padding-x`
- `--component-menu-item-padding-y`
- `--component-menu-item-radius`
- `--component-menu-item-selected-bg`
- `--component-menu-max-width`
- `--component-menu-min-width`
- `--component-menu-padding-x`
- `--component-menu-padding-y`
- `--component-menu-radius`
- `--component-menu-scrollbar-gap`
- `--dropdown-menu-item-min-height`
- `--dropdown-menu-item-padding-x`
- `--dropdown-menu-item-padding-y`
- `--dropdown-menu-item-radius`
- `--font-sans`
- `--fw-medium`
- `--fw-regular`
- `--label2-line`
- `--label2-size`
- `--lds-dropdown-menu-max-height`
- `--lds-dropdown-menu-min-width`
- `--lds-dropdown-menu-width`
- `--radius-5`
- `--shadow-md`
- `--space-2`
- `--space-2-5`
- `--space-8`

### Source contracts

- `components/overlay/DropdownMenu.jsx`
- `components/overlay/DropdownMenu.d.ts`
- `components/overlay/DropdownMenu.prompt.md`
- `stories/OverlayDropdownMenu.stories.jsx`

## Migration

- TopBar와 LanguageSwitcher는 별도 padding·width 값을 복제하지 않고 공통 --component-menu- 토큰을 alias합니다. 제품별 메뉴 밀도나 고정 폭 차이는 더 이상 기본값으로 만들지 않습니다.
- collisionBoundary는 element 또는 ref를 받아 root panel의 positioning 경계를 viewport와 해당 요소의 보이는 교집합으로 좁힙니다. collisionPadding 기본 16px을 적용한 뒤 flip, shift, maxWidth/maxHeight를 계산하며, 명시적 width·minWidth·style도 그 가용 크기를 넘지 못합니다. 생략하면 기존 viewport 경계가 byte/behavior-compatible하게 유지됩니다.
- Classification: WDS Core with LK Theme Override. WDS의 normal/radio/checkbox와 cell-padding 축은 호환하되, 기본 shell·row 밀도는 TopBar·LanguageSwitcher와 같은 LDS 메뉴 토큰을 사용합니다.

## Sources

- DropdownMenu prompt contract: `components/overlay/DropdownMenu.prompt.md`
- Storybook implementation evidence: `stories/OverlayDropdownMenu.stories.jsx`
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [React Aria Menu](https://react-aria.adobe.com/Menu)
- [Fluent 2 Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage)
- [Carbon Menu](https://carbondesignsystem.com/components/menu/style/)
- [Menu Button](https://carbondesignsystem.com/components/menu-buttons/usage/)
- [Floating UI flip](https://floating-ui.com/docs/flip)
- [shift](https://floating-ui.com/docs/shift)
- [size](https://floating-ui.com/docs/size)
