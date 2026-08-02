# Icon Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `IconPicker` |
| Storybook | `LDS Product/Selection and Input/Icon Picker` |
| Source | `../component-content.json#product-selection-and-input-icon-picker` |

빌딩·마커·카테고리에 쓸 작은 curated 아이콘 집합에서 하나를 고를 때 적합합니다. 전체 레지스트리를 검색하거나 아이콘을 탐색하는 화면에는 별도 검색 UI를 사용하세요.

## 사용 판단

### 사용

- Layer: LDS Product extension. Local WDS .fig inspection did not find an exact Icon Picker component set; use WDS/LDS icon foundation assets without claiming WDS component variant parity.

### 사용하지 않음

- columns가 시각 그리드를 만들므로 Arrow Left/Right는 선형으로 순환 이동하고 Arrow Up/Down은 한 행(columns개)씩 이동합니다. 같은 열에 활성 타일이 없으면 같은 방향으로 계속 찾고 그리드 밖이면 제자리에 머뭅니다. Home/End는 첫/마지막 활성 타일로 갑니다. 모든 이동은 선택을 함께 옮기고 disabled 타일은 건너뜁니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Radiogroup accessible name. @default "아이콘 선택" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `IconPickerOption[]` | No |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `columns` | `number` | No | 열 수. @default 6 |
| `size` | `'sm' \| 'md' \| 'lg'` | No | 타일 크기. @default "md" |
| `label` | `string` | No | Radiogroup accessible name. @default "아이콘 선택" |
| `disabled` | `boolean` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |

## Behavior and interaction

- Apple Focus and selection을 따라 focus ring과 selected surface를 서로 다른 상태로 보여줍니다.
- IconPicker — 선택 가능한 아이콘 타일 그리드(빌딩·마커·카테고리 아이콘 지정).

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- value/defaultValue, onChange(value), columns, size, disabled, emptyLabel을 지원합니다. 그룹 자체의 접근 가능 이름은 컴포넌트 label prop(기본 아이콘 선택)입니다.

## Accessibility

- options는 {value, icon, label?, disabled?}[]입니다. label은 타일의 accessible name과 hover title로 사용합니다.
- Compare against common icon picker expectations before changing it: single selected value, radio-group semantics, disabled options, empty state, keyboard navigation, accessible labels for icon-only tiles, and stable tile sizing.
- 라디오그룹으로 동작하며 그룹 전체가 Tab stop 하나만 갖습니다. Tab stop은 이동 위치를 따르고, 이동 위치가 없거나 비활성이면 선택 위치(없으면 첫 활성 타일)로 되돌아갑니다. controlled 사용에서 onChange가 value를 갱신하지 않아도 Tab stop이 둘로 갈라지지 않습니다.
- 빈 상태 안내는 역할 없는 정적 텍스트입니다. aria-disabled 같은 상태 속성을 붙이지 않습니다.
- hover는 neutral fill, keyboard focus는 LDS focus ring, selection은 primary surface/border로 분리합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<IconPicker
  options={[{ value: 'dock', icon: <Icon name="anchor" />, label: '도킹' }]}
  defaultValue="dock"
  onChange={setIcon}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--radius-lg`
- `--radius-md`
- `--radius-sm`
- `--space-2`
- `--space-3`

### Source contracts

- `components/selection/IconPicker.jsx`
- `components/selection/IconPicker.d.ts`
- `components/selection/IconPicker.prompt.md`
- `stories/SelectionIconPicker.stories.jsx`

## Migration

- DS 관행상 타일은 semantic line/fill/background token과 Icon registry 기반 아이콘을 사용하고, legacy border/background 토큰이나 임의 SVG를 넣지 않습니다.

## Sources

- IconPicker prompt contract: `components/selection/IconPicker.prompt.md`
- Storybook implementation evidence: `stories/SelectionIconPicker.stories.jsx`
- [WAI-ARIA Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
