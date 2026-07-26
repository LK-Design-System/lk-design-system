**Calendar** — 날짜 선택용 월 그리드(현장 실사 일정). 일요일 레드 / 토요일 시그널 헤더; 선택된 날짜는 시그널 잉크로 채워지고, 오늘은 링을 두릅니다.

```jsx
<Calendar defaultValue="2026-07-03" onChange={setDate} />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date 또는 ISO 문자열 허용). **autoFocus**는 DatePicker dialog가 열릴 때 선택 날짜 또는 오늘로 focus를 옮깁니다.
- **isDateDisabled(date) / minDate / maxDate** — 예약 불가일·휴무일·범위 밖 날짜를 선택 불가로 표시합니다. `isDateDisabled`는 임의 조건(콜백)을, `minDate`/`maxDate`는 경계를 담당하며 함께 쓸 수 있습니다. 비활성 날짜는 흐리게·취소선으로 표시되고 `aria-disabled`가 붙으며, 예약 가능일 흐름에서 특정 날짜를 막는 용도입니다.
- 날짜 grid는 하나의 roving Tab stop을 사용합니다. Arrow 키는 일/주 단위, Home/End는 주의 시작/끝, PageUp/PageDown은 월 단위, Shift+PageUp/Shift+PageDown은 연 단위로 이동합니다. 비활성 날짜도 포커스로 지나갈 수는 있으나(이유를 인지할 수 있도록) 선택만 차단되어 WAI-ARIA date 패턴을 따릅니다.
- **표시 중인 달은 사용자 탐색이 소유합니다.** 선택 값이 있어도 이전/다음 달 버튼·PageUp/PageDown·월 경계를 넘는 Arrow 이동이 선택된 달로 되돌려지지 않습니다. 값이 실제로 바뀔 때(제어 컴포넌트의 새 `value` 포함)만 표시 달과 roving 초점이 선택 날짜로 따라갑니다.
- 이전/다음 달 버튼은 초점을 그대로 유지해 여러 달을 연속으로 넘길 수 있습니다. 다만 grid 안에서 키보드로 탐색 중이었다면 초점이 새 달의 날짜 셀로 따라갑니다. 월 표시는 `aria-live="polite"`로 읽힙니다.
- gridcell에는 `aria-selected`가, 초점을 받는 날짜 button의 accessible name에는 `, 선택됨`이 함께 실려 선택 상태가 어느 경로로도 누락되지 않습니다.
- standalone Calendar와 DatePicker popup이 같은 keyboard·selection 계약을 공유합니다.

## External research basis

- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 grid roving focus와 날짜 이동 키를 따릅니다.
