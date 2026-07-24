## Numeric columns

Shared header/body cell styles enable tabular numerals by default. Comparable numeric columns use `align: 'right'`; identifier-like numbers stay left aligned. See [SAP Fiori data table usage](https://www.sap.com/design-system/fiori-design-android/v25-4/components/data-table/usage).

**DataGrid** — 정렬·선택·열 설정·확장 행이 필요한 운영 데이터 표.

Classification: **LK Product Extension**. WDS Core 축을 추정하지 않으며, `Table`의 셀·divider·density 위에 dashboard/server collection 계약을 추가합니다.

```jsx
const [selectionModel, setSelectionModel] = React.useState({
  mode: 'explicit',
  selectedIds: [],
});
const [sortModel, setSortModel] = React.useState([]);
const [expandedRowIds, setExpandedRowIds] = React.useState([]);

<DataGrid
  tableLabel="사용자 운영 목록"
  columns={[
    { key: 'id', label: '계정', sortable: true, width: 160, pinned: 'start' },
    { key: 'site', label: '설치 위치', sortable: true, minWidth: 280 },
    { key: 'status', label: '상태', width: 120 },
  ]}
  rows={query.page}
  visibleColumnKeys={visibleColumnKeys}
  columnOrder={columnOrder}
  stickyHeader
  getRowId={(row) => row.id}
  getRowSelectionLabel={(row) => `사용자 ${row.id}`}
  getRowCanSelect={(row) => row.permission !== 'readOnly'}
  selectionEntityLabel="사용자"
  selectable
  selectionModel={selectionModel}
  onSelectionModelChange={setSelectionModel}
  selectAllScope="allMatching"
  totalCount={query.totalCount}
  sortModel={sortModel}
  onSortModelChange={setSortModel}
  multiSort
  sortingMode="manual"
  expandedRowIds={expandedRowIds}
  onExpandedRowIdsChange={setExpandedRowIds}
  renderExpandedRow={(row) => <DescriptionList items={row.details} />}
/>
```

## DS와 제품의 소유권

DataGrid가 소유하는 것:

- native table 구조, 열 header 관계, sort/selection/expansion 상태 표현
- visible/order projection, width/minWidth, pinned offset, sticky header
- loading/error/empty surface와 bulk band의 접근성·시각 계층
- controlled editor slot의 위치 결정

제품이 소유하는 것:

- 열 표시·순서 설정 UI, 사용자별 저장/초기화, permission
- server query, pagination request, sort 직렬화, 선택 mutation
- cell validation, save/cancel, optimistic update, conflict 처리
- detail data fetch와 cache

`DataToolbar.actions`에는 열 설정 trigger를 둘 수 있지만 설정 menu/drawer와 persistence는 DataGrid에 넣지 않습니다. `Pagination`은 DataGrid 바로 아래에 별도로 조합하고 page/pageSize/query를 제품이 제어합니다.

## 열 표시·순서·크기·고정

- `visibleColumnKeys`는 표시할 data column key의 controlled projection입니다. 최소 한 개의 data column을 유지하세요.
- `columnOrder`는 알려진 key만 순서대로 적용하고 누락 key는 원래 순서로 뒤에 붙입니다. `pinned` 열은 `start · center · end` 그룹으로 이동한 뒤 각 그룹 안에서 이 순서를 따릅니다.
- `width`, `minWidth`는 header와 body에 같이 적용됩니다. Pinned 열은 안정적인 offset을 위해 pixel `width`를 권장하며 미지정 시 160px fallback을 사용합니다.
- `pinned="start|end"`가 논리 방향 API입니다. `left|right`는 LTR compatibility alias입니다. Expansion과 selection utility 열은 항상 start edge에 남습니다.
- 숨긴 열이 있어도 `aria-colcount`는 전체 논리 열 수, 보이는 header/cell의 `aria-colindex`는 원래 논리 위치를 유지합니다.
- `stickyHeader`는 DataGrid scroll container 안의 보이는 header/bulk band를 고정합니다. 제품이 `style.maxHeight` 등 실제 vertical scroll 경계를 제공합니다. `stickyHeaderOffset`은 상단 shell과 겹칠 때만 사용합니다.

## 정렬

- 기존 `sort`, `defaultSort`, `onSortChange`는 단일 정렬 API로 유지됩니다.
- `sortModel`은 우선순위 순 `{ key, dir }[]`이며 legacy `sort`보다 우선합니다. `sortingMode="manual"`은 서버 순서를 그대로 두고 변경만 emit합니다.
- `multiSort`는 modifier key 없이 각 header activation을 `미정렬 → 오름차순 → 내림차순 → 제거`로 순환합니다. 따라서 pointer와 Enter/Space가 같은 계약을 가집니다.
- WAI-ARIA에는 다중 정렬 우선순위를 표현하는 값이 없으므로 `aria-sort`는 첫 번째 sort header에만 둡니다. 모든 sorted button의 accessible name과 작은 숫자 표식이 우선순위·방향을 보완합니다.

## 선택과 bulk band

- 선택 수량과 loading/empty 전환은 표 위에 **상시 마운트된 숨김 status region** 두 개가
  공지합니다. bulk band와 상태 행은 메시지와 함께 삽입되므로 그 자체는 표현 전용이고,
  오류만 삽입 시 낭독이 명세로 보장되는 `role="alert"`를 상태 행이 직접 사용합니다.

- `selectionModel`은 `{ mode: 'explicit', selectedIds }` 또는 `{ mode: 'allMatching', excludedIds }`입니다. 후자는 현재 서버 query 전체에서 일부 ID만 제외합니다.
- `totalCount`는 현재 query의 전체 결과 수이며 `allMatching` band 수량은 `totalCount - excludedIds.length`입니다.
- `selectAllScope="page"`는 현재 `rows`만 토글합니다. `selectAllScope="allMatching"`은 페이지를 넘어 전체 query 결과를 토글하므로 lossless model API와 함께 사용합니다.
- 기존 `selectedRows`, `defaultSelectedRows`, `onSelectionChange`는 explicit-ID compatibility API입니다. `onSelectionChange`는 all-matching model을 보이는 ID 배열로 축약하지 않습니다.
- query/filter가 바뀌면 제품이 selection model을 초기화하거나 새 query에 맞게 재검증합니다.
- `getRowCanSelect(row, rowId)`가 `false`인 보이는 행은 이름이 있는 disabled checkbox를 렌더하고 page select-all 수량·토글·callback ID에서 제외합니다. 이미 all-matching이라도 DataGrid가 현재 보는 선택 불가 ID를 `excludedIds`에 합친 안전한 model만 bulk slot·다음 callback에 넘깁니다.
- DataGrid는 로드된 `rows`의 자격만 판단할 수 있습니다. all-matching 작업에서 안 보이는 행의 permission·처리 가능 여부는 제품/backend가 같은 규칙으로 다시 검증하고, 서버 action은 `excludedIds`만 믿고 자격 검사를 생략하지 않습니다. `totalCount`는 전체 query 결과 수이며 DataGrid는 현재 보이는 선택 불가 ID만 선택 수량에서 안전하게 뺉니다.
- `bulkActions`는 React node 또는 `{ selectionModel, selectedCount, totalCount, pageSelectedCount, clearSelection }` render 함수입니다. 서버 action에는 보이는 page ID가 아니라 `selectionModel`을 전달합니다.

## 확장 행·행 진입·inline editor

- `renderExpandedRow`를 주면 expansion 열이 selection보다 먼저 나타납니다. `expandedRowIds`, `defaultExpandedRowIds`, `onExpandedRowIdsChange`는 controlled/uncontrolled 상태를 제공합니다.
- toggle은 entity 기반 이름, `aria-expanded`, `aria-controls`를 가진 native button입니다. 상세 영역은 같은 행의 보조 정보 한 단계에만 사용합니다. 복잡한 workflow나 넓은 편집 화면은 Drawer/page로 이동합니다.
- `getRowCanExpand`로 일부 행을 leaf로 둘 수 있습니다. 제품은 필요한 detail fetch/loading/error를 `renderExpandedRow` 안에서 표현합니다.
- `onRowActivate`는 빈 행 표면의 pointer와 Enter/Space만 처리합니다. native control 및 `role="button|checkbox|switch|link|…"`인 custom control의 pointer·keyboard event는 행 진입으로 번지지 않습니다.
- `editingCell={{ rowId, columnKey }}`가 column의 `editor(row, rowId)` slot을 선택합니다. DataGrid는 edit mode를 시작하거나 저장하지 않습니다. Editor는 제품이 controlled value, label, validation, commit/cancel을 제공해야 합니다.

## 상태와 대용량 데이터

- `loading`, `error`, `emptyLabel`, `stateActions`는 현재 page surface 상태입니다. 이전 데이터 보존·refreshing·stale 계약은 상위 resource state가 담당합니다.
- 결측 셀은 column `render`에서 보이는 `—`와 스크린리더용 `값 없음`을 함께 제공하세요.
  빈 문자열, 결측, 숫자 `0`은 서로 다른 데이터이므로 같은 표시로 합치지 않습니다.
- DataGrid는 virtualization/render-window API를 의도적으로 제공하지 않습니다. Native table에서 일부 row만 DOM에 두려면 전체 row count, absolute row index, focus 복원, 동적 row height, expansion과 pinned cell 동기화까지 함께 해결해야 합니다. 이 기능은 검증된 virtualizer를 가진 specialized product data surface가 소유합니다.
- `Pagination`은 DOM을 작게 유지하는 기본 전략입니다. Carbon 권장처럼 표 바로 아래, padding 없이 붙이고 row density와 가까운 높이를 선택합니다.

## 공식 근거와 설계 결론

- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/): toolbar/table settings, selectable·expandable rows, 별도 pagination anatomy를 따릅니다. Expansion은 1단계 supplementary content에 한정하고 기본 expand-all은 제공하지 않습니다.
- [Carbon Data table accessibility](https://carbondesignsystem.com/components/data-table/accessibility/): sortable header와 expandable row control은 native Tab 순서 및 Enter/Space 동작을 유지합니다.
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/): Pagination은 data table 아래에 간격 없이 stack되는 별도 controlled component입니다.
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/): native HTML table, `scope="col"`, 현재 sort header의 `aria-sort`를 유지합니다.
- [WAI-ARIA APG Grid and Table Properties](https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/): hidden column의 전체 count/index를 보존하고, ARIA가 multi-sort level을 표현하지 못하므로 여러 header에 `aria-sort`를 남발하지 않습니다.
- [WAI-ARIA 1.2 aria-expanded/aria-controls](https://www.w3.org/TR/wai-aria/#aria-expanded): detail이 button 밖에 있을 때 toggle의 `aria-controls`로 관계를 연결합니다.

## LDS 시각 delta inventory

- `Table`과 header/body padding, typography, divider, density, radius를 공유하고 `DataToolbar`는 검색·filter·global settings trigger만 소유합니다.
- `variant="embedded"`는 `DataToolbar` + `DataGrid` + `Pagination`을 하나의 외곽 surface(감싸는 `section`·`Card`·`DockPanel`)로 묶을 때 그리드 자체 border·radius를 생략합니다. 부모가 연속된 외곽선을 소유하고 내부는 divider로만 구분하며, 부모 표면 안에서 `style`로 border/radius를 덮어쓰지 않습니다. 기본값 `standalone`은 자체 외곽선을 그립니다.
- 기존 DataGrid의 16px checkbox, selected row fill, same-height bulk band, sm/md header 높이를 유지합니다.
- Pinned cell은 별도 shadow나 inset marker를 만들지 않고 기존 elevated/selected fill과 divider만 사용합니다. Sticky header도 새 surface를 추가하지 않습니다.
- Expansion은 공용 32px plain `IconButton`, sort priority는 기존 header icon 옆 보조 숫자만 사용합니다. Screen-specific chrome은 추가하지 않습니다.
