**PageIndicator** — ordered content의 현재 위치를 counter 또는 dots로 표시하는 WDS Core 컴포넌트.

```jsx
<PageIndicator page={1} count={10} />
<PageIndicator variant="dot" page={2} count={5} />
<PageIndicator
  variant="dot"
  presentation="media"
  page={2}
  count={5}
  onChange={setPage}
  getItemLabel={(page, count) => `${page}번째 미디어, ${page} / ${count}`}
/>
```

## 분류와 표현 축

- Runtime owner는 **Core**, provenance는 WDS `Page Indicator` 직접 대응입니다. WDS 원본 축은 counter, small/medium size, alternative와 dot treatment입니다.
- `presentation="media"`는 WDS 원본 축으로 주장하지 않는 **LDS composition extension**입니다. Product Carousel이 별도 도트를 다시 그리지 않고 이 컴포넌트를 조합하기 위한 명시적 표현입니다.
- `presentation="standalone"`이 기본값입니다. `normal`과 `alternative`는 같은 `size`에서 크기와 간격을 공유하고 배경에 맞는 색만 바꿉니다.
- `presentation="media"`는 dot variant에만 의미가 있습니다. Carousel의 scrim 위에서 비활성 8px 원형, 활성 22×8px pill, 32×44px 투명 선택 영역을 사용합니다. scrim과 배치는 부모가 소유합니다.

## 선택 기준

- counter는 숫자 위치가 중요한 onboarding이나 순차 콘텐츠에 사용합니다.
- dots는 가벼운 page/slide 위치와 직접 선택에 사용합니다. 표의 페이지 이동에는 `Pagination`을 사용합니다.
- 항목이 많아 한 줄에 안정적으로 들어오지 않으면 dots를 무조건 늘리지 않습니다. counter, 이전/다음 제어 또는 제품이 소유하는 windowed indicator를 선택하세요. 컴포넌트가 `count`만 보고 자동으로 counter로 바꾸지는 않습니다. 자동 전환은 직접 선택 기능을 예고 없이 제거할 수 있기 때문입니다.

## 접근성과 모션

- 비상호작용 dots는 장식(`aria-hidden`)으로 처리하고, 시각적으로 숨긴 `"{page}번째 / 전체 {count}"` 텍스트가 현재 위치를 알립니다.
- `onChange`가 있으면 각 항목은 native button입니다. standalone은 `aria-current="page"`와 최소 24×24px 선택 영역을 사용합니다.
- media는 `aria-current="true"`를 사용하고 현재 picker에 `aria-disabled="true"`를 함께 제공하되 Tab 순서에는 남깁니다. 이는 현재 slide picker도 위치 파악에 도움이 된다는 APG 권고를 따릅니다.
- `getItemLabel(page, count)`로 slide 이름과 위치를 제공합니다. 생략하면 `"{page}페이지로 이동"`입니다. picker 묶음의 이름은 `groupLabel`로 지역화합니다.
- media 활성 pill의 width transition은 `var(--dur-base)`를 사용하고 `prefers-reduced-motion: reduce`에서 제거합니다.

## 외부 근거

- [WAI-ARIA APG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)은 grouped carousel의 slide picker를 이름 있는 group의 native button으로 구성하고 현재 picker를 focus 순서에 남긴 `aria-disabled` 상태로 표시합니다. media 접근성 계약과 Carousel composition에 반영했습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 최소 24×24 CSS px 또는 충분한 간격을 요구합니다. standalone의 24×24px 투명 선택 영역 근거입니다.
- [Apple HIG Page Controls](https://developer.apple.com/design/human-interface-guidelines/page-controls)는 ordered flat list, 균등한 기본 dots, 과도하게 다양한 indicator 사용을 피하라고 권고합니다. standalone에서 active/inactive와 normal/alternative의 지오메트리를 동일하게 유지하는 근거입니다.
- [WCAG Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)은 비필수 interaction motion을 줄일 수 있어야 한다고 설명합니다. media pill 전환의 reduced-motion 처리를 유지합니다.
