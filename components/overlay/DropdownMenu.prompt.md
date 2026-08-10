**DropdownMenu** - WDS anchored menu behavior with an LDS shared utility-menu density.

Classification: **WDS Core with LK Theme Override**. WDS의 normal/radio/checkbox와
cell-padding 축은 호환하되, 기본 shell·row 밀도는 TopBar·LanguageSwitcher와 같은
LDS 메뉴 토큰을 사용합니다.

```jsx
<DropdownMenu trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, { divider: true }, { label: 'Delete', danger: true }]} />
<DropdownMenu
  variant="checkbox"
  density="compact"
  items={[{ label: 'Option', checked: true }]}
/>
```

- Use for trigger-bound command menus. Use `Menubar` for a horizontal application menu.
- WDS axes: `variant` (`normal`, `radio`, `checkbox`)과 기존 `cellPadding`. LDS의 새 코드는
  raw padding 대신 `density="compact | default | comfortable"`를 사용합니다. 긴 목록은
  `maxHeight`로 scroll 영역을 제한합니다.
- **기본 밀도 규약** — 모든 DropdownMenu·TopBar menu·LanguageSwitcher는 panel
  padding 8px, item gap 4px, panel radius 12px, 기본 item 14/20px·최소 높이 40px,
  item padding 10px 16px, item radius 10px를 공유합니다. 설명이 있는 item은 이
  최소 높이를 유지한 채 콘텐츠 높이에 따라 자연스럽게 늘어납니다.
- 스크롤이 필요한 메뉴는 `scrollbar-gutter: stable`로 폭 변화를 막고, 항목 배경과
  scrollbar 사이에 `--component-menu-scrollbar-gap` 4px을 유지합니다.
- `compact`는 pointer 중심의 13/18px·32px item과 6px 12px padding,
  `comfortable`은 touch 중심의 16/24px·48px item과 12px 16px padding을 사용합니다.
  `cellPadding`·`verticalPadding`은 WDS/기존 소비자 호환용이며 새 사용처의
  밀도 선택 수단으로 권장하지 않습니다.
- 텍스트 menu button trigger는 16px trailing `chevron-down-small`로 펼침 가능성을
  명시합니다. 이미 범주가 명확한 overflow·utility icon trigger에는 chevron을 중복하지 않습니다.
- **선택 상태 표시** — radio·checkbox의 checked는 glyph와 medium weight로만 표시하며, 배경
  하이라이트는 hover/focus·열린 서브메뉴 trigger 전용입니다(여러 항목이 checked여도 포인터·focus
  위치가 구분됩니다). `variant="normal"`의 `active`(aria-current) 항목만 glyph가 없으므로 hover보다
  옅은 `--component-menu-item-selected-bg`(fill-alternative) 상시 배경을 가집니다. Menubar와 같은
  계약입니다. Custom `item.icon`은 기본적으로 logical start에 놓이며, text-first menu에서 상태 열을
  끝에 정렬해야 할 때만 `item.iconPosition="end"`를 사용합니다.
