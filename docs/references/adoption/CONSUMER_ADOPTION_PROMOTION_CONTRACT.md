# LDS consumer adoption promotion contract

| Field | Value |
| --- | --- |
| Type | Stable machine-contract companion |
| Status | Current |
| Owner | Frontend platform · Design system owner · 해당 product owner |
| Last reviewed | 2026-08-23 |
| Schema version | `2` |
| Machine authority | [`LDS_CONSUMER_REGISTRY.schema.json`](LDS_CONSUMER_REGISTRY.schema.json) · [`LDS_CONSUMER_ATTESTATION.schema.json`](LDS_CONSUMER_ATTESTATION.schema.json) |
| Current register | [`LDS_CONSUMER_REGISTRY.json`](LDS_CONSUMER_REGISTRY.json) |

이 계약은 LDS package release, 소비 제품의 LDS workflow 검증, 실제 제품 배포를 서로 다른
판정으로 유지한다. 세 판정 사이에는 자동 승격이 없다.

## 세 개의 독립 판정

| 판정 | machine field | 의미 | 암시하지 않는 것 |
| --- | --- | --- | --- |
| Package release | `packageRelease.channel` · `packageRelease.availability` | 고정 LDS package set이 RC인지 stable인지, 그 artifact/tag 가용성을 검증했는지 기록한다. | 소비 제품의 build·workflow·배포 |
| Consumer adoption | `entries[].stage` | pinned source commit에서 LDS wiring, production build, 대표 workflow까지 단계별로 검증했다. | stable package 또는 제품 배포 |
| Product deployment | `entries[].deployment.status` | product owner가 rollout-ready·deployed·rolled-back evidence를 제출했다. | LDS stable 또는 `workflow-verified` |

따라서 stable package를 배포하지 않은 제품, RC를 대상으로 `workflow-verified`인 제품,
`workflow-verified`지만 아직 배포하지 않은 제품을 모두 정확히 표현할 수 있다.

## Version과 package release

`ldsVersion`은 다음 두 형식만 허용한다.

- RC: `MAJOR.MINOR.PATCH-rc.N[.N...]` — 예: `0.1.0-rc.69.29`
- Stable: `MAJOR.MINOR.PATCH` — 예: `1.0.0`

`packageRelease.channel`은 version에서 추론되는 channel과 일치해야 한다. `availability`가
`verified`이면 exact `lds-v<version>` tag와 LDS 저장소 안에 실제 존재하는 regular evidence
file 경로가 필요하다. Stable은 추가로 저장소 안에 실제 존재하는 regular file인 support
policy와 rollback artifact를 가져야 한다. Core·Theme·Product package pin은 모두 같은
`ldsVersion`을 사용하며 artifact filename에도 해당 version이 들어가야 한다.

Stable package 판정은 아래 조건만 닫는다.

1. stable 형식의 release identity
2. exact immutable tag와 availability evidence
3. Core·Theme·Product artifact checksum
4. support policy
5. migration/rollback artifact

소비 제품 stage와 deployment는 이 목록에 포함되지 않는다.

## Consumer stage 승격

모든 stage는 `evidenceFreshness: current`, 유효하고 registry `generatedAt`보다 미래가 아닌
날짜의 v2 attestation, stage check 수 이상의 evidence reference를 요구한다. 과거에 수집한
근거도 product owner가 `current`로 유지하는 동안 사용할 수 있다. `stale`은 원인을 기록할 수
있지만 checker를 통과하지 못하므로 current evidence를 다시 수집하기 전에는 승격 상태를
유지할 수 없다.

| Stage | 필수 passed check | 추가 gate |
| --- | --- | --- |
| `wired` | `install` · `sourceContract` | Core·Theme·Product pin과 current attestation |
| `build-verified` | wired 전체 · `productionBuild` | production artifact를 만드는 실제 제품 build |
| `workflow-verified` | build 전체 · `workflowSmoke` · `accessibility` | clean-clone 재현, exact source commit, current product-owner 승인 |

`workflowSmoke`는 로그인 페이지가 열리는지만 보는 일반 health check가 아니라 product owner가
선택한 대표 workflow여야 한다. Accessibility도 LDS 단독 Storybook 결과로 제품 검증을
대체하지 않고 그 workflow와 지원 viewport/theme 범위를 포함한다.

### Clean reproducibility

`worktree`는 evidence 수집 당시 작업 디렉터리 상태를 기록하는 관찰 필드다. `dirty`인
worktree에서 얻은 build evidence를 clean 재현으로 해석하지 않는다. `workflow-verified`에는
별도 `cleanReproducibility`가 필요하며 다음을 모두 고정한다.

- `mode: clean-clone`
- entry와 같은 40자 `sourceCommit`
- 유효하고 registry `generatedAt`보다 미래가 아닌 `verifiedAt`
- install/build/workflow를 재실행한 command
- 재현 결과 evidence

### Product-owner approval

