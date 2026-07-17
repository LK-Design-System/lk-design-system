"use client";
import {
  TELEMETRY_STATUS_LABEL
} from "./chunk-JYEXELIP.js";
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText
} from "./chunk-WIUSXU3M.js";
import {
  StatusBadge
} from "./chunk-BNPFEXZC.js";

// components/viz/TelemetryValue.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TelemetryValue({
  label,
  value,
  unit,
  tone = "neutral",
  statusLabel,
  timestamp,
  stale = false,
  staleLabel = "\uC9C0\uC5F0",
  showStaleBadge = true,
  helper,
  align = "start",
  size = "md",
  style,
  ...rest
}) {
  const resolvedTone = stale ? "cautionary" : tone;
  const hasCustomStatusLabel = statusLabel != null && statusLabel !== false && statusLabel !== "";
  const hasCustomStaleLabel = staleLabel != null && staleLabel !== false && staleLabel !== "";
  const resolvedStatusLabel = stale ? hasCustomStaleLabel ? staleLabel : "\uC9C0\uC5F0" : hasCustomStatusLabel ? statusLabel : tone === "neutral" ? null : TELEMETRY_STATUS_LABEL[tone];
  const showStatus = resolvedStatusLabel != null && (!stale || showStaleBadge);
  const valueSize = size === "sm" ? "var(--headline1-size)" : "var(--heading2-size)";
  const justifyContent = align === "end" ? "flex-end" : "flex-start";
  const normalizedValue = normalizeValueText(value);
  const normalizedUnit = normalizeUnit(unit);
  const unitSeparator = getUnitSeparator(normalizedUnit);
  const attachedUnit = isAttachedUnit(normalizedUnit);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-tone": resolvedTone,
      "data-stale": stale ? "true" : void 0,
      style: {
        display: "grid",
        gap: "var(--space-1)",
        justifyItems: align === "end" ? "end" : "start",
        maxWidth: "100%",
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        ...style
      },
      ...rest,
      children: [
        label != null && /* @__PURE__ */ jsx("span", { style: { maxWidth: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: 1.35, fontWeight: "var(--fw-bold)", overflowWrap: "anywhere", textAlign: align === "end" ? "right" : "left" }, children: label }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent, columnGap: "var(--space-2)", rowGap: "var(--space-1)", maxWidth: "100%", minWidth: 0, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs(
            "strong",
            {
              "data-telemetry-value-lockup": "",
              "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
              style: { display: "inline-block", maxWidth: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: stale ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-strong)", fontSize: valueSize, lineHeight: 1.12, fontWeight: "var(--fw-extra)", fontVariantNumeric: "tabular-nums" },
              children: [
                /* @__PURE__ */ jsx("span", { children: normalizedValue }),
                normalizedUnit !== "" && /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: size === "sm" ? 12 : 13, lineHeight: 1.25, fontWeight: "var(--fw-bold)" }, children: [
                  unitSeparator,
                  normalizedUnit
                ] })
              ]
            }
          ),
          showStatus && /* @__PURE__ */ jsx(StatusBadge, { tone: resolvedTone, children: resolvedStatusLabel })
        ] }),
        (helper != null || timestamp != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent, columnGap: "var(--space-2)", rowGap: 2, maxWidth: "100%", minWidth: 0, flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption2-size)", lineHeight: 1.4, fontVariantNumeric: "tabular-nums", textAlign: align === "end" ? "right" : "left" }, children: [
          helper != null && /* @__PURE__ */ jsx("span", { style: { maxWidth: "100%", overflowWrap: "anywhere" }, children: helper }),
          helper != null && timestamp != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
          timestamp != null && /* @__PURE__ */ jsx("span", { style: { maxWidth: "100%", overflowWrap: "anywhere" }, children: timestamp })
        ] })
      ]
    }
  );
}

export {
  TelemetryValue
};
//# sourceMappingURL=chunk-QAKLC4KP.js.map