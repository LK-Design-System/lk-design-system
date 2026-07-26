"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";









var _chunkNKOFS67Fcjs = require('./chunk-NKOFS67F.cjs');

// components/status/Spinner.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var LK_LETTERS = _chunkNKOFS67Fcjs.joinLetters.call(void 0, _chunkNKOFS67Fcjs.splitSubpaths.call(void 0, _chunkNKOFS67Fcjs.LK_D), _chunkNKOFS67Fcjs.LK_LETTER_GROUPS);
var ROBO_LETTERS = _chunkNKOFS67Fcjs.joinLetters.call(void 0, _chunkNKOFS67Fcjs.splitSubpaths.call(void 0, _chunkNKOFS67Fcjs.ROBO_D), _chunkNKOFS67Fcjs.ROBO_LETTER_GROUPS);
var BRAND_LETTER_COUNT = LK_LETTERS.length + ROBO_LETTERS.length;
var brandDelay = (order) => (BRAND_LETTER_COUNT > 1 ? order / (BRAND_LETTER_COUNT - 1) * 0.55 : 0).toFixed(3);
function useKeyframes(id, css) {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function Spinner({ size, thickness, color = "var(--color-semantic-primary-normal)", label, variant = "circular", style, ...rest }) {
  useKeyframes("lk-spin-kf", "@keyframes lk-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-spinner-ring]{animation:none!important}}");
  useKeyframes("lk-brand-wave-kf", "@keyframes lk-brand-wave-lk{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(300px)}}@keyframes lk-brand-wave-robo{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(77px)}}@media (prefers-reduced-motion: reduce){[data-wave]{animation:none!important}}");
  const resolvedSize = _nullishCoalesce(size, () => ( (variant === "brand" ? 22 : 28)));
  if (variant === "brand") {
    const mark = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: _chunkNKOFS67Fcjs.LK_LOGO_VIEWBOX.inline, height: resolvedSize, "aria-hidden": "true", style: { display: "block", overflow: "visible" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { transform: "translate(0,504) scale(0.1,-0.1)", fill: "var(--color-semantic-label-normal)", children: [
      LK_LETTERS.map((d, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { "data-wave": true, d, fillRule: "evenodd", style: { animation: `lk-brand-wave-lk 1.15s ease-in-out ${brandDelay(i)}s infinite` } }, `lk${i}`)),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { transform: _chunkNKOFS67Fcjs.ROBO_INLINE, children: ROBO_LETTERS.map((d, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { "data-wave": true, d, fillRule: "evenodd", style: { animation: `lk-brand-wave-robo 1.15s ease-in-out ${brandDelay(LK_LETTERS.length + i)}s infinite` } }, `ro${i}`)) })
    ] }) });
    const ariaLabel = typeof label === "string" && label ? label : "\uBD88\uB7EC\uC624\uB294 \uC911";
    if (label == null) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "status", "aria-label": ariaLabel, "aria-live": "polite", style: { display: "inline-flex", ...style }, ...rest, children: mark });
    }
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { role: "status", "aria-live": "polite", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "inherit", ...style }, ...rest, children: [
      mark,
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: label })
    ] });
  }
  const t = thickness || Math.max(2, Math.round(resolvedSize / 10));
  const ring = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      "data-lds-spinner-ring": true,
      style: {
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: "50%",
        boxSizing: "border-box",
        border: `${t}px solid var(--color-semantic-fill-strong)`,
        borderTopColor: color,
        animation: "lk-spin 0.7s linear infinite",
        flexShrink: 0
      }
    }
  );
  if (label == null) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "status", "aria-label": "\uBD88\uB7EC\uC624\uB294 \uC911", "aria-live": "polite", style: { display: "inline-flex", ...style }, ...rest, children: ring });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { role: "status", "aria-live": "polite", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "inherit", ...style }, ...rest, children: [
    ring,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: label })
  ] });
}



exports.Spinner = Spinner;
//# sourceMappingURL=chunk-MZLV6E4I.cjs.map