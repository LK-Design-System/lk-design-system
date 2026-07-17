# Navigation 표현 규약

| Field | Value |
| --- | --- |
| Type | Convention and boundary spec |
| Status | Active |
| Owner | Design system owner · Robotics domain engineering |
| Date | 2026-07-17 |

이 문서는 `LDS Robotics/Navigation` 렌더러(WaypointMarker·LaneOverlay·RouteOverlay·TrajectoryOverlay·SpatialRegion·FacilityTransition·HazardMarker·NavigationAnnotationLayer)와 그 스토리가 **무엇을 어떻게 표현하는지**, 그리고 **무엇이 디자인 시스템 소관이고 무엇이 제품 소관인지**를 정의하는 단일 규약이다. 그동안 "semantic mirror" 병렬 컨트롤, 선택 리스트, activation readout, 복합 상태 겹침 같은 표현이 **규약 없이 스토리·컴포넌트마다 즉석에서 등장**해 일관성이 깨지고 인스턴스마다 수동으로 쫓아야 했다. 앞으로 새 표현은 **이 문서(또는 Foundation 원자 페이지)에 먼저 정의하고 참조**한다.

## 1. 디자인 시스템 ↔ 제품 경계

**디자인 시스템(DS) 소관 — 스토리가 표현해도 되는 것**
- 오버레이/마커 렌더러 자체와, 그 렌더러가 **지도 위에서** 갖는 계약: pointer/keyboard 활성화, `aria-hidden` pointer-only 조각, 접근성 이름, 선택·포커스·상태 표식.
- Foundation 원자(상태 글리프·dash·opacity·map-pin·hit target·label halo·direction glyph·codes·viewer/unit token). 표현의 **값**은 이 원자가 단일 소스로 소유한다.

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

### 2.5 상호작용 상태 계층 (포커스 · 선택 · 호버)

상호작용 상태는 **두 독립 축**으로 표현한다 — 색과 역할이 갈린다. (Mapbox의 highlight/select 이원화, GIS의 전용 선택색과 같은 계열이되, 아래처럼 우리 도메인 제약을 반영한다.)

- **포커스 (일시적 · 키보드)**: `--color-semantic-focus-indicator`(파랑). 항상 마커 **자기 실루엣을 추적**한다 — 점=다이아몬드 껍데기(`NAV_FOCUS.waypointShellScale`)·원 링, 핀=실루엣 스케일(`NAV_PIN.focusRing`), 면=도형 윤곽(`NAV_FOCUS.regionStrokeWidth`), 선=경로 halo(`NAV_FOCUS.pathHaloWidth`). 전부 non-scaling-stroke, WCAG 2.4.13대로 ≥2px 둘레. 선택 강조보다 **바깥/위**에 렌더하고, 브라우저 사각 outline은 `tokens/focus.css`에서 억제한다. 원 링으로 다이아몬드를 감싸는 식의 **shape mismatch를 만들지 않는다** — 포커스는 언제나 그 마커의 형태를 따른다.
- **선택 (지속 · 의미적)**: `--viewer-accent`. 피처 자체를 강조하되 **의미 인코딩을 파괴하지 않는다** — 핀 채움=심각도, 영역 텍스처=카테고리, 경로 색·dash=상태이므로 GIS식 "선택색으로 통째 recolor"를 쓸 수 없다. 대신 각 기하가 허용하는 최강 수단을 쓰되 포커스보다 **안쪽/타이트**하게: 웨이포인트=accent solid 채움(+점 위 표식은 흰 knockout), 핀=실루엣 링(`NAV_PIN.selectionRing`, 1.16 < 포커스 1.34), 영역=accent 윤곽(`NAV_SELECTION.regionStrokeWidth` 3.5 < 포커스 6.5), 경로=반투명 accent halo(`NAV_SELECTION.haloOpacity`).
- **호버는 상태가 아니다.** 포인터 어포던스는 커서와 투명 히트타깃(`NAV_HIT`)이 소유한다. 지도 클러터와 터치/키보드 우선 운영을 고려한 **의도된 결정**이며, 별도 호버 하이라이트를 렌더하지 않는다(호버가 1급 상태인 Mapbox·GIS와 다른, 명시된 선택).
- **합성 (포커스 + 선택 동시)**: 두 축은 독립이라 동시에 성립한다. 포커스 인디케이터가 선택 강조의 **바깥/위**에 항상 렌더돼 "지금 여기(포커스) + 선택됨"이 둘 다 읽힌다.

값은 `_navigationVocabulary`의 `NAV_FOCUS`·`NAV_SELECTION`(핀은 `NAV_PIN.focusRing`/`selectionRing`)이 단일 소스로 소유하고, Foundation 페이지가 **실제 컴포넌트로 4상태(기본·포커스·선택·포커스+선택)** 를 렌더해 회귀 고정한다. 경로의 base/강조 stroke·casing 폭은 별개 path-stroke 계열(Encoding Tokens)이 소유한다.

## 3. 라벨·카피 규약

