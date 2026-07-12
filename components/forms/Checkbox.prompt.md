**Checkbox** — 켜지면 LK 시그널 잉크 + 화이트 체크로 채워지는 라운드 사각형. 제어(`checked`) 또는 비제어(`defaultChecked`); `onChange`는 다음 불리언을 받습니다.

## Selection contract

- Checkbox, Radio, and Switch use the same 8px control-to-label gap. Checkbox remains independently toggleable and uses `mixed` only for a true aggregate indeterminate state.
- Reference basis: [WAI-ARIA Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) and [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/).

```jsx
<Checkbox checked={agreed} onChange={setAgreed} label="개인정보 수집·이용에 동의합니다." />
```
