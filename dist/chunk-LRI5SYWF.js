"use client";

// components/layout/Stack.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Stack({ children, direction = "column", gap = 16, align, justify, wrap = false, as = "div", style, ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ jsx(Comp, { style: { display: "flex", flexDirection: direction, gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : "nowrap", ...style }, ...rest, children });
}

export {
  Stack
};
//# sourceMappingURL=chunk-LRI5SYWF.js.map