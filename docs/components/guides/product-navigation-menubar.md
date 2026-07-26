# Menubar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `Menubar` |
| Storybook | `LDS Product/Navigation/Menubar` |
| Source | `../component-content.json#product-navigation-menubar` |

파일·보기·도움말처럼 여러 command group을 항상 보이는 상단 메뉴로 제공할 때 적합합니다. 한 trigger에만 관련된 짧은 명령이나 화면 이동에는 Menubar 대신 Dropdown Menu 또는 Top Bar를 사용하세요.

## 사용 판단

### 사용

- Menubar - WDS horizontal menu bar for grouped commands.

## Anatomy

| Part | Contract |
| --- | --- |
| menuActionArea | Show generated action controls for menus with apply/cancel callbacks. @default false |
| ariaLabel | menubar의 접근 가능한 이름. @default "명령 메뉴" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `menus` | `MenubarMenu[]` | Yes |  |
| `variant` | `"normal" \| "radio" \| "checkbox"` | No | menu variant axis. @default "normal" |
| `submenuMode` | `"flyout" \| "drill"` | No | 중첩 서브메뉴 표현 방식. flyout은 부모 옆으로 겹겹이 뜨고(데스크톱 표준), drill은 같은 패널이 하위 목록으로 전환되며 상단에 뒤로 컨트롤을 둡니다(폭 고정·터치 친화). @default "flyout" |
| `menuActionArea` | `boolean` | No | Show generated action controls for menus with apply/cancel callbacks. @default false |
| `onApply` | `(menu: MenubarMenu, index: number) = void` | No | Fallback apply callback for menus without a per-menu callback. |
| `onCancel` | `(menu: MenubarMenu, index: number) = void` | No | Fallback cancel callback for menus without a per-menu callback. |
| `applyLabel` | `React.ReactNode` | No |  |
| `cancelLabel` | `React.ReactNode` | No |  |
| `maxHeight` | `number \| string` | No |  |
| `ariaLabel` | `string` | No | menubar의 접근 가능한 이름. @default "명령 메뉴" |

## States

| State | Contract |
| --- | --- |
| variant | menu variant axis. @default "normal" |

## Behavior and interaction

- 포인터 hover transfer: 메뉴가 하나라도 열려 있는 동안 이웃 top-level 항목에 포인터가 들어오면 해당 메뉴가 바로 열립니다(native menubar·Fluent 관례). 닫힌 상태의 단순 hover는 메뉴를 열지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 중첩 서브메뉴 — 드롭다운 항목에 items(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다(오른쪽 chevron·aria-haspopup="menu"). Arrow Right로 진입, Arrow Left로 복귀하고 하위 명령을 고르면 전체 메뉴가 닫힙니다. Menubar 고유의 34px compact 항목 시각은 유지합니다. |
| 명시 규칙 2 | submenuMode — 서브메뉴 표현 방식(flyout 기본, drill). flyout은 서브 패널이 부모 드롭다운 옆으로 겹겹이 뜨고(부모 scroll/overflow에 잘리지 않도록 로 portal, 겹침 없이 배치, hover 120ms), drill은 같은 드롭다운이 하위 목록으로 전환되며 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙어 폭이 고정됩니다(꼬리물기 없음). |
| 명시 규칙 3 | 빈 menu와 모두 비활성인 menu에서도 trigger가 Escape를 받아 닫힘·focus 복원을 수행합니다. submenu는 아래 공간이 부족하면 위로 flip하고 viewport 16px 안으로 shift·size되어 320px 폭에서 가로 스크롤을 만들지 않습니다. |
| 명시 규칙 4 | radio·checkbox의 14px border, 6px radio dot, checkbox check glyph와 disabled color는 DropdownMenu와 동일합니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- WDS axes: variant, menuActionArea, and scroll via maxHeight.
- Floating UI flip, shift, size — preferred bottom → opposite flip → cross-axis clamp → available-height scroll 순서를 공용 anchored-overlay 훅에 적용했습니다.
- DropdownMenu와 submenu glyph·elevated surface·viewport positioning·action region을 공유합니다.
- 항상 보이는 horizontal menubar의 roving top-level focus와 compact 34px chrome은 persistent app command 역할에 필요한 차이이므로 유지합니다.

## Content and writing

- Use for command groups. Menu items support normal, radio, checkbox, disabled, danger, divider, description, and shortcut states.
- menuActionArea는 menu별 또는 Menubar 공통 onCancel·onApply 중 제공된 실제 callback만 Cancel/Apply 버튼으로 만듭니다. callback이나 custom action이 없으면 무동작 Apply를 만들지 않습니다. 기본 cancelLabel은 취소, applyLabel은 적용이며 menu별로 덮어쓸 수 있습니다. action region은 긴 menu 목록의 scroll 밖에 고정됩니다.

## Accessibility

- 연속된 menuitemradio 세트는 role="group"으로 묶어 ARIA menu content model을 지킵니다(시각 변화 없음).
- 키보드 계약: top-level은 Left/Right와 Home/End로 이동하고 Enter/Space/Arrow Down은 첫 submenu 항목, Arrow Up은 마지막 항목으로 엽니다. submenu는 Up/Down·Home/End·문자 탐색을 지원하며 Left/Right는 이웃 메뉴로 전환합니다. Escape는 닫고 원래 top-level item으로 돌아갑니다.
- pointer hover는 키보드 focus를 빼앗지 않습니다. submenu의 aria-labelledby는 top-level item을 참조하고, 선택 항목 아래의 menuActionArea는 menu role 밖의 별도 action region으로 렌더됩니다. action region은 마지막 menu item에서 Tab으로 접근하고 Escape로 원래 top-level item에 복원합니다.
- Menubar는 항상 보이는 수평 command surface이고 Dropdown Menu는 단일 trigger의 임시 메뉴입니다. 이 역할 차이 때문에 top-level chrome과 compact submenu spacing은 유지하되, elevated surface·line· shadow와 menu keyboard engine은 공유합니다.
- WAI-ARIA Menu and Menubar Pattern — 수평 menubar의 roving focus, Left/Right top-level 이동, submenu Up/Down, Escape 복원을 적용했습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `HoverCard` | 대표 시나리오에서 조합 |
| `Popover` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Menubar menus={[{ label: 'File', items: [{ label: 'New' }, { label: 'Open', shortcut: '⌘O' }] }]} />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-negative-text`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--label2-size`
- `--radius-5`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--shadow-md`
- `--space-0-5`
- `--space-1-5`
- `--space-2`
- `--space-8`

### Source contracts

- `components/navigation/Menubar.jsx`
- `components/navigation/Menubar.d.ts`
- `components/navigation/Menubar.prompt.md`
- `stories/NavigationMenubar.stories.jsx`

## Sources

- Menubar prompt contract: `components/navigation/Menubar.prompt.md`
- Storybook implementation evidence: `stories/NavigationMenubar.stories.jsx`
- [WAI-ARIA Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [Fluent 2 Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage)
- [Floating UI flip](https://floating-ui.com/docs/flip)
- [shift](https://floating-ui.com/docs/shift)
- [size](https://floating-ui.com/docs/size)
