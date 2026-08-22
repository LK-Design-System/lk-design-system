# LDS stable support policy

| Field | Value |
| --- | --- |
| Type | Durable stable support contract |
| Status | Candidate — `0.1.0` is not published or verified yet |
| Owner | Design system owner |
| Intended stable identity | `0.1.0` · `lds-v0.1.0` |
| Support line | `0.1.x` |
| Support matrix | [`STABLE_SUPPORT_MATRIX.md`](STABLE_SUPPORT_MATRIX.md) |
| Rollback contract | [`STABLE_0.1.0_ROLLBACK.md`](STABLE_0.1.0_ROLLBACK.md) |

<!-- lds-stable-identity:start
{
  "schemaVersion": 1,
  "kind": "lds-stable-contract-identity",
  "contract": "support-policy",
  "status": "candidate-not-published",
  "ldsVersion": "0.1.0",
  "releaseTag": "lds-v0.1.0",
  "packages": [
    { "name": "@lk-design-system/lds-core", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-theme", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-product", "version": "0.1.0" }
  ],
  "supportMatrix": "docs/STABLE_SUPPORT_MATRIX.md"
}
lds-stable-identity:end -->

이 문서는 첫 stable package set의 지원 약속을 미리 고정한다. 현재 상태는
`candidate-not-published`다. `0.1.0`이 실제 stable이라는 주장은 exact tag, registry
availability와 structured release evidence가 검증되고
`LDS_CONSUMER_REGISTRY.json`이 별도 변경될 때만 성립한다. 문서가 존재하거나 candidate build가
통과한 것만으로 stable release, 소비 제품 통합 또는 production deployment를 의미하지 않는다.

## 지원 단위

Core, Theme, Product는 위 machine identity에 적힌 세 package를 같은 exact version으로 설치하는
하나의 atomic package set이다. Theme과 Product의 내부 LDS dependency도 같은 stable version을
사용해야 한다. Mixed RC/stable 또는 mixed patch set은 지원하지 않는다. Robotics UI는 별도
저장소와 release identity를 가진 satellite package이므로 이 stable set에 포함되지 않는다.

지원 범위와 실제 검증 수준은 [`STABLE_SUPPORT_MATRIX.md`](STABLE_SUPPORT_MATRIX.md)가 정본이다.
Package stable과 소비 제품 adoption/deployment는 독립 판정이며, Portal 또는 Web Viz의
`workflow-verified` evidence가 stable package publish나 rollout을 자동 승인하지 않는다.

## `0.1.x` 호환성 약속

- `0.1.x` patch release는 기존 public export, prop, token 이름을 의도적으로 깨지 않는다.
- R3B에서 Core로 이동한 `Link`, `Popover`, date/single-value input, progress/measurement export의
  Product root/deep import는 모든 `0.1.x` release에서 compatibility re-export로 유지한다.
- 위 compatibility export는 `0.2.0`보다 먼저 제거할 수 없다. `0.2.0`에서도 registered consumer
  scan zero, owner 승인과 breaking release note가 모두 있어야 제거할 수 있다.
- Deprecation은 즉시 제거 예고가 아니다. 신규 코드는 canonical Core import를 사용하고 기존
  Product import는 지원 기간 안에 단계적으로 옮긴다.
- `0.1.x`에서 unavoidable security 또는 correctness fix가 observable behavior를 바꿔야 하면
  release note, migration 영향과 rollback target을 함께 기록한다.

이 정책은 시간 기반 SLA를 약속하지 않는다. `0.1.x`의 종료는 별도 owner 결정과 durable
deprecation/EOL 기록 없이는 추정하지 않는다.

## 지원되는 변경과 지원되지 않는 변경

| Change | `0.1.x` policy |
| --- | --- |
| 결함·접근성·보안 수정 | Patch release, 검증 evidence와 release note 필요 |
| Additive component/export/token | 허용. 기존 surface와 package layering을 유지해야 함 |
| R3B canonical Core import로 migration | 권장. Product compatibility import도 계속 동작 |
| Public export/prop/token 제거 또는 의미 변경 | 금지. Breaking review와 `0.2.0` 이상 필요 |
| 이미 발행한 tag/package 덮어쓰기 | 금지. 새 patch version을 발행 |
| Core/Theme/Product 일부만 다른 version으로 교체 | 지원하지 않음 |
| Product production rollout | 해당 product owner의 별도 승인·evidence 필요 |

## Stable 활성화 gate

Stable registry 전환 전에 다음이 모두 충족되어야 한다.

1. `0.1.0` clean-clone build와 package-set 검증이 통과한다.
2. `lds-v0.1.0` tag가 source commit에 immutable하게 고정된다.
3. Core, Theme, Product `0.1.0`이 registry에서 조회되고 각 package의 integrity가 기록된다.
4. stable release evidence가
   [`LDS_STABLE_RELEASE_EVIDENCE.schema.json`](references/adoption/releases/LDS_STABLE_RELEASE_EVIDENCE.schema.json)을
   통과한다.
5. 이 문서, support matrix, rollback 문서의 machine identity를
   `published-verified`로 바꾸고 실제 release evidence와 같은 version/tag/package set인지 checker가
   확인한다.
6. Package release 판정만 갱신한다. Consumer adoption과 deployment는 각 owner evidence가 생길
   때만 별도로 갱신한다.

실패하거나 publish를 중단하면 registry의 기존 RC 판정을 유지하고
[`STABLE_0.1.0_ROLLBACK.md`](STABLE_0.1.0_ROLLBACK.md)를 따른다.
