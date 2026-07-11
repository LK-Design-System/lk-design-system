**TreePicker**는 계층에서 여러 대상을 선택하는 입력만 소유합니다.

```jsx
<TreePicker
  nodes={scopes}
  selectedIds={selectedIds}
  onSelectedIdsChange={setSelectedIds}
  expandedIds={expandedIds}
  onExpandedIdsChange={setExpandedIds}
/>
```

- 단순 조회·현재 위치 표시는 `Tree`를 사용합니다.
- `selectionBehavior="descendants"`는 branch 선택을 선택 가능한 leaf 범위에 적용합니다.
- `selectionBehavior="independent"`는 `selectable`인 각 node를 서로 독립적으로 선택합니다.
- Tree row가 하나의 roving Tab stop을 소유합니다. Arrow Up/Down은 비활성 행을 건너뛰며 이동하고, Arrow Right/Left는 자식/부모 또는 펼침 상태, Space/Enter는 선택을 처리합니다.
- 검색과 체크 표시는 LDS `Input`/`Checkbox`를 조합합니다. 펼침 제어는 선택 toggle이 아니므로 투명한 `IconButton`과 16px `Icon`을 사용하고, 펼침 상태는 treeitem의 `aria-expanded`가 소유합니다.
- 권한, 구독 가능 여부, 결과 개수 계산은 제품이 판단해 node 상태와 meta로 전달합니다.
- 적용/저장 action과 선택 결과 요약은 제품이 별도로 조합합니다.
