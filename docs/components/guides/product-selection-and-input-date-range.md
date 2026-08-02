# Date Range

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `DateRangeField` |
| Storybook | `LDS Product/Selection and Input/Date Range` |
| Source | `../component-content.json#product-selection-and-input-date-range` |

조회·예약 기간처럼 두 날짜의 순서 검증과 자주 쓰는 preset이 필요할 때 적합합니다. 날짜 하나만 받는 폼에는 Date Range 대신 Date Picker를 사용하세요.

## 사용 판단

### 사용하지 않음

- 두 개의 기존 DatePicker를 시작일·종료일 하나의 group으로 묶는 LK Product Extension입니다. WDS variant 축을 주장하지 않으며, 기간 preset의 날짜 계산과 query 직렬화는 제품이 소유합니다.
- Carbon의 단일 calendar에서 연속 범위를 칠하는 표시는 현재 LDS Calendar에 없는 별도 상호작용 축이므로 이번 Product 조합에는 추가하지 않았습니다. 대신 두 날짜의 의미와 오류를 명시적으로 보장합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| startAccessibleLabel | startLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "시작일" |
| endAccessibleLabel | endLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "종료일" |
| groupLabel | range group accessible name. @default "기간 선택" |
| showFieldLabels | 각 field의 보이는 label. 툴바에서는 false로 줄일 수 있으며 accessible name은 유지됩니다. @default true |
| errorMessage | Product validation message. Order errors use a specific default; other invalid states use a neutral range prompt. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `DateRangeValue \| null` | No | 제어 기간 값. |
| `defaultValue` | `DateRangeValue` | No | 비제어 초기 기간 값. |
| `onChange` | `(value: DateRangeValue) = void` | No | 시작일 또는 종료일이 바뀔 때 전체 기간과 함께 호출됩니다. |
| `startLabel` | `React.ReactNode` | No |  |
| `endLabel` | `React.ReactNode` | No |  |
| `startAccessibleLabel` | `string` | No | startLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "시작일" |
| `endAccessibleLabel` | `string` | No | endLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "종료일" |
| `groupLabel` | `string` | No | range group accessible name. @default "기간 선택" |
| `showFieldLabels` | `boolean` | No | 각 field의 보이는 label. 툴바에서는 false로 줄일 수 있으며 accessible name은 유지됩니다. @default true |
| `presets` | `React.ReactNode` | No | 오늘/최근 7일처럼 제품이 날짜 계산을 소유하는 preset control 슬롯. |
| `invalid` | `boolean` | No |  |
| `errorMessage` | `React.ReactNode` | No | Product validation message. Order errors use a specific default; other invalid states use a neutral range prompt. |
| `size` | `'sm' \| 'md'` | No | 내부 DatePicker 크기. @default "sm" |
| `disabled` | `boolean` | No |  |

## States

| State | Contract |
| --- | --- |
| errorMessage | Product validation message. Order errors use a specific default; other invalid states use a neutral range prompt. |

## Behavior and interaction

- value/defaultValue/onChange로 controlled 또는 uncontrolled 기간을 구성합니다.
- 시작일이 정해지면 종료일 달력에 minDate로 전달되어 잘못된 순서를 사전에 차단합니다. 순서 오류 자체는 preset이나 controlled 값처럼 외부에서 들어올 수 있으므로 사후 검증도 그대로 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 오류는 두 DatePicker trigger에 invalid와 aria-describedby로 직접 연결됩니다. role="group"은 ARIA 1.2에서 aria-invalid를 지원하지 않으므로 group에는 오류 메시지 설명(aria-describedby)만 남기고, 필드 단위 오류 표시는 각 trigger가 담당합니다. 시각 상태는 data-date-range-invalid로도 노출됩니다. |
| 명시 규칙 2 | presets는 오늘, 최근 7일, 이번 달 등의 control 슬롯입니다. 이 컴포넌트는 preset 선택에 따른 날짜 계산을 추측하지 않습니다. |
| 명시 규칙 3 | 320px에서는 두 필드가 한 열로 재배치되며 DatePicker full 계약으로 부모 폭을 넘지 않습니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Accessibility

- 시작일과 종료일은 각각 명확한 label을 가집니다. showFieldLabels={false}인 조밀한 툴바에서도 trigger의 accessible name은 유지됩니다.
- startLabel/endLabel에 복합 React node를 쓰면 startAccessibleLabel/endAccessibleLabel로 trigger와 placeholder의 평문 이름을 제공합니다. 이를 생략해도 [object Object]로 직렬화하지 않고 각각 시작일/종료일로 안전하게 대체합니다.
- 종료일이 시작일보다 빠르면 기간을 invalid로 표시하고 구체적인 role="alert" 순서 오류를 제공합니다. 제품이 invalid만 전달한 외부 검증에는 “기간 값을 확인해 주세요”라는 중립 문구를 쓰며, 서버 정책이나 timezone 오류는 errorMessage로 명시합니다. 외부 invalid를 종료일 순서 오류로 오인하지 않습니다.
- 내부 DatePicker, Calendar, FormField, FilterChip의 입력 높이·focus ring·popup 동작을 재사용했습니다. label과 DatePicker surface color는 active light/dark scope의 semantic token을 직접 해석해 :root에서 고정된 component alias 때문에 값이 사라지지 않게 합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FilterChip` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `FieldAction` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DateRangeField
  value={{ start, end }}
  onChange={setRange}
  presets={<FilterChip onClick={selectLast7Days}>최근 7일</FilterChip>}
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-normal`
- `--color-semantic-status-negative-text`
- `--component-input-label-font-size`
- `--component-input-label-font-weight`
- `--component-input-label-line-height`
- `--font-sans`
- `--space-1`
- `--space-2`

### Source contracts

- `components/forms/DateRangeField.jsx`
- `components/forms/DateRangeField.d.ts`
- `components/forms/DateRangeField.prompt.md`
- `stories/FormDateRange.stories.jsx`

## Sources

- DateRangeField prompt contract: `components/forms/DateRangeField.prompt.md`
- Storybook implementation evidence: `stories/FormDateRange.stories.jsx`
- [Carbon Date picker usage](https://carbondesignsystem.com/components/date-picker/usage/)
- [USWDS Date range picker](https://designsystem.digital.gov/components/date-range-picker/)
- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
