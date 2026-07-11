**SearchableMultiSelect**는 많은 관계 항목을 검색하고 여러 개 선택하는 controlled control입니다.

```jsx
<SearchableMultiSelect
  label="연결 저장소"
  options={repositories}
  value={selectedRepositoryIds}
  onChange={setSelectedRepositoryIds}
  loading={query.loading}
/>
```

- async 검색은 `searchValue`와 `onSearchChange`로 앱이 제어합니다.
- Backspace로 마지막 chip을 제거하고 방향키/Enter로 option을 선택할 수 있습니다.
- Input이 유일한 combobox Tab stop을 소유하고 options는 `aria-activedescendant`로 탐색합니다. 방향키 탐색은 disabled option을 건너뛰며, 현재 렌더된 option만 active descendant로 연결합니다. 선택 chip과 제거 action은 LDS `Chip`/`IconButton`을 조합합니다.
- `label`은 실제 input의 필수 accessible name입니다. popup의 loading/empty/max 상태는 live status로 알리되 listbox 자체는 `option` 구조만 유지합니다.
- 선택 항목은 검색 field 안의 outlined chip과 option 목록의 check 상태에 함께 남습니다. 여러 항목을 연속 선택할 수 있도록 선택 뒤에도 popup을 유지합니다.
- `loading`, `error`, empty, `maxSelections`는 서로 다른 텍스트 상태로 제공됩니다. `error`는 field 아래 한 곳에서만 알립니다.
- 자유 입력 태그에는 `TagInput`을 사용합니다. 기존 `Combobox`는 검색이 필요 없는 소규모 다중 선택의 호환 API이며, 검색·비동기 데이터·설명·disabled option이 필요하면 `SearchableMultiSelect`를 우선합니다.

## External research basis

- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)을 따라 DOM focus는 input에 유지하고 `aria-expanded`, `aria-controls`, `aria-activedescendant`, Escape/Enter/Arrow 계약을 연결합니다. Home/End는 input의 표준 텍스트 편집 동작을 보존합니다.
- [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)에 맞춰 popup의 직접 소유 항목을 `option`으로 유지하고 multi-selection은 `aria-multiselectable`과 `aria-selected` 한 축으로 표현합니다.
- Popup surface는 LDS sibling `Select`와 `Combobox`의 overlay surface, solid border, `shadow-md`, radius/padding을 재사용합니다.
