**Carousel** — 여러 미디어를 한 장씩 넘겨 보는 Product 확장. WAI-ARIA APG carousel 패턴을 따르며 위치 선택은 Core `PageIndicator`의 media presentation을 조합합니다.

```jsx
<Carousel
  label="설비 점검 사진"
  slideLabels={['입고 검사', '주행 시험', '출고 검사']}
  slides={[
    <img src="a.jpg" alt="입고 검사" style={{ width: '100%' }} />,
    <img src="b.jpg" alt="주행 시험" style={{ width: '100%' }} />,
    <img src="c.jpg" alt="출고 검사" style={{ width: '100%' }} />,
  ]}
/>
```

## 구조와 소유권

- Runtime owner와 provenance는 **Product Extension**입니다. Core `PageIndicator`가 dots의 지오메트리, 색, 선택 영역, item label과 현재 상태를 소유합니다.
- Carousel은 slide state, 이전/다음, 자동 회전, viewport, 하단 중앙 scrim rail과 안전 영역을 소유합니다. 자체 dot span/button 구현을 두지 않습니다.
- **slides**는 노드 배열이며 **showDots / showArrows**로 제어를 선택합니다. 양 끝에서 순환합니다.
- 루트는 `role="region"` + `aria-roledescription="carousel"`이고 **label**이 접근 이름입니다. 페이지 landmark가 불필요하면 소비자가 `role="group"`으로 덮어쓸 수 있습니다.
- 각 slide는 `role="group"` + `aria-roledescription="slide"`이며 이름은 `N / 전체`, **slideLabels**가 있으면 `이름, N / 전체`입니다.
- 현재 slide가 아닌 slide는 `inert`와 `aria-hidden`을 함께 받아 화면 밖 control이 Tab 순서와 접근성 트리에 남지 않습니다.

## 접근성 라벨 API

- **previousLabel / nextLabel**은 이전·다음 화살표 버튼의 접근 이름입니다. 기본값은 각각 `이전 슬라이드`, `다음 슬라이드`이며 제품 locale에 맞춰 함께 번역합니다.
- **playLabel / pauseLabel**은 자동 회전 컨트롤의 정지·재생 상태별 접근 이름입니다. 기본값은 각각 `자동 재생 시작`, `자동 재생 일시정지`이며 현재 동작이 아니라 버튼을 눌렀을 때 수행될 동작을 설명합니다.
- 네 라벨은 아이콘만 보이는 버튼의 필수 접근 이름이므로 빈 문자열로 제거하지 않습니다.

## PageIndicator media 계약

- picker는 `presentation="media"`를 사용합니다. 비활성 dot은 8px 원형, 활성 상태는 22×8px pill이며 각 native button은 32×44px입니다.
- picker group은 `"{label} 슬라이드 선택"`이라는 이름을 갖습니다. 각 button 이름은 slide label과 `N / 전체` 위치를 함께 사용합니다.
- 현재 picker는 `aria-current="true"`와 `aria-disabled="true"`를 함께 가지며 Tab 순서에는 남습니다. 활성 상태를 폭이나 색만으로 전달하지 않습니다.
- rail은 32px 높이의 `var(--scrim-dark)` pill입니다. picker button의 44px 높이는 rail 밖으로 투명하게 확장되어 target을 확보합니다. 개별 dot에 별도 ring을 더하지 않습니다.
- dots가 한 줄에 안정적으로 들어오지 않는 많은 slide에서는 이전/다음과 counter 또는 제품이 소유하는 축약 전략을 검토합니다. Carousel이 slide picker를 자동으로 counter로 바꾸지는 않습니다.

## 자동 회전과 겹침

- **autoPlay / interval**은 opt-in입니다. 켜면 rotation control이 Carousel 내부 첫 Tab 대상이며 hover 중에는 일시 정지하고, focus가 들어오거나 사용자가 이전·다음·picker를 누르면 명시적 재생 전까지 멈춥니다.
- 상시 마운트된 숨김 live region은 자체 회전 중 `aria-live="off"`, 사용자가 넘길 때 `polite`입니다.
- scrim rail이 viewport 위에 겹치므로 slide 하단 약 56px을 비웁니다. 좌우 화살표는 미디어용이며 텍스트·CTA slide에서는 `showArrows={false}`를 권장합니다.
- track과 활성 pill transition은 각각 소유 컴포넌트가 처리하며 `prefers-reduced-motion: reduce`에서 제거합니다.

## 외부 근거

- [WAI-ARIA APG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)의 named carousel, grouped slide picker, rotation control의 첫 Tab 순서, hover/focus 정지와 explicit restart 계약을 적용했습니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)의 24×24 CSS px 최소 기준을 넘기고 media overlay에서 더 안정적인 32×44px target을 사용합니다.
- [WCAG Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)에 따라 track/pill의 비필수 motion은 reduced-motion 환경에서 제거합니다.

제품 route, 미디어 fetch, analytics, slide 내용, 권한, CTA 결과와 자동 회전 정책 선택은 제품이 소유합니다.
