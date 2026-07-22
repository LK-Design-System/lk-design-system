# LK Design System documentation

| Field | Value |
| --- | --- |
| Type | Documentation index |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-18 |

이 문서는 `docs/`의 공식 탐색 진입점이다. 문서가 충돌하면 아래 source-of-truth 순서와 각 문서의 `Type`·`Status`를 기준으로 판단한다.

## Start here

1. 신규 컴포넌트·재설계·icon/asset/map symbol: [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)
2. 기여·소유권·릴리즈: [`OPERATING_MODEL.md`](OPERATING_MODEL.md)
3. API와 상태: [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)
4. 접근성: [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md)
5. 현재 저장소 상태와 최신 handoff: [`HANDOFF.md`](HANDOFF.md)

## Stable policies and contracts

| Document | Role |
| --- | --- |
| [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md) | 신규·재설계 검토의 canonical workflow와 완료 gate |
| [`OPERATING_MODEL.md`](OPERATING_MODEL.md) | ownership, change category, release와 migration 운영 |
| [`PACKAGE_MIGRATION_GUIDE.md`](PACKAGE_MIGRATION_GUIDE.md) | Wave 2 consumer import, CSS, artifact-pin, and rollback guidance |
| [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md) | token source of truth와 변경 정책 |
| [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md) | public API grammar와 컴포넌트별 상태 증거 |
| [`API_OPENNESS_POLICY.md`](API_OPENNESS_POLICY.md) | 공개 API를 언제·어떤 형태로 여는지의 계약(구조는 열되 조합은 닫음) |
| [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md) | semantic, keyboard, focus, screen-reader 계약 |
| [`STORYBOOK_INFORMATION_ARCHITECTURE.md`](STORYBOOK_INFORMATION_ARCHITECTURE.md) | Storybook page ownership, role, visibility, naming 계약 |
| [`ROBOTICS_PATTERNS.md`](ROBOTICS_PATTERNS.md) | LK Robotics/Product 도메인 컴포넌트 경계와 상태 의미 |
| [`AI_DESIGN_SYSTEM_GUIDE.md`](AI_DESIGN_SYSTEM_GUIDE.md) | AI가 사용하는 token·composition·copy 규칙 |
| [`EDITOR_LAYOUT_REFERENCE_MATRIX.md`](EDITOR_LAYOUT_REFERENCE_MATRIX.md) | editor/viewer layout의 독립 설계 근거와 제품 coverage mapping |

## Current registers and coverage

| Document | Update source |
| --- | --- |
| [`REPOSITORY_INVENTORY.md`](REPOSITORY_INVENTORY.md) | `npm run report:inventory`, `npm run check:inventory` |
| [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md) | 현재 완성도 판정, 영역별 gate, 남은 검토 원장 |
| [`VISUAL_PARITY_LEDGER.md`](VISUAL_PARITY_LEDGER.md) | WDS evidence와 visual parity guards |
| [`DEPRECATIONS.md`](DEPRECATIONS.md) | generated: `npm run report:deprecations` |
| [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md) | product source pins와 `check:product-frontends` |
| [`HANDOFF.md`](HANDOFF.md) | 현재 HEAD, 작업 상태, 최신 날짜별 handoff 포인터 |

## Plans, audits, and historical decisions

| Document | Status |
| --- | --- |
| [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md) | In progress — Wave 2 RC and LDS3D docs migration verified; Wave 3 is no-go until independent release and product-adoption gates pass |
| [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md) | Completed implementation plan; 결과 handoff로 연결 |
| [`NAVIGATION_ATOMIZATION_PLAN.md`](NAVIGATION_ATOMIZATION_PLAN.md) | Proposed plan — Navigation 선·상태 어휘의 단일 소스화와 Encoding 문서화 |
| [`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) | Proposed plan — Navigation 스토리 페이지 재분해(Route 메가페이지 해체·Viewer 합성 페이지 신설) |
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
