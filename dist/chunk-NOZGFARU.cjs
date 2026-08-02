"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkF525T53Pcjs = require('./chunk-F525T53P.cjs');


var _chunkITIFTVTBcjs = require('./chunk-ITIFTVTB.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/overlay/Drawer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Drawer({
  open = false,
  side = "right",
  width = 380,
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC11C\uB78D \uD328\uB110",
  closeLabel = "\uB2EB\uAE30",
  bodyStyle,
  style,
  ...rest
}) {
  const [shown, setShown] = _react2.default.useState(false);
  const titleId = _react2.default.useId();
  const subtitleId = _react2.default.useId();
  const { dialogRef, zIndex } = _chunkF525T53Pcjs.useDialogFocus.call(void 0, {
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
          "aria-describedby": subtitle != null ? subtitleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          tabIndex: -1,
          style: { position: "absolute", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0, width, maxWidth: "92vw", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : hidden, transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            (title != null || subtitle != null || onClose) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0, display: "grid", gap: "var(--space-1)" }, children: [
                title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
                subtitle != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: subtitleId, style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", overflowWrap: "anywhere" }, children: subtitle })
              ] }),
              onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkITIFTVTBcjs.IconButton, { size: "sm", variant: "plain", label: closeLabel, onClick: onClose, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "close", size: 20, "aria-hidden": "true" }) })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { flex: 1, padding: "var(--space-5) var(--space-6)", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all", ...bodyStyle }, children }),
            footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
          ]
        }
      )
    }
  );
}



exports.Drawer = Drawer;
//# sourceMappingURL=chunk-NOZGFARU.cjs.map