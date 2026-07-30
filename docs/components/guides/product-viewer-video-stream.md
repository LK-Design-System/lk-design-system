# Video Stream

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `VideoStreamTile` |
| Storybook | `LDS Product/Viewer/Video Stream` |
| Source | `../component-content.json#product-viewer-video-stream` |

운영자가 카메라 영상을 보면서 연결 상태와 뷰포트 도구를 즉시 판단해야 할 때 적합합니다. 정지 이미지나 공간 경로를 탐색하는 화면에는 Video Stream 대신 Image 또는 2D Map을 사용하세요.

## 사용 판단

### 사용

- The HTML media element specification influenced the separation of paused, ended/unavailable, and error semantics from connection transport.
- Microsoft MediaTransportControls confirms that volume belongs with the media transport controls; it is not evidence for a detached settings popover.
- WCAG live captions and Pause, Stop, Hide influenced the optional captions/pause toolbar contract without embedding a product player workflow.
- VideoStreamTile is the video-source preset for ViewerFrame.

### 사용하지 않음

- 현재 고정된 LDS Robotics와 LDS3D source에는 VideoStreamTile 직접 소비가 없습니다. 실제 제품 소비 근거를 확인하기 전에는 transport·protocol·robot camera 의미를 이 preset에 추가하지 않으며, 단순한 영상 상태와 chrome만 필요하면 ViewerFrame 직접 조합도 함께 검토합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| children | Actual video, WebRTC, iframe, or image renderer output. |
| label | Visible camera or media-source identity. |
| ariaLabel | Accessible region name. Derived from a string label when omitted. |
| toolbar | Viewport-local mute, captions, snapshot, or fullscreen controls. |
| toolbarVisibility | Local media controls are revealed by hover, press, or focus by default. |
| toolbarPlacement | 뷰포트 컨트롤 위치. 영상은 플레이어 관례를 따라 하단이 기본이며, 상단 우측은 상시 표시되는 생존성 신호가 화면 끝에 붙도록 비워 둔다. @default "bottom-right" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | Actual video, WebRTC, iframe, or image renderer output. |
| `label` | `React.ReactNode` | No | Visible camera or media-source identity. |
| `ariaLabel` | `string` | No | Accessible region name. Derived from a string label when omitted. |
| `status` | `ViewerState` | No | Normalized stream state. Prefer state in new code. @default "idle" |
| `state` | `ViewerState` | No | Normalized stream state. Takes precedence over the compatibility status prop. |
| `availability` | `ViewerAvailability` | No |  |
| `connection` | `ViewerConnection` | No |  |
| `freshness` | `ViewerFreshness` | No |  |
| `playback` | `ViewerPlayback` | No |  |
| `aspectRatio` | `string` | No | CSS aspect-ratio value. @default "16 / 9" |
| `badges` | `React.ReactNode` | No |  |
| `liveness` | `React.ReactNode` | No | 상단 우측 생존성 슬롯. state="live"의 라이브 표시가 이 자리에 렌더된다. |
| `hud` | `React.ReactNode` | No | Compact passive diagnostics; keep the default HUD to essential values. |
| `toolbar` | `React.ReactNode` | No | Viewport-local mute, captions, snapshot, or fullscreen controls. |
| `overlay` | `React.ReactNode` | No | Non-interactive video overlay. |
| `metadata` | `React.ReactNode` | No | Passive stream metadata such as resolution, FPS, or freshness. |
| `stateLabel` | `React.ReactNode` | No |  |
| `stateDescription` | `React.ReactNode` | No |  |
| `stateIcon` | `React.ReactNode` | No |  |
| `stateAction` | `React.ReactNode` | No |  |
| `variant` | `'standalone' \| 'embedded'` | No | Perimeter ownership. "embedded" drops the tile's own border and radius so a parent surface owns one continuous outline. @default "standalone" |
| `chromeVariant` | `'surface' \| 'overlay'` | No | Video chrome treatment. @default "overlay" |
| `toolbarVisibility` | `'always' \| 'interaction'` | No | Local media controls are revealed by hover, press, or focus by default. |
| `toolbarPlacement` | `'top-right' \| 'bottom-right'` | No | 뷰포트 컨트롤 위치. 영상은 플레이어 관례를 따라 하단이 기본이며, 상단 우측은 상시 표시되는 생존성 신호가 화면 끝에 붙도록 비워 둔다. @default "bottom-right" |

## States

| State | Contract |
| --- | --- |
| status | Normalized stream state. Prefer state in new code. @default "idle" |
| state | Normalized stream state. Takes precedence over the compatibility status prop. |
| variant | Perimeter ownership. "embedded" drops the tile's own border and radius so a parent surface owns one continuous outline. @default "standalone" |
| chromeVariant | Video chrome treatment. @default "overlay" |

## Behavior and interaction

