# Toggle Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `ToggleButton` |
| Storybook | `LDS Product/Selection and Input/Toggle Button` |
| Source | `../component-content.json#product-selection-and-input-toggle-button` |

레이어 표시·미리보기처럼 즉시 실행 후 pressed 상태가 계속 남는 독립 기능에 적합합니다. 여러 보기 중 하나를 고르는 전환에는 Toggle Button 대신 Segmented Control을 사용하세요.

## 사용 판단

### 사용

- 여러 보기 중 하나를 고르는 전환에는 SegmentedControl, 여러 독립 토글을 묶을 때는 ButtonGroup multiple, 슬라이드 on/off에는 Switch를 사용합니다.

### 사용하지 않음

- hover/pressed는 calm tone만 사용합니다. persistent pressed 상태와 순간 pointer pressed 상태를 동일하게 취급하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| icon | 선택적 리딩 아이콘 노드. |
| children | 아이콘 전용 정사각 토글은 구체적인 aria-label을 제공해야 합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `pressed` | `boolean` | No | 제어되는 눌림 상태. |
| `defaultPressed` | `boolean` | No | 비제어 초기 상태. @default false |
| `onChange` | `(next: boolean) = void` | No |  |
| `icon` | `React.ReactNode` | No | 선택적 리딩 아이콘 노드. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | No | Button family height scale: 32 / 40 / 48. @default "md" |
| `disable` | `boolean` | No | Disabled alias retained for compatibility. |
| `children` | `React.ReactNode` | No | 아이콘 전용 정사각 토글은 구체적인 aria-label을 제공해야 합니다. |

## States

| State | Contract |
| --- | --- |
| pressed | 제어되는 눌림 상태. |
| defaultPressed | 비제어 초기 상태. @default false |

## Behavior and interaction

- pressed / defaultPressed / onChange(next)는 제어/비제어 상태입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size는 Button family와 같은 sm/md/lg = 32/40/48px입니다. |
| 명시 규칙 2 | Fluent 2 Button은 toggle button을 toolbar 같은 독립 상태 액션에 사용하고 설정 패널에서는 Switch를 사용하도록 구분합니다. |
| --border-thin | 1px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |

## Accessibility

- native disabled와 focus 가능한 aria-disabled를 구분하며 두 경우 모두 activation을 막고 같은 unavailable 스타일을 적용합니다.
- 아이콘 전용 사용은 구체적인 aria-label을 반드시 제공합니다.
- WAI-ARIA Button Pattern의 고정 label + aria-pressed 계약을 따릅니다.
- ToggleButton은 독립 기능의 켬·끔 상태를 버튼 자체에 유지하는 LK Product Extension입니다. 선택 상태는 surface와 aria-pressed로 함께 전달합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ToggleButton icon={<Icon name="eye" size={18} />} onChange={setPreview}>
  미리보기
</ToggleButton>
<ToggleButton defaultPressed icon={<Icon name="star" size={18} />} aria-label="즐겨찾기" />
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--component-button-disabled-bg`
- `--component-button-font-size-lg`
- `--component-button-font-size-md`
- `--component-button-font-size-sm`
- `--component-button-font-weight`
- `--component-button-gap-lg`
- `--component-button-gap-md`
- `--component-button-gap-sm`
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
- `--component-button-radius-lg`
- `--component-button-radius-md`
- `--component-button-radius-sm`
- `--component-button-transition`
- `--font-sans`

### Source contracts

- `components/selection/ToggleButton.jsx`
- `components/selection/ToggleButton.d.ts`
- `components/selection/ToggleButton.prompt.md`
- `stories/SelectionToggleButton.stories.jsx`

## Migration

- disable — disabled의 호환 별칭입니다.

## Sources

- ToggleButton prompt contract: `components/selection/ToggleButton.prompt.md`
- Storybook implementation evidence: `stories/SelectionToggleButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Fluent 2 Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)
