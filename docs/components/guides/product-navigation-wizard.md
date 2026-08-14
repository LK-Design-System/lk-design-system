# Wizard

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `Wizard` |
| Storybook | `LDS Product/Navigation/Wizard` |
| Source | `../component-content.json#product-navigation-wizard` |

입력과 검토가 순서대로 이어지고 이전·다음 동작을 패턴이 소유할 때 적합합니다. 현재 단계만 읽히면 충분한 화면에는 Wizard 대신 Steps를 사용하세요.

## 사용 판단

### 사용

- onBeforeStepChange — 전환 guard. (nextIndex, currentIndex)로 호출되며 false 반환·false resolve·reject는 전환을 차단하고 현재 단계와 입력값을 유지합니다. promise를 반환하면 settle까지 pending이 되어 이전/다음/완료의 중복 실행이 차단되고 내장 버튼이 비활성화됩니다. guard 통과 후에만 onStepChange가 호출됩니다. 검증 실패의 표현(ValidationSummary, field error)은 소비자가 소유합니다.

### 사용하지 않음

- Classification: LK Product Extension. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 Breadcrumb, 진행 표시만 필요할 때는 Steps를 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| completeLabel | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| labelPolicy | 인디케이터(Steps)로 전달되는 좁은 화면 라벨 정책. @default 'always' |
| children | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림되고, 위저드가 시작한 전환 후에는 이 영역으로 focus가 이동합니다. |
| footer | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · 함수: WizardFooterContext를 받아 커스텀 푸터를 렌더(기본 이전/다음/완료 의미와 guard·pending 계약을 유지한 채 표현만 교체) · undefined(기본): 내장 이전/다음 컨트롤. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `WizardStep[]` | Yes |  |
| `current` | `number` | No | 제어되는 단계 인덱스. |
| `defaultCurrent` | `number` | No |  |
| `onStepChange` | `(index: number) = void` | No |  |
| `onBeforeStepChange` | `(nextIndex: number, currentIndex: number) = boolean \| void \| Promise` | No | 단계 전환 guard. 전환이 확정되기 전에 (nextIndex, currentIndex)로 호출되며, false를 반환하거나 promise가 false로 resolve되거나 reject되면 현재 단계와 입력값을 유지합니다. promise를 반환하면 settle될 때까지 pending이 되어 이전/다음/완료가 중복 실행되지 않습니다. guard 통과 후에만 onStepChange가 호출됩니다. |
| `onComplete` | `() = void \| Promise` | No | 마지막 단계에서 완료 액션. 제공하면 마지막 단계의 다음 버튼이 completeLabel을 단 primary 완료 버튼이 되어 클릭 시 호출됩니다. promise를 반환하면 settle될 때까지 pending으로 중복 실행이 차단됩니다. 제공하지 않으면 기존처럼 마지막 단계에서 다음 버튼이 비활성화됩니다. |
| `completeLabel` | `React.ReactNode` | No | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| `labelPolicy` | `StepsLabelPolicy` | No | 인디케이터(Steps)로 전달되는 좁은 화면 라벨 정책. @default 'always' |
| `children` | `React.ReactNode \| ((current: number) = React.ReactNode)` | No | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림되고, 위저드가 시작한 전환 후에는 이 영역으로 focus가 이동합니다. |
| `footer` | `React.ReactNode \| null \| ((context: WizardFooterContext) = React.ReactNode)` | No | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · 함수: WizardFooterContext를 받아 커스텀 푸터를 렌더(기본 이전/다음/완료 의미와 guard·pending 계약을 유지한 채 표현만 교체) · undefined(기본): 내장 이전/다음 컨트롤. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 레이아웃 계약 — 세로 읽기 순서는 인디케이터 → 단계 heading → 단계 본문 → 푸터로 고정입니다. 간격은 위저드가 소유합니다: 인디케이터 아래 --space-8(32px), 푸터 위 --space-6(24px). 단계 본문은 그 단계의 결과를 말하는 heading으로 시작해야 합니다 — 전환 후 focus가 콘텐츠 영역으로 이동하므로 heading이 첫 낭독 대상이 됩니다(PatternFly의 step title, USWDS의 단계 heading 관례). |
| 명시 규칙 2 | 기본 푸터의 표현 — 손으로 그린 버튼이 아니라 LDS Button을 그대로 사용합니다: 이전은 variant="outlined" color="assistive", 다음/완료는 variant="solid" color="primary", 높이는 Button md 계약(--component-button-height-md)을 따릅니다. |
| 명시 규칙 3 | 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 aria-live="polite" 래퍼(tabIndex={-1})로 감싸져 단계 전환이 낭독되고, 위저드가 시작한 전환(내장 버튼·footer context) 후에는 이 영역으로 focus가 이동해 키보드·스크린 리더 사용자가 새 단계 시작점에 놓입니다. 부모가 current를 직접 바꾸는 전환에는 focus를 옮기지 않습니다. pending 동안 콘텐츠 영역은 aria-busy입니다. |
| --space-6 | 24px |
| --space-8 | 32px |

## Responsive

- labelPolicy — 인디케이터 Steps로 전달하는 좁은 화면 라벨 정책('always'·'current-only'·'none'). 정책과 무관하게 라벨·상태 텍스트는 sr-only로 유지됩니다.

## Content and writing

- steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요.
- footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 함수: WizardFooterContext(current·count·isFirst·isLast·pending·nextIsComplete·back()·next()·complete())를 받아 커스텀 푸터를 렌더 — 표현만 바꾸고 guard·pending·완료 의미는 위저드가 계속 소유합니다 · 미지정: 내장 이전/다음 컨트롤. 커스텀 푸터도 DOM 순서는 이전 → 다음/완료를 유지하세요.
- onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. promise를 반환하면 settle까지 pending으로 중복 제출이 차단됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).

## Accessibility

- 다단계 폼 조합(검증·복귀 focus·ActionArea·dirty exit)의 규칙은 docs/GUIDEDCREATIONPATTERN.md가 소유합니다. 외부 근거: GOV.UK patterns는 task 단위 조합 지침을 component와 분리하고, USWDS Step indicator는 step indicator가 back/next 탐색을 대체하지 않는다고 명시합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `DescriptionList` | 대표 시나리오에서 조합 |
| `FormField` | 대표 시나리오에서 조합 |
| `Input` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Wizard
  steps={['문의 정보', '현장 정보', '확인']}
  onBeforeStepChange={(next, current) => next < current || validateStep(current)}
  onComplete={submit}
>
  {(step) => <StepForm index={step} />}
</Wizard>
```

## Tokens and API

### Tokens

- `--font-sans`
- `--space-6`
- `--space-8`

### Source contracts

- `components/navigation/Wizard.jsx`
- `components/navigation/Wizard.d.ts`
- `components/navigation/Wizard.prompt.md`
- `stories/NavigationWizard.stories.jsx`

## Sources

- Wizard prompt contract: `components/navigation/Wizard.prompt.md`
- Storybook implementation evidence: `stories/NavigationWizard.stories.jsx`
- [GOV.UK patterns](https://design-system.service.gov.uk/patterns/)
- [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)
- [PatternFly Wizard](https://www.patternfly.org/components/wizard/)
- [AWS Cloudscape wizard](https://cloudscape.design/components/wizard/)
- [검증 철학](https://github.com/cloudscape-design/components/issues/564)
