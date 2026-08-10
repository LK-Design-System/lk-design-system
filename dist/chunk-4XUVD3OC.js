"use client";
import {
  LK_LOGO_COLORS,
  LK_LOGO_VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_SCALE,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS
} from "./chunk-F35F4DHT.js";

// components/status/Spinner.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var BRAND_LETTER_COUNT = LK_PATHS.length + ROBOTICS_PATHS.length;
var brandDelay = (order) => (BRAND_LETTER_COUNT > 1 ? order / (BRAND_LETTER_COUNT - 1) * 0.55 : 0).toFixed(3);
var BRAND_WAVE_AMPLITUDE = 7;
var ROBOTICS_WAVE_AMPLITUDE = (BRAND_WAVE_AMPLITUDE / ROBOTICS_INLINE_SCALE).toFixed(6);
function useKeyframes(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function Spinner({ size, thickness, color = "var(--color-semantic-primary-normal)", label, variant = "circular", style, ...rest }) {
  useKeyframes("lk-spin-kf", "@keyframes lk-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-spinner-ring]{animation:none!important}}");
  useKeyframes("lk-brand-wave-kf", `@keyframes lk-brand-wave-lk{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(${BRAND_WAVE_AMPLITUDE}px)}}@keyframes lk-brand-wave-robo{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(${ROBOTICS_WAVE_AMPLITUDE}px)}}@media (prefers-reduced-motion: reduce){[data-wave]{animation:none!important}}`);
  const resolvedSize = size ?? (variant === "brand" ? 22 : 28);
  if (variant === "brand") {
    const mark = /* @__PURE__ */ jsx("svg", { viewBox: LK_LOGO_VIEWBOX.inline, height: resolvedSize, "aria-hidden": "true", style: { display: "block", overflow: "visible" }, children: /* @__PURE__ */ jsxs("g", { fill: LK_LOGO_COLORS.navy, fillRule: "nonzero", children: [
      LK_PATHS.map((path, i) => /* @__PURE__ */ jsx("g", { transform: path.transform, children: /* @__PURE__ */ jsx("path", { "data-wave": true, d: path.d, style: { animation: `lk-brand-wave-lk 1.15s ease-in-out ${brandDelay(i)}s infinite` } }) }, `lk${i}`)),
      /* @__PURE__ */ jsx("g", { transform: ROBOTICS_INLINE_TRANSFORM, children: ROBOTICS_PATHS.map((path, i) => /* @__PURE__ */ jsx("g", { transform: path.transform, children: /* @__PURE__ */ jsx("path", { "data-wave": true, d: path.d, style: { animation: `lk-brand-wave-robo 1.15s ease-in-out ${brandDelay(LK_PATHS.length + i)}s infinite` } }) }, `ro${i}`)) })
    ] }) });
    const ariaLabel = typeof label === "string" && label ? label : "\uBD88\uB7EC\uC624\uB294 \uC911";
    if (label == null) {
      return /* @__PURE__ */ jsx("span", { role: "status", "aria-label": ariaLabel, "aria-live": "polite", style: { display: "inline-flex", ...style }, ...rest, children: mark });
    }
    return /* @__PURE__ */ jsxs("span", { role: "status", "aria-live": "polite", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "inherit", ...style }, ...rest, children: [
      mark,
      /* @__PURE__ */ jsx("span", { children: label })
    ] });
  }
  const t = thickness || Math.max(2, Math.round(resolvedSize / 10));
  const ring = /* @__PURE__ */ jsx(
    "span",
    {
      "data-lds-spinner-ring": true,
      style: {
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: "50%",
        boxSizing: "border-box",
        border: `${t}px solid var(--color-semantic-fill-strong)`,
        borderTopColor: color,
        animation: "lk-spin 0.7s linear infinite",
        flexShrink: 0
      }
    }
  );
  if (label == null) {
    return /* @__PURE__ */ jsx("span", { role: "status", "aria-label": "\uBD88\uB7EC\uC624\uB294 \uC911", "aria-live": "polite", style: { display: "inline-flex", ...style }, ...rest, children: ring });
  }
  return /* @__PURE__ */ jsxs("span", { role: "status", "aria-live": "polite", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "inherit", ...style }, ...rest, children: [
    ring,
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}

export {
  Spinner
};
//# sourceMappingURL=chunk-4XUVD3OC.js.map