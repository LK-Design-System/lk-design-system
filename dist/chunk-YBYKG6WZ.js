"use client";

// components/layout/Grid.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Grid({ children, columns, minItemWidth, gap = 20, style, ...rest }) {
  const template = minItemWidth ? `repeat(auto-fill, minmax(${typeof minItemWidth === "number" ? minItemWidth + "px" : minItemWidth}, 1fr))` : columns ? `repeat(${columns}, minmax(0, 1fr))` : void 0;
  return /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: template, gap, ...style }, ...rest, children });
}

export {
  Grid
};
//# sourceMappingURL=chunk-YBYKG6WZ.js.map