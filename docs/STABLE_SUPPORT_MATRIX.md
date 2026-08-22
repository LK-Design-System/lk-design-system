# LDS stable support matrix

| Field | Value |
| --- | --- |
| Type | Durable support matrix |
| Status | Current — stable package availability published and verified |
| Owner | Design system owner |
| Last reviewed | 2026-08-23 |
| Stable identity | `0.1.0` · `lds-v0.1.0` |
| Policy | [`STABLE_SUPPORT_POLICY.md`](STABLE_SUPPORT_POLICY.md) |
| Release evidence | [`LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json`](references/adoption/releases/LDS_STABLE_0.1.0_RELEASE_EVIDENCE.json) |

<!-- lds-stable-identity:start
{
  "schemaVersion": 1,
  "kind": "lds-stable-contract-identity",
  "contract": "support-matrix",
  "status": "published-verified",
  "ldsVersion": "0.1.0",
  "releaseTag": "lds-v0.1.0",
  "packages": [
    { "name": "@lk-design-system/lds-core", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-theme", "version": "0.1.0" },
    { "name": "@lk-design-system/lds-product", "version": "0.1.0" }
  ]
}
lds-stable-identity:end -->

이 matrix는 LDS package가 지원하는 범위와 현재 evidence가 실제로 입증한 범위를 구분한다.
Core, Theme, Product `0.1.0`의 atomic package availability와 integrity는 `published-verified`다.
아래 consumer와 deployment 결론은 package 판정과 독립이며 exact stable consumer evidence 없이는
자동 승격하지 않는다.

## Package set

| Surface | `0.1.x` support | Constraint |
| --- | --- | --- |
| `@lk-design-system/lds-core` | Supported | DOM primitive, foundation, Core style/token entry |
| `@lk-design-system/lds-theme` | Supported | 같은 exact Core version 필요 |
| `@lk-design-system/lds-product` | Supported | 같은 exact Core/Theme version 필요 |
| Core/Theme/Product mixed versions | Unsupported | 세 package를 atomic set으로 upgrade/rollback |
| `@lk-design-system/lds-robotics-ui` | Separately governed | Robotics 저장소의 별도 version/evidence를 따름 |
| Legacy aggregate/editorial package | Unsupported | active consumer reference는 zero여야 함 |

## Consumer runtime and authoring surface

| Dimension | Supported | Evidence boundary |
| --- | --- | --- |
| React | `>=18 <20` | React 18/19 type-consumer matrix와 package peer contract |
| Module delivery | ESM | 각 package의 `exports`와 `dist` entry 사용 |
| Styling | Explicit Core → Theme → Product stylesheet order | 누락 또는 역순 import는 지원하지 않음 |
| Expression profile | `default`, `ops` | profile은 product type이 아니라 표현/밀도 정책 축 |
| Theme mode | light, dark | 소비 제품이 지원한다고 선언한 mode만 제품 evidence 대상 |
| TypeScript | Published declaration surface | exact consumer compiler version의 일반 보증은 아님 |
| Browser | Current CI Playwright Chromium surface | Firefox, WebKit, embedded WebView는 별도 evidence 전까지 not-attested |
| Release toolchain | Node.js 22, npm 10.9.2 | package runtime 요구가 아니라 canonical build/publish 환경 |
| Package registry | GitHub Packages restricted scope | 인증·권한은 소비 조직의 운영 책임 |

## Stable consumer evidence boundary

| Consumer | Profile/theme | Current evidence | Stable `0.1.0` conclusion |
| --- | --- | --- | --- |
| LK Portal | `default` · light | Current registry의 pinned RC workflow evidence | exact stable install/build/workflow 재검증 전에는 not-attested |
| LK Web Viz | `ops` · light/dark | Current registry의 pinned RC workflow evidence | exact stable install/build/workflow 재검증 전에는 not-attested |

Package stable publish는 완료됐지만 기존 RC consumer evidence가 exact `0.1.0` artifact evidence를
대체하지 않는다. Consumer package pin을 바꿀지는 각 product owner가 결정하며, production
deployment는 그 이후에도 별도 판정이다.

## 품질 판정의 한계

- Storybook, package build, type, accessibility와 visual checks는 package quality evidence다.
- Accessibility automation 통과는 제품 전체의 WCAG 인증이 아니다.
- 한 browser engine의 통과를 미검증 engine 지원으로 확장하지 않는다.
- Clean-clone package publish 검증을 product backend, route, data 또는 deployment 검증으로
  해석하지 않는다.
- Matrix 밖 환경은 자동으로 unsupported가 아니라 `not-attested`다. 지원 추가에는 재현 가능한
  consumer evidence와 owner 결정을 남긴다.
