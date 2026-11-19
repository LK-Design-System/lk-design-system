**VideoPlaybackControls** — LDS Product의 녹화 미디어 재생 조작입니다. 재생·일시 정지, 초 단위 탐색, 경과/전체 시간, 음소거, 전체 화면 intent를 하나의 controlled 조합으로 제공합니다.

## 선택과 소유 경계

- Runtime owner: `product`, provenance: `product-extension`.
- `VideoStreamTile`은 영상·상태·source identity의 frame, `ViewerToolbar`는 viewport 명령의 roving toolbar입니다. 두 컴포넌트는 재생 위치와 duration을 소유하지 않습니다. 이 조합은 `Slider`와 `IconButton`을 재사용하면서 녹화 탐색의 접근성·시간 표현·pointer commit을 한 곳에서 소유합니다.
- 제품이 `<video>`와 URL/권한/transport, 실제 play/pause/ended/waiting/error event, seek 가능 구간, fullscreen API, PTS 및 현장 시각, 재시도/복구를 소유합니다. 컴포넌트는 media element나 clock을 만들지 않습니다.
- live-only iframe이나 무한 duration의 stream을 임의의 녹화 timeline으로 표현하지 않습니다. 자막·재생 속도·다운로드·카메라 선택은 이번 공용 계약에 포함하지 않습니다.

```jsx
<VideoPlaybackControls
  currentTime={media.currentTime} duration={media.duration}
  playing={media.playing} muted={media.muted} loading={media.buffering}
  onPlayingChange={requestPlaying} onSeek={requestSeek}
  onMutedChange={requestMuted} onFullscreenChange={requestFullscreen}
/>
```

## Anatomy, state, interaction

시각·DOM 순서는 재생 → seek → 시간 → 음소거 → 전체 화면이며, native Tab 순서는 재생 → seek → 음소거 → 전체 화면입니다. 시간은 별도 포커스를 받지 않고 Slider aria-valuetext와 함께 읽습니다. 기본 배치는 한 줄이며 seek가 남은 폭을 사용합니다. 28px 명령과 4px 내부 간격을 유지하고 embedded 높이는 36px, standalone 높이는 38px입니다. 380px 미만에서는 경과 시간만 표시하며 전체 시간은 clock title과 Slider aria-valuetext에 보존합니다. 320px 영상에서도 버튼 크기와 slider keyboard를 유지합니다. ViewerToolbar처럼 방향키를 가로채는 roving composite를 만들지 않고 `role="group"`의 native Tab 순서를 사용합니다.

- 모든 상태는 controlled입니다. callback은 요청일 뿐 실제 재생·음소거·fullscreen의 성공을 뜻하지 않습니다. 실제 media event로 props를 갱신합니다.
- `duration`이 미확보, null, NaN, Infinity, 0 이하이면 시간을 `—`로 표시하고 seek를 비활성화합니다. 미확보 길이 때문에 이미 확인된 경과 시간을 지우지 않습니다. 유효한 0초 위치는 `0:00`입니다. 값은 `[0,duration]`에 제한됩니다.
- `loading`은 busy feedback이며 `disabled`와 독립입니다. buffering 중에도 가능한 일시 정지 명령을 남길 수 있습니다. 초기 로드의 실제 가용성은 caller가 `disabled`로 전달합니다.
- `variant="standalone"`은 자체 border/radius를 소유하고 `variant="embedded"`는 border/radius/shadow를 제거하여 VideoStreamTile 또는 caller의 단일 둘레를 보존합니다.
- `seekDisabled`는 탐색만 막습니다. `appearance`는 `minimal/surface/on-dark`이며 label은 `label`로 제공합니다.
- pointer drag 중 preview만 갱신하고 release에서 `onSeek`를 한 번 호출합니다. primary/왼쪽 버튼과 pointerId를 결합하고 cancel·창 blur·capture 손실·unmount·seek 불가 전환은 commit하지 않습니다. keyboard는 native range의 Arrow±0.1초, Home/End를 그대로 사용하고 각 값 변경을 전달합니다.
- `onMutedChange`·`onFullscreenChange`가 없으면 해당 명령을 숨깁니다. seek callback 또는 play callback이 없으면 그 명령은 비활성입니다.
- label은 한국어 동사이며 native Slider에 초 단위 numeric range와 분·초 `aria-valuetext`를 함께 제공합니다. 자동 시간 갱신에 `aria-live`를 붙이지 않습니다. Focus ring은 Core 전역 계약을 재사용합니다.

## LDS sibling visual delta inventory

검토 sibling: `ViewerToolbar`, `VideoStreamTile`, `IconButton`, `Slider`, `Spinner`의 구현·타입·prompt·stories.

