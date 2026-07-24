# Data Grid

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `DataGrid` |
| Storybook | `LDS Product/Data/Collections/Data Grid` |
| Source | `../component-content.json#product-data-collections-data-grid` |

여러 열의 레코드를 비교하며 정렬·선택·확장·페이지 이동이 필요할 때 적합합니다. 읽기 전용 소규모 데이터나 단순 label/value 쌍에는 Data Grid 대신 Table 또는 Description List를 사용하세요.

## 사용 판단

### 사용

- 여러 열의 레코드를 비교하며 정렬·선택·확장·페이지 이동이 필요할 때 적합합니다. 읽기 전용 소규모 데이터나 단순 label/value 쌍에는 Data Grid 대신 Table 또는 Description List를 사용하세요.
- native table 구조, 열 header 관계, sort/selection/expansion 상태 표현.
- 열 표시·순서 설정 UI, 사용자별 저장/초기화, permission.
- width, minWidth는 header와 body에 같이 적용됩니다. Pinned 열은 안정적인 offset을 위해 pixel width를 권장하며 미지정 시 160px fallback을 사용합니다.

### 사용하지 않음

- 기존 selectedRows, defaultSelectedRows, onSelectionChange는 explicit-ID compatibility API입니다. onSelectionChange는 all-matching model을 보이는 ID 배열로 축약하지 않습니다.
- DataGrid는 로드된 rows의 자격만 판단할 수 있습니다. all-matching 작업에서 안 보이는 행의 permission·처리 가능 여부는 제품/backend가 같은 규칙으로 다시 검증하고, 서버 action은 excludedIds만 믿고 자격 검사를 생략하지 않습니다. totalCount는 전체 query 결과 수이며 DataGrid는 현재 보이는 선택 불가 ID만 선택 수량에서 안전하게 뺉니다.
- editingCell={{ rowId, columnKey }}가 column의 editor(row, rowId) slot을 선택합니다. DataGrid는 edit mode를 시작하거나 저장하지 않습니다. Editor는 제품이 controlled value, label, validation, commit/cancel을 제공해야 합니다.
- DataGrid는 virtualization/render-window API를 의도적으로 제공하지 않습니다. Native table에서 일부 row만 DOM에 두려면 전체 row count, absolute row index, focus 복원, 동적 row height, expansion과 pinned cell 동기화까지 함께 해결해야 합니다. 이 기능은 검증된 virtualizer를 가진 specialized product data surface가 소유합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DataGrid의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Table Label | Accessible name applied to the native table element. |
| Selection Entity Label | Entity noun used in select-all, bulk-band, and fallback row labels. @default "항목" |
| Get Row Selection Label | Returns the full entity name used by the row checkbox, e.g. "사용자 USR-104". |
| Render Expanded Row | One-level supplementary row detail. Supplying this enables the expansion column. |
| Bulk Actions | Selection-band action slot, or a render function receiving the lossless selection/count contract. |
| Sticky Header | Keep visible header cells at the top of the DataGrid scroll container. @default false |
| Sticky Header Offset | Sticky header inset. @default 0 |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `columns` | `DataGridColumn[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `rows` | `Row[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `visibleColumnKeys` | `string[]` | No | Controlled set of visible data-column keys. Product settings own mutation and persistence. |
| `columnOrder` | `string[]` | No | Controlled data-column order. Unknown keys are ignored and omitted keys append in source order. |
| `tableLabel` | `string` | No | Accessible name applied to the native table element. |
| `selectable` | `boolean` | No | 행 체크박스. @default false |
| `selectedRows` | `React.Key[]` | No | Controlled selected row IDs. IDs are indices when getRowId is omitted. |
| `defaultSelectedRows` | `React.Key[]` | No | Initially selected row IDs. @default [] |
| `onSelectionChange` | `(rowIds: React.Key[]) = void` | No | Legacy explicit-ID callback. It is not emitted for allMatching models. |
| `selectionModel` | `DataGridSelectionModel` | No | Lossless controlled selection. Takes precedence over selectedRows when both are provided. |
| `defaultSelectionModel` | `DataGridSelectionModel` | No | Initial uncontrolled lossless selection. Takes precedence over defaultSelectedRows. |
| `onSelectionModelChange` | `(selectionModel: DataGridSelectionModel) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `selectAllScope` | `'page' \| 'allMatching'` | No | Header checkbox target. Use allMatching with selectionModel and totalCount. @default "page" |
| `totalCount` | `number` | No | Total rows matching the active query; drives allMatching selection count. Defaults to rows.length. |
| `selectionEntityLabel` | `string` | No | Entity noun used in select-all, bulk-band, and fallback row labels. @default "항목" |
| `getRowSelectionLabel` | `(row: Row, rowId: React.Key) = string` | No | Returns the full entity name used by the row checkbox, e.g. "사용자 USR-104". |
| `getRowCanSelect` | `(row: Row, rowId: React.Key) = boolean` | No | False disables and names the row checkbox and excludes the visible row from selection operations. |
| `getRowId` | `(row: Row, index: number) = React.Key` | No | Stable row identity for sorting, paging, and selection. Defaults to the source index. |
| `sort` | `DataGridSort` | No | Controlled sort state. |
| `defaultSort` | `DataGridSort` | No | Initial uncontrolled sort state. |
| `onSortChange` | `(sort: DataGridSort) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `sortModel` | `DataGridSortEntry[]` | No | Lossless controlled multi-sort model. Takes precedence over sort. |
| `defaultSortModel` | `DataGridSortEntry[]` | No | Initial uncontrolled multi-sort model. |
| `onSortModelChange` | `(sortModel: DataGridSortEntry[]) = void` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| visibleColumnKeys | Controlled set of visible data-column keys. Product settings own mutation and persistence. 타입 계약: string[] |
| selectedRows | Controlled selected row IDs. IDs are indices when getRowId is omitted. 타입 계약: React.Key[] |
| defaultSelectedRows | Initially selected row IDs. @default [] 타입 계약: React.Key[] |
| expandedRowIds | Controlled expanded row IDs. 타입 계약: React.Key[] |
| defaultExpandedRowIds | Initially expanded row IDs. @default [] 타입 계약: React.Key[] |
| onExpandedRowIdsChange | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (rowIds: React.Key[]) = void |
| renderExpandedRow | One-level supplementary row detail. Supplying this enables the expansion column. 타입 계약: (row: Row, rowId: React.Key) = React.ReactNode |
| loading | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| loadingLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| stateActions | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |

## Behavior and interaction

- native table 구조, 열 header 관계, sort/selection/expansion 상태 표현.
- controlled editor slot의 위치 결정.
- 열 표시·순서 설정 UI, 사용자별 저장/초기화, permission.
- server query, pagination request, sort 직렬화, 선택 mutation.
- visibleColumnKeys는 표시할 data column key의 controlled projection입니다. 최소 한 개의 data column을 유지하세요.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | visibleColumnKeys는 표시할 data column key의 controlled projection입니다. 최소 한 개의 data column을 유지하세요. |
| 명시 규칙 2 | width, minWidth는 header와 body에 같이 적용됩니다. Pinned 열은 안정적인 offset을 위해 pixel width를 권장하며 미지정 시 160px fallback을 사용합니다. |
| 명시 규칙 3 | 결측 셀은 column render에서 보이는 —와 스크린리더용 값 없음을 함께 제공하세요. 빈 문자열, 결측, 숫자 0은 서로 다른 데이터이므로 같은 표시로 합치지 않습니다. |
| 명시 규칙 4 | Carbon Data table usage: toolbar/table settings, selectable·expandable rows, 별도 pagination anatomy를 따릅니다. Expansion은 1단계 supplementary content에 한정하고 기본 expand-all은 제공하지 않습니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- visible/order projection, width/minWidth, pinned offset, sticky header.
- width, minWidth는 header와 body에 같이 적용됩니다. Pinned 열은 안정적인 offset을 위해 pixel width를 권장하며 미지정 시 160px fallback을 사용합니다.
- stickyHeader는 DataGrid scroll container 안의 보이는 header/bulk band를 고정합니다. 제품이 style.maxHeight 등 실제 vertical scroll 경계를 제공합니다. stickyHeaderOffset은 상단 shell과 겹칠 때만 사용합니다.
- DataGrid는 virtualization/render-window API를 의도적으로 제공하지 않습니다. Native table에서 일부 row만 DOM에 두려면 전체 row count, absolute row index, focus 복원, 동적 row height, expansion과 pinned cell 동기화까지 함께 해결해야 합니다. 이 기능은 검증된 virtualizer를 가진 specialized product data surface가 소유합니다.

## Content and writing

- WAI-ARIA에는 다중 정렬 우선순위를 표현하는 값이 없으므로 aria-sort는 첫 번째 sort header에만 둡니다. 모든 sorted button의 accessible name과 작은 숫자 표식이 우선순위·방향을 보완합니다.
- 선택 수량과 loading/empty 전환은 표 위에 상시 마운트된 숨김 status region 두 개가 공지합니다. bulk band와 상태 행은 메시지와 함께 삽입되므로 그 자체는 표현 전용이고, 오류만 삽입 시 낭독이 명세로 보장되는 role="alert"를 상태 행이 직접 사용합니다.
- getRowCanSelect(row, rowId)가 false인 보이는 행은 이름이 있는 disabled checkbox를 렌더하고 page select-all 수량·토글·callback ID에서 제외합니다. 이미 all-matching이라도 DataGrid가 현재 보는 선택 불가 ID를 excludedIds에 합친 안전한 model만 bulk slot·다음 callback에 넘깁니다.
- toggle은 entity 기반 이름, aria-expanded, aria-controls를 가진 native button입니다. 상세 영역은 같은 행의 보조 정보 한 단계에만 사용합니다. 복잡한 workflow나 넓은 편집 화면은 Drawer/page로 이동합니다.

## Accessibility

- loading/error/empty surface와 bulk band의 접근성·시각 계층.
- 숨긴 열이 있어도 aria-colcount는 전체 논리 열 수, 보이는 header/cell의 aria-colindex는 원래 논리 위치를 유지합니다.
- multiSort는 modifier key 없이 각 header activation을 미정렬 → 오름차순 → 내림차순 → 제거로 순환합니다. 따라서 pointer와 Enter/Space가 같은 계약을 가집니다.
- WAI-ARIA에는 다중 정렬 우선순위를 표현하는 값이 없으므로 aria-sort는 첫 번째 sort header에만 둡니다. 모든 sorted button의 accessible name과 작은 숫자 표식이 우선순위·방향을 보완합니다.
- 선택 수량과 loading/empty 전환은 표 위에 상시 마운트된 숨김 status region 두 개가 공지합니다. bulk band와 상태 행은 메시지와 함께 삽입되므로 그 자체는 표현 전용이고, 오류만 삽입 시 낭독이 명세로 보장되는 role="alert"를 상태 행이 직접 사용합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | native table 구조, 열 header 관계, sort/selection/expansion 상태 표현. |
| Don't | 기존 selectedRows, defaultSelectedRows, onSelectionChange는 explicit-ID compatibility API입니다. onSelectionChange는 all-matching model을 보이는 ID 배열로 축약하지 않습니다. |
| Do | 열 표시·순서 설정 UI, 사용자별 저장/초기화, permission. |
| Don't | DataGrid는 로드된 rows의 자격만 판단할 수 있습니다. all-matching 작업에서 안 보이는 행의 permission·처리 가능 여부는 제품/backend가 같은 규칙으로 다시 검증하고, 서버 action은 excludedIds만 믿고 자격 검사를 생략하지 않습니다. totalCount는 전체 query 결과 수이며 DataGrid는 현재 보이는 선택 불가 ID만 선택 수량에서 안전하게 뺉니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DataGrid의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Pagination` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-status-negative-text`
- `--font-sans`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--label2-size`
- `--radius-5`
- `--radius-lg`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-8`

### Source contracts

- `components/data/DataGrid.jsx`
- `components/data/DataGrid.d.ts`
- `components/data/DataGrid.prompt.md`
- `stories/DataGrid.stories.jsx`

## Migration

- pinned="start|end"가 논리 방향 API입니다. left|right는 LTR compatibility alias입니다. Expansion과 selection utility 열은 항상 start edge에 남습니다.
- sortModel은 우선순위 순 { key, dir }[]이며 legacy sort보다 우선합니다. sortingMode="manual"은 서버 순서를 그대로 두고 변경만 emit합니다.
- 기존 selectedRows, defaultSelectedRows, onSelectionChange는 explicit-ID compatibility API입니다. onSelectionChange는 all-matching model을 보이는 ID 배열로 축약하지 않습니다.
- - visibleColumnKeys는 표시할 data column key의 controlled projection입니다. 최소 한 개의 data column을 유지하세요. - columnOrder는 알려진 key만 순서대로 적용하고 누락 key는 원래 순서로 뒤에 붙입니다. pinned 열은 start · center · end 그룹으로 이동한 뒤 각 그룹 안에서 이 순서를 따릅니다. - width, minWidth는 header와 body에 같이 적용됩니다. Pinned 열은 안정적인 offset을 위해 pixel width를 권장하며 미지정 시 160px fal….

## Sources

- DataGrid prompt contract: `components/data/DataGrid.prompt.md`
- Storybook implementation evidence: `stories/DataGrid.stories.jsx`
- [SAP Fiori data table usage](https://www.sap.com/design-system/fiori-design-android/v25-4/components/data-table/usage)
- [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- [Carbon Data table accessibility](https://carbondesignsystem.com/components/data-table/accessibility/)
- [Carbon Pagination usage](https://carbondesignsystem.com/components/pagination/usage/)
- [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [WAI-ARIA APG Grid and Table Properties](https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/)
- [WAI-ARIA 1.2 aria-expanded/aria-controls](https://www.w3.org/TR/wai-aria/#aria-expanded)
