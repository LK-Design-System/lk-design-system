# Time Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `TimePicker` |
| Storybook | `LDS Product/Selection and Input/Time Picker` |
| Source | `../component-content.json#product-selection-and-input-time-picker` |

예약 시작이나 점검 시각처럼 하루 안의 특정 시간을 고를 때 적합합니다. 날짜나 기간까지 함께 필요하면 Time Picker 하나로 확장하지 말고 Date Picker·Date Range와 조합하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| hourLabel | 시 select의 accessible name. @default "시" |
| minuteLabel | 분 select의 accessible name. @default "분" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | No | "HH:MM" 문자열. |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `minuteStep` | `number` | No | 분 증가폭. @default 5 |
| `hourLabel` | `string` | No | 시 select의 accessible name. @default "시" |
| `minuteLabel` | `string` | No | 분 select의 accessible name. @default "분" |
| `size` | `'sm' \| 'md'` | No |  |
| `disabled` | `boolean` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm\|md. disabled — 두 select를 함께 잠급니다. |
| 명시 규칙 2 | 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다. |
| 명시 규칙 3 | TimePicker — keyboard와 platform picker를 보존하는 native 시 + 분 select(24시간)입니다. |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Accessibility

- 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- WAI-ARIA Authoring Practices: Read Me First의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<TimePicker defaultValue="14:30" minuteStep={10} onChange={setTime} />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-focus-shadow`
- `--component-input-height`
- `--component-input-icon-color`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--space-2`

### Source contracts

- `components/forms/TimePicker.jsx`
- `components/forms/TimePicker.d.ts`
- `components/forms/TimePicker.prompt.md`
- `stories/FormTimePicker.stories.jsx`

## Sources

- TimePicker prompt contract: `components/forms/TimePicker.prompt.md`
- Storybook implementation evidence: `stories/FormTimePicker.stories.jsx`
- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)
- [WAI-ARIA Authoring Practices: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
