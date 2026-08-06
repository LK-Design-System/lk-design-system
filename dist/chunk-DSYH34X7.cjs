"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/forms/field-shared.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
function mergeIds(...values) {
  const ids = values.flatMap((value) => String(value || "").split(/\s+/)).map((value) => value.trim()).filter(Boolean);
  return ids.length ? [...new Set(ids)].join(" ") : void 0;
}
function fieldTypography(size = "md") {
  const compact = size === "sm" || size === "small";
  return {
    fontSize: compact ? "var(--component-input-font-size-sm)" : "var(--component-input-font-size)",
    lineHeight: compact ? "var(--component-input-line-height-sm)" : "var(--component-input-line-height)",
    letterSpacing: compact ? "var(--component-input-letter-spacing-sm)" : "var(--component-input-letter-spacing)"
  };
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
function FieldLabel({ htmlFor, id, label, required = false, disabled = false, className, style, ...rest }) {
  if (label == null) return null;
  return _react2.default.createElement(
    "label",
    {
      ...rest,
      id,
      htmlFor,
      className,
      style: {
        // The enabled colour goes through the component-token seam, as the rest
        // of this label's type already does. Disabled stays semantic: the token
        // family has no disabled variant.
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-label-color)",
        fontSize: "var(--component-input-label-font-size)",
        lineHeight: "var(--component-input-label-line-height)",
        letterSpacing: "var(--component-input-label-letter-spacing)",
        fontWeight: "var(--component-input-label-font-weight)",
        ...style
      }
    },
    label,
    required && _react2.default.createElement("span", { style: { color: "var(--color-semantic-status-negative)" } }, " *")
  );
}
function FieldMessage({ id, message, error, status = "normal", className, style, ...rest }) {
  if (message == null) return null;
  return _react2.default.createElement(
    "span",
    {
      ...rest,
      id,
      role: error != null ? "alert" : void 0,
      className,
      style: {
        color: error != null || status === "negative" ? "var(--color-semantic-status-negative-text)" : status === "positive" ? "var(--color-semantic-status-positive-text)" : "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        ...style
      }
    },
    message
  );
}
var FieldStack = _react2.default.forwardRef(function FieldStack2({
  fieldId,
  labelId,
  label,
  required,
  messageId,
  message,
  error,
  status,
  fieldStyle,
  labelProps,
  messageProps,
  className,
  style,
  children,
  ...rest
}, forwardedRef) {
  return _react2.default.createElement(
    "div",
    // `position: relative` anchors the absolutely positioned screen-reader live
    // regions that fields render (Caps Lock warnings, copy results) to the field
    // instead of the page, without adding a grid row.
    {
      ...rest,
      ref: forwardedRef,
      className,
      style: { position: "relative", display: "grid", minWidth: 0, gap: "var(--component-input-stack-gap)", ...fieldStyle, ...style }
    },
    _react2.default.createElement(FieldLabel, { ...labelProps, htmlFor: fieldId, id: labelId, label, required }),
    children,
    _react2.default.createElement(FieldMessage, { ...messageProps, id: messageId, message, error, status })
  );
});
function FieldStatusIcon({ invalid = false, status = "normal", size = 16 }) {
  if (!invalid && status !== "positive") return null;
  const negative = invalid || status === "negative";
  return _react2.default.createElement(_chunk3ATRKSQ7cjs.Icon, {
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











exports.mergeIds = mergeIds; exports.fieldTypography = fieldTypography; exports.useFieldMetadata = useFieldMetadata; exports.FieldLabel = FieldLabel; exports.FieldMessage = FieldMessage; exports.FieldStack = FieldStack; exports.FieldStatusIcon = FieldStatusIcon; exports.fieldBorderColor = fieldBorderColor; exports.fieldBackground = fieldBackground;
//# sourceMappingURL=chunk-DSYH34X7.cjs.map