- toolbarPlacement는 bottom-right가 기본이다. 재생 컨트롤은 플레이어 관례상 하단이고, 상단 우측을 비워야 상시 표시되는 라이브 표시가 화면 끝에 붙는다. 상단에 두면 자동 숨김 상태의 툴바가 자리를 차지해 라이브가 가장자리에서 밀린다.
- Video.js VolumePanel likewise groups MuteToggle and VolumeControl, expands the control through hover/focus interaction, and returns focus to the mute control when Escape closes the rail. LDS adapts that interaction to ViewerToolbar.
- Genetec Security Center tile customization allows video controls, timeline, and tile toolbar to auto-hide and reappear on hover. LDS uses the same information-hierarchy conclusion while preserving keyboard focus reveal.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | aspectRatio (default 16 / 9) is a CSS aspect-ratio value that sizes the tile from its width. Match it to the real stream ratio (4 / 3, 1 / 1) instead of letterboxing inside the child renderer; give the tile an explicit height only when the owning grid requires it. |
| 명시 규칙 2 | Use the local toolbar for volume, captions, snapshot, and fullscreen. Volume is a compact media-control group: the mute button and horizontal LDS Slider share the overlay toolbar surface, and the rail expands on hover or focus without adding a detached label or value bubble. |
| 명시 규칙 3 | Healthy live tiles omit passive resolution/FPS chrome by default. Put quality selection in settings or a product-owned detail surface; pass metadata only when the value is necessary to interpret the current state. |
| 명시 규칙 4 | Video.js Volume Slider keeps the continuous 0–100 range in the player controls and exposes its numeric value through the range contract. LDS uses a short horizontal rail with a small thumb and omits a detached value bubble from the compact viewer toolbar. |

## Responsive

- Video keeps the shared edge grammar—source identity at the top-left and local media commands at the top-right—but adapts it to media viewing with compact translucent overlay surfaces.
- Shaka Player UI defines mutevolume as a combined mute button and volume slider container. LDS follows that compact anatomy rather than presenting volume as a settings card.

## Content and writing

- The chrome slots follow the shared ViewerFrame contract: badges is passive identity context beside label, hud carries a few essential stream readouts, and overlay is a non-interactive layer above the video (crosshair, privacy mask) — controls belong in toolbar only.
- degraded, stale, frozen, and user-requested paused are distinct non-blocking states. They preserve the last frame with an edge message and use the shared state-specific retained-frame emphasis instead of one blanket dim treatment.
- AXIS Camera Station Pro treats camera names and recording/event indicators as optional live-view context and manages resolution/frame rate through stream profiles rather than permanent tile badges. LDS therefore keeps normal video chrome limited to identity and live truth.
- Pass a , WebRTC renderer, iframe, or image as children. The DS owns the named frame, source identity, local toolbar/HUD slots, aspect ratio, and normalized stream-state presentation. The application owns transport, autoplay policy, playback, recording, reconnection, and media permissions.

## Accessibility

- The region's accessible name comes from ariaLabel when supplied; otherwise a string label derives "{label} 영상 스트림" and a missing/non-string label falls back to 영상 스트림. Set ariaLabel explicitly whenever label is a non-string node or several tiles would otherwise share one name.
- live uses both icon and text. Loading/connecting states include visible text and aria-busy; they do not rely on a spinner alone.
- no-source, unavailable, disconnected, no-signal, and error are blocking. Child media controls and local toolbar controls become inert and aria-hidden, while source identity remains visible.
- A retry/resume control may be supplied through stateAction; the application owns transport and recovery, and the frame restores focus to that action when a focused viewport control becomes blocked.
- Video defaults to chromeVariant="overlay" and toolbarVisibility="interaction". Source identity plus the normalized live state remain visible; the local toolbar is visually hidden until the frame is hovered, pressed, or contains keyboard focus.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Slider` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<VideoStreamTile
  label="주 영상"
  state="live"
  toolbar={videoControls}
>
  <video aria-label="주 영상 스트림" />
</VideoStreamTile>
```

## Tokens and API

### Source contracts

- `components/viz/VideoStreamTile.jsx`
- `components/viz/VideoStreamTile.d.ts`
- `components/viz/VideoStreamTile.prompt.md`
- `stories/ViewerVideo.stories.jsx`

## Migration

- The default state is idle, never an unverified live claim. state is the normalized-state prop for new code; status is a compatibility alias that state always wins over — do not supply both in new work.
- New integrations should report independent availability, connection, freshness, and playback axes. Supplying any of those axes takes precedence over the legacy combined state/status adapter, so a stale connected stream is not misreported as disconnected or unavailable.

## Sources

- VideoStreamTile prompt contract: `components/viz/VideoStreamTile.prompt.md`
- Storybook implementation evidence: `stories/ViewerVideo.stories.jsx`
- [HTML media element specification](https://html.spec.whatwg.org/multipage/media.html)
- [Shaka Player UI](https://shaka-project.github.io/shaka-player/docs/api/tutorial-ui-customization.html)
- [Video.js VolumePanel](https://docs.videojs.com/volumepanel)
- [Video.js Volume Slider](https://videojs.org/docs/framework/html/reference/volume-slider)
- [Microsoft MediaTransportControls](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/custom-transport-controls)
- [Genetec Security Center tile customization](https://techdocs.genetec.com/r/en-US/Security-Center-User-Guide-5.13/Customizing-how-tiles-are-displayed-in-Security-Center)
- [AXIS Camera Station Pro](https://help.axis.com/en-us/axis-camera-station-pro)
- [Verkada Camera Shortcuts](https://help.verkada.com/verkada-cameras/configuration/view-and-edit-camera-settings/camera-shortcuts)
