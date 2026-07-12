"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkSDHSC2JCcjs = require('./chunk-SDHSC2JC.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/overlay/Lightbox.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function lbArrow(side) {
  return { position: "absolute", [side]: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "var(--material-control-dimmer)", color: "var(--color-semantic-inverse-label)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
}
function Lightbox({
  open = false,
  images = [],
  index = 0,
  onClose,
  onIndexChange,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC774\uBBF8\uC9C0 \uBDF0\uC5B4",
  style,
  ...rest
}) {
  const [i, setI] = _react2.default.useState(index);
  const closeFocusRef = _react2.default.useRef(null);
  const { dialogRef, zIndex } = _chunkSDHSC2JCcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: onClose,
    initialFocusRef: _nullishCoalesce(initialFocusRef, () => ( closeFocusRef)),
    returnFocusRef,
    restoreFocus
  });
  _react2.default.useEffect(() => {
    setI(index);
  }, [index]);
  const go = _react2.default.useCallback((d) => {
    setI((prev) => {
      const n = (prev + d + images.length) % images.length;
      onIndexChange && onIndexChange(n);
      return n;
    });
  }, [images.length, onIndexChange]);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go]);
  if (!open) return null;
  const src = images[i];
  const url = typeof src === "string" ? src : src && src.src;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LightboxStage, { url, alt: src && src.alt || "", count: images.length, go, onClose, closeFocusRef, dialogRef, zIndex, ariaLabel, style, rest }, "stage");
}
function LightboxStage({ url, alt, count, go, onClose, closeFocusRef, dialogRef, zIndex, ariaLabel, style, rest }) {
  const [loaded, setLoaded] = _react2.default.useState(false);
  const imgRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [url]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-label": ariaLabel, tabIndex: -1, onClick: (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { ref: closeFocusRef, type: "button", "aria-label": "\uB2EB\uAE30", onClick: onClose, style: { position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "none", background: "var(--color-semantic-inverse-fill-normal)", color: "var(--color-semantic-inverse-label)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 22, "aria-hidden": "true" }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: loaded ? 0 : 280, minHeight: loaded ? 0 : 200 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { ref: imgRef, src: url, alt, onLoad: () => setLoaded(true), style: { display: "block", maxWidth: "86vw", maxHeight: "86vh", borderRadius: "var(--radius-lg)", boxShadow: loaded ? "var(--shadow-xl)" : "none", opacity: loaded ? 1 : 0, transition: "opacity .18s ease" } }),
      !loaded && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", display: "inline-flex" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "var(--color-semantic-inverse-icon-muted)", strokeWidth: "2.4", strokeLinecap: "round", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12 2a10 10 0 1 0 10 10", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "animateTransform", { attributeName: "transform", type: "rotate", from: "0 12 12", to: "360 12 12", dur: "0.8s", repeatCount: "indefinite" }) }) }) }),
      loaded && count > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "previous", onClick: () => go(-1), style: lbArrow("left"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-left", size: 26, "aria-hidden": "true" }) }),
      loaded && count > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "next", onClick: () => go(1), style: lbArrow("right"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right", size: 26, "aria-hidden": "true" }) })
    ] })
  ] });
}



exports.Lightbox = Lightbox;
//# sourceMappingURL=chunk-QQFLWZVU.cjs.map