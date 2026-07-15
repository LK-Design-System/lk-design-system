"use client";
import {
  StatusBadge
} from "./chunk-BNPFEXZC.js";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";
import {
  Skeleton
} from "./chunk-D3D5ODOC.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/cards/MetricCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CHANGE_COLOR = {
  positive: "var(--color-semantic-status-positive-text)",
  negative: "var(--color-semantic-status-negative-text)",
  cautionary: "var(--color-semantic-status-cautionary-text)",
  neutral: "var(--color-semantic-label-alternative)"
};
var CHANGE_LABEL = {
  positive: "\uAC1C\uC120",
  negative: "\uC545\uD654",
  cautionary: "\uC8FC\uC758",
  neutral: "\uC911\uB9BD"
};
function resolveDirection(delta, deltaTone, changeDirection) {
  if (changeDirection && changeDirection !== "auto") return changeDirection;
  if (deltaTone !== "auto") return deltaTone;
  return typeof delta === "number" ? delta > 0 ? "up" : delta < 0 ? "down" : "flat" : "flat";
}
function resolveChangeTone(direction, changeTone) {
  if (changeTone) return changeTone;
  if (direction === "up") return "positive";
  if (direction === "down") return "negative";
  return "neutral";
}
function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaTone = "auto",
  changeDirection = "auto",
  changeTone,
  changeToneLabel,
  period,
  baseline,
  caption,
  lastUpdated,
  action,
  icon,
  loading = false,
  loadingLabel = "\uC9C0\uD45C\uB97C \uBD88\uB7EC\uC624\uB294 \uC911",
  empty = false,
  emptyLabel = "\uD45C\uC2DC\uD560 \uC9C0\uD45C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  error,
  stale = false,
  staleLabel = "\uC624\uB798\uB41C \uB370\uC774\uD130",
  style,
  role = "group",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const direction = resolveDirection(delta, deltaTone, changeDirection);
  const semanticTone = resolveChangeTone(direction, changeTone);
  const deltaColor = CHANGE_COLOR[semanticTone] || CHANGE_COLOR.neutral;
  const deltaText = typeof delta === "number" ? `${delta > 0 ? "+" : ""}${delta}%` : delta;
  const semanticLabel = changeToneLabel !== void 0 ? changeToneLabel : changeTone ? CHANGE_LABEL[semanticTone] : null;
  const rawId = React.useId();
  const labelId = `${rawId}-label`;
  const hasError = error !== void 0 && error !== null && error !== false;
  const errorContent = error === true ? "\uC9C0\uD45C\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." : error;
  const state = loading ? "loading" : hasError ? "error" : empty ? "empty" : stale ? "stale" : "ready";
  const showFooter = !loading && (stale || lastUpdated != null || action != null);
  let body;
  if (loading) {
    body = /* @__PURE__ */ jsxs("div", { "data-metric-resource-state": "loading", role: "status", "aria-live": "polite", style: { display: "grid", gap: "var(--space-3)" }, children: [
      /* @__PURE__ */ jsx(VisuallyHidden, { children: loadingLabel }),
      /* @__PURE__ */ jsx(Skeleton, { width: "58%", height: 32 }),
      /* @__PURE__ */ jsx(Skeleton, { variant: "text", length: "72%", height: 12 })
    ] });
  } else if (hasError) {
    body = /* @__PURE__ */ jsx("div", { "data-metric-resource-state": "error", role: "alert", style: { minHeight: 58, display: "flex", alignItems: "center", color: "var(--color-semantic-status-negative-text)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-medium)" }, children: errorContent });
  } else if (empty) {
    body = /* @__PURE__ */ jsx("div", { "data-metric-resource-state": "empty", role: "status", style: { minHeight: 58, display: "flex", alignItems: "center", color: "var(--color-semantic-label-alternative)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-medium)" }, children: emptyLabel });
  } else {
    body = /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-2)", minWidth: 0 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("span", { "data-metric-value": true, style: { minWidth: 0, fontSize: "var(--title1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", lineHeight: 1, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }, children: value }),
        unit != null && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", fontWeight: "var(--fw-semibold)" }, children: unit })
      ] }),
      (delta != null || period != null || baseline != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
        delta != null && /* @__PURE__ */ jsxs(
          "span",
          {
            "data-change-direction": direction,
            "data-change-tone": semanticTone,
            style: { display: "inline-flex", alignItems: "center", gap: 3, color: deltaColor, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", whiteSpace: "nowrap" },
            children: [
              (direction === "up" || direction === "down") && /* @__PURE__ */ jsx(Icon, { name: direction === "up" ? "arrow-up" : "arrow-down", size: 14, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: deltaText }),
              semanticLabel != null && /* @__PURE__ */ jsxs("span", { style: { fontWeight: "var(--fw-semibold)" }, children: [
                "\xB7 ",
                semanticLabel
              ] })
            ]
          }
        ),
        period != null && /* @__PURE__ */ jsx("span", { "data-metric-period": true, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)" }, children: period }),
        baseline != null && /* @__PURE__ */ jsxs("span", { "data-metric-baseline": true, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)" }, children: [
          "\uAE30\uC900 ",
          baseline
        ] })
      ] }),
      caption != null && /* @__PURE__ */ jsx("div", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: caption })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy || (!ariaLabel && label != null ? labelId : void 0),
      "aria-busy": loading || void 0,
      "data-metric-state": state,
      style: {
        display: "grid",
        alignContent: "start",
        minWidth: 0,
        boxSizing: "border-box",
        background: "var(--component-card-bg)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        padding: "22px 24px",
        boxShadow: "var(--shadow-xs)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, minWidth: 0, marginBottom: 14 }, children: [
          label != null && /* @__PURE__ */ jsx("span", { id: labelId, style: { minWidth: 0, fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)", letterSpacing: "1.4px", textTransform: "uppercase", overflowWrap: "anywhere", color: "var(--color-semantic-label-alternative)" }, children: label }),
          icon && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-primary-normal)", display: "inline-flex" }, children: icon })
        ] }),
        body,
        showFooter && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--color-semantic-line-normal-alternative)" }, children: [
          (stale || lastUpdated != null) && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
            stale && /* @__PURE__ */ jsx(StatusBadge, { tone: "cautionary", children: staleLabel }),
            lastUpdated != null && /* @__PURE__ */ jsxs("span", { "data-metric-last-updated": true, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: [
              /* @__PURE__ */ jsx(VisuallyHidden, { children: "\uB9C8\uC9C0\uB9C9 \uC5C5\uB370\uC774\uD2B8 " }),
              lastUpdated
            ] })
          ] }),
          action != null && /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", marginLeft: "auto" }, children: action })
        ] })
      ]
    }
  );
}

export {
  MetricCard
};
//# sourceMappingURL=chunk-JOGJ3UYW.js.map