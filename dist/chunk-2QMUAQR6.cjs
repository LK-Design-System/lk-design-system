"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/AspectRatio.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function AspectRatio({ children, ratio = 16 / 9, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "relative", width: "100%", aspectRatio: String(ratio), overflow: "hidden", ...style }, ...rest, children });
}



exports.AspectRatio = AspectRatio;
//# sourceMappingURL=chunk-2QMUAQR6.cjs.map