# Handoff — 품질 갭 감사와 D 트랙 디자인 검수

## 후속 구현 완료 — 2026-07-11

이 핸드오프 이후 승인된 M0~M6 로드맵을 모두 구현했다. 기존의 "다음 작업 우선순위"는 더 이상 미완료 목록이 아니다.

- D 트랙 high 14건 해결, medium 23건·low 10건은 원장에 유지
- 메뉴/포커스 접근성 결함 해결 및 Storybook play 계약 추가
- WDS 패리티, API·토큰·치수·모션·prompt·story 래칫, target-size와 37개 픽셀 회귀 연결
- React 18/19 strict 타입 0 오류, 실제 tarball 설치와 ESM/CJS·서브패스·SSR 검증
- 트리셰이킹 개선: Button 단독 11,379바이트; 원시 JSX/prompt 공개 제거
- `CHANGELOG.md`와 생성형 `docs/DEPRECATIONS.md` 추가

검증에서 `check:fast`는 `check:types`까지 모두 통과한 뒤, 커밋되지 않은 기존 신규 컴포넌트 export 때문에 의도된 clean-tree 게이트인 `check:entry`에서만 멈췄다. 이는 구현 실패가 아니라 이 문서가 처음 기록한 동시 작업의 미커밋 상태와 같은 격리 조건이다. 전체 Storybook/a11y/pack 결과는 아래 최신 검증 결과를 우선한다.

Date: 2026-07-11 (저녁 세션)

Branch: `main` · HEAD: `3ead26d` (이 세션에서 커밋 없음 — 사용자 요청 시에만 커밋)

Worktree: **240건 dirty**. 다른 에이전트의 동시 작업 포함(신규 컴포넌트 11종의 미커밋
export가 src/dist에 존재). AGENTS.md의 동시 작업 규칙(패치 직전 재독, 리셋 금지) 유효.

## 이 세션에서 완료된 작업 (시간순)

### 1. Storybook 분류 체계 정리 — 실행 완료

`docs/handoff/2026-07-11-storybook-taxonomy-cleanup.md`의 실행 핸드오프를 전부 수행했다.

- 결과: 스토리 파일 129→150, 공개 스토리 289→318(총 411), 사이드바가 목표 트리와 일치
  (런타임 검증 완료). `LDS Robotics/Robotics`·`LDS Theme/Theme` 제거, 레이어 누수 6+1건 수정
  (LogViewer의 robotics import → StatusBadge 매핑으로 교체가 유일한 구현 변경),
  Product Data를 Display/Visualization/Collections/Operations로 재편, 소스 판정 분리
  (Tabs/Category, Page Indicator/Pagination, Essential/Divider, Text Button/Icon Button/Toggle Icon 등).
- **목표 트리와의 근거 기반 이탈 1건**: 로컬 .fig 스냅샷의 `7 Feedback`은 Toast/Snackbar/Alert만
  정의 → Avatar는 Content로, Badges and Tags·Notification은 Status로 이동, 빈
  `LDS Core/Components/Feedback` 그룹은 storySort에서 제거.
- 검증: 전체 스위트에서 `check:entry`/`check:generated`만 실패 — **동시 작업의 미커밋
  신규 export 11줄 때문**(분류 작업과 무관, diff로 격리 확인). 그 커밋이 이뤄지면 해소.
- `docs/HANDOFF.md`의 구식 "not-ready" 리스크 섹션도 실제 상태(ready)로 정정함.

### 2. 콜아웃 띠 문법 통일

- ValidationSummary severity 헤딩 띠가 하단에만 톤 외곽선을 갖던 편차를 수정: 이제
  `status-presentation.js`의 공유 `embeddedBandStyle`(상·하단 톤 hairline, 좌우·radius 제거,
  Primer Banner `flush`와 동형 — 소스 CSS로 확인)을 Banner `embedded`와 함께 소비.
- 이중선 방지: 띠와 맞닿는 중립 구분선(헤더 하단선, 그룹 간 구분선)의 소유권을 띠로 이전.
- 검증: computed style 실측(상하 1px 톤, 겹침 0), 빈 상태/320px/embedded Banner 회귀 없음.
- 결정 기록: ValidationSummary.prompt.md, Banner.prompt.md.

### 3. 상태 표면 토큰 소비 경로 단일화 + 별칭 삭제

- Banner·Callout이 `--component-banner-*`/`--component-callout-*` 별칭 대신
  `statusToneStyle`(시맨틱 status 토큰)을 직접 소비하도록 전환.
- **별칭 토큰 27개를 source.json에서 삭제**(사용자 결정: 디자인 시스템이 상류, 소비자가
  시맨틱 토큰을 채택). 생성 component 토큰 48→21, 전체 component 변수 131→104.
- 가드 유지보수: `check-color-contrast.mjs`의 콜아웃 4행을 시맨틱 쌍
  (`status-*-text` vs `status-*-surface`)으로 리타게팅(동일 값이라 수치 불변),
  `check-color-layering.mjs`에 별칭 재도입 차단 규칙 추가.
- 검증: check:colors/tokens/parity 통과, 런타임에서 변수 미정의+시맨틱 정상 렌더 확인.

