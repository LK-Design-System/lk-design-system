"use client";

// components/content/Kbd.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Kbd({ children, style, ...rest }) {
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 22,
        height: 22,
        padding: "0 6px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-bold)",
        color: "var(--color-semantic-label-neutral)",
        background: "var(--color-semantic-background-elevated-normal)",
        borderColor: "var(--color-semantic-line-normal-normal)",
        borderStyle: "solid",
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRadius: "var(--radius-sm)",
        lineHeight: 1,
        ...style
      },
      ...rest,
      children
    }
  );
}

export {
  Kbd
};
//# sourceMappingURL=chunk-E3XDG4DN.js.map