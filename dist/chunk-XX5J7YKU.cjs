"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/content/Blockquote.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Blockquote({ children, attribution, cite, citeUrl, style, ...rest }) {
  const source = _nullishCoalesce(attribution, () => ( cite));
  const quoteStyle = { fontSize: "var(--headline2-size)", lineHeight: 1.7, letterSpacing: 0, color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" };
  const frameStyle = { margin: 0, padding: "var(--space-3) var(--space-4)", background: "var(--color-semantic-fill-alternative)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-sans)", ...style };
  if (source == null) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "blockquote", { cite: citeUrl, style: frameStyle, ...rest, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: quoteStyle, children }) });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "figure", { style: frameStyle, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "blockquote", { cite: citeUrl, style: { margin: 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: quoteStyle, children }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "figcaption", { style: { marginTop: 8, fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: [
      "\u2014 ",
      source
    ] })
  ] });
}



exports.Blockquote = Blockquote;
//# sourceMappingURL=chunk-XX5J7YKU.cjs.map