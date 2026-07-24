# Searchable Multi Select

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `SearchableMultiSelect` |
| Storybook | `LDS Product/Selection and Input/Searchable Multi Select` |
| Source | `../component-content.json#product-selection-and-input-searchable-multi-select` |

저장소·사용자처럼 항목이 많고 검색 후 복수 값을 chip으로 남겨야 할 때 적합합니다. 선택지가 적거나 하나만 고르면 Checkbox Group 또는 Select를 사용하세요.

## 사용 판단

### 사용

- 저장소·사용자처럼 항목이 많고 검색 후 복수 값을 chip으로 남겨야 할 때 적합합니다. 선택지가 적거나 하나만 고르면 Checkbox Group 또는 Select를 사용하세요.
- Option 제목은 Select·AutoComplete·Combobox와 같은 --component-input-font-size(16px)를 사용하고, 설명만 caption 단계로 내립니다.
- label, helper, error, required는 Input/FormField와 같은 정보 계층을 사용합니다. error는 invalid styling과 한 개의 연결된 메시지를 제공하지만 검색이나 수정 자체를 막지 않습니다.
- 자유 입력 태그에는 TagInput을 사용합니다. 기존 Combobox는 검색이 필요 없는 소규모 다중 선택의 호환 API이며, 검색·비동기 데이터·설명·disabled option이 필요하면 SearchableMultiSelect를 사용합니다.

### 사용하지 않음

- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- loading/empty는 option으로 위장하지 않습니다. combobox가 제어하는 빈 listbox는 유지하고, 보이는 안내는 그 옆의 표현 전용 notice로 분리합니다. 낭독은 컨트롤 루트의 상시 마운트된 숨김 status region이 담당합니다 — popup 안 notice는 메시지와 함께 삽입되어 live region으로는 신뢰성 있게 낭독되지 않기 때문입니다. 최대 선택 안내도 같은 region이 공지합니다.
- 의도적인 차이는 editable 검색 input, multi-selection 유지, option 설명, async status뿐입니다. 별도 edge line, inset border, shadow, 색상 언어는 추가하지 않습니다.
- Carbon Dropdown usage에서 filterable multi-select의 label/helper/field/menu anatomy, 선택 후 열린 menu, error·disabled·read-only 구분을 확인했습니다. 시각 스타일은 복사하지 않고 LDS input·overlay token으로 번역했습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SearchableMultiSelect의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Visible accessible name for the combobox. |
| Helper | Supporting text linked to the combobox. Hidden when error is present. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Empty Label | emptyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Loading Label | loadingLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Max Selection Label | maxSelectionLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `SearchableMultiSelectOption[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `Value[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `Value[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: Value[]) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `searchValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultSearchValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onSearchChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `filterOption` | `(option: SearchableMultiSelectOption, search: string) = boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `React.ReactNode` | Yes | Visible accessible name for the combobox. |
| `helper` | `React.ReactNode` | No | Supporting text linked to the combobox. Hidden when error is present. |
| `placeholder` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loading` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `loadingLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `maxSelections` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `maxSelectionLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `required` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `readOnly` | `boolean` | No | Keep the values focusable and readable while preventing search and selection changes. |

## States

| State | Contract |
| --- | --- |
| loading | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| loadingLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| readOnly | Keep the values focusable and readable while preventing search and selection changes. 타입 계약: boolean |
| 변형·상태 · 불러오기 · 오류 · 빈 결과와 최대 선택 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 비활성 항목 건너뛰기 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 키보드 선택과 제거 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 읽기 전용 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- async 검색은 searchValue와 onSearchChange로 앱이 제어합니다. 자유 입력 값 생성, select-all, 원격 요청 정책, 가상화는 이 컴포넌트의 범위가 아닙니다.
- DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 aria-activedescendant로 탐색합니다.
- Option 제목은 Select·AutoComplete·Combobox와 같은 --component-input-font-size(16px)를 사용하고, 설명만 caption 단계로 내립니다.
- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- readOnly는 focus와 값 읽기를 유지하면서 검색·선택·chip 제거를 막고 popup을 열지 않습니다. disabled는 input과 action을 Tab 순서에서 제거합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Option 제목은 Select·AutoComplete·Combobox와 같은 --component-input-font-size(16px)를 사용하고, 설명만 caption 단계로 내립니다. |
| 명시 규칙 2 | loading/empty는 option으로 위장하지 않습니다. combobox가 제어하는 빈 listbox는 유지하고, 보이는 안내는 그 옆의 표현 전용 notice로 분리합니다. 낭독은 컨트롤 루트의 상시 마운트된 숨김 status region이 담당합니다 — popup 안 notice는 메시지와 함께 삽입되어 live region으로는 신뢰성 있게 낭독되지 않기 때문입니다. 최대 선택 안내도 같은 region이 공지합니다. |
| 명시 규칙 3 | 선택 항목은 field 안의 LDS Chip과 option의 check 상태에 함께 남습니다. 선택 뒤에도 popup을 유지하며, disabled option과 최대 수로 잠긴 option은 active descendant와 pointer selection에서 제외합니다. |
| 명시 규칙 4 | - async 검색은 searchValue와 onSearchChange로 앱이 제어합니다. 자유 입력 값 생성, select-all, 원격 요청 정책, 가상화는 이 컴포넌트의 범위가 아닙니다. - DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 aria-activedescendant로 탐색합니다. - Option 제목은 Select·AutoComplete·Combobox와 같은 --compon… |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Option 제목은 Select·AutoComplete·Combobox와 같은 --component-input-font-size(16px)를 사용하고, 설명만 caption 단계로 내립니다.
- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- label, helper, error, required는 Input/FormField와 같은 정보 계층을 사용합니다. error는 invalid styling과 한 개의 연결된 메시지를 제공하지만 검색이나 수정 자체를 막지 않습니다.
- loading/empty는 option으로 위장하지 않습니다. combobox가 제어하는 빈 listbox는 유지하고, 보이는 안내는 그 옆의 표현 전용 notice로 분리합니다. 낭독은 컨트롤 루트의 상시 마운트된 숨김 status region이 담당합니다 — popup 안 notice는 메시지와 함께 삽입되어 live region으로는 신뢰성 있게 낭독되지 않기 때문입니다. 최대 선택 안내도 같은 region이 공지합니다.

## Accessibility

- DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 aria-activedescendant로 탐색합니다.
- 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다.
- readOnly는 focus와 값 읽기를 유지하면서 검색·선택·chip 제거를 막고 popup을 열지 않습니다. disabled는 input과 action을 Tab 순서에서 제거합니다.
- Input/FormField: label, helper/error, required mark, border, focus ring, disabled surface token을 재사용합니다.
- WAI-ARIA Combobox pattern을 따라 DOM focus를 input에 유지하고 aria-expanded, aria-controls, aria-activedescendant, Escape/Enter/Arrow 계약을 연결합니다. Home/End는 input의 표준 텍스트 편집 동작을 보존합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Option 제목은 Select·AutoComplete·Combobox와 같은 --component-input-font-size(16px)를 사용하고, 설명만 caption 단계로 내립니다. |
| Don't | 선택 chip의 명시적인 제거 버튼은 키보드 사용자를 위해 별도 Tab stop을 유지합니다. 제거 후에는 검색 input으로 focus가 돌아갑니다. 따라서 input을 "유일한 Tab stop"으로 설명하지 않습니다. |
| Do | label, helper, error, required는 Input/FormField와 같은 정보 계층을 사용합니다. error는 invalid styling과 한 개의 연결된 메시지를 제공하지만 검색이나 수정 자체를 막지 않습니다. |
| Don't | loading/empty는 option으로 위장하지 않습니다. combobox가 제어하는 빈 listbox는 유지하고, 보이는 안내는 그 옆의 표현 전용 notice로 분리합니다. 낭독은 컨트롤 루트의 상시 마운트된 숨김 status region이 담당합니다 — popup 안 notice는 메시지와 함께 삽입되어 live region으로는 신뢰성 있게 낭독되지 않기 때문입니다. 최대 선택 안내도 같은 region이 공지합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SearchableMultiSelect의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

- `--caption1-line`
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
- `--color-semantic-status-negative-text`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-height`
- `--component-input-label-color`
- `--component-input-label-font-size`
- `--component-input-label-font-weight`
- `--component-input-label-line-height`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-stack-gap`
- `--component-input-text-color`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--radius-5`
- `--radius-lg`
- `--radius-md`
- `--shadow-md`
- `--space-0`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/forms/SearchableMultiSelect.jsx`
- `components/forms/SearchableMultiSelect.d.ts`
- `components/forms/SearchableMultiSelect.prompt.md`
- `stories/FormSearchableMultiSelect.stories.jsx`

## Migration

- 자유 입력 태그에는 TagInput을 사용합니다. 기존 Combobox는 검색이 필요 없는 소규모 다중 선택의 호환 API이며, 검색·비동기 데이터·설명·disabled option이 필요하면 SearchableMultiSelect를 사용합니다.
- - async 검색은 searchValue와 onSearchChange로 앱이 제어합니다. 자유 입력 값 생성, select-all, 원격 요청 정책, 가상화는 이 컴포넌트의 범위가 아닙니다. - DOM focus는 검색 input에 남고 방향키/Enter/Escape로 option을 탐색·선택합니다. Backspace는 검색어가 비었을 때 마지막 chip을 제거합니다. option은 Tab stop을 만들지 않으며 aria-activedescendant로 탐색합니다. - Option 제목은 Select·AutoComplete·Combobox와 같은 --compon….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- SearchableMultiSelect prompt contract: `components/forms/SearchableMultiSelect.prompt.md`
- Storybook implementation evidence: `stories/FormSearchableMultiSelect.stories.jsx`
- [WAI-ARIA Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [Carbon Dropdown usage](https://carbondesignsystem.com/components/dropdown/usage/)
- [Carbon Dropdown accessibility](https://carbondesignsystem.com/components/dropdown/accessibility/)
