"use client";

// components/content/Code.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var MONO = 'var(--font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';
function Code({ children, block = false, style, ...rest }) {
  if (block) {
    return /* @__PURE__ */ jsx(
      "pre",
      {
        style: {
          margin: 0,
          padding: "14px 16px",
          background: "var(--color-semantic-inverse-background)",
          color: "var(--color-semantic-inverse-label)",
          borderRadius: "var(--radius-lg)",
          overflowX: "auto",
          fontFamily: MONO,
          fontSize: "var(--label2-size)",
          lineHeight: 1.6,
          ...style
        },
        ...rest,
        children: /* @__PURE__ */ jsx("code", { children })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "code",
    {
      style: {
        padding: "2px 6px",
        background: "var(--color-semantic-fill-strong)",
        color: "var(--color-semantic-label-normal)",
        borderRadius: "var(--radius-sm)",
        fontFamily: MONO,
        fontSize: "0.9em",
        ...style
      },
      ...rest,
      children
    }
  );
}

export {
  Code
};
//# sourceMappingURL=chunk-YXG5ASVS.js.map