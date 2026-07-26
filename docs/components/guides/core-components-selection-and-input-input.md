# Input

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Input` |
| Storybook | `LDS Core/Components/Selection and Input/Input` |
| Source | `../component-content.json#core-components-selection-and-input-input` |

이름·검색어·코드처럼 한 줄로 끝나는 텍스트를 입력할 때 적합합니다. 긴 문장은 Textarea를, 민감한 비밀번호는 Password Input을, 단위가 결합된 값은 Input Group을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 박스 위에 렌더되는 필드 라벨. |
| helper | 박스 아래 보조 설명. |
| error | 박스 아래 오류 설명. invalid와 같은 시각 상태를 적용. |
| iconLeft | 박스 안 텍스트 왼쪽에 표시되는 인라인 SVG. |
| iconRight | 박스 안 텍스트 오른쪽에 표시되는 인라인 SVG. |
| leadingIcon | leading icon alias. |
| trailingIcon | trailing icon alias. |

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
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused"` | No |  |
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
| error | 박스 아래 오류 설명. invalid와 같은 시각 상태를 적용. |
| invalid | 검증 오류용 레드 링. @default false |
| status | 상태 링과 메시지 톤. @default "normal" |
| active | active visual state alias. |
| variant | field variant evidence axis; accepted for API parity. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Label, text, icon, fill, and disabled colors resolve semantic roles at the rendered field scope. This keeps nested dark-theme fields from inheriting light values computed by root-level component aliases; disabled labels and values use the shared 0.52-alpha disabled role. |
| 명시 규칙 2 | Input, Select, AutoComplete, Combobox, PasswordInput, SearchField, InputGroup, NumberField, TimePicker, and DatePicker share --control-h-sm, --component-input-height, --component-input-padding-x, and --component-input-font-size. Do not introduce a local 40/50px field scale. |
| 명시 규칙 3 | References: Fluent 2 Field, local WDS input evidence under docs/references/wds/. |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |

## Content and writing

- Reference basis: GOV.UK Text input for visible labels, hints and error association; Carbon Text input for label/helper/error/read-only anatomy.
- Keep essential instructions in the visible label or helper text. Placeholder text is supplementary and must not replace the label.
- WDS Core examples retain the source sentence form (…해 주세요.) for placeholder parity. This intentionally differs from Fluent's no-period placeholder copy rule; Product/Robotics may use a short domain hint only when the visible label remains sufficient.
- Input — 한 줄 텍스트 필드: 화이트 박스, 헤어라인 링, 그래파이트 포커스 헤일로. label, 선택적 iconLeft/iconRight, required, invalid를 전달하세요.

## Accessibility

- Field anatomy is consistently label - control - helper/error; labels use the shared input-label tokens and messages use caption typography. Consumer aria-describedby ids are merged with the generated helper/error id rather than replaced.
- readOnly remains focusable and selectable, uses the alternative field fill, and suppresses editable hover affordance. Positive and negative states use the shared status icon as well as border/message color; color is never the only signal.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `AutoComplete` | 대표 시나리오에서 조합 |
| `Combobox` | 대표 시나리오에서 조합 |
| `FormField` | 대표 시나리오에서 조합 |
| `SearchField` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `TagInput` | 대표 시나리오에서 조합 |
| `Textarea` | 대표 시나리오에서 조합 |

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

## Sources

- Input prompt contract: `components/forms/Input.prompt.md`
- Storybook implementation evidence: `stories/FormInput.stories.jsx`
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
- [Fluent 2 Field](https://fluent2.microsoft.design/components/web/react/core/field/usage)
