# Stepper

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Stepper` |
| Storybook | `LDS Core/Components/Selection and Input/Stepper` |
| Source | `../component-content.json#core-components-selection-and-input-stepper` |

수량이나 반복 횟수처럼 범위가 짧고 증감 단위가 분명할 때 적합합니다. 임의 숫자를 빠르게 입력해야 하면 Number Field를, 넓은 연속 범위를 탐색하면 Slider를 사용하세요.

## 사용 판단

### 사용

- 수량이나 반복 횟수처럼 범위가 짧고 증감 단위가 분명할 때 적합합니다. 임의 숫자를 빠르게 입력해야 하면 Number Field를, 넓은 연속 범위를 탐색하면 Slider를 사용하세요.
- valueText — 숫자만으로 의미가 부족할 때 aria-valuetext를 제공합니다.
- 경계에서 native disabled를 쓰지 않습니다. 값이 min/max에 닿으면 버튼은 aria-disabled="true"가 되고 포커스 가능한 상태로 남으며 활성화는 무시됩니다. native disabled로 바꾸면 그 순간 포커스가 로 떨어져 키보드 사용자가 위치를 잃습니다.
- 길게 누르기 자동 반복: 포인터를 누르고 있으면 repeatDelay(400ms) 후 repeatInterval(80ms)마다 반복됩니다. 타이머는 pointerup/pointerleave/pointercancel/blur/언마운트/disabled 전환에서 모두 정리됩니다. 포인터 경로는 pointerdown에서 1회 증감하고 뒤따르는 click을 삼켜 이중 증감을 막습니다(키보드 Enter/Space 활성화는 click 경로를 그대로 사용).

### 사용하지 않음

