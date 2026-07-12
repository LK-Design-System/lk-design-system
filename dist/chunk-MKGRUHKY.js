"use client";

// components/overlay/ToastStack.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function ToastStack({ children, position = "bottom-right", gap = 10, style, ...rest }) {
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
    "top-left": { top: 20, left: 20, alignItems: "flex-start" },
    "bottom-center": { bottom: 20, left: "50%", transform: "translateX(-50%)", alignItems: "center" }
  }[position] || {};
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", zIndex: 120, display: "flex", flexDirection: "column", gap, ...pos, ...style }, ...rest, children });
}

export {
  ToastStack
};
//# sourceMappingURL=chunk-MKGRUHKY.js.map