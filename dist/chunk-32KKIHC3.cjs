"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";





var _chunkNKOFS67Fcjs = require('./chunk-NKOFS67F.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? "var(--color-semantic-static-white)" : tone === "brand" ? "var(--color-semantic-primary-normal)" : tone === "current" ? "currentColor" : "var(--color-semantic-label-normal)");
  const vb = _chunkNKOFS67Fcjs.LK_LOGO_VIEWBOX[variant] || _chunkNKOFS67Fcjs.LK_LOGO_VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { transform: "translate(0,504) scale(0.1,-0.1)", fill, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { fillRule: "evenodd", d: _chunkNKOFS67Fcjs.LK_D }),
    variant === "stacked" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { fillRule: "evenodd", d: _chunkNKOFS67Fcjs.ROBO_D }),
    variant === "inline" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkNKOFS67Fcjs.ROBO_INLINE, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { fillRule: "evenodd", d: _chunkNKOFS67Fcjs.ROBO_D }) })
  ] }) });
}



exports.Lockup = Lockup;
//# sourceMappingURL=chunk-32KKIHC3.cjs.map