**DatePicker** — `Calendar` 팝오버를 여는 날짜 필드.

```jsx
<DatePicker placeholder="실사 희망일" onChange={setDate} />
<DatePicker defaultValue="2026-07-03" />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date, ISO 문자열 또는 빈 값). **disabled / aria-label** — trigger 상태와 accessible name. 선택 값은 trigger 이름에도 포함됩니다. 바깥 클릭·선택·Escape 시 닫히며 선택 뒤 trigger로 focus가 돌아옵니다.
- **full** — 날짜 범위나 툴바처럼 부모 폭에 맞춰야 하는 조합에서 trigger의 고정 최소 폭을 제거하고 가용 폭을 채웁니다.
- trigger는 `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`로 Calendar popup과 연결하고 LDS Input focus ring을 사용합니다.
- calendar affordance는 공통 `Icon` registry를 사용하며 trigger의 accessible name과 중복되지 않도록 장식적으로 숨깁니다.

## External research basis

- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 popup naming, 초기 날짜 focus, Escape, 선택 후 focus return 계약을 따릅니다.
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)을 기준으로 Calendar popup을 이름 있는 dialog로 노출합니다. 완전한 modal focus trap은 사용하지 않는 non-modal field popup입니다.
