# 가이드형 생성 패턴

| Field | Value |
| --- | --- |
| Type | Cross-component pattern guide |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-08-13 |

다단계 생성 플로우(유형 선택 → 자료 선택 → 확인 → 생성 요청)를 `Wizard`, `ValidationSummary`,
`ActionArea`, `ConfirmDialog`로 조합하는 공식 규칙이다. 이 문서는 각 컴포넌트의 계약(각
`.prompt.md`)이 아니라 **그 사이의 합성 계약** — 단계 이동 guard, pending, focus, 검증 복귀,
하단 액션, 이탈 확인 — 을 소유한다. 완성 task editor는 제품이 소유하고 LDS는 작은 재사용
단위만 공유한다는 `PRODUCT_FRONTEND_COVERAGE.md`의 원칙을 유지하며, 화면형 `CreationFlow`
컴포넌트는 만들지 않는다.

## 기본 조합

```
PageHeader → Wizard(Steps 인디케이터 + 단계 콘텐츠) → ValidationSummary → ActionArea(sticky/safeArea)
```

- 단계 표시와 이동 제어가 모두 필요하면 `Wizard`, 진행 표시만 필요하면 `Steps`.
- 단계 상태는 controlled(`current` + `onStepChange`) 또는 uncontrolled(`defaultCurrent`) 어느 쪽도
  가능하다. 어떤 경우든 단계 인덱스의 소유자는 하나여야 하며, 라우터와 위저드가 동시에
  소유하지 않는다.
- 하단 액션이 스크롤과 무관하게 보여야 하면 `ActionArea sticky` + `safeArea`를 쓴다. 위저드의
  기본 푸터와 `ActionArea`를 동시에 두지 않는다 — `footer` 함수로 `ActionArea` 안에 이전/다음을
  렌더한다.

## 단계 전환 계약

| 계약 | 소유 | 방법 |
| --- | --- | --- |
| 전환 전 sync/async 검증 | `Wizard` | `onBeforeStepChange(next, current)` — `false`·reject는 차단, promise는 settle까지 `pending` |
| guard 실패 시 값 유지 | `Wizard` + 제품 | 위저드는 현재 단계를 유지한다. 입력값 보존은 단계 콘텐츠를 unmount하지 않거나 제품 상태로 유지한다 |
| pending 중 중복 실행 차단 | `Wizard` | 내장·context 기반 이전/다음/완료 모두 pending 동안 무시되고, 콘텐츠 영역이 `aria-busy`가 된다 |
| 전환 후 focus 이동 | `Wizard` | 위저드가 시작한 전환 후 단계 콘텐츠 영역(`tabIndex={-1}`, `aria-live="polite"`)으로 focus 이동. 단계 콘텐츠는 의미 있는 heading으로 시작한다 |
| 뒤로 이동 | 제품 정책 | 뒤로는 보통 검증 없이 허용한다(`next < current`면 guard에서 `true` 반환) |
| custom footer의 의미 유지 | `Wizard` | `footer`에 함수를 주면 `WizardFooterContext`(`back`/`next`/`complete`/`pending`/`isFirst`/`isLast`/`nextIsComplete`/`current`/`count`)를 받는다. 표현만 바꾸고 이동 의미는 재구현하지 않으며 DOM 순서는 이전 → 다음/완료를 유지한다 |

## 검증과 복귀

- 단계 내 검증 실패는 field error + `ValidationSummary`로 표현한다. summary의 `issues[].href`는
  실제 오류 field(또는 이전 단계)로 돌아가는 경로이고, `onIssueActivate`로 SPA에서 focus를
  가로챈다. 제출 실패 후에는 제품이 summary로 focus를 옮긴다(`tabIndex=-1` + ref).
- 다른 단계의 오류로 복귀할 때는 해당 단계로 이동한 뒤 그 단계의 heading 또는 실제 field로
  focus를 잇는다. 단계 이동은 위저드 계약, 오류 field 지정과 메시지는 제품 소유다.
- 검증·오류 문구, business validation, mutation, route는 제품이 소유한다.

