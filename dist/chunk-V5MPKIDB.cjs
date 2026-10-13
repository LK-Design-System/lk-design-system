"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkSDTQJAYWcjs = require('./chunk-SDTQJAYW.cjs');


var _chunk4WXZPYJGcjs = require('./chunk-4WXZPYJG.cjs');

// components/overlay/Sheet.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var SHEET_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-sheet-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;
function sheetTransitionDuration(element) {
  const computed = _optionalChain([element, 'optionalAccess', _ => _.ownerDocument, 'optionalAccess', _2 => _2.defaultView, 'optionalAccess', _3 => _3.getComputedStyle, 'call', _4 => _4(element)]);
  if (!computed) return 0;
  const milliseconds = (value) => Number.parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1e3) || 0;
  const properties = computed.transitionProperty.split(",").map((value) => value.trim());
  const durations = computed.transitionDuration.split(",").map(milliseconds);
  const delays = computed.transitionDelay.split(",").map(milliseconds);
  return properties.reduce((longest, property, index) => property === "none" ? longest : Math.max(longest, durations[index % durations.length] + delays[index % delays.length]), 0);
}
function availableReturnTarget(element) {
  if (!_optionalChain([element, 'optionalAccess', _5 => _5.isConnected]) || typeof element.focus !== "function" || _optionalChain([element, 'access', _6 => _6.matches, 'optionalCall', _7 => _7(":disabled")])) return false;
  if (_optionalChain([element, 'access', _8 => _8.closest, 'optionalCall', _9 => _9('[hidden], [inert], [aria-hidden="true"]')])) return false;
  const computed = _optionalChain([element, 'access', _10 => _10.ownerDocument, 'optionalAccess', _11 => _11.defaultView, 'optionalAccess', _12 => _12.getComputedStyle, 'call', _13 => _13(element)]);
  return _optionalChain([computed, 'optionalAccess', _14 => _14.display]) !== "none" && _optionalChain([computed, 'optionalAccess', _15 => _15.visibility]) !== "hidden";
}
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
  withinPortal = true,
  portalTarget,
  zIndex,
  style,
  ...rest
}) {
  const [present, setPresent] = _react2.default.useState(open);
  const mounted = open || present;
  const [shown, setShown] = _react2.default.useState(false);
  const openRef = _react2.default.useRef(open);
  openRef.current = open;
  const titleId = _react2.default.useId();
  const portalRef = _react2.default.useRef(null);
  const portalAnchorRef = _react2.default.useRef(null);
  const wasOpenRef = _react2.default.useRef(false);
  if (open && (!wasOpenRef.current || !portalAnchorRef.current) && typeof document !== "undefined") {
    portalAnchorRef.current = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _16 => _16.current]), () => ( document.activeElement));
  }
  const { dialogRef, zIndex: resolvedZIndex } = _chunkSDTQJAYWcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
  });
  useSafeLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (open || !wasOpen || !restoreFocus) return;
    const ownerDocument = _optionalChain([dialogRef, 'access', _17 => _17.current, 'optionalAccess', _18 => _18.ownerDocument]);
    const active = _optionalChain([ownerDocument, 'optionalAccess', _19 => _19.activeElement]);
    const moved = active && active !== ownerDocument.body && !_optionalChain([dialogRef, 'access', _20 => _20.current, 'optionalAccess', _21 => _21.contains, 'call', _22 => _22(active)]);
    const target = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _23 => _23.current]), () => ( portalAnchorRef.current));
    if (!moved && availableReturnTarget(target)) target.focus({ preventScroll: true });
  }, [open, restoreFocus, returnFocusRef]);
  useSafeLayoutEffect(() => {
    const surface = dialogRef.current;
    const view = _optionalChain([surface, 'optionalAccess', _24 => _24.ownerDocument, 'optionalAccess', _25 => _25.defaultView]);
    if (!view) return void 0;
    const preference = _optionalChain([view, 'access', _26 => _26.matchMedia, 'optionalCall', _27 => _27("(prefers-reduced-motion: reduce)")]);
    let frame;
    let timer;
    const cancel = () => {
      if (frame != null) view.cancelAnimationFrame(frame);
      if (timer != null) view.clearTimeout(timer);
    };
    const settleReducedMotion = () => {
      if (!_optionalChain([preference, 'optionalAccess', _28 => _28.matches])) return;
      cancel();
      setShown(openRef.current);
      if (!openRef.current) setPresent(false);
    };
    if (open) {
      setPresent(true);
      if (_optionalChain([preference, 'optionalAccess', _29 => _29.matches])) setShown(true);
      else {
        surface.getBoundingClientRect();
        frame = view.requestAnimationFrame(() => setShown(true));
      }
    } else {
      setShown(false);
      const duration = _optionalChain([preference, 'optionalAccess', _30 => _30.matches]) ? 0 : sheetTransitionDuration(surface);
      if (duration <= 0) setPresent(false);
      else timer = view.setTimeout(() => {
        if (!openRef.current) setPresent(false);
      }, Math.ceil(duration) + 50);
    }
    _optionalChain([preference, 'optionalAccess', _31 => _31.addEventListener, 'optionalCall', _32 => _32("change", settleReducedMotion)]);
    return () => {
      cancel();
      _optionalChain([preference, 'optionalAccess', _33 => _33.removeEventListener, 'optionalCall', _34 => _34("change", settleReducedMotion)]);
    };
  }, [open, present]);
  _react2.default.useEffect(() => {
    if (!mounted) portalAnchorRef.current = null;
  }, [mounted]);
  if (!mounted) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk4WXZPYJGcjs.OverlayPortal, { open: mounted, interactionOpen: open, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: SHEET_MOTION_STYLES }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        role: "presentation",
        "data-lds-sheet-motion": "",
        onClick: open && closeOnScrim ? (e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        } : void 0,
        style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)", pointerEvents: open ? void 0 : "none" },
        children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            ref: dialogRef,
            role: "dialog",
            "aria-labelledby": title != null ? titleId : void 0,
            "aria-label": title == null ? ariaLabel : void 0,
            tabIndex: -1,
            style: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "88vh", height, display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderTopLeftRadius: "var(--radius-3xl)", borderTopRightRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : "translateY(100%)", transition: "transform var(--dur-slow) var(--ease-out)", ...style },
            ...rest,
            "data-lds-sheet-motion": "",
            "aria-modal": open ? "true" : void 0,
            "aria-hidden": open ? void 0 : true,
            inert: open ? void 0 : INERT_VALUE,
            onTransitionEnd: (event) => {
              _optionalChain([rest, 'access', _35 => _35.onTransitionEnd, 'optionalCall', _36 => _36(event)]);
              if (!openRef.current && event.target === event.currentTarget && event.propertyName === "transform") setPresent(false);
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", justifyContent: "center", paddingTop: "var(--space-2-5)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 40, height: 4, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-interaction-inactive)" } }) }),
              title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { padding: "14px 22px 4px", fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { flex: 1, padding: "14px 22px", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }),
              footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "14px 22px 22px", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
            ]
          }
        )
      }
    )
  ] });
}



exports.Sheet = Sheet;
//# sourceMappingURL=chunk-V5MPKIDB.cjs.map