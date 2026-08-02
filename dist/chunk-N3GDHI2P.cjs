"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";








var _chunkHYN6PXKLcjs = require('./chunk-HYN6PXKL.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

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
var Textarea = _react2.default.forwardRef(function Textarea2({
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
  className,
  style,
  textareaClassName,
  textareaStyle,
  classNames,
  styles,
  vars,
  rootRef,
  ...rest
}, forwardedRef) {
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
  const ring = _chunkHYN6PXKLcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const minHeight = normalizedSize === "sm" ? 96 : normalizedSize === "lg" ? 160 : 120;
  const resizeMode = resize === "fixed" ? "none" : resize === "limit" ? "vertical" : "vertical";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: rootRef,
      "data-slot": "root",
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      "data-invalid": isInvalid ? "true" : void 0,
      "data-size": normalizedSize,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-textarea-"), display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkHYN6PXKLcjs.FieldLabel,
          {
            "data-slot": "label",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0,
            style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label"),
            htmlFor: taId,
            label,
            required,
            disabled
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "control", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "control") || void 0, style: { position: "relative", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "control") }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "textarea",
            {
              ref: forwardedRef,
              id: taId,
              rows,
              "data-slot": "textarea",
              "data-lds-field": "",
              ...rest,
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "textarea", textareaClassName) || void 0,
              disabled,
              readOnly,
              required,
              "aria-describedby": _chunkHYN6PXKLcjs.mergeIds.call(void 0, rest["aria-describedby"], messageId),
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
                minHeight: `var(--lds-textarea-min-height, ${minHeight}px)`,
                maxHeight: resize === "limit" ? `var(--lds-textarea-max-height, ${minHeight * 2}px)` : void 0,
                padding: `var(--lds-textarea-padding, var(--space-3) ${isInvalid || status === "positive" ? "var(--space-10)" : "var(--space-3)"} var(--space-3) var(--space-3))`,
                background: _chunkHYN6PXKLcjs.fieldBackground.call(void 0, { disabled, readOnly }),
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                border: `var(--component-input-border-width) solid ${ring}`,
                borderRadius: "var(--lds-textarea-radius, var(--component-input-radius))",
                boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
                transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
                fontFamily: "var(--font-sans)",
                ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize),
                outline: "none",
                boxSizing: "border-box",
                cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0,
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "textarea"),
                ...textareaStyle
              }
            }
          ),
          (isInvalid || status === "positive") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "statusIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "statusIcon") || void 0, style: { position: "absolute", top: "var(--space-3)", right: "var(--space-3)", display: "inline-flex", pointerEvents: "none", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "statusIcon") }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStatusIcon, { invalid: isInvalid, status }) })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldMessage, { "data-slot": "message", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "message") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "message"), id: messageId, message, error, status })
      ]
    }
  );
});



exports.Textarea = Textarea;
//# sourceMappingURL=chunk-N3GDHI2P.cjs.map