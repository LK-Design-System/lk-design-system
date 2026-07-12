"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Blockquote.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Blockquote({ children, cite, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "blockquote", { style: { margin: 0, padding: "6px 0 6px 20px", borderLeft: "3px solid var(--color-semantic-primary-normal)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--headline2-size)", lineHeight: 1.7, letterSpacing: 0, color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children }),
    cite != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { marginTop: 8, fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: [
      "\u2014 ",
      cite
    ] })
  ] });
}



exports.Blockquote = Blockquote;
//# sourceMappingURL=chunk-TK7FI3L3.cjs.map