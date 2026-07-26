# Radio

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Radio` |
| Storybook | `LDS Core/Components/Selection and Input/Radio` |
| Source | `../component-content.json#core-components-selection-and-input-radio` |

비교해야 할 선택지가 적고 반드시 하나만 고르는 폼에 적합합니다. 여러 항목을 함께 선택하거나 옵션이 많아 공간을 줄여야 할 때는 Radio 대신 Checkbox 또는 Select를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 컨트롤 옆 라벨. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 컨트롤 옆 라벨. |
| `checked` | `boolean` | No | 이 옵션의 선택 여부. |
| `defaultChecked` | `boolean` | No | Initial checked state for uncontrolled usage. |
| `name` | `string` | No | 라디오 세트가 공유하는 그룹 이름. |
| `value` | `string` | No | 이 옵션의 값. |
| `onChange` | `(e: React.ChangeEvent) = void` | No | 네이티브 change 핸들러. |
| `size` | `"sm" \| "md" \| "small" \| "medium"` | No | 컨트롤 크기. @default "md" |
| `state` | `"unchecked" \| "checked"` | No | fixed visual state for evidence matrices. |
| `bold` | `boolean` | No | custom typography emphasis alias. |
| `tight` | `boolean` | No | 라벨 간격을 좁힘. @default false |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused"` | No |  |
| `disabled` | `boolean` | No | 흐림 + 상호작용 차단. @default false |
| `disable` | `boolean` | No | disabled alias. |
| `labelStyle` | `React.CSSProperties` | No |  |
| `style` | `React.CSSProperties` | No |  |
| `id` | `string` | No |  |
| `aria-label` | `string` | No |  |

## States

| State | Contract |
| --- | --- |
| checked | 이 옵션의 선택 여부. |
| defaultChecked | Initial checked state for uncontrolled usage. |
| state | fixed visual state for evidence matrices. |
| disabled | 흐림 + 상호작용 차단. @default false |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Related radios share name; uncontrolled radios synchronize their custom indicator with the browser's native group state. The label gap is 8px and the default selected dot is 12px. |
| 명시 규칙 2 | Radio — 1.5px 헤어라인 원(20px, sm 16px). 선택되면 원이 시그널 잉크로 채워지고 화이트 중앙 점이 나타납니다. 그룹은 같은 name을 공유하세요. |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-ink | light: #0E1329; dark: #E7EAF2 |

## Content and writing

- Disabled and checked are independent states: a disabled checked radio keeps its neutral center dot so the current value remains visible, while primary fill/border is removed and label, ring, and dot use disabled-neutral roles.

## Accessibility

- Arrow-key behavior and single-selection semantics come from the native radio input. Do not replace it with independent custom tab stops.
- Reference basis: WAI-ARIA Radio Group pattern and GOV.UK Radios.

## Related components

| Component | Relationship |
| --- | --- |
| `RadioGroup` | 대표 시나리오에서 조합 |
| `Checkbox` | 대표 시나리오에서 조합 |
| `CheckboxGroup` | 대표 시나리오에서 조합 |
| `FilterChip` | 대표 시나리오에서 조합 |
| `MultiSelectChip` | 대표 시나리오에서 조합 |
| `RangeSlider` | 대표 시나리오에서 조합 |
| `SegmentedControl` | 대표 시나리오에서 조합 |
| `Slider` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Radio name="type" value="product" checked={t==='product'} onChange={()=>setT('product')} label="제품 문의" />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-disable`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-input-gap`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--radius-pill`

### Source contracts

- `components/forms/Radio.jsx`
- `components/forms/Radio.d.ts`
- `components/forms/Radio.prompt.md`
- `stories/FormRadio.stories.jsx`

## Sources

- Radio prompt contract: `components/forms/Radio.prompt.md`
- Storybook implementation evidence: `stories/FormRadio.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [GOV.UK Radios](https://design-system.service.gov.uk/components/radios/)
