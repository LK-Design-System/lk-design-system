# Video Playback Controls

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Viewer |
| Owner | `VideoPlaybackControls` |
| Storybook | `LDS Product/Viewer/Video Playback Controls` |
| Source | `../component-content.json#product-viewer-video-playback-controls` |

재생 위치를 탐색하는 데 적합한 녹화 영상 조작입니다. 실시간 피드만 표시할 때는 영상 스트림을 사용하세요. 재생 상태와 권한, 원본 촬영 시각은 제품이 관리합니다.

## 사용 판단

### 사용

- 제품이 와 URL/권한/transport, 실제 play/pause/ended/waiting/error event, seek 가능 구간, fullscreen API, PTS 및 현장 시각, 재시도/복구를 소유합니다. 컴포넌트는 media element나 clock을 만들지 않습니다.

### 사용하지 않음

- live-only iframe이나 무한 duration의 stream을 임의의 녹화 timeline으로 표현하지 않습니다. 자막·재생 속도·다운로드·카메라 선택은 이번 공용 계약에 포함하지 않습니다.
- 모든 상태는 controlled입니다. callback은 요청일 뿐 실제 재생·음소거·fullscreen의 성공을 뜻하지 않습니다. 실제 media event로 props를 갱신합니다.
- onMutedChange·onFullscreenChange가 없으면 해당 명령을 숨깁니다. seek callback 또는 play callback이 없으면 그 명령은 비활성입니다.
- MDN video control styling: media command·seek·시간을 연결된 영역으로 묶습니다. 외부 스타일 수치를 복사하지 않고 LDS sibling 문법을 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Accessible group name. @default "영상 재생 조작" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `currentTime` | `number` | No | Media position in elapsed seconds. @default 0 |
| `duration` | `number \| null` | No | Finite media length in seconds. Missing, nonpositive, NaN or Infinity disables seeking. |
| `playing` | `boolean` | No | Actual playing state supplied by media events. @default false |
| `muted` | `boolean` | No | Actual mute state. @default false |
| `fullscreen` | `boolean` | No | Whether the consumer's chosen viewer root is fullscreen. @default false |
| `loading` | `boolean` | No | Buffering/loading feedback, independent of availability. @default false |
| `disabled` | `boolean` | No | All commands unavailable. @default false |
| `seekDisabled` | `boolean` | No | Seeking unavailable while other commands can remain available. @default false |
| `onPlayingChange` | `(playing: boolean) = void` | No | Requested play/pause state; the consumer reconciles actual media events. |
| `onSeek` | `(seconds: number) = void` | No | Requested seconds, once on pointer release or on each native keyboard change. |
| `onMutedChange` | `(muted: boolean) = void` | No | Requested mute state. Omit to remove the mute control. |
| `onFullscreenChange` | `(fullscreen: boolean) = void` | No | Requested fullscreen state. Omit when fullscreen is unsupported. |
| `appearance` | `'minimal' \| 'surface' \| 'on-dark'` | No | Same viewer surface vocabulary as ViewerToolbar. @default "on-dark" |
| `variant` | `'standalone' \| 'embedded'` | No | Perimeter owner: standalone owns border/radius; embedded lets the viewer own them. @default "standalone" |
| `label` | `string` | No | Accessible group name. @default "영상 재생 조작" |

## States

| State | Contract |
| --- | --- |
| loading | Buffering/loading feedback, independent of availability. @default false |
| disabled | All commands unavailable. @default false |
| seekDisabled | Seeking unavailable while other commands can remain available. @default false |
| variant | Perimeter owner: standalone owns border/radius; embedded lets the viewer own them. @default "standalone" |

## Behavior and interaction

- MDN waiting·error·Fullscreen: buffering/load failure/실제 fullscreen은 다른 상태이며 제품 adapter가 reconciles합니다.
- VideoPlaybackControls — LDS Product의 녹화 미디어 재생 조작입니다. 재생·일시 정지, 초 단위 탐색, 경과/전체 시간, 음소거, 전체 화면 intent를 하나의 controlled 조합으로 제공합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | duration이 미확보, null, NaN, Infinity, 0 이하이면 시간을 —로 표시하고 seek를 비활성화합니다. 미확보 길이 때문에 이미 확인된 경과 시간을 지우지 않습니다. 유효한 0초 위치는 0:00입니다. 값은 [0,duration]에 제한됩니다. |
| 명시 규칙 2 | pointer drag 중 preview만 갱신하고 release에서 onSeek를 한 번 호출합니다. primary/왼쪽 버튼과 pointerId를 결합하고 cancel·창 blur·capture 손실·unmount·seek 불가 전환은 commit하지 않습니다. keyboard는 native range의 Arrow±0.1초, Home/End를 그대로 사용하고 각 값 변경을 전달합니다. |
| 명시 규칙 3 | MDN HTMLMediaElement: currentTime/duration과 media events가 실제 상태의 정본입니다. NaN/Infinity를 유효한 길이나 0으로 만들지 않습니다. |
| 명시 규칙 4 | 시각·DOM 순서는 재생 → seek → 시간 → 음소거 → 전체 화면이며, native Tab 순서는 재생 → seek → 음소거 → 전체 화면입니다. 시간은 별도 포커스를 받지 않고 Slider aria-valuetext와 함께 읽습니다. 기본 배치는 한 줄이며 seek가 남은 폭을 사용합니다. 28px 명령과 4px 내부 간격을 유지하고 embedded 높이는 36px, standalone 높이는 38px입니다. 380px 미만에서는 경과 시간만 표시하며 전체 시간은 clock title과 Slider aria-valuetext에 보존합니다. |
| --border-thin | 1px |

