"use client";

// components/status/ProgressBar.jsx
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
function ProgressBar({
  value = 0,
  max = 100,
  indeterminate = false,
  tone = "signal",
  color,
  size = "md",
  label,
  showValue = false,
  style,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-valuetext": ariaValueText,
  ...rest
}) {
  useKeyframes("lk-prog-kf", "@keyframes lk-prog-indet{0%{left:-45%;width:45%}50%{width:55%}100%{left:100%;width:45%}}@media (prefers-reduced-motion: reduce){[data-lds-progress-indeterminate]{animation:none!important}}");
  const c = color || TONES[tone] || TONES.signal;
  const h = size === "sm" ? 4 : size === "lg" ? 10 : 6;
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const ariaLabel = ariaLabelProp ?? (typeof label === "string" ? label : void 0);
  return /* @__PURE__ */ jsxs("div", { style: { ...style }, ...rest, children: [
    (label != null || showValue) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-neutral)" }, children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      showValue && /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: [
        Math.round(pct),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "progressbar",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        "aria-busy": indeterminate || void 0,
        "aria-valuenow": indeterminate ? void 0 : Math.round(pct),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuetext": ariaValueText ?? (indeterminate ? "\uC9C4\uD589 \uC911" : `${Math.round(pct)}%`),
        style: { position: "relative", height: h, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-fill-strong)", overflow: "hidden" },
        children: indeterminate ? /* @__PURE__ */ jsx("span", { "data-lds-progress-indeterminate": true, style: { position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", background: c, borderRadius: "var(--radius-pill)", animation: "lk-prog-indet 1.3s var(--ease-in-out) infinite" } }) : /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: c, borderRadius: "var(--radius-pill)", transition: "width var(--dur-base) var(--ease-out)" } })
      }
    )
  ] });
}

export {
  ProgressBar
};
//# sourceMappingURL=chunk-UG3G5A5F.js.map