import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { SegmentedControl } from '../selection/SegmentedControl.jsx';
import { statusToneStyle } from '../status/status-presentation.js';
import { componentVars, partClassName, partStyle } from '../internal/surface.js';

/**
 * LK Product Extension — ScheduleCalendar
 * Month, week and day projection of time-bound events (patrol runs, tasks,
 * reservations). The component owns navigation, the grid keyboard model,
 * event placement and overflow. Event truth, persistence, recurrence
 * expansion, drag-editing and the create/edit form stay with the product.
 */

const VIEW_LABELS = { month: '월', week: '주', day: '일' };
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const HOUR_HEIGHT = 48;
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

function toDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return new Date(value.getTime());
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, date.getHours(), date.getMinutes());
}

function addMonths(date, amount) {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

function startOfWeek(date, weekStartsOn) {
  const day = startOfDay(date);
  const offset = (day.getDay() - weekStartsOn + 7) % 7;
  return addDays(day, -offset);
}

function parseClock(value, fallback) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? ''));
  if (!match) return fallback;
  const hours = Math.min(24, Math.max(0, Number(match[1])));
  const minutes = Math.min(59, Math.max(0, Number(match[2])));
  return hours * 60 + minutes;
}

function formatClock(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(date);
}

function formatRangeTitle(view, anchor, weekStartsOn) {
  if (view === 'month') return `${anchor.getFullYear()}년 ${anchor.getMonth() + 1}월`;
  if (view === 'day') return formatLongDate(anchor);
  const first = startOfWeek(anchor, weekStartsOn);
  const last = addDays(first, 6);
  const sameMonth = first.getMonth() === last.getMonth();
  const head = `${first.getFullYear()}년 ${first.getMonth() + 1}월 ${first.getDate()}일`;
  const tail = sameMonth ? `${last.getDate()}일` : `${last.getMonth() + 1}월 ${last.getDate()}일`;
  return `${head} – ${tail}`;
}

function normalizeEvent(event, index) {
  const start = toDate(event.start);
  if (!start) return null;
  const allDay = Boolean(event.allDay);
  let end = toDate(event.end);
  if (!end || end.getTime() <= start.getTime()) {
    end = allDay ? addDays(startOfDay(start), 1) : new Date(start.getTime() + 60 * MINUTE);
  }
  return {
    ...event,
    id: event.id ?? `event-${index}`,
    start: allDay ? startOfDay(start) : start,
    end,
    allDay,
    tone: event.tone ?? 'signal',
  };
}

function eventCoversDay(event, day) {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = dayStart + DAY;
  return event.start.getTime() < dayEnd && event.end.getTime() > dayStart;
}

function eventAccessibleName(event) {
  if (event.allDay) {
    const days = Math.max(1, Math.round((startOfDay(event.end).getTime() - startOfDay(event.start).getTime()) / DAY));
    return `${event.title}, ${formatLongDate(event.start)}${days > 1 ? `부터 ${days}일간` : ''}, 종일`;
  }
  return `${event.title}, ${formatLongDate(event.start)} ${formatClock(event.start)}부터 ${formatClock(event.end)}까지`;
}

/** Greedy column packing for overlapping timed events inside one day. */
function layoutTimedEvents(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
  const placed = [];
  let cluster = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    const columns = Math.max(1, ...cluster.map((item) => item.column + 1));
    cluster.forEach((item) => { item.columns = columns; placed.push(item); });
    cluster = [];
  };
  for (const event of sorted) {
    if (cluster.length && event.start.getTime() >= clusterEnd) flush();
    const ends = cluster.map((item) => item.event.end.getTime());
    let column = 0;
    const used = new Set(cluster.filter((item) => item.event.end.getTime() > event.start.getTime()).map((item) => item.column));
    while (used.has(column)) column += 1;
    cluster.push({ event, column, columns: 1 });
    clusterEnd = Math.max(clusterEnd, event.end.getTime(), ...ends);
  }
  if (cluster.length) flush();
  return placed;
}

