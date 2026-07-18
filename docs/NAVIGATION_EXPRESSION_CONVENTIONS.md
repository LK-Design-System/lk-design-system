# Navigation 표현 규약

| Field | Value |
| --- | --- |
| Type | Convention and boundary spec |
| Status | Active |
| Owner | Design system owner · Robotics domain engineering |
| Date | 2026-07-18 |

이 문서는 `LDS Robotics/Navigation` 렌더러(WaypointMarker·LaneOverlay·RouteOverlay·TrajectoryOverlay·SpatialRegion·FacilityTransition·HazardMarker·NavigationAnnotationLayer)와 그 스토리가 **무엇을 어떻게 표현하는지**, 그리고 **무엇이 디자인 시스템 소관이고 무엇이 제품 소관인지**를 정의하는 단일 규약이다. 그동안 "semantic mirror" 병렬 컨트롤, 선택 리스트, activation readout, 복합 상태 겹침 같은 표현이 **규약 없이 스토리·컴포넌트마다 즉석에서 등장**해 일관성이 깨지고 인스턴스마다 수동으로 쫓아야 했다. 앞으로 새 표현은 **이 문서(또는 Foundation 원자 페이지)에 먼저 정의하고 참조**한다.

## 1. 디자인 시스템 ↔ 제품 경계

**디자인 시스템(DS) 소관 — 스토리가 표현해도 되는 것**
- 오버레이/마커 렌더러 자체와, 그 렌더러가 **지도 위에서** 갖는 계약: pointer/keyboard 활성화, `aria-hidden` pointer-only 조각, 접근성 이름, 선택·포커스·상태 표식.
- Foundation 원자(상태 글리프·dash·opacity·map-pin·hit target·label halo·direction-chevron/progress-triangle geometry·line-integrated progress head·codes·viewer/unit token). `Vector Glyph`는 `NAV_DIRECTION_CHEVRON`(선 절개 방향 셰브론)과 `NAV_PROGRESS_TRIANGLE`(진행 삼각형) 기하를, `Navigation Encoding Tokens`는 삼각형의 결합 계약 `NAV_PROGRESS_HEAD`를 소유한다. Lane은 최장 직선 구간의 중점에서 선을 짧게 끊고 선 자체가 같은 색·두께의 열린 V로 꺾이는 방향 표식을 한 번 사용하고, Route·Trajectory는 반복 방향 glyph 없이 source-owned progress가 있을 때만 채움 화살촉을 elapsed 선 끝에 사용한다 — 의미당 모양 하나라 정적 방향과 동적 진행이 지도에서 혼동되지 않는다.

**제품(consumer) 소관 — 렌더러 스토리가 손수 만들지 않는 것**
- **병렬 접근성 컨트롤 / "semantic mirror"** — `aria-hidden` SVG 지도에 대응하는 키보드 포커스 가능한 이름 목록/컨트롤. 이것을 어떻게 제공할지는 제품이 결정한다.
- **지도와 동기화된 선택 리스트** — 같은 개체를 목록에서 고르는 UI.
- **레이어 패널 + 선택 검사기 + 범례를 합성한 앱 씬** — 이는 "합성 뷰어" 데모이며 렌더러 페이지가 아니라 `LDS Robotics/Viewer`의 합성 페이지 소관이다.
- **activation / 선택 readout** — "activation 3회", "선택: {id}" 같은 카운터·상태 출력.

규칙: **렌더러 스토리는 오버레이의 pointer-only·접근성 이름 계약을 지도 자체에서 검증한다.** 콜백 발화를 확인할 테스트 훅이 필요하면 **보이지 않는 hidden `<output>`**(play가 `textContent`/`data-*`로 읽음)을 쓰고, 사용자에게 보이는 debug chrome을 렌더하지 않는다. 병렬 컨트롤·선택 리스트·합성 패널이 필요한 데모는 Viewer 합성 페이지에서 실제 LDS 컴포넌트로 짓는다.

## 2. 상태 표현 규약

