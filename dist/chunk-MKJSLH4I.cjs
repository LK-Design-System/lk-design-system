"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/data/DescriptionList.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function DescriptionList({ items = [], columns = 1, style, ...rest }) {
  const lastRowStart = items.length - ((items.length - 1) % columns + 1);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dl", { style: { margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", gap: 16, padding: "12px 0", borderBottom: i >= lastRowStart ? "none" : "1px solid var(--color-semantic-line-solid-normal)" }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { flex: "0 0 34%", fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: it.term }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: 0, flex: 1, fontSize: "var(--body2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children: it.description })
  ] }, i)) });
}



exports.DescriptionList = DescriptionList;
//# sourceMappingURL=chunk-MKJSLH4I.cjs.map