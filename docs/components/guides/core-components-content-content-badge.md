# Content Badge

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `ContentBadge` |
| Storybook | `LDS Core/Components/Content/Content Badge` |
| Source | `../component-content.json#core-components-content-content-badge` |

플랫폼, 유형, 추천 여부처럼 콘텐츠를 분류하는 짧은 메타 정보에 적합합니다. 성공·경고·오류처럼 현재 상태를 전달할 때는 Status Badge를 사용하고, 긴 설명이나 주요 행동을 배지 안에 넣지 마세요.

## 사용 판단

### 사용

- 플랫폼, 유형, 추천 여부처럼 콘텐츠를 분류하는 짧은 메타 정보에 적합합니다. 성공·경고·오류처럼 현재 상태를 전달할 때는 Status Badge를 사용하고, 긴 설명이나 주요 행동을 배지 안에 넣지 마세요.
- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- - WDS axes: variant solid · default · outlined, size xsmall · small · medium, color neutral · accent, icon via icon, leading, or trailing. - Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. - Count/dot badges….
- Content Badge가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다.
- accentBackgroundColor / accentContentColor 로 직접 색을 넣을 때는 대비를 직접 검증하세요. 컴포넌트가 보정하지 않습니다.
- - variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다. - 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. - 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--col….
- Content Badge가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ContentBadge의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | Icon slot alias for the leading icon by default. |
| Icon Position | Places icon before or after text. @default "start" |
| Accent Content Color | Custom accent text/icon color for customize = accentContentColor. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `\| "signal" \| "accent" \| "navy" \| "neutral" \| "positive" \| "cautionary" \| "warning" \| "negative"` | No | Legacy LDS tone. Prefer color="neutral" \| "accent" for parity. |
| `color` | `"neutral" \| "accent"` | No | color axis. @default "neutral" |
| `variant` | `"solid" \| "default" \| "outlined" \| "soft" \| "outline"` | No | visual variant. soft and outline are legacy aliases. @default "default" |
| `size` | `"xsmall" \| "xs" \| "small" \| "sm" \| "medium" \| "md" \| "lg"` | No | size axis. sm, md, and lg are legacy aliases. @default "small" |
| `icon` | `React.ReactNode` | No | Icon slot alias for the leading icon by default. |
| `iconPosition` | `"start" \| "end"` | No | Places icon before or after text. @default "start" |
| `leading` | `React.ReactNode` | No | Explicit leading slot. |
| `trailing` | `React.ReactNode` | No | Explicit trailing slot. |
| `accentBackgroundColor` | `string` | No | Custom accent background for customize = accentBackgroundColor. |
| `accentContentColor` | `string` | No | Custom accent text/icon color for customize = accentContentColor. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | Legacy LDS tone. Prefer color="neutral" \| "accent" for parity. 타입 계약: \| "signal" \| "accent" \| "navy" \| "neutral" \| "positive" \| "cautionary" \| "warning" \| "negative" |
| variant | visual variant. soft and outline are legacy aliases. @default "default" 타입 계약: "solid" \| "default" \| "outlined" \| "soft" \| "outline" |
| 변형·상태 · 채움 배지 톤 대비 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- ContentBadge는 비상호작용 정보 라벨 전용입니다. 클릭·선택되는 키워드에는 Chip, 대문자 이브로우 필에는 Tag를 쓰세요.
- 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다.
- 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--color-semantic-status-positive-text 등)을 씁니다. 라이트에서는 진한 잉크(5.5–7.5:1), 다크에서는 밝은 톤 + 어두운 반전 텍스트로 뒤집혀 두 테마 모두 통과합니다.
- 상태를 색으로만 전달하지 마세요(WCAG 1.4.1). 라벨 텍스트나 아이콘으로 의미를 함께 주세요.
- ContentBadge — WDS Content Badge. 특정 콘텐츠의 상태나 속성을 짧게 강조하는 작은 라벨입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다. |
| 명시 규칙 2 | 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. |
| 명시 규칙 3 | 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--color-semantic-status-positive-text 등)을 씁니다. 라이트에서는 진한 잉크(5.5–7.5:1), 다크에서는 밝은 톤 + 어두운 반전 텍스트로 뒤집혀 두 테마 모두 통과합니다. |
| 명시 규칙 4 | 상태를 색으로만 전달하지 마세요(WCAG 1.4.1). 라벨 텍스트나 아이콘으로 의미를 함께 주세요. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- Count/dot badges belong to Badge; live status with dot/text belongs to StatusBadge.
- ContentBadge는 비상호작용 정보 라벨 전용입니다. 클릭·선택되는 키워드에는 Chip, 대문자 이브로우 필에는 Tag를 쓰세요.
- variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다.

## Accessibility

- 상태를 색으로만 전달하지 마세요(WCAG 1.4.1). 라벨 텍스트나 아이콘으로 의미를 함께 주세요.
- 색 대비 규칙 (WCAG 1.4.3 AA).
- - variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다. - 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. - 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--col….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. |
| Don't | 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. |
| Do | - WDS axes: variant solid · default · outlined, size xsmall · small · medium, color neutral · accent, icon via icon, leading, or trailing. - Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. - Count/dot badges…. |
| Don't | accentBackgroundColor / accentContentColor 로 직접 색을 넣을 때는 대비를 직접 검증하세요. 컴포넌트가 보정하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ContentBadge의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Accordion` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Blockquote` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Code` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Collapsible` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Kbd` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ListCell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Overline` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ContentBadge variant="solid" color="accent">Android</ContentBadge>
<ContentBadge variant="outlined" color="neutral" leading={<Icon name="webinar" />}>Web</ContentBadge>
<ContentBadge color="accent" accentBackgroundColor="#E4F6FB" accentContentColor="#007A9A">텍스트</ContentBadge>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--caption2-line`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-inverse-background`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive`
- `--color-semantic-status-positive-text`
- `--font-sans`
- `--fw-medium`
- `--label2-line`
- `--label2-size`
- `--radius-8`
- `--radius-sm`

### Source contracts

- `components/content/ContentBadge.jsx`
- `components/content/ContentBadge.d.ts`
- `components/content/ContentBadge.prompt.md`
- `stories/ContentBadgesAnnotations.stories.jsx`

## Migration

- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- - WDS axes: variant solid · default · outlined, size xsmall · small · medium, color neutral · accent, icon via icon, leading, or trailing. - Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. - Count/dot badges….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ContentBadge prompt contract: `components/content/ContentBadge.prompt.md`
- Storybook implementation evidence: `stories/ContentBadgesAnnotations.stories.jsx`
