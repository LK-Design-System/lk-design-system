"use client";
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  mergeIds
} from "./chunk-NTG35RE3.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/forms/Select.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function normalizeOption(option) {
  return typeof option === "string" ? { value: option, label: option, disabled: false } : { ...option, disabled: Boolean(option.disabled) };
}
function enabledIndices(options) {
  return options.flatMap((option, index) => option.disabled ? [] : [index]);
}
function moveEnabled(options, currentIndex, direction) {
  const enabled = enabledIndices(options);
  if (!enabled.length) return -1;
  if (currentIndex < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  if (direction > 0) return enabled.find((index) => index > currentIndex) ?? currentIndex;
  return [...enabled].reverse().find((index) => index < currentIndex) ?? currentIndex;
}
function nearestEnabled(options, preferredIndex) {
  if (options[preferredIndex] && !options[preferredIndex].disabled) return preferredIndex;
  const after = enabledIndices(options).find((index) => index > preferredIndex);
  if (after != null) return after;
  return [...enabledIndices(options)].reverse().find((index) => index < preferredIndex) ?? -1;
}
function Select({
  label,
  helper,
  error,
  options,
  value,
  defaultValue,
  placeholder = "\uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  onChange,
  required = false,
  invalid = false,
  status = "normal",
  disabled = false,
  readOnly = false,
  disable = false,
  negative = false,
  size = "md",
  defaultOpen = false,
  interaction,
  active = false,
  focus = false,
  overflow,
  platform,
  variant,
  render = "text",
  iconLeft,
  id,
  children,
  style,
  ...rest
}) {
  const norm = React.useMemo(() => {
    if (options && options.length) return options.map(normalizeOption);
    return React.Children.toArray(children).filter((c) => c && c.type === "option").map((c) => ({
      value: c.props.value != null ? c.props.value : String(c.props.children),
      label: c.props.children,
      disabled: Boolean(c.props.disabled)
    }));
  }, [options, children]);
  const disabledState = disabled || disable || interaction === "inactive";
  const locked = disabledState || readOnly;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(() => Boolean(defaultOpen && !locked));
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const autoId = React.useId();
  const selId = id || `sel-${autoId}`;
  const labelId = `${selId}-label`;
  const listboxId = `${selId}-listbox`;
  const message = error ?? helper;
  const messageId = message != null ? `${selId}-message` : void 0;
  const {
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...triggerProps
  } = rest;
  const describedBy = mergeIds(ariaDescribedBy, messageId);
  React.useEffect(() => {
    if (!open || locked) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [locked, open]);
  const curr = norm.find((x) => x.value === sel);
  const selectedIndex = norm.findIndex((x) => x.value === sel);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const h = normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--control-h-md)";
  const isInvalid = invalid || negative || status === "negative" || error != null;
  const visualOpen = !locked && (open || interaction === "open");
  const activeFocus = visualOpen || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const ring = fieldBorderColor({ disabled: disabledState, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  React.useEffect(() => {
    if (!visualOpen) return;
    setActiveIndex((current) => {
      if (norm[current] && !norm[current].disabled) return current;
      const selectedEnabled = nearestEnabled(norm, selectedIndex);
      if (selectedEnabled >= 0) return selectedEnabled;
      return enabledIndices(norm)[0] ?? -1;
    });
  }, [norm, selectedIndex, visualOpen]);
  React.useEffect(() => {
    if (!locked) return;
    setOpen(false);
    setActiveIndex(-1);
  }, [locked]);
  React.useEffect(() => {
    if (!visualOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, visualOpen]);
  const openList = (preferredIndex = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (locked) return;
    setActiveIndex(nearestEnabled(norm, preferredIndex));
    setOpen(true);
  };
  const closeList = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
  const pick = (index) => {
    if (locked) return;
    const option = norm[index];
    if (!option || option.disabled) return;
    if (!isControlled) setInternal(option.value);
    onChange?.(option.value);
    setActiveIndex(index);
    closeList({ restoreFocus: true });
  };
  const handleTriggerClick = (event) => {
    onTriggerClick?.(event);
    if (event.defaultPrevented || disabledState || readOnly) return;
    if (open) closeList();
    else openList();
  };
  const handleTriggerKeyDown = (event) => {
    onTriggerKeyDown?.(event);
    if (event.defaultPrevented || disabledState || readOnly) return;
    const firstEnabled = enabledIndices(norm)[0] ?? -1;
    const lastEnabled = enabledIndices(norm).at(-1) ?? -1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!visualOpen) openList();
        else setActiveIndex((current) => moveEnabled(norm, current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : lastEnabled);
        else setActiveIndex((current) => moveEnabled(norm, current, -1));
        break;
      case "Home":
        event.preventDefault();
        if (!visualOpen) openList(firstEnabled);
        else setActiveIndex(firstEnabled);
        break;
      case "End":
        event.preventDefault();
        if (!visualOpen) openList(lastEnabled);
        else setActiveIndex(lastEnabled);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!visualOpen) openList();
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case "Escape":
        if (visualOpen) {
          event.preventDefault();
          event.stopPropagation();
          closeList({ restoreFocus: true });
        }
        break;
      case "Tab":
        if (visualOpen) closeList();
        break;
      default:
        break;
    }
  };
  return /* @__PURE__ */ jsxs("div", { "data-readonly": readOnly ? "true" : void 0, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    /* @__PURE__ */ jsx(FieldLabel, { id: labelId, htmlFor: selId, label, required }),
    /* @__PURE__ */ jsxs("div", { ref, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ...triggerProps,
          ref: triggerRef,
          id: selId,
          type: "button",
          role: "combobox",
          disabled: disabledState,
          "aria-haspopup": "listbox",
          "aria-expanded": visualOpen,
          "aria-controls": visualOpen ? listboxId : void 0,
          "aria-activedescendant": visualOpen && activeIndex >= 0 && !norm[activeIndex]?.disabled ? `${selId}-option-${activeIndex}` : void 0,
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledBy ?? (!ariaLabel && label ? labelId : void 0),
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": required || void 0,
          "aria-readonly": readOnly || void 0,
          onClick: handleTriggerClick,
          onKeyDown: handleTriggerKeyDown,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            width: "100%",
            height: h,
            padding: "0 var(--component-input-padding-x)",
            boxSizing: "border-box",
            background: fieldBackground({ disabled: disabledState, readOnly }),
            color: disabledState ? "var(--color-semantic-label-disable)" : curr ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
            border: `var(--component-input-border-width) solid ${ring}`,
            borderRadius: "var(--component-input-radius)",
            boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
            cursor: disabledState ? "not-allowed" : readOnly ? "default" : "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--component-input-font-size)",
            lineHeight: "var(--component-input-line-height)",
            letterSpacing: "var(--component-input-letter-spacing)",
            textAlign: "left",
            transition: "var(--component-button-transition)"
          },
          children: [
            /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }, children: [
              iconLeft && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", flex: "0 0 auto", color: "var(--color-semantic-label-assistive)" }, children: iconLeft }),
              curr && render === "chip" ? /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", maxWidth: "100%", height: 24, padding: "0 9px", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr.label }) : /* @__PURE__ */ jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr ? curr.label : placeholder })
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", flex: "0 0 auto" }, children: [
              /* @__PURE__ */ jsx(FieldStatusIcon, { invalid: isInvalid, status }),
              /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { flexShrink: 0, transform: visualOpen ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" } })
            ] })
          ]
        }
      ),
      visualOpen && /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", "aria-label": ariaLabel, "aria-labelledby": !ariaLabel && label ? labelId : void 0, style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }, children: norm.map((o, index) => {
        const on = o.value === sel;
        const isActive = index === activeIndex;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            id: `${selId}-option-${index}`,
            ref: (node) => {
              optionRefs.current[index] = node;
            },
            role: "option",
            "aria-selected": on,
            "aria-disabled": o.disabled || void 0,
            onMouseDown: (event) => event.preventDefault(),
            onClick: () => pick(index),
            onMouseEnter: () => {
              if (!o.disabled) setActiveIndex(index);
            },
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 12px", borderRadius: "var(--radius-md)", cursor: o.disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", lineHeight: "var(--component-input-line-height)", color: o.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", background: o.disabled && on ? "var(--color-semantic-fill-strong)" : on ? "var(--color-semantic-primary-surface-strong)" : isActive ? "var(--color-semantic-fill-normal)" : "transparent", boxShadow: isActive && !o.disabled ? "inset 0 0 0 2px var(--color-semantic-primary-normal)" : "none", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)" },
            children: [
              /* @__PURE__ */ jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.label }),
              on && /* @__PURE__ */ jsx(Icon, { name: "check", size: 15, color: o.disabled ? "var(--color-semantic-label-disable)" : void 0, "aria-hidden": "true", style: { flexShrink: 0 } })
            ]
          },
          o.value
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx(FieldMessage, { id: messageId, message, error, status })
  ] });
}

export {
  Select
};
//# sourceMappingURL=chunk-EFDKCUIG.js.map