## 좁은 화면과 확대

- 긴 한국어 단계명이 320px에 맞지 않으면 라벨을 자르지 말고 `labelPolicy`(`Steps`/`Wizard`)로
  표시 범위를 줄인다 — `'current-only'`(현재 단계만) 또는 `'none'`. 어떤 정책에서도 sr-only
  라벨과 상태 텍스트는 유지된다.
- 200% 확대에서는 세로 공간이 줄어드는 효과이므로 `ActionArea sticky`가 콘텐츠를 가리지
  않는지 확인하고, 단계 콘텐츠가 자체 스크롤을 만들지 않게 한다.

### Acceptance matrix

각 축을 어떻게 확인하는지까지 고정한다. 브라우저 확대는 Storybook play로 재현할 수 없으므로
**뷰포트 폭을 절반으로 줄여 등가 검증**한다 — 1280px에서의 200% 확대는 레이아웃상 640 CSS px과
같다.

| 축 | 확인 방법 | 현재 근거 |
| --- | --- | --- |
| 320px | 320px 폭 스토리 | `Steps` 좁은 화면 label 정책 스토리 |
| 200% 확대 | 640×400 뷰포트(1280 기준 등가)에서 가로 스크롤·겹침·오버플로 없음 | `Wizard` 개요와 확인 복귀 스토리에서 확인(페이지 가로 스크롤 없음, 인디케이터 미오버플로, 푸터 버튼 미겹침) |
| keyboard | play에서 Enter 활성화와 DOM 순서(이전 → 다음/완료) 단언 | `Wizard` 개요·전환 guard 스토리 |
| screen reader | `aria-current="step"`, sr-only 상태 텍스트, 콘텐츠 영역 `aria-live`/`aria-busy` 단언 | `Steps`·`Wizard` play |
| 긴 한국어 카피 | 실제 길이의 한국어 단계명·값으로 렌더 | `Steps` label 정책, 확인 복귀 스토리 |

## 이탈과 초안

- dirty 상태에서 떠나기 전 확인은 `ConfirmDialog`로 표현한다. dirty 판정, 라우트 차단, 저장
  여부는 제품이 소유한다.
- LDS는 초안을 자동 저장하지 않는다. 민감할 수 있는 초안의 persistence 정책(위치·암호화·만료)은
  제품 책임이며, 복원 안내가 필요하면 `Banner`로 표현한다.

## 생성 이후

생성 요청이 background job이 되면 `Button.loading`, `ProgressBar`, `StatusBadge`, `Timeline`으로
표현한다. polling·backoff·idempotency·retry·cancel은 제품이 소유하며, 별도 `JobTracker`
컴포넌트는 만들지 않는다. 로딩 신호의 선택 기준은 [`LOADING_PATTERN.md`](LOADING_PATTERN.md)를 따른다.

## 외부 근거

- [GOV.UK patterns](https://design-system.service.gov.uk/patterns/) — pattern은 특정 사용자 task를
  해결하기 위한 component 조합 지침이며 component 자체와 분리된 책임이다.
- [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/) — step
  indicator는 back/next 탐색을 대체하지 않으며, 라벨이 맞지 않으면 라벨 없는 variant를 권고한다.
- [W3C WAI 다단계 폼](https://www.w3.org/WAI/tutorials/forms/multi-page/) — 단계 전환 알림과
  순서 목록 구조.

## 관련 계약

`components/navigation/Wizard.prompt.md`, `components/navigation/Steps.prompt.md`,
`components/forms/ValidationSummary.prompt.md`, `components/buttons/ActionArea.prompt.md`,
`components/overlay/ConfirmDialog.prompt.md`가 각 컴포넌트의 API·접근성 계약을 소유한다.
자료 다중 선택 단계는 [`SELECTABLE_COLLECTION_PATTERN.md`](SELECTABLE_COLLECTION_PATTERN.md),
최종 확인 단계는 [`CHECK_ANSWERS_PATTERN.md`](CHECK_ANSWERS_PATTERN.md)를 따른다.
