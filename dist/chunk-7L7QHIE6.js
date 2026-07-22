"use client";

// components/layout/DashboardGrid.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var toLength = (value) => typeof value === "number" ? `${value}px` : value;
function DashboardGrid({
  children,
  minCardWidth = 220,
  gap = "var(--grid-gutter)",
  fillLastRow = false,
  className,
  style,
  ...rest
}) {
  const minimum = toLength(minCardWidth);
  if (fillLastRow) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: ["lk-dashboard-grid", "lk-dashboard-grid-fill", className].filter(Boolean).join(" "),
        style: {
          "--dashboard-grid-min-card-width": minimum,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          gap,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          ...style
        },
        ...rest,
        children: [
          /* @__PURE__ */ jsx("style", { children: `.lk-dashboard-grid-fill > *:not(style){min-width:0;flex:1 1 min(100%, var(--dashboard-grid-min-card-width))}` }),
          children
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: ["lk-dashboard-grid", className].filter(Boolean).join(" "),
      style: {
        "--dashboard-grid-min-card-width": minimum,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, var(--dashboard-grid-min-card-width)), 1fr))",
        alignItems: "stretch",
        gap,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("style", { children: `.lk-dashboard-grid > *:not(style){min-width:0}` }),
        children
      ]
    }
  );
}

export {
  DashboardGrid
};
//# sourceMappingURL=chunk-7L7QHIE6.js.map