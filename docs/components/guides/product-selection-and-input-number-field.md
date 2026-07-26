# Number Field

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `NumberField` |
| Storybook | `LDS Product/Selection and Input/Number Field` |
| Source | `../component-content.json#product-selection-and-input-number-field` |

수량·속도처럼 최소·최대와 일정한 step이 있는 값을 입력할 때 적합합니다. 범위가 없거나 숫자 외 형식을 함께 받는 값에는 Number Field 대신 Input을 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No |  |
| `defaultValue` | `number` | No |  |
| `min` | `number` | No |  |
| `max` | `number` | No |  |
| `step` | `number` | No |  |
| `onChange` | `(value: number) = void` | No | 편집 중에는 파싱된 중간값이 그대로 전달되고, blur / Enter / 스테퍼로 값이 확정될 때 [min, max]로 클램프된 값이 다시 전달됩니다. |
| `label` | `React.ReactNode` | No |  |
| `helper` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `invalid` | `boolean` | No |  |
| `size` | `'sm' \| 'md'` | No |  |
| `disabled` | `boolean` | No |  |
| `style` | `React.CSSProperties` | No | 스테퍼를 포함한 입력 셸의 스타일. |
| `fieldStyle` | `React.CSSProperties` | No | label/helper/error를 포함한 전체 필드 스타일. |

## Behavior and interaction

- value / defaultValue / onChange — 제어/비제어. min / max / step — 범위. 콤팩트한 ± 전용 컨트롤에는 Stepper를 쓰세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 클램프는 값이 확정될 때만 일어납니다. 편집 중에는 max=20에서 25를 타이핑하거나 필드를 비워 둘 수 있고, blur·Enter·스테퍼로 확정하는 순간 [min, max]로 클램프됩니다. 빈 채로 blur하면 마지막 확정값으로 되돌아갑니다. onChange는 편집 중에는 파싱된 중간값을, 확정 시점에는 클램프된 값을 전달합니다. |
| 명시 규칙 2 | WCAG 2.2 Focus Appearance에 맞춰 field 전체에 LDS focus ring을 표시합니다. |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Accessibility

- label / helper / error / invalid — label을 주면 htmlFor로 연결된 필드 레이블·메시지 스택을 함께 렌더링하고, 그렇지 않으면 셸만 렌더링해 FormField 같은 상위 표면에 맡깁니다. error나 invalid는 aria-invalid와 오류 테두리를 함께 켭니다. fieldStyle은 label/helper/error를 포함한 바깥 스택, style은 스테퍼가 붙은 입력 셸을 스타일링합니다.
- native number input이 spinbutton semantics를 소유하고 inline step action은 보조 조작입니다. 보조 action 이름에는 field 이름을 포함합니다. focus/disabled/readOnly는 Input과 같은 component token(fieldBackground·fieldBorderColor)을 사용하며 type="number"는 consumer가 덮어쓰지 못합니다.
- WAI-ARIA Spinbutton pattern의 native editing·Arrow key 기대를 보존합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

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

## Sources

- NumberField prompt contract: `components/forms/NumberField.prompt.md`
- Storybook implementation evidence: `stories/FormAdvancedInputs.stories.jsx`
- [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Carbon Number input](https://carbondesignsystem.com/components/number-input/usage/)
- [Spectrum NumberField](https://spectrum.adobe.com/page/number-field/)