- **단일 상태**: `NAV_STATE_BADGE` 원형 칩 뒤에 `NavigationStateGlyph`(11종). 배지 원 기하는 Navigation Encoding Tokens, 글리프 세트는 State Badge 페이지가 소유한다.
- **복합 상태**(예: availability=unknown **이면서** invalid): 두 상태 배지를 각각 `translate(-8 -8)`·`translate(-8 8)`로 **offset 스택**해 surface 칩 위에 겹쳐 표기한다. 이 겹침이 "복합 상태"의 **정의된 표현**이며, 임의로 다른 배치를 만들지 않는다.
- **selected(solid fill) 위 표식**: 다이아몬드가 accent로 채워지면 그 위에 직접 그리는 글리프·슬래시는 `--color-semantic-static-white`로 knockout해 대비를 유지한다(칩이 있는 복합 글리프는 foreground 유지).
- **색 단독 금지**: availability·상태는 색뿐 아니라 형태(글리프·dash 패턴)와 접근성 이름으로도 전달한다.
- **배지는 선 위에 얹지 않는다**: path에 붙는 상태·조건·invalid·stale 배지는 자기 anchor의 **위쪽 화면 법선으로 `NAV_STATE_BADGE.pathNormalOffset`(16px)** 떨어져 떠서 선을 가리지 않는다. anchor 좌표(`data-*-anchor-x/y`)는 실제 path 지점을 유지하고, 충돌 시 screen-slot row가 이 기본 오프셋을 대체한다. Lane은 라벨·메타데이터와 같은 사다리를 쓰므로 자체 32px 법선 축을 유지한다. 조건 배지가 있는 Route 세그먼트의 라벨은 배지 위(-30px)로 올라간다.

### 2.5 상호작용 상태 계층 (포커스 · 선택 · 호버)

상호작용 상태는 **두 독립 축**으로 표현한다 — 색과 역할이 갈린다. (Mapbox의 highlight/select 이원화, GIS의 전용 선택색과 같은 계열이되, 아래처럼 우리 도메인 제약을 반영한다.)

- **포커스 (일시적 · 키보드)**: `--color-semantic-focus-indicator`(파랑). 항상 마커 **자기 실루엣을 추적**한다 — 점=다이아몬드 껍데기(`NAV_FOCUS.waypointShellScale`)·원 링, 핀=실루엣 스케일(`NAV_PIN.focusRing`), 면=도형 윤곽(`NAV_FOCUS.regionStrokeWidth`), 선=경로 halo(`NAV_FOCUS.pathHaloWidth`). 전부 non-scaling-stroke, WCAG 2.4.13대로 ≥2px 둘레. 선택 강조보다 **바깥/위**에 렌더하고, 브라우저 사각 outline은 `tokens/focus.css`에서 억제한다. 원 링으로 다이아몬드를 감싸는 식의 **shape mismatch를 만들지 않는다** — 포커스는 언제나 그 마커의 형태를 따른다.
- **선택 (지속 · 의미적)**: `--viewer-accent`. 피처 자체를 강조하되 **의미 인코딩을 파괴하지 않는다** — 핀 채움=심각도, 영역 텍스처=카테고리, 경로 색·dash=상태이므로 GIS식 "선택색으로 통째 recolor"를 쓸 수 없다. 대신 각 기하가 허용하는 최강 수단을 쓰되 포커스보다 **안쪽/타이트**하게: 웨이포인트=accent solid 채움(+점 위 표식은 흰 knockout), 핀=실루엣 링(`NAV_PIN.selectionRing`, 1.16 < 포커스 1.34), 영역=accent 윤곽(`NAV_SELECTION.regionStrokeWidth` 3.5 < 포커스 6.5), 경로=반투명 accent halo(`NAV_SELECTION.haloOpacity`).
- **호버는 상태가 아니다.** 포인터 어포던스는 커서와 투명 히트타깃(`NAV_HIT`)이 소유한다. 지도 클러터와 터치/키보드 우선 운영을 고려한 **의도된 결정**이며, 별도 호버 하이라이트를 렌더하지 않는다(호버가 1급 상태인 Mapbox·GIS와 다른, 명시된 선택).
- **합성 (포커스 + 선택 동시)**: 두 축은 독립이라 동시에 성립한다. 포커스 인디케이터가 선택 강조의 **바깥/위**에 항상 렌더돼 "지금 여기(포커스) + 선택됨"이 둘 다 읽힌다.

