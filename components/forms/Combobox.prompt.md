**Combobox** — 다중 선택 드롭다운(트리거 안의 칩, 체크 가능한 옵션).

```jsx
<Combobox options={['시설관리','건설','발전소','국방','공항']} defaultValue={['국방']} onChange={setInd} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — string[]. 검색이 필요 없는 소규모 목록을 위한 호환 API입니다. 검색·비동기 데이터·설명·disabled option에는 `SearchableMultiSelect`, 단일 선택 패싯에는 `FilterChip`, 자유 태그에는 `TagInput`을 쓰세요.
