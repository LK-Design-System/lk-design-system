"use client";
import {
  Calendar
} from "./chunk-WNUJ4SZL.js";
import {
  fieldTypography
} from "./chunk-37TWDMUM.js";
import {
  useLightDismiss
} from "./chunk-ESGH2GMP.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/forms/DatePicker.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DatePicker({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, placeholder = "\uB0A0\uC9DC\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.", size = "md", disabled = false, invalid = false, full = false, style, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, onKeyDown, onBlur, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);
  const popupId = React.useId();
  const expanded = open && !disabled;
  useLightDismiss({
    open,
    rootRef: ref,
    getTrigger: () => buttonRef.current,
    onDismiss: () => setOpen(false)
  });
  React.useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const fmt = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, "0")}. ${String(dt.getDate()).padStart(2, "0")}`;
  };
  const h = size === "sm" || size === "small" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const borderColor = invalid ? "var(--component-input-border-color-invalid)" : focused || open ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)";
  const formattedValue = sel ? fmt(sel) : "";
  const triggerLabel = `${ariaLabel ?? placeholder}${formattedValue ? `, ${formattedValue}` : ""}`;
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    onChange?.(d);
    setOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      style: { position: "relative", display: full ? "block" : "inline-block", width: full ? "100%" : void 0, ...style },
      onKeyDown: (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
      },
      onBlur: (event) => {
        onBlur?.(event);
        if (!open) return;
        const nextTarget = event.relatedTarget;
        if (!nextTarget || ref.current?.contains(nextTarget)) return;
        setOpen(false);
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            ref: buttonRef,
            type: "button",
            disabled,
            "aria-label": triggerLabel,
            "aria-haspopup": "dialog",
            "aria-expanded": expanded,
            "aria-controls": expanded ? popupId : void 0,
            "aria-invalid": invalid || void 0,
            "aria-describedby": ariaDescribedBy,
            onClick: () => setOpen((current) => !current),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", width: full ? "100%" : void 0, height: h, padding: "0 var(--component-input-padding-x)", minWidth: full ? 0 : 200, boxSizing: "border-box", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", border: `1px solid ${borderColor}`, borderRadius: "var(--component-input-radius)", boxShadow: focused || open ? "var(--component-input-focus-shadow)" : "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", ...fieldTypography(size), color: disabled ? "var(--color-semantic-label-disable)" : sel ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" },
            children: [
              /* @__PURE__ */ jsx(Icon, { name: "calendar", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { style: { flex: 1, textAlign: "left" }, children: formattedValue || placeholder })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsx("div", { id: popupId, role: "dialog", "aria-label": ariaLabel ?? placeholder, style: { position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40 }, children: /* @__PURE__ */ jsx(Calendar, { value: sel || void 0, onChange: pick, isDateDisabled, minDate, maxDate, autoFocus: true }) })
      ]
    }
  );
}

export {
  DatePicker
};
//# sourceMappingURL=chunk-EMZZVXUF.js.map