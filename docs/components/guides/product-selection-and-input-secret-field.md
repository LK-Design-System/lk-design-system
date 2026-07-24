# Secret Field

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `SecretField` |
| Storybook | `LDS Product/Selection and Input/Secret Field` |
| Source | `../component-content.json#product-selection-and-input-secret-field` |

API key·token처럼 읽기 전용 값을 잠시 표시하고 복사한 뒤 다시 숨길 때 적합합니다. 사용자가 새 비밀번호를 입력하거나 수정하는 폼에는 Secret Field 대신 Password Input을 사용하세요.

## 사용 판단

### 사용

- API key·token처럼 읽기 전용 값을 잠시 표시하고 복사한 뒤 다시 숨길 때 적합합니다. 사용자가 새 비밀번호를 입력하거나 수정하는 폼에는 Secret Field 대신 Password Input을 사용하세요.
- 일반 로그인 비밀번호를 입력·편집할 때는 PasswordInput을 사용합니다. SecretField는 이미 발급된 token, key, secret을 읽고 복사하는 표시 패턴이며 항상 native readOnly입니다.
- reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 Access token 보기, Access token 복사가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 actionContext를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 actionContext={false}로 자동 prefix를 끌 수 있습니다.
- helper, error, invalid, size, unique id, focus/disabled styling은 LDS Input 계약을 그대로 사용합니다. disabled input과 action은 Tab 순서에서 빠지고, 활성 상태의 read-only input은 focus와 text selection을 유지합니다.

### 사용하지 않음

