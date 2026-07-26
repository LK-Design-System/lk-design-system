# Chip

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Chip` |
| Storybook | `LDS Core/Components/Selection and Input/Chip` |
| Source | `../component-content.json#core-components-selection-and-input-chip` |

공간을 적게 쓰면서 선택·필터·다중 선택 상태를 반복해서 바꿀 때 적합합니다. 중요한 실행에는 Button을, 조작할 수 없는 상태 표기에는 Badge나 Tag를 사용하세요.

## 사용 판단

### 사용

- Use disabled for an unavailable action chip.
- Use as="a" with href for linked chips.

## Anatomy

| Part | Contract |
| --- | --- |
| selectedLabel | Visually hidden text appended to a non-interactive selected chip so the selected state is not carried by colour alone. Pass null to opt out. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | No | Render element. Use "a" for linked chips. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xsmall" \| "small" \| "medium" \| "large"` | No | chip size mapped from xsmall/small/medium/large. @default "md" |
| `variant` | `"default" \| "solid" \| "outlined"` | No | chip visual variant mapped through LK theme tokens. @default "default" |
| `selected` | `boolean` | No | Selected or pinned chip state. @default false |
| `active` | `boolean` | No | Active alias. @default false |
| `pressed` | `boolean` | No | Explicit toggle state. Overrides selected/active when deciding the aria-pressed value of an interactive chip. |
| `selectedLabel` | `React.ReactNode` | No | Visually hidden text appended to a non-interactive selected chip so the selected state is not carried by colour alone. Pass null to opt out. |
| `disabled` | `boolean` | No | Disable pointer activation and show unavailable styling. @default false |
| `disable` | `boolean` | No | Disable alias. @default false |
| `leading` | `React.ReactNode` | No | Optional leading icon content. |
| `thumbnail` | `React.ReactNode` | No | Optional thumbnail content. Takes precedence over leading. |
| `href` | `string` | No |  |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| variant | chip visual variant mapped through LK theme tokens. @default "default" |
| selected | Selected or pinned chip state. @default false |
| active | Active alias. @default false |
| pressed | Explicit toggle state. Overrides selected/active when deciding the aria-pressed value of an interactive chip. |
| selectedLabel | Visually hidden text appended to a non-interactive selected chip so the selected state is not carried by colour alone. Pass null to opt out. |
| disabled | Disable pointer activation and show unavailable styling. @default false |

## Behavior and interaction

- Keep filtering and multi-select state in selection components when the chip is acting as an input control rather than a simple action/tag.
- The filled surface, border, check/pressed semantics, and weight preserve the selected state without color. No additional marker or variant is introduced.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Reference basis: WAI-ARIA APG Button pattern — toggle buttons, WCAG 2.2 1.4.1 Use of Colour, WCAG 2.2 4.1.2 Name, Role, Value. |
| 명시 규칙 2 | WCAG 2.2 contrast minimum sets a 4.5:1 threshold for normal-size text. |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --component-chip-gap-lg | 3px |
| --component-chip-gap-md | 3px |

## Responsive

- Use leading for icon content and thumbnail for compact media content.
- Carbon Button usage keeps hierarchy in the component treatment and states perceivable. LDS applies that conclusion to compact selected controls without copying Carbon styling.
- Chip is the WDS Action/Chip primitive for compact labels, links, and selected tags. LDS keeps the action role while mapping hover and selected visuals through LK theme tokens.

## Content and writing

- selectedLabel is the visually hidden text appended to a non-interactive selected chip (default 선택됨); pass null to opt out.
- Selected text uses the current theme's normal label foreground. The tinted surface, accent border, and pressed/selected semantics carry selection, so selection does not depend on blue text alone.
- Chip is for interactive/selectable keywords. Use Tag for uppercase display eyebrow pills and ContentBadge for non-interactive informational content labels.

## Accessibility

- Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection.
- An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics.
- Toggle chips expose aria-pressed. When a chip is interactive and a toggle state was supplied (selected, active, or pressed), the button carries aria-pressed, so selection is announced instead of being carried by the tinted surface alone.
- A non-interactive selected chip cannot own aria-pressed — a with no role must not claim a pressed state. It appends the visually hidden selectedLabel (선택됨) instead, so the selected state still reaches assistive tech without changing the rendered visual.
- Accessibility contract.

## Related components

| Component | Relationship |
| --- | --- |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `Avatar` | 대표 시나리오에서 조합 |
| `AvatarGroup` | 대표 시나리오에서 조합 |
| `Badge` | 대표 시나리오에서 조합 |
| `Notification` | 대표 시나리오에서 조합 |
| `PushBadge` | 대표 시나리오에서 조합 |
| `Tag` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Chip>Autonomy</Chip>
<Chip selected>EO/IR</Chip>
<Chip size="xs">XS</Chip>
<Chip variant="solid">Solid</Chip>
<Chip variant="outlined">Outlined</Chip>
<Chip leading={<Icon name="filter" size={14} />}>Filtered</Chip>
<Chip as="a" href="product.html?p=LKR-CP">LKR-CP</Chip>
```

## Tokens and API

### Tokens

- `--color-semantic-label-disable`
- `--component-chip-bg`
- `--component-chip-bg-hover`
- `--component-chip-bg-selected`
- `--component-chip-border`
- `--component-chip-border-active`
- `--component-chip-fg`
- `--component-chip-fg-active`
- `--component-chip-font-size-lg`
- `--component-chip-font-size-md`
- `--component-chip-font-size-sm`
- `--component-chip-font-size-xs`
- `--component-chip-font-weight`
- `--component-chip-gap-lg`
- `--component-chip-gap-md`
- `--component-chip-gap-sm`
- `--component-chip-gap-xs`
- `--component-chip-height-lg`
- `--component-chip-height-md`
- `--component-chip-height-sm`
- `--component-chip-height-xs`
- `--component-chip-letter-spacing-lg`
- `--component-chip-letter-spacing-md`
- `--component-chip-letter-spacing-sm`
- `--component-chip-letter-spacing-xs`
- `--component-chip-media-size-lg`
- `--component-chip-media-size-md`
- `--component-chip-media-size-sm`
- `--component-chip-media-size-xs`
- `--component-chip-padding-x-lg`
- `--component-chip-padding-x-md`
- `--component-chip-padding-x-sm`
- `--component-chip-padding-x-xs`
- `--component-chip-radius-lg`
- `--component-chip-radius-md`
- `--component-chip-radius-sm`
- `--component-chip-radius-xs`
- `--component-chip-solid-bg`
- `--component-chip-solid-border`
- `--component-chip-solid-fg`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--radius-sm`

### Source contracts

- `components/feedback/Chip.jsx`
- `components/feedback/Chip.d.ts`
- `components/feedback/Chip.prompt.md`
- `stories/SelectionChips.stories.jsx`

## Sources

- Chip prompt contract: `components/feedback/Chip.prompt.md`
- Storybook implementation evidence: `stories/SelectionChips.stories.jsx`
- [WAI-ARIA APG Button pattern — toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WCAG 2.2 1.4.1 Use of Colour](https://www.w3.org/TR/WCAG22/#use-of-color)
- [WCAG 2.2 4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [Carbon Button usage](https://carbondesignsystem.com/components/button/usage/)
