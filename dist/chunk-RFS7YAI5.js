"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata
} from "./chunk-EVODDQR3.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-B2YSRUC3.js";

// components/forms/PasswordInput.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function readCapsLock(event) {
  return typeof event?.getModifierState === "function" ? event.getModifierState("CapsLock") : false;
}
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
  autoComplete = "current-password",
  capsLockLabel = "Caps Lock\uC774 \uCF1C\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  ...inputProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [revealed, setRevealed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);
  const inputRef = React.useRef(null);
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
  const capsLockOn = capsLock && focused && !disabled && !readOnly && !!capsLockLabel;
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
  React.useEffect(() => {
    if (!revealed) return void 0;
    const form = inputRef.current?.form;
    if (!form) return void 0;
    const remask = () => setRevealed(false);
    form.addEventListener("submit", remask);
    return () => form.removeEventListener("submit", remask);
  }, [revealed]);
  const syncCapsLock = (event) => {
    if (typeof event?.getModifierState !== "function") return;
    setCapsLock(readCapsLock(event));
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
      children: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
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
                  ref: inputRef,
                  id: metadata.fieldId,
                  type: revealed ? "text" : "password",
                  value: currentValue,
                  disabled,
                  readOnly,
                  required,
                  placeholder,
                  autoComplete,
                  spellCheck: false,
                  autoCapitalize: "off",
                  autoCorrect: "off",
                  "aria-label": ariaLabel ?? (!label && typeof placeholder === "string" ? placeholder : void 0),
                  "aria-labelledby": ariaLabelledBy ?? (!ariaLabel && label ? labelId : void 0),
                  "aria-describedby": metadata.describedBy,
                  "aria-invalid": isInvalid || void 0,
                  onChange: (event) => commitValue(event.target.value),
                  onKeyDown: (event) => {
                    syncCapsLock(event);
                    onKeyDown?.(event);
                  },
                  onKeyUp: (event) => {
                    syncCapsLock(event);
                    onKeyUp?.(event);
                  },
                  onFocus: (event) => {
                    setFocused(true);
                    syncCapsLock(event.nativeEvent ?? event);
                    onFocus?.(event);
                  },
                  onBlur: (event) => {
                    setFocused(false);
                    setCapsLock(false);
                    onBlur?.(event);
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
        ),
        /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", style: VISUALLY_HIDDEN_STYLE, children: capsLockOn ? capsLockLabel : "" }),
        capsLockOn && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              color: "var(--color-semantic-status-cautionary-text)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              fontWeight: "var(--fw-medium)"
            },
            children: capsLockLabel
          }
        )
      ] })
    }
  );
}

export {
  PasswordInput
};
//# sourceMappingURL=chunk-RFS7YAI5.js.map