- reveal action은 현재 동작을 보기/숨기기라는 이름으로 직접 설명하므로 별도의 aria-pressed 상태를 중복하지 않습니다. copy action은 copyLabel, copiedLabel, copyErrorLabel을 실제 button name과 live feedback에 함께 사용합니다.
- 실제 재인증, 권한 검사, clipboard 허용 안내, audit log, token rotation은 앱이 처리하며 design-system layer에 포함하지 않습니다.
- IconButton: 32px plain trailing action과 표준 eye/copy/check/close icon을 사용합니다. copy 성공/실패 icon에만 LDS positive/negative 의미색을 적용하며 별도 action divider, nested card, 고유 shadow나 색상 surface를 추가하지 않습니다.
- WAI-ARIA Button pattern에 따라 동작 이름이 상태에 맞춰 바뀌는 command button과 이름을 유지하는 aria-pressed toggle을 혼합하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SecretField의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action Context | Accessible context prefixed to reveal/copy action names. Required to distinguish complex ReactNode labels; pass false when action label props already contain their complete accessible names. |
| On Copy Error | onCopyError 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Reveal Label | Action text. The visible field label is added to the accessible button name. |
| Hide Label | Action text. The visible field label is added to the accessible button name. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | Matches the underlying LDS Input size axis. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `helper` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `actionContext` | `string \| false` | No | Accessible context prefixed to reveal/copy action names. Required to distinguish complex ReactNode labels; pass false when action label props already contain their complete accessible names. |
| `revealable` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `copyable` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `revealDurationMs` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `revealed` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultRevealed` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onRevealChange` | `(revealed: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onCopy` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onCopyError` | `(error: unknown) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `revealLabel` | `string` | No | Action text. The visible field label is added to the accessible button name. |
| `hideLabel` | `string` | No | Action text. The visible field label is added to the accessible button name. |
| `copyLabel` | `string` | No | Action text. The visible field label is added to the accessible button name. |
| `copiedLabel` | `string` | No | Success text used by both the button name and live feedback. |
| `copyErrorLabel` | `string` | No | Failure text used by both the button name and live feedback. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| invalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| onCopyError | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (error: unknown) = void |
| copyErrorLabel | Failure text used by both the button name and live feedback. 타입 계약: string |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| 변형·상태 · 비활성과 값 표시 정책 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 외부 제어 값 자동 숨김 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭의 오류와 구분된 동작 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 기본 reveal은 10초 뒤 자동으로 닫힙니다. revealed를 외부에서 제어해도 같은 timer가 동작하고 onRevealChange(false)로 닫기를 요청합니다. revealable=false, disabled, 빈 값으로 바뀌면 즉시 masked 상태로 돌아가므로 숨김 기능이 사라진 채 평문이 남지 않습니다.
- Clipboard write가 성공한 경우에만 onCopy와 positive icon/복사됨 상태를 내보냅니다. 실패는 onCopyError, negative icon, copyErrorLabel로 별도 전달합니다. 값이 바뀌거나 field가 disabled되면 이전 copy feedback을 초기화합니다.
- reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 Access token 보기, Access token 복사가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 actionContext를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 actionContext={false}로 자동 prefix를 끌 수 있습니다.
- reveal action은 현재 동작을 보기/숨기기라는 이름으로 직접 설명하므로 별도의 aria-pressed 상태를 중복하지 않습니다. copy action은 copyLabel, copiedLabel, copyErrorLabel을 실제 button name과 live feedback에 함께 사용합니다.
- helper, error, invalid, size, unique id, focus/disabled styling은 LDS Input 계약을 그대로 사용합니다. disabled input과 action은 Tab 순서에서 빠지고, 활성 상태의 read-only input은 focus와 text selection을 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 기본 reveal은 10초 뒤 자동으로 닫힙니다. revealed를 외부에서 제어해도 같은 timer가 동작하고 onRevealChange(false)로 닫기를 요청합니다. revealable=false, disabled, 빈 값으로 바뀌면 즉시 masked 상태로 돌아가므로 숨김 기능이 사라진 채 평문이 남지 않습니다. |
| 명시 규칙 2 | IconButton: 32px plain trailing action과 표준 eye/copy/check/close icon을 사용합니다. copy 성공/실패 icon에만 LDS positive/negative 의미색을 적용하며 별도 action divider, nested card, 고유 shadow나 색상 surface를 추가하지 않습니다. |
| 명시 규칙 3 | - 일반 로그인 비밀번호를 입력·편집할 때는 PasswordInput을 사용합니다. SecretField는 이미 발급된 token, key, secret을 읽고 복사하는 표시 패턴이며 항상 native readOnly입니다. - 기본 reveal은 10초 뒤 자동으로 닫힙니다. revealed를 외부에서 제어해도 같은 timer가 동작하고 onRevealChange(false)로 닫기를 요청합니다. revealable=false, disabled, 빈 값으로 바뀌면 즉시 masked 상태로 돌아가므로 숨김 기능이 사라진 채 평문이 남지 않습니다. - Clipboar… |
| 명시 규칙 4 | - Input/FormField: label, helper/error, invalid border, size, disabled surface와 focus ring을 그대로 사용합니다. - PasswordInput: hidden-by-default와 명시적인 show/hide action은 공유하지만, editable value state와 login/autofill 책임은 가져오지 않습니다. - IconButton: 32px plain trailing action과 표준 eye/copy/check/close icon을 사용합니다. copy 성공/실패 icon에만 L… |
| --color-semantic-status-negative | light: #EE5656; dark: #F16F6F |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Clipboard write가 성공한 경우에만 onCopy와 positive icon/복사됨 상태를 내보냅니다. 실패는 onCopyError, negative icon, copyErrorLabel로 별도 전달합니다. 값이 바뀌거나 field가 disabled되면 이전 copy feedback을 초기화합니다.
- reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 Access token 보기, Access token 복사가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 actionContext를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 actionContext={false}로 자동 prefix를 끌 수 있습니다.
- reveal action은 현재 동작을 보기/숨기기라는 이름으로 직접 설명하므로 별도의 aria-pressed 상태를 중복하지 않습니다. copy action은 copyLabel, copiedLabel, copyErrorLabel을 실제 button name과 live feedback에 함께 사용합니다.
- helper, error, invalid, size, unique id, focus/disabled styling은 LDS Input 계약을 그대로 사용합니다. disabled input과 action은 Tab 순서에서 빠지고, 활성 상태의 read-only input은 focus와 text selection을 유지합니다.

