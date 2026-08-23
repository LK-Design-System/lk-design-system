# LDS 고도화 로드맵

| Field | Value |
| --- | --- |
| Type | Roadmap |
| Status | Current |
| Owner | Design system owner · Frontend platform · 해당 Product/Robotics owner |
| Last reviewed | 2026-08-23 |
| Planning baseline | LDS `0.1.0` · `lds-v0.1.0` · `085ba9e72522dfe628a2d39d00583d0bb8d756d4`; Robotics UI `0.1.0-rc.33` · `v0.1.0-rc.33` · `bf7965ee05cd926722cefc7e60d6ddd5560c3c8a` |
| Review cadence | release candidate 변경 · consumer evidence 변경 · 2027-01 lifecycle review |
| Current-state sources | current source와 package manifest · owner authority · consumer promotion registry · Robotics readiness · generated satellite pin report |

이 문서는 LDS의 **앞으로 할 일, 의존 순서와 완료 gate**를 소유한다. 구현의 현재 사실은
source와 machine-readable evidence가, 정책은 [`OPERATING_MODEL.md`](OPERATING_MODEL.md)와
각 stable contract가 소유한다. 완료된 계획과 날짜별 handoff는 결정 배경과 당시 실행
기록이며 현재 backlog나 현재 상태의 권위가 아니다.

## 1. 사용 방법과 상태 체계

로드맵 항목은 다음 상태 중 하나만 가진다.

| 상태 | 의미 |
| --- | --- |
| `Done` | 현재 source·패키지·검사·소비 증거에 연결된 완료 기준을 통과했다. |
| `Now` | 다음 release train에서 우선 실행한다. owner와 종료 gate가 없는 작업은 `Now`가 될 수 없다. |
| `Next` | `Now`의 선행 gate가 닫힌 뒤 시작한다. 사전 조사만으로 구현 승인을 대신하지 않는다. |
| `Conditional` | 실제 제품 근거나 별도 owner 승인이 생길 때만 연다. 근거가 없으면 미지원 상태를 유지한다. |
| `Scheduled review` | 날짜 또는 규모 trigger가 도달할 때 재심사한다. 그 전에는 구조를 바꾸지 않는다. |
| `Continuous` | 매 release에서 반복하는 건강성·문서·릴리스 관리다. |

로드맵에 들어갔다는 사실만으로 shared token 값, public API, repository/package 경계 또는
제품 source 변경이 자동 승인되지는 않는다. 실제 변경은 각각
[`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md),
[`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md),
[`LDS_UI_ADOPTION_WORKFLOW.md`](LDS_UI_ADOPTION_WORKFLOW.md)와 scope escalation gate를
다시 통과한다.

## 2. 현재 기준선과 열린 문제

첫 stable `0.1.0` 기준으로 다음 기반은 구현·검증됐다.

- Core·Theme·Product는 한 저장소의 분리 package와 fixed release group으로 배포된다.
- Theme은 `default | ops` profile을 제공하고 동일한 component API·DOM·status semantics를
  유지한다.
- Product public surface는 `Application | Operations | Workspace` family를 정확히 하나씩
  가진다.
- Portal/default `949a1261e8f61842a42d07ca4b62c7ff71cc45da`와 Web Viz/ops
  `8f493fd3475eb6c7516fdf7d3aca3265c2b7db87`는 실제 stable `0.1.0` registry tgz의 install,
  production build, 대표 workflow와 accessibility를 재검증했다. Web Viz는 Robotics UI
  `0.1.0-rc.33`도 함께 고정했다. 2026-08-23 clean-clone evidence와 product/design-system
  owner 승인을 포함해 둘 다 `workflow-verified`이며 main integration과 실제 제품 배포는
  별도 `not-attested`다.
- Robotics readiness는 O1 Monitoring과 O2 Operational control을 `ready`, O3 Alarm
  lifecycle을 `unverified`, O4 Safety-certified HMI를 `unsupported`로 제한한다.
- active aggregate·Editorial·console-pastel legacy reference는 0이며, Core·Theme·Product
  package tarball과 release pin은 immutable evidence로 검증된다.
- 현재 package·token·Storybook owner는 live authority에서 하나로 결정되고, consumer
  registry v2는 package release·consumer stage·product deployment를 독립 판정한다.

R3A·R3B의 stable 차단 결정, R4 첫 stable 승격과 R4.1 source-level 계층 계약 closure는
닫혔다. R4.1은 이미 발행된 `0.1.0` package identity나 consumer/deployment 상태를 바꾸지
않고 다음 release에 들어갈 source와 machine gate를 정리한 후속이다. 현재 package source
candidate identity는 `0.1.1`이며 tag·registry publish·consumer 재검증은 아직 없다.

2026-08-23 R7의 유한한 비-Storybook evidence adapter 결정도 닫혔다. Adoption contract v2는
built Storybook exact story ID와 deterministic production-preview workflow artifact를 동등한
hard-trigger evidence 선택지로 받는다. 후자는 clean source identity, production build,
workflow smoke, accessibility, theme×viewport run 안의 ready/non-ready state, spec·runner·CI
hash를 검증한다. 따라서 현재 무조건부 release-train open problem은 0이다.

R1에서 닫힌 문제와 재검증 진입점은 다음과 같다.

