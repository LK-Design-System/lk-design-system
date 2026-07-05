**CommandPalette** — 검색 필드와 필터링된 명령 목록이 있는 ⌘K 스타일 모달.

```jsx
<CommandPalette open={open} onClose={close} commands={[
  { label: '제품 보기', shortcut: 'P', onSelect: goProducts },
  { label: '도입 문의', shortcut: 'C', onSelect: goContact },
]} />
```

- **open / onClose** — 제어형(Esc·스크림으로 닫힘). **commands** — `{ label, icon, shortcut, onSelect }`. 입력하면 라벨로 필터링됩니다.
