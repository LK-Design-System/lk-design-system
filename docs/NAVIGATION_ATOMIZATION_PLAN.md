# Navigation 원자화 계획

| Field | Value |
| --- | --- |
| Type | Implementation plan |
| Status | Completed (2026-07-17) |
| Owner | Design system owner · Robotics domain engineering |
| Date | 2026-07-16 |

Navigation 계열(WaypointMarker · FacilityTransition · HazardMarker · LaneOverlay · RouteOverlay · TrajectoryOverlay · SpatialRegion)은 마커 글리프·상태 글리프·라벨 충돌 같은 일부 원자는 내부 `_`모듈로 뽑았지만, 선(線)·상태 어휘는 렌더러마다 인라인으로 재선언되어 있고 이미 drift가 시작됐다. 이 계획은 **공개 API를 동결한 채** 그 어휘를 단일 소스로 승격하고, foundation급 문서 페이지로 고정한다.

## 감사 결과 (2026-07-16)

### 이미 원자인 것 (유지)

| 모듈 | 소유 |
| --- | --- |
| `components/robotics/_NavigationStateGlyph.js` | unknown/invalid/stale 등 상태 글리프 기하 |
| `components/robotics/_navigationAnnotations.js` | 라벨 충돌·우선순위·obstacle 등록 (`NavigationAnnotationBlock`) |
| `components/robotics/_FacilityGlyph.js` | 설비/hazard 공유 kind 글리프 (`FACILITY_GLYPH_PATHS`) |
| `components/robotics/_navigationEncoding.js` | 역할/주석 코드 |
| `components/robotics/_NavigationFocus.js` | focus-visible 판정 |

### 인라인 중복 (원자화 대상)

| 어휘 | 값 | 중복 위치 |
| --- | --- | --- |
| 상태 opacity | `disabled 0.45 · stale 0.76` | 7개 렌더러 전부 (각 prompt.md가 "형제와 일치"를 수작업 계약으로 서술) |
| 가용성/상태 dash | `unavailable '6 3'` · `unknown '1 3'` · `invalid '4 3'` · `stale '2 4'` · stale 배지 `'2 2'` | FacilityTransition, SpatialRegion, RouteOverlay(`segmentDash`), TrajectoryOverlay(`statusDash`), WaypointMarker |
| 핀 기하 | `PIN_PATH` + 그림자(translate 0 0.8, opacity .16) + focus ring(scale 1.34/w 2.5) + selection ring(scale 1.16/w 2) | FacilityTransition.jsx:200, HazardMarker.jsx:57 — **통째 복제** |
| hit target | 투명 원 + `data-screen-target-size="24"` | 7개 렌더러 |
| 라벨 halo | `stroke=surface` + `paintOrder="stroke"` + width 4/3/2.5/1.5 | 7개 렌더러 |
| 상태 배지 원 | r 7 · stroke 1.5 · tone 외곽선 | FacilityTransition, SpatialRegion, WaypointMarker |

### 발견된 drift (원자 부재의 실증)

| # | 항목 | 갈라진 값 | 통일 권고 |
| --- | --- | --- | --- |
| D1 | stale ring dash | WaypointMarker `'2.5 2.5'` vs 나머지 `'2 2'` | `'2 2'` (다수 + 상태 배지와 일치) |
| D2 | hit 원 반지름 | Facility/Hazard `r=17` vs Waypoint `r=17.5` | `17.5` (24√2/2≈16.97 + 렌더 여유, Waypoint 주석의 근거 채택) |
| D3 | 라벨 halo 폭 | 4 / 3 / 2.5 / 1.5 혼재 | 계층 스케일로 정의: `primary 4 · secondary 3 · caption 1.5`; RouteOverlay의 2.5는 secondary(3)로 흡수 |

## 원칙 (비목표 포함)

