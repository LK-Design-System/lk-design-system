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

- Use the local toolbar for mute, captions, snapshot, and fullscreen. Recording archives, timelines, playback-session controls, and retry policy are intentionally omitted from this DS component.
- The HTML media element specification influenced the separation of paused, ended/unavailable, and error semantics from connection transport.
- VideoStreamTile is the video-source preset for ViewerFrame.

## Anatomy

| Part | Contract |
| --- | --- |
| children | Actual video, WebRTC, iframe, or image renderer output. |
| label | Visible camera or media-source identity. |
| ariaLabel | Accessible region name. Derived from a string label when omitted. |
| toolbar | Viewport-local mute, captions, snapshot, or fullscreen controls. |

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
| `hud` | `React.ReactNode` | No | Compact passive diagnostics; keep the default HUD to essential values. |
| `toolbar` | `React.ReactNode` | No | Viewport-local mute, captions, snapshot, or fullscreen controls. |
| `overlay` | `React.ReactNode` | No | Non-interactive video overlay. |
| `metadata` | `React.ReactNode` | No | Passive stream metadata such as resolution, FPS, or freshness. |
| `stateLabel` | `React.ReactNode` | No |  |
| `stateDescription` | `React.ReactNode` | No |  |
| `stateIcon` | `React.ReactNode` | No |  |
| `stateAction` | `React.ReactNode` | No |  |
| `variant` | `'standalone' \| 'embedded'` | No | Perimeter ownership. "embedded" drops the tile's own border and radius so a parent surface owns one continuous outline. @default "standalone" |

## States

| State | Contract |
| --- | --- |
| status | Normalized stream state. Prefer state in new code. @default "idle" |
| state | Normalized stream state. Takes precedence over the compatibility status prop. |
| variant | Perimeter ownership. "embedded" drops the tile's own border and radius so a parent surface owns one continuous outline. @default "standalone" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | aspectRatio (default 16 / 9) is a CSS aspect-ratio value that sizes the tile from its width. Match it to the real stream ratio (4 / 3, 1 / 1) instead of letterboxing inside the child renderer; give the tile an explicit height only when the owning grid requires it. |

## Content and writing

- The chrome slots follow the shared ViewerFrame contract: badges is passive identity context beside label, hud carries a few essential stream readouts, and overlay is a non-interactive layer above the video (crosshair, privacy mask) — controls belong in toolbar only.
- degraded, stale, frozen, and user-requested paused are distinct non-blocking states. They preserve the last frame with an edge message.
- Pass a , WebRTC renderer, iframe, or image as children. The DS owns the named frame, source identity, local toolbar/HUD slots, aspect ratio, and normalized stream-state presentation. The application owns transport, autoplay policy, playback, recording, reconnection, and media permissions.
- These expectations are adapted to LDS component roles and icons rather than copying another product's visual styling. The common state and placement contract is documented in ViewerFrame.prompt.md.

## Accessibility

- The region's accessible name comes from ariaLabel when supplied; otherwise a string label derives "{label} 영상 스트림" and a missing/non-string label falls back to 영상 스트림. Set ariaLabel explicitly whenever label is a non-string node or several tiles would otherwise share one name.
- live uses both icon and text. Loading/connecting states include visible text and aria-busy; they do not rely on a spinner alone.
- no-source, unavailable, disconnected, no-signal, and error are blocking. Child media controls and local toolbar controls become inert and aria-hidden, while source identity remains visible.
- A retry/resume control may be supplied through stateAction; the application owns transport and recovery, and the frame restores focus to that action when a focused viewport control becomes blocked.
- variant="embedded"는 이 타일을 다른 표면 안에 중첩할 때 자체 border·radius를 생략해 부모가 최외곽선을 소유하게 합니다. source·HUD·toolbar·상태·접근성 역할은 그대로 유지됩니다. 기본값 standalone은 자체 외곽선을 그립니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |
| `VIEWER_BLOCKING_STATES` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<VideoStreamTile
  label="AMR-07 · FRONT"
  state="live"
  metadata="1080p · 30 FPS"
  toolbar={videoControls}
>
  <video aria-label="AMR-07 전면 카메라 영상" />
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
- [WebRTC Statistics](https://www.w3.org/TR/webrtc-stats/)
- [WCAG live captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html)
- [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
