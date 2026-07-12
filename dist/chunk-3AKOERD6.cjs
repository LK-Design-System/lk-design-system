"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

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
.lk-dashboard-shell[data-layout="narrow"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
.lk-dashboard-shell[data-layout="narrow"][data-has-narrow-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
@media(max-width:767px){
  .lk-dashboard-shell[data-layout="auto"]{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__navigation{display:none}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__main{grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="true"] .lk-dashboard-shell__narrow-navigation{display:block;grid-column:1;grid-row:3;position:sticky;bottom:0;padding-bottom:var(--mobile-safe-area-bottom)}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"]{grid-template-rows:auto auto minmax(0,1fr)}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"] .lk-dashboard-shell__navigation{display:block;grid-column:1;grid-row:2}
  .lk-dashboard-shell[data-layout="auto"][data-has-narrow-navigation="false"] .lk-dashboard-shell__main{grid-column:1;grid-row:3}
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
  children,
  layout = "auto",
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      className: ["lk-dashboard-shell", className].filter(Boolean).join(" "),
      "data-layout": layout,
      "data-has-narrow-navigation": narrowNavigation != null ? "true" : "false",
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { className: "lk-dashboard-shell__skip", href: `#${resolvedMainId}`, children: skipLabel }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: DASHBOARD_SHELL_STYLES }),
        header != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__header", children: header }),
        navigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__navigation", children: withNavigationLabel(navigation, navigationLabel) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "main",
          {
            id: resolvedMainId,
            tabIndex: -1,
            "aria-label": mainLabel,
            className: ["lk-dashboard-shell__main", mainClassName].filter(Boolean).join(" "),
            style: mainStyle,
            children
          }
        ),
        narrowNavigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-dashboard-shell__narrow-navigation", children: withNavigationLabel(narrowNavigation, narrowNavigationLabel) })
      ]
    }
  );
}



exports.DashboardShell = DashboardShell;
//# sourceMappingURL=chunk-3AKOERD6.cjs.map