**ReorderList** — 대시보드 위젯, 규칙, 큐처럼 같은 레벨의 항목 순서를 바꾸는 범용 sortable list primitive입니다.

```jsx
<ReorderList items={panels} onReorder={setOrder} />
```

- **items** `{id,label,detail,trailing,disabled}[]`
- **onReorder(nextIds, meta)**: 드래그, 버튼, Alt+↑/↓ 이동 후 호출
- Compare against common reorderable-list expectations before changing it: drag reorder, button fallback, keyboard reorder, disabled rows, empty state, live movement announcement, stable item ids, and clear drop indicator.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Reorder List component set; borrow list/step-list spacing conventions without claiming WDS variant parity.
- 작업 단계·웨이포인트 저작처럼 번호가 의미인 시퀀스는 **StepList**를 사용합니다.
