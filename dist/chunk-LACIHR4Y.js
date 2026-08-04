"use client";
import {
  statusToneStyle
} from "./chunk-SMCJUHS2.js";

// ../lk-design-system/packages/core/dist/chunk-EAU6D6QZ.js
import React from "react";
import { jsx } from "react/jsx-runtime";
function resolveTone(tone) {
  if (tone === "critical") return statusToneStyle("negative");
  return statusToneStyle(tone);
}
function StatusBadge({ children, tone = "positive", style, ...rest }) {
  const appearance = resolveTone(tone);
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `lk-status-badge lk-status-badge--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        height: 20,
        maxWidth: "100%",
        padding: "0 var(--space-2)",
        borderRadius: "var(--radius-pill)",
        background: appearance.surface,
        color: appearance.foreground,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-semibold)",
        lineHeight: 1,
        letterSpacing: 0,
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children
    }
  );
}

export {
  StatusBadge
};
//# sourceMappingURL=chunk-LACIHR4Y.js.map