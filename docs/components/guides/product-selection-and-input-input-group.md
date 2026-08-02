# Input Group

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `InputGroup` |
| Storybook | `LDS Product/Selection and Input/Input Group` |
| Source | `../component-content.json#product-selection-and-input-input-group` |

통화, 단위, 프로토콜처럼 사용자가 바꾸지 않는 문맥이 값 해석에 필수적일 때 적합합니다. 단순한 안내 텍스트는 이 컴포넌트 대신 Input 설명으로 제공하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `prefix` | `React.ReactNode` | No |  |
| `suffix` | `React.ReactNode` | No |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `label` | `React.ReactNode` | No |  |
| `helper` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `invalid` | `boolean` | No |  |
| `status` | `'normal' \| 'positive' \| 'negative'` | No |  |
| `required` | `boolean` | No |  |
| `placeholder` | `string` | No |  |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No |  |
| `disabled` | `boolean` | No |  |
| `readOnly` | `boolean` | No |  |
| `inputProps` | `React.InputHTMLAttributes` | No |  |
| `fieldStyle` | `React.CSSProperties` | No | Styles for the label/control/message stack. |
| `style` | `React.CSSProperties` | No | Styles for the grouped control shell. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --fw-semibold | 600 |

## Content and writing

- Reference basis: GOV.UK Text input prefixes and suffixes and Carbon Text input.
- 필드·상태 prop: status(normal/positive/negative) · invalid(오류 강조 토글) · fieldStyle(label·helper·error를 포함한 전체 필드 컨테이너 스타일).

## Accessibility

- 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다.
- 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 aria-hidden 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 aria-hidden을 겁니다(레포의 Icon은 이름을 주지 않으면 스스로 숨깁니다).
- readOnly remains focusable and selectable. Consumer and generated description ids are merged on the input.
- prefix / suffix — 애드온 노드. value / defaultValue / onChange — 텍스트. inputProps — 네이티브 input 패스스루. inputProps.onChange/onFocus/onBlur는 폐기되지 않고 컴포넌트 내부 처리보다 먼저 호출됩니다(값 커밋은 그대로 이어집니다). inputProps['aria-describedby']는 생성된 설명 id와 병합됩니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PasswordInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<InputGroup prefix="ID" suffix="개" placeholder="12" />
<InputGroup suffix="%" defaultValue="72" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--component-input-border-color`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--space-2`

### Source contracts

- `components/forms/InputGroup.jsx`
- `components/forms/InputGroup.d.ts`
- `components/forms/InputGroup.prompt.md`
- `stories/FormInputGroup.stories.jsx`

## Sources

- InputGroup prompt contract: `components/forms/InputGroup.prompt.md`
- Storybook implementation evidence: `stories/FormInputGroup.stories.jsx`
- [GOV.UK Text input prefixes and suffixes](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes)
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
