import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '../internal/surface.js';

export type ScheduleCalendarView = 'month' | 'week' | 'day';
export type ScheduleCalendarPart = 'root' | 'toolbar' | 'title' | 'grid';
export type ScheduleCalendarVariable = '--lds-schedule-calendar-padding' | '--lds-schedule-calendar-month-row-min-height';
export type ScheduleEventTone = 'positive' | 'cautionary' | 'negative' | 'signal' | 'neutral';

export interface ScheduleEvent {
  /** Stable identity used for keys and the `data-schedule-event` hook. */
  id: string | number;
  /** Visible event title. */
  title: React.ReactNode;
  /** Start instant (Date or ISO string). */
  start: Date | string;
  /** End instant. Defaults to one hour after `start`, or to the end of the day for all-day events. */
  end?: Date | string;
  /** Renders in the month cell and the all-day row instead of the time grid. @default false */
  allDay?: boolean;
  /** Semantic tone. Color is supplementary; the title carries the meaning. @default "signal" */
  tone?: ScheduleEventTone;
  /** Extra product data passed back untouched from `onEventActivate`. */
  [key: string]: unknown;
}

export interface ScheduleSlotSelection {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface ScheduleOverflowActivation {
  date: Date;
  events: ScheduleEvent[];
}

export interface ScheduleCalendarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Controlled view. */
  view?: ScheduleCalendarView;
  /** Initial view for the uncontrolled case. @default "month" */
  defaultView?: ScheduleCalendarView;
  onViewChange?: (view: ScheduleCalendarView) => void;
  /** Views offered by the switcher, in order. A single view hides the switcher. @default ["month", "week", "day"] */
  views?: ScheduleCalendarView[];
  /** Controlled anchor date: the month, the week containing it, or the day being shown. */
  date?: Date | string;
  /** Initial anchor date for the uncontrolled case. @default today */
  defaultDate?: Date | string;
  /** Fires with the start of the day whenever navigation moves the anchor. */
  onDateChange?: (date: Date) => void;
  /** Events already expanded to concrete instances. Recurrence, timezone and persistence stay product-owned. */
  events?: ScheduleEvent[];
  /** An event chip was activated by pointer or keyboard. */
  onEventActivate?: (event: ScheduleEvent) => void;
  /** An empty day cell (month) or hour slot (week/day) was activated. */
  onSlotSelect?: (selection: ScheduleSlotSelection) => void;
  /** The month cell "+N개" overflow was activated. Defaults to opening that day in the day view. */
  onOverflowActivate?: (activation: ScheduleOverflowActivation) => void;
  /** First hour shown in the time grid (`HH:mm`). @default "06:00" */
  minTime?: string;
  /** Last hour shown in the time grid (`HH:mm`). @default "22:00" */
  maxTime?: string;
  /** Duration of the selection produced by activating an hour slot. @default 30 */
  slotMinutes?: number;
  /** 0 = Sunday … 6 = Saturday. @default 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Draws the current-time rule on today's column and keeps it moving once a minute. @default true */
  nowIndicator?: boolean;
  /** Maximum height of the scrolling time grid in px. @default 560 */
  timeGridHeight?: number;
  /** Event chips shown per month cell before the "+N개" overflow. @default 3 */
  maxVisibleEvents?: number;
  /** Accessible name of the calendar region. @default "일정" */
  label?: string;
  /** Label of the today command. @default "오늘" */
  todayLabel?: string;
  classNames?: LdsClassNames<ScheduleCalendarPart>;
  styles?: LdsStyles<ScheduleCalendarPart>;
  vars?: LdsVars<ScheduleCalendarVariable>;
}

/** Month, week and day projection of time-bound events with a roving grid keyboard model. */
export const ScheduleCalendar: React.ForwardRefExoticComponent<ScheduleCalendarProps & React.RefAttributes<HTMLElement>>;