값은 `_navigationVocabulary`의 `NAV_FOCUS`·`NAV_SELECTION`(핀은 `NAV_PIN.focusRing`/`selectionRing`)이 단일 소스로 소유하고, Foundation 페이지가 **실제 컴포넌트로 4상태(기본·포커스·선택·포커스+선택)** 를 렌더해 회귀 고정한다. 경로의 base/강조 stroke·casing 폭은 별개 path-stroke 계열(Encoding Tokens)이 소유한다.

### 2.6 선형 레이어 중첩(번들) 규약

레인 위를 경로가 따라가고 그 위를 궤적이 지나는 **코인시던트 번들**은 이 도메인의 기본 상황이다. 겹칠 때의 규칙:

- **절개·knockout은 자기 레이어 한정.** 선을 끊는 표현(레인 방향 셰브론의 절개 창)은 반드시 **SVG 마스크**로 자기 컴포넌트의 stroke에만 적용한다. surface 색을 덧칠하는 지우개는 아래에 깔린 다른 오버레이의 선까지 지우므로 금지한다. casing(선 뒤 surface 띠)은 선을 배경에서 분리하는 정상 문법이라 이 금지에 해당하지 않는다.
- **표식은 부동 장애물.** 방향 셰브론과 진행 헤드는 path-anchored라 이동하지 않는 대신 `NavigationAnnotationLayer` 장애물로 등록되어, 조정되는 라벨이 표식을 덮지 않는다.
- **표식 의미는 모양이 지킨다.** 번들 위에서 정적 방향(절개 셰브론)과 동적 진행(채움 화살촉)이 가까이 놓여도 기하가 달라 의미가 섞이지 않는다. 같은 모양을 두 의미에 쓰지 않는 것이 이 규약의 전제다.
- **밀집 완화는 owning renderer 소관.** 활성 경로가 레인 회랑을 완전히 덮는 합성에서 레인의 정적 방향 표식을 감출지는 제품/합성 뷰어가 결정한다(zoom·density 기반 라벨 suppression과 같은 축). 감추더라도 레인 접근성 이름의 진입→이탈 방향은 항상 남는다.
- **페인트 순서 권고**: 영역 → 레인 → 경로 → 궤적 → 마커·핀 — 정적 topology가 아래, 동적 상태가 위.

## 3. 라벨·카피 규약

- **사용자에게 보이는 라벨은 한국어.** raw enum(`available`·`upcoming`·`caution`)과 내부 id(`lift-a`·`segment-…`)는 props·data attribute·code에만 두고, **화면에 그대로 렌더하지 않는다.** 상태 값은 정의된 한국어 어휘(예: 예정·현재·완료 / 정상·대기·차단·충돌·지연 / 주의·위험)로 매핑해 표시한다.
- **표시 텍스트에 `<code>`를 쓰지 않는다** — code 요소는 식별자/토큰명 전용이다.
- 브랜드·표준·단위(`2D`·`320px`·`L1`) 외 영문 jargon(`pointer-only`·`semantic mirror`)을 한국어 문장에 섞지 않는다.

## 4. 표현 어휘의 단일 소스

