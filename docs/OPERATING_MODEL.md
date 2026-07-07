# Design system operating model

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
2. Contract draft: API, states, tokens, accessibility를 표로 쓴다.
3. Prototype: Storybook public story와 필요한 hidden parity story를 만든다.
4. Review: design, accessibility, engineering, domain safety 관점으로 본다.
5. Release: changelog, migration note, package version을 갱신한다.

## Change categories

| Category | 예시 | 요구 문서 |
| --- | --- | --- |
| Patch | bug fix, visual alignment, docs typo | 변경 요약 |
| Minor | 새 component, 새 token, 새 pattern | Storybook story, API/state matrix |
| Deprecated | 이전 prop/token 대체 | deprecation note, migration path |
| Breaking | prop 제거, token 의미 변경, CSS contract 변경 | migration guide, release note, visual diff |

## Pull request checklist

- 기존 style/token/component pattern을 먼저 사용했다.
- 새 icon을 만들기 전에 `Icon` registry를 확인했다.
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
