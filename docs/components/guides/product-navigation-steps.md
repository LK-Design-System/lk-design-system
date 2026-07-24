# Steps

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `Steps` |
| Storybook | `LDS Product/Navigation/Steps` |
| Source | `../component-content.json#product-navigation-steps` |

작성·검토·게시처럼 정해진 순서와 현재 단계만 보여줄 때 적합합니다. 단계별 콘텐츠와 이전·다음 제어까지 함께 소유해야 하면 Steps 대신 Wizard를 사용하세요.

## 사용 판단

### 사용

- 작성·검토·게시처럼 정해진 순서와 현재 단계만 보여줄 때 적합합니다. 단계별 콘텐츠와 이전·다음 제어까지 함께 소유해야 하면 Steps 대신 Wizard를 사용하세요.
- Steps가 소유하는 Navigation 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Steps API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Classification: LK Product Extension. 순서가 있는 워크플로의 진행 상태를 표시하며, 사이트·제품·페이지 내 탐색으로 사용하지 않습니다. 콘텐츠와 이전/다음 제어까지 필요하면 Wizard를 사용합니다.
- Steps가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Steps의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `Step[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `current` | `number` | No | 활성 단계 인덱스(0부터). @default 0 |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다.
- 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- Classification: LK Product Extension. 순서가 있는 워크플로의 진행 상태를 표시하며, 사이트·제품·페이지 내 탐색으로 사용하지 않습니다. 콘텐츠와 이전/다음 제어까지 필요하면 Wizard를 사용합니다.
- - steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다. - 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- Steps의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다.
- 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- - steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다. - 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- 사용자에게 보이는 Steps 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- - steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다. - 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Steps가 소유하는 Navigation 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Classification: LK Product Extension. 순서가 있는 워크플로의 진행 상태를 표시하며, 사이트·제품·페이지 내 탐색으로 사용하지 않습니다. 콘텐츠와 이전/다음 제어까지 필요하면 Wizard를 사용합니다. |
| Do | 제품별 구현 대신 공개 Steps API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | Steps가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Steps의 범용 API에 넣지 않습니다.
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
| `Toolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TopBar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Steps current={1} steps={['작성', '검토', '게시']} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label1-size`
- `--label2-size`

### Source contracts

- `components/navigation/Steps.jsx`
- `components/navigation/Steps.d.ts`
- `components/navigation/Steps.prompt.md`
- `stories/NavigationSteps.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Steps prompt contract: `components/navigation/Steps.prompt.md`
- Storybook implementation evidence: `stories/NavigationSteps.stories.jsx`
