# Canvas editor Storybook boundary audit

| Field | Value |
| --- | --- |
| Type | Focused audit |
| Status | Completed |
| Owner | Robotics component owner |
| Last reviewed | 2026-07-11 |
| Stable decisions | [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](EDITOR_LAYOUT_REFERENCE_MATRIX.md) |

## Scope

`CanvasEditorShell`과 Editor 하위 컴포넌트의 공개 Storybook 구성이 다른 LDS 페이지와 같은 문법을 따르는지 재검토했다. 제품 근거는 계속 `LK-ROBOTICS/lk_web_viz` commit `a984def117c05acd213f494cbb8a42e990595505`와 제품 캡처를 사용하지만, 그 근거를 완성된 애플리케이션 화면으로 Storybook에 복제하지 않는다.

2026-07-11 재설계 검토는 Editor를 **LK Robotics Extension**으로 분류했다. 이는 WDS parity 감사가 아니다. 구현 구조를 정하기 전에 공식 Figma, Unity, Blender, NVIDIA Omniverse 문서와 WAI-ARIA/WCAG 패턴을 검토했으며, 링크와 적용 결론은 `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`에 기록했다.

## Decision

- 공개 Storybook은 재사용 가능한 컴포넌트, 슬롯, 변형, 상태만 보여준다.
- 작업 생성, 맵 편집, PGM 편집, PCD 보조 같은 제품 워크플로는 제품 저장소와 이 문서의 소스 매핑에서 관리한다.
- `CanvasEditorShell`은 헤더, 도구, 레이어, 뷰포트, 속성 패널, 상태 영역의 관계만 소유한다.
- Editor 하위 컴포넌트는 각각 독립 Storybook 페이지를 소유한다.
- 제품 화면의 시각 회귀가 필요하면 해당 제품 저장소에서 검증한다. LDS Storybook에 애플리케이션 화면을 숨겨서 보존하지 않는다.
- 문서 명령은 header, zoom/fit/orbit/reset은 viewport 내부, 선택 객체 action은 Inspector에 둔다.
- 임의 docking, floating/persisted layout, 제품 workflow는 LDS 셸에서 의도적으로 제외한다.

## Problems found

| Problem | Why it was wrong | Resolution |
| --- | --- | --- |
| `Canvas Shell` 아래에 작업 생성과 맵 편집 상태를 함께 공개 | 컴포넌트 페이지가 제품 화면·워크플로 메뉴처럼 동작 | 8개 제품 워크플로 story 제거 |
| 작업 생성 화면을 `CanvasEditorShell`로 감쌈 | 작업 생성은 도구 레일·레이어·인스펙터가 없는 폼+지도 제품 화면 | 제품 근거 문서에만 유지 |
| Editor 하위 컴포넌트가 독립 페이지를 갖지 않음 | 각 컴포넌트의 상태와 접근성 계약을 찾기 어려움 | Command Bar, Editor Toolbar, Layer Panel, Selection Inspector, Viewport Status Bar 페이지 추가 |
| 고정 1080×640 제품 프레임과 업무 데이터 사용 | 다른 LDS 페이지의 단일 컴포넌트 표본 체계와 불일치 | 중립 캔버스 fixture와 컴포넌트 크기 프레임으로 교체 |
| 공개 확장 story 이름에 대한 워크플로 가드 부재 | title만 검사해 `작업 생성 · …`, `맵 편집 · …` story가 통과 | 기존 public-surface 가드에 story 이름과 제거된 export 검사 추가 |
| Command Bar story가 zoom/reset 같은 viewport action을 문서 헤더에 노출 | 문서 범위 명령과 현재 viewport 범위 명령의 소유권이 겹침 | 공개 조합에서는 Command Bar를 history/document action으로 제한하고 view action은 viewport-local controls로 이동 |
| Editor command control이 34px 독자 규격을 사용 | LDS `IconButton`의 32/40px 축과 충돌하고 형제 컴포넌트와 정렬 불일치 | 밀집 Editor control은 LDS 32px 소형 icon-button 규격으로 통일 |
| Layer와 Inspector가 접힘/resize 및 좁은 화면 전환 계약 없이 고정 | 중앙 viewport가 비정상적으로 줄고 보조 패널이 항상 우선됨 | 넓은 화면은 resize/collapse/restore, 좁은 화면은 별도 semantic region navigation으로 한 보조 패널만 노출 |
| Layer tree의 focus/selection/expand가 한 상태처럼 보이고 Inspector가 single selection만 가정 | 공식 Tree keyboard 모델과 실제 다중 선택 편집 상태를 표현하지 못함 | focus와 selection을 분리하고 Tree 방향키/expand를 지원하며 Inspector에 none/single/multi/mixed 및 read-only/invalid 상태 계약 추가 |

## Resulting component ownership

| Component | Storybook owner | Public evidence |
| --- | --- | --- |
| `CanvasEditorShell` | `LDS Robotics/Editor/Canvas Shell` | 기본 영역 관계, 보조 패널 resize/collapse/restore, 좁은 화면 region navigation, 컨텍스트 드로어 |
| `CanvasEditorCommandBar` | `LDS Robotics/Editor/Command Bar` | 32px 문서 명령, 비활성 히스토리; viewport 명령은 제외 |
| `EditorToolbar` | `LDS Robotics/Editor/Editor Toolbar` | 세로/가로, 전체 비활성, roving focus와 shortcut |
| `LayerPanel` | `LDS Robotics/Editor/Layer Panel` | selection 공유, 펼침/접힘 Tree, visibility/lock, 빈 상태, 전체 비활성 |
| `SelectionInspector` | `LDS Robotics/Editor/Selection Inspector` | 선택 없음/단일/다중/mixed, locked/read-only/invalid, 고정 header와 action footer |
| `ViewportStatusBar` | `LDS Robotics/Editor/Viewport Status Bar` | 우선순위가 있는 passive single-line readout와 상태 tone |

## Product evidence retained outside Storybook

| Workflow | Source | Why it is not a public LDS story |
| --- | --- | --- |
| 작업 생성/편집 | `frontend/src/screens/TaskCreateScreen.tsx` | 업무 폼, 단계, 건물/층 선택을 포함한 애플리케이션 화면 |
| 맵 오브젝트/PGM 편집 | `frontend/src/screens/MapEditScreen.tsx` | 제품 명령과 편집 정책을 포함한 애플리케이션 워크플로 |
| PCD 3D 보조 | `frontend/src/components/editor/PcdMap3DPanel.tsx` | 맵 편집 내부의 제품 전용 split panel |

세부 소유권과 제품 소스 우선순위는 `docs/EDITOR_LAYOUT_REFERENCE_MATRIX.md`에 유지한다.

## Verification

Editor Storybook 변경 후 다음 검사를 실행한다.

```bash
node scripts/check-story-subject-duplicates.mjs
pnpm run check:types
pnpm run check:storybook
```
