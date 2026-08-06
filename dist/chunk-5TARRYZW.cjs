"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk2HYMUCSDcjs = require('./chunk-2HYMUCSD.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunkENN7YVH5cjs = require('./chunk-ENN7YVH5.cjs');


var _chunkF4O2CAUIcjs = require('./chunk-F4O2CAUI.cjs');


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/overlay/Modal.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var Modal = _react2.default.forwardRef(function Modal2({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  children,
  footer,
  onClose,
  width = 520,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uBAA8\uB2EC",
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = _chunkENN7YVH5cjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const portalRef = _react2.default.useRef(null);
  const portalAnchorRef = _react2.default.useRef(null);
  if (visible && !portalAnchorRef.current && typeof document !== "undefined") {
    portalAnchorRef.current = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _ => _.current]), () => ( document.activeElement));
  }
  if (!visible) portalAnchorRef.current = null;
  const requestClose = _react2.default.useCallback(() => {
    _optionalChain([onClose, 'optionalCall', _2 => _2()]);
    setVisible(false);
  }, [onClose, setVisible]);
  const { dialogRef, zIndex: resolvedZIndex } = _chunk2HYMUCSDcjs.useDialogFocus.call(void 0, {
    open: visible,
    onDismiss: requestClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
  });
  const mergedDialogRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, dialogRef, forwardedRef);
  if (!visible) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF4O2CAUIcjs.OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      "data-slot": "backdrop",
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "backdrop") || void 0,
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget) requestClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "backdrop") },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "div",
        {
          ref: mergedDialogRef,
          "data-slot": "root",
          "data-open": "true",
          className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          "aria-describedby": children != null ? descriptionId : void 0,
          tabIndex: -1,
          style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-modal-"), width: "100%", maxWidth: `var(--lds-modal-width, ${typeof width === "number" ? `${width}px` : width})`, maxHeight: "var(--lds-modal-max-height, 86vh)", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--lds-modal-radius, var(--component-dialog-radius))", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", overflow: "hidden", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
          ...rest,
          children: [
            (title != null || onClose || onOpenChange || open === void 0) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "header", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "header") || void 0, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "header") }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "title", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "title") || void 0, id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "title") }, children: title }),
              (onClose || onOpenChange || open === void 0) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "close", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "close") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "close"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { size: "sm", variant: "plain", label: "\uB2EB\uAE30", onClick: requestClose, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: "close", size: 20, "aria-hidden": "true" }) }) })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "body", id: descriptionId, className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "body", "lk-scroll-surface") || void 0, "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { padding: "var(--space-5) var(--space-6)", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "body") }, children }),
            footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "footer", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "footer") || void 0, style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "footer") }, children: footer })
          ]
        }
      )
    }
  ) });
});



exports.Modal = Modal;
//# sourceMappingURL=chunk-5TARRYZW.cjs.map