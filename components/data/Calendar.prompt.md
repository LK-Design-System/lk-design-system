**Calendar** — 날짜 선택용 월 그리드(현장 실사 일정). 일요일 레드 / 토요일 시그널 헤더; 선택된 날짜는 시그널 잉크로 채워지고, 오늘은 링을 두릅니다.

```jsx
<Calendar defaultValue="2026-07-03" onChange={setDate} />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date 또는 ISO 문자열 허용). 팝오버 안에서 `Input`과 조합해 데이트 피커를 만드세요.
