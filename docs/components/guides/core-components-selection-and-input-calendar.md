# Calendar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Calendar` |
| Storybook | `LDS Core/Components/Selection and Input/Calendar` |
| Source | `../component-content.json#core-components-selection-and-input-calendar` |

예약 가능일이나 로그 기준일처럼 주변 날짜를 함께 보며 고를 때 적합합니다. 폼 안에서 단일 날짜만 간결하게 입력하면 Calendar 대신 Date Picker를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `Date \| string` | No | 제어되는 선택 날짜(Date 또는 ISO 문자열). |
| `defaultValue` | `Date \| string` | No | 비제어 초기 날짜. |
| `onChange` | `(date: Date) = void` | No |  |
| `isDateDisabled` | `(date: Date) = boolean` | No | 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). 포커스 이동은 허용되고 선택만 차단됩니다. |
| `minDate` | `Date \| string` | No | 이 날짜 이전(당일 제외)은 모두 선택 불가. Date 또는 ISO 문자열. |
| `maxDate` | `Date \| string` | No | 이 날짜 이후(당일 제외)는 모두 선택 불가. Date 또는 ISO 문자열. |
| `autoFocus` | `boolean` | No | Focus the selected/today day when embedded in an opened picker dialog. |

## States

| State | Contract |
| --- | --- |
| isDateDisabled | 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). 포커스 이동은 허용되고 선택만 차단됩니다. |

## Behavior and interaction

- standalone Calendar와 DatePicker popup이 같은 keyboard·selection 계약을 공유합니다.
- WAI-ARIA Date Picker Dialog example의 grid roving focus와 날짜 이동 키를 따릅니다.
- Calendar — 날짜 선택용 월 그리드(현장 실사 일정). 일요일 레드 / 토요일 시그널 헤더; 선택된 날짜는 시그널 잉크로 채워지고, 오늘은 링을 두릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-accent-foreground-blue | light: #336CA1; dark: #639ACE |
| --color-semantic-accent-foreground-red | light: #D63D3D; dark: #F16F6F |

## Accessibility

- value / defaultValue / onChange(date) — 제어/비제어(Date 또는 ISO 문자열 허용). autoFocus는 DatePicker dialog가 열릴 때 선택 날짜 또는 오늘로 focus를 옮깁니다.
- isDateDisabled(date) / minDate / maxDate — 예약 불가일·휴무일·범위 밖 날짜를 선택 불가로 표시합니다. isDateDisabled는 임의 조건(콜백)을, minDate/maxDate는 경계를 담당하며 함께 쓸 수 있습니다. 비활성 날짜는 흐리게·취소선으로 표시되고 aria-disabled가 붙으며, 예약 가능일 흐름에서 특정 날짜를 막는 용도입니다.
- 날짜 grid는 하나의 roving Tab stop을 사용합니다. Arrow 키는 일/주 단위, Home/End는 주의 시작/끝, PageUp/PageDown은 월 단위, Shift+PageUp/Shift+PageDown은 연 단위로 이동합니다. 비활성 날짜도 포커스로 지나갈 수는 있으나(이유를 인지할 수 있도록) 선택만 차단되어 WAI-ARIA date 패턴을 따릅니다.
- 표시 중인 달은 사용자 탐색이 소유합니다. 선택 값이 있어도 이전/다음 달 버튼·PageUp/PageDown·월 경계를 넘는 Arrow 이동이 선택된 달로 되돌려지지 않습니다. 값이 실제로 바뀔 때(제어 컴포넌트의 새 value 포함)만 표시 달과 roving 초점이 선택 날짜로 따라갑니다.
- 이전/다음 달 버튼은 초점을 그대로 유지해 여러 달을 연속으로 넘길 수 있습니다. 다만 grid 안에서 키보드로 탐색 중이었다면 초점이 새 달의 날짜 셀로 따라갑니다. 월 표시는 aria-live="polite"로 읽힙니다.

## Examples

### 기본 조합

```jsx
<Calendar defaultValue="2026-07-03" onChange={setDate} />
```

## Tokens and API

### Tokens

- `--body1-size`
- `--caption1-size`
- `--color-semantic-accent-foreground-blue`
- `--color-semantic-accent-foreground-red`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--component-input-focus-shadow`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--radius-md`
- `--radius-xl`
- `--space-0-5`
- `--space-1-5`
- `--space-3-5`

### Source contracts

- `components/data/Calendar.jsx`
- `components/data/Calendar.d.ts`
- `components/data/Calendar.prompt.md`
- `stories/DataCalendar.stories.jsx`

## Sources

- Calendar prompt contract: `components/data/Calendar.prompt.md`
- Storybook implementation evidence: `stories/DataCalendar.stories.jsx`
- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
