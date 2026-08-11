"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";






var _chunkEMF5W2XWcjs = require('./chunk-EMF5W2XW.cjs');



var _chunkDDFGJXVMcjs = require('./chunk-DDFGJXVM.cjs');

// components/brand/ProductLockup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/brand/lk-product-lockup-paths.js
var CONSOLE_PATHS = Object.freeze([
  Object.freeze({ letter: "C", d: "M419 14Q309 14 221.500-32.500Q134-79 84-162Q34-245 34-350L34-350Q34-455 84-538Q134-621 221.500-667.500Q309-714 419-714L419-714Q515-714 592-680Q669-646 720-582L720-582L594-468Q526-550 429-550L429-550Q372-550 327.500-525Q283-500 258.500-454.500Q234-409 234-350L234-350Q234-291 258.500-245.500Q283-200 327.500-175Q372-150 429-150L429-150Q526-150 594-232L594-232L720-118Q669-54 592-20Q515 14 419 14L419 14Z" }),
  Object.freeze({ letter: "O", d: "M1146 14Q1035 14 946.500-33Q858-80 807.500-163Q757-246 757-350L757-350Q757-454 807.500-537Q858-620 946.500-667Q1035-714 1146-714L1146-714Q1257-714 1345.500-667Q1434-620 1484.500-537Q1535-454 1535-350L1535-350Q1535-246 1484.500-163Q1434-80 1345.500-33Q1257 14 1146 14L1146 14ZM1146-150Q1199-150 1242-175Q1285-200 1310-245.500Q1335-291 1335-350L1335-350Q1335-409 1310-454.500Q1285-500 1242-525Q1199-550 1146-550L1146-550Q1093-550 1050-525Q1007-500 982-454.500Q957-409 957-350L957-350Q957-291 982-245.500Q1007-200 1050-175Q1093-150 1146-150L1146-150Z" }),
  Object.freeze({ letter: "N", d: "M1802-700L2111-327L2111-700L2305-700L2305 0L2142 0L1833-373L1833 0L1639 0L1639-700L1802-700Z" }),
  Object.freeze({ letter: "S", d: "M2691 14Q2606 14 2526-7Q2446-28 2396-63L2396-63L2461-209Q2508-178 2570-159Q2632-140 2692-140L2692-140Q2806-140 2806-197L2806-197Q2806-227 2773.500-241.500Q2741-256 2669-272L2669-272Q2590-289 2537-308.500Q2484-328 2446-371Q2408-414 2408-487L2408-487Q2408-551 2443-602.500Q2478-654 2547.500-684Q2617-714 2718-714L2718-714Q2787-714 2854-698.500Q2921-683 2972-653L2972-653L2911-506Q2811-560 2717-560L2717-560Q2658-560 2631-542.500Q2604-525 2604-497L2604-497Q2604-469 2636-455Q2668-441 2739-426L2739-426Q2819-409 2871.500-389.500Q2924-370 2962.500-327.500Q3001-285 3001-212L3001-212Q3001-149 2966-98Q2931-47 2861-16.500Q2791 14 2691 14L2691 14Z" }),
  Object.freeze({ letter: "O", d: "M3445 14Q3334 14 3245.500-33Q3157-80 3106.500-163Q3056-246 3056-350L3056-350Q3056-454 3106.500-537Q3157-620 3245.500-667Q3334-714 3445-714L3445-714Q3556-714 3644.500-667Q3733-620 3783.500-537Q3834-454 3834-350L3834-350Q3834-246 3783.500-163Q3733-80 3644.500-33Q3556 14 3445 14L3445 14ZM3445-150Q3498-150 3541-175Q3584-200 3609-245.500Q3634-291 3634-350L3634-350Q3634-409 3609-454.500Q3584-500 3541-525Q3498-550 3445-550L3445-550Q3392-550 3349-525Q3306-500 3281-454.500Q3256-409 3256-350L3256-350Q3256-291 3281-245.500Q3306-200 3349-175Q3392-150 3445-150L3445-150Z" }),
  Object.freeze({ letter: "L", d: "M4470-157L4470 0L3938 0L3938-700L4136-700L4136-157L4470-157Z" }),
  Object.freeze({ letter: "E", d: "M5055-281L4744-281L4744-153L5110-153L5110 0L4548 0L4548-700L5097-700L5097-547L4744-547L4744-429L5055-429L5055-281Z" })
]);
var PRODUCT_LOCKUP_REGISTRY = Object.freeze({
  "console": Object.freeze({
    label: "Console",
    wordmark: "CONSOLE",
    paths: CONSOLE_PATHS,
    transform: "matrix(0.077147 0 0 0.077147 426.005147 208.272616)",
    viewBox: "342.60933 149.18987 481.61547 64.1628",
    minimumRenderedHeightPx: 20,
    minimumRequiredSlotWidthPx: 150.122959
  }),
  "portal": Object.freeze({
    label: "Portal",
    wordmark: "PORTAL",
    paths: _chunkEMF5W2XWcjs.PORTAL_PATHS,
    transform: _chunkEMF5W2XWcjs.PORTAL_INLINE_TRANSFORM,
    viewBox: _chunkEMF5W2XWcjs.PORTAL_LOCKUP_VIEWBOX,
    minimumRenderedHeightPx: _chunkEMF5W2XWcjs.PORTAL_MINIMUM_RENDERED_HEIGHT_PX,
    minimumRequiredSlotWidthPx: 129.803096
  })
});
var PRODUCT_LOCKUP_KEYS = Object.freeze(Object.keys(PRODUCT_LOCKUP_REGISTRY));