| 구현에서 닫힌 문제 | 완료 근거 |
| --- | --- |
| 현재 owner authority 충돌 | [`OWNER_AUTHORITY_CONTRACT.json`](references/architecture/OWNER_AUTHORITY_CONTRACT.json)과 `check:layers`: 현재 module/export, token source, 196 canonical Storybook page와 10 domain boundary exact-set one-owner 검증 |
| RC-only registry와 선언적 stage | registry/attestation schema v2, [`CONSUMER_ADOPTION_PROMOTION_CONTRACT.md`](references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md), `check:adoption-registry`와 양성·음성 contract tests |
| 대표 제품 adoption 승인 | Portal source `949a1261...`/stable approval evidence `b4879566`, Web Viz source `8f493fd3...`/stable approval evidence `30197094`; 두 registry entry 모두 stable `workflow-verified`, deployment는 `not-attested` |
| Storybook IA·inventory currentness | IA 196/196 page·732/732 story review, stale 0; generated inventory와 `check:storybook-ia`, `check:inventory`, `check:docs` |

R4 release closure는 LDS `0.1.0` (`lds-v0.1.0`,
`085ba9e72522dfe628a2d39d00583d0bb8d756d4`)과 Robotics UI `0.1.0-rc.33`
(`v0.1.0-rc.33`, `bf7965ee05cd926722cefc7e60d6ddd5560c3c8a`)를 고정한다. LDS CI
`32590804542`, Pages `32590804685`, paired Robotics gate `32591917565`와 publish/verify
workflow `32592054962`가 통과했다. Core·Theme·Product의 실제 published metadata와 다운로드
artifact hash는 stable release evidence에 연결되고 release/satellite pin gate는 green이다.

현재 상태를 다시 판단할 때 위 서술의 버전·수치를 그대로 재사용하지 않고 다음 권위를
읽는다.

| 질문 | 현재 권위 |
| --- | --- |
| layer·token·Storybook owner와 domain 경계 | [`references/architecture/OWNER_AUTHORITY_CONTRACT.json`](references/architecture/OWNER_AUTHORITY_CONTRACT.json) |
| consumer version·profile·검사 단계·deployment | [`references/adoption/LDS_CONSUMER_REGISTRY.json`](references/adoption/LDS_CONSUMER_REGISTRY.json)과 [promotion contract](references/adoption/CONSUMER_ADOPTION_PROMOTION_CONTRACT.md) |
| `default | ops` 시각 evidence | [`references/visual/EXPRESSION_PROFILE_MATRIX.json`](references/visual/EXPRESSION_PROFILE_MATRIX.json) |
| O1–O4 지원 주장 | [`references/robotics/READINESS.json`](references/robotics/READINESS.json) |
| 위성 version과 LDS pin | [`references/SATELLITE_PIN_REPORT.md`](references/SATELLITE_PIN_REPORT.md) |
| release version과 artifact | root/package `package.json`, `CHANGELOG.md`, `vendor/` |
| 저장소 건강성 | `npm run check:fast`와 해당 release gate |

## 3. 실행 순서

```text
R0 architecture/profile/package baseline (Done)
                         |
                         v
R1 authority & promotion contract (Done)
                         |
                         v
R2 product adoption promotion (Done)
             |
              +--> R3A density v2 decision (Done) ---+
              +--> R3B owner/API decision (Done) ----+--> R4 first stable promotion (Done)
                                                             |
                                                             v
                                                R4.1 layer contract closure (Done)

R5 alarm lifecycle O3 (Conditional; stable 비차단)
R6 ecosystem lifecycle review (Scheduled review, 2027-01)
R7 evidence/operations health (Continuous)
```

R1 계약 구현과 paired LDS/Robotics release, R2 대표 제품 adoption 승격, R3A 밀도 계약,
R3B owner/API 결정, R4 첫 stable 승격과 R4.1 계층 계약 closure를 완료했다. 현재 무조건부
release-train backlog는 없다. R5 O3는 실제 alarm workflow가 없으면 계속 미지원이고, R6는
2027-01 정기 심사, R7은 매 release 반복 작업이다.

## 4. R0 — 계층·프로파일·패키지 기준선

| Field | Value |
| --- | --- |
| Status | `Done` |
| DRI | Design system owner |
| Outcome | 일반 B2B Product와 Operations surface가 하나의 Core 위에서 package/profile/family 계약으로 구분된다. |
| Evidence | `LAYER_ARCHITECTURE_REFORM_PLAN.md`, `EXPRESSION_PROFILE_PROPOSAL.md`, consumer registry, release pin checks |

이 항목은 다시 실행할 backlog가 아니다. `ops` 전용 Core fork, 두 번째 component set,
profile별 DOM/API 분기는 금지한다. 현재 구현 뒤에 남은 authority·consumer·stable gate는
R1–R4가 소유한다.

## 5. R1 — authority와 승격 계약

| Field | Value |
| --- | --- |
| Status | `Done` |
| DRI | Frontend platform |
| Required approver | Design system owner |
| Dependency | R0 baseline |
| Goal | 문서·machine registry·checker가 같은 owner와 같은 승격 의미를 말하게 한다. |

### M0. 현재 authority 정렬

- public export, internal module, token group, canonical Storybook page가 정확히 하나의 현재
  owner를 갖는 machine-readable coverage를 만든다.
- `DESIGN.md`, `OPERATING_MODEL.md`, `ROBOTICS_PATTERNS.md`, Product family metadata가
  telemetry/viewer/equipment/command/navigation의 현재 소유 경계를 동일하게 설명하도록
  충돌을 해소한다.
- Product의 미분류 export와 Core private/internal 소비를 0으로 만들고, 허용된 cross-owner
  조합은 fixture로 증명한다.

### M1. promotion registry 강제

- registry가 RC와 첫 stable identity를 모두 표현하게 version schema를 고친다.
- `wired → build-verified → workflow-verified` 각 단계의 필수 check, evidence, freshness,
  clean-clone 재현성, product-owner 승인을 checker가 강제한다.
