# FilterBar

`FilterBar`는 대시보드의 facet control, 적용된 조건, 개별 제거·전체 초기화, 결과 수, saved-view control을 한 읽기 순서로 정렬하는 **LK Product Extension**입니다. 검색과 page-level action을 소유하는 `DataToolbar`, row 선택 bulk band를 소유하는 `DataGrid`와 역할을 중복하지 않습니다.

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

- `activeFilters`는 제품 query state의 표시 모델입니다. 컴포넌트는 URL 직렬화, facet fetch, 검색 ranking을 수행하지 않습니다.
- `onRemoveFilter`가 있으면 적용된 조건은 한 번에 하나씩 제거할 수 있는 실제 button이며, 둘 이상이고 `onClearFilters`도 있으면 전체 초기화 action을 함께 제공합니다.
- `onRemoveFilter`가 없으면 close 아이콘이나 동작 없는 button을 만들지 않고 읽기 전용 chip으로 표시합니다.
- 적용 필터 묶음은 이름 있는 `role="group"`으로 노출합니다. generic `div`에 이름만 붙이지 않으며, selected chip foreground는 active light/dark scope의 semantic label color를 직접 사용해 두 테마 모두에서 4.5:1 이상을 유지합니다.
- 적용 chip은 제거 **버튼**이지 토글이 아닙니다. 눌린 상태(`aria-pressed`)를 부여하지 않고, 선택된 chip 표면은 chip 토큰으로만 표현합니다. "…필터 제거"라는 이름의 액션 버튼이 눌린 토글로 낭독되면 안 되기 때문입니다([WAI-ARIA APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)).
- chip을 제거하면 포커스가 사라진 버튼을 따라 `<body>`로 떨어지지 않도록, 같은 자리의 다음 chip → 마지막 chip → 전체 초기화 → 이름 있는 region 순서로 이동합니다(WCAG 2.4.3, PatternFly Filters).
- 결과 수는 polite live status로 갱신됩니다. 라이브 리전은 결과 수가 없을 때도 비어 있는 채로 계속 마운트되어 있고 텍스트만 바뀌므로, 첫 필터 적용에서도 낭독이 누락되지 않습니다(`ToastStack`의 상시 리전과 같은 계약). 보이는 결과 수 텍스트는 표현만 담당합니다. 오류나 로딩은 `ResourceState`가 소유합니다.
- `viewControl`은 saved-view 선택, `actions`는 보기 저장·고급 필터 같은 제품 action 슬롯입니다. 저장과 persistence는 제품 책임입니다.
- `variant="embedded"`는 부모 데이터 surface 안에서 좌우 외곽선을 중복하지 않습니다.
- 좁은 폭에서는 control, action, 적용 chip이 DOM 순서를 유지한 채 줄바꿈됩니다. toolbar가 아니므로 arrow-key roving focus를 강제하지 않고 각 native control의 Tab 순서를 유지합니다.

## 비교와 결정 근거

내부 `DataToolbar`, `FilterChip`, `Chip`, `DateRangeField`, `TextButton`의 높이·radius·focus 동작을 비교해 그대로 조합했습니다. [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)의 persistent applied-filter summary와 clear-all, [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)의 global toolbar와 batch-action 분리, [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)의 복합 위젯 keyboard 기준을 비교했습니다.

LDS에서는 필터가 서로 다른 팝업·날짜 field를 포함하므로 하나의 roving toolbar로 만들지 않았습니다. 이는 일반 Tab 순서를 보존하기 위한 의도적 차이입니다.
