# Editor layout reference matrix

이 문서는 `CanvasEditorShell`과 로보틱스 편집 패턴을 변경할 때 적용할 근거 우선순위와 영역 소유권을 정의한다. 일반적인 GIS/3D 에디터 관행은 참고 자료이고, LK 제품 흐름을 설명할 때는 실제 `lk_web_viz` 소스가 우선한다.

## Evidence priority

1. 현재 제품 소스와 실제 캡처
2. LDS의 가까운 형제 컴포넌트와 토큰 계약
3. 일반적인 GIS, 캔버스, 3D 에디터 관행

일반 레퍼런스가 제품 소스와 다르면 범용 셸 capability로만 남기고, 제품 상태 예시에는 강제로 적용하지 않는다.

## Product evidence

검토 기준은 `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505` (2026-06-24)이다.

| Workflow | Source | Stable layout |
| --- | --- | --- |
| 작업 생성/편집 | `frontend/src/screens/TaskCreateScreen.tsx` | 상단 뒤로가기/제목/저장, 좌측 360px 작업 폼과 단계 목록, 우측 건물 토폴로지와 층별 맵 선택 |
| 맵 오브젝트 편집 | `frontend/src/screens/MapEditScreen.tsx`, `ZoneEditor.tsx` | 상단 문서 명령, `objects`/`pgm` 탭, 좌측 도구 레일, 중앙 맵, 우측 고정 속성 패널 |
| PGM 편집 | `frontend/src/screens/MapEditScreen.tsx`, `PgmEditor.tsx` | 맵 편집 안의 탭 상태. 좌측 PGM 도구, 캔버스 로컬 색상/브러시 패널, 우측 설정, 헤더 저장 |
| PCD 3D 보조 | `frontend/src/screens/MapEditScreen.tsx`, `PcdMap3DPanel.tsx` | 오브젝트 편집 중 좌측 하단 버튼으로 여는 중앙 영역의 우측 split panel. 독립 워크스페이스가 아님 |
| PCD 변환/정리 | `frontend/src/screens/MapConvert2DScreen.tsx`, `MapConvert3DScreen.tsx` | 파일 선택, 파라미터, preview/result 중심의 별도 변환 흐름. Canvas shell로 모델링하지 않음 |

## Workflow region ownership

| Region | Owner | Rule |
| --- | --- | --- |
| 뒤로가기, 제목, 문서 메타 | `CanvasEditorShell.headerStart/title/description` | 실제 화면에 필요한 항목만 표시한다. Storybook 상태명은 넣지 않는다. |
| undo/redo/save/import/export | `CanvasEditorShell.toolbar` + `CanvasEditorCommandBar` | 문서 또는 활성 편집 모드 범위의 명령만 둔다. |
| objects/pgm 같은 전역 편집 모드 | `CanvasEditorShell.subheader` | 도구, 캔버스, 저장 의미, 우측 패널을 함께 바꾸는 모드에 사용한다. |
| 선택/구역/라인/랜드마크/브러시 | `EditorToolbar` | 상호 배타적 편집 도구. 좌측 도구 레일에 고정한다. |
| 확대/축소/초기화/orbit/fit | viewport 내부 | 문서 명령과 섞지 않는다. |
| 그리기 완료/취소, 브러시 설정 | canvas-local transient panel | 현재 도구에만 필요한 짧은 설정과 완료/취소를 둔다. |
| 선택 객체 속성 | 우측 docked panel | 원본 맵 편집처럼 반복 수정이 주요 작업이면 고정 패널을 쓴다. 전체 선택 해제는 패널 헤더에 둔다. |
| 가벼운 contextual detail | `panelMode="drawer"` | 캔버스 공간을 일시적으로만 차지해야 할 때 사용한다. 원본 맵 편집의 기본값으로 간주하지 않는다. |
| 레이어/디스플레이 트리 | `CanvasEditorShell.layers` + `LayerPanel` | 실제 visibility/lock/active layer 모델이 있을 때만 사용한다. task steps나 selected object를 넣지 않는다. |
| PCD 3D 보조 | viewport child split | 우측 속성 패널과 별개이며 자체 close, point size, legend, 3D feedback을 가진다. |
| 상태 표시줄 | `CanvasEditorShell.status` | 선택적이고 수동적이다. 원본 화면에 없으면 추가하지 않는다. |

## Shared shell boundary

`CanvasEditorShell`이 강제하는 것은 영역 순서와 크기 관계뿐이다. 모든 워크스페이스가 모든 슬롯을 사용하지 않는다.

| Capability | Shared | Product-specific |
| --- | --- | --- |
| 헤더, subheader, tool rail, viewport, 좌/우 panel, status slot | Yes | 슬롯의 내용과 표시 조건 |
| docked/drawer panel 배치와 drawer transition | Yes | 어떤 object가 drawer를 여는지 |
| task form, steps, floor picker | No | 작업 생성 화면 |
| objects/pgm tool set과 저장 정책 | No | 맵 편집 화면 |
| point-cloud renderer와 zone editing logic | No | PCD 보조 패널 |

## General reference checks

- QGIS/ArcGIS/Mapbox/RViz의 layer panel은 `LayerPanel`의 구조/visibility 계약 근거다. LK 맵 편집에 layer panel이 있다는 근거는 아니다.
- Figma/Blender의 tool/viewport/property 분리는 `EditorToolbar`, viewport-local controls, right properties의 책임 분리에 참고한다.
- CloudCompare/Potree의 point-cloud controls는 PCD panel 내부의 viewer control 근거다. 독립 crop/classification 워크스페이스를 발명하는 근거는 아니다.

## Disallowed patterns

- 제품 헤더에 `Step 1`, `workflow review`, `contract` 같은 Storybook 메타데이터를 표시하지 않는다.
- task step selection과 layer selection을 같은 UI 모델로 취급하지 않는다.
- 원본 근거 없이 모든 화면에 layer panel, inspector, status bar를 한꺼번에 넣지 않는다.
- undo/redo를 status bar나 viewport 모서리로 흩뜨리지 않는다.
- document save와 selected-object action을 같은 CTA로 합치지 않는다.
- PCD 3D 보조를 독립 point-cloud editor라고 부르지 않는다.
