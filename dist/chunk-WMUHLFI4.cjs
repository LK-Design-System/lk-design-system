"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";






var _chunkUOF2MNMPcjs = require('./chunk-UOF2MNMP.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? _chunkUOF2MNMPcjs.LK_LOGO_COLORS.white : tone === "current" ? "currentColor" : _chunkUOF2MNMPcjs.LK_LOGO_COLORS.navy);
  const vb = _chunkUOF2MNMPcjs.LK_LOGO_VIEWBOX[variant] || _chunkUOF2MNMPcjs.LK_LOGO_VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { fill, fillRule: "nonzero", children: [
    _chunkUOF2MNMPcjs.LK_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `lk-${index}`)),
    variant === "stacked" && _chunkUOF2MNMPcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)),
    variant === "inline" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkUOF2MNMPcjs.ROBOTICS_INLINE_TRANSFORM, children: _chunkUOF2MNMPcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) })
  ] }) });
}



exports.Lockup = Lockup;
//# sourceMappingURL=chunk-WMUHLFI4.cjs.map