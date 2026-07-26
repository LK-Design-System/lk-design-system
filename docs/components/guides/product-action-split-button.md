# Split Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `SplitButton` |
| Storybook | `LDS Product/Action/Split Button` |
| Source | `../component-content.json#product-action-split-button` |

반복해서 쓰는 기본 액션 하나와 같은 결과 계열의 보조 실행을 함께 제공할 때 적합한 LK Product 확장입니다. 서로 무관하거나 우선순위가 같은 작업에는 분할 실행 대신 개별 버튼이나 메뉴를 사용하세요.

## 사용 판단

### 사용하지 않음

- hover/pressed는 tone만 변경하며 lift·scale·shadow는 사용하지 않습니다.
- WDS .fig에는 SplitButton component set이 없으므로 WDS Core로 주장하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| loadingLabel | Accessible label used while loading. @default "Loading" |
| menuLabel | Accessible name for the menu segment. @default "관련 작업 열기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | No |  |
| `onClick` | `React.MouseEventHandler` | No | 메인 액션. |
| `items` | `SplitButtonMenuItem[]` | Yes | 드롭다운 액션. |
| `variant` | `'primary' \| 'secondary' \| 'signal' \| 'dark'` | No |  |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | Button family height scale: 32 / 40 / 48. @default "md" |
| `disabled` | `boolean` | No |  |
| `disable` | `boolean` | No | Disabled alias retained for compatibility. |
| `loading` | `boolean` | No | Disable both segments and show an inline spinner without changing width. |
| `loadingLabel` | `string` | No | Accessible label used while loading. @default "Loading" |
| `menuLabel` | `string` | No | Accessible name for the menu segment. @default "관련 작업 열기" |

## States

| State | Contract |
| --- | --- |
| loading | Disable both segments and show an inline spinner without changing width. |
| loadingLabel | Accessible label used while loading. @default "Loading" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | variant는 primary · secondary · signal · dark, size는 Button과 같은 sm/md/lg = 32/40/48px입니다. |
| 명시 규칙 2 | 항목이 없거나 모두 비활성인 경우 focus는 trigger에 남고, Escape는 같은 방식으로 메뉴를 닫고 trigger focus를 보존합니다. 메뉴는 아래 공간이 부족하면 위로 flip하고 viewport 16px 안으로 shift·size되어 180px 같은 좁은 폭에서도 가로 스크롤을 만들지 않습니다. |
| 명시 규칙 3 | Carbon Menu Buttons의 일반 Button과 동일한 32/40/48 높이·상태 문법을 적용하고, Fluent 2 Button의 dominant action + related alternatives 구분을 따릅니다. |
| 명시 규칙 4 | Button과 동일한 32/40/48 높이·radius·tone·disabled/loading 문법을 유지합니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- Floating UI flip, shift, size의 preferred placement 유지 → 반대편 flip → cross-axis clamp → 가용 높이 scroll 순서를 공용 anchored-overlay 측정 훅으로 구현합니다.

## Content and writing

- onClick은 기본 액션, items는 관련 대안 { label, icon, onClick, disabled, danger }입니다. 기본 액션을 menu에서 반복하지 않습니다.

## Accessibility

- disabled와 loading은 두 segment를 함께 막습니다. loading label은 하나의 accessible name으로 노출되고 버튼 폭은 유지됩니다.
- menu segment는 aria-haspopup, aria-expanded, aria-controls를 노출합니다. Enter/Space/ArrowDown은 첫 항목, ArrowUp은 마지막 항목으로 열며, ArrowUp/Down·Home/End로 이동하고 Escape는 닫은 뒤 trigger로 focus를 복원합니다.
- WAI-ARIA Menu Button Pattern과 Menu Pattern의 menu ARIA, roving focus, Escape 복원을 구현합니다.
- DropdownMenu와 menu role·키보드·viewport padding·elevated surface를 공유하지만, 기본 액션과 menu trigger가 붙어 있다는 기능 때문에 2-segment chrome만 유지합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ButtonGroup` | 대표 시나리오에서 조합 |
| `CopyButton` | 대표 시나리오에서 조합 |
| `Link` | 대표 시나리오에서 조합 |
| `SpeedDial` | 대표 시나리오에서 조합 |
| `SocialButton` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SplitButton
  variant="signal"
  onClick={save}
  loading={saving}
  loadingLabel="저장 중"
  menuLabel="저장 방법 열기"
  items={[
    { label: '초안으로 저장', onClick: draft },
    { label: '예약 저장', onClick: schedule },
    { label: '내보내기', onClick: exportFile, disabled: !canExport },
  ]}
>
  저장
</SplitButton>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--border-thin`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-inverse-line-strong`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-status-negative-text`
- `--component-button-dark-bg`
- `--component-button-dark-bg-hover`
- `--component-button-dark-fg`
- `--component-button-disabled-bg`
- `--component-button-disabled-fg`
- `--component-button-font-size-lg`
- `--component-button-font-size-md`
- `--component-button-font-size-sm`
- `--component-button-font-weight`
- `--component-button-height-lg`
- `--component-button-height-md`
- `--component-button-height-sm`
- `--component-button-letter-spacing-lg`
- `--component-button-letter-spacing-md`
- `--component-button-letter-spacing-sm`
- `--component-button-line-height-lg`
- `--component-button-line-height-md`
- `--component-button-line-height-sm`
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
- `--component-button-signal-bg`
- `--component-button-signal-bg-hover`
- `--component-button-signal-fg`
- `--component-button-transition`
- `--component-menu-item-hover-bg`
- `--component-menu-padding-x`
- `--component-menu-padding-y`
- `--component-menu-radius`
- `--font-sans`
- `--fw-medium`
- `--radius-md`
- `--shadow-md`
- `--space-2`
- `--space-3`
- `--space-8`

### Source contracts

- `components/buttons/SplitButton.jsx`
- `components/buttons/SplitButton.d.ts`
- `components/buttons/SplitButton.prompt.md`
- `stories/ActionSplitButton.stories.jsx`

## Migration

- disable — disabled의 호환 별칭입니다.

## Sources

- SplitButton prompt contract: `components/buttons/SplitButton.prompt.md`
- Storybook implementation evidence: `stories/ActionSplitButton.stories.jsx`
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [Floating UI flip](https://floating-ui.com/docs/flip)
- [shift](https://floating-ui.com/docs/shift)
- [size](https://floating-ui.com/docs/size)
- [Carbon Menu Buttons](https://carbondesignsystem.com/components/menu-buttons/usage/)
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
