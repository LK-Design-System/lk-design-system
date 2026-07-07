**DataToolbar** — `DataGrid`/`Table` 위에 붙는 검색, 필터, 결과 수, 선택 bulk action 툴바.

```jsx
<DataToolbar
  title="사용자 목록"
  count={24}
  searchPlaceholder="사용자 검색"
  filters={<FilterChip selected>온라인</FilterChip>}
  selectedCount={2}
  bulkActions={<Button size="sm">권한 변경</Button>}
/>
```

- 검색은 제어/비제어 모두 가능합니다. `searchValue`와 `onSearchChange`를 쓰면 제어됩니다.
- 필터와 액션은 슬롯입니다. 테이블마다 임의 toolbar 레이아웃을 만들지 말고 이 컴포넌트로 수렴시키세요.
