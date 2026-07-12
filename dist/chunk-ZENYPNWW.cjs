"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/robotics/BatteryGauge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function fillForLevel(b) {
  return b <= 20 ? "var(--color-semantic-status-negative)" : b <= 50 ? "var(--color-semantic-status-cautionary)" : "var(--color-semantic-status-positive)";
}
function textForLevel(b) {
  return b <= 20 ? "var(--color-semantic-status-negative-text)" : b <= 50 ? "var(--color-semantic-status-cautionary-text)" : "var(--color-semantic-status-positive-text)";
}
function BatteryGauge({ value = 0, showLabel = true, size = "md", style, ...rest }) {
  const b = Math.max(0, Math.min(100, value));
  const fill = fillForLevel(b);
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
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "block", height: "100%", width: `${b}%`, background: fill, borderRadius: 1 } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "var(--color-semantic-label-alternative)", borderRadius: "0 1px 1px 0" } })
        ] }),
        showLabel && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "aria-hidden": "true", style: { fontSize: sm ? 11 : 12, fontWeight: "var(--fw-bold)", color: textForLevel(b), fontVariantNumeric: "tabular-nums" }, children: [
          b,
          "%"
        ] })
      ]
    }
  );
}



exports.BatteryGauge = BatteryGauge;
//# sourceMappingURL=chunk-ZENYPNWW.cjs.map