**EditorToolbar** — 캔버스 에디터용 단일 선택 툴 그룹(선택 · 그리기 · 지우기 · 폴리곤 · 팬). 활성 툴은 시그널 잉크로 채워집니다.

```jsx
<EditorToolbar value={tool} onChange={setTool} items={[
  { value: 'select', icon: <Icon name="search" size={18} />, label: '선택' },
  { value: 'draw', icon: <Icon name="plus" size={18} />, label: '그리기' },
  { value: 'zone', icon: <Icon name="square" size={18} />, label: '존' },
  { value: 'erase', icon: <Icon name="trash" size={18} />, label: '지우기', disabled: locked },
]} />
```

- **items** `{ value, icon, label, disabled }` · 제어(`value`)/비제어(`defaultValue`) · **orientation** `vertical · horizontal` · **label** · **disabled**.
- `role="toolbar"`와 방향키/Home/End 포커스 이동을 제공하므로 에디터 단축키 scope와 충돌하지 않게 상위 캔버스에서 처리한다.
