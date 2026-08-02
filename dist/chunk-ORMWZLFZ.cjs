"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";








var _chunkGYQC2LMQcjs = require('./chunk-GYQC2LMQ.cjs');

// components/forms/Textarea.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function usePlaceholderStyle() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-field-ph")) return;
    const el = document.createElement("style");
    el.id = "lk-field-ph";
    el.textContent = "[data-lds-field]::placeholder{color:var(--color-semantic-label-assistive);opacity:1}";
    document.head.appendChild(el);
  }, []);
}
function Textarea({
  label,
  helper,
  error,
  required = false,
  invalid = false,
  status = "normal",
  size = "md",
  interaction,
  active = false,
  focus = false,
  disable = false,
  resize = "normal",
  rows = 5,
  id,
  style,
  ...rest
}) {
  const autoId = _react2.default.useId();
  const taId = id || `ta-${autoId}`;
  const message = _nullishCoalesce(error, () => ( helper));
  const messageId = message != null ? `${taId}-message` : void 0;
  const [focused, setFocused] = _react2.default.useState(false);
  const [hover, setHover] = _react2.default.useState(false);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const disabled = !!rest.disabled || disable || interaction === "inactive";
  const readOnly = !!rest.readOnly;
  const activeFocus = focused || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const isInvalid = invalid || status === "negative" || error != null;
  usePlaceholderStyle();
  const ring = _chunkGYQC2LMQcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const minHeight = normalizedSize === "sm" ? 96 : normalizedSize === "lg" ? 160 : 120;
  const resizeMode = resize === "fixed" ? "none" : resize === "limit" ? "vertical" : "vertical";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-readonly": readOnly ? "true" : void 0, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGYQC2LMQcjs.FieldLabel, { htmlFor: taId, label, required }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "textarea",
        {
          id: taId,
          rows,
          "data-lds-field": "",
          ...rest,
          disabled,
          readOnly,
          required,
          "aria-describedby": _chunkGYQC2LMQcjs.mergeIds.call(void 0, rest["aria-describedby"], messageId),
          "aria-invalid": isInvalid || rest["aria-invalid"] || void 0,
          onFocus: (e) => {
            setFocused(true);
            rest.onFocus && rest.onFocus(e);
          },
          onBlur: (e) => {
            setFocused(false);
            rest.onBlur && rest.onBlur(e);
          },
          onMouseEnter: (e) => {
            setHover(true);
            rest.onMouseEnter && rest.onMouseEnter(e);
          },
          onMouseLeave: (e) => {
            setHover(false);
            rest.onMouseLeave && rest.onMouseLeave(e);
          },
          style: {
            width: "100%",
            resize: resizeMode,
            minHeight,
            maxHeight: resize === "limit" ? minHeight * 2 : void 0,
            padding: `var(--space-3) ${isInvalid || status === "positive" ? "var(--space-10)" : "var(--space-3)"} var(--space-3) var(--space-3)`,
            background: _chunkGYQC2LMQcjs.fieldBackground.call(void 0, { disabled, readOnly }),
            color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
            border: `var(--component-input-border-width) solid ${ring}`,
            borderRadius: "var(--component-input-radius)",
            boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
            transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
            fontFamily: "var(--font-sans)",
            ..._chunkGYQC2LMQcjs.fieldTypography.call(void 0, normalizedSize),
            outline: "none",
            boxSizing: "border-box",
            cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0
          }
        }
      ),
      (isInvalid || status === "positive") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: "var(--space-3)", right: "var(--space-3)", display: "inline-flex", pointerEvents: "none" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGYQC2LMQcjs.FieldStatusIcon, { invalid: isInvalid, status }) })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGYQC2LMQcjs.FieldMessage, { id: messageId, message, error, status })
  ] });
}



exports.Textarea = Textarea;
//# sourceMappingURL=chunk-ORMWZLFZ.cjs.map