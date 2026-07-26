"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";

// components/data/DonutChart.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PALETTE = [
  "var(--color-semantic-data-viz-series-1)",
  "var(--color-semantic-data-viz-series-2)",
  "var(--color-semantic-data-viz-series-3)",
  "var(--color-semantic-data-viz-series-4)",
  "var(--color-semantic-data-viz-series-5)",
  "var(--color-semantic-data-viz-series-6)"
];
function nodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(" ");
  if (React.isValidElement(node)) return nodeText(node.props.children);
  return "";
}
function joinIds(...ids) {
  return ids.filter(Boolean).join(" ") || void 0;
}
function numericValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}
function DonutChart({
  segments = [],
  size = 140,
  thickness = 18,
  showTotal = true,
  centerLabel,
  legend = true,
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
  const values = segments.map((segment) => numericValue(segment.value));
  const total = values.reduce((sum, value) => sum + value, 0);
  const hasSegments = segments.length > 0;
  const hasPositiveTotal = total > 0;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const automaticSummary = !hasSegments ? nodeText(emptyLabel) || "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." : `\uD569\uACC4 ${total}. ${segments.map((segment, index) => {
    const label = segment.accessibleLabel || nodeText(segment.label) || `\uD56D\uBAA9 ${index + 1}`;
    const percentage = hasPositiveTotal ? Math.round(values[index] / total * 100) : 0;
    return `${label}: ${values[index]} (${percentage}%)`;
  }).join(", ")}`;
  const resolvedSummary = summary ?? automaticSummary;
  const centerContent = centerLabel != null ? centerLabel : !hasSegments ? emptyLabel : showTotal ? total : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "img",
      "aria-label": ariaLabel || "\uB3C4\uB11B \uCC28\uD2B8",
      "aria-describedby": joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId),
      "data-chart-type": "donut",
      "data-zero-sum": hasSegments && !hasPositiveTotal ? "true" : void 0,
      style: { display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 20, minWidth: 0, maxWidth: "100%", ...style },
      ...rest,
      children: [
        description != null && /* @__PURE__ */ jsx(VisuallyHidden, { id: descriptionId, children: description }),
        resolvedSummary != null && /* @__PURE__ */ jsx(VisuallyHidden, { id: summaryId, "data-chart-summary": true, children: resolvedSummary }),
        /* @__PURE__ */ jsxs("span", { style: { position: "relative", width: size, height: size, flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", focusable: "false", width: size, height: size, style: { display: "block", transform: "rotate(-90deg)" }, children: [
            /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--color-semantic-fill-strong)", strokeWidth: thickness }),
            hasPositiveTotal && segments.map((segment, index) => {
              const value = values[index];
              if (value <= 0) return null;
              const dash = value / total * circ;
              const el = /* @__PURE__ */ jsx(
                "circle",
                {
                  "data-donut-segment": true,
                  cx: size / 2,
                  cy: size / 2,
                  r,
                  fill: "none",
                  stroke: segment.color || PALETTE[index % PALETTE.length],
                  strokeWidth: thickness,
                  strokeDasharray: `${dash} ${circ - dash}`,
                  strokeDashoffset: -offset
                },
                segment.id ?? index
              );
              offset += dash;
              return el;
            })
          ] }),
          centerContent != null && /* @__PURE__ */ jsx(
            "span",
            {
              "data-chart-center-value": true,
              "data-chart-empty": !hasSegments ? true : void 0,
              style: {
                position: "absolute",
                inset: thickness,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                fontFamily: "var(--font-sans)",
                fontSize: !hasSegments ? "var(--caption1-size)" : size * 0.2,
                fontWeight: !hasSegments ? "var(--fw-medium)" : "var(--fw-extra)",
                lineHeight: 1.25,
                textAlign: "center",
                overflowWrap: "anywhere",
                color: !hasSegments ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-normal)",
                fontVariantNumeric: "tabular-nums"
              },
              children: centerContent
            }
          )
        ] }),
        legend && segments.length > 0 && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { display: "flex", flex: "1 1 132px", minWidth: 0, flexDirection: "column", gap: 8 }, children: segments.map((segment, index) => {
          const percentage = hasPositiveTotal ? Math.round(values[index] / total * 100) : 0;
          return /* @__PURE__ */ jsxs("span", { style: { display: "grid", gridTemplateColumns: "10px minmax(0, 1fr) auto", alignItems: "center", gap: 8, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", color: "var(--color-semantic-label-neutral)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: 10, height: 10, borderRadius: 3, background: segment.color || PALETTE[index % PALETTE.length] } }),
            /* @__PURE__ */ jsx("span", { "data-chart-label": true, style: { minWidth: 0, lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: segment.label }),
            /* @__PURE__ */ jsxs("b", { style: { marginLeft: "var(--space-0-5)", color: "var(--color-semantic-label-normal)", fontVariantNumeric: "tabular-nums" }, children: [
              percentage,
              "%"
            ] })
          ] }, segment.id ?? index);
        }) })
      ]
    }
  );
}

export {
  DonutChart
};
//# sourceMappingURL=chunk-D4DPVOUZ.js.map