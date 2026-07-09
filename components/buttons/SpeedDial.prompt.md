**SpeedDial** — 열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼. Fab 확장.

```jsx
<SpeedDial actions={[
  { icon: <Icon name="plus" />, label: '웨이포인트', onClick: addWp },
  { icon: <Icon name="trash" />, label: '삭제', danger: true, onClick: del },
]} />
```

- **icon** · **actions** `{icon,label,onClick,danger}[]` · **open / defaultOpen** · **onOpenChange** · **label**.
