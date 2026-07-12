"use client";

// components/selection/ToggleButton.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZE_STYLES = {
  sm: {
    height: "var(--component-button-height-sm)",
    padding: "var(--component-button-padding-sm)",
    fontSize: "var(--component-button-font-size-sm)",
    lineHeight: "var(--component-button-line-height-sm)",
    letterSpacing: "var(--component-button-letter-spacing-sm)",
    radius: "var(--component-button-radius-sm)",
    gap: "var(--component-button-gap-sm)"
  },
  md: {
    height: "var(--component-button-height-md)",
    padding: "var(--component-button-padding-md)",
    fontSize: "var(--component-button-font-size-md)",
    lineHeight: "var(--component-button-line-height-md)",
    letterSpacing: "var(--component-button-letter-spacing-md)",
    radius: "var(--component-button-radius-md)",
    gap: "var(--component-button-gap-md)"
  },
  lg: {
    height: "var(--component-button-height-lg)",
    padding: "var(--component-button-padding-lg)",
    fontSize: "var(--component-button-font-size-lg)",
    lineHeight: "var(--component-button-line-height-lg)",
    letterSpacing: "var(--component-button-letter-spacing-lg)",
    radius: "var(--component-button-radius-lg)",
    gap: "var(--component-button-gap-lg)"
  }
};
function normalizeSize(size) {
  return { small: "sm", medium: "md", large: "lg" }[size] || size;
}
function ToggleButton({
  children,
  pressed,
  defaultPressed,
  onChange,
  icon,
  size = "md",
  disabled = false,
  disable = false,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const isControlled = pressed !== void 0;
  const [internal, setInternal] = React.useState(!!defaultPressed);
  const [hover, setHover] = React.useState(false);
  const [pointerPressed, setPointerPressed] = React.useState(false);
  const on = isControlled ? pressed : internal;
  const disabledState = disabled || disable;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const normalizedSize = normalizeSize(size);
  const sizeStyle = SIZE_STYLES[normalizedSize] || SIZE_STYLES.md;
  const iconOnly = children == null;
  const restingBackground = on ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)";
  const interactionBackground = pointerPressed ? `color-mix(in srgb, ${restingBackground} 88%, var(--color-semantic-label-normal))` : hover && !on ? "var(--color-semantic-fill-alternative)" : restingBackground;
  const toggle = (event) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...rest,
      type: "button",
      "aria-pressed": on,
      "aria-label": ariaLabel ?? (iconOnly ? "\uD1A0\uAE00" : void 0),
      "aria-disabled": ariaBlocked || void 0,
      disabled: disabledState,
      className: ["lk-toggle-button", className].filter(Boolean).join(" "),
      onClick: toggle,
      onMouseEnter: (event) => {
        setHover(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        setHover(false);
        setPointerPressed(false);
        onMouseLeave?.(event);
      },
      onMouseDown: (event) => {
        if (!blocked) setPointerPressed(true);
        onMouseDown?.(event);
      },
      onMouseUp: (event) => {
        setPointerPressed(false);
        onMouseUp?.(event);
      },
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPointerPressed(true);
        onKeyDown?.(event);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPointerPressed(false);
        onKeyUp?.(event);
      },
      onBlur: (event) => {
        setPointerPressed(false);
        onBlur?.(event);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyle.gap,
        height: sizeStyle.height,
        width: iconOnly ? sizeStyle.height : void 0,
        padding: iconOnly ? 0 : sizeStyle.padding,
        background: blocked ? "var(--component-button-disabled-bg)" : interactionBackground,
        border: `var(--border-thin) solid ${blocked ? "var(--color-semantic-line-normal-neutral)" : on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
        borderRadius: sizeStyle.radius,
        cursor: blocked ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        fontWeight: "var(--component-button-font-weight)",
        letterSpacing: sizeStyle.letterSpacing,
        color: blocked ? "var(--color-semantic-label-disable)" : on ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
        transition: "var(--component-button-transition)",
        whiteSpace: "nowrap",
        ...style
      },
      children: [
        icon,
        children != null && /* @__PURE__ */ jsx("span", { children })
      ]
    }
  );
}

export {
  ToggleButton
};
//# sourceMappingURL=chunk-VATV6T5K.js.map