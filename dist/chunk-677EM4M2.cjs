"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/VisuallyHidden.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function VisuallyHidden({ children, as = "span", ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Comp, { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }, ...rest, children });
}



exports.VisuallyHidden = VisuallyHidden;
//# sourceMappingURL=chunk-677EM4M2.cjs.map