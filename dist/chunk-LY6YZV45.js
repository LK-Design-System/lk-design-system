"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata
} from "./chunk-3CD27YLL.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

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
var SearchField = React.forwardRef(function SearchField2({
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
  className,
  style,
  controlClassName,
  controlStyle,
  inputClassName,
  inputStyle,
  classNames,
  styles,
  vars,
  rootRef,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}, forwardedRef) {
  useSearchFieldStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const inputRef = React.useRef(null);
  const mergedInputRef = useMergedRefs(inputRef, forwardedRef);
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
      ref: rootRef,
      "data-slot": "root",
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      "data-invalid": isInvalid ? "true" : void 0,
      "data-size": normalizedSize,
      className: partClassName(classNames, "root", className) || void 0,
      style: { ...componentVars(vars, "--lds-search-field-"), ...partStyle(styles, "root"), ...fieldStyle, ...style },
      fieldId: metadata.fieldId,
      labelId,
      label,
      required,
      messageId: metadata.messageId,
      message: metadata.message,
      error,
      status,
      labelProps: {
        "data-slot": "label",
        className: partClassName(classNames, "label") || void 0,
        style: partStyle(styles, "label"),
        disabled
      },
      messageProps: {
        "data-slot": "message",
        className: partClassName(classNames, "message") || void 0,
        style: partStyle(styles, "message")
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          "data-slot": "control",
          "data-readonly": readOnly ? "true" : void 0,
          className: partClassName(classNames, "control", controlClassName) || void 0,
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--lds-search-field-gap, var(--component-input-gap))",
            width: "100%",
            height: `var(--lds-search-field-height, ${height})`,
            padding: "0 var(--lds-search-field-padding-inline, var(--component-input-padding-x))",
            boxSizing: "border-box",
            background: fieldBackground({ disabled, readOnly }),
            border: `var(--component-input-border-width) solid ${borderColor}`,
            borderRadius: "var(--lds-search-field-radius, var(--component-input-radius))",
            boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
            ...partStyle(styles, "control"),
            ...controlStyle
          },
          children: [
            /* @__PURE__ */ jsx("span", { "data-slot": "startIcon", className: partClassName(classNames, "startIcon") || void 0, style: { display: "inline-flex", flex: "0 0 auto", ...partStyle(styles, "startIcon") }, children: /* @__PURE__ */ jsx(Icon, { name: "search", size: 18, color: "var(--component-input-icon-color)", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...inputProps,
                ref: mergedInputRef,
                "data-slot": "input",
                className: partClassName(classNames, "input", "lk-searchfield", inputClassName) || void 0,
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
                  height: "100%",
                  boxSizing: "border-box",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  ...fieldTypography(normalizedSize),
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                  ...partStyle(styles, "input"),
                  ...inputStyle
                }
              }
            ),
            (isInvalid || status === "positive") && /* @__PURE__ */ jsx("span", { "data-slot": "statusIcon", className: partClassName(classNames, "statusIcon") || void 0, style: { display: "inline-flex", ...partStyle(styles, "statusIcon") }, children: /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }) }),
            currentValue && !readOnly && /* @__PURE__ */ jsx(
              IconButton,
              {
                "data-slot": "clearButton",
                className: partClassName(classNames, "clearButton") || void 0,
                variant: "plain",
                size: "small",
                label: resolvedClearLabel,
                disabled,
                onClick: () => {
                  commitValue("");
                  inputRef.current?.focus();
                },
                style: { flex: "0 0 auto", marginInline: -8, ...partStyle(styles, "clearButton") },
                children: /* @__PURE__ */ jsx(Icon, { name: "circle-close-fill", size: 16, "aria-hidden": "true" })
              }
            )
          ]
        }
      )
    }
  );
});

export {
  SearchField
};
//# sourceMappingURL=chunk-LY6YZV45.js.map