function useMinuteTick(enabled) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    if (!enabled) return undefined;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), MINUTE);
    return () => clearInterval(id);
  }, [enabled]);
  return now;
}

const SCHEDULE_STYLE_ID = 'lk-schedule-calendar-layout';
const SCHEDULE_STYLES = `
@container lds-schedule-calendar (max-width:640px){
  .lk-schedule-calendar[data-view="month"] .lk-schedule-calendar__chip-time{display:none}
}`;

function useScheduleCalendarStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(SCHEDULE_STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = SCHEDULE_STYLE_ID;
    el.textContent = SCHEDULE_STYLES;
    document.head.appendChild(el);
  }, []);
}

const HEADER_BUTTON = {
  width: 32,
  height: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--color-semantic-line-solid-normal)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-semantic-background-elevated-normal)',
  cursor: 'pointer',
  color: 'var(--color-semantic-label-neutral)',
  fontFamily: 'var(--font-sans)',
};

function EventChip({ event, timed, compact, onActivate, style }) {
  const tone = statusToneStyle(event.tone, 'signal');
  return (
    <button
      type="button"
      data-schedule-event={event.id}
      data-schedule-event-tone={event.tone}
      aria-label={eventAccessibleName(event)}
      onClick={() => onActivate?.(event)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-1)',
        width: '100%',
        minWidth: 0,
        minHeight: 24,
        margin: 0,
        padding: compact ? '2px var(--space-1-5)' : 'var(--space-1) var(--space-2)',
        boxSizing: 'border-box',
        border: `1px solid ${tone.border}`,
        borderLeftWidth: 3,
        borderRadius: 'var(--radius-sm)',
        background: tone.surface,
        color: tone.foreground,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
        fontWeight: 'var(--fw-semibold)',
        textAlign: 'left',
        cursor: 'pointer',
        overflow: 'hidden',
        ...style,
      }}
    >
      {timed && !event.allDay && (
        <span className="lk-schedule-calendar__chip-time" style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-bold)' }}>{formatClock(event.start)}</span>
      )}
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: compact ? 'nowrap' : 'normal', overflowWrap: 'anywhere' }}>
        {event.title}
      </span>
    </button>
  );
}

function useRovingGrid({ initialKey, autoFocusOnMove }) {
  const refs = React.useRef(new Map());
  const [focusKey, setFocusKey] = React.useState(initialKey);
  const pendingFocus = React.useRef(false);
  React.useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const target = refs.current.get(focusKey);
    if (target) {
      target.focus();
      pendingFocus.current = false;
    }
  });
  const register = (key) => (node) => {
    if (node) refs.current.set(key, node);
    else refs.current.delete(key);
  };
  const move = (key) => {
    pendingFocus.current = autoFocusOnMove;
    setFocusKey(key);
  };
  return { focusKey, setFocusKey, move, register, refs };
}

