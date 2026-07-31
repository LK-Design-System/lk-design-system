"use client";
import {
  ResourceState
} from "./chunk-DOOF3ZOF.js";

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
  headingLevel = 3,
  children,
  bodyStyle,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const hasContent = React.Children.toArray(children).length > 0;
  const preservesData = hasContent && ["refreshing", "stale", "offline", "error"].includes(resourceState);
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
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
        background: "var(--component-card-bg)",
        boxShadow: "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("header", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0, padding: "var(--space-4) var(--space-5)", borderBottom: preservesData ? "none" : "1px solid var(--color-semantic-line-normal-normal)" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-2)", flex: "1 1 240px", minWidth: 0, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsx(Heading, { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", overflowWrap: "anywhere" }, children: title }),
              meta != null && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
                meta
              ] })
            ] }),
            actions != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: actions })
          ] }),
          description != null && /* @__PURE__ */ jsx("p", { id: descriptionId, style: { margin: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: description })
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
            headingLevel: Math.min(6, resolvedHeadingLevel + 1),
            children: hasContent && /* @__PURE__ */ jsxs("div", { "data-chart-frame-body": true, style: { display: "grid", gap: "var(--space-4)", minWidth: 0, padding: "var(--space-4) var(--space-5)", ...bodyStyle }, children: [
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
//# sourceMappingURL=chunk-IY7MD6ZO.js.map