# Design system operating model

| Field | Value |
| --- | --- |
| Type | Governance policy |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-18 |

디자인 시스템은 컴포넌트 묶음이 아니라 변경을 안전하게 반복하는 운영 체계입니다. 이 문서는 LK 디자인 시스템의 기여, 릴리즈, 마이그레이션 기준을 정의합니다.

## Ownership

| 영역 | Owner role | 책임 |
| --- | --- | --- |
| Foundations | Design system owner | token, typography, icon, brand decision |
| Components | Component owner | API, state matrix, accessibility, visual parity |
| Domain component contracts | Product design + engineering | status semantics, safety copy, units |
| Tooling | Frontend platform | build, Storybook, checks, package release |
| Docs | Design system owner | migration guide, release notes, usage guidance |

### Layer ownership contract

모든 public export와 내부 JavaScript 모듈은 `core`, `theme`, `product`,
`robotics` 중 정확히 하나의 owner layer를 갖습니다. Owner layer는 코드와
릴리즈 경계이고, `direct-wds`, `wds-adjacent`, `theme-override`,
`product-extension`, `robotics-extension` provenance는 설계 근거입니다. WDS
근거가 있다는 사실만으로 Core 소유가 되지 않습니다.

허용 의존 방향은 다음과 같습니다.

- Core → Core
- Theme → Core, Theme
- Product → Core, Product
- Robotics → Core, Product, Robotics

`PUBLIC_EXPORT_CLASSIFICATION.json`이 export와 내부 모듈 소유권의 단일
machine-readable authority입니다. `npm run check:layers`는 누락·중복·stale
분류, 금지된 역방향 의존, 계층 순환을 차단합니다. 새 코드는
`/core`, `/theme`, `/product`, `/robotics` subpath를 사용하며 기존 aggregate
root와 `components/*`는 호환 표면으로 유지합니다.

이 저장소의 package/type/consumer 검사는 LDS 자체의 경계를 증명합니다.
작업 중인 제품 저장소의 실제 채택이나 production workflow 지원을 증명하지
않으며, 제품 검증 전에는 해당 상태를 `unverified` 또는 `deferred`로 유지합니다.

## Contribution path

1. Problem statement: 제품 업무에서 어떤 반복 문제를 해결하는지 쓴다.
2. Review plan: `docs/COMPONENT_WORKFLOW.md`의 제품 workflow, icon/asset/map symbol, 설계 근거 gate를 적용한다.
3. Contract draft: API, states, tokens, accessibility와 owner layer/provenance를 표로 쓴다.
4. Prototype: Storybook public story와 필요한 hidden parity story를 만든다.
5. Review: design, accessibility, engineering, domain safety, 실제 LK 제품 채택 관점으로 본다.
6. Release: changelog, migration note, package version을 갱신한다.

발행된 version 문자열은 불변이다. 모든 Core·Theme·Product·compat release set은
`lds-v<version>` tag가 가리키는 단일 source commit에서 만들고, 이미 registry에
존재하는 version은 다시 publish하지 않는다. package bytes가 바뀌면 release
candidate 단계에서도 반드시 새 version을 사용한다.

## Change categories

| Category | 예시 | 요구 문서 |
| --- | --- | --- |
| Patch | bug fix, visual alignment, docs typo | 변경 요약 |
| Minor | 새 component, 새 token, 새 pattern | Storybook story, API/state matrix |
| Deprecated | 이전 prop/token 대체 | deprecation note, migration path |
| Breaking | prop 제거, token 의미 변경, CSS contract 변경 | migration guide, release note, visual diff |

## Pull request checklist

- `docs/COMPONENT_WORKFLOW.md`의 완료 조건과 검토 근거를 PR 요약에 남겼다.
- 기존 style/token/component pattern을 먼저 사용했다.
- 새 icon을 만들기 전에 `Icon` registry를 확인했다.
- 신규·변경 icon/asset/map symbol은 일반 관례, geometry, zoom·collision, 실제 제품 문맥을 검토했다.
- LK Web Viz, LK Control Full Daedeok, LK Portal의 실제 workflow coverage를 판정하거나 `not applicable` 이유를 남겼다.
- component prompt 문서를 갱신했다.
- Storybook public surface가 너무 넓어지지 않도록 페이지를 분리했다.
- accessibility contract와 keyboard behavior를 확인했다.
- public export와 내부 module ownership이 `npm run check:layers`를 통과한다.
- visual parity 또는 smoke check가 필요한 변경은 검증을 남겼다.
- breaking/deprecated 변경은 migration note를 남겼다.

## Release checklist

- `pnpm run check` 또는 동등한 release gate가 통과한다.
- aggregate root가 네 계층 entrypoint의 정확한 합집합이고 실제 pack에서 ESM/CJS/type subpath가 확인된다.
- Storybook build 산출물이 생성된다.
- public story 수와 hidden parity story 수가 의도와 맞다.
- changed components의 API/state matrix가 갱신됐다.
- token 변경이 있으면 `docs/TOKEN_GOVERNANCE.md` 기준을 만족한다.
- migration guide가 필요한 변경은 release note에 링크한다.

## Release note / commit 톤

WDS Makers' Principle을 코드 맥락으로 옮긴 규칙 (근거:
`docs/references/wds/WDS_NONCOMPONENT_RECONCILIATION.md`). 사소한 변경이라도
빠르고 읽기 쉽게 기록한다. 내부/도구 용어 대신 **무엇이 어떻게 바뀌는지**를
사용자 언어로 쓴다.

- 이렇게 쓰지 않는다: "Constraint 속성을 Left Top으로 변경", "min-width 반영".
- 대신 이렇게: "정렬 기본값으로 변경", "최소 너비 추가", "구조 최적화".
- 작업 파일에 영향 없는 수정: "잘못된 속성을 바로잡습니다 / 라이브러리를 업데이트합니다".

## Migration guide format

```md
# Migration: <short title>

## What changed
## Why
## Before
## After
## Affected components/tokens
## Removal timeline
## Verification
```
