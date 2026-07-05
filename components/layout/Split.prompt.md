**Split** — 두 패널 스플릿 레이아웃(사이드바+본문, 미디어+카피). 모바일에서 쌓이고 `at` 브레이크포인트부터 나뉨.

```jsx
<Split template="280px 1fr" at="md">
  <nav>…</nav>
  <main>…</main>
</Split>
```

- **template**은 CSS `grid-template-columns` 값("280px 1fr" 고정 좌측 레일, "1fr 320px" 우측 레일, "2fr 1fr" 비율 분할 등). **at**: "md"(기본) 또는 "lg"에서 분할. **gap** 기본값은 `--gap-lg`(24).
