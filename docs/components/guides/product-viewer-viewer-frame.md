# Viewer Frame

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `ViewerFrame` |
| Storybook | `LDS Product/Viewer/Viewer Frame` |
| Source | `../component-content.json#product-viewer-viewer-frame` |

지도·3D·영상 뷰어가 로딩·신호 없음·오류·지연 상태를 일관된 읽기 순서로 보여줘야 할 때 적합합니다. 정적인 이미지나 상태 전환이 없는 단순 컨테이너에는 Viewer Frame 대신 기본 Surface를 사용하세요.

## 사용 판단

### 사용

- Top chrome is compact and peer-aligned: source identity and the toolbar shelf target a 30px outer height around 28px viewport controls. Source identity uses caption1/semibold so it labels the viewport without competing with its controls or rendered content.
- WCAG 2.2 Status Messages requires state changes to be programmatically exposed without moving focus, while the WAI-ARIA Alert pattern reserves interruption for important, time-sensitive changes. ViewerFrame therefore derives urgency from blocking loss, not merely from a negative color or connection label.
- WCAG 2.2 Dragging Movements requires non-drag alternatives for operations such as pan, zoom, and fit.
- LK Control Full Daedeok — revision 93802fc2aa5d29f930380ae58d51dcb68322b5e7; frontend/src/views/dashboard/RobotDashboard/components/InteractiveMap3D/index.jsx and frontend/src/views/manual-control/index.jsx. Supported by composition.

### 사용하지 않음

- Live-region urgency follows whether a transition removes usable content. disconnected, no-signal, and error are blocking losses and use alert/assertive. Expected setup states such as no-source, loading, and connecting use status/polite.
- Toolbar actions must affect only this viewport. Document commands, scene hierarchy, properties, robot control, and emergency actions do not belong in the frame.
- All Viewer presets place source identity at the top-left, viewport-local controls at the top-right, and passive status at the bottom-left. This shared edge grammar applies to 2D map, 3D, and video; products must not move a preset toolbar merely to distinguish its content type.
- variant="embedded"는 이 프레임을 다른 LDS 표면(CanvasEditorShell의 캔버스 슬롯, Card 등) 안에 중첩할 때 자체 border·radius를 생략해 부모가 하나의 연속된 외곽선을 소유하게 합니다. 상태 모델·HUD·toolbar·region role은 그대로 유지되며, 부모 표면 안에서 style로 border/radius를 임의로 덮어쓰는 대신 이 variant를 사용합니다. 기본값 standalone은 단독 뷰포트로 자체 외곽선을 그립니다.

## Anatomy

| Part | Contract |
| --- | --- |
| children | Renderer or media content. Rendering and transport remain application-owned. |
| label | Accessible name for the region. |
| toolbar | Viewport-local controls such as zoom, fit, mute, or fullscreen. |
| toolbarPlacement | 뷰포트 조작 컨트롤이 놓이는 모서리. 배치 규약상 우하단이 기본이며, 상단은 정체성(source)과 상시 상태(liveness)에 남긴다. @default "bottom-right" |
| stateLabel | Optional user-facing override for the normalized state label. |
| stateDescription | Optional user-facing override for the normalized state description. Pass null to omit. |
| stateIcon | Optional state icon override. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No | Renderer or media content. Rendering and transport remain application-owned. |
| `label` | `string` | Yes | Accessible name for the region. |
| `source` | `React.ReactNode` | No | Visible source or viewport identity in the top-left chrome. |
| `badges` | `React.ReactNode` | No | Passive badges adjacent to the source identity. |
| `liveness` | `React.ReactNode` | No | 상단 우측 생존성 슬롯. 정체성(어느 소스인가)과 다른 축이므로 source 옆이 아니라 반대쪽 끝에 자리를 갖는다. state="live" 같은 corner 상태도 이 자리에 렌더된다. toolbar 슬롯과 달리 toolbarVisibility의 자동 숨김을 받지 않아 상시 표시된다. |
| `hud` | `React.ReactNode` | No | Compact, passive diagnostics. Keep the default HUD to essential values only. |
| `scope` | `React.ReactNode` | No | 상단 우측 범위 전환 레일 — 층·레벨·카메라처럼 "무엇을 보는가"를 바꾸는 컨트롤. 뷰 조작(toolbar)은 우하단에 남고 이 레일은 상단 우측 오버레이로 뜬다. 상단 크롬 높이를 측정해 그 아래에 붙고, 길어지면 표면을 넘지 않고 스크롤된다. toolbarPlacement="top-right"(헤더 안 in-flow 셸프)와는 다른 자리다. |
| `toolbar` | `React.ReactNode` | No | Viewport-local controls such as zoom, fit, mute, or fullscreen. |
| `toolbarPlacement` | `'top-right' \| 'bottom-right'` | No | 뷰포트 조작 컨트롤이 놓이는 모서리. 배치 규약상 우하단이 기본이며, 상단은 정체성(source)과 상시 상태(liveness)에 남긴다. @default "bottom-right" |
| `overlay` | `React.ReactNode` | No | Non-interactive render overlay placed above the content. |
| `status` | `React.ReactNode` | No | Passive metadata such as frame rate, resolution, scale, or freshness. |
| `state` | `ViewerState` | No | Legacy combined presentation state. Prefer the orthogonal state axes for new product code. @default "ready" |
| `availability` | `ViewerAvailability` | No | Source/content availability. Explicit axes take precedence over state. @default "ready" |
| `connection` | `ViewerConnection` | No | Transport connection truth. @default "connected" |
| `freshness` | `ViewerFreshness` | No | Freshness of the last rendered content. @default "current" |
| `playback` | `ViewerPlayback` | No | Playback/live presentation mode. @default "playing" |
| `stateLabel` | `React.ReactNode` | No | Optional user-facing override for the normalized state label. |
| `stateDescription` | `React.ReactNode` | No | Optional user-facing override for the normalized state description. Pass null to omit. |
| `stateIcon` | `React.ReactNode` | No | Optional state icon override. |
| `stateAction` | `React.ReactNode` | No | Optional recovery or resume action. The application owns its behavior. |
| `appearance` | `'dark' \| 'light'` | No | Theme-stable viewport presentation shared by map, 3D, and video presets. @default "dark" |
| `variant` | `'standalone' \| 'embedded'` | No | Perimeter ownership. "embedded" drops the frame's own border and radius so a parent surface (CanvasEditorShell, Card) owns one continuous outline; viewport chrome, state, and a11y roles are unchanged. @default "standalone" |
| `chromeVariant` | `'surface' \| 'overlay'` | No | Chrome treatment. "overlay" uses compact translucent edge surfaces over visual media. @default "surface" |
| `toolbarVisibility` | `'always' \| 'interaction'` | No | Toolbar reveal behavior. "interaction" shows controls while the frame is hovered, pressed, or contains focus. @default "always" |

