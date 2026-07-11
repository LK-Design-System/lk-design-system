**SearchableMultiSelect**는 많은 관계 항목을 검색하고 여러 개 선택하는 **LK Product Extension**입니다.

```jsx
<SearchableMultiSelect
  label="연결 저장소"
  helper="최대 3개까지 연결할 수 있습니다."
  options={repositories}
  value={selectedRepositoryIds}
  onChange={setSelectedRepositoryIds}
  loading={query.loading}
/>
```

- async 검색은 `searchValue`와 `onSearchChange`로 앱이 제어합니다. 자유 입력 값 생성, select-all, 원격 요청 정책, 가상화는 이 컴포넌트의 범위가 아닙니다.
- DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 `aria-activedescendant`로 탐색합니다.
- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- `label`, `helper`, `error`, `required`는 `Input`/`FormField`와 같은 정보 계층을 사용합니다. `error`는 invalid styling과 한 개의 연결된 메시지를 제공하지만 검색이나 수정 자체를 막지 않습니다.
- `readOnly`는 focus와 값 읽기를 유지하면서 검색·선택·chip 제거를 막고 popup을 열지 않습니다. `disabled`는 input과 action을 Tab 순서에서 제거합니다.
- loading/empty는 `option`으로 위장하지 않습니다. combobox가 제어하는 빈 `listbox`는 유지하고, 보이는 안내는 그 옆의 live status로 분리합니다. 최대 선택 안내도 listbox 바깥 footer status에 둡니다.
- 선택 항목은 field 안의 LDS `Chip`과 option의 check 상태에 함께 남습니다. 선택 뒤에도 popup을 유지하며, disabled option과 최대 수로 잠긴 option은 active descendant와 pointer selection에서 제외합니다.
- 자유 입력 태그에는 `TagInput`을 사용합니다. 기존 `Combobox`는 검색이 필요 없는 소규모 다중 선택의 호환 API이며, 검색·비동기 데이터·설명·disabled option이 필요하면 `SearchableMultiSelect`를 사용합니다.

## Internal LDS comparison

- `Input`/`FormField`: label, helper/error, required mark, border, focus ring, disabled surface token을 재사용합니다.
- `Select`/`Combobox`: overlay surface, solid border, `shadow-md`, radius와 padding을 맞춥니다.
- `Chip`/`IconButton`: 선택 값과 제거 action의 크기·radius·아이콘 처리를 재사용합니다.
- 의도적인 차이는 editable 검색 input, multi-selection 유지, option 설명, async status뿐입니다. 별도 edge line, inset border, shadow, 색상 언어는 추가하지 않습니다.

## External research basis

- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)을 따라 DOM focus를 input에 유지하고 `aria-expanded`, `aria-controls`, `aria-activedescendant`, Escape/Enter/Arrow 계약을 연결합니다. Home/End는 input의 표준 텍스트 편집 동작을 보존합니다.
- [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)에 맞춰 실제 선택 항목만 `option`으로 유지하고 multi-selection은 `aria-multiselectable`과 `aria-selected` 한 축으로 표현합니다.
- [Carbon Dropdown usage](https://carbondesignsystem.com/components/dropdown/usage/)에서 filterable multi-select의 label/helper/field/menu anatomy, 선택 후 열린 menu, error·disabled·read-only 구분을 확인했습니다. 시각 스타일은 복사하지 않고 LDS input·overlay token으로 번역했습니다.
- [Carbon Dropdown accessibility](https://carbondesignsystem.com/components/dropdown/accessibility/)의 typing/Arrow/Enter/Escape 계약과 Space가 검색 text 입력으로 남아야 한다는 기준을 반영했습니다.