Navigation 표현의 값·기하·글리프는 `LDS Robotics/Foundation`의 원자 페이지가 소유한다: Navigation Encoding Tokens·State Badge·Marker Pin·Facility Glyph·Hazard Glyph·Vector Glyph·Codes(그리고 교차영역 Unit Format·Viewer Tokens). 방향·진행·로봇은 **의미당 모양 하나**이고, `Vector Glyph` 페이지가 세 글리프를 나란히 렌더해 이 계약을 시각적으로 강제한다: `NAV_DIRECTION_CHEVRON`은 Lane의 정적 entry→exit 방향 — 최장 직선 구간의 중점에서 선을 짧게 끊고(절개 창은 SVG 마스크로 자기 stroke만 지운다 — §2.6) 선 자체가 같은 색·같은 두께의 열린 V로 꺾인다. `NAV_PROGRESS_TRIANGLE`은 Route·Trajectory의 동적 현재 진행(선 끝의 채움 화살촉)이다. `NAV_ROBOT_POSE`는 `RobotMarker`가 그리는 로봇의 실시간 pose — 원형 footprint body + heading 노즈이며, **원형 body가 있다는 점**이 방향 셰브론·진행 다트와의 결정적 차이라 로봇이 경로 화살표로 읽히지 않는다. `Navigation Encoding Tokens`의 `NAV_PROGRESS_HEAD`는 진행 삼각형에 결합 계약 — 단일 `marker-end`, surface 외곽선(별도 casing marker 없음), tip 앞 `futureGap`, 짧은 세그먼트에서 clamp되는 `tipSetback`, 통일된 future opacity, collision 값 — 을 더해 source-owned 현재 진행 끝점에 한 번만 결합한다. 진행 head 앞의 미래 선은 간격을 두고 다시 시작하므로 tip이 실제 끝점으로 읽히고, elapsed 선이 생기기 전(fraction 0·sample 0)에는 head를 그리지 않는다(합성 carrier 금지). 로봇의 bearing·pose·footprint는 `RobotMarker`가 소유하며, 다른 오버레이는 이를 그리지 않고 위임한다. **새 표현은 먼저 여기(또는 이 규약)에 정의하고 스토리·컴포넌트가 참조**한다. 스토리가 값·표현을 즉석에서 발명하지 않는다.

## 5. 이 규약이 정리한 위반 (이력)

