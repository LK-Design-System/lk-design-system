**ViewerFrame** is the shared LDS Product viewport contract for map, 3D, and video surfaces.

It provides a theme-stable viewport surface, a named `region`, source/HUD/local-toolbar slots, passive metadata, and orthogonal availability, connection, freshness, and playback axes. Renderer, media transport, reconnection, recording, and product-specific diagnostics remain application responsibilities.

Every Viewer preset uses the same `appearance="dark" | "light"` axis. `Scene3DFrame` and video default to dark while `Map2DCanvas` defaults to light, but these are contextual defaults rather than category restrictions. Both values are literal and theme-stable: they change only the scoped frame roles, never the state or interaction contract. Renderer children and custom HUD content must consume `--viewer-surface`, `--viewer-surface-elevated`, `--viewer-foreground`, `--viewer-muted`, and `--viewer-border` instead of hard-coding one palette.

```jsx
<ViewerFrame
  label="AMR-07 front camera"
  source="AMR-07 · FRONT"
  availability="ready"
  connection="connected"
  freshness="stale"
  status="마지막 수신 8초 전"
  toolbar={cameraControls}
>
  <video aria-label="AMR-07 전면 카메라 영상" />
</ViewerFrame>
```

## State and placement contract

- New product code uses `availability`, `connection`, `freshness`, and `playback`. The combined `state` prop remains a compatibility adapter and is ignored when any explicit axis is supplied.
- `idle`, `no-source`, `loading`, `connecting`, `unavailable`, `disconnected`, `no-signal`, and `error` mean the content is unusable. They use a central blocking state and make renderer children and local toolbar controls `inert`/`aria-hidden`.
- `degraded`, `stale`, `frozen`, and `paused` retain the last usable content and use an edge status strip instead of covering it.
- Blocking presentation keeps the visible source identity. If a state transition blocks the currently focused renderer/control, focus moves to the first recovery action or to the blocking-state group instead of being discarded; after recovery it returns to that exact originating control when the control still exists.
- Very narrow blocking tiles keep source + state label + recovery action in normal grid flow. Below 240px, the icon and secondary description collapse visually (the description remains available to assistive technology) so 16:9 tiles do not overlap.
- The edge strip announces only the state transition. Rapid FPS, resolution, and freshness metadata remains visually adjacent but outside the live region.
- Live-region urgency follows whether a transition removes usable content. `disconnected`, `no-signal`, and
  `error` are blocking losses and use `alert`/assertive. Expected setup states such as `no-source`, `loading`,
  and `connecting` use `status`/polite. Retained-content edge states (`degraded`, `stale`, `frozen`, `paused`)
  always remain polite so repeated transport changes do not interrupt the user's current announcement.
- `ready` leaves chrome quiet. `live` adds a text-and-icon state badge; it never relies on color or motion alone.
- Tone을 직접 전달하는 positive/cautionary/negative 상태 글리프는 공용 상태 문법과 같은 fill 변형을 사용합니다. `clock`, `pause`, `signal`, `circle-block`처럼 상태의 원인이나 기능을 설명하는 글리프는 outline을 유지합니다.
- 오류·신호 없음·사용 불가 기본 문구는 원인만 알리는 막다른 문장이 아니라 다음 확인 행동까지 안내합니다. 제품이 더 구체적인 복구 경로를 알면 `stateDescription`과 `stateAction`으로 대체합니다.
- Every normalized state ships a default label and glyph. `stateLabel` overrides only the user-facing wording (e.g. a product term for `stale`) and `stateIcon` only the glyph; neither changes the state's blocking behavior, live-region urgency, or tone. Do not use them to make a blocking state look healthy.
- The `hud` slot is compact, passive diagnostics rendered in the top chrome next to the source identity. Default HUD content should be limited to a few values needed to interpret the viewport. Detailed renderer diagnostics belong in an optional product surface.
- Toolbar actions must affect only this viewport. Document commands, scene hierarchy, properties, robot control, and emergency actions do not belong in the frame.
- Use `toolbarPlacement="top-right"` for 3D/video camera controls and `bottom-right` when a map's scale/status occupies the opposite edge.
- The `badges` slot is passive and must use an on-dark-compatible badge in dark appearance. Do not repeat the normalized Viewer state with a second connection badge.
- Appearance parity is checked with equivalent map and 3D stories. A light or dark variant must keep the same slots, state behavior, focus behavior, and control availability.
- `variant="embedded"`는 이 프레임을 다른 LDS 표면(`CanvasEditorShell`의 캔버스 슬롯, `Card` 등) 안에 중첩할 때 자체 border·radius를 생략해 부모가 하나의 연속된 외곽선을 소유하게 합니다. 상태 모델·HUD·toolbar·region role은 그대로 유지되며, 부모 표면 안에서 `style`로 border/radius를 임의로 덮어쓰는 대신 이 variant를 사용합니다. 기본값 `standalone`은 단독 뷰포트로 자체 외곽선을 그립니다.

## Design basis

Classification: **LDS Product application pattern**. Sibling contracts checked: `Map2DCanvas`, `Scene3DFrame`, `VideoStreamTile`, `ViewerToolbar`, `IconButton`, `Spinner`, `StatusIndicator`, `StatusBadge`, `CanvasEditorShell`, and `ViewportStatusBar`.

- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html) and [viewport navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html) influenced the scene-first hierarchy and the small set of viewport-local controls.
- [Unity default Scene view overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html) influenced edge-attached orientation, navigation, and overlay placement rather than card-within-card chrome.
- [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html) expose multiple lighting/debug presentations and customizable diagnostic colors rather than prescribing one permanent viewport palette. LDS therefore treats dark as the 3D default, not as a 3D-only capability.
- [Mapbox Standard style](https://docs.mapbox.com/map-styles/reference/standard/) and its [runtime style configuration](https://docs.mapbox.com/map-styles/guides/standard-styles/) expose day/night-adjacent lighting presets and runtime updates. LDS therefore keeps both light and dark available to map viewports.
- [WAI-ARIA Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) keeps keyboard behavior in the composed toolbar instead of making the viewport frame a second toolbar implementation.
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) requires state
  changes to be programmatically exposed without moving focus, while the [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
  reserves interruption for important, time-sensitive changes. ViewerFrame therefore derives urgency from
  blocking loss, not merely from a negative color or connection label.
- [WCAG 2.2 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) requires non-drag alternatives for operations such as pan, zoom, and fit.

Intentional LDS adaptation: external tools offer more granular lighting/style controls and dense desktop chrome. ViewerFrame deliberately exposes only a two-value presentation axis bound to LDS component roles and keeps responsive chrome sparse. Intentionally excluded from the DS layer are render engines, scene hierarchy, property editing, transform gizmos, stream reconnection policy, recording/seek sessions, robot commands, and product threshold schemas.
