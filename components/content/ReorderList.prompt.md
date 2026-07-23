**ReorderList** — 대시보드 위젯, 규칙, 큐처럼 같은 레벨의 항목 순서를 바꾸는 범용 sortable list primitive입니다.

```jsx
<ReorderList items={panels} onReorder={setOrder} />
<ReorderList items={panels} showIndex density="compact" showMoveButtons={false} onReorder={setOrder} />
```

- **items** `{id,label,detail,trailing,disabled}[]`
- **onReorder(nextIds, meta)**: 드래그, 버튼, Alt+↑/↓ 이동 후 호출
- `onReorder`가 없으면 조작 가능한 no-op 상태를 만들지 않고 행 drag, keyboard 이동, 이동 버튼을 읽기 전용으로 전환합니다. trailing control은 독립적으로 계속 사용할 수 있습니다.
- **density** `comfortable|compact` · **showIndex**(순번 열) · **showMoveButtons**(위/아래 버튼) · **disabled**(전체 잠금) · **emptyLabel**(빈 목록 문구) · **getItemLabel(item, index)**(label이 ReactNode일 때 접근성 라벨).
- Compare against common reorderable-list expectations before changing it: drag reorder, button fallback, keyboard reorder, disabled rows, empty state, live movement announcement, stable item ids, and clear drop indicator.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Reorder List component set; borrow list/step-list spacing conventions without claiming WDS variant parity.
- 작업 단계·웨이포인트 저작처럼 번호가 의미인 시퀀스는 **StepList**를 사용합니다.

## 접근성 계약

- **끝단에서 포커스를 잃지 않습니다.** 항목을 맨 위·맨 아래로 옮기면 방금 누른 이동 버튼이 더 이상 쓸 수 없게 되는데, 이때 native `disabled`로 바꾸면 포커스가 `<body>`로 떨어져 키보드 사용자가 위치를 잃습니다. 대신 `aria-disabled`를 써서 버튼은 포커스를 유지한 채 이동만 거부합니다(APG focusable disabled control 관례). 시각 처리(흐린 배경·not-allowed 커서)는 동일합니다.
- 이동 수단은 세 가지가 모두 있어야 합니다: 드래그, 문맥명이 붙은 위/아래 버튼(`"{항목} 위로 이동"`), 그리고 행에서 Alt+↑/↓(WCAG 2.5.7 — 드래그 대체 수단).
- 이동 결과는 `role="status"` polite 영역이 `"{항목} N/M 위치로 이동"`으로 공지하고, 조작법은 숨김 안내문을 `aria-describedby`로 각 행에 연결해 알립니다. 각 행은 `aria-posinset`/`aria-setsize`로 위치와 전체 개수를 노출합니다.
- `role` prop은 `ul` 기본 시맨틱을 대체할 때만 쓰고, 목록 의미를 잃는 값(예: `presentation`)은 주지 마세요. 목록 이름은 `aria-label`로 지정합니다(기본 `"정렬 가능한 목록"`).
