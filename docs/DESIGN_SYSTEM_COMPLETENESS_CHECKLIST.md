# 디자인 시스템 현재 완성도 점검표

| Field | Value |
| --- | --- |
| Type | Current audit checklist and readiness register |
| Status | Current |
| Owner | Design system owner · Frontend platform · Component owners |
| Last reviewed | 2026-07-24 |
| Reviewed revision | current `main`; final release evidence is the same-revision GitHub Actions CI |
| Refresh | release 후보, public contract 변경, product source pin 변경 시 |
| Source | 현재 코드, verifier, current register, machine-readable audit JSON |

이 문서는 LK Design System의 현재 완성도를 같은 기준으로 반복 판정하기 위한 실행용
점검표다. 개별 컴포넌트의 신규·재설계 절차는
[`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md), 릴리스 절차는
[`OPERATING_MODEL.md`](OPERATING_MODEL.md), 상세 row와 hash는 각 audit JSON을 우선한다.

완성도를 하나의 백분율로 합산하지 않는다. 자동화된 코어가 안정적이어도 제품 workflow,
사람이 보는 디자인 품질, 원격 반영이 열려 있을 수 있기 때문이다.

## 판정 규칙

| 판정 | 기준 |
| --- | --- |
| 완료 | 현재 source와 직접 연결된 증거가 있고 관련 verifier 또는 수동 검토가 통과했다. |
| 부분 | 사용 가능한 기준선은 있으나 명시적인 gap, 미처리 finding, 또는 제한된 범위가 남았다. |
| 미완료 | 필수 계약이나 증거가 없거나 검사가 실패했다. |
| 재검증 필요 | source, pin, snapshot, 또는 구현이 증거 작성 뒤 바뀌어 현재성을 증명하지 못한다. |
| 해당 없음 | 이번 release 또는 component 범위에 적용되지 않으며 그 이유가 기록됐다. |

다음 조건 중 하나라도 있으면 `코어 운영 가능`으로 판정하지 않는다.

- 미해결 `P0` 또는 코어 사용을 막는 `P1` finding이 있다.
- 현재 revision에서 `npm run check`가 실패하거나 실행 증거가 없다.
- public API, token, accessibility contract가 구현·타입·문서 중 하나와 불일치한다.
- WDS source snapshot이 바뀌었는데 parity audit을 갱신하지 않았다.

`전체 제품 적용 완결`은 별도 판정이다. 코어 운영 조건에 더해 범위에 포함된 canonical
workflow가 모두 `verified`이고, `separate-audit` 항목이 완료되거나 제품 소유로 명시적으로
제외돼야 한다. `릴리스 반영 완료`는 다시 별도로 Git clean 상태와 원격 parity까지 요구한다.

## 2026-07-24 현재 판정

**종합: 코어 release-candidate 안정화 완료. 제품 workflow 계약과 사람 중심 디자인
finding은 닫혔다. 다만 여섯 pinned product는 LDS를 아직 소비하지 않으므로 실제 제품 채택
완료와 compatibility facade 종료는 별도 후속 단계다.**

| 축 | 현재 판정 | 직접 근거 | 남은 조건 |
| --- | --- | --- | --- |
| 거버넌스·문서 체계 | 완료 | [`README.md`](README.md), [`OPERATING_MODEL.md`](OPERATING_MODEL.md), `check:docs` | 정책 변경 시 metadata와 index 동시 갱신 |
| WDS parity | 완료(수락 snapshot 기준) | `references/wds/COVERAGE_COMPLETION_GATE.json`, `check:wds-alignment`, `check:wds-local-fig` | upstream WDS 변경 시 `.fig` 재수락·재감사 |
| Foundation 지침 완성도 | 완료 | [`foundations/README.md`](foundations/README.md), [`FOUNDATION_GUIDANCE_REVIEW.json`](references/quality/FOUNDATION_GUIDANCE_REVIEW.json), `check:foundations`, `check:a11y` | canonical source 변경 시 문서·Storybook·LLM bundle 동시 재생성 |
| 컴포넌트 지침 완성도 | 완료 | 179 entry / 182 export / 148 decision guide, [`components/README.md`](components/README.md), [`COMPONENT_GUIDANCE_REVIEW.json`](references/quality/COMPONENT_GUIDANCE_REVIEW.json), `check:components` | prompt·type·story·token 변경 시 registry·Markdown·LLM bundle 동시 재생성 |
| 컴포넌트·API·상태 계약 | 완료 | 179 source entry / 182 named export, [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md) | 신규 변경마다 drift/state evidence 유지 |
| Storybook·접근성·시각 회귀 | 완료 | 167 pages / 532 stories / 381 public / 151 hidden / 79 visual-parity | story·baseline 변경 시 Windows canonical gate 재실행 |
| 패키지·소비자 계약 | 완료(RC) | Core/Theme/Product/compat workspace artifact, external Robotics RC, Windows/Linux package consumer matrix | stable publish·지원 정책 변경 시 재판정 |
| 사람 중심 디자인 품질 | 완료 | high 14·medium 20·low 7 해결, medium 3·low 3 근거 수락, tracked 0 | 새 finding 발생 시 remediation 원장 갱신 |
| 제품 workflow coverage | 완료(계약 범위) | 16/16 `verified`; WF-15·WF-16 boundary/evidence 종결 | 실제 제품 adoption은 제품 owner별 별도 검증 |
| Robotics editor 계열 | 완료(별도 audit 범위) | 외부 Robotics surface와 [`EDITOR_LAYOUT_AUDIT.md`](EDITOR_LAYOUT_AUDIT.md) | 외부 package contract 변경 시 재감사 |
| Git·원격 릴리스 반영 | 완료 조건부 | same-revision Windows/Linux CI와 `origin/main` parity | 각 변경 push 뒤 CI·0/0을 다시 확인 |

위 수치는 [`REPOSITORY_INVENTORY.md`](REPOSITORY_INVENTORY.md),
`references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`,
`references/product-frontends/COVERAGE_AUDIT.json`의 현재 값과 일치해야 한다.
접근성 원장은 532개 implementation story, 296개 play function, Axe violation 0과
39개 ratcheted undersized-target signature를 기록한다. 이 39개는 신규 회귀가 아니라
명시적 기준선이며 신규 signature는 gate가 차단한다. package readiness와 제품 채택은
같은 판정으로 합치지 않는다.

## A. 범위·거버넌스·source of truth

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| A-01 | 패키지 책임과 비목표 | LDS가 component contract를 소유하고 app route, backend policy, transport, 완성 화면은 제품에 남긴다. | [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md), [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) | 완료 |
| A-02 | 분류 | 모든 public export와 신규 변경을 WDS Core, LK Theme Override, LK Product Extension, LK Robotics Extension 중 하나로 분류한다. | `references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`, `check:wds-alignment` | 완료 |
| A-03 | ownership | foundation, component, domain, tooling, docs의 owner 역할과 승인 경로가 있다. | [`OPERATING_MODEL.md`](OPERATING_MODEL.md) | 완료 |
| A-04 | 문서 source 순서 | 코드 → machine audit → stable contract → current register → historical snapshot 순서가 명시되고 index에서 탐색된다. | [`README.md`](README.md), `npm run check:docs` | 완료 |
| A-05 | 변경·릴리스 정책 | patch/minor/deprecated/breaking 분류와 migration 조건, deprecation 정책이 있다. | [`OPERATING_MODEL.md`](OPERATING_MODEL.md), [`DEPRECATIONS.md`](DEPRECATIONS.md), `check:publish-policy`, `check:deprecations` | 완료 |

## B. Foundation·token·WDS parity

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| B-01 | token 단일 계보 | token source, CSS, component token 참조가 일치하고 신규 literal·dead lineage 회귀가 차단된다. | `tokens/source.json`, `check:tokens`, `check:token-hygiene`, `check:dimension-literals` | 완료 |
| B-02 | light/dark 의미 계층 | foreground, surface, border, state token이 theme scope를 따르고 필수 대비 계약을 통과한다. | `check:colors`, `check:visual-token-drift` | 완료 |
| B-03 | foundation 실측 parity | color, typography, spacing, grid, radius, shadow 등 WDS foundation mapping에 drift가 없다. | `check:foundation-parity`, `references/wds/FOUNDATION_AUDIT.json` | 완료 |
| B-04 | Foundation 지침 완성도 | 15개 영역마다 목적·semantic model·선택·정량·Do/Don't·예외·접근성·국제화·LDS 예시·token/API와 machine reference가 있다. 값 parity와 별도로 판정한다. | [`foundations/foundation-content.json`](foundations/foundation-content.json), [`references/quality/FOUNDATION_GUIDANCE_REVIEW.json`](references/quality/FOUNDATION_GUIDANCE_REVIEW.json), `check:foundations`, `check:a11y` | 완료 |
| B-05 | component WDS 근거 | coverage, component family, variant, node queue가 수락된 `.fig` snapshot에 대해 닫혀 있다. | `references/wds/COVERAGE_COMPLETION_GATE.json`, `check:wds-local-fig`, `check:wds-alignment` | 완료 |
| B-06 | snapshot freshness | upstream WDS 변경 여부를 확인하고 바뀌었으면 `.fig` 추출과 영향 row 재감사를 수행한다. | `COVERAGE_COMPLETION_GATE.json.snapshotAcceptance` | 완료(2026-07-07 snapshot 기준) |

## C. 컴포넌트·API·상태 계약

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| C-01 | 구현·타입·export 정합성 | component implementation, `.d.ts`, generated entry, public named export 수가 일치한다. | `npm run check:inventory`, `check:type-surface`, `check:entry`, `check:generated` | 완료 |
| C-02 | API grammar | size, tone, controlled state, accessible name, callback payload가 family 문법과 일치한다. | `check:api-drift`, `check:api-grammar`, [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md) | 완료 |
| C-03 | 상태 완결성 | 적용 가능한 default, hover, focus, active, selected, disabled, loading, empty, error, stale, invalid 상태가 타입·코드·story에 연결된다. | `check:contracts`, `check:story-coverage` | 완료 |
| C-04 | component prompt | 분류, sibling, 외부 근거, 제품 boundary, 접근성, 의도적 차이가 prompt 계약에 기록된다. | `check:prompt-contracts` | 완료 |
| C-05 | 중복·책임 경계 | 기존 component 확장·composition을 먼저 검토하고 동일 public 책임이 중복되지 않는다. | `check:story-subjects`, `check:avatar-duplicates`, product disposition audit | 완료 |
| C-06 | 시각 문법 | sibling 대비 control/icon size, spacing, typography, radius, divider, state treatment의 차이가 근거를 가진다. | component prompt, parity story, `DESIGN_CONVENTION_REVIEW.json` | 완료: medium/low finding까지 수정 또는 근거 수락 |
| C-07 | 컴포넌트 지침 완성도 | 모든 public entry가 source·type·prompt에 연결되고, 모든 비-Foundation 컴포넌트 페이지에 목적·선택·Anatomy·properties·states·behavior·정량·responsive·content·접근성·Do/Don't·예외·related·examples·token/API·migration이 있다. | [`components/component-content.json`](components/component-content.json), [`references/quality/COMPONENT_GUIDANCE_REVIEW.json`](references/quality/COMPONENT_GUIDANCE_REVIEW.json), `check:components` | 완료 |

## D. Interaction·accessibility·반응형·시각 품질

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| D-01 | semantic·keyboard | native semantic 우선, Tab/Arrow/Enter/Space/Escape 동작과 disabled 정책이 component family 계약과 일치한다. | [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md), Storybook play, `check:a11y` | 완료 |
| D-02 | focus·overlay | focus-visible, trap, restore, roving focus, empty/all-disabled edge case가 적용 가능한 surface에서 검증된다. | Storybook play, `check:a11y` | 완료 |
| D-03 | screen reader·상태 | accessible name/state, live-region urgency, 색 외 단서, progress와 freshness text가 있다. | JSX, accessibility contract, `check:a11y`, `check:colors` | 완료 |
| D-04 | target·motion | interactive target과 SVG hit area가 계약을 만족하고 reduced motion을 존중한다. | target-size baseline, `check:motion-hygiene`, `check:a11y` | 완료 |
| D-05 | normal·narrow | 대표 실제 콘텐츠를 정상 폭과 320~400px에서 확인하고 overflow, wrapping, order, scroll ownership을 검토한다. | responsive story, visual smoke, component handoff | 완료(현재 변경 표면 기준) |
| D-06 | light·dark·compound state | light/dark, 긴 label, mixed status, progress, error, disabled, 복수 action에서 hierarchy를 수동 확인한다. | parity/compound story, `check:colors`, visual regression | 완료(현재 변경 표면 기준) |
| D-07 | 디자인 convention debt | 확정 finding을 해결·수락·기각으로 닫고 근거와 owner를 남긴다. | `references/quality/DESIGN_CONVENTION_REVIEW.json` | 완료: resolved 41, accepted 6, tracked 0 |

## E. Storybook·문서·감사 증거

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| E-01 | Storybook scope | 실제 component/pattern/variant/state만 공개하고 audit dashboard와 제품 화면은 넣지 않는다. | [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md), `check:storybook-public` | 완료 |
| E-02 | 페이지 품질 | 모든 page/story가 review되고 public story에 설명과 decision guidance가 있다. | IA audit, `check:storybook-ia` | 완료 |
| E-03 | parity·regression | WDS parity evidence는 owning component에 연결되고 hidden story는 `!dev`·`visual-parity`를 지킨다. | [`VISUAL_PARITY_LEDGER.md`](VISUAL_PARITY_LEDGER.md), `check:parity`, `check:visual-regression` | 완료 |
| E-04 | 수치 drift | implementation, export, page, story, visibility 수치가 생성 원장과 문서에 동일하다. | `npm run check:inventory`, `npm run check:storybook-ia` | 완료 |
| E-05 | 문서 탐색성 | 모든 top-level Markdown이 index에 연결되고 current/historical 상태가 구분된다. | [`README.md`](README.md), `npm run check:docs` | 완료 |

## F. 패키지·소비자·릴리스 계약

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| F-01 | 패키지 build | ESM/CJS/type 산출물과 styles가 재현 가능하게 생성된다. | `npm run build`, `check:generated` | 완료 |
| F-02 | React 소비자 | React 18/19 strict type consumer가 통과하고 public declaration에 누락이 없다. | `check:type-consumer`, `check:types` | 완료 |
| F-03 | 실제 artifact | tarball install, ESM/CJS import, compiled subpath, SSR, tree-shaking 경계가 검증된다. | `check:consumer`, `check:pack` | 완료 |
| F-04 | 배포 정책 | private workspace와 restricted GitHub Packages 정책이 문서·manifest·guard에서 일치한다. | `check:publish-policy`, release-set evidence | 완료 |
| F-05 | release communication | deprecated/breaking 변경에는 changelog, migration, version 영향과 검증 결과가 있다. | release checklist, `DEPRECATIONS.md` | 해당 변경 발생 시 필수 |

## G. 제품 workflow·도메인 채택

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| G-01 | 제품 source pin | DeviceOps, VisionOps, LK Web Viz, Context Hub, Control, MLOps의 revision과 핵심 source가 고정된다. | `references/product-frontends/COVERAGE_AUDIT.json`, `check:product-frontends` | 완료 |
| G-02 | canonical workflow | 발견된 workflow마다 진입점, 판단 정보, action, edge state, 완료 조건, 제품 seam이 기록된다. | [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md) | 완료: 16/16 verified |
| G-03 | WF-15 지도 authoring | `forbidden` line과 stair/stair-slope 의미를 위장하지 않고 LDS renderer 책임 여부를 독립 도메인·LDS 근거로 판정하고 제품 source로 coverage를 확인한다. | WF-15 section, external Robotics audit | 완료: hazard/region surface와 product-owned line authoring 경계 확정 |
| G-04 | component disposition | keep/redesign/split/remove 결정이 제품 coverage와 분리된 LDS/WDS·외부 근거·design-owner 결정에 연결되고, product audit은 workflow mapping만 제공한다. | product audit JSON, component prompt/decision record | 부분: 기존 product coverage guard가 lifecycle 결정을 함께 강제해 R-04 분리 필요 |
| G-05 | Robotics editor 격리 | `CanvasEditorShell`, `CanvasEditorCommandBar`, `LayerPanel`, `SelectionInspector`, `ViewportStatusBar`를 product workflow coverage와 분리해 LDS·공식 editor reference로 판정한다. | [`EDITOR_LAYOUT_AUDIT.md`](EDITOR_LAYOUT_AUDIT.md), [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](EDITOR_LAYOUT_REFERENCE_MATRIX.md), product coverage `separate-audit` | 완료: 별도 audit 유지 |
| G-06 | 채택 판정 | 대상 workflow가 `verified`이고 제품 소유 seam, source revision, 실제 화면 검토가 최신이다. | `check:product-frontends`, 제품별 adoption review | workflow별 조건부 |

## H. 최종 checkpoint·원격 반영

| ID | 점검 항목 | 완료 기준 | 증거·명령 | 현재 |
| --- | --- | --- | --- | --- |
| H-01 | 전체 repository gate | 같은 revision에서 build, contract, Storybook, a11y, visual regression, package artifact가 모두 통과한다. | `npm run check:ci`, `check:audit`, `check:pack:ci` | 완료 조건: current `main` GitHub Actions Windows/Linux CI green |
| H-02 | release audit | 외부 배포 또는 release 후보면 runtime audit을 포함한 release gate가 통과한다. | `npm run check:ops-release` | 해당 없음: 현재 private Git 소비 |
| H-03 | 변경 범위 clean | 의도한 파일만 남고 generated drift와 타인 소유 변경을 포함하지 않는다. | `git status --short`, `git diff --check` | 완료 조건: `.omc/` 외 tracked drift 0 |
| H-04 | main·remote parity | 승인된 변경이 `main`에 통합되고 `origin/main`과 ahead/behind가 0/0이다. | `git fetch --prune`, `git rev-list --left-right --count origin/main...main` | 완료 조건: push 뒤 0/0 |
| H-05 | current handoff | 현재 판정, 검증 명령, 남은 finding, 다음 owner가 current handoff에서 이 문서로 연결된다. | [`HANDOFF.md`](HANDOFF.md) | 완료 |

## 남은 검토 원장

| ID | 우선순위 | 남은 검토 | 완료 증거 | 영향 |
| --- | --- | --- | --- | --- |
| R-01 | P2 · 제품 채택 | 여섯 pinned product source의 LDS 사용량이 모두 0이므로 package migration 완료를 주장하지 않는다. | 제품별 versioned artifact 도입, production build와 workflow smoke | 코어 RC를 차단하지 않으며 제품 owner가 채택 시점에 수행 |
| R-02 | P2 · compatibility 종료 | legacy facade는 실제 소비자 migration과 지원 기간이 끝날 때까지 유지한다. | Wave 5 consumer 0-use scan, support-window 충족, breaking release note | 의도적으로 열어 둔 migration lifecycle |
| R-03 | P2 · gate ownership | product coverage JSON의 `componentDisposition`은 현재 coverage trace를 제공하지만 lifecycle 승인 source는 component contract/design-owner 기록이다. | 장기적으로 schema와 checker 책임을 물리 분리 | 현재 문서가 authority 경계를 명시하며 core RC blocker는 아님 |

## 점검 실행 순서

1. `git status --short --branch`로 revision, dirty file, ahead/behind를 기록한다.
2. WDS snapshot과 여섯 제품 source pin이 그대로인지 확인한다. 바뀌었으면 이전 audit을 현재
   증거로 재사용하지 않고 관련 추출·coverage audit을 먼저 갱신한다.
3. 다음 표적 검사를 실행해 register와 machine audit의 drift를 확인한다.

   ```powershell
   npm run check:inventory
   npm run check:storybook-ia
   npm run check:docs
   npm run check:product-frontends
   npm run check:wds-alignment
   npm run check:colors
   ```

4. 변경 component와 가장 가까운 sibling을 normal/narrow/light/dark 및 대표 compound state에서
   나란히 보고 D-05~D-07을 사람이 판정한다.
5. 모든 관련 수정이 끝난 한 번의 최종 checkpoint에서 `npm run check`를 실행한다. 외부 release
   후보일 때만 `npm run check:ops-release`까지 실행한다.
6. 이 문서의 `현재 판정`, `남은 검토 원장`, 날짜, revision을 갱신하고
   [`HANDOFF.md`](HANDOFF.md)에서 연결한다.

## 완료 선언 전 확인

- [ ] `완료`로 표시한 모든 row에 현재 revision의 직접 증거가 있다.
- [ ] `부분`·`미완료` row마다 owner, 다음 판단, 완료 증거가 남아 있다.
- [ ] 자동 검사 통과를 수동 visual review의 대체 증거로 사용하지 않았다.
- [ ] snapshot·audit 자기일관성을 실제 source 사실성의 대체 증거로 사용하지 않았다.
- [ ] target product workflow가 `verified`가 아니면 전체 제품 적용 완료로 표현하지 않았다.
- [ ] Git clean과 원격 parity를 확인하기 전 릴리스 반영 완료로 표현하지 않았다.
