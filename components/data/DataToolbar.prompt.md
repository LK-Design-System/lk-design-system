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
  filters={({ size }) => (
    <Select size={size} value={status} onChange={setStatus}>
      <option value="all">전체 상태</option>
      <option value="online">온라인</option>
    </Select>
  )}
  actions={<Button size="sm">내보내기</Button>}
/>
```

- 검색은 제어/비제어 모두 가능합니다. `searchValue`와 `onSearchChange`를 주면 제어됩니다.
- `filters`는 query를 좁히는 chip/menu 슬롯, `actions`는 열 표시·순서 설정 trigger, 내보내기 같은 전체 표 action 슬롯입니다. `filters`에 함수를 주면 `{ size }`를 받아 검색과 같은 field control 밀도를 `Select`·`SearchField` 같은 자식에게 전달할 수 있습니다. 기존 ReactNode 슬롯도 그대로 지원합니다. 설정 UI와 저장 상태는 제품이 소유하고 `visibleColumnKeys`/`columnOrder`로 DataGrid에 전달합니다.
- `size="sm"`은 검색과 render-prop filter control에 32px compact 밀도를, 기본 `md`는 48px field 밀도를 제공합니다. action용 Button 척도와 field 척도는 전역에서 합치지 않습니다. `FilterChip`은 고유 32px pill 높이를 유지하며 control 행 중앙에 정렬됩니다.
- `selectedCount`와 `bulkActions`는 DataToolbar props가 아닙니다. 선택 수, 선택 해제, bulk action은 DataGrid의 같은 높이 selection band에 둡니다.
- Pagination은 DataToolbar 안에 넣지 않습니다. DataGrid 바로 아래에 별도 `Pagination`을 붙이고 page/pageSize/query를 제품이 제어합니다.
- `variant="embedded"`는 DataToolbar를 부모 표면(감싸는 `section`·`Card`) 안의 헤더로 결합할 때 자체 border·radius를 제거하고 하단 divider만 남깁니다. `DataGrid variant="embedded"`와 함께 collection 패턴을 하나의 연속 외곽선으로 묶으며, `style`로 border/radius를 덮어쓰지 않습니다. 기본값 `standalone`은 페이지 레벨 표면으로 자체 외곽선을 그립니다.
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)는 기본 table toolbar를 검색·필터·설정·export 같은 global action에, 선택 후 batch action bar를 선택 항목 작업에 사용합니다. LDS도 이 소유권 분리를 따릅니다.
- [PatternFly Toolbar design guidelines](https://v4-archive.patternfly.org/v4/components/toolbar/design-guidelines/)는 search filter와 filter group을 하나의 연관된 그룹으로 배치하고 모든 toolbar item을 세로 중앙 정렬합니다. LDS는 검색과 field형 필터에 같은 `size`를 전달하고, 고유 높이를 가진 chip은 늘리지 않고 중앙 정렬합니다.
- [PatternFly Filters](https://www.patternfly.org/patterns/filters/design-guidelines/)는 text entry·single select·filter group을 같은 toolbar 안에서 조합할 수 있는 필터 유형으로 구분합니다. 따라서 LDS는 임의 자식을 강제로 clone하거나 높이를 덮지 않고 render-prop context로 field control 밀도만 전달합니다.
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)는 table pagination을 표 아래에 stack되는 별도 component로 정의합니다.
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)에 따라 DataToolbar가 표의 native semantics나 keyboard model을 대신하지 않습니다. 검색과 action은 각 native control의 정상 Tab 순서를 유지합니다.

## Search-optional collections

`searchable` defaults to `true` for backward compatibility. Set `searchable={false}` when the product has no search state or search behavior. If filters are present, the filter row remains; if neither search nor filters are present, the controls row is omitted entirely.

```jsx
<DataToolbar
  variant="embedded"
  searchable={false}
  title="Documents"
  count={documents.length}
  actions={<Button size="sm">Sort</Button>}
/>
```
