"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Col.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Col({ children, span, sm, md, lg, style, ...rest }) {
  const vars = {};
  if (span != null) vars["--col-span"] = span;
  if (sm != null) vars["--col-span-sm"] = sm;
  if (md != null) vars["--col-span-md"] = md;
  if (lg != null) vars["--col-span-lg"] = lg;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-col", style: { ...vars, ...style }, ...rest, children });
}



exports.Col = Col;
//# sourceMappingURL=chunk-CPSDZ27V.cjs.map