## States

| State | Contract |
| --- | --- |
| status | Passive metadata such as frame rate, resolution, scale, or freshness. |
| state | Legacy combined presentation state. Prefer the orthogonal state axes for new product code. @default "ready" |
| stateLabel | Optional user-facing override for the normalized state label. |
| stateDescription | Optional user-facing override for the normalized state description. Pass null to omit. |
| stateIcon | Optional state icon override. |
| stateAction | Optional recovery or resume action. The application owns its behavior. |
| variant | Perimeter ownership. "embedded" drops the frame's own border and radius so a parent surface (CanvasEditorShell, Card) owns one continuous outline; viewport chrome, state, and a11y roles are unchanged. @default "standalone" |
| chromeVariant | Chrome treatment. "overlay" uses compact translucent edge surfaces over visual media. @default "surface" |

## Behavior and interaction

- toolbarVisibility는 배치와 무관하게 적용된다. top-right와 bottom-right가 같은 값에서 같게 동작한다.
- 뷰포트를 조작하는 컨트롤은 bottom-right를 쓴다. 상단을 비워 두면 상시 표시되는 상태가 화면 끝에 붙을 수 있고, 조작과 읽기가 같은 모서리를 다투지 않는다.
- Google Maps JavaScript API — Controls: 뷰를 조작하는 컨트롤을 아래로 모은다. Street View와 회전은 "appears by default near the bottom right of the map", 축척은 "always appear in the bottom right corner"이며, 프레임 수준 동작인 전체화면만 "near the top right"에 둔다. 지도 유형은 좌상단이다.
- The hud slot is compact, passive diagnostics rendered as a second row of the source identity surface. A divider separates it from source identity; it never enters the local toolbar group. Default HUD content should be limited to a few values needed to interpret the viewport.
- toolbarVisibility="always" preserves persistent map/3D controls. toolbarVisibility="interaction" visually reveals the toolbar while the frame is hovered, pressed, or contains focus.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | degraded, stale, frozen, and paused retain the last usable content and use a compact content-width edge status chip instead of covering it or presenting a full-width notification bar. |
| 명시 규칙 2 | Blocking-state marks are bare 22px status glyphs or spinners. They do not use a circular border, elevated fill, or shadow that could make a passive state mark look like an action. |
| 명시 규칙 3 | Overlay viewers apply state-specific retained-frame emphasis: degraded keeps 90% opacity, stale and frozen use 76%, and user-requested paused remains at 100%. The edge label—not a uniform dim layer—carries the primary state meaning. |
| 명시 규칙 4 | Very narrow blocking tiles keep source + state label + recovery action in normal grid flow. Below 240px, the icon and secondary description collapse visually (the description remains available to assistive technology) so 16:9 tiles do not overlap. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- At 320px, a typical three-command toolbar remains on the same top edge as a truncated source identity. The two surfaces may wrap only when their minimum usable widths no longer fit; the toolbar never shrinks its 28px targets.
- 상시 상태가 모서리를 그대로 갖고 scope는 상단 크롬 아래로 걸린다. 레일은 상단 크롬 높이를 측정해 붙으므로 HUD가 늘어도 겹치지 않는다.
- scope와 toolbar는 같은 우측 정렬선을 공유하되 자리를 다툰다. 레일은 하단 툴바가 차지한 높이를 빼고 남은 만큼만 쓰고, 층이 많아 넘치면 표면 밖으로 나가거나 툴바를 덮지 않고 스크롤한다.
- The usable frame is renderer-first. Source identity and local controls sit on separate inset edge surfaces rather than sharing a full-width header. This keeps the source readable without turning passive identity into command-bar chrome.

