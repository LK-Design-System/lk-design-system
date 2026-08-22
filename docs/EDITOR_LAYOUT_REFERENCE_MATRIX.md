# Editor layout reference matrix

| Field | Value |
| --- | --- |
| Type | Stable domain reference contract |
| Status | Current |
| Owner | Product / Workspace component owner · Product engineering |
| Last reviewed | 2026-08-22 |
| Coverage source | `LK-ROBOTICS/lk_web_viz` at the revision recorded below |

이 문서는 `CanvasEditorShell`과 renderer-neutral Product 편집 패턴을 변경할 때 적용할 설계 근거와 영역 소유권을 정의한다. LK 제품 source는 필요한 workflow·region·state와 조합 가능성을 확인하는 coverage 자료이며 editor anatomy, 시각 위계, 치수나 public API의 설계 authority가 아니다.

이 편집기 패턴의 현재 owner는 [`OWNER_AUTHORITY_CONTRACT.json`](references/architecture/OWNER_AUTHORITY_CONTRACT.json)이 정한 **LDS Product / Workspace**이며, WDS provenance는 `product-extension`이다. 아래 외부 자료는 에디터 카테고리의 해부 구조, 상호작용, 접근성 기대치를 확인하기 위한 근거이며 WDS parity 증거가 아니다. 외부 제품의 스타일이나 완성 화면을 복제하지 않고 LDS 토큰과 기존 컴포넌트 계약으로 번역한다.

## Evidence priority

1. LDS의 가까운 형제 컴포넌트와 토큰 계약
2. 수락된 WDS evidence와 공식 design-system·platform·domain reference
3. WAI-ARIA/WCAG 같은 접근성 표준
4. 일반적인 GIS, 캔버스, 3D 에디터의 보조 시각 자료

제품 source와 실제 캡처는 위 설계가 필요한 workflow를 빠짐없이 지원하는지 마지막에 검증한다. 차이가 발견되면 먼저 coverage gap과 product-owned composition을 기록하며, 제품의 현재 배치를 LDS 설계로 복사해 차이를 닫지 않는다.

## Authoritative external references reviewed

2026-07-11 Editor 재설계 전에 다음 공식 자료를 검토했다.

