# TreePicker

`TreePicker`는 계층에서 여러 값을 선택하는 **LK Product Data 입력 확장**입니다. 단순 탐색·현재 위치 표시에는 기존 `Tree`/`TreeView`를 사용하고, 선택값을 form 또는 filter 상태로 제출해야 할 때만 사용합니다. WDS Core parity가 아닙니다.

```jsx
<TreePicker
  nodes={scopes}
  selectedIds={selectedIds}
  onSelectedIdsChange={setSelectedIds}
  expandedIds={expandedIds}
  onExpandedIdsChange={setExpandedIds}
/>
```

## 재사용 계약

- anatomy는 LDS `Input` 검색, border가 있는 `tree`, 행별 caret·`Checkbox`·label/description·optional meta입니다. 적용/저장 action, 선택 요약, 권한 요청은 제품 화면이 별도로 조합합니다.
- focus와 selection은 서로 다른 상태입니다. tree 전체에는 roving Tab stop 하나만 있고, 선택은 `aria-checked`, 현재 focus는 LDS focus ring으로 표현합니다. 선택 색만으로 focus를 대신하지 않습니다.
- `Arrow Up/Down`은 보이는 활성 행 사이를 이동하고, `Home/End`는 처음/끝, `Arrow Right/Left`는 펼침·자식·부모 이동, `Space`는 선택 toggle입니다. `Enter`도 LDS 호환 입력으로 같은 toggle을 제공합니다. printable key typeahead는 다음 일치 label로 이동합니다.
- `treeitem` 하나가 `aria-expanded`, `aria-checked`, `aria-disabled`와 keyboard contract를 소유합니다. caret은 pointer hit target만 넓히는 시각 affordance이며 별도 Tab stop이나 중복 접근성 이름을 만들지 않습니다.
- `selectionBehavior="descendants"`에서 branch checkbox는 선택 가능한 활성 descendant의 집계입니다. disabled descendant는 parent action과 checked/mixed 계산에서 제외되어, 선택할 수 없는 항목 때문에 parent가 영구적으로 mixed가 되지 않습니다.
- `selectionBehavior="independent"`는 `selectable`인 각 node만 독립적으로 선택합니다. branch를 직접 선택하려면 그 branch에 `selectable: true`를 명시합니다.
- 검색은 일치한 descendant의 hierarchy를 보존하고 결과 경로를 임시로 펼칩니다. 검색 중 caret action으로 원래 expansion state를 바꾸지 않습니다.
- disabled node와 그 descendant는 focus·선택·펼침 action에서 제외합니다. 첫 node가 disabled여도 첫 번째 활성 node가 roving Tab stop을 받습니다.
- label은 좁은 폭에서 말줄임하고 문자열 label에는 전체 값을 확인할 native title을 제공합니다. description도 말줄임하며 meta는 공간이 부족하면 다음 줄로 wrap합니다. 320px 안팎에서 horizontal overflow를 만들지 않습니다.
- 같은 level에서 아이콘을 쓸 경우 모두 같은 종류·크기로 제공하거나 모두 생략합니다. node별 장식 icon이나 application status chrome은 이 입력의 책임이 아닙니다.

## 내부 일관성 점검

- hierarchy와 roving focus는 LDS `Tree`/`TreeView`, 입력과 selection visual은 `Input`/`Checkbox`, caret 크기·hover·focus·disabled·spacing은 LDS icon control과 data-row token 관행을 기준으로 맞췄습니다.
- `Tree`를 복제하지 않고 multi-select form contract만 추가합니다. navigation link, drag-and-drop reorder, lazy load, context action은 별도 component를 사용합니다.

## 외부 참고와 반영 결론

- [WAI-ARIA APG Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/): roving Tab stop, 방향키·Home/End·Space, typeahead, focus와 selection의 분리를 구현했습니다.
- [Adobe Spectrum Tree View](https://spectrum.adobe.com/page/tree-view/): caret hit area, hover/focus/disabled, 긴 label truncation, filter hierarchy를 반영했습니다.
- [Carbon Design System Tree View](https://carbondesignsystem.com/components/tree-view/usage/): caret과 row selection target을 구분하고 일관된 icon 사용 원칙을 채택했습니다.
- [Carbon Design System Checkbox](https://carbondesignsystem.com/components/checkbox/usage/): parent/child checked·indeterminate 집계 원칙을 disabled descendant까지 명확히 적용했습니다.

의도적으로 drag/reorder, lazy loading, inline rename, per-node action menu, 적용/저장 CTA, 권한 workflow는 제외했습니다. 필요한 경우 Product extension이나 application layer에서 조합합니다.
