"use client";

// components/layout/Spacer.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Spacer({ size, axis = "vertical", style, ...rest }) {
  if (size == null) return /* @__PURE__ */ jsx("span", { style: { flex: 1, ...style }, ...rest });
  return /* @__PURE__ */ jsx("span", { style: { display: "block", flexShrink: 0, width: axis === "horizontal" ? size : void 0, height: axis === "vertical" ? size : void 0, ...style }, ...rest });
}

export {
  Spacer
};
//# sourceMappingURL=chunk-NZTT56DR.js.map