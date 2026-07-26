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

## Sticky 조합 정책

`Anchor`의 기본 배치는 문서 흐름을 따릅니다. 긴 문서의 데스크톱 사이드 목차처럼 계속 보여야 할 때만 소비 페이지의 레이아웃 wrapper가 sticky를 적용합니다. `Anchor` 자체에는 `sticky`나 고정된 `top` 값을 추가하지 않습니다. 실제 스크롤 컨테이너와 Top Bar 높이는 제품 shell만 알 수 있기 때문입니다.

```css
.page-toc {
  position: sticky;
  inset-block-start: var(--anchor-sticky-top);
  max-height: calc(100vh - var(--anchor-sticky-top) - var(--space-5));
  overflow: auto;
}

.page-content :is(h2, h3)[id] {
  scroll-margin-block-start:
    calc(var(--anchor-sticky-top) + var(--space-5));
}

@media (max-width: 720px), (max-height: 560px) {
  .page-toc {
    position: static;
    max-height: none;
    overflow: visible;
  }
}
```

- **Offset 소유권** — `--anchor-sticky-top`은 제품 shell이 `고정 헤더 높이 + 여백`으로 제공합니다. 임의의 전역 숫자나 높은 `z-index`를 Anchor에 넣지 않습니다.
- **고정 범위** — `fixed`가 아니라 `sticky`를 사용해 목차가 페이지·섹션 wrapper의 끝에서 멈추게 합니다. 예상치 못한 `overflow` 조상은 sticky 기준 스크롤 컨테이너를 바꾸므로 조합 단계에서 확인합니다.
- **이동 대상** — 링크 문구와 대상 제목을 일치시키고 제목에 `id`와 동일 offset의 `scroll-margin-block-start`를 둬 고정 헤더 아래에 가려지지 않게 합니다.
- **반응형** — 너비나 높이가 부족하면 sticky를 해제하고 목차를 본문 앞의 일반 흐름으로 되돌립니다. 축소·확대 환경에서 목차가 읽기 영역이나 키보드 포커스를 덮지 않아야 합니다.
- **활성 상태** — sticky 여부와 scrollspy는 별개입니다. 스크롤 동기화가 필요하면 제품이 `IntersectionObserver` 결과를 제어 prop `active`로 전달합니다.

근거: [USWDS In-page navigation](https://designsystem.digital.gov/components/in-page-navigation/)은 긴 페이지의 사이드 sticky 목차와 별도 top/scroll offset을 정의하고, [W3C Technique C34](https://www.w3.org/WAI/WCAG21/Techniques/css/C34)는 좁거나 낮은 뷰포트에서 sticky 영역을 해제해 콘텐츠와 포커스를 가리지 않도록 권고합니다. [MDN `position`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position)은 sticky가 가장 가까운 스크롤 조상과 containing block을 기준으로 동작하며 해당 블록의 반대쪽 경계에서 멈춘다는 CSS 동작을 설명합니다.
