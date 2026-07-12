**DropdownMenu** - WDS anchored menu popover.

```jsx
<DropdownMenu trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, { divider: true }, { label: 'Delete', danger: true }]} />
<DropdownMenu variant="checkbox" menuActionArea items={[{ label: 'Option', checked: true }]} />
```

- Use for trigger-bound command menus. Use `Menubar` for a horizontal application menu.
- WDS axes: `variant` (`normal`, `radio`, `checkbox`), `menuActionArea`, and scroll via `maxHeight`.
- trigger는 `aria-haspopup`·`aria-expanded`·`aria-controls`를 받습니다. Enter/Space/Arrow Down은
  첫 항목, Arrow Up은 마지막 항목으로 열고, 열린 메뉴는 Up/Down·Home/End·문자 탐색과 Escape
  focus 복원을 지원합니다. menu는 trigger id를 `aria-labelledby`로 참조합니다. Tab은 메뉴를 닫고
  정상 문서 순서로 이동합니다.
- 선호 `width`는 viewport 안에서 clamp되고 아래 공간이 부족하면 위로 flip합니다. WDS Menu의
  r16·8px/20px shell과 shadow-md는 유지하며, r12·16px padding인 Popover와 시각 역할을 합치지 않습니다.

### 외부 기준과 적용 결론

- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — menu button의
  trigger 상태와 열림 시 첫/마지막 항목 focus 이동을 적용했습니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — 복합 menu의 방향키 이동, 명령/선택 item
  역할, disabled item 제외를 따릅니다. WDS의 normal/radio/checkbox 시각 축은 변경하지 않습니다.
- [WDS component style parity](../../docs/references/wds/COMPONENT_STYLE_PARITY.md) — Menu r16과
  Popover r12가 각각 원본 component-set 값임을 확인하므로 이 shape 차이를 유지합니다.
