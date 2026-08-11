"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";







var _chunkDDFGJXVMcjs = require('./chunk-DDFGJXVM.cjs');

// components/brand/Lockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/brand/lk-portal-lockup-paths.js
var PORTAL_PATHS = Object.freeze([
  {
    letter: "P",
    d: "M94-700L382-700Q473-700 540.500-670Q608-640 644-584Q680-528 680-451L680-451Q680-375 644-318.500Q608-262 540.500-232Q473-202 382-202L382-202L224-202L224 0L94 0L94-700ZM224-312L376-312Q461-312 505-348Q549-384 549-451L549-451Q549-518 505-554Q461-590 376-590L376-590L224-590L224-312Z"
  },
  {
    letter: "O",
    d: "M1147 10Q1040 10 954-36.500Q868-83 819-165.500Q770-248 770-350L770-350Q770-452 819-534.500Q868-617 954-663.500Q1040-710 1147-710L1147-710Q1254-710 1340-663.500Q1426-617 1475-535Q1524-453 1524-350L1524-350Q1524-247 1475-165Q1426-83 1340-36.500Q1254 10 1147 10L1147 10ZM1147-104Q1217-104 1273-135.500Q1329-167 1361-223.500Q1393-280 1393-350L1393-350Q1393-420 1361-476.500Q1329-533 1273-564.500Q1217-596 1147-596L1147-596Q1077-596 1021-564.500Q965-533 933-476.500Q901-420 901-350L901-350Q901-280 933-223.500Q965-167 1021-135.500Q1077-104 1147-104L1147-104Z"
  },
  {
    letter: "R",
    d: "M2099-230L2260 0L2120 0L1977-205Q1968-204 1950-204L1950-204L1792-204L1792 0L1662 0L1662-700L1950-700Q2041-700 2108.500-670Q2176-640 2212-584Q2248-528 2248-451L2248-451Q2248-372 2209.500-315Q2171-258 2099-230L2099-230ZM2117-451Q2117-518 2073-554Q2029-590 1944-590L1944-590L1792-590L1792-311L1944-311Q2029-311 2073-347.500Q2117-384 2117-451L2117-451Z"
  },
  {
    letter: "T",
    d: "M2655-590L2655 0L2525 0L2525-590L2293-590L2293-700L2887-700L2887-590L2655-590Z"
  },
  {
    letter: "A",
    d: "M3294-700L3610 0L3474 0L3404-162L3054-162L2985 0L2851 0L3166-700L3294-700ZM3361-264L3229-570L3098-264L3361-264Z"
  },
  {
    letter: "L",
    d: "M4195-110L4195 0L3699 0L3699-700L3829-700L3829-110L4195-110Z"
  }
]);
var PORTAL_INLINE_TRANSFORM = "matrix(0.078004 0 0 0.078004 421.295769 208.572631)";
var PORTAL_LOCKUP_VIEWBOX = "342.60933 149.18987 409.912753 64.1628";
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
//# sourceMappingURL=chunk-7ZOUXL3A.cjs.map