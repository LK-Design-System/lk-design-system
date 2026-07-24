# Slider and Range

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Slider` |
| Storybook | `LDS Core/Components/Selection and Input/Slider and Range` |
| Source | `../component-content.json#core-components-selection-and-input-slider-and-range` |

Slider — 시그널 잉크로 채워진 트랙과 화이트 노브가 있는 범위 컨트롤.

## 사용 판단

### 사용

- Slider — 시그널 잉크로 채워진 트랙과 화이트 노브가 있는 범위 컨트롤.
- Slider and Range가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Slider API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Slider and Range가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Slider의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 범위 전체의 이름(예: 가격 범위). role="group"의 이름이 되고 각 노브 이름의 접두어(가격 범위 최솟값)가 됩니다. |
| Min Label | 하단 노브의 이름. @default "최솟값" |
| Max Label | 상단 노브의 이름. @default "최댓값" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `[number, number]` | No | [low, high] 튜플. |
| `defaultValue` | `[number, number]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `min` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `max` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `step` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: [number, number]) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showValue` | `boolean` | No | low/high 값 표시. @default false |
| `disabled` | `boolean` | No | 두 노브를 모두 잠급니다. 형제 Slider와 같은 API. @default false |
| `label` | `string` | No | 범위 전체의 이름(예: 가격 범위). role="group"의 이름이 되고 각 노브 이름의 접두어(가격 범위 최솟값)가 됩니다. |
| `minLabel` | `string` | No | 하단 노브의 이름. @default "최솟값" |
| `maxLabel` | `string` | No | 상단 노브의 이름. @default "최댓값" |
| `value` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `min` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `max` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `step` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showValue` | `boolean` | No | 끝의 숫자 표시. @default false |

## States

| State | Contract |
| --- | --- |
| disabled | 두 노브를 모두 잠급니다. 형제 Slider와 같은 API. @default false 타입 계약: boolean |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. showValue — 끝의 값 표시.
- - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. showValue — 끝의 값 표시.
- Slider의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Slider는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-interaction-inactive | light: #989BA2; dark: #5A5C63 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 Slider and Range 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Slider and Range가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Slider and Range가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 Slider API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Slider의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `RangeSlider` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Checkbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CheckboxGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Radio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RadioGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SegmentedControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

### Source contracts

- `components/forms/RangeSlider.jsx`
- `components/forms/RangeSlider.d.ts`
- `components/forms/RangeSlider.prompt.md`
- `components/forms/Slider.jsx`
- `components/forms/Slider.d.ts`
- `components/forms/Slider.prompt.md`
- `stories/FormRangeControls.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Slider prompt contract: `components/forms/Slider.prompt.md`
- Storybook implementation evidence: `stories/FormRangeControls.stories.jsx`
- [SEED Slider and Range benchmark](https://seed-design.io/components/slider)
