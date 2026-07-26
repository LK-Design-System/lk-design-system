# Text Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `TextButton` |
| Storybook | `LDS Core/Components/Action/Text Button` |
| Source | `../component-content.json#core-components-action-text-button` |

더보기, 취소처럼 표면을 만들지 않고도 의미가 분명한 보조 행동에 적합합니다. 제출·저장처럼 주요 결과를 만드는 행동에는 Button을, 다른 위치로 이동하는 탐색에는 Link를 사용하세요.

## 사용 판단

### 사용

- Use Button for filled CTAs and IconButton for icon-only actions.

### 사용하지 않음

- hover/pressed는 opacity tone만 낮추며 lift·scale·shadow를 사용하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| loadingLabel | Screen-reader label announced with the loading spinner. @default "불러오는 중" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `"signal" \| "neutral" \| "danger"` | No | Text action tone mapped through LK theme tokens. @default "signal" |
| `color` | `"primary" \| "assistive"` | No | color axis. When set, it takes precedence over tone. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | Aliases map small/medium/large to sm/md/lg. @default "md" |
| `arrow` | `boolean` | No |  |
| `underline` | `boolean` | No | Draw an underline for link-style usage. @default false |
| `disabled` | `boolean` | No |  |
| `disable` | `boolean` | No | Disable alias. |
| `loading` | `boolean` | No | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled). |
| `loadingLabel` | `string` | No | Screen-reader label announced with the loading spinner. @default "불러오는 중" |
| `as` | `React.ElementType` | No | Render with another element or component, such as "a". @default "button" |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | Text action tone mapped through LK theme tokens. @default "signal" |
| loading | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled). |
| loadingLabel | Screen-reader label announced with the loading spinner. @default "불러오는 중" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-spacing | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- TextButton is the WDS Action/Text Button primitive for low-emphasis text actions. Use it for inline links, card footers, secondary dismissals, and compact "more" actions.

## Content and writing

- TextButton is a button-style action with sizes and loading state. Use Link for pure anchor/navigation text with underline control.

## Accessibility

- loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden.
- loading은 native disabled가 아니라 aria-disabled="true" + aria-busy="true"로 처리해 focus를 유지합니다(Button과 동일한 계약).
- Native disabled removes the action from focus. aria-disabled="true" keeps it discoverable while applying unavailable styling and blocking activation.
- WAI-ARIA Button Pattern의 keyboard/disabled 계약을 따릅니다. WDS 직접 축은 primary/assistive, small/medium, disable이며 danger, lg, underline, loading, anchor는 LDS 확장입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `Fab` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<TextButton>View all</TextButton>
<TextButton tone="neutral" underline>Cancel</TextButton>
<TextButton loading loadingLabel="Loading more">Loading</TextButton>
<TextButton as="a" href="/products">View products</TextButton>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--body1-spacing`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-negative-text`
- `--component-button-text-hover-opacity`
- `--component-button-transition`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--label1-spacing`

### Source contracts

- `components/buttons/TextButton.jsx`
- `components/buttons/TextButton.d.ts`
- `components/buttons/TextButton.prompt.md`
- `stories/ActionTextButton.stories.jsx`

## Migration

- arrow is deprecated and remains as a no-op compatibility prop.

## Sources

- TextButton prompt contract: `components/buttons/TextButton.prompt.md`
- Storybook implementation evidence: `stories/ActionTextButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
