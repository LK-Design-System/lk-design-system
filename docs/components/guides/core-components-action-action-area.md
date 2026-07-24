# Action Area

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `ActionArea` |
| Storybook | `LDS Core/Components/Action/Action Area` |
| Source | `../component-content.json#core-components-action-action-area` |

Action Area는 Action 영역에서 반복되는 인터페이스 결정을 일관된 API와 접근성 계약으로 제공합니다.

## 사용 판단

### 사용

- Action Area는 Action 영역에서 반복되는 인터페이스 결정을 일관된 API와 접근성 계약으로 제공합니다.
- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- Use sticky only when the action must remain attached to the viewport bottom.
- Use align="end" to right-align persistent commit actions without rebuilding an action footer.

### 사용하지 않음

- In a horizontal pair, place the dismissive or secondary action first and the primary action last. ActionArea preserves DOM order when wrapping and does not infer button priority. If a product needs an explicit vertical stack with the primary action first, compose that vertical layout deliberately instead of relying on….
- - Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding. - Use sticky only when the action must remain attached to the viewport bottom. - Use align="end" to right-align persistent commit actions without rebuilding an action footer.….
- Action Area가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ActionArea의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Caption | caption 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Align | Action alignment inside the shared action row. @default "start" |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `summary` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `caption` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `sticky` | `boolean` | No | Keep the action area attached to the viewport bottom. @default false |
| `safeArea` | `boolean` | No | Include mobile bottom safe-area padding. @default false |
| `divider` | `boolean` | No | Draw the top divider. @default true |
| `compact` | `boolean` | No | Use denser vertical padding. @default false |
| `align` | `'start' \| 'end' \| 'center' \| 'between'` | No | Action alignment inside the shared action row. @default "start" |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| 변형·상태 · 밀도와 고정 배치 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- ActionArea의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 ActionArea는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Operations patterns keep persistent actions in a bottom ActionArea at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. Row navigation stays a 28px TextButton, view toggles stay 32px icon controls, and modal actions stay in the dialog-ow… |
| 명시 규칙 2 | - Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding. - Use sticky only when the action must remain attached to the viewport bottom. - Use align="end" to right-align persistent commit actions without rebuilding an action footer.… |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --component-action-area-z-index | 20 |

## Responsive

- Use for bottom action regions, confirmation footers, and mobile-safe primary actions.
- Use sticky only when the action must remain attached to the viewport bottom.
- In a horizontal pair, place the dismissive or secondary action first and the primary action last. ActionArea preserves DOM order when wrapping and does not infer button priority. If a product needs an explicit vertical stack with the primary action first, compose that vertical layout deliberately instead of relying on….
- - Use for bottom action regions, confirmation footers, and mobile-safe primary actions. - 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습….

## Content and writing

- 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습니다.
- Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding.
- Operations patterns keep persistent actions in a bottom ActionArea at md/40px. Execute/apply/save uses primary, recheck/reconnect/export uses neutral outlined, and destructive confirmation uses danger. Row navigation stays a 28px TextButton, view toggles stay 32px icon controls, and modal actions stay in the dialog-ow….
- - Use for bottom action regions, confirmation footers, and mobile-safe primary actions. - 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습….

## Accessibility

- 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습니다.
- - Use for bottom action regions, confirmation footers, and mobile-safe primary actions. - 요소 계약 — 기본은 평범한 div입니다. 이름 없는 은 landmark로도 노출되지 않아 보조기술에 아무 의미를 전달하지 못하므로, 의미 없는 요소를 기본값으로 두지 않습니다. aria-label(또는 aria-labelledby)로 영역 이름을 주면 으로 렌더되어 이름 있는 region landmark가 됩니다. 화면에 bottom action 영역이 하나뿐이라면 굳이 landmark로 만들 필요가 없습….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use for bottom action regions, confirmation footers, and mobile-safe primary actions. |
| Don't | In a horizontal pair, place the dismissive or secondary action first and the primary action last. ActionArea preserves DOM order when wrapping and does not infer button priority. If a product needs an explicit vertical stack with the primary action first, compose that vertical layout deliberately instead of relying on…. |
| Do | Use sticky only when the action must remain attached to the viewport bottom. |
| Don't | - Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding. - Use sticky only when the action must remain attached to the viewport bottom. - Use align="end" to right-align persistent commit actions without rebuilding an action footer.…. |

## Exceptions

- Use sticky only when the action must remain attached to the viewport bottom.
- - Keep the button itself inside Button, TextButton, or IconButton; ActionArea owns placement, spacing, divider, caption, and safe-area padding. - Use sticky only when the action must remain attached to the viewport bottom. - Use align="end" to right-align persistent commit actions without rebuilding an action footer.….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ActionArea의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Checkbox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Chip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Fab` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToggleIcon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ActionArea prompt contract: `components/buttons/ActionArea.prompt.md`
- Storybook implementation evidence: `stories/ActionArea.stories.jsx`
- [Material Dialog guidance](https://m2.material.io/develop/web/components/dialogs)
