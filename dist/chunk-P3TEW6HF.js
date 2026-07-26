"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  useFieldMetadata
} from "./chunk-5CZWLXVG.js";
import {
  IconButton
} from "./chunk-5B7KHE4A.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/forms/SearchField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function useSearchFieldStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-searchfield-css")) return;
    const el = document.createElement("style");
    el.id = "lk-searchfield-css";
    el.textContent = `
input.lk-searchfield::-webkit-search-cancel-button,
input.lk-searchfield::-webkit-search-decoration,
input.lk-searchfield::-webkit-search-results-button,
input.lk-searchfield::-webkit-search-results-decoration{-webkit-appearance:none;appearance:none;display:none;}`;
    document.head.appendChild(el);
  }, []);
}
function SearchField({
  value,
  defaultValue,
  onChange,
  onSearch,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder = "\uAC80\uC0C9",
  size = "md",
  disabled = false,
  readOnly = false,
  clearLabel,
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}) {
  useSearchFieldStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = useFieldMetadata({
    prefix: "search-field",
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const contextName = typeof label === "string" ? label : ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uAC80\uC0C9\uC5B4");
  const resolvedClearLabel = clearLabel ?? `${contextName} \uC9C0\uC6B0\uAE30`;
  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };
  const borderColor = fieldBorderColor({
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered
  });
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
            /* @__PURE__ */ jsx(Icon, { name: "search", size: 18, color: "var(--component-input-icon-color)", "aria-hidden": "true", style: { flex: "0 0 auto" } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...inputProps,
                ref: inputRef,
                className: ["lk-searchfield", inputProps.className].filter(Boolean).join(" "),
                id: metadata.fieldId,
                type: "search",
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
                onKeyDown: (event) => {
                  onKeyDown?.(event);
                  if (event.defaultPrevented || disabled || readOnly) return;
                  if (event.key === "Enter") onSearch?.(currentValue);
                  if (event.key === "Escape" && currentValue) {
                    event.preventDefault();
                    commitValue("");
                  }
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
            currentValue && !readOnly && /* @__PURE__ */ jsx(
              IconButton,
              {
                variant: "plain",
                size: "small",
                label: resolvedClearLabel,
                disabled,
                onClick: () => {
                  commitValue("");
                  inputRef.current?.focus();
                },
                style: { flex: "0 0 auto", marginInline: -8 },
                children: /* @__PURE__ */ jsx(Icon, { name: "circle-close-fill", size: 16, "aria-hidden": "true" })
              }
            )
          ]
        }
      )
    }
  );
}

export {
  SearchField
};
//# sourceMappingURL=chunk-P3TEW6HF.js.map