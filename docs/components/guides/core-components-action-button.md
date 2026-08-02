# Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `Button` |
| Storybook | `LDS Core/Components/Action/Button` |
| Source | `../component-content.json#core-components-action-button` |

폼 제출, 저장, 확인처럼 사용자가 결과를 예상할 수 있는 단일 행동에 적합합니다. 아이콘만 필요한 좁은 도구 영역은 Icon Button, 배경 없는 보조 행동은 Text Button, 켬·끔 상태를 유지해야 하면 Toggle Icon을 사용하세요.

## 사용 판단

### 사용

- Use IconButton for icon-only one-shot actions and ToggleIcon for icon-only persistent state actions.
- Footer action mapping is fixed: execute/save/apply uses the primary action; cancel/back uses variant="outlined" color="assistive"; destructive confirmation uses variant="danger" and a ConfirmDialog.
- Button is the WDS Action/Button primitive for primary, secondary, and supporting actions. LDS keeps WDS action roles but maps visual values through LK theme tokens.
- TypeScript preserves the rendered element's props through the generic as contract. For example, as="a" accepts anchor props such as href, while the default button accepts native button props. Custom components receive their own declared props without widening the public surface to any.

## Anatomy

| Part | Contract |
| --- | --- |
| iconOnly | Render the icon-only square button treatment. Requires aria-label (or aria-labelledby); a development-only console warning fires when neither is supplied. |
| loadingLabel | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `\| "primary" \| "secondary" \| "signal" \| "danger" \| "dark" \| "flat" \| "ghost" \| "on-dark" \| "solid" \| "outlined"` | No | Visual action variant mapped through LK theme tokens. Also accepts "solid" and "outlined". @default "primary" |
| `color` | `"primary" \| "assistive"` | No | color axis for solid/outlined buttons. @default "primary" |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | Control height, padding, and text size. Aliases map small/medium/large to sm/md/lg. @default "md" |
| `arrow` | `boolean` | No |  |
| `full` | `boolean` | No | Fill the available container width. @default false |
| `disabled` | `boolean` | No | Disable activation and mark the control unavailable. @default false |
| `disable` | `boolean` | No | Disable alias. @default false |
| `iconOnly` | `boolean` | No | Render the icon-only square button treatment. Requires aria-label (or aria-labelledby); a development-only console warning fires when neither is supplied. |
| `loading` | `boolean \| 'inline'` | No | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled) so keyboard focus is not lost on activation. true swaps the label for a centered spinner on the muted palette. "inline" keeps the label visible with a leading spinner and preserves the variant palette — for controls whose words must survive the wait (e.g. a safety stop reading "정지 요청 중"). Blocking semantics are identical in both modes. |
| `loadingLabel` | `string` | No | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |
| `as` | `React.ElementType` | No | Render with another element or component, such as "a" for link CTAs. @default "button" |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | Visual action variant mapped through LK theme tokens. Also accepts "solid" and "outlined". @default "primary" |
| disabled | Disable activation and mark the control unavailable. @default false |
| loading | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled) so keyboard focus is not lost on activation. true swaps the label for a centered spinner on the muted palette. "inline" keeps the label visible with a leading spinner and preserves the variant palette — for controls whose words must survive the wait (e.g. a safety stop reading "정지 요청 중"). Blocking semantics are identical in both modes. |
| loadingLabel | Screen-reader label announced with the loading spinner (loading = true). @default "불러오는 중" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Hover and pressed feedback use calm tone changes only: no lift, scale, or shadow escalation. Focus remains the shared 2px :focus-visible outline. |
| 명시 규칙 2 | WCAG 2.2 contrast minimum requires 4.5:1 for normal-size button text. |
| 명시 규칙 3 | Fluent 2 Button usage applies text contrast across interactive button states. LDS keeps ghost low emphasis through its transparent surface and border, not low-legibility text. |
| 명시 규칙 4 | Fluent 2 Button의 단일 주요 액션과 toggle/split 역할 분리를 채택합니다. |
| --border-thin | 1px |

## Responsive

- full: fills the container width.
- 32/40/48 높이와 solid/outlined·primary/assistive·icon-only·disable 축은 WDS Button/Button component set을 따릅니다. danger, dark-surface 변형, loading과 polymorphic anchor는 명시적인 LDS 확장입니다.

## Content and writing

- loading="inline": the second loading presentation — the spinner sits beside the label and the variant palette stays. 말이 사라지면 안 되는 컨트롤(예: "정지 요청 중"을 계속 말해야 하는 안전 정지)용. 차단 계약은 true와 동일하고 표현만 다릅니다.
- Ghost text also resolves from the rendered theme scope. Transparent fill and the hairline border carry its lower emphasis; text contrast is not reduced to create hierarchy.

