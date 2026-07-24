# Filter Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `FilterBar` |
| Storybook | `LDS Product/Data/Operations/Filter Bar` |
| Source | `../component-content.json#product-data-operations-filter-bar` |

여러 필터 control과 적용 조건·결과 수·saved view를 한 흐름으로 관리할 때 적합합니다. 한두 개의 독립 옵션이나 단순 검색만 필요하면 Filter Bar 대신 Select 또는 Search Field를 사용하세요.

## 사용 판단

### 사용

- 여러 필터 control과 적용 조건·결과 수·saved view를 한 흐름으로 관리할 때 적합합니다. 한두 개의 독립 옵션이나 단순 검색만 필요하면 Filter Bar 대신 Select 또는 Search Field를 사용하세요.
- onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다.
- 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다.
- 결과 수는 polite live status로 갱신됩니다. 라이브 리전은 결과 수가 없을 때도 비어 있는 채로 계속 마운트되어 있고 텍스트만 바뀌므로, 첫 필터 적용에서도 낭독이 누락되지 않습니다(ToastStack의 상시 리전과 같은 계약). 보이는 결과 수 텍스트는 표현만 담당합니다. 오류나 로딩은 ResourceState가 소유합니다.

### 사용하지 않음

- activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다.
- onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다.
- 적용 chip은 제거 버튼이지 토글이 아닙니다. 눌린 상태(aria-pressed)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다(WAI-ARIA APG Button).
- variant="embedded"는 부모 데이터 surface 안에서 좌우 외곽선을 중복하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | FilterBar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Controls | facet trigger, date range 등 필터 control 슬롯. |
| Clear Label | clearLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Summary Label | summaryLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Result Count Label | resultCountLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| View Control | saved view selector처럼 query 전체를 전환하는 control 슬롯. |
| Actions | 보기 저장, 고급 필터 등 trailing action 슬롯. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `controls` | `React.ReactNode` | No | facet trigger, date range 등 필터 control 슬롯. |
| `activeFilters` | `AppliedFilter[]` | No | 현재 적용된 controlled filter 요약. |
| `onRemoveFilter` | `(id: string) = void` | No | 제공하면 applied filter가 제거 버튼이 됩니다. 생략하면 읽기 전용 요약으로 렌더링됩니다. |
| `onClearFilters` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `clearLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `summaryLabel` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `resultCount` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `resultCountLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `viewControl` | `React.ReactNode` | No | saved view selector처럼 query 전체를 전환하는 control 슬롯. |
| `actions` | `React.ReactNode` | No | 보기 저장, 고급 필터 등 trailing action 슬롯. |
| `variant` | `'standalone' \| 'embedded'` | No | 독립 표면 또는 부모 데이터 표면 결합. @default "standalone" |
| `size` | `'sm' \| 'md'` | No | 밀도. @default "md" |

## States

| State | Contract |
| --- | --- |
| activeFilters | 현재 적용된 controlled filter 요약. 타입 계약: AppliedFilter[] |
| variant | 독립 표면 또는 부모 데이터 표면 결합. @default "standalone" 타입 계약: 'standalone' \| 'embedded' |
| 변형·상태 · 읽기 전용 필터 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 긴 필터 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다.
- 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다.
- 적용 chip은 제거 버튼이지 토글이 아닙니다. 눌린 상태(aria-pressed)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다(WAI-ARIA APG Button).
- viewControl은 saved-view 선택, actions는 보기 저장·고급 필터 같은 제품 action 슬롯입니다. 저장과 persistence는 제품 책임입니다.
- 좁은 폭에서는 control, action, 적용 chip이 DOM 순서를 유지한 채 줄바꿈됩니다. toolbar가 아니므로 arrow-key roving focus를 강제하지 않고 각 native control의 Tab 순서를 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. |
| 명시 규칙 2 | 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다. |
| 명시 규칙 3 | chip을 제거하면 포커스가 사라진 버튼을 따라 로 떨어지지 않도록, 같은 자리의 다음 chip → 마지막 chip → 전체 초기화 → 이름 있는 region 순서로 이동합니다(WCAG 2.4.3, PatternFly Filters). |
| 명시 규칙 4 | - activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다. - onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. - onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다. - 적용 필터 묶음은 이름 있는 role="group"으로 노출합니… |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 좁은 폭에서는 control, action, 적용 chip이 DOM 순서를 유지한 채 줄바꿈됩니다. toolbar가 아니므로 arrow-key roving focus를 강제하지 않고 각 native control의 Tab 순서를 유지합니다.
- - activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다. - onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. - onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다. - 적용 필터 묶음은 이름 있는 role="group"으로 노출합니….
- 내부 DataToolbar, FilterChip, Chip, DateRangeField, TextButton의 높이·radius·focus 동작을 비교해 그대로 조합했습니다. PatternFly Filters의 persistent applied-filter summary와 clear-all, Carbon Data table의 global toolbar와 batch-action 분리, WAI-ARIA Toolbar pattern의 복합 위젯 keyboard 기준을 비교했습니다.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다.
- 적용 chip은 제거 버튼이지 토글이 아닙니다. 눌린 상태(aria-pressed)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다(WAI-ARIA APG Button).
- chip을 제거하면 포커스가 사라진 버튼을 따라 로 떨어지지 않도록, 같은 자리의 다음 chip → 마지막 chip → 전체 초기화 → 이름 있는 region 순서로 이동합니다(WCAG 2.4.3, PatternFly Filters).
- 결과 수는 polite live status로 갱신됩니다. 라이브 리전은 결과 수가 없을 때도 비어 있는 채로 계속 마운트되어 있고 텍스트만 바뀌므로, 첫 필터 적용에서도 낭독이 누락되지 않습니다(ToastStack의 상시 리전과 같은 계약). 보이는 결과 수 텍스트는 표현만 담당합니다. 오류나 로딩은 ResourceState가 소유합니다.

## Accessibility

- 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다.
- 적용 chip은 제거 버튼이지 토글이 아닙니다. 눌린 상태(aria-pressed)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다(WAI-ARIA APG Button).
- chip을 제거하면 포커스가 사라진 버튼을 따라 로 떨어지지 않도록, 같은 자리의 다음 chip → 마지막 chip → 전체 초기화 → 이름 있는 region 순서로 이동합니다(WCAG 2.4.3, PatternFly Filters).
- 좁은 폭에서는 control, action, 적용 chip이 DOM 순서를 유지한 채 줄바꿈됩니다. toolbar가 아니므로 arrow-key roving focus를 강제하지 않고 각 native control의 Tab 순서를 유지합니다.
- - activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다. - onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. - onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다. - 적용 필터 묶음은 이름 있는 role="group"으로 노출합니….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. |
| Don't | activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다. |
| Do | 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다. |
| Don't | onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 FilterBar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Select` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<FilterBar
  controls={<DateRangeField value={range} onChange={setRange} />}
  activeFilters={[{ id: 'status', label: '상태', value: '활성' }]}
  onRemoveFilter={removeFilter}
  onClearFilters={clearFilters}
  resultCount={128}
  viewControl={<SavedViewSelect />}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--component-chip-bg-selected`
- `--component-chip-border-active`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label2-size`
- `--radius-md`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/FilterBar.jsx`
- `components/data/FilterBar.d.ts`
- `components/data/FilterBar.prompt.md`
- `stories/DataFilterBar.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- FilterBar prompt contract: `components/data/FilterBar.prompt.md`
- Storybook implementation evidence: `stories/DataFilterBar.stories.jsx`
- [WAI-ARIA APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