- `workflow-verified`는 install·source contract·production build·대표 workflow·접근성이
  모두 통과하기 전에는 기록할 수 없게 한다.
- 제품 `deployed` 여부는 package stable 여부와 분리한다. 배포 evidence, rollout/rollback
  책임과 시점은 product owner가 소유하고 registry는 그 증거만 참조한다.
- Stable registry/support matrix가 release tag, artifact checksum, deprecation window,
  migration/rollback artifact를 같은 release identity로 연결하게 한다.

### M2. 문서 lifecycle 정리

- 현재 backlog는 이 roadmap에만 두고 완료 plan은 implementation record, 낡은 plan은
  `Superseded`, 날짜별 handoff는 historical snapshot으로 분류한다.
- generated report와 수동 문서가 같은 version/count를 중복 소유하지 않게 한다.
- Storybook IA audit의 stale reviewed page를 current source 기준으로 재판정하고 disposition을
  review한 뒤 checker를 녹색으로 복구한다.
- [`LAYER_ARCHITECTURE_REFORM_PLAN.md`](LAYER_ARCHITECTURE_REFORM_PLAN.md)의 남은 완료
  checklist를 R1–R4 evidence에 연결하고 실제로 닫힌 뒤에만 `Completed`로 바꾼다.

### 종료 gate

- owner authority coverage의 미분류·중복·durable 문서 충돌이 0이다.
- stable-capable schema와 stage checker의 양성·음성 fixture가 통과한다.
- `workflow-verified`, `deployed`, package `stable`이 서로 다른 판정임이 schema와 문서에서
  강제된다.
- active plan/follow-up마다 roadmap ID 또는 conditional entry trigger와 종료 gate가 있다.

### 구현 evidence와 release closure

- [`OWNER_AUTHORITY_CONTRACT.json`](references/architecture/OWNER_AUTHORITY_CONTRACT.json)이
  live package/token/Storybook surface와 WDS compatibility projection을 함께 검증한다.
- Registry와 attestation은 schema v2로 분리됐고 package `stable`, consumer
  `workflow-verified`, product `deployed`를 서로 독립적으로 표현한다. 38개 contract test가
  stage, 날짜 순서, source commit, product-owner 승인과 release artifact 경로를 검사한다.
- Storybook IA audit는 196 page와 732 story를 모두 current source로 재검토해 stale row가
  0이며 repository inventory와 generated component docs도 같은 source에 맞춰졌다.
- 종료 검사는 `check:layers`, `check:adoption-registry`, registry contract test,
  `check:storybook-ia`, `check:inventory`, `check:components`, `check:docs`가 소유한다.
- 위 구현 검사와 paired release gate가 모두 통과했다. LDS stable `0.1.0`과 Robotics UI
  `0.1.0-rc.33`은 동기화된 Core documentation snapshot을 사용하며, immutable release workflow가
  Core·Theme·Product package set을 게시·재검증했다.

## 6. R2 — 실제 제품 adoption 승격

| Field | Value |
| --- | --- |
| Status | `Done` |
| DRI | Portal/Web Viz product owner |
| Required approvers | 해당 product owner · Design system owner |
| Dependency | evidence 수집은 R0부터 가능; registry stage 승격은 R1 |
| Outcome | Portal/default와 Web Viz/ops의 pinned source가 product-owned evidence와 승인으로 `workflow-verified`에 승격됐다. |

2026-08-22 R2 completion snapshot에서 Portal
`c2e39f3c9f89a52cdb0c5a58727050afe20a82b9`와 Web Viz
`542639f2fea109e78f052e730ac30072cad79a6c`는 `0.1.0-rc.69.30` package set으로 install,
source contract, production build, representative workflow, accessibility와 clean-clone
재현을 통과했다. Portal approval evidence commit `50c2d9b`와 Web Viz approval evidence
commit `4dad154`는 2026-08-22 해당 product owner와 design-system owner 승인을 기록하고,
중앙 registry는 두 consumer를 `workflow-verified`로 판정한다. 이 승인은 pinned consumer
adoption에만 해당하며 main integration, package stable, rollout 또는 production deployment를
승인하지 않는다. deployment는 두 제품 모두 별도 `not-attested`다.

2026-08-23 R3 final-RC snapshot에서는 Portal
`7eeb93be084eade1e41025fe7843480d6f22b184`와 Web Viz
`2f1b2db333fc37175ed3d94ef18d9c257fc09803`가 실제 registry의 `0.1.0-rc.69.31`
Core·Theme·Product와 Robotics UI `0.1.0-rc.32`를 설치해 같은 대표 workflow를 다시
통과했다. 이 재검증도 main integration·rollout·production deployment를 뜻하지 않는다.

2026-08-23 R4 stable checkpoint에서는 Portal
`949a1261e8f61842a42d07ca4b62c7ff71cc45da`와 Web Viz
`8f493fd3475eb6c7516fdf7d3aca3265c2b7db87`가 Core·Theme·Product `0.1.0`의 exact
artifact와 checksum을 사용해 기술 5 gate와 clean-clone 재현을 다시 통과했다. Web Viz는
Robotics UI `0.1.0-rc.33`도 함께 검증했다. 2026-08-23 stable approval evidence가 두
consumer의 `workflow-verified` 승격을 승인하며, main integration·rollout·deployment는 계속
별도 `not-attested`다.

### Portal/default

- exact source에서 current fixed package set의 clean install과 production build를
  재현했다.
- 로그인 health check가 아니라 대표 Application workflow와 실제 floating/full-page chat
  composition을 smoke evidence로 고정했다.
- light-only 지원 범위에서 targeted accessibility, keyboard/focus와 narrow viewport를
  통과하고 attestation에 기록했다.
