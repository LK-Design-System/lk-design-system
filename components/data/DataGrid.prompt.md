**DataGrid** — 클릭 정렬 헤더와 선택 행(옵션)이 있는 `Table`.

```jsx
<DataGrid selectable
  getRowId={(row) => row.id}
  selectedRows={selectedIds}
  onSelectionChange={setSelectedIds}
  sort={sort}
  sortingMode="manual"
  onSortChange={setSort}
  loading={query.loading}
  error={query.error}
  onRowActivate={(row) => openDetail(row.id)}
  columns={[
    { key: 'code', label: '모델', sortable: true },
    { key: 'hours', label: '가동시간', sortable: true, align: 'right' },
  ]}
  rows={[{ code: 'LKR-T1', hours: 1240 }, { code: 'LKR-CP', hours: 980 }]} />
```

- **columns** — `{ key, label, align, sortable, render }`. 정적 표에는 `Table`을 쓰세요.
- 서버 목록은 stable `getRowId`, controlled `sort`, `sortingMode="manual"`, `onSortChange`를 사용합니다.
- `loading`, `error`, `emptyLabel`, `stateActions`로 resource 상태를 표 안에서 일관되게 표시합니다.
- `onRowActivate`는 클릭과 Enter/Space 진입을 함께 제공합니다.
