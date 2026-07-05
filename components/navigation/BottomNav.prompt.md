**BottomNav** — 모바일 하단 탭 바(아이콘 + 라벨). 활성 탭은 시그널 잉크를 띱니다.

```jsx
<BottomNav defaultValue="home" onChange={setTab} items={[
  { value: 'home', label: '홈', icon: <Icon name="home" size={22} /> },
  { value: 'fleet', label: '로봇', icon: <Icon name="setting" size={22} /> },
  { value: 'alerts', label: '알림', icon: <Icon name="bell" size={22} /> },
  { value: 'me', label: '내정보', icon: <Icon name="person" size={22} /> },
]} />
```

- **items** — `{ value, label, icon }`. **value / defaultValue / onChange** — 제어/비제어. 표준 바에는 `nav-*` 아이콘을 쓰세요.
