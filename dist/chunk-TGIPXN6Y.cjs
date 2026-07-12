"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/feedback/PushBadge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function PushBadge({ children, count, dot = false, max = 99, tone = "negative", style, ...rest }) {
  const c = tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "navy" ? "var(--color-semantic-inverse-background)" : "var(--color-semantic-status-negative-text)";
  const show = dot || count != null && count > 0;
  const label = count > max ? `${max}+` : count;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "relative", display: "inline-flex", ...style }, ...rest, children: [
    children,
    show && (dot ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box" } }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: -7, right: -9, minWidth: 18, height: 18, padding: "0 5px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: c, color: "var(--color-semantic-static-white)", borderRadius: "var(--radius-pill)", border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: label }))
  ] });
}



exports.PushBadge = PushBadge;
//# sourceMappingURL=chunk-TGIPXN6Y.cjs.map