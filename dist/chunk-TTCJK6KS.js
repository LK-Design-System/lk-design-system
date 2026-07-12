"use client";

// components/content/Overline.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Overline({ children, as = "div", tone = "muted", onDark = false, style, ...rest }) {
  const Comp = as;
  const color = onDark ? tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "ink" ? "var(--color-semantic-static-white)" : "var(--color-semantic-inverse-label-neutral-soft)" : tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "ink" ? "var(--color-semantic-label-strong)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-bold)",
        letterSpacing: "var(--ls-overline)",
        textTransform: "uppercase",
        lineHeight: 1.2,
        color,
        ...style
      },
      ...rest,
      children
    }
  );
}

export {
  Overline
};
//# sourceMappingURL=chunk-TTCJK6KS.js.map