`workflow-verified`에는 `productOwnerApproval.status: approved`가 필요하다. 승인에는 owner,
유효하고 registry `generatedAt`보다 미래가 아닌 날짜, 제품 저장소 안의 reviewable evidence가
있어야 한다. `approvedAt`은 attestation `generatedAt`과 clean reproduction `verifiedAt`보다
빠를 수 없다. 검증 결과가 만들어지기 전에 승인을 기록할 수 없기 때문이다. LDS owner가 제품
workflow나 rollout 결정을 대신 승인하지 않는다.

## Product deployment

모든 consumer entry는 deployment 상태를 명시한다.

- `not-attested`: 배포 여부를 추정할 수 있는 product-owner evidence가 registry에 없다.
- `rollout-ready`: 제품 owner가 rollout과 rollback 준비를 승인했다.
- `deployed`: 특정 environment에 실제 배포한 evidence가 있다.
- `rolled-back`: 같은 release identity에서 rollback을 실행한 evidence가 있다.

`not-attested` 이외 상태는 owner, 유효하고 registry `generatedAt`보다 미래가 아닌
`verifiedAt`, environment, evidence와 rollback plan을 모두 요구한다. `workflow-verified`
승격은 deployment를 요구하거나 암시하지 않는다.

## Attestation 경계

Attestation은 registry schema를 재사용하지 않는다. 각 파일은 별도
[`LDS_CONSUMER_ATTESTATION.schema.json`](LDS_CONSUMER_ATTESTATION.schema.json)을 가리키며
consumer ID, profile, 실행 check와 evidence를 기록한다. Registry checker는 stage에 필요한
check가 attestation에도 `passed`로 존재하는지 확인한다. `workflow-verified` attestation은
entry와 같은 `sourceCommit`도 명시해야 한다.

## 갱신 절차

1. 제품 owner가 고정 source commit과 package checksum을 선택한다.
2. 같은 commit에서 install·source contract를 실행해 `wired` evidence를 만든다.
3. production build를 통과하면 `build-verified`로 올린다.
4. clean clone에서 대표 workflow와 accessibility를 실행한다.
5. product-owner approval을 첨부한 뒤에만 `workflow-verified`로 올린다.
6. package release channel은 LDS release evidence로 별도 갱신한다.
7. rollout-ready/deployed/rolled-back은 제품 owner evidence가 생길 때만 별도 갱신한다.
8. 아래 checker와 negative contract test를 모두 통과시킨다.

```sh
npm run check:adoption-registry
node --test scripts/check-consumer-adoption-registry.test.mjs
```

## v1에서 v2로의 변경

v2는 기존 의미를 조용히 바꾸지 않는다. Registry와 attestation 모두 `schemaVersion: 2`로
올리고 다음을 추가했다.

- RC·stable을 함께 표현하는 version 문법과 별도 `packageRelease`
- stage별 passed check와 current attestation 강제
- `workflow-verified` 전용 clean reproducibility와 product-owner approval
- consumer stage와 분리된 mandatory `deployment.status`
- registry와 분리된 attestation schema

2026-08-22 v2 도입 snapshot에서 package `0.1.0-rc.69.30`은 `release-candidate`이며
availability가 `verified`다. Portal/default
`c2e39f3c9f89a52cdb0c5a58727050afe20a82b9`와 Web Viz/ops
`542639f2fea109e78f052e730ac30072cad79a6c`는 각각 install·source contract·production
build·대표 workflow·accessibility와 exact source의 clean-clone 재현을 통과했다. Portal
approval evidence commit `50c2d9b`와 Web Viz approval evidence commit `4dad154`는
2026-08-22 해당 product owner와 design-system owner 승인을 기록하며, 두 consumer stage는
`workflow-verified`다. 이 승인은 pinned consumer adoption에 한정되고 main integration,
package stable, rollout 또는 production deployment를 승인하지 않는다. 두 제품 deployment는
별도 owner evidence가 없어 `not-attested`다.

2026-08-23 current stable register에서 Core·Theme·Product `0.1.0`은 `stable`이고 availability는
`verified`다. Package evidence는 immutable `lds-v0.1.0` tag, published metadata와 실제
artifact checksum, support policy와 rollback contract를 같은 identity로 연결한다.
Portal/default `949a1261e8f61842a42d07ca4b62c7ff71cc45da`와 Web Viz/ops
`8f493fd3475eb6c7516fdf7d3aca3265c2b7db87`는 exact stable artifact로 install·source
contract·production build·대표 workflow·accessibility와 clean-clone 재현을 통과했다. Web Viz는
Robotics UI `0.1.0-rc.33`도 함께 고정한다. 두 제품의 2026-08-23 stable approval evidence가
해당 source를 `workflow-verified`로 승인한다. 이 승격은 candidate branch의 main integration,
rollout-ready 또는 production deployment를 승인하지 않으며 두 deployment는 계속
`not-attested`다.
