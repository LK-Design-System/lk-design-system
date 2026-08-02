# Textarea

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Textarea` |
| Storybook | `LDS Core/Components/Selection and Input/Textarea` |
| Source | `../component-content.json#core-components-selection-and-input-textarea` |

검토 메모·설명처럼 줄바꿈과 충분한 작성 공간이 필요한 값에 적합합니다. 이름·검색어처럼 한 줄 값에는 Textarea 대신 Input을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 박스 위에 렌더되는 필드 라벨. |
| helper | 박스 아래 보조 설명. |
| error | 박스 아래 오류 설명. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 박스 위에 렌더되는 필드 라벨. |
| `helper` | `React.ReactNode` | No | 박스 아래 보조 설명. |
| `error` | `React.ReactNode` | No | 박스 아래 오류 설명. |
| `required` | `boolean` | No | 라벨에 레드 별표 추가. @default false |
| `invalid` | `boolean` | No | 검증 오류용 레드 링. @default false |
| `status` | `"normal" \| "positive" \| "negative"` | No | 상태 링과 메시지 톤. @default "normal" |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | 최소 높이 프리셋. @default "md" |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused"` | No |  |
| `active` | `boolean` | No | active visual state alias. |
| `focus` | `boolean` | No | focus visual state alias. |
| `disable` | `boolean` | No |  |
| `resize` | `"normal" \| "fixed" \| "limit"` | No | resize axis. |
| `rows` | `number` | No | 처음 보이는 줄 수. @default 5 |
| `style` | `React.CSSProperties` | No | 래퍼 스타일. |
| `className` | `string` | No | Public root class. |
| `textareaClassName` | `string` | No | Native textarea class. |
| `textareaStyle` | `React.CSSProperties` | No | Native textarea style. |
| `rootRef` | `React.Ref` | No | Public root ref; the default ref targets the native textarea. |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| error | 박스 아래 오류 설명. |
| invalid | 검증 오류용 레드 링. @default false |
| status | 상태 링과 메시지 톤. @default "normal" |
| active | active visual state alias. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --component-input-stack-gap | var(--space-2) |
| --space-10 | 40px |

## Content and writing

- ref points to the native textarea; use rootRef for the field stack.
- className and style customize the public root. Use textareaClassName and textareaStyle for the native control.
- Stable parts are root, label, control, textarea, statusIcon, and message. Geometry overrides are limited to the documented --lds-textarea- variables.
- Reference basis: GOV.UK Textarea and Carbon Text area.

## Accessibility

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.

## Related components

| Component | Relationship |
| --- | --- |
| `AutoComplete` | 대표 시나리오에서 조합 |
| `Combobox` | 대표 시나리오에서 조합 |
| `FormField` | 대표 시나리오에서 조합 |
| `Input` | 대표 시나리오에서 조합 |
| `SearchField` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `TagInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Textarea label="문의 내용" required rows={5} placeholder="문의하실 내용을 입력해 주세요." />
```

## Tokens and API

### Tokens

- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-radius`
- `--component-input-stack-gap`
- `--component-input-text-color`
- `--dur-base`
- `--ease-out`
- `--font-sans`
- `--lds-textarea-max-height`
- `--lds-textarea-min-height`
- `--lds-textarea-padding`
- `--lds-textarea-radius`
- `--space-10`
- `--space-3`

### Source contracts

- `components/forms/Textarea.jsx`
- `components/forms/Textarea.d.ts`
- `components/forms/Textarea.prompt.md`
- `stories/FormTextarea.stories.jsx`

## Sources

- Textarea prompt contract: `components/forms/Textarea.prompt.md`
- Storybook implementation evidence: `stories/FormTextarea.stories.jsx`
- [GOV.UK Textarea](https://design-system.service.gov.uk/components/textarea/)
- [Carbon Text area](https://carbondesignsystem.com/components/text-area/usage/)
