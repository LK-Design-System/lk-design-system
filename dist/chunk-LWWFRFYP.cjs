"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/DashboardGrid.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-dashboard-grid-fill > *:not(style){min-width:0;flex:1 1 min(100%, var(--dashboard-grid-min-card-width))}` }),
          children
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-dashboard-grid > *:not(style){min-width:0}` }),
        children
      ]
    }
  );
}



exports.DashboardGrid = DashboardGrid;
//# sourceMappingURL=chunk-LWWFRFYP.cjs.map