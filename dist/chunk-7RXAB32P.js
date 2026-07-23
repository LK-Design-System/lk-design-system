"use client";

// components/status/CircularProgress.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function useKeyframes(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
var TONES = {
  signal: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)"
};
function CircularProgress({
  value = 0,
  max = 100,
  size = 48,
  thickness = 5,
  tone = "signal",
  indeterminate = false,
  label,
  showValue = false,
  style,
  ...rest
}) {
  useKeyframes("lk-circular-kf", "@keyframes lk-circular-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-circular-progress]{animation:none!important}}");
  const c = TONES[tone] || TONES.signal;
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = indeterminate ? circ * 0.72 : circ * (1 - pct / 100);
  const ariaLabel = typeof label === "string" ? label : void 0;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      role: "progressbar",
      "aria-label": ariaLabel,
      "aria-busy": indeterminate || void 0,
      "aria-valuenow": indeterminate ? void 0 : Math.round(pct),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuetext": indeterminate ? "\uC9C4\uD589 \uC911" : `${Math.round(pct)}%`,
      style: { position: "relative", display: "inline-flex", width: size, height: size, ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            "data-lds-circular-progress": true,
            width: size,
            height: size,
            style: { transform: "rotate(-90deg)", transformOrigin: "center", animation: indeterminate ? "lk-circular-spin 0.9s linear infinite" : void 0 },
            children: [
              /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--color-semantic-fill-strong)", strokeWidth: thickness }),
              /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: c, strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: circ, strokeDashoffset: dashOffset, style: { transition: indeterminate ? void 0 : "stroke-dashoffset var(--dur-base) var(--ease-out)" } })
            ]
          }
        ),
        showValue && !indeterminate && /* @__PURE__ */ jsx("span", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: Math.round(size * 0.28), fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-normal)", fontVariantNumeric: "tabular-nums" }, children: Math.round(pct) })
      ]
    }
  );
}

export {
  CircularProgress
};
//# sourceMappingURL=chunk-7RXAB32P.js.map