- **중첩 서브메뉴** — item에 `items`(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다: 오른쪽 chevron과 `aria-haspopup="menu"`를 갖고 Arrow Right로 진입, Arrow Left로 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히고 최상위 trigger로 focus가 돌아옵니다.
- **submenuMode** — 서브메뉴 표현 방식(`flyout` 기본, `drill`).
  - `flyout` — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 1~2단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 `role="menu"`(부모 라벨로 `aria-label`)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 `<body>`로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다. 서브 트리거도 최상위 trigger와 같은 ARIA 3종(`aria-haspopup="menu"`·`aria-expanded`·열렸을 때 `aria-controls`)을 갖고, portal된 패널의 `role="menu"`가 그 id를 소유합니다.
  - `drill` — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(`aria-label="뒤로 …"`)이 붙습니다. 각 단계도 공통 176–320px 적응형 폭을 사용해 짧은 계층에 불필요한 빈 공간을 만들지 않습니다. 제품 레이아웃이 전환 중 같은 폭을 요구할 때만 `width`를 명시합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
    - 뒤로 행은 16px leading chevron, 14/20px semibold label, default 40px 높이를 사용합니다.
      하위 명령과는 1px low-contrast divider와 공통 4px item gap만으로 구분하며 별도 여백을
      중복하지 않습니다.
    - 뒤로 컨트롤은 `role="menu"`의 직계 자식이므로 **`role="menuitem"`을 갖고 roving 대상에 포함**됩니다
      (ARIA menu required-children 위반과 포인터 전용 컨트롤을 동시에 없앱니다). Arrow Up/Down으로 다른
      항목처럼 도달하고, `data-menu-back` 표시 덕분에 레벨 진입 focus만 첫 *명령*으로 건너뜁니다.
      Menubar의 `data-menubar-drill-back`과 같은 계약입니다.
- trigger는 `aria-haspopup`·`aria-expanded`·`aria-controls`를 받습니다. Enter/Space/Arrow Down은
  첫 항목, Arrow Up은 마지막 항목으로 열고, 열린 메뉴는 Up/Down·Home/End·문자 탐색과 Escape
  focus 복원을 지원합니다. menu는 trigger id를 `aria-labelledby`로 참조합니다. Tab은 메뉴를 닫고
  정상 문서 순서로 이동합니다.
- **문자 탐색(typeahead)** — 연속으로 입력한 문자는 하나의 검색어로 누적되고 500ms 동안 입력이 없으면
  버퍼가 비워집니다. 한 글자만 입력하면 현재 항목 *다음*부터 찾아 같은 초성 항목을 순환하고, 두 글자
  이상이면 현재 항목부터 다시 좁혀 찾습니다(APG typeahead). Space는 검색어가 진행 중일 때만 검색어에
  포함되고, 그렇지 않으면 focus된 항목을 활성화합니다. 이 엔진은 `SplitButton`·`Menubar`와 공유합니다.
- **기본 너비 규약** — `width`를 생략하면 normal·radio·checkbox·flyout·drill 모두 가장 긴
  item·shortcut·action 영역에 맞춰 `max-content`로 늘어나되 `--component-menu-min-width` 176px과
  `--component-menu-max-width` 320px 사이에서만 변합니다. viewport 양쪽 16px 여백보다 넓어지지
  않으며, 최대 폭에 도달한 긴 label·description은 줄바꿈합니다. `width`를 직접 주는 것은
  설명·검색·폼·제품 정렬 또는 drill 전환 중 같은 폭 유지가 기능적으로 필요한 예외입니다.
  `minWidth`는 이 명시적 예외에서 콘텐츠별 최소 폭을 바꿔야 할 때만 함께 사용합니다.
  flyout submenu와 TopBar·LanguageSwitcher도 같은 적응형 범위를 공유합니다. 선호 폭은 viewport
  안에서 clamp되고 아래 공간이 부족하면 위로 flip합니다.
  WDS의 r16·20px horizontal shell은 LDS에서 r12·8px shared utility shell로 재정의했으며
  shadow-md와 elevated surface는 유지합니다.
- 명령과 checkbox 선택은 기본적으로 누르는 즉시 반영하므로 action area를 붙이지 않습니다.
- `menuActionArea`는 서버 반영 비용이 크거나 여러 설정을 원자적으로 확정해야 하는 명시적인 staged workflow에서만
  `onCancel`·`onApply` 중 제공된 실제 동작을 Cancel/Apply 버튼으로 만듭니다. 단순한 다중 선택이나
  열기·복제·삭제처럼 선택 즉시 실행되는 메뉴에는 사용하지 않습니다.
  기본 문구는 `cancelLabel="취소"`, `applyLabel="적용"`이며 제품 문맥에 맞게 바꿀 수 있습니다.
  콜백이나 custom `action`이 없으면 무동작 버튼을 만들지 않습니다. 마지막 menu item에서 Tab하면
  menu role 밖의 action group으로 이동하고, Shift+Tab은 마지막 사용 가능 item으로 돌아가며,
  action group의 Escape·클릭 완료는 닫은 뒤 trigger focus를 복원합니다. 긴 목록만 scroll되고 action
  group은 panel 아래에 고정됩니다.

### 외부 기준과 적용 결론

- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — menu button의
  trigger 상태와 열림 시 첫/마지막 항목 focus 이동을 적용했습니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — 복합 menu의 방향키 이동, 명령/선택 item
  역할, disabled item 제외를 따릅니다. WDS의 normal/radio/checkbox 시각 축은 변경하지 않습니다.
- [Fluent 2 Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage) —
  normal·checkbox·radio를 같은 menu family로 다루고 300px 최대 폭에서 긴 label을 줄바꿈합니다.
  LDS도 variant마다 다른 기본 padding을 두지 않고 320px token 상한을 사용합니다.
- [Carbon Menu](https://carbondesignsystem.com/components/menu/style/)와
  [Menu Button](https://carbondesignsystem.com/components/menu-buttons/usage/) — menu item
  높이를 24/32/40/48px size 축으로 관리하고, 짧은 메뉴는 최소 160px에서 시작해 긴 label에 따라
  최대 288px까지 확장합니다. LDS는 14/20px·40px을 desktop default로 두고 32/48px을
  compact/comfortable density로 분리하며, 기존 LDS 리듬에 맞춰 적응형 폭을 176–320px로 조정합니다.
- [Floating UI `flip`](https://floating-ui.com/docs/flip),
  [`shift`](https://floating-ui.com/docs/shift), [`size`](https://floating-ui.com/docs/size) — preferred
  bottom을 우선하고 공간이 없으면 top으로 flip한 뒤 viewport 16px 안으로 shift하고, 남은 높이는
  scrollable menu region의 max-height로 사용합니다.
- [WDS component style parity](../../docs/references/wds/COMPONENT_STYLE_PARITY.md) — WDS Menu의
  r16 원본값과 LDS r12 shared-density override를 함께 기록합니다.

### LDS sibling delta inventory

- Menubar submenu와 check/radio glyph, elevated surface, keyboard engine, action button 순서를 공유합니다.
- Menubar의 persistent horizontal top-level chrome은 포함하지 않고 단일 trigger 관계만 유지합니다.
- TopBar와 LanguageSwitcher는 별도 padding·width 값을 복제하지 않고 공통
  `--component-menu-*` 토큰을 alias합니다. 제품별 메뉴 밀도나 고정 폭 차이는 더 이상
  기본값으로 만들지 않습니다.
- Popover는 임의의 interactive content surface이므로 16px content padding을 유지하고, 명령·선택
  row를 담는 DropdownMenu의 8px shell과 구분합니다.

### 제품 workflow coverage

- **LK Web Viz** — `a984def117c05acd213f494cbb8a42e990595505`,
  `frontend/src/screens/DashboardScreen.tsx`
  (`3c45fd6e109b169f5ea860a9e84180a7ebbe7a26`): 연결 로봇 전환과 navigation은 있지만
  trigger-bound command menu가 없어 현재 redesign에는 `not applicable`입니다.
- **LK Control Full Daedeok** — `93802fc2aa5d29f930380ae58d51dcb68322b5e7`,
  `frontend/src/views/user/index.jsx`
  (`8912b51c6eb612bd2beb2ed0206ee78ae6f03f2d`): 확인된 `MenuItem`은 form Select option이므로
  command DropdownMenu로 대체하지 않으며 `not applicable`입니다.
- **LK Context Hub** — `de124084b7e50049350a46f92c4ea4476269c58c`,
  `src/app/confluence/page.tsx`
  (`5d40f347f4b391510ac8ce4a60d65c18a27214cc`): 표 행의 이름 변경·동기화 제외·삭제 메뉴는
  `normal` DropdownMenu와 danger item 조합으로 `supported by composition`입니다. 실제 rename,
  exclude, delete 상태와 확인 절차는 제품이 소유합니다.

### Public surface and ref

- `ref`, `className`, and `style` target the anchor root. Stable parts are `root`, `trigger`, `panel`, `menu`, `item`, `divider`, and `actionArea`; per-item class/style composes after the shared `item` part.
- Geometry overrides are limited to `--lds-dropdown-menu-width`, `--lds-dropdown-menu-min-width`, and `--lds-dropdown-menu-max-height`. Menu roles, roving focus, nested stack, Escape, and focus restoration remain LDS-owned.

### Root portal and clipping contract (2026-08-02)

- Root panels use the same owner-document portal boundary as flyout submenus and
  use the shared floating-position engine's fixed strategy. This lets a command
  menu escape a `Table` or other ancestor scroll container without weakening the
  ancestor's horizontal-overflow contract.
- `collisionBoundary`는 element 또는 ref를 받아 root panel의 positioning 경계를 viewport와
  해당 요소의 보이는 교집합으로 좁힙니다. `collisionPadding` 기본 16px을 적용한 뒤 flip, shift,
  `maxWidth/maxHeight`를 계산하며, 명시적 `width`·`minWidth`·style도 그 가용 크기를 넘지 못합니다.
  생략하면 기존 viewport 경계가 byte/behavior-compatible하게 유지됩니다. 이 API는 Portal target을
  바꾸지 않으므로 body Portal로 clipping을 탈출하면서 chat panel 안에 menu geometry를 제한합니다.
- The trigger remains in the product DOM while `aria-controls` points to the
  portalled `role="menu"`. Opening still moves focus to the requested item;
  Escape closes the menu and restores trigger focus.
- Because the panel leaves its physical ancestor, the root portal copies the
  nearest explicit `data-theme` or `.theme-light|dark|auto` scope onto the
  portal wrapper. Semantic CSS variables therefore resolve against the same
  theme as the trigger even when `document.body` uses a different theme.
- [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/#overflow-properties)
  confirms that `visible` on one axis computes to `auto` when the other axis is
  scrollable, so an absolutely positioned descendant cannot reliably escape a
  horizontal scroll wrapper.
- [React `createPortal`](https://react.dev/reference/react-dom/createPortal)
  documents portals as the escape hatch for clipping ancestors while retaining
  React-tree context and event propagation.
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
  remains the accessibility contract: `aria-haspopup`, `aria-expanded`, optional
  `aria-controls`, menu roles, and first/last-item keyboard focus are unchanged.
- [React Aria Popover](https://react-spectrum.adobe.com/react-aria/Popover.html)의
  `boundaryElement`처럼 Portal mount target과 positioning boundary는 서로 다른 책임입니다.
