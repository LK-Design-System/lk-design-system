# 디자인 시스템 완성도 검사 계획

| Field | Value |
| --- | --- |
| Type | Executed audit plan and follow-up register |
| Status | Baseline completed · residual findings remain |
| Owner | Design system owner · Component owners |
| Last reviewed | 2026-07-12 |
| Evidence | `references/quality/` baselines and audit JSON |

이 문서의 M0–M6 및 D-track 실행 기록은 2026-07-11~12 baseline의 historical evidence다. 현재 신규 컴포넌트 검토 절차는 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md), 현재 수치와 gate 상태는 각 verifier와 [`HANDOFF.md`](HANDOFF.md)를 우선한다.

## 구현 상태 — 2026-07-11

승인된 M0~M6 로드맵을 모두 구현했다. 핵심 결과는 다음과 같다.

- WDS 패리티·play 수명주기·접근성·타깃 크기·픽셀 회귀가 `npm run check`에 연결됐다.
- 메뉴 키보드 계약과 모달 포커스 트랩을 공용화했고, D 트랙 high 14건을 모두 수정했다.
- API/치수/토큰/모션/prompt/story 품질은 명시적 기준선으로 동결되어 신규 회귀를 차단한다.
- React 18/19 strict 소비자 타입, 실제 tarball 설치, ESM/CJS, 컴파일된 서브패스, SSR을 검증한다.
- Button 단독 번들은 약 2.05MB에서 11,379바이트로 감소했고, 개별 SVG는 50KB 상한을 적용한다.
- 37개 대표 스토리의 normal/dark/narrow 픽셀 기준선을 유지한다.

상세 구현 증거는 `references/quality/QUALITY_GAP_AUDIT.json`의 `source.implementation`, D 트랙 해결 상태는 `references/quality/DESIGN_CONVENTION_REVIEW.json`의 finding별 `remediation`에 기록했다. medium 23건과 low 10건은 삭제하지 않고 후속 개선 원장으로 유지한다.

### 추가 하드닝 상태 — 2026-07-12

완료로 기록됐던 패밀리 안정화를 독립 재감사한 결과, 기존 전체 검증이 놓친 P1·P2 잔여 계약을
추가로 닫았다.

- 선택·입력: Select 비활성 옵션 탐색·선택 차단과 잠금 전환, SegmentedControl·ButtonGroup의
  32/40/48px 외곽 치수, 비활성 선택 상태의 중립 표현을 통일했다.
- 메뉴·오버레이: 빈 메뉴와 전체 비활성 메뉴의 Escape/초점 복원, SplitButton·Menubar의 협폭
  flip/clamp, DropdownMenu의 실제 action footer 및 Tab 순환, HoverCard의 `style`/`panelStyle`
  경계를 보강했다.
- 상태: ResourceState와 ViewerFrame에서 콘텐츠가 차단되는 오류·연결 끊김만
  `alert`/`assertive`, 보존 데이터가 있는 상태는 `status`/`polite`로 통일했다.
- 계층·증거: ButtonGroup과 SplitButton을 `LDS Product/Action` 확장으로 재분류하고 WDS 직접
  증거·커버리지·variant 원장을 새 공개 경로에 맞췄다.

관련 타입·API·prompt·계약·공개 Storybook·스토리 커버리지·WDS 정합성 표적 검사는 통과했다.
대표 Storybook 화면에서도 320px overflow, 메뉴 키보드/초점, live-region 긴급도를 확인했다.
단, 사용자 요청에 따라 이 턴에는 static Storybook 재빌드, IA 원장 재생성·검토 승격,
`npm run check` 전체 실행을 하지 않았다. 이 세 항목은 다음 턴의 단일 최종 체크포인트이며,
완료 전에는 이번 하드닝을 전체 검증 완료로 간주하지 않는다.

아래 P0–P3 서술은 2026-07-11 원 감사 시점의 문제 정의이며, 위 구현 상태와 추가 하드닝 기록이
현재 진행 상태다.

작성: 2026-07-11. 근거: 8개 차원 병렬 갭 분석(가드 인벤토리 / API 문법 / 스토리·상태 커버리지 /
토큰 위생 / 접근성 심도 / 문서 완성도 / 시각 일관성 / 소비자 DX), 갭별 반박 검증을 통과한
확정 갭 47건. **갭별 상세 증거·검증 판정 전문은
[references/quality/QUALITY_GAP_AUDIT.json](references/quality/QUALITY_GAP_AUDIT.json) 원장에
보존한다.** 아래는 실행 순서로 재구성한 검사 계획이다.