### 4. 품질 갭 감사 (코드·계약 축) — 완료

- 8개 차원 병렬 갭 분석 + 갭별 반박 검증 → **확정 47건 / 기각 1건**.
- 원장: `docs/references/quality/QUALITY_GAP_AUDIT.json` (증거·검증 판정 전문).
- 계획: `docs/QUALITY_AUDIT_PLAN.md` — P0(기존 가드 CI 연결 3건) → P1(픽셀 diff·API 드리프트
  ·치수 ratchet·토큰 위생) → P2(API 문법·a11y 심도·상태 커버리지) → P3(채택 차단기:
  deps ~130개 오염, 트리셰이킹 실패 ~2.05MB, strict 타입 에러 216개) + D 트랙(디자인 검수).
- 주의: 감사 중 발견된 **실결함** — Menu 계열 `role="menu"` 키보드 상호작용 전무,
  `aria-modal` 선언에 focus trap 없는 오버레이 3종(Alert·Lightbox·CommandPalette). 선행 수정 후보.

### 5. D 트랙 디자인 검수 — **수습 완료**

사용자 지시: "CTA는 예시일 뿐, 전체적인 컨벤션 존중을 보라." 9개 렌즈(액션 배치, 폼,
내비게이션, 오버레이, 상태·피드백, 색·타이포·밀도 미학, UX 라이팅, 아이콘 은유, 데이터 표시)
로 검수하고 발견별로 (증거 실재 / 컨벤션 정당성 / **WDS 계승이면 기각**) 3중 반박 검증하는
워크플로를 실행했다.

수습 결과:

- 원 워크플로 `wf_9e07ae47-b14`는 **9개 렌즈·발견 53건**을 생성하고 판정 28건을 완료한 뒤
  `killed` 상태로 종료됐다. 로컬 Claude CLI 재개는 인증 만료(401)로 불가능했다.
- 완료된 판정 28건은 journal 원문을 그대로 보존했다. 남은 25건은 현재 작업트리의 주장 파일을
  다시 읽고 같은 판정 규칙(증거 실재 / 컨벤션 정당성 / WDS 계승이면 기각)으로 수습했다.
- 최종 결과: **확정 47건 / 기각 6건**. 확정 심각도는 high 14 · medium 23 · low 10.
- 원장: `docs/references/quality/DESIGN_CONVENTION_REVIEW.json`. 각 finding에
  `workflow-verifier` 또는 `manual-recovery-verification` 출처가 기록돼 있다.
- 렌즈별 확정/기각: 액션 배치 5/1 · 폼 6/0 · 내비게이션 5/1 · 오버레이 6/0 ·
  상태·피드백 6/0 · 미학 4/2 · UX 라이팅 5/1 · 아이콘 4/1 · 데이터 표시 6/0.
- WDS 계승, 취향 차이, 서로 다른 역할의 표면 비교, 현재 렌더 차이가 없는 미래 위험은 기각했다.
  내부 비일관은 가장 강한 finding으로 유지했다.

## 검증 상태 스냅샷

- 통과: check:wds-alignment(150 titles) · story-subjects · storybook-public(318/93/82) ·
  a11y(411 스토리, 위반 0) · colors · tokens · parity · contracts · type-surface ·
  consumer · pack · inventory(문서 수치 411/318로 갱신됨).
- 실패(격리됨): check:entry / check:generated — 동시 작업의 미커밋 src/dist 변경 때문.
- storybook-static은 분류 정리 직후 빌드 기준. 이후 ValidationSummary/Banner/Callout 변경은
  dev 프리뷰로 검증했으므로 다음 정적 빌드에서 자연 반영됨.
- D 트랙 원장은 JSON 파싱과 집계 불변식(9렌즈·53검토·47확정·6기각·28원판정·25수습)을
  확인했다. 이번 수습은 문서/JSON만 변경해 저장소 전체 런타임 스위트는 다시 실행하지 않았다.

## 다음 작업 우선순위

1. `docs/QUALITY_AUDIT_PLAN.md`의 P0 3건(반나절): WDS 패리티 가드 4종 CI 연결, play 완료
   게이트, 인벤토리 수치 일치 강화.
2. a11y 실결함 2건 선행 수정(Menu 키보드, 오버레이 focus trap).
3. D 트랙 high 14건을 관련 컴포넌트군별로 범위 승인 후 처리. 공유 토큰값·대량 카피·공개 API는
   Scope Escalation Gate에 따라 별도 커밋으로 분리.
4. P1 회귀망(픽셀 베이스라인은 대량 변경 직후인 지금이 적기) → P2 → P3(채택 차단기).

## 이 세션의 결정 기록 위치

- Feedback 그룹 이동 근거: 각 스토리 docs description + HANDOFF.md.
- 밴드 문법: status-presentation.js 주석 + Banner/ValidationSummary/Callout prompt.
- 토큰 별칭 삭제: Banner/Callout prompt ("제거됨, 소비자는 시맨틱 채택").
- 품질 계획: docs/QUALITY_AUDIT_PLAN.md + references/quality/QUALITY_GAP_AUDIT.json.
- D 트랙 판정: references/quality/DESIGN_CONVENTION_REVIEW.json.
