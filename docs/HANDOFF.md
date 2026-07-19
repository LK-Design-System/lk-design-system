# LK Design System current handoff

| Field | Value |
| --- | --- |
| Type | Current-state pointer |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-19 |
| Branch | `main` |
| Wave 0 source baseline | `wave0-baseline-2026-07-19-r2` → `679859b` |
| Wave 0 attestation | `wave0-attested-2026-07-19` → `f8dd678` |
| Remote | `origin` · `LK-ROBOTICS/lk-design-system` |

이 문서는 현재 상태와 최신 상세 handoff를 연결하는 짧은 포인터다. 날짜별 handoff의 HEAD, dirty count, push 여부는 해당 시점의 historical snapshot이며 현재 상태로 해석하지 않는다.

## Current state

- `main == origin/main == f8dd678f32c92798b05d7f97d84449dec916d3a4`이며, 이 commit은 Wave 0 evidence attestation이다. 다음 computer에서 `git fetch --prune --tags origin` 뒤 이 상태를 재현할 수 있다.
- source baseline `wave0-baseline-2026-07-19-r2` (`679859b`)와 attestation tag `wave0-attested-2026-07-19` (`f8dd678`)은 remote에 push됐다. 이전 `wave0-baseline-2026-07-19` tag도 보존했다.
- Wave 0은 aggregate tarball의 실제 React 18/19 consumer, SSR, tree-shaking, Windows/Linux consumption, Storybook visual/accessibility를 포함해 통과했다. full check는 579 Axe story, 259 play function, visual 65/65을 기록한다.
- Wave 1의 package source/workspace 파일은 아직 만들지 않았다. 다음 변경은 historical Wave 0 evidence verifier를 current-source regeneration과 분리한 뒤 `packages/core`, `packages/theme`, `packages/product`, `packages/robotics-ui`, `packages/compat`를 만드는 작업이다.
- LDS3D는 별도 형제 저장소로 유지한다. 현재 docs의 `link:` dependency는 local-only integration이며, `lds-robotics-ui`와 LDS3D 사이 runtime dependency를 추가하지 않는다.
- 신규 컴포넌트·재설계·icon/asset/map symbol의 canonical 검토 절차는 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)다.
- 문서 탐색과 source-of-truth 순서는 [`README.md`](README.md)를 따른다.
- 정확한 다음 단계와 이식 명령은 [2026-07-19 Wave 0/Wave 1 handoff](handoff/2026-07-19-wave0-attestation-and-wave1-package-split-handoff.md)를 따른다.

현재 revision은 Git을 직접 확인한다. 날짜별 handoff의 commit과 이 문서의 baseline은 변경 전후를 설명하는 기준점이며 현재 branch tip을 뜻하지 않는다.

## Latest focused handoffs

1. [Wave 0 attestation and Wave 1 package split handoff](handoff/2026-07-19-wave0-attestation-and-wave1-package-split-handoff.md)
   - 다른 computer에서 시작할 exact Git state, Wave 0 evidence, LDS3D boundary와 Wave 1 실행 순서
2. [Documentation system review and reorganization](handoff/2026-07-12-documentation-system-review.md)
   - 공식 문서 인덱스, metadata/status, canonical component review workflow, product coverage와 drift guard 정리
3. [Domain expansion completion and visual review](handoff/2026-07-12-domain-expansion-completion-and-visual-review.md)
   - Robotics Navigation N1–N6, Communication C1–C4, VirtualKeypad K1 구현·표적 검증 snapshot
4. [Family stabilization verification](handoff/2026-07-12-family-stabilization-verification.md)
   - component family consistency, Storybook, accessibility verification snapshot
5. [Storybook IA execution and guidance](handoff/2026-07-12-storybook-ia-execution-and-guidance.md)
   - page ownership, naming, review ledger 운영 방법
6. [Quality audit and design review](handoff/2026-07-11-quality-audit-and-design-review.md)
   - quality guard와 D-track finding의 historical evidence
7. [Storybook taxonomy cleanup](handoff/2026-07-11-storybook-taxonomy-cleanup.md)
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

`npm run check`는 로컬 통합 상태의 전체 회귀 gate다. 현재 `check:package-migration:wave0`는 Wave 0 source baseline과 attestation tag를 재현하는 historical check다. Wave 1 source 변경 전, 이 historical evidence 검증을 current package regeneration과 분리해야 한다.

## Current next work

1. Wave 0 historical attestation verifier를 source-baseline/tag 기준으로 고정해 Wave 1 변경이 과거 evidence를 무효화하지 않게 한다.
2. 한 저장소 안에 `core`, `theme`, `product`, `robotics-ui`, `compat` workspace package를 만든다.
3. package source/CSS/assets/facade와 package-level artifact·boundary·consumer gates를 구현한 뒤에만 Wave 2 consumer migration을 시작한다.
