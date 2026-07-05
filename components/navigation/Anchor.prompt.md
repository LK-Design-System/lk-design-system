**Anchor** — 페이지 내 목차 내비게이션.

```jsx
<Anchor items={[
  { href: '#overview', label: '개요' },
  { href: '#spec', label: '사양', level: 1 },
  { href: '#contact', label: '문의' },
]} onChange={scrollTo} />
```

- **items** — `{ href, label, level }`. **active / onChange** — 제어/비제어. 활성 항목은 시그널 잉크 + 좌측 룰을 띱니다.
