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
- **레이아웃 계약** — 세로 읽기 순서는 인디케이터 → 단계 heading → 단계 본문 → 푸터로 고정입니다. 간격은 위저드가 소유합니다: 인디케이터 아래 `--space-8`(32px), 푸터 위 `--space-6`(24px). 단계 본문은 그 단계의 결과를 말하는 heading으로 시작해야 합니다 — 전환 후 focus가 콘텐츠 영역으로 이동하므로 heading이 첫 낭독 대상이 됩니다(PatternFly의 step title, USWDS의 단계 heading 관례). 기본 푸터 정렬은 이전(왼쪽 끝)·다음/완료(오른쪽 끝)로, `ActionArea align="between"`과 같은 문법입니다 — 주 액션은 오른쪽 하나뿐입니다(PatternFly "footer의 primary는 Next 하나" 권고). 인디케이터를 좌측 세로 패널로 두는 대형 위저드(PatternFly·Cloudscape의 side nav)는 이 컴포넌트의 범위가 아니라 제품 레이아웃 조합입니다.
- **기본 푸터의 표현** — 손으로 그린 버튼이 아니라 LDS `Button`을 그대로 사용합니다: 이전은 `variant="outlined" color="assistive"`, 다음/완료는 `variant="solid" color="primary"`, 높이는 Button `md` 계약(`--component-button-height-md`)을 따릅니다. 완결형 위저드가 자기 시스템의 Button으로 기본 내비게이션을 그리는 업계 관례(PatternFly `WizardFooter`, Cloudscape wizard action buttons)와 일치시킨 것으로, 이전의 44px 수제 버튼은 Button 계약과 어긋나 교체했습니다.
- **onComplete / completeLabel** — `onComplete`를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(`completeLabel`, 기본 `'완료'`)이 되어 클릭 시 호출됩니다. promise를 반환하면 settle까지 `pending`으로 중복 제출이 차단됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- **labelPolicy** — 인디케이터 `Steps`로 전달하는 좁은 화면 라벨 정책(`'always'`·`'current-only'`·`'none'`). 정책과 무관하게 라벨·상태 텍스트는 sr-only로 유지됩니다.
- **접근성** — 인디케이터는 `Steps` 컴포넌트를 재사용해 `<ol>`/`<li>` 구조, `aria-current="step"`, 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 `aria-live="polite"` 래퍼(`tabIndex={-1}`)로 감싸져 단계 전환이 낭독되고, 위저드가 시작한 전환(내장 버튼·footer context) 후에는 이 영역으로 focus가 이동해 키보드·스크린 리더 사용자가 새 단계 시작점에 놓입니다. 부모가 `current`를 직접 바꾸는 전환에는 focus를 옮기지 않습니다. pending 동안 콘텐츠 영역은 `aria-busy`입니다.

다단계 폼 조합(검증·복귀 focus·`ActionArea`·dirty exit)의 규칙은 `docs/GUIDED_CREATION_PATTERN.md`가 소유합니다. 외부 근거: [GOV.UK patterns](https://design-system.service.gov.uk/patterns/)는 task 단위 조합 지침을 component와 분리하고, [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)는 step indicator가 back/next 탐색을 대체하지 않는다고 명시합니다. 완결형 위저드의 관례는 [PatternFly Wizard](https://www.patternfly.org/components/wizard/)(기본 `WizardFooter` + `footer` 교체 + promise `onNext`)와 [AWS Cloudscape wizard](https://cloudscape.design/components/wizard/)(`onNavigate` 검증 + `isLoadingNextStep` pending)를 확인했으며, Cloudscape 메인테이너의 [검증 철학](https://github.com/cloudscape-design/components/issues/564) — "다음을 미리 비활성화하지 말고 이동 시도 시점에 검증하고 오류로 피드백하라" — 을 따라 LDS도 guard를 시도 시점에 실행하고 pending 동안만 컨트롤을 잠급니다. 표시 전용 스테퍼(MUI Stepper·Ant Design Steps)의 역할은 LDS에서 `Steps`가 맡습니다.
