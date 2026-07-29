"use client";
import {
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";

// components/status/EmptyState.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function EmptyState({ icon, title, description, action, tone = "signal", headingLevel = 2, style, ...rest }) {
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const palette = statusToneStyle(tone);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-1-5)",
        padding: "48px 24px",
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
          width: 56,
          height: 56,
          borderRadius: "var(--radius-xl)",
          background: palette.surface,
          color: palette.foreground,
          marginBottom: 12
        }, children: icon }),
        title != null && /* @__PURE__ */ jsx(Heading, { style: { margin: 0, fontSize: "var(--headline1-size)", lineHeight: "var(--headline1-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
        description != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.65, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description }),
        action != null && /* @__PURE__ */ jsx("div", { style: { marginTop: "var(--space-3-5)" }, children: action })
      ]
    }
  );
}

export {
  EmptyState
};
//# sourceMappingURL=chunk-BAQSETO6.js.map