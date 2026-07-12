# LK Design System current handoff

| Field | Value |
| --- | --- |
| Type | Current-state pointer |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-12 |
| Branch | `main` |
| Baseline | `43ac938` (documentation reorganization 이전) |
| Remote | `origin` · `LK-ROBOTICS/lk-design-system-core` |

이 문서는 현재 상태와 최신 상세 handoff를 연결하는 짧은 포인터다. 날짜별 handoff의 HEAD, dirty count, push 여부는 해당 시점의 historical snapshot이며 현재 상태로 해석하지 않는다.

## Current state

- `main`은 PR #1의 design-system stabilization과 domain expansion 병합 commit `43ac938`을 기준선으로 문서 체계를 재정비했다.
- public component implementation/type/export는 202개, named public export는 208개다.
- 현재 Storybook 기준선은 177 pages / 524 stories / 398 public / 126 hidden / 89 visual-parity다.
- 공용 dark-theme foreground는 design-owner 결정이 남아 있다. `Button/Playground`의 ghost label은 1.08:1, `Chip/ChipSelection`의 selected `Chip`은 2.24:1, active `FilterChip`은 2.65:1로 측정됐다. `--color-semantic-label-normal`을 사용하면 같은 표면에서 각각 15.92:1, 13.79:1, 11.99:1이지만, `Button`과 chip family 전체 및 `primary-heavy` selected-state 소비자에 영향을 주므로 승인 전에는 공용 값을 변경하지 않는다.
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
```

전체 repository gate는 문서와 컴포넌트 보완이 끝난 최종 checkpoint에서 `npm run check`로 실행한다.

## Current next work

1. design owner가 dark foreground 범위를 결정한다: `Button` + `Chip`/`FilterChip`/`MultiSelectChip`만 교정하거나, `primary-heavy` selected-state를 사용하는 21개 component file까지 별도 전수 감사한다.
2. 승인된 범위에서는 root-resolved component alias 대신 렌더 theme scope의 semantic foreground를 사용하고, light/dark 대표 story와 4.5:1 text 대비 assertion을 추가한다.
3. WF-15 wireframe evidence 다음으로 LK Control Full Daedeok와 LK Context Hub의 관련 workflow에 component disposition을 연결한다.
