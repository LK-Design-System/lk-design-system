**ViewerFrame** is the shared LDS Product viewport contract for map, 3D, and video surfaces.

It provides a theme-stable viewport surface, a named `region`, source/HUD/local-toolbar slots, passive metadata, and orthogonal availability, connection, freshness, and playback axes. Renderer, media transport, reconnection, recording, and product-specific diagnostics remain application responsibilities.

Every Viewer preset uses the same `appearance="dark" | "light"` axis. `Scene3DFrame` and video default to dark while `Map2DCanvas` defaults to light, but these are contextual defaults rather than category restrictions. Both values are literal and theme-stable: they change only the scoped frame roles, never the state or interaction contract. Renderer children and custom HUD content must consume `--viewer-surface`, `--viewer-surface-elevated`, `--viewer-foreground`, `--viewer-muted`, and `--viewer-border` instead of hard-coding one palette.

```jsx
<ViewerFrame
  label="주 영상 뷰포트"
  source="영상 소스 A"
  availability="ready"
  connection="connected"
  freshness="stale"
  status="8초 전"
  toolbar={cameraControls}
>
  <video aria-label="영상 소스 A" />
</ViewerFrame>
```

## State and placement contract

- New product code uses `availability`, `connection`, `freshness`, and `playback`. The combined `state` prop remains a compatibility adapter and is ignored when any explicit axis is supplied.
- `idle`, `no-source`, `loading`, `connecting`, `unavailable`, `disconnected`, `no-signal`, and `error` mean the content is unusable. They use a central blocking state and make renderer children and local toolbar controls `inert`/`aria-hidden`.
- `degraded`, `stale`, `frozen`, and `paused` retain the last usable content and use a compact content-width edge status chip instead of covering it or presenting a full-width notification bar. A passive label + timestamp targets the same 24px HUD density as FPS/zoom metadata (`caption2`, 16px state mark); a supplied recovery action may expand the chip only to that control's height.
- Blocking-state marks are bare 22px status glyphs or spinners. They do not use a circular border, elevated fill, or shadow that could make a passive state mark look like an action. `disconnected` uses an outlined close mark while `no-signal` keeps the signal glyph so transport loss and source-signal loss remain distinguishable without color.
- Overlay viewers apply state-specific retained-frame emphasis: `degraded` keeps 90% opacity, `stale` and `frozen` use 76%, and user-requested `paused` remains at 100%. The edge label—not a uniform dim layer—carries the primary state meaning.
- Blocking presentation keeps the visible source identity. If a state transition blocks the currently focused renderer/control, focus moves to the first recovery action or to the blocking-state group instead of being discarded; after recovery it returns to that exact originating control when the control still exists.
- Very narrow blocking tiles keep source + state label + recovery action in normal grid flow. Below 240px, the icon and secondary description collapse visually (the description remains available to assistive technology) so 16:9 tiles do not overlap.
- At 320px, a typical three-command toolbar remains on the same top edge as a truncated source identity. The two surfaces may wrap only when their minimum usable widths no longer fit; the toolbar never shrinks its 28px targets.
- The edge strip announces only the state transition. Rapid FPS, resolution, and freshness metadata remains visually adjacent but outside the live region.
- Live-region urgency follows whether a transition removes usable content. `disconnected`, `no-signal`, and
  `error` are blocking losses and use `alert`/assertive. Expected setup states such as `no-source`, `loading`,
  and `connecting` use `status`/polite. Retained-content edge states (`degraded`, `stale`, `frozen`, `paused`)
  always remain polite so repeated transport changes do not interrupt the user's current announcement.
- `ready` leaves chrome quiet. `live` adds a text-and-icon state badge; it never relies on color or motion alone.
- 생존성(`live` 같은 corner 상태와 `liveness` 슬롯)은 좌상단 정체성 칩 안이 아니라
  상단 **우측 끝**에 자리를 갖는다. 정체성은 "어느 소스인가", 생존성은 "지금
  들어오는가"로 축이 다르고, 둘을 한 칩에 합치면 소스 이름이 길어질수록 생존성이
  밀린다. 자리를 갈라두면 타일이 여러 개 깔렸을 때 위치만으로 생존 여부를 훑을 수
  있어 색에만 의존하지 않는다.
