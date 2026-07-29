"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkQP4A6TUQcjs = require('./chunk-QP4A6TUQ.cjs');

// components/robotics/BatteryGauge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  const b = _chunkQP4A6TUQcjs.normalizeBoundedValue.call(void 0, { value }).value;
  const resolvedTone = TONE_STYLE[tone] ? tone : legacyToneForLevel(b);
  const toneStyle = TONE_STYLE[resolvedTone];
  const sm = size === "sm";
  const w = sm ? 20 : 24;
  const h = sm ? 10 : 12;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      role: "img",
      "aria-label": `\uBC30\uD130\uB9AC ${b}%`,
      style: { display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "aria-hidden": "true", style: { position: "relative", width: w, height: h, border: "1.5px solid var(--color-semantic-label-alternative)", borderRadius: 3, padding: 1.5, boxSizing: "border-box" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "block", height: "100%", width: `${b}%`, background: toneStyle.fill, borderRadius: 1 } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "var(--color-semantic-label-alternative)", borderRadius: "0 1px 1px 0" } })
        ] }),
        showLabel && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "aria-hidden": "true", style: { fontSize: sm ? 11 : 12, fontWeight: "var(--fw-bold)", color: toneStyle.text, fontVariantNumeric: "tabular-nums" }, children: [
          b,
          "%"
        ] })
      ]
    }
  );
}



exports.BatteryGauge = BatteryGauge;
//# sourceMappingURL=chunk-TYBRIND7.cjs.map