"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";






var _chunkCLUXE6YLcjs = require('./chunk-CLUXE6YL.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? _chunkCLUXE6YLcjs.LK_LOGO_COLORS.white : tone === "current" ? "currentColor" : _chunkCLUXE6YLcjs.LK_LOGO_COLORS.navy);
  const vb = _chunkCLUXE6YLcjs.LK_LOGO_VIEWBOX[variant] || _chunkCLUXE6YLcjs.LK_LOGO_VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { fill, fillRule: "nonzero", children: [
    _chunkCLUXE6YLcjs.LK_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `lk-${index}`)),
    variant === "stacked" && _chunkCLUXE6YLcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)),
    variant === "inline" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkCLUXE6YLcjs.ROBOTICS_INLINE_TRANSFORM, children: _chunkCLUXE6YLcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) })
  ] }) });
}



exports.Lockup = Lockup;
//# sourceMappingURL=chunk-FPTRGYDU.cjs.map