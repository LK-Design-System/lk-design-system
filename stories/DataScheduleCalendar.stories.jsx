import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { ScheduleCalendar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const localDateTime = (date) => `${localDate(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const meta = {
  title: 'LDS Product/Data/Operations/Schedule Calendar',
  tags: ['autodocs'],
  component: ScheduleCalendar,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-operations-schedule-calendar--month-overview',
      eyebrow: 'Product / Data / Schedule Calendar',
      title: '사용자가 기간 안의 실행 계획을 겹침 없이 읽고 빈 시간대를 고릅니다',
      description:
        '정기 순찰, 작업 예약, 점검 창처럼 시간에 묶인 이벤트를 월·주·일 격자로 볼 때 적합합니다. 값 하나를 입력하는 폼에는 Calendar나 Date Picker를, 순서 있는 이력 서술에는 Timeline을 사용하세요.',
    },
    docs: {
      description: {
        component: '월·주·일 격자에 이벤트를 배치하고 빈 날짜·시간대 선택을 제품 폼으로 넘기는 ScheduleCalendar 패턴입니다. 이벤트 진실과 반복 규칙 전개는 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

const EVENTS = [
  { id: 'p-0907-night', title: '야간 순찰 · 로봇 A', start: '2026-09-07T21:00', end: '2026-09-07T23:00', tone: 'signal' },
  { id: 'p-0907-morning', title: '아침 순찰 · 로봇 B', start: '2026-09-07T07:00', end: '2026-09-07T08:30', tone: 'signal' },
  { id: 'p-0908-lift', title: '승강기 정기 점검', start: '2026-09-08', allDay: true, tone: 'cautionary' },
  { id: 'p-0909-a', title: '오후 순찰 · 로봇 A', start: '2026-09-09T13:00', end: '2026-09-09T15:00', tone: 'signal' },
  { id: 'p-0909-b', title: '오후 순찰 · 로봇 B', start: '2026-09-09T14:00', end: '2026-09-09T16:00', tone: 'signal' },
  { id: 'p-0909-c', title: '센서 교정', start: '2026-09-09T14:30', end: '2026-09-09T15:30', tone: 'cautionary' },
  { id: 'p-0909-d', title: '방문객 안내 방송', start: '2026-09-09T17:00', end: '2026-09-09T17:30', tone: 'positive' },
  { id: 'p-0910-fail', title: '순찰 실패 재실행', start: '2026-09-10T09:00', end: '2026-09-10T10:00', tone: 'negative' },
  { id: 'p-0912-holiday', title: '현장 휴무', start: '2026-09-12', end: '2026-09-14', allDay: true, tone: 'neutral' },
];

function CalendarFixture({ initialView = 'month', views, width = '100%', testId, ...rest }) {
  const [selection, setSelection] = React.useState('선택 없음');
  const [activated, setActivated] = React.useState('활성화 없음');
  return (
    <main data-testid={testId} style={{ display: 'grid', gap: 'var(--space-3)', width, maxWidth: '100%', minWidth: 0 }}>
      <ScheduleCalendar
        label="순찰 일정"
        defaultDate="2026-09-07"
        defaultView={initialView}
        views={views}
        events={EVENTS}
        nowIndicator={false}
        onSlotSelect={({ start, end, allDay }) => setSelection(`${allDay ? '종일' : '시간'} ${localDateTime(start)} ~ ${localDateTime(end)}`)}
        onEventActivate={(event) => setActivated(String(event.id))}
        {...rest}
      />
      <p data-testid="slot-selection" role="status" style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{selection}</p>
      <p data-testid="event-activation" role="status" style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{activated}</p>
    </main>
  );
}

export const MonthOverview = {
  name: '개요',
  parameters: storyDescription(
    '2026년 9월의 순찰·점검 이벤트를 월 격자에서 읽는 상황입니다. 날짜 하나만 Tab에 남는 roving 격자, Arrow 이동, Enter로 하루 선택, 이벤트 chip 활성화, 셀당 3건을 넘는 이벤트의 +N개 접힘을 확인하세요.',
  ),
  render: () => <CalendarFixture testId="month-fixture" />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="root"]');
    const grid = root?.querySelector('[role="grid"]');
    const slots = [...(grid?.querySelectorAll('[data-schedule-slot]') || [])];
    if (!root || root.getAttribute('data-view') !== 'month' || !grid || slots.length < 35) {
      throw new Error('The month view must expose a grid with a roving day button per cell.');
    }
    if (slots.filter((slot) => slot.getAttribute('tabindex') === '0').length !== 1) {
      throw new Error('Exactly one day button may sit in the Tab order.');
    }
    if (grid.querySelectorAll('[role="columnheader"]').length !== 7 || grid.querySelectorAll('[role="row"]').length < 6) {
      throw new Error('The month grid must expose seven weekday headers and week rows.');
    }
    const overflow = grid.querySelector('[data-schedule-overflow="2026-09-09"]');
    const overflowCell = grid.querySelector('[data-schedule-day="2026-09-09"]');
    if (!overflow || overflowCell?.querySelectorAll('[data-schedule-event]').length !== 3 || overflow.textContent?.trim() !== '+1개') {
      throw new Error('A cell with four events must show three chips and a +1개 overflow.');
    }
    const anchor = grid.querySelector('[data-schedule-slot="2026-09-07"]');
    anchor.focus();
    await userEvent.keyboard('{ArrowRight}');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-schedule-slot') !== '2026-09-08') {
      throw new Error('ArrowRight must move the roving focus to the next day.');
    }
    await userEvent.keyboard('{ArrowDown}');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-schedule-slot') !== '2026-09-15') {
      throw new Error('ArrowDown must move the roving focus one week later.');
    }
    await userEvent.keyboard('{Enter}');
    const selection = canvasElement.querySelector('[data-testid="slot-selection"]');
    if (selection?.textContent !== '종일 2026-09-15T00:00 ~ 2026-09-16T00:00') {
      throw new Error('Enter on a day must report an all-day slot selection.');
    }
    const chip = grid.querySelector('[data-schedule-event="p-0910-fail"]');
    if (!chip || !chip.getAttribute('aria-label')?.includes('09:00부터 10:00까지')) {
      throw new Error('Event chips must carry the title and time range in their accessible name.');
    }
    await userEvent.click(chip);
    if (canvasElement.querySelector('[data-testid="event-activation"]')?.textContent !== 'p-0910-fail') {
      throw new Error('Activating an event chip must report the event identity.');
    }
    if (root.scrollWidth > root.clientWidth + 1) throw new Error('The month view must not overflow horizontally.');
  },
};

export const ControlledRange = {
  name: '상호작용 · 제어형 보기 집합과 시간 범위',
  parameters: storyDescription(
    '제품이 보기와 기간을 소유하는 제어형 사용입니다. 보기 집합을 월·주로 줄이고 시간축을 08:00~18:00으로 제한한 상태에서 이전/다음 이동이 제품 state로 전달되는지 확인하세요.',
  ),
  render: () => <ControlledFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="root"]');
    const state = canvasElement.querySelector('[data-testid="controlled-state"]');
    if ([...root.querySelectorAll('button')].some((button) => button.textContent?.trim() === '일')) {
      throw new Error('A reduced views set must hide the day option.');
    }
    const next = root.querySelector('button[aria-label="다음 주"]');
    await userEvent.click(next);
    await waitFor(() => {
      if (state?.textContent !== 'week · 2026-09-14') throw new Error('Next week must move the controlled anchor by seven days.');
    });
    const grid = root.querySelector('[role="grid"]');
    if (grid.querySelector('[data-schedule-slot="2026-09-14T06"]') || !grid.querySelector('[data-schedule-slot="2026-09-14T08"]')) {
      throw new Error('minTime must remove hours before 08:00 from the time grid.');
    }
  },
};

export const DayNarrow = {
  name: '반응형 · 일 보기 360px',
  parameters: storyDescription(
    '360px 폭의 하루 보기입니다. toolbar가 두 줄로 감싸지고 시간 격자가 가로로 넘치지 않으며, 보기 전환으로 월에 돌아갈 수 있는지 확인하세요.',
  ),
  render: () => <CalendarFixture testId="day-fixture" initialView="day" width={360} />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="day-fixture"]');
    const root = fixture?.querySelector('[data-slot="root"]');
    if (!root || root.getAttribute('data-view') !== 'day') throw new Error('The narrow fixture must start in the day view.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) throw new Error('The day view must not overflow a 360px container.');
    const title = root.querySelector('[data-slot="title"]');
    if (!title?.textContent?.includes('2026년 9월 7일')) throw new Error('The day view title must name the anchor date.');
    const monthOption = [...root.querySelectorAll('button')].find((button) => button.textContent?.trim() === '월');
    if (!monthOption) throw new Error('The view switcher must expose the month option.');
    await userEvent.click(monthOption);
    await waitFor(() => {
      if (root.getAttribute('data-view') !== 'month') throw new Error('Choosing 월 must switch the calendar to the month view.');
    });
  },
};

function ControlledFixture() {
  const [view, setView] = React.useState('week');
  const [date, setDate] = React.useState(new Date(2026, 8, 7));
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', minWidth: 0 }}>
      <ScheduleCalendar
        label="제어형 일정"
        view={view}
        onViewChange={setView}
        views={['month', 'week']}
        date={date}
        onDateChange={setDate}
        events={EVENTS}
        nowIndicator={false}
        minTime="08:00"
        maxTime="18:00"
      />
      <p data-testid="controlled-state" role="status" style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>
        {view} · {localDate(date)}
      </p>
    </main>
  );
}

export const WeekTimeGrid = {
  name: '시나리오 · 주 보기의 겹치는 시간 이벤트',
  parameters: storyDescription(
    '9월 7일 주의 시간 격자입니다. 종일 row, 시간축, 같은 시간대에 겹치는 세 이벤트의 열 분할, 시간 slot 키보드 이동과 Enter 선택을 확인하세요.',
  ),
  render: () => <CalendarFixture testId="week-fixture" initialView="week" />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="root"]');
    const grid = root?.querySelector('[role="grid"]');
    if (!root || root.getAttribute('data-view') !== 'week' || !grid) throw new Error('The week fixture must render the time grid.');
    const allDay = grid.querySelector('[data-schedule-all-day]');
    if (!allDay || allDay.hidden || allDay.querySelectorAll('[data-schedule-event]').length < 2) {
      throw new Error('All-day events must render in the all-day row above the time grid.');
    }
    const overlapping = ['p-0909-a', 'p-0909-b', 'p-0909-c'].map((id) => grid.querySelector(`[data-schedule-event="${id}"]`));
    if (overlapping.some((chip) => !chip)) throw new Error('Timed events must render inside their day column.');
    const rects = overlapping.map((chip) => chip.getBoundingClientRect());
    const columnWidth = grid.querySelector('[data-schedule-day="2026-09-09"]').getBoundingClientRect().width;
    if (rects.some((rect) => rect.width > columnWidth / 2) || new Set(rects.map((rect) => Math.round(rect.left))).size !== 3) {
      throw new Error('Overlapping events must share the column side by side instead of stacking on top of each other.');
    }
    const slot = grid.querySelector('[data-schedule-slot="2026-09-09T13"]');
    slot.focus();
    await userEvent.keyboard('{ArrowDown}');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-schedule-slot') !== '2026-09-09T14') {
      throw new Error('ArrowDown must move the roving focus one hour later.');
    }
    await userEvent.keyboard('{ArrowLeft}');
    if (canvasElement.ownerDocument.activeElement?.getAttribute('data-schedule-slot') !== '2026-09-08T14') {
      throw new Error('ArrowLeft must move the roving focus to the previous day at the same hour.');
    }
    await userEvent.keyboard('{Enter}');
    const selection = canvasElement.querySelector('[data-testid="slot-selection"]');
    if (selection?.textContent !== '시간 2026-09-08T14:00 ~ 2026-09-08T14:30') throw new Error('Enter on an hour slot must report a 30-minute timed selection.');
  },
};

export const ScheduleCalendarCard = {
  name: 'ScheduleCalendar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 960, height: 720, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <ScheduleCalendar label="순찰 일정 parity" defaultDate="2026-09-07" defaultView="week" events={EVENTS} nowIndicator={false} minTime="06:00" maxTime="19:00" timeGridHeight={520} />
    </div>
  ),
};
