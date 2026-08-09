"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  mergeIds,
  useFieldMetadata
} from "./chunk-JWQCVXVV.js";

// components/forms/InputGroup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function InputGroup({
  prefix,
  suffix,
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder,
  size = "md",
  disabled = false,
  readOnly = false,
  inputProps = {},
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onMouseEnter,
  onMouseLeave,
  ...groupProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = useFieldMetadata({
    prefix: "input-group",
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy ?? inputProps["aria-describedby"]
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const prefixId = prefix != null ? `${metadata.fieldId}-prefix` : void 0;
  const suffixId = suffix != null ? `${metadata.fieldId}-suffix` : void 0;
  const describedBy = mergeIds(metadata.describedBy, prefixId, suffixId);
  const {
    onFocus: onInputFocus,
    onBlur: onInputBlur,
    onChange: onInputChange,
    style: inputStyle,
    ...inputRest
  } = inputProps;
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
  const Addon = ({ node, side, addonId }) => /* @__PURE__ */ jsx(
    "span",
    {
      id: addonId,
      style: {
        display: "inline-flex",
        alignItems: "center",
        padding: "0 var(--component-input-padding-x)",
        background: "var(--color-semantic-fill-normal)",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)",
        fontFamily: "var(--font-sans)",
        ...fieldTypography(normalizedSize),
        fontWeight: "var(--fw-semibold)",
        whiteSpace: "nowrap",
        [side === "left" ? "borderRight" : "borderLeft"]: "var(--component-input-border-width) solid var(--component-input-border-color)"
      },
      children: node
    }
  );
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
          ...groupProps,
          "data-readonly": readOnly ? "true" : void 0,
          "data-disabled": disabled ? "true" : void 0,
          onMouseEnter: (event) => {
            setHovered(true);
            onMouseEnter?.(event);
          },
          onMouseLeave: (event) => {
            setHovered(false);
            onMouseLeave?.(event);
          },
          style: {
            display: "inline-flex",
            alignItems: "stretch",
            width: "100%",
            height,
            boxSizing: "border-box",
            border: `var(--component-input-border-width) solid ${borderColor}`,
            borderRadius: "var(--component-input-radius)",
            background: fieldBackground({ disabled, readOnly }),
            boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
            overflow: "hidden",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
            ...style
          },
          children: [
            prefix != null && /* @__PURE__ */ jsx(Addon, { node: prefix, side: "left", addonId: prefixId }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...inputRest,
                id: metadata.fieldId,
                value: currentValue,
                disabled,
                readOnly,
                required,
                placeholder,
                "aria-label": ariaLabel ?? inputRest["aria-label"] ?? (!label && typeof placeholder === "string" ? placeholder : void 0),
                "aria-labelledby": ariaLabelledBy ?? inputRest["aria-labelledby"] ?? (!ariaLabel && label ? labelId : void 0),
                "aria-describedby": describedBy,
                "aria-invalid": isInvalid || void 0,
                onChange: (event) => {
                  onInputChange?.(event);
                  commitValue(event.target.value);
                },
                onFocus: (event) => {
                  setFocused(true);
                  onInputFocus?.(event);
                },
                onBlur: (event) => {
                  setFocused(false);
                  onInputBlur?.(event);
                },
                style: {
                  flex: 1,
                  minWidth: 0,
                  height: "100%",
                  boxSizing: "border-box",
                  padding: "0 var(--component-input-padding-x)",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  ...fieldTypography(normalizedSize),
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                  ...inputStyle
                }
              }
            ),
            (isInvalid || status === "positive") && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", paddingInline: suffix == null ? "var(--space-2)" : 0 }, children: /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }) }),
            suffix != null && /* @__PURE__ */ jsx(Addon, { node: suffix, side: "right", addonId: suffixId })
          ]
        }
      )
    }
  );
}

export {
  InputGroup
};
//# sourceMappingURL=chunk-66TFJMF4.js.map