- `liveness` 영역은 `toolbarVisibility`의 자동 숨김을 받지 않는다. 상시 표시가
  필요한 신호를 자동으로 사라지는 toolbar 슬롯에 담지 않는다.
- `toolbarVisibility`는 배치와 무관하게 적용된다. `top-right`와 `bottom-right`가
  같은 값에서 같게 동작한다.

## 컨트롤 배치 규약

네 모서리의 역할을 고정한다. **위는 무엇을 보는가, 아래는 어떻게 보는가**다.

| 모서리 | 역할 | 예 |
| --- | --- | --- |
| 좌상단 | 정체성 | `source` — 어느 소스인가 |
| 우상단 | 상시 상태 | `liveness`, `live` corner 상태 |
| 우상단 레일 | 범위 전환 | `scope` — 층·레벨·카메라 |
| 좌하단 | 판독값 | `status` — 줌 %, FPS, 갱신 시각 |
| 우하단 | 뷰포트 조작 | `toolbar` — 줌·초기화·재생 도구 |

- `scope`는 상단에 놓이는 유일한 조작이다. 축이 뷰포트 조작과 다르기 때문이다:
  줌은 같은 데이터를 다르게 보고, 층 전환은 **다른 데이터를 부른다**. 정체성이
  "어느 소스인가"라면 범위는 "그 소스의 어느 단면인가"라 같은 질문의 연장이다.
- 상시 상태가 모서리를 그대로 갖고 `scope`는 상단 크롬 **아래로** 걸린다. 레일은
  상단 크롬 높이를 측정해 붙으므로 HUD가 늘어도 겹치지 않는다.
- `scope`와 `toolbar`는 같은 우측 정렬선을 공유하되 자리를 다툰다. 레일은 하단
  툴바가 차지한 높이를 빼고 남은 만큼만 쓰고, 층이 많아 넘치면 표면 밖으로
  나가거나 툴바를 덮지 않고 스크롤한다.

- 뷰포트를 조작하는 컨트롤은 `bottom-right`를 쓴다. 상단을 비워 두면 상시 표시되는
  상태가 화면 끝에 붙을 수 있고, 조작과 읽기가 같은 모서리를 다투지 않는다.
- `top-right`는 계약상 계속 지원한다. 상시 상태를 쓰지 않고 상단 배치가 이미 굳어진
  화면은 그대로 두어도 된다. 다만 `liveness`와 같은 모서리에 두지는 않는다.

### External category evidence

