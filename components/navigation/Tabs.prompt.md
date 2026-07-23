**Tabs** - WDS underline tab navigation for switching page sections.

```jsx
<Tabs items={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} defaultValue="all" />
<Tabs resize="fill" size="large" padding trailingIconButton items={items} />
```

- Use for section or route switching. Use `Category` for chip-like topic navigation.
- WDS axes: `resize` (`hug`/`fill`), `size`, `padding`, `trailingIconButton`, and horizontal `scroll`.
- The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). 선택 탭이 비활성화되면 첫 번째 활성 탭이 Tab 스톱이 됩니다.
- 탭↔패널 연결: 각 탭은 `useId()` 기반 id를 자동으로 가지며, `item.tabId`로 재정의할 수 있습니다. `item.panelId`를 넘기면 탭에 `aria-controls`로 연결됩니다. 소비 측은 패널을 `role="tabpanel"`, `id={panelId}`, `aria-labelledby={탭 id}`, `tabIndex={0}`으로 표시하세요.
- `item.active`는 비제어 모드에서 초기 선택을 시드할 때만 사용됩니다(`defaultValue`가 없을 때). 렌더 시점에 선택 상태를 강제하지 않으므로 두 탭이 동시에 선택되는 일이 없습니다.
- When used as `CanvasEditorShell.responsiveNavigation`, tabs switch only the narrow-screen region (`canvas`, `layers`, `panel`). Workspace modes that change tools and document behavior remain in `subheader`.
