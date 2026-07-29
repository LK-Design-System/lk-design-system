**Map2DCanvas** — LDS Product application pattern. 점유 격자, 평면도, 공간 오버레이처럼 2D 콘텐츠를 담는 renderer-independent 팬/줌 viewport shell입니다. 실제 이미지·SVG·canvas·konva 렌더링은 앱이 소유합니다.

```jsx
<Map2DCanvas
  style={{ height: 360 }}
  source="1층 지도"
  defaultViewport={{ x: 24, y: 24, z: 1 }}
  panEnabled={tool === 'pan'}
  wheelZoom
  status="x 12.4 · y -3.8 · 125%"
>
  <img src="/maps/floor1.png" alt="1층 점유 지도" style={{ display: 'block' }} />
</Map2DCanvas>
```

## Contract

- `children`은 pan/zoom transform을 함께 타는 공간 콘텐츠(맵 이미지 · SVG 오버레이 · canvas/konva 스테이지)입니다. 정적 노드 외에 `{ viewport, setViewport }`를 받는 render function도 지원하므로, renderer가 현재 배율에 반응하거나 자체 fit 로직에서 viewport를 갱신할 때 제어형 상태를 중복 소유하지 않아도 됩니다.
- 기본 `contentOrigin="top-left"`는 일반 이미지, SVG, canvas의 `(0, 0)`을 viewport 좌상단에 놓습니다. `contentOrigin="center"`는 세계 좌표 원점을 화면 중심에 두는 renderer를 위한 저수준 호환 계약이지만 현재 고정 LDS Robotics·LDS3D source에는 직접 소비가 없으므로 공개 사용 변형으로 권장하지 않습니다. LDS Robotics Navigation은 `NavigationCoordinateBoundary`와 명시적인 `svgOrigin`을 사용합니다.
- 줌 배율은 `minZoom`(기본 0.25)–`maxZoom`(기본 8) 사이로 clamp되며 휠·키보드·컨트롤 모든 입력 경로에 동일하게 적용됩니다. 픽셀 지도가 깨지는 배율이나 의미 없는 축소를 막을 때만 범위를 좁히고, 두 값이 곧 컨트롤의 disabled 경계가 됩니다.
- 휠/trackpad 줌은 포인터 아래의 맵 좌표를 유지합니다. `wheelZoom={false}`로 끌 수 있습니다.
- `panEnabled={false}`에서는 drag와 `touch-action: none`을 모두 제거해 페이지 터치 스크롤 및 앱의 선택/드로잉 동작과 충돌하지 않습니다.
- 키보드 shortcut은 viewport 자체에 포커스했을 때만 동작합니다: `+`/`-` 줌, `0` 초기화, 방향키 팬, `Shift+방향키` 큰 폭 팬. Toolbar, input, slider 등 자식 컨트롤의 방향키는 가로채지 않습니다. `keyboard={false}`는 이 shortcut과 viewport의 tab stop을 함께 제거하므로, 앱이 자체 키보드 pan/zoom 대안을 제공할 때만 끕니다.
- button, link, input, slider 등 interactive descendant에서 시작한 pointer/wheel 입력도 pan·zoom으로 재처리하지 않습니다.
- `defaultViewport`는 초기값인 동시에 **보기 초기화**가 복귀할 값입니다. `viewport` + `onViewportChange`로 제어형 사용도 지원합니다.
- `onFit`을 제공하면 built-in toolbar에 **전체 보기** command가 추가됩니다. bounds 계산은 앱/renderer가 소유하고 callback에서 제어형 viewport를 갱신합니다. `toolbar`를 제공하면 built-in toolbar를 명시적으로 대체합니다.
- Built-in 지도 도구도 공통 Viewer edge grammar를 따릅니다. `source`는 좌상단, 세로 줌·fit·reset 도구는 우상단, 현재 배율 또는 제품 상태는 좌하단에 두며 지도만의 별도 하단 toolbar chrome을 만들지 않습니다.
- `onWheel`은 pointer-focal zoom에 필요한 non-passive native `WheelEvent` callback입니다. React SyntheticEvent 전용 API를 가정하지 않습니다.
- `overlay`는 passive visual slot이며 포인터 입력을 받지 않습니다. 별도 조작은 viewport-local toolbar 또는 앱 소유 UI로 구성합니다.
- `scope`는 층·레벨처럼 **무엇을 보는가**를 바꾸는 컨트롤을 상단 우측 레일에 둡니다. 줌·초기화 같은 뷰포트 조작(`toolbar`)은 우하단에 남으므로, 두 축을 한 스택에 쌓지 않습니다. `ViewerFrame` 계약을 그대로 통과시키는 prop입니다.
- 공통 `ViewerFrame`을 합성하므로 availability/connection/freshness/playback 축과 호환 `state`, source/HUD, blocking-vs-edge 상태 배치를 그대로 사용합니다. `source` 옆의 passive `badges`, 소수의 필수 readout만 담는 `hud`, 상태 문구·글리프·복구 액션 오버라이드(`stateLabel`, `stateDescription`, `stateIcon`, `stateAction`)는 모두 `ViewerFrame` 계약을 그대로 통과시키는 prop입니다. 지도 전용 loading/error chrome을 별도로 만들지 않습니다.
- `label`(기본 `2D 맵 캔버스`)은 region의 접근 가능한 이름입니다. 한 화면에 viewport가 여럿이면 소스가 드러나는 이름(`1층 점유 지도`)으로 반드시 구분합니다.
- `appearance="light"`가 기본이지만 `appearance="dark"`도 동일한 공개 계약입니다. 지도 renderer와 overlay는 `--viewer-*` 역할 토큰을 사용해 두 appearance에서 같은 정보·조작 구조를 유지합니다.
- `variant="embedded"`는 이 캔버스를 다른 표면(Card, 패널 등) 안에 중첩할 때 자체 border·radius를 생략해 부모가 최외곽선을 소유하게 합니다. pan/zoom·toolbar·상태·접근성 역할은 그대로 유지됩니다. 기본값 `standalone`은 자체 외곽선을 그립니다.

