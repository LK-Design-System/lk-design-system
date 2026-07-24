# Password Input

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `PasswordInput` |
| Storybook | `LDS Product/Selection and Input/Password Input` |
| Source | `../component-content.json#product-selection-and-input-password-input` |

사용자가 직접 비밀번호를 작성하는 로그인과 계정 설정에 사용하세요. 이미 발급된 비밀값을 읽거나 복사하는 화면은 Secret Field가 더 적합합니다.

## 사용 판단

### 사용

- 사용자가 직접 비밀번호를 작성하는 로그인과 계정 설정에 사용하세요. 이미 발급된 비밀값을 읽거나 복사하는 화면은 Secret Field가 더 적합합니다.
- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- - The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. - Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input. - 입력 목….
- Password Input가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- autoComplete — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 current-password입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 new-password를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. off를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다.
- - autoComplete — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 current-password입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 new-password를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. off를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다.
- Password Input가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | PasswordInput의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Reveal Label | revealLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Hide Label | hideLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Caps Lock Label | Caps Lock warning shown while the field has focus. Pass '' to suppress the warning entirely. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `helper` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `status` | `'normal' \| 'positive' \| 'negative'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `revealLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `hideLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `autoComplete` | `string` | No | Browser autofill hint for the password field. Keep the default on sign-in forms; pass "new-password" on sign-up / change-password forms so the password manager offers a generated value instead of the stored one. |
| `capsLockLabel` | `string` | No | Caps Lock warning shown while the field has focus. Pass '' to suppress the warning entirely. |
| `fieldStyle` | `React.CSSProperties` | No | Styles for the label/control/message stack. |
| `style` | `React.CSSProperties` | No | Styles for the input control shell. |

## States

| State | Contract |
| --- | --- |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| invalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| status | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'normal' \| 'positive' \| 'negative' |

## Behavior and interaction

- 필드가 소속된 이 제출되면 표시 상태를 자동으로 마스킹으로 되돌립니다. 토글을 누른 뒤 그대로 제출해도 평문이 화면에 남지 않습니다.
- Caps Lock이 켜진 채로 입력하면 focus 중에만 주의 문구가 나타나고, 상시 마운트된 polite live region이 같은 문구를 읽습니다.
- value / defaultValue / onChange — 제어/비제어. size sm · md.
- 필드·상태 prop: label(필드 레이블) · status(normal/positive/negative) · invalid(오류 강조 토글) · fieldStyle(전체 필드 컨테이너 스타일) · revealLabel/hideLabel(비밀번호 표시·숨김 토글 버튼의 스크린리더 레이블).
- capsLockLabel — Caps Lock이 켜진 상태에서 focus 중에 노출되는 주의 문구이자 live region 문장. 기본값은 Caps Lock이 켜져 있습니다.이고, 빈 문자열을 넘기면 경고를 끕니다. 값이 비어 있지 않은 한 문구는 필드가 focus를 잃으면 사라집니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. |
| 명시 규칙 2 | Reference basis: Carbon Text input, GOV.UK Text input, GOV.UK Password input, WCAG 2.2 Identify Input Purpose. |
| 명시 규칙 3 | - The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. - Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input. - 입력 목… |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well.
- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- Caps Lock이 켜진 채로 입력하면 focus 중에만 주의 문구가 나타나고, 상시 마운트된 polite live region이 같은 문구를 읽습니다.
- Reference basis: Carbon Text input, GOV.UK Text input, GOV.UK Password input, WCAG 2.2 Identify Input Purpose.

## Accessibility

- The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well.
- Caps Lock이 켜진 채로 입력하면 focus 중에만 주의 문구가 나타나고, 상시 마운트된 polite live region이 같은 문구를 읽습니다.
- Reference basis: Carbon Text input, GOV.UK Text input, GOV.UK Password input, WCAG 2.2 Identify Input Purpose.
- capsLockLabel — Caps Lock이 켜진 상태에서 focus 중에 노출되는 주의 문구이자 live region 문장. 기본값은 Caps Lock이 켜져 있습니다.이고, 빈 문자열을 넘기면 경고를 끕니다. 값이 비어 있지 않은 한 문구는 필드가 focus를 잃으면 사라집니다.
- - The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. - Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input. - 입력 목….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input. |
| Don't | autoComplete — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 current-password입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 new-password를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. off를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다. |
| Do | - The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. - Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input. - 입력 목…. |
| Don't | - autoComplete — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 current-password입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 new-password를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. off를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 PasswordInput의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `InputGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<PasswordInput onChange={setPw} />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-disable`
- `--color-semantic-status-cautionary-text`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-gap`
- `--component-input-height`
- `--component-input-letter-spacing`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`

### Source contracts

- `components/forms/PasswordInput.jsx`
- `components/forms/PasswordInput.d.ts`
- `components/forms/PasswordInput.prompt.md`
- `stories/FormPasswordInput.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- PasswordInput prompt contract: `components/forms/PasswordInput.prompt.md`
- Storybook implementation evidence: `stories/FormPasswordInput.stories.jsx`
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/)
- [WCAG 2.2 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