| 항목 | 결정과 근거 |
| --- | --- |
| control/glyph | ViewerToolbar의 28px/16px 유지. 24px 최소 target을 충족하며 narrow에서도 축소하지 않음 |
| radius/hover/disabled/focus/motion | Core IconButton/Slider/Spinner 그대로 사용. 별도 내부 CSS override·focus ring·animation 없음 |
| surface | ViewerToolbar의 `minimal/surface/on-dark` 어휘와 `_viewerOverlaySurface.strong` recipe 재사용. 새로운 색·그림자·leading stripe 없음 |
| 폭/순서 | 재생→seek→시간→음소거→fullscreen 한 줄, seek만 유연한 폭. 상시 82px 두 줄은 작은 영상의 약 1/3을 가려 철회. WAI seek 의미를 유지하면서 실제 footage 가림을 줄임 |
| 둘레 소유 | standalone/embedded는 기존 VideoStreamTile과 같은 소유 어휘. 프레임에 edge-to-edge로 포함할 때 embedded를 써 중복 border/radius 제거 |
| theme | on-dark는 footage 위 고정 inverse surface. surface/minimal은 caller theme을 상속 |
| 상태 | loading Spinner, 실제 unavailable native disabled를 분리. error/empty/stale 메시지와 복구는 ViewerFrame 또는 제품이 소유 |

## 외부 근거 (2026-10-15 검토)

- [W3C Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)·[Media seek slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/examples/slider-seek/): 명명된 slider, 초 numeric와 분·초 valuetext, 방향키·Home/End. Native range를 우선하고 toolbar 방향키 충돌을 피합니다.
- [MDN HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement): currentTime/duration과 media events가 실제 상태의 정본입니다. NaN/Infinity를 유효한 길이나 0으로 만들지 않습니다.
- [MDN waiting](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event)·[error](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event)·[Fullscreen](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API): buffering/load failure/실제 fullscreen은 다른 상태이며 제품 adapter가 reconciles합니다.
- [MDN video control styling](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Video_player_styling_basics): media command·seek·시간을 연결된 영역으로 묶습니다. 외부 스타일 수치를 복사하지 않고 LDS sibling 문법을 사용합니다.

## 제품 workflow coverage

검토 source는 HEAD 대비 staged/unstaged clean인 파일입니다. 실제 adoption 완료를 의미하지 않습니다.

- LK Web Viz `1aedf33eb93688fa3175a36fcc44ae59237e5c65`: `frontend/src/screens/DashboardScreen.tsx` 및 `services/api.ts`, frontend 전체 video 소비 검색. **not applicable** — archive video/seek 소비가 없고 Rerun stream URL은 media adapter가 아닙니다.
- LK Control Full Daedeok `fe43e4ff9f7ecc41ba705d2d4aefc17ac908d435`: `frontend/src/views/alarm/detail.jsx:30–85`. **supported by composition** — native controls 교체 가능, 5초/4회 retry와 API 주소는 제품 소유. 같은 revision의 `frontend/src/views/live-video/index.jsx:388` iframe live의 seek는 **not applicable**입니다.
- LK Portal `0d2938aa3075683168c82327f2ae6d8c511f267d`: `src/components/devices/DeviceVisionWorkloadsPanel.tsx:767–827,888–894`. **supported by composition** — authorized playback ticket, fetch/abort, blob URL 및 cleanup을 유지한 상태에서 native controls를 조합할 수 있습니다. Portal adapter는 이번 변경 범위 밖입니다.

## 검증 및 발행 경계

실제 source story는 `stories/VideoPlaybackControls.stories.jsx`입니다. Overview/Narrow/Dark는 실제 창고 footage를 VideoStreamTile에 넣은 embedded 조합이며, VariantsStates는 standalone 표면과 ViewerToolbar를 비교합니다. 표적 source bundle, keyboard/drag/controlled callbacks, 760px/320px, light/dark/inverse 및 loading/disabled/unknown duration을 검증합니다. Source authoring과 앱 local preview만 포함합니다. 정본 generated docs/dist/inventory는 Linux CI export가 소유하며 별도 승인 없는 push·tag·publish는 하지 않습니다. 아직 발행되지 않은 컴포넌트를 설치된 0.4.9의 기능이라고 주장하지 않습니다.

## 영상 위 정보 표시

제품이 영상 위에 촬영 시각을 표시할 때는 `var(--color-semantic-on-media-scrim)` 위에 `var(--color-semantic-on-media-label)`을 사용합니다. 밝은 영상의 작은 글자에는 `var(--color-semantic-on-media-scrim-strong)`으로 배경을 진하게 할 수 있습니다. 라벨이나 경계의 얇은 테두리는 `var(--color-semantic-on-media-border)`, 선택한 대상의 강조선은 `var(--color-semantic-media-target)`을 사용합니다.
