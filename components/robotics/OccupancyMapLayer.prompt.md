# OccupancyMapLayer

Classification: **LK Robotics Extension**. `OccupancyMapLayer` renders supplied
occupancy-grid data as an SVG fragment. The application owns the SVG root,
projection, viewport controls, and data freshness.

```jsx
<svg viewBox="0 0 40 30" aria-label="Warehouse map">
  <OccupancyMapLayer
    map={{
      width: 4,
      height: 3,
      resolution: 10,
      data: [0, 0, 100, -1, 0, 50, 100, -1, 0, 0, 0, 100],
      origin: { x: 0, y: 0, headingRad: 0 },
    }}
    freeThreshold={25}
    occupiedThreshold={65}
    unknownValue={-1}
    rowOrder="bottom-to-top"
    showBoundary
    decorative
  />
</svg>
```

## Contract

- `map` is renderer-neutral row-major data with explicit `width`, `height`,
  `resolution`, optional `origin`, and numeric `data`.
- `freeThreshold`, `occupiedThreshold`, and `unknownValue` classify supplied
  cells. The component never infers navigable space from closed geometry.
- `rowOrder` states whether serialized rows run `top-to-bottom` or
  `bottom-to-top`; it does not change the parent coordinate system.
- `showBoundary` controls only the non-scaling grid outline.
- `decorative` defaults to true because a viewport usually already owns the
  accessible map name. When false, provide a concise `label`.
- The component accepts normal SVG group attributes, returns one `<g>`, uses
  crisp row runs instead of one DOM node per cell, and does not own zoom, pan,
  selection, loading, or error UI.

