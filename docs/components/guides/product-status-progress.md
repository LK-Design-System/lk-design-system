# Progress

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `CircularProgress` |
| Storybook | `LDS Product/Status/Progress` |
| Source | `../component-content.json#product-status-progress` |

업로드·분석·생성처럼 시작과 완료가 있는 작업의 진행률이나 대기 상태를 전달할 때 적합합니다. 작업이 아닌 현재 측정값을 알려진 범위 안에서 비교하려면 Progress 대신 Meter를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Optional visible label. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No | Current value for determinate progress. @default 0 |
| `max` | `number` | No | Maximum value for determinate progress. @default 100 |
| `size` | `number` | No | Diameter in px. @default 48 |
| `thickness` | `number` | No | Ring thickness in px. @default 5 |
| `tone` | `'signal' \| 'positive' \| 'cautionary' \| 'negative'` | No | Arc tone. @default "signal" |
| `indeterminate` | `boolean` | No | Shows an unknown-duration rotating arc. @default false |
| `label` | `React.ReactNode` | No | Accessible label for the progress indicator. |
| `showValue` | `boolean` | No | Shows the computed percentage in the center for determinate progress. @default false |
| `value` | `number` | No | Current value. @default 0 |
| `max` | `number` | No | Maximum value. @default 100 |
| `indeterminate` | `boolean` | No | Shows an unknown-duration moving segment instead of a fixed percentage. @default false |
| `tone` | `'signal' \| 'positive' \| 'cautionary' \| 'negative'` | No | Fill tone. @default "signal" |
| `color` | `string` | No | Custom fill color (CSS color value or token, e.g. "var(--color-semantic-status-positive)"). Overrides tone when set. |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Track height. @default "md" |
| `label` | `React.ReactNode` | No | Optional visible label. |
| `showValue` | `boolean` | No | Shows the computed percentage beside the label. @default false |

## States

| State | Contract |
| --- | --- |
| tone | Arc tone. @default "signal" |
| tone | Fill tone. @default "signal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Motion respects prefers-reduced-motion. The rotating ring gets its animation from an inline style, so the injected @media (prefers-reduced-motion: reduce) rule declares animation:none!important — dropping !important silently disables the guard (WCAG 2.3.3). Same mechanism as Skeleton/Spinner. |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |

## Accessibility

- indeterminate renders an unknown-duration rotating arc and omits aria-valuenow.
- label / showValue provide accessible and visible progress context.
- Indeterminate aria-valuetext는 ProgressBar와 같은 한국어 문구 진행 중입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ProgressBar` | 같은 페이지가 소유 |
| `Meter` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<CircularProgress value={72} label="Report progress" showValue />
<CircularProgress indeterminate label="Processing" />
<CircularProgress value={4} max={5} tone="positive" size={40} />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-strong`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--dur-base`
- `--ease-in-out`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label2-size`
- `--radius-pill`

### Source contracts

- `components/status/CircularProgress.jsx`
- `components/status/CircularProgress.d.ts`
- `components/status/CircularProgress.prompt.md`
- `components/status/ProgressBar.jsx`
- `components/status/ProgressBar.d.ts`
- `components/status/ProgressBar.prompt.md`
- `stories/ProductProgress.stories.jsx`

## Sources

- CircularProgress prompt contract: `components/status/CircularProgress.prompt.md`
- Storybook implementation evidence: `stories/ProductProgress.stories.jsx`
