# LK Design System current handoff

| Field | Value |
| --- | --- |
| Type | Current-state pointer |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-14 |
| Branch | `main` |
| Baseline | `43ac938` (documentation reorganization 이전) |
| Remote | `origin` · `LK-ROBOTICS/lk-design-system-core` |

이 문서는 현재 상태와 최신 상세 handoff를 연결하는 짧은 포인터다. 날짜별 handoff의 HEAD, dirty count, push 여부는 해당 시점의 historical snapshot이며 현재 상태로 해석하지 않는다.

## Current state

- `main`은 PR #1의 design-system stabilization과 domain expansion 병합 commit `43ac938`을 기준선으로 문서 체계를 재정비했다.
- public component implementation/type/export는 202개, named public export는 208개다.
- 현재 Storybook 기준선은 177 pages / 534 stories / 408 public / 126 hidden / 89 visual-parity다.
- 현재 완성도 판정과 남은 제품·디자인·원격 반영 gate는 [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md)를 따른다. 코어 운영 준비는 완료, 전체 제품 적용은 부분 완료로 판정했다.
- 2026-07-14 staged change set에서 `npm run check`가 통과했다. 534개 implementation story의 Axe, 215개 play, 37개 visual smoke, 실제 tarball ESM/CJS·compiled subpath·SSR 검증을 포함한다.
- 승인된 dark-theme foreground 전수 감사를 완료했다. Button ghost와 `primary-heavy`를 소비하던 21개 component file을 theme-scope semantic foreground로 교정했고, 실제 다크 렌더 기준 Button ghost 15.92:1, selected Chip 13.79:1, active FilterChip/MultiSelectChip 11.99:1을 확인했다. `check:colors`는 이제 light/dark Button ghost, selected Chip, 공통 selected surface의 4.5:1 계약을 포함해 38개 pair를 검사한다.
- 신규 컴포넌트·재설계·icon/asset/map symbol의 canonical 검토 절차는 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)다.
- 문서 탐색과 source-of-truth 순서는 [`README.md`](README.md)를 따른다.

현재 revision은 Git을 직접 확인한다. 날짜별 handoff의 commit과 이 문서의 baseline은 변경 전후를 설명하는 기준점이며 현재 branch tip을 뜻하지 않는다.

## Latest focused handoffs

1. [Documentation system review and reorganization](handoff/2026-07-12-documentation-system-review.md)
   - 공식 문서 인덱스, metadata/status, canonical component review workflow, product coverage와 drift guard 정리
2. [Domain expansion completion and visual review](handoff/2026-07-12-domain-expansion-completion-and-visual-review.md)
   - Robotics Navigation N1–N6, Communication C1–C4, VirtualKeypad K1 구현·표적 검증 snapshot
3. [Family stabilization verification](handoff/2026-07-12-family-stabilization-verification.md)
   - component family consistency, Storybook, accessibility verification snapshot
4. [Storybook IA execution and guidance](handoff/2026-07-12-storybook-ia-execution-and-guidance.md)
   - page ownership, naming, review ledger 운영 방법
5. [Quality audit and design review](handoff/2026-07-11-quality-audit-and-design-review.md)
   - quality guard와 D-track finding의 historical evidence
6. [Storybook taxonomy cleanup](handoff/2026-07-11-storybook-taxonomy-cleanup.md)
   - taxonomy 실행 전 계획 snapshot; 결과 판단에는 현재 IA audit를 사용

## Current verification commands

```powershell
npm run build:storybook
npm run check:storybook-ia
npm run check:inventory
npm run check:contracts
npm run check:docs
npm run check:product-frontends
npm run check
```

전체 repository gate는 문서와 컴포넌트 보완이 끝난 2026-07-14 checkpoint에서 `npm run check`로 통과했다.

## Current next work

1. WF-15 wireframe evidence 다음으로 LK Control Full Daedeok와 LK Context Hub의 관련 workflow에 component disposition을 연결한다.
2. 신규 선택·활성 상태는 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)의 4.5:1 light/dark foreground 계약과 기존 surface·border·pressed semantics를 재사용한다.
3. 다음 component 변경에서도 정상 폭과 320~400px 좁은 폭을 함께 렌더하고 `check:colors`와 해당 Storybook play를 표적 실행한다.
