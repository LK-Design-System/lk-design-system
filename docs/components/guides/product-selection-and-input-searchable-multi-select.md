# Searchable Multi Select

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `SearchableMultiSelect` |
| Storybook | `LDS Product/Selection and Input/Searchable Multi Select` |
| Source | `../component-content.json#product-selection-and-input-searchable-multi-select` |

저장소·사용자처럼 항목이 많고 검색 후 복수 값을 chip으로 남겨야 할 때 적합합니다. 선택지가 적거나 하나만 고르면 Checkbox Group 또는 Select를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Visible accessible name for the combobox. |
| helper | Supporting text linked to the combobox. Hidden when error is present. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `SearchableMultiSelectOption[]` | No |  |
| `value` | `Value[]` | No |  |
| `defaultValue` | `Value[]` | No |  |
| `onChange` | `(value: Value[]) = void` | No |  |
| `searchValue` | `string` | No |  |
| `defaultSearchValue` | `string` | No |  |
| `onSearchChange` | `(value: string) = void` | No |  |
| `filterOption` | `(option: SearchableMultiSelectOption, search: string) = boolean` | No |  |
| `label` | `React.ReactNode` | Yes | Visible accessible name for the combobox. |
| `helper` | `React.ReactNode` | No | Supporting text linked to the combobox. Hidden when error is present. |
| `placeholder` | `string` | No |  |
| `loading` | `boolean` | No |  |
| `error` | `React.ReactNode` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `loadingLabel` | `React.ReactNode` | No |  |
| `maxSelections` | `number` | No |  |
| `maxSelectionLabel` | `React.ReactNode` | No |  |
| `required` | `boolean` | No |  |
| `disabled` | `boolean` | No |  |
| `readOnly` | `boolean` | No | Keep the values focusable and readable while preventing search and selection changes. |

## States

| State | Contract |
| --- | --- |
| readOnly | Keep the values focusable and readable while preventing search and selection changes. |

## Behavior and interaction

- async 검색은 searchValue와 onSearchChange로 앱이 제어합니다. 자유 입력 값 생성, select-all, 원격 요청 정책, 가상화는 이 컴포넌트의 범위가 아닙니다.
- Select/Combobox: overlay surface, solid border, shadow-md, radius와 padding을 맞춥니다.
- Chip/IconButton: 선택 값과 제거 action의 크기·radius·아이콘 처리를 재사용합니다.
- Carbon Dropdown accessibility의 typing/Arrow/Enter/Escape 계약과 Space가 검색 text 입력으로 남아야 한다는 기준을 반영했습니다.
- SearchableMultiSelect는 많은 관계 항목을 검색하고 여러 개 선택하는 LK Product Extension입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Option 제목은 --body2-size(15px)와 --fw-medium(500)을 사용해 검색 입력보다 한 단계 낮추고, 설명은 caption 단계로 내립니다. 제목은 행의 왼쪽, 보조 설명은 오른쪽에 한 줄로 정렬하며, 좁은 폭이나 긴 문자열에서는 두 영역을 각각 말줄임해 행 높이와 스캔 축을 유지합니다. |
| 명시 규칙 2 | loading/empty는 option으로 위장하지 않습니다. combobox가 제어하는 빈 listbox는 유지하고, 보이는 안내는 그 옆의 표현 전용 notice로 분리합니다. 낭독은 컨트롤 루트의 상시 마운트된 숨김 status region이 담당합니다 — popup 안 notice는 메시지와 함께 삽입되어 live region으로는 신뢰성 있게 낭독되지 않기 때문입니다. 최대 선택 안내도 같은 region이 공지합니다. |
| 명시 규칙 3 | 선택 항목은 field 안의 LDS Chip과 option의 check 상태에 함께 남습니다. 선택 뒤에도 popup을 유지하며, disabled option과 최대 수로 잠긴 option은 active descendant와 pointer selection에서 제외합니다. |
| --body2-line | 22px |
| --body2-size | 15px |

## Responsive

- Apple Lists and tables의 행 기반 스캔, 간결한 항목 문구, 좁은 폭에서 식별 가능한 말줄임 지침을 따라 제목·설명을 한 행의 양 끝에 두고 각각 독립적으로 overflow를 제한합니다.

## Content and writing

- label, helper, error, required는 Input/FormField와 같은 정보 계층을 사용합니다. error는 invalid styling과 한 개의 연결된 메시지를 제공하지만 검색이나 수정 자체를 막지 않습니다.
- 자유 입력 태그에는 TagInput을 사용합니다. 기존 Combobox는 검색이 필요 없는 소규모 다중 선택의 호환 API이며, 검색·비동기 데이터·설명·disabled option이 필요하면 SearchableMultiSelect를 사용합니다.
- ListCell: leading title과 trailing metadata의 한 행 정보 계층을 참고하되, option 내부에는 별도 action이나 장식 요소를 추가하지 않습니다.
- 의도적인 차이는 editable 검색 input, multi-selection 유지, option 설명, async status뿐입니다. 별도 edge line, inset border, shadow, 색상 언어는 추가하지 않습니다.

## Accessibility

- DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 aria-activedescendant로 탐색합니다.
- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- readOnly는 focus와 값 읽기를 유지하면서 검색·선택·chip 제거를 막고 popup을 열지 않습니다. disabled는 input과 action을 Tab 순서에서 제거합니다.
- Input/FormField: label, helper/error, required mark, border, focus ring, disabled surface token을 재사용합니다.
- WAI-ARIA Combobox pattern을 따라 DOM focus를 input에 유지하고 aria-expanded, aria-controls, aria-activedescendant, Escape/Enter/Arrow 계약을 연결합니다. Home/End는 input의 표준 텍스트 편집 동작을 보존합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-height`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-stack-gap`
- `--component-input-text-color`
- `--font-sans`
- `--fw-medium`
- `--label1-size`
- `--radius-5`
- `--radius-lg`
- `--radius-md`
- `--shadow-md`
- `--space-0`
- `--space-0-5`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/forms/SearchableMultiSelect.jsx`
- `components/forms/SearchableMultiSelect.d.ts`
- `components/forms/SearchableMultiSelect.prompt.md`
- `stories/FormSearchableMultiSelect.stories.jsx`

## Sources

- SearchableMultiSelect prompt contract: `components/forms/SearchableMultiSelect.prompt.md`
- Storybook implementation evidence: `stories/FormSearchableMultiSelect.stories.jsx`
- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [Carbon Dropdown usage](https://carbondesignsystem.com/components/dropdown/usage/)
- [Carbon Dropdown accessibility](https://carbondesignsystem.com/components/dropdown/accessibility/)
- [Apple Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)
