**DropdownMenu** - WDS anchored menu popover.

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

- Use for trigger-bound command menus. Use `Menubar` for a horizontal application menu.
- WDS axes: `variant` (`normal`, `radio`, `checkbox`), `menuActionArea`, and scroll via `maxHeight`.
- **중첩 서브메뉴** — item에 `items`(재귀)를 주면 그 항목은 서브메뉴 트리거가 됩니다: 오른쪽 chevron과 `aria-haspopup="menu"`를 갖고 Arrow Right로 진입, Arrow Left로 복귀합니다. 하위 명령을 고르면 전체 메뉴가 닫히고 최상위 trigger로 focus가 돌아옵니다.
- **submenuMode** — 서브메뉴 표현 방식(`flyout` 기본, `drill`).
  - `flyout` — 서브 패널이 부모 옆으로 겹겹이 뜹니다(데스크톱 표준, 얕은 1~2단계에 적합). hover(120ms)·클릭·Arrow Right로 열리고 `role="menu"`(부모 라벨로 `aria-label`)이며, 부모 메뉴의 scroll/overflow에 잘리지 않도록 `<body>`로 portal되어 부모 패널 옆에 겹치지 않게 뜨고 오른쪽 공간이 부족하면 왼쪽으로 flip합니다. Escape는 최상단 서브메뉴부터 한 단계씩 닫습니다.
  - `drill` — 같은 패널이 하위 목록으로 전환되고 상단에 뒤로 컨트롤(`aria-label="뒤로 …"`)이 붙습니다. 폭이 고정되어 깊은 계층에서도 가로로 늘어나지 않아(꼬리물기 없음) 좁은 패널·터치·깊은 중첩에 적합합니다. Arrow Left/뒤로 버튼으로 상위에 복귀하며, 전환마다 하위 첫 항목에 focus가 이동합니다.
- trigger는 `aria-haspopup`·`aria-expanded`·`aria-controls`를 받습니다. Enter/Space/Arrow Down은
  첫 항목, Arrow Up은 마지막 항목으로 열고, 열린 메뉴는 Up/Down·Home/End·문자 탐색과 Escape
  focus 복원을 지원합니다. menu는 trigger id를 `aria-labelledby`로 참조합니다. Tab은 메뉴를 닫고
  정상 문서 순서로 이동합니다.
- 선호 `width`는 viewport 안에서 clamp되고 아래 공간이 부족하면 위로 flip합니다. WDS Menu의
  r16·8px/20px shell과 shadow-md는 유지하며, r12·16px padding인 Popover와 시각 역할을 합치지 않습니다.
- `menuActionArea`는 `onCancel`·`onApply` 중 제공된 실제 동작만 Cancel/Apply 버튼으로 만듭니다.
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
- [Floating UI `flip`](https://floating-ui.com/docs/flip),
  [`shift`](https://floating-ui.com/docs/shift), [`size`](https://floating-ui.com/docs/size) — preferred
  bottom을 우선하고 공간이 없으면 top으로 flip한 뒤 viewport 16px 안으로 shift하고, 남은 높이는
  scrollable menu region의 max-height로 사용합니다.
- [WDS component style parity](../../docs/references/wds/COMPONENT_STYLE_PARITY.md) — Menu r16과
  Popover r12가 각각 원본 component-set 값임을 확인하므로 이 shape 차이를 유지합니다.

### LDS sibling delta inventory

- Menubar submenu와 check/radio glyph, elevated surface, keyboard engine, action button 순서를 공유합니다.
- Menubar의 persistent horizontal top-level chrome은 포함하지 않고 단일 trigger 관계만 유지합니다.
- Popover보다 작은 menu padding/radius는 WDS Menu component-set의 역할 차이이므로 유지합니다.
