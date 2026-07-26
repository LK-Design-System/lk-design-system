# Carousel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Display |
| Owner | `Carousel` |
| Storybook | `LDS Product/Data/Display/Carousel` |
| Source | `../component-content.json#product-data-display-carousel` |

제품 이미지나 작업 장면처럼 같은 맥락의 미디어를 차례로 살펴볼 때 적합합니다. 모든 항목을 동시에 비교해야 하거나 각 항목에 복잡한 조작이 필요하면 Carousel 대신 Grid 또는 List를 사용하세요.

## 사용 판단

### 사용

- dots가 한 줄에 안정적으로 들어오지 않는 많은 slide에서는 이전/다음과 counter 또는 제품이 소유하는 축약 전략을 검토합니다. Carousel이 slide picker를 자동으로 counter로 바꾸지는 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 캐러셀 영역의 접근 이름. @default "캐러셀" |
| slideLabels | 슬라이드별 이름. 위치 표기 N / 전체 앞에 붙습니다. |
| previousLabel | 이전 버튼의 접근 이름. @default "이전 슬라이드" |
| nextLabel | 다음 버튼의 접근 이름. @default "다음 슬라이드" |
| playLabel | 정지 상태 회전 컨트롤의 접근 이름. @default "자동 재생 시작" |
| pauseLabel | 재생 상태 회전 컨트롤의 접근 이름. @default "자동 재생 일시정지" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `slides` | `React.ReactNode[]` | Yes | 슬라이드 — 임의의 노드(이미지, 카드). |
| `label` | `string` | No | 캐러셀 영역의 접근 이름. @default "캐러셀" |
| `slideLabels` | `string[]` | No | 슬라이드별 이름. 위치 표기 N / 전체 앞에 붙습니다. |
| `showDots` | `boolean` | No | 점 인디케이터. @default true |
| `showArrows` | `boolean` | No | 이전/다음 화살표. @default true |
| `autoPlay` | `boolean` | No | 자동 회전. 일시정지 컨트롤이 함께 렌더됩니다. @default false |
| `interval` | `number` | No | 자동 회전 간격(ms). @default 5000 |
| `previousLabel` | `string` | No | 이전 버튼의 접근 이름. @default "이전 슬라이드" |
| `nextLabel` | `string` | No | 다음 버튼의 접근 이름. @default "다음 슬라이드" |
| `playLabel` | `string` | No | 정지 상태 회전 컨트롤의 접근 이름. @default "자동 재생 시작" |
| `pauseLabel` | `string` | No | 재생 상태 회전 컨트롤의 접근 이름. @default "자동 재생 일시정지" |

## Behavior and interaction

- slides는 노드 배열이며 showDots / showArrows로 제어를 선택합니다. 양 끝에서 순환합니다.
- WAI-ARIA APG Carousel Pattern의 named carousel, grouped slide picker, rotation control의 첫 Tab 순서, hover/focus 정지와 explicit restart 계약을 적용했습니다.
- Carousel — 여러 미디어를 한 장씩 넘겨 보는 Product 확장. WAI-ARIA APG carousel 패턴을 따르며 위치 선택은 Core PageIndicator의 media presentation을 조합합니다.
- 제품 route, 미디어 fetch, analytics, slide 내용, 권한, CTA 결과와 자동 회전 정책 선택은 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | picker는 presentation="media"를 사용합니다. 비활성 dot은 8px 원형, 활성 상태는 22×8px pill이며 각 native button은 32×44px입니다. |
| 명시 규칙 2 | rail은 32px 높이의 var(--scrim-dark) pill입니다. picker button의 44px 높이는 rail 밖으로 투명하게 확장되어 target을 확보합니다. 개별 dot에 별도 ring을 더하지 않습니다. |
| 명시 규칙 3 | scrim rail이 viewport 위에 겹치므로 slide 하단 약 56px을 비웁니다. 좌우 화살표는 미디어용이며 텍스트·CTA slide에서는 showArrows={false}를 권장합니다. |
| 명시 규칙 4 | WCAG 2.2 Target Size (Minimum)의 24×24 CSS px 최소 기준을 넘기고 media overlay에서 더 안정적인 32×44px target을 사용합니다. |
| --dur-slow | 320ms |

## Responsive

- Carousel은 slide state, 이전/다음, 자동 회전, viewport, 하단 중앙 scrim rail과 안전 영역을 소유합니다. 자체 dot span/button 구현을 두지 않습니다.

## Content and writing

- Runtime owner와 provenance는 Product Extension입니다. Core PageIndicator가 dots의 지오메트리, 색, 선택 영역, item label과 현재 상태를 소유합니다.
- previousLabel / nextLabel은 이전·다음 화살표 버튼의 접근 이름입니다. 기본값은 각각 이전 슬라이드, 다음 슬라이드이며 제품 locale에 맞춰 함께 번역합니다.
- playLabel / pauseLabel은 자동 회전 컨트롤의 정지·재생 상태별 접근 이름입니다. 기본값은 각각 자동 재생 시작, 자동 재생 일시정지이며 현재 동작이 아니라 버튼을 눌렀을 때 수행될 동작을 설명합니다.
- 네 라벨은 아이콘만 보이는 버튼의 필수 접근 이름이므로 빈 문자열로 제거하지 않습니다.

## Accessibility

- 루트는 role="region" + aria-roledescription="carousel"이고 label이 접근 이름입니다. 페이지 landmark가 불필요하면 소비자가 role="group"으로 덮어쓸 수 있습니다.
- 각 slide는 role="group" + aria-roledescription="slide"이며 이름은 N / 전체, slideLabels가 있으면 이름, N / 전체입니다.
- 현재 slide가 아닌 slide는 inert와 aria-hidden을 함께 받아 화면 밖 control이 Tab 순서와 접근성 트리에 남지 않습니다.
- 현재 picker는 aria-current="true"와 aria-disabled="true"를 함께 가지며 Tab 순서에는 남습니다. 활성 상태를 폭이나 색만으로 전달하지 않습니다.
- autoPlay / interval은 opt-in입니다. 켜면 rotation control이 Carousel 내부 첫 Tab 대상이며 hover 중에는 일시 정지하고, focus가 들어오거나 사용자가 이전·다음·picker를 누르면 명시적 재생 전까지 멈춥니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Thumbnail` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--color-semantic-static-white`
- `--dur-slow`
- `--ease-out`
- `--radius-2xl`
- `--radius-pill`
- `--scrim-dark`
- `--space-2`
- `--space-4`

### Source contracts

- `components/data/Carousel.jsx`
- `components/data/Carousel.d.ts`
- `components/data/Carousel.prompt.md`
- `stories/ContentCarousel.stories.jsx`

## Sources

- Carousel prompt contract: `components/data/Carousel.prompt.md`
- Storybook implementation evidence: `stories/ContentCarousel.stories.jsx`
- [WAI-ARIA APG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
