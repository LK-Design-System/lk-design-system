"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";








var _chunkHYN6PXKLcjs = require('./chunk-HYN6PXKL.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

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
var Input = _react2.default.forwardRef(function Input2({
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
  className,
  style,
  inputClassName,
  inputStyle,
  classNames,
  styles,
  vars,
  rootRef,
  "aria-label": ariaLabel,
  ...rest
}, forwardedRef) {
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
  const ring = _chunkHYN6PXKLcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const h = height || (normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--component-input-height)");
  const startIcon = _nullishCoalesce(leadingIcon, () => ( iconLeft));
  const endIcon = _nullishCoalesce(trailingIcon, () => ( iconRight));
  const endAction = _nullishCoalesce(trailingButton, () => ( actionRight));
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
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-input-"), display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkHYN6PXKLcjs.FieldLabel,
          {
            "data-slot": "label",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0,
            style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label"),
            htmlFor: inputId,
            label,
            required,
            disabled
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "control",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "control") || void 0,
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            style: {
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "var(--lds-input-gap, var(--component-input-gap))",
              height: `var(--lds-input-height, ${h})`,
              padding: "0 var(--lds-input-padding-inline, var(--component-input-padding-x))",
              background: _chunkHYN6PXKLcjs.fieldBackground.call(void 0, { disabled, readOnly }),
              border: `var(--component-input-border-width) solid ${ring}`,
              borderRadius: "var(--lds-input-radius, var(--component-input-radius))",
              boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
              ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "control")
            },
            children: [
              startIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "startIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "startIcon") || void 0, style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "startIcon") }, children: startIcon }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "input",
                {
                  ref: forwardedRef,
                  id: inputId,
                  "data-slot": "input",
                  "data-lds-field": "",
                  ...rest,
                  className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "input", inputClassName) || void 0,
                  disabled,
                  readOnly,
                  required,
                  "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label && typeof rest.placeholder === "string" ? rest.placeholder : void 0))),
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
                  style: { flex: 1, minWidth: 0, height: "100%", boxSizing: "border-box", border: "none", outline: "none", background: "transparent", cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0, fontFamily: "var(--font-sans)", ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize), color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "input"), ...inputStyle }
                }
              ),
              endIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "endIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "endIcon") || void 0, style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "endIcon") }, children: endIcon }),
              !endIcon && (isInvalid || status === "positive") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "statusIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "statusIcon") || void 0, style: { display: "inline-flex", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "statusIcon") }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStatusIcon, { invalid: isInvalid, status }) }),
              endAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "action", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "action") || void 0, style: { display: "inline-flex", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "action") }, children: endAction })
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldMessage, { "data-slot": "message", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "message") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "message"), id: messageId, message, error, status })
      ]
    }
  );
});



exports.Input = Input;
//# sourceMappingURL=chunk-G2WQXW6R.cjs.map