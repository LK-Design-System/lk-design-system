"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk7W3SIFDMcjs = require('./chunk-7W3SIFDM.cjs');


var _chunkQP4A6TUQcjs = require('./chunk-QP4A6TUQ.cjs');


var _chunk42UHASGCcjs = require('./chunk-42UHASGC.cjs');






var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');

// components/viz/TelemetryGauge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var TONE = {
  signal: "var(--color-semantic-status-info-text)",
  positive: "var(--color-semantic-status-positive-text)",
  cautionary: "var(--color-semantic-status-cautionary-text)",
  negative: "var(--color-semantic-status-negative-text)"
};
function thresholdTone(percent, thresholds) {
  if (!thresholds) return void 0;
  const low = Math.min(thresholds.low, thresholds.high);
  const high = Math.max(thresholds.low, thresholds.high);
  const direction = _nullishCoalesce(thresholds.direction, () => ( "higher-is-better"));
  if (direction === "lower-is-better") {
    if (percent >= high) return "negative";
    if (percent >= low) return "cautionary";
    return "positive";
  }
  if (percent <= low) return "negative";
  if (percent <= high) return "cautionary";
  return "positive";
}
function formatValue(value, precision) {
  if (precision == null) return String(value);
  const safePrecision = Math.max(0, Math.min(20, Math.trunc(precision)));
  return value.toFixed(safePrecision);
}
function TelemetryGauge({
  value = 0,
  min = 0,
  max = 100,
  unit = "",
  label,
  size = 120,
  thickness = 10,
  thresholds,
  tone,
  statusLabel,
  precision,
  formatter,
  valueText,
  style,
  ...rest
}) {
  const generatedId = _react2.default.useId();
  const labelId = `telemetry-gauge-${generatedId.replace(/:/g, "")}`;
  const {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rootProps
  } = rest;
  const range = _chunkQP4A6TUQcjs.normalizeBoundedValue.call(void 0, { value, min, max });
  const resolvedMin = range.min;
  const resolvedMax = range.max;
  const resolvedValue = range.value;
  const pct = range.ratio;
  const inferredTone = thresholdTone(pct * 100, thresholds);
  const resolvedTone = tone || inferredTone || "signal";
  const hasCustomStatusLabel = statusLabel != null && statusLabel !== false && statusLabel !== "";
  const resolvedStatusLabel = hasCustomStatusLabel ? statusLabel : tone != null || inferredTone != null ? _chunk7W3SIFDMcjs.TELEMETRY_STATUS_LABEL[resolvedTone] : null;
  const normalizedUnit = _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  const formattedNumber = formatValue(resolvedValue, precision);
  const formatterResult = typeof formatter === "function" ? formatter(resolvedValue, { min: resolvedMin, max: resolvedMax, unit: normalizedUnit }) : formattedNumber;
  const renderedValue = typeof formatterResult === "string" || typeof formatterResult === "number" ? _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, formatterResult) : formattedNumber;
  const baseValueText = _chunk43Q7GJUBcjs.formatValueWithUnit.call(void 0, renderedValue, normalizedUnit);
  const resolvedValueText = valueText != null ? _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, valueText) : typeof resolvedStatusLabel === "string" ? `${baseValueText}, ${resolvedStatusLabel}` : baseValueText;
  const accessibleLabelledBy = _nullishCoalesce(ariaLabelledBy, () => ( (ariaLabel == null && label != null ? labelId : void 0)));
  const accessibleLabel = accessibleLabelledBy ? void 0 : _nullishCoalesce(ariaLabel, () => ( (typeof label === "string" ? label : "\uD154\uB808\uBA54\uD2B8\uB9AC \uAC12")));
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "inline-grid",
        justifyItems: "center",
        gap: "var(--space-2)",
        maxWidth: "100%",
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rootProps,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            role: "meter",
            "aria-label": accessibleLabel,
            "aria-labelledby": accessibleLabelledBy,
            "aria-describedby": ariaDescribedBy,
            "aria-valuemin": resolvedMin,
            "aria-valuemax": resolvedMax,
            "aria-valuenow": resolvedValue,
            "aria-valuetext": resolvedValueText,
            style: { position: "relative", width: size, height: size, maxWidth: "100%" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "svg",
                {
                  "aria-hidden": "true",
                  width: size,
                  height: size,
                  viewBox: `0 0 ${size} ${size}`,
                  style: { display: "block", transform: "rotate(135deg)" },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "circle",
                      {
                        cx: center,
                        cy: center,
                        r: radius,
                        fill: "none",
                        stroke: "var(--color-semantic-fill-strong)",
                        strokeWidth: thickness,
                        strokeLinecap: "round",
                        strokeDasharray: `${arcLength} ${circumference}`
                      }
                    ),
                    pct > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "circle",
                      {
                        cx: center,
                        cy: center,
                        r: radius,
                        fill: "none",
                        stroke: TONE[resolvedTone] || TONE.signal,
                        strokeWidth: thickness,
                        strokeLinecap: "round",
                        strokeDasharray: `${arcLength * pct} ${circumference}`,
                        style: { transition: "stroke-dasharray var(--dur-slow) var(--ease-out), stroke var(--dur-base) var(--ease-out)" }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", minWidth: 0 }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "strong",
                {
                  "data-telemetry-gauge-lockup": "",
                  "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
                  style: { display: "inline-block", maxWidth: "82%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-strong)", fontSize: size * 0.24, lineHeight: 1, fontWeight: "var(--fw-extra)", fontVariantNumeric: "tabular-nums", textAlign: "center" },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue }),
                    normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: Math.max(12, size * 0.11), lineHeight: 1.2, fontWeight: "var(--fw-semibold)" }, children: [
                      unitSeparator,
                      normalizedUnit
                    ] })
                  ]
                }
              ) })
            ]
          }
        ),
        (label != null || resolvedStatusLabel != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)", maxWidth: "100%", minWidth: 0, flexWrap: "wrap" }, children: [
          label != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: labelId, style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: 1.35, fontWeight: "var(--fw-bold)", overflowWrap: "anywhere", textAlign: "center" }, children: label }),
          resolvedStatusLabel != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk42UHASGCcjs.StatusBadge, { tone: resolvedTone, children: resolvedStatusLabel })
        ] })
      ]
    }
  );
}



exports.TelemetryGauge = TelemetryGauge;
//# sourceMappingURL=chunk-PGJGTT26.cjs.map