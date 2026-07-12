"use client";
import {
  ProgressBar
} from "./chunk-FEOT7H4A.js";

// components/status/Meter.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Meter({ value = 0, max = 100, label, thresholds, size = "md", showValue = true, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  let c = "var(--color-semantic-primary-normal)";
  if (thresholds) {
    if (pct <= thresholds.low) c = "var(--color-semantic-status-negative)";
    else if (pct <= thresholds.high) c = "var(--color-semantic-status-cautionary)";
    else c = "var(--color-semantic-status-positive)";
  }
  return /* @__PURE__ */ jsxs("div", { style: { ...style }, ...rest, children: [
    (label != null || showValue) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-neutral)" }, children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      showValue && /* @__PURE__ */ jsxs("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--color-semantic-label-alternative)" }, children: [
        value,
        "/",
        max
      ] })
    ] }),
    /* @__PURE__ */ jsx(ProgressBar, { value, max, size: size === "sm" ? "md" : "lg", color: c, "aria-label": typeof label === "string" ? label : void 0 })
  ] });
}

export {
  Meter
};
//# sourceMappingURL=chunk-7LPKTWWY.js.map