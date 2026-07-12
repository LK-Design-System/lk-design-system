"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');

// components/viz/TelemetryValue.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_LABEL = {
  signal: "\uC815\uBCF4",
  positive: "\uC815\uC0C1",
  cautionary: "\uC8FC\uC758",
  negative: "\uC704\uD5D8"
};
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
  const resolvedStatusLabel = stale ? hasCustomStaleLabel ? staleLabel : "\uC9C0\uC5F0" : hasCustomStatusLabel ? statusLabel : tone === "neutral" ? null : STATUS_LABEL[tone];
  const showStatus = resolvedStatusLabel != null && (!stale || showStaleBadge);
  const valueSize = size === "sm" ? "var(--headline1-size)" : "var(--heading2-size)";
  const justifyContent = align === "end" ? "flex-end" : "flex-start";
  const normalizedValue = _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, value);
  const normalizedUnit = _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
        label != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: 1.35, fontWeight: "var(--fw-bold)", overflowWrap: "anywhere", textAlign: align === "end" ? "right" : "left" }, children: label }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent, columnGap: "var(--space-2)", rowGap: "var(--space-1)", maxWidth: "100%", minWidth: 0, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "strong",
            {
              "data-telemetry-value-lockup": "",
              "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
              style: { display: "inline-block", maxWidth: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: stale ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-strong)", fontSize: valueSize, lineHeight: 1.12, fontWeight: "var(--fw-extra)", fontVariantNumeric: "tabular-nums" },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: normalizedValue }),
                normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: size === "sm" ? 12 : 13, lineHeight: 1.25, fontWeight: "var(--fw-bold)" }, children: [
                  unitSeparator,
                  normalizedUnit
                ] })
              ]
            }
          ),
          showStatus && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: resolvedTone, children: resolvedStatusLabel })
        ] }),
        (helper != null || timestamp != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent, columnGap: "var(--space-2)", rowGap: 2, maxWidth: "100%", minWidth: 0, flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption2-size)", lineHeight: 1.4, fontVariantNumeric: "tabular-nums", textAlign: align === "end" ? "right" : "left" }, children: [
          helper != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: "100%", overflowWrap: "anywhere" }, children: helper }),
          helper != null && timestamp != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: "\xB7" }),
          timestamp != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: "100%", overflowWrap: "anywhere" }, children: timestamp })
        ] })
      ]
    }
  );
}



exports.TelemetryValue = TelemetryValue;
//# sourceMappingURL=chunk-IMXH76BF.cjs.map