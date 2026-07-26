**SecretField**는 credential 값을 제한적으로 reveal하고 복사하는 읽기 전용 **LK Product Extension**입니다.

```jsx
<SecretField
  label="Access token"
  value={token}
  revealDurationMs={10000}
  onCopy={recordCopyAudit}
/>
```

- 일반 로그인 비밀번호를 입력·편집할 때는 `PasswordInput`을 사용합니다. `SecretField`는 이미 발급된 token, key, secret을 읽고 복사하는 표시 패턴이며 항상 native `readOnly`입니다.
- 기본 reveal은 10초 뒤 자동으로 닫힙니다. `revealed`를 외부에서 제어해도 같은 timer가 동작하고 `onRevealChange(false)`로 닫기를 요청합니다. `revealable=false`, `disabled`, 빈 값으로 바뀌면 즉시 masked 상태로 돌아가므로 숨김 기능이 사라진 채 평문이 남지 않습니다.
- Clipboard write가 성공한 경우에만 `onCopy`와 positive icon/`복사됨` 상태를 내보냅니다. 실패는 `onCopyError`, negative icon, `copyErrorLabel`로 별도 전달합니다. 값이 바뀌거나 field가 disabled되면 이전 copy feedback을 초기화합니다.
- reveal/copy action은 현재 field label을 accessible name에 포함합니다. 예를 들어 `Access token 보기`, `Access token 복사`가 되어 같은 화면의 여러 secret action을 구분할 수 있습니다. 복합 ReactNode label에는 구분 가능한 문자열 `actionContext`를 반드시 제공합니다. action label props에 이미 완성된 accessible name을 전달한다면 `actionContext={false}`로 자동 prefix를 끌 수 있습니다.
- reveal action은 현재 동작을 `보기/숨기기`라는 이름으로 직접 설명하므로 별도의 `aria-pressed` 상태를 중복하지 않습니다. copy action은 `copyLabel`, `copiedLabel`, `copyErrorLabel`을 실제 button name과 live feedback에 함께 사용합니다.
- `helper`, `error`, `invalid`, `size`, unique `id`, focus/disabled styling은 LDS `Input` 계약을 그대로 사용합니다. disabled input과 action은 Tab 순서에서 빠지고, 활성 상태의 read-only input은 focus와 text selection을 유지합니다.
- 실제 재인증, 권한 검사, clipboard 허용 안내, audit log, token rotation은 앱이 처리하며 design-system layer에 포함하지 않습니다.

## Internal LDS comparison

- `Input`/`FormField`: label, helper/error, invalid border, size, disabled surface와 focus ring을 그대로 사용합니다.
- `PasswordInput`: hidden-by-default와 명시적인 show/hide action은 공유하지만, editable value state와 login/autofill 책임은 가져오지 않습니다.
- `IconButton`: 32px plain trailing action과 표준 eye/copy/check/close icon을 사용합니다. copy 성공/실패 icon에만 LDS positive/negative 의미색을 적용하며 별도 action divider, nested card, 고유 shadow나 색상 surface를 추가하지 않습니다.
- 의도적인 차이는 read-only credential 계약, 제한 시간 reveal, clipboard 결과 feedback뿐입니다.

## External research basis

- [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/)에서 hidden-by-default, 명시적인 show/hide action, 여러 field에서 구분되는 toggle label, `spellcheck=false`와 `autocapitalize=off` 기준을 확인했습니다.
- [Carbon Text input usage](https://carbondesignsystem.com/components/text-input/usage/)의 error·disabled·read-only 구분을 적용했습니다. disabled는 상호작용을 막고 read-only는 값을 읽고 focus할 수 있어야 합니다.
- [Carbon Text input accessibility](https://carbondesignsystem.com/components/text-input/accessibility/)의 keyboard-accessible visibility action과 label/helper/error 연결 기준을 따릅니다.
- [PatternFly Clipboard copy accessibility](https://v5-archive.patternfly.org/components/clipboard-copy/accessibility)는 copy action 이름을 field 맥락과 연결하고 성공 뒤 feedback을 갱신하도록 권장합니다. 이를 contextual button name과 live status로 번역했습니다.
- [WAI-ARIA Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)에 따라 동작 이름이 상태에 맞춰 바뀌는 command button과 이름을 유지하는 `aria-pressed` toggle을 혼합하지 않습니다.
