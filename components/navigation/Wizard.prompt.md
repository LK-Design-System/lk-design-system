**Wizard** — 다단계 플로우(Steps 인디케이터 + 콘텐츠 + 뒤로/다음).

Classification: **LK Product Extension**. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 `Breadcrumb`, 진행 표시만 필요할 때는 `Steps`를 사용합니다.

```jsx
<Wizard
  steps={['문의 정보', '현장 정보', '확인']}
  onBeforeStepChange={(next, current) => next < current || validateStep(current)}
  onComplete={submit}
>
  {(step) => <StepForm index={step} />}
</Wizard>
```

- **steps** — 라벨. **current / defaultCurrent / onStepChange** — 제어/비제어. **children** — 노드 또는 `(current) => node`. 인디케이터만 필요하면 `Steps`를 쓰세요.
- **onBeforeStepChange** — 전환 guard. `(nextIndex, currentIndex)`로 호출되며 `false` 반환·`false` resolve·reject는 전환을 차단하고 현재 단계와 입력값을 유지합니다. promise를 반환하면 settle까지 `pending`이 되어 이전/다음/완료의 중복 실행이 차단되고 내장 버튼이 비활성화됩니다. guard 통과 후에만 `onStepChange`가 호출됩니다. 검증 실패의 표현(`ValidationSummary`, field error)은 소비자가 소유합니다.
- **footer** — `null`: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · **함수**: `WizardFooterContext`(`current`·`count`·`isFirst`·`isLast`·`pending`·`nextIsComplete`·`back()`·`next()`·`complete()`)를 받아 커스텀 푸터를 렌더 — 표현만 바꾸고 guard·pending·완료 의미는 위저드가 계속 소유합니다 · 미지정: 내장 이전/다음 컨트롤. 커스텀 푸터도 DOM 순서는 이전 → 다음/완료를 유지하세요.
- **onComplete / completeLabel** — `onComplete`를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(`completeLabel`, 기본 `'완료'`)이 되어 클릭 시 호출됩니다. promise를 반환하면 settle까지 `pending`으로 중복 제출이 차단됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- **labelPolicy** — 인디케이터 `Steps`로 전달하는 좁은 화면 라벨 정책(`'always'`·`'current-only'`·`'none'`). 정책과 무관하게 라벨·상태 텍스트는 sr-only로 유지됩니다.
- **접근성** — 인디케이터는 `Steps` 컴포넌트를 재사용해 `<ol>`/`<li>` 구조, `aria-current="step"`, 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 `aria-live="polite"` 래퍼(`tabIndex={-1}`)로 감싸져 단계 전환이 낭독되고, 위저드가 시작한 전환(내장 버튼·footer context) 후에는 이 영역으로 focus가 이동해 키보드·스크린 리더 사용자가 새 단계 시작점에 놓입니다. 부모가 `current`를 직접 바꾸는 전환에는 focus를 옮기지 않습니다. pending 동안 콘텐츠 영역은 `aria-busy`입니다.

다단계 폼 조합(검증·복귀 focus·`ActionArea`·dirty exit)의 규칙은 `docs/GUIDED_CREATION_PATTERN.md`가 소유합니다. 외부 근거: [GOV.UK patterns](https://design-system.service.gov.uk/patterns/)는 task 단위 조합 지침을 component와 분리하고, [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)는 step indicator가 back/next 탐색을 대체하지 않는다고 명시합니다. guard·pending·focus 이동은 이 경계 안에서 위저드가 소유하는 최소 계약으로 설계했습니다.
