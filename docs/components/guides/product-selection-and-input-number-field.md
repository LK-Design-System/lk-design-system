# Number Field

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `NumberField` |
| Storybook | `LDS Product/Selection and Input/Number Field` |
| Source | `../component-content.json#product-selection-and-input-number-field` |

수량·속도처럼 최소·최대와 일정한 step이 있는 값을 입력할 때 적합합니다. 범위가 없거나 숫자 외 형식을 함께 받는 값에는 Number Field 대신 Input을 사용하세요.

## 사용 판단

### 사용

- 수량·속도처럼 최소·최대와 일정한 step이 있는 값을 입력할 때 적합합니다. 범위가 없거나 숫자 외 형식을 함께 받는 값에는 Number Field 대신 Input을 사용하세요.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다.
- - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요. - 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. - label / helper / error / inval….
- Number Field가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Number Field가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | NumberField의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `min` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `max` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `step` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: number) = void` | No | 편집 중에는 파싱된 중간값이 그대로 전달되고, blur / Enter / 스테퍼로 값이 확정될 때 [min, max]로 클램프된 값이 다시 전달됩니다. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `helper` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 스테퍼를 포함한 입력 셸의 스타일. |
| `fieldStyle` | `React.CSSProperties` | No | label/helper/error를 포함한 전체 필드 스타일. |

## States

| State | Contract |
| --- | --- |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| invalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요.
- 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다.
- WCAG 2.2 Focus Appearance에 맞춰 field 전체에 LDS focus ring을 표시합니다.
- - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요. - 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. - label / helper / error / inval….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. |
| 명시 규칙 2 | WCAG 2.2 Focus Appearance에 맞춰 field 전체에 LDS focus ring을 표시합니다. |
| 명시 규칙 3 | - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요. - 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. - label / helper / error / inval… |
| 명시 규칙 4 | - WAI-ARIA Spinbutton pattern의 native editing·Arrow key 기대를 보존합니다. - WCAG 2.2 Focus Appearance에 맞춰 field 전체에 LDS focus ring을 표시합니다. - 편집 중 중간값 허용과 확정 시 클램프는 Carbon Number input·Spectrum NumberField의 관례를 따릅니다. |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label / helper / error / invalid — label을 주면 htmlFor로 연결된 필드 레이블·메시지 스택을 함께 렌더링하고, 그렇지 않으면 셸만 렌더링해 FormField 같은 상위 표면에 맡깁니다. error나 invalid는 aria-invalid와 오류 테두리를 함께 켭니다. fieldStyle은 label/helper/error를 포함한 바깥 스택, style은 스테퍼가 붙은 입력 셸을 스타일링합니다.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다.
- - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요. - 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. - label / helper / error / inval….
- 사용자에게 보이는 Number Field 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다.
- label / helper / error / invalid — label을 주면 htmlFor로 연결된 필드 레이블·메시지 스택을 함께 렌더링하고, 그렇지 않으면 셸만 렌더링해 FormField 같은 상위 표면에 맡깁니다. error나 invalid는 aria-invalid와 오류 테두리를 함께 켭니다. fieldStyle은 label/helper/error를 포함한 바깥 스택, style은 스테퍼가 붙은 입력 셸을 스타일링합니다.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다.
- WAI-ARIA Spinbutton pattern의 native editing·Arrow key 기대를 보존합니다.
- WCAG 2.2 Focus Appearance에 맞춰 field 전체에 LDS focus ring을 표시합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다. |
| Don't | Number Field가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요. - 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. - label / helper / error / inval…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 NumberField의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<NumberField label="투입 대수" helper="최대 20대" defaultValue={3} min={0} max={20} onChange={setQty} />
```

## Tokens and API

### Tokens

- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`

### Source contracts

- `components/forms/NumberField.jsx`
- `components/forms/NumberField.d.ts`
- `components/forms/NumberField.prompt.md`
- `stories/FormAdvancedInputs.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- NumberField prompt contract: `components/forms/NumberField.prompt.md`
- Storybook implementation evidence: `stories/FormAdvancedInputs.stories.jsx`
- [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Carbon Number input](https://carbondesignsystem.com/components/number-input/usage/)
- [Spectrum NumberField](https://spectrum.adobe.com/page/number-field/)
