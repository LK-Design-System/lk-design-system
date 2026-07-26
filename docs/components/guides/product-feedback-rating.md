# Rating

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Feedback |
| Owner | `Rating` |
| Storybook | `LDS Product/Feedback/Rating` |
| Source | `../component-content.json#product-feedback-rating` |

콘텐츠·서비스에 대한 순서형 만족도를 입력받거나 요약해 보여 줄 때 적합합니다. 정밀한 수치 입력이나 여러 기준의 설문에는 별점 대신 Number Field 또는 별도 설문 패턴을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 입력 모드 slider의 접근 이름. aria-label/aria-labelledby로 덮어쓸 수 있습니다. @default "평점" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No |  |
| `defaultValue` | `number` | No |  |
| `max` | `number` | No | 별 개수. aria-valuemax와 값 문구의 만점이 됩니다. @default 5 |
| `onChange` | `(value: number) = void` | No | 값이 실제로 바뀔 때만 호출됩니다. |
| `size` | `number` | No | 별 크기(px). @default 20 |
| `readOnly` | `boolean` | No | 표시 전용(role="img", 포커스·입력 없음). @default false |
| `label` | `string` | No | 입력 모드 slider의 접근 이름. aria-label/aria-labelledby로 덮어쓸 수 있습니다. @default "평점" |
| `valueText` | `(value: number, max: number) = string` | No | 값 문구 생성기(aria-valuetext, 읽기 전용 모드의 이름). @default (v, max) = ${max}점 만점에 ${v}점 |

## States

| State | Contract |
| --- | --- |
| readOnly | 표시 전용(role="img", 포커스·입력 없음). @default false |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. 값이 실제로 바뀔 때만 onChange가 호출됩니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 입력 모드는 WAI-ARIA APG slider입니다. tab stop 하나(tabIndex=0)에 aria-valuemin=0 / aria-valuemax={max} / aria-valuenow / aria-valuetext를 싣고, ArrowRight·ArrowUp은 +1, ArrowLeft·ArrowDown은 −1, Home은 0, End는 max로 이동합니다. 별 각각은 aria-hidden이라 값은 항상 한 번만 낭독됩니다. |
| 명시 규칙 2 | 읽기 전용 모드는 role="img"이고 접근 이름이 곧 값(5점 만점에 4점)입니다. 포커스를 받지 않고 호버 미리보기도 없습니다. 값을 시각적으로만 전달하지 않기 위한 텍스트 대안입니다. |
| 명시 규칙 3 | 별을 radio 5개로 나누지 않은 이유: 값 문구(aria-valuetext)를 실을 곳이 없고, 20px 별 하나하나가 24×24 최소 타깃 크기(WCAG 2.5.8) 아래의 개별 타깃이 됩니다. 같은 이유로 Stepper도 값에 role="spinbutton"을 씁니다. |
| 명시 규칙 4 | 반개 별은 없습니다. 글리프가 star / star-fill 두 종류뿐이라 소수 값은 Math.floor로 채우고(4.5 → 별 4개), 낭독되는 값은 소수를 그대로 유지합니다. 반개 표시가 필요하면 값을 정수로 반올림해 전달하세요. |
| --color-semantic-accent-foreground-orange | light: #C97A14; dark: #EB9C33 |

## Content and writing

- valueText — 값 문구 생성기. 기본은 (v, max) = "${max}점 만점에 ${v}점"이며, 도메인 문구가 필요할 때만 재정의합니다.

## Accessibility

- label — 입력 모드의 접근 이름(기본 평점). 무엇에 대한 평가인지 알 수 있게 항상 지정하세요. aria-label / aria-labelledby가 있으면 그쪽이 우선입니다.
- Rating — 뮤트 오커 색의 별점. 입력용과 표시용이 서로 다른 접근성 계약을 가집니다.

## Examples

### 기본 조합

```jsx
<Rating defaultValue={4} label="사용 만족도" onChange={setScore} />
<Rating value={4} readOnly size={16} />
```

## Tokens and API

### Tokens

- `--color-semantic-accent-foreground-orange`
- `--color-semantic-interaction-inactive`
- `--space-0-5`

### Source contracts

- `components/feedback/Rating.jsx`
- `components/feedback/Rating.d.ts`
- `components/feedback/Rating.prompt.md`
- `stories/FeedbackRating.stories.jsx`

## Sources

- Rating prompt contract: `components/feedback/Rating.prompt.md`
- Storybook implementation evidence: `stories/FeedbackRating.stories.jsx`
