**HoverCard** — 호버 시(약간의 지연) 열리고 벗어나면 닫히는 팝오버.

```jsx
<HoverCard trigger={<Link>LKR-T1</Link>}>
  <b>LKR-T1</b> · 안전 순찰 로봇 — 최대 8시간 연속 운영.
</HoverCard>
```

- **trigger** — 호버 대상. **children** — 본문. **align / width**. 클릭으로 열려면 `Popover`, 한 줄 힌트에는 `Tooltip`을 쓰세요.
