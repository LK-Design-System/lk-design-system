"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkWESPBUC7cjs = require('./chunk-WESPBUC7.cjs');

// components/layout/DashboardShell.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var inertWhen = (isInert) => isInert ? INERT_VALUE : void 0;
var DASHBOARD_SHELL_STYLES = `
.lk-dashboard-shell{
  display:grid;
  grid-template-columns:auto minmax(0,1fr);
  grid-template-rows:auto minmax(0,1fr);
}
.lk-dashboard-shell__skip{
  position:fixed;
  inset-block-start:var(--space-3);
  inset-inline-start:var(--space-3);
  z-index:1000;
  display:inline-flex;
  align-items:center;
  min-height:var(--control-h-sm);
  padding:0 var(--space-3);
  border:2px solid var(--color-semantic-primary-normal);
  border-radius:var(--radius-md);
  background:var(--color-semantic-background-elevated-normal);
  color:var(--color-semantic-label-normal);
  box-shadow:var(--shadow-md);
  font-family:var(--font-sans);
  font-size:var(--label1-size);
  font-weight:var(--fw-bold);
  text-decoration:none;
  transform:translateY(calc(-100% - var(--space-6)));
  transition:transform var(--dur-fast) var(--ease-out);
}
.lk-dashboard-shell__skip:focus,
.lk-dashboard-shell__skip:focus-visible{transform:translateY(0)}
.lk-dashboard-shell__header{grid-column:1/-1;grid-row:1;min-width:0;z-index:50}
.lk-dashboard-shell__navigation{grid-column:1;grid-row:2;min-width:0;min-height:0;z-index:20}
.lk-dashboard-shell__main{grid-column:2;grid-row:2;min-width:0;min-height:0;width:100%;max-width:100%;box-sizing:border-box}
.lk-dashboard-shell__narrow-navigation{display:none;min-width:0;z-index:40;background:var(--color-semantic-background-elevated-normal)}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__header{grid-column:2;grid-row:1}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__navigation{grid-column:1;grid-row:1/-1;z-index:60}
.lk-dashboard-shell[data-topology="side-first"] .lk-dashboard-shell__main{grid-column:2;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
.lk-dashboard-shell[data-layout="narrow"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"]{grid-template-rows:auto minmax(0,1fr)}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"] .lk-dashboard-shell__navigation{display:none}
.lk-dashboard-shell[data-layout="narrow"][data-has-temporary-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
/* topology="rail-panel": a fixed-height app shell. The docked rail and the
   contextual panel span both rows and never scroll with the page; main is the
   scroll container. */
.lk-dashboard-shell[data-topology="rail-panel"]{position:relative;grid-template-columns:auto auto minmax(0,1fr);overflow:hidden}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__navigation{grid-column:1;grid-row:1/-1;z-index:60;display:flex}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel{grid-column:2;grid-row:1/-1;z-index:55;display:flex;min-width:0;min-height:0;overflow:hidden;width:var(--lds-dashboard-shell-panel-width,var(--component-shell-panel-width));transition:width var(--dur-base) var(--ease-out)}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel[data-state="closed"]{width:0}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__panel-content{display:flex;flex-direction:column;flex:0 0 auto;width:var(--lds-dashboard-shell-panel-width,var(--component-shell-panel-width));min-height:0}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__header{grid-column:3;grid-row:1}
.lk-dashboard-shell[data-topology="rail-panel"] .lk-dashboard-shell__main{grid-column:3;grid-row:2;overflow-y:auto}
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"]{grid-template-columns:auto 0 minmax(0,1fr)}
/* The overlay panel sits in the (zero-width) panel column of the body row, so
   it covers main but never the header and its panel toggle. */
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"] .lk-dashboard-shell__panel{position:absolute;grid-row:2;inset-block:0;inset-inline-start:0;z-index:70;box-shadow:var(--shadow-lg);clip-path:inset(0 -120px 0 0)}
.lk-dashboard-shell[data-topology="rail-panel"][data-panel-mode="overlay"] .lk-dashboard-shell__panel[data-state="closed"]{box-shadow:none}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
.lk-dashboard-shell[data-topology="rail-panel"][data-narrow="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
@media(prefers-reduced-motion:reduce){.lk-dashboard-shell__panel{transition:none!important}}
@media(max-width:767px){
  .lk-dashboard-shell[data-layout="auto"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
  .lk-dashboard-shell[data-layout="auto"] .lk-dashboard-shell__header{grid-column:1;grid-row:1}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"]{grid-template-rows:auto minmax(0,1fr)}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"] .lk-dashboard-shell__navigation{display:none}
  .lk-dashboard-shell[data-layout="auto"][data-has-temporary-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"][data-has-temporary-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
}
`;
function withNavigationLabel(node, label) {
  if (!_react2.default.isValidElement(node)) return node;
  return _react2.default.cloneElement(node, {
    "aria-label": _nullishCoalesce(node.props["aria-label"], () => ( label))
  });
}
function isDevelopment() {
  const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
  return !(env && env.NODE_ENV === "production");
}
function RailPanelDrawerBody({ navigation, panel, navigationLabel }) {
  const footer = _react2.default.isValidElement(navigation) ? navigation.props.footer : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-rail-panel-drawer": "", style: { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, height: "100%" }, children: [
    _react2.default.isValidElement(navigation) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-rail-panel-drawer-areas": "", style: { flexShrink: 0, padding: "var(--space-2)" }, children: _react2.default.cloneElement(navigation, {
      surface: "drawer",
      header: null,
      footer: null,
      "aria-label": _nullishCoalesce(navigation.props["aria-label"], () => ( navigationLabel))
    }) }),
    panel != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-rail-panel-drawer-panel": "", style: { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: panel }),
    footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-rail-panel-drawer-footer": "", style: { flexShrink: 0, padding: "var(--space-2) var(--space-3)", borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: footer })
  ] });
}
function DashboardShell({
  header,
  navigation,
  narrowNavigation,
  temporaryNavigation,
  temporaryNavigationOpen = false,
  onTemporaryNavigationClose,
  temporaryNavigationId,
  temporaryNavigationTitle,
  temporaryNavigationLabel = "\uC8FC \uD0D0\uC0C9",
  temporaryNavigationCloseLabel = "\uD0D0\uC0C9 \uB2EB\uAE30",
  temporaryNavigationCloseButtonVariant,
  temporaryNavigationWidth = 320,
  temporaryNavigationAppearance = "default",
  temporaryNavigationInitialFocusRef,
  temporaryNavigationReturnFocusRef,
  children,
  layout = "auto",
  topology = "header-first",
  panel,
  panelOpen = true,
  onPanelOpenChange,
  panelId,
  panelMode = "auto",
  panelReturnFocusRef,
  mainId,
  mainLabel,
  mainClassName,
  mainStyle,
  skipLabel = "\uBCF8\uBB38\uC73C\uB85C \uAC74\uB108\uB6F0\uAE30",
  navigationLabel = "\uC8FC \uD0D0\uC0C9",
  narrowNavigationLabel = "\uC8FC \uD0D0\uC0C9",
  className,
  style,
  ...rest
}) {
  const generatedId = _react2.default.useId().replace(/:/g, "");
  const resolvedMainId = mainId || `lk-dashboard-main-${generatedId}`;
  const resolvedTemporaryNavigationId = temporaryNavigationId || `lk-dashboard-temporary-navigation-${generatedId}`;
  const resolvedTopology = topology === "side-first" || topology === "rail-panel" ? topology : "header-first";
  const railPanel = resolvedTopology === "rail-panel";
  const resolvedPanelId = panelId || `lk-dashboard-panel-${generatedId}`;
  const [autoNarrow, setAutoNarrow] = _react2.default.useState(false);
  const [autoOverlay, setAutoOverlay] = _react2.default.useState(false);
  const panelRef = _react2.default.useRef(null);
  const mainRef = _react2.default.useRef(null);
  const [mainOverflows, setMainOverflows] = _react2.default.useState(false);
  _react2.default.useEffect(() => {
    if (layout !== "auto" || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setAutoNarrow(false);
      return void 0;
    }
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setAutoNarrow(query.matches);
    update();
    _optionalChain([query, 'access', _ => _.addEventListener, 'optionalCall', _2 => _2("change", update)]);
    return () => _optionalChain([query, 'access', _3 => _3.removeEventListener, 'optionalCall', _4 => _4("change", update)]);
  }, [layout]);
  _react2.default.useEffect(() => {
    if (!railPanel || panelMode !== "auto" || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setAutoOverlay(false);
      return void 0;
    }
    const query = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const update = () => setAutoOverlay(query.matches);
    update();
    _optionalChain([query, 'access', _5 => _5.addEventListener, 'optionalCall', _6 => _6("change", update)]);
    return () => _optionalChain([query, 'access', _7 => _7.removeEventListener, 'optionalCall', _8 => _8("change", update)]);
  }, [railPanel, panelMode]);
  const isNarrowLayout = layout === "narrow" || layout === "auto" && autoNarrow;
  const hasPanel = railPanel && panel != null;
  const resolvedPanelMode = panelMode === "overlay" || panelMode === "auto" && autoOverlay ? "overlay" : "inline";
  const panelExpanded = hasPanel && !!panelOpen && !isNarrowLayout;
  const hasTemporaryNavigation = temporaryNavigation != null || railPanel && navigation != null;
  const temporaryOpen = hasTemporaryNavigation && temporaryNavigationOpen && isNarrowLayout;
  const previousPanelModeRef = _react2.default.useRef(resolvedPanelMode);
  _react2.default.useEffect(() => {
    const previous = previousPanelModeRef.current;
    previousPanelModeRef.current = resolvedPanelMode;
    if (hasPanel && previous === "inline" && resolvedPanelMode === "overlay" && panelOpen) _optionalChain([onPanelOpenChange, 'optionalCall', _9 => _9(false)]);
  }, [hasPanel, resolvedPanelMode, panelOpen, onPanelOpenChange]);
  const previousPanelExpandedRef = _react2.default.useRef(panelExpanded);
  _react2.default.useLayoutEffect(() => {
    const wasExpanded = previousPanelExpandedRef.current;
    previousPanelExpandedRef.current = panelExpanded;
    if (!wasExpanded || panelExpanded || typeof document === "undefined") return;
    if (_optionalChain([panelRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.contains, 'call', _12 => _12(document.activeElement)])) _optionalChain([panelReturnFocusRef, 'optionalAccess', _13 => _13.current, 'optionalAccess', _14 => _14.focus, 'optionalCall', _15 => _15()]);
  }, [panelExpanded, panelReturnFocusRef]);
  _react2.default.useEffect(() => {
    if (!railPanel || !isDevelopment()) return;
    const railName = _react2.default.isValidElement(navigation) ? _nullishCoalesce(navigation.props["aria-label"], () => ( navigationLabel)) : null;
    const panelTitle = _react2.default.isValidElement(panel) ? panel.props.title : null;
    if (typeof railName === "string" && typeof panelTitle === "string" && railName.trim() === panelTitle.trim()) {
      console.warn(`DashboardShell: the rail navigation and the panel navigation share the name "${railName}". Give each navigation landmark a unique name (WAI-ARIA APG landmark regions).`);
    }
  }, [railPanel, navigation, panel, navigationLabel]);
  _react2.default.useEffect(() => {
    if (!railPanel) return void 0;
    const node = mainRef.current;
    if (!node) return void 0;
    const measure = () => {
      const next = node.scrollHeight - node.clientHeight > 1;
      setMainOverflows((previous) => previous === next ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [railPanel, children]);
  const onPanelKeyDown = (event) => {
    if (event.key !== "Escape" || resolvedPanelMode !== "overlay" || !panelExpanded) return;
    event.stopPropagation();
    _optionalChain([onPanelOpenChange, 'optionalCall', _16 => _16(false)]);
    _optionalChain([panelReturnFocusRef, 'optionalAccess', _17 => _17.current, 'optionalAccess', _18 => _18.focus, 'optionalCall', _19 => _19()]);
  };
  const skipLink = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { className: "lk-dashboard-shell__skip", href: `#${resolvedMainId}`, inert: inertWhen(temporaryOpen), children: skipLabel });
  const headerRegion = header != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__header", inert: inertWhen(temporaryOpen), children: header });
  const navigationRegion = navigation != null && !(railPanel && isNarrowLayout) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__navigation", inert: inertWhen(temporaryOpen), children: withNavigationLabel(navigation, navigationLabel) });
  const panelRegion = hasPanel && !isNarrowLayout && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      ref: panelRef,
      id: resolvedPanelId,
      className: "lk-dashboard-shell__panel",
      "data-state": panelExpanded ? "open" : "closed",
      "aria-hidden": panelExpanded ? void 0 : true,
      inert: inertWhen(!panelExpanded || temporaryOpen),
      onKeyDown: onPanelKeyDown,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__panel-content", children: panel })
    }
  );
  const temporaryContent = temporaryNavigation != null ? withNavigationLabel(temporaryNavigation, temporaryNavigationLabel) : railPanel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, RailPanelDrawerBody, { navigation, panel, navigationLabel }) : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      className: ["lk-dashboard-shell", className].filter(Boolean).join(" "),
      "data-layout": layout,
      "data-topology": resolvedTopology,
      "data-has-narrow-navigation": narrowNavigation != null ? "true" : "false",
      "data-has-temporary-navigation": hasTemporaryNavigation ? "true" : "false",
      "data-temporary-navigation-open": temporaryOpen ? "true" : "false",
      "data-narrow": railPanel ? isNarrowLayout ? "true" : "false" : void 0,
      "data-panel-mode": hasPanel ? resolvedPanelMode : void 0,
      "data-panel-open": hasPanel ? panelExpanded ? "true" : "false" : void 0,
      style: {
        minHeight: railPanel ? void 0 : "100dvh",
        height: railPanel ? "100dvh" : void 0,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        background: "var(--color-semantic-background-normal-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        ...style
      },
      ...rest,
      children: [
        skipLink,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: DASHBOARD_SHELL_STYLES }),
        railPanel ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
          navigationRegion,
          panelRegion,
          headerRegion
        ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
          headerRegion,
          navigationRegion
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "main",
          {
            ref: railPanel ? mainRef : void 0,
            id: resolvedMainId,
            tabIndex: railPanel && mainOverflows ? 0 : -1,
            "aria-label": mainLabel,
            className: ["lk-dashboard-shell__main", mainClassName].filter(Boolean).join(" "),
            style: mainStyle,
            inert: inertWhen(temporaryOpen),
            children
          }
        ),
        narrowNavigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__narrow-navigation", inert: inertWhen(temporaryOpen), children: withNavigationLabel(narrowNavigation, narrowNavigationLabel) }),
        hasTemporaryNavigation && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkWESPBUC7cjs.Drawer,
          {
            id: resolvedTemporaryNavigationId,
            open: temporaryOpen,
            side: "left",
            width: temporaryNavigationWidth,
            appearance: temporaryNavigationAppearance,
            title: temporaryNavigationTitle,
            ariaLabel: temporaryNavigationLabel,
            closeLabel: temporaryNavigationCloseLabel,
            closeButtonVariant: temporaryNavigationCloseButtonVariant,
            onClose: onTemporaryNavigationClose,
            initialFocusRef: temporaryNavigationInitialFocusRef,
            returnFocusRef: temporaryNavigationReturnFocusRef,
            bodyStyle: railPanel && temporaryNavigation == null ? { padding: 0, overflow: "hidden", scrollbarGutter: "auto", display: "flex", flexDirection: "column", minHeight: 0 } : { padding: 0, overflow: "hidden", scrollbarGutter: "auto" },
            children: temporaryContent
          }
        )
      ]
    }
  );
}



exports.DashboardShell = DashboardShell;
//# sourceMappingURL=chunk-XMCETKWD.cjs.map