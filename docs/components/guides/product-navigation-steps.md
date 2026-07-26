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

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `steps` | `Step[]` | Yes |  |
| `current` | `number` | No | 활성 단계 인덱스(0부터). @default 0 |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |

## Content and writing

- steps — 문자열 또는 { label }. current — 활성 인덱스. 완료된 단계는 시그널 잉크 + 체크로 채워지고, 현재는 링으로 표시됩니다.

## Accessibility

- 접근성 — 순서 있는 리스트(/)로 렌더되고, 현재 단계 에 aria-current="step"이 붙습니다. 각 라벨 뒤에는 화면에 보이지 않는 상태 텍스트(완료 · 현재 단계 · 예정)가 붙어 스크린 리더가 색상 없이도 상태를 구분합니다. 체크 아이콘은 장식(aria-hidden)입니다.

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
- `--space-4`

### Source contracts

- `components/navigation/Steps.jsx`
- `components/navigation/Steps.d.ts`
- `components/navigation/Steps.prompt.md`
- `stories/NavigationSteps.stories.jsx`

## Sources

- Steps prompt contract: `components/navigation/Steps.prompt.md`
- Storybook implementation evidence: `stories/NavigationSteps.stories.jsx`