- source contract와 semantic schema validator 경로를 우회 없이 통과했다.
- product/design-system owner의 stable 승인은 approval evidence commit
  `b48795660c85698b1326ae48c12bdaf92e5a25e3`에 기록됐다.
  rollout 또는 rollout-ready 판단은 별도 product-owner evidence가 없어 `not-attested`다.

### Web Viz/ops

- exact clean source에서 current Core·Theme·Product·Robotics set을 재검증했다.
- representative Operations workflow의 light/dark, normal/narrow, keyboard/focus와 targeted
  accessibility가 deterministic production-preview evidence로 통과했다.
- full-product quality의 기존 backend finding과 broad route diagnostic은 R2 frontend
  workflow 성공으로 숨기지 않고 제품 finding으로 분리했다.
- product/design-system owner의 stable 승인은 approval evidence commit
  `301970943d9e2c72c8e78e6ebb7f2246377d456f`에 기록됐다.
  main integration, rollout 또는 rollout-ready 판단은 이 승인에 포함되지 않으며 별도
  evidence가 없어 `not-attested`다.

### 종료 gate

- Portal/default와 Web Viz/ops가 R1 checker 기준 `workflow-verified`다.
- attestation은 clean clone의 source commit, 실행 command, package checksum, viewport,
  결과와 product-owner 승인을 재현한다.
- active consumer의 retired import와 승인되지 않은 product-local foundation override가 0이다.
- deployment 상태는 product owner evidence가 있을 때만 별도로 기록된다.

## 7. R3A — 밀도 체계 2차 고도화

| Field | Value |
| --- | --- |
| Status | `Done` |
| DRI | Foundation owner |
| Required approvers | Design system owner · 영향받는 Core/Product owner · 대표 product owners |
| Dependency | R1 precedence/authority contract; R2 consumer evidence를 입력으로 사용 |
| Goal | `ops`의 조밀함을 반복 데이터·탐색·패널까지 예측 가능한 계약으로 확장한다. |
| Representative consumers | Portal/default · Web Viz/ops |

2026-08-22 source audit의 착수 기준선은 다음과 같았다.

- `ops` whitelist override 21개는 geometry 13·motion 6·shadow 2이며 반복 데이터·탐색
  chrome token은 아직 없다.
- public component 208개 중 `density` prop을 직접 노출한 것은 12개이고, bounded scope
  provider는 Drawer 한 곳이다.
- touch-target baseline 56건 중 42건이 DataGrid/DataCollection/DataToolbar의 16×16
  checkbox 계열이라 우선 데이터군에서 기존 debt를 함께 다뤄야 한다.
- 현재 16-capture expression matrix는 두 대표 story의 token geometry와 semantic color
  invariance를 보지만 data/navigation/overlay keyboard·focus를 직접 검증하지 않는다.
- Web Viz R2에서 Theme의 zero-specificity
  `:where([data-lds-profile='ops'], .lds-profile-ops)`를 `html`에 적용하면 같은 element의
  Core `:root` default가 specificity로 이기는 것을 확인했다. Web Viz는 임시로 app root인
  `body`에 profile을 적용하고 computed button 36px·duration 160ms를 검증했지만, Theme
  selector 우선순위 자체의 정합화와 consumer workaround 제거는 LDS owner follow-up이다.

Theme profile과 bounded local density는 서로 다른 축이다. 전역 provider에 product density를
추가하지 않는다. 우선순위는 다음처럼 고정한다.

1. local density는 component prop이 생략됐을 때 그 component의 축 기본값을 선택한다.
2. 명시적 component `size`/`density` prop이 local density보다 우선한다.
3. profile은 선택된 size의 token 값을 결정한다. 따라서 `ops` 안의 명시적 `md`도
   `ops-md` token 값을 사용한다.
4. profile·density 어느 축도 semantic status, color meaning, type-ramp meaning, DOM anatomy를
   바꾸지 않는다.

### M0. coverage와 우선순위 계약

- 모든 public component를 `profile token 자동 반영`, `명시적 size/density`, `고정`,
  `not-applicable` 중 하나로 분류하는 coverage register를 만든다. 정본은
  [`DENSITY_COVERAGE_CONTRACT.json`](references/architecture/DENSITY_COVERAGE_CONTRACT.json)이며
  `npm run check:density`가 208개 public entry와의 exact-set 계약을 검증한다.
- `고정`/`not-applicable`도 유효한 결론으로 허용하되 owner와 재검토 trigger를 기록한다.
- 전수 register 작성은 stable 전 inventory gate지만 208개 component 전부의 density 구현을
  stable 차단 조건으로 삼지 않는다.

### M1. 반복 데이터와 target debt

- Table·DataGrid·List·Tree를 우선군으로 삼아 row/cell/control height, padding, gap,
  truncation, overflow와 empty/loading/error 상태를 정렬한다.
- 현재 touch-target baseline의 기존 debt 중 우선군은 실제 target을 닫거나 WCAG target
  spacing exception을 실측 증명한다. 신규 회귀 0 ratchet만으로 완료를 주장하지 않는다.
- Table의 `size`, DataGrid의 `size`, ListCell의 `verticalPadding`처럼 갈라진 문법은
  호환성과 owner를 확인해 공통 의미를 문서화하되 무조건 단일 prop으로 rename하지 않는다.

### M2. 탐색·오버레이·패널

- Menu·SideNav/navigation item·Drawer·toolbar/filter/panel shell을 두 번째 우선군으로
  감사한다.
- Drawer의 기존 bounded density scope를 일반화할지는 실제 두 consumer evidence와 API
  review를 거쳐 결정한다.

