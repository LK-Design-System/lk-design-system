# Media Patterns

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `ContentBadge` |
| Storybook | `LDS Core/Components/Content/Media Patterns` |
| Source | `../component-content.json#core-components-content-media-patterns` |

카드, 갤러리, 미리보기에서 원본 크기가 다른 미디어를 일정한 비율로 정렬할 때 적합합니다. 인물 정체성은 Avatar를, 장식용 배경은 일반 이미지나 CSS 배경을 사용하고 중요한 상태를 오버레이에만 의존하지 마세요.

## 사용 판단

### 사용

- 카드, 갤러리, 미리보기에서 원본 크기가 다른 미디어를 일정한 비율로 정렬할 때 적합합니다. 인물 정체성은 Avatar를, 장식용 배경은 일반 이미지나 CSS 배경을 사용하고 중요한 상태를 오버레이에만 의존하지 마세요.
- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- - WDS axes: variant solid · default · outlined, size xsmall · small · medium, color neutral · accent, icon via icon, leading, or trailing. - Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. - Count/dot badges….
- Media Patterns가 소유하는 Content 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다.
- accentBackgroundColor / accentContentColor 로 직접 색을 넣을 때는 대비를 직접 검증하세요. 컴포넌트가 보정하지 않습니다.
- - variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다. - 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. - 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--col….
- Media Patterns가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ContentBadge의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | Icon slot alias for the leading icon by default. |
| Icon Position | Places icon before or after text. @default "start" |
| Accent Content Color | Custom accent text/icon color for customize = accentContentColor. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Placeholder Icon | 플레이스홀더 아이콘 이름. @default "image" |
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
| `src` | `string` | No | 이미지 URL. 생략하면 중립 플레이스홀더로 채움. |
| `alt` | `string` | No | 이미지의 대체 텍스트. |
| `ratio` | `ThumbnailRatio \| number \| string` | No | ratio preset or CSS/number aspect ratio. @default "1/1" |
| `radius` | `boolean \| number \| string` | No | 둥근 모서리: true = --radius-md, false = 사각, 또는 숫자/CSS 길이. @default true |
| `border` | `boolean \| string` | No | border toggle (WDS bakes a 1px hairline into every thumbnail). @default true |
| `fit` | `"cover" \| "contain"` | No | 이미지의 object-fit. @default "cover" |
| `overlay` | `React.ReactNode` | No | 오버레이 노드(배지, 재생 글리프, 재생시간). |
| `overlayAlign` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "center"` | No | 오버레이 위치. @default "top-left" |
| `overlayScrim` | `boolean \| "auto"` | No | 오버레이 뒤에 대비 보장을 위한 그라디언트 스크림을 깝니다. "auto" 는 실제 이미지(src)가 있을 때만 적용하고, 플레이스홀더 타일에는 넣지 않습니다. |
| `placeholder` | `boolean` | No | src가 없을 때 플레이스홀더 아이콘을 표시. @default true |
| `placeholderIcon` | `string` | No | 플레이스홀더 아이콘 이름. @default "image" |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | Legacy LDS tone. Prefer color="neutral" \| "accent" for parity. 타입 계약: \| "signal" \| "accent" \| "navy" \| "neutral" \| "positive" \| "cautionary" \| "warning" \| "negative" |
| variant | visual variant. soft and outline are legacy aliases. @default "default" 타입 계약: "solid" \| "default" \| "outlined" \| "soft" \| "outline" |

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
| `Thumbnail` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
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
- `--color-semantic-label-assistive`
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
- `--material-control-dimmer`
- `--radius-8`
- `--radius-md`
- `--radius-sm`
- `--ratio-1-1`
- `--ratio-1-2`
- `--ratio-10-16`
- `--ratio-16-10`
- `--ratio-16-9`
- `--ratio-2-1`
- `--ratio-2-3`
- `--ratio-21-9`
- `--ratio-3-2`
- `--ratio-3-4`
- `--ratio-4-3`
- `--ratio-4-5`
- `--ratio-5-4`
- `--ratio-9-16`
- `--ratio-9-21`
- `--ratio-golden`
- `--ratio-golden-vertical`

### Source contracts

- `components/content/ContentBadge.jsx`
- `components/content/ContentBadge.d.ts`
- `components/content/ContentBadge.prompt.md`
- `components/content/Thumbnail.jsx`
- `components/content/Thumbnail.d.ts`
- `components/content/Thumbnail.prompt.md`
- `stories/ContentMedia.stories.jsx`

## Migration

- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- - WDS axes: variant solid · default · outlined, size xsmall · small · medium, color neutral · accent, icon via icon, leading, or trailing. - Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels. - Count/dot badges….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ContentBadge prompt contract: `components/content/ContentBadge.prompt.md`
- Storybook implementation evidence: `stories/ContentMedia.stories.jsx`
