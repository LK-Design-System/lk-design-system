"use client";
import {
  fieldTypography
} from "./chunk-P6R245TY.js";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/forms/TimePicker.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function pad(number) {
  return String(number).padStart(2, "0");
}
function TimeSelect({ value, options, onChange, height, size, ariaLabel, disabled }) {
  const [focused, setFocused] = React.useState(false);
  return /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ jsx(
      "select",
      {
        value,
        disabled,
        "aria-label": ariaLabel,
        onChange: (event) => onChange(Number(event.target.value)),
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        style: {
          appearance: "none",
          minWidth: 76,
          height,
          padding: "0 34px 0 12px",
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
        children: options.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: pad(option) }, option))
      }
    ),
    /* @__PURE__ */ jsx(
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
        children: /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 16, "aria-hidden": "true" })
      }
    )
  ] });
}
function TimePicker({
  value,
  defaultValue = "09:00",
  onChange,
  minuteStep = 5,
  hourLabel = "\uC2DC",
  minuteLabel = "\uBD84",
  size = "md",
  disabled = false,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const renderedValue = isControlled ? value : internal;
  const [rawHour, rawMinute] = String(renderedValue || "00:00").split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? Math.max(0, Math.min(23, rawHour)) : 0;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  const normalizedStep = Number.isFinite(minuteStep) ? Math.max(1, Math.min(60, Math.round(minuteStep))) : 5;
  const height = size === "sm" || size === "small" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: Math.ceil(60 / normalizedStep) }, (_, index) => index * normalizedStep).filter((option) => option < 60);
  if (!minutes.includes(minute)) minutes.push(minute);
  minutes.sort((a, b) => a - b);
  const commit = (nextHour, nextMinute) => {
    const nextValue = `${pad(nextHour)}:${pad(nextMinute)}`;
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel ?? "\uC2DC\uAC04 \uC120\uD0DD",
      "aria-disabled": disabled || void 0,
      style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-sans)", ...style },
      children: [
        /* @__PURE__ */ jsx(TimeSelect, { value: hour, options: hours, onChange: (nextHour) => commit(nextHour, minute), height, size, ariaLabel: hourLabel, disabled }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { fontWeight: "var(--fw-bold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)" }, children: ":" }),
        /* @__PURE__ */ jsx(TimeSelect, { value: minute, options: minutes, onChange: (nextMinute) => commit(hour, nextMinute), height, size, ariaLabel: minuteLabel, disabled })
      ]
    }
  );
}

export {
  TimePicker
};
//# sourceMappingURL=chunk-BYDLYZJM.js.map