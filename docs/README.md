# LK Design System documentation

| Field | Value |
| --- | --- |
| Type | Documentation index |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-24 |

이 문서는 `docs/`의 공식 탐색 진입점이다. 문서가 충돌하면 아래 source-of-truth 순서와 각 문서의 `Type`·`Status`를 기준으로 판단한다.

## Start here

1. 신규 컴포넌트·재설계·icon/asset/map symbol: [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)
2. 기여·소유권·릴리즈: [`OPERATING_MODEL.md`](OPERATING_MODEL.md)
3. API와 상태: [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)
4. 접근성: [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md)
5. 현재 저장소 상태와 최신 handoff: [`HANDOFF.md`](HANDOFF.md)
6. Foundation 원리·선택 기준·토큰 참조: [`foundations/README.md`](foundations/README.md)
7. 컴포넌트 선택·Anatomy·상태·접근성·API 참조: [`components/README.md`](components/README.md)

## Stable policies and contracts

| Document | Role |
| --- | --- |
| [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md) | 신규·재설계 검토의 canonical workflow와 완료 gate |
| [`OPERATING_MODEL.md`](OPERATING_MODEL.md) | ownership, change category, release와 migration 운영 |
| [`PACKAGE_MIGRATION_GUIDE.md`](PACKAGE_MIGRATION_GUIDE.md) | Wave 2 consumer import, CSS, artifact-pin, and rollback guidance |
| [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) | token source of truth와 변경 정책 |
| [`foundations/README.md`](foundations/README.md) | 15개 Foundation의 canonical guide, machine-readable content와 LLM bundle |
| [`components/README.md`](components/README.md) | 179개 public entry와 148개 컴포넌트 의사결정 가이드, 정적 reference·platform register, machine-readable registry와 LLM bundle |
| [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md) | public API grammar와 컴포넌트별 상태 증거 |
| [`API_OPENNESS_POLICY.md`](API_OPENNESS_POLICY.md) | 공개 API를 언제·어떤 형태로 여는지의 계약(구조는 열되 조합은 닫음) |
| [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md) | semantic, keyboard, focus, screen-reader 계약 |
| [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md) | Storybook page ownership, role, visibility, naming 계약 |
| [`STORYBOOK_MASTHEAD_COPY_CONTRACT.md`](STORYBOOK_MASTHEAD_COPY_CONTRACT.md) | Storybook Canvas masthead 카피의 작성 규칙과 Docs 본문과의 소유 경계 |
| [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) | LK Robotics/Product 도메인 컴포넌트 경계와 상태 의미 |
| [`EDITORIAL_METHODOLOGY.md`](EDITORIAL_METHODOLOGY.md) | 데이터로 주장을 만드는 절차(질문→주장→형태→강조→검증)와 집행 등급 |
| [`AI_DESIGN_SYSTEM_GUIDE.md`](AI_DESIGN_SYSTEM_GUIDE.md) | AI가 사용하는 token·composition·copy 규칙 |
| [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](EDITOR_LAYOUT_REFERENCE_MATRIX.md) | editor/viewer layout의 독립 설계 근거와 제품 coverage mapping |
| [`LOADING_PATTERN.md`](LOADING_PATTERN.md) | 로딩 요소 6종 사이의 선택·시간 기준·단계별 피드백을 중재하는 수평 패턴 가이드 |

## Current registers and coverage

| Document | Update source |
| --- | --- |
| [`REPOSITORY_INVENTORY.md`](REPOSITORY_INVENTORY.md) | `npm run report:inventory`, `npm run check:inventory` |
| [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md) | 현재 완성도 판정, 영역별 gate, 남은 검토 원장 |
| [`VISUAL_PARITY_LEDGER.md`](VISUAL_PARITY_LEDGER.md) | WDS evidence와 visual parity guards |
| [`DEPRECATIONS.md`](DEPRECATIONS.md) | generated: `npm run report:deprecations` |
| [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md) | product source pins와 `check:product-frontends` |
| [`HANDOFF.md`](HANDOFF.md) | 현재 HEAD, 작업 상태, 최신 날짜별 handoff 포인터 |
| [`HANDOFF_STORYBOOK_DOCS_SURFACE.md`](HANDOFF_STORYBOOK_DOCS_SURFACE.md) | Storybook Docs 표면 작업의 인계 문서 — 구현·검증 상태, evidence-only 가이드와 3% 중복 ratchet, 다시 깨기 쉬운 지점 |
| [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md) | LK Portal에서 확인한 Select intrinsic-width 레이아웃 결함과 MessageFeed viewport inset 계약 부족의 재현·수정·검증·릴리스 인계 |

