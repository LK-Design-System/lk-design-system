**Scene3DFrame** - Chrome shell for a 3D viewport.

Use it for the dark viewport surface, top-left title/badges/HUD, optional overlay, bottom-left status chip, loading, and empty states. The actual 3D canvas is passed as `children`.

```jsx
<Scene3DFrame
  title="POINT CLOUD"
  badges={<ConnectionBadge status="online" size="sm" />}
  status="1.2M pts / 38 FPS"
  style={{ height: 320 }}
>
  <Canvas>...</Canvas>
</Scene3DFrame>
```

- In standalone viewer stories, the optional `toolbar` slot may be used for viewport-local controls.
- Inside `CanvasEditorShell`, put viewer/home/layer command buttons in the shell top `toolbar`; keep `Scene3DFrame` internal UI to HUD, overlay, and status.
