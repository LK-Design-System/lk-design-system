"use client";
import {
  anchoredPanelStyle
} from "./chunk-2NQ2MMCV.js";
import {
  Button
} from "./chunk-F3JM3BLG.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-U36J6NRE.js";
import {
  OVERLAY_MOTION_STYLES,
  OverlayPortal,
  appendAriaReference,
  findOverlayTrigger,
  inlineFloatingStyle,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss,
  useOverlayPresence
} from "./chunk-EAOCCS6A.js";
import {
  Icon
} from "./chunk-2ABKRX7D.js";

// components/forms/TimePicker.jsx
import React3 from "react";

// packages/core/dist/chunk-3LBOZBET.js
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : "true";
var Popover = React.forwardRef(function Popover2({
  trigger,
  children,
  align = "left",
  position: requestedPosition = "bottom",
  offset = 8,
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "\uD31D\uC624\uBC84",
  withinPortal = true,
  portalTarget,
  collisionBoundary,
  collisionPadding = 16,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const rootRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const panelId = React.useId();
  const { mounted, shown, onTransitionEnd } = useOverlayPresence(visible, panelRef);
  const mergedRootRef = useMergedRefs(rootRef, forwardedRef);
  const getTrigger = React.useCallback(() => findOverlayTrigger(rootRef.current), []);
  const position = useFloatingPosition({
    open: mounted,
    anchorRef: rootRef,
    panelRef,
    placement: requestedPosition,
    offset,
    viewportPadding: collisionPadding,
    collisionBoundary,
    strategy: withinPortal ? "fixed" : "absolute",
    align
  });
  const layer = useLightDismiss({
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    insideRefs: [panelRef],
    zIndex
  });
  const boundaryMaxWidth = collisionBoundary != null && position.maxWidth != null ? `${position.maxWidth}px` : null;
  const boundaryMaxHeight = collisionBoundary != null && position.maxHeight != null ? `${position.maxHeight}px` : null;
  const toggle = (event) => {
    trigger?.props?.onClick?.(event);
    if (!event?.defaultPrevented) setVisible((current) => !current);
  };
  const triggerProps = {
    "data-anchored-overlay-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": visible,
    "aria-controls": visible ? appendAriaReference(trigger?.props?.["aria-controls"], panelId) : trigger?.props?.["aria-controls"],
    onClick: toggle
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment ? React.cloneElement(trigger, triggerProps) : /* @__PURE__ */ jsx(
    "span",
    {
      ...triggerProps,
      role: "button",
      tabIndex: 0,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(event);
        }
      },
      children: trigger
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: partClassName(classNames, "root", className) || void 0,
      style: { ...componentVars(vars, "--lds-popover-"), position: "relative", display: "inline-block", ...partStyle(styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { "data-slot": "trigger", className: partClassName(classNames, "trigger") || void 0, style: { display: "inline-flex", ...partStyle(styles, "trigger") }, children: renderedTrigger }),
        /* @__PURE__ */ jsxs(OverlayPortal, { open: mounted, interactionOpen: visible, withinPortal, portalTarget, anchorRef: rootRef, layer: "anchored", children: [
          /* @__PURE__ */ jsx("style", { children: OVERLAY_MOTION_STYLES }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: panelRef,
              "data-slot": "panel",
              "data-popover-portal": withinPortal ? "true" : void 0,
              className: partClassName(classNames, "panel", "lk-scroll-surface") || void 0,
              "data-scrollbar": "compact",
              "data-scroll-gutter": "stable",
              id: panelId,
              role: "dialog",
              "aria-label": ariaLabel,
              "aria-hidden": visible ? void 0 : true,
              inert: visible ? void 0 : INERT_VALUE,
              "data-lds-overlay-motion": "",
              "data-placement": position.placement,
              onTransitionEnd,
              style: {
                ...componentVars(vars, "--lds-popover-"),
                ...anchoredPanelStyle(width),
                width: `var(--lds-popover-width, ${typeof width === "number" ? `${width}px` : width})`,
                ...withinPortal ? { position: "fixed", top: position.y ?? -9999, left: position.x ?? -9999, right: "auto", bottom: "auto", translate: "none" } : inlineFloatingStyle({ placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
                zIndex: layer.zIndex,
                maxHeight: `var(--lds-popover-max-height, ${position.maxHeight == null ? "none" : `${position.maxHeight}px`})`,
                overflowY: "auto",
                scrollbarGutter: "stable",
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : `translateY(${position.placement === "top" ? "var(--space-1)" : "calc(-1 * var(--space-1))"})`,
                transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
                ...partStyle(styles, "panel"),
                ...boundaryMaxWidth == null ? null : { minWidth: 0, maxWidth: boundaryMaxWidth },
                ...boundaryMaxHeight == null ? null : { minHeight: 0, maxHeight: boundaryMaxHeight, overflow: "auto" },
                ...visible ? {} : { pointerEvents: "none" }
              },
              children
            }
          )
        ] })
      ]
    }
  );
});

// packages/core/dist/chunk-LXU56MHI.js
import React2 from "react";
function fieldTypography(size = "md") {
  const compact = size === "sm" || size === "small";
  return {
    fontSize: compact ? "var(--component-input-font-size-sm)" : "var(--component-input-font-size)",
    lineHeight: compact ? "var(--component-input-line-height-sm)" : "var(--component-input-line-height)",
    letterSpacing: compact ? "var(--component-input-letter-spacing-sm)" : "var(--component-input-letter-spacing)"
  };
}
function FieldLabel({ htmlFor, id, label, required = false, disabled = false, className, style, ...rest }) {
  if (label == null) return null;
  return React2.createElement(
    "label",
    {
      ...rest,
      id,
      htmlFor,
      className,
      style: {
        // The enabled colour goes through the component-token seam, as the rest
        // of this label's type already does. Disabled stays semantic: the token
        // family has no disabled variant.
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-label-color)",
        fontSize: "var(--component-input-label-font-size)",
        lineHeight: "var(--component-input-label-line-height)",
        letterSpacing: "var(--component-input-label-letter-spacing)",
        fontWeight: "var(--component-input-label-font-weight)",
        ...style
      }
    },
    label,
    required && React2.createElement("span", { style: { color: "var(--color-semantic-status-negative-text)" } }, " *")
  );
}
function FieldMessage({ id, message, error, status = "normal", className, style, ...rest }) {
  if (message == null) return null;
  return React2.createElement(
    "span",
    {
      ...rest,
      id,
      role: error != null ? "alert" : void 0,
      className,
      style: {
        color: error != null || status === "negative" ? "var(--color-semantic-status-negative-text)" : status === "positive" ? "var(--color-semantic-status-positive-text)" : "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        ...style
      }
    },
    message
  );
}
var FieldStack = React2.forwardRef(function FieldStack2({
  fieldId,
  labelId,
  label,
  required,
  messageId,
  message,
  error,
  status,
  fieldStyle,
  labelProps,
  messageProps,
  className,
  style,
  children,
  ...rest
}, forwardedRef) {
  return React2.createElement(
    "div",
    // `position: relative` anchors the absolutely positioned screen-reader live
    // regions that fields render (Caps Lock warnings, copy results) to the field
    // instead of the page, without adding a grid row.
    {
      ...rest,
      ref: forwardedRef,
      className,
      style: { position: "relative", display: "grid", minWidth: 0, gap: "var(--component-input-stack-gap)", ...fieldStyle, ...style }
    },
    React2.createElement(FieldLabel, { ...labelProps, htmlFor: fieldId, id: labelId, label, required }),
    children,
    React2.createElement(FieldMessage, { ...messageProps, id: messageId, message, error, status })
  );
});