## Plans, audits, and historical decisions

| Document | Status |
| --- | --- |
| [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md) | Wave 1 artifacts and Wave 4 Robotics extraction complete; product adoption and Wave 5 compatibility retirement remain open |
| [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md) | Completed implementation plan; 결과 handoff로 연결 |
| [`NAVIGATION_ATOMIZATION_PLAN.md`](NAVIGATION_ATOMIZATION_PLAN.md) | Proposed plan — Navigation 선·상태 어휘의 단일 소스화와 Encoding 문서화 |
| [`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) | Proposed plan — Navigation 스토리 페이지 재분해(Route 메가페이지 해체·Viewer 합성 페이지 신설) |
| [`PROSE_SURFACE_PROPOSAL.md`](PROSE_SURFACE_PROPOSAL.md) | Proposed plan — 마크다운 렌더 결과의 타이포그래피 표면(Prose): 엔진은 제품, 조판·접근성 계약은 DS |
| [`OVERLAY_STATUS_CHIP_PROPOSAL.md`](OVERLAY_STATUS_CHIP_PROPOSAL.md) | Proposed plan — 표면 앵커 비차단 상태 칩: Robotics 내부 구현(ManualControlSession 2개 소비처)이 근거, 코어 Status 가족 편입 심사 대기 |
| [`LISTING_CARD_PROPOSAL.md`](LISTING_CARD_PROPOSAL.md) | Proposed plan(보류) — 모집·이벤트 리스팅 카드: NewsCard와 의미가 다른 별개 컴포넌트이나 제품 근거 확인 전까지 착수 보류 |
| [`NAVIGATION_EXPRESSION_CONVENTIONS.md`](NAVIGATION_EXPRESSION_CONVENTIONS.md) | Convention — Navigation 표현/상태/라벨 규약과 DS↔제품 경계(semantic mirror·선택 리스트는 제품 몫) |
| [`QUALITY_AUDIT_PLAN.md`](QUALITY_AUDIT_PLAN.md) | Executed baseline with residual follow-up findings |
| [`EDITOR_LAYOUT_AUDIT.md`](EDITOR_LAYOUT_AUDIT.md) | Completed focused audit; stable decisions are in the reference matrix |
| [`handoff/`](handoff/) | 날짜·commit 기준 immutable historical snapshots |

과거 plan과 handoff의 HEAD, dirty count, test result는 작성 당시 snapshot이다. 현재 상태 판단에는 `HANDOFF.md`, Git, 현재 audit JSON과 검사 결과를 사용한다.

## Evidence and generated data

- `references/wds/`: accepted WDS `.fig`, PDF, screenshot, extracted JSON, parity evidence
- `references/quality/`: quality baselines, Storybook IA audit, visual/domain audit
- `references/product-frontends/`: pinned product repositories and workflow coverage data

Markdown 요약보다 machine-readable audit JSON이 상세 row와 hash의 source of truth다. 단, `references/product-frontends/`의 authority는 source pin, 관찰된 workflow·state, coverage classification과 product-owned seam에 한정된다. component anatomy, visual hierarchy, token, public API와 lifecycle 결정의 source of truth는 해당 LDS/WDS 근거, component contract와 design-owner review이며 product coverage JSON이 이를 대체하지 않는다. JSON을 갱신하는 `--update` 명령은 inventory만 동기화하며 사람 검토를 자동 완료하지 않는다.

## Source-of-truth order

1. 현재 source code, public declarations, tokens, built Storybook index
2. machine-readable audit/baseline JSON과 해당 verifier
3. stable policy/contract documents
4. current register와 `HANDOFF.md`
5. completed plans와 날짜별 handoff snapshots

과거 plan·handoff·screenshot을 현재 구현의 근거로 단독 사용하지 않는다.

## Document metadata convention

최상위 문서는 제목 바로 아래에 가능한 범위에서 다음 정보를 둔다.

| Field | Meaning |
| --- | --- |
| Type | Policy, Contract, Workflow, Register, Plan, Audit, Snapshot, Guide |
| Status | Current, Generated, Completed, Historical, Superseded, Follow-up |
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
