"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Columns.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var toLen = (v) => typeof v === "number" ? v + "px" : v;
function Columns({ children, columns = 12, gap, columnGap, rowGap, style, ...rest }) {
  const vars = { "--cols": columns };
  if (gap != null) {
    vars["--col-gap"] = toLen(gap);
    vars["--row-gap"] = toLen(gap);
  }
  if (columnGap != null) vars["--col-gap"] = toLen(columnGap);
  if (rowGap != null) vars["--row-gap"] = toLen(rowGap);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-grid", style: { ...vars, ...style }, ...rest, children });
}



exports.Columns = Columns;
//# sourceMappingURL=chunk-5F2NBQRV.cjs.map