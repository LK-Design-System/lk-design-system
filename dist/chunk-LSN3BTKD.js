"use client";

// components/layout/VisuallyHidden.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function VisuallyHidden({ children, as = "span", ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ jsx(Comp, { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }, ...rest, children });
}

export {
  VisuallyHidden
};
//# sourceMappingURL=chunk-LSN3BTKD.js.map