"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  useFieldMetadata
} from "./chunk-NTG35RE3.js";
import {
  IconButton
} from "./chunk-ODAJPEYM.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/forms/PasswordInput.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function PasswordInput({
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder = "\uBE44\uBC00\uBC88\uD638",
  size = "md",
  disabled = false,
  readOnly = false,
  revealLabel = "\uBCF4\uAE30",
  hideLabel = "\uC228\uAE30\uAE30",
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [revealed, setRevealed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = useFieldMetadata({
    prefix: "password-field",
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const contextName = typeof label === "string" ? label : ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uBE44\uBC00\uBC88\uD638");
  const actionLabel = `${contextName} ${revealed ? hideLabel : revealLabel}`;
  const borderColor = fieldBorderColor({
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered
  });
  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };
  return /* @__PURE__ */ jsx(
    FieldStack,
    {
      fieldId: metadata.fieldId,
      labelId,
      label,
      required,
      messageId: metadata.messageId,
      message: metadata.message,
      error,
      status,
      fieldStyle,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          "data-readonly": readOnly ? "true" : void 0,
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--component-input-gap)",
            width: "100%",
            height,
            padding: "0 var(--component-input-padding-x)",
            boxSizing: "border-box",
            background: fieldBackground({ disabled, readOnly }),
            border: `var(--component-input-border-width) solid ${borderColor}`,
            borderRadius: "var(--component-input-radius)",
            boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
            ...style
          },
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...inputProps,
                id: metadata.fieldId,
                type: revealed ? "text" : "password",
                value: currentValue,
                disabled,
                readOnly,
                required,
                placeholder,
                "aria-label": ariaLabel ?? (!label && typeof placeholder === "string" ? placeholder : void 0),
                "aria-labelledby": ariaLabelledBy ?? (!ariaLabel && label ? labelId : void 0),
                "aria-describedby": metadata.describedBy,
                "aria-invalid": isInvalid || void 0,
                onChange: (event) => commitValue(event.target.value),
                onFocus: (event) => {
                  setFocused(true);
                  onFocus?.(event);
                },
                onBlur: (event) => {
                  setFocused(false);
                  onBlur?.(event);
                },
                style: {
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--component-input-font-size)",
                  lineHeight: "var(--component-input-line-height)",
                  letterSpacing: "var(--component-input-letter-spacing)",
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)"
                }
              }
            ),
            /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }),
            /* @__PURE__ */ jsx(
              IconButton,
              {
                variant: "plain",
                size: "small",
                label: actionLabel,
                "aria-controls": metadata.fieldId,
                disabled,
                onClick: () => setRevealed((current) => !current),
                style: { flex: "0 0 auto", marginInline: -8 },
                children: /* @__PURE__ */ jsx(Icon, { name: revealed ? "eye-slash" : "eye", size: 18, "aria-hidden": "true" })
              }
            )
          ]
        }
      )
    }
  );
}

export {
  PasswordInput
};
//# sourceMappingURL=chunk-SGCAVH3M.js.map