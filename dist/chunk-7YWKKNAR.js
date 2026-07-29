"use client";
import {
  normalizeBoundedValue
} from "./chunk-BVUTMUVR.js";

// components/robotics/BatteryGauge.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var TONE_STYLE = {
  neutral: {
    fill: "var(--color-semantic-label-alternative)",
    text: "var(--color-semantic-label-neutral)"
  },
  signal: {
    fill: "var(--color-semantic-primary-normal)",
    text: "var(--color-semantic-status-info-text)"
  },
  positive: {
    fill: "var(--color-semantic-status-positive)",
    text: "var(--color-semantic-status-positive-text)"
  },
  cautionary: {
    fill: "var(--color-semantic-status-cautionary)",
    text: "var(--color-semantic-status-cautionary-text)"
  },
  negative: {
    fill: "var(--color-semantic-status-negative)",
    text: "var(--color-semantic-status-negative-text)"
  }
};
function legacyToneForLevel(value) {
  return value <= 20 ? "negative" : value <= 50 ? "cautionary" : "positive";
}
function BatteryGauge({ value = 0, tone, showLabel = true, size = "md", style, ...rest }) {
  const b = normalizeBoundedValue({ value }).value;
  const resolvedTone = TONE_STYLE[tone] ? tone : legacyToneForLevel(b);
  const toneStyle = TONE_STYLE[resolvedTone];
  const sm = size === "sm";
  const w = sm ? 20 : 24;
  const h = sm ? 10 : 12;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      role: "img",
      "aria-label": `\uBC30\uD130\uB9AC ${b}%`,
      style: { display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", style: { position: "relative", width: w, height: h, border: "1.5px solid var(--color-semantic-label-alternative)", borderRadius: 3, padding: 1.5, boxSizing: "border-box" }, children: [
          /* @__PURE__ */ jsx("span", { style: { display: "block", height: "100%", width: `${b}%`, background: toneStyle.fill, borderRadius: 1 } }),
          /* @__PURE__ */ jsx("span", { style: { position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "var(--color-semantic-label-alternative)", borderRadius: "0 1px 1px 0" } })
        ] }),
        showLabel && /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", style: { fontSize: sm ? 11 : 12, fontWeight: "var(--fw-bold)", color: toneStyle.text, fontVariantNumeric: "tabular-nums" }, children: [
          b,
          "%"
        ] })
      ]
    }
  );
}

export {
  BatteryGauge
};
//# sourceMappingURL=chunk-7YWKKNAR.js.map