function MonthView({ anchor, events, today, weekStartsOn, maxVisibleEvents, onSlotSelect, onEventActivate, onOverflowActivate, onNavigatePeriod, roving, classNames, styles }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first, weekStartsOn);
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  // Drop a trailing week that belongs entirely to the next month.
  const lastRowStart = cells[35];
  const rows = lastRowStart.getMonth() !== anchor.getMonth() ? 5 : 6;
  const weeks = Array.from({ length: rows }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const weekdayOrder = Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7);

  React.useEffect(() => {
    if (!cells.some((day) => ymd(day) === roving.focusKey)) roving.setFocusKey(ymd(anchor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor.getFullYear(), anchor.getMonth()]);

  const handleKeyDown = (day, event) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in moves) {
      event.preventDefault();
      const next = addDays(day, moves[event.key]);
      if (next.getMonth() !== anchor.getMonth() && !cells.some((cell) => ymd(cell) === ymd(next))) onNavigatePeriod(next);
      roving.move(ymd(next));
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const offset = (day.getDay() - weekStartsOn + 7) % 7;
      roving.move(ymd(addDays(day, event.key === 'Home' ? -offset : 6 - offset)));
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const next = addMonths(day, event.key === 'PageUp' ? -1 : 1);
      onNavigatePeriod(next);
      roving.move(ymd(next));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSlotSelect?.({ start: startOfDay(day), end: addDays(startOfDay(day), 1), allDay: true });
    }
  };

  return (
    <div
      role="grid"
      aria-label={`${anchor.getFullYear()}년 ${anchor.getMonth() + 1}월 일정`}
      data-slot="grid"
      className={partClassName(classNames, 'grid') || undefined}
      style={{ display: 'grid', gridTemplateRows: `auto repeat(${rows}, minmax(var(--lds-schedule-calendar-month-row-min-height, 96px), 1fr))`, borderTop: '1px solid var(--color-semantic-line-normal-normal)', borderLeft: '1px solid var(--color-semantic-line-normal-normal)', ...partStyle(styles, 'grid') }}
    >
      <div role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {weekdayOrder.map((weekday) => (
          <div
            key={weekday}
            role="columnheader"
            aria-label={`${WEEKDAYS[weekday]}요일`}
            style={{
              padding: 'var(--space-1-5) var(--space-2)',
              borderRight: '1px solid var(--color-semantic-line-normal-normal)',
              borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
              textAlign: 'center',
              fontSize: 'var(--caption1-size)',
              fontWeight: 'var(--fw-semibold)',
              color: weekday === 0 ? 'var(--color-semantic-accent-foreground-red)' : weekday === 6 ? 'var(--color-semantic-accent-foreground-blue)' : 'var(--color-semantic-label-neutral)',
            }}
          >
            {WEEKDAYS[weekday]}
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {week.map((day) => {
            const key = ymd(day);
            const dayEvents = events
              .filter((event) => eventCoversDay(event, day))
              .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.start - b.start);
            const visible = dayEvents.slice(0, maxVisibleEvents);
            const hidden = dayEvents.length - visible.length;
            const outside = day.getMonth() !== anchor.getMonth();
            const isToday = ymd(today) === key;
            return (
              <div
                key={key}
                role="gridcell"
                data-schedule-day={key}
                data-outside={outside || undefined}
                style={{
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                  gap: 'var(--space-1)',
                  minWidth: 0,
                  padding: 'var(--space-1)',
                  borderRight: '1px solid var(--color-semantic-line-normal-normal)',
                  borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
                  background: outside ? 'var(--color-semantic-background-normal-alternative)' : 'var(--color-semantic-background-elevated-normal)',
                }}
              >
                <button
                  type="button"
                  ref={roving.register(key)}
                  tabIndex={roving.focusKey === key ? 0 : -1}
                  aria-label={`${formatLongDate(day)}, 일정 ${dayEvents.length}건`}
                  aria-current={isToday ? 'date' : undefined}
                  data-schedule-slot={key}
                  onFocus={() => roving.setFocusKey(key)}
                  onKeyDown={(event) => handleKeyDown(day, event)}
                  onClick={() => onSlotSelect?.({ start: startOfDay(day), end: addDays(startOfDay(day), 1), allDay: true })}
                  style={{
                    justifySelf: 'end',
                    minWidth: 28,
                    height: 28,
                    padding: '0 var(--space-1-5)',
                    border: '1px solid transparent',
                    borderRadius: 'var(--radius-pill)',
                    background: isToday ? 'var(--color-semantic-primary-normal)' : 'transparent',
                    color: isToday ? 'var(--color-semantic-static-white)' : outside ? 'var(--color-semantic-label-alternative)' : day.getDay() === 0 ? 'var(--color-semantic-accent-foreground-red)' : day.getDay() === 6 ? 'var(--color-semantic-accent-foreground-blue)' : 'var(--color-semantic-label-normal)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--label1-size)',
                    fontWeight: isToday ? 'var(--fw-bold)' : 'var(--fw-medium)',
                    fontVariantNumeric: 'tabular-nums',
                    cursor: 'pointer',
                  }}
                >
                  {day.getDate()}
                </button>
                <div style={{ display: 'grid', alignContent: 'start', gap: 2, minWidth: 0 }}>
                  {visible.map((event) => (
                    <EventChip key={event.id} event={event} timed compact onActivate={onEventActivate} />
                  ))}
                  {hidden > 0 && (
                    <button
                      type="button"
                      data-schedule-overflow={key}
                      aria-label={`${formatLongDate(day)} 일정 ${hidden}건 더 보기`}
                      onClick={() => onOverflowActivate(day, dayEvents)}
                      style={{
                        justifySelf: 'start',
                        padding: '0 var(--space-1-5)',
                        minHeight: 24,
                        border: 0,
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        color: 'var(--color-semantic-primary-normal)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--caption1-size)',
                        fontWeight: 'var(--fw-semibold)',
                        cursor: 'pointer',
                      }}
                    >
                      +{hidden}개
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TimeGridView({ view, anchor, events, today, now, weekStartsOn, minMinutes, maxMinutes, slotMinutes, nowIndicator, timeGridHeight, onSlotSelect, onEventActivate, onNavigatePeriod, roving, classNames, styles }) {
  const days = view === 'day' ? [startOfDay(anchor)] : Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(anchor, weekStartsOn), index));
  const firstHour = Math.floor(minMinutes / 60);
  const lastHour = Math.ceil(maxMinutes / 60);
  const hours = Array.from({ length: Math.max(1, lastHour - firstHour) }, (_, index) => firstHour + index);
  const totalHeight = hours.length * HOUR_HEIGHT;
  const slotKey = (day, hour) => `${ymd(day)}T${String(hour).padStart(2, '0')}`;
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const keys = days.flatMap((day) => hours.map((hour) => slotKey(day, hour)));
    if (!keys.includes(roving.focusKey)) {
      const preferredHour = Math.min(Math.max(now.getHours(), firstHour), lastHour - 1);
      const preferredDay = days.find((day) => ymd(day) === ymd(anchor)) ?? days[0];
      roving.setFocusKey(slotKey(preferredDay, preferredHour));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, ymd(anchor)]);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const targetHour = Math.min(Math.max(now.getHours() - 1, firstHour), lastHour - 1);
    node.scrollTop = (targetHour - firstHour) * HOUR_HEIGHT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleKeyDown = (day, hour, event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextHour = hour + (event.key === 'ArrowUp' ? -1 : 1);
      if (nextHour >= firstHour && nextHour < lastHour) roving.move(slotKey(day, nextHour));
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextDay = addDays(day, event.key === 'ArrowLeft' ? -1 : 1);
      if (!days.some((item) => ymd(item) === ymd(nextDay))) onNavigatePeriod(nextDay);
      roving.move(slotKey(nextDay, hour));
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      roving.move(slotKey(day, event.key === 'Home' ? firstHour : lastHour - 1));
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const nextDay = addDays(day, (view === 'day' ? 1 : 7) * (event.key === 'PageUp' ? -1 : 1));
      onNavigatePeriod(nextDay);
      roving.move(slotKey(nextDay, hour));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0);
      onSlotSelect?.({ start, end: new Date(start.getTime() + slotMinutes * MINUTE), allDay: false });
    }
  };

  const columnTemplate = `56px repeat(${days.length}, minmax(0, 1fr))`;
  const allDayByDay = days.map((day) => events.filter((event) => event.allDay && eventCoversDay(event, day)));
  const hasAllDay = allDayByDay.some((list) => list.length > 0);

  return (
    <div
      role="grid"
      aria-label={`${formatRangeTitle(view, anchor, weekStartsOn)} 시간표`}
      data-slot="grid"
      className={partClassName(classNames, 'grid') || undefined}
      style={{ display: 'grid', gridTemplateRows: 'auto auto minmax(0, 1fr)', minWidth: 0, borderTop: '1px solid var(--color-semantic-line-normal-normal)', ...partStyle(styles, 'grid') }}
    >
      <div role="row" style={{ display: 'grid', gridTemplateColumns: columnTemplate }}>
        <div role="columnheader" aria-label="시간" style={{ borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }} />
        {days.map((day) => {
          const isToday = ymd(today) === ymd(day);
          return (
            <div
              key={ymd(day)}
              role="columnheader"
              aria-label={formatLongDate(day)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-1-5) var(--space-1)',
                borderLeft: '1px solid var(--color-semantic-line-normal-normal)',
                borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
                fontSize: 'var(--caption1-size)',
                fontWeight: 'var(--fw-semibold)',
                color: day.getDay() === 0 ? 'var(--color-semantic-accent-foreground-red)' : day.getDay() === 6 ? 'var(--color-semantic-accent-foreground-blue)' : 'var(--color-semantic-label-neutral)',
              }}
            >
              <span>{WEEKDAYS[day.getDay()]}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 24,
                  height: 24,
                  padding: '0 var(--space-1)',
                  borderRadius: 'var(--radius-pill)',
                  background: isToday ? 'var(--color-semantic-primary-normal)' : 'transparent',
                  color: isToday ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-label-normal)',
                  fontSize: 'var(--label1-size)',
                  fontWeight: 'var(--fw-bold)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      <div role="row" data-schedule-all-day="" hidden={!hasAllDay} style={{ display: hasAllDay ? 'grid' : 'none', gridTemplateColumns: columnTemplate }}>
        <div role="rowheader" style={{ padding: 'var(--space-1) var(--space-2)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)', textAlign: 'right' }}>
          종일
        </div>
        {days.map((day, index) => (
          <div key={ymd(day)} role="gridcell" style={{ display: 'grid', gap: 2, padding: 'var(--space-1)', minWidth: 0, borderLeft: '1px solid var(--color-semantic-line-normal-normal)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
            {allDayByDay[index].map((event) => (
              <EventChip key={event.id} event={event} compact onActivate={onEventActivate} />
            ))}
          </div>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="lk-scroll-surface"
        data-scrollbar="auto"
        style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: timeGridHeight, minWidth: 0 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: columnTemplate, minWidth: 0, paddingTop: 10, paddingBottom: 10 }}>
          <div aria-hidden="true" style={{ position: 'relative', height: totalHeight }}>
            {hours.map((hour, index) => (
              <div
                key={hour}
                style={{
                  position: 'absolute',
                  top: index * HOUR_HEIGHT - 8,
                  right: 'var(--space-2)',
                  fontSize: 'var(--caption2-size, var(--caption1-size))',
                  lineHeight: 1,
                  color: 'var(--color-semantic-label-alternative)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>
          {days.map((day) => {
            const timed = events.filter((event) => !event.allDay && eventCoversDay(event, day));
            const placed = layoutTimedEvents(timed);
            const dayStart = startOfDay(day).getTime();
            const isToday = ymd(today) === ymd(day);
            const nowMinutes = (now.getTime() - startOfDay(now).getTime()) / MINUTE;
            const showNow = nowIndicator && isToday && nowMinutes >= firstHour * 60 && nowMinutes <= lastHour * 60;
            return (
              <div key={ymd(day)} role="row" data-schedule-day={ymd(day)} style={{ position: 'relative', height: totalHeight, minWidth: 0, borderLeft: '1px solid var(--color-semantic-line-normal-normal)' }}>
                {hours.map((hour, index) => {
                  const key = slotKey(day, hour);
                  return (
                    <div key={key} role="gridcell" style={{ position: 'absolute', top: index * HOUR_HEIGHT, left: 0, right: 0, height: HOUR_HEIGHT, borderBottom: '1px solid var(--color-semantic-line-normal-normal)' }}>
                      <button
                        type="button"
                        ref={roving.register(key)}
                        tabIndex={roving.focusKey === key ? 0 : -1}
                        data-schedule-slot={key}
                        aria-label={`${formatLongDate(day)} ${String(hour).padStart(2, '0')}:00`}
                        onFocus={() => roving.setFocusKey(key)}
                        onKeyDown={(event) => handleKeyDown(day, hour, event)}
                        onClick={() => {
                          const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0);
                          onSlotSelect?.({ start, end: new Date(start.getTime() + slotMinutes * MINUTE), allDay: false });
                        }}
                        style={{ display: 'block', width: '100%', height: '100%', margin: 0, padding: 0, border: 0, background: 'transparent', cursor: 'pointer', outlineOffset: -2 }}
                      />
                    </div>
                  );
                })}
                <div role="gridcell" aria-label={`${formatLongDate(day)} 시간 일정`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {placed.map(({ event, column, columns }) => {
                  const startMinutes = Math.max(firstHour * 60, (event.start.getTime() - dayStart) / MINUTE);
                  const endMinutes = Math.min(lastHour * 60, (event.end.getTime() - dayStart) / MINUTE);
                  if (endMinutes <= startMinutes) return null;
                  const top = ((startMinutes - firstHour * 60) / 60) * HOUR_HEIGHT;
                  const height = Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT - 2);
                  const width = 100 / columns;
                  const short = height < 44;
                  return (
                    <EventChip
                      key={event.id}
                      event={event}
                      timed
                      compact={short || columns > 1}
                      onActivate={onEventActivate}
                      style={{
                        position: 'absolute',
                        top,
                        left: `calc(${column * width}% + 2px)`,
                        width: `calc(${width}% - 4px)`,
                        height,
                        flexDirection: short ? 'row' : 'column',
                        alignItems: short ? 'center' : 'flex-start',
                        gap: short ? 'var(--space-1)' : 0,
                        zIndex: 1,
                        pointerEvents: 'auto',
                      }}
                    />
                  );
                })}
                {showNow && (
                  <div
                    aria-hidden="true"
                    data-schedule-now=""
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: ((nowMinutes - firstHour * 60) / 60) * HOUR_HEIGHT,
                      height: 2,
                      background: 'var(--color-semantic-status-negative-text)',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  />
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const ScheduleCalendar = React.forwardRef(function ScheduleCalendar({
  view: viewProp,
  defaultView = 'month',
  onViewChange,
  views = ['month', 'week', 'day'],
  date: dateProp,
  defaultDate,
  onDateChange,
  events = [],
  onEventActivate,
  onSlotSelect,
  onOverflowActivate,
  minTime = '06:00',
  maxTime = '22:00',
  slotMinutes = 30,
  weekStartsOn = 0,
  nowIndicator = true,
  timeGridHeight = 560,
  maxVisibleEvents = 3,
  label = '일정',
  todayLabel = '오늘',
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, ref) {
  const viewControlled = viewProp !== undefined;
  const [internalView, setInternalView] = React.useState(views.includes(defaultView) ? defaultView : views[0]);
  const view = viewControlled ? viewProp : internalView;
  const dateControlled = dateProp !== undefined;
  const [internalDate, setInternalDate] = React.useState(() => startOfDay(toDate(defaultDate) ?? new Date()));
  const anchor = dateControlled ? startOfDay(toDate(dateProp) ?? new Date()) : internalDate;
  const now = useMinuteTick(nowIndicator);
  const today = startOfDay(now);
  const normalizedEvents = React.useMemo(() => events.map(normalizeEvent).filter(Boolean), [events]);
  const minMinutes = parseClock(minTime, 6 * 60);
  const maxMinutes = Math.max(minMinutes + 60, parseClock(maxTime, 22 * 60));
  const roving = useRovingGrid({ initialKey: ymd(anchor), autoFocusOnMove: true });
  useScheduleCalendarStyles();

  const setView = (next) => {
    if (!views.includes(next) || next === view) return;
    if (!viewControlled) setInternalView(next);
    onViewChange?.(next);
  };
  const setDate = (next) => {
    const normalized = startOfDay(next);
    if (!dateControlled) setInternalDate(normalized);
    onDateChange?.(normalized);
  };
  const step = (amount) => {
    if (view === 'month') setDate(addMonths(anchor, amount));
    else setDate(addDays(anchor, amount * (view === 'week' ? 7 : 1)));
  };
  const handleOverflow = (day, dayEvents) => {
    if (onOverflowActivate) {
      onOverflowActivate({ date: startOfDay(day), events: dayEvents });
      return;
    }
    setDate(day);
    if (views.includes('day')) setView('day');
  };

  const title = formatRangeTitle(view, anchor, weekStartsOn);
  const viewOptions = views.map((value) => ({ value, label: VIEW_LABELS[value] }));

  return (
    <section
      ref={ref}
      aria-label={label}
      data-slot="root"
      data-view={view}
      className={partClassName(classNames, 'root', 'lk-schedule-calendar', className) || undefined}
      style={{
        ...componentVars(vars, '--lds-schedule-calendar-'),
        containerType: 'inline-size',
        containerName: 'lds-schedule-calendar',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: 'var(--space-3)',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        padding: 'var(--lds-schedule-calendar-padding, var(--space-4))',
        border: '1px solid var(--color-semantic-line-solid-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...partStyle(styles, 'root'),
        ...style,
      }}
      {...rest}
    >
      <div
        data-slot="toolbar"
        className={partClassName(classNames, 'toolbar') || undefined}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2) var(--space-3)', flexWrap: 'wrap', minWidth: 0, ...partStyle(styles, 'toolbar') }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" aria-label={view === 'month' ? '이전 달' : view === 'week' ? '이전 주' : '이전 날'} onClick={() => step(-1)} style={HEADER_BUTTON}>
              <Icon name="chevron-left-small" size={16} aria-hidden="true" />
            </button>
            <button type="button" aria-label={view === 'month' ? '다음 달' : view === 'week' ? '다음 주' : '다음 날'} onClick={() => step(1)} style={HEADER_BUTTON}>
              <Icon name="chevron-right-small" size={16} aria-hidden="true" />
            </button>
          </div>
          <button type="button" onClick={() => setDate(today)} style={{ ...HEADER_BUTTON, width: 'auto', padding: '0 var(--space-3)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)' }}>
            {todayLabel}
          </button>
          <div data-slot="title" className={partClassName(classNames, 'title') || undefined} aria-live="polite" style={{ fontSize: 'var(--body1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', minWidth: 0, ...partStyle(styles, 'title') }}>
            {title}
          </div>
        </div>
        {viewOptions.length > 1 && (
          <SegmentedControl aria-label="보기 전환" size="sm" options={viewOptions} value={view} onChange={setView} />
        )}
      </div>
      {view === 'month' ? (
        <MonthView
          anchor={anchor}
          events={normalizedEvents}
          today={today}
          weekStartsOn={weekStartsOn}
          maxVisibleEvents={maxVisibleEvents}
          onSlotSelect={onSlotSelect}
          onEventActivate={onEventActivate}
          onOverflowActivate={handleOverflow}
          onNavigatePeriod={setDate}
          roving={roving}
          classNames={classNames}
          styles={styles}
        />
      ) : (
        <TimeGridView
          view={view}
          anchor={anchor}
          events={normalizedEvents}
          today={today}
          now={now}
          weekStartsOn={weekStartsOn}
          minMinutes={minMinutes}
          maxMinutes={maxMinutes}
          slotMinutes={slotMinutes}
          nowIndicator={nowIndicator}
          timeGridHeight={timeGridHeight}
          onSlotSelect={onSlotSelect}
          onEventActivate={onEventActivate}
          onNavigatePeriod={setDate}
          roving={roving}
          classNames={classNames}
          styles={styles}
        />
      )}
    </section>
  );
});