## Scope decisions

- 포함: pan/zoom transform, optional grid, local zoom/reset controls, optional delegated fit command, zoom/status readout, controlled/uncontrolled viewport state.
- 제외: 지도 tile/source 로딩, 좌표계 투영, layer schema, waypoint 편집, 경로 계획, fit-bounds 계산 자체. 이들은 renderer 또는 제품 계층의 책임입니다.
- LDS Product 예시는 구조 지도처럼 중립적인 콘텐츠로 viewport 계약만 보여줍니다. Route·Trajectory·Waypoint·RobotPose의 의미와 시각 문법은 `@lk-robotics/lds-robotics-ui`가 소유하며, Product Storybook에서 임시 선·점·방향 마커로 재현하지 않습니다. 이 경계는 LDS Robotics revision `180f031541850444d302bcf6a94b96db563133cd`의 Navigation Path System 계약과 대조했습니다.
- `ViewerToolbar`, `Icon`, LDS spacing/focus/toggle tokens를 재사용하며 독자적인 map-control visual language를 만들지 않습니다.

## External research basis

- [Unity Scene View navigation](https://docs.unity3d.com/Manual/SceneViewNavigation.html): viewport navigation을 scene-local pan/orbit/zoom/focus 동작으로 제한하고, 콘텐츠 편집 명령과 분리했습니다.
- [NVIDIA Omniverse viewport navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html): pointer 중심 navigation과 viewport-local camera controls를 기준으로 삼았습니다.
- [Mapbox Standard style reference](https://docs.mapbox.com/map-styles/reference/standard/)와 [runtime configuration guide](https://docs.mapbox.com/map-styles/guides/standard-styles/): 하나의 지도 스타일이 day/night에 대응하는 lighting preset을 런타임에 바꿀 수 있으므로, LDS도 지도를 light 전용으로 고정하지 않고 light/dark appearance를 같은 계약으로 제공합니다.
- [MapLibre Style Specification — Layers](https://maplibre.org/maplibre-style-spec/layers/): line·symbol·circle 등 지도의 표현 역할을 독립 레이어로 구분하므로, 범용 viewport 예시가 로봇 경로와 위치 심볼을 임의로 합쳐 정의하지 않도록 했습니다.
- [ROS `nav_msgs/OccupancyGrid`](https://docs.ros.org/en/melodic/api/nav_msgs/html/msg/OccupancyGrid.html): 2D 점유 지도는 셀별 점유 확률과 unknown 값을 제공하는 구조 데이터이므로, Product 예시는 도메인 경로 없이 중립적인 지도 표면으로만 표현합니다.
- [WCAG 2.2 — Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): drag만이 유일한 조작이 되지 않도록 버튼과 키보드 pan/zoom 대안을 유지했습니다.
- [WAI-ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/): viewport 안의 방향키 toolbar가 canvas 방향키 shortcut과 충돌하지 않도록 이벤트 범위를 분리했습니다.
