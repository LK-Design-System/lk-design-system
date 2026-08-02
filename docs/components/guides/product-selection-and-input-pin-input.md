# Pin Input

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `PinInput` |
| Storybook | `LDS Product/Selection and Input/Pin Input` |
| Source | `../component-content.json#product-selection-and-input-pin-input` |

인증·장치 연결처럼 길이가 고정된 짧은 숫자 코드를 입력할 때 적합합니다. 지속적으로 보관하는 비밀번호나 토큰에는 Pin Input 대신 Password Input 또는 Secret Field를 사용하세요.

## 사용 판단

### 사용

- HTML autofill (one-time-code)의 OTP 토큰을 기본값으로 사용합니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `length` | `number` | No | 박스 수. @default 6 |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No | Incomplete interior cells are serialized as spaces so their positions survive controlled updates. |
| `onComplete` | `(value: string) = void` | No | 모든 박스가 채워지면 발생. |
| `mask` | `boolean` | No | 문자 숨김. @default false |
| `disabled` | `boolean` | No |  |
| `invalid` | `boolean` | No | 모든 cell에 aria-invalid와 오류 테두리를 적용. @default false |
| `charset` | `'numeric' \| 'alphanumeric' \| 'any'` | No | 입력을 허용하는 문자 집합. 허용되지 않는 문자는 타이핑·붙여넣기 모두에서 무시되고 inputMode도 함께 따라갑니다. |
| `autoComplete` | `string` | No | 각 cell에 부여하는 자동 채우기 힌트. 기본값은 iOS/Android의 SMS 코드 자동 채우기를 켜는 one-time-code입니다. |
| `size` | `'sm' \| 'md'` | No |  |
| `style` | `React.CSSProperties` | No |  |

## States

| State | Contract |
| --- | --- |
| invalid | 모든 cell에 aria-invalid와 오류 테두리를 적용. @default false |

## Behavior and interaction

- length — 박스 수. value / defaultValue / onChange — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. onComplete는 공백 없는 완성 문자열로 발생합니다. mask — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다.
- ArrowLeft/ArrowRight로 cell 사이를 이동하고 Home/End로 처음·마지막 cell로 갑니다. Backspace는 빈 cell에서 이전 cell을 지우며 뒤로 갑니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 각 cell은 group aria-label을 위치·전체 자릿수(인증 코드 3/6)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group aria-label 기본값은 인증 코드입니다. |
| 명시 규칙 2 | WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다. |
| 명시 규칙 3 | WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다. |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Accessibility

- invalid — 모든 cell에 aria-invalid와 오류 테두리를 적용해 form 수준 오류를 개별 cell까지 전달합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<PinInput length={6} onComplete={verify} />
<PinInput length={4} mask onChange={setPin} />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-focus-shadow`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--headline1-size`
- `--radius-md`

### Source contracts

- `components/forms/PinInput.jsx`
- `components/forms/PinInput.d.ts`
- `components/forms/PinInput.prompt.md`
- `stories/FormPinInput.stories.jsx`

## Sources

- PinInput prompt contract: `components/forms/PinInput.prompt.md`
- Storybook implementation evidence: `stories/FormPinInput.stories.jsx`
- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [HTML autofill (one-time-code)](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
