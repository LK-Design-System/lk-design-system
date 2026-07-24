# Tree

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Collections |
| Owner | `Tree` |
| Storybook | `LDS Product/Data/Collections/Tree` |
| Source | `../component-content.json#product-data-collections-tree` |

문서·파일·레이어처럼 부모와 자식 관계가 중요한 구조를 탐색하고 선택할 때 적합합니다. 계층이 없는 짧은 옵션이나 여러 값을 동시에 고를 때는 Tree 대신 List 또는 Checkbox Group을 사용하세요.

## 사용 판단

### 사용

- 문서·파일·레이어처럼 부모와 자식 관계가 중요한 구조를 탐색하고 선택할 때 적합합니다. 계층이 없는 짧은 옵션이나 여러 값을 동시에 고를 때는 Tree 대신 List 또는 Checkbox Group을 사용하세요.
- The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem".
- Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node.
- Roving keyboard focus and single selection are independent. Use selectedId for controlled selection, defaultSelectedId for uncontrolled selection, and onSelectedIdChange(id) to observe activation.

### 사용하지 않음

- Explicit IDs keep a node's internal focus and expansion identity stable across reordering. Nodes without an id use their tree path internally, still participate in roving keyboard navigation, and call onSelect(node), but they do not update ID-based selection.
- - The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem". - Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node. - Roving keyboard focus….
- Tree가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Tree의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Aria Label | Accessible name for the tree widget. @default "Hierarchy" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `nodes` | `TreeNodeData[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `defaultExpanded` | `Array` | No | Node IDs, or primitive labels for legacy nodes without an ID, expanded initially. |
| `selectedId` | `string \| number \| null` | No | Controlled ID of the single selected node. IDs are normalized to strings. |
| `defaultSelectedId` | `string \| number \| null` | No | Initial ID of the single selected node when uncontrolled. IDs are normalized to strings. |
| `onSelectedIdChange` | `(selectedId: string) = void` | No | Called with the normalized ID when a node with an ID is activated. |
| `openOnHover` | `boolean` | No | Opens branch children while the branch is hovered or keyboard-focused. |
| `ariaLabel` | `string` | No | Accessible name for the tree widget. @default "Hierarchy" |
| `onSelect` | `(node: TreeNodeData) = void` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| defaultExpanded | Node IDs, or primitive labels for legacy nodes without an ID, expanded initially. 타입 계약: Array |
| selectedId | Controlled ID of the single selected node. IDs are normalized to strings. 타입 계약: string \| number \| null |
| defaultSelectedId | Initial ID of the single selected node when uncontrolled. IDs are normalized to strings. 타입 계약: string \| number \| null |
| onSelectedIdChange | Called with the normalized ID when a node with an ID is activated. 타입 계약: (selectedId: string) = void |
| openOnHover | Opens branch children while the branch is hovered or keyboard-focused. 타입 계약: boolean |
| 상호작용 · 선택과 초점 이동 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem".
- Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node.
- Roving keyboard focus and single selection are independent. Use selectedId for controlled selection, defaultSelectedId for uncontrolled selection, and onSelectedIdChange(id) to observe activation.
- A ref exposes focusItem(id, { reveal: true }) for caller-directed synchronization; reveal expands collapsed ancestors before focusing the row.
- Give every node addressed by selection or focusItem an explicit, stable, globally unique id. IDs are normalized to strings; label is presentation only and is never used as public identity.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-normal-alternative | light: #F7F7F8; dark: #0F0F10 |
| --color-semantic-focus-indicator | light: #2F6FB0; dark: #7FB0DE |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem".
- Give every node addressed by selection or focusItem an explicit, stable, globally unique id. IDs are normalized to strings; label is presentation only and is never used as public identity.
- nodes — { id, label, icon, children }. defaultExpanded — 열린 키. openOnHover — hover/focus 시 임시 확장. onSelect(node).
- - The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem". - Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node. - Roving keyboard focus….

## Accessibility

- The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem".
- Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node.
- Roving keyboard focus and single selection are independent. Use selectedId for controlled selection, defaultSelectedId for uncontrolled selection, and onSelectedIdChange(id) to observe activation.
- A ref exposes focusItem(id, { reveal: true }) for caller-directed synchronization; reveal expands collapsed ancestors before focusing the row.
- Give every node addressed by selection or focusItem an explicit, stable, globally unique id. IDs are normalized to strings; label is presentation only and is never used as public identity.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem". |
| Don't | Explicit IDs keep a node's internal focus and expansion identity stable across reordering. Nodes without an id use their tree path internally, still participate in roving keyboard navigation, and call onSelect(node), but they do not update ID-based selection. |
| Do | Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node. |
| Don't | - The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem". - Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node. - Roving keyboard focus…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Tree의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `StatusBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Tree defaultExpanded={['workspace']} defaultSelectedId="workspace" onSelect={pick} nodes={[
  { id: 'workspace', label: '문서', children: [{ label: '개요' }, { label: '컴포넌트' }] },
]} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-normal-alternative`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--radius-md`

### Source contracts

- `components/data/Tree.jsx`
- `components/data/Tree.d.ts`
- `components/data/Tree.prompt.md`
- `stories/DataTree.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Tree prompt contract: `components/data/Tree.prompt.md`
- Storybook implementation evidence: `stories/DataTree.stories.jsx`
- [WAI-ARIA APG Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [APG Navigation Treeview caution](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/)
