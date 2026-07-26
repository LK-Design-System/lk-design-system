# Slider and Range

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Slider` |
| Storybook | `LDS Core/Components/Selection and Input/Slider and Range` |
| Source | `../component-content.json#core-components-selection-and-input-slider-and-range` |

볼륨·비율·임계값처럼 값의 상대적 위치와 범위를 함께 이해해야 할 때 적합합니다. 정확한 숫자 입력에는 Number Field를, 작은 정수 단계에는 Stepper를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 범위 전체의 이름(예: 가격 범위). role="group"의 이름이 되고 각 노브 이름의 접두어(가격 범위 최솟값)가 됩니다. |
| minLabel | 하단 노브의 이름. @default "최솟값" |
| maxLabel | 상단 노브의 이름. @default "최댓값" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `[number, number]` | No | [low, high] 튜플. |
| `defaultValue` | `[number, number]` | No |  |
| `min` | `number` | No |  |
| `max` | `number` | No |  |
| `step` | `number` | No |  |
| `onChange` | `(value: [number, number]) = void` | No |  |
| `showValue` | `boolean` | No | low/high 값 표시. @default false |
| `disabled` | `boolean` | No | 두 노브를 모두 잠급니다. 형제 Slider와 같은 API. @default false |
| `label` | `string` | No | 범위 전체의 이름(예: 가격 범위). role="group"의 이름이 되고 각 노브 이름의 접두어(가격 범위 최솟값)가 됩니다. |
| `minLabel` | `string` | No | 하단 노브의 이름. @default "최솟값" |
| `maxLabel` | `string` | No | 상단 노브의 이름. @default "최댓값" |
| `value` | `number` | No |  |
| `defaultValue` | `number` | No |  |
| `min` | `number` | No |  |
| `max` | `number` | No |  |
| `step` | `number` | No |  |
| `onChange` | `(value: number) = void` | No |  |
| `disabled` | `boolean` | No |  |
| `showValue` | `boolean` | No | 끝의 숫자 표시. @default false |

## States

| State | Contract |
| --- | --- |
| disabled | 두 노브를 모두 잠급니다. 형제 Slider와 같은 API. @default false |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. showValue — 끝의 값 표시.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-interaction-inactive | light: #989BA2; dark: #5A5C63 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Related components

| Component | Relationship |
| --- | --- |
| `RangeSlider` | 같은 페이지가 소유 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Radio` | 대표 시나리오에서 조합 |
| `RadioGroup` | 대표 시나리오에서 조합 |
| `SegmentedControl` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Slider defaultValue={40} showValue onChange={setV} />
<Slider value={v} min={0} max={10} step={1} onChange={setV} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-interaction-inactive`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--font-sans`
- `--fw-bold`
- `--label1-size`
- `--label2-size`
- `--radius-pill`
- `--shadow-control`
- `--space-3-5`

### Source contracts

- `components/forms/RangeSlider.jsx`
- `components/forms/RangeSlider.d.ts`
- `components/forms/RangeSlider.prompt.md`
- `components/forms/Slider.jsx`
- `components/forms/Slider.d.ts`
- `components/forms/Slider.prompt.md`
- `stories/FormRangeControls.stories.jsx`

## Sources

- Slider prompt contract: `components/forms/Slider.prompt.md`
- Storybook implementation evidence: `stories/FormRangeControls.stories.jsx`
