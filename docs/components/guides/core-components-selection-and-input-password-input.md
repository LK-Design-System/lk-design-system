# Password Input

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `PasswordInput` |
| Storybook | `LDS Core/Components/Selection and Input/Password Input` |
| Source | `../component-content.json#core-components-selection-and-input-password-input` |

사용자가 직접 비밀번호를 작성하는 로그인과 계정 설정에 사용하세요. 이미 발급된 비밀값을 읽거나 복사하는 화면은 Secret Field가 더 적합합니다.

## 사용 판단

### 사용하지 않음

- autoComplete — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 current-password입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 new-password를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. off를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| capsLockLabel | Caps Lock warning shown while the field has focus. Pass '' to suppress the warning entirely. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `label` | `React.ReactNode` | No |  |
| `helper` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `invalid` | `boolean` | No |  |
| `status` | `'normal' \| 'positive' \| 'negative'` | No |  |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No |  |
| `revealLabel` | `string` | No |  |
| `hideLabel` | `string` | No |  |
| `autoComplete` | `string` | No | Browser autofill hint for the password field. Keep the default on sign-in forms; pass "new-password" on sign-up / change-password forms so the password manager offers a generated value instead of the stored one. |
| `capsLockLabel` | `string` | No | Caps Lock warning shown while the field has focus. Pass '' to suppress the warning entirely. |
| `fieldStyle` | `React.CSSProperties` | No | Styles for the label/control/message stack. |
| `style` | `React.CSSProperties` | No | Styles for the input control shell. |

## Behavior and interaction

- 필드가 소속된 이 제출되면 표시 상태를 자동으로 마스킹으로 되돌립니다. 토글을 누른 뒤 그대로 제출해도 평문이 화면에 남지 않습니다.
- value / defaultValue / onChange — 제어/비제어. size sm · md.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | The reveal button is a real 32px icon button with a contextual name (비밀번호 보기 / 비밀번호 숨기기) and aria-controls; its icon describes the next action. A disabled field disables the trailing action as well. |
| 명시 규칙 2 | Reference basis: Carbon Text input, GOV.UK Text input, GOV.UK Password input, WCAG 2.2 Identify Input Purpose. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Content and writing

- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- 필드·상태 prop: label(필드 레이블) · status(normal/positive/negative) · invalid(오류 강조 토글) · fieldStyle(전체 필드 컨테이너 스타일) · revealLabel/hideLabel(비밀번호 표시·숨김 토글 버튼의 스크린리더 레이블).

## Accessibility

- Caps Lock이 켜진 채로 입력하면 focus 중에만 주의 문구가 나타나고, 상시 마운트된 polite live region이 같은 문구를 읽습니다.
- capsLockLabel — Caps Lock이 켜진 상태에서 focus 중에 노출되는 주의 문구이자 live region 문장. 기본값은 Caps Lock이 켜져 있습니다.이고, 빈 문자열을 넘기면 경고를 끕니다. 값이 비어 있지 않은 한 문구는 필드가 focus를 잃으면 사라집니다.

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
- `--component-input-gap`
- `--component-input-height`
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

## Sources

- PasswordInput prompt contract: `components/forms/PasswordInput.prompt.md`
- Storybook implementation evidence: `stories/FormPasswordInput.stories.jsx`
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/)
- [WCAG 2.2 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
