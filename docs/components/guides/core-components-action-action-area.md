# Action Area

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `ActionArea` |
| Storybook | `LDS Core/Components/Action/Action Area` |
| Source | `../component-content.json#core-components-action-action-area` |

검토가 끝난 뒤 화면이나 패널 하단에서 취소와 주요 완료 행동을 한 단위로 유지할 때 적합합니다. 본문 안의 단일 즉시 행동에는 Action Area를 사용하지 말고 Button이나 Text Button을 배치하세요.

## 사용 판단

### 사용

- Use align="end" to right-align persistent commit actions without rebuilding an action footer.
- ActionArea is the WDS Action/Action Area primitive for bottom-aligned actions.

## Anatomy

| Part | Contract |
| --- | --- |
| align | Action alignment inside the shared action row. @default "start" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `summary` | `React.ReactNode` | No |  |
| `caption` | `React.ReactNode` | No |  |
| `sticky` | `boolean` | No | Keep the action area attached to the viewport bottom. @default false |
| `safeArea` | `boolean` | No | Include mobile bottom safe-area padding. @default false |
| `divider` | `boolean` | No | Draw the top divider. @default true |
| `compact` | `boolean` | No | Use denser vertical padding. @default false |
| `align` | `'start' \| 'end' \| 'center' \| 'between'` | No | Action alignment inside the shared action row. @default "start" |
| `children` | `React.ReactNode` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Operations patterns keep persistent actions in a bottom ActionArea at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --component-action-area-z-index | 20 |
| --label2-line | 18px |

## Responsive

- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- Use sticky only when the action must remain attached to the viewport bottom.
- In a horizontal pair, place the dismissive or secondary action first and the primary action last. ActionArea preserves DOM order when wrapping and does not infer button priority.

## Content and writing

- Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding.

## Accessibility

- 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `Chip` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `Fab` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ActionArea caption="Changes are saved after confirmation." safeArea>
  <Button full>Confirm</Button>
</ActionArea>
```

### 추가 조합 2

```jsx
<ActionArea aria-label="주문 확정 액션">…</ActionArea>  // <section> = named region
<ActionArea>…</ActionArea>                              // <div>
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--component-action-area-bg`
- `--component-action-area-border`
- `--component-action-area-gap`
- `--component-action-area-padding-x`
- `--component-action-area-padding-y`
- `--component-action-area-shadow-sticky`
- `--component-action-area-z-index`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--mobile-bottom-action-padding-bottom`
- `--space-1`
- `--space-2`
- `--space-3`

### Source contracts

- `components/buttons/ActionArea.jsx`
- `components/buttons/ActionArea.d.ts`
- `components/buttons/ActionArea.prompt.md`
- `stories/ActionArea.stories.jsx`

## Sources

- ActionArea prompt contract: `components/buttons/ActionArea.prompt.md`
- Storybook implementation evidence: `stories/ActionArea.stories.jsx`
- [Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs)
