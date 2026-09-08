# Schedule Calendar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations |
| Owner | `ScheduleCalendar` |
| Storybook | `LDS Product/Data/Operations/Schedule Calendar` |
| Source | `../component-content.json#product-data-operations-schedule-calendar` |

정기 순찰, 작업 예약, 점검 창처럼 시간에 묶인 이벤트를 월·주·일 격자로 볼 때 적합합니다. 값 하나를 입력하는 폼에는 Calendar나 Date Picker를, 순서 있는 이력 서술에는 Timeline을 사용하세요.

## 사용 판단

### 사용

- Timeline·DataGrid와의 차이: Timeline은 순서 있는 이력 서술이고 DataGrid는 표형 조회입니다. 시간축 위의 겹침·빈 시간대는 둘 다 표현하지 못합니다.

### 사용하지 않음

- 외부 자료는 anatomy와 상호작용 기대치의 근거이며 스타일을 복제하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| view | Controlled view. |
| defaultView | Initial view for the uncontrolled case. @default "month" |
| views | Views offered by the switcher, in order. A single view hides the switcher. @default ["month", "week", "day"] |
| onSlotSelect | An empty day cell (month) or hour slot (week/day) was activated. |
| slotMinutes | Duration of the selection produced by activating an hour slot. @default 30 |
| weekStartsOn | 0 = Sunday … 6 = Saturday. @default 0 |
| label | Accessible name of the calendar region. @default "일정" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `view` | `ScheduleCalendarView` | No | Controlled view. |
| `defaultView` | `ScheduleCalendarView` | No | Initial view for the uncontrolled case. @default "month" |
| `onViewChange` | `(view: ScheduleCalendarView) = void` | No |  |
| `views` | `ScheduleCalendarView[]` | No | Views offered by the switcher, in order. A single view hides the switcher. @default ["month", "week", "day"] |
| `date` | `Date \| string` | No | Controlled anchor date: the month, the week containing it, or the day being shown. |
| `defaultDate` | `Date \| string` | No | Initial anchor date for the uncontrolled case. @default today |
| `onDateChange` | `(date: Date) = void` | No | Fires with the start of the day whenever navigation moves the anchor. |
| `events` | `ScheduleEvent[]` | No | Events already expanded to concrete instances. Recurrence, timezone and persistence stay product-owned. |
| `onEventActivate` | `(event: ScheduleEvent) = void` | No | An event chip was activated by pointer or keyboard. |
| `onSlotSelect` | `(selection: ScheduleSlotSelection) = void` | No | An empty day cell (month) or hour slot (week/day) was activated. |
| `onOverflowActivate` | `(activation: ScheduleOverflowActivation) = void` | No | The month cell "+N개" overflow was activated. Defaults to opening that day in the day view. |
| `minTime` | `string` | No | First hour shown in the time grid (HH:mm). @default "06:00" |
| `maxTime` | `string` | No | Last hour shown in the time grid (HH:mm). @default "22:00" |
| `slotMinutes` | `number` | No | Duration of the selection produced by activating an hour slot. @default 30 |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 0 = Sunday … 6 = Saturday. @default 0 |
| `nowIndicator` | `boolean` | No | Draws the current-time rule on today's column and keeps it moving once a minute. @default true |
| `timeGridHeight` | `number` | No | Maximum height of the scrolling time grid in px. @default 560 |
| `maxVisibleEvents` | `number` | No | Event chips shown per month cell before the "+N개" overflow. @default 3 |
| `label` | `string` | No | Accessible name of the calendar region. @default "일정" |
| `todayLabel` | `string` | No | Label of the today command. @default "오늘" |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| maxVisibleEvents | Event chips shown per month cell before the "+N개" overflow. @default 3 |

## Behavior and interaction