### M3. composite visual/behavior gate

- `data-dense`와 `navigation/overlay` composite fixture를 추가한다.
- `default | ops × light | dark × normal | 320px`에서 geometry, overflow, semantic color
  invariance를 비교한다.
- high-risk fixture는 keyboard, focus visibility/recovery, pointer target, reduced-motion play를
  함께 통과한다. 모든 component×모든 profile의 무의미한 cartesian capture는 만들지 않는다.

### M4. consumer smoke

- Portal/default와 Web Viz/ops가 같은 candidate set을 install/build하고 각 대표 density
  smoke를 통과한다.
- attribute 생략과 `profile="default"`의 기존 출력은 승인된 migration 외에 동일해야 한다.

### stable 전 결정 gate

- coverage register에 미분류·중복이 0이다.
- M1·M2 우선군을 이번 stable에 구현할지, owner·재검토 trigger와 함께 연기할지가 명시된다.
- 이번 stable 범위에 포함된 항목은 hardcoded geometry exception, target debt, visual/behavior,
  consumer smoke 종료 gate를 모두 통과한다.

### 완료 evidence

- Theme selector는 document root의 `data-lds-profile="ops"`가 Core `:root` default보다
  우선하도록 정합화했다. Web Viz의 `body` workaround를 제거하고 `html` 적용으로
  36px control·160ms motion 계약을 재검증했다.
- [`DENSITY_COVERAGE_CONTRACT.json`](references/architecture/DENSITY_COVERAGE_CONTRACT.json)은
  canonical public component 208개를 exact-set으로 분류한다. data·navigation·overlay의
  density token과 bounded composition을 구현하고 `npm run check:density`가 이를 강제한다.
- DataGrid checkbox 실제 target을 24×24px로 올렸고 target baseline debt는 56건에서 14건으로
  줄었다. 남은 14건은 owner와 예외·재검토 trigger가 있는 비차단 debt다.
- expression visual matrix는 32 capture로 확장돼 `default | ops × light | dark × normal |
  narrow`의 dashboard/data/navigation/overlay를 검사한다. keyboard·focus·reduced-motion과
  semantic invariance도 같은 gate에 포함된다.
- Portal/default와 Web Viz/ops가 실제 stable `0.1.0` package set으로 install, build,
  대표 density/profile workflow를 통과했다.

## 8. R3B — component owner와 public API 경계 정제

| Field | Value |
| --- | --- |
| Status | `Done` |
| DRI | Design system owner |
| Required approvers | 대상 Component owner · 영향받는 Product/Robotics owner |
| Dependency | R1 current authority coverage · R2 actual import/use evidence |
| Goal | Product가 `Core가 아닌 모든 것`으로 커지지 않게 하면서 실제 소비 경계가 없는 package 분할은 만들지 않는다. |

### 우선 감사

- Product→Core 후보: Link, Popover, Date/Number/Password input, Progress 계열처럼
  domain-neutral anatomy·state·접근성 계약을 가진 surface
- Product/Operations↔Robotics 후보: generic equipment/telemetry presentation과 robot
  identity, authority, command safety, navigation semantics의 경계
- Product/Application·Operations·Workspace family별 실제 import/bundle/documentation 수요
- owner package private/internal deep import와 compatibility re-export 잔존 여부

### 결정·종료 gate

- 각 후보는 `move now`, `stay`, `defer` 중 하나와 owner·consumer evidence를 가진다.
- 이동은 새 owner export → deprecation/re-export → consumer migration → legacy removal 순서를
  지키며 support window와 rollback을 기록한다.
- family subpath는 2개 이상 소비자 또는 독립 bundle/ownership 수요가 있을 때만 additive로
  연다.
- 별도 package/repository는 독립 owner·release cadence·consumer matrix가 모두 확인될 때만
  재심사한다.
- 첫 stable 전 모든 후보의 결정은 닫되, `stay` 또는 trigger가 있는 `defer`는 stable을
  막지 않는다.

### 완료 evidence

- `Link`, `Popover`, `Calendar`, `DatePicker`, `NumberField`, `PasswordInput`, `ProgressBar`,
  `CircularProgress`, `Meter`의 canonical owner를 Product에서 Core로 옮겼다.
- Product root와 deep import는 동일 Core 구현을 가리키는 deprecated compatibility re-export로
  전체 `0.1.x` 동안 유지한다. 제거는 consumer scan 0과 owner 승인 뒤 `0.2.0`보다 빠르지 않다.
- `DateRangeField`와 Operations presentation은 Product에 남고 robot authority·safety·pose·
  navigation semantics는 Robotics에 남는다. `HoverCard`, `InputGroup`, `TimePicker`, `PinInput`
  및 wildcard allowlist는 machine decision register의 trigger가 생길 때까지 defer했다.
- [`R3B_OWNER_API_DECISIONS.json`](references/architecture/R3B_OWNER_API_DECISIONS.json)과
  [`R3B_OWNER_API_MIGRATION.md`](R3B_OWNER_API_MIGRATION.md)가 모든 `move-now | stay | defer`,
  compatibility window와 rollback을 소유하며 layer/package checks가 물리적 owner 1개를 검증한다.

## 9. R4 — 첫 stable 승격

| Field | Value |
| --- | --- |
| Status | `Done` — stable package 및 stable consumer evidence verified |
| DRI | Frontend platform |
| Required approvers | Design system owner · Portal/Web Viz product owners |
| Entry gate | R1·R2 완료, R3A·R3B decision closure |
| Goal | RC에서 검증한 계약을 재현 가능한 지원·변경·rollback 약속과 함께 stable로 승격한다. |

### 종료 gate

