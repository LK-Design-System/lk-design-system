**NetworkGraph** — 대상과 그 사이의 관계를 노드·엣지로 그리는 관계도. Classification: **LDS Product Data Extension**.

```jsx
<NetworkGraph
  label="회사 지식망"
  layout="layered"
  nodes={[
    { id: 'portal', label: 'LK Portal', caption: '프로젝트', color: kindColor.project, root: true },
    { id: 'gateway', label: 'Context Gateway', caption: '시스템', color: kindColor.system, depth: 1 },
    { id: 'jin', label: '장진혁', caption: '개발자', color: kindColor.developer, depth: 1, collapsedCount: 3 },
  ]}
  edges={[
    { id: 'e1', from: 'portal', to: 'gateway', label: '사용함' },
    { id: 'e2', from: 'jin', to: 'portal', label: '기여함', count: 4 },
  ]}
  selectedNodeId={selected?.id}
  onSelectNode={(node) => openDetail(node)}
  onToggleNode={(node) => expand(node)}
/>
```

## Contract

- `nodes`/`edges`는 평평한 배열이고 `id`로 잇습니다. 존재하지 않는 끝점을 가리키는 엣지는 그리지 않습니다.
- **색은 앱이 소유합니다.** `node.color`와 `edge.color`는 유형을 구분하는 데이터이지 장식이 아니므로, 시맨틱 토큰으로 바꾸면 구분 자체가 사라집니다. 컴포넌트는 색을 받기만 하고 정하지 않습니다. 색을 주지 않으면 `nodeColor`/`edgeColor` 기본값을 씁니다.
- **상태는 색과 다른 축입니다.** `state`는 색을 바꾸지 않고 불투명도와 파선으로만 표현합니다. 「무엇인가」(색)와 「지금 어떤가」(상태)가 한 값에서 섞이면 둘 다 읽을 수 없게 됩니다. `Legend`로 색을 설명할 때 상태가 색을 흔들지 않는 것도 같은 이유입니다.
- **배치는 전략입니다.** `layered`는 `root`/`depth`로 층을 쌓고, `columns`는 `column`으로 단계를 고정하며, `manual`은 `x`/`y`를 그대로 씁니다. 어떤 전략이든 같은 입력이면 같은 좌표가 나옵니다 — 위치 결정은 정렬된 순서와 안정 해시에서만 나오고 난수를 쓰지 않으므로 시각 회귀 시험이 성립합니다.
- **노드는 포커스 가능한 컨트롤입니다.** 노드 묶음이 하나의 tab stop(roving tabindex)이 되고, 방향키로 옮겨 다니며 `Enter`/`Space`로 선택합니다. `onToggleNode`를 주면 `+`/`-`와 더블클릭으로 이웃을 펼치고 접으며 `aria-expanded`가 따라갑니다.
- **바깥 SVG에 `role="img"`를 쓰지 않습니다.** `img`는 하위 트리를 통째로 presentational로 만들어, 포커스는 가는데 보조기술은 무엇에 닿았는지 말하지 못하는 상태를 만듭니다. 그림 전체의 이름은 `label`이 갖고, 노드는 각자 이름을 갖습니다.
- `summary`를 주지 않으면 대상·관계 수와 이름 목록으로 자동 생성해 보이지 않는 요약으로 연결합니다. 스크린 리더가 그림을 훑지 않고도 규모를 알 수 있어야 합니다.
- 엣지 곡선은 가늘어서 누르기 어려우므로, `onSelectEdge`를 주면 투명한 넓은 선을 겹쳐 표적을 넓힙니다.
- `count`는 접혀 있는 동일 관계의 수, `collapsedCount`는 접혀 있는 이웃의 수입니다. 둘 다 1 이상일 때만 표시합니다.
- 액자·확대 조절·범례는 이 컴포넌트가 그리지 않습니다. `ViewerFrame`, `ViewerToolbar`, `Legend`와 조합하세요 — 관계도는 그림만 소유합니다.

## Anatomy

- 노드: 둥근 사각 면 + 유형 색 테두리 + 유형 색 점 + 이름 + 부가 한 줄 + 접힘 배지
- 엣지: 베지어 곡선 + 방향 화살표(`directed={false}`로 끔) + 곡선 위 라벨
- 빈 상태: `emptyLabel`

## Do not

- 상태를 색으로 표현하지 마세요. 유형 색과 충돌합니다.
- 관계도 안에 액자나 툴바를 그리지 마세요. 조합의 몫입니다.
- 좌표를 난수로 흔들지 마세요. 시각 회귀 시험이 깨집니다.
