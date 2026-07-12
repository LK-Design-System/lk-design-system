"use client";

// components/layout/Center.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Center({ children, minHeight, style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight, ...style }, ...rest, children });
}

export {
  Center
};
//# sourceMappingURL=chunk-HHW5XY5S.js.map