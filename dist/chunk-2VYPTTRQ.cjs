"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Cluster.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Cluster({ children, gap = 10, align = "center", justify = "flex-start", style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", flexWrap: "wrap", gap, alignItems: align, justifyContent: justify, ...style }, ...rest, children });
}



exports.Cluster = Cluster;
//# sourceMappingURL=chunk-2VYPTTRQ.cjs.map