## Accessibility

- reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 Access token 보기, Access token 복사가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 actionContext를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 actionContext={false}로 자동 prefix를 끌 수 있습니다.
- reveal action은 현재 동작을 보기/숨기기라는 이름으로 직접 설명하므로 별도의 aria-pressed 상태를 중복하지 않습니다. copy action은 copyLabel, copiedLabel, copyErrorLabel을 실제 button name과 live feedback에 함께 사용합니다.
- helper, error, invalid, size, unique id, focus/disabled styling은 LDS Input 계약을 그대로 사용합니다. disabled input과 action은 Tab 순서에서 빠지고, 활성 상태의 read-only input은 focus와 text selection을 유지합니다.
- Input/FormField: label, helper/error, invalid border, size, disabled surface와 focus ring을 그대로 사용합니다.
- Carbon Text input usage의 error·disabled·read-only 구분을 적용했습니다. disabled는 상호작용을 막고 read-only는 값을 읽고 focus할 수 있어야 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 일반 로그인 비밀번호를 입력·편집할 때는 PasswordInput을 사용합니다. SecretField는 이미 발급된 token, key, secret을 읽고 복사하는 표시 패턴이며 항상 native readOnly입니다. |
| Don't | reveal action은 현재 동작을 보기/숨기기라는 이름으로 직접 설명하므로 별도의 aria-pressed 상태를 중복하지 않습니다. copy action은 copyLabel, copiedLabel, copyErrorLabel을 실제 button name과 live feedback에 함께 사용합니다. |
| Do | reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 Access token 보기, Access token 복사가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 actionContext를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 actionContext={false}로 자동 prefix를 끌 수 있습니다. |
| Don't | 실제 재인증, 권한 검사, clipboard 허용 안내, audit log, token rotation은 앱이 처리하며 design-system layer에 포함하지 않습니다. |

## Exceptions

- Clipboard write가 성공한 경우에만 onCopy와 positive icon/복사됨 상태를 내보냅니다. 실패는 onCopyError, negative icon, copyErrorLabel로 별도 전달합니다. 값이 바뀌거나 field가 disabled되면 이전 copy feedback을 초기화합니다.
- - 일반 로그인 비밀번호를 입력·편집할 때는 PasswordInput을 사용합니다. SecretField는 이미 발급된 token, key, secret을 읽고 복사하는 표시 패턴이며 항상 native readOnly입니다. - 기본 reveal은 10초 뒤 자동으로 닫힙니다. revealed를 외부에서 제어해도 같은 timer가 동작하고 onRevealChange(false)로 닫기를 요청합니다. revealable=false, disabled, 빈 값으로 바뀌면 즉시 masked 상태로 돌아가므로 숨김 기능이 사라진 채 평문이 남지 않습니다. - Clipboar….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SecretField의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
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
<SecretField
  label="Access token"
  value={token}
  revealDurationMs={10000}
  onCopy={recordCopyAudit}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--space-0`
- `--space-1`

### Source contracts

- `components/forms/SecretField.jsx`
- `components/forms/SecretField.d.ts`
- `components/forms/SecretField.prompt.md`
- `stories/FormSecretField.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- SecretField prompt contract: `components/forms/SecretField.prompt.md`
- Storybook implementation evidence: `stories/FormSecretField.stories.jsx`
- [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/)
- [Carbon Text input usage](https://carbondesignsystem.com/components/text-input/usage/)
- [Carbon Text input accessibility](https://carbondesignsystem.com/components/text-input/accessibility/)
- [PatternFly Clipboard copy accessibility](https://v5-archive.patternfly.org/components/clipboard-copy/accessibility)
- [WAI-ARIA Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