- **사용자에게 보이는 라벨은 한국어.** raw enum(`available`·`upcoming`·`caution`)과 내부 id(`lift-a`·`segment-…`)는 props·data attribute·code에만 두고, **화면에 그대로 렌더하지 않는다.** 상태 값은 정의된 한국어 어휘(예: 예정·현재·완료 / 정상·대기·차단·충돌·지연 / 주의·위험)로 매핑해 표시한다.
- **표시 텍스트에 `<code>`를 쓰지 않는다** — code 요소는 식별자/토큰명 전용이다.
- 브랜드·표준·단위(`2D`·`320px`·`L1`) 외 영문 jargon(`pointer-only`·`semantic mirror`)을 한국어 문장에 섞지 않는다.

## 4. 표현 어휘의 단일 소스

Navigation 표현의 값·기하·글리프는 `LDS Robotics/Foundation`의 원자 페이지가 소유한다: Navigation Encoding Tokens·State Badge·Marker Pin·Facility Glyph·Hazard Glyph·Vector Glyph·Codes(그리고 교차영역 Unit Format·Viewer Tokens). **새 표현은 먼저 여기(또는 이 규약)에 정의하고 스토리·컴포넌트가 참조**한다. 스토리가 값·표현을 즉석에서 발명하지 않는다.

## 5. 이 규약이 정리한 위반 (이력)

- semantic mirror 병렬 컨트롤 삭제 — Waypoint 개요 목록, Waypoint 포인터 전용, Lane 포인터 전용.
- 보이는 debug readout → hidden 테스트 훅 또는 삭제 — Regions·Trajectory·Facility·Lane·Route.
- KO/EN enum 카피 → 한국어 — Hazard 캡션, Route 온-맵 세그먼트 라벨, 포인터 전용 지도 라벨.
- `Button`-as-selection-control → LDS `SegmentedControl` — Route 층 전환.
- **합성 앱 씬 → Viewer 페이지 이동** — Route 렌더러 페이지에 있던 `SemanticMirror`(이름 목록 + 6-오버레이 지도 + LayerPanel·SelectionInspector·Legend)를 §1에 따라 `LDS Robotics/Viewer/Navigation Viewer` 합성 페이지로 옮겼다. 이동하며 SelectionInspector 필드의 KO/EN(`keep-out`·`lift-a`·`holding`·`passthrough`·`completed`·`current`·`sample`…)을 한국어 어휘로 정정하고, Route에 남은 좁은 폭 스토리의 "아래 semantic mirror" 참조 카피를 접근성 이름 기준으로 다시 썼다([`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) Phase 5).

## 6. 미결 위반 (규약대로 정리 예정)

- 렌더러 페이지 차원의 미결 위반은 현재 없다. Navigation 렌더러 스토리는 지도 자체에서 pointer-only·접근성 이름 계약을 검증하고, 병렬 컨트롤·선택 리스트·합성 패널은 Viewer 합성 페이지가 소유한다.
- Viewer 합성 페이지의 손수 만든 이름 목록(`SemanticMirrorListItem` 버튼)도 해소됐다: `LayerPanel` 트리 하나(그룹 = 레이어, 자식 행 = 객체)가 이름 목록·선택·표시·잠금을 모두 소유하고, 지도는 `Map2DCanvas` 위에 전폭으로 합성된다. 씬의 모든 표면이 LDS 컴포넌트다.

## 7. 숨은 표현 규약 감사 프로그램 (진행 중)

렌더러가 지도에 그리지만 **어느 Foundation Storybook 페이지에도 먼저 정의되지 않아 소비 페이지에서 갑자기 마주치는** 표현 규약을 전수 조사(2026-07-17)해 별개 규약 **32건**으로 정리했다. 목표는 "정의 없이 튀어나오는" 규약을 Foundation 페이지에서 먼저 보이게 해 검토 가능하게 만드는 것.

**두 가지 처리 결정**
- **깔끔한 드리프트(둘 이상이 같은 의미로 comparable 기하에 쓰는 값) → `_navigationVocabulary`로 단일 토큰 승격**하고 Foundation 페이지가 그 상수를 그대로 렌더(NAV_CURRENT_MARKER 선례). 예: path casing 폭 6/6.5/5, base/강조 stroke 두께.
- **렌더러마다 축·의미가 다른 규칙(복합 상태 오프셋 스택, 포커스 링 기하 등) → 단일 상수로 강제하지 않고**, 규칙 자체를 Foundation 프레임(State Badge·Marker Pin)에 문서화하고 렌더러별 축(웨이포인트 ±8 대각 / 레인 18 접선·32 법선 / 시설 16 수평 / 영역 ±18 수직)을 예시로 병기. `_navigationVocabulary`의 SCOPE RULE(같은 의미·comparable 기하만) 준수.
- **담을 페이지가 없는 계열은 신규 Foundation 페이지 신설**: `Navigation Label Coordination`(라벨 충돌 조정 13규칙), `Navigation Map Stage`(패널 chrome·grid·축척·범례).

**진행(커밋)**
- 즉시 조치 2건: 시설 핀 dead-dash 문서 버그(C27), Route not-allowed 커서 드리프트(C15).
- 시스템 규약 3건을 기존 페이지 프레임으로: 상태→톤(C11, Viewer Tokens), 화면고정 마커(C8)·라벨 우선순위 사다리(C9, Encoding Tokens).
- 남은 우선순위·배치는 감사 콘솔(세션 산출물)이 살아있는 트래커로 유지.
