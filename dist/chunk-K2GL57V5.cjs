"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkSDHSC2JCcjs = require('./chunk-SDHSC2JC.cjs');

// components/overlay/Sheet.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Sheet({
  open = false,
  title,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  height,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uD558\uB2E8 \uC2DC\uD2B8",
  style,
  ...rest
}) {
  const [shown, setShown] = _react2.default.useState(false);
  const titleId = _react2.default.useId();
  const { dialogRef, zIndex } = _chunkSDHSC2JCcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus
  });
  _react2.default.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    return void 0;
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex, background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "div",
        {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          tabIndex: -1,
          style: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "88vh", height, display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderTopLeftRadius: "var(--radius-3xl)", borderTopRightRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : "translateY(100%)", transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", justifyContent: "center", paddingTop: 10 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 40, height: 4, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-interaction-inactive)" } }) }),
            title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { padding: "14px 22px 4px", fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flex: 1, padding: "14px 22px", overflow: "auto", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "14px 22px 22px", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
          ]
        }
      )
    }
  );
}



exports.Sheet = Sheet;
//# sourceMappingURL=chunk-K2GL57V5.cjs.map