## Content and writing

- seekDisabled는 탐색만 막습니다. appearance는 minimal/surface/on-dark이며 label은 label로 제공합니다.
- W3C Slider pattern·Media seek slider: 명명된 slider, 초 numeric와 분·초 valuetext, 방향키·Home/End. Native range를 우선하고 toolbar 방향키 충돌을 피합니다.
- 제품이 영상 위에 촬영 시각을 표시할 때는 var(--color-semantic-on-media-scrim) 위에 var(--color-semantic-on-media-label)을 사용합니다. 밝은 영상의 작은 글자에는 var(--color-semantic-on-media-scrim-strong)으로 배경을 진하게 할 수 있습니다. 라벨이나 경계의 얇은 테두리는 var(--color-semantic-on-media-border), 선택한 대상의 강조선은 var(--color-semantic-media-target)을 사용합니다.

## Accessibility

- VideoStreamTile은 영상·상태·source identity의 frame, ViewerToolbar는 viewport 명령의 roving toolbar입니다. 두 컴포넌트는 재생 위치와 duration을 소유하지 않습니다. 이 조합은 Slider와 IconButton을 재사용하면서 녹화 탐색의 접근성·시간 표현·pointer commit을 한 곳에서 소유합니다.
- label은 한국어 동사이며 native Slider에 초 단위 numeric range와 분·초 aria-valuetext를 함께 제공합니다. 자동 시간 갱신에 aria-live를 붙이지 않습니다. Focus ring은 Core 전역 계약을 재사용합니다.
- | 항목 | 결정과 근거 | | --- | --- | | control/glyph | ViewerToolbar의 28px/16px 유지. 24px 최소 target을 충족하며 narrow에서도 축소하지 않음 | | radius/hover/disabled/focus/motion | Core IconButton/Slider/Spinner 그대로 사용.
- 실제 source story는 stories/VideoPlaybackControls.stories.jsx입니다. Overview/Narrow/Dark는 실제 창고 footage를 VideoStreamTile에 넣은 embedded 조합이며, VariantsStates는 standalone 표면과 ViewerToolbar를 비교합니다. 표적 source bundle, keyboard/drag/controlled callbacks, 760px/320px, light/dark/inverse 및 loading/disabled/unknown duration을 검증합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `DotMatrixPreview` | 대표 시나리오에서 조합 |
| `ElevatorFleetOverview` | 대표 시나리오에서 조합 |
| `FloorSelector` | 대표 시나리오에서 조합 |
| `Map2DCanvas` | 대표 시나리오에서 조합 |
| `Scene3DFrame` | 대표 시나리오에서 조합 |
| `VIEWER_BLOCKING_STATES` | 대표 시나리오에서 조합 |
| `VIEWER_STATES` | 대표 시나리오에서 조합 |
| `VideoStreamTile` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<VideoPlaybackControls
  currentTime={media.currentTime} duration={media.duration}
  playing={media.playing} muted={media.muted} loading={media.buffering}
  onPlayingChange={requestPlaying} onSeek={requestSeek}
  onMutedChange={requestMuted} onFullscreenChange={requestFullscreen}
/>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--radius-md`
- `--space-1`
- `--space-2`

### Source contracts

- `components/viz/VideoPlaybackControls.jsx`
- `components/viz/VideoPlaybackControls.d.ts`
- `components/viz/VideoPlaybackControls.prompt.md`
- `stories/VideoPlaybackControls.stories.jsx`

## Sources

- VideoPlaybackControls prompt contract: `components/viz/VideoPlaybackControls.prompt.md`
- Storybook implementation evidence: `stories/VideoPlaybackControls.stories.jsx`
- [W3C Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [Media seek slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-seek/)
- [MDN HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [MDN waiting](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event)
- [error](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event)
- [Fullscreen](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [MDN video control styling](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Video_player_styling_basics)