// components/forms/timePickerRanges.js
function parseClockSeconds(time) {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(time));
  if (!match || +match[1] > 23 || +match[2] > 59 || +(match[3] || 0) > 59) return null;
  return +match[1] * 3600 + +match[2] * 60 + +(match[3] || 0);
}
function timePickerRanges({ minTime, maxTime, allowedTimeRanges, precision = "minute" } = {}) {
  const quantum = precision === "second" ? 1 : 60;
  const lower = minTime == null ? 0 : parseClockSeconds(minTime);
  const upper = maxTime == null ? 86399 : parseClockSeconds(maxTime);
  let ranges = [];
  if (lower != null && upper != null && lower <= upper) {
    const input = allowedTimeRanges === void 0 ? [{ start: "00:00:00", end: "23:59:59" }] : allowedTimeRanges;
    if (Array.isArray(input) && input.every((range) => parseClockSeconds(range?.start) != null && parseClockSeconds(range?.end) != null && parseClockSeconds(range.start) <= parseClockSeconds(range.end))) {
      for (const range of input) {
        const start = Math.ceil(Math.max(lower, parseClockSeconds(range.start)) / quantum) * quantum;
        const end = Math.floor(Math.min(upper, parseClockSeconds(range.end)) / quantum) * quantum;
        if (end >= start) ranges.push({ start, end });
      }
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  ranges = ranges.reduce((all, range) => {
    const previous = all.at(-1);
    if (previous && range.start <= previous.end + quantum) previous.end = Math.max(previous.end, range.end);
    else all.push({ ...range });
    return all;
  }, []);
  const intersects = (start, end) => {
    const first = Math.ceil(start / quantum) * quantum, last = Math.floor(end / quantum) * quantum;
    return first <= last && ranges.some((range) => first <= range.end && last >= range.start);
  };
  const nearest = (value, start = 0, end = 86399) => {
    let selected = null, distance = Infinity;
    for (const range of ranges) {
      const first = Math.ceil(Math.max(range.start, start) / quantum) * quantum;
      const last = Math.floor(Math.min(range.end, end) / quantum) * quantum;
      if (first > last) continue;
      const candidate = Math.max(first, Math.min(last, Math.round(value / quantum) * quantum));
      const nextDistance = Math.abs(candidate - value);
      if (nextDistance < distance || nextDistance === distance && candidate < selected) {
        selected = candidate;
        distance = nextDistance;
      }
    }
    return selected;
  };
  return {
    ranges,
    empty: !ranges.length,
    key: ranges.map((range) => `${range.start}:${range.end}`).join(","),
    first: ranges[0]?.start ?? 0,
    intersects,
    nearest
  };
}

// components/forms/TimePicker.jsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function pad(number) {
  return String(number).padStart(2, "0");
}
function TimeSelect({ value, options, onChange, height, size, ariaLabel, disabled, isOptionDisabled, compact, autoFocus }) {
  const [focused, setFocused] = React3.useState(false);
  return /* @__PURE__ */ jsxs2("span", { style: { position: "relative", display: "inline-flex", ...compact ? { flex: "1 1 0", minWidth: 0 } : null }, children: [
    /* @__PURE__ */ jsx2(
      "select",
      {
        value,
        disabled,
        autoFocus,
        "aria-label": ariaLabel,
        onChange: (event) => onChange(Number(event.target.value)),
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        style: {
          appearance: "none",
          minWidth: compact ? 0 : 76,
          width: compact ? "100%" : void 0,
          height,
          padding: compact ? "0 26px 0 8px" : "0 34px 0 12px",
          boxSizing: "border-box",
          background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)",
          border: `1px solid ${focused ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`,
          borderRadius: "var(--component-input-radius)",
          boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
          color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          fontFamily: "var(--font-sans)",
          ...fieldTypography(size),
          fontWeight: "var(--fw-semibold)",
          fontVariantNumeric: "tabular-nums",
          transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
        },
        children: options.map((option) => /* @__PURE__ */ jsx2("option", { value: option, disabled: isOptionDisabled?.(option), children: pad(option) }, option))
      }
    ),
    /* @__PURE__ */ jsx2(
      "span",
      {
        "aria-hidden": "true",
        style: {
          position: "absolute",
          top: "50%",
          right: 10,
          display: "inline-flex",
          color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-icon-color)",
          transform: "translateY(-50%)",
          pointerEvents: "none"
        },
        children: /* @__PURE__ */ jsx2(Icon, { name: "chevron-down-small", size: 16, "aria-hidden": "true" })
      }
    )
  ] });
}
function TimePicker({
  value,
  defaultValue = "09:00",
  onChange,
  minuteStep = 5,
  precision = "minute",
  presentation = "units",
  minTime,
  maxTime,
  allowedTimeRanges,
  secondStep = 1,
  hourLabel = "\uC2DC",
  minuteLabel = "\uBD84",
  secondLabel = "\uCD08",
  size = "md",
  disabled = false,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React3.useState(defaultValue);
  const renderedValue = isControlled ? value : internal;
  const [open, setOpen] = React3.useState(false);
  const [draft, setDraft] = React3.useState(renderedValue);
  const triggerRef = React3.useRef(null);
  const [focused, setFocused] = React3.useState(false);
  const withSeconds = precision === "second";
  const field = presentation === "field";
  const parseBound = parseClockSeconds;
  const quantum = withSeconds ? 1 : 60;
  const range = timePickerRanges({ minTime, maxTime, allowedTimeRanges, precision });
  const lower = range.first;
  const emptyRange = range.empty;
  const clamp = (seconds2) => range.nearest(seconds2) ?? 0;
  const format = (seconds2) => `${pad(Math.floor(seconds2 / 3600))}:${pad(Math.floor(seconds2 / 60) % 60)}${withSeconds ? `:${pad(seconds2 % 60)}` : ""}`;
  const draftValue = field && open ? draft : renderedValue;
  const [rawHour, rawMinute, rawSecond] = String(draftValue || "00:00").split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? Math.max(0, Math.min(23, rawHour)) : 0;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  const second = Number.isFinite(rawSecond) ? Math.max(0, Math.min(59, Math.trunc(rawSecond))) : 0;
  const unavailable = disabled || emptyRange;
  const normalizedStep = Number.isFinite(minuteStep) ? Math.max(1, Math.min(60, Math.round(minuteStep))) : 5;
  const height = size === "sm" || size === "small" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const normalizedSecondStep = Number.isFinite(secondStep) ? Math.max(1, Math.min(60, Math.round(secondStep))) : 1;
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: Math.ceil(60 / normalizedStep) }, (_, index) => index * normalizedStep).filter((option) => option < 60);
  if (!minutes.includes(minute)) minutes.push(minute);
  minutes.sort((a, b) => a - b);
  const seconds = Array.from({ length: Math.ceil(60 / normalizedSecondStep) }, (_, index) => index * normalizedSecondStep).filter((option) => option < 60);
  if (!seconds.includes(second)) seconds.push(second);
  seconds.sort((a, b) => a - b);
  const publish = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };
  const commit = (nextHour, nextMinute, nextSecond = second, unit = "second") => {
    if (unavailable) return;
    const candidate = nextHour * 3600 + nextMinute * 60 + (withSeconds ? nextSecond : 0);
    const first = unit === "hour" ? nextHour * 3600 : unit === "minute" ? nextHour * 3600 + nextMinute * 60 : candidate;
    const last = first + (unit === "hour" ? 3599 : unit === "minute" && withSeconds ? 59 : 0);
    const valid = range.nearest(candidate, first, last);
    if (valid == null) return;
    const nextValue = format(valid);
    if (field) setDraft(nextValue);
    else publish(nextValue);
  };
  const changeOpen = (next) => {
    if (next && unavailable) return;
    if (next) setDraft(format(clamp(parseBound(renderedValue) ?? lower)));
    setOpen(next);
    if (!next) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };
  React3.useEffect(() => {
    if (open && unavailable) changeOpen(false);
    else if (open) setDraft((current) => format(clamp(parseBound(current) ?? lower)));
  }, [range.key, precision, unavailable]);
  const intersects = range.intersects;
  const units = /* @__PURE__ */ jsxs2(
    "div",
    {
      role: "group",
      "aria-label": ariaLabel ?? "\uC2DC\uAC04 \uC120\uD0DD",
      "aria-disabled": unavailable || void 0,
      style: { display: "inline-flex", width: field ? "100%" : void 0, minWidth: 0, alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-sans)" },
      children: [
        /* @__PURE__ */ jsx2(
          TimeSelect,
          {
            value: hour,
            options: hours,
            onChange: (nextHour) => commit(nextHour, minute, second, "hour"),
            height,
            size,
            ariaLabel: hourLabel,
            disabled: unavailable,
            compact: field,
            autoFocus: field && open,
            isOptionDisabled: (option) => !intersects(option * 3600, option * 3600 + 3599)
          }
        ),
        /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", style: { fontWeight: "var(--fw-bold)", color: unavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)" }, children: ":" }),
        /* @__PURE__ */ jsx2(
          TimeSelect,
          {
            value: minute,
            options: minutes,
            onChange: (nextMinute) => commit(hour, nextMinute, second, "minute"),
            height,
            size,
            ariaLabel: minuteLabel,
            disabled: unavailable,
            compact: field,
            isOptionDisabled: (option) => !intersects(hour * 3600 + option * 60, hour * 3600 + option * 60 + (withSeconds ? 59 : 0))
          }
        ),
        withSeconds && /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx2("span", { "aria-hidden": "true", style: { fontWeight: "var(--fw-bold)", color: unavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)" }, children: ":" }),
          /* @__PURE__ */ jsx2(
            TimeSelect,
            {
              value: second,
              options: seconds,
              onChange: (nextSecond) => commit(hour, minute, nextSecond),
              height,
              size,
              ariaLabel: secondLabel,
              disabled: unavailable,
              compact: field,
              isOptionDisabled: (option) => !intersects(hour * 3600 + minute * 60 + option, hour * 3600 + minute * 60 + option)
            }
          )
        ] })
      ]
    }
  );
  if (field) return /* @__PURE__ */ jsx2(
    Popover,
    {
      ...rest,
      open,
      onOpenChange: changeOpen,
      ariaLabel: ariaLabel ?? "\uC2DC\uAC04 \uC120\uD0DD",
      width: withSeconds ? 304 : 240,
      styles: { panel: { minWidth: 0, maxWidth: "calc(100vw - 32px)", boxSizing: "border-box" } },
      style,
      trigger: /* @__PURE__ */ jsxs2(
        "button",
        {
          ref: triggerRef,
          type: "button",
          disabled: unavailable,
          "aria-label": `${ariaLabel ?? "\uC2DC\uAC04 \uC120\uD0DD"}${renderedValue ? `, ${renderedValue}` : ""}`,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--component-input-gap)",
            height,
            minWidth: withSeconds ? 148 : 128,
            padding: "0 var(--component-input-padding-x)",
            boxSizing: "border-box",
            background: unavailable ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)",
            border: `1px solid ${focused || open ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`,
            borderRadius: "var(--component-input-radius)",
            boxShadow: focused || open ? "var(--component-input-focus-shadow)" : "none",
            color: unavailable ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
            cursor: unavailable ? "not-allowed" : "pointer",
            outline: "none",
            fontFamily: "var(--font-sans)",
            ...fieldTypography(size),
            fontVariantNumeric: "tabular-nums",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
          },
          children: [
            /* @__PURE__ */ jsx2("span", { children: renderedValue ? format(Math.floor((parseBound(renderedValue) ?? 0) / quantum) * quantum) : "\uC2DC\uAC04 \uC120\uD0DD" }),
            /* @__PURE__ */ jsx2(Icon, { name: "clock", size: 16, "aria-hidden": "true" })
          ]
        }
      ),
      children: /* @__PURE__ */ jsxs2("div", { style: { display: "grid", gap: "var(--space-4)", minWidth: 0 }, children: [
        units,
        /* @__PURE__ */ jsxs2("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: [
          /* @__PURE__ */ jsx2(Button, { type: "button", size: "sm", variant: "outlined", color: "assistive", onClick: () => changeOpen(false), children: "\uCDE8\uC18C" }),
          /* @__PURE__ */ jsx2(Button, { type: "button", size: "sm", disabled: unavailable, onClick: () => {
            publish(format(clamp(parseBound(draft) ?? lower)));
            changeOpen(false);
          }, children: "\uD655\uC778" })
        ] })
      ] })
    }
  );
  return React3.cloneElement(units, { ...rest, role: "group", "aria-label": ariaLabel ?? "\uC2DC\uAC04 \uC120\uD0DD", style: { ...units.props.style, ...style } });
}

export {
  TimePicker
};
//# sourceMappingURL=chunk-6K6BE5CW.js.map