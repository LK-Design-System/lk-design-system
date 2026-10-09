"use client";
import {
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";

// components/status/EmptyState.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function EmptyState({ icon, title, description, action, tone = "signal", size = "md", headingLevel = 2, style, ...rest }) {
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const palette = statusToneStyle(tone);
  const compact = size === "sm";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-1-5)",
        padding: compact ? "var(--space-4)" : "48px 24px",
        fontFamily: "var(--font-sans)",
        maxWidth: 420,
        margin: "0 auto",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ jsx("div", { style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: compact ? "var(--space-6)" : 56,
          height: compact ? "var(--space-6)" : 56,
          borderRadius: compact ? 0 : "var(--radius-xl)",
          background: compact ? "transparent" : palette.surface,
          color: palette.foreground,
          marginBottom: compact ? 0 : 12
        }, children: icon }),
        title != null && /* @__PURE__ */ jsx(Heading, { style: { margin: 0, fontSize: compact ? "var(--label1-size)" : "var(--headline1-size)", lineHeight: compact ? "var(--label1-line)" : "var(--headline1-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
        description != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.65, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description }),
        action != null && /* @__PURE__ */ jsx("div", { style: { marginTop: compact ? "var(--space-1)" : "var(--space-3-5)" }, children: action })
      ]
    }
  );
}

export {
  EmptyState
};
//# sourceMappingURL=chunk-JUBLS2JZ.js.map