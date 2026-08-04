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

### 사용하지 않음

- accentBackgroundColor / accentContentColor 로 직접 색을 넣을 때는 대비를 직접 검증하세요. 컴포넌트가 보정하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| icon | Icon slot alias for the leading icon by default. |
| iconPosition | Places icon before or after text. @default "start" |
| accentContentColor | Custom accent text/icon color for customize = accentContentColor. |

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
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | Legacy LDS tone. Prefer color="neutral" \| "accent" for parity. |
| variant | visual variant. soft and outline are legacy aliases. @default "default" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | variant="solid" 은 채움 위에 반전 텍스트(--color-semantic-background-normal-normal)를 올립니다. 따라서 채움색 자체가 AA 4.5:1 을 넘어야 합니다. |
| 명시 규칙 2 | 원색 상태 토큰은 이 조건을 만족하지 않습니다 — --color-semantic-status-positive 13BE4C ≈ 2.5:1, -cautionary EB9C33 ≈ 2.3:1, -negative EE5656 ≈ 3.2:1. accent(3878B3 ≈ 4.7:1)만 통과합니다. |
| 명시 규칙 3 | 그래서 solid 의 상태 톤 채움은 AA -text 토큰(--color-semantic-status-positive-text 등)을 씁니다. 라이트에서는 진한 잉크(5.5–7.5:1), 다크에서는 밝은 톤 + 어두운 반전 텍스트로 뒤집혀 두 테마 모두 통과합니다. |
| 명시 규칙 4 | 상태를 색으로만 전달하지 마세요(WCAG 1.4.1). 라벨 텍스트나 아이콘으로 의미를 함께 주세요. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- Legacy LDS aliases still work: variant="soft" maps to WDS default, variant="outline" maps to outlined, and tone can still be used for status-flavoured labels.
- Count badges belong to Badge; live availability with dot/text belongs to StatusIndicator; lifecycle and result labels belong to StatusBadge.
- ContentBadge는 비상호작용 정보 라벨 전용입니다. 클릭·선택되는 키워드에는 Chip, 대문자 이브로우 필에는 Tag를 쓰세요.
- 원색 토큰은 여전히 default(soft) 배경 믹스와 outlined 테두리 믹스에 쓰입니다 — 이 두 변형의 텍스트는 원래부터 -text 토큰입니다.

## Accessibility

- 색 대비 규칙 (WCAG 1.4.3 AA).

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |
| `ListCell` | 대표 시나리오에서 조합 |
| `Overline` | 대표 시나리오에서 조합 |

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
- `--color-semantic-brand-ink`
- `--color-semantic-brand-surface`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
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
- `--space-0-5`
- `--space-1`

### Source contracts

- `components/content/ContentBadge.jsx`
- `components/content/ContentBadge.d.ts`
- `components/content/ContentBadge.prompt.md`
- `stories/ContentBadgesAnnotations.stories.jsx`

## Sources

- ContentBadge prompt contract: `components/content/ContentBadge.prompt.md`
- Storybook implementation evidence: `stories/ContentBadgesAnnotations.stories.jsx`
