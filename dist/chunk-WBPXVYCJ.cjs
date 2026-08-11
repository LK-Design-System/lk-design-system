"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";







var _chunkDDFGJXVMcjs = require('./chunk-DDFGJXVM.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/brand/lk-portal-lockup-paths.js
var PORTAL_PATHS = Object.freeze([
  {
    letter: "P",
    d: "M70-700L390-700Q485-700 555-668.500Q625-637 663-578.500Q701-520 701-441L701-441Q701-362 663-304Q625-246 555-214.500Q485-183 390-183L390-183L268-183L268 0L70 0L70-700ZM268-339L378-339Q439-339 470-365.500Q501-392 501-441L501-441Q501-490 470-517Q439-544 378-544L378-544L268-544L268-339Z"
  },
  {
    letter: "O",
    d: "M1160 14Q1049 14 960.500-33Q872-80 821.500-163Q771-246 771-350L771-350Q771-454 821.500-537Q872-620 960.500-667Q1049-714 1160-714L1160-714Q1271-714 1359.500-667Q1448-620 1498.500-537Q1549-454 1549-350L1549-350Q1549-246 1498.500-163Q1448-80 1359.500-33Q1271 14 1160 14L1160 14ZM1160-150Q1213-150 1256-175Q1299-200 1324-245.500Q1349-291 1349-350L1349-350Q1349-409 1324-454.500Q1299-500 1256-525Q1213-550 1160-550L1160-550Q1107-550 1064-525Q1021-500 996-454.500Q971-409 971-350L971-350Q971-291 996-245.500Q1021-200 1064-175Q1107-150 1160-150L1160-150Z"
  },
  {
    letter: "R",
    d: "M2298 0L2086 0L1959-186L1851-186L1851 0L1653 0L1653-700L1973-700Q2068-700 2138-668.500Q2208-637 2246-578.500Q2284-520 2284-441L2284-441Q2284-365 2248.500-308.500Q2213-252 2147-220L2147-220L2298 0ZM2084-441Q2084-490 2053-517Q2022-544 1961-544L1961-544L1851-544L1851-339L1961-339Q2022-339 2053-365.500Q2084-392 2084-441L2084-441Z"
  },
  {
    letter: "T",
    d: "M2730-543L2730 0L2532 0L2532-543L2317-543L2317-700L2944-700L2944-543L2730-543Z"
  },
  {
    letter: "A",
    d: "M3403-700L3713 0L3507 0L3452-136L3156-136L3101 0L2899 0L3208-700L3403-700ZM3394-282L3304-506L3214-282L3394-282Z"
  },
  {
    letter: "L",
    d: "M4301-157L4301 0L3769 0L3769-700L3967-700L3967-157L4301-157Z"
  }
]);
var PORTAL_INLINE_TRANSFORM = "matrix(0.077147 0 0 0.077147 423.227865 208.272616)";
var PORTAL_LOCKUP_VIEWBOX = "342.60933 149.18987 416.426506 64.1628";
var PORTAL_MINIMUM_RENDERED_HEIGHT_PX = 20;

// components/brand/Lockup.jsx
var _jsxruntime = require('react/jsx-runtime');
var VARIANT_VIEWBOX = Object.freeze({ ..._chunkDDFGJXVMcjs.LK_LOGO_VIEWBOX, portal: PORTAL_LOCKUP_VIEWBOX });
var MINIMUM_HEIGHT = Object.freeze({
  ..._chunkDDFGJXVMcjs.LK_LOGO_USAGE.minimumRenderedHeightPx,
  portal: PORTAL_MINIMUM_RENDERED_HEIGHT_PX
});
var DEFAULT_HEIGHT = Object.freeze({ mark: 32, stacked: 64, inline: 28, portal: 28 });
var VIEWBOX_METRICS = Object.freeze(Object.fromEntries(
  Object.entries(VARIANT_VIEWBOX).map(([variant, value]) => {
    const [, , width, height] = value.split(/\s+/).map(Number);
    return [variant, Object.freeze({ width, height })];
  })
));
function Lockup({ variant = "inline", tone = "ink", color, height, title, decorative = false, style, ...rest }) {
  const resolvedVariant = Object.prototype.hasOwnProperty.call(VARIANT_VIEWBOX, variant) ? variant : "inline";
  const fill = color || (tone === "white" ? _chunkDDFGJXVMcjs.LK_LOGO_COLORS.white : tone === "current" ? "currentColor" : _chunkDDFGJXVMcjs.LK_LOGO_COLORS.navy);
  const vb = VARIANT_VIEWBOX[resolvedVariant];
  const minimumHeight = MINIMUM_HEIGHT[resolvedVariant];
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT[resolvedVariant];
  const h = Math.max(requestedHeight, minimumHeight);
  const metrics = VIEWBOX_METRICS[resolvedVariant];
  const intrinsicWidth = Number((h * metrics.width / metrics.height).toFixed(6));
  const accessibleTitle = _nullishCoalesce(title, () => ( (resolvedVariant === "portal" ? "LK Portal" : "LK ROBOTICS")));
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": accessibleTitle };
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
        resolvedVariant === "inline" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkDDFGJXVMcjs.ROBOTICS_INLINE_TRANSFORM, children: _chunkDDFGJXVMcjs.ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) }),
        resolvedVariant === "portal" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: PORTAL_INLINE_TRANSFORM, children: PORTAL_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d }, `${path.letter}-${index}`)) })
      ] })
    }
  );
}



exports.Lockup = Lockup;
//# sourceMappingURL=chunk-WBPXVYCJ.cjs.map