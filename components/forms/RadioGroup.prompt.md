**RadioGroup** — 단일 선택 라디오 세트(켜지면 시그널 잉크 점).

```jsx
<RadioGroup defaultValue="patrol" onChange={setKind} options={[
  { value: 'patrol', label: '순찰', description: '정기 경로 순찰' },
  { value: 'clean', label: '청소' },
]} />
```

- **options** — 문자열 또는 `{ value, label, description, disabled }`. **value / defaultValue / onChange** — 제어/비제어. **direction** `row · column`.
