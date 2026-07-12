"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/forms/NumberField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, size = "md", disabled = false, readOnly = false, placeholder, style, "aria-label": ariaLabel, onFocus, onBlur, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const val = isControlled ? value : internal;
  const resolvedLabel = ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825");
  const commit = (v) => {
    const c = Math.min(max, Math.max(min, v));
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const h = size === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const Arrow = ({ dir }) => {
    const off = disabled || readOnly || (dir < 0 ? val <= min : val >= max);
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        tabIndex: -1,
        "aria-label": `${resolvedLabel} ${dir < 0 ? "\uAC12 \uAC10\uC18C" : "\uAC12 \uC99D\uAC00"}`,
        disabled: off,
        onClick: () => commit(Number(val) + dir * step),
        style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, border: "none", borderLeft: "1px solid var(--color-semantic-line-solid-normal)", background: "transparent", cursor: off ? "not-allowed" : "pointer", color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)" },
        children: /* @__PURE__ */ jsx(Icon, { name: dir < 0 ? "chevron-down-small" : "chevron-up-small", size: 12, "aria-hidden": "true" })
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "stretch", width: "fit-content", height: h, border: `1px solid ${focused ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`, borderRadius: "var(--component-input-radius)", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", boxShadow: focused ? "var(--component-input-focus-shadow)" : "none", overflow: "hidden", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)", ...style }, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ...rest,
        type: "number",
        value: val,
        min: min === -Infinity ? void 0 : min,
        max: max === Infinity ? void 0 : max,
        step,
        disabled,
        readOnly,
        placeholder,
        "aria-label": resolvedLabel,
        onChange: (e) => commit(e.target.value === "" ? 0 : Number(e.target.value)),
        onFocus: (event) => {
          setFocused(true);
          onFocus?.(event);
        },
        onBlur: (event) => {
          setFocused(false);
          onBlur?.(event);
        },
        style: { width: 92, padding: "0 var(--component-input-padding-x)", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", fontWeight: "var(--fw-semibold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", width: 28 }, children: [
      /* @__PURE__ */ jsx(Arrow, { dir: 1 }),
      /* @__PURE__ */ jsx(Arrow, { dir: -1 })
    ] })
  ] });
}

export {
  NumberField
};
//# sourceMappingURL=chunk-GE7YDJB2.js.map