- [Google Maps JavaScript API — Controls](https://developers.google.com/maps/documentation/javascript/controls):
  뷰를 조작하는 컨트롤을 아래로 모은다. Street View와 회전은 "appears by default near
  the bottom right of the map", 축척은 "always appear in the bottom right corner"이며,
  프레임 수준 동작인 전체화면만 "near the top right"에 둔다. 지도 유형은 좌상단이다.
- [Mapbox GL JS — `Map#addControl`](https://docs.mapbox.com/mapbox-gl-js/api/map/):
  `position`이 "Defaults to `'top-right'`". 이는 라이브러리 호출 기본값이지 배치 권고가
  아니므로 규약의 근거로 삼지 않는다.
- [Miro — Toolbars](https://help.miro.com/hc/en-us/articles/360017730553-Toolbars):
  줌을 포함한 내비게이션 도구를 보드 우하단에 둔다.
- 영상 플레이어는 재생·볼륨·전체화면을 하단 바에 두는 것이 브라우저 기본 컨트롤과
  주요 제품에서 공통으로 관찰되는 관례다. 별도 published guideline을 근거로 인용하지는
  않는다.

외부 자료는 카테고리 관례의 근거이며 외부 제품 styling을 복제하지 않는다.
- The usable frame is renderer-first. Source identity and local controls sit on separate inset edge surfaces rather than sharing a full-width header. This keeps the source readable without turning passive identity into command-bar chrome.
- Source identity uses the LDS `caption1`/semibold hierarchy in both the regular identity surface and blocking-state header so it stays subordinate beside 28px viewport controls.
- Tone을 직접 전달하는 positive/cautionary/negative 상태 글리프는 공용 상태 문법과 같은 fill 변형을 사용합니다. `clock`, `pause`, `signal`, `circle-close`, `circle-block`처럼 상태의 원인이나 기능을 설명하는 글리프는 outline을 유지합니다.
- 오류·신호 없음·사용 불가 기본 문구는 원인만 알리는 막다른 문장이 아니라 다음 확인 행동까지 안내합니다. 제품이 더 구체적인 복구 경로를 알면 `stateDescription`과 `stateAction`으로 대체합니다.
- Every normalized state ships a default label and glyph. `stateLabel` overrides only the user-facing wording (e.g. a product term for `stale`) and `stateIcon` only the glyph; neither changes the state's blocking behavior, live-region urgency, or tone. Do not use them to make a blocking state look healthy.
- The `hud` slot is compact, passive diagnostics rendered as a second row of the source identity surface. A divider separates it from source identity; it never enters the local toolbar group. Default HUD content should be limited to a few values needed to interpret the viewport. Detailed renderer diagnostics belong in an optional product surface.
- Toolbar actions must affect only this viewport. Document commands, scene hierarchy, properties, robot control, and emergency actions do not belong in the frame.
- ViewerFrame owns the toolbar's shared contrast shelf while `ViewerToolbar` owns command/toggle semantics and roving focus. A zoom readout may sit between decrement and increment as passive output; fit/home remains a separate trailing command divided from the stepper.
- Source identity and the top toolbar remain on one chrome row. The row never wraps; when horizontal space is constrained, the source label keeps a single line and truncates with an ellipsis while the local controls remain fully operable.
- Top chrome is compact and peer-aligned: source identity and the toolbar shelf target a 30px outer height around 28px viewport controls. Source identity uses `caption1`/semibold so it labels the viewport without competing with its controls or rendered content.
- The control shelf is one shallow visual layer: it keeps a single border and elevated fill without shadow, while unselected toolbar buttons remain transparent. Hover, focus, pressed, and persistent toggle selection provide the only per-button surfaces.
- `chromeVariant="surface"` is the default shared viewer treatment. `chromeVariant="overlay"` uses compact translucent identity, toolbar, metadata, and retained-state surfaces when renderer visibility should dominate, as in video. It changes chrome anatomy only; state priority, DOM order, and accessibility roles remain the same.
- `toolbarVisibility="always"` preserves persistent map/3D controls. `toolbarVisibility="interaction"` visually reveals the toolbar while the frame is hovered, pressed, or contains focus. The controls remain in keyboard order while visually hidden, and their own focus reveals the shelf; blocking states still make them `inert` and `aria-hidden`.
- All Viewer presets place source identity at the top-left, viewport-local controls at the top-right, and passive status at the bottom-left. This shared edge grammar applies to 2D map, 3D, and video; products must not move a preset toolbar merely to distinguish its content type.
- The `badges` slot is passive and must use an on-dark-compatible badge in dark appearance. Do not repeat the normalized Viewer state with a second connection badge.
- Appearance parity is checked with equivalent map and 3D stories. A light or dark variant must keep the same slots, state behavior, focus behavior, and control availability.
- `variant="embedded"`는 이 프레임을 다른 LDS 표면(`CanvasEditorShell`의 캔버스 슬롯, `Card` 등) 안에 중첩할 때 자체 border·radius를 생략해 부모가 하나의 연속된 외곽선을 소유하게 합니다. 상태 모델·HUD·toolbar·region role은 그대로 유지되며, 부모 표면 안에서 `style`로 border/radius를 임의로 덮어쓰는 대신 이 variant를 사용합니다. 기본값 `standalone`은 단독 뷰포트로 자체 외곽선을 그립니다.

## Design basis

Classification: **LDS Product application pattern**. Sibling contracts checked: `Map2DCanvas`, `Scene3DFrame`, `VideoStreamTile`, `ViewerToolbar`, `IconButton`, `Spinner`, `StatusIndicator`, `StatusBadge`, `CanvasEditorShell`, and `ViewportStatusBar`.

- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html) and [viewport navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html) influenced the scene-first hierarchy and the small set of viewport-local controls.
- [Unity default Scene view overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html) influenced edge-attached orientation, navigation, and overlay placement rather than card-within-card chrome.
- [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html) expose multiple lighting/debug presentations and customizable diagnostic colors rather than prescribing one permanent viewport palette. LDS therefore treats dark as the 3D default, not as a 3D-only capability.
- [Mapbox Standard style](https://docs.mapbox.com/map-styles/reference/standard/) and its [runtime style configuration](https://docs.mapbox.com/map-styles/guides/standard-styles/) expose day/night-adjacent lighting presets and runtime updates. LDS therefore keeps both light and dark available to map viewports.
- [Mapbox NavigationControl](https://docs.mapbox.com/mapbox-gl-js/api/markers/#navigationcontrol) groups related zoom and compass commands into one control instead of presenting equal floating buttons as unrelated actions. LDS keeps compact 28px commands inside one shared contrast shelf.
- [Google Maps controls](https://developers.google.com/maps/documentation/javascript/controls) place viewport-local controls at logical canvas edges and adapt their visibility to available map size. LDS keeps supplied commands available but lets the identity and control surfaces wrap independently instead of reserving a permanent full-width toolbar row.
- [Figma zoom and view options](https://help.figma.com/hc/en-us/articles/360041065034-Adjust-your-zoom-and-view-options) treats the current percentage as a value that can be read or changed, not as a third icon command. LDS examples therefore keep the numeric readout visually central between decrement and increment.
- [Autodesk model viewing toolbars](https://help.autodesk.com/cloudhelp/ENU/Collab-Home/files/using-the-viewer/Design_Collab_Viewing_Toolbar.html) distinguishes fit-to-view and navigation tools from model identity. LDS likewise separates source identity, viewport commands, and diagnostic status into independent role groups.
- [WAI-ARIA Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) keeps keyboard behavior in the composed toolbar instead of making the viewport frame a second toolbar implementation.
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) requires state
  changes to be programmatically exposed without moving focus, while the [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
  reserves interruption for important, time-sensitive changes. ViewerFrame therefore derives urgency from
  blocking loss, not merely from a negative color or connection label.
- [WCAG 2.2 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) requires non-drag alternatives for operations such as pan, zoom, and fit.

Intentional LDS adaptation: external tools offer more granular lighting/style controls and dense desktop chrome. ViewerFrame deliberately exposes only a two-value presentation axis bound to LDS component roles and keeps responsive chrome sparse. Intentionally excluded from the DS layer are render engines, scene hierarchy, property editing, transform gizmos, stream reconnection policy, recording/seek sessions, robot commands, and product threshold schemas.

## Product workflow gate

- **LK Web Viz** — revision `a984def117c05acd213f494cbb8a42e990595505`; `frontend/src/components/Map2DViewer.tsx`, `frontend/src/components/map/MapPreview.tsx`, and `frontend/src/components/editor/PcdMap3DPanel.tsx`. **Supported by composition.** The product sources confirm renderer-owned pan/zoom, map/scene data, and loading/error truth. ViewerFrame supplies reusable identity, local-command placement, and normalized blocking/retained-content presentation without copying the authoring screen.
- **LK Control Full Daedeok** — revision `93802fc2aa5d29f930380ae58d51dcb68322b5e7`; `frontend/src/views/dashboard/RobotDashboard/components/InteractiveMap3D/index.jsx` and `frontend/src/views/manual-control/index.jsx`. **Supported by composition.** Map/stream surfaces can use the shared frame, while PTZ commands, robot authority, transport, multi-stream layout, and recovery policy remain product-owned.
- **LK Portal** — revision `e5ee99d5062170e26abe63d9105c2b8a024ce710`; `src/app/page.tsx`, `src/app/projects/page.tsx`, and `src/components/chat/FloatingChat.tsx`. **Not applicable.** The pinned frontend owns project/evidence/chat workflows and exposes no map, 3D, or video viewport-local navigation contract.
