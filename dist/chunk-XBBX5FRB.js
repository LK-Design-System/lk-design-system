"use client";
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  mergeIds
} from "./chunk-EVODDQR3.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";

// components/forms/Textarea.jsx
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
var Textarea = React.forwardRef(function Textarea2({
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
  const autoId = React.useId();
  const taId = id || `ta-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${taId}-message` : void 0;
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
  const minHeight = normalizedSize === "sm" ? 96 : normalizedSize === "lg" ? 160 : 120;
  const resizeMode = resize === "fixed" ? "none" : resize === "limit" ? "vertical" : "vertical";
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
      style: { ...componentVars(vars, "--lds-textarea-"), display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...partStyle(styles, "root"), ...style },
      children: [
        /* @__PURE__ */ jsx(
          FieldLabel,
          {
            "data-slot": "label",
            className: partClassName(classNames, "label") || void 0,
            style: partStyle(styles, "label"),
            htmlFor: taId,
            label,
            required,
            disabled
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-slot": "control", className: partClassName(classNames, "control") || void 0, style: { position: "relative", ...partStyle(styles, "control") }, children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: forwardedRef,
              id: taId,
              rows,
              "data-slot": "textarea",
              "data-lds-field": "",
              ...rest,
              className: partClassName(classNames, "textarea", textareaClassName) || void 0,
              disabled,
              readOnly,
              required,
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
                background: fieldBackground({ disabled, readOnly }),
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                border: `var(--component-input-border-width) solid ${ring}`,
                borderRadius: "var(--lds-textarea-radius, var(--component-input-radius))",
                boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
                transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
                fontFamily: "var(--font-sans)",
                ...fieldTypography(normalizedSize),
                outline: "none",
                boxSizing: "border-box",
                cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0,
                ...partStyle(styles, "textarea"),
                ...textareaStyle
              }
            }
          ),
          (isInvalid || status === "positive") && /* @__PURE__ */ jsx("span", { "data-slot": "statusIcon", className: partClassName(classNames, "statusIcon") || void 0, style: { position: "absolute", top: "var(--space-3)", right: "var(--space-3)", display: "inline-flex", pointerEvents: "none", ...partStyle(styles, "statusIcon") }, children: /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }) })
        ] }),
        /* @__PURE__ */ jsx(FieldMessage, { "data-slot": "message", className: partClassName(classNames, "message") || void 0, style: partStyle(styles, "message"), id: messageId, message, error, status })
      ]
    }
  );
});

export {
  Textarea
};
//# sourceMappingURL=chunk-XBBX5FRB.js.map