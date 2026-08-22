# LDS `0.1.0` stable rollback contract

| Field | Value |
| --- | --- |
| Type | Durable release rollback runbook |
| Status | Current — `0.1.0` package set published and verified |
| Owner | Design system owner · 해당 consumer product owner |
| Last reviewed | 2026-08-23 |
| Stable identity | `0.1.0` · `lds-v0.1.0` |
| Current verified fallback | `0.1.0-rc.69.31` · `lds-v0.1.0-rc.69.31` |
| Support policy | [`STABLE_SUPPORT_POLICY.md`](STABLE_SUPPORT_POLICY.md) |
| Release evidence | [`LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json`](references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json) |

<!-- lds-stable-identity:start
{
  "schemaVersion": 1,
  "kind": "lds-stable-contract-identity",
  "contract": "rollback",
  "status": "published-verified",
  "ldsVersion": "0.1.0",
  "releaseTag": "lds-v0.1.0",
  "packages": [
    { "name": "@lk-design-system/lds-core", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-theme", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-product", "version": "0.1.0" }
  ],
  "fallbackVersion": "0.1.0-rc.69.31",
  "fallbackTag": "lds-v0.1.0-rc.69.31"
}
lds-stable-identity:end -->

이 runbook은 발행·검증된 exact `0.1.0` stable package identity를 대상으로 한다. Package publish
evidence는 [`LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json`](references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json)이
소유하며 제품 배포를 의미하지 않는다. 검증된 fallback은 Core/Theme/Product
`0.1.0-rc.69.31` atomic set이다.

## 불변 원칙

- 이미 발행한 `lds-v*` tag를 이동·삭제하거나 같은 package version을 덮어쓰지 않는다.
- Core, Theme, Product는 항상 같은 exact version의 set으로 rollback한다.
- Package rollback과 product production rollback은 별도 owner 결정이다.
- Stable release가 잘못되었으면 registry history를 지우지 않고 새 patch(`0.1.1` 이상)로 수정한다.
- R3B Product compatibility import는 전체 `0.1.x`에서 유지되므로 import 경로를 즉시 되돌리지
  않아도 package-set rollback이 가능하다.

## Scenario A — 향후 publish 전 중단

후속 stable patch의 tag 또는 세 package 중 하나라도 publish되기 전에 gate가 실패하면 해당
promotion을 중단한다. 이미 검증된 `0.1.0` package identity는 그대로 보존한다.

1. `LDS_CONSUMER_REGISTRY.json`의 현재 verified release identity를 유지한다.
2. 실패한 신규 patch availability를 `verified`로 기록하지 않는다.
3. 기존 `0.1.0` tag, package와 `published-verified` evidence를 이동·덮어쓰지 않는다.
4. 실패 원인을 수정한 뒤 신규 patch의 clean clone과 package availability probe를 처음부터 다시 실행한다.

## Scenario B — 향후 일부 package만 발행됨

Stable workflow가 Core/Theme/Product 일부만 발행하고 실패하면 그 version을 완성된 stable set으로
승격하지 않는다. 이미 발행된 artifact는 지우거나 덮어쓰지 않는다. Release evidence에 partial
상태를 기록하고, 안전한 새 patch version을 선택해 세 package 전체를 다시 검증한다. Consumer는
partial set을 설치하지 않는다.

## Scenario C — `0.1.0` 발행 후 package 결함

1. Release evidence, affected export/token과 재현 절차를 고정한다.
2. 신규 consumer promotion을 중지하되 기존 deployment 상태를 추정해 바꾸지 않는다.
3. 각 consumer owner가 현재 package pin과 deployment를 확인한다.
4. 필요한 consumer만 Core/Theme/Product를 함께
   `0.1.0-rc.69.31`(또는 그 시점 registry에 기록된 더 최신 verified fallback)으로 되돌린다.
5. Lockfile, vendored artifact checksum, install, production build와 대표 workflow를 다시 검증한다.
6. Consumer registry에는 실제 product-owner evidence가 있는 경우에만 deployment를
   `rolled-back`으로 갱신한다.
7. LDS 수정은 기존 `0.1.0`을 변경하지 않고 새 patch로 발행한다.

Registry install을 사용하는 consumer의 복구 예시는 다음과 같다. Vendored tgz를 사용하는
consumer는 product 저장소의 pinned artifact/checksum 절차를 우선한다.

```sh
npm install --save-exact \
  @lk-design-system/lds-core@0.1.0-rc.69.31 \
  @lk-design-system/lds-theme@0.1.0-rc.69.31 \
  @lk-design-system/lds-product@0.1.0-rc.69.31
```

명령 실행만으로 rollback 완료를 선언하지 않는다. Exact package version·integrity, production
build, 해당 consumer의 workflow/accessibility smoke와 product-owner 판정을 evidence로 남긴다.

## Stable package 활성화 결과와 consumer 후속

`0.1.0` package release에서 다음 두 항목은 완료됐다.

1. 세 stable 문서의 machine identity status를 `published-verified`로 고정했다.
2. Structured stable release evidence에 exact source commit, tag resolution, package integrity와
   이 support/rollback 경로를 기록했다.

Consumer registry 갱신은 별도 후속이다. Registry의 `ldsVersion`, `packageRelease`와 consumer
package pin/evidence는 두 consumer의 exact stable 재검증이 모두 끝난 뒤 실제 결과에 맞춘다.
Consumer stage/deployment는 자동 승격하지 않으며, 그 변경에서 `npm run
check:adoption-registry`로 문서·evidence·consumer identity를 함께 검증한다.
