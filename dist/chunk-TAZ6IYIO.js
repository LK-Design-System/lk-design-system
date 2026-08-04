"use client";

// packages/core/dist/chunk-I4PQ63MH.js
import React from "react";
import { jsx } from "react/jsx-runtime";
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}
function useMissingNameWarning(shouldWarn, message) {
  React.useEffect(() => {
    if (!shouldWarn || !isDevelopmentBuild()) return;
    console.warn(message);
  }, [shouldWarn, message]);
}
function IconButton({
  children,
  variant = "soft",
  size = "medium",
  alternative = false,
  round = true,
  label,
  style,
  disabled = false,
  disable = false,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  className,
  onClick,
  type,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  useMissingNameWarning(
    !label && rest["aria-labelledby"] == null,
    "[LDS] IconButton: label\uC740 \uC544\uC774\uCF58 \uC804\uC6A9 \uCEE8\uD2B8\uB864\uC758 \uC811\uADFC \uAC00\uB2A5\uD55C \uC774\uB984\uC785\uB2C8\uB2E4. label(\uB610\uB294 aria-labelledby)\uC744 \uC804\uB2EC\uD558\uC138\uC694."
  );
  const resolvedSize = typeof size === "number" ? size : {
    xsmall: "var(--component-icon-button-size-xs)",
    xs: "var(--component-icon-button-size-xs)",
    custom: "var(--component-icon-button-size-custom)",
    small: "var(--component-icon-button-size-sm)",
    sm: "var(--component-icon-button-size-sm)",
    medium: "var(--component-icon-button-size-md)",
    md: "var(--component-icon-button-size-md)"
  }[size] || "var(--component-icon-button-size-md)";
  const palettes = {
    soft: { bg: "var(--color-semantic-secondary-surface)", bgHover: "var(--color-semantic-secondary-surface)", fg: "var(--color-semantic-label-normal)", bd: "none" },
    solid: { bg: "var(--color-semantic-secondary-normal)", bgHover: "var(--color-semantic-secondary-normal)", fg: "var(--color-semantic-static-white)", bd: "none" },
    signal: { bg: "var(--color-semantic-primary-normal)", bgHover: "var(--color-semantic-primary-normal)", fg: "var(--color-semantic-static-white)", bd: "none" },
    ghost: { bg: "var(--color-semantic-background-elevated-normal)", bgHover: "var(--color-semantic-background-elevated-normal)", fg: "var(--color-semantic-label-normal)", bd: "1px solid var(--color-semantic-line-solid-normal)" },
    plain: { bg: "transparent", bgHover: "color-mix(in srgb, var(--viewer-foreground, var(--color-semantic-label-normal)) 7%, transparent)", fg: "var(--viewer-foreground, var(--color-semantic-label-normal))", bd: "1px solid transparent" },
    "on-dark": {
      bg: "color-mix(in srgb, var(--color-semantic-static-white) 10%, transparent)",
      bgHover: "color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)",
      fg: "var(--color-semantic-static-white)",
      bd: "1px solid color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)"
    }
  };
  const p = palettes[alternative ? "on-dark" : variant] || palettes.soft;
  const disabledState = disabled || disable;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...rest,
      type: type ?? "button",
      "aria-label": label,
      "aria-disabled": ariaBlocked || void 0,
      className: ["lk-iconbtn", `lk-iconbtn--${variant}`, className].filter(Boolean).join(" "),
      disabled: disabledState,
      onClick: (event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        if (!blocked) setPressed(true);
        onMouseDown?.(e);
      },
      onMouseUp: (e) => {
        setPressed(false);
        onMouseUp?.(e);
      },
      onKeyDown: (e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) setPressed(true);
        onKeyDown?.(e);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") setPressed(false);
        onKeyUp?.(e);
      },
      onBlur: (e) => {
        setPressed(false);
        onBlur?.(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: resolvedSize,
        height: resolvedSize,
        color: blocked ? "var(--color-semantic-label-disable)" : p.fg,
        background: blocked ? "var(--color-semantic-fill-normal)" : pressed ? `color-mix(in srgb, ${p.bgHover || p.bg} 88%, var(--color-semantic-label-normal))` : hover ? `color-mix(in srgb, ${p.bgHover || p.bg} 96%, var(--color-semantic-label-normal))` : p.bg,
        border: blocked ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)" : p.bd,
        borderRadius: round ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: blocked ? "not-allowed" : "pointer",
        opacity: 1,
        boxShadow: "none",
        transition: "var(--component-button-transition)",
        WebkitTapHighlightColor: "transparent",
        ...style
      },
      children
    }
  );
}

export {
  IconButton
};
//# sourceMappingURL=chunk-TAZ6IYIO.js.map