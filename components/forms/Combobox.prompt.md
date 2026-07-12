**Combobox** — 다중 선택 드롭다운(트리거 안의 칩, 체크 가능한 옵션).

## Interaction and reference basis

- This is a select-only multi-value combobox. The trigger exposes expanded, controls, and active-descendant state; the popup is an `aria-multiselectable` listbox and keeps focus on the trigger while Arrow/Home/End navigate and Enter/Space toggle values.
- The small field is 32px, the default field follows `--component-input-height`, and options use the common 16px input typography.
- Reference basis: [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).

```jsx
<Combobox options={['시설관리','건설','발전소','국방','공항']} defaultValue={['국방']} onChange={setInd} />
```

- **options** — 문자열 또는 `{ value, label }`. **value / defaultValue / onChange** — string[]. 검색이 필요 없는 소규모 목록을 위한 호환 API입니다. 검색·비동기 데이터·설명·disabled option에는 `SearchableMultiSelect`, 단일 선택 패싯에는 `FilterChip`, 자유 태그에는 `TagInput`을 쓰세요.
- 타입 스케일 정합: 옵션 행 14.5px → `--body2-size`(15px)로 스냅했습니다. 트리거 텍스트와 옵션 텍스트가 같은 스케일 단계에 정렬됩니다.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **helper**(보조 설명) · **error**(오류 메시지) · **fieldStyle**(label·helper·error를 포함한 전체 필드 컨테이너 스타일).