- stable-capable registry, fixed package set과 support matrix가 녹색이다.
- Portal/default와 Web Viz/ops의 `workflow-verified` evidence가 stable `0.1.0`에 연결된다.
- release note, migration guide, rollback artifact, deprecation window, package checksum과
  immutable Git tag가 같은 identity를 가리킨다.
- R3A·R3B의 stable 포함 항목이 완료됐고 연기 항목은 owner·trigger·다음 review를 가진다.
- unresolved P0 또는 stable 사용을 막는 P1 finding이 0이다.
- clean-clone dry run 뒤 publish하고 registry/package availability/immutability를 재검증한다.

### 완료 evidence

- LDS source `085ba9e72522dfe628a2d39d00583d0bb8d756d4`와 immutable tag `lds-v0.1.0`을
  CI `32590804542`, Pages `32590804685`, publish/verify `32592054962`가 검증했다.
- Robotics UI `0.1.0-rc.33` source `bf7965ee05cd926722cefc7e60d6ddd5560c3c8a`와 tag
  `v0.1.0-rc.33`은 paired gate `32591917565`에서 exact LDS stable input과 함께 통과했다.
- [`LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json`](references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json)이
  Core·Theme·Product의 published time, shasum, integrity와 atomic support/rollback contract를
  고정한다.
- Portal `949a1261e8f61842a42d07ca4b62c7ff71cc45da`와 Web Viz
  `8f493fd3475eb6c7516fdf7d3aca3265c2b7db87`는 exact stable package로
  `workflow-verified`다. 두 제품의 main integration과 deployment는 `not-attested`다.
- 중앙 registry schema와 38개 contract test가 통과했고, Portal evidence carrier
  `b48795660c85698b1326ae48c12bdaf92e5a25e3`와 Web Viz evidence carrier
  `301970943d9e2c72c8e78e6ebb7f2246377d456f`를 배치한 isolated composite workspace에서도
  package pin·artifact checksum·evidence path 검사가 통과했다. 제품 main checkout 통과로
  확대 해석하지 않는다.

stable package publish와 제품 배포 완료는 같은 뜻이 아니다. 제품 배포 시점은 각 product
owner가 소유하고 LDS는 제공된 deployment evidence만 기록한다. O3 Alarm과 O4 Safety HMI는
첫 stable 범위가 아니다.

## 9.1. R4.1 — 계층 계약 잔여 closure

| Field | Value |
| --- | --- |
| Status | `Done` — source contract와 machine gate 완료; 별도 package release·제품 배포를 뜻하지 않음 |
| DRI | Frontend platform · Core/Product owner |
| Required approvers | Design system owner · Robotics/LDS3D owner(경계 변경 시) |
| Dependency | R4 stable 완료; `0.1.x` support window와 호환성 유지 |
| Goal | stable을 막지 않고 남긴 provider·private import·family/Storybook/LDS3D exact-set 부채를 machine gate로 닫는다. |

### 종료 gate

- Core-only negative fixture가 Theme provider 누락을 결정적으로 탐지하고,
  `Core+Theme`, `Core+Theme+Product`, `Core+Theme+Product+Robotics` 조합에서 required semantic
  variable과 provider contract version mismatch가 0이다.
- Product의 Core `components/internal/*` import가 0이고 필요한 helper는 supported Core
  subpath로 승격되거나 Product 내부 구현으로 대체된다. 기존 `0.1.x` public contract는
  호환성 window와 rollback 없이 제거하지 않는다.
- Product family·public export·canonical Storybook page와 Robotics/LDS3D owner 경계를 하나의
  exact-set verifier가 대조해 미분류·중복·충돌이 0이다.
- 위 결과가 green이면 `LAYER_ARCHITECTURE_REFORM_PLAN.md`의 남은 §14 항목과 lifecycle을
  실제 evidence에 맞춰 닫는다.

### 완료 evidence

- Semantic provider contract v1은 Core·Theme·Product runtime source와 pinned Robotics UI
  `0.1.0-rc.33` adapter를 검사한다. Core-only는 Theme 누락과 135개 unresolved variable을
  결정적으로 진단하고, 세 supported composition과 6개 양성·음성 fixture·5개 test가 통과한다.
- Product source의 authority-classified Core internal/private deep import는 0이고 Theme도 같은
  비-Core gate를 통과한다. 공통 helper는 `@lk-design-system/lds-core/brand-authoring`,
  `/component-authoring`, `/density`, `/headless`, `/platform`의 다섯 supported subpath로
  이동했고, 원래 deep path는 export map에서 null-deny된다. Runtime exact export·React 18/19
  type consumer·SSR fixture가 함께 통과한다.
- 단일 owner exact-set verifier가 Product 111 source/119 export/109 canonical Storybook page와
  1개 고정 hidden visual fixture, Robotics 23 source/53 export, LDS3D 8 package/41 qualified
  export를 대조한다. Product source↔canonical page는 107 direct join과 4 exact closed exception으로
  고정되며 26개 positive/negative test에서 unclassified·duplicate·conflict는 0이다.
- durable 계약은 [`TOKEN_GOVERNANCE.md`](TOKEN_GOVERNANCE.md)의 semantic provider interface와
  [`OPERATING_MODEL.md`](OPERATING_MODEL.md)의 supported Core subpath·owner exact-set 규칙으로
  승격했다. [`LAYER_ARCHITECTURE_REFORM_PLAN.md`](LAYER_ARCHITECTURE_REFORM_PLAN.md)는
  `Completed implementation record`로 lifecycle을 닫았다.

