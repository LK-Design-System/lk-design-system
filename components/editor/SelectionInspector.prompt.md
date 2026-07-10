**SelectionInspector** - Selected-object properties panel.

Use it for a selected canvas or scene object such as a waypoint, route segment, zone, map annotation, crop volume, or bounding box. Keep it separate from layer/display selection.

```jsx
<SelectionInspector
  item={{ label: 'Zone A-03', kind: 'Polygon', status: 'verified', statusTone: 'online' }}
  sections={[{ title: 'Geometry', fields: [{ label: 'Area', value: 24.8, unit: 'm2' }] }]}
  onClearSelection={clearSelection}
/>
```

- `item` is not a layer. Layer/display state belongs to `LayerPanel.activeLayerId`.
- Use `onClearSelection` when the workflow supports clearing the current canvas selection. Keep the clear action in the inspector header.
- Use `panelMode="docked"` for repeated property editing, and `panelMode="drawer"` for lightweight contextual inspection.
- When mirroring the original `lk_web_viz` map editor, treat `SelectionInspector` as only one part of the right properties/settings sidebar. The original sidebar also covers active tab/tool state, PGM settings, selected object forms, and no-selection states.
- If the workflow is task/mission authoring from original `TaskCreateScreen`, a left task form and step list may be more faithful than a selected-object inspector.