1. **공개 API 동결.** 원자는 내부 `_`모듈과 문서·스토리로만 존재한다. `<Arrowhead>` 같은 public 원자 컴포넌트는 만들지 않는다 — 제품은 직렬화 데이터를 넘기는 쪽이지 획을 조립하는 쪽이 아니며, 열면 제품별 하이브리드로 일관성이 깨진다. (`check:api-drift`·`check:type-surface` 무변이 이 원칙의 게이트 증거.)
2. **픽셀 변화는 "의도된 통일"만.** D1–D3 결정 외에는 시각 불변. visual-regression 차이는 해당 항목에서만 발생해야 한다.
3. **계약 승격.** 각 prompt.md의 "형제와 일치시킵니다"(수작업 약속)를 "`_navigationVocabulary`를 소비합니다"(구조적 보장)로 바꾼다.

## Phase 1 — `_navigationVocabulary.js` 신설 + 7개 렌더러 마이그레이션

내부 모듈(공개 entry로 승격되지 않도록 `_`-접두 `.js`, `React.createElement` 규칙은 렌더 헬퍼 없으면 무관):

```js
export const NAV_STATE_OPACITY = { disabled: 0.45, stale: 0.76 };
export const navStateOpacity = (disabled, stale) => (disabled ? 0.45 : stale ? 0.76 : 1);
export const NAV_DASH = {
  unavailable: '6 3',
  unknown: '1 3',
  invalid: '4 3',
  stale: '2 4',
  staleBadge: '2 2',
};
export const NAV_PIN = {
  path: 'M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z',
  shadow: { dy: 0.8, opacity: 0.16 },
  focusRing: { scale: 1.34, strokeWidth: 2.5 },
  selectionRing: { scale: 1.16, strokeWidth: 2 },
};
export const NAV_HIT = { radius: 17.5, screenTargetSize: 24 };
export const NAV_LABEL_HALO = { primary: 4, secondary: 3, caption: 1.5 };
export const NAV_STATE_BADGE = { radius: 7, strokeWidth: 1.5 };
```

작업 항목:

- [ ] 모듈 작성 (위 초안 + 각 축의 의미를 주석으로: dash=가용성/오류/신선도, halo=라벨 계층).
- [ ] 7개 렌더러를 기계적으로 치환. RouteOverlay `segmentDash`·TrajectoryOverlay `statusDash`는 함수 유지하되 반환 리터럴만 `NAV_DASH` 참조로.
- [ ] drift 통일: D1(`'2.5 2.5'`→`'2 2'`), D2(`17`→`17.5`), D3(Route `2.5`→`3`).
- [ ] LaneOverlay `'2 7'`(방향 tick)은 lane 고유 인코딩으로 로컬에 남기고 주석으로 명시.
- [ ] 핀 렌더 헬퍼는 이번엔 상수만 공유(마크업 추상화는 hazard/facility 구조가 더 수렴한 뒤 재평가).
- [ ] 7개 prompt.md의 상태·어휘 서술을 `_navigationVocabulary` 소비로 갱신.

게이트: `build` → `check:types` `check:component-styles` `check:visual-token-drift` `check:prompt-contracts` `check:story-coverage` `check:contracts` `check:dimension-literals` + storybook 계열(`check:component-styles-rendered`, `check:visual-regression`). D1–D3 픽셀 차이만 `update:visual-baseline`으로 승인 갱신.

## Phase 2 — "Navigation Encoding" foundation 스토리 페이지

`stories/RoboticsNavigationEncoding.stories.jsx` · 제목 `LDS Robotics/Navigation/Encoding` — Facility Glyph 카탈로그의 선(線)·상태 버전. 손그림 견본이 아니라 **프로덕션 fragment를 그대로 렌더**해서 문서=회귀가 되게 한다.

- [ ] ① dash 축 카탈로그: 같은 lane/region을 available/unavailable/unknown/invalid/stale로 나란히.
- [ ] ② 상태 배지 슬롯: unknown·invalid·stale 동시 표기 규칙.
- [ ] ③ 핀 패밀리: waypoint 원점 · facility accent 핀 · hazard severity 핀 비교(형상 공유, 색·글리프 구분).
- [ ] ④ 라벨 halo 계층: primary/secondary/caption.
- [ ] ⑤ hit target: play에서 `getBoundingClientRect()`로 24px 계약 측정.
- [ ] play가 DOM 값과 `_navigationVocabulary` 값의 일치를 단언 (어휘가 곧 회귀 기준).
- [ ] 320px narrow + visual-parity 스토리 포함 (`check:story-coverage` 요건).
- [ ] 등록: `docs/references/wds/LAYER_CLASSIFICATION.json` storyTitles, `PUBLIC_EXPORT_CLASSIFICATION.json` robotics 그룹 storyEvidence.

