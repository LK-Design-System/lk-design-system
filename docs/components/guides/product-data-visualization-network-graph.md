# Network Graph

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `NetworkGraph` |
| Storybook | `LDS Product/Data/Visualization/Network Graph` |
| Source | `../component-content.json#product-data-visualization-network-graph` |

대상 사이의 연결 자체가 답인 화면에 씁니다. 값의 크기를 비교할 때는 Bar Chart, 시간에 따른 변화는 Line Chart, 공간 위의 위치는 Map2DCanvas를 쓰세요. 액자·확대 조절·범례는 ViewerFrame · ViewerToolbar · Legend와 조합합니다.

## 사용 판단

### 사용

- force 배치도 dot 전용입니다. card에 주면 층 배치로 돌아갑니다. 흐름도에서는 위치가 곧 의미이고(왼쪽이 앞 단계), 사용자가 배치한 자리는 사용자의 저작물입니다. 물리가 노드를 옮기면 둘 다 무너집니다 — n8n·Node-RED·Blender·Unreal 어디도 노드를 스스로 움직이게 두지 않습니다.
- 액자·확대 조절·범례는 이 컴포넌트가 그리지 않습니다. 미니맵도 마찬가지입니다 — 미니맵은 「지금 어디를 보고 있는가」를 말하는 장치이고, 그 「보는 창」을 소유한 것은 관계도가 아니라 액자입니다. 관계도는 그림 전체를 좌표계 그대로 그리고, 그 중 얼마를 보여 줄지는 조합이 정합니다. ViewerFrame, ViewerToolbar, Legend와 조합하세요 — 관계도는 그림만 소유합니다.

### 사용하지 않음

- nodes/edges는 평평한 배열이고 id로 잇습니다. 존재하지 않는 끝점을 가리키는 엣지는 그리지 않습니다.
- 색은 앱이 소유합니다. node.color와 edge.color는 유형을 구분하는 데이터이지 장식이 아니므로, 시맨틱 토큰으로 바꾸면 구분 자체가 사라집니다. 컴포넌트는 색을 받기만 하고 정하지 않습니다. 색을 주지 않으면 nodeColor/edgeColor 기본값을 씁니다.
- 그림이 바뀌면 말해 줍니다. 이웃을 펼쳐 대상이 늘거나, 필터로 그림이 비는 순간을 상시 마운트된 polite 영역이 알립니다 — 화면만 바뀌고 소리가 조용하면 보조기술에는 일어나지 않은 일입니다. 말하는 것은 «규모»입니다(왜 바뀌었는지는 이 컴포넌트가 알 수 없습니다). 첫 렌더에는 말하지 않습니다 — 아직 바뀐 것이 없고, 처음 만나는 규모는 요약이 이미 말합니다.
- 펼치기 큐는 dot에만 있습니다. 「접힌 이웃을 사방으로 펼친다」는 노드-링크의 개념입니다. 플로우 에디터에서 접히는 것은 이웃이 아니라 한 노드 안의 서브그래프이고(n8n 서브워크플로 · Node-RED subflow · Blender node group · Unreal collapsed graph), 열리는 방향도 사방이 아니라 안쪽입니다. 같은 기호로 다른 개념을 말하면 둘 다 잘못 읽히므로 card에서는 collapsedCount·expanded·더블클릭 토글이 모두 동작하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| showEdgeLabels | 관계 라벨을 그릴지. 노드가 많으면 꺼서 구조만 남깁니다. @default true |
| label | 그림 전체의 접근성 이름. @default "관계도" |
| description | 화면에 보이지 않는 설명. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `nodes` | `NetworkGraphNode[]` | No |  |
| `edges` | `NetworkGraphEdge[]` | No |  |
| `layout` | `NetworkGraphLayout` | No |  |
| `nodeShape` | `NetworkGraphNodeShape` | No | 노드를 어느 관행으로 그릴지. @default "card" |
| `showEdgeLabels` | `boolean` | No | 관계 라벨을 그릴지. 노드가 많으면 꺼서 구조만 남깁니다. @default true |
| `motion` | `'auto' \| 'none'` | No | force 배치의 움직임. auto는 수렴 애니메이션과 드래그를 켜되 prefers-reduced-motion이면 수렴 상태를 바로 그립니다. none은 항상 수렴 상태만 그립니다(결정적 레이아웃 검증·SSR용). @default "auto" |
| `nodeColor` | `string` | No | 노드에 색이 없을 때 쓰는 기본값. |
| `edgeColor` | `string` | No | 관계에 색이 없을 때 쓰는 기본값. |
| `selectedNodeId` | `string` | No |  |
| `selectedEdgeId` | `string` | No |  |
| `onSelectNode` | `(node: NetworkGraphNode) = void` | No |  |
| `onSelectEdge` | `(edge: NetworkGraphEdge) = void` | No |  |
| `onToggleNode` | `(node: NetworkGraphNode) = void` | No | 이웃 펼치기/접기. 주면 +N 큐가 이름과 aria-expanded를 가진 별도 버튼이 되어 클릭·키보드 순회 양쪽에서 같은 표적으로 동작하고, 노드 더블클릭도 같은 동작을 부릅니다. 노드·관계를 실제로 늘리고 줄이는 것은 소비자의 몫이며, force에서는 새 노드가 이웃의 자리에서 태어나 물리에 밀려 퍼집니다(진입 애니메이션). |
| `label` | `string` | No | 그림 전체의 접근성 이름. @default "관계도" |
| `description` | `React.ReactNode` | No | 화면에 보이지 않는 설명. |
| `summary` | `React.ReactNode` | No | 화면에 보이지 않는 요약. 생략하면 대상·관계 수와 이름으로 자동 생성합니다. |
| `emptyLabel` | `React.ReactNode` | No |  |
| `height` | `number \| string` | No |  |

