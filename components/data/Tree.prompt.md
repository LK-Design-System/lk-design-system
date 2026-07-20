## Keyboard and semantics

- The root uses `role="tree"` and `ariaLabel`; every visible node uses a single roving `tabIndex` with `role="treeitem"`.
- Up/Down move through visible nodes, Home/End jump to the boundary, Right opens or enters a branch, Left closes or moves to the parent, and Enter/Space activates the focused node.
- Roving keyboard focus and single selection are independent. Use `selectedId` for controlled selection, `defaultSelectedId` for uncontrolled selection, and `onSelectedIdChange(id)` to observe activation.
- A ref exposes `focusItem(id, { reveal: true })` for caller-directed synchronization; `reveal` expands collapsed ancestors before focusing the row.
- This component is for application-style hierarchy navigation. For ordinary site navigation, prefer disclosure sections as cautioned by the APG navigation-tree example.

References: [WAI-ARIA APG Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/), [APG Navigation Treeview caution](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/).

**Tree** — 펼칠 수 있는 계층(조직도, 파일 트리).

```jsx
<Tree defaultExpanded={['workspace']} defaultSelectedId="workspace" onSelect={pick} nodes={[
  { id: 'workspace', label: '문서', children: [{ label: '개요' }, { label: '컴포넌트' }] },
]} />
```

- **nodes** — `{ id, label, icon, children }`. **defaultExpanded** — 열린 키. **openOnHover** — hover/focus 시 임시 확장. **onSelect(node)**.
