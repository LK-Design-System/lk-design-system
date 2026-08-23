"use client";
import {
  DatePicker
} from "./chunk-CEROFAWN.js";

// components/forms/DateRangeField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ORDER_ERROR_MESSAGE = "\uC885\uB8CC\uC77C\uC740 \uC2DC\uC791\uC77C\uBCF4\uB2E4 \uBE60\uB97C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.";
var GENERIC_ERROR_MESSAGE = "\uAE30\uAC04 \uAC12\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.";
var DATE_PICKER_THEME_STYLE = {
  // Resolve the surface inside the active light/dark scope. The component
  // alias is declared at :root and otherwise retains its light value.
  "--component-input-bg": "var(--color-semantic-background-elevated-normal)"
};
function dateTime(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  const time = parsed.getTime();
  return Number.isFinite(time) ? time : null;
}
function accessibleFieldLabel(label, explicitLabel, fallback) {
  if (explicitLabel) return explicitLabel;
  if (typeof label === "string" || typeof label === "number") return String(label);
  return fallback;
}
function DateRangeField({
  value,
  defaultValue = { start: null, end: null },
  onChange,
  startLabel = "\uC2DC\uC791\uC77C",
  endLabel = "\uC885\uB8CC\uC77C",
  startAccessibleLabel,
  endAccessibleLabel,
  groupLabel = "\uAE30\uAC04 \uC120\uD0DD",
  showFieldLabels = true,
  presets,
  invalid = false,
  errorMessage,
  size = "sm",
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = isControlled ? value ?? { start: null, end: null } : internalValue;
  const range = {
    start: currentValue?.start ?? null,
    end: currentValue?.end ?? null
  };
  const startTime = dateTime(range.start);
  const endTime = dateTime(range.end);
  const orderInvalid = startTime != null && endTime != null && startTime > endTime;
  const resolvedInvalid = invalid || orderInvalid;
  const resolvedErrorMessage = errorMessage ?? (orderInvalid ? ORDER_ERROR_MESSAGE : GENERIC_ERROR_MESSAGE);
  const messageId = React.useId();
  const resolvedStartAccessibleLabel = accessibleFieldLabel(startLabel, startAccessibleLabel, "\uC2DC\uC791\uC77C");
  const resolvedEndAccessibleLabel = accessibleFieldLabel(endLabel, endAccessibleLabel, "\uC885\uB8CC\uC77C");
  const update = (key, nextDate) => {
    const nextValue = { ...range, [key]: nextDate };
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      "aria-label": groupLabel,
      "aria-describedby": resolvedInvalid ? messageId : void 0,
      "data-date-range-invalid": resolvedInvalid ? "true" : "false",
      style: { display: "grid", gap: "var(--space-2)", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        presets != null && /* @__PURE__ */ jsx("div", { "data-date-range-presets": true, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: presets }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "var(--space-2)", minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            showFieldLabels && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-normal)", fontSize: "var(--component-input-label-font-size)", fontWeight: "var(--component-input-label-font-weight)", lineHeight: "var(--component-input-label-line-height)" }, children: startLabel }),
            /* @__PURE__ */ jsx(
              DatePicker,
              {
                value: range.start,
                onChange: (nextDate) => update("start", nextDate),
                placeholder: resolvedStartAccessibleLabel,
                "aria-label": resolvedStartAccessibleLabel,
                invalid: resolvedInvalid,
                "aria-describedby": resolvedInvalid ? messageId : void 0,
                size,
                disabled,
                full: true,
                style: DATE_PICKER_THEME_STYLE
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            showFieldLabels && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-normal)", fontSize: "var(--component-input-label-font-size)", fontWeight: "var(--component-input-label-font-weight)", lineHeight: "var(--component-input-label-line-height)" }, children: endLabel }),
            /* @__PURE__ */ jsx(
              DatePicker,
              {
                value: range.end,
                onChange: (nextDate) => update("end", nextDate),
                placeholder: resolvedEndAccessibleLabel,
                "aria-label": resolvedEndAccessibleLabel,
                invalid: resolvedInvalid,
                "aria-describedby": resolvedInvalid ? messageId : void 0,
                minDate: range.start || void 0,
                size,
                disabled,
                full: true,
                style: DATE_PICKER_THEME_STYLE
              }
            )
          ] })
        ] }),
        resolvedInvalid && /* @__PURE__ */ jsx("span", { id: messageId, role: "alert", style: { color: "var(--color-semantic-status-negative-text)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: resolvedErrorMessage })
      ]
    }
  );
}

export {
  DateRangeField
};
//# sourceMappingURL=chunk-VBOPL22C.js.map