"use client";

// components/layout/PageHeader.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function PageHeader({
  eyebrow,
  breadcrumb,
  title,
  description,
  status,
  meta,
  actions,
  align = "start",
  size = "md",
  headingLevel = 1,
  style,
  ...rest
}) {
  const compact = size === "sm";
  const titleSize = compact ? "var(--heading2-size)" : "var(--heading1-size)";
  const titleLine = compact ? "var(--heading2-line)" : "var(--heading1-line)";
  const titleSpacing = compact ? "var(--heading2-spacing)" : "var(--heading1-spacing)";
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const hasContext = breadcrumb != null || eyebrow != null;
  return /* @__PURE__ */ jsxs(
    "header",
    {
      style: {
        display: "grid",
        gap: compact ? 4 : 6,
        width: "100%",
        minWidth: 0,
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        hasContext && /* @__PURE__ */ jsxs("div", { "data-page-header-context": true, style: { display: "grid", gap: compact ? 4 : 6, minWidth: 0 }, children: [
          breadcrumb != null && /* @__PURE__ */ jsx("div", { style: { minWidth: 0 }, children: breadcrumb }),
          eyebrow != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--label2-spacing)", color: "var(--color-semantic-label-neutral)" }, children: eyebrow })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              columnGap: compact ? "var(--space-2)" : "var(--space-3)",
              rowGap: compact ? "var(--space-3)" : "var(--space-4)",
              alignItems: align === "center" ? "center" : "start",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsxs("div", { "data-page-header-content": true, style: { display: "grid", gap: compact ? 4 : 6, flex: "1 1 32rem", minWidth: 0 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
                  /* @__PURE__ */ jsx(Heading, { style: { margin: 0, minWidth: 0, color: "var(--color-semantic-label-strong)", fontSize: titleSize, lineHeight: titleLine, fontWeight: "var(--fw-extra)", letterSpacing: titleSpacing, wordBreak: "keep-all", overflowWrap: "anywhere" }, children: title }),
                  status != null && /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, children: status })
                ] }),
                description != null && /* @__PURE__ */ jsx("p", { style: { margin: 0, maxWidth: 680, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", letterSpacing: "var(--label1-spacing)", wordBreak: "keep-all", overflowWrap: "anywhere" }, children: description }),
                meta != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", letterSpacing: "var(--label2-spacing)" }, children: meta })
              ] }),
              actions != null && /* @__PURE__ */ jsx("div", { "data-page-header-actions": true, style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flex: "0 1 auto", flexWrap: "wrap", minWidth: 0, maxWidth: "100%", marginInlineStart: "auto" }, children: actions })
            ]
          }
        )
      ]
    }
  );
}

export {
  PageHeader
};
//# sourceMappingURL=chunk-MXAPB5UW.js.map