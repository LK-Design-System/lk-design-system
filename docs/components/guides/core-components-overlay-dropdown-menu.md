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

- 버튼이나 항목에 연결된 짧은 명령 목록과 단일·다중 선택 메뉴를 제공할 때 적합합니다. 항상 보이는 앱 수준 메뉴나 즉시 노출해야 할 핵심 action에는 Dropdown Menu 대신 Menubar 또는 Button을 사용하세요.
- Use for trigger-bound command menus. Use Menubar for a horizontal application menu.
- submenuMode — 서브메뉴 표현 방식(flyout 기본, drill).
- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-….

### 사용하지 않음

- 문자 탐색(typeahead) — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면 버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 다음부터 찾아 같은 초성 항목을 순환하고, 두 글자 이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에 포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 SplitButton·Menubar와 공유합니다.
- menuActionArea는 onCancel·onApply 중 제공된 실제 동작만 Cancel/Apply 버튼으로 만듭니다. 기본 문구는 cancelLabel="취소", applyLabel="적용"이며 제품 문맥에 맞게 바꿀 수 있습니다. 콜백이나 custom action이 없으면 무동작 버튼을 만들지 않습니다. 마지막 menu item에서 Tab하면 menu role 밖의 action group으로 이동하고, Shift+Tab은 마지막 사용 가능 item으로 돌아가며, action group의 Escape·클릭 완료는 닫은 뒤 trigger focus를 복원합니다….
- React Aria Menu — 복합 menu의 방향키 이동, 명령/선택 item 역할, disabled item 제외를 따릅니다. WDS의 normal/radio/checkbox 시각 축은 변경하지 않습니다.
- Floating UI flip, shift, size — preferred bottom을 우선하고 공간이 없으면 top으로 flip한 뒤 viewport 16px 안으로 shift하고, 남은 높이는 scrollable menu region의 max-height로 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DropdownMenu의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Trigger | trigger 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Menu Action Area | Show generated action controls when onApply or onCancel is provided. @default false |
| Action | Custom action region. Replaces generated apply/cancel controls. |
| Apply Label | applyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Cancel Label | cancelLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `items` | `DropdownMenuItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `align` | `"left" \| "right"` | No | 공개 타입 계약에 정의된 속성입니다. |
| `variant` | `"normal" \| "radio" \| "checkbox"` | No | menu variant axis. @default "normal" |
| `submenuMode` | `"flyout" \| "drill"` | No | 중첩 서브메뉴 표현 방식. flyout은 부모 옆으로 겹겹이 뜨고(데스크톱 표준), drill은 같은 패널이 하위 목록으로 전환되며 상단에 뒤로 컨트롤을 둡니다(폭 고정·터치 친화). @default "flyout" |
| `cellPadding` | `8 \| 12 \| "8px" \| "12px" \| "small" \| "medium"` | No | menu cell padding axis. @default "12px" |
| `verticalPadding` | `8 \| 12 \| "8px" \| "12px" \| "small" \| "medium"` | No | menu vertical padding axis. Defaults to cellPadding. |
| `menuActionArea` | `boolean` | No | Show generated action controls when onApply or onCancel is provided. @default false |
| `action` | `React.ReactNode` | No | Custom action region. Replaces generated apply/cancel controls. |
| `onApply` | `() = void` | No | Apply callback. The generated control closes the menu and restores trigger focus. |
| `onCancel` | `() = void` | No | Cancel callback. The generated control closes the menu and restores trigger focus. |
| `applyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `cancelLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `width` | `number \| string` | No | menu width. @default 320 |
| `maxHeight` | `number \| string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `open` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultOpen` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onOpenChange` | `(open: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| variant | menu variant axis. @default "normal" 타입 계약: "normal" \| "radio" \| "checkbox" |
| open | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| defaultOpen | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| onOpenChange | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (open: boolean) = void |
| 상호작용 · 드릴인 서브메뉴 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 중첩 서브메뉴 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 키보드 탐색 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- WDS axes: variant (normal, radio, checkbox), menuActionArea, and scroll via maxHeight.
- 선택 상태 표시 — radio·checkbox의 checked는 glyph와 medium weight로만 표시하며, 배경 하이라이트는 hover/focus·열린 서브메뉴 trigger 전용입니다(여러 항목이 checked여도 포인터·focus 위치가 구분됩니다). variant="normal"의 active(aria-current) 항목만 glyph가 없으므로 hover보다 옅은 --component-menu-item-selected-bg(fill-alternative) 상시 배경을 가집니다. Menubar와 같은 계약입니다.
- 중첩 서브메뉴 — item에 items(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다: 오른쪽 chevron과 aria-haspopup="menu"를 갖고 Arrow Right로 진입, Arrow Left로 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히고 최상위 trigger로 focus가 돌아옵니다.
- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-….
- drill — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙습니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않아(꼬리물기 없음) 좁은 패널·터치·깊은 중첩에 적합합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-… |
| 명시 규칙 2 | 문자 탐색(typeahead) — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면 버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 다음부터 찾아 같은 초성 항목을 순환하고, 두 글자 이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에 포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 SplitButton·Menubar와 공유합니다. |
| 명시 규칙 3 | 선호 width는 viewport 안에서 clamp되고 아래 공간이 부족하면 위로 flip합니다. WDS Menu의 r16·8px/20px shell과 shadow-md는 유지하며, r12·16px padding인 Popover와 시각 역할을 합치지 않습니다. |
| 명시 규칙 4 | Floating UI flip, shift, size — preferred bottom을 우선하고 공간이 없으면 top으로 flip한 뒤 viewport 16px 안으로 shift하고, 남은 높이는 scrollable menu region의 max-height로 사용합니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- WDS axes: variant (normal, radio, checkbox), menuActionArea, and scroll via maxHeight.
- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-….
- drill — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙습니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않아(꼬리물기 없음) 좁은 패널·터치·깊은 중첩에 적합합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
- 문자 탐색(typeahead) — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면 버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 다음부터 찾아 같은 초성 항목을 순환하고, 두 글자 이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에 포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 SplitButton·Menubar와 공유합니다.

## Content and writing

- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-….
- drill — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙습니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않아(꼬리물기 없음) 좁은 패널·터치·깊은 중첩에 적합합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
- trigger는 aria-haspopup·aria-expanded·aria-controls를 받습니다. Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열고, 열린 메뉴는 Up/Down·Home/End·문자 탐색과 Escape focus 복원을 지원합니다. menu는 trigger id를 aria-labelledby로 참조합니다. Tab은 메뉴를 닫고 정상 문서 순서로 이동합니다.
- menuActionArea는 onCancel·onApply 중 제공된 실제 동작만 Cancel/Apply 버튼으로 만듭니다. 기본 문구는 cancelLabel="취소", applyLabel="적용"이며 제품 문맥에 맞게 바꿀 수 있습니다. 콜백이나 custom action이 없으면 무동작 버튼을 만들지 않습니다. 마지막 menu item에서 Tab하면 menu role 밖의 action group으로 이동하고, Shift+Tab은 마지막 사용 가능 item으로 돌아가며, action group의 Escape·클릭 완료는 닫은 뒤 trigger focus를 복원합니다….

## Accessibility

- 선택 상태 표시 — radio·checkbox의 checked는 glyph와 medium weight로만 표시하며, 배경 하이라이트는 hover/focus·열린 서브메뉴 trigger 전용입니다(여러 항목이 checked여도 포인터·focus 위치가 구분됩니다). variant="normal"의 active(aria-current) 항목만 glyph가 없으므로 hover보다 옅은 --component-menu-item-selected-bg(fill-alternative) 상시 배경을 가집니다. Menubar와 같은 계약입니다.
- 중첩 서브메뉴 — item에 items(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다: 오른쪽 chevron과 aria-haspopup="menu"를 갖고 Arrow Right로 진입, Arrow Left로 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히고 최상위 trigger로 focus가 돌아옵니다.
- flyout — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 12단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 role="menu"(부모 라벨로 aria-label)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(aria-haspopup="menu"·aria-expanded·열렸을 때 aria-….
- drill — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(aria-label="뒤로 …")이 붙습니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않아(꼬리물기 없음) 좁은 패널·터치·깊은 중첩에 적합합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
- 뒤로 컨트롤은 role="menu"의 직계 자식이므로 role="menuitem"을 갖고 roving 대상에 포함됩니다 (ARIA menu required-children 위반과 포인터 전용 컨트롤을 동시에 없앱니다). Arrow Up/Down으로 다른 항목처럼 도달하고, data-menu-back 표시 덕분에 레벨 진입 focus만 첫 명령으로 건너뜁니다. Menubar의 data-menubar-drill-back과 같은 계약입니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use for trigger-bound command menus. Use Menubar for a horizontal application menu. |
| Don't | 문자 탐색(typeahead) — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면 버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 다음부터 찾아 같은 초성 항목을 순환하고, 두 글자 이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에 포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 SplitButton·Menubar와 공유합니다. |
| Do | submenuMode — 서브메뉴 표현 방식(flyout 기본, drill). |
| Don't | menuActionArea는 onCancel·onApply 중 제공된 실제 동작만 Cancel/Apply 버튼으로 만듭니다. 기본 문구는 cancelLabel="취소", applyLabel="적용"이며 제품 문맥에 맞게 바꿀 수 있습니다. 콜백이나 custom action이 없으면 무동작 버튼을 만들지 않습니다. 마지막 menu item에서 Tab하면 menu role 밖의 action group으로 이동하고, Shift+Tab은 마지막 사용 가능 item으로 돌아가며, action group의 Escape·클릭 완료는 닫은 뒤 trigger focus를 복원합니다…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DropdownMenu의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Alert` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConfirmDialog` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Dimmer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Modal` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Snackbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DropdownMenu trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, { divider: true }, { label: 'Delete', danger: true }]} />
<DropdownMenu
  variant="checkbox"
  menuActionArea
  items={[{ label: 'Option', checked: true }]}
  onCancel={discardDraft}
  onApply={applySelection}
/>
```

## Tokens and API

### Tokens

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
- `--component-menu-item-hover-bg`
- `--component-menu-item-selected-bg`
- `--component-menu-padding-x`
- `--component-menu-padding-y`
- `--component-menu-radius`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-regular`
- `--label2-size`
- `--radius-5`
- `--radius-md`
- `--shadow-md`
- `--space-2`
- `--space-8`

### Source contracts

- `components/overlay/DropdownMenu.jsx`
- `components/overlay/DropdownMenu.d.ts`
- `components/overlay/DropdownMenu.prompt.md`
- `stories/OverlayDropdownMenu.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DropdownMenu prompt contract: `components/overlay/DropdownMenu.prompt.md`
- Storybook implementation evidence: `stories/OverlayDropdownMenu.stories.jsx`
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [React Aria Menu](https://react-aria.adobe.com/Menu)
- [Floating UI flip](https://floating-ui.com/docs/flip)
- [shift](https://floating-ui.com/docs/shift)
- [size](https://floating-ui.com/docs/size)
- [SEED Dropdown Menu benchmark](https://seed-design.io/components/menu)
