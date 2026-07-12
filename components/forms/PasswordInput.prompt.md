**PasswordInput** — 표시/숨김 토글이 있는 비밀번호 필드.

## Interaction and reference basis

- The reveal button is a real 32px icon button with a contextual name (`비밀번호 보기` / `비밀번호 숨기기`) and `aria-controls`; its icon describes the next action. A disabled field disables the trailing action as well.
- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- Reference basis: [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/) and [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/).

```jsx
<PasswordInput onChange={setPw} />
```

- **value / defaultValue / onChange** — 제어/비제어. **size** `sm · md`.

- 필드·상태 prop: **label**(필드 레이블) · **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **fieldStyle**(전체 필드 컨테이너 스타일) · **revealLabel**/**hideLabel**(비밀번호 표시·숨김 토글 버튼의 스크린리더 레이블).
