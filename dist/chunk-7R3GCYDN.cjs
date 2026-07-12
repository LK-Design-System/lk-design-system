"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkSDHSC2JCcjs = require('./chunk-SDHSC2JC.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/overlay/Drawer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Drawer({
  open = false,
  side = "right",
  width = 380,
  title,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC11C\uB78D \uD328\uB110",
  closeLabel = "\uB2EB\uAE30",
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
  const isRight = side === "right";
  const hidden = isRight ? "translateX(100%)" : "translateX(-100%)";
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
          style: { position: "absolute", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0, width, maxWidth: "92vw", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : hidden, transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            (title != null || onClose) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { flex: 1, minWidth: 0, fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
              onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": closeLabel, onClick: onClose, style: { display: "inline-flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-semantic-label-assistive)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 20, "aria-hidden": "true" }) })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flex: 1, padding: "var(--space-5) var(--space-6)", overflow: "auto", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
          ]
        }
      )
    }
  );
}



exports.Drawer = Drawer;
//# sourceMappingURL=chunk-7R3GCYDN.cjs.map