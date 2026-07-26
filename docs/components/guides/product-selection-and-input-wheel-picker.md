# Wheel Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `WheelPicker` |
| Storybook | `LDS Product/Selection and Input/Wheel Picker` |
| Source | `../component-content.json#product-selection-and-input-wheel-picker` |

층·시·분처럼 순서가 있고 선택지가 짧은 값을 모바일에서 조절할 때 적합합니다. 긴 목록이나 키보드 중심 데스크톱 폼에는 Wheel Picker 대신 Select를 사용하세요.

## 사용 판단

### 사용하지 않음

- Layer: LDS Product extension. WDS Presentation/Picker/Wheels의 Date/Time variant parity를 주장하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Listbox accessible name. @default "휠 선택" |
| emptyLabel | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `Array` | No | 문자열/숫자 또는 {value, label} 배열. |
| `value` | `string \| number` | No |  |
| `defaultValue` | `string \| number` | No |  |
| `onChange` | `(value: string \| number, option: WheelPickerOption) = void` | No |  |
| `itemHeight` | `number` | No | 각 행 높이(px). @default 36 |
| `visible` | `number` | No | 보이는 행 수(홀수 권장). @default 5 |
| `width` | `React.CSSProperties['width']` | No | 컴포넌트 너비. @default 128 |
| `label` | `string` | No | Listbox accessible name. @default "휠 선택" |
| `emptyLabel` | `React.ReactNode` | No | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" |
| `disabled` | `boolean` | No |  |
| `disable` | `boolean` | No |  |
| `readOnly` | `boolean` | No |  |

## States

| State | Contract |
| --- | --- |
| visible | 보이는 행 수(홀수 권장). @default 5 |
| emptyLabel | option이 없을 때 중앙에 표시할 문구. @default "선택 항목 없음" |

## Behavior and interaction

- 스크롤 값은 드럼이 멈춘 뒤에 커밋합니다. 관성 스크롤 중간 값을 프레임마다 커밋하면 선택 동기화가 scrollTop을 되돌려 사용자 스크롤과 충돌하므로, 스크롤이 잦아든 다음 스냅된 행 하나만 onChange로 올립니다.
- WheelPicker는 한 번에 하나의 값을 고르는 scroll-snap listbox입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WCAG 2.2 Contrast Minimum |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- options는 primitive 또는 { value, label, disabled } 항목을 받습니다. value / defaultValue / onChange, itemHeight, 홀수로 보정되는 visible, width, label, emptyLabel, disabled, readOnly를 지원합니다.

## Content and writing

- 외곽 카드, inset pane, 중앙 띠, fade mask를 추가하지 않습니다. 깊이는 선택 행과 주변 행의 type scale·weight·3D transform으로만 표현하며 모든 활성 option 텍스트는 대비를 유지합니다.

## Accessibility

- listbox, aria-activedescendant, aria-selected를 사용하며 ArrowUp/ArrowDown, PageUp/PageDown, Home/End로 값을 이동합니다. 문자 입력은 type-ahead로 option label 앞부분을 매칭하고(같은 문자를 반복하면 다음 매칭으로 순환) 짧은 시간이 지나면 검색어가 초기화됩니다. disabled option은 건너뜁니다.
- readOnly는 focus와 읽기를 허용하지만 값 변경을 막습니다. disabled는 상호작용과 Tab 진입을 막습니다.
- Apple Focus and selection.

## Exceptions

- 긴 목록 검색이 필요한 경우 Select, Combobox, TreePicker를 사용합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<WheelPicker options={['B1', '1F', '2F', '3F']} defaultValue="1F" onChange={setFloor} />
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-ring`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--headline1-line`
- `--headline1-size`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--radius-md`
- `--space-3`

### Source contracts

- `components/selection/WheelPicker.jsx`
- `components/selection/WheelPicker.d.ts`
- `components/selection/WheelPicker.prompt.md`
- `stories/SelectionWheelPicker.stories.jsx`

## Sources

- WheelPicker prompt contract: `components/selection/WheelPicker.prompt.md`
- Storybook implementation evidence: `stories/SelectionWheelPicker.stories.jsx`
- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)
- [Apple Focus and selection](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection/)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
