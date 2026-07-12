**LayerPanel** — reusable scene/layer hierarchy for LK Robotics editor shells.

Classification: **LK Robotics Extension**. Use it only when a workflow has a real hierarchy whose nodes own display, visibility, lock, count, or status state. Selected-object properties belong in `SelectionInspector`; workflow steps do not belong here.

```jsx
<LayerPanel
  layers={[
    { id: 'map', label: 'Occupancy map', tone: 'neutral', locked: true },
    {
      id: 'routes',
      label: 'Routes',
      tone: 'positive',
      toneLabel: 'Ready',
      children: [{ id: 'route-04', label: 'Route 04' }],
    },
  ]}
  activeLayerId={layerId}
  expandedLayerIds={expandedIds}
  onActiveLayerChange={setLayerId}
  onExpandedLayerIdsChange={setExpandedIds}
/>
```

## Contract

- `activeLayerId` is the shared editor selection identifier for a layer/display node. It is not a selected waypoint, crop box, annotation, or other canvas object.
- Expansion is controlled with `expandedLayerIds` or uncontrolled with `defaultExpandedLayerIds`. With neither prop, groups are expanded unless their layer data sets `expanded: false`.
- Tree rows use a roving Tab stop. Up/Down move through visible nodes, Home/End move to the boundaries, Right expands or enters a group, Left collapses or returns to the parent, and printable-character typeahead moves focus by label. Enter/Space selects the focused node.
- Focus and selection remain visually distinct: arrow navigation moves focus; Enter/Space or pointer activation changes selection. An externally changed `activeLayerId` restores the corresponding visible row as the roving Tab stop.
- Visibility and lock are named `IconButton` actions. From a focused row, F2 enters its two-action mode, Left/Right moves between actions, and Escape returns to the row. Do not assign single-letter `V`/`L` shortcuts at the component layer; those collide with editor tools and text entry.
- `tone` is a decorative semantic-color marker unless paired with visible `toneLabel` or `status` text. Never communicate status by color alone.
- New data uses `neutral / signal / positive / cautionary / negative`; `warning` and `danger` remain compatibility aliases. This keeps layer markers, inspector status, viewport status, and viewer status on one semantic vocabulary.
- The trailing row-meta slot carries exactly one of two meanings: a child/item **count** (number) or a short **permission/status word** (e.g. 참조, 편집 가능). Do not put arbitrary copy, timestamps, or actions there — the slot narrows away under 260px container width.
- The panel owns hierarchy interaction, not drag reordering, arbitrary docking, layout persistence, context menus, or product-specific asset loading. Those remain product responsibilities.

## Research and local adaptation

- [Figma: View layers and assets in the Layers panel](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-assets-in-the-Layers-Panel) established the left-side hierarchical layer model, shared canvas/layer selection, visibility/lock actions, and collapsible groups.
- [WAI-ARIA APG: Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) established the `tree`/`treeitem` model, roving focus, expansion state, arrow/Home/End behavior, and typeahead expectation.
- [WCAG 2.2: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) supports keeping all required actions available without drag-only interaction; reorder behavior is intentionally omitted from this DS primitive.

The implementation adopts those behavioral expectations while retaining LDS spacing, typography, focus ring, `IconButton`, semantic colors, and editor-shell ownership. It intentionally does not copy Figma styling or expose Figma-specific file/page concepts.

Visual delta decision: `LayerPanel` stays denser than `SelectionInspector` because hierarchy rows need scan efficiency, while the inspector needs a stronger selected-object identity block and form sections. Both share panel typography tokens, semantic status vocabulary, 32px micro-actions, and the shell-owned outer surface; density does not justify a second control or status language.
