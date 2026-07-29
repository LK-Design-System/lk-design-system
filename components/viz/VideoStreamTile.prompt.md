**VideoStreamTile** is the video-source preset for `ViewerFrame`.

Pass a `<video>`, WebRTC renderer, iframe, or image as `children`. The DS owns the named frame, source identity, local toolbar/HUD slots, aspect ratio, and normalized stream-state presentation. The application owns transport, autoplay policy, playback, recording, reconnection, and media permissions.

```jsx
<VideoStreamTile
  label="주 영상"
  state="live"
  toolbar={videoControls}
>
  <video aria-label="주 영상 스트림" />
</VideoStreamTile>
```

## Orthogonal state axes

New integrations should report independent `availability`, `connection`,
`freshness`, and `playback` axes. Supplying any of those axes takes precedence
over the legacy combined `state`/`status` adapter, so a stale connected stream
is not misreported as disconnected or unavailable.

- The default state is `idle`, never an unverified `live` claim. `state` is the normalized-state prop for new code; `status` is a compatibility alias that `state` always wins over — do not supply both in new work.
- The region's accessible name comes from `ariaLabel` when supplied; otherwise a string `label` derives `"{label} 영상 스트림"` and a missing/non-string label falls back to `영상 스트림`. Set `ariaLabel` explicitly whenever `label` is a non-string node or several tiles would otherwise share one name.
- `aspectRatio` (default `16 / 9`) is a CSS `aspect-ratio` value that sizes the tile from its width. Match it to the real stream ratio (`4 / 3`, `1 / 1`) instead of letterboxing inside the child renderer; give the tile an explicit height only when the owning grid requires it.
- The chrome slots follow the shared `ViewerFrame` contract: `badges` is passive identity context beside `label`, `hud` carries a few essential stream readouts, and `overlay` is a non-interactive layer above the video (crosshair, privacy mask) — controls belong in `toolbar` only.
- `live` uses both icon and text. Loading/connecting states include visible text and `aria-busy`; they do not rely on a spinner alone.
- **liveness**는 상단 우측 생존성 슬롯이다. `state="live"`의 기본 라이브 표시가
  이 자리에 렌더되며, 제품이 별도 신호를 얹어야 할 때 같은 자리에 넘긴다.
  `badges`(소스 옆 정체성 맥락)와 역할이 다르므로 섞지 않는다.
- 라이브 표시는 좌상단 소스 칩이 아니라 상단 **우측 끝**에 놓인다. 카메라 타일은
  벽면에 여러 개 깔리는 경우가 많아, 정체성(왼쪽)과 생존성(오른쪽)이 고정된 자리를
  가지면 색을 읽기 전에 배치만으로 훑을 수 있다.
- `toolbarPlacement`는 `bottom-right`가 기본이다. 재생 컨트롤은 플레이어 관례상
  하단이고, 상단 우측을 비워야 상시 표시되는 라이브 표시가 화면 끝에 붙는다.
  상단에 두면 자동 숨김 상태의 툴바가 자리를 차지해 라이브가 가장자리에서 밀린다.
- `degraded`, `stale`, `frozen`, and user-requested `paused` are distinct non-blocking states. They preserve the last frame with an edge message and use the shared state-specific retained-frame emphasis instead of one blanket dim treatment.
- `no-source`, `unavailable`, `disconnected`, `no-signal`, and `error` are blocking. Child media controls and local toolbar controls become `inert` and `aria-hidden`, while source identity remains visible.
- A retry/resume control may be supplied through `stateAction`; the application owns transport and recovery, and the frame restores focus to that action when a focused viewport control becomes blocked. `stateLabel`, `stateDescription`, and `stateIcon` override only the normalized state's wording and glyph per `ViewerFrame`'s rules — never its blocking or live-region behavior.
- Video defaults to `chromeVariant="overlay"` and `toolbarVisibility="interaction"`. Source identity plus the normalized live state remain visible; the local toolbar is visually hidden until the frame is hovered, pressed, or contains keyboard focus. Hidden controls remain in DOM/focus order so keyboard focus reveals them instead of skipping them. Use `toolbarVisibility="always"` only in a persistent single-view control surface where uninterrupted command visibility is a product requirement.
- Use the local toolbar for volume, captions, snapshot, and fullscreen. Volume is a compact media-control group: the mute button and horizontal LDS `Slider` share the overlay toolbar surface, and the rail expands on hover or focus without adding a detached label or value bubble. The native range value and trigger accessible name expose the percentage. Clicking the icon toggles mute and restores the previous non-zero level; `0` uses the muted icon and accessible name. The application owns the actual media volume state. Recording archives, timelines, playback-session controls, and retry policy are intentionally omitted from this DS component.
- Healthy live tiles omit passive resolution/FPS chrome by default. Put quality selection in settings or a product-owned detail surface; pass `metadata` only when the value is necessary to interpret the current state. `stale` and `frozen` may show compact recency such as `8초 전`, grouped with the edge-state label; the accessible state description retains the full meaning. Do not attach last-received metadata to `degraded` or user-requested `paused` unless the product reports that independent fact; it otherwise implies a transport problem that those states do not mean.
- Video keeps the shared edge grammar—source identity at the top-left and local media commands at the top-right—but adapts it to media viewing with compact translucent overlay surfaces. This is an explicit video preset difference; map and 3D keep their persistent surface chrome unless they opt into the shared `ViewerFrame` axes.
- `variant="embedded"`는 이 타일을 다른 표면 안에 중첩할 때 자체 border·radius를 생략해 부모가 최외곽선을 소유하게 합니다. source·HUD·toolbar·상태·접근성 역할은 그대로 유지됩니다. 기본값 `standalone`은 자체 외곽선을 그립니다.

