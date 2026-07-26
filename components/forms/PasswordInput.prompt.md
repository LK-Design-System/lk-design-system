**PasswordInput** — 표시/숨김 토글이 있는 비밀번호 필드.

## Interaction and reference basis

- The reveal button is a real 32px icon button with a contextual name (`비밀번호 보기` / `비밀번호 숨기기`) and `aria-controls`; its icon describes the next action. A disabled field disables the trailing action as well.
- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- 입력 목적이 프로그래밍 방식으로 식별되도록 `autocomplete`를 항상 내보내며, 평문으로 전환되는 순간에도 값이 맞춤법/자동수정 서비스로 새지 않도록 `spellcheck="false"`·`autocapitalize="off"`·`autocorrect="off"`를 고정합니다.
- 필드가 소속된 `<form>`이 제출되면 표시 상태를 자동으로 마스킹으로 되돌립니다. 토글을 누른 뒤 그대로 제출해도 평문이 화면에 남지 않습니다.
- Caps Lock이 켜진 채로 입력하면 focus 중에만 주의 문구가 나타나고, 상시 마운트된 polite live region이 같은 문구를 읽습니다.
- Reference basis: [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/), [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/), [GOV.UK Password input](https://design-system.service.gov.uk/components/password-input/), [WCAG 2.2 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html).

```jsx
<PasswordInput onChange={setPw} />
```

- **value / defaultValue / onChange** — 제어/비제어. **size** `sm · md`.

- 필드·상태 prop: **label**(필드 레이블) · **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **fieldStyle**(전체 필드 컨테이너 스타일) · **revealLabel**/**hideLabel**(비밀번호 표시·숨김 토글 버튼의 스크린리더 레이블).

- **autoComplete** — 브라우저 비밀번호 관리자에 전달하는 입력 목적. 기본값은 로그인 맥락의 `current-password`입니다. 회원가입·비밀번호 변경처럼 새 비밀번호를 만드는 폼에서는 `new-password`를 넘겨 관리자가 저장된 값 대신 생성 값을 제안하게 하세요. `off`를 넘기면 자동 채우기를 끌 수 있지만 권장하지 않습니다.

- **capsLockLabel** — Caps Lock이 켜진 상태에서 focus 중에 노출되는 주의 문구이자 live region 문장. 기본값은 `Caps Lock이 켜져 있습니다.`이고, 빈 문자열을 넘기면 경고를 끕니다. 값이 비어 있지 않은 한 문구는 필드가 focus를 잃으면 사라집니다.
