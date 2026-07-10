# Domain component contracts

이 문서는 완성된 화면이나 서비스 절차 예시를 정의하지 않는다. LK 디자인 시스템 안의 도메인 컴포넌트가 공통으로 지켜야 하는 상태 의미, 안전 문구, 단위 표기, 접근성 계약만 기록한다.

## Scope boundary

- Storybook에는 컴포넌트와 컴포넌트 상태를 둔다.
- 완성 화면과 서비스 절차는 애플리케이션 문서에서 다룬다.
- 도메인 맥락이 필요한 경우에도 `RobotStatusCard`, `Map2DCanvas`, `CanvasEditorShell`, `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar`, `ViewerToolbar`, `Joystick`, `TelemetryGauge`, `TelemetryValue` 같은 개별 컴포넌트 story 안에서 대표 상태만 보여준다.
- Do not publish end-to-end flow pages as design system stories.

## Status semantics

| 상태 | 기준 |
| --- | --- |
| online | 정상 연결, 즉시 조작 또는 모니터링 가능 |
| weak | 연결은 유지되지만 신호 품질이 낮음 |
| reconnecting | 자동 복구 중이며 현재값을 확정값처럼 보이지 않게 처리 |
| offline | 마지막 수신 시각과 다음 조치가 함께 필요 |
| danger | 색상, 아이콘, 텍스트를 함께 사용하고 색상만으로 의미를 전달하지 않음 |

## Editor and map contracts

| 컴포넌트 | 계약 |
| --- | --- |
| `CanvasEditorShell` | title/description, headerStart, toolbar, subheader, tool rail, optional layer panel, canvas, docked panel/drawer, optional status 영역을 분리한다. `headerStart`는 뒤로가기 또는 실제 좌측 구조 패널 토글에 쓰고, `objects`/`pgm` 같은 편집 모드 탭은 `subheader`에 둔다. 모든 워크스페이스가 모든 슬롯을 사용한다고 가정하지 않는다. |
| `CanvasEditorCommandBar` | 우상단 문서/history command는 실제 handler나 disabled 상태가 있을 때만 노출하고 같은 34px command button 규격으로 정렬한다. undo/redo는 헤더 위치와 접근성 라벨을 유지하되, reset은 실제 workflow가 제공할 때만 노출한다. |
| `LayerPanel` | 실제 레이어, 디스플레이, 토픽, 파일, 클래스, 엔티티의 visibility/lock/active 상태가 있는 경우에만 사용한다. 원본 `lk_web_viz` 맵 편집은 `objects`/`pgm` 탭, 왼쪽 도구 레일, 오른쪽 속성 사이드바 중심이므로 `LayerPanel`을 기본 구조로 간주하지 않는다. |
| `SelectionInspector` | 레이어가 아니라 waypoint, lane, zone, point-cloud crop volume, annotation 같은 캔버스 객체의 선택 상태를 제공한다. 반복적인 속성 편집은 docked panel, 가벼운 확인은 drawer를 사용하고, 전체 선택 해제 액션은 header의 같은 위치에 둔다. |
| `ViewportStatusBar` | mode, cursor/camera, zoom, selected count, snap, point count, FPS를 조밀하게 표시하되 command action은 포함하지 않는다. |
| `HistoryToolbar` | icon-only button은 accessible name을 갖고 undo/redo disabled 이유가 전달되어야 한다. |
| `Map2DCanvas` | grid, waypoint, route, zone은 토큰 색상과 동일한 좌표 체계를 사용하고, 선택/드로잉 모드에서는 pan interaction을 끌 수 있어야 한다. |
| `TopicTree` | 기본 Tree와 selection, density, expand affordance를 맞춘다. |

## Control contracts

| 컴포넌트 | 계약 |
| --- | --- |
| `Joystick` | 잠김, 승인 대기, 비활성, 조작 가능 상태를 명확히 구분한다. |
| `ViewerToolbar` | viewer control은 icon-only button으로 두고 tooltip 또는 label을 제공한다. |
| `Callout` | 안전/권한/복구 안내는 제목, 아이콘, 본문을 같은 크기 체계로 맞춘다. |
| `ConfirmDialog` | 파괴적 또는 되돌릴 수 없는 action은 cancel과 confirm label을 명시한다. |

## Numeric readout contracts

| 항목 | 기준 |
| --- | --- |
| 값 | 숫자와 단위를 함께 표시한다. |
| 임계치 | warning/danger 기준은 컴포넌트 props 또는 문서에 드러난다. |
| freshness | stale 값은 현재값처럼 보이지 않게 timestamp 또는 stale badge를 제공하되, 표에서는 freshness/status를 별도 컬럼으로 분리한다. |
| chart | Sparkline과 gauge는 summary text 또는 대체 설명을 제공한다. |
| readout | 좁은 패널은 `TelemetryValue`로 값, 단위, tone, freshness를 한 묶음으로 표시하고, 표 셀은 값과 단위만 두며 상태와 수집 시각은 독립 컬럼으로 둔다. |

## Release gate

- 도메인 컴포넌트는 normal, warning, danger, offline 또는 disabled 상태를 최소 하나 이상 포함한다.
- safety state는 색상만으로 구분하지 않는다.
- 숫자 readout 값은 단위를 포함하고, 표에서는 timestamp/freshness/status를 각각 독립 컬럼으로 분리한다.
- destructive 또는 irreversible action은 confirmation 정책을 따른다.
- 컴포넌트 story가 완성 화면처럼 보이면 story를 분리하지 말고 관련 컴포넌트의 상태 예시로 축소한다.
