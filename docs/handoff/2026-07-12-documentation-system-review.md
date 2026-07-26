# Handoff — 문서 체계 평가와 재정비 완료

| Field | Value |
| --- | --- |
| Type | Historical handoff |
| Status | Completed |
| Owner | Design system owner |
| Date | 2026-07-12 |
| Branch | `main` |
| Baseline | `43ac938` |

## 요청과 완료 범위

본격적인 컴포넌트 점검 전에 현재 문서 체계를 평가하고, 신규 컴포넌트 검토 기준을 실제 LK 제품과 icon/asset/map symbol까지 포함하도록 정리했다. 이 handoff 시점에는 **컴포넌트 구현을 수정하거나 시각 finding을 확정하지 않았다**. 후속 검토가 같은 기준으로 재현되도록 문서 authority, 상태, 기준선, 자동 검사를 먼저 고정한 작업이다.

## 문서 체계 평가 결과

기존 문서는 계약, 계획, 감사, handoff가 충분히 축적돼 있었지만 다음 문제가 있었다.

- 공식 탐색 진입점과 source-of-truth 순서가 없어 현재 계약과 과거 snapshot을 구분하기 어려웠다.
- 최상위 문서의 type, status, owner가 일정하지 않아 완료된 계획도 실행 중인 문서처럼 읽혔다.
- 신규 컴포넌트 검토가 구현·Storybook 중심이었고 실제 LK 제품 workflow와 icon/asset/map symbol 적합성은 canonical gate가 아니었다.
- Storybook IA 수치, product coverage, generated register와 Markdown 사이의 drift를 하나의 문서 검사로 막지 못했다.
- `HANDOFF.md`가 장문의 과거 상태를 현재 상태처럼 보유해 날짜별 handoff와 authority가 중복됐다.

평가는 “자료 부족”보다 “authority와 lifecycle 부족”이 핵심 문제라는 결론이다. 따라서 문서를 더 늘리기보다 기존 문서의 역할을 분리하고 자동 검사를 추가했다.

## 적용한 구조

### 공식 진입점과 authority

- [`../README.md`](../README.md)를 `docs/`의 공식 인덱스로 추가했다.
- stable policy/contract, current register, completed plan/audit, evidence/generated data를 구분했다.
- source code와 machine-readable audit을 Markdown snapshot보다 우선하는 source-of-truth 순서를 명시했다.
- 최상위 문서 18개에 `Type`, `Status`, `Owner` metadata를 적용하고 문서당 H1 하나를 원칙으로 고정했다.
- [`../HANDOFF.md`](../HANDOFF.md)는 현재 수치와 최신 상세 handoff를 연결하는 짧은 포인터로 축소했다.

### canonical component review workflow

[`../COMPONENT_WORKFLOW.md`](../COMPONENT_WORKFLOW.md)를 신규 컴포넌트, 대규모 재설계, reusable pattern, icon/asset/map symbol 변경의 정본 절차로 확장했다.

필수 단계는 다음과 같다.

1. 사용자 문제, LDS 분류, sibling·composition·중복 판단
2. 내부 근거와 권위 있는 외부 근거
3. LK Web Viz, LK Control Full Daedeok, LK Context Hub의 실제 source-pinned workflow coverage
4. public API, state, code, accessibility contract
5. icon provenance와 map point/line/polygon, zoom, collision, paint order, 상태 판독성 검토
6. normal/narrow/light/dark와 실제 제품 데이터 밀도의 수동 시각 검토
7. Storybook·문서·검증 증거와 `P0`–`P3` finding 기록

`AGENTS.md`, [`../OPERATING_MODEL.md`](../OPERATING_MODEL.md), root `readme.md`는 이 workflow를 가리키도록 정리해 상세 규칙의 중복 authority를 줄였다.

### 현재성 정리

- Storybook 기준선을 177 pages / 516 stories / 397 public / 119 hidden / 82 visual-parity로 동기화했다.
- [`../DOMAIN_COMPONENT_EXPANSION_PLAN.md`](../DOMAIN_COMPONENT_EXPANSION_PLAN.md)를 completed plan으로, [`../QUALITY_AUDIT_PLAN.md`](../QUALITY_AUDIT_PLAN.md)를 executed baseline과 residual follow-up으로 표시했다.
- [`../ROBOTICS_PATTERNS.md`](../ROBOTICS_PATTERNS.md)의 Communication 계열을 현재 public component 이름으로 갱신했다.
- generated [`../DEPRECATIONS.md`](../DEPRECATIONS.md)에 metadata를 포함하도록 generator도 함께 수정했다.
- `AI_DESIGN_SYSTEM_GUIDE.md`의 중복 H1을 정리했다.

