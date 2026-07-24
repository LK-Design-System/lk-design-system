# Input

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Input` |
| Storybook | `LDS Core/Components/Selection and Input/Input` |
| Source | `../component-content.json#core-components-selection-and-input-input` |

이름·검색어·코드처럼 한 줄로 끝나는 텍스트를 입력할 때 적합합니다. 긴 문장은 Textarea를, 민감한 비밀번호는 Password Input을, 단위가 결합된 값은 Input Group을 사용하세요.

## 사용 판단

### 사용

- 이름·검색어·코드처럼 한 줄로 끝나는 텍스트를 입력할 때 적합합니다. 긴 문장은 Textarea를, 민감한 비밀번호는 Password Input을, 단위가 결합된 값은 Input Group을 사용하세요.
- Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced.
- Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role.
- readOnly remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.

### 사용하지 않음

- Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale.
- Keep essential instructions in the visible label or helper text. Placeholder text is supplementary and must not replace the label.
- - Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. - Keep essential instructions in the visib….
- Input가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Input의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 박스 위에 렌더되는 필드 라벨. |
| Helper | 박스 아래 보조 설명. |
| Error | 박스 아래 오류 설명. invalid와 같은 시각 상태를 적용. |
| Icon Left | 박스 안 텍스트 왼쪽에 표시되는 인라인 SVG. |
| Icon Right | 박스 안 텍스트 오른쪽에 표시되는 인라인 SVG. |
| Leading Icon | leading icon alias. |
| Trailing Icon | trailing icon alias. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 박스 위에 렌더되는 필드 라벨. |
| `helper` | `React.ReactNode` | No | 박스 아래 보조 설명. |
| `error` | `React.ReactNode` | No | 박스 아래 오류 설명. invalid와 같은 시각 상태를 적용. |
| `iconLeft` | `React.ReactNode` | No | 박스 안 텍스트 왼쪽에 표시되는 인라인 SVG. |
| `iconRight` | `React.ReactNode` | No | 박스 안 텍스트 오른쪽에 표시되는 인라인 SVG. |
| `leadingIcon` | `React.ReactNode` | No | leading icon alias. |
| `trailingIcon` | `React.ReactNode` | No | trailing icon alias. |
| `actionRight` | `React.ReactNode` | No | 우측 끝에 표시되는 액션 슬롯. |
| `trailingButton` | `React.ReactNode` | No | trailing action alias. |
| `invalid` | `boolean` | No | 검증 오류용 레드 링. @default false |
| `required` | `boolean` | No | 라벨에 레드 별표 추가. @default false |
| `status` | `"normal" \| "positive" \| "negative"` | No | 상태 링과 메시지 톤. @default "normal" |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | 입력 높이 프리셋. @default "md" |
| `height` | `number \| string` | No | 프리셋 대신 사용할 명시적 높이. |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused"` | No | 공개 타입 계약에 정의된 속성입니다. |
| `active` | `boolean` | No | active visual state alias. |
| `focus` | `boolean` | No | focus visual state alias. |
| `disable` | `boolean` | No | disabled alias. |
| `resize` | `"normal" \| "fixed" \| "limit"` | No | textinput resize evidence axis; accepted for API parity. |
| `platform` | `"ios" \| "android" \| "web"` | No | platform evidence axis; accepted for API parity. |
| `variant` | `"textfield" \| "textarea"` | No | field variant evidence axis; accepted for API parity. |
| `style` | `React.CSSProperties` | No | 래퍼 스타일(예: 그리드 셀용 minWidth). |

## States

| State | Contract |
| --- | --- |
| error | 박스 아래 오류 설명. invalid와 같은 시각 상태를 적용. 타입 계약: React.ReactNode |
| invalid | 검증 오류용 레드 링. @default false 타입 계약: boolean |
| status | 상태 링과 메시지 톤. @default "normal" 타입 계약: "normal" \| "positive" \| "negative" |
| interaction | 공개 타입 계약에 정의된 속성입니다. 타입 계약: "normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused" |
| active | active visual state alias. 타입 계약: boolean |
| variant | field variant evidence axis; accepted for API parity. 타입 계약: "textfield" \| "textarea" |

## Behavior and interaction

- readOnly remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.
- Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale.
- - Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced. - Label, text, icon, fill, and disabled colors resolve semantic roles at the re….
- - Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. - Keep essential instructions in the visib….
- Input — 한 줄 텍스트 필드: 화이트 박스, 헤어라인 링, 그래파이트 포커스 헤일로. label, 선택적 iconLeft/iconRight, required, invalid를 전달하세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role. |
| 명시 규칙 2 | Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. |
| 명시 규칙 3 | - Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced. - Label, text, icon, fill, and disabled colors resolve semantic roles at the re… |
| 명시 규칙 4 | - Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. - Keep essential instructions in the visib… |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Responsive

- Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale.
- - Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. - Keep essential instructions in the visib….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced.
- Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role.
- readOnly remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.
- Reference basis: GOV.UK Text input for visible labels, hints and error association; Carbon Text input for label/helper/error/read-only anatomy.

## Accessibility

- Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced.
- readOnly remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.
- - Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced. - Label, text, icon, fill, and disabled colors resolve semantic roles at the re….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced. |
| Don't | Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. |
| Do | Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role. |
| Don't | Keep essential instructions in the visible label or helper text. Placeholder text is supplementary and must not replace the label. |

## Exceptions

- WDS Core examples retain the source sentence form (…해 주세요.) for placeholder parity. This intentionally differs from Fluent's no-period placeholder copy rule; Product/Robotics may use a short domain hint only when the visible label remains sufficient.
- - Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. - Keep essential instructions in the visib….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Input의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AutoComplete` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Combobox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FormField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SearchField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Select` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TagInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Textarea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Input label="이메일" required iconLeft={mailIcon} placeholder="you@company.com" />
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-gap`
- `--component-input-height`
- `--component-input-letter-spacing`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-stack-gap`
- `--control-h-lg`
- `--control-h-sm`
- `--dur-base`
- `--ease-out`
- `--font-sans`

### Source contracts

- `components/forms/Input.jsx`
- `components/forms/Input.d.ts`
- `components/forms/Input.prompt.md`
- `stories/FormInput.stories.jsx`

## Migration

- Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role.
- - Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced. - Label, text, icon, fill, and disabled colors resolve semantic roles at the re….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Input prompt contract: `components/forms/Input.prompt.md`
- Storybook implementation evidence: `stories/FormInput.stories.jsx`
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
- [Fluent 2 Field](https://fluent2.microsoft.design/components/web/react/core/field/usage)
- [SEED Input benchmark](https://seed-design.io/components/text-input)
