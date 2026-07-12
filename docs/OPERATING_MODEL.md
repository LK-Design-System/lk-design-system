# Design system operating model

| Field | Value |
| --- | --- |
| Type | Governance policy |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-12 |

디자인 시스템은 컴포넌트 묶음이 아니라 변경을 안전하게 반복하는 운영 체계입니다. 이 문서는 LK 디자인 시스템의 기여, 릴리즈, 마이그레이션 기준을 정의합니다.

## Ownership

| 영역 | Owner role | 책임 |
| --- | --- | --- |
| Foundations | Design system owner | token, typography, icon, brand decision |
| Components | Component owner | API, state matrix, accessibility, visual parity |
| Domain component contracts | Product design + engineering | status semantics, safety copy, units |
| Tooling | Frontend platform | build, Storybook, checks, package release |
| Docs | Design system owner | migration guide, release notes, usage guidance |

## Contribution path

1. Problem statement: 제품 업무에서 어떤 반복 문제를 해결하는지 쓴다.
2. Review plan: `docs/COMPONENT_WORKFLOW.md`의 제품 workflow, icon/asset/map symbol, 설계 근거 gate를 적용한다.
3. Contract draft: API, states, tokens, accessibility를 표로 쓴다.
4. Prototype: Storybook public story와 필요한 hidden parity story를 만든다.
5. Review: design, accessibility, engineering, domain safety, 실제 LK 제품 채택 관점으로 본다.
6. Release: changelog, migration note, package version을 갱신한다.

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
- LK Web Viz, LK Control Full Daedeok, LK Context Hub의 실제 workflow coverage를 판정하거나 `not applicable` 이유를 남겼다.
- component prompt 문서를 갱신했다.
- Storybook public surface가 너무 넓어지지 않도록 페이지를 분리했다.
- accessibility contract와 keyboard behavior를 확인했다.
- visual parity 또는 smoke check가 필요한 변경은 검증을 남겼다.
- breaking/deprecated 변경은 migration note를 남겼다.

## Release checklist

- `pnpm run check` 또는 동등한 release gate가 통과한다.
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
