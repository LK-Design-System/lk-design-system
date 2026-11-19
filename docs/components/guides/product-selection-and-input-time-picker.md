# Time Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `TimePicker` |
| Storybook | `LDS Product/Selection and Input/Time Picker` |
| Source | `../component-content.json#product-selection-and-input-time-picker` |

예약 시작이나 점검 시각처럼 하루 안의 특정 시간을 고를 때 적합합니다. 날짜나 기간까지 함께 필요하면 Time Picker 하나로 확장하지 말고 Date Picker·Date Range와 조합하세요.

## 사용 판단

### 사용하지 않음

- 공용 계약은 시간 입력만 소유합니다. Full Daedeok ScheduleForm의 native time 입력은 기본 minute API로 조합 가능하며 기존 의미를 유지합니다. LK Portal의 확인한 archived playback seam은 시각 입력을 노출하지 않아 이 확장은 not applicable입니다. LK Web Viz frontend에도 직접 시간 입력 seam이 없어 not applicable입니다.
- minTime/maxTime은 HH:MM 또는 HH:MM:SS의 같은 날 inclusive 범위입니다. 범위 밖 option을 disabled로 노출하고 시·분 변경이 경계에 걸리면 유효 범위로 clamp합니다. 분 정밀도는 lower를 올림·upper를 내림해 범위를 넓히지 않습니다. invalid/뒤집힌 경계와 표현 불가 범위는 선택 불가이며, 자정 넘김을 추측하지 않습니다. 날짜·실제 데이터 유무·소수부·query·timezone은 제품이 소유합니다.
- LK Product Extension의 추가 입력 축 allowedTimeRanges는 {start, end} 배열이며 각 값은 같은 날의 HH:MM 또는 HH:MM:SS inclusive 시각입니다. 생략하면 기존 min/max만 적용하고, 빈 배열·잘못된 구간은 선택을 잠급니다. 각 구간을 min/max와 교차한 뒤 현재 정밀도로 lower 올림·upper 내림합니다. 따라서 08:30:01–08:30:59는 초 정밀도에서 선택할 수 있지만 분 정밀도에서는 선택할 수 없습니다.
- 기존 field·native 시/분/초·Core Popover·Button의 시각 문법을 유지합니다. 해당 시 또는 분 안에 유효한 값이 있을 때만 그 단위를 활성화하고, 초는 실제 허용 여부를 그대로 native option.disabled로 전달합니다. 시·분 변경은 선택한 단위 안의 가장 가까운 유효 시각을 draft로 정하며 공백으로 commit하지 않습니다. 범위가 바뀌어도 field의 확인 전에는 onChange를 호출하지 않습니다. 확인·취소·Escape·focus 복귀 계약은 같습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| allowedTimeRanges | Inclusive same-day clock intervals (HH:MM or HH:MM:SS), intersected with minTime/maxTime. Omitted permits the bound range; [] or invalid intervals disable all choices. Dates and endpoint semantics remain consumer-owned. |
| hourLabel | 시 select의 accessible name. @default "시" |
| minuteLabel | 분 select의 accessible name. @default "분" |
| secondLabel | 초 select의 accessible name. @default "초" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | No | minute precision: "HH:MM". second precision: "HH:MM:SS". |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `minuteStep` | `number` | No | 분 증가폭. @default 5 |
| `precision` | `'minute' \| 'second'` | No | Output precision; minute preserves the existing two-select API. @default "minute" |
| `presentation` | `'units' \| 'field'` | No | units commits each native change; field drafts in a Popover and commits on 확인. @default "units" |
| `minTime` | `string` | No | Inclusive same-day minimum, HH:MM or HH:MM:SS. Invalid/reversed bounds disable selection. |
| `maxTime` | `string` | No | Inclusive same-day maximum, HH:MM or HH:MM:SS. |
| `allowedTimeRanges` | `readonly {start: string; end: string}[]` | No | Inclusive same-day clock intervals (HH:MM or HH:MM:SS), intersected with minTime/maxTime. Omitted permits the bound range; [] or invalid intervals disable all choices. Dates and endpoint semantics remain consumer-owned. |
| `secondStep` | `number` | No | 초 증가폭(160); precision="second"일 때 사용. @default 1 |
| `hourLabel` | `string` | No | 시 select의 accessible name. @default "시" |
| `minuteLabel` | `string` | No | 분 select의 accessible name. @default "분" |
| `secondLabel` | `string` | No | 초 select의 accessible name. @default "초" |
| `size` | `'sm' \| 'md'` | No |  |
| `disabled` | `boolean` | No |  |

