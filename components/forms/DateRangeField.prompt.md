# DateRangeField

두 개의 기존 `DatePicker`를 시작일·종료일 하나의 group으로 묶는 **LK Product Extension**입니다. WDS variant 축을 주장하지 않으며, 기간 preset의 날짜 계산과 query 직렬화는 제품이 소유합니다.

```jsx
<DateRangeField
  value={{ start, end }}
  onChange={setRange}
  presets={<FilterChip onClick={selectLast7Days}>최근 7일</FilterChip>}
/>
```

- `value/defaultValue/onChange`로 controlled 또는 uncontrolled 기간을 구성합니다.
- 시작일과 종료일은 각각 명확한 label을 가집니다. `showFieldLabels={false}`인 조밀한 툴바에서도 trigger의 accessible name은 유지됩니다.
- `startLabel`/`endLabel`에 복합 React node를 쓰면 `startAccessibleLabel`/`endAccessibleLabel`로 trigger와 placeholder의 평문 이름을 제공합니다. 이를 생략해도 `[object Object]`로 직렬화하지 않고 각각 `시작일`/`종료일`로 안전하게 대체합니다.
- 종료일이 시작일보다 빠르면 group을 invalid로 표시하고 구체적인 `role="alert"` 순서 오류를 제공합니다. 제품이 `invalid`만 전달한 외부 검증에는 “기간 값을 확인해 주세요”라는 중립 문구를 쓰며, 서버 정책이나 timezone 오류는 `errorMessage`로 명시합니다. 외부 invalid를 종료일 순서 오류로 오인하지 않습니다.
- `presets`는 오늘, 최근 7일, 이번 달 등의 control 슬롯입니다. 이 컴포넌트는 preset 선택에 따른 날짜 계산을 추측하지 않습니다.
- 320px에서는 두 필드가 한 열로 재배치되며 `DatePicker full` 계약으로 부모 폭을 넘지 않습니다.

## 비교와 결정 근거

내부 `DatePicker`, `Calendar`, `FormField`, `FilterChip`의 입력 높이·focus ring·popup 동작을 재사용했습니다. label과 DatePicker surface color는 active light/dark scope의 semantic token을 직접 해석해 `:root`에서 고정된 component alias 때문에 값이 사라지지 않게 합니다. [Carbon Date picker usage](https://carbondesignsystem.com/components/date-picker/usage/)는 range의 시작/종료 label, toolbar용 조밀한 크기, 가변 필드 폭을 명시하고, [USWDS Date range picker](https://designsystem.digital.gov/components/date-range-picker/)는 두 필드의 독립 label·description과 자동 제출 금지를, [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)은 이름·키보드·focus 복귀 계약을 제공합니다.

Carbon의 단일 calendar에서 연속 범위를 칠하는 표시는 현재 LDS `Calendar`에 없는 별도 상호작용 축이므로 이번 Product 조합에는 추가하지 않았습니다. 대신 두 날짜의 의미와 오류를 명시적으로 보장합니다.
