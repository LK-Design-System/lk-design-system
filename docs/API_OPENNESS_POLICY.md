# API openness policy

| Field | Value |
| --- | --- |
| Type | Policy |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-22 |
| Source | [`references/quality/BENCHMARK_SHADCN.md`](references/quality/BENCHMARK_SHADCN.md), [`../DESIGN.md`](../DESIGN.md) |

이 문서는 LDS 공개 컴포넌트 API를 **언제, 어떤 형태로 "열지"** 를 정하는 계약이다. `@lk-robotics/lds-*`의 모든
공개 컴포넌트에 적용되며, 충돌 시 [`../DESIGN.md`](../DESIGN.md)의 소유권 경계와
[`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)의 API grammar가 상위 계약이다.

## 배경

[`references/quality/BENCHMARK_SHADCN.md`](references/quality/BENCHMARK_SHADCN.md)의 64개 1:1 감사는 대부분의
"뒤떨어짐"이 단일 뿌리원인에서 나온다고 판정했다: **단일 프롭 객체 API가 중첩·그룹 구조를 표현하지 못한다.**
동시에 LDS가 앞선 지점(프롭 계약으로 강제되는 접근성, API grammar CI 래칫, 상태 매트릭스 완결성)은 전부 그
"닫힌" 성질에서 나온다. 따라서 목표는 shadcn의 compound 모델을 모방하는 것이 아니라, **닫힘이 벌어준 거버넌스를
유지한 채 구조 표현력만 선별 흡수**하는 것이다.

## 핵심 원칙

> **구조(structure)는 열되, 조합(composition)은 열지 않는다.**

- 계층·그룹은 *선언적 데이터*(재귀 `items`, `groups[]`)로 표현한다. 소비자에게 JSX 파트 트리
  (`Menu.Sub`, `Menu.SubTrigger` …)를 노출하지 않는다.
- 파트는 여전히 LDS 내부가 렌더한다. 그래야 접근성 배선(`aria-haspopup`, `aria-controls`, roving keyboard,
  Escape stack, focus 반환)을 소비자가 틀릴 수 없다.
- 선언적 데이터가 표현하지 못하는 **임의 파트 재배치**만 좁은 escape hatch로 연다(아래 "Escape hatch").

이 원칙은 이미 채택되어 있다: `feat(menu): nested submenus`는 서브메뉴를 compound JSX가 아니라 재귀 `items`로
구현했다. 이 문서는 그 판단을 일반 규칙으로 승격한다.

## 결정 매트릭스

컴포넌트가 무엇을 표현하지 못하는지로 분류한다.

| Tier | 판정 기준 | 개방 형태 | 대상(벤치마크 근거) |
| --- | --- | --- | --- |
| **T1 · 재귀 열기** | 자기유사 계층(메뉴가 메뉴를 품음) | 재귀 `items`(자식 있으면 서브트리거) | DropdownMenu, Menubar, Context Menu, NavigationMenu 메가패널 |
| **T2 · 그룹 열기** | 평면이지만 의미 그룹/섹션 필요 | `groups[]{ label, items[] }` + separator | Command, Field(fieldset/legend/group), Kbd(KbdGroup) |
| **T3 · 닫힌 채 유지** | 구조가 아니라 기능/상태가 부족 | 프롭 추가로 해결(개방 아님) | Calendar(disabled일·range), Slider(세로·N노브), Carousel, Resizable |

판정 규칙: **단일 프롭이 못 푸는 것이 *중첩/그룹*이면 열고(T1·T2), *기능/상태*면 프롭으로 닫힌 채 채운다(T3).**
T3는 이 정책의 대상이 아니라 일반 컴포넌트 확장이며 [`COMPONENT_WORKFLOW.md`](COMPONENT_WORKFLOW.md)를 따른다.

## Escape hatch (승인된 형태: 명명 slot)

선언적 데이터로 표현할 수 없는 임의 파트 재배치(예: 대시보드 top bar에 SideNav collapse 토글을 얹는 배치)는
**명명된 optional slot 프롭**으로만 연다.

- 허용: 목적이 명확한 소수의 명명 slot(`renderTrigger`, `leadingSlot` 등). 각 slot은 계약에 열거된다.
- 금지: 범용 `children` 통과, 범용 `asChild`/`render` 다형성, 무제한 slot 확장.
- 불변식: slot으로 주입된 내용도 LDS가 감싸며, 컴포넌트의 접근성·focus·상태 계약을 우회하지 못한다.
- slot 하나를 추가하려면 반복되는 교차 제품 수요와 [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)
  등록이 필요하다. 단일 화면의 편의는 slot 승격 근거가 아니다.

## 거버넌스 불변식 (개방해도 유지)

개방은 검사 포기가 아니다. 다음은 T1·T2·escape hatch 모두에 계속 적용된다.

1. **접근성 강제** — 파트를 LDS가 렌더하므로 [`ACCESSIBILITY_CONTRACTS.md`](ACCESSIBILITY_CONTRACTS.md)의
   semantic·keyboard·focus 계약이 프롭 계약으로 강제된다. `label` 필수성과 focus contract는 개방 대상이 아니다.
2. **API grammar 래칫** — 재귀 `items[].items`와 `groups[]`도 선언적이므로 `check:api-grammar`가 검사 가능하다.
   새 스키마 문법은 grammar baseline에 명문화한 뒤에만 도입한다.
3. **상태 완결성** — 개방된 구조가 만드는 새 상태(서브메뉴 열림/드릴, 그룹 empty 등)는
   [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)에 상태로 등록되어 story·검사로 완결성이 강제된다.

## 적용 순서

1. T1은 `useSubmenuBranch` 패턴으로 이미 시작됨(DropdownMenu, Menubar). 남은 T1(Context Menu, NavigationMenu
   메가패널)을 같은 훅으로 정렬한다.
2. T2 파일럿: Command 또는 Field 하나에 `groups[]`를 도입하고, grammar baseline과 상태 매트릭스를 함께 갱신한다.
3. escape hatch는 실제 반복 수요가 증명된 slot만, 건별로 승격한다.

## Open items

- [ ] T2 첫 파일럿 대상 확정(Command vs Field)과 `groups[]` 스키마 문법의 grammar baseline 등록.
- [ ] `renderX`/명명 slot의 명명 규약과 최대 개수 상한을 [`COMPONENT_API_STATE_MATRIX.md`](COMPONENT_API_STATE_MATRIX.md)에 편입.
- [ ] Context Menu의 우클릭/롱프레스 트리거 계약을 T1 재귀 모델과 함께 정의.
