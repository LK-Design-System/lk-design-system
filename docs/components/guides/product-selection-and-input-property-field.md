# Property Field

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `PropertyField` |
| Storybook | `LDS Product/Selection and Input/Property Field` |
| Source | `../component-content.json#product-selection-and-input-property-field` |

튜닝 패널처럼 각 속성에 단위·도움말·개별 Apply가 필요한 경우에 적합합니다. 일반 제출형 폼에는 Property Field 대신 FormField와 기본 입력 컴포넌트를 사용하세요.

## 사용 판단

### 사용

- 튜닝 패널처럼 각 속성에 단위·도움말·개별 Apply가 필요한 경우에 적합합니다. 일반 제출형 폼에는 Property Field 대신 FormField와 기본 입력 컴포넌트를 사용하세요.
- Layer: LDS Product Selection and Input extension. It composes existing input, switch, and button behavior for settings panels rather than replacing primitive form fields.
- text/number 입력은 semantic/component input token을 따르고, toggle은 Switch, 적용 액션은 Button을 사용합니다. Apply 핸들러가 없거나 disabled/readOnly면 적용 버튼은 비활성입니다.
- 필드 단위로 즉시 커밋해야 하는 네비게이션 튜닝, 로봇 설정, 런타임 파라미터 패널에 사용합니다. 폼 전체 submit 흐름에는 FormField + Input/Select 조합을 우선합니다.

### 사용하지 않음

