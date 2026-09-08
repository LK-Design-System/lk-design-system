"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');


var _chunkFA32RMMScjs = require('./chunk-FA32RMMS.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/data/ScheduleCalendar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var VIEW_LABELS = { month: "\uC6D4", week: "\uC8FC", day: "\uC77C" };
var WEEKDAYS = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
var HOUR_HEIGHT = 48;
var MINUTE = 60 * 1e3;
var DAY = 24 * 60 * MINUTE;
function toDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return new Date(value.getTime());
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(_nullishCoalesce(value, () => ( ""))));
  if (!match) return fallback;
  const hours = Math.min(24, Math.max(0, Number(match[1])));
  const minutes = Math.min(59, Math.max(0, Number(match[2])));
  return hours * 60 + minutes;
}
function formatClock(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
function formatLongDate(date) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date);
}
function formatRangeTitle(view, anchor, weekStartsOn) {
  if (view === "month") return `${anchor.getFullYear()}\uB144 ${anchor.getMonth() + 1}\uC6D4`;
  if (view === "day") return formatLongDate(anchor);
  const first = startOfWeek(anchor, weekStartsOn);
  const last = addDays(first, 6);
  const sameMonth = first.getMonth() === last.getMonth();
  const head = `${first.getFullYear()}\uB144 ${first.getMonth() + 1}\uC6D4 ${first.getDate()}\uC77C`;
  const tail = sameMonth ? `${last.getDate()}\uC77C` : `${last.getMonth() + 1}\uC6D4 ${last.getDate()}\uC77C`;
  return `${head} \u2013 ${tail}`;
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
    id: _nullishCoalesce(event.id, () => ( `event-${index}`)),
    start: allDay ? startOfDay(start) : start,
    end,
    allDay,
    tone: _nullishCoalesce(event.tone, () => ( "signal"))
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
    return `${event.title}, ${formatLongDate(event.start)}${days > 1 ? `\uBD80\uD130 ${days}\uC77C\uAC04` : ""}, \uC885\uC77C`;
  }
  return `${event.title}, ${formatLongDate(event.start)} ${formatClock(event.start)}\uBD80\uD130 ${formatClock(event.end)}\uAE4C\uC9C0`;
}
function layoutTimedEvents(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
  const placed = [];
  let cluster = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    const columns = Math.max(1, ...cluster.map((item) => item.column + 1));
    cluster.forEach((item) => {
      item.columns = columns;
      placed.push(item);
    });
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
  const [now, setNow] = _react2.default.useState(() => /* @__PURE__ */ new Date());
  _react2.default.useEffect(() => {
    if (!enabled) return void 0;
    setNow(/* @__PURE__ */ new Date());
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), MINUTE);
    return () => clearInterval(id);
  }, [enabled]);
  return now;
}
var SCHEDULE_STYLE_ID = "lk-schedule-calendar-layout";
var SCHEDULE_STYLES = `
@container lds-schedule-calendar (max-width:640px){
  .lk-schedule-calendar[data-view="month"] .lk-schedule-calendar__chip-time{display:none}
}`;
function useScheduleCalendarStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(SCHEDULE_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = SCHEDULE_STYLE_ID;
    el.textContent = SCHEDULE_STYLES;
    document.head.appendChild(el);
  }, []);
}
var HEADER_BUTTON = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--color-semantic-line-solid-normal)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-semantic-background-elevated-normal)",
  cursor: "pointer",
  color: "var(--color-semantic-label-neutral)",
  fontFamily: "var(--font-sans)"
};
function EventChip({ event, timed, compact, onActivate, style }) {
  const tone = _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, event.tone, "signal");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "button",
    {
      type: "button",
      "data-schedule-event": event.id,
      "data-schedule-event-tone": event.tone,
      "aria-label": eventAccessibleName(event),
      onClick: () => _optionalChain([onActivate, 'optionalCall', _2 => _2(event)]),
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-1)",
        width: "100%",
        minWidth: 0,
        minHeight: 24,
        margin: 0,
        padding: compact ? "2px var(--space-1-5)" : "var(--space-1) var(--space-2)",
        boxSizing: "border-box",
        border: `1px solid ${tone.border}`,
        borderLeftWidth: 3,
        borderRadius: "var(--radius-sm)",
        background: tone.surface,
        color: tone.foreground,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        fontWeight: "var(--fw-semibold)",
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        ...style
      },
      children: [
        timed && !event.allDay && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-schedule-calendar__chip-time", style: { flexShrink: 0, fontVariantNumeric: "tabular-nums", fontWeight: "var(--fw-bold)" }, children: formatClock(event.start) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: compact ? "nowrap" : "normal", overflowWrap: "anywhere" }, children: event.title })
      ]
    }
  );
}
function useRovingGrid({ initialKey, autoFocusOnMove }) {
  const refs = _react2.default.useRef(/* @__PURE__ */ new Map());
  const [focusKey, setFocusKey] = _react2.default.useState(initialKey);
  const pendingFocus = _react2.default.useRef(false);
  _react2.default.useLayoutEffect(() => {
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
  const lastRowStart = cells[35];
  const rows = lastRowStart.getMonth() !== anchor.getMonth() ? 5 : 6;
  const weeks = Array.from({ length: rows }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const weekdayOrder = Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7);
  _react2.default.useEffect(() => {
    if (!cells.some((day) => ymd(day) === roving.focusKey)) roving.setFocusKey(ymd(anchor));
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
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const offset = (day.getDay() - weekStartsOn + 7) % 7;
      roving.move(ymd(addDays(day, event.key === "Home" ? -offset : 6 - offset)));
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const next = addMonths(day, event.key === "PageUp" ? -1 : 1);
      onNavigatePeriod(next);
      roving.move(ymd(next));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      _optionalChain([onSlotSelect, 'optionalCall', _3 => _3({ start: startOfDay(day), end: addDays(startOfDay(day), 1), allDay: true })]);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "grid",
      "aria-label": `${anchor.getFullYear()}\uB144 ${anchor.getMonth() + 1}\uC6D4 \uC77C\uC815`,
      "data-slot": "grid",
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "grid") || void 0,
      style: { display: "grid", gridTemplateRows: `auto repeat(${rows}, minmax(var(--lds-schedule-calendar-month-row-min-height, 96px), 1fr))`, borderTop: "1px solid var(--color-semantic-line-normal-normal)", borderLeft: "1px solid var(--color-semantic-line-normal-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "grid") },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "row", style: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }, children: weekdayOrder.map((weekday) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            role: "columnheader",
            "aria-label": `${WEEKDAYS[weekday]}\uC694\uC77C`,
            style: {
              padding: "var(--space-1-5) var(--space-2)",
              borderRight: "1px solid var(--color-semantic-line-normal-normal)",
              borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
              textAlign: "center",
              fontSize: "var(--caption1-size)",
              fontWeight: "var(--fw-semibold)",
              color: weekday === 0 ? "var(--color-semantic-accent-foreground-red)" : weekday === 6 ? "var(--color-semantic-accent-foreground-blue)" : "var(--color-semantic-label-neutral)"
            },
            children: WEEKDAYS[weekday]
          },
          weekday
        )) }),
        weeks.map((week, weekIndex) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "row", style: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }, children: week.map((day) => {
          const key = ymd(day);
          const dayEvents = events.filter((event) => eventCoversDay(event, day)).sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.start - b.start);
          const visible = dayEvents.slice(0, maxVisibleEvents);
          const hidden = dayEvents.length - visible.length;
          const outside = day.getMonth() !== anchor.getMonth();
          const isToday = ymd(today) === key;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "div",
            {
              role: "gridcell",
              "data-schedule-day": key,
              "data-outside": outside || void 0,
              style: {
                display: "grid",
                gridTemplateRows: "auto 1fr",
                gap: "var(--space-1)",
                minWidth: 0,
                padding: "var(--space-1)",
                borderRight: "1px solid var(--color-semantic-line-normal-normal)",
                borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
                background: outside ? "var(--color-semantic-background-normal-alternative)" : "var(--color-semantic-background-elevated-normal)"
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "button",
                  {
                    type: "button",
                    ref: roving.register(key),
                    tabIndex: roving.focusKey === key ? 0 : -1,
                    "aria-label": `${formatLongDate(day)}, \uC77C\uC815 ${dayEvents.length}\uAC74`,
                    "aria-current": isToday ? "date" : void 0,
                    "data-schedule-slot": key,
                    onFocus: () => roving.setFocusKey(key),
                    onKeyDown: (event) => handleKeyDown(day, event),
                    onClick: () => _optionalChain([onSlotSelect, 'optionalCall', _4 => _4({ start: startOfDay(day), end: addDays(startOfDay(day), 1), allDay: true })]),
                    style: {
                      justifySelf: "end",
                      minWidth: 28,
                      height: 28,
                      padding: "0 var(--space-1-5)",
                      border: "1px solid transparent",
                      borderRadius: "var(--radius-pill)",
                      background: isToday ? "var(--color-semantic-primary-normal)" : "transparent",
                      color: isToday ? "var(--color-semantic-static-white)" : outside ? "var(--color-semantic-label-alternative)" : day.getDay() === 0 ? "var(--color-semantic-accent-foreground-red)" : day.getDay() === 6 ? "var(--color-semantic-accent-foreground-blue)" : "var(--color-semantic-label-normal)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--label1-size)",
                      fontWeight: isToday ? "var(--fw-bold)" : "var(--fw-medium)",
                      fontVariantNumeric: "tabular-nums",
                      cursor: "pointer"
                    },
                    children: day.getDate()
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", alignContent: "start", gap: 2, minWidth: 0 }, children: [
                  visible.map((event) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, EventChip, { event, timed: true, compact: true, onActivate: onEventActivate }, event.id)),
                  hidden > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                    "button",
                    {
                      type: "button",
                      "data-schedule-overflow": key,
                      "aria-label": `${formatLongDate(day)} \uC77C\uC815 ${hidden}\uAC74 \uB354 \uBCF4\uAE30`,
                      onClick: () => onOverflowActivate(day, dayEvents),
                      style: {
                        justifySelf: "start",
                        padding: "0 var(--space-1-5)",
                        minHeight: 24,
                        border: 0,
                        borderRadius: "var(--radius-sm)",
                        background: "transparent",
                        color: "var(--color-semantic-primary-normal)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--caption1-size)",
                        fontWeight: "var(--fw-semibold)",
                        cursor: "pointer"
                      },
                      children: [
                        "+",
                        hidden,
                        "\uAC1C"
                      ]
                    }
                  )
                ] })
              ]
            },
            key
          );
        }) }, weekIndex))
      ]
    }
  );
}
function TimeGridView({ view, anchor, events, today, now, weekStartsOn, minMinutes, maxMinutes, slotMinutes, nowIndicator, timeGridHeight, onSlotSelect, onEventActivate, onNavigatePeriod, roving, classNames, styles }) {
  const days = view === "day" ? [startOfDay(anchor)] : Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(anchor, weekStartsOn), index));
  const firstHour = Math.floor(minMinutes / 60);
  const lastHour = Math.ceil(maxMinutes / 60);
  const hours = Array.from({ length: Math.max(1, lastHour - firstHour) }, (_, index) => firstHour + index);
  const totalHeight = hours.length * HOUR_HEIGHT;
  const slotKey = (day, hour) => `${ymd(day)}T${String(hour).padStart(2, "0")}`;
  const scrollRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    const keys = days.flatMap((day) => hours.map((hour) => slotKey(day, hour)));
    if (!keys.includes(roving.focusKey)) {
      const preferredHour = Math.min(Math.max(now.getHours(), firstHour), lastHour - 1);
      const preferredDay = _nullishCoalesce(days.find((day) => ymd(day) === ymd(anchor)), () => ( days[0]));
      roving.setFocusKey(slotKey(preferredDay, preferredHour));
    }
  }, [view, ymd(anchor)]);
  _react2.default.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const targetHour = Math.min(Math.max(now.getHours() - 1, firstHour), lastHour - 1);
    node.scrollTop = (targetHour - firstHour) * HOUR_HEIGHT;
  }, [view]);
  const handleKeyDown = (day, hour, event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextHour = hour + (event.key === "ArrowUp" ? -1 : 1);
      if (nextHour >= firstHour && nextHour < lastHour) roving.move(slotKey(day, nextHour));
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const nextDay = addDays(day, event.key === "ArrowLeft" ? -1 : 1);
      if (!days.some((item) => ymd(item) === ymd(nextDay))) onNavigatePeriod(nextDay);
      roving.move(slotKey(nextDay, hour));
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      roving.move(slotKey(day, event.key === "Home" ? firstHour : lastHour - 1));
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const nextDay = addDays(day, (view === "day" ? 1 : 7) * (event.key === "PageUp" ? -1 : 1));
      onNavigatePeriod(nextDay);
      roving.move(slotKey(nextDay, hour));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0);
      _optionalChain([onSlotSelect, 'optionalCall', _5 => _5({ start, end: new Date(start.getTime() + slotMinutes * MINUTE), allDay: false })]);
    }
  };
  const columnTemplate = `56px repeat(${days.length}, minmax(0, 1fr))`;
  const allDayByDay = days.map((day) => events.filter((event) => event.allDay && eventCoversDay(event, day)));
  const hasAllDay = allDayByDay.some((list) => list.length > 0);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "grid",
      "aria-label": `${formatRangeTitle(view, anchor, weekStartsOn)} \uC2DC\uAC04\uD45C`,
      "data-slot": "grid",
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "grid") || void 0,
      style: { display: "grid", gridTemplateRows: "auto auto minmax(0, 1fr)", minWidth: 0, borderTop: "1px solid var(--color-semantic-line-normal-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "grid") },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "row", style: { display: "grid", gridTemplateColumns: columnTemplate }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "columnheader", "aria-label": "\uC2DC\uAC04", style: { borderBottom: "1px solid var(--color-semantic-line-normal-normal)" } }),
          days.map((day) => {
            const isToday = ymd(today) === ymd(day);
            return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              "div",
              {
                role: "columnheader",
                "aria-label": formatLongDate(day),
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-1-5) var(--space-1)",
                  borderLeft: "1px solid var(--color-semantic-line-normal-normal)",
                  borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
                  fontSize: "var(--caption1-size)",
                  fontWeight: "var(--fw-semibold)",
                  color: day.getDay() === 0 ? "var(--color-semantic-accent-foreground-red)" : day.getDay() === 6 ? "var(--color-semantic-accent-foreground-blue)" : "var(--color-semantic-label-neutral)"
                },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: WEEKDAYS[day.getDay()] }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "span",
                    {
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 24,
                        height: 24,
                        padding: "0 var(--space-1)",
                        borderRadius: "var(--radius-pill)",
                        background: isToday ? "var(--color-semantic-primary-normal)" : "transparent",
                        color: isToday ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)",
                        fontSize: "var(--label1-size)",
                        fontWeight: "var(--fw-bold)",
                        fontVariantNumeric: "tabular-nums"
                      },
                      children: day.getDate()
                    }
                  )
                ]
              },
              ymd(day)
            );
          })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "row", "data-schedule-all-day": "", hidden: !hasAllDay, style: { display: hasAllDay ? "grid" : "none", gridTemplateColumns: columnTemplate }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "rowheader", style: { padding: "var(--space-1) var(--space-2)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)", fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)", textAlign: "right" }, children: "\uC885\uC77C" }),
          days.map((day, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "gridcell", style: { display: "grid", gap: 2, padding: "var(--space-1)", minWidth: 0, borderLeft: "1px solid var(--color-semantic-line-normal-normal)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)" }, children: allDayByDay[index].map((event) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, EventChip, { event, compact: true, onActivate: onEventActivate }, event.id)) }, ymd(day)))
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            ref: scrollRef,
            className: "lk-scroll-surface",
            "data-scrollbar": "auto",
            style: { overflowY: "auto", overflowX: "hidden", maxHeight: timeGridHeight, minWidth: 0 },
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: columnTemplate, minWidth: 0, paddingTop: 10, paddingBottom: 10 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", style: { position: "relative", height: totalHeight }, children: hours.map((hour, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "div",
                {
                  style: {
                    position: "absolute",
                    top: index * HOUR_HEIGHT - 8,
                    right: "var(--space-2)",
                    fontSize: "var(--caption2-size, var(--caption1-size))",
                    lineHeight: 1,
                    color: "var(--color-semantic-label-alternative)",
                    fontVariantNumeric: "tabular-nums"
                  },
                  children: [
                    String(hour).padStart(2, "0"),
                    ":00"
                  ]
                },
                hour
              )) }),
              days.map((day) => {
                const timed = events.filter((event) => !event.allDay && eventCoversDay(event, day));
                const placed = layoutTimedEvents(timed);
                const dayStart = startOfDay(day).getTime();
                const isToday = ymd(today) === ymd(day);
                const nowMinutes = (now.getTime() - startOfDay(now).getTime()) / MINUTE;
                const showNow = nowIndicator && isToday && nowMinutes >= firstHour * 60 && nowMinutes <= lastHour * 60;
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "row", "data-schedule-day": ymd(day), style: { position: "relative", height: totalHeight, minWidth: 0, borderLeft: "1px solid var(--color-semantic-line-normal-normal)" }, children: [
                  hours.map((hour, index) => {
                    const key = slotKey(day, hour);
                    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "gridcell", style: { position: "absolute", top: index * HOUR_HEIGHT, left: 0, right: 0, height: HOUR_HEIGHT, borderBottom: "1px solid var(--color-semantic-line-normal-normal)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      "button",
                      {
                        type: "button",
                        ref: roving.register(key),
                        tabIndex: roving.focusKey === key ? 0 : -1,
                        "data-schedule-slot": key,
                        "aria-label": `${formatLongDate(day)} ${String(hour).padStart(2, "0")}:00`,
                        onFocus: () => roving.setFocusKey(key),
                        onKeyDown: (event) => handleKeyDown(day, hour, event),
                        onClick: () => {
                          const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0);
                          _optionalChain([onSlotSelect, 'optionalCall', _6 => _6({ start, end: new Date(start.getTime() + slotMinutes * MINUTE), allDay: false })]);
                        },
                        style: { display: "block", width: "100%", height: "100%", margin: 0, padding: 0, border: 0, background: "transparent", cursor: "pointer", outlineOffset: -2 }
                      }
                    ) }, key);
                  }),
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "gridcell", "aria-label": `${formatLongDate(day)} \uC2DC\uAC04 \uC77C\uC815`, style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: [
                    placed.map(({ event, column, columns }) => {
                      const startMinutes = Math.max(firstHour * 60, (event.start.getTime() - dayStart) / MINUTE);
                      const endMinutes = Math.min(lastHour * 60, (event.end.getTime() - dayStart) / MINUTE);
                      if (endMinutes <= startMinutes) return null;
                      const top = (startMinutes - firstHour * 60) / 60 * HOUR_HEIGHT;
                      const height = Math.max(22, (endMinutes - startMinutes) / 60 * HOUR_HEIGHT - 2);
                      const width = 100 / columns;
                      const short = height < 44;
                      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        EventChip,
                        {
                          event,
                          timed: true,
                          compact: short || columns > 1,
                          onActivate: onEventActivate,
                          style: {
                            position: "absolute",
                            top,
                            left: `calc(${column * width}% + 2px)`,
                            width: `calc(${width}% - 4px)`,
                            height,
                            flexDirection: short ? "row" : "column",
                            alignItems: short ? "center" : "flex-start",
                            gap: short ? "var(--space-1)" : 0,
                            zIndex: 1,
                            pointerEvents: "auto"
                          }
                        },
                        event.id
                      );
                    }),
                    showNow && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      "div",
                      {
                        "aria-hidden": "true",
                        "data-schedule-now": "",
                        style: {
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: (nowMinutes - firstHour * 60) / 60 * HOUR_HEIGHT,
                          height: 2,
                          background: "var(--color-semantic-status-negative-text)",
                          pointerEvents: "none",
                          zIndex: 2
                        }
                      }
                    )
                  ] })
                ] }, ymd(day));
              })
            ] })
          }
        )
      ]
    }
  );
}
var ScheduleCalendar = _react2.default.forwardRef(function ScheduleCalendar2({
  view: viewProp,
  defaultView = "month",
  onViewChange,
  views = ["month", "week", "day"],
  date: dateProp,
  defaultDate,
  onDateChange,
  events = [],
  onEventActivate,
  onSlotSelect,
  onOverflowActivate,
  minTime = "06:00",
  maxTime = "22:00",
  slotMinutes = 30,
  weekStartsOn = 0,
  nowIndicator = true,
  timeGridHeight = 560,
  maxVisibleEvents = 3,
  label = "\uC77C\uC815",
  todayLabel = "\uC624\uB298",
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, ref) {
  const viewControlled = viewProp !== void 0;
  const [internalView, setInternalView] = _react2.default.useState(views.includes(defaultView) ? defaultView : views[0]);
  const view = viewControlled ? viewProp : internalView;
  const dateControlled = dateProp !== void 0;
  const [internalDate, setInternalDate] = _react2.default.useState(() => startOfDay(_nullishCoalesce(toDate(defaultDate), () => ( /* @__PURE__ */ new Date()))));
  const anchor = dateControlled ? startOfDay(_nullishCoalesce(toDate(dateProp), () => ( /* @__PURE__ */ new Date()))) : internalDate;
  const now = useMinuteTick(nowIndicator);
  const today = startOfDay(now);
  const normalizedEvents = _react2.default.useMemo(() => events.map(normalizeEvent).filter(Boolean), [events]);
  const minMinutes = parseClock(minTime, 6 * 60);
  const maxMinutes = Math.max(minMinutes + 60, parseClock(maxTime, 22 * 60));
  const roving = useRovingGrid({ initialKey: ymd(anchor), autoFocusOnMove: true });
  useScheduleCalendarStyles();
  const setView = (next) => {
    if (!views.includes(next) || next === view) return;
    if (!viewControlled) setInternalView(next);
    _optionalChain([onViewChange, 'optionalCall', _7 => _7(next)]);
  };
  const setDate = (next) => {
    const normalized = startOfDay(next);
    if (!dateControlled) setInternalDate(normalized);
    _optionalChain([onDateChange, 'optionalCall', _8 => _8(normalized)]);
  };
  const step = (amount) => {
    if (view === "month") setDate(addMonths(anchor, amount));
    else setDate(addDays(anchor, amount * (view === "week" ? 7 : 1)));
  };
  const handleOverflow = (day, dayEvents) => {
    if (onOverflowActivate) {
      onOverflowActivate({ date: startOfDay(day), events: dayEvents });
      return;
    }
    setDate(day);
    if (views.includes("day")) setView("day");
  };
  const title = formatRangeTitle(view, anchor, weekStartsOn);
  const viewOptions = views.map((value) => ({ value, label: VIEW_LABELS[value] }));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "section",
    {
      ref,
      "aria-label": label,
      "data-slot": "root",
      "data-view": view,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-schedule-calendar", className) || void 0,
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-schedule-calendar-"),
        containerType: "inline-size",
        containerName: "lds-schedule-calendar",
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        gap: "var(--space-3)",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "var(--lds-schedule-calendar-padding, var(--space-4))",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-xl)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "toolbar",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "toolbar") || void 0,
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2) var(--space-3)", flexWrap: "wrap", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "toolbar") },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", gap: 4 }, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": view === "month" ? "\uC774\uC804 \uB2EC" : view === "week" ? "\uC774\uC804 \uC8FC" : "\uC774\uC804 \uB0A0", onClick: () => step(-1), style: HEADER_BUTTON, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }) }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": view === "month" ? "\uB2E4\uC74C \uB2EC" : view === "week" ? "\uB2E4\uC74C \uC8FC" : "\uB2E4\uC74C \uB0A0", onClick: () => step(1), style: HEADER_BUTTON, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true" }) })
                ] }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", onClick: () => setDate(today), style: { ...HEADER_BUTTON, width: "auto", padding: "0 var(--space-3)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-normal)" }, children: todayLabel }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "title", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "title") || void 0, "aria-live": "polite", style: { fontSize: "var(--body1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "title") }, children: title })
              ] }),
              viewOptions.length > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkFA32RMMScjs.SegmentedControl, { "aria-label": "\uBCF4\uAE30 \uC804\uD658", size: "sm", options: viewOptions, value: view, onChange: setView })
            ]
          }
        ),
        view === "month" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          MonthView,
          {
            anchor,
            events: normalizedEvents,
            today,
            weekStartsOn,
            maxVisibleEvents,
            onSlotSelect,
            onEventActivate,
            onOverflowActivate: handleOverflow,
            onNavigatePeriod: setDate,
            roving,
            classNames,
            styles
          }
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          TimeGridView,
          {
            view,
            anchor,
            events: normalizedEvents,
            today,
            now,
            weekStartsOn,
            minMinutes,
            maxMinutes,
            slotMinutes,
            nowIndicator,
            timeGridHeight,
            onSlotSelect,
            onEventActivate,
            onNavigatePeriod: setDate,
            roving,
            classNames,
            styles
          }
        )
      ]
    }
  );
});



exports.ScheduleCalendar = ScheduleCalendar;
//# sourceMappingURL=chunk-K626OWLR.cjs.map