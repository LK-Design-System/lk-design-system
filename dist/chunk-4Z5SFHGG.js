"use client";
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  mergeIds
} from "./chunk-37TWDMUM.js";

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
  return /* @__PURE__ */ jsxs("div", { "data-readonly": readOnly ? "true" : void 0, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor: inputId, label, required, disabled }),
    /* @__PURE__ */ jsxs(
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
          background: fieldBackground({ disabled, readOnly }),
          border: `var(--component-input-border-width) solid ${ring}`,
          borderRadius: "var(--component-input-radius)",
          boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
          transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
        },
        children: [
          startIcon && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto" }, children: startIcon }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: inputId,
              "data-lds-field": "",
              ...rest,
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
              style: { flex: 1, minWidth: 0, height: "100%", boxSizing: "border-box", border: "none", outline: "none", background: "transparent", cursor: disabled ? "not-allowed" : readOnly ? "text" : void 0, fontFamily: "var(--font-sans)", ...fieldTypography(normalizedSize), color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
            }
          ),
          endIcon && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-alternative)", display: "inline-flex", flex: "0 0 auto" }, children: endIcon }),
          !endIcon && /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }),
          endAction && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", flex: "0 0 auto" }, children: endAction })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FieldMessage, { id: messageId, message, error, status })
  ] });
}

export {
  Input
};
//# sourceMappingURL=chunk-4Z5SFHGG.js.map