범위 한계: 이 분석은 코드·계약 품질 축이다. **디자인 판단 축(패턴 컨벤션, 미적 선택)은
포함되지 않았으며 별도 검수로 계획한다** — 아래 "D — 디자인 검수" 절 참조.

핵심 진단: 현재 가드 파이프라인(~30종)은 **구조·이름·원장 일관성·기본 렌더**는 촘촘하게
검증하지만, **픽셀 회귀 · 치수 패리티 회귀 · API 계약 일치 · 상호작용 완료 · 소비자 관점
컴파일**은 게이트하지 않는다. 패리티는 "달성"이 아니라 "유지"가 문제인데 유지 가드가
꺼져 있거나 없다.

## P0 — 이미 있는 무기를 켠다 (스크립트 신설 없음, 즉시)

1. **WDS 실측 패리티 가드 4종 CI 연결** — `check:foundation-parity`,
   `check:component-styles(-rendered)`, `check:nested-styles`가 `--check` 모드까지 갖추고도
   `npm run check`·CI 어디에도 없다. 값 단위 diff를 하는 가장 강한 패리티 가드가 수동 전용.
   정적 2종은 `check:fast`에, Playwright 필요 2종은 `check:storybook`에 편입.
   (현재 0 drift라 편입 즉시 CI가 깨지지 않음을 확인함.)
2. **play 완료 게이트** — 110개 play 함수가 사실상의 상호작용 테스트인데 완료를 기다리는
   게이트가 없고, a11y 가드는 play 완료를 기다리지 않고 axe를 실행한다. a11y 러너에서
   play 완료(실패 포함)를 대기·수집하도록 확장.
3. **인벤토리 수치 가드 강화** — 존재 검사만 해서 낡은 수치가 통과(readme에 stale 수치
   실존). 문서의 수치가 실측과 "일치"하는지로 강화.

## P1 — 회귀 방지망 신설 (자동 가드, 대량 변경 직후인 지금이 기준선 고정 적기)

4. **픽셀 베이스라인 diff** — capture-visual-smoke가 27개 스토리를 캡처해 sha256을 기록만
   하고 아무것도 비교하지 않는다. 기준선을 커밋하고 pixelmatch 임계값 diff로 게이트.
   기준선은 CI(Linux) 생성으로 통일(크로스 플랫폼 폰트 차이 때문에 해시 일치 방식 불가).
   **다크 모드 캡처 포함** — 다크 토큰 계층은 완비인데 렌더 검증 스토리는 1개뿐.
5. **API 드리프트 가드(`check:api-drift`)** — `checkJs:false`라 .jsx는 타입체크 제외,
   type-surface는 export 이름 존재만 확인, .prompt.md를 검증하는 가드는 0개. react-docgen
   (이미 설치됨)으로 .jsx prop을 추출해 .d.ts 선언·.prompt.md 언급과 이름 단위 대조.
   HTMLAttributes 상속 prop 허용목록 필요.
6. **치수 리터럴 ratchet** — 토큰 드리프트 가드가 색·그림자만 검출. `gap:'11px'`,
   `padding:'22px 24px'` 같은 스케일 밖 px가 무방비. 4/8 배수 스케일 검사로 시작, 기존
   위반은 예외 원장에 등재 후 신규 유입만 차단.
7. **토큰 위생 가드** — (a) components.css의 `--component-*` 225개 중 121개가 source.json
   미등록, (b) 아무 데서도 참조되지 않는 토큰 296개, (c) semantic 계층의 atomic 램프 단절
   (hex 중복 109건, 램프 밖 값 66건), (d) source.json ref와 실제 값이 모순되는 죽은 계보
   ~26건. 등록·참조·계보를 각각 검사.

## P2 — 계약 감사 (반자동: 감사 → 결정 → 가드화)

