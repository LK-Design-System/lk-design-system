**HoverCard** — 호버 시(약간의 지연) 열리고 벗어나면 닫히는 팝오버.

```jsx
<HoverCard trigger={<Link>문서 A</Link>}>
  <b>문서 A</b> · 검토 중 · 오늘 업데이트됨.
</HoverCard>
```

- **trigger** — 호버 대상. **children** — 본문. **align / width**. 클릭으로 열려면 `Popover`, 한 줄 힌트에는 `Tooltip`을 쓰세요.