- semantic mirror 병렬 컨트롤 삭제 — Waypoint 개요 목록, Waypoint 포인터 전용, Lane 포인터 전용.
- 보이는 debug readout → hidden 테스트 훅 또는 삭제 — Regions·Trajectory·Facility·Lane·Route.
- KO/EN enum 카피 → 한국어 — Hazard 캡션, Route 온-맵 세그먼트 라벨, 포인터 전용 지도 라벨.
- `Button`-as-selection-control → LDS `SegmentedControl` — Route 층 전환.
- 채움 삼각형 방향 glyph 폐기 — Lane은 공용 open V를 한 번 쓰고, Route는 반복 방향 glyph를 제거했으며, Route·Trajectory의 current progress는 같은 기하를 elapsed prefix 끝에만 결합한다. *(2026-07-18 개정으로 대체됨 — 아래 항목.)*
- **open V 공유 폐기 → 의미당 모양 하나 (2026-07-18)** — 하나의 열린 V가 Lane 정적 방향과 Route·Trajectory 동적 진행을 겸했으나, Route의 미래 선이 표식 뒤로 이어져 "선이 표식에서 끝난다"는 구분 근거가 화면에서 무너졌고, casing 이중 표식 탓에 Lane chevron이 선에서 떠 보였다. 재분리: 방향 = 선 절개 셰브론(`NAV_DIRECTION_CHEVRON`, 선을 끊고 선 자체가 같은 색·두께의 여는 V로 꺾임, 최장 직선 구간 중점 — 0.64 고정 비율의 코너 걸침 제거), 진행 = 단일 `marker-end` 채움 삼각형(`NAV_PROGRESS_TRIANGLE`, 자체 외곽선이 casing marker 쌍을 대체) + tip 앞 future gap. fraction 0의 합성 16px carrier와 route/trajectory future opacity 드리프트(0.34/0.28→단일 값)도 함께 제거했다.
- **즉석 로봇 pose placeholder → `RobotMarker` 원자·렌더러 (2026-07-18)** — 여러 스토리(2D Map preview, Map2DCanvas/ViewerToolbar visual-parity 카드)가 로봇 위치·방향을 "원 + 회전 다트"로 손수 그렸다. 이 다트는 진행 다트와 같은 계열이라 "의미당 모양 하나"를 스토리 층에서 깨뜨렸고, 어느 Foundation 페이지에도 정의되지 않은 채 소비 페이지에서 튀어나왔다(§7 유형). 로봇 pose를 정식 원자 `NAV_ROBOT_POSE`(원형 body + heading 노즈, 진행 다트와 모양 분리)와 공개 렌더러 `RobotMarker`(position·heading·footprint, selected/focused/disabled/invalid/stale 어휘, hit target, 접근성 이름)로 승격하고, 모든 즉석 placeholder를 `RobotMarker`로 교체했다. `Vector Glyph` 페이지가 세 글리프를 나란히 문서화한다.
- **합성 앱 씬 → Viewer 페이지 이동** — Route 렌더러 페이지에 있던 `SemanticMirror`(이름 목록 + 6-오버레이 지도 + LayerPanel·SelectionInspector·Legend)를 §1에 따라 `LDS Robotics/Viewer/Navigation Viewer` 합성 페이지로 옮겼다. 이동하며 SelectionInspector 필드의 KO/EN(`keep-out`·`lift-a`·`holding`·`passthrough`·`completed`·`current`·`sample`…)을 한국어 어휘로 정정하고, Route에 남은 좁은 폭 스토리의 "아래 semantic mirror" 참조 카피를 접근성 이름 기준으로 다시 썼다([`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) Phase 5).

## 6. 미결 위반 (규약대로 정리 예정)

- 렌더러 페이지 차원의 미결 위반은 현재 없다. Navigation 렌더러 스토리는 지도 자체에서 pointer-only·접근성 이름 계약을 검증하고, 병렬 컨트롤·선택 리스트·합성 패널은 Viewer 합성 페이지가 소유한다.
- Viewer 합성 페이지의 손수 만든 이름 목록(`SemanticMirrorListItem` 버튼)도 해소됐다: `LayerPanel` 트리 하나(그룹 = 레이어, 자식 행 = 객체)가 이름 목록·선택·표시·잠금을 모두 소유하고, 지도는 `Map2DCanvas` 위에 전폭으로 합성된다. 씬의 모든 표면이 LDS 컴포넌트다.

## 7. 숨은 표현 규약 감사 프로그램 (진행 중)

렌더러가 지도에 그리지만 **어느 Foundation Storybook 페이지에도 먼저 정의되지 않아 소비 페이지에서 갑자기 마주치는** 표현 규약을 전수 조사(2026-07-17)해 별개 규약 **32건**으로 정리했다. 목표는 "정의 없이 튀어나오는" 규약을 Foundation 페이지에서 먼저 보이게 해 검토 가능하게 만드는 것.

**두 가지 처리 결정**
- **깔끔한 드리프트(둘 이상이 같은 의미로 comparable 기하에 쓰는 값) → `_navigationVocabulary`로 단일 토큰 승격**하고 Foundation 페이지가 그 상수를 그대로 렌더한다(`NAV_PROGRESS_HEAD` 선례). 예: path casing 폭, base/강조 stroke 두께.
- **렌더러마다 축·의미가 다른 규칙(복합 상태 오프셋 스택, 포커스 링 기하 등) → 단일 상수로 강제하지 않고**, 규칙 자체를 Foundation 프레임(State Badge·Marker Pin)에 문서화하고 렌더러별 축(웨이포인트 ±8 대각 / 레인 18 접선·32 법선 / 시설 16 수평 / 영역 ±18 수직)을 예시로 병기. `_navigationVocabulary`의 SCOPE RULE(같은 의미·comparable 기하만) 준수.
- **담을 페이지가 없는 계열은 신규 Foundation 페이지 신설**: `Navigation Label Coordination`(라벨 충돌 조정 13규칙), `Navigation Map Stage`(패널 chrome·grid·축척·범례).

**진행(커밋)**
- 즉시 조치 2건: 시설 핀 dead-dash 문서 버그(C27), Route not-allowed 커서 드리프트(C15).
- 시스템 규약 3건을 기존 페이지 프레임으로: 상태→톤(C11, Viewer Tokens), 화면고정 마커(C8)·라벨 우선순위 사다리(C9, Encoding Tokens).
- 남은 우선순위·배치는 감사 콘솔(세션 산출물)이 살아있는 트래커로 유지.
