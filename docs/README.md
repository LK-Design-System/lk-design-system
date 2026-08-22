# LK Design System documentation

| Field | Value |
| --- | --- |
| Type | Documentation index |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-23 |

이 문서는 `docs/`의 공식 탐색 진입점이다. 문서가 충돌하면 아래 source-of-truth 순서와 각 문서의 `Type`·`Status`를 기준으로 판단한다.

## Start here

0. **릴리스·위성 관리·CI 판단(운영 전반): [`OPERATIONS.md`](OPERATIONS.md)** — 저장소를 굴리는 방법의 단일 진입점
1. **고도화 우선순위·실행 순서: [`LDS_ROADMAP.md`](LDS_ROADMAP.md)** — 현재 backlog와 완료 gate의 단일 진입점
2. 제품 UI 신규 구현·LDS 적용·전환·재스타일링: [`LDS_UI_ADOPTION_WORKFLOW.md`](LDS_UI_ADOPTION_WORKFLOW.md)
3. 신규 LDS 컴포넌트·재설계·icon/asset/map symbol 저작: [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)
4. token 추가·변경: [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md)
5. 기여·소유권·변경 분류: [`OPERATING_MODEL.md`](OPERATING_MODEL.md) — 릴리스 **절차**는 위 0번이 소유한다
6. API와 상태: [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)
7. 접근성: [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md)
8. 과거 handoff 포인터: [`HANDOFF.md`](HANDOFF.md) — **현재 상태의 권위가 아니다**(아래 참고)
9. Foundation 원리·선택 기준·토큰 참조: [`foundations/README.md`](foundations/README.md)
10. 컴포넌트 선택·Anatomy·상태·접근성·API 참조: [`components/README.md`](components/README.md)
11. LK ROBOTICS 로고 제작·배포·승인 규정: [`brand/README.md`](brand/README.md)

## Stable policies and contracts

