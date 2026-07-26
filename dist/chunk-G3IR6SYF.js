"use client";

// components/navigation/Toolbar.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Toolbar({ children, style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { role: "toolbar", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)", padding: "var(--space-1-5)", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", ...style }, ...rest, children });
}

export {
  Toolbar
};
//# sourceMappingURL=chunk-G3IR6SYF.js.map