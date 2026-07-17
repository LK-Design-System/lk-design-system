# Navigation 스토리 페이지 재분해 계획

| Field | Value |
| --- | --- |
| Type | Implementation plan |
| Status | Proposed — 검토 대기 (2026-07-17) |
| Owner | Design system owner · Robotics domain engineering |
| Date | 2026-07-17 |

`LDS Robotics/Navigation` 그룹의 8개 렌더러 페이지(Waypoint · Lane · Route · Trajectory · Regions · Facility Transition · Hazard Marker · Annotation Layer)를 대상으로, **공개 API를 동결한 채 스토리/태그/이름/IA만** 재분해한다. 8개 페이지를 병렬 감사한 결과를 종합했다. 렌더러 컴포넌트(RouteOverlay 등)의 props·동작은 일절 바뀌지 않는다.

## 진단 요약

- **Route = 심각한 메가페이지**(약 1600줄 / 스토리 9개). `title`은 "Route"지만 RouteOverlay + TrajectoryOverlay + Waypoint + Lane + Region + Facility + LayerPanel + SelectionInspector + Legend를 모두 import한다. 한 페이지에 **① Route 렌더 ② Trajectory 비교 ③ 층별 경로 시나리오 ④ 합성 뷰어 씬(SemanticMirror: 레이어패널+선택검사기+범례+6개 오버레이, ~730줄) ⑤ 교차개체 라벨충돌 계약**이 섞여 있다.
- **Trajectory = 미완**(개요/상태/반응형만). Route/Trajectory 분리(과거 Phase 3)가 덜 끝나 trajectory 콘텐츠가 아직 Route에 남아 있다.
- **Waypoint 개요 = 인터랙션 하니스**. 대표 지도 + 인터랙티브 목록-선택 동기화 + activation 카운터 + 키보드 활성화 계약이 개요에 융합돼 있다(사용자 지적 지점).
- **Facility 개요 = 경미한 과부하**. 개요 play가 전체 상태축을 다시 읽어 변형·상태 스토리와 중복.
- **Lane = sidebar 오염**. 변형·상태 3개 중 2개가 실은 내부계약(다크 복합 상태·짧은 경로 축소)이고, 포인터 전용 스토리에 유한점 방어 기하 계약이 끼어 있다.
- **Hazard Marker = 역할 오분류**. 8-타일 카탈로그가 개요 자리를 차지하고(대표 지도 개요가 없음), "상호작용" 스토리는 실제로 정적(userEvent 미사용). 잘못된 "설비 핀 대비" 문구도 있음.
- **Regions / Annotation Layer = 잘 분해됨**(기준 모델). Annotation Layer는 Route·Facility에 갇힌 교차개체 라벨충돌 계약의 올바른 귀속처.
- **공유 헬퍼 중복**. glyph/contrast/geometry 단언 헬퍼 ~219줄이 Lane·Waypoint에 복제돼 drift 중.

핵심: 잘 분해된 단일 렌더러 페이지(Lane·Regions·Facility·Hazard·Annotation·Trajectory)는 **쪼개지 않는다.** Route에서 trajectory·합성씬·충돌계약을 걷어내고, 과부하 개요를 슬림화하고, 오분류 역할을 바로잡는다.

## 목표 구조

### Waypoint
개요(슬림: 대표 역할 지도 + 범례) / **상호작용 · 지도·목록 선택 동기화(신규, 하니스 이관)** / 상호작용 · 포인터 전용 / 변형·상태 · 밝은·어두운 / 변형·상태 · 중첩 역할과 운영 상태 / 상호작용 · 확대·축소 / 반응형 / (숨김) parity. 교차 렌더러 오염 없음.

### Lane
개요 / 변형·상태 · 폐쇄,충돌,전환 참조 / 상호작용 · 선택과 비활성 / 상호작용 · 포인터 전용(이름에서 "형상 방어" 제거) / 반응형 / **(숨김) 내부계약 · 복합 상태**(다크 복합 + 짧은 경로 강등) / **(숨김) 내부계약 · 유한점 방어**(포인터 전용에서 분리) / (숨김) parity.

