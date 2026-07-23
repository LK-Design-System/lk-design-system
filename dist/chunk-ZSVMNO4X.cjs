"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";







var _chunk3NOYASLPcjs = require('./chunk-3NOYASLP.cjs');

// components/forms/Input.jsx
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
function Input({
  label,
  helper,
  error,
  iconLeft,
  iconRight,
  actionRight,
  leadingIcon,
  trailingIcon,
  trailingButton,
  invalid = false,
  required = false,
  status = "normal",
  size = "md",
  height,
  interaction,
  active = false,
  focus = false,
  disable = false,
  resize,
  platform,
  variant,
  id,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const autoId = _react2.default.useId();
  const inputId = id || `in-${autoId}`;
  const message = _nullishCoalesce(error, () => ( helper));
  const messageId = message != null ? `${inputId}-message` : void 0;
  const [focused, setFocused] = _react2.default.useState(false);
  const [hover, setHover] = _react2.default.useState(false);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const disabled = !!rest.disabled || disable || interaction === "inactive";
  const readOnly = !!rest.readOnly;
  const activeFocus = focused || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const isInvalid = invalid || status === "negative" || error != null;
  usePlaceholderStyle();
  const ring = _chunk3NOYASLPcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const h = height || (normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--component-input-height)");
  const startIcon = _nullishCoalesce(leadingIcon, () => ( iconLeft));
  const endIcon = _nullishCoalesce(trailingIcon, () => ( iconRight));
  const endAction = _nullishCoalesce(trailingButton, () => ( actionRight));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-readonly": readOnly ? "true" : void 0, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3NOYASLPcjs.FieldLabel, { htmlFor: inputId, label, required, disabled }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "var(--component-input-gap)",
          height: h,
          padding: "0 var(--component-input-padding-x)",
          background: _chunk3NOYASLPcjs.fieldBackground.call(void 0, { disabled, readOnly }),
          border: `var(--component-input-border-width) solid ${ring}`,
          borderRadius: "var(--component-input-radius)",
          boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
          transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
        },
        children: [
          startIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto" }, children: startIcon }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "input",
            {
              id: inputId,
              "data-lds-field": "",
              ...rest,
              disabled,
              readOnly,
              required,
              "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label && typeof rest.placeholder === "string" ? rest.placeholder : void 0))),
              "aria-describedby": _chunk3NOYASLPcjs.mergeIds.call(void 0, rest["aria-describedby"], messageId),
              "aria-invalid": isInvalid || rest["aria-invalid"] || void 0,
              onFocus: (e) => {
                setFocused(true);
                rest.onFocus && rest.onFocus(e);
              },
              onBlur: (e) => {
                setFocused(false);
                rest.onBlur && rest.onBlur(e);
              },
              style: { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0, fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", lineHeight: "var(--component-input-line-height)", letterSpacing: "var(--component-input-letter-spacing)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
            }
          ),
          endIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto" }, children: endIcon }),
          !endIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3NOYASLPcjs.FieldStatusIcon, { invalid: isInvalid, status }),
          endAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flex: "0 0 auto" }, children: endAction })
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3NOYASLPcjs.FieldMessage, { id: messageId, message, error, status })
  ] });
}



exports.Input = Input;
//# sourceMappingURL=chunk-ZSVMNO4X.cjs.map