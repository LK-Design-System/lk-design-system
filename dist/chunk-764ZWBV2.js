"use client";

// components/layout/Cluster.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Cluster({ children, gap = 10, align = "center", justify = "flex-start", style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap, alignItems: align, justifyContent: justify, ...style }, ...rest, children });
}

export {
  Cluster
};
//# sourceMappingURL=chunk-764ZWBV2.js.map