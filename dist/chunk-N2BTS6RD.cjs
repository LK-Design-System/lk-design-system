"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Split.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var toLen = (v) => typeof v === "number" ? v + "px" : v;
function Split({ children, template = "1fr 1fr", at = "md", gap, style, ...rest }) {
  const vars = { "--split-template": template };
  if (gap != null) vars["--split-gap"] = toLen(gap);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-split", "data-at": at === "lg" ? "lg" : void 0, style: { ...vars, ...style }, ...rest, children });
}



exports.Split = Split;
//# sourceMappingURL=chunk-N2BTS6RD.cjs.map