## Behavior and interaction

- id는 열쇠입니다. 노드를 잇는 일, 포커스 순회를 세우는 일, 애니메이션 사이에 같은 노드를 알아보는 일이 모두 id로 이뤄집니다. 같은 id가 둘이면 먼저 온 것만 남깁니다 — 그리지 않고 버리는 편이, 탭 스톱이 둘이 되어 「탭 한 번에 그림 안으로」라는 계약이 깨지는 것보다 낫습니다.
- 배치는 전략입니다. layered는 root/depth로 층을 쌓고, columns는 column으로 단계를 고정하며, manual은 x/y를 그대로 쓰고, force는 물리로 자리를 잡습니다. 어떤 전략이든 같은 입력이면 같은 좌표가 나옵니다 — 위치 결정은 정렬된 순서와 안정 해시에서만 나오고 난수를 쓰지 않으므로 결정적인 레이아웃 검증이 가능합니다. force도 고정 틱 수만큼 돌린 결과가 도착점이며, 움직임만 선택입니다.
- 움직임은 선택이고 도착점은 결정론입니다. motion="none"이면 수렴한 자리를 바로 그리고, prefers-reduced-motion도 같게 봅니다. 어느 쪽이든 좌표는 같습니다 — 움직임을 끈다고 다른 그림이 나오지 않습니다.
- 상태를 색으로 표현하지 마세요. 유형 색과 충돌합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 표시는 앱의 색에 대비를 기대지 않습니다. 「골랐다」는 강한 중립색 링으로, 포커스는 포커스 지시 색으로 긋습니다 — 어떤 팔레트가 올지 모르는데 그 색에 가독성을 맡길 수 없습니다. 무엇을 골랐는지는 링 «안»의 채움색이 이미 말합니다. 색을 주지 않았을 때의 기본 관계선도 구분선용 hairline이 아니라 대비를 갖는 선 색입니다 — 관계선은 내용을 이해하는 데 필요한 그래픽이므로 배경과 3:1을 지켜야 합니다. |
| 명시 규칙 2 | summary를 주지 않으면 대상·관계 수와 앞쪽 이름 몇 개로 자동 생성해 보이지 않는 요약으로 연결합니다. 요약이 하는 일은 «규모»를 알려 주는 것이지 내용을 옮겨 적는 것이 아닙니다 — 이름을 전부 이어 붙이면 노드 300개짜리 그림에서 3,200자가 되어, 그림을 훑지 않아도 되게 하려던 장치가 훑는 것보다 오래 걸립니다. 하나하나의 이름은 그 노드에 닿았을 때 노드가 말합니다. |
| 명시 규칙 3 | onSelectEdge를 주면 관계도 순회의 자리가 됩니다. 곡선은 가늘어 누르기 어려우므로 투명한 넓은 선을 겹쳐 표적을 넓히고, 그 표적은 키보드에도 열려 있습니다 — 마우스로만 고를 수 있으면 같은 동작에 두 등급의 접근이 생깁니다. 자리는 «떠나는 노드» 뒤라서 「이 대상 — 이 대상에서 나가는 관계들 — 다음 대상」으로 읽힙니다. 관계의 이름은 「A에서 B로, 사용함」처럼 «양 끝»을 말합니다 — 라벨만 쓰면 「사용함, 버튼」이라고만 들리고 같은 라벨을 가진 관계끼리 구별되지 않습니다. |
| 명시 규칙 4 | count는 접혀 있는 동일 관계의 수, collapsedCount는 접혀 있는 이웃의 수입니다. 둘 다 1 이상일 때만 표시합니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- 상태는 색과 다른 축입니다. state는 색을 바꾸지 않고 불투명도와 파선으로만 표현합니다. 「무엇인가」(색)와 「지금 어떤가」(상태)가 한 값에서 섞이면 둘 다 읽을 수 없게 됩니다. Legend로 색을 설명할 때 상태가 색을 흔들지 않는 것도 같은 이유입니다.
- root는 탐색이 시작된 자리입니다. dot에서는 파선 링과 「탐색 시작점」이라는 이름으로 함께 드러납니다 — 링만 두면 눈으로 보는 사람에게만 전해집니다. 크기로 말하지 않습니다(반지름은 size가 쓰는 축입니다). card에서는 첫 단계라는 사실을 왼쪽 끝이라는 자리가 이미 말하므로 아무것도 덧그리지 않습니다.
- 강제 색상 모드에서 색을 지켜 내려 하지 않습니다. 이 그림에서 색은 데이터이지만 «유일한» 부호가 아닙니다 — 모든 노드와 관계에 이름이 직접 붙어 있어, 색이 사용자의 팔레트로 바뀌어도 무엇이 무엇인지 읽힙니다. 색을 지키자고 forced-color-adjust: none을 쓰면 대비가 필요해 그 팔레트를 고른 사람에게서 대비를 빼앗습니다.
- 노드(dot, 노드-링크): 유형 색이 «찬» 원 + 원 «밖» 아래의 이름과 부가 한 줄 + 뿌리 파선 링 + 왼쪽 위 펼치기 큐. 이름을 밖에 두어야 원이 작아질 수 있고, 원이 작아야 노드가 많아져도 연결 구조가 보입니다. 이름 뒤에는 배경색 후광을 깔아 선이 지나가도 읽히게 합니다.

