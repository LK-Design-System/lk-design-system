# LK Design System current handoff

| Field | Value |
| --- | --- |
| Type | Current-state pointer |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-24 |
| Branch | `main` |
| Canonical runtime | Node `22.17.1` · npm `10.9.2` |
| Remote | `origin` · `LK-Design-System/lk-design-system` |

이 문서는 현재 상태와 상세 원장을 연결하는 짧은 포인터다. 날짜별 handoff의 HEAD,
dirty count, push 여부는 해당 시점의 historical snapshot이며 현재 상태로 해석하지 않는다.
현재 revision과 원격 parity는 Git으로 직접 확인한다.

## Current state

- Core/Theme/Product는 각각 `@lk-design-system/lds-core`, `@lk-design-system/lds-theme`,
  `@lk-design-system/lds-product` workspace package이며, 기존
  `@lk-design-system/design-system-core`는 migration support window 동안 compatibility facade다.
- Robotics UI 구현은 별도 `LK-Design-System/lk-design-system-robotics` 저장소의
  `@lk-design-system/lds-robotics-ui@0.1.0-rc.2`가 소유한다. 이 저장소는 Storybook integration
  consumer와 conformance contract만 유지하며 Robotics source의 원본이 아니다.
- 현재 LDS 구현 표면은 174 source entry / 177 named export다. Storybook 감사 기준선은
  150 pages / 487 stories(341 public, 146 hidden)이며 모든 page/story review가 최신이다.
- WDS 분류·parity와 component contract는 현재 source와 일치한다. 중첩 interactive parity는
  0 drift이며, 접근성 기준선은 487 Axe story / current play contract / violation 0이다.
- 제품 workflow 원장은 16/16 `verified`다. WF-15 공간 의미는 외부 Robotics의
  `HazardMarker`/`SpatialRegion`과 product-owned authoring 경계를 구분했고, WF-16의
  계층형 narrow navigation은 제품 소유 focus-managed Drawer composition으로 닫았다.
- 디자인 convention 원장의 47개 confirmed finding은 모두 종결됐다. high 14건,
  medium 20건, low 7건은 수정했고 medium 3건·low 3건은 근거를 남겨 수락했다.
- 여섯 pinned product source는 현재 LDS import가 0이므로 “migration 완료”가 아니라
  `not-adopted`다. 공용 package의 release readiness와 제품별 adoption은 별도 판정한다.
- 생성 `dist`의 canonical platform은 Windows다. Linux 작업 후 `check:generated`가
  sourcemap 차이를 보고하면 CI의 `workflow_dispatch(export_dist=true)` 산출물을 사용한다.
- LDS3D는 독립 형제 저장소로 유지하며, renderer package는 LDS에 의존하지 않는다.

## Current evidence

- 문서 인덱스와 source-of-truth 순서: [`README.md`](README.md)
- 신규·재설계 canonical 절차: [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)
- 완성도 판정: [`DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md`](DESIGN_SYSTEM_COMPLETENESS_CHECKLIST.md)
- package/repository 경계: [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md)
- 제품 workflow: [`PRODUCT_FRONTEND_COVERAGE.md`](PRODUCT_FRONTEND_COVERAGE.md),
  `references/product-frontends/COVERAGE_AUDIT.json`
- 디자인 품질: `references/quality/DESIGN_CONVENTION_REVIEW.json`
- Storybook IA: `references/quality/STORYBOOK_INFORMATION_ARCHITECTURE_AUDIT.json`
- 외부 Robotics 표면: `references/package-split/ROBOTICS_EXTERNAL_SURFACE.json`
- package release·소비자: `references/package-split/releases/`,
  `references/package-split/WAVE2_PRODUCT_RESCAN.json`
- 현재 layout follow-up: [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md)

## Verification commands

```powershell
npm run build
npm run build:storybook
npm run check:storybook-ia
npm run check:inventory
npm run check:ci
npm run check:audit
npm run check:pack:ci
npm run check:workspace-consumer:windows
```

Linux에서는 같은 Windows package set을 `npm run check:workspace-consumer:linux`로
소비한다. push 뒤 GitHub Actions의 Windows design-system job과 Linux consumer job이
모두 green인지 확인하고, `git fetch --prune origin` 뒤 ahead/behind 0/0을 확인한다.

## Remaining release work

1. 현재 변경을 Windows canonical generated artifact와 동기화한다.
2. Node 22.17.1/npm 10.9.2에서 local gates를 통과시킨다.
3. `main`에 push한 동일 revision의 Windows/Linux CI와 원격 parity를 확인한다.
4. compatibility facade 종료는 Wave 5 조건(실제 consumer adoption, 지원 기간,
   breaking release note)을 충족할 때만 별도 수행한다.

## Historical handoffs

- [Wave 0 attestation and Wave 1 package split handoff](handoff/2026-07-19-wave0-attestation-and-wave1-package-split-handoff.md)
- [Documentation system review and reorganization](handoff/2026-07-12-documentation-system-review.md)
- [Domain expansion completion and visual review](handoff/2026-07-12-domain-expansion-completion-and-visual-review.md)
- [Family stabilization verification](handoff/2026-07-12-family-stabilization-verification.md)
- [Storybook IA execution and guidance](handoff/2026-07-12-storybook-ia-execution-and-guidance.md)
