**PasswordInput** — 표시/숨김 토글이 있는 비밀번호 필드.

## Interaction and reference basis

- The reveal button is a real 32px icon button with a contextual name (`비밀번호 보기` / `비밀번호 숨기기`) and `aria-controls`; its icon describes the next action. A disabled field disables the trailing action as well.
- Label, helper/error, read-only, positive, and negative states use the same field anatomy and tokens as Input.
- Reference basis: [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/) and [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/).

```jsx
<PasswordInput onChange={setPw} />
```

- **value / defaultValue / onChange** — 제어/비제어. **size** `sm · md`.