이 완료는 `0.1.1` source candidate의 구조 gate에 한정된다. immutable tag와 registry
publish는 아직 없고, 발행된 stable은 계속 `0.1.0`, pinned Robotics는 `0.1.0-rc.33`이다.
`0.1.1`을 immutable tag 또는 package publish로 승격하려면 현재 Core documentation
manifest를 고정한 짝 Robotics release와 release-only current-snapshot gate가 먼저 통과해야 한다.
Portal/Web Viz의 새 candidate 재검증, main integration과 deployment도 계속 `not-attested`다.
외부 Robotics/LDS3D surface는 저장소에 고정된 evidence를 검증한 것이며 해당 저장소의 live
freshness나 새 release를 승인하지 않는다.

## 10. R5 — 산업 행동 계약 O3

| Field | Value |
| --- | --- |
| Status | `Conditional` |
| DRI | alarm truth를 소유한 product owner |
| Required approvers | 해당 product owner · Robotics domain owner · Design system owner |
| Entry trigger | 실제 제품이 alarm acknowledgement·escalation·shelve/suppression·audit lifecycle evidence를 제공한다. |

O1 Monitoring과 O2 Operational control의 현재 readiness를 유지하되, O3는 status primitive가
있다는 이유만으로 시작하거나 지원 주장하지 않는다. 실제 workflow가 들어오면 alarm truth와
policy는 제품이, 반복 가능한 표시·interaction contract만 Product/Robotics가 소유하도록
분해한다.

2026-08-23 workspace trigger 감사에서도 R5는 열리지 않았다. 궁릉 Control의
`BANNER_ACK/RESUME`은 가장 가까운 실제 흐름이지만 acknowledgement가 local React state와
일반 로그에 머문다. Portal source는 default-OFF 경계 안에서 single device alert occurrence의
ACK와 actor/time/reason/authority·immutable Evidence/Audit까지 구현했지만 escalation,
operator-controlled shelve/suppression, 명시적 cleared와 `DeviceAlertCase` lifecycle은 없다.
Web Viz·Daedeok Control은 알림 조회/삭제 수준이며, acknowledgement 일부가 있던 DeviceOps는
decommissioned다.
따라서 machine authority인
[`READINESS.json`](references/robotics/READINESS.json)의 O3 `unverified`·evidence 0을 유지한다.
다음 감사는 제품 owner가 entry trigger의 **전체 묶음**과 actor/time/reason/authority를
영속 evidence로 제출할 때만 실행한다.

### 종료 gate

- acknowledged, active, cleared, suppressed/shelved, escalated 상태와 audit actor/time이 실제
  제품 lifecycle에 연결된다.
- alarm flood, stale truth, offline, permission/authority가 단일 색상 또는 `error` 상태로
  합쳐지지 않는다.
- keyboard, screen reader, focus recovery, destructive/remote command separation이 대표
  workflow에서 검증된다.
- O4 safety certification, risk assessment와 controller validation은 계속 `unsupported`이며
  LDS readiness로 대체하지 않는다.

## 11. R6 — ecosystem lifecycle 정기 심사

| Field | Value |
| --- | --- |
| Status | `Scheduled review` |
| Review date | 2027-01 |
| DRI | Design system owner |
| Required approvers | Frontend platform · 영향받는 satellite owner |

