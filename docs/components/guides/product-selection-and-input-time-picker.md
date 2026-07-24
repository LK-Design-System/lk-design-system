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

### 사용

- 예약 시작이나 점검 시각처럼 하루 안의 특정 시간을 고를 때 적합합니다. 날짜나 기간까지 함께 필요하면 Time Picker 하나로 확장하지 말고 Date Picker·Date Range와 조합하세요.
- 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi….

### 사용하지 않음

- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.
- - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi….
- Time Picker가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | TimePicker의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Hour Label | 시 select의 accessible name. @default "시" |
| Minute Label | 분 select의 accessible name. @default "분" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | No | "HH:MM" 문자열. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `minuteStep` | `number` | No | 분 증가폭. @default 5 |
| `hourLabel` | `string` | No | 시 select의 accessible name. @default "시" |
| `minuteLabel` | `string` | No | 분 select의 accessible name. @default "분" |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다.
- 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.
- Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- WAI-ARIA Authoring Practices: Read Me First의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm\|md. disabled — 두 select를 함께 잠급니다. |
| 명시 규칙 2 | 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다. |
| 명시 규칙 3 | TimePicker — keyboard와 platform picker를 보존하는 native 시 + 분 select(24시간)입니다. |
| 명시 규칙 4 | - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm\|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi… |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Responsive

- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.
- - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다.
- 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi….
- 사용자에게 보이는 Time Picker 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm|md. disabled — 두 select를 함께 잠급니다.
- 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.
- Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- WAI-ARIA Authoring Practices: Read Me First의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. 시/분만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다. |
| Don't | 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다. |
| Do | Apple Pickers는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다. |
| Don't | - value / defaultValue / onChange — "HH:MM". minuteStep — 160 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. hourLabel / minuteLabel — 두 select의 accessible name. size — sm\|md. disabled — 두 select를 함께 잠급니다. - 두 select는 role="group"으로 묶이고 기본 이름은 시간 선택입니다. 어느 시각인지 구분이 필요하면 aria-label로 덮어써서(예: 시작 시간) FormFi…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 TimePicker의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--component-input-font-size`
- `--component-input-height`
- `--component-input-icon-color`
- `--component-input-line-height`
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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- TimePicker prompt contract: `components/forms/TimePicker.prompt.md`
- Storybook implementation evidence: `stories/FormTimePicker.stories.jsx`
- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)
- [WAI-ARIA Authoring Practices: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
