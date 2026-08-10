"use client";
import {
  Checkbox
} from "./chunk-M2X7USTV.js";
import {
  useResolvedControlSize
} from "./chunk-EEL7ELPX.js";

// components/forms/CheckboxGroup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CheckboxGroup({ options = [], value, defaultValue = [], onChange, direction = "column", size, style, ...rest }) {
  const resolvedSize = useResolvedControlSize(size);
  const compact = resolvedSize === "sm" || resolvedSize === "small";
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const toggle = (v) => {
    const arr = Array.isArray(val) ? val : [];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  return /* @__PURE__ */ jsx("div", { role: "group", "data-size": compact ? "sm" : "md", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? compact ? 16 : 20 : compact ? 12 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = Array.isArray(val) && val.includes(o.value);
    return /* @__PURE__ */ jsx(
      Checkbox,
      {
        value: o.value,
        checked: on,
        disabled: o.disabled,
        size: resolvedSize,
        onChange: () => toggle(o.value),
        style: { alignItems: "flex-start" },
        label: /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: compact ? "var(--label1-size)" : "var(--body2-size)", lineHeight: compact ? "var(--label1-line)" : "var(--body2-line)", fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: o.label }),
          o.description != null && /* @__PURE__ */ jsx("span", { style: { display: "block", marginTop: "var(--space-0-5)", fontSize: "var(--label2-size)", color: "var(--color-semantic-label-alternative)" }, children: o.description })
        ] })
      },
      o.value
    );
  }) });
}

export {
  CheckboxGroup
};
//# sourceMappingURL=chunk-PVAYZPHI.js.map