"use client";

// components/layout/Container.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Container({ children, size = "default", style, ...rest }) {
  if (size === "default") {
    return /* @__PURE__ */ jsx("div", { className: "lk-container-fluid", style, ...rest, children });
  }
  const max = size === "read" ? "var(--container-read)" : "var(--container-wide)";
  return /* @__PURE__ */ jsx("div", { style: { maxWidth: max, marginInline: "auto", paddingInline: "var(--grid-margin)", width: "100%", boxSizing: "border-box", ...style }, ...rest, children });
}

export {
  Container
};
//# sourceMappingURL=chunk-HXF6FBUR.js.map