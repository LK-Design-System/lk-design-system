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

- The default state is `idle`, never an unverified `live` claim.
- `live` uses both icon and text. Loading/connecting states include visible text and `aria-busy`; they do not rely on a spinner alone.
- `degraded`, `stale`, `frozen`, and user-requested `paused` are distinct non-blocking states. They preserve the last frame with an edge message.
- `no-source`, `unavailable`, `disconnected`, `no-signal`, and `error` are blocking. Child media controls and local toolbar controls become `inert` and `aria-hidden`, while source identity remains visible.
- A retry/resume control may be supplied through `stateAction`; the application owns transport and recovery, and the frame restores focus to that action when a focused viewport control becomes blocked.
- Use the local toolbar for mute, captions, snapshot, and fullscreen. Recording archives, timelines, playback-session controls, and retry policy are intentionally omitted from this DS component.

Classification: **LK Robotics Extension**. Siblings checked: `ViewerFrame`, `Scene3DFrame`, `AspectRatio`, `IconButton`, `Spinner`, and `StatusBadge`.

- The [HTML media element specification](https://html.spec.whatwg.org/multipage/media.html) influenced the separation of paused, ended/unavailable, and error semantics from connection transport.
- [WebRTC Statistics](https://www.w3.org/TR/webrtc-stats/) influenced the distinction between last-frame freshness, received frames, and connection health; apps compute those states and pass the result into this component.
- [WCAG live captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html) and [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) influenced the optional captions/pause toolbar contract without embedding a product player workflow.

These expectations are adapted to LDS component roles and icons rather than copying another product's visual styling. The common state and placement contract is documented in [`ViewerFrame.prompt.md`](./ViewerFrame.prompt.md).