| Document | Role |
| --- | --- |
| [`LDS_UI_ADOPTION_WORKFLOW.md`](LDS_UI_ADOPTION_WORKFLOW.md) | 제품 UI 신규 구현·LDS 전환의 generated canonical workflow와 완료 계약 |
| [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md) | 신규·재설계 검토의 canonical workflow와 완료 gate |
| [`OPERATING_MODEL.md`](OPERATING_MODEL.md) | ownership, change category, release와 migration 운영 |
| [`references/architecture/OWNER_AUTHORITY_CONTRACT.json`](references/architecture/OWNER_AUTHORITY_CONTRACT.json) | Core·Theme·Product·Robotics의 live package/token/Storybook owner와 cross-domain 경계 |
| [`DENSITY_AND_EXPRESSION_PROFILE_CONTRACT.md`](DENSITY_AND_EXPRESSION_PROFILE_CONTRACT.md) | `default | ops` 표현 profile, component density 우선순위, target과 visual/behavior gate |
| [`R3B_OWNER_API_MIGRATION.md`](R3B_OWNER_API_MIGRATION.md) | Product→Core owner 이동, `0.1.x` deprecated re-export, rollback과 removal gate |
| [`STABLE_SUPPORT_POLICY.md`](STABLE_SUPPORT_POLICY.md) | 첫 stable `0.1.x` 지원 범위, atomic package set, R3B compatibility와 promotion gate |
| [`STABLE_SUPPORT_MATRIX.md`](STABLE_SUPPORT_MATRIX.md) | Core·Theme·Product 지원 조합과 package/consumer/deployment 독립 판정 |
| [`STABLE_0.1.0_ROLLBACK.md`](STABLE_0.1.0_ROLLBACK.md) | `0.1.0` publish 전후 실패·consumer 회귀의 immutable rollback 절차 |
| [`references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md`](references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md) | package release·consumer stage·product deployment를 분리한 승격 계약 |
| [`PACKAGE_MIGRATION_GUIDE.md`](PACKAGE_MIGRATION_GUIDE.md) | Wave 2 consumer import, CSS, artifact-pin, and rollback guidance |
| [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) | token source of truth와 변경 정책 |
| [`brand/LK_LOGO_STANDARD.md`](brand/LK_LOGO_STANDARD.md) | LK ROBOTICS 로고 v2.0 표준 · geometry v1.0 정본, 작도 검증, 변형·여백·최소 크기, 색상·인쇄·공동 브랜딩·승인 정책 |
| [`foundations/README.md`](foundations/README.md) | 전체 Foundation의 canonical guide, machine-readable content와 LLM bundle |
| [`components/README.md`](components/README.md) | public component 의사결정 가이드, 정적 reference·platform register, machine-readable registry와 LLM bundle |
| [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md) | public API grammar와 컴포넌트별 상태 증거 |
| [`API_OPENNESS_POLICY.md`](API_OPENNESS_POLICY.md) | 공개 API를 언제·어떤 형태로 여는지의 계약(구조는 열되 조합은 닫음) |
| [`COMPONENT_SURFACE_CONTRACT.md`](COMPONENT_SURFACE_CONTRACT.md) | public root·named part·component vars·data state와 ref target 계약 |
| [`OVERLAY_PLATFORM_CONTRACT.md`](OVERLAY_PLATFORM_CONTRACT.md) | Portal target·theme/direction·stacking·dismiss·modal focus/inert 공통 계약 |
| [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md) | semantic, keyboard, focus, screen-reader 계약 |
| [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md) | Storybook page ownership, role, visibility, naming 계약 |
| [`STORYBOOK_MASTHEAD_COPY_CONTRACT.md`](STORYBOOK_MASTHEAD_COPY_CONTRACT.md) | Storybook Canvas masthead 카피의 작성 규칙과 Docs 본문과의 소유 경계 |
| [`COPY_REVIEW_CONTRACT.md`](COPY_REVIEW_CONTRACT.md) | UI 문구의 copy set·의미 보존·AI 판정·위험도·승인·제품 adapter 계약 |
| [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) | LK Robotics/Product 도메인 컴포넌트 경계와 상태 의미 |
| [`EDITORIAL_METHODOLOGY.md`](EDITORIAL_METHODOLOGY.md) | 데이터로 주장을 만드는 절차(질문→주장→형태→강조→검증)와 집행 등급 |
| [`AI_DESIGN_SYSTEM_GUIDE.md`](AI_DESIGN_SYSTEM_GUIDE.md) | canonical adoption workflow에서 연결되는 AI 구현·token·composition·copy 규칙 |
| [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](EDITOR_LAYOUT_REFERENCE_MATRIX.md) | editor/viewer layout의 독립 설계 근거와 제품 coverage mapping |
| [`BENCHMARK_SEED_DESIGN.md`](BENCHMARK_SEED_DESIGN.md) | seed-design 정면 비교(2026-07-24)와 원리 단위 채택 결정 기록 |
| [`LOADING_PATTERN.md`](LOADING_PATTERN.md) | 로딩 요소 6종 사이의 선택·시간 기준·단계별 피드백을 중재하는 수평 패턴 가이드 |
| [`GUIDED_CREATION_PATTERN.md`](GUIDED_CREATION_PATTERN.md) | 다단계 생성 플로우의 단계 이동 guard·pending·focus·검증 복귀·이탈 확인 합성 계약 |
| [`SELECTABLE_COLLECTION_PATTERN.md`](SELECTABLE_COLLECTION_PATTERN.md) | 수십~100건 다중 선택 field의 selection model·scope·wide/narrow·상태 fixture 합성 계약 |
| [`CHECK_ANSWERS_PATTERN.md`](CHECK_ANSWERS_PATTERN.md) | 제출 전 확인의 dl/dt/dd·contextual change action·복귀 focus 합성 계약 |

## AI and machine-readable entry points

컴포넌트 교체만으로 LDS 전환은 완료되지 않는다. 사람이 수행하는 작업은 [LDS UI 적용·전환 워크플로](LDS_UI_ADOPTION_WORKFLOW.md), AI context는 root [`llms.txt`](../llms.txt)에서 시작합니다.

