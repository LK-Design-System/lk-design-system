"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/navigation/Toolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Toolbar({ children, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "toolbar", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)", padding: "var(--space-1-5)", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", ...style }, ...rest, children });
}



exports.Toolbar = Toolbar;
//# sourceMappingURL=chunk-RA4YWIKV.cjs.map