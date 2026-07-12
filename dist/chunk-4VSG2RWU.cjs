"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Stack.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Stack({ children, direction = "column", gap = 16, align, justify, wrap = false, as = "div", style, ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Comp, { style: { display: "flex", flexDirection: direction, gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : "nowrap", ...style }, ...rest, children });
}



exports.Stack = Stack;
//# sourceMappingURL=chunk-4VSG2RWU.cjs.map