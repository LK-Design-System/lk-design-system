"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkSDTQJAYWcjs = require('./chunk-SDTQJAYW.cjs');


var _chunk6GVVQEMRcjs = require('./chunk-6GVVQEMR.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkLRPJVRUDcjs = require('./chunk-LRPJVRUD.cjs');




var _chunk4WXZPYJGcjs = require('./chunk-4WXZPYJG.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/overlay/Modal.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function availableReturnTarget(element) {
  if (!_optionalChain([element, 'optionalAccess', _ => _.isConnected]) || typeof element.focus !== "function" || _optionalChain([element, 'access', _2 => _2.matches, 'optionalCall', _3 => _3(":disabled")])) return false;
  if (_optionalChain([element, 'access', _4 => _4.closest, 'optionalCall', _5 => _5('[hidden], [inert], [aria-hidden="true"]')])) return false;
  const computed = _optionalChain([element, 'access', _6 => _6.ownerDocument, 'optionalAccess', _7 => _7.defaultView, 'optionalAccess', _8 => _8.getComputedStyle, 'call', _9 => _9(element)]);
  return _optionalChain([computed, 'optionalAccess', _10 => _10.display]) !== "none" && _optionalChain([computed, 'optionalAccess', _11 => _11.visibility]) !== "hidden";
}
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
  const [visible, setVisible] = _chunk6GVVQEMRcjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const portalRef = _react2.default.useRef(null);
  const portalAnchorRef = _react2.default.useRef(null);
  const wasOpenRef = _react2.default.useRef(false);
  if (visible && (!wasOpenRef.current || !portalAnchorRef.current) && typeof document !== "undefined") {
    portalAnchorRef.current = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _12 => _12.current]), () => ( document.activeElement));
  }
  const requestClose = _react2.default.useCallback(() => {
    _optionalChain([onClose, 'optionalCall', _13 => _13()]);
    setVisible(false);
  }, [onClose, setVisible]);
  const { dialogRef, zIndex: resolvedZIndex } = _chunkSDTQJAYWcjs.useDialogFocus.call(void 0, {
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
  useSafeLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = visible;
    if (visible || !wasOpen || !restoreFocus) return;
    const ownerDocument = _optionalChain([dialogRef, 'access', _14 => _14.current, 'optionalAccess', _15 => _15.ownerDocument]);
    const active = _optionalChain([ownerDocument, 'optionalAccess', _16 => _16.activeElement]);
    const moved = active && active !== ownerDocument.body && !_optionalChain([dialogRef, 'access', _17 => _17.current, 'optionalAccess', _18 => _18.contains, 'call', _19 => _19(active)]);
    const target = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _20 => _20.current]), () => ( portalAnchorRef.current));
    if (!moved && availableReturnTarget(target)) target.focus({ preventScroll: true });
  }, [visible, restoreFocus, returnFocusRef]);
  const { mounted, shown, onTransitionEnd } = _chunk4WXZPYJGcjs.useOverlayPresence.call(void 0, visible, dialogRef);
  _react2.default.useEffect(() => {
    if (!mounted) portalAnchorRef.current = null;
  }, [mounted]);
  if (!mounted) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk4WXZPYJGcjs.OverlayPortal, { open: mounted, interactionOpen: visible, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: _chunk4WXZPYJGcjs.OVERLAY_MOTION_STYLES }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        "data-slot": "backdrop",
        "data-lds-overlay-motion": "",
        className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "backdrop") || void 0,
        role: "presentation",
        onClick: visible && closeOnScrim ? (e) => {
          if (e.target === e.currentTarget) requestClose();
        } : void 0,
        style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "backdrop"), ...visible ? {} : { pointerEvents: "none" } },
        children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            ref: mergedDialogRef,
            "data-slot": "root",
            "data-open": visible ? "true" : void 0,
            "data-lds-overlay-motion": "",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
            role: "dialog",
            "aria-labelledby": title != null ? titleId : void 0,
            "aria-label": title == null ? ariaLabel : void 0,
            "aria-describedby": children != null ? descriptionId : void 0,
            tabIndex: -1,
            style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-modal-"), width: "100%", maxWidth: `var(--lds-modal-width, ${typeof width === "number" ? `${width}px` : width})`, maxHeight: "var(--lds-modal-max-height, 86vh)", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--lds-modal-radius, var(--component-dialog-radius))", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", overflow: "hidden", transform: shown ? "none" : "translateY(var(--space-2))", transition: "transform var(--dur-base) var(--ease-out)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
            ...rest,
            "aria-modal": visible ? "true" : void 0,
            "aria-hidden": visible ? void 0 : true,
            inert: visible ? void 0 : INERT_VALUE,
            onTransitionEnd: (event) => {
              _optionalChain([rest, 'access', _21 => _21.onTransitionEnd, 'optionalCall', _22 => _22(event)]);
              onTransitionEnd(event);
            },
            children: [
              (title != null || onClose || onOpenChange || open === void 0) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "header", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "header") || void 0, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "header") }, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "title", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "title") || void 0, id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "title") }, children: title }),
                (onClose || onOpenChange || open === void 0) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "close", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "close") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "close"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLRPJVRUDcjs.IconButton, { size: "sm", variant: "plain", label: "\uB2EB\uAE30", onClick: requestClose, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "close", size: 20, "aria-hidden": "true" }) }) })
              ] }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "body", id: descriptionId, className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "body", "lk-scroll-surface") || void 0, "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { padding: "var(--space-5) var(--space-6)", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "body") }, children }),
              footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "footer", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "footer") || void 0, style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "footer") }, children: footer })
            ]
          }
        )
      }
    )
  ] });
});



exports.Modal = Modal;
//# sourceMappingURL=chunk-OV7WT6UC.cjs.map