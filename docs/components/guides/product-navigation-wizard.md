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

### 사용하지 않음

- footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤.
- Classification: LK Product Extension. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 Breadcrumb, 진행 표시만 필요할 때는 Steps를 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| completeLabel | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| children | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림됩니다. |
| footer | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · undefined(기본): 내장 이전/다음 컨트롤. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `WizardStep[]` | Yes |  |
| `current` | `number` | No | 제어되는 단계 인덱스. |
| `defaultCurrent` | `number` | No |  |
| `onStepChange` | `(index: number) = void` | No |  |
| `onComplete` | `() = void` | No | 마지막 단계에서 완료 액션. 제공하면 마지막 단계의 다음 버튼이 completeLabel을 단 primary 완료 버튼이 되어 클릭 시 호출됩니다. 제공하지 않으면 기존처럼 마지막 단계에서 다음 버튼이 비활성화됩니다. |
| `completeLabel` | `React.ReactNode` | No | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| `children` | `React.ReactNode \| ((current: number) = React.ReactNode)` | No | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림됩니다. |
| `footer` | `React.ReactNode \| null` | No | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · undefined(기본): 내장 이전/다음 컨트롤. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-line-solid-normal | light: #E1E2E4; dark: #37383C |

## Content and writing

- steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요.
- onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).

## Accessibility

- 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).

## Related components

| Component | Relationship |
| --- | --- |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `Footer` | 대표 시나리오에서 조합 |
| `LanguageSwitcher` | 대표 시나리오에서 조합 |
| `NavRail` | 대표 시나리오에서 조합 |
| `SideNav` | 대표 시나리오에서 조합 |
| `Steps` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Wizard steps={['문의 정보', '현장 정보', '확인']} onStepChange={setStep}>
  {(step) => <StepForm index={step} />}
</Wizard>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fw-bold`
- `--radius-md`
- `--space-8`

### Source contracts

- `components/navigation/Wizard.jsx`
- `components/navigation/Wizard.d.ts`
- `components/navigation/Wizard.prompt.md`
- `stories/NavigationWizard.stories.jsx`

## Sources

- Wizard prompt contract: `components/navigation/Wizard.prompt.md`
- Storybook implementation evidence: `stories/NavigationWizard.stories.jsx`
