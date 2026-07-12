"use client";
import {
  ResourceState
} from "./chunk-ILM6KVXF.js";

// components/data/ChartFrame.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function ChartFrame({
  title,
  description,
  meta,
  actions,
  legend,
  resourceState = "ready",
  stateTitle,
  stateDescription,
  stateAction,
  lastUpdated,
  loadingContent,
  children,
  bodyStyle,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const hasContent = React.Children.count(children) > 0;
  const preservesData = hasContent && ["refreshing", "stale", "offline", "error"].includes(resourceState);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": titleId,
      "aria-describedby": description != null ? descriptionId : void 0,
      "data-chart-frame-state": resourceState,
      style: {
        minWidth: 0,
        overflow: "hidden",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--color-semantic-background-elevated-normal)",
        boxShadow: "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("header", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, padding: "var(--space-4) var(--space-5)", borderBottom: preservesData ? "none" : "1px solid var(--color-semantic-line-normal-normal)", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", flex: "1 1 240px", minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("h3", { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", overflowWrap: "anywhere" }, children: title }),
            description != null && /* @__PURE__ */ jsx("p", { id: descriptionId, style: { margin: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: description }),
            meta != null && /* @__PURE__ */ jsx("div", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: meta })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: actions })
        ] }),
        /* @__PURE__ */ jsx(
          ResourceState,
          {
            state: resourceState,
            title: stateTitle,
            description: stateDescription,
            action: stateAction,
            lastUpdated,
            loadingContent,
            messageVariant: "embedded",
            children: children != null && /* @__PURE__ */ jsxs("div", { "data-chart-frame-body": true, style: { display: "grid", gap: "var(--space-4)", minWidth: 0, padding: "var(--space-4) var(--space-5)", ...bodyStyle }, children: [
              /* @__PURE__ */ jsx("div", { style: { minWidth: 0 }, children }),
              legend != null && /* @__PURE__ */ jsx("div", { "data-chart-frame-legend": true, style: { minWidth: 0 }, children: legend })
            ] })
          }
        )
      ]
    }
  );
}

export {
  ChartFrame
};
//# sourceMappingURL=chunk-TSSJIR3I.js.map