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

- 공간을 적게 쓰면서 선택·필터·다중 선택 상태를 반복해서 바꿀 때 적합합니다. 중요한 실행에는 Button을, 조작할 수 없는 상태 표기에는 Badge나 Tag를 사용하세요.
- Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection.
- Selected text uses the current theme's normal label foreground. The tinted surface, accent border, and pressed/selected semantics carry selection, so selection does not depend on blue text alone.
- Use disabled for an unavailable action chip.

### 사용하지 않음

- An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics. If a consumer forces a non-button element wh….
- Toggle chips expose aria-pressed. When a chip is interactive and a toggle state was supplied (selected, active, or pressed), the button carries aria-pressed, so selection is announced instead of being carried by the tinted surface alone.
- A non-interactive selected chip cannot own aria-pressed — a with no role must not claim a pressed state. It appends the visually hidden selectedLabel (선택됨) instead, so the selected state still reaches assistive tech without changing the rendered visual.
- - An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics. If a consumer forces a non-button element….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Chip의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Selected Label | Visually hidden text appended to a non-interactive selected chip so the selected state is not carried by colour alone. Pass null to opt out. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

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
| `href` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| variant | chip visual variant mapped through LK theme tokens. @default "default" 타입 계약: "default" \| "solid" \| "outlined" |
| selected | Selected or pinned chip state. @default false 타입 계약: boolean |
| active | Active alias. @default false 타입 계약: boolean |
| pressed | Explicit toggle state. Overrides selected/active when deciding the aria-pressed value of an interactive chip. 타입 계약: boolean |
| selectedLabel | Visually hidden text appended to a non-interactive selected chip so the selected state is not carried by colour alone. Pass null to opt out. 타입 계약: React.ReactNode |
| disabled | Disable pointer activation and show unavailable styling. @default false 타입 계약: boolean |
| 변형·상태 · 다크 테마 선택 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection.
- selectedLabel is the visually hidden text appended to a non-interactive selected chip (default 선택됨); pass null to opt out.
- Selected text uses the current theme's normal label foreground. The tinted surface, accent border, and pressed/selected semantics carry selection, so selection does not depend on blue text alone.
- Keep filtering and multi-select state in selection components when the chip is acting as an input control rather than a simple action/tag.
- Chip is for interactive/selectable keywords. Use Tag for uppercase display eyebrow pills and ContentBadge for non-interactive informational content labels.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Reference basis: WAI-ARIA APG Button pattern — toggle buttons, WCAG 2.2 1.4.1 Use of Colour, WCAG 2.2 4.1.2 Name, Role, Value. |
| 명시 규칙 2 | WCAG 2.2 contrast minimum sets a 4.5:1 threshold for normal-size text. |
| 명시 규칙 3 | - An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics. If a consumer forces a non-button element… |
| 명시 규칙 4 | - WCAG 2.2 contrast minimum sets a 4.5:1 threshold for normal-size text. - Carbon Button usage keeps hierarchy in the component treatment and states perceivable. LDS applies that conclusion to compact selected controls without copying Carbon styling. - The filled surface, border, check/pressed semantics, and weight pr… |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- Use leading for icon content and thumbnail for compact media content.
- Carbon Button usage keeps hierarchy in the component treatment and states perceivable. LDS applies that conclusion to compact selected controls without copying Carbon styling.
- Chip is the WDS Action/Chip primitive for compact labels, links, and selected tags. LDS keeps the action role while mapping hover and selected visuals through LK theme tokens.
- - size: xs, sm, md, lg; these map to the WDS xsmall/small/medium/large axis. - variant: default, solid, outlined. - Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection. - selectedLabel is the visually hidden….

## Content and writing

- selectedLabel is the visually hidden text appended to a non-interactive selected chip (default 선택됨); pass null to opt out.
- Selected text uses the current theme's normal label foreground. The tinted surface, accent border, and pressed/selected semantics carry selection, so selection does not depend on blue text alone.
- Chip is for interactive/selectable keywords. Use Tag for uppercase display eyebrow pills and ContentBadge for non-interactive informational content labels.
- A non-interactive selected chip cannot own aria-pressed — a with no role must not claim a pressed state. It appends the visually hidden selectedLabel (선택됨) instead, so the selected state still reaches assistive tech without changing the rendered visual.

## Accessibility

- Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection.
- An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics. If a consumer forces a non-button element wh….
- Toggle chips expose aria-pressed. When a chip is interactive and a toggle state was supplied (selected, active, or pressed), the button carries aria-pressed, so selection is announced instead of being carried by the tinted surface alone.
- A non-interactive selected chip cannot own aria-pressed — a with no role must not claim a pressed state. It appends the visually hidden selectedLabel (선택됨) instead, so the selected state still reaches assistive tech without changing the rendered visual.
- Reference basis: WAI-ARIA APG Button pattern — toggle buttons, WCAG 2.2 1.4.1 Use of Colour, WCAG 2.2 4.1.2 Name, Role, Value.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection. |
| Don't | An onClick chip is a real . The element default is now onClick ? "button" : "span", so a clickable chip is reachable by Tab and activated by Enter/Space instead of being a roleless that only responds to a mouse. An explicit as still wins; as="a" + href keeps link semantics. If a consumer forces a non-button element wh…. |
| Do | Selected text uses the current theme's normal label foreground. The tinted surface, accent border, and pressed/selected semantics carry selection, so selection does not depend on blue text alone. |
| Don't | Toggle chips expose aria-pressed. When a chip is interactive and a toggle state was supplied (selected, active, or pressed), the button carries aria-pressed, so selection is announced instead of being carried by the tinted surface alone. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Chip의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FilterChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MultiSelectChip` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Avatar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `AvatarGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Badge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Notification` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PushBadge` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Tag` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection.
- - size: xs, sm, md, lg; these map to the WDS xsmall/small/medium/large axis. - variant: default, solid, outlined. - Use selected (or its active alias) for a pinned or selected state, and pressed to state the aria-pressed value explicitly when it differs from the visual selection. - selectedLabel is the visually hidden….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Chip prompt contract: `components/feedback/Chip.prompt.md`
- Storybook implementation evidence: `stories/SelectionChips.stories.jsx`
- [WAI-ARIA APG Button pattern — toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WCAG 2.2 1.4.1 Use of Colour](https://www.w3.org/TR/WCAG22/#use-of-color)
- [WCAG 2.2 4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [Carbon Button usage](https://carbondesignsystem.com/components/button/usage/)
- [SEED Chip benchmark](https://seed-design.io/components/chip)