Classification: **LDS Product application pattern**. Siblings checked: `ViewerFrame`, `Scene3DFrame`, `AspectRatio`, `IconButton`, `Spinner`, and `StatusBadge`.

현재 고정된 LDS Robotics와 LDS3D source에는 `VideoStreamTile` 직접 소비가 없습니다. 실제 제품 소비 근거를 확인하기 전에는 transport·protocol·robot camera 의미를 이 preset에 추가하지 않으며, 단순한 영상 상태와 chrome만 필요하면 `ViewerFrame` 직접 조합도 함께 검토합니다.

- The [HTML media element specification](https://html.spec.whatwg.org/multipage/media.html) influenced the separation of paused, ended/unavailable, and error semantics from connection transport.
- [Shaka Player UI](https://shaka-project.github.io/shaka-player/docs/api/tutorial-ui-customization.html) defines `mute_volume` as a combined mute button and volume slider container. LDS follows that compact anatomy rather than presenting volume as a settings card.
- [Video.js VolumePanel](https://docs.videojs.com/volumepanel) likewise groups `MuteToggle` and `VolumeControl`, expands the control through hover/focus interaction, and returns focus to the mute control when Escape closes the rail. LDS adapts that interaction to `ViewerToolbar`.
- [Video.js Volume Slider](https://videojs.org/docs/framework/html/reference/volume-slider) keeps the continuous 0–100 range in the player controls and exposes its numeric value through the range contract. LDS uses a short horizontal rail with a small thumb and omits a detached value bubble from the compact viewer toolbar.
- [Microsoft MediaTransportControls](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/custom-transport-controls) confirms that volume belongs with the media transport controls; it is not evidence for a detached settings popover.
- [Genetec Security Center tile customization](https://techdocs.genetec.com/r/en-US/Security-Center-User-Guide-5.13/Customizing-how-tiles-are-displayed-in-Security-Center) allows video controls, timeline, and tile toolbar to auto-hide and reappear on hover. LDS uses the same information-hierarchy conclusion while preserving keyboard focus reveal.
- [AXIS Camera Station Pro](https://help.axis.com/en-us/axis-camera-station-pro) treats camera names and recording/event indicators as optional live-view context and manages resolution/frame rate through stream profiles rather than permanent tile badges. LDS therefore keeps normal video chrome limited to identity and live truth.
- [Verkada Camera Shortcuts](https://help.verkada.com/verkada-cameras/configuration/view-and-edit-camera-settings/camera-shortcuts) reveals grid-player shortcuts on hover, reinforcing sparse multi-feed tiles rather than always-visible controls.
- [Foxglove Image panel](https://docs.foxglove.dev/docs/visualization/panels/image) keeps robot-camera output renderer-first and moves detailed topic, calibration, and decoding concerns into settings and diagnostics. LDS likewise leaves transport and detailed stream health to product-owned surfaces.
- [WebRTC Statistics](https://www.w3.org/TR/webrtc-stats/) influenced the distinction between last-frame freshness, received frames, and connection health; apps compute those states and pass the result into this component.
- [WCAG live captions](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html) and [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) influenced the optional captions/pause toolbar contract without embedding a product player workflow.

These expectations are adapted to LDS component roles and icons rather than copying another product's visual styling. The common state and placement contract is documented in [`ViewerFrame.prompt.md`](./ViewerFrame.prompt.md).

The Storybook dark-background example uses the synthetic photorealistic fixture
`stories/fixtures/video-stream-warehouse-frame.png` to evaluate viewer chrome,
status tones, and readable overlays against realistic light and color variation.
It is a generated presentation fixture, not LK product footage or product-source
evidence.
