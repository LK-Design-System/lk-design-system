"use client";

// components/layout/AspectRatio.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function AspectRatio({ children, ratio = 16 / 9, style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%", aspectRatio: String(ratio), overflow: "hidden", ...style }, ...rest, children });
}

export {
  AspectRatio
};
//# sourceMappingURL=chunk-6AGIWLAV.js.map