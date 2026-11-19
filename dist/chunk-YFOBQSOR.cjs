"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkRL3FAIQZcjs = require('./chunk-RL3FAIQZ.cjs');


var _chunkYDVKDS4Bcjs = require('./chunk-YDVKDS4B.cjs');





var _chunkEBP5HCWAcjs = require('./chunk-EBP5HCWA.cjs');










var _chunkFXOUX4YPcjs = require('./chunk-FXOUX4YP.cjs');


var _chunkCJUHIK6Xcjs = require('./chunk-CJUHIK6X.cjs');

// components/forms/TimePicker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// packages/core/dist/chunk-3LBOZBET.js

var _jsxruntime = require('react/jsx-runtime');
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var Popover = _react2.default.forwardRef(function Popover2({
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
  const [visible, setVisible] = _chunkFXOUX4YPcjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const rootRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const panelId = _react2.default.useId();
  const { mounted, shown, onTransitionEnd } = _chunkFXOUX4YPcjs.useOverlayPresence.call(void 0, visible, panelRef);
  const mergedRootRef = _chunkEBP5HCWAcjs.useMergedRefs.call(void 0, rootRef, forwardedRef);
  const getTrigger = _react2.default.useCallback(() => _chunkFXOUX4YPcjs.findOverlayTrigger.call(void 0, rootRef.current), []);
  const position = _chunkFXOUX4YPcjs.useFloatingPosition.call(void 0, {
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
  const layer = _chunkFXOUX4YPcjs.useLightDismiss.call(void 0, {
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
    _optionalChain([trigger, 'optionalAccess', _2 => _2.props, 'optionalAccess', _3 => _3.onClick, 'optionalCall', _4 => _4(event)]);
    if (!_optionalChain([event, 'optionalAccess', _5 => _5.defaultPrevented])) setVisible((current) => !current);
  };
  const triggerProps = {
    "data-anchored-overlay-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": visible,
    "aria-controls": visible ? _chunkFXOUX4YPcjs.appendAriaReference.call(void 0, _optionalChain([trigger, 'optionalAccess', _6 => _6.props, 'optionalAccess', _7 => _7["aria-controls"]]), panelId) : _optionalChain([trigger, 'optionalAccess', _8 => _8.props, 'optionalAccess', _9 => _9["aria-controls"]]),
    onClick: toggle
  };
  const renderedTrigger = _react2.default.isValidElement(trigger) && trigger.type !== _react2.default.Fragment ? _react2.default.cloneElement(trigger, triggerProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: _chunkEBP5HCWAcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkEBP5HCWAcjs.componentVars.call(void 0, vars, "--lds-popover-"), position: "relative", display: "inline-block", ..._chunkEBP5HCWAcjs.partStyle.call(void 0, styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "trigger", className: _chunkEBP5HCWAcjs.partClassName.call(void 0, classNames, "trigger") || void 0, style: { display: "inline-flex", ..._chunkEBP5HCWAcjs.partStyle.call(void 0, styles, "trigger") }, children: renderedTrigger }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkFXOUX4YPcjs.OverlayPortal, { open: mounted, interactionOpen: visible, withinPortal, portalTarget, anchorRef: rootRef, layer: "anchored", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: _chunkFXOUX4YPcjs.OVERLAY_MOTION_STYLES }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "div",
            {
              ref: panelRef,
              "data-slot": "panel",
              "data-popover-portal": withinPortal ? "true" : void 0,
              className: _chunkEBP5HCWAcjs.partClassName.call(void 0, classNames, "panel", "lk-scroll-surface") || void 0,
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
                ..._chunkEBP5HCWAcjs.componentVars.call(void 0, vars, "--lds-popover-"),
                ..._chunkRL3FAIQZcjs.anchoredPanelStyle.call(void 0, width),
                width: `var(--lds-popover-width, ${typeof width === "number" ? `${width}px` : width})`,
                ...withinPortal ? { position: "fixed", top: _nullishCoalesce(position.y, () => ( -9999)), left: _nullishCoalesce(position.x, () => ( -9999)), right: "auto", bottom: "auto", translate: "none" } : _chunkFXOUX4YPcjs.inlineFloatingStyle.call(void 0, { placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
                zIndex: layer.zIndex,
                maxHeight: `var(--lds-popover-max-height, ${position.maxHeight == null ? "none" : `${position.maxHeight}px`})`,
                overflowY: "auto",
                scrollbarGutter: "stable",
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : `translateY(${position.placement === "top" ? "var(--space-1)" : "calc(-1 * var(--space-1))"})`,
                transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
                ..._chunkEBP5HCWAcjs.partStyle.call(void 0, styles, "panel"),
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
  return _react2.default.createElement(
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
    required && _react2.default.createElement("span", { style: { color: "var(--color-semantic-status-negative-text)" } }, " *")
  );
}
function FieldMessage({ id, message, error, status = "normal", className, style, ...rest }) {
  if (message == null) return null;
  return _react2.default.createElement(
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
var FieldStack = _react2.default.forwardRef(function FieldStack2({
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
  return _react2.default.createElement(
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
    _react2.default.createElement(FieldLabel, { ...labelProps, htmlFor: fieldId, id: labelId, label, required }),
    children,
    _react2.default.createElement(FieldMessage, { ...messageProps, id: messageId, message, error, status })
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
    if (Array.isArray(input) && input.every((range) => parseClockSeconds(_optionalChain([range, 'optionalAccess', _10 => _10.start])) != null && parseClockSeconds(_optionalChain([range, 'optionalAccess', _11 => _11.end])) != null && parseClockSeconds(range.start) <= parseClockSeconds(range.end))) {
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
    first: _nullishCoalesce(_optionalChain([ranges, 'access', _12 => _12[0], 'optionalAccess', _13 => _13.start]), () => ( 0)),
    intersects,
    nearest
  };
}

// components/forms/TimePicker.jsx

function pad(number) {
  return String(number).padStart(2, "0");
}
function TimeSelect({ value, options, onChange, height, size, ariaLabel, disabled, isOptionDisabled, compact, autoFocus }) {
  const [focused, setFocused] = _react2.default.useState(false);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "relative", display: "inline-flex", ...compact ? { flex: "1 1 0", minWidth: 0 } : null }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        children: options.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: option, disabled: _optionalChain([isOptionDisabled, 'optionalCall', _14 => _14(option)]), children: pad(option) }, option))
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCJUHIK6Xcjs.Icon, { name: "chevron-down-small", size: 16, "aria-hidden": "true" })
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
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const renderedValue = isControlled ? value : internal;
  const [open, setOpen] = _react2.default.useState(false);
  const [draft, setDraft] = _react2.default.useState(renderedValue);
  const triggerRef = _react2.default.useRef(null);
  const [focused, setFocused] = _react2.default.useState(false);
  const withSeconds = precision === "second";
  const field = presentation === "field";
  const parseBound = parseClockSeconds;
  const quantum = withSeconds ? 1 : 60;
  const range = timePickerRanges({ minTime, maxTime, allowedTimeRanges, precision });
  const lower = range.first;
  const emptyRange = range.empty;
  const clamp = (seconds2) => _nullishCoalesce(range.nearest(seconds2), () => ( 0));
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
    _optionalChain([onChange, 'optionalCall', _15 => _15(nextValue)]);
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
    if (next) setDraft(format(clamp(_nullishCoalesce(parseBound(renderedValue), () => ( lower)))));
    setOpen(next);
    if (!next) window.requestAnimationFrame(() => _optionalChain([triggerRef, 'access', _16 => _16.current, 'optionalAccess', _17 => _17.focus, 'call', _18 => _18()]));
  };
  _react2.default.useEffect(() => {
    if (open && unavailable) changeOpen(false);
    else if (open) setDraft((current) => format(clamp(_nullishCoalesce(parseBound(current), () => ( lower)))));
  }, [range.key, precision, unavailable]);
  const intersects = range.intersects;
  const units = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "group",
      "aria-label": _nullishCoalesce(ariaLabel, () => ( "\uC2DC\uAC04 \uC120\uD0DD")),
      "aria-disabled": unavailable || void 0,
      style: { display: "inline-flex", width: field ? "100%" : void 0, minWidth: 0, alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-sans)" },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { fontWeight: "var(--fw-bold)", color: unavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)" }, children: ":" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        withSeconds && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { fontWeight: "var(--fw-bold)", color: unavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)" }, children: ":" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
  if (field) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Popover,
    {
      ...rest,
      open,
      onOpenChange: changeOpen,
      ariaLabel: _nullishCoalesce(ariaLabel, () => ( "\uC2DC\uAC04 \uC120\uD0DD")),
      width: withSeconds ? 304 : 240,
      styles: { panel: { minWidth: 0, maxWidth: "calc(100vw - 32px)", boxSizing: "border-box" } },
      style,
      trigger: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "button",
        {
          ref: triggerRef,
          type: "button",
          disabled: unavailable,
          "aria-label": `${_nullishCoalesce(ariaLabel, () => ( "\uC2DC\uAC04 \uC120\uD0DD"))}${renderedValue ? `, ${renderedValue}` : ""}`,
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
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue ? format(Math.floor((_nullishCoalesce(parseBound(renderedValue), () => ( 0))) / quantum) * quantum) : "\uC2DC\uAC04 \uC120\uD0DD" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCJUHIK6Xcjs.Icon, { name: "clock", size: 16, "aria-hidden": "true" })
          ]
        }
      ),
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-4)", minWidth: 0 }, children: [
        units,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYDVKDS4Bcjs.Button, { type: "button", size: "sm", variant: "outlined", color: "assistive", onClick: () => changeOpen(false), children: "\uCDE8\uC18C" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYDVKDS4Bcjs.Button, { type: "button", size: "sm", disabled: unavailable, onClick: () => {
            publish(format(clamp(_nullishCoalesce(parseBound(draft), () => ( lower)))));
            changeOpen(false);
          }, children: "\uD655\uC778" })
        ] })
      ] })
    }
  );
  return _react2.default.cloneElement(units, { ...rest, role: "group", "aria-label": _nullishCoalesce(ariaLabel, () => ( "\uC2DC\uAC04 \uC120\uD0DD")), style: { ...units.props.style, ...style } });
}



exports.TimePicker = TimePicker;
//# sourceMappingURL=chunk-YFOBQSOR.cjs.map