# LK Design System current handoff

| Field | Value |
| --- | --- |
| Type | Current-state pointer |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-19 |
| Branch | `main` |
| Historical baseline | `43ac938` (domain expansion 안정화 기준점) |
| Remote | `origin` · `LK-ROBOTICS/lk-design-system` |

이 문서는 현재 상태와 최신 상세 handoff를 연결하는 짧은 포인터다. 날짜별 handoff의 HEAD, dirty count, push 여부는 해당 시점의 historical snapshot이며 현재 상태로 해석하지 않는다.

## Current state

- 로컬 `main`에는 PR #1의 stabilization·domain expansion 이후 LDS Core/Theme/Product/Robotics package·repository 분리 Wave 0 준비가 통합돼 있다. 현재 revision은 Git을 직접 확인한다.
- public component implementation/type/export는 204개, named public export는 210개다.
- 현재 Storybook 기준선은 190 pages / 579 stories / 443 public / 136 hidden / 99 visual-parity다. 190개 페이지와 579개 스토리의 IA human review가 모두 최신 source hash로 완료됐다.
- 현재 완성도 판정과 남은 제품·디자인·원격 반영 gate는 [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md)를 따른다. 코어 운영 준비는 완료, 전체 제품 적용은 부분 완료로 판정했다.
- 2026-07-19 local `main@a5a2be3`에서 exact Node 22.17.1/npm 10.9.2로 `npm run check`가 통과했다. 579개 implementation story의 Axe, 259개 play, 65/65 visual smoke 0.000%, React 18/19 type consumer와 실제 aggregate tarball ESM/CJS·deep/type·SSR 검증을 포함한다.
- 원격 `origin/main`은 아직 이 로컬 Wave 0 준비 commit들과 동기화되지 않았다. clean-main tag, 추적 가능한 full-check·consumer-matrix·artifact baseline이 생기기 전까지 Wave 0 gate는 `blocked`다.
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
npm run check:package-migration
npm run check
npm run check:package-migration:wave0
```

`npm run check`는 로컬 통합 상태의 전체 회귀 gate다. `check:package-migration:wave0`는 별도 clean-main tag와 재현 가능한 evidence가 있는 경우에만 통과해야 하며, 일반 integrity check를 Wave 0 완료 판정으로 해석하지 않는다.

## Current next work

1. 승인된 기준 commit을 `origin/main`과 동기화하고 immutable Wave 0 source tag를 만든다.
2. 정확히 고정한 Node 22.17.1/npm 10.9.2 환경에서 full-check, consumer matrix, aggregate tarball baseline을 같은 source commit으로 캡처한다.
3. `npm run check:package-migration:wave0`가 모든 추적 evidence를 검증한 뒤에만 Wave 1 workspace package scaffold를 시작한다.
