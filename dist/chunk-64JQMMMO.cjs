"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/field-shared.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
function mergeIds(...values) {
  const ids = values.flatMap((value) => String(value || "").split(/\s+/)).map((value) => value.trim()).filter(Boolean);
  return ids.length ? [...new Set(ids)].join(" ") : void 0;
}
function useFieldMetadata({ prefix, id, label, helper, error, describedBy }) {
  const autoId = _react2.default.useId();
  const fieldId = _nullishCoalesce(id, () => ( `${prefix}-${autoId}`));
  const message = _nullishCoalesce(error, () => ( helper));
  const messageId = message != null ? `${fieldId}-message` : void 0;
  return {
    fieldId,
    message,
    messageId,
    describedBy: mergeIds(describedBy, messageId),
    hasMetadata: label != null || message != null
  };
}
function FieldLabel({ htmlFor, id, label, required = false, disabled = false }) {
  if (label == null) return null;
  return _react2.default.createElement(
    "label",
    {
      id,
      htmlFor,
      style: {
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        fontSize: "var(--component-input-label-font-size)",
        lineHeight: "var(--component-input-label-line-height)",
        letterSpacing: "var(--component-input-label-letter-spacing)",
        fontWeight: "var(--component-input-label-font-weight)"
      }
    },
    label,
    required && _react2.default.createElement("span", { style: { color: "var(--color-semantic-status-negative)" } }, " *")
  );
}
function FieldMessage({ id, message, error, status = "normal" }) {
  if (message == null) return null;
  return _react2.default.createElement(
    "span",
    {
      id,
      role: error != null ? "alert" : void 0,
      style: {
        color: error != null || status === "negative" ? "var(--color-semantic-status-negative-text)" : status === "positive" ? "var(--color-semantic-status-positive-text)" : "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)"
      }
    },
    message
  );
}
function FieldStack({ fieldId, labelId, label, required, messageId, message, error, status, fieldStyle, children }) {
  return _react2.default.createElement(
    "div",
    { style: { display: "grid", minWidth: 0, gap: "var(--component-input-stack-gap)", ...fieldStyle } },
    _react2.default.createElement(FieldLabel, { htmlFor: fieldId, id: labelId, label, required }),
    children,
    _react2.default.createElement(FieldMessage, { id: messageId, message, error, status })
  );
}
function FieldStatusIcon({ invalid = false, status = "normal", size = 16 }) {
  if (!invalid && status !== "positive") return null;
  const negative = invalid || status === "negative";
  return _react2.default.createElement(_chunkVGM7HVYYcjs.Icon, {
    name: negative ? "circle-close-fill" : "circle-check-fill",
    size,
    color: negative ? "var(--color-semantic-status-negative)" : "var(--color-semantic-status-positive)",
    "aria-hidden": "true",
    style: { flex: "0 0 auto" }
  });
}
function fieldBorderColor({ disabled = false, readOnly = false, invalid = false, status = "normal", focused = false, hovered = false }) {
  if (disabled) return "var(--color-semantic-line-normal-neutral)";
  if (invalid || status === "negative") return "var(--component-input-border-color-invalid)";
  if (status === "positive") return "var(--color-semantic-status-positive)";
  if (focused) return "var(--component-input-border-color-focus)";
  if (hovered && !readOnly) return "var(--color-semantic-line-solid-normal)";
  return "var(--component-input-border-color)";
}
function fieldBackground({ disabled = false, readOnly = false }) {
  if (disabled) return "var(--color-semantic-fill-normal)";
  if (readOnly) return "var(--color-semantic-fill-alternative)";
  return "var(--color-semantic-background-elevated-normal)";
}










exports.mergeIds = mergeIds; exports.useFieldMetadata = useFieldMetadata; exports.FieldLabel = FieldLabel; exports.FieldMessage = FieldMessage; exports.FieldStack = FieldStack; exports.FieldStatusIcon = FieldStatusIcon; exports.fieldBorderColor = fieldBorderColor; exports.fieldBackground = fieldBackground;
//# sourceMappingURL=chunk-64JQMMMO.cjs.map