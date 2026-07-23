**VideoStreamTile** is the video-source preset for `ViewerFrame`.

Pass a `<video>`, WebRTC renderer, iframe, or image as `children`. The DS owns the named frame, source identity, local toolbar/HUD slots, aspect ratio, and normalized stream-state presentation. The application owns transport, autoplay policy, playback, recording, reconnection, and media permissions.

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

- The default state is `idle`, never an unverified `live` claim. `state` is the normalized-state prop for new code; `status` is a compatibility alias that `state` always wins over — do not supply both in new work.
- The region's accessible name comes from `ariaLabel` when supplied; otherwise a string `label` derives `"{label} 영상 스트림"` and a missing/non-string label falls back to `영상 스트림`. Set `ariaLabel` explicitly whenever `label` is a non-string node or several tiles would otherwise share one name.
- `aspectRatio` (default `16 / 9`) is a CSS `aspect-ratio` value that sizes the tile from its width. Match it to the real stream ratio (`4 / 3`, `1 / 1`) instead of letterboxing inside the child renderer; give the tile an explicit height only when the owning grid requires it.
- The chrome slots follow the shared `ViewerFrame` contract: `badges` is passive identity context beside `label`, `hud` carries a few essential stream readouts, and `overlay` is a non-interactive layer above the video (crosshair, privacy mask) — controls belong in `toolbar` only.
- `live` uses both icon and text. Loading/connecting states include visible text and `aria-busy`; they do not rely on a spinner alone.
- `degraded`, `stale`, `frozen`, and user-requested `paused` are distinct non-blocking states. They preserve the last frame with an edge message.
- `no-source`, `unavailable`, `disconnected`, `no-signal`, and `error` are blocking. Child media controls and local toolbar controls become `inert` and `aria-hidden`, while source identity remains visible.
- A retry/resume control may be supplied through `stateAction`; the application owns transport and recovery, and the frame restores focus to that action when a focused viewport control becomes blocked. `stateLabel`, `stateDescription`, and `stateIcon` override only the normalized state's wording and glyph per `ViewerFrame`'s rules — never its blocking or live-region behavior.
- Use the local toolbar for mute, captions, snapshot, and fullscreen. Recording archives, timelines, playback-session controls, and retry policy are intentionally omitted from this DS component.
- `variant="embedded"`는 이 타일을 다른 표면 안에 중첩할 때 자체 border·radius를 생략해 부모가 최외곽선을 소유하게 합니다. source·HUD·toolbar·상태·접근성 역할은 그대로 유지됩니다. 기본값 `standalone`은 자체 외곽선을 그립니다.

Classification: **LK Robotics Extension**. Siblings checked: `ViewerFrame`, `Scene3DFrame`, `AspectRatio`, `IconButton`, `Spinner`, and `StatusBadge`.

- The [HTML media element specification](https://html.spec.whatwg.org/multipage/media.html) influenced the separation of paused, ended/unavailable, and error semantics from connection transport.
- [WebRTC Statistics](https://www.w3.org/TR/webrtc-stats/) influenced the distinction between last-frame freshness, received frames, and connection health; apps compute those states and pass the result into this component.
- [WCAG live captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html) and [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) influenced the optional captions/pause toolbar contract without embedding a product player workflow.

These expectations are adapted to LDS component roles and icons rather than copying another product's visual styling. The common state and placement contract is documented in [`ViewerFrame.prompt.md`](./ViewerFrame.prompt.md).
