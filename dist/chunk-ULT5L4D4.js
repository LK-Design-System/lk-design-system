"use client";
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata
} from "./chunk-2RJAC3UR.js";
import {
  useLightDismiss
} from "./chunk-SFKCQB3X.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/forms/Combobox.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function optionId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}
function moveEnabled(options, current, direction) {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  if (!enabled.length) return -1;
  const position = enabled.indexOf(current);
  if (position < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  return enabled[(position + direction + enabled.length) % enabled.length];
}
function Combobox({
  options = [],
  value,
  defaultValue = [],
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = "\uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  size = "md",
  id,
  style,
  fieldStyle,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onKeyDown,
  onClick,
  ...triggerProps
}) {
  const normalized = React.useMemo(
    () => options.map((option) => typeof option === "string" ? { value: option, label: option, disabled: false } : { ...option, disabled: Boolean(option.disabled) }),
    [options]
  );
  const controlled = value !== void 0;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValues = Array.isArray(controlled ? value : internalValue) ? controlled ? value : internalValue : [];
  const selectedSet = new Set(selectedValues);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const listboxId = React.useId();
  const locked = disabled || readOnly;
  const isInvalid = invalid || status === "negative" || error != null;
  const {
    fieldId,
    message,
    messageId,
    describedBy,
    hasMetadata
  } = useFieldMetadata({ prefix: "combobox", id, label, helper, error, describedBy: ariaDescribedBy });
  const labelId = label != null ? `${fieldId}-label` : void 0;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const borderColor = fieldBorderColor({ disabled, readOnly, invalid: isInvalid, status, focused: open, hovered });
  React.useEffect(() => {
    if (!open) return;
    setActiveIndex((index) => normalized[index] && !normalized[index].disabled ? index : moveEnabled(normalized, -1, 1));
  }, [normalized, open]);
  useLightDismiss({
    open,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false)
  });
  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, open]);
  const commit = (next) => {
    if (!controlled) setInternalValue(next);
    onChange?.(next);
  };
  const toggle = (index) => {
    const option = normalized[index];
    if (!option || option.disabled || locked) return;
    const next = selectedSet.has(option.value) ? selectedValues.filter((item) => item !== option.value) : [...selectedValues, option.value];
    commit(next);
    setActiveIndex(index);
    setOpen(true);
    triggerRef.current?.focus();
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || locked) return;
    const last = normalized.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(moveEnabled(normalized, -1, 1));
    } else if (event.key === "End") {
      event.preventDefault();
      const reversed = [...normalized].reverse();
      const reverseIndex = moveEnabled(reversed, -1, 1);
      setOpen(true);
      setActiveIndex(reverseIndex < 0 ? -1 : last - reverseIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) setOpen(true);
      else if (activeIndex >= 0) toggle(activeIndex);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };
  const control = /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rootRef,
      "data-readonly": readOnly ? "true" : void 0,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: { position: "relative", width: "100%", minWidth: 0, ...style },
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            ...triggerProps,
            ref: triggerRef,
            id: fieldId,
            type: "button",
            role: "combobox",
            disabled,
            "aria-label": ariaLabel ?? (!label ? placeholder : void 0),
            "aria-labelledby": ariaLabelledBy ?? (!ariaLabel && labelId ? labelId : void 0),
            "aria-describedby": describedBy,
            "aria-expanded": open,
            "aria-controls": open ? listboxId : void 0,
            "aria-activedescendant": open && activeIndex >= 0 && normalized[activeIndex] ? optionId(listboxId, normalized[activeIndex]) : void 0,
            "aria-haspopup": "listbox",
            "aria-invalid": isInvalid || void 0,
            "aria-required": required || void 0,
            "aria-readonly": readOnly || void 0,
            onClick: (event) => {
              onClick?.(event);
              if (event.defaultPrevented || locked) return;
              setOpen((current) => !current);
            },
            onKeyDown: handleKeyDown,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--component-input-gap)",
              width: "100%",
              minHeight: height,
              padding: "6px var(--component-input-padding-x)",
              boxSizing: "border-box",
              border: `var(--component-input-border-width) solid ${borderColor}`,
              borderRadius: "var(--component-input-radius)",
              background: fieldBackground({ disabled, readOnly }),
              boxShadow: open && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
              color: disabled ? "var(--color-semantic-label-disable)" : selectedValues.length ? "var(--component-input-text-color)" : "var(--color-semantic-label-alternative)",
              cursor: disabled ? "not-allowed" : readOnly ? "default" : "pointer",
              fontFamily: "var(--font-sans)",
              ...fieldTypography(normalizedSize),
              textAlign: "left",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { style: { display: "flex", minWidth: 0, flexWrap: "wrap", gap: "var(--space-1)", alignItems: "center" }, children: selectedValues.length ? selectedValues.map((selectedValue) => {
                const option = normalized.find((item) => item.value === selectedValue);
                return /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", maxWidth: "100%", height: 24, padding: "0 9px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: option?.label ?? selectedValue }, selectedValue);
              }) : placeholder }),
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flex: "0 0 auto" }, children: [
                /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }),
                /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" } })
              ] })
            ]
          }
        ),
        open && !locked && /* @__PURE__ */ jsx(
          "div",
          {
            id: listboxId,
            role: "listbox",
            "aria-multiselectable": "true",
            "aria-labelledby": !ariaLabel && labelId ? labelId : void 0,
            style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", padding: "var(--space-1-5)", display: "flex", flexDirection: "column", gap: "var(--space-0-5)", border: "var(--component-input-border-width) solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)", background: "var(--color-semantic-background-elevated-normal)", boxShadow: "var(--shadow-md)" },
            children: normalized.map((option, index) => {
              const selected = selectedSet.has(option.value);
              const active = index === activeIndex;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  id: optionId(listboxId, option),
                  ref: (node) => {
                    optionRefs.current[index] = node;
                  },
                  role: "option",
                  "aria-selected": selected,
                  "aria-disabled": option.disabled || void 0,
                  onMouseDown: (event) => event.preventDefault(),
                  onMouseEnter: () => {
                    if (!option.disabled) setActiveIndex(index);
                  },
                  onClick: () => toggle(index),
                  style: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "9px 10px", borderRadius: "var(--radius-md)", background: selected ? "var(--color-semantic-primary-surface-strong)" : active ? "var(--color-semantic-fill-normal)" : "transparent", color: option.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", cursor: option.disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", ...fieldTypography(normalizedSize) },
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { width: 18, height: 18, borderRadius: "var(--radius-5)", border: `1.5px solid ${selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, background: selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: selected && /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, color: "var(--color-semantic-static-white)", "aria-hidden": "true" }) }),
                    /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children: option.label })
                  ]
                },
                option.value
              );
            })
          }
        )
      ]
    }
  );
  if (!hasMetadata) return control;
  return /* @__PURE__ */ jsx(FieldStack, { fieldId, labelId, label, required, messageId, message, error, status, fieldStyle, children: control });
}

export {
  Combobox
};
//# sourceMappingURL=chunk-ULT5L4D4.js.map