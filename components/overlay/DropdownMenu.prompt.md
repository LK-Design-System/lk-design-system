**DropdownMenu** — 메뉴 팝오버를 여는 트리거.

```jsx
<DropdownMenu align="right" trigger={<IconButton variant="ghost" label="more"><Icon name="more-vertical" /></IconButton>}
  items={[
    { label: '내보내기', icon: <Icon name="download" size={18} />, onClick: exp },
    { divider: true },
    { label: '삭제', danger: true, onClick: del },
  ]} />
```

- **trigger** — 토글 요소. **items** — `{ label, icon, onClick, danger, disabled }` 또는 `{ divider: true }`. **align** `left · right`.
