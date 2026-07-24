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

- 입력과 검토가 순서대로 이어지고 이전·다음 동작을 패턴이 소유할 때 적합합니다. 현재 단계만 읽히면 충분한 화면에는 Wizard 대신 Steps를 사용하세요.
- 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).
- Wizard가 소유하는 Navigation 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Wizard API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤.
- onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- Classification: LK Product Extension. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 Breadcrumb, 진행 표시만 필요할 때는 Steps를 사용합니다.
- - steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요. - footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. - onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Wizard의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Complete Label | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| Children | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림됩니다. |
| Footer | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · undefined(기본): 내장 이전/다음 컨트롤. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `WizardStep[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `current` | `number` | No | 제어되는 단계 인덱스. |
| `defaultCurrent` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onStepChange` | `(index: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onComplete` | `() = void` | No | 마지막 단계에서 완료 액션. 제공하면 마지막 단계의 다음 버튼이 completeLabel을 단 primary 완료 버튼이 되어 클릭 시 호출됩니다. 제공하지 않으면 기존처럼 마지막 단계에서 다음 버튼이 비활성화됩니다. |
| `completeLabel` | `React.ReactNode` | No | 완료 버튼 라벨(onComplete 제공 시). @default '완료' |
| `children` | `React.ReactNode \| ((current: number) = React.ReactNode)` | No | 노드, 또는 렌더 함수 (current) = ReactNode. 콘텐츠 영역은 aria-live="polite"로 감싸져 단계 전환이 스크린 리더에 알림됩니다. |
| `footer` | `React.ReactNode \| null` | No | 푸터 제어 — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 해당 노드를 렌더 · undefined(기본): 내장 이전/다음 컨트롤. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요.
- 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).
- Classification: LK Product Extension. 순서가 있는 다단계 워크플로를 제어하며, 사이트나 제품의 주 탐색으로 사용하지 않습니다. 경로 표시에는 Breadcrumb, 진행 표시만 필요할 때는 Steps를 사용합니다.
- - steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요. - footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. - onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으….
- Wizard의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-line-solid-normal | light: #E1E2E4; dark: #37383C |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요.
- onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).
- - steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요. - footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. - onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으….

## Accessibility

- 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용).
- - steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요. - footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. - onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 접근성 — 인디케이터는 Steps 컴포넌트를 재사용해 / 구조, aria-current="step", 숨김 상태 텍스트를 그대로 제공합니다. 단계 콘텐츠 영역은 가벼운 aria-live="polite" 래퍼로 감싸 단계 전환 시 새 콘텐츠가 스크린 리더에 알림됩니다(별도 role/label 없이 라이브 영역만 사용). |
| Don't | footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. |
| Do | Wizard가 소유하는 Navigation 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환). |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Wizard의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Anchor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BottomNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Breadcrumb` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Footer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NavRail` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SideNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Steps` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

### Source contracts

- `components/navigation/Wizard.jsx`
- `components/navigation/Wizard.d.ts`
- `components/navigation/Wizard.prompt.md`
- `stories/NavigationWizard.stories.jsx`

## Migration

- onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으면 기존처럼 마지막 단계에서 다음이 비활성화됩니다(하위 호환).
- - steps — 라벨. current / defaultCurrent / onStepChange — 제어/비제어. children — 노드 또는 (current) = node. 인디케이터만 필요하면 Steps를 쓰세요. - footer — null: 내장 이전/다음 컨트롤 숨김 · 노드: 기본 컨트롤 대신 그 노드를 렌더 · 미지정: 내장 이전/다음 컨트롤. - onComplete / completeLabel — onComplete를 주면 마지막 단계의 다음 버튼이 primary 완료 버튼(completeLabel, 기본 '완료')이 되어 클릭 시 호출됩니다. 없으….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Wizard prompt contract: `components/navigation/Wizard.prompt.md`
- Storybook implementation evidence: `stories/NavigationWizard.stories.jsx`