// components/brand/ProductLockup.jsx
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_HEIGHT = 28;
function ProductLockup({
  product,
  appearance = "positive",
  height,
  compact = false,
  decorative = false,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const entry = PRODUCT_LOCKUP_REGISTRY[product];
  if (!entry) {
    throw new TypeError(`Unsupported ProductLockup product ${JSON.stringify(product)}. Use an approved registry key.`);
  }
  const resolvedTone = appearance === "reverse" ? "white" : "ink";
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT;
  const renderedHeight = Math.max(requestedHeight, entry.minimumRenderedHeightPx);
  const accessibleName = _nullishCoalesce(ariaLabel, () => ( `LK ${entry.label}`));
  if (compact) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkEMF5W2XWcjs.Lockup,
      {
        ...rest,
        role: decorative ? void 0 : "img",
        "aria-label": decorative ? void 0 : accessibleName,
        "aria-hidden": decorative ? true : void 0,
        "data-product-lockup": "",
        "data-product-lockup-product": product,
        "data-product-lockup-mode": "compact",
        variant: "mark",
        tone: resolvedTone,
        height: renderedHeight,
        title: accessibleName,
        decorative,
        style
      }
    );
  }
  const [, , viewBoxWidth, viewBoxHeight] = entry.viewBox.split(/\s+/).map(Number);
  const intrinsicWidth = Number((renderedHeight * viewBoxWidth / viewBoxHeight).toFixed(6));
  const fill = resolvedTone === "white" ? _chunkDDFGJXVMcjs.LK_LOGO_COLORS.white : _chunkDDFGJXVMcjs.LK_LOGO_COLORS.navy;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": accessibleName };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "svg",
    {
      ...rest,
      viewBox: entry.viewBox,
      width: intrinsicWidth,
      height: renderedHeight,
      preserveAspectRatio: "xMidYMid meet",
      "data-product-lockup": "",
      "data-product-lockup-product": product,
      "data-product-lockup-mode": "full",
      "data-product-lockup-wordmark": entry.wordmark,
      ...a11y,
      style: { display: "block", maxWidth: "100%", height: "auto", ...style },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { fill, fillRule: "nonzero", children: [
        _chunkDDFGJXVMcjs.LK_PATHS.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d, transform: path.transform }, `lk-${index}`)),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: entry.transform, "data-product-lockup-wordmark-paths": "", children: entry.paths.map((path, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: path.d }, `${path.letter}-${index}`)) })
      ] })
    }
  );
}



exports.ProductLockup = ProductLockup;
//# sourceMappingURL=chunk-UP5PHDKV.cjs.map