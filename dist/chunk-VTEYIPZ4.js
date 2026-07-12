"use client";

// components/layout/Section.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var toLen = (v) => typeof v === "number" ? v + "px" : v;
var SURFACES = {
  subtle: "var(--color-semantic-background-normal-alternative)",
  band: "var(--color-semantic-background-normal-alternative)",
  raised: "var(--color-semantic-background-elevated-normal)",
  inverse: "var(--color-semantic-inverse-background)"
};
function Section({ children, surface, py, container = true, innerStyle, style, ...rest }) {
  const outer = {
    background: surface ? SURFACES[surface] : void 0,
    color: surface === "inverse" ? "var(--color-semantic-inverse-label)" : void 0,
    ...py != null ? { "--section-py": toLen(py) } : {},
    ...style
  };
  const inner = container ? /* @__PURE__ */ jsx("div", { className: "lk-container-fluid", style: innerStyle, children }) : children;
  return /* @__PURE__ */ jsx("section", { className: "lk-section", style: outer, ...rest, children: inner });
}

export {
  Section
};
//# sourceMappingURL=chunk-VTEYIPZ4.js.map