## Accessibility

- loading: prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). The existing content keeps its width while visually hidden, so loading does not move adjacent controls.
- loading은 native disabled를 사용하지 않습니다. 대신 aria-disabled="true" 와 aria-busy="true"를 두고 activation만 차단합니다. native disabled로 만들면 방금 그 버튼을 누른 키보드 사용자의 focus가 즉시 로 튕기기 때문이며, Polaris·Carbon과 같은 처리입니다. 명시적인 disabled/disable만 tab 순서에서 제거합니다.
- Native disabled removes a button from focus. aria-disabled="true" keeps it discoverable, applies the same unavailable treatment, and blocks activation.
- iconOnly는 접근 가능한 이름이 없으면 이름 없는 버튼이 됩니다. aria-label (또는 aria-labelledby)을 반드시 전달하세요. 누락 시 development 빌드에서만 console 경고가 출력되며 production 번들에서는 제거됩니다.
- WAI-ARIA Button Pattern의 native button, Enter/Space, accessible name, disabled semantics를 따릅니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Fab` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Button variant="primary">Request quote</Button>
<Button variant="signal" size="lg">View product</Button>
<Button variant="danger">Emergency stop request</Button>
<Button variant="ghost">Details</Button>
<Button variant="on-dark">Learn more</Button>
<Button loading loadingLabel="Saving">Saving</Button>
<Button as="a" href="contact.html" variant="primary" full>Contact</Button>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--component-button-danger-bg`
- `--component-button-danger-bg-hover`
- `--component-button-danger-fg`
- `--component-button-dark-bg`
- `--component-button-dark-bg-hover`
- `--component-button-dark-fg`
- `--component-button-flat-bg`
- `--component-button-flat-bg-hover`
- `--component-button-flat-fg`
- `--component-button-font-size-lg`
- `--component-button-font-size-md`
- `--component-button-font-size-sm`
- `--component-button-font-weight`
- `--component-button-font-weight-assistive`
- `--component-button-gap-lg`
- `--component-button-gap-md`
- `--component-button-gap-sm`
- `--component-button-ghost-bg`
- `--component-button-ghost-bg-hover`
- `--component-button-ghost-border`
- `--component-button-ghost-border-hover`
- `--component-button-ghost-fg`
- `--component-button-height-lg`
- `--component-button-height-md`
- `--component-button-height-sm`
- `--component-button-icon-only-icon-size-lg`
- `--component-button-icon-only-icon-size-md`
- `--component-button-icon-only-icon-size-sm`
- `--component-button-icon-size-lg`
- `--component-button-icon-size-md`
- `--component-button-icon-size-sm`
- `--component-button-letter-spacing-lg`
- `--component-button-letter-spacing-md`
- `--component-button-letter-spacing-sm`
- `--component-button-line-height-lg`
- `--component-button-line-height-md`
- `--component-button-line-height-sm`
- `--component-button-on-dark-bg`
- `--component-button-on-dark-bg-hover`
- `--component-button-on-dark-border`
- `--component-button-on-dark-fg`
- `--component-button-padding-lg`
- `--component-button-padding-md`
- `--component-button-padding-sm`
- `--component-button-primary-bg`
- `--component-button-primary-bg-hover`
- `--component-button-primary-fg`
- `--component-button-radius-lg`
- `--component-button-radius-md`
- `--component-button-radius-sm`
- `--component-button-secondary-bg`
- `--component-button-secondary-bg-hover`
- `--component-button-secondary-fg`
- `--component-button-shadow-rest`
- `--component-button-signal-bg`
- `--component-button-signal-bg-hover`
- `--component-button-signal-fg`
- `--component-button-transition`
- `--font-sans`

### Source contracts

- `components/buttons/Button.jsx`
- `components/buttons/Button.d.ts`
- `components/buttons/Button.prompt.md`
- `stories/Button.stories.jsx`

## Migration

- Disabled foreground, fill, and outlined border resolve semantic roles at the button's rendered theme scope, so nested dark surfaces do not inherit a root-resolved light alias.
- arrow is deprecated and remains as a no-op compatibility prop.

## Sources

- Button prompt contract: `components/buttons/Button.prompt.md`
- Storybook implementation evidence: `stories/Button.stories.jsx`
- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [Fluent 2 Button usage](https://fluent2.microsoft.design/components/web/react/core/button/usage)
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
