**Anchor** — 페이지 내 목차 내비게이션.

Classification: **LK Product Extension**. 한 페이지 안의 섹션 이동에만 사용하며, 라우트 경로를 나타내는 `Breadcrumb`나 사이트·제품 주 탐색을 대신하지 않습니다.

```jsx
<Anchor items={[
  { href: '#overview', label: '개요' },
  { href: '#spec', label: '사양', level: 1 },
  { href: '#contact', label: '문의' },
]} onChange={scrollTo} />
```

- **items** — `{ href, label, level }`. **active / onChange** — 제어/비제어. 활성 항목은 시그널 잉크 + 좌측 룰을 띱니다.
