**DataGrid** — 클릭 정렬 헤더와 선택 행(옵션)이 있는 `Table`.

```jsx
<DataGrid selectable onSelectionChange={setSel}
  columns={[
    { key: 'code', label: '모델', sortable: true },
    { key: 'hours', label: '가동시간', sortable: true, align: 'right' },
  ]}
  rows={[{ code: 'LKR-T1', hours: 1240 }, { code: 'LKR-CP', hours: 980 }]} />
```

- **columns** — `{ key, label, align, sortable, render }`. **selectable / onSelectionChange**. 정적 표에는 `Table`을 쓰세요.
