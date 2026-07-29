"use client";
import {
  StatusBadge
} from "./chunk-YZIOOD3Y.js";
import {
  normalizeStatusTone
} from "./chunk-L2ZEGNVF.js";

// components/robotics/EquipmentStatusCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function EquipmentStatusCard({
  icon,
  title,
  description,
  status,
  statusTone = "neutral",
  details = [],
  meta,
  actions,
  headingLevel = 3,
  style,
  ...rest
}) {
  const Heading = `h${headingLevel}`;
  const hasDetails = details.length > 0;
  const hasFooter = meta != null || actions != null;
  const resolvedStatusTone = normalizeStatusTone(statusTone);
  return /* @__PURE__ */ jsxs(
    "article",
    {
      "data-equipment-status-tone": resolvedStatusTone,
      style: {
        display: "grid",
        gap: "var(--space-3)",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "var(--space-4)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        border: "var(--border-thin) solid var(--color-semantic-line-solid-_strong)",
        borderRadius: "var(--component-card-radius)",
        boxShadow: "var(--component-card-shadow-none)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            style: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-2) var(--space-3)",
              flexWrap: "wrap",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-3)", flex: "1 1 16rem", minWidth: 0 }, children: [
                icon != null && /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    style: { display: "inline-flex", flexShrink: 0, paddingBlock: "var(--space-1)", color: "var(--color-semantic-label-alternative)" },
                    children: icon
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                  /* @__PURE__ */ jsx(
                    Heading,
                    {
                      style: {
                        margin: 0,
                        color: "var(--color-semantic-label-strong)",
                        fontSize: "var(--body1-size)",
                        lineHeight: "var(--body1-line)",
                        fontWeight: "var(--fw-bold)",
                        overflowWrap: "anywhere"
                      },
                      children: title
                    }
                  ),
                  description != null && /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label1-size)",
                        lineHeight: "var(--label1-line)",
                        overflowWrap: "anywhere"
                      },
                      children: description
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                StatusBadge,
                {
                  tone: resolvedStatusTone,
                  style: {
                    flex: "0 1 auto",
                    height: "auto",
                    minHeight: 20,
                    maxWidth: "100%",
                    paddingBlock: "var(--space-1)",
                    whiteSpace: "normal",
                    overflowWrap: "anywhere"
                  },
                  children: status
                }
              )
            ]
          }
        ),
        hasDetails && /* @__PURE__ */ jsx(
          "dl",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(10rem, 100%), 1fr))",
              gap: "var(--space-2) var(--space-4)",
              margin: 0,
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)"
            },
            children: details.map((detail, index) => /* @__PURE__ */ jsxs("div", { style: { display: "grid", alignContent: "start", gap: "var(--space-1)", minWidth: 0 }, children: [
              /* @__PURE__ */ jsx(
                "dt",
                {
                  style: {
                    color: "var(--color-semantic-label-alternative)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-semibold)"
                  },
                  children: detail.label
                }
              ),
              /* @__PURE__ */ jsx(
                "dd",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    minWidth: 0,
                    margin: 0,
                    color: "var(--color-semantic-label-normal)",
                    fontSize: "var(--label1-size)",
                    lineHeight: "var(--label1-line)",
                    fontWeight: "var(--fw-semibold)",
                    overflowWrap: "anywhere"
                  },
                  children: detail.value
                }
              )
            ] }, index))
          }
        ),
        hasFooter && /* @__PURE__ */ jsxs(
          "footer",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-2) var(--space-3)",
              flexWrap: "wrap",
              minWidth: 0,
              paddingTop: "var(--space-2)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)"
            },
            children: [
              meta != null && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    flex: "1 1 12rem",
                    minWidth: 0,
                    color: "var(--color-semantic-label-alternative)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    overflowWrap: "anywhere"
                  },
                  children: meta
                }
              ),
              actions != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }, children: actions })
            ]
          }
        )
      ]
    }
  );
}

export {
  EquipmentStatusCard
};
//# sourceMappingURL=chunk-NU7JCN3B.js.map