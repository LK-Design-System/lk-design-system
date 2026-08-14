# 제출 전 확인 패턴

| Field | Value |
| --- | --- |
| Type | Cross-component pattern guide |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-13 |

최종 제출 전에 사용자가 입력·선택한 내용을 확인하고 각 원래 단계로 돌아가는(check answers)
패턴이다. `DescriptionList.description`이 임의 ReactNode를 받으므로 값 + 변경 액션 조합은
지금의 API로 닫는다. `ReviewSummary` public component는 만들지 않으며, 같은 anatomy가 여러
제품에서 반복 확인되면 `DescriptionList`의 row action slot 같은 작은 확장부터 검토한다.

## 기본 조합

```
section heading → DescriptionList(term + description: 값 + contextual TextButton)
  → 필요 시 Callout/ValidationSummary → 제출 ActionArea(sticky/safeArea)
```

- `DescriptionList`는 semantic `dl/dt/dd`를 렌더한다. 읽기 순서는 항목명(`dt`) → 값과 변경
  액션(`dd`)이며, 시각 배치가 이 순서를 바꾸지 않게 한다.
- 변경 액션은 `description` 안의 `TextButton`으로 두고, accessible name에 항목을 포함해
  고유하게 만든다 — "변경"이 아니라 "보고서 유형 변경". 여러 "변경" 링크가 같은 이름으로
  낭독되면 안 된다.

## 복귀 계약

- 변경 액션은 해당 원래 단계로 이동한다. 단계 이동은
  [`GUIDED_CREATION_PATTERN.md`](GUIDED_CREATION_PATTERN.md)의 위저드 계약을 따르고, 이동한
  단계에서 그 단계 heading 또는 실제 field로 focus를 잇는 것은 제품이 소유한다.
- 수정 후 확인 단계로 돌아오면 수정된 값이 반영된 같은 확인 화면을 다시 보여준다.

## 값 표현 계약

| 계약 | 방법 |
| --- | --- |
| 조건부·누락 값 | 해당하지 않는 행은 숨긴다. `-` 같은 임의 placeholder를 만들지 않는다 |
| 3건 규모 목록 | 식별 가능한 내용과 날짜를 모두 표시한다 |
| 30/100건 규모 목록 | 대표 항목 + "그 외 N건" 요약을 제공하고, 전체를 확인할 수 있는 경로(`Collapsible` 또는 이전 단계 복귀)를 유지한다 |
| 긴·복합 값 | wrapping을 허용하고 320px·200% 확대에서 값과 변경 액션이 겹치지 않게 한다. `variant="stacked"`가 좁은 폭 기본이다 |
| 제출 pending/error | 제출 실패 후에도 검토 값을 유지한다. 오류는 `ValidationSummary`/`Callout`으로 표현하고 값은 지우지 않는다 |

제출 액션의 pending 표현은 `Button.loading`, 제출 이후의 background job 표현은
[`LOADING_PATTERN.md`](LOADING_PATTERN.md)와 [`GUIDED_CREATION_PATTERN.md`](GUIDED_CREATION_PATTERN.md)의
생성 이후 절을 따른다.

## 검증 근거

이 패턴은 두 컴포넌트에 나뉘어 증명된다. 완성된 보고서 화면은 Storybook에 두지 않는다.

| 계약 | 소유 | 근거 스토리 |
| --- | --- | --- |
| `dl/dt/dd` 읽기 순서, 항목별 고유한 변경 액션 이름, 해당 없는 행의 생략(placeholder 금지), 320px 장문 값 줄바꿈 | `DescriptionList` | `LDS Product/Data/Display/Description List` — 사용법 · 제출 전 확인의 값과 변경 액션 |
| 변경 액션 → 해당 단계 복귀, 그 단계 heading으로 focus, 복귀 후 입력값 보존, 수정값의 확인 단계 반영 | `Wizard` + 제품 | `LDS Product/Navigation/Wizard` — 확인 단계에서 원래 단계로 복귀 |
| 200% 확대(640 CSS px 등가)에서 값과 변경 액션이 겹치지 않음 | 조합 | 위 복귀 스토리를 640×400에서 확인 |

위저드는 **자기가 시작한 전환**에만 focus를 옮긴다. 확인 단계의 변경 액션처럼 제품이 `current`를
직접 바꾸는 전환에서는 위저드가 focus를 옮기지 않으므로, 복귀 focus는 제품이 소유한다(근거
스토리가 그 조립 방식을 보여 준다).

## 외부 근거

- [GOV.UK Check answers](https://design-system.service.gov.uk/patterns/check-answers/) — 제출 전
  확인 페이지의 task 조합 책임.
- [GOV.UK Summary list](https://design-system.service.gov.uk/components/summary-list/) —
  key/value/change action 구조와 contextual accessible name("Change *name*")을 component 책임으로
  분리한다.

## 관련 계약

`components/data/DescriptionList.prompt.md`, `components/buttons/TextButton.prompt.md`,
`components/buttons/ActionArea.prompt.md`, `components/forms/ValidationSummary.prompt.md`가
각 컴포넌트의 계약을 소유한다. 확인 대상이 만들어지는 선택 단계는
[`SELECTABLE_COLLECTION_PATTERN.md`](SELECTABLE_COLLECTION_PATTERN.md)를 따른다.
