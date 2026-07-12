**Menubar** - WDS horizontal menu bar for grouped commands.

```jsx
<Menubar menus={[{ label: 'File', items: [{ label: 'New' }, { label: 'Open', shortcut: '⌘O' }] }]} />
```

- Use for command groups. Menu items support normal, radio, checkbox, disabled, danger, divider, description, and shortcut states.
- WDS axes: `variant`, `menuActionArea`, and scroll via `maxHeight`.
- 키보드 계약: top-level은 Left/Right와 Home/End로 이동하고 Enter/Space/Arrow Down은 첫 submenu
  항목, Arrow Up은 마지막 항목으로 엽니다. submenu는 Up/Down·Home/End·문자 탐색을 지원하며
  Left/Right는 이웃 메뉴로 전환합니다. Escape는 닫고 원래 top-level item으로 돌아갑니다.
- pointer hover는 키보드 focus를 빼앗지 않습니다. submenu의 `aria-labelledby`는 top-level item을
  참조하고, 선택 항목 아래의 `menuActionArea`는 menu role 밖의 별도 action region으로 렌더됩니다.
  action region은 마지막 menu item에서 Tab으로 접근하고 Escape로 원래 top-level item에 복원합니다.
- Menubar는 항상 보이는 수평 command surface이고 Dropdown Menu는 단일 trigger의 임시 메뉴입니다.
  이 역할 차이 때문에 top-level chrome과 compact submenu spacing은 유지하되, elevated surface·line·
  shadow와 menu keyboard engine은 공유합니다.

### 외부 기준과 적용 결론

- [WAI-ARIA Menu and Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) — 수평
  menubar의 roving focus, Left/Right top-level 이동, submenu Up/Down, Escape 복원을 적용했습니다.
- [Fluent 2 Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage) — 명령 그룹은
  예측 가능한 방향키 이동과 명확한 trigger/menu 관계를 유지합니다. LDS의 normal/radio/checkbox
  시각 축은 유지하고 키보드 계약만 공용화했습니다.
