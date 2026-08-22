# LDS `0.1.0` stable rollback contract

| Field | Value |
| --- | --- |
| Type | Durable release rollback runbook |
| Status | Candidate — `0.1.0` has not been published or verified |
| Owner | Design system owner · 해당 consumer product owner |
| Intended stable identity | `0.1.0` · `lds-v0.1.0` |
| Current verified fallback | `0.1.0-rc.69.30` · `lds-v0.1.0-rc.69.30` |
| Support policy | [`STABLE_SUPPORT_POLICY.md`](STABLE_SUPPORT_POLICY.md) |

<!-- lds-stable-identity:start
{
  "schemaVersion": 1,
  "kind": "lds-stable-contract-identity",
  "contract": "rollback",
  "status": "candidate-not-published",
  "ldsVersion": "0.1.0",
  "releaseTag": "lds-v0.1.0",
  "packages": [
    { "name": "@lk-design-system/lds-core", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-theme", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-product", "version": "0.1.0" }
  ],
  "fallbackVersion": "0.1.0-rc.69.30",
  "fallbackTag": "lds-v0.1.0-rc.69.30"
}
lds-stable-identity:end -->

이 runbook은 exact `0.1.0` stable identity를 대상으로 하지만 현재는 pre-publish candidate다.
문서 자체는 `0.1.0` package, tag 또는 제품 배포가 존재한다는 evidence가 아니다. 현재 registry가
검증한 fallback은 Core/Theme/Product `0.1.0-rc.69.30` atomic set이다.

## 불변 원칙

- 이미 발행한 `lds-v*` tag를 이동·삭제하거나 같은 package version을 덮어쓰지 않는다.
- Core, Theme, Product는 항상 같은 exact version의 set으로 rollback한다.
- Package rollback과 product production rollback은 별도 owner 결정이다.
- Stable release가 잘못되었으면 registry history를 지우지 않고 새 patch(`0.1.1` 이상)로 수정한다.
- R3B Product compatibility import는 전체 `0.1.x`에서 유지되므로 import 경로를 즉시 되돌리지
  않아도 package-set rollback이 가능하다.

## Scenario A — publish 전 중단

Tag 또는 세 package 중 하나라도 publish되기 전에 gate가 실패하면 stable promotion을
중단한다.

1. `LDS_CONSUMER_REGISTRY.json`의 current RC release identity를 유지한다.
2. `0.1.0` availability를 `verified`로 기록하지 않는다.
3. 이 문서와 support 문서의 identity status를 `candidate-not-published`로 유지한다.
4. 실패 원인을 수정한 뒤 clean clone과 package availability probe를 처음부터 다시 실행한다.

## Scenario B — 일부 package만 발행됨

Stable workflow가 Core/Theme/Product 일부만 발행하고 실패하면 그 version을 완성된 stable set으로
승격하지 않는다. 이미 발행된 artifact는 지우거나 덮어쓰지 않는다. Release evidence에 partial
상태를 기록하고, 안전한 새 patch version을 선택해 세 package 전체를 다시 검증한다. Consumer는
partial set을 설치하지 않는다.

## Scenario C — `0.1.0` 발행 후 package 결함

1. Release evidence, affected export/token과 재현 절차를 고정한다.
2. 신규 consumer promotion을 중지하되 기존 deployment 상태를 추정해 바꾸지 않는다.
3. 각 consumer owner가 현재 package pin과 deployment를 확인한다.
4. 필요한 consumer만 Core/Theme/Product를 함께
   `0.1.0-rc.69.30`(또는 그 시점 registry에 기록된 더 최신 verified fallback)으로 되돌린다.
5. Lockfile, vendored artifact checksum, install, production build와 대표 workflow를 다시 검증한다.
6. Consumer registry에는 실제 product-owner evidence가 있는 경우에만 deployment를
   `rolled-back`으로 갱신한다.
7. LDS 수정은 기존 `0.1.0`을 변경하지 않고 새 patch로 발행한다.

Registry install을 사용하는 consumer의 복구 예시는 다음과 같다. Vendored tgz를 사용하는
consumer는 product 저장소의 pinned artifact/checksum 절차를 우선한다.

```sh
npm install --save-exact \
  @lk-design-system/lds-core@0.1.0-rc.69.30 \
  @lk-design-system/lds-theme@0.1.0-rc.69.30 \
  @lk-design-system/lds-product@0.1.0-rc.69.30
```

명령 실행만으로 rollback 완료를 선언하지 않는다. Exact package version·integrity, production
build, 해당 consumer의 workflow/accessibility smoke와 product-owner 판정을 evidence로 남긴다.

## Stable 활성화 때 갱신할 항목

실제 `0.1.0` publish 검증 후에만 다음을 한 release change에서 함께 갱신한다.

1. 세 stable 문서의 machine identity status를 `published-verified`로 바꾼다.
2. Structured stable release evidence에 exact source commit, tag resolution, package integrity와
   이 support/rollback 경로를 기록한다.
3. Registry의 `ldsVersion`, `packageRelease`와 consumer package pin/evidence를 실제 검증 결과에
   맞춘다. Consumer stage/deployment는 자동 승격하지 않는다.
4. `npm run check:adoption-registry`로 문서와 evidence가 같은 identity인지 검증한다.
