"use client";

// components/overlay/Dimmer.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Dimmer({ open = false, children, onClick, blur = false, style, ...rest }) {
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick,
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--component-dialog-scrim)",
        color: "var(--color-semantic-inverse-label)",
        backdropFilter: blur ? "blur(var(--component-dialog-scrim-blur))" : "none",
        borderRadius: "inherit",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx(
        "span",
        {
          "data-dimmer-content": "",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-semantic-inverse-background)",
            color: "var(--color-semantic-inverse-label)",
            boxShadow: "var(--shadow-sm)"
          },
          children
        }
      )
    }
  );
}

export {
  Dimmer
};
//# sourceMappingURL=chunk-JCVSQENT.js.map