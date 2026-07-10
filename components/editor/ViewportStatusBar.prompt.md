**ViewportStatusBar** - Passive bottom readout row for 2D and 3D editor viewports.

Use it for cursor pose, zoom/camera, selected count, snap state, point count, FPS, stale state, and compact status values.

```jsx
<ViewportStatusBar
  items={[
    { label: 'mode', value: 'select' },
    { label: 'cursor', value: 'x 12.4 / y -3.8', mono: true },
    { label: 'zoom', value: 125, unit: '%' },
  ]}
/>
```

- Keep this bar passive. Put history, save, reset, and destructive actions in `CanvasEditorShell.toolbar` or an inspector action slot.
- Use `mono` for coordinates, camera values, and high-frequency numeric telemetry to reduce jitter.
