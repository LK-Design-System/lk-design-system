"use client";
import {
  DataToolbar
} from "./chunk-ZMVQELLW.js";
import {
  ResourceState
} from "./chunk-TZU3AXAI.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";

// components/data/DataCollectionPanel.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
var DataCollectionPanel = React.forwardRef(function DataCollectionPanel2({
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
  const resolvedResourceState = resourceState ?? {};
  const hasWideContent = React.Children.toArray(children).length > 0;
  const hasContent = hasWideContent || hasCompactContent;
  const state = RESOURCE_STATES.has(resolvedResourceState.state) ? resolvedResourceState.state : "ready";
  const isLoading = state === "loading" || state === "refreshing" && !hasContent;
  const isBlocking = BLOCKING_STATES.has(state) || !hasContent && !isLoading && state !== "ready";
  const showFooter = footer != null && !isLoading && !isBlocking;
  return /* @__PURE__ */ jsxs(
    Component,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-lds-data-collection-panel": "",
      "data-layout": resolvedLayout,
      "data-has-compact-content": hasCompactContent ? "true" : "false",
      "data-state": state,
      className: partClassName(classNames, "root", "lk-data-collection-panel", className) || void 0,
      style: {
        ...componentVars(vars, "--lds-data-collection-panel-"),
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
        ...partStyle(styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: DATA_COLLECTION_PANEL_STYLES }),
        toolbar != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "toolbar",
            className: partClassName(classNames, "toolbar") || void 0,
            style: { minWidth: 0, ...partStyle(styles, "toolbar") },
            children: /* @__PURE__ */ jsx(DataToolbar, { ...toolbar, variant: "embedded" })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "state",
            className: partClassName(classNames, "state", "lk-data-collection-panel__state") || void 0,
            style: { minWidth: 0, ...partStyle(styles, "state") },
            children: /* @__PURE__ */ jsxs(ResourceState, { ...resolvedResourceState, state, messageVariant: "embedded", children: [
              hasWideContent && /* @__PURE__ */ jsx(
                "div",
                {
                  "data-slot": "wideContent",
                  "data-collection-content": "wide",
                  className: partClassName(classNames, "wideContent", "lk-data-collection-panel__wide-content") || void 0,
                  style: { minWidth: 0, ...partStyle(styles, "wideContent") },
                  children
                }
              ),
              hasCompactContent && /* @__PURE__ */ jsx(
                "div",
                {
                  "data-slot": "compactContent",
                  "data-collection-content": "compact",
                  className: partClassName(classNames, "compactContent", "lk-data-collection-panel__compact-content") || void 0,
                  style: { minWidth: 0, ...partStyle(styles, "compactContent") },
                  children: compactContent
                }
              )
            ] })
          }
        ),
        showFooter && /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "footer",
            className: partClassName(classNames, "footer", "lk-data-collection-panel__footer") || void 0,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              padding: "var(--lds-data-collection-panel-footer-padding, var(--space-3) var(--space-4))",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              ...partStyle(styles, "footer")
            },
            children: footer
          }
        )
      ]
    }
  );
});

export {
  DataCollectionPanel
};
//# sourceMappingURL=chunk-GNG4CKZK.js.map