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

- This component is for application-style hierarchy navigation. For ordinary site navigation, prefer disclosure sections as cautioned by the APG navigation-tree example.

## Anatomy

| Part | Contract |
| --- | --- |
| ariaLabel | Accessible name for the tree widget. @default "Hierarchy" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `nodes` | `TreeNodeData[]` | Yes |  |
| `expandedIds` | `Array` | No | Controlled IDs of expanded branches. |
| `defaultExpanded` | `Array` | No | Node IDs, or primitive labels for legacy nodes without an ID, expanded initially. |
| `onExpandedIdsChange` | `(expandedIds: string[]) = void` | No | Called with normalized IDs/legacy primitive labels after expansion changes. |
| `selectedId` | `string \| number \| null` | No | Controlled ID of the single selected node. IDs are normalized to strings. |
| `defaultSelectedId` | `string \| number \| null` | No | Initial ID of the single selected node when uncontrolled. IDs are normalized to strings. |
| `onSelectedIdChange` | `(selectedId: string) = void` | No | Called with the normalized ID when a node with an ID is activated. |
| `openOnHover` | `boolean` | No | Opens branch children while the branch is hovered or keyboard-focused. |
| `ariaLabel` | `string` | No | Accessible name for the tree widget. @default "Hierarchy" |
| `onSelect` | `(node: TreeNodeData) = void` | No |  |

## States

| State | Contract |
| --- | --- |
| expandedIds | Controlled IDs of expanded branches. |
| defaultExpanded | Node IDs, or primitive labels for legacy nodes without an ID, expanded initially. |
| onExpandedIdsChange | Called with normalized IDs/legacy primitive labels after expansion changes. |
| selectedId | Controlled ID of the single selected node. IDs are normalized to strings. |
| defaultSelectedId | Initial ID of the single selected node when uncontrolled. IDs are normalized to strings. |
| onSelectedIdChange | Called with the normalized ID when a node with an ID is activated. |
| openOnHover | Opens branch children while the branch is hovered or keyboard-focused. |

## Behavior and interaction

- Keyboard and semantics.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption2-size | 11px |
| --color-semantic-background-normal-alternative | light: #F7F7F8; dark: #0F0F10 |
| --color-semantic-focus-indicator | light: #2F6FB0; dark: #7FB0DE |

## Content and writing

- nodes — { id, label, icon, children }. defaultExpanded — 열린 키. openOnHover — hover/focus 시 임시 확장. onSelect(node).

## Accessibility

- The root uses role="tree" and ariaLabel; every visible node uses a single roving tabIndex with role="treeitem".
- Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node.
- Roving keyboard focus and single selection are independent. Use selectedId for controlled selection, defaultSelectedId for uncontrolled selection, and onSelectedIdChange(id) to observe activation.
- A ref exposes focusItem(id, { reveal: true }) for caller-directed synchronization; reveal expands collapsed ancestors before focusing the row.
- Give every node addressed by selection or focusItem an explicit, stable, globally unique id. IDs are normalized to strings; label is presentation only and is never used as public identity.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `StatusBadge` | 대표 시나리오에서 조합 |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `DataCollectionPanel` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Tree defaultExpanded={['workspace']} defaultSelectedId="workspace" onSelect={pick} nodes={[
  { id: 'workspace', label: '문서', children: [{ label: '개요' }, { label: '컴포넌트' }] },
]} />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--caption2-size`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
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
- `--space-0-5`
- `--space-2-5`

### Source contracts

- `components/data/Tree.jsx`
- `components/data/Tree.d.ts`
- `components/data/Tree.prompt.md`
- `stories/DataTree.stories.jsx`

## Sources

- Tree prompt contract: `components/data/Tree.prompt.md`
- Storybook implementation evidence: `stories/DataTree.stories.jsx`
- [WAI-ARIA APG Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [APG Navigation Treeview caution](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/)
