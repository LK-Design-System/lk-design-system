**RadioGroup** — 단일 선택 라디오 세트(켜지면 시그널 잉크 점).

```jsx
<RadioGroup defaultValue="now" onChange={setKind} options={[
  { value: 'now', label: '즉시 적용', description: '선택한 항목에 바로 반영' },
  { value: 'schedule', label: '예약 적용' },
]} />
```

- **options** — 문자열 또는 `{ value, label, description, disabled }`. **value / defaultValue / onChange** — 제어/비제어. **direction** `row · column`.
