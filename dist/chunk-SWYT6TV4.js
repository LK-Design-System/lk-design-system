"use client";

// components/buttons/Fab.jsx
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
function Fab({
  children,
  variant = "signal",
  size = "md",
  label,
  style,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  className,
  type,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  useMissingNameWarning(
    !label && !ariaLabel && rest["aria-labelledby"] == null,
    "[LDS] Fab: label\uC740 \uC544\uC774\uCF58 \uC804\uC6A9 \uCEE8\uD2B8\uB864\uC758 \uC811\uADFC \uAC00\uB2A5\uD55C \uC774\uB984\uC785\uB2C8\uB2E4. label(\uB610\uB294 aria-label / aria-labelledby)\uC744 \uC804\uB2EC\uD558\uC138\uC694."
  );
  const d = size === "sm" ? 48 : size === "lg" ? 64 : 56;
  const palettes = {
    signal: { bg: "var(--color-semantic-primary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-accent)" },
    dark: { bg: "var(--color-semantic-inverse-background)", fg: "var(--color-semantic-inverse-label)", sh: "var(--shadow-md)" },
    primary: { bg: "var(--color-semantic-primary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-accent)" },
    secondary: { bg: "var(--color-semantic-secondary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-indigo)" },
    white: { bg: "var(--color-semantic-background-elevated-normal)", fg: "var(--color-semantic-label-normal)", sh: "var(--shadow-md)" }
  };
  const p = palettes[variant] || palettes.signal;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabled || ariaBlocked;
  const interactiveBackground = pressed ? `color-mix(in srgb, ${p.bg} 88%, var(--color-semantic-label-normal))` : hover ? `color-mix(in srgb, ${p.bg} 96%, var(--color-semantic-label-normal))` : p.bg;
  return (
    /* `rest` is spread FIRST — matching Button and IconButton — so the
       component's own type, accessible name, disabled semantics, and handlers
       cannot be silently clobbered by a consumer prop. */
    /* @__PURE__ */ jsx(
      "button",
      {
        ...rest,
        type: type ?? "button",
        "aria-label": label ?? ariaLabel,
        "aria-disabled": ariaBlocked || void 0,
        disabled,
        className: ["lk-fab", `lk-fab--${variant}`, className].filter(Boolean).join(" "),
        onClick: (event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        },
        onMouseEnter: (event) => {
          setHover(true);
          onMouseEnter?.(event);
        },
        onMouseLeave: (event) => {
          setHover(false);
          setPressed(false);
          onMouseLeave?.(event);
        },
        onMouseDown: (event) => {
          if (!blocked) setPressed(true);
          onMouseDown?.(event);
        },
        onMouseUp: (event) => {
          setPressed(false);
          onMouseUp?.(event);
        },
        onKeyDown: (event) => {
          if (!blocked && (event.key === "Enter" || event.key === " ")) setPressed(true);
          onKeyDown?.(event);
        },
        onKeyUp: (event) => {
          if (event.key === "Enter" || event.key === " ") setPressed(false);
          onKeyUp?.(event);
        },
        onBlur: (event) => {
          setPressed(false);
          onBlur?.(event);
        },
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: d,
          height: d,
          borderRadius: "50%",
          border: blocked ? "var(--component-button-disabled-outlined-border)" : variant === "white" ? "1px solid var(--color-semantic-line-solid-normal)" : "none",
          background: blocked ? "var(--component-button-disabled-bg)" : interactiveBackground,
          color: blocked ? "var(--component-button-disabled-fg-outlined)" : p.fg,
          cursor: blocked ? "not-allowed" : "pointer",
          boxShadow: blocked ? "none" : p.sh || "var(--shadow-md)",
          transform: "none",
          transition: "var(--component-button-transition)",
          ...style
        },
        children
      }
    )
  );
}

export {
  Fab
};
//# sourceMappingURL=chunk-SWYT6TV4.js.map