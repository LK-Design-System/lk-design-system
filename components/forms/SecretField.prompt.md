**SecretField**는 credential 값을 제한적으로 reveal하고 복사하는 읽기 전용 패턴입니다.

```jsx
<SecretField
  label="Access token"
  value={token}
  revealDurationMs={10000}
  onCopy={recordCopyAudit}
/>
```

- 기본 reveal은 10초 뒤 자동으로 닫힙니다. `revealed`를 외부에서 제어해도 열린 시점부터 같은 timer가 동작하고 `onRevealChange(false)`로 닫기를 요청합니다.
- Clipboard write가 성공한 경우에만 `onCopy`와 `복사됨` 상태를 내보냅니다. 실패는 `onCopyError`와 `copyErrorLabel`로 별도 전달합니다.
- 실제 재인증, 권한 검사, audit log는 앱이 처리합니다.
- 일반 로그인 비밀번호 입력에는 `PasswordInput`을 사용합니다.
- 전달된 input 속성은 `type`과 `readOnly`를 덮어쓸 수 없습니다. trailing reveal/copy는 `Input`의 plain icon action을 조합하며, action이 없으면 빈 divider나 wrapper를 남기지 않습니다.
- reveal action은 현재 동작을 `보기/숨기기`라는 accessible name으로 직접 설명하므로 별도의 `aria-pressed` 상태를 중복하지 않습니다. copy action은 `copyLabel`, `copiedLabel`, `copyErrorLabel`을 실제 button name과 live feedback에 함께 사용합니다.

## External research basis

- [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/)은 값 표시 여부를 명시적인 show/hide action으로 제공하고 현재 action을 텍스트로 설명합니다.
- [WAI-ARIA Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)에 따라 동작 이름이 상태에 맞춰 바뀌는 command button과 이름을 유지하는 `aria-pressed` toggle을 혼합하지 않습니다.
