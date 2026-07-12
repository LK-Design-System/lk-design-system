"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Code.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';
function Code({ children, block = false, style, ...rest }) {
  if (block) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "pre", { style: { margin: 0, padding: "14px 16px", background: "var(--color-semantic-inverse-background)", color: "var(--color-semantic-inverse-label)", borderRadius: "var(--radius-lg)", overflowX: "auto", fontFamily: MONO, fontSize: "var(--label2-size)", lineHeight: 1.6, ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "code", { children }) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "code", { style: { padding: "2px 6px", background: "var(--color-semantic-fill-strong)", color: "var(--color-semantic-label-normal)", borderRadius: "var(--radius-sm)", fontFamily: MONO, fontSize: "0.9em", ...style }, ...rest, children });
}



exports.Code = Code;
//# sourceMappingURL=chunk-LCPMLCBT.cjs.map