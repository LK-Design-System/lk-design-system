# Product Card

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ProductCard` |
| Storybook | `LDS Product/Content/Product Card` |
| Source | `../component-content.json#product-content-product-card` |

제품 ID·카테고리·설명을 한 단위로 묶어 카탈로그형 선택을 지원할 때 적합합니다. 상세 제원 비교나 상태 모니터링에는 ProductCard 대신 Spec Row가 있는 상세 패널이나 상태 전용 패턴을 사용하세요.

## 사용 판단

### 사용

- 제품 ID·카테고리·설명을 한 단위로 묶어 카탈로그형 선택을 지원할 때 적합합니다. 상세 제원 비교나 상태 모니터링에는 ProductCard 대신 Spec Row가 있는 상세 패널이나 상태 전용 패턴을 사용하세요.
- Product Card가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 ProductCard API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-label로 덮어쓰세요.
- 포커스 어포던스 — 키보드 포커스에서도 호버와 같은 이미지 줌 + 섀도 심화를 재현합니다(포인터 전용 어포던스 금지). 포커스 링 자체는 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 그립니다.
- 설명은 2줄 clamp — 긴 설명이 위로 자라 사진 페이드 존을 침범하지 않도록 콘텐츠 블록을 하단 무대 영역 안에 고정합니다. 줄 높이는 label1-reading-line(22px) 토큰을 씁니다.
- - 제품 코드는 실제 heading — id는 headingLevel(기본 3)로 렌더됩니다. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-labe….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ProductCard의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Description | 짧은 설명 줄. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `id` | `string` | No | 제목(heading)으로 표시되는 제품 코드(예: "LKR-CP"). 링크의 접근 가능한 이름도 이 값입니다. 주의 — 이 prop은 DOM id 속성으로 전달되지 않습니다. 카드를 DOM에서 지목해야 하면 data- 속성을 쓰거나 카드를 감싸는 래퍼에 id를 주세요. |
| `category` | `string` | No | 카테고리 이브로우(예: "Patrol & Cleaning Robot"). |
| `description` | `string` | No | 짧은 설명 줄. |
| `image` | `string` | No | 제품 사진 URL — 카드 상단 68%를 차지하고 네이비로 페이드아웃. |
| `imagePosition` | `string` | No | 사진 초점(object-position). 사진마다 피사체 위치가 다를 때 튜닝. @default "50% 30%" |
| `href` | `string` | No | 링크 대상. @default "" |
| `cta` | `string` | No | 우하단 소형 라벨(12.5px). 기본은 없음 — 균질한 제품 그리드에선 카드=링크 관례가 어포던스이고, 행동 유도는 섹션 헤더로 승격. 개별 유도가 필요한 맥락에서만 지정. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| false` | No | 제품 코드(id)의 heading 레벨. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 false로 끕니다. @default 3 |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- 포커스 어포던스 — 키보드 포커스에서도 호버와 같은 이미지 줌 + 섀도 심화를 재현합니다(포인터 전용 어포던스 금지). 포커스 링 자체는 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 그립니다.
- ProductCard — 시그니처 다크 제품 타일: 사진이 카드 상단 68%에서 네이비 무대로 페이드아웃(마스크 58→97% — 제품이 카드 깊숙이까지 보이고, 페이드는 콘텐츠 시작선 직전에 완료), 이브로우·제품 코드·설명은 항상 순수 네이비 위. 무대 그레이드: 사진 하부에만 네이비 그라디언트 틴트(stage-to 0→28%)를 깔아 웜톤 사진도 무대 색조로 수렴시키고(상단은 원본 그대로), 약화된 스크림(55%)과 밝기 1.06으로 사진 가시성을 우선합니다. 기본 CTA 없음(그리드에선 카드=링크 관례가 어포던스 — 행동 유도는 섹션 헤더의 TextButton….
- - 제품 코드는 실제 heading — id는 headingLevel(기본 3)로 렌더됩니다. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). - 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-labe….
- ProductCard의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 제품 코드는 실제 heading — id는 headingLevel(기본 3)로 렌더됩니다. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1). |
| 명시 규칙 2 | 사진은 장식 — 제품 사진은 네이비 무대로 페이드되는 배경 요소라 항상 alt=""이고 aria-hidden 영역 안에 있습니다(제품 코드가 카드의 접근 이름). NewsCard와 달리 정보성 imageAlt를 두지 않습니다. 사진은 loading="lazy"·decoding="async"로 지연 로드되며, 카드의 4/5 aspect-ratio가 로드 전 레이아웃을 예약(CLS 방지)하고 로드 실패 시 네이비 무대가 비쳐 degrade됩니다. |
| 명시 규칙 3 | 카테고리 이브로우는 inverse-primary를 씁니다 — 무대(navy)는 테마 불변이라 라이트용 primary-normal은 3.9:1로 AA 미달이고, inverse-primary는 무대 양 끝점에서 4.7:1·5.2:1로 통과합니다. |
| 명시 규칙 4 | 설명은 2줄 clamp — 긴 설명이 위로 자라 사진 페이드 존을 침범하지 않도록 콘텐츠 블록을 하단 무대 영역 안에 고정합니다. 줄 높이는 label1-reading-line(22px) 토큰을 씁니다. |
| --border-hairline-dark | 1px solid rgba(255, 255, 255, 0.08) · 1px solid rgba(255, 255, 255, 0.12) |

## Responsive

- 제품 코드는 한 줄 유지(nowrap) + ellipsis — 긴 ID도 카드 모서리에서 잘리지 않고 말줄임됩니다.
- 설명은 2줄 clamp — 긴 설명이 위로 자라 사진 페이드 존을 침범하지 않도록 콘텐츠 블록을 하단 무대 영역 안에 고정합니다. 줄 높이는 label1-reading-line(22px) 토큰을 씁니다.
- - 카테고리 이브로우는 inverse-primary를 씁니다 — 무대(navy)는 테마 불변이라 라이트용 primary-normal은 3.9:1로 AA 미달이고, inverse-primary는 무대 양 끝점에서 4.7:1·5.2:1로 통과합니다. - 제품 코드는 한 줄 유지(nowrap) + ellipsis — 긴 ID도 카드 모서리에서 잘리지 않고 말줄임됩니다. - 설명은 2줄 clamp — 긴 설명이 위로 자라 사진 페이드 존을 침범하지 않도록 콘텐츠 블록을 하단 무대 영역 안에 고정합니다. 줄 높이는 label1-reading-line(22px) 토큰을 씁니다….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- 제품 코드는 실제 heading — id는 headingLevel(기본 3)로 렌더됩니다. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1).
- 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-label로 덮어쓰세요.
- 사진은 장식 — 제품 사진은 네이비 무대로 페이드되는 배경 요소라 항상 alt=""이고 aria-hidden 영역 안에 있습니다(제품 코드가 카드의 접근 이름). NewsCard와 달리 정보성 imageAlt를 두지 않습니다. 사진은 loading="lazy"·decoding="async"로 지연 로드되며, 카드의 4/5 aspect-ratio가 로드 전 레이아웃을 예약(CLS 방지)하고 로드 실패 시 네이비 무대가 비쳐 degrade됩니다.
- id는 제품 코드이지 DOM id가 아닙니다 — 이 카드의 공개 API에서 id는 제목으로 소비되며 DOM id 속성으로 전달되지 않습니다. DOM에서 카드를 지목해야 하면 data- 속성이나 감싸는 래퍼의 id를 쓰세요.

## Accessibility

- 제품 코드는 실제 heading — id는 headingLevel(기본 3)로 렌더됩니다. 카탈로그가 놓인 문서 계층에 맞춰 1–6을 주고, 제목이 이미 카드 바깥에 있으면 headingLevel={false}로 heading 의미를 끕니다. 레벨은 건너뛰지 않습니다(WCAG 1.3.1).
- 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-label로 덮어쓰세요.
- 포커스 어포던스 — 키보드 포커스에서도 호버와 같은 이미지 줌 + 섀도 심화를 재현합니다(포인터 전용 어포던스 금지). 포커스 링 자체는 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 그립니다.
- 사진은 장식 — 제품 사진은 네이비 무대로 페이드되는 배경 요소라 항상 alt=""이고 aria-hidden 영역 안에 있습니다(제품 코드가 카드의 접근 이름). NewsCard와 달리 정보성 imageAlt를 두지 않습니다. 사진은 loading="lazy"·decoding="async"로 지연 로드되며, 카드의 4/5 aspect-ratio가 로드 전 레이아웃을 예약(CLS 방지)하고 로드 실패 시 네이비 무대가 비쳐 degrade됩니다.
- ProductCard — 시그니처 다크 제품 타일: 사진이 카드 상단 68%에서 네이비 무대로 페이드아웃(마스크 58→97% — 제품이 카드 깊숙이까지 보이고, 페이드는 콘텐츠 시작선 직전에 완료), 이브로우·제품 코드·설명은 항상 순수 네이비 위. 무대 그레이드: 사진 하부에만 네이비 그라디언트 틴트(stage-to 0→28%)를 깔아 웜톤 사진도 무대 색조로 수렴시키고(상단은 원본 그대로), 약화된 스크림(55%)과 밝기 1.06으로 사진 가시성을 우선합니다. 기본 CTA 없음(그리드에선 카드=링크 관례가 어포던스 — 행동 유도는 섹션 헤더의 TextButton….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Product Card가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 카드 = 링크 — 카드 전체가 하나의 a이므로 안에 버튼·링크 같은 포커스 가능한 요소를 넣지 마세요(중첩 인터랙티브 금지). 링크의 접근 가능한 이름은 제품 코드이며, 이브로우·설명·CTA가 이름에 섞여 문단처럼 길어지지 않습니다. 다른 이름이 필요하면 aria-label로 덮어쓰세요. |
| Do | 제품별 구현 대신 공개 ProductCard API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 포커스 어포던스 — 키보드 포커스에서도 호버와 같은 이미지 줌 + 섀도 심화를 재현합니다(포인터 전용 어포던스 금지). 포커스 링 자체는 토큰 레이어(tokens/focus.css)의 전역 :focus-visible 규칙이 그립니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ProductCard의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ChecklistItem` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeatureCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FeedCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListingCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MetricCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NewsCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SpecRow` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Stat` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ProductCard id="Core Kit" category="Component Bundle"
  description="토큰, 컴포넌트, 문서 예제를 하나의 패키지로 제공합니다."
  href="#" />

<ProductCard id="Docs Kit" category="Documentation"
  description="가이드와 예제를 함께 제공하는 문서 카드입니다."
  cta="자세히 보기" href="#" />
```

## Tokens and API

### Tokens

- `--border-hairline-dark`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-brand-stage-from`
- `--color-semantic-brand-stage-to`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-inverse-primary`
- `--color-semantic-static-black`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--fs-h5`
- `--fw-bold`
- `--fw-extra`
- `--label1-reading-line`
- `--label1-size`
- `--label2-size`
- `--lh-h5`
- `--ls-h5`
- `--ls-overline`
- `--radius-2xl`
- `--scrim-dark`
- `--shadow-sm`
- `--shadow-xl`

### Source contracts

- `components/cards/ProductCard.jsx`
- `components/cards/ProductCard.d.ts`
- `components/cards/ProductCard.prompt.md`
- `stories/CardsExtended.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ProductCard prompt contract: `components/cards/ProductCard.prompt.md`
- Storybook implementation evidence: `stories/CardsExtended.stories.jsx`
