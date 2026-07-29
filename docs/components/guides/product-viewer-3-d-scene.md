# 3D Scene

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `Scene3DFrame` |
| Storybook | `LDS Product/Viewer/3D Scene` |
| Source | `../component-content.json#product-viewer-3-d-scene` |

애플리케이션이나 LDS3D가 제공하는 WebGL 장면에 공통 상태·HUD·카메라 도구를 배치할 때 적합합니다. Scene3DFrame은 실제 3D 렌더링·좌표계·피킹을 구현하지 않습니다.

## 사용 판단

### 사용

- Scene identity stays at the top-left, the camera toolbar at the top-right, and passive renderer status at the bottom-left. ViewerFrame owns the toolbar shelf, so light appearances use a minimal inner ViewerToolbar rather than nesting another surface.
- Scene3DFrame is the renderer-independent 3D preset for ViewerFrame.

### 사용하지 않음

- Product Storybook은 실제 point cloud나 WebGL 장면을 모사하지 않고 renderer slot과 frame chrome만 보여줍니다. 실제 3D geometry, depth, picking, camera semantics와 renderer lifecycle은 LDS3D 또는 애플리케이션이 소유합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| children | WebGL, R3F, point-cloud, or other renderer output. |
| title | Visible scene or source identity. |
| toolbar | Viewport-local camera, fit, zoom, and display controls. |
| label | Accessible region name. @default "3D 뷰포트" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | WebGL, R3F, point-cloud, or other renderer output. |
| `title` | `React.ReactNode` | No | Visible scene or source identity. |
| `badges` | `React.ReactNode` | No | Passive badges adjacent to the scene identity. |
| `hud` | `React.ReactNode` | No | Compact passive diagnostics; keep the default HUD to essential values. |
| `toolbar` | `React.ReactNode` | No | Viewport-local camera, fit, zoom, and display controls. |
| `overlay` | `React.ReactNode` | No | Non-interactive renderer overlay. |
| `status` | `React.ReactNode` | No | Passive renderer metadata such as FPS or point count. |
| `state` | `ViewerState` | No | Legacy combined Viewer state. Prefer the orthogonal axes in new product code. |
| `availability` | `ViewerAvailability` | No |  |
| `connection` | `ViewerConnection` | No |  |
| `freshness` | `ViewerFreshness` | No |  |
| `playback` | `ViewerPlayback` | No |  |
| `stateLabel` | `React.ReactNode` | No |  |
| `stateDescription` | `React.ReactNode` | No |  |
| `stateIcon` | `React.ReactNode` | No |  |
| `stateAction` | `React.ReactNode` | No |  |
| `loading` | `boolean` | No |  |
| `empty` | `React.ReactNode` | No |  |
| `appearance` | `'dark' \| 'light'` | No | Theme-stable viewport presentation. @default "dark" |
| `label` | `string` | No | Accessible region name. @default "3D 뷰포트" |
| `variant` | `'standalone' \| 'embedded'` | No | Perimeter ownership. "embedded" drops the viewport's own border and radius so a parent surface (CanvasEditorShell, Card) owns one continuous outline. @default "standalone" |

## States

| State | Contract |
| --- | --- |
| status | Passive renderer metadata such as FPS or point count. |
| state | Legacy combined Viewer state. Prefer the orthogonal axes in new product code. |
| variant | Perimeter ownership. "embedded" drops the viewport's own border and radius so a parent surface (CanvasEditorShell, Card) owns one continuous outline. @default "standalone" |

## Behavior and interaction

- Scene hierarchy, selection inspector, transform gizmos, robot commands, and renderer-specific debug panels are intentionally excluded.

## Responsive

- title is the primary scene identity and inherits the shared ViewerFrame compact source hierarchy (caption1/semibold) inside the top chrome.
- Use it for point clouds, digital twins, WebGL scenes, or React Three Fiber output. The DS owns the viewport frame, scene identity, compact HUD, viewport-local controls, passive renderer metadata, and normalized state placement. The application owns rendering, camera math, picking, and loading/retry logic.
- Classification and evidence are documented in ViewerFrame.prompt.md. The structure follows the official NVIDIA Omniverse viewport controls and Unity Scene view navigation, while Unity Scene view draw modes support the conclusion that viewing mode and diagnostic readability—not a permanently dark palette—define the…

## Content and writing

- The chrome slots follow the shared ViewerFrame contract: badges is passive identity context beside title, hud is a few essential readouts (point count, FPS budget), and overlay is a non-interactive render layer above the content — none of them accept controls, which belong in toolbar.
- stateLabel, stateDescription, stateIcon, and stateAction override the normalized state's default copy, glyph, and recovery action per ViewerFrame's rules; they refine wording for the product domain without changing blocking or live-region behavior.
- appearance="dark" is the contextual default, not a restriction. Use appearance="light" when the surrounding product or renderer needs a light inspection surface; custom scene/HUD content must use the scoped --viewer- roles so both variants remain legible.
- loading and empty remain compatibility aliases; new work should use state and state-copy props.

## Accessibility

- children is the renderer output itself (a WebGL/R3F canvas or point-cloud viewer). The frame never touches the render loop; it only removes the content from focus and accessibility trees while a blocking state is active.
- degraded, stale, and frozen keep the last scene visible with an edge status. Loading, unavailable, disconnected, and error states block and remove renderer/tool controls from the focus and accessibility trees.
- Keep orbit, pan, zoom, focus, home, orientation, and display controls in the local toolbar slot. Keep document/history commands in CanvasEditorShell.
- CanvasEditorShell 캔버스 슬롯처럼 다른 표면 안에 뷰포트를 중첩할 때는 variant="embedded"로 두어 셸이 최외곽 테두리를 소유하게 합니다. 자체 border·radius만 생략하고 scene identity·HUD·toolbar·상태·접근성 역할은 그대로 유지합니다.

## Exceptions

- Use ready for a usable static scene and live only when the source is actually advancing.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `VideoStreamTile` | 대표 시나리오에서 조합 |
| `VIEWER_BLOCKING_STATES` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Scene3DFrame
  label="장면 A 3D 뷰포트"
  title="장면 A"
  state="stale"
  status="원근 · 좌표계 world · 60 FPS"
  toolbar={cameraControls}
  style={{ height: 320 }}
>
  <Canvas>...</Canvas>
</Scene3DFrame>
```

## Tokens and API

### Source contracts

- `components/viz/Scene3DFrame.jsx`
- `components/viz/Scene3DFrame.d.ts`
- `components/viz/Scene3DFrame.prompt.md`
- `stories/Viewer3D.stories.jsx`

## Migration

- Prefer the orthogonal axes for new integrations: availability describes whether content exists, connection describes transport health, freshness describes data age, and playback describes media progression. The legacy combined state remains a compatibility adapter and is ignored when any explicit axis is supplied.

## Sources

- Scene3DFrame prompt contract: `components/viz/Scene3DFrame.prompt.md`
- Storybook implementation evidence: `stories/Viewer3D.stories.jsx`
- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html)
- [Unity Scene view navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html)
- [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html)