## Accessibility

- 포커스는 보입니다. 순회의 모든 자리(노드와 펼치기 큐)가 :focus-visible에서 켜지는 링을 갖습니다. SVG에서는 outline이 제대로 그려지지 않아 링을 직접 그리며, 선택 링(유형 색)과 «다른 색»을 씁니다 — 「지금 여기 있다」와 「이것을 골랐다」는 다른 말입니다.
- 노드는 포커스 가능한 컨트롤입니다. 노드 묶음이 하나의 tab stop(roving tabindex)이 되고, 방향키로 옮겨 다니며 Enter/Space로 선택합니다.
- 펼치기 큐는 노드가 아니라 «따로 선 컨트롤»입니다. aria-expanded는 큐가 갖고 노드는 갖지 않습니다 — 노드에 두었더니 스크린 리더가 「축소됨, 버튼」으로 읽는데 누르면 선택되어 기대와 어긋났습니다. 큐도 키보드 순회에 들어오므로 클릭과 키보드가 같은 표적을 씁니다. 펼친 뒤에도 사라지지 않고 −로 남아 왕복이 대칭입니다.
- 바깥 SVG에 role="img"를 쓰지 않습니다. img는 하위 트리를 통째로 presentational로 만들어, 포커스는 가는데 보조기술은 무엇에 닿았는지 말하지 못하는 상태를 만듭니다. 그림 전체의 이름은 label이 갖고, 노드는 각자 이름을 갖습니다.
- 이름은 담길 자리에 맞춰 잘립니다. card는 면 안쪽 폭에, dot은 이름 하나가 그림 전체의 폭을 정하지 않을 만큼입니다. 관계 이름도 같습니다 — 담길 상자가 없어 보이지만, 그대로 두면 라벨 하나가 그림 «밖»으로 뻗어 액자에 잘리거나 가로 스크롤을 만듭니다. 자르는 것은 보이는 글자뿐이고, 전체 이름은 노드의 접근성 이름과 에 그대로 남습니다. 글자 폭은 넓은 글자(한글·한자·가나)와 좁은 글자를 나눠 세어 어림합니다 — 글자 수에 평균값을 곱하면 「LK Portal」과 「플랫폼·개발자 도구」가 같은 폭으로 계산됩니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--font-sans`
- `--fw-bold`
- `--label2-line`
- `--label2-size`
- `--radius-md`

### Source contracts

- `components/data/NetworkGraph.jsx`
- `components/data/NetworkGraph.d.ts`
- `components/data/NetworkGraph.prompt.md`
- `stories/DataNetworkGraph.stories.jsx`

## Sources

- NetworkGraph prompt contract: `components/data/NetworkGraph.prompt.md`
- Storybook implementation evidence: `stories/DataNetworkGraph.stories.jsx`