## States

| State | Contract |
| --- | --- |
| allowedTimeRanges | Inclusive same-day clock intervals (HH:MM or HH:MM:SS), intersected with minTime/maxTime. Omitted permits the bound range; [] or invalid intervals disable all choices. Dates and endpoint semantics remain consumer-owned. |

## Behavior and interaction

- Full Daedeok의 확인한 ScheduleForm minute API는 그대로 조합 가능하며 이 제품에 불연속 구간을 새로 부여하지 않습니다. 확인한 Portal archived video seam과 maintenance-only Web Viz Dashboard에는 직접 시각 선택 seam이 없어 해당 확장은 not applicable입니다. time-picker-allowed-ranges-20261015 coverage record에 실제 frontend source pin과 분리된 판단을 남깁니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value / defaultValue / onChange — 기본 precision="minute"에서는 "HH:MM", precision="second"에서는 "HH:MM:SS". 초 정밀도에서 누락된 초는 00으로 표현하고 초는 정수 059로 제한합니다. secondStep은 기본1, 160으로 정규화하고 step 밖 controlled 초 option을 보존합니다. secondLabel은 초 select 이름(기본 "초")입니다. 날짜·timezone·KST 직렬화는 제품 소유이며 컴포넌트는 시간 단위만 반환합니다. |
| 명시 규칙 2 | 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다. |
| 명시 규칙 3 | TimePicker — keyboard와 platform picker를 보존하는 native 시 + 분(+ 선택적 초) select(24시간)입니다. |
| 명시 규칙 4 | 초 정밀도 확장(2026-10-15) |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- 기존 minute-only 호출·기본5분·두 native select를 유지합니다. 초 단위가 필요한 녹화 조회는 precision="second" minuteStep={1}을 명시합니다. 시·분·초 select는 같은 TimeSelect chrome, 76px 최소 폭, Input 높이·포커스·비활성 문법을 재사용하고 새 listbox/아이콘/색을 만들지 않습니다. 기본 minute와 second의 차이는 필요한 단위 select 하나뿐입니다. 320px에서 세 select를 한 줄로 유지하며 기존 시·분 값 변경은 초를 보존합니다.

## Accessibility

- 단위 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- WAI-ARIA Authoring Practices: Read Me First의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.
- MDN time value format은 24시간 HH:mm / HH:mm:ss 구분을 명시합니다. W3C APG native semantics 우선 원칙에 따라 기존 native select의 keyboard/type-ahead/mobile picker를 유지합니다. 정밀도 때문에 custom popup을 추가하지 않습니다.
- presentation="units"가 기존 기본이고 각 단위 변경을 즉시 전달합니다. presentation="field"는 HH:MM(:SS)와 clock 아이콘을 한 trigger에 모읍니다. Core Popover에서 기존 native 단위를 draft로 고르고 확인에서만 onChange를 한 번 호출합니다. 취소·바깥 클릭·Escape는 draft를 버리고 trigger로 focus를 복원합니다. 팝업의 native select는 같은 field chrome을 유지하고 320px viewport에서 panel의 가용 폭에 맞춰 줄어듭니다.

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
- `--component-input-gap`
- `--component-input-height`
- `--component-input-icon-color`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--space-2`
- `--space-4`

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
- [MDN time value format](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time#time_value_format)
- [W3C APG native semantics 우선 원칙](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
- [Ant Design TimePicker](https://ant.design/components/time-picker/)
- [W3C picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- [Ant Design TimePicker의 disabledHours/disabledMinutes/disabledSeconds](https://ant.design/components/time-picker/#disabledtime)
- [WHATWG option disabled](https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-disabled)
