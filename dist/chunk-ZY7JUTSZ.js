"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";

// components/data/BarChart.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function nodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(" ");
  if (React.isValidElement(node)) return nodeText(node.props.children);
  return "";
}
function joinIds(...ids) {
  return ids.filter(Boolean).join(" ") || void 0;
}
function BarChart({
  data = [],
  height = 160,
  gap = 12,
  showValue = true,
  color = "var(--color-semantic-primary-normal)",
  description,
  summary,
  emptyLabel = "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...rest
}) {
  const rawId = React.useId();
  const descriptionId = `${rawId}-description`;
  const summaryId = `${rawId}-summary`;
  const values = data.map((datum) => {
    const value = Number(datum.value);
    return Number.isFinite(value) ? value : 0;
  });
  const max = Math.max(...values.map((value) => Math.max(0, value)), 1);
  const hasData = data.length > 0;
  const automaticSummary = hasData ? data.map((datum, index) => {
    const label = datum.accessibleLabel || nodeText(datum.label) || `\uD56D\uBAA9 ${index + 1}`;
    return `${label}: ${values[index]}`;
  }).join(", ") : nodeText(emptyLabel) || "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
  const resolvedSummary = summary ?? automaticSummary;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "img",
      "aria-label": ariaLabel || "\uB9C9\uB300 \uCC28\uD2B8",
      "aria-describedby": joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId),
      "data-chart-type": "bar",
      style: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: hasData ? "flex-start" : "center",
        gap,
        height,
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        description != null && /* @__PURE__ */ jsx(VisuallyHidden, { id: descriptionId, children: description }),
        resolvedSummary != null && /* @__PURE__ */ jsx(VisuallyHidden, { id: summaryId, "data-chart-summary": true, children: resolvedSummary }),
        !hasData && /* @__PURE__ */ jsx(
          "span",
          {
            "data-chart-empty": true,
            style: {
              alignSelf: "center",
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              textAlign: "center"
            },
            children: emptyLabel
          }
        ),
        data.map((datum, index) => {
          const value = values[index];
          const barHeight = `${Math.max(0, value) / max * 100}%`;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                height: "100%",
                justifyContent: "flex-end"
              },
              children: [
                showValue && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: datum.value }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    "data-bar-value": value,
                    style: {
                      width: "100%",
                      maxWidth: 48,
                      height: barHeight,
                      minHeight: 2,
                      background: datum.color || color,
                      borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                      transition: "height var(--dur-slow) var(--ease-out)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "data-chart-label": true,
                    style: {
                      width: "100%",
                      minWidth: 0,
                      color: "var(--color-semantic-label-alternative)",
                      fontSize: "var(--caption1-size)",
                      lineHeight: "var(--caption1-line)",
                      overflowWrap: "anywhere",
                      textAlign: "center",
                      whiteSpace: "normal"
                    },
                    children: datum.label
                  }
                )
              ]
            },
            datum.id ?? index
          );
        })
      ]
    }
  );
}

export {
  BarChart
};
//# sourceMappingURL=chunk-ZY7JUTSZ.js.map