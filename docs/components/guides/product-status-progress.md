# Progress

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `CircularProgress` |
| Storybook | `LDS Product/Status/Progress` |
| Source | `../component-content.json#product-status-progress` |

업로드·분석·생성처럼 시작과 완료가 있는 작업의 진행률이나 대기 상태를 전달할 때 적합합니다. 작업이 아닌 현재 측정값을 알려진 범위 안에서 비교하려면 Progress 대신 Meter를 사용하세요.

## 사용 판단

### 사용

- 업로드·분석·생성처럼 시작과 완료가 있는 작업의 진행률이나 대기 상태를 전달할 때 적합합니다. 작업이 아닌 현재 측정값을 알려진 범위 안에서 비교하려면 Progress 대신 Meter를 사용하세요.
- label / showValue provide accessible and visible progress context.
- - value / max define determinate progress. - indeterminate renders an unknown-duration rotating arc and omits aria-valuenow. - size / thickness control the ring geometry. - tone: signal, positive, cautionary, or negative. - label / showValue provide accessible and visible progress context. - Motion respects prefers-re….
- Progress가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Progress가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | CircularProgress의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Accessible label for the progress indicator. |
| Label | Optional visible label. |

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
| tone | Arc tone. @default "signal" 타입 계약: 'signal' \| 'positive' \| 'cautionary' \| 'negative' |
| tone | Fill tone. @default "signal" 타입 계약: 'signal' \| 'positive' \| 'cautionary' \| 'negative' |

## Behavior and interaction

- CircularProgress의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 CircularProgress는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Motion respects prefers-reduced-motion. The rotating ring gets its animation from an inline style, so the injected @media (prefers-reduced-motion: reduce) rule declares animation:none!important — dropping !important silently disables the guard (WCAG 2.3.3). Same mechanism as Skeleton/Spinner. |
| 명시 규칙 2 | - value / max define determinate progress. - indeterminate renders an unknown-duration rotating arc and omits aria-valuenow. - size / thickness control the ring geometry. - tone: signal, positive, cautionary, or negative. - label / showValue provide accessible and visible progress context. - Motion respects prefers-re… |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label / showValue provide accessible and visible progress context.
- Indeterminate aria-valuetext는 ProgressBar와 같은 한국어 문구 진행 중입니다.
- - value / max define determinate progress. - indeterminate renders an unknown-duration rotating arc and omits aria-valuenow. - size / thickness control the ring geometry. - tone: signal, positive, cautionary, or negative. - label / showValue provide accessible and visible progress context. - Motion respects prefers-re….
- 사용자에게 보이는 Progress 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- indeterminate renders an unknown-duration rotating arc and omits aria-valuenow.
- label / showValue provide accessible and visible progress context.
- Motion respects prefers-reduced-motion. The rotating ring gets its animation from an inline style, so the injected @media (prefers-reduced-motion: reduce) rule declares animation:none!important — dropping !important silently disables the guard (WCAG 2.3.3). Same mechanism as Skeleton/Spinner.
- Indeterminate aria-valuetext는 ProgressBar와 같은 한국어 문구 진행 중입니다.
- - value / max define determinate progress. - indeterminate renders an unknown-duration rotating arc and omits aria-valuenow. - size / thickness control the ring geometry. - tone: signal, positive, cautionary, or negative. - label / showValue provide accessible and visible progress context. - Motion respects prefers-re….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | label / showValue provide accessible and visible progress context. |
| Don't | Progress가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - value / max define determinate progress. - indeterminate renders an unknown-duration rotating arc and omits aria-valuenow. - size / thickness control the ring geometry. - tone: signal, positive, cautionary, or negative. - label / showValue provide accessible and visible progress context. - Motion respects prefers-re…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 CircularProgress의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ProgressBar` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Meter` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- CircularProgress prompt contract: `components/status/CircularProgress.prompt.md`
- Storybook implementation evidence: `stories/ProductProgress.stories.jsx`
- [SEED Progress benchmark](https://seed-design.io/components/progress-circle)
