"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkLJK5DY6Jcjs = require('./chunk-LJK5DY6J.cjs');

// components/layout/DashboardShell.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  temporaryNavigationWidth = 320,
  temporaryNavigationInitialFocusRef,
  temporaryNavigationReturnFocusRef,
  children,
  layout = "auto",
  topology = "header-first",
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
  const resolvedTopology = topology === "side-first" ? "side-first" : "header-first";
  const [autoNarrow, setAutoNarrow] = _react2.default.useState(false);
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
  const isNarrowLayout = layout === "narrow" || layout === "auto" && autoNarrow;
  const hasTemporaryNavigation = temporaryNavigation != null;
  const temporaryOpen = hasTemporaryNavigation && temporaryNavigationOpen && isNarrowLayout;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      className: ["lk-dashboard-shell", className].filter(Boolean).join(" "),
      "data-layout": layout,
      "data-topology": resolvedTopology,
      "data-has-narrow-navigation": narrowNavigation != null ? "true" : "false",
      "data-has-temporary-navigation": hasTemporaryNavigation ? "true" : "false",
      "data-temporary-navigation-open": temporaryOpen ? "true" : "false",
      style: {
        minHeight: "100dvh",
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { className: "lk-dashboard-shell__skip", href: `#${resolvedMainId}`, inert: temporaryOpen ? true : void 0, children: skipLabel }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: DASHBOARD_SHELL_STYLES }),
        header != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__header", inert: temporaryOpen ? true : void 0, children: header }),
        navigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__navigation", inert: temporaryOpen ? true : void 0, children: withNavigationLabel(navigation, navigationLabel) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "main",
          {
            id: resolvedMainId,
            tabIndex: -1,
            "aria-label": mainLabel,
            className: ["lk-dashboard-shell__main", mainClassName].filter(Boolean).join(" "),
            style: mainStyle,
            inert: temporaryOpen ? true : void 0,
            children
          }
        ),
        narrowNavigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__narrow-navigation", inert: temporaryOpen ? true : void 0, children: withNavigationLabel(narrowNavigation, narrowNavigationLabel) }),
        hasTemporaryNavigation && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkLJK5DY6Jcjs.Drawer,
          {
            id: resolvedTemporaryNavigationId,
            open: temporaryOpen,
            side: "left",
            width: temporaryNavigationWidth,
            title: temporaryNavigationTitle,
            ariaLabel: temporaryNavigationLabel,
            closeLabel: temporaryNavigationCloseLabel,
            onClose: onTemporaryNavigationClose,
            initialFocusRef: temporaryNavigationInitialFocusRef,
            returnFocusRef: temporaryNavigationReturnFocusRef,
            bodyStyle: { padding: 0, overflow: "hidden", scrollbarGutter: "auto" },
            children: withNavigationLabel(temporaryNavigation, temporaryNavigationLabel)
          }
        )
      ]
    }
  );
}



exports.DashboardShell = DashboardShell;
//# sourceMappingURL=chunk-JNTY4M6F.cjs.map