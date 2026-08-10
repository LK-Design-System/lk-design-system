"use client";

// components/content/RecordHeader.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function RecordHeader({
  visual,
  title,
  badge,
  description,
  details,
  actions,
  headingLevel = 1,
  size = "md",
  style,
  ...rest
}) {
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const compact = size === "sm";
  return /* @__PURE__ */ jsx(
    "header",
    {
      "data-size": size,
      style: {
        width: "100%",
        minWidth: 0,
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            columnGap: compact ? "var(--space-3)" : "var(--space-4)",
            rowGap: compact ? "var(--space-3)" : "var(--space-4)",
            minWidth: 0
          },
          children: [
            visual != null && /* @__PURE__ */ jsx("div", { "data-record-header-visual": true, style: { display: "flex", flexShrink: 0 }, children: visual }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                "data-record-header-content": true,
                style: {
                  display: "grid",
                  gap: compact ? "var(--space-1)" : "var(--space-2)",
                  flex: "1 1 12rem",
                  minWidth: 0
                },
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: compact ? "var(--space-1)" : "var(--space-2)",
                        minWidth: 0
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          Heading,
                          {
                            style: {
                              margin: 0,
                              minWidth: 0,
                              color: "var(--color-semantic-label-strong)",
                              fontSize: compact ? "var(--heading2-size)" : "var(--heading1-size)",
                              lineHeight: compact ? "var(--heading2-line)" : "var(--heading1-line)",
                              fontWeight: "var(--fw-extra)",
                              letterSpacing: compact ? "var(--heading2-spacing)" : "var(--heading1-spacing)",
                              wordBreak: "keep-all",
                              overflowWrap: "anywhere"
                            },
                            children: title
                          }
                        ),
                        badge != null && /* @__PURE__ */ jsx("div", { "data-record-header-badge": true, style: { display: "flex", flexShrink: 0 }, children: badge })
                      ]
                    }
                  ),
                  description != null && /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        margin: 0,
                        maxWidth: 680,
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label1-size)",
                        lineHeight: "var(--label1-reading-line)",
                        letterSpacing: "var(--label1-spacing)",
                        wordBreak: "keep-all",
                        overflowWrap: "anywhere"
                      },
                      children: description
                    }
                  ),
                  details != null && /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-record-header-details": true,
                      style: {
                        minWidth: 0,
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label2-size)",
                        lineHeight: "var(--label2-line)",
                        letterSpacing: "var(--label2-spacing)"
                      },
                      children: details
                    }
                  )
                ]
              }
            ),
            actions != null && /* @__PURE__ */ jsx(
              "div",
              {
                "data-record-header-actions": true,
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 1 auto",
                  flexWrap: "wrap",
                  gap: compact ? "var(--space-1)" : "var(--space-2)",
                  minWidth: 0,
                  maxWidth: "100%",
                  marginInlineStart: "auto"
                },
                children: actions
              }
            )
          ]
        }
      )
    }
  );
}

export {
  RecordHeader
};
//# sourceMappingURL=chunk-KPNEFDMB.js.map