### LK product coverage 확장

[`../PRODUCT_FRONTEND_COVERAGE.md`](../PRODUCT_FRONTEND_COVERAGE.md)와 `references/product-frontends/COVERAGE_AUDIT.json`에 LK Web Viz를 source pin으로 추가했다.

- repository: `LK-ROBOTICS/lk_web_viz`
- pinned revision: `a984def117c05acd213f494cbb8a42e990595505`
- frontend root: `frontend`
- workflow: `WF-15 Map navigation and facility authoring`
- evidence: `MapEditScreen.tsx`, `ZoneEditor.tsx`, `TaskCreateScreen.tsx`
- status: `discovered`

현재 기록은 map editor의 point/line/polygon/landmark 도구와 zone·landmark 종류를 확인한 단계다. LDS 컴포넌트 disposition과 시각 적합성은 **후속 컴포넌트 검토에서 확정**한다.

## 자동 검사

새 `npm run check:docs`는 다음 drift를 차단한다.

- 최상위 문서가 인덱스에 포함됐는지
- `Type`·`Status`·`Owner`와 문서당 H1 하나
- repository-local Markdown link 유효성
- Storybook IA Markdown과 audit JSON 수치 일치
- 완료된 domain plan의 오래된 상태 문구
- current handoff와 root readme의 canonical link
- 세 LK 제품 자산의 product coverage 명시

이 검사는 `check:fast`에도 포함했다. `DEPRECATIONS.md` metadata는 `report-deprecations.mjs`가 재생성해도 유지된다. product coverage guard는 이제 LK Web Viz repository pin을 필수로 검사한다.

## 검증 결과

문서 정리 완료 시점에 다음이 통과했다.

- `npm run build:storybook`
- `npm run check:docs`
- `npm run check:storybook-ia`
- `npm run check:inventory`
- `npm run check:contracts`
- `npm run check:product-frontends`
- `npm run check:deprecations`
- `git diff --check`

`npm run check`도 푸시 전 최종 확인으로 실행했으나 `check:fast`의 `check:api-drift`에서 중단됐다. 문서 변경이나 `check:docs` 실패가 아니라 후속 검토 대상인 오늘 추가 component의 기존 public-contract drift다.

- Communication: `ConversationMessage`, `MessageFeed`, `VirtualKeypad`의 일부 public prop에 JSDoc 설명이 없음
- Robotics Navigation: shared `NavigationSvgFeatureProps`에서 상속한 `viewportScale`, `selected`, `focused`, `invalid`, `stale`, `showLabel`을 drift checker가 concrete type에서 찾지 못함
- `RouteOverlay.selectedSegmentId`에 JSDoc 설명이 없음

문서 정리만 마친 뒤 push하라는 범위를 지키기 위해 이 component/type 문제는 수정하지 않았다. 전체 gate 재실행은 후속 컴포넌트 점검의 첫 코드 보완 항목이다. 실패한 build가 갱신한 `dist/*.map`은 작업 범위에 포함하지 않고 원상 복구했다.

기준 수치:

- documentation: 18 indexed top-level docs
- Storybook IA: 177 pages / 516 stories
- product coverage: 6 repositories / 15 workflows (`discovered=1`, `verified=14`)
- component dispositions: 50

## 후속 작업 진입점

다음 세션은 문서 구조를 다시 설계하지 않고 [`../COMPONENT_WORKFLOW.md`](../COMPONENT_WORKFLOW.md)의 체크리스트를 그대로 실행한다.

1. 오늘 추가된 Robotics Navigation 6개를 먼저 코드·Storybook·제품 workflow·map symbol 관점으로 검토한다.
2. 특히 elevator/lift, door, dock, waypoint, lane, route, trajectory, region의 point/line/polygon 문법과 zoom·collision·label density를 비교한다.
3. `WF-15`의 Web Viz 구현을 `supported`, `supported by composition`, `gap`, `not applicable`로 component별 판정한다.
4. 이어서 Communication 3개, Forms 2개, Data 7개, Layout 3개를 같은 방식으로 검토한다.
5. finding을 먼저 기록하고 사용자 승인 범위에서 보완한 뒤 표적 검사와 최종 전체 gate를 실행한다.

후속 검토 전제: 이 handoff의 제품 근거는 검토 출발점이지 현재 시각 디자인의 승인 근거가 아니다. 기존 제품이 같은 elevator glyph를 재사용하더라도 LDS가 의미 구분 없이 복제해야 한다는 뜻이 아니다.
