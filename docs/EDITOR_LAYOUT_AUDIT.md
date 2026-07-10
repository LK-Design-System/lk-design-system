# Canvas editor shell audit

## Scope

`CanvasEditorShell`을 범용 GIS형 완성 화면으로 취급하던 구현을 실제 `lk_web_viz` 워크플로우 기준으로 다시 감사했다. 제품 근거는 `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505`와 저장소의 `docs/images/task_edit.png`, `map_edit_randmarks.png`, `map_eit_pgm.png`이다.

## Problems found

| Problem | Why it was wrong | Resolution |
| --- | --- | --- |
| 모든 워크스페이스를 route/layer/canvas/inspector로 통일 | 작업 생성과 맵 편집의 핵심 객체와 패널 소유권이 다름 | 셸은 slot 관계만 공유하고, workflow composition은 분리 |
| 화면 내부에 Step명과 검수 라벨 표시 | Storybook 메타데이터가 제품 UI로 유입됨 | 상태명은 Storybook story name에만 유지 |
| 작업 생성을 route layer editor로 표현 | 원본은 task form + steps + topology/map picker | 좌측 작업 폼과 우측 맵 선택 화면으로 재구성 |
| 맵 편집에 layer panel을 기본 추가 | 원본은 objects/pgm tabs + tool rail + right properties | 원본 상태 story에서 `LayerPanel` 제거 |
| selected-object detail을 항상 drawer로 가정 | 원본은 반복 수정용 고정 right sidebar | 맵 편집은 docked panel, drawer는 optional capability로 한정 |
| PCD를 독립 crop/classification workspace로 표현 | 원본 `PcdMap3DPanel`은 맵 편집의 보조 split panel | `맵 편집 · PCD 3D 보조` 상태로 통합 |
| 우측 패널에 임의 `적용` CTA 추가 | 원본은 필드 변경 후 문서 저장, draw complete/cancel은 canvas-local | 문서 저장은 헤더, draw 완료/취소는 transient panel, 삭제/선택 해제는 inspector |
| status bar에 history action 배치 | command와 readout의 scope가 섞임 | history는 header command bar에만 유지 |

## Resulting component contract

| Component | Contract |
| --- | --- |
| `CanvasEditorShell` | title, description, leading control, toolbar, subheader, tool rail, optional layer panel, viewport, docked/drawer panel, optional passive status |
| `CanvasEditorCommandBar` | 실제 handler/disabled state가 있는 history와 문서 명령만 렌더 |
| `EditorToolbar` | roving tab stop, arrow/Home/End focus, pressed state, disabled state |
| `LayerPanel` | visibility/lock/active layer 전용. 작은 텍스트도 AA 대비 유지 |
| `SelectionInspector` | selected canvas object 전용. clear-selection, sections, optional action footer, AA text contrast |
| `Map2DCanvas` | viewport-local zoom/reset/status. 작은 status text AA 대비 유지 |

## Storybook evidence

모든 상태는 하나의 실제 화면만 렌더한다. `Step N` 또는 검수용 heading을 화면 위에 덧붙이지 않는다.

| Story | URL id | Evidence |
| --- | --- | --- |
| 셸 기본 구조 | `lds-robotics-editor-canvas-shell--canvas-editor-shell-contract` | neutral slot capability, real layer model only |
| 작업 생성 · 기본 정보 | `lds-robotics-editor-canvas-shell--task-details` | form before target creation, disabled save |
| 작업 생성 · 목표 추가 | `lds-robotics-editor-canvas-shell--task-targets` | task steps + floor/map target picker |
| 작업 생성 · 파라미터 편집 | `lds-robotics-editor-canvas-shell--task-parameters` | selected step + parameters JSON apply + document save |
| 맵 편집 · 선택 전 | `lds-robotics-editor-canvas-shell--map-object-idle` | no selection, object counts/settings sidebar |
| 맵 편집 · 구역 작성 | `lds-robotics-editor-canvas-shell--map-polygon-drawing` | polygon tool + canvas-local completion panel |
| 맵 편집 · 선택 객체 속성 | `lds-robotics-editor-canvas-shell--map-object-selected` | selected zone, clear selection, properties, delete |
| 맵 편집 · PCD 3D 보조 | `lds-robotics-editor-canvas-shell--map-pcd-assist` | PCD split inside object editing |
| 맵 편집 · PGM 픽셀 | `lds-robotics-editor-canvas-shell--map-pgm-editing` | pgm tab, pgm tools/settings/save |

## Validation record

| Gate | Result |
| --- | --- |
| TypeScript | `pnpm run check:types` passed |
| Storybook build | `pnpm run build:storybook` passed |
| Story public surface | `pnpm run check:storybook-public` passed |
| Accessibility structural guard | 263 implementation stories, 0 missing names, 0 implicit button types, 0 console errors |
| Storybook axe | 9 public shell/workflow states checked, 0 violations in every state |
| Product-frame metadata | 9 public states checked, 0 `Step N`, `workflow review`, or `워크플로우 검수` labels |
| Interaction audit | tab switch, clear selection, PCD split open/close, and toolbar Arrow/Home/End roving focus verified |

## Intentional exclusions

- PCD conversion/cleanup screens are not CanvasEditorShell states.
- Site authoring is a separate product editor and requires its own workflow audit.
- The story graphics are representative viewport content, not the product renderer implementation.
