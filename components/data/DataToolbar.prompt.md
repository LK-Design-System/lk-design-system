**DataToolbar** — `DataGrid`/`Table` 위에서 제목, 결과 수, 검색, 필터, page-level action을 정렬하는 표면.

Classification: **LK Product Extension**. 선택 상태와 bulk action은 `DataGrid`가 소유하며 DataToolbar API에 중복하지 않습니다.

```jsx
<DataToolbar
  title="사용자 목록"
  description="조직에 등록된 계정"
  count={24}
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="사용자 검색"
  filters={<FilterChip active>온라인</FilterChip>}
  actions={<Button size="sm">내보내기</Button>}
/>
```

- 검색은 제어/비제어 모두 가능합니다. `searchValue`와 `onSearchChange`를 주면 제어됩니다.
- `filters`는 query를 좁히는 chip/menu 슬롯, `actions`는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. 설정 UI와 저장 상태는 제품이 소유하고 `visibleColumnKeys`/`columnOrder`로 DataGrid에 전달합니다.
- `selectedCount`와 `bulkActions`는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- Pagination은 DataToolbar 안에 넣지 않습니다. DataGrid 바로 아래에 별도 `Pagination`을 붙이고 page/pageSize/query를 제품이 제어합니다.
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)는 table pagination을 표 아래에 stack되는 별도 component로 정의합니다.
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.