게이트: Phase 1 세트 + `check:wds-alignment` `check:story-subjects`.

## Phase 3 — Route / Trajectory 스토리 페이지 분리

각각 734·538줄짜리 컴포넌트가 한 페이지(`RoboticsNavigationRouteTrajectory.stories.jsx`)에 합쳐져 있어 원자 단위 검토가 어렵다.

- [ ] `RoboticsNavigationRoute.stories.jsx` / `RoboticsNavigationTrajectory.stories.jsx`로 분리, 공유 fixture는 `RoboticsNavigation*.shared.jsx` 패턴으로.
- [ ] 참조 전수 치환(grep `RouteTrajectory`): `LAYER_CLASSIFICATION.json` storyTitles, `PUBLIC_EXPORT_CLASSIFICATION.json` storyEvidence, coverage 계열 JSON, storyGuide `storyId`, 다른 스토리의 크로스 링크.
- [ ] 분리 후 `report:storybook-ia` 재생성(사람 리뷰 게이트) — 기존 IA staleness와 함께 처리.

게이트: Phase 2 세트 + `check:storybook-ia`(로컬 확인용; CI 제외 게이트).

## 실행 순서·커밋 단위

| 커밋 | 내용 | 주요 위험 |
| --- | --- | --- |
| 1 | Phase 1 어휘 모듈 + 마이그레이션 + D1–D3 통일 | visual-regression 베이스라인 갱신 범위를 D1–D3로 한정 확인 |
| 2 | Phase 2 Encoding 페이지 + WDS 등록 | wds-alignment의 storyTitles/Evidence 누락 |
| 3 | Phase 3 페이지 분리 + 참조 치환 + IA 재생성 | coverage JSON들의 경로 참조 누락 |

## 명시적 제외

- 공개 export 추가·변경 없음 (entry 재생성 diff가 나오면 잘못된 것).
- Lane 방향 tick(`'2 7'`), Route 세그먼트 진행률 기하 등 **컴포넌트 고유 인코딩**은 어휘 모듈로 끌어올리지 않는다 — 두 곳 이상에서 쓰일 때만 승격.
- viewer 토큰(`--viewer-*`) 체계 변경 없음 — 어휘 모듈은 기하·패턴만 소유하고 색은 기존 토큰을 그대로 참조.

## 실행 결과 (2026-07-17)

세 커밋으로 완료. 공개 API 무변(entry diff 없음).

| Phase | 커밋 | 내용 |
| --- | --- | --- |
| 1 | `e31f186` | `_navigationVocabulary.js` 신설 + 7개 렌더러 마이그레이션 |
| 2 | `c3a18b9` | `RoboticsNavigationEncoding.stories.jsx` foundation 카탈로그 |
| 3 | `9dc0c24` | Route/Trajectory 스토리 페이지 분리 + `.shared.jsx` |

감사(7개 렌더러 병렬 정밀 감사)로 계획을 정교화한 지점:

- **D1 확정**: `2.5 2.5`는 Waypoint stale-indicator 링(badge 링은 이미 `2 2` 통일) → `2 2`.
- **D2**: Facility/Hazard hit `17 → 17.5`(투명, 시각 무변).
- **D4 신규**: state-badge 반지름 `6.5`(Waypoint)/`8`(Route) → `7`. Route·Trajectory는 badge가 2개씩이라 형제 badge까지 통일(감사가 놓친 것).
- **D5**: primary 라벨 halo `3 → 4`(Waypoint·Trajectory).
- **로컬 유지**: availability-unavailable dash(3-way, 서로 다른 geometry), lane/route/trajectory path dash, 충돌 hatch, 마이크로 halo(Lane `1.5`·Route `2.5`), r=8–9 position marker. Waypoint `--label2-size` 폰트 drift, Facility dead dash const는 별도 정리 대상으로 표기.

