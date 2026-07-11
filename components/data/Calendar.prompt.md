**Calendar** — 날짜 선택용 월 그리드(현장 실사 일정). 일요일 레드 / 토요일 시그널 헤더; 선택된 날짜는 시그널 잉크로 채워지고, 오늘은 링을 두릅니다.

```jsx
<Calendar defaultValue="2026-07-03" onChange={setDate} />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date 또는 ISO 문자열 허용). **autoFocus**는 DatePicker dialog가 열릴 때 선택 날짜 또는 오늘로 focus를 옮깁니다.
- 날짜 grid는 하나의 roving Tab stop을 사용합니다. Arrow 키는 일/주 단위, Home/End는 주의 시작/끝, PageUp/PageDown은 월 단위로 이동합니다.
- standalone Calendar와 DatePicker popup이 같은 keyboard·selection 계약을 공유합니다.

## External research basis

- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 grid roving focus와 날짜 이동 키를 따릅니다.
