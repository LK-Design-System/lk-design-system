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

- 인증·장치 연결처럼 길이가 고정된 짧은 숫자 코드를 입력할 때 적합합니다. 지속적으로 보관하는 비밀번호나 토큰에는 Pin Input 대신 Password Input 또는 Secret Field를 사용하세요.
- HTML autofill (one-time-code)의 OTP 토큰을 기본값으로 사용합니다.
- - WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다. - WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다. - HTML autofill (one-time-code)의 OTP 토큰을 기본값으로 사용합니다.
- Pin Input가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Pin Input가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PinInput의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `length` | `number` | No | 박스 수. @default 6 |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | Incomplete interior cells are serialized as spaces so their positions survive controlled updates. |
| `onComplete` | `(value: string) = void` | No | 모든 박스가 채워지면 발생. |
| `mask` | `boolean` | No | 문자 숨김. @default false |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 모든 cell에 aria-invalid와 오류 테두리를 적용. @default false |
| `charset` | `'numeric' \| 'alphanumeric' \| 'any'` | No | 입력을 허용하는 문자 집합. 허용되지 않는 문자는 타이핑·붙여넣기 모두에서 무시되고 inputMode도 함께 따라갑니다. |
| `autoComplete` | `string` | No | 각 cell에 부여하는 자동 채우기 힌트. 기본값은 iOS/Android의 SMS 코드 자동 채우기를 켜는 one-time-code입니다. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| invalid | 모든 cell에 aria-invalid와 오류 테두리를 적용. @default false 타입 계약: boolean |

## Behavior and interaction

- length — 박스 수. value / defaultValue / onChange — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. onComplete는 공백 없는 완성 문자열로 발생합니다. mask — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다.
- 각 cell은 group aria-label을 위치·전체 자릿수(인증 코드 3/6)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group aria-label 기본값은 인증 코드입니다.
- ArrowLeft/ArrowRight로 cell 사이를 이동하고 Home/End로 처음·마지막 cell로 갑니다. Backspace는 빈 cell에서 이전 cell을 지우며 뒤로 갑니다.
- WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다.
- WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 각 cell은 group aria-label을 위치·전체 자릿수(인증 코드 3/6)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group aria-label 기본값은 인증 코드입니다. |
| 명시 규칙 2 | WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다. |
| 명시 규칙 3 | WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다. |
| 명시 규칙 4 | - length — 박스 수. value / defaultValue / onChange — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. onComplete는 공백 없는 완성 문자열로 발생합니다. mask — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다. - autoComplete — 각 cell의 자동 채우기 힌트이며 기본값은 one-time-code입니다. 이 값이 있어야 iOS/Android가 수신한 SMS 인증 코드… |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 각 cell은 group aria-label을 위치·전체 자릿수(인증 코드 3/6)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group aria-label 기본값은 인증 코드입니다.
- - length — 박스 수. value / defaultValue / onChange — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. onComplete는 공백 없는 완성 문자열로 발생합니다. mask — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다. - autoComplete — 각 cell의 자동 채우기 힌트이며 기본값은 one-time-code입니다. 이 값이 있어야 iOS/Android가 수신한 SMS 인증 코드….
- 사용자에게 보이는 Pin Input 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- invalid — 모든 cell에 aria-invalid와 오류 테두리를 적용해 form 수준 오류를 개별 cell까지 전달합니다.
- 각 cell은 group aria-label을 위치·전체 자릿수(인증 코드 3/6)와 함께 확장하고 실제 focus cell에 LDS focus ring을 표시합니다. group aria-label 기본값은 인증 코드입니다.
- WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다.
- WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다.
- - length — 박스 수. value / defaultValue / onChange — 문자열. 미완성 값의 중간 빈 칸은 공백 문자로 직렬화해 controlled value에서도 위치를 보존합니다. onComplete는 공백 없는 완성 문자열로 발생합니다. mask — 문자 숨김. 자동으로 다음 칸으로 이동하며 Backspace로 뒤로 갑니다. 여러 문자를 붙여넣으면 현재 칸부터 분배합니다. - autoComplete — 각 cell의 자동 채우기 힌트이며 기본값은 one-time-code입니다. 이 값이 있어야 iOS/Android가 수신한 SMS 인증 코드….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | HTML autofill (one-time-code)의 OTP 토큰을 기본값으로 사용합니다. |
| Don't | Pin Input가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - WCAG 2.2 Keyboard에 따라 모든 cell 입력과 붙여넣기를 키보드로 완료할 수 있어야 합니다. - WCAG 2.2 Focus Appearance에 따라 현재 cell과 이미 채워진 cell을 시각적으로 구분합니다. - HTML autofill (one-time-code)의 OTP 토큰을 기본값으로 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PinInput의 범용 API에 넣지 않습니다.
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
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PinInput prompt contract: `components/forms/PinInput.prompt.md`
- Storybook implementation evidence: `stories/FormPinInput.stories.jsx`
- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [HTML autofill (one-time-code)](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
