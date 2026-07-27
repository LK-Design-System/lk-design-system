**Scene3DFrame** is the renderer-independent 3D preset for `ViewerFrame`.

Use it for point clouds, digital twins, WebGL scenes, or React Three Fiber output. The DS owns the viewport frame, scene identity, compact HUD, viewport-local controls, passive renderer metadata, and normalized state placement. The application owns rendering, camera math, picking, and loading/retry logic.

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

- `children` is the renderer output itself (a WebGL/R3F canvas or point-cloud viewer). The frame never touches the render loop; it only removes the content from focus and accessibility trees while a blocking state is active.
- Prefer the orthogonal axes for new integrations: `availability` describes
  whether content exists, `connection` describes transport health,
  `freshness` describes data age, and `playback` describes media progression.
  The legacy combined `state` remains a compatibility adapter and is ignored
  when any explicit axis is supplied.
- Use `ready` for a usable static scene and `live` only when the source is actually advancing.
- The chrome slots follow the shared `ViewerFrame` contract: `badges` is passive identity context beside `title`, `hud` is a few essential readouts (point count, FPS budget), and `overlay` is a non-interactive render layer above the content — none of them accept controls, which belong in `toolbar`.
- `stateLabel`, `stateDescription`, `stateIcon`, and `stateAction` override the normalized state's default copy, glyph, and recovery action per `ViewerFrame`'s rules; they refine wording for the product domain without changing blocking or live-region behavior.
- `appearance="dark"` is the contextual default, not a restriction. Use `appearance="light"` when the surrounding product or renderer needs a light inspection surface; custom scene/HUD content must use the scoped `--viewer-*` roles so both variants remain legible.
- `degraded`, `stale`, and `frozen` keep the last scene visible with an edge status. Loading, unavailable, disconnected, and error states block and remove renderer/tool controls from the focus and accessibility trees.
- Keep orbit, pan, zoom, focus, home, orientation, and display controls in the local `toolbar` slot. Keep document/history commands in `CanvasEditorShell`.
- Scene hierarchy, selection inspector, transform gizmos, robot commands, and renderer-specific debug panels are intentionally excluded.
- `loading` and `empty` remain compatibility aliases; new work should use `state` and state-copy props.
- `CanvasEditorShell` 캔버스 슬롯처럼 다른 표면 안에 뷰포트를 중첩할 때는 `variant="embedded"`로 두어 셸이 최외곽 테두리를 소유하게 합니다. 자체 border·radius만 생략하고 scene identity·HUD·toolbar·상태·접근성 역할은 그대로 유지합니다.

Classification and evidence are documented in [`ViewerFrame.prompt.md`](./ViewerFrame.prompt.md). The structure follows the official [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html) and [Unity Scene view navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html), while [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html) support the conclusion that viewing mode and diagnostic readability—not a permanently dark palette—define the reusable 3D contract. These patterns are adapted to LDS spacing, typography, icons, tokens, and toolbar behavior.
