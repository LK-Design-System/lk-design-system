# Spinner

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Status |
| Owner | `Spinner` |
| Storybook | `LDS Core/Components/Status/Spinner` |
| Source | `../component-content.json#core-components-status-spinner` |

버튼·오버레이의 순간적 로딩에 적합합니다. 레이아웃 자리를 잡아야 하면 Skeleton을, 진행률을 보여 줄 수 있으면 Progress를 대신 쓰세요.

## 사용 판단

### 사용

- Use ProgressBar or CircularProgress when a value or completion percentage is known.
- Motion respects prefers-reduced-motion. circular ring과 brand wave 모두 inline style로 animation이 붙으므로 reduced-motion 규칙은 animation:none!important로 선언되어 사용자 설정이 항상 이깁니다.
- Spinner - loading indicator for unknown-duration work.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Optional visible status label. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `size` | `number` | No | circular: diameter in px (@default 28). brand: wordmark cap height in px (@default 18). |
| `thickness` | `number` | No | Ring thickness in px (circular only). Defaults to roughly size / 10. |
| `color` | `string` | No | Active arc color (circular only). @default signal ink |
| `variant` | `"circular" \| "brand"` | No | loading variant. brand rides the LK ROBOTICS wordmark on a wave. @default "circular" |
| `label` | `React.ReactNode` | No | Optional visible status label. |

## States

| State | Contract |
| --- | --- |
| variant | loading variant. brand rides the LK ROBOTICS wordmark on a wave. @default "circular" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |
| --label1-size | {"fontSize":"14px","lineHeight":"20px","letterSpacing":"0.0145em"} |
| --space-2-5 | 10px |

## Responsive

- size: circular = ring diameter; brand = wordmark cap height.

## Content and writing

- label adds visible status text and lets assistive tech announce the loading state.

## Related components

| Component | Relationship |
| --- | --- |
| `Banner` | 대표 시나리오에서 조합 |
| `Callout` | 대표 시나리오에서 조합 |
| `EmptyState` | 대표 시나리오에서 조합 |
| `Skeleton` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Spinner />
<Spinner variant="brand" size={22} />
<Spinner size={18} label="불러오는 중" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-strong`
- `--color-semantic-primary-normal`
- `--font-sans`
- `--label1-size`
- `--space-2-5`

### Source contracts

- `components/status/Spinner.jsx`
- `components/status/Spinner.d.ts`
- `components/status/Spinner.prompt.md`
- `stories/StatusSpinner.stories.jsx`

## Sources

- Spinner prompt contract: `components/status/Spinner.prompt.md`
- Storybook implementation evidence: `stories/StatusSpinner.stories.jsx`
