**Map2DCanvas** — LK Robotics Extension. 점유 격자, 평면도, 경로처럼 2D 공간 콘텐츠를 담는 renderer-independent 팬/줌 viewport shell입니다. 실제 이미지·SVG·canvas·konva 렌더링은 앱이 소유합니다.

```jsx
<Map2DCanvas
  style={{ height: 360 }}
  defaultViewport={{ x: 24, y: 24, z: 1 }}
  panEnabled={tool === 'pan'}
  wheelZoom
  status="x 12.4 · y -3.8 · 125%"
>
  <img src="/maps/floor1.png" alt="1층 점유 지도" style={{ display: 'block' }} />
</Map2DCanvas>
```

## Contract

- 기본 `contentOrigin="top-left"`는 일반 이미지, SVG, canvas의 `(0, 0)`을 viewport 좌상단에 놓습니다. 세계 좌표 원점을 화면 중심에 두어야 하는 renderer만 `contentOrigin="center"`를 명시하고 자체 콘텐츠 offset을 제공합니다.
- 휠/trackpad 줌은 포인터 아래의 맵 좌표를 유지합니다. `wheelZoom={false}`로 끌 수 있습니다.
- `panEnabled={false}`에서는 drag와 `touch-action: none`을 모두 제거해 페이지 터치 스크롤 및 앱의 선택/드로잉 동작과 충돌하지 않습니다.
- 키보드 shortcut은 viewport 자체에 포커스했을 때만 동작합니다: `+`/`-` 줌, `0` 초기화, 방향키 팬, `Shift+방향키` 큰 폭 팬. Toolbar, input, slider 등 자식 컨트롤의 방향키는 가로채지 않습니다.
- button, link, input, slider 등 interactive descendant에서 시작한 pointer/wheel 입력도 pan·zoom으로 재처리하지 않습니다.
- `defaultViewport`는 초기값인 동시에 **보기 초기화**가 복귀할 값입니다. `viewport` + `onViewportChange`로 제어형 사용도 지원합니다.
- `onFit`을 제공하면 built-in toolbar에 **전체 보기** command가 추가됩니다. bounds 계산은 앱/renderer가 소유하고 callback에서 제어형 viewport를 갱신합니다. `toolbar`를 제공하면 built-in toolbar를 명시적으로 대체합니다.
- `onWheel`은 pointer-focal zoom에 필요한 non-passive native `WheelEvent` callback입니다. React SyntheticEvent 전용 API를 가정하지 않습니다.
- `overlay`는 passive visual slot이며 포인터 입력을 받지 않습니다. 별도 조작은 viewport-local toolbar 또는 앱 소유 UI로 구성합니다.
- 공통 `ViewerFrame`을 합성하므로 `state`, source/HUD, blocking-vs-edge 상태 배치를 그대로 사용합니다. 지도 전용 loading/error chrome을 별도로 만들지 않습니다.
- `appearance="light"`가 기본이지만 `appearance="dark"`도 동일한 공개 계약입니다. 지도 renderer와 overlay는 `--viewer-*` 역할 토큰을 사용해 두 appearance에서 같은 정보·조작 구조를 유지합니다.
- `variant="embedded"`는 이 캔버스를 다른 표면(Card, 패널 등) 안에 중첩할 때 자체 border·radius를 생략해 부모가 최외곽선을 소유하게 합니다. pan/zoom·toolbar·상태·접근성 역할은 그대로 유지됩니다. 기본값 `standalone`은 자체 외곽선을 그립니다.

## Scope decisions

- 포함: pan/zoom transform, optional grid, local zoom/reset controls, optional delegated fit command, zoom/status readout, controlled/uncontrolled viewport state.
- 제외: 지도 tile/source 로딩, 좌표계 투영, layer schema, waypoint 편집, 경로 계획, fit-bounds 계산 자체. 이들은 renderer 또는 제품 계층의 책임입니다.
- `ViewerToolbar`, `Icon`, LDS spacing/focus/toggle tokens를 재사용하며 독자적인 map-control visual language를 만들지 않습니다.

## External research basis

- [Unity Scene View navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html): viewport navigation을 scene-local pan/orbit/zoom/focus 동작으로 제한하고, 콘텐츠 편집 명령과 분리했습니다.
- [NVIDIA Omniverse viewport navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html): pointer 중심 navigation과 viewport-local camera controls를 기준으로 삼았습니다.
- [Mapbox Standard style reference](https://docs.mapbox.com/map-styles/reference/standard/)와 [runtime configuration guide](https://docs.mapbox.com/map-styles/guides/standard-styles/): 하나의 지도 스타일이 day/night에 대응하는 lighting preset을 런타임에 바꿀 수 있으므로, LDS도 지도를 light 전용으로 고정하지 않고 light/dark appearance를 같은 계약으로 제공합니다.
- [WCAG 2.2 — Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): drag만이 유일한 조작이 되지 않도록 버튼과 키보드 pan/zoom 대안을 유지했습니다.
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/): viewport 안의 방향키 toolbar가 canvas 방향키 shortcut과 충돌하지 않도록 이벤트 범위를 분리했습니다.
