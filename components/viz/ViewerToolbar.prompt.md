**ViewerToolbar** - Toolbar for map and 3D viewer controls such as zoom, fit, layer toggle, and measurement.

```jsx
<ViewerToolbar orientation="horizontal" label="3D viewer controls">
  <ViewerToolbarButton label="Zoom in"><Icon name="plus" size={18} /></ViewerToolbarButton>
  <ViewerToolbarButton label="Zoom out"><Icon name="minus" size={18} /></ViewerToolbarButton>
  <ViewerToolbarButton label="Layers" active><Icon name="layers" size={18} /></ViewerToolbarButton>
</ViewerToolbar>
```

- Every icon-only `ViewerToolbarButton` must have a `label`.
- Standalone viewers may float this toolbar on a viewport corner.
- In `CanvasEditorShell`, place it in the shell top `toolbar` so it aligns with the other command groups.