8. **API 문법 통일 감사** — size 스케일 어휘 4계열 공존, status tone 어휘 3계열 잔존,
   onChange 페이로드 시그니처 분열(값 우선 vs 이벤트 우선), 접근 이름 prop 4표기
   (label/ariaLabel/'aria-label'/accessibleLabel), controlled 트라이어드 불완전.
   → 표준 문법 결정 후 어휘 가드로 고정. (공개 API 변경이므로 P3의 버저닝과 함께 결정.)
9. **접근성 심도 감사** — 갭이자 결함: Menu 계열이 `role="menu"` 선언에 키보드 상호작용
   전무, `aria-modal` 선언에 focus trap 없는 오버레이 3종(Alert·Lightbox·CommandPalette),
   Tabs·Wizard·Tree·DataGrid의 키보드 계약 커버리지 편차, reduced-motion 처리 7개 파일뿐,
   live-region 정책 불일치(같은 error가 alert/status/assertive 제각각), 터치 타깃 무검사
   (axe target-size 미포함, 8px 컨트롤 실존). → 결함 수정 + 키보드 계약 play 전수화 +
   reduced-motion/target-size 가드.
10. **상태 스토리 커버리지 게이트** — play 없는 스토리 파일 105/150(70%), disabled prop이
    있는데 스토리 증거 0인 컴포넌트 18개(loading 4, empty 2), 공개 export 194개 중 97개에
    visual-parity 카드 없음, 320px 협폭 스토리는 최근 세대 36개 파일에만. → prop↔스토리
    대조 가드(react-docgen 재사용) + 커버리지 맵 리포트.
11. **패턴 델타 감사** — 같은 "패널 헤더/툴바/리스트 행"이 컴포넌트마다 다르게 구현.
    embeddedBandStyle 방식(공유 프리미티브 승격)의 반복 적용 후보 목록화.
12. **문서 최소 계약** — prompt.md 70개(36%)가 설명+예시뿐인 bare 문서, 사용 예시 코드
    무검증, Storybook 경로 참조 무가드(분류 개편 직후라 시급), 컴포넌트 추가 체크리스트에
    prompt 단계 부재. → prompt 필수 섹션 정의 + 구조 가드 + 경로 링크 가드.

## P3 — 채택 준비 (제품 프론트엔드 5곳 채택 전 필수)

13. **패키징 결함 수정 + 게이트** — 런타임 dependencies에 개발 도구 ~130개 커밋(비Windows
    설치 불가), Button 하나 import에 ~2.05MB 잔존(트리셰이킹 실패), strict React 19
    소비자에서 216개 타입 에러. → deps 정리, sideEffects/exports 정비, 소비자 관점 tsc
    게이트 신설.
14. **소비 매트릭스 확장** — 현재 스모크는 Vite8+React19+ESM+CSR 단일 조합.
    tarball 설치·React 18·Next SSR 조합 추가.
15. **릴리스 계약 실물화** — OPERATING_MODEL이 규정한 changelog·migration guide·버전
    갱신이 실물 0건. 버전 범프·체인지로그 항목 존재를 릴리스 가드로 강제.

## D — 디자인 검수 (코드 감사가 다루지 못한 축, 별도 트랙)

위 P0~P3은 "계약이 지켜지는가"를 검사한다. 아래는 "계약 자체가 좋은 디자인인가"를
검수하는 축으로, 자동 가드가 아니라 **렌더된 화면을 보고 판단하는 반자동 검수**다.
AGENTS.md의 외부 레퍼런스 의무·Composed UI Visual Hierarchy Gate를 검수 프로토콜로 사용한다.

### 실행 결과 (2026-07-11)

- 원장: [`references/quality/DESIGN_CONVENTION_REVIEW.json`](references/quality/DESIGN_CONVENTION_REVIEW.json)
- 9개 렌즈에서 53건을 검토해 **47건 확정 / 6건 기각**했다. 확정 건의 심각도는
  high 14 · medium 23 · low 10이다.
- 원 워크플로 `wf_9e07ae47-b14`는 렌즈 리뷰 9건과 판정 28건을 완료한 뒤 종료됐다.
  완료 판정 28건은 그대로 보존하고, 남은 25건은 현재 작업트리의 관련 파일을 다시 읽어
  동일한 `증거 실재 / 컨벤션 정당성 / WDS 계승 여부` 규칙으로 수습 판정했다.
