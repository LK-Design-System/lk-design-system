**Table** — 대문자 캡션 헤더, tabular 행, 부드러운 호버 워시가 있는 차분한 데이터 표.

```jsx
<Table
  columns={[
    { key: 'code', label: '모델' },
    { key: 'site', label: '현장' },
    { key: 'status', label: '상태', render: (r) => <StatusBadge tone={r.tone}>{r.status}</StatusBadge> },
  ]}
  rows={[{ code: 'LKR-T1', site: '판교 물류센터', status: '가동중', tone: 'positive' }]}
/>
```

- **columns** — `{ key, label, align, width, render }`. **rows** — 데이터 객체. **size** `sm · md`. **hover** — 행 워시. 상태 점·링크·액션에는 `render`를 쓰세요.
