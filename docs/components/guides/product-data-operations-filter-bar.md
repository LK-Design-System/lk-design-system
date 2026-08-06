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

### 사용하지 않음

- activeFilters는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다.
- onRemoveFilter가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다.
- variant="embedded"는 부모 데이터 surface 안에서 좌우 외곽선을 중복하지 않습니다.
- FilterBar는 대시보드의 facet control, 적용된 조건, 개별 제거·전체 초기화, 결과 수, saved-view control을 한 읽기 순서로 정렬하는 LK Product Extension입니다. 검색과 page-level action을 소유하는 DataToolbar, row 선택 bulk band를 소유하는 DataGrid와 역할을 중복하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| controls | facet trigger, date range 등 필터 control 슬롯. |
| viewControl | saved view selector처럼 query 전체를 전환하는 control 슬롯. |
| actions | 보기 저장, 고급 필터 등 trailing action 슬롯. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `controls` | `React.ReactNode` | No | facet trigger, date range 등 필터 control 슬롯. |
| `activeFilters` | `AppliedFilter[]` | No | 현재 적용된 controlled filter 요약. |
| `onRemoveFilter` | `(id: string) = void` | No | 제공하면 applied filter가 제거 버튼이 됩니다. 생략하면 읽기 전용 요약으로 렌더링됩니다. |
| `onClearFilters` | `() = void` | No |  |
| `clearLabel` | `React.ReactNode` | No |  |
| `summaryLabel` | `string` | No |  |
| `resultCount` | `number` | No |  |
| `resultCountLabel` | `React.ReactNode` | No |  |
| `viewControl` | `React.ReactNode` | No | saved view selector처럼 query 전체를 전환하는 control 슬롯. |
| `actions` | `React.ReactNode` | No | 보기 저장, 고급 필터 등 trailing action 슬롯. |
| `variant` | `'standalone' \| 'embedded'` | No | 독립 표면 또는 부모 데이터 표면 결합. @default "standalone" |
| `size` | `'sm' \| 'md'` | No | 밀도. @default "md" |

## States

| State | Contract |
| --- | --- |
| activeFilters | 현재 적용된 controlled filter 요약. |
| variant | 독립 표면 또는 부모 데이터 표면 결합. @default "standalone" |

## Behavior and interaction

- viewControl은 saved-view 선택, actions는 보기 저장·고급 필터 같은 제품 action 슬롯입니다. 저장과 persistence는 제품 책임입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | onRemoveFilter가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 onClearFilters도 있으면 전체 초기화 action을 함께 제공합니다. |
| 명시 규칙 2 | 적용 필터 묶음은 이름 있는 role="group"으로 노출합니다. generic div에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다. |
| 명시 규칙 3 | chip을 제거하면 포커스가 사라진 버튼을 따라 로 떨어지지 않도록, 같은 자리의 다음 chip → 마지막 chip → 전체 초기화 → 이름 있는 region 순서로 이동합니다(WCAG 2.4.3, PatternFly Filters). |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Content and writing

- 결과 수는 polite live status로 갱신됩니다. 라이브 리전은 결과 수가 없을 때도 비어 있는 채로 계속 마운트되어 있고 텍스트만 바뀌므로, 첫 필터 적용에서도 낭독이 누락되지 않습니다(ToastStack의 상시 리전과 같은 계약). 보이는 결과 수 텍스트는 표현만 담당합니다. 오류나 로딩은 ResourceState가 소유합니다.

## Accessibility

- 적용 chip은 제거 버튼이지 토글이 아닙니다. 눌린 상태(aria-pressed)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다(WAI-ARIA APG Button).
- 좁은 폭에서는 control, action, 적용 chip이 DOM 순서를 유지한 채 줄바꿈됩니다. toolbar가 아니므로 arrow-key roving focus를 강제하지 않고 각 native control의 Tab 순서를 유지합니다.
- 내부 DataToolbar, FilterChip, Chip, DateRangeField, TextButton의 높이·radius·focus 동작을 비교해 그대로 조합했습니다. PatternFly Filters의 persistent applied-filter summary와 clear-all, Carbon Data table의 global toolbar와 batch-action 분리, WAI-ARIA Toolbar pattern의 복합 위젯 keyboard 기준을 비교했습니다.
- LDS에서는 필터가 서로 다른 팝업·날짜 field를 포함하므로 하나의 roving toolbar로 만들지 않았습니다. 이는 일반 Tab 순서를 보존하기 위한 의도적 차이입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |

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

## Sources

- FilterBar prompt contract: `components/data/FilterBar.prompt.md`
- Storybook implementation evidence: `stories/DataFilterBar.stories.jsx`
- [WAI-ARIA APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)
- [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