- 렌즈별 확정/기각: 액션 배치 5/1 · 폼 6/0 · 내비게이션 5/1 · 오버레이 6/0 ·
  상태·피드백 6/0 · 미학 4/2 · UX 라이팅 5/1 · 아이콘 4/1 · 데이터 표시 6/0.
- 기각 원칙은 원장에 보존했다. WDS 계승, 권위 시스템 간 합의가 없는 취향 차이, 서로 다른
  역할의 표면을 같은 역할로 본 비교, 현재 렌더 차이가 없는 미래 드리프트 위험은 D finding으로
  확정하지 않았다.
- 이 원장은 수정 승인 목록이 아니다. 47건을 실제로 고칠 때는 Scope Escalation Gate에 따라
  관련 컴포넌트군, 공유 토큰, 공개 API, 대량 카피 변경의 범위를 나눠 승인·구현한다.
- 2026-07-12 도메인 확장(Navigation · Communication · Virtual Keypad)의 별도 실화면 감사는
  [`references/quality/DOMAIN_EXPANSION_VISUAL_AUDIT.md`](references/quality/DOMAIN_EXPANSION_VISUAL_AUDIT.md)에
  기록했다. 신규 9페이지 46스토리를 LDS 형제와 권위 동종 UI에 대조해 high 3 · medium 5건을 확정했으며,
  이 결과 역시 수정 승인과 분리한다.

- **D1. 액션 배치 컨벤션** — CTA(primary 액션)의 위치·정렬·순서가 표면 유형별로 일관적인가:
  다이얼로그 footer(확인 우측? 좌측?), ActionArea, 폼 제출부, 카드 액션, 토큰바 actions 슬롯,
  Wizard 이전/다음. 표면별 현재 구현을 스크린샷으로 수집 → 컨벤션 표 작성 → 편차 판정 →
  결정을 prompt/가드로 고정.
- **D2. 색 선택의 미적·의미적 적합성** — 대비(P0에서 수치 검사)와 별개로: 상태색 4종의
  채도·명도 균형이 한 팔레트로 읽히는가, 다크 모드에서 톤이 뒤집히지 않는가, accent 색
  사용처가 의미 없이 장식적이지 않은가, LK 브랜드 색과 시맨틱 색의 긴장 관계.
- **D3. 타이포 리듬과 위계** — 실제 페이지 조합(대시보드 셸 + 카드 + 표)에서 제목/본문/캡션
  단계가 위계로 읽히는가, 한글 줄간·자간의 가독성, 숫자 정렬(tabular-nums) 일관성.
- **D4. 밀도와 여백 리듬** — 같은 밀도 등급(sm/컴팩트)이 컴포넌트마다 같은 밀도로 느껴지는가,
  패널 내부 패딩 리듬, 카드-내-카드 이펙트.
- **D5. UX 라이팅** — 빈 상태·오류·확인 문구의 톤 일관성(합쇼체/해요체), 버튼 레이블 문법
  (동사형 vs 명사형), 마침표 정책.
- **D6. 아이콘 은유 적합성** — 같은 의미에 같은 아이콘이 쓰이는가(예: 설정/편집/삭제),
  로보틱스 확장 아이콘의 시각적 무게가 기본 세트와 어울리는가.

방법: 대표 조합 화면(정상/좁은 폭/다크)을 스토리별로 캡처 → 축별 검수 시트 작성 →
외부 레퍼런스(WDS 원본 + 권위 시스템 2종) 대조 → 판정을 결정 기록으로 남기고, 고정
가능한 것(D1 배치 규칙, D5 문구 사전, D6 아이콘 사전)은 가드로 승격.

## 감사 원장 주의 (분석 중 확인된 구조적 한계)

- 감사 JSON의 자기일관성 검증(카운트·참조 존재)은 **사실성 검증이 아니다** — 순환 증거
  구조가 있으므로, P1·P2 가드가 실측 기반으로 이를 보완하는 것이 이 계획의 목적이다.
- check-avatar-duplicates는 story-subject 가드 규칙 1의 특수 사례로 중복(통합 후보).

## 실행 순서 요지

P0(연결만) → P1(기준선 고정: 지금 대량 변경 직후가 적기) → P2(감사·결정·가드화, API 변경은
버저닝과 동시 결정) → P3(채택 차단기 해소). P2-9의 접근성 결함(Menu 키보드, focus trap)은
감사를 기다리지 말고 결함 수정으로 선행 가능.
