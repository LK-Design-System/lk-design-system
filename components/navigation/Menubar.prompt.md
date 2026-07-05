**Menubar** — 메뉴들의 가로 바(앱 상단 메뉴).

```jsx
<Menubar menus={[
  { label: '파일', items: [{ label: '새로 만들기', shortcut: '⌘N' }, { divider: true }, { label: '내보내기' }] },
  { label: '보기', items: [{ label: '지도' }, { label: '리스트' }] },
]} />
```

- **menus** — `{ label, items: [{ label, shortcut, onClick } | { divider }] }`. 한 번에 하나만 열리며, 열린 상태에서 호버로 전환됩니다.