| Category | Official source | Concrete conclusion used in LDS |
| --- | --- | --- |
| 계층과 캔버스 선택 | [Figma Layers panel](https://help.figma.com/hc/en-us/articles/360039831974-View-layers-and-assets-in-the-Layers-Panel), [Figma selecting layers](https://help.figma.com/hc/en-us/articles/360040449873-Select-layers-and-objects) | 왼쪽 계층과 캔버스는 하나의 선택 모델을 공유한다. 계층은 중첩, 펼침/접힘, visibility/lock을 제공하고 키보드 포커스와 선택 상태를 시각적으로 구분한다. |
| 선택 기반 속성 | [Figma right sidebar](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-inspect-right-sidebar-), [Unity Inspector](https://docs.unity3d.com/es/current/Manual/UsingTheInspector.html), [NVIDIA Omniverse property extensions](https://docs.isaacsim.omniverse.nvidia.com/latest/py/source/extensions/isaacsim.gui.property/docs/index.html) | 오른쪽 Inspector는 현재 선택을 따라가며 선택 identity/status, 속성 그룹, 선택 객체 액션을 소유한다. 문서 저장 같은 전역 액션은 Inspector에 넣지 않는다. |
| 편집기 영역과 패널 | [Figma UI3 navigation](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3), [Unity interface](https://docs.unity3d.com/kr/530/Manual/LearningtheInterface.html), [Unity workspace customization](https://docs.unity3d.com/Manual/CustomizingYourWorkspace.html), [Blender regions](https://docs.blender.org/manual/en/latest/interface/window_system/regions.html), [NVIDIA Omniverse editor anatomy](https://docs.omniverse.nvidia.com/kit/docs/kit-app-template/latest/docs/extending_editors.html) | 중앙 viewport를 지배 영역으로 유지하고, 왼쪽 hierarchy, 오른쪽 properties, 상단 문서 명령, viewport-local view control을 분리한다. 보조 패널은 resize/collapse/restore할 수 있어야 하며 좁은 폭에서는 둘을 동시에 억지로 유지하지 않는다. |
| 계층 패널 도메인 | [NVIDIA Omniverse Stage window](https://docs.omniverse.nvidia.com/kit/docs/omni.kit.window.stage/latest/Overview.html) | `LayerPanel`은 실제 scene/stage/entity 계층과 visibility/lock/selection이 있을 때만 사용한다. 업무 단계나 임의의 정보 목록을 계층으로 위장하지 않는다. |
| 상태 표시줄 | [Blender status bar](https://docs.blender.org/manual/en/latest/interface/window_system/status_bar.html) | 하단 status는 현재 입력 힌트, 메시지, 통계 같은 수동적이고 문맥적인 정보를 우선순위에 따라 한 줄로 보여준다. 영구 CTA나 문서 명령을 넣지 않는다. |
| 키보드와 의미 구조 | [WAI-ARIA Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/), [Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/), [Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/), [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) | Toolbar는 단일 Tab 진입점과 방향키/Home/End 이동을, Tree는 계층 방향키와 명확한 focus/selection을, splitter는 값과 키보드 resize를 제공한다. 좁은 화면의 영역 전환은 실제 tabs semantics를 사용한다. |
| 포인터 대안과 목표 크기 | [WCAG 2.2 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | drag resize/reorder에는 키보드나 버튼 대안을 제공한다. 독립 컨트롤은 LDS의 32px 소형 icon-button 규격을 기본으로 쓴다. 예외로 tree row 내부 마이크로 컨트롤(펼침/visibility/lock)은 20px까지 허용하되 WCAG 2.5.8 spacing exception을 만족해야 한다 — 20px 버튼은 인접 타깃과 최소 4px 간격(24px 지름 원이 접하는 하한, `--space-1`)이 필수이며 이 간격을 절대 줄이지 않는다. |
| 워크벤치 상태 표시줄 운영 | [VS Code UX Guidelines: Status Bar](https://code.visualstudio.com/api/ux-guidelines/status-bar), [Sidebars](https://code.visualstudio.com/api/ux-guidelines/sidebars), [Panel](https://code.visualstudio.com/api/ux-guidelines/panel) — 2026-07-11 재조사 추가 | status bar는 전역 정보(선택 상태·문제)를 왼쪽, 문맥 정보(모드·좌표·배율)를 오른쪽에 그룹핑한다. 항목 수를 최소화하고 짧은 텍스트를 쓰며, 배경색 강조는 경고/오류의 최후 수단으로만 쓴다. 같은 값(예: 확대 배율)을 viewport overlay와 status bar에 동시 표시하지 않는다 — status 영역이 있으면 status bar가 표시를 소유하고 viewport pill은 도구 모드만 남긴다. |
| 패널 내부 툴바 밀도 | [JetBrains IntelliJ Platform: Toolbar](https://plugins.jetbrains.com/docs/intellij/toolbar.html) — 2026-07-11 재조사 추가 | 관련 아이콘은 그룹핑하고 그룹 사이만 separator로 나누되, 아이콘 5개 이하면 separator를 생략한다. 세로 툴바는 상단 정렬, 가로 툴바는 자주 쓰는 항목을 왼쪽에 둔다. 콘텐츠가 툴바 아래로 스크롤될 때만 툴바 경계선을 보인다. |

## Research conclusions applied

- 필수 anatomy는 document header, 선택적인 workspace mode strip, edit-tool rail, 실제 계층이 있을 때의 left panel, 지배적인 viewport, 선택 기반 right Inspector, 선택적인 passive status bar다.
- document header에는 뒤로가기/패널 토글, 제목·상태, undo/redo/save 같은 문서 범위 명령만 둔다. zoom/fit/orbit/reset은 해당 viewport 내부의 viewer controls로 유지한다.
- viewport 위의 overlay는 현재 도구에만 필요한 짧은 설정, transient feedback, 완료/취소에 한정한다. 지속적인 안내 카드로 캔버스를 가리지 않는다.
- Inspector는 no selection, single selection, same-type multi-selection, mixed selection을 구분한다. 혼합 값은 임의의 대표값 대신 `—`와 같은 mixed 표시를 사용하고, locked/read-only/stale/invalid 상태를 텍스트와 의미 요소로 전달한다.
- 넓은 화면에서는 hierarchy와 Inspector를 resize/collapse/restore할 수 있다. 좁은 화면에서는 별도의 semantic region navigation으로 한 보조 영역만 노출하고, workspace mode와 responsive navigation을 같은 슬롯으로 재사용하지 않는다.
- focus와 selection은 같은 상태가 아니다. 캔버스와 Tree는 선택을 공유하되 키보드 포커스를 독립적으로 보이게 한다.
- 임의 위치 docking, 사용자가 만든 레이아웃의 직렬화/복원, floating window manager, 제품 workflow와 저장 정책은 LDS 셸 범위에서 의도적으로 제외한다.
- (2026-07-11 재조사 반영) 하나의 상태 값은 하나의 영역만 표시한다. 셸에 status 영역이 있으면 확대 배율·모드 요약은 status bar가 소유하고, viewport 내 pill은 현재 도구 모드처럼 viewport 고유 정보만 남긴다.
- (2026-07-11 재조사 반영) EditorToolbar처럼 아이콘 5개 이하의 도구 레일은 separator 없이 gap만으로 구분한다. 패널 툴바 경계선은 콘텐츠가 스크롤될 때만 나타낸다.

## Storybook boundary

- 제품 소스는 필요한 workflow·state·region과 ownership seam을 확인하는 coverage 근거일 뿐, 컴포넌트 anatomy·API·스타일이나 완성된 제품 화면을 LDS Storybook에 복제하는 근거가 아니다.
- 공개 Storybook에는 `CanvasEditorShell`의 슬롯/패널 변형과 각 Editor 컴포넌트의 상태만 둔다.
- 작업 생성, 맵 편집, PGM 편집, PCD 보조 흐름은 이 문서의 제품 소스 매핑과 제품 저장소 테스트에서 검증한다.
- `LDS Product`와 `LDS Robotics`에 애플리케이션 화면, 템플릿, 워크플로, 데모를 추가하지 않는다.

## Product workflow coverage evidence

검토 기준은 `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505` (2026-06-24)이다.

| Workflow | Source | Observed regions for coverage only |
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
| undo/redo/save/import/export | `CanvasEditorShell.toolbar` + `CanvasEditorCommandBar` | 문서 또는 활성 편집 모드 범위의 명령만 둔다. 확대/축소/fit/reset 같은 viewport 명령을 이 영역으로 끌어올리지 않는다. |
| objects/pgm 같은 전역 편집 모드 | `CanvasEditorShell.subheader` | 도구, 캔버스, 저장 의미, 우측 패널을 함께 바꾸는 모드에 사용한다. |
| 선택/구역/라인/랜드마크/브러시 | `EditorToolbar` | 상호 배타적 편집 도구. 좌측 도구 레일에 고정한다. |
| 확대/축소/초기화/orbit/fit | viewport 내부 viewer controls | 현재 보고 있는 viewport에만 작용하며 문서 명령과 섞지 않는다. 여러 viewport가 있으면 각 viewport가 자신의 control을 소유한다. |
| 그리기 완료/취소, 브러시 설정 | canvas-local transient panel | 현재 도구에만 필요한 짧은 설정과 완료/취소를 둔다. |
| 선택 객체 속성 | 우측 resizable/collapsible docked panel | 원본 맵 편집처럼 반복 수정이 주요 작업이면 고정 패널을 쓴다. 선택 identity/status는 고정 header, 속성은 scroll body, 객체 action은 sticky footer에 두고 전체 선택 해제는 패널 header에 둔다. |
| 가벼운 contextual detail | `panelMode="drawer"` | 캔버스 공간을 일시적으로만 차지해야 할 때 사용한다. 원본 맵 편집의 기본값으로 간주하지 않는다. |
| 레이어/디스플레이 트리 | `CanvasEditorShell.layers` + `LayerPanel` | 실제 visibility/lock/active layer 모델이 있을 때만 사용한다. task steps나 selected object를 넣지 않는다. |
| PCD 3D 보조 | viewport child split | 우측 속성 패널과 별개이며 자체 close, point size, legend, 3D feedback을 가진다. |
| 상태 표시줄 | `CanvasEditorShell.status` | 선택적이고 수동적인 한 줄 영역이다. 현재 힌트/메시지/통계를 우선순위로 줄이며, 원본 화면에 없으면 추가하지 않는다. |

## Shared shell boundary

`CanvasEditorShell`이 강제하는 것은 영역 순서와 크기 관계뿐이다. 모든 워크스페이스가 모든 슬롯을 사용하지 않는다.

| Capability | Shared | Product-specific |
| --- | --- | --- |
| 헤더, subheader, tool rail, viewport, 좌/우 panel, status slot | Yes | 슬롯의 내용과 표시 조건 |
| 고정 left/right panel의 resize/collapse/restore와 contextual drawer transition | Yes | 어떤 object가 drawer를 여는지, panel width 저장 정책 |
| task form, steps, floor picker | No | 작업 생성 화면 |
| objects/pgm tool set과 저장 정책 | No | 맵 편집 화면 |
| point-cloud renderer와 zone editing logic | No | PCD 보조 패널 |

## Secondary reference checks

- QGIS/ArcGIS/Mapbox/RViz의 layer panel은 `LayerPanel`의 구조/visibility를 교차 확인하는 보조 근거다. LK 맵 편집에 layer panel이 있다는 근거는 아니다.
- CloudCompare/Potree의 point-cloud controls는 PCD panel 내부 viewer control의 보조 시각 자료다. 독립 crop/classification 워크스페이스를 발명하는 근거는 아니다.
- 기술적·행동적 결정은 위의 공식 editor 문서와 WAI-ARIA/WCAG를 우선하며 갤러리나 커뮤니티 예시, LK 제품의 현재 화면은 설계 근거로 승격하지 않는다.

## Disallowed patterns

- 작업 생성이나 맵 편집 같은 제품 워크플로를 `Canvas Shell`의 공개 story로 만들지 않는다.
- 제품 헤더에 `Step 1`, `workflow review`, `contract` 같은 Storybook 메타데이터를 표시하지 않는다.
- task step selection과 layer selection을 같은 UI 모델로 취급하지 않는다.
- 원본 근거 없이 모든 화면에 layer panel, inspector, status bar를 한꺼번에 넣지 않는다.
- undo/redo를 status bar나 viewport 모서리로 흩뜨리지 않는다.
- document save와 selected-object action을 같은 CTA로 합치지 않는다.
- PCD 3D 보조를 독립 point-cloud editor라고 부르지 않는다.
- zoom/fit/orbit/reset을 document command bar에 중복 배치하지 않는다.
- drag만 가능한 splitter/reorder, 포커스와 선택이 구분되지 않는 Tree, 색상만으로 상태를 표현하는 row를 만들지 않는다.
- arbitrary docking, floating panel, layout persistence, 제품 workflow를 LDS가 소유한다고 가정하지 않는다.
