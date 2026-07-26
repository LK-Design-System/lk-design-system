# Date Picker

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `DatePicker` |
| Storybook | `LDS Product/Selection and Input/Date Picker` |
| Source | `../component-content.json#product-selection-and-input-date-picker` |

예약일·마감일처럼 한 날짜를 필드 맥락에서 입력할 때 적합합니다. 시작과 종료가 함께 필요하면 Date Range를, 월 전체를 탐색해야 하면 Calendar를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `Date \| string \| null` | No |  |
| `defaultValue` | `Date \| string \| null` | No |  |
| `onChange` | `(date: Date) = void` | No |  |
| `isDateDisabled` | `(date: Date) = boolean` | No | 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). Calendar 팝오버로 전달됩니다. |
| `minDate` | `Date \| string` | No | 이 날짜 이전(당일 제외)은 선택 불가. Date 또는 ISO 문자열. |
| `maxDate` | `Date \| string` | No | 이 날짜 이후(당일 제외)는 선택 불가. Date 또는 ISO 문자열. |
| `placeholder` | `string` | No |  |
| `size` | `'sm' \| 'md'` | No |  |
| `disabled` | `boolean` | No |  |
| `invalid` | `boolean` | No | 검증 실패 상태. trigger에 aria-invalid와 negative border를 적용합니다. @default false |
| `full` | `boolean` | No | 부모 폭을 채우고 고정 최소 폭을 제거합니다. @default false |
| `style` | `React.CSSProperties` | No |  |

## States

| State | Contract |
| --- | --- |
| isDateDisabled | 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). Calendar 팝오버로 전달됩니다. |
| invalid | 검증 실패 상태. trigger에 aria-invalid와 negative border를 적용합니다. @default false |

## Behavior and interaction

- isDateDisabled(date) / minDate / maxDate — 예약 불가일·휴무일·범위 밖 날짜를 선택 불가로 표시합니다. Calendar 팝오버로 그대로 전달되어 비활성 날짜는 흐리게·취소선으로 표시되고 선택만 차단됩니다(포커스 이동은 허용). 실사 희망일·예약 가능일 흐름에서 특정 날짜를 막는 용도입니다.
- Calendar popup의 월 탐색은 Calendar 계약을 그대로 상속합니다. 값이 있어도 이전/다음 달, PageUp/PageDown, Shift+PageUp/PageDown이 정상 동작합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | full — 날짜 범위나 툴바처럼 부모 폭에 맞춰야 하는 조합에서 trigger의 고정 최소 폭을 제거하고 가용 폭을 채웁니다. |
| 명시 규칙 2 | invalid — 상위 폼이나 DateRangeField가 판정한 검증 실패를 trigger에 싣습니다. Input·Select·Textarea와 같은 우선순위로 negative border를 적용하고 aria-invalid를 trigger button(=초점 요소)에 붙입니다. 오류 문구 자체는 소유하지 않으므로 상위가 aria-describedby로 메시지 id를 전달하면 그대로 trigger에 연결됩니다. role="group"은 ARIA 1.2에서 aria-invalid를 지원하지 않으므로 group이 아니라 이 필드가 오류를 전달합니다. |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Accessibility

- value / defaultValue / onChange(date) — 제어/비제어(Date, ISO 문자열 또는 빈 값). disabled / aria-label — trigger 상태와 accessible name. 선택 값은 trigger 이름에도 포함됩니다. 바깥 클릭·선택·Escape 시 닫히며 선택 뒤 trigger로 focus가 돌아옵니다.
- trigger는 aria-haspopup="dialog", aria-expanded, aria-controls로 Calendar popup과 연결하고 LDS Input focus ring을 사용합니다.
- calendar affordance는 공통 Icon registry를 사용하며 trigger의 accessible name과 중복되지 않도록 장식적으로 숨깁니다.
- WAI-ARIA Date Picker Dialog example의 popup naming, 초기 날짜 focus, Escape, 선택 후 focus return 계약을 따릅니다.
- WAI-ARIA Dialog pattern을 기준으로 Calendar popup을 이름 있는 dialog로 노출합니다. 완전한 modal focus trap은 사용하지 않는 non-modal field popup이며, 대신 초점이 필드 밖으로 나가면 popup을 닫아 열린 dialog가 잔류하지 않게 합니다(창 전환처럼 relatedTarget이 없는 blur는 제외).

## Related components

| Component | Relationship |
| --- | --- |
| `FormField` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |
| `PinInput` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<DatePicker placeholder="실사 희망일" onChange={setDate} />
<DatePicker defaultValue="2026-07-03" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--component-input-bg`
- `--component-input-border-color`
- `--component-input-border-color-focus`
- `--component-input-border-color-invalid`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-gap`
- `--component-input-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`

### Source contracts

- `components/forms/DatePicker.jsx`
- `components/forms/DatePicker.d.ts`
- `components/forms/DatePicker.prompt.md`
- `stories/FormDateTime.stories.jsx`

## Sources

- DatePicker prompt contract: `components/forms/DatePicker.prompt.md`
- Storybook implementation evidence: `stories/FormDateTime.stories.jsx`
- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