- 접근 가능 이름은 보이는 label 하나로 고정합니다. text/number는 네이티브 연결로 이름을 얻으므로 aria-label로 덮어쓰지 않고, label이 ReactNode여도 텍스트를 추출해 범용어로 붕괴하지 않습니다. toggle은 Switch가 자체 로 input을 감싸므로 두 번째 label을 만들지 않고 보이는 label을 aria-labelledby로 연결하며, label을 클릭하면 toggle이 전환됩니다.
- - label(필수 문자열) · hint · value · type number|text|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value). - value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다. - Compare against common property/settings field….
- Property Field가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PropertyField의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Apply Label | applyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Dirty Label | dirtyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `string` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `hint` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `PropertyFieldValue` | No | 커밋된 현재 값. |
| `type` | `PropertyFieldType` | No | 공개 타입 계약에 정의된 속성입니다. |
| `min` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `max` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `step` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `unit` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `readOnly` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `applyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `dirtyLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onApply` | `(value: PropertyFieldValue) = void` | No | 값이 baseline과 달라진 뒤 Apply를 누르면 호출됩니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| readOnly | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 변형·상태 · 비활성 · 읽기 전용과 적용 불가 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- label(필수 문자열) · hint · value · type number|text|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value).
- value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다.
- Compare against common property/settings field expectations before changing it: label and hint, typed value editor, committed vs draft value, dirty indication, explicit apply, disabled/read-only state, keyboard commit/reset, and clear separation from full form submission.
- Layer: LDS Product Selection and Input extension. It composes existing input, switch, and button behavior for settings panels rather than replacing primitive form fields.
- compact input도 LDS focus ring과 AA text role을 유지합니다. hint는 모든 editor에, unit은 text/number editor에 aria-describedby로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WCAG 2.2 Contrast Minimum에 따라 작은 hint/unit 텍스트는 4.5:1을 충족하는 semantic foreground를 사용합니다. |
| 명시 규칙 2 | - Material Design text fields는 label, supporting text, prefix/suffix, focus 상태를 하나의 field anatomy로 연결합니다. PropertyField는 이 중 compact editor·hint·unit만 재사용합니다. - WCAG 2.2 Contrast Minimum에 따라 작은 hint/unit 텍스트는 4.5:1을 충족하는 semantic foreground를 사용합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- compact input도 LDS focus ring과 AA text role을 유지합니다. hint는 모든 editor에, unit은 text/number editor에 aria-describedby로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.
- Material Design text fields는 label, supporting text, prefix/suffix, focus 상태를 하나의 field anatomy로 연결합니다. PropertyField는 이 중 compact editor·hint·unit만 재사용합니다.
- - label(필수 문자열) · hint · value · type number|text|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value). - value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다. - Compare against common property/settings field….
- - Material Design text fields는 label, supporting text, prefix/suffix, focus 상태를 하나의 field anatomy로 연결합니다. PropertyField는 이 중 compact editor·hint·unit만 재사용합니다. - WCAG 2.2 Contrast Minimum에 따라 작은 hint/unit 텍스트는 4.5:1을 충족하는 semantic foreground를 사용합니다.

## Content and writing

- label(필수 문자열) · hint · value · type number|text|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value).
- Compare against common property/settings field expectations before changing it: label and hint, typed value editor, committed vs draft value, dirty indication, explicit apply, disabled/read-only state, keyboard commit/reset, and clear separation from full form submission.
- text/number 입력은 semantic/component input token을 따르고, toggle은 Switch, 적용 액션은 Button을 사용합니다. Apply 핸들러가 없거나 disabled/readOnly면 적용 버튼은 비활성입니다.
- compact input도 LDS focus ring과 AA text role을 유지합니다. hint는 모든 editor에, unit은 text/number editor에 aria-describedby로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.

## Accessibility

- value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다.
- Compare against common property/settings field expectations before changing it: label and hint, typed value editor, committed vs draft value, dirty indication, explicit apply, disabled/read-only state, keyboard commit/reset, and clear separation from full form submission.
- compact input도 LDS focus ring과 AA text role을 유지합니다. hint는 모든 editor에, unit은 text/number editor에 aria-describedby로 연결합니다. toggle의 readOnly는 focus를 유지한 채 변경만 막습니다.
- 접근 가능 이름은 보이는 label 하나로 고정합니다. text/number는 네이티브 연결로 이름을 얻으므로 aria-label로 덮어쓰지 않고, label이 ReactNode여도 텍스트를 추출해 범용어로 붕괴하지 않습니다. toggle은 Switch가 자체 로 input을 감싸므로 두 번째 label을 만들지 않고 보이는 label을 aria-labelledby로 연결하며, label을 클릭하면 toggle이 전환됩니다.
- dirty는 이름이 아니라 상태 설명입니다. 노란 점은 aria-hidden 장식이고 dirtyLabel 문자열은 dirty일 때만 aria-describedby로 붙습니다. 이름이 조작 중에 바뀌지 않습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Layer: LDS Product Selection and Input extension. It composes existing input, switch, and button behavior for settings panels rather than replacing primitive form fields. |
| Don't | 접근 가능 이름은 보이는 label 하나로 고정합니다. text/number는 네이티브 연결로 이름을 얻으므로 aria-label로 덮어쓰지 않고, label이 ReactNode여도 텍스트를 추출해 범용어로 붕괴하지 않습니다. toggle은 Switch가 자체 로 input을 감싸므로 두 번째 label을 만들지 않고 보이는 label을 aria-labelledby로 연결하며, label을 클릭하면 toggle이 전환됩니다. |
| Do | text/number 입력은 semantic/component input token을 따르고, toggle은 Switch, 적용 액션은 Button을 사용합니다. Apply 핸들러가 없거나 disabled/readOnly면 적용 버튼은 비활성입니다. |
| Don't | - label(필수 문자열) · hint · value · type number\|text\|toggle · min/max/step · unit · disabled/readOnly · applyLabel · dirtyLabel · onApply(value). - value는 커밋된 baseline입니다. 내부 draft가 baseline과 달라질 때만 dirty dot과 Apply 활성 상태가 나타납니다. Enter는 적용, Escape는 draft를 baseline으로 되돌립니다. - Compare against common property/settings field…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PropertyField의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--space-2`
- `--space-3`

### Source contracts

- `components/forms/PropertyField.jsx`
- `components/forms/PropertyField.d.ts`
- `components/forms/PropertyField.prompt.md`
- `stories/FormPropertyField.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PropertyField prompt contract: `components/forms/PropertyField.prompt.md`
- Storybook implementation evidence: `stories/FormPropertyField.stories.jsx`
- [Material Design text fields](https://m3.material.io/components/text-fields/overview)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
