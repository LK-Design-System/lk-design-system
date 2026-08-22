# Design system operating model

| Field | Value |
| --- | --- |
| Type | Governance policy |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-22 |

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

`PUBLIC_EXPORT_CLASSIFICATION.json`은 기존 export·내부 모듈 projection과 WDS
provenance를 보존합니다. Product family의 live taxonomy는
[`PRODUCT_FAMILY_CONTRACT.json`](references/architecture/PRODUCT_FAMILY_CONTRACT.json)이
소유하고, Theme 표현 축은
[`EXPRESSION_PROFILE_CONTRACT.json`](references/architecture/EXPRESSION_PROFILE_CONTRACT.json)이
소유합니다. `npm run check:layers`는 계층 경계와 Product family 누락·중복을
함께 차단하고, `npm run check:expression-profile`은 Theme provider와 profile
축의 정합성을 검사합니다. 새 코드는
`/core`, `/theme`, `/product`, `/robotics` subpath를 사용하며 기존 aggregate
root와 `components/*`는 호환 표면으로 유지합니다.

이 저장소의 package/type/consumer 검사는 LDS 자체의 경계를 증명합니다.
작업 중인 제품 저장소의 실제 채택이나 production workflow 지원을 증명하지
않으며, 제품 검증 전에는 해당 상태를 `unverified` 또는 `deferred`로 유지합니다.

## Adoption strategy — 선행 구축 베팅 (2026-08-16 명시)

LDS는 제품에서 추출되지 않았다. **제품보다 앞서 짓는다.** 이것은 사고가
아니라 명시적 베팅이며, 성립 조건과 해제 조건을 여기 기록한다. 이 절이
없으면 추측 시대의 규칙이 제품 채택 후에도 관성으로 영속한다 — 그것을 막는
것이 이 절의 존재 이유다.

**성립 조건**: 에이전트 저작으로 구축·검증 비용이 충분히 낮다. 실측 근거 —
motion 이식이 스타일 오버라이드 0으로 성립했고(SYSTEM_PARTITION_REFORM_PLAN
§1.1), 위성 4개와 검사 스위트를 유지보수자 1인이 굴리고 있다.

**대가**: 실사용 피드백이 없으므로 제품 요구를 추측으로 인코딩한다. 그
추측의 보정 장치가 현행 무거운 거버넌스다 — 신규 컴포넌트마다의 외부
레퍼런스 조사 의무(AGENTS.md), 제품 3종 워크플로 커버리지 판정
(`COMPONENT_WORKFLOW.md` · `COVERAGE_AUDIT.json` 핀), R4-4(core 잔류 조건
데이터화)의 이연. **이 무게는 사용 피드백의 부재를 메우는 대체물이며, 영구
규칙이 아니다.**

### 해제 조건 — 첫 제품 채택 시

**트리거**: 한 제품이 versioned package를 pin하고 production build + workflow
smoke 증거를 남긴다 (분리 계획 Wave 2의 증거 기준과 동일).

| 현행 장치 (추측 보정) | 대체 실측 | 전환 |
| --- | --- | --- |
| 외부 레퍼런스 조사 의무 | 채택 제품의 실사용·실요구 | 채택 제품이 소비하는 컴포넌트의 변경은 그 제품 실측을 1순위 근거로 인정. 외부 조사는 신규 카테고리에만 유지 |
| 제품 3종 커버리지 판정 | 채택 제품의 실제 사용 인벤토리 | 채택 제품 축은 `unverified` 추정 대신 실데이터로 기록 |
| R4-4 이연 (core 잔류 조건) | 실사용 데이터 | 이연 해제 — 데이터가 생기는 순간 기계 검사 도입을 재평가 |

전환은 자동이 아니다. 트리거 발생 시 소유자가 이 절을 근거로 전환 커밋을
내고, 이 표를 실제 전환 내용으로 갱신한다.

## Reference authority — LDS는 자기 자신의 레퍼런스다 (2026-08-16)

부트스트랩 시기의 살아있는 진실은 WDS `.fig` 스냅샷이었다. 릴리스 라인
`0.1.0-rc.69.19`부로 **권위를 재앵커링했다**:

- 치수·해부학·파운데이션 값의 살아있는 기준은
  [`references/lds-baseline/`](references/lds-baseline/README.md)의 LDS 소유
  기준선이다. 채택 시점에 아카이브 추출본과 바이트 단위로 같았다 —
  재앵커링은 값이 아니라 근거를 바꿨다.
- [`references/wds/`](references/wds/README.md)는 출처를 증언하는 역사
  아카이브다. provenance 분류 4종(`direct-wds` 등)은 설계 근거의 역사로
  유지된다.
- 게이트 매핑: `check:component-styles`·`check:component-styles-rendered`·
  `check:nested-styles`·`check:foundation-parity`는 기준선을 대조한다.
  `check:wds-local-fig`는 아카이브의 기록 무결성만 지킨다.
- 새 설계 결정은 "WDS가 그랬다"로 정당화하지 않는다 — LDS 기준선, 기존 LDS
  관례, 권위 있는 외부 레퍼런스를 인용한다 (AGENTS.md "Design Evidence
  Handling" · "Component Variant/Axis Authority").
- 기준선 **값** 변경은 공유 토큰 값 변경과 같은 급의 디자인 소유자
  결정이다(Scope Escalation Gate). 절차는 기준선 README에 있다.

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

> 릴리스 **절차**(순서·명령·robotics 짝맞춤)는 이 문서가 아니라
> [`OPERATIONS.md`](OPERATIONS.md)가 소유한다. 아래는 변경이 갖춰야 할
> 품질 조건 목록이다.

- `npm run check:fast`(릴리스 게이트)가 통과한다.
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
