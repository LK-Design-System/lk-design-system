# RobotPoseMarker

Classification: **LK Robotics Extension**. `RobotPoseMarker` is the SVG
reference renderer for a robot's current pose inside an application-owned
navigation map.

```jsx
<svg aria-label="Fleet positions">
  <RobotPoseMarker
    pose={{
      id: 'robot-01',
      label: 'Robot 01',
      mapId: 'L1',
      position: { x: 120, y: 80 },
      headingRad: Math.PI / 2,
      state: 'moving',
      color: 'var(--color-semantic-primary-normal)',
    }}
    viewportScale={viewport.z}
    selected={selectedId === 'robot-01'}
    showLabel
    onActivate={setSelectedId}
  />
</svg>
```

## Contract

- `pose` is serializable domain data: stable identity, label, map identity,
  world-space position, heading, explicit operational state, and optional
  fleet color.
- `viewportScale` keeps the body, label, focus ring, and hit target legible at
  every zoom level. The owning renderer supplies the SVG root and world
  transform.
- `selected`, `focused`, `disabled`, `invalid`, and `stale` are independent
  presentation axes; operational `state` does not silently infer them.
- Omitted `showLabel` reveals the label while selected or keyboard-focused.
- `onActivate` receives `pose.id` for pointer click and non-repeating
  Enter/Space. Disabled markers do not activate.
- A native `aria-label` may override the generated name. `aria-hidden="true"`
  switches to pointer-only mode and requires the product to provide an
  equivalent named DOM control.
- The component owns pose and state visualization only. Fleet filtering,
  collision handling, coordinate conversion, freshness calculation, and
  application commands remain outside it.

