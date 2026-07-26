"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/cards/Stat.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Stat({
  value,
  unit,
  label,
  accent = "ink",
  dark = false,
  stacked = false,
  style,
  ...rest
}) {
  const colors = { ink: "var(--color-semantic-label-strong)", signal: "var(--color-semantic-primary-normal)", steel: "var(--color-semantic-accent-foreground-blue)" };
  const valColor = dark ? "var(--color-semantic-static-white)" : colors[accent] || colors.ink;
  const labColor = dark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: stacked ? "flex-start" : "baseline",
        gap: stacked ? "6px" : "14px",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "baseline", gap: unit === "%" || unit === "\u2030" || unit === "\xB0" ? 0 : "0.25em", color: valColor }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--display2-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: value }),
          unit != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", fontWeight: "var(--fw-semibold)" }, children: unit })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--body2-size)", lineHeight: 1.5, maxWidth: stacked ? "none" : 160, color: labColor, wordBreak: "keep-all" }, children: label })
      ]
    }
  );
}



exports.Stat = Stat;
//# sourceMappingURL=chunk-YYSIXWNY.cjs.map