### Route — Route 전용으로 정리
개요 · 대표 경로 지도(RouteOverlay만, TrajectoryOverlay·trajectory 단언 제거, meta 재제목) / 변형·상태 · 구간 조건(Route status×phase×condition만) / 사용법 · 층별 경로(activeMapId, Route만) / 상호작용 · 구간 선택 / 반응형(Route만) / (숨김) Route parity(route-only로 개명) / (숨김, 선택) 내부계약 · 퇴화 형상. **정리 후 RouteOverlay만 import.**

### Trajectory — 수신 절반 완성
개요 / 변형·상태 · 궤적 수명주기("상태"에서 개명) / **사용법 · 단일 지도 소유(신규, Route에서 이관)** / **상호작용 · 궤적 선택(신규, Route에서 이관)** / 반응형 / (숨김) parity.

### Regions
변경 없음(기준 모델). 개요의 미사용 선택 상태머신 제거는 선택 사항.

### Facility Transition
개요(슬림: 2-지도 identity 유지, 상태축 readout는 변형·상태로) / 변형·상태 · 가용성·오프라인·미확인 / 변형·상태 · 선택·포커스·오류·지연 / 상호작용 · 활성화(충돌 블록 제거) / 반응형 / **(숨김) 내부계약 · 라벨 조정** / (숨김) parity.

### Hazard Marker — 역할 라벨 교정
**개요 · 대표 지도 맥락(신규)** / 변형·상태 · 종류×severity(개요 자리 차지하던 카탈로그 재부여) / 변형·상태 · 선택·포커스·비활성(오분류 "상호작용" 개명, 또는 실제 인터랙션으로 승격) / 반응형 / (숨김) parity. 잘못된 facility-pin 문구 제거.

### Annotation Layer
변경 없음. Route·Facility의 교차개체 라벨충돌 계약을 **숨김 내부계약으로 수신**하는 것만 고려.

### (신규) LDS Robotics/**Viewer**/Navigation Viewer
합성 뷰어 씬(SemanticMirror: Map2DCanvas + Route/Trajectory/Waypoint/Lane/Region/Facility 오버레이 + LayerPanel + SelectionInspector + Legend + 이름목록 a11y 미러)을 Route에서 이관. 렌더러 페이지가 아니라 **합성/시나리오** 페이지이므로 Navigation이 아닌 **Viewer 그룹**(2D Map·Viewer Frame·Toolbar 옆)에 둔다. 개요 · 구성된 내비게이션 뷰어 / 반응형 · 320px 의미 목록 연동. Route에서 ~730줄 + 비-Navigation 컴포넌트 3개 제거.

## 실행 단계 (안전·저위험 우선, 독립 커밋 가능)

