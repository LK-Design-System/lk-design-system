"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Container.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Container({ children, size = "default", style, ...rest }) {
  if (size === "default") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-container-fluid", style, ...rest, children });
  }
  const max = size === "read" ? "var(--container-read)" : "var(--container-wide)";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { maxWidth: max, marginInline: "auto", paddingInline: "var(--grid-margin)", width: "100%", boxSizing: "border-box", ...style }, ...rest, children });
}



exports.Container = Container;
//# sourceMappingURL=chunk-FXM5D66U.cjs.map