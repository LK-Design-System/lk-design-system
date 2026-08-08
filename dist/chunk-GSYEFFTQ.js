"use client";
import {
  Icon
} from "./chunk-B2YSRUC3.js";

// components/data/Calendar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var WEEKDAYS = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDate(value) {
  return value ? value instanceof Date ? value : new Date(value) : null;
}
function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}
function addMonths(date, amount) {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function formatDateLabel(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(date);
}
function toDayNumber(date) {
  return date.getFullYear() * 1e4 + date.getMonth() * 100 + date.getDate();
}
function DayCell({ date, selected, today, disabled, tabIndex, buttonRef, onFocus, onKeyDown, onPick }) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const dayOfWeek = date.getDay();
  const background = selected && !disabled ? "var(--color-semantic-primary-normal)" : hovered && !disabled ? "var(--color-semantic-fill-normal)" : "transparent";
  const color = disabled ? "var(--color-semantic-label-disable)" : selected ? "var(--color-semantic-static-white)" : dayOfWeek === 0 ? "var(--color-semantic-accent-foreground-red)" : dayOfWeek === 6 ? "var(--color-semantic-accent-foreground-blue)" : "var(--color-semantic-label-normal)";
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref: buttonRef,
      type: "button",
      tabIndex,
      "aria-label": selected ? `${formatDateLabel(date)}, \uC120\uD0DD\uB428` : formatDateLabel(date),
      "aria-current": today ? "date" : void 0,
      "aria-disabled": disabled || void 0,
      onClick: () => {
        if (!disabled) onPick(date);
      },
      onFocus: () => {
        setFocused(true);
        onFocus();
      },
      onBlur: () => setFocused(false),
      onKeyDown,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        width: "100%",
        height: 38,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        border: today && !selected && !disabled ? "1px solid var(--color-semantic-primary-normal)" : "1px solid transparent",
        outline: "none",
        boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
        background,
        color,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        fontWeight: selected ? "var(--fw-bold)" : "var(--fw-medium)",
        fontVariantNumeric: "tabular-nums",
        textDecoration: disabled ? "line-through" : "none",
        transition: "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
      },
      children: date.getDate()
    }
  );
}
function Calendar({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, autoFocus = false, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(() => parseDate(defaultValue));
  const selected = isControlled ? parseDate(value) : internal;
  const today = React.useMemo(() => /* @__PURE__ */ new Date(), []);
  const minDay = React.useMemo(() => {
    const d = parseDate(minDate);
    return d ? toDayNumber(d) : null;
  }, [minDate]);
  const maxDay = React.useMemo(() => {
    const d = parseDate(maxDate);
    return d ? toDayNumber(d) : null;
  }, [maxDate]);
  const isUnavailable = React.useCallback((date) => {
    const day = toDayNumber(date);
    if (minDay != null && day < minDay) return true;
    if (maxDay != null && day > maxDay) return true;
    return isDateDisabled ? Boolean(isDateDisabled(date)) : false;
  }, [minDay, maxDay, isDateDisabled]);
  const initialDate = selected ?? today;
  const [view, setView] = React.useState(() => startOfMonth(initialDate));
  const [focusDate, setFocusDate] = React.useState(initialDate);
  const dayRefs = React.useRef(/* @__PURE__ */ new Map());
  const gridRef = React.useRef(null);
  const pendingFocus = React.useRef(autoFocus);
  const selectedKey = selected ? ymd(selected) : null;
  const syncedSelectedKey = React.useRef(selectedKey);
  const startDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const dayCount = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => new Date(view.getFullYear(), view.getMonth(), index + 1))
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  React.useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const target = dayRefs.current.get(ymd(focusDate));
    if (target) {
      target.focus();
      pendingFocus.current = false;
    }
  }, [focusDate, view]);
  React.useEffect(() => {
    if (syncedSelectedKey.current === selectedKey) return;
    syncedSelectedKey.current = selectedKey;
    if (!selected) return;
    setFocusDate(selected);
    setView((current) => sameMonth(selected, current) ? current : startOfMonth(selected));
  }, [selected, selectedKey]);
  const moveFocus = (nextDate) => {
    pendingFocus.current = true;
    setFocusDate(nextDate);
    if (!sameMonth(nextDate, view)) {
      setView(startOfMonth(nextDate));
    }
  };
  const pick = (date) => {
    if (isUnavailable(date)) return;
    if (!isControlled) setInternal(date);
    onChange?.(date);
  };
  const navigateMonth = (amount) => {
    const nextFocusDate = addMonths(focusDate, amount);
    const activeElement = gridRef.current?.ownerDocument?.activeElement;
    if (gridRef.current && activeElement && gridRef.current.contains(activeElement)) {
      pendingFocus.current = true;
    }
    setFocusDate(nextFocusDate);
    setView(startOfMonth(nextFocusDate));
  };
  const navigationButtonStyle = {
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--color-semantic-line-solid-normal)",
    borderRadius: "var(--radius-md)",
    background: "var(--color-semantic-background-elevated-normal)",
    cursor: "pointer",
    color: "var(--color-semantic-label-neutral)"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        width: 300,
        fontFamily: "var(--font-sans)",
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-xl)",
        padding: 16,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3-5)" }, children: [
          /* @__PURE__ */ jsxs("div", { "aria-live": "polite", style: { fontSize: "var(--body1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-normal)" }, children: [
            view.getFullYear(),
            "\uB144 ",
            view.getMonth() + 1,
            "\uC6D4"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
            /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "\uC774\uC804 \uB2EC", onClick: () => navigateMonth(-1), style: navigationButtonStyle, children: /* @__PURE__ */ jsx(Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "\uB2E4\uC74C \uB2EC", onClick: () => navigateMonth(1), style: navigationButtonStyle, children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { ref: gridRef, role: "grid", "aria-label": `${view.getFullYear()}\uB144 ${view.getMonth() + 1}\uC6D4`, children: [
          /* @__PURE__ */ jsx("div", { role: "row", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--space-0-5)", marginBottom: "var(--space-1-5)" }, children: WEEKDAYS.map((weekday, index) => /* @__PURE__ */ jsx(
            "div",
            {
              role: "columnheader",
              "aria-label": `${weekday}\uC694\uC77C`,
              style: {
                textAlign: "center",
                fontSize: "var(--caption1-size)",
                fontWeight: "var(--fw-semibold)",
                color: index === 0 ? "var(--color-semantic-accent-foreground-red)" : index === 6 ? "var(--color-semantic-accent-foreground-blue)" : "var(--color-semantic-label-neutral)"
              },
              children: weekday
            },
            weekday
          )) }),
          weeks.map((week, weekIndex) => /* @__PURE__ */ jsx("div", { role: "row", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--space-0-5)" }, children: week.map((date, dayIndex) => /* @__PURE__ */ jsx("div", { role: "gridcell", "aria-selected": date ? Boolean(selected && ymd(selected) === ymd(date)) : void 0, children: date && /* @__PURE__ */ jsx(
            DayCell,
            {
              date,
              selected: Boolean(selected && ymd(selected) === ymd(date)),
              today: ymd(today) === ymd(date),
              disabled: isUnavailable(date),
              tabIndex: ymd(focusDate) === ymd(date) ? 0 : -1,
              buttonRef: (node) => {
                if (node) dayRefs.current.set(ymd(date), node);
                else dayRefs.current.delete(ymd(date));
              },
              onFocus: () => setFocusDate(date),
              onPick: pick,
              onKeyDown: (event) => {
                if (event.key === "PageUp" || event.key === "PageDown") {
                  event.preventDefault();
                  const step = event.key === "PageUp" ? -1 : 1;
                  moveFocus(addMonths(date, event.shiftKey ? step * 12 : step));
                  return;
                }
                const movement = {
                  ArrowLeft: -1,
                  ArrowRight: 1,
                  ArrowUp: -7,
                  ArrowDown: 7,
                  Home: -date.getDay(),
                  End: 6 - date.getDay()
                }[event.key];
                if (movement != null) {
                  event.preventDefault();
                  moveFocus(addDays(date, movement));
                }
              }
            }
          ) }, date ? ymd(date) : `empty-${dayIndex}`)) }, weekIndex))
        ] })
      ]
    }
  );
}

export {
  Calendar
};
//# sourceMappingURL=chunk-GSYEFFTQ.js.map