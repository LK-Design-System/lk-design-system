"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkTAUPYJRFcjs = require('./chunk-TAUPYJRF.cjs');


var _chunkK5VCZ7ECcjs = require('./chunk-K5VCZ7EC.cjs');

// components/layout/ShellPanel.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SHELL_PANEL_MAX_ACTIONS = 2;
var SHELL_PANEL_STYLES = `
  .lk-shell-panel__primary:active{background:var(--component-shell-panel-pressed-surface)!important;color:var(--_lds-shell-panel-pressed-foreground)!important}
  .lk-shell-panel__primary:focus-visible{outline-offset:-2px!important}
  @media(forced-colors:active){.lk-shell-panel__primary[aria-current="page"]{background:Highlight!important;color:HighlightText!important;background:SelectedItem!important;color:SelectedItemText!important}}
  @media(prefers-reduced-motion:reduce){.lk-shell-panel__primary{transition:none!important}}
`;
function isDevelopment() {
  const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
  return !(env && env.NODE_ENV === "production");
}
function ShellPanel({
  title,
  headingLevel = 2,
  actions,
  primaryAction,
  renderLink,
  children,
  scrollRegion,
  scrollRegionLabel,
  footer,
  titleId,
  className,
  style,
  ...rest
}) {
  const generatedId = _react2.default.useId().replace(/:/g, "");
  const resolvedTitleId = titleId || `lk-shell-panel-title-${generatedId}`;
  const [scrolled, setScrolled] = _react2.default.useState(false);
  const [primaryHovered, setPrimaryHovered] = _react2.default.useState(false);
  const actionList = _react2.default.Children.toArray(actions);
  const HeadingTag = `h${Math.min(6, Math.max(1, Number(headingLevel) || 2))}`;
  _react2.default.useEffect(() => {
    if (actionList.length <= SHELL_PANEL_MAX_ACTIONS || !isDevelopment()) return;
    console.warn(`ShellPanel: the header holds at most ${SHELL_PANEL_MAX_ACTIONS} actions; received ${actionList.length}. Move the rest into an overflow menu.`);
  }, [actionList.length]);
  const primary = primaryAction && typeof primaryAction === "object" && !_react2.default.isValidElement(primaryAction) ? primaryAction : null;
  const primaryCurrent = !!_optionalChain([primary, 'optionalAccess', _ => _.current]);
  const primaryStyle = primary && {
    "--_lds-shell-panel-pressed-foreground": primaryCurrent ? "var(--component-shell-panel-foreground)" : "var(--component-shell-panel-hover-foreground)",
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    width: "100%",
    minHeight: "var(--component-shell-panel-row-height)",
    padding: "0 var(--space-3)",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "var(--radius-lg)",
    background: primaryCurrent ? primaryHovered ? "var(--component-shell-panel-active-hover-surface)" : "var(--component-shell-panel-active-surface)" : primaryHovered ? "var(--component-shell-panel-hover-surface)" : "transparent",
    color: primaryCurrent || !primaryHovered ? "var(--component-shell-panel-foreground)" : "var(--component-shell-panel-hover-foreground)",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--label1-size)",
    lineHeight: "var(--label1-line)",
    fontWeight: primaryCurrent ? "var(--fw-bold)" : "var(--fw-medium)",
    textAlign: "start",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
  };
  let primaryControl = null;
  if (primary) {
    const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
      primary.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "icon", "aria-hidden": "true", style: { display: "inline-flex", flexShrink: 0 }, children: primary.icon }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: primary.label })
    ] });
    const common = {
      className: "lk-shell-panel__primary",
      "data-slot": "primaryAction",
      "aria-current": primaryCurrent ? "page" : void 0,
      onClick: primary.onClick,
      onMouseEnter: () => setPrimaryHovered(true),
      onMouseLeave: () => setPrimaryHovered(false),
      style: primaryStyle,
      children: content
    };
    if (primary.href != null) {
      const linkProps = { ...common, href: primary.href };
      primaryControl = renderLink ? renderLink(primary, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps });
    } else {
      primaryControl = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", ...common });
    }
  } else if (primaryAction != null) {
    primaryControl = primaryAction;
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkTAUPYJRFcjs.ShellPanelContext.Provider, { value: { titleId: resolvedTitleId }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-slot": "root",
      className: ["lk-shell-panel", className].filter(Boolean).join(" "),
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        background: "var(--component-shell-panel-surface)",
        borderInlineEnd: "1px solid var(--component-shell-panel-divider)",
        color: "var(--component-shell-panel-foreground)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: SHELL_PANEL_STYLES }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "header", style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0, minHeight: "var(--component-shell-panel-header-height)", padding: "0 var(--space-2) 0 var(--space-4)", boxSizing: "border-box" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { id: resolvedTitleId, style: { flex: "1 1 auto", minWidth: 0, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", color: "var(--component-shell-panel-foreground)" }, children: title }),
          actionList.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "actions", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", flexShrink: 0 }, children: actionList })
        ] }),
        primaryControl != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "primary", style: { flexShrink: 0, padding: "0 var(--space-2) var(--space-1)" }, children: primaryControl }),
        children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "fixed", style: { flexShrink: 0, padding: "0 var(--space-2)" }, children }),
        scrollRegion != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkK5VCZ7ECcjs.ScrollArea,
          {
            "data-slot": "scroll",
            "data-scroll-region": "",
            "data-scrolled": scrolled ? "true" : "false",
            label: _nullishCoalesce(scrollRegionLabel, () => ( (typeof title === "string" ? `${title} \uBAA9\uB85D` : void 0))),
            labelledBy: scrollRegionLabel == null && typeof title !== "string" ? resolvedTitleId : void 0,
            maxHeight: "none",
            scrollbar: "compact",
            gutter: "stable",
            onScroll: (event) => setScrolled(event.currentTarget.scrollTop > 0),
            style: {
              flex: "1 1 auto",
              minHeight: 0,
              padding: "var(--space-1) var(--space-2) var(--space-2)",
              boxSizing: "border-box",
              // The edge appears only while the region is scrolled, like an editor panel toolbar.
              borderTop: `1px solid ${scrolled ? "var(--component-shell-panel-divider)" : "transparent"}`
            },
            children: scrollRegion
          }
        ),
        footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "footer", style: { flexShrink: 0, padding: "var(--space-2)", borderTop: "1px solid var(--component-shell-panel-divider)" }, children: footer })
      ]
    }
  ) });
}



exports.ShellPanel = ShellPanel;
//# sourceMappingURL=chunk-6ZZSHYC3.cjs.map