**DatePicker** — `Calendar` 팝오버를 여는 날짜 필드.

```jsx
<DatePicker placeholder="실사 희망일" onChange={setDate} />
<DatePicker defaultValue="2026-07-03" />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date 또는 ISO 문자열). **disabled / aria-label** — trigger 상태와 accessible name. 선택 값은 trigger 이름에도 포함됩니다. 바깥 클릭·선택·Escape 시 닫히며 선택 뒤 trigger로 focus가 돌아옵니다.
- trigger는 `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`로 Calendar popup과 연결하고 LDS Input focus ring을 사용합니다.

## External research basis

- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 popup naming, 초기 날짜 focus, Escape, 선택 후 focus return 계약을 따릅니다.
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)을 기준으로 Calendar popup을 이름 있는 dialog로 노출합니다. 완전한 modal focus trap은 사용하지 않는 non-modal field popup입니다.
