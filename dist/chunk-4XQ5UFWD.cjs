"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkUSSI3HR2cjs = require('./chunk-USSI3HR2.cjs');

// components/forms/DateRangeField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function dateTime(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  const time = parsed.getTime();
  return Number.isFinite(time) ? time : null;
}
function accessibleFieldLabel(label, explicitLabel, fallback) {
  if (explicitLabel) return explicitLabel;
  if (typeof label === "string" || typeof label === "number") return String(label);
  return fallback;
}
function DateRangeField({
  value,
  defaultValue = { start: null, end: null },
  onChange,
  startLabel = "\uC2DC\uC791\uC77C",
  endLabel = "\uC885\uB8CC\uC77C",
  startAccessibleLabel,
  endAccessibleLabel,
  groupLabel = "\uAE30\uAC04 \uC120\uD0DD",
  showFieldLabels = true,
  presets,
  invalid = false,
  errorMessage = "\uC885\uB8CC\uC77C\uC740 \uC2DC\uC791\uC77C\uBCF4\uB2E4 \uBE60\uB97C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
  size = "sm",
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internalValue, setInternalValue] = _react2.default.useState(defaultValue);
  const currentValue = isControlled ? _nullishCoalesce(value, () => ( { start: null, end: null })) : internalValue;
  const range = {
    start: _nullishCoalesce(_optionalChain([currentValue, 'optionalAccess', _ => _.start]), () => ( null)),
    end: _nullishCoalesce(_optionalChain([currentValue, 'optionalAccess', _2 => _2.end]), () => ( null))
  };
  const startTime = dateTime(range.start);
  const endTime = dateTime(range.end);
  const orderInvalid = startTime != null && endTime != null && startTime > endTime;
  const resolvedInvalid = invalid || orderInvalid;
  const messageId = _react2.default.useId();
  const resolvedStartAccessibleLabel = accessibleFieldLabel(startLabel, startAccessibleLabel, "\uC2DC\uC791\uC77C");
  const resolvedEndAccessibleLabel = accessibleFieldLabel(endLabel, endAccessibleLabel, "\uC885\uB8CC\uC77C");
  const update = (key, nextDate) => {
    const nextValue = { ...range, [key]: nextDate };
    if (!isControlled) setInternalValue(nextValue);
    _optionalChain([onChange, 'optionalCall', _3 => _3(nextValue)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "group",
      "aria-label": groupLabel,
      "aria-invalid": resolvedInvalid || void 0,
      "aria-describedby": resolvedInvalid ? messageId : void 0,
      "data-date-range-invalid": resolvedInvalid ? "true" : "false",
      style: { display: "grid", gap: "var(--space-2)", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        presets != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-date-range-presets": true, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: presets }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "var(--space-2)", minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            showFieldLabels && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--component-input-label-color)", fontSize: "var(--component-input-label-font-size)", fontWeight: "var(--component-input-label-font-weight)", lineHeight: "var(--component-input-label-line-height)" }, children: startLabel }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkUSSI3HR2cjs.DatePicker,
              {
                value: range.start,
                onChange: (nextDate) => update("start", nextDate),
                placeholder: resolvedStartAccessibleLabel,
                "aria-label": resolvedStartAccessibleLabel,
                size,
                disabled,
                full: true
              }
            )
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            showFieldLabels && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--component-input-label-color)", fontSize: "var(--component-input-label-font-size)", fontWeight: "var(--component-input-label-font-weight)", lineHeight: "var(--component-input-label-line-height)" }, children: endLabel }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkUSSI3HR2cjs.DatePicker,
              {
                value: range.end,
                onChange: (nextDate) => update("end", nextDate),
                placeholder: resolvedEndAccessibleLabel,
                "aria-label": resolvedEndAccessibleLabel,
                size,
                disabled,
                full: true
              }
            )
          ] })
        ] }),
        resolvedInvalid && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: messageId, role: "alert", style: { color: "var(--color-semantic-status-negative-text)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: errorMessage })
      ]
    }
  );
}



exports.DateRangeField = DateRangeField;
//# sourceMappingURL=chunk-4XQ5UFWD.cjs.map