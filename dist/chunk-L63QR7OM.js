"use client";
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  mergeIds
} from "./chunk-P6K2KO4L.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";

// components/forms/Input.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function usePlaceholderStyle() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-field-ph")) return;
    const el = document.createElement("style");
    el.id = "lk-field-ph";
    el.textContent = "[data-lds-field]::placeholder{color:var(--color-semantic-label-assistive);opacity:1}";
    document.head.appendChild(el);
  }, []);
}
var Input = React.forwardRef(function Input2({
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
  const autoId = React.useId();
  const inputId = id || `in-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${inputId}-message` : void 0;
  const [focused, setFocused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const disabled = !!rest.disabled || disable || interaction === "inactive";
  const readOnly = !!rest.readOnly;
  const activeFocus = focused || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const isInvalid = invalid || status === "negative" || error != null;
  usePlaceholderStyle();
  const ring = fieldBorderColor({ disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const h = height || (normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--component-input-height)");
  const startIcon = leadingIcon ?? iconLeft;
  const endIcon = trailingIcon ?? iconRight;
  const endAction = trailingButton ?? actionRight;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rootRef,
      "data-slot": "root",
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      "data-invalid": isInvalid ? "true" : void 0,
      "data-size": normalizedSize,
      className: partClassName(classNames, "root", className) || void 0,
      style: {
        /*
          `minWidth: 0` here and on the control below. A flex item defaults to
          `min-width: auto`, which refuses to shrink past its content's minimum
          size. With an `actionRight` that minimum is the input plus every
          action, so the field overflowed any container narrower than roughly
          310px instead of narrowing its text area. Consumer `styles`/`style`
          are spread afterwards and still win.
        */
        ...componentVars(vars, "--lds-input-"),
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        gap: "var(--component-input-stack-gap)",
        ...partStyle(styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          FieldLabel,
          {
            "data-slot": "label",
            className: partClassName(classNames, "label") || void 0,
            style: partStyle(styles, "label"),
            htmlFor: inputId,
            label,
            required,
            disabled
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-slot": "control",
            className: partClassName(classNames, "control") || void 0,
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            style: {
              position: "relative",
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              gap: "var(--lds-input-gap, var(--component-input-gap))",
              height: `var(--lds-input-height, ${h})`,
              padding: "0 var(--lds-input-padding-inline, var(--component-input-padding-x))",
              background: fieldBackground({ disabled, readOnly }),
              border: `var(--component-input-border-width) solid ${ring}`,
              borderRadius: "var(--lds-input-radius, var(--component-input-radius))",
              boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
              ...partStyle(styles, "control")
            },
            children: [
              startIcon && /* @__PURE__ */ jsx("span", { "data-slot": "startIcon", className: partClassName(classNames, "startIcon") || void 0, style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto", ...partStyle(styles, "startIcon") }, children: startIcon }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: forwardedRef,
                  id: inputId,
                  "data-slot": "input",
                  "data-lds-field": "",
                  ...rest,
                  className: partClassName(classNames, "input", inputClassName) || void 0,
                  disabled,
                  readOnly,
                  required,
                  "aria-label": ariaLabel ?? (!label && typeof rest.placeholder === "string" ? rest.placeholder : void 0),
                  "aria-describedby": mergeIds(rest["aria-describedby"], messageId),
                  "aria-invalid": isInvalid || rest["aria-invalid"] || void 0,
                  onFocus: (e) => {
                    setFocused(true);
                    rest.onFocus && rest.onFocus(e);
                  },
                  onBlur: (e) => {
                    setFocused(false);
                    rest.onBlur && rest.onBlur(e);
                  },
                  style: { flex: 1, minWidth: 0, height: "100%", boxSizing: "border-box", border: "none", outline: "none", background: "transparent", cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0, fontFamily: "var(--font-sans)", ...fieldTypography(normalizedSize), color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", ...partStyle(styles, "input"), ...inputStyle }
                }
              ),
              endIcon && /* @__PURE__ */ jsx("span", { "data-slot": "endIcon", className: partClassName(classNames, "endIcon") || void 0, style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto", ...partStyle(styles, "endIcon") }, children: endIcon }),
              !endIcon && (isInvalid || status === "positive") && /* @__PURE__ */ jsx("span", { "data-slot": "statusIcon", className: partClassName(classNames, "statusIcon") || void 0, style: { display: "inline-flex", ...partStyle(styles, "statusIcon") }, children: /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }) }),
              endAction && /* @__PURE__ */ jsx("span", { "data-slot": "action", className: partClassName(classNames, "action") || void 0, style: { display: "inline-flex", flex: "0 0 auto", ...partStyle(styles, "action") }, children: endAction })
            ]
          }
        ),
        /* @__PURE__ */ jsx(FieldMessage, { "data-slot": "message", className: partClassName(classNames, "message") || void 0, style: partStyle(styles, "message"), id: messageId, message, error, status })
      ]
    }
  );
});

export {
  Input
};
//# sourceMappingURL=chunk-L63QR7OM.js.map