시각 회귀: SVG는 결정적이라 CI(Windows)와 일치 → Phase 1의 6개 `atom-glyph` baseline(Route badge 8→7)만 갱신. Phase 3 분리 후 `RouteAndTrajectoryStates`가 byte-identical이라 atom-glyph baseline **제로 diff** 확인. DOM-텍스트 baseline 차이는 로컬 폰트 래스터라이즈 노이즈라 되돌림.

Phase 3 실제 구조: 원본의 모든 스토리가 route·trajectory를 함께 렌더하므로(순수 단일 subject 스토리 없음), 비교·통합 스토리는 Route 페이지에 그대로 두고 Trajectory 페이지는 전용 focused 스토리(Overview·Statuses·Narrow)를 신설. play-test는 Storybook에서 라이브 검증.

미결(범위 밖): `check:docs`의 Storybook IA 마크다운 최신성은 세션 이전부터 stale한 **사람 리뷰 게이트**로, 날짜 스냅샷 IA 리뷰 패스가 별도로 필요.

## 후속: Robotics/Foundation 계층 확장 (2026-07-17)

원자화 완료 후 "원자 페이지가 기본 컴포넌트보다 적다"는 제기로 전 시스템을 감사했다. 결론은 미묘하다 — **비율로는 Robotics(원자 11.4%)가 Core(11.9%)와 동률**이라 구조적으로 부족하지 않으나, 코드에는 있으나 페이지가 없는 "묻힌 원자"와 drift가 실재했다. 시스템 자체 모델(Core의 Foundation 계층)을 미러해 확장:

| 커밋 | 내용 |
| --- | --- |
| `3757bfb` | 방향/벡터 글리프 원자를 `_navigationVectorGlyph`로 추출(+lane endpoint 화살표 hoist). circle-marker 기하는 역할별로 반지름이 달라 **공유 원자 아님**으로 판정(NAV_PIN과 달리)—로컬 유지. |
| `d33d06c` | `LDS Robotics/Foundation/*` 계층 확립(Core 미러, sidebar 맨 앞). 기존 원자 3개 재배치 + `Encoding`→`Line & State Vocabulary` 오칭 교정(실제로 `_navigationVocabulary` 문서화, `_navigationEncoding` 아님) + 새 원자 페이지 3개(Vector Glyph·Codes·Viewer Tokens, live-from-source + play-test). 원자 페이지 3→6. atom-glyph baseline은 컴포넌트 스토리 기반이라 재배치·신설에 **제로 diff**. |

### 미결 backlog — P2b (Navigation 밖, 별도 PR 시리즈)

Navigation 밖 컴포넌트의 미승격 원자. **감사 먼저 → 진짜 동일한 것만 de-dup(다르면 로컬 유지)** 원칙 적용 필요:

- **telemetry tone→color 4중복** (`viz/TelemetryGauge`·`viz/TelemetryValue`·`editor/ViewportStatusBar`·`robotics/EquipmentStatusCard`) → 공유 모듈 + `Foundation/Status Tone` 페이지
- **unit-format** (`internal/unit-format.js`, Status+Editor 공용) → `Foundation/Unit Format`
- **connection-state** (`ConnectionBadge` `CONNECTION_CFG`) → `Foundation/Connection State`
- **viewer-state** (`viz/ViewerFrame` `VIEWER_STATES`/`TONE_COLOR`) → `Foundation/Viewer State`

리스크: 라이브 status/viewer 컴포넌트 리팩터링이라 시각 회귀 노출이 크고, 해당 DOM-heavy baseline은 로컬에서 폰트 노이즈로 깨끗이 검증하기 어렵다 → 정규(CI/Windows) 환경 visual-regression 가드로 순서화. 관찰 종합의 권고와 사용자 결정에 따라 **별도 PR로 연기**.