[`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md)가 남긴 slides-ui 존속,
첫 archive 심사, Core 잔류 조건의 데이터화 필요성을 실제 consumer 수·release cadence·
maintenance cost로 재평가한다. 그 전에는 taxonomy 정리만을 이유로 repository를 더 나누거나
합치지 않는다.

2026-08-23 조기 실행 가능성도 확인했지만 review date를 당기지 않았다. 현재
[`SATELLITE_PIN_REPORT.md`](references/SATELLITE_PIN_REPORT.md)는 네 위성의 핀과 생존 상태를
보여줄 뿐, stable 이후 두 번 이상의 release cadence·consumer 변화·유지보수 비용 기간을
제공하지 않는다. 2027-01 심사에서는 최소 두 release cycle의 consumer 수, 마지막 기능
commit/release, pin 격차 기간, CI·문서 유지 비용을 같은 snapshot으로 비교한다. 그 데이터가
쌓이기 전의 split/archive 판단은 일정 실행이 아니라 근거 없는 구조 변경이다.

## 12. R7 — evidence와 운영 건강성

| Field | Value |
| --- | --- |
| Status | `Continuous` |
| DRI | Frontend platform |
| Required approver | Design system owner — lifecycle/status 또는 release policy 변경 시 |

- 각 release에서 release pins, package availability/immutability, generated docs, consumer
  registry, satellite pins와 legacy active reference를 검사한다.
- Storybook IA, repository inventory, docs index처럼 현재성을 주장하는 산출물은 source와
  함께 갱신하거나 historical로 내린다.
- 수동 문서에 source entry/story/version 숫자를 복제하지 않고 generated report에 연결한다.
- [`OPERATIONS_COST_REDUCTION_PLAN.md`](OPERATIONS_COST_REDUCTION_PLAN.md)의 O4는
  [`OPERATIONS.md`](OPERATIONS.md) §7.1의 consumer·maintainer 두 lane을, 보완 내용을 보지
  않은 새 독자가 모두 **질문 0**으로 재시험한 뒤에만 완결로 기록한다. 2026-08-23 3회차의
  consumer 0/maintainer 5 질문을 보완한 뒤, 새 독자의 4회차가 consumer 0/maintainer 0으로
  통과해 이 유한 후속을 완료했다. 다른 OS·Node의 실제 실행은 continuous 환경 관찰이다.
- Adoption contract v2의 full-surface async/interactive hard trigger는 built Storybook index의
  exact story ID 또는 SHA-256으로 고정된 deterministic workflow artifact를 받는다. Workflow
  adapter는 theme×viewport 각 run 안에서 ready와 non-ready state를 순차 검증하고, evidence
  source 뒤에는 report와 artifact carrier 외 repository drift를 허용하지 않는다. Web Viz의
  stable v1 promotion evidence는 pinned historical 기록으로 유지하며, 다음 adoption 재검증에서
  product owner가 v2 report/schema와 workflow pointer를 갱신한다. 이 adapter closure가 기존
  promotion, main integration 또는 deployment를 자동 승격하지 않는다.
- plan이 완료되면 implementation record로 바꾸고 active roadmap에서 제거한다.
- follow-up은 owner·entry trigger·종료 gate·roadmap ID가 없으면 무기한 active로 두지 않는다.

## 13. 기존 계획 문서 정리

| 문서 | 분류 | 현재 disposition | Roadmap 연결 |
| --- | --- | --- | --- |
| [`LAYER_ARCHITECTURE_REFORM_PLAN.md`](LAYER_ARCHITECTURE_REFORM_PLAN.md) | completed implementation record | R0–R4.1 완료; provider/private import/family·Storybook·Robotics·LDS3D exact-set 결정은 durable 계약과 machine gate로 승격 | 없음 |
| [`EXPRESSION_PROFILE_PROPOSAL.md`](EXPRESSION_PROFILE_PROPOSAL.md) | adopted implementation record | `default | ops` 1차 구현 완료 | R3A |
| [`UI_LIBRARY_REFINEMENT_PLAN.md`](UI_LIBRARY_REFINEMENT_PLAN.md) | completed implementation record | source/type/story/overlay 계약 완료; 제품 증거는 registry가 소유 | R2 |
| [`PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md) | completed migration record | package split·Robotics extraction·compat retirement 완료 | R3B·R6 trigger |
| [`SYSTEM_PARTITION_REFORM_PLAN.md`](SYSTEM_PARTITION_REFORM_PLAN.md) | completed architecture record | Phase 0–3 완료 | R6 |
| [`OPERATIONS_COST_REDUCTION_PLAN.md`](OPERATIONS_COST_REDUCTION_PLAN.md) | completed operations record | O-A/B/C와 O4 문서·consumer/maintainer 질문 0 재시험 완료 | R7 continuous health |
| [`DOMAIN_COMPONENT_EXPANSION_PLAN.md`](DOMAIN_COMPONENT_EXPANSION_PLAN.md) | completed implementation record | historical execution evidence | 없음 |
| [`QUALITY_AUDIT_PLAN.md`](QUALITY_AUDIT_PLAN.md) | historical audit baseline | confirmed 47건 resolved/accepted; 현재 backlog 없음 | 없음 |
| [`KOREAN_UI_COPY_REFORM_PLAN.md`](KOREAN_UI_COPY_REFORM_PLAN.md) | completed implementation record | copy contract로 승격 | 없음 |
| [`NAVIGATION_ATOMIZATION_PLAN.md`](NAVIGATION_ATOMIZATION_PLAN.md) | completed implementation record | navigation convention으로 승격 | 없음 |
| [`NAVIGATION_PAGE_DECOMPOSITION_PLAN.md`](NAVIGATION_PAGE_DECOMPOSITION_PLAN.md) | superseded historical plan | current Robotics Path System·Navigation Viewer IA가 이 계획을 대체 | 없음 |
| [`SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md`](SELECT_AND_MESSAGE_FEED_LAYOUT_FOLLOWUP.md) | completed implementation follow-up | LDS 수정, Portal current pin·viewport 적용·workaround 부재·static workflow contract 확인 | 없음 |
| [`PROSE_SURFACE_PROPOSAL.md`](PROSE_SURFACE_PROPOSAL.md) | adopted implementation record | Core Prose로 구현 완료 | 없음 |
| [`LISTING_CARD_PROPOSAL.md`](LISTING_CARD_PROPOSAL.md) | adopted implementation record | shipped | 없음 |
| [`OVERLAY_STATUS_CHIP_PROPOSAL.md`](OVERLAY_STATUS_CHIP_PROPOSAL.md) | adopted implementation record | Core Status family로 구현, current Robotics에서 소비 | 없음 |
| [`TYPE_RAMP_DISPLAY0_PROPOSAL.md`](TYPE_RAMP_DISPLAY0_PROPOSAL.md) | adopted implementation record | shipped; 종결 | 없음 |
| [`TIMELINE_ORIENTATION_PROPOSAL.md`](TIMELINE_ORIENTATION_PROPOSAL.md) | adopted implementation record | Core horizontal Timeline과 Slides 위임 완료 | 없음 |
| [`TABLE_MEDIUM_CONTRACT_PROPOSAL.md`](TABLE_MEDIUM_CONTRACT_PROPOSAL.md) | adopted implementation record | Product Table 계약과 Slides 위임 완료 | R3A의 density 배경만 제공 |

## 14. 새 계획을 여는 기준

새 `*_PLAN.md` 또는 `*_PROPOSAL.md`는 다음 항목이 모두 있을 때만 active로 등록한다.

1. 해결할 현재 문제와 source/evidence
2. owner와 필요한 approver
3. LDS·Product·Robotics 경계
4. roadmap ID 또는 `Conditional` entry trigger
5. 비범위와 rollback
6. 검증 가능한 종료 gate

구현이 끝나면 해당 문서의 status를 `Completed implementation record`, `Adopted` 또는
`Superseded`로 바꾸고, 안정된 규칙은 policy/contract에 승격한다. 현재 backlog는 이
문서에만 남기고 완료 계획·handoff·감사 snapshot에 중복 기록하지 않는다.