## Content and writing

- ready leaves chrome quiet. live adds a text-and-icon state badge; it never relies on color or motion alone.
- 생존성(live 같은 corner 상태와 liveness 슬롯)은 좌상단 정체성 칩 안이 아니라 상단 우측 끝에 자리를 갖는다. 정체성은 "어느 소스인가", 생존성은 "지금 들어오는가"로 축이 다르고, 둘을 한 칩에 합치면 소스 이름이 길어질수록 생존성이 밀린다. 자리를 갈라두면 타일이 여러 개 깔렸을 때 위치만으로 생존 여부를 훑을 수 있어 색에만 의존하지 않는다.
- Tone을 직접 전달하는 positive/cautionary/negative 상태 글리프는 공용 상태 문법과 같은 fill 변형을 사용합니다. clock, pause, signal, circle-close, circle-block처럼 상태의 원인이나 기능을 설명하는 글리프는 outline을 유지합니다.
- 오류·신호 없음·사용 불가 기본 문구는 원인만 알리는 막다른 문장이 아니라 다음 확인 행동까지 안내합니다. 제품이 더 구체적인 복구 경로를 알면 stateDescription과 stateAction으로 대체합니다.

## Accessibility

- idle, no-source, loading, connecting, unavailable, disconnected, no-signal, and error mean the content is unusable. They use a central blocking state and make renderer children and local toolbar controls inert/aria-hidden.
- Blocking presentation keeps the visible source identity. If a state transition blocks the currently focused renderer/control, focus moves to the first recovery action or to the blocking-state group instead of being discarded; after recovery it returns to that exact originating control when the control still exists.
- ViewerFrame owns the toolbar's shared contrast shelf while ViewerToolbar owns command/toggle semantics and roving focus. A zoom readout may sit between decrement and increment as passive output; fit/home remains a separate trailing command divided from the stepper.
- Source identity and the top toolbar remain on one chrome row. The row never wraps; when horizontal space is constrained, the source label keeps a single line and truncates with an ellipsis while the local controls remain fully operable.
- The control shelf is one shallow visual layer: it keeps a single border and elevated fill without shadow, while unselected toolbar buttons remain transparent. Hover, focus, pressed, and persistent toggle selection provide the only per-button surfaces.

## Exceptions

- top-right는 계약상 계속 지원한다. 상시 상태를 쓰지 않고 상단 배치가 이미 굳어진 화면은 그대로 두어도 된다. 다만 liveness와 같은 모서리에 두지는 않는다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `ViewerToolbar` | 대표 시나리오에서 조합 |
| `ViewerToolbarButton` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-cautionary-foreground`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-foreground`
- `--color-semantic-status-positive`
- `--color-semantic-status-positive-foreground`
- `--component-viewer-border`
- `--component-viewer-foreground`
- `--component-viewer-light-border`
- `--component-viewer-light-foreground`
- `--component-viewer-light-muted`
- `--component-viewer-light-surface`
- `--component-viewer-light-surface-elevated`
- `--component-viewer-muted`
- `--component-viewer-surface`
- `--component-viewer-surface-elevated`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label1-size`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--shadow-sm`
- `--viewer-border`
- `--viewer-foreground`
- `--viewer-muted`
- `--viewer-surface`
- `--viewer-surface-elevated`

### Source contracts

- `components/viz/ViewerFrame.jsx`
- `components/viz/ViewerFrame.d.ts`
- `components/viz/ViewerFrame.prompt.md`
- `stories/ViewerFrame.stories.jsx`

## Migration

- New product code uses availability, connection, freshness, and playback. The combined state prop remains a compatibility adapter and is ignored when any explicit axis is supplied.
- The badges slot is passive and must use an on-dark-compatible badge in dark appearance. Do not repeat the normalized Viewer state with a second connection badge.

## Sources

- ViewerFrame prompt contract: `components/viz/ViewerFrame.prompt.md`
- Storybook implementation evidence: `stories/ViewerFrame.stories.jsx`
- [Google Maps JavaScript API — Controls](https://developers.google.com/maps/documentation/javascript/controls)
- [Mapbox GL JS — MapaddControl](https://docs.mapbox.com/mapbox-gl-js/api/map/)
- [Miro — Toolbars](https://help.miro.com/hc/en-us/articles/360017730553-Toolbars)
- [NVIDIA Omniverse viewport controls](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/controls.html)
- [viewport navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html)
- [Unity default Scene view overlays](https://docs.unity3d.com/Manual/default-overlays-reference.html)
- [Unity Scene view draw modes](https://docs.unity3d.com/Manual/GIVis.html)
- [Mapbox Standard style](https://docs.mapbox.com/map-styles/reference/standard/)
