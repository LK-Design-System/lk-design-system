# RobotMarker

Classification: **LK Robotics Extension**. `RobotMarker`는 한 로봇의 실시간 pose(위치 + 방향)를 그리는 SVG reference renderer입니다. 단독 SVG나 지도 엔진이 아니라 `Map2DCanvas` 또는 제품 renderer의 `<svg>` 안에 넣는 `<g>` fragment입니다. Navigation 오버레이(Lane·Route·Trajectory·Facility·Waypoint)가 "로봇 자세·bearing·footprint는 별도 로봇 레이어 소관"이라며 위임해 온 그 레이어의 reference 구현입니다.

```jsx
<RobotMarker
  pose={{
    id: 'amr-7',
    label: 'AMR 7',
    mapId: 'L1',
    position: { x: 320, y: 180 },
    headingRad: 0.52,
    footprintRadius: 12,
  }}
  viewportScale={cssViewBoxScale}
  selected={false}
  focused={false}
  disabled={false}
  invalid={false}
  stale={false}
  showLabel
  onActivate={(id) => inspectRobot(id)}
/>
```

## Contract

- `pose`는 source가 명시한 직렬화 가능한 실시간 상태입니다: `id`, optional `label`, 단일 `mapId`, `position`, optional `headingRad`, optional `footprintRadius`. renderer handle·velocity object·ROS message·임의 metadata를 넣지 않습니다. `position`이 유한하지 않으면 role/tabindex만 남는 invisible control을 만들지 않고 `null`을 반환합니다.
- `headingRad`는 지도 y-down 공간의 bearing(라디안, 0 = +x)입니다. 이 값만이 heading 노즈를 회전시킵니다. 생략하면 노즈 없는 무지향 body만 그립니다. component는 시간·경로·속도에서 방향을 추론하지 않습니다.
- `footprintRadius`(지도 단위)가 있으면 로봇의 물리 footprint를 world-space 원으로 그립니다 — 화면 고정 body와 달리 줌과 함께 커집니다. 없으면 body만 그립니다. body 자체는 `NAV_ROBOT_POSE`의 화면 고정 실루엣(둥근 footprint body + heading 노즈)이며, 진행 다트·방향 셰브론과 달리 **원형 body**를 가져 경로 화살표로 읽히지 않습니다.
- pose의 body 색은 liveness만 전달합니다: 기본 accent, `stale`이면 muted + 점선 링, `invalid`이면 danger + exclamation glyph. identity와 heading은 색과 무관하게 label·노즈로 전달하므로 색만으로 상태를 전달하지 않습니다. body 실루엣은 공유 `NAV_MARKER_SHADOW` 캐스트 그림자(화면 아래 방향 — heading 회전과 무관)로 지면에 접지해, 핀·웨이포인트·배지와 같은 지면 위 마커 계층으로 읽힙니다.
- `selected`/`focused`는 독립 축입니다. 포커스는 로봇 실루엣을 `NAV_ROBOT_POSE.focusScale`로 확대 추적(`--color-semantic-focus-indicator`, non-scaling-stroke ≥2px, 바깥), 선택은 같은 실루엣을 `selectionRingScale`로 타이트하게 accent 링(안쪽)으로 감쌉니다. 원 링으로 실루엣을 감싸는 shape mismatch를 만들지 않고 body·노즈 실루엣을 그대로 추적합니다.
- `onActivate`가 있을 때 pointer와 non-repeating `Enter`/`Space`가 같은 `(id, event)` callback을 호출합니다. `event.repeat`와 `disabled`는 callback을 막고, disabled interactive robot은 `aria-disabled`와 `tabIndex=-1`을 사용합니다. Disabled opacity는 `0.45`, stale opacity는 `0.76`으로 sibling 상태 계층과 맞추며, 이 값·hit target·label halo·상태 dash는 공용 내부 `_navigationVocabulary`에서 가져옵니다.
- `aria-hidden="true"`는 named semantic mirror가 keyboard/accessibility ownership을 갖는 map fragment용 pointer-only mode입니다. visual과 click callback은 유지하되 role, accessible name, pressed/disabled/invalid ARIA, `tabIndex`를 제거하고 `focusable="false"`와 canceled mouse down으로 focus를 막습니다.
- 모든 화면 고정 기하는 `viewportScale`의 inverse로 스케일해 map zoom·CSS viewBox 축소와 무관하게 화면 크기를 유지하고, footprint만 world-space로 그립니다. body는 `NavigationAnnotationLayer` 장애물로 등록되어 조정 라벨이 로봇을 덮지 않습니다.
- native `aria-label`은 계산된 이름을 덮어쓸 수 있습니다. 계산 이름은 label → 지도 → 방향(8방위) → freshness → selection → focus → disabled 순이며 component는 live region을 만들지 않습니다. `showLabel`은 온-맵 라벨 표시만 제어하고 접근성 이름을 지우지 않습니다.