| Need | Entry |
| --- | --- |
| Consumer agent skill | [lds-ui skill](agent-skills/lds-ui/SKILL.md) — UI 조립 시점에 LDS 결정 규칙을 push 로드; Claude Code는 `.claude/skills/lds-ui/`로 복사, AGENTS.md 기반 에이전트(Codex 등)는 스킬의 라우팅 블록을 AGENTS.md에 추가; `lds-core` 패키지 `docs/agent-skills/lds-ui/`로 배포됨 |
| Robotics direct adoption | `@lk-design-system/lds-robotics-ui/llms.txt` · `@lk-design-system/lds-robotics-ui/design-system.json` · [Robotics Storybook](https://lk-design-system.github.io/lk-design-system-robotics/?path=/docs/lds-robotics-foundation-viewer-tokens--docs) · [public llms.txt](https://lk-design-system.github.io/lk-design-system-robotics/llms.txt) · [public manifest](https://lk-design-system.github.io/lk-design-system-robotics/design-system.json) |
| Machine-readable adoption source | [Adoption contract](references/adoption/LDS_UI_ADOPTION_CONTRACT.json) · [contract schema](references/adoption/LDS_UI_ADOPTION_CONTRACT.schema.json) · [report schema](references/adoption/LDS_UI_ADOPTION_REPORT.schema.json) · [schema-valid report template](references/adoption/LDS_UI_ADOPTION_REPORT.example.json) |
| Consumer promotion evidence | [promotion contract](references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md) · [registry schema](references/adoption/LDS_CONSUMER_REGISTRY.schema.json) · [attestation schema](references/adoption/LDS_CONSUMER_ATTESTATION.schema.json) |
| Stable release evidence | [`0.1.0` release evidence](references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json) · [stable evidence schema](references/adoption/releases/LDS_STABLE_RELEASE_EVIDENCE.schema.json) · [support policy](STABLE_SUPPORT_POLICY.md) · [support matrix](STABLE_SUPPORT_MATRIX.md) · [rollback contract](STABLE_0.1.0_ROLLBACK.md) |
| Consumer enforcement | [config schema](../packages/conformance/schemas/lds-ui-adoption-config.schema.json) · [CLI](../packages/conformance/src/cli.mjs) · [GitHub composite action](../.github/actions/lds-adoption/action.yml) |
| Foundation 탐색 | [Foundation index](foundations/README.md) 또는 단일 context용 [Foundation LLM bundle](foundations/llms.txt) |
| Token 이름·의미·runtime coverage | [Structured token source](../tokens/source.json) |
| Component 선택 | [Component index](components/README.md)와 targeted guide; [component LLM bundle](components/llms.txt)은 retrieval용 |
| Icon inventory | [Iconography guide](foundations/iconography.md) · [icon manifest](../packages/core/assets/icons/manifest.json) |
| Cross-component loading | [Loading pattern](LOADING_PATTERN.md) |
| Guided creation·selection·review | [Guided creation](GUIDED_CREATION_PATTERN.md) · [Selectable collection](SELECTABLE_COLLECTION_PATTERN.md) · [Check answers](CHECK_ANSWERS_PATTERN.md) |
| Logo master, usage, and approval | [LK ROBOTICS logo standard](brand/LK_LOGO_STANDARD.md) · [governance record](brand/lk-logo-governance.json) |

Adoption contract가 판정·evidence·완료 기준을 소유합니다. 이 index와 다른 agent entrypoint에는 그 상세 목록을 복제하지 않습니다.

## Current registers and coverage

| Document | Update source |
| --- | --- |
| [`LDS_ROADMAP.md`](LDS_ROADMAP.md) | 현재 고도화 우선순위, 의존 순서, owner와 종료 gate; release/consumer evidence 변경 시 검토 |
| [`REPOSITORY_INVENTORY.md`](REPOSITORY_INVENTORY.md) | `npm run report:inventory`, `npm run check:inventory` |
| [`VISUAL_PARITY_LEDGER.md`](VISUAL_PARITY_LEDGER.md) | WDS evidence와 visual parity guards |
| [`DEPRECATIONS.md`](DEPRECATIONS.md) | generated: `npm run report:deprecations` |
| [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md) | product source pins와 `check:product-frontends` |
| [`references/adoption/LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json) | current Portal/Web Viz package pins와 package release·consumer stage·deployment의 독립 판정, evidence freshness; `npm run check:adoption-registry` |
| [`references/architecture/DENSITY_COVERAGE_CONTRACT.json`](references/architecture/DENSITY_COVERAGE_CONTRACT.json) | 모든 public component의 density 분류와 profile-aware coverage; `npm run check:density` |
| [`references/architecture/R3B_OWNER_API_DECISIONS.json`](references/architecture/R3B_OWNER_API_DECISIONS.json) | R3B `move-now | stay | defer` owner/API 결정과 `0.1.x` compatibility window; `npm run check:layers` |
| [`references/visual/EXPRESSION_PROFILE_MATRIX.json`](references/visual/EXPRESSION_PROFILE_MATRIX.json) | `default|ops × light|dark × normal|320px × 4 stories` 32-capture visual evidence; `npm run check:expression-profile-visual` |
| [`references/robotics/READINESS.json`](references/robotics/READINESS.json) | O1/O2 readiness와 O3/O4 claim boundary; `npm run check:robotics-readiness` |

## Roadmap, follow-ups, and historical decisions

현재 실행 순서와 backlog는 [`LDS_ROADMAP.md`](LDS_ROADMAP.md)만 소유한다. 아래 문서는
로드맵 항목의 세부 근거나 완료 기록이며, 같은 우선순위를 별도로 복제하지 않는다.

### Active follow-through

| Document | Disposition |
| --- | --- |
| [`LAYER_ARCHITECTURE_REFORM_PLAN.md`](LAYER_ARCHITECTURE_REFORM_PLAN.md) | R3A·R3B·R4 stable과 stable consumer promotion 완료; §14의 provider/private import/family·Storybook·LDS3D exact-set/lifecycle closure는 R4.1 |
| [`OPERATIONS_COST_REDUCTION_PLAN.md`](OPERATIONS_COST_REDUCTION_PLAN.md) | O-A/B/C와 O4 문서·1차 시험 완료; 보완 문서 기준 질문 0 재시험은 R7 |

### Adopted or completed implementation records

| Document | Disposition |
| --- | --- |
| [`EXPRESSION_PROFILE_PROPOSAL.md`](EXPRESSION_PROFILE_PROPOSAL.md) | `default | ops` runtime/token/visual matrix와 R3A density·stable consumer profile 검증의 adopted 기록 |
| [`UI_LIBRARY_REFINEMENT_PLAN.md`](UI_LIBRARY_REFINEMENT_PLAN.md) | component API·Styles/Slots·ref·overlay 구현 기록; current consumer evidence는 registry가 소유 |
| [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md) | package split·Robotics extraction·compatibility retirement 기록 |
| [`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md) | Phase 0–3 완료; 2027-01 review는 R6 |
| [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md) | 도메인 component 확장 완료 기록 |
| [`NAVIGATION_ATOMIZATION_PLAN.md`](NAVIGATION_ATOMIZATION_PLAN.md) | Navigation 원자화 완료 기록 |
| [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md) | Select/MessageFeed 수정과 Portal current composition 반영을 닫은 follow-up 기록 |
| [`PROSE_SURFACE_PROPOSAL.md`](PROSE_SURFACE_PROPOSAL.md) | Core Prose로 채택·구현된 제안 기록 |
| [`TYPE_RAMP_DISPLAY0_PROPOSAL.md`](TYPE_RAMP_DISPLAY0_PROPOSAL.md) | `display0` 채택·릴리스 완료 기록 |
| [`TIMELINE_ORIENTATION_PROPOSAL.md`](TIMELINE_ORIENTATION_PROPOSAL.md) | horizontal Timeline 채택·릴리스 완료 기록 |
| [`TABLE_MEDIUM_CONTRACT_PROPOSAL.md`](TABLE_MEDIUM_CONTRACT_PROPOSAL.md) | Table `banded`·density override hook과 Slides 위임 완료; R3A의 배경 기록 |
| [`OVERLAY_STATUS_CHIP_PROPOSAL.md`](OVERLAY_STATUS_CHIP_PROPOSAL.md) | Core Status family 채택·구현 완료 기록 |
| [`LISTING_CARD_PROPOSAL.md`](LISTING_CARD_PROPOSAL.md) | ListingCard 채택·구현 완료 기록 |
| [`KOREAN_UI_COPY_REFORM_PLAN.md`](KOREAN_UI_COPY_REFORM_PLAN.md) | copy contract·schema·adapter·regression gate 구현 기록 |

### Stable convention and historical audit material

| Document | Disposition |
| --- | --- |
| [`NAVIGATION_EXPRESSION_CONVENTIONS.md`](NAVIGATION_EXPRESSION_CONVENTIONS.md) | Navigation 표현·상태·라벨의 stable convention |
| [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md) | 2026-07-24 gate model과 baseline; 현재 수치·adoption 판단에는 사용하지 않음 |
| [`QUALITY_AUDIT_PLAN.md`](QUALITY_AUDIT_PLAN.md) | confirmed 47건이 resolved/accepted로 종결된 historical quality baseline |
| [`EDITOR_LAYOUT_AUDIT.md`](EDITOR_LAYOUT_AUDIT.md) | 완료된 focused audit; stable 결정은 reference matrix가 소유 |
| [`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) | current Robotics Path System·Navigation Viewer IA로 대체된 pre-extraction plan |
| [`HANDOFF.md`](HANDOFF.md) | 2026-07-24 historical handoff pointer; 현재 상태의 권위가 아님 |
| [`HANDOFF_STORYBOOK_DOCS_SURFACE.md`](HANDOFF_STORYBOOK_DOCS_SURFACE.md) | 2026-07-26 Storybook Docs 작업 snapshot; 현재 상태의 권위가 아님 |
| [`handoff/`](handoff/) | 날짜·commit 기준 immutable historical snapshots |

과거 plan과 handoff의 HEAD, dirty count, test result는 작성 당시 snapshot이다.

**현재 상태 판단에 `HANDOFF.md`를 쓰지 않는다.** 그 문서는 손으로 갱신되는
숫자를 담고 있어 반드시 낡는다 — 2026-08-16 이관 시험에서 robotics 버전
(rc.2 기록 / 실제 rc.19), 소스 엔트리 수, 스토리 수, 이미 삭제된 compat
facade까지 전부 어긋난 것이 확인됐다. 현재 상태는 아래에서 본다:

| 알고 싶은 것 | 권위 |
| --- | --- |
| 다음 고도화 우선순위와 완료 gate | [`LDS_ROADMAP.md`](LDS_ROADMAP.md) |
| 릴리스 절차·정상 상태·위성 규칙 | [`OPERATIONS.md`](OPERATIONS.md) |
| 위성 버전과 LDS 핀 | [`references/SATELLITE_PIN_REPORT.md`](references/SATELLITE_PIN_REPORT.md) (스크립트 생성) |
| 릴리스 버전·짝 robotics 버전 | `CHANGELOG.md`, `package.json`, `vendor/` 실물 |
| 컴포넌트·스토리 수 | `npm run report:inventory` |
| 저장소가 지금 건강한가 | `npm run check:fast` |

## Evidence and generated data

- `references/wds/`: accepted WDS `.fig`, PDF, screenshot, extracted JSON, parity evidence
- `references/quality/`: quality baselines, Storybook IA audit, visual/domain audit
- `references/product-frontends/`: pinned product repositories and workflow coverage data

Markdown 요약보다 machine-readable audit JSON이 상세 row와 hash의 source of truth다. 단, `references/product-frontends/`의 authority는 source pin, 관찰된 workflow·state, coverage classification과 product-owned seam에 한정된다. component anatomy, visual hierarchy, token, public API와 lifecycle 결정의 source of truth는 해당 LDS/WDS 근거, component contract와 design-owner review이며 product coverage JSON이 이를 대체하지 않는다. JSON을 갱신하는 `--update` 명령은 inventory만 동기화하며 사람 검토를 자동 완료하지 않는다.

## Source-of-truth order

1. 현재 source code, public declarations, tokens, built Storybook index
2. machine-readable audit/baseline JSON과 해당 verifier
3. stable policy/contract documents
4. current roadmap/register와 `HANDOFF.md`
5. completed plans와 날짜별 handoff snapshots

과거 plan·handoff·screenshot을 현재 구현의 근거로 단독 사용하지 않는다.

## Document metadata convention

최상위 문서는 제목 바로 아래에 가능한 범위에서 다음 정보를 둔다.

| Field | Meaning |
| --- | --- |
| Type | Policy, Contract, Workflow, Roadmap, Register, Plan/Proposal, Implementation record, Audit, Handoff/Snapshot, Guide |
| Status | Current, Generated, Active, Adopted, Completed, Historical, Superseded, Follow-up |
| Owner | 갱신 책임 역할 |
| Last reviewed | 사람이 마지막으로 현재성을 확인한 날짜 |
| Source | machine-readable source 또는 완료 결과 문서 |

## Refresh sequence

Storybook 구조나 story source가 바뀐 뒤 문서 기준선을 갱신할 때는 다음 순서를 사용한다.

```powershell
npm run build:storybook
npm run report:storybook-ia
# 변경·신규 page를 실제 검토한 뒤 audit의 review fields를 확정한다.
npm run report:inventory
npm run check:docs
npm run check:storybook-ia
npm run check:inventory
```

전체 검증은 관련 문서·코드 변경이 완료된 최종 checkpoint에서 실행한다.
