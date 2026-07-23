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
- **접근성** — `level`은 시각 들여쓰기뿐 아니라 DOM 중첩 리스트(`ul > li > ul`)로도 표현되어 보조기술이 계층을 읽습니다. 활성 항목에는 `aria-current="location"`이 붙고, `nav`의 기본 `aria-label`은 `'목차'`입니다(전달한 `aria-label`이 우선).
- **의도적 한계 — 스크롤스파이 없음** — 비제어 모드는 클릭한 항목만 기억할 뿐 스크롤 위치를 감지하지 않습니다. 뷰포트와 활성 항목의 동기화(IntersectionObserver 등)는 소비자의 책임이며, 감지 결과를 제어 prop `active`로 내려주고 `onChange`로 클릭을 반영하세요.