- 기간·보기는 제어/비제어 모두 지원합니다(date/defaultDate/onDateChange, view/defaultView/onViewChange). views로 보기 집합을 줄일 수 있고 하나만 남기면 전환 control을 숨깁니다.
- 현재 시각 선은 오늘 열에만 그리고 1분마다 갱신합니다. nowIndicator={false}로 끌 수 있으며 timer는 unmount 시 정리됩니다.
- LK Control Gungneung (LK-ROBOTICS/lkrobotics-control-gungneung · 9298e1c0): supported by composition. frontend/src/views/schedule/components/CalendarView.jsx는 FullCalendar month/week/day/list와 dateClick→우측 폼 연결을, frontend/src/api/scheduledPatrolService.ts는 로봇별 runTime 정기 순찰 모델을 증명합니다.
- 드래그로 범위 선택·이벤트 이동·리사이즈, 리소스(로봇별 행) timeline, agenda/list 보기, 반복 규칙 편집기.
- DOM 순서와 시각 순서가 같습니다. 격자는 APG data grid 모델을 따라 role="grid"·row·columnheader·gridcell을 쓰고, 날짜/slot button 하나만 Tab 순서에 두는 roving tabindex입니다. 이벤트 chip은 일반 button이라 Tab으로 도달합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 이벤트는 { id, title, start, end?, allDay?, tone? }이며 이미 구체 인스턴스로 펼쳐진 상태여야 합니다. 반복 규칙(매일 21:00)의 전개, 시간대 변환, 정렬 정책은 제품이 소유합니다. end가 없으면 시간 이벤트는 1시간, 종일 이벤트는 그 날 끝까지로 봅니다. |
| 명시 규칙 2 | 월 셀은 maxVisibleEvents(기본 3)까지 chip을 그리고 나머지를 +N개로 접습니다. 여러 날에 걸친 이벤트는 걸치는 날마다 chip을 반복합니다(가로 span bar는 첫 계약에서 제외). |
| 명시 규칙 3 | 주/일 격자에서 겹치는 이벤트는 같은 cluster 안에서 열을 나눠 나란히 배치합니다(greedy column packing). 시간축은 minTimemaxTime(기본 06:0022:00)이며 범위 밖 부분은 잘라 그립니다. 최소 높이 22px로 짧은 이벤트도 target을 유지합니다. |
| 명시 규칙 4 | 루트는 lds-schedule-calendar inline-size container이며 640px 이하에서는 월 chip의 시간 접두어를 숨겨 제목이 잘리지 않게 합니다(규칙은 #lk-schedule-calendar-layout head style 하나로 주입). 주/일 격자의 30분 이하 이벤트는 한 줄(시간 + 제목)로 그립니다. |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- +N개는 기본으로 그 날을 day 보기로 엽니다. onOverflowActivate를 주면 제품이 popover·drawer로 대체할 수 있습니다.
- 겹치는 이벤트가 열을 나누면 chip 제목을 한 줄 말줄임으로 그려 글자 단위 줄바꿈을 막습니다. 480px 이하처럼 월 셀이 40px대로 좁아지는 표면에서는 chip 제목이 거의 보이지 않으므로 제품은 views={['day', 'week']} 또는 defaultView="day"로 시작하는 것이 관례입니다(FullCalendar·Syncfusion 모두 phone 폭에서 day/agenda 계열을 권장).
- 이벤트 chip은 StatusBadge 톤 표면에 왼쪽 3px 톤 border를 더합니다. 시간 격자에서 세로로 길게 늘어난 chip의 톤을 좁은 폭에서도 읽게 하는 기능적 차이입니다.
- Syncfusion Scheduler views: 월 셀의 +more overflow, header의 기간 이동과 view switcher, 시간 보기의 현재 시각 표시가 공통 anatomy입니다. +N개와 toolbar 구성에 반영했습니다.

## Content and writing

- Calendar: 300px 고정 폭·38px 날짜 button 대신 전체 폭 격자와 minmax(96px, 1fr) 행을 씁니다. 오늘 표시는 Calendar의 ring이 아니라 primary fill pill입니다. 이 차이는 셀 안에 이벤트 chip이 들어가 날짜 숫자가 셀 모서리의 작은 marker가 되어야 하기 때문입니다(외부 스케줄러 관례). 요일 색, 제목 typography, 이전/다음 button geometry(32px, radius-md)는 Calendar와 동일합니다.
- FullCalendar TimeGrid view: all-day slot, 시간축 label, slot 범위(slotMinTime/slotMaxTime), now indicator, 겹치는 이벤트의 가로 분할이 카테고리 기대치입니다. minTime/maxTime, 종일 row, 현재 시각 선, column packing에 반영했습니다.
- 1. toolbar: 이전/다음, 오늘, aria-live="polite" 기간 제목, 보기 전환 SegmentedControl 2. 월: 요일 columnheader → 주 row → 날짜 button(roving) → 이벤트 chip → +N개 overflow 3. 주/일: 요일·날짜 columnheader → 종일 row(종일 이벤트가 있을 때만) → 시간 격자(시간 rowheader, 시간당 slot button, 절대 배치 이벤트, 현재 시각 선).

## Accessibility

- Calendar(Core)와의 차이: Calendar는 값 하나를 고르는 날짜 입력이고 이벤트를 그리지 않습니다. ScheduleCalendar는 값이 아니라 기간의 이벤트 집합을 보여 주며 선택 결과가 폼 값이 아니라 onSlotSelect 범위입니다. 같은 요일 색 규칙(일요일 red, 토요일 blue)과 aria-live 월 제목, roving grid 키 모델은 공유하고, 날짜 선택 값·minDate/maxDate는 갖지 않습니다.
- 기존 primitive 조합만으로는 시간축 배치·overflow·격자 키보드 모델을 만들 수 없어 새 컴포넌트가 필요합니다. SegmentedControl(보기 전환), Icon, 상태 톤 helper(status-presentation)는 그대로 재사용합니다.
- 월: Arrow는 일/주, Home/End는 주의 시작/끝, PageUp/PageDown은 달 이동. 격자 밖으로 나가면 기간이 따라 이동합니다. Enter/Space/클릭은 그 날 하루(allDay: true)를 onSlotSelect로 전달합니다.
- 주/일: ArrowUp/Down은 한 시간, ArrowLeft/Right는 하루(주 경계를 넘으면 기간 이동), Home/End는 첫/마지막 시간, PageUp/PageDown은 주 또는 일 단위 이동. Enter/Space/클릭은 [slot 시작, 시작 + slotMinutes)를 전달합니다. 드래그 범위 선택과 이벤트 이동/리사이즈는 의도적으로 제외합니다. 제품은 onSlotSelect 결과를 폼의 초기값으로 쓰고 종료 시각은 폼에서 확정합니다.
- tone은 StatusBadge와 같은 semantic 톤 표면(surface/border/text)을 씁니다. 색만으로 의미를 전달하지 않도록 제목이 항상 보이고 accessible name에 날짜·시간 범위를 붙입니다.

## Examples

### 기본 조합

```jsx
<ScheduleCalendar
  label="순찰 일정"
  defaultDate="2026-09-07"
  events={[
    { id: 'p1', title: '야간 순찰', start: '2026-09-07T21:00', end: '2026-09-07T23:00', tone: 'signal' },
    { id: 'm1', title: '승강기 점검', start: '2026-09-09', allDay: true, tone: 'cautionary' },
  ]}
  onSlotSelect={({ start, end, allDay }) => openCreateForm({ start, end, allDay })}
  onEventActivate={(event) => openDetail(event.id)}
/>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--caption1-line`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-accent-foreground-blue`
- `--color-semantic-accent-foreground-red`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative-text`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-size`
- `--lds-schedule-calendar-month-row-min-height`
- `--lds-schedule-calendar-padding`
- `--radius-md`
- `--radius-pill`
- `--radius-sm`
- `--radius-xl`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/ScheduleCalendar.jsx`
- `components/data/ScheduleCalendar.d.ts`
- `components/data/ScheduleCalendar.prompt.md`
- `stories/DataScheduleCalendar.stories.jsx`

## Sources

- ScheduleCalendar prompt contract: `components/data/ScheduleCalendar.prompt.md`
- Storybook implementation evidence: `stories/DataScheduleCalendar.stories.jsx`
- [WAI-ARIA APG Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [FullCalendar TimeGrid view](https://fullcalendar.io/docs/timegrid-view)
- [Syncfusion Scheduler views](https://ej2.syncfusion.com/react/documentation/schedule/views)
