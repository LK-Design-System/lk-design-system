"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk4HCIRCBWcjs = require('./chunk-4HCIRCBW.cjs');


var _chunk5ZPWXVTMcjs = require('./chunk-5ZPWXVTM.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

// components/data/DataCollectionPanel.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DATA_COLLECTION_PANEL_STYLES = `
.lk-data-collection-panel__compact-content{display:none}
.lk-data-collection-panel__footer:empty{display:none!important}
.lk-data-collection-panel[data-layout="narrow"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__wide-content{display:none}
.lk-data-collection-panel[data-layout="narrow"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__compact-content{display:block}
@container lds-data-collection-panel (max-width:767px){
  .lk-data-collection-panel[data-layout="auto"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__wide-content{display:none}
  .lk-data-collection-panel[data-layout="auto"][data-has-compact-content="true"] > .lk-data-collection-panel__state > [data-resource-state] > .lk-data-collection-panel__compact-content{display:block}
}
`;
var RESOURCE_STATES = /* @__PURE__ */ new Set(["ready", "loading", "refreshing", "empty", "error", "stale", "offline", "restricted"]);
var BLOCKING_STATES = /* @__PURE__ */ new Set(["empty", "restricted"]);
var DataCollectionPanel = _react2.default.forwardRef(function DataCollectionPanel2({
  as = "section",
  toolbar,
  resourceState,
  compactContent,
  footer,
  layout = "auto",
  children,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const Component = as;
  const resolvedLayout = ["auto", "wide", "narrow"].includes(layout) ? layout : "auto";
  const hasCompactContent = compactContent != null;
  const resolvedResourceState = _nullishCoalesce(resourceState, () => ( {}));
  const hasWideContent = _react2.default.Children.toArray(children).length > 0;
  const hasContent = hasWideContent || hasCompactContent;
  const state = RESOURCE_STATES.has(resolvedResourceState.state) ? resolvedResourceState.state : "ready";
  const isLoading = state === "loading" || state === "refreshing" && !hasContent;
  const isBlocking = BLOCKING_STATES.has(state) || !hasContent && !isLoading && state !== "ready";
  const showFooter = footer != null && !isLoading && !isBlocking;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Component,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-lds-data-collection-panel": "",
      "data-layout": resolvedLayout,
      "data-has-compact-content": hasCompactContent ? "true" : "false",
      "data-state": state,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-data-collection-panel", className) || void 0,
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-data-collection-panel-"),
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "var(--lds-data-collection-panel-min-height, auto)",
        overflow: "hidden",
        containerType: "inline-size",
        containerName: "lds-data-collection-panel",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--component-card-bg)",
        boxShadow: "var(--component-card-shadow-sm)",
        color: "var(--component-card-fg)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: DATA_COLLECTION_PANEL_STYLES }),
        toolbar != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "toolbar",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "toolbar") || void 0,
            style: { minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "toolbar") },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5ZPWXVTMcjs.DataToolbar, { ...toolbar, variant: "embedded" })
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "state",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "state", "lk-data-collection-panel__state") || void 0,
            style: { minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "state") },
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk4HCIRCBWcjs.ResourceState, { ...resolvedResourceState, state, messageVariant: "embedded", children: [
              hasWideContent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  "data-slot": "wideContent",
                  "data-collection-content": "wide",
                  className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "wideContent", "lk-data-collection-panel__wide-content") || void 0,
                  style: { minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "wideContent") },
                  children
                }
              ),
              hasCompactContent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  "data-slot": "compactContent",
                  "data-collection-content": "compact",
                  className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "compactContent", "lk-data-collection-panel__compact-content") || void 0,
                  style: { minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "compactContent") },
                  children: compactContent
                }
              )
            ] })
          }
        ),
        showFooter && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "footer",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "footer", "lk-data-collection-panel__footer") || void 0,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              padding: "var(--lds-data-collection-panel-footer-padding, var(--space-3) var(--space-4))",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "footer")
            },
            children: footer
          }
        )
      ]
    }
  );
});



exports.DataCollectionPanel = DataCollectionPanel;
//# sourceMappingURL=chunk-PEAMU5QZ.cjs.map