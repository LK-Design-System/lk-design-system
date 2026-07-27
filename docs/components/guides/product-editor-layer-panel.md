# Layer Panel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `LayerPanel` |
| Storybook | `LDS Product/Editor/Layer Panel` |
| Source | `../component-content.json#product-editor-layer-panel` |

운영자가 중첩된 지도·경로·로봇 레이어를 탐색하며 선택과 가용성을 제어할 때 적합합니다. 계층이 없는 단순 옵션이나 일회성 필터에는 Layer Panel 대신 List 또는 Checkbox Group을 사용하세요.

## 사용 판단

### 사용

- LayerPanel — reusable scene/layer hierarchy for LK Robotics editor shells.

### 사용하지 않음

- Visibility and lock follow the same controlled/uncontrolled pattern: visibleLayerIds/defaultVisibleLayerIds and lockedLayerIds/defaultLockedLayerIds.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `layers` | `LayerPanelLayer[]` | No |  |
| `activeLayerId` | `string` | No |  |
| `defaultActiveLayerId` | `string` | No |  |
| `onActiveLayerChange` | `(id: string) = void` | No |  |
| `visibleLayerIds` | `string[]` | No |  |
| `defaultVisibleLayerIds` | `string[]` | No |  |
| `onVisibleLayerIdsChange` | `(ids: string[], changedId: string, visible: boolean) = void` | No |  |
| `lockedLayerIds` | `string[]` | No |  |
| `defaultLockedLayerIds` | `string[]` | No |  |
| `onLockedLayerIdsChange` | `(ids: string[], changedId: string, locked: boolean) = void` | No |  |
| `expandedLayerIds` | `string[]` | No |  |
| `defaultExpandedLayerIds` | `string[]` | No |  |
| `onExpandedLayerIdsChange` | `(ids: string[], changedId: string, expanded: boolean) = void` | No |  |
| `title` | `React.ReactNode` | No |  |
| `label` | `string` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `disabled` | `boolean` | No |  |

## Behavior and interaction

- Figma: View layers and assets in the Layers panel established the left-side hierarchical layer model, shared canvas/layer selection, visibility/lock actions, and collapsible groups.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | The trailing row-meta slot carries exactly one of two meanings: a child/item count (number) or a short permission/status word (e.g. 참조, 편집 가능). Do not put arbitrary copy, timestamps, or actions there — the slot narrows away under 260px container width. |
| 명시 규칙 2 | WCAG 2.2: Dragging Movements supports keeping all required actions available without drag-only interaction; reorder behavior is intentionally omitted from this DS primitive. |
| 명시 규칙 3 | Visual delta decision: LayerPanel stays denser than SelectionInspector because hierarchy rows need scan efficiency, while the inspector needs a stronger selected-object identity block and form sections. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- New data uses neutral / signal / positive / cautionary / negative; warning and danger remain compatibility aliases. This keeps layer markers, inspector status, viewport status, and viewer status on one semantic vocabulary.

## Content and writing

- An empty layers array renders emptyLabel (default 레이어가 없습니다.) as a polite status region instead of the tree. Use it for genuinely empty documents, not for loading states.
- disabled freezes the entire panel: rows stay listed for context but selection, visibility, lock, and expansion changes are all rejected. Prefer per-layer disabled when only part of the hierarchy is off-limits.
- tone is a decorative semantic-color marker unless paired with visible toneLabel or status text. Never communicate status by color alone.
- The panel owns hierarchy interaction, not drag reordering, arbitrary docking, layout persistence, context menus, or product-specific asset loading. Those remain product responsibilities.

## Accessibility

- activeLayerId is the shared editor selection identifier for a layer/display node. It is not a selected waypoint, crop box, annotation, or other canvas object. Selection may also run uncontrolled via defaultActiveLayerId; with neither prop the first focusable layer starts active.
- title (default 레이어) is the visible panel heading, rendered with the total node count; label (default 레이어 목록) is the tree's accessible name. Keep both meaning the same hierarchy.
- Tree rows use a roving Tab stop. Up/Down move through visible nodes, Home/End move to the boundaries, Right expands or enters a group, Left collapses or returns to the parent, and printable-character typeahead moves focus by label. Enter/Space selects the focused node.
- Focus and selection remain visually distinct: arrow navigation moves focus; Enter/Space or pointer activation changes selection. An externally changed activeLayerId restores the corresponding visible row as the roving Tab stop.
- Visibility and lock are named IconButton actions. From a focused row, F2 enters its two-action mode, Left/Right moves between actions, and Escape returns to the row. Do not assign single-letter V/L shortcuts at the component layer; those collide with editor tools and text entry.

## Exceptions

- Expansion is controlled with expandedLayerIds or uncontrolled with defaultExpandedLayerIds. With neither prop, groups are expanded unless their layer data sets expanded: false.
- Classification: LK Robotics Extension. Use it only when a workflow has a real hierarchy whose nodes own display, visibility, lock, count, or status state. Selected-object properties belong in SelectionInspector; workflow steps do not belong here.

## Related components

| Component | Relationship |
| --- | --- |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--component-toggle-icon-size-sm`
- `--control-h-md`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--radius-sm`
- `--space-0`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/editor/LayerPanel.jsx`
- `components/editor/LayerPanel.d.ts`
- `components/editor/LayerPanel.prompt.md`
- `stories/EditorLayerPanel.stories.jsx`

## Sources

- LayerPanel prompt contract: `components/editor/LayerPanel.prompt.md`
- Storybook implementation evidence: `stories/EditorLayerPanel.stories.jsx`
- [Figma: View layers and assets in the Layers panel](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-assets-in-the-Layers-Panel)
- [WAI-ARIA APG: Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [WCAG 2.2: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
