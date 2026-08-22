# Property Field

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `PropertyField` |
| Storybook | `LDS Product/Selection and Input/Property Field` |
| Source | `../component-content.json#product-selection-and-input-property-field` |

튜닝 패널처럼 각 속성에 단위·도움말·개별 Apply가 필요한 경우에 적합합니다. 일반 제출형 폼에는 Property Field 대신 FormField와 기본 입력 컴포넌트를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `string` | Yes |  |
| `hint` | `React.ReactNode` | No |  |
| `value` | `PropertyFieldValue` | No | 커밋된 현재 값. |
| `type` | `PropertyFieldType` | No |  |
| `min` | `number` | No |  |
| `max` | `number` | No |  |
| `step` | `number` | No |  |
| `unit` | `React.ReactNode` | No |  |
| `disabled` | `boolean` | No |  |
| `readOnly` | `boolean` | No |  |
| `applyLabel` | `React.ReactNode` | No |  |
| `dirtyLabel` | `string` | No |  |
| `onApply` | `(value: PropertyFieldValue) = void` | No | 값이 baseline과 달라진 뒤 Apply를 누르면 호출됩니다. |

## Behavior and interaction

- Layer: LDS Product Selection and Input extension. It composes existing input, switch, and button behavior for settings panels rather than replacing primitive form fields.
- 필드 단위로 즉시 커밋해야 하는 네비게이션 튜닝, 로봇 설정, 런타임 파라미터 패널에 사용합니다. 폼 전체 submit 흐름에는 FormField + Input/Select 조합을 우선합니다.
- PropertyField — 설정·튜닝 패널의 단일 파라미터 행입니다. 새 input primitive가 아니라 Input 계열 토큰, Switch, Button 문법을 조합한 Product/Selection and Input pattern입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WCAG 2.2 Contrast Minimum에 따라 작은 hint/unit 텍스트는 4.5:1을 충족하는 semantic foreground를 사용합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- label(필수 문자열) · hint · value · type number|text|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value).
- text/number 입력은 semantic/component input token을 따르고, toggle은 Switch, 적용 액션은 Button을 사용합니다. Apply 핸들러가 없거나 disabled/readOnly면 적용 버튼은 비활성입니다.

## Accessibility

- value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다.
- Compare against common property/settings field expectations before changing it: label and hint, typed value editor, committed vs draft value, dirty indication, explicit apply, disabled/read-only state, keyboard commit/reset, and clear separation from full form submission.
- compact input도 LDS focus ring과 AA text role을 유지합니다. hint는 모든 editor에, unit은 text/number editor에 aria-describedby로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.
- 접근 가능 이름은 보이는 label 하나로 고정합니다. text/number는 네이티브 연결로 이름을 얻으므로 aria-label로 덮어쓰지 않고, label이 ReactNode여도 텍스트를 추출해 범용어로 붕괴하지 않습니다. toggle은 Switch가 자체 로 input을 감싸므로 두 번째 label을 만들지 않고 보이는 label을 aria-labelledby로 연결하며, label을 클릭하면 toggle이 전환됩니다.
- dirty는 이름이 아니라 상태 설명입니다. 노란 점은 aria-hidden 장식이고 dirtyLabel 문자열은 dirty일 때만 aria-describedby로 붙습니다. 이름이 조작 중에 바뀌지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |
| `SearchableMultiSelect` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<PropertyField label="max_vel" type="number" unit="m/s" value={0.8} onApply={apply} />
<PropertyField label="자동 복구" type="toggle" value={true} onApply={apply} />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-status-cautionary`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-focus-shadow`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--radius-md`
- `--space-0-5`
- `--space-1-5`
- `--space-2`
- `--space-3`

### Source contracts

- `components/forms/PropertyField.jsx`
- `components/forms/PropertyField.d.ts`
- `components/forms/PropertyField.prompt.md`
- `stories/FormPropertyField.stories.jsx`

## Sources

- PropertyField prompt contract: `components/forms/PropertyField.prompt.md`
- Storybook implementation evidence: `stories/FormPropertyField.stories.jsx`
- [Material Design text fields](https://m3.material.io/components/text-fields/overview)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
