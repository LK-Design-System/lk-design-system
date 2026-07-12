"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/overlay/ToastStack.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ToastStack({ children, position = "bottom-right", gap = 10, style, ...rest }) {
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
    "top-left": { top: 20, left: 20, alignItems: "flex-start" },
    "bottom-center": { bottom: 20, left: "50%", transform: "translateX(-50%)", alignItems: "center" }
  }[position] || {};
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "fixed", zIndex: 120, display: "flex", flexDirection: "column", gap, ...pos, ...style }, ...rest, children });
}



exports.ToastStack = ToastStack;
//# sourceMappingURL=chunk-3QS2RADM.cjs.map