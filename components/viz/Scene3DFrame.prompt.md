**Scene3DFrame** is the renderer-independent 3D preset for `ViewerFrame`.

Use it for point clouds, digital twins, Three.js, or React Three Fiber output. The DS owns the viewport frame, scene identity, compact HUD, viewport-local controls, passive renderer metadata, and normalized state placement. The application owns rendering, camera math, picking, and loading/retry logic.

```jsx
<Scene3DFrame
  label="AMR-07 3D scene"
  title="POINT CLOUD"
  state="stale"
  status="1.2M pts · 38 FPS"
  toolbar={cameraControls}
  style={{ height: 320 }}
>
  <Canvas>...</Canvas>
</Scene3DFrame>
```

- Use `ready` for a usable static scene and `live` only when the source is actually advancing.
- `appearance="dark"` is the contextual default, not a restriction. Use `appearance="light"` when the surrounding product or renderer needs a light inspection surface; custom scene/HUD content must use the scoped `--viewer-*` roles so both variants remain legible.
- `degraded`, `stale`, and `frozen` keep the last scene visible with an edge status. Loading, unavailable, disconnected, and error states block and remove renderer/tool controls from the focus and accessibility trees.
- Keep orbit, pan, zoom, focus, home, orientation, and display controls in the local `toolbar` slot. Keep document/history commands in `CanvasEditorShell`.
- Scene hierarchy, selection inspector, transform gizmos, robot commands, and renderer-specific debug panels are intentionally excluded.
- `loading` and `empty` remain compatibility aliases; new work should use `state` and state-copy props.

Classification and evidence are documented in [`ViewerFrame.prompt.md`](./ViewerFrame.prompt.md). The structure follows the official [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html) and [Unity Scene view navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html), while [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html) support the conclusion that viewing mode and diagnostic readability—not a permanently dark palette—define the reusable 3D contract. These patterns are adapted to LDS spacing, typography, icons, tokens, and toolbar behavior.
