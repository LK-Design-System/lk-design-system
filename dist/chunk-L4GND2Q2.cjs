"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";







var _chunkDDFGJXVMcjs = require('./chunk-DDFGJXVM.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_HEIGHT = Object.freeze({ mark: 32, stacked: 64, inline: 28 });
var VIEWBOX_METRICS = Object.freeze(Object.fromEntries(
  Object.entries(_chunkDDFGJXVMcjs.LK_LOGO_VIEWBOX).map(([variant, value]) => {
    const [, , width, height] = value.split(/\s+/).map(Number);
    return [variant, Object.freeze({ width, height })];
  })
));
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const resolvedVariant = Object.prototype.hasOwnProperty.call(_chunkDDFGJXVMcjs.LK_LOGO_VIEWBOX, variant) ? variant : "inline";
  const fill = color || (tone === "white" ? _chunkDDFGJXVMcjs.LK_LOGO_COLORS.white : tone === "mono" ? "#000000" : tone === "current" ? "currentColor" : _chunkDDFGJXVMcjs.LK_LOGO_COLORS.navy);
  const vb = _chunkDDFGJXVMcjs.LK_LOGO_VIEWBOX[resolvedVariant];
  const minimumHeight = _chunkDDFGJXVMcjs.LK_LOGO_USAGE.minimumRenderedHeightPx[resolvedVariant];
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT[resolvedVariant];
  const h = Math.max(requestedHeight, minimumHeight);
  const metrics = VIEWBOX_METRICS[resolvedVariant];
  const intrinsicWidth = Number((h * metrics.width / metrics.height).toFixed(6));
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "svg",
    {
      viewBox: vb,
      width: intrinsicWidth,
      height: h,
      preserveAspectRatio: "xMidYMid meet",
      "data-lockup-variant": resolvedVariant,
      ...a11y,
      ...rest,
      style: { display: "block", maxWidth: "100%", height: "auto", ...style },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { fill, fillRule: "nonzero", children: [
        _chunkDDFGJXVMcjs.LK_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `lk-${index}`)),
        resolvedVariant === "stacked" && _chunkDDFGJXVMcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)),
        resolvedVariant === "inline" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkDDFGJXVMcjs.ROBOTICS_INLINE_TRANSFORM, children: _chunkDDFGJXVMcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) })
      ] })
    }
  );
}



exports.Lockup = Lockup;
//# sourceMappingURL=chunk-L4GND2Q2.cjs.map