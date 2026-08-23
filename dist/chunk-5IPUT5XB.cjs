"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkZVWV2EZGcjs = require('./chunk-ZVWV2EZG.cjs');



var _chunkZAM5AMCOcjs = require('./chunk-ZAM5AMCO.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunkXGKLO45Tcjs = require('./chunk-XGKLO45T.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/overlay/Drawer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DRAWER_APPEARANCES = {
  default: {
    surface: "var(--color-semantic-background-elevated-normal)",
    divider: "var(--color-semantic-line-solid-normal)",
    title: "var(--color-semantic-label-normal)",
    body: "var(--color-semantic-label-neutral)",
    closeVariant: "plain"
  },
  brand: {
    surface: "var(--color-semantic-brand-surface)",
    divider: "var(--color-semantic-brand-on-surface-border)",
    title: "var(--color-semantic-brand-on-surface)",
    body: "var(--color-semantic-brand-on-surface-muted)",
    closeVariant: "on-dark"
  }
};
function Drawer({
  open = false,
  side = "right",
  width = 380,
  appearance = "default",
  density = "comfortable",
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
  withinPortal = true,
  portalTarget,
  zIndex,
  bodyStyle,
  style,
  ...rest
}) {
  const tones = DRAWER_APPEARANCES[appearance] || DRAWER_APPEARANCES.default;
  const [shown, setShown] = _react2.default.useState(false);
  const titleId = _react2.default.useId();
  const subtitleId = _react2.default.useId();
  const portalRef = _react2.default.useRef(null);
  const portalAnchorRef = _react2.default.useRef(null);
  if (open && !portalAnchorRef.current && typeof document !== "undefined") {
    portalAnchorRef.current = _nullishCoalesce(_optionalChain([returnFocusRef, 'optionalAccess', _ => _.current]), () => ( document.activeElement));
  }
  if (!open) portalAnchorRef.current = null;
  const { dialogRef, zIndex: resolvedZIndex } = _chunkZVWV2EZGcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
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
  const isCompact = density === "compact";
  const resolvedDensity = isCompact ? "compact" : "comfortable";
  const hidden = isRight ? "translateX(100%)" : "translateX(-100%)";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXGKLO45Tcjs.OverlayPortal, { open, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
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
          style: { position: "absolute", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0, width, maxWidth: "92vw", display: "flex", flexDirection: "column", background: tones.surface, boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : hidden, transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          "data-density": resolvedDensity,
          children: [
            (title != null || subtitle != null || onClose) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: isCompact ? "var(--component-drawer-header-padding-compact, var(--space-4) var(--space-5))" : "var(--component-drawer-header-padding-comfortable, var(--space-5) var(--space-6))", borderBottom: `1px solid ${tones.divider}` }, children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0, display: "grid", gap: "var(--space-1)" }, children: [
                title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: tones.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
                subtitle != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: subtitleId, style: { color: tones.body, fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", overflowWrap: "anywhere" }, children: subtitle })
              ] }),
              onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { size: "sm", variant: tones.closeVariant, label: closeLabel, onClick: onClose, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "close", size: 20, "aria-hidden": "true" }) })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { flex: 1, padding: isCompact ? "var(--component-drawer-body-padding-compact, var(--space-4) var(--space-5))" : "var(--component-drawer-body-padding-comfortable, var(--space-5) var(--space-6))", overflow: "auto", scrollbarGutter: "stable", fontSize: isCompact ? "var(--label1-size)" : "var(--body2-size)", lineHeight: isCompact ? "var(--label1-line)" : 1.7, letterSpacing: isCompact ? "var(--label1-spacing)" : void 0, color: tones.body, wordBreak: "keep-all", ...bodyStyle }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkZAM5AMCOcjs.ComponentDensityScope, { density: resolvedDensity, children }) }),
            footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: isCompact ? "var(--component-drawer-footer-padding-compact, var(--space-3) var(--space-5))" : "var(--component-drawer-footer-padding-comfortable, var(--space-4) var(--space-6))", borderTop: `1px solid ${tones.divider}`, display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
          ]
        }
      )
    }
  ) });
}
function DrawerSection({
  title,
  description,
  headingLevel = 3,
  actions,
  divider = false,
  children,
  headerStyle,
  contentStyle,
  style,
  ...rest
}) {
  const density = _chunkZAM5AMCOcjs.useResolvedDensity.call(void 0, void 0, "comfortable");
  const compact = density === "compact";
  const titleId = _react2.default.useId();
  const Heading = `h${headingLevel}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "section",
    {
      ...rest,
      "aria-labelledby": titleId,
      "data-density": density,
      style: {
        minWidth: 0,
        borderTop: divider ? "1px solid var(--color-semantic-line-solid-alternative)" : void 0,
        paddingTop: divider ? compact ? "var(--space-4)" : "var(--space-6)" : void 0,
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: compact ? "var(--space-2)" : "var(--space-3)", ...headerStyle }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: { margin: 0, fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-strong)", wordBreak: "keep-all" }, children: title }),
            description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: "var(--space-1)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }, children: actions })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0, ...contentStyle }, children })
      ]
    }
  );
}




exports.Drawer = Drawer; exports.DrawerSection = DrawerSection;
//# sourceMappingURL=chunk-5IPUT5XB.cjs.map