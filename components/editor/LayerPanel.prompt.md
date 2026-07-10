**LayerPanel** - Layer/display tree for editor shells.

Use it when the workflow has real layer, display, topic, file, class, or entity visibility/order/lock state. Do not use it as a generic replacement for selected-object properties or task steps.

```jsx
<LayerPanel
  layers={[
    { id: 'map', label: 'Occupancy map', color: 'var(--color-semantic-label-neutral)', locked: true },
    { id: 'route', label: 'Route', count: 12, color: 'var(--color-semantic-primary-normal)' },
  ]}
  activeLayerId="route"
  onActiveLayerChange={setLayer}
/>
```

- Provide `visible`, `locked`, `activeLayerId`, nested `children`, count, and meta only when they represent real layer/display state.
- `activeLayerId` is layer/display selection. It is not the selected waypoint, zone, route segment, crop box, or annotation.
- Use `SelectionInspector` or a workflow-specific properties sidebar for selected canvas objects.
- When mirroring the original `lk_web_viz` `MapEditScreen`, do not add `LayerPanel` by default. The original map editor is organized by `objects`/`pgm` tabs, a left tool rail, canvas-local tool panels, and a right properties/settings sidebar.
- For point-cloud workflows, confirm whether the product actually has displays, classes, files, or editable entities before choosing the panel title and item model.