- 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다.
- +/− 버튼은 하드코딩된 영문 decrease/increase 대신 맥락 있는 한국어 이름(도입 대수 증가)을 가집니다. 아이콘은 aria-hidden입니다.
- - 래퍼는 role="group"이며 label(또는 aria-label / aria-labelledby)로 이름을 갖습니다. - 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다. - 키보드(spinbutton 포커스 시): ArrowUp/ArrowDown = ±step, PageUp/PageDown = ±largeStep, Home = min, En….
- Stepper가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Stepper의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 조절 대상의 이름(예: 도입 대수). role="group"과 내부 spinbutton의 접근 가능한 이름이 되고, +/− 버튼 이름(도입 대수 증가)의 접두어가 됩니다. 생략하면 aria-label, 그다음 수량이 사용됩니다. |
| Decrement Label | 감소 버튼 이름 재정의. @default ${label} 감소 |
| Increment Label | 증가 버튼 이름 재정의. @default ${label} 증가 |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No | 제어되는 값. |
| `defaultValue` | `number` | No | 비제어 초기 값. @default 0 |
| `min` | `number` | No | 하한(클램프). 유한할 때만 aria-valuemin / Home 키가 활성화됩니다. |
| `max` | `number` | No | 상한(클램프). 유한할 때만 aria-valuemax / End 키가 활성화됩니다. |
| `step` | `number` | No | 누를 때마다 증가폭. @default 1 |
| `largeStep` | `number` | No | PageUp/PageDown 증가폭. @default step 10 |
| `onChange` | `(value: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md'` | No | 높이. @default "md" |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string` | No | 조절 대상의 이름(예: 도입 대수). role="group"과 내부 spinbutton의 접근 가능한 이름이 되고, +/− 버튼 이름(도입 대수 증가)의 접두어가 됩니다. 생략하면 aria-label, 그다음 수량이 사용됩니다. |
| `decrementLabel` | `string` | No | 감소 버튼 이름 재정의. @default ${label} 감소 |
| `incrementLabel` | `string` | No | 증가 버튼 이름 재정의. @default ${label} 증가 |
| `valueText` | `(value: number) = string` | No | 숫자 대신 읽힐 텍스트를 만듭니다(aria-valuetext). 예: (v) = ${v}대 |
| `repeatDelay` | `number` | No | 길게 누를 때 자동 반복이 시작되기까지의 지연(ms). @default 400 |
| `repeatInterval` | `number` | No | 자동 반복 간격(ms). @default 80 |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. min / max / step은 범위와 증가폭을 정합니다. largeStep은 PageUp/PageDown 폭(기본 step 10).
- size sm|md. 값은 tabular-nums로 렌더돼 떨리지 않습니다. 자유 숫자 입력에는 Input type="number"를 쓰세요.
- 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다.
- 키보드(spinbutton 포커스 시): ArrowUp/ArrowDown = ±step, PageUp/PageDown = ±largeStep, Home = min, End = max.
- 경계에서 native disabled를 쓰지 않습니다. 값이 min/max에 닿으면 버튼은 aria-disabled="true"가 되고 포커스 가능한 상태로 남으며 활성화는 무시됩니다. native disabled로 바꾸면 그 순간 포커스가 로 떨어져 키보드 사용자가 위치를 잃습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value / defaultValue / onChange — 제어/비제어. min / max / step은 범위와 증가폭을 정합니다. largeStep은 PageUp/PageDown 폭(기본 step 10). |
| 명시 규칙 2 | 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다. |
| 명시 규칙 3 | 길게 누르기 자동 반복: 포인터를 누르고 있으면 repeatDelay(400ms) 후 repeatInterval(80ms)마다 반복됩니다. 타이머는 pointerup/pointerleave/pointercancel/blur/언마운트/disabled 전환에서 모두 정리됩니다. 포인터 경로는 pointerdown에서 1회 증감하고 뒤따르는 click을 삼켜 이중 증감을 막습니다(키보드 Enter/Space 활성화는 click 경로를 그대로 사용). |
| 명시 규칙 4 | WCAG 2.2 2.4.3 Focus Order — 경계에서 포커스를 잃지 않아야 하는 근거. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label — 조절 대상의 이름. 접근성의 기준점이므로 항상 지정하세요(생략 시 수량).
- valueText — 숫자만으로 의미가 부족할 때 aria-valuetext를 제공합니다.
- decrementLabel / incrementLabel — +/− 버튼 이름을 직접 지정합니다(기본은 label 기반).
- 래퍼는 role="group"이며 label(또는 aria-label / aria-labelledby)로 이름을 갖습니다.

## Accessibility

- label — 조절 대상의 이름. 접근성의 기준점이므로 항상 지정하세요(생략 시 수량).
- valueText — 숫자만으로 의미가 부족할 때 aria-valuetext를 제공합니다.
- 래퍼는 role="group"이며 label(또는 aria-label / aria-labelledby)로 이름을 갖습니다.
- 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다.
- 키보드(spinbutton 포커스 시): ArrowUp/ArrowDown = ±step, PageUp/PageDown = ±largeStep, Home = min, End = max.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | valueText — 숫자만으로 의미가 부족할 때 aria-valuetext를 제공합니다. |
| Don't | 값은 role="spinbutton" + tabIndex=0 + aria-valuenow / aria-valuemin / aria-valuemax / aria-valuetext를 소유합니다. min/max가 무한대일 때는 해당 aria-value를 노출하지 않습니다. |
| Do | 경계에서 native disabled를 쓰지 않습니다. 값이 min/max에 닿으면 버튼은 aria-disabled="true"가 되고 포커스 가능한 상태로 남으며 활성화는 무시됩니다. native disabled로 바꾸면 그 순간 포커스가 로 떨어져 키보드 사용자가 위치를 잃습니다. |
| Don't | +/− 버튼은 하드코딩된 영문 decrease/increase 대신 맥락 있는 한국어 이름(도입 대수 증가)을 가집니다. 아이콘은 aria-hidden입니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Stepper의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Checkbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CheckboxGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Radio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RadioGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `RangeSlider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SegmentedControl` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Stepper label="도입 대수" defaultValue={1} min={0} max={9} onChange={setQty} />
<Stepper label="수량" value={qty} min={0} onChange={setQty} size="sm" />
<Stepper label="로봇" defaultValue={2} min={0} max={9} valueText={(v) => `${v}대`} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--radius-md`
- `--radius-sm`

### Source contracts

- `components/selection/Stepper.jsx`
- `components/selection/Stepper.d.ts`
- `components/selection/Stepper.prompt.md`
- `stories/SelectionStepper.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Stepper prompt contract: `components/selection/Stepper.prompt.md`
- Storybook implementation evidence: `stories/SelectionStepper.stories.jsx`
- [WAI-ARIA APG Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [WAI-ARIA APG Spinbutton example (date picker)](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/)
- [Carbon Number input accessibility](https://carbondesignsystem.com/components/number-input/accessibility/)
- [Apple HIG — Steppers](https://developer.apple.com/design/human-interface-guidelines/steppers)
- [WCAG 2.2 2.4.3 Focus Order](https://www.w3.org/TR/WCAG22/#focus-order)
