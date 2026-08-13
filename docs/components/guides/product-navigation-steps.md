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

### 사용하지 않음

- Classification: LK Product Extension. 순서가 있는 워크플로의 진행 상태를 표시하며, 사이트·제품·페이지 내 탐색으로 사용하지 않습니다. 콘텐츠와 이전/다음 제어까지 필요하면 Wizard를 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| labelPolicy | 좁은 화면에서의 라벨 표시 정책 — 'always': 모든 라벨 표시 · 'current-only': 현재 단계 라벨만 표시 · 'none': 라벨 전부 숨김. 시각적으로 숨긴 라벨도 sr-only로 렌더되어 접근 가능한 이름과 상태 텍스트(완료 · 현재 단계 · 예정)는 정책과 무관하게 유지됩니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `Step[]` | Yes |  |
| `current` | `number` | No | 활성 단계 인덱스(0부터). @default 0 |
| `labelPolicy` | `StepsLabelPolicy` | No | 좁은 화면에서의 라벨 표시 정책 — 'always': 모든 라벨 표시 · 'current-only': 현재 단계 라벨만 표시 · 'none': 라벨 전부 숨김. 시각적으로 숨긴 라벨도 sr-only로 렌더되어 접근 가능한 이름과 상태 텍스트(완료 · 현재 단계 · 예정)는 정책과 무관하게 유지됩니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | labelPolicy — 좁은 화면 라벨 정책. 'always'(기본): 모든 라벨 표시 · 'current-only': 현재 단계 라벨만 표시 · 'none': 라벨 전부 숨김. 라벨은 white-space: nowrap으로 줄바꿈하지 않으므로, 긴 한국어 단계명이 320px에 맞지 않으면 라벨을 줄이는 대신 이 정책으로 표시 범위를 줄입니다. 어떤 정책에서도 라벨과 상태 텍스트는 sr-only로 유지되어 스크린 리더가 읽는 이름은 변하지 않습니다. |
| 명시 규칙 2 | 전경 대비 — 예정 단계의 숫자와 라벨은 비활성 컨트롤이 아니라 사용자가 읽어야 하는 진행 정보입니다. 따라서 숫자와 라벨 모두 label-alternative를 사용합니다. LDS light/dark elevated surface에서 계산된 대비는 각각 5.27:1, 4.67:1이며, 14px 텍스트에 WCAG 2.2 1.4.3의 4.5:1 기준을 적용합니다. label-assistive는 같은 표면에서 1.69:1, 1.79:1이므로 이 용도에 사용하지 않습니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Content and writing

- steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다.

## Accessibility

- 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.
- 외부 근거는 W3C WAI 다단계 폼의 순서 목록·시각적으로 숨긴 상태 텍스트 권고와 Carbon Progress indicator의 미시작 아이콘 icon-primary·라벨 text-primary 역할 구분을 확인했습니다. LDS는 기존 ol/숨김 상태/aria-current 구조를 유지하고, 시각 스타일은 외부 시스템을 복제하지 않고 LDS semantic foreground만 교정합니다.

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
| `Toolbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Steps current={1} steps={['작성', '검토', '게시']} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label1-size`
- `--label2-size`
- `--space-4`

### Source contracts

- `components/navigation/Steps.jsx`
- `components/navigation/Steps.d.ts`
- `components/navigation/Steps.prompt.md`
- `stories/NavigationSteps.stories.jsx`

## Sources

- Steps prompt contract: `components/navigation/Steps.prompt.md`
- Storybook implementation evidence: `stories/NavigationSteps.stories.jsx`
- [WCAG 2.2 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [W3C WAI 다단계 폼](https://www.w3.org/WAI/tutorials/forms/multi-page/)
- [Carbon Progress indicator](https://carbondesignsystem.com/components/progress-indicator/style/)
- [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)