## Reading order and state evidence

접근 가능한 읽기 순서는 로봇 이름 → 지도 → 방향 → 실시간/오래됨/오류 → 선택/포커스/비활성입니다. 시각적으로도 body(위치)·노즈(방향)·상태 색·라벨 순으로 같은 의미를 제공합니다.

- default: accent body + heading 노즈
- selected: accent 실루엣 링(안쪽)
- focused: shared `focus-indicator` 실루엣 링(바깥)
- stale: muted body + 점선 링 + opacity `0.76`
- invalid: danger body + registry exclamation geometry
- disabled: opacity `0.45`

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `WaypointMarker` | inverse scale, 24px target, focus/selection/disabled/invalid/stale 어휘 | 정적 그래프 점(다이아몬드)이 아니라 실시간 로봇 pose(원형 body + heading 노즈)이며 world-space footprint를 추가로 소유 |
| `LaneOverlay` / `RouteOverlay` / `TrajectoryOverlay` | `_navigationVectorGlyph` 어휘, non-scaling stroke | 이들의 방향 셰브론·진행 다트와 **모양이 달라** 한 회랑에서 로봇 pose가 경로 화살표로 혼동되지 않음; topology·progress를 복제하지 않음 |
| `Map2DCanvas` / `ViewerFrame` | viewer surface/foreground roles, renderer ownership | frame 안 SVG fragment이며 card·border·toolbar를 추가하지 않음 |

새 public token, map palette, icon set, radius, shadow, animation은 추가하지 않습니다. `NAV_ROBOT_POSE`만 로봇 pose 실루엣 기하를 소유합니다.

## Authoritative research and conclusions

- [ROS 2 RViz Pose/Robot display](https://docs.ros.org/en/rolling/index.html)와 로봇 시각화 관례는 로봇을 footprint body + heading 지시자로 그리고 이를 graph node·planned path와 별도 display로 둡니다. LDS도 로봇 pose를 waypoint·lane·route·trajectory와 별도 renderer로 두고 footprint(world)와 body(screen)를 분리합니다.
- [Open-RMF visualization](https://github.com/open-rmf/rmf_visualization)는 robot state를 navgraph·schedule trajectory와 다른 layer/source로 둡니다. LDS도 로봇 pose를 trajectory와 합치지 않습니다 — trajectory는 예측/관측 sample 선, RobotMarker는 현재 pose 한 점입니다.
- [Nav2](https://docs.nav2.org/)는 robot footprint를 world 단위 polygon으로, pose를 position+orientation으로 다룹니다. LDS는 footprint를 world-space 원(줌과 함께 성장)으로, heading을 screen-fixed 노즈로 분리해 두 스케일 의미를 유지합니다.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)은 target 내부에 24×24 CSS px 정사각형이 실제로 들어가야 함을 설명합니다. RobotMarker는 inverse-scaled hit circle로 이를 보장합니다.
- [WCAG 3.1.2 Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html)에 따라 한국어 지도에서 방향은 8방위 한국어(동/북동/…)로 안내합니다.

## Product workflow review

- LK Web Viz / LK Control 계열의 지도 뷰는 관측 경로(observed trajectory)와 현재 로봇 pose를 별도 layer로 렌더하므로 RobotMarker는 `supported by composition`입니다. 상세 source blob과 seam은 `docs/references/product-frontends/COVERAGE_AUDIT.json`이 소유합니다.

## Intentional exclusions

- 로봇 예측/보간, 속도·가속도, 충돌 계산, ETA/progress 추론
- 다중 로봇 스케줄링, 경로 계획, 명령 전송, ROS transport
- lane/waypoint topology, route segment, facility state/session
- 재생 컨트롤, 스크러버, live announcement, edit/drag

이 항목은 runtime planner, `RouteOverlay`/`TrajectoryOverlay`, `FacilityTransition`, owning renderer, Product runtime의 책임입니다.
