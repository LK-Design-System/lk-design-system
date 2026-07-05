**Combobox** — 다중 선택 드롭다운(트리거 안의 칩, 체크 가능한 옵션).

```jsx
<Combobox options={['시설관리','건설','발전소','국방','공항']} defaultValue={['국방']} onChange={setInd} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — string[]. 단일 선택 패싯에는 `FilterChip`, 자유 태그에는 `TagInput`을 쓰세요.
