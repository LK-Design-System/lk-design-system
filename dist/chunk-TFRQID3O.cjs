"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Spacer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Spacer({ size, axis = "vertical", style, ...rest }) {
  if (size == null) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, ...style }, ...rest });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "block", flexShrink: 0, width: axis === "horizontal" ? size : void 0, height: axis === "vertical" ? size : void 0, ...style }, ...rest });
}



exports.Spacer = Spacer;
//# sourceMappingURL=chunk-TFRQID3O.cjs.map