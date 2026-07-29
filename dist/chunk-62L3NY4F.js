"use client";
import {
  normalizeBoundedValue
} from "./chunk-BVUTMUVR.js";

// components/status/Meter.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var THRESHOLD_FILL = {
  negative: "var(--color-semantic-status-negative)",
  cautionary: "var(--color-semantic-status-cautionary)",
  positive: "var(--color-semantic-status-positive)"
};
var THRESHOLD_TEXT = {
  negative: "var(--color-semantic-status-negative-text)",
  cautionary: "var(--color-semantic-status-cautionary-text)",
  positive: "var(--color-semantic-status-positive-text)"
};
var DEFAULT_THRESHOLD_LABELS = {
  negative: "\uC704\uD5D8",
  cautionary: "\uC8FC\uC758",
  positive: "\uC591\uD638"
};
var valueStyle = { fontVariantNumeric: "tabular-nums", color: "var(--color-semantic-label-alternative)" };
function Meter({
  value = 0,
  max = 100,
  label,
  thresholds,
  thresholdLabels,
  size = "md",
  showValue = true,
  style,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledBy,
  "aria-valuetext": ariaValueText,
  ...rest
}) {
  const rawId = React.useId();
  const labelId = `${rawId}-label`;
  const range = normalizeBoundedValue({ value, max });
  const safeMax = range.max;
  const pct = range.percent;
  const clampedValue = range.value;
  const band = thresholds ? pct <= thresholds.low ? "negative" : pct <= thresholds.high ? "cautionary" : "positive" : null;
  const bandLabel = band ? { ...DEFAULT_THRESHOLD_LABELS, ...thresholdLabels }[band] : null;
  const fill = band ? THRESHOLD_FILL[band] : "var(--color-semantic-primary-normal)";
  const height = size === "sm" ? 6 : 10;
  const valueText = `${clampedValue}/${safeMax}`;
  const hasVisibleLabel = label != null;
  const showCaption = hasVisibleLabel || showValue || bandLabel != null;
  return /* @__PURE__ */ jsxs("div", { style: { ...style }, ...rest, children: [
    showCaption && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: "var(--space-1-5)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-neutral)" }, children: [
      /* @__PURE__ */ jsx("span", { id: hasVisibleLabel ? labelId : void 0, children: label }),
      bandLabel == null ? showValue && /* @__PURE__ */ jsx("span", { style: valueStyle, children: valueText }) : /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "baseline", gap: 4, minWidth: 0 }, children: [
        showValue && /* @__PURE__ */ jsx("span", { style: valueStyle, children: valueText }),
        /* @__PURE__ */ jsx("span", { "data-meter-threshold": band, style: { color: THRESHOLD_TEXT[band], whiteSpace: "nowrap" }, children: bandLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "meter",
        "aria-label": ariaLabelProp ?? (hasVisibleLabel || ariaLabelledBy ? void 0 : "\uCE21\uC815\uAC12"),
        "aria-labelledby": ariaLabelledBy ?? (ariaLabelProp == null && hasVisibleLabel ? labelId : void 0),
        "aria-valuenow": clampedValue,
        "aria-valuemin": 0,
        "aria-valuemax": safeMax,
        "aria-valuetext": ariaValueText ?? (bandLabel != null ? `${valueText}, ${bandLabel}` : valueText),
        style: { position: "relative", height, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-fill-strong)", overflow: "hidden" },
        children: /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: fill, borderRadius: "var(--radius-pill)", transition: "width var(--dur-base) var(--ease-out)" } })
      }
    )
  ] });
}

export {
  Meter
};
//# sourceMappingURL=chunk-62L3NY4F.js.map