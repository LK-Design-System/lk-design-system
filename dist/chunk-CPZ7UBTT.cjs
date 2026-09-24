"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk7W3SIFDMcjs = require('./chunk-7W3SIFDM.cjs');


var _chunkGW3BLGYBcjs = require('./chunk-GW3BLGYB.cjs');





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');

// components/viz/TelemetryValue.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var EMPTY_VALUE_TEXT = /^[-‐-―]$/u;
var VALUE_TYPE = {
  vertical: { sm: { size: "var(--headline1-size)", line: 1.12 }, md: { size: "var(--heading2-size)", line: 1.12 } },
  horizontal: { sm: { size: "var(--label2-size)", line: "var(--label2-line)" }, md: { size: "var(--label1-size)", line: "var(--label1-line)" } }
};
var UNIT_TYPE = {
  vertical: { sm: 12, md: 13 },
  horizontal: { sm: "var(--caption2-size)", md: "var(--caption1-size)" }
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
  orientation = "vertical",
  size = "md",
  style,
  ...rest
}) {
  const resolvedTone = stale ? "cautionary" : tone;
  const hasCustomStatusLabel = statusLabel != null && statusLabel !== false && statusLabel !== "";
  const hasCustomStaleLabel = staleLabel != null && staleLabel !== false && staleLabel !== "";
  const resolvedStatusLabel = stale ? hasCustomStaleLabel ? staleLabel : "\uC9C0\uC5F0" : hasCustomStatusLabel ? statusLabel : tone === "neutral" ? null : _chunk7W3SIFDMcjs.TELEMETRY_STATUS_LABEL[tone];
  const showStatus = resolvedStatusLabel != null && (!stale || showStaleBadge);
  const inline = orientation === "horizontal";
  const density = size === "sm" ? "sm" : "md";
  const valueType = VALUE_TYPE[inline ? "horizontal" : "vertical"][density];
  const unitSize = UNIT_TYPE[inline ? "horizontal" : "vertical"][density];
  const justifyContent = align === "end" ? "flex-end" : "flex-start";
  const normalizedValue = _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, value);
  const normalizedUnit = _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  const empty = normalizedValue === "" || EMPTY_VALUE_TEXT.test(normalizedValue);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-tone": resolvedTone,
      "data-stale": stale ? "true" : void 0,
      "data-orientation": inline ? "horizontal" : "vertical",
      "data-empty": empty ? "true" : void 0,
      style: {
        // Horizontal is one wrapping row so the pair still reflows at 320px
        // instead of overflowing the strip it was put in.
        ...inline ? { display: "flex", alignItems: "center", justifyContent, columnGap: "var(--space-1-5)", rowGap: "var(--space-0-5)", flexWrap: "wrap" } : { display: "grid", gap: "var(--space-1)", justifyItems: align === "end" ? "end" : "start" },
        maxWidth: "100%",
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        ...style
      },
      ...rest,
      children: [
        label != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: inline ? "var(--caption1-line)" : 1.35, fontWeight: "var(--fw-bold)", overflowWrap: "anywhere", textAlign: align === "end" ? "right" : "left" }, children: label }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent, columnGap: "var(--space-2)", rowGap: "var(--space-1)", maxWidth: "100%", minWidth: 0, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "strong",
            {
              "data-telemetry-value-lockup": "",
              "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
              style: { display: "inline-block", maxWidth: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: stale || empty ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-strong)", fontSize: valueType.size, lineHeight: valueType.line, fontWeight: empty ? "var(--fw-bold)" : "var(--fw-extra)", fontVariantNumeric: "tabular-nums" },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: normalizedValue }),
                normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: unitSize, lineHeight: 1.25, fontWeight: "var(--fw-bold)" }, children: [
                  unitSeparator,
                  normalizedUnit
                ] })
              ]
            }
          ),
          showStatus && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGW3BLGYBcjs.StatusBadge, { tone: resolvedTone, children: resolvedStatusLabel })
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
//# sourceMappingURL=chunk-CPZ7UBTT.cjs.map