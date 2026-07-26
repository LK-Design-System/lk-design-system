# Toggle Icon

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `ToggleIcon` |
| Storybook | `LDS Core/Components/Action/Toggle Icon` |
| Source | `../component-content.json#core-components-action-toggle-icon` |

미리보기 표시, 즐겨찾기, 고정처럼 같은 제어를 다시 눌러 상태를 해제하는 이진 선택에 적합합니다. 즉시 실행 후 끝나는 행동은 Icon Button을, 텍스트 레이블이 필요한 설정은 Switch나 Toggle Button을 사용하세요.

## 사용 판단

### 사용

- ToggleIcon is the WDS Action/Toggle Icon primitive for icon-only on/off actions.

### 사용하지 않음

- For one-shot icon actions, use IconButton instead.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Accessible label for the icon-only control. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `pressed` | `boolean` | No |  |
| `defaultPressed` | `boolean` | No |  |
| `onChange` | `(next: boolean) = void` | No |  |
| `label` | `string` | Yes | Accessible label for the icon-only control. |
| `size` | `'sm' \| 'md'` | No |  |
| `variant` | `'default' \| 'plain' \| 'on-dark'` | No | Visual treatment for standalone, grouped-surface, or dark-viewer use. @default "default" |
| `disable` | `boolean` | No | Disable alias retained for WDS compatibility. |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | Visual treatment for standalone, grouped-surface, or dark-viewer use. @default "default" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --border-thin | 1px |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Content and writing

- Always provide label; the visible content is icon-only.
- Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text.

## Accessibility

- variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- Native disabled removes the control from focus. aria-disabled="true" keeps it discoverable while applying the same unavailable styling and blocking activation; use that distinction only when a composite widget deliberately keeps unavailable choices in Arrow-key navigation.
- hover/pressed는 tone만 변경하고 aria-pressed의 persistent state와 구분합니다.
- WAI-ARIA Button Pattern처럼 label을 상태에 따라 바꾸지 않고 aria-pressed만 갱신합니다. WDS의 Active/Inactive 역할은 유지하며 boxed surface와 plain/on-dark는 승인된 LK 변형입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `Fab` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ToggleIcon label="Show route" defaultPressed>
  <Icon name="eye" size={18} />
</ToggleIcon>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-static-white`
- `--component-button-transition`
- `--component-toggle-icon-bg`
- `--component-toggle-icon-bg-active`
- `--component-toggle-icon-border`
- `--component-toggle-icon-fg`
- `--component-toggle-icon-fg-active`
- `--component-toggle-icon-radius`
- `--component-toggle-icon-size-md`
- `--component-toggle-icon-size-sm`
- `--viewer-foreground`

### Source contracts

- `components/buttons/ToggleIcon.jsx`
- `components/buttons/ToggleIcon.d.ts`
- `components/buttons/ToggleIcon.prompt.md`
- `stories/ActionToggleIcon.stories.jsx`

## Migration

- disable — disabled의 호환 별칭입니다.

## Sources

- ToggleIcon prompt contract: `components/buttons/ToggleIcon.prompt.md`
- Storybook implementation evidence: `stories/ActionToggleIcon.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
