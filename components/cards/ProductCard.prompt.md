**ProductCard** — 시그니처 다크 제품 타일: 사진이 카드 상단 68%에서 네이비 무대로 페이드아웃(마스크 46→96%), 이브로우·제품 코드·설명은 항상 순수 네이비 위. 기본 CTA 없음(그리드에선 카드=링크 관례가 어포던스 — 행동 유도는 섹션 헤더의 TextButton으로 승격). 호버는 이미지 줌 + 섀도 심화만, 카드는 제자리. 사진마다 `imagePosition`으로 초점 튜닝.

```jsx
<ProductCard id="Core Kit" category="Component Bundle"
  description="토큰, 컴포넌트, 문서 예제를 하나의 패키지로 제공합니다."
  href="#" />

<ProductCard id="Docs Kit" category="Documentation"
  description="가이드와 예제를 함께 제공하는 문서 카드입니다."
  cta="자세히 보기" href="#" />
```

`cta`는 개별 유도가 꼭 필요한 맥락에서만 — 우하단 13px(label2) 소형 라벨로 붙고, 호버 시 화이트 100% + 밑줄.
- 타입 스케일 정합: CTA 라벨 12.5px → `--label2-size`(13px)로 스냅했습니다(+0.5px, 인터랙티브 CTA라 위로 스냅). 설명(label1)과 함께 토큰 스케일 위에 있습니다.
