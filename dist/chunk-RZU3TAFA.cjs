"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Timeline.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DOT = {
  signal: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  neutral: "var(--color-semantic-interaction-inactive)"
};
function Timeline({ items = [], style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => {
    const last = i === items.length - 1;
    const c = DOT[it.tone] || DOT.signal;
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", gap: 14 }, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 } }),
        !last && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, width: 2, background: "var(--color-semantic-line-solid-normal)", marginTop: 4 } })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { paddingBottom: last ? 0 : 22 }, children: [
        it.time != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)", letterSpacing: "0.2px", color: "var(--color-semantic-label-alternative)", marginBottom: 3 }, children: it.time }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: it.title }),
        it.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: 3, fontSize: "var(--label2-size)", lineHeight: 1.6, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: it.description })
      ] })
    ] }, i);
  }) });
}



exports.Timeline = Timeline;
//# sourceMappingURL=chunk-RZU3TAFA.cjs.map