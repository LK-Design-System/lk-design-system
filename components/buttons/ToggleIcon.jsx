import React from "react";

/**
 * Toggle Icon
 * Icon-only action that keeps an on/off pressed state.
 */
export function ToggleIcon({
  children,
  pressed,
  defaultPressed = false,
  onChange,
  label,
  size = "md",
  variant = "default",
  disabled = false,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type,
  'aria-disabled': ariaDisabled,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const [hover, setHover] = React.useState(false);
  const active = pressed ?? internal;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === 'true';
  const blocked = disabled || ariaBlocked;
  const side =
    size === "sm"
      ? "var(--component-toggle-icon-size-sm)"
      : "var(--component-toggle-icon-size-md)";

  const setNext = (event) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !active;
    if (pressed === undefined) setInternal(next);
    onChange && onChange(next);
  };

  const palettes = {
    default: {
      background: "var(--component-toggle-icon-bg)",
      hoverBackground: "var(--color-semantic-fill-alternative)",
      foreground: "var(--component-toggle-icon-fg)",
      border: "var(--component-toggle-icon-border)",
    },
    plain: {
      background: "transparent",
      hoverBackground: "color-mix(in srgb, var(--viewer-foreground, var(--color-semantic-label-normal)) 7%, transparent)",
      foreground: "var(--viewer-foreground, var(--color-semantic-label-normal))",
      border: "var(--border-thin) solid transparent",
    },
    "on-dark": {
      background: "color-mix(in srgb, var(--color-semantic-static-white) 10%, transparent)",
      hoverBackground: "color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)",
      foreground: "var(--color-semantic-static-white)",
      border: "var(--border-thin) solid color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)",
    },
  };
  const palette = palettes[variant] ?? palettes.default;

  return (
    <button
      {...rest}
      type={type ?? "button"}
      aria-label={label}
      aria-pressed={active}
      aria-disabled={ariaBlocked || undefined}
      disabled={disabled}
      className={["lk-toggle-icon", `lk-toggle-icon--${variant}`, className].filter(Boolean).join(" ")}
      onClick={setNext}
      onMouseEnter={(event) => {
        setHover(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHover(false);
        onMouseLeave?.(event);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: side,
        height: side,
        color: blocked
          ? "var(--color-semantic-label-disable)"
          : active
            ? "var(--component-toggle-icon-fg-active)"
            : palette.foreground,
        background: blocked
          ? "var(--color-semantic-fill-normal)"
          : active
            ? "var(--component-toggle-icon-bg-active)"
            : hover
              ? palette.hoverBackground
              : palette.background,
        border: blocked
          ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)"
          : active
            ? "var(--border-thin) solid transparent"
            : palette.border,
        borderRadius: "var(--component-toggle-icon-radius)",
        cursor: blocked ? "not-allowed" : "pointer",
        transition: "var(--component-button-transition)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