- **Phase 0 — 공유 헬퍼 de-dup(IA 무변)**: Lane·Waypoint 중복 헬퍼를 `RoboticsNavigationAssert.shared.jsx`로 추출. storyId/태그/이름 무변 → 베이스라인·IA·카운트 무영향. 가장 먼저. 위험 낮음.
- **Phase 1 — 개요 2개 슬림화(파일 내)**: Waypoint 개요 분리(하니스 → 신규 상호작용), Facility 개요 play 축소, (선택)Regions 개요 정리. Waypoint +1 스토리. 위험 낮음~중간.
- **Phase 2 — 역할 라벨 교정(이름만)**: Trajectory 상태→변형·상태, Hazard 재부여+신규 개요, Lane 포인터 전용 개명, (선택)Annotation 접두어. rename마다 storyId churn. 위험 낮음.
- **Phase 3 — Lane/Facility 계약 강등(숨김 역할)**: Lane 복합·유한점 계약 숨김, Facility 충돌 블록 숨김 분리. sidebar 노출 스토리 감소. 위험 중간(숨김 후에도 CI play 실행 확인).
- **Phase 4 — Route/Trajectory 분리(핵심 수술)**: 공유 파일 aria/eyebrow 파라미터화 → Trajectory에 사용법·상호작용 추가 → Route에서 trajectory 전면 제거 + meta storyId 개명 + parity 개명. prompt.md trajectory 예시 이관. 위험 **높음**(최대 diff, 다수 베이스라인/IA).
- **Phase 5 — 합성 씬 이관 + 충돌 재귀속** *(씬 이관 실행 완료 2026-07-17, 나머지 이연)*: `LDS Robotics/Viewer/Navigation Viewer` 신설로 `SemanticMirror` 씬(이름 목록 + 6-오버레이 지도 + LayerPanel·SelectionInspector·Legend)을 Route에서 이관하고 inspector KO/EN을 한국어로 정정했다. storySort는 'LDS Robotics' 순서에 이미 'Viewer'가 있고 Viewer 하위가 알파벳 정렬이라 **편집 불필요**였다. LAYER_CLASSIFICATION·IA census(190페이지)·인벤토리·a11y 정합 완료. **남은 부분(Phase 4 의존, 이연)**: 충돌 계약을 Annotation Layer로 재귀속, Route를 RouteOverlay-only로 축소.

## 영향 게이트·산출물

- `.storybook/preview.jsx` storySort — Navigation 그룹은 **불변**(렌더러 가감 없음), Viewer 그룹에 'Navigation Viewer' 추가만.
- `docs/references/wds/LAYER_CLASSIFICATION.json` — 이관·재부여·신규 페이지 분류.
- `docs/references/quality/STORY_COVERAGE_BASELINE.json` — 추가·삭제·개명·재태그된 모든 storyId 갱신.
- `check:inventory` 5개 카운트 문서 — 페이지별 스토리 수 변동(Waypoint +1, Route −3~4, Trajectory +2, Viewer +1, Facility +1 숨김).
- `docs/references/wds/COVERAGE_*` 및 `check:docs` IA 마크다운·audit — 재서술(사람 리뷰 게이트 `check:storybook-ia`, CI 제외).
- prompt.md 계약 — RouteOverlay/TrajectoryOverlay trajectory 예시 이관, NavigationAnnotationLayer가 충돌 계약 소유. **prop/API 변경 없음**.
- 공유 스토리 파일 — `RoboticsNavigationRouteTrajectory.shared.jsx` aria-label·eyebrow 파라미터화, `RoboticsNavigationCollision.shared.jsx` 소비처 이동, 신규 assert 헬퍼 모듈.
- 시각 baseline — Route parity(route-only로 변경), Viewer 신규 씬 baseline 필요. SVG PNG만 유지, DOM-텍스트는 revert(로컬 비결정적).

## 결정 필요 (실행 전)

1. **합성 씬 귀속처**: `Viewer/Navigation Viewer`(권장) vs Navigation 내 합성 페이지 vs 기존 Viewer Frame 흡수.
2. **교차개체 충돌 계약**: Annotation Layer로 이관(책임 기준 깔끔, 파일 교차) vs 현 페이지에 숨김 강등(churn 최소).
3. **Lane 복합 계약**: 숨김 1개로 병합 vs 2개 유지(다크 대비 vs 축소 기하 구분 보존).
4. **Hazard "상호작용"**: 변형·상태로 개명(정적 인정) vs 실제 인터랙션으로 승격(userEvent 소비).
5. **Route meta storyId 개명**(`route-and-trajectory-overview`→route-only): 베이스라인·딥링크 영향 수용 여부(분리에 불가피).
6. **선택 정리**(Regions 선택머신 제거, Annotation 접두어): storyId churn 감수 vs 보류.
7. **커밋 단위**: 6단계 각각 독립 커밋(권장) vs Phase 4–5는 공유 파일 공유로 원자적 병합 필요.
