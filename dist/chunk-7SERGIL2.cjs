"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/data/Carousel.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function navBtnStyle(side) {
  return { position: "absolute", top: "50%", [side]: 12, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--scrim-dark)", color: "var(--color-semantic-static-white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 };
}
function Carousel({ slides = [], showDots = true, showArrows = true, style, ...rest }) {
  const [i, setI] = _react2.default.useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", overflow: "hidden", borderRadius: "var(--radius-2xl)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-slow) var(--ease-out)" }, children: slides.map((s, idx) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flex: "0 0 100%", minWidth: "100%" }, children: s }, idx)) }),
    showArrows && n > 1 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "previous", onClick: () => go(-1), style: navBtnStyle("left"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-left", size: 20, "aria-hidden": "true" }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "next", onClick: () => go(1), style: navBtnStyle("right"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right", size: 20, "aria-hidden": "true" }) })
    ] }),
    showDots && n > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 2 }, children: slides.map((_, idx) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": `slide ${idx + 1}`, onClick: () => setI(idx), style: { width: idx === i ? 22 : 8, height: 8, borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", padding: 0, background: idx === i ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-inverse-label-alternative-soft)", transition: "width var(--dur-base) var(--ease-out)" } }, idx)) })
  ] });
}



exports.Carousel = Carousel;
//# sourceMappingURL=chunk-7SERGIL2.cjs.map