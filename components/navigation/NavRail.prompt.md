**NavRail** — 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비).

```jsx
<NavRail defaultValue="docs" onChange={setTab} items={[
  { value: 'docs', label: '문서', icon: <Icon name="document" size={22} /> },
  { value: 'components', label: '컴포넌트', icon: <Icon name="layers" size={22} /> },
  { value: 'alerts', label: '알림', icon: <Icon name="bell" size={22} /> },
]} />
```

- **items** — `{ value, label, icon }`. **value / defaultValue / onChange**. 활성은 시안 워시 + 시그널 잉크. 모바일에는 `BottomNav`를 쓰세요.
