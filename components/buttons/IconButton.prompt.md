**IconButton** — 아이콘 글리프 하나를 감싸는 정사각/원형 컨트롤(내비 화살표, 맨 위로, 닫기). 항상 접근성 `label`을 전달하세요.

```jsx
<IconButton variant="soft" label="prev">{chevronLeft}</IconButton>
<IconButton variant="signal" round label="top">{arrowUp}</IconButton>
<IconButton variant="on-dark" label="next">{chevronRight}</IconButton>
```

- **variant** — `soft`(쿨 그레이) · `solid`(그래파이트) · `signal`(시안) · `ghost`(헤어라인) · `on-dark`(반투명 화이트). **size** px(기본 44). **round**는 원형.
