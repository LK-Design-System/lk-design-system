# 벤치마크 검토 — LDS ↔ shadcn/ui

| Field | Value |
| --- | --- |
| Type | External benchmark note (non-normative) |
| Status | Reference |
| Last reviewed | 2026-07-22 |
| Interactive summary | Artifact: LDS ↔ shadcn 벤치마크 비교 (claude.ai artifact) |

shadcn/ui를 거울삼아 LDS의 표면·API·시각 언어를 점검한 기록이다. shadcn을 따라가려는 것이 아니라, 무엇을 선별해 흡수할지 판단하기 위한 참고 자료다. LDS 계약의 정본은 루트 `DESIGN.md`와 `docs/COMPONENT_API_STATE_MATRIX.md`이며 이 문서는 이를 대체하지 않는다.

## 조사 근거

- LDS: `components/`(173 공개 컴포넌트 + robotics-ui 34 도메인 표면), `docs/COMPONENT_API_STATE_MATRIX.md`, `tokens/`(atomic 176 → semantic 112 → component 21).
- shadcn: 공개 문서(components·theming·blocks), 64개 프리미티브, base/radix 두 변형.

## 다섯 축 요약

| 축 | LDS | shadcn |
| --- | --- | --- |
| 스코프 | 173 + 도메인 34, 운영 대시보드까지 | 64 범용 프리미티브, 도메인 없음 |
| 조합 API | 단일 프롭 객체 · slot/items 배열 (닫힘) | 컴파운드 파트 `Dialog.Trigger…` (열림) |
| 폴리모피즘 | 목적 특화 훅 `as`·`renderLink` | 범용 `asChild`(Radix)·`render`(Base) |
| variant/강제 | 어휘 넓음(Button ×8), CI 래칫으로 정규화 강제 | 어휘 좁음(×6), 관례에 위임 |
| 토큰 | 3계층 생성형, atomic 봉인, Figma 왕복 | 1계층 oklch bg/fg 쌍, `.dark` 스왑 |
| 배포 | npm 패키지, import 소비, versioned | 소스 복사(Open Code), 소비자 소유 |

## 판정

**LDS가 앞선 것** — 접근성이 프롭 계약으로 강제됨(`label` 필수, focus contract), API 문법 CI 래칫, 3계층 토큰 거버넌스, 상태 매트릭스 기반 완결성 강제. 여러 제품이 한 목소리를 내야 하는 산업 운영 표면에서 개방 모델이 줄 수 없는 값이다.

**shadcn을 거울로 본 기회** — 이번 세션에서 실제로 겪은 마찰과 연결된다.
1. **복잡 컴포넌트의 선택적 컴파운드 슬롯** — Modal·DropdownMenu가 단일 프롭이라 파트 재배치가 어렵다. Dashboard Navigation의 탑바 토글을 fixture로 수동 조합해야 했던 것이 신호.
2. **variant 이름 ↔ 시각 정합** — `ghost`가 이름과 달리 hairline을 그려 무테두리가 필요할 때 `plain`으로 우회. `flat`·`ghost`·`plain` 경계 재점검 여지.
3. **`data-slot` 타게팅 표면** — 부모가 자식 파트를 안정적으로 겨냥. LDS는 `lk-iconbtn--ghost` 같은 클래스명 의존.

## 결론

두 시스템은 경쟁이 아니라 다른 목표의 최적해다. 방향은 모방이 아니라 **거버넌스를 유지한 채 개방성 이점만 선별 흡수**하는 것. 이번 세션에서 shadcn을 참조한 세 판단(토글 배치·plain variant·간격 보정)이 모두 실질 개선으로 이어진 것이 그 근거다.

## 컴포넌트 커버리지 감사 (64개 1:1 점검)

shadcn 64개 컴포넌트를 각각 LDS 대응과 비교(독립 감사 64 + 적대적 검증 19, 오탐 0). 집계: **결함 1 · 누락 1 · 뒤떨어짐 17 · 동등 25 · LDS 우위 20**. 64개 중 45개(70%)가 동등 이상. 시각 언어 차이(색·radius·밀도·API 스타일)는 의도된 선택이라 판정에서 제외.

### 실제 조치 후보

- **[결함·medium] Collapsible · Accordion — 접힌 콘텐츠 접근성**: 접힌 본문이 `overflow:hidden`로 시각만 숨겨지고 DOM·a11y 트리·탭 순서에 잔존, 트리거에 `aria-controls` 미연결 → `aria-expanded=false`와 모순. 두 컴포넌트 공유. **조치**: 접힌 상태 `hidden`/`inert` + `aria-controls`/`id` 연결. (오늘 세션과 무관한 기존 결함)
- **[패턴·behind ×3] 중첩 서브메뉴 부재 — DropdownMenu · Menubar · Context Menu**: `items[]` flat이라 `Sub/SubTrigger/SubContent` 계층 메뉴 표현 불가. Context Menu는 우클릭/롱프레스 트리거도 부재.
- **[behind·medium] Calendar**: disabled(예약 불가) 날짜 상태 없음 — prompt/stories가 명시한 "예약 가능일·현장 실사 일정" 사용처 미충족. range/multiple/월·년 드롭다운/다중월도 없음.
- **[behind·medium] Field · Command**: fieldset/legend/group(Field), group/separator 섹션 헤딩(Command) 부재 — single-prop API의 그룹 구조 표현 한계.
- **[behind·medium ×2] Carousel · Resizable**: 스와이프·터치·세로·a11y(Carousel), N패널·세로 리사이즈(Resizable) 부재.
- **[누락·medium] Direction**: 앱 전역 RTL 텍스트 방향 컨텍스트/`useDirection` 없음. (RTL 시장 미겨냥 시 우선순위 낮음)

### 나머지 뒤떨어짐 (low)

Accordion(disabled·a11y), Attachment(이미지 썸네일·수평), Breadcrumb(ellipsis), Date Picker(월/년 드롭다운·타이핑), Dropdown Menu(서브메뉴·섹션 + 스크롤 하이라이트 클리핑), Kbd(KbdGroup), Menubar(서브메뉴·섹션 라벨), Navigation Menu(메가메뉴 콘텐츠), Slider(세로·N노브·range disabled), Sonner(top-center·promise 상태), Typography(.prose 통합 렌더러).

### 뿌리 원인

대부분의 뒤떨어짐은 "단일 프롭 객체 API가 중첩·그룹 구조를 표현 못 한다"는 한 뿌리 — 메뉴 서브아이템·필드셋·커맨드 그룹을 배열 그룹으로 여는 결정 하나가 여러 컴포넌트를 동시에 끌어올린다.

### 후속

- 시각 언어 대조(색·radius·elevation·테두리·타이포·밀도)는 별도 시각 검토 문서(Artifact)로 진행.
- 상세 감사 대시보드: Artifact "LDS ↔ shadcn 커버리지 점검".
