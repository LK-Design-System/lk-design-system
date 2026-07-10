**TreeSelectionPanel** — 검색·체크 가능한 계층형 다중 선택 패널. `Tree`/`TopicTree`의 pick-many 보완재이며, 토픽·TF·레이어·권한 범위처럼 계층 안에서 여러 항목을 고를 때 씁니다.

```jsx
<TreeSelectionPanel nodes={topics} defaultChecked={['/odom']} onChange={setIds} />
```

- **nodes** `{id,label,description?,meta?,searchText?,selectable?,disabled?,children?}[]` · **checked/defaultChecked** · **onChange(ids)** · **query/defaultQuery/onQueryChange** · **defaultExpanded** · **cascade** · **height**.
- Compare against common tree selection expectations before changing it: hierarchical expansion, checkbox/mixed state, cascade option, disabled/selectable distinctions, search filtering, empty/no-results states, keyboard-readable rows, and stable selected ids.
- Layer: LDS Product Data extension. It composes tree/list/search/checkbox behavior for product panels and should not replace the simpler `Tree` display primitive.
- 기본은 `cascade=true`입니다. Branch checkbox는 선택 가능한 하위 항목을 한 번에 켜고 끄며, 일부만 선택되면 mixed 상태로 표시됩니다. `cascade=false`는 leaf-only 선택이 필요한 토픽 구독 흐름에 씁니다.
- `disabled` node는 체크/row action이 잠기고, branch disabled는 하위 항목도 함께 잠긴 것으로 취급합니다. `selectable=false`는 leaf를 설명용 row로 남길 때 씁니다.
- 검색어가 있으면 매칭되는 branch가 자동으로 펼쳐지고, `searchText`가 있으면 label 대신 검색 문자열로 씁니다. 빈 데이터와 검색 결과 없음 상태를 각각 `emptyLabel`, `noResultsLabel`로 표현합니다.
- DS 관행: chevron/search/clear/check는 `Icon` registry를 쓰고, 임의 SVG나 hardcoded hex를 넣지 않습니다. 행은 compact data panel 리듬(`label2/caption1`, semantic line/fill/background token)을 따릅니다.
