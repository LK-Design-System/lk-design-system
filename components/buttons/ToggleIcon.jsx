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
  disabled = false,
  style,
  type,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const active = pressed ?? internal;
  const side =
    size === "sm"
      ? "var(--component-toggle-icon-size-sm)"
      : "var(--component-toggle-icon-size-md)";

  const setNext = () => {
    if (disabled) return;
    const next = !active;
    if (pressed === undefined) setInternal(next);
    onChange && onChange(next);
  };

  return (
    <button
      type={type ?? "button"}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className="lk-toggle-icon"
      onClick={setNext}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: side,
        height: side,
        color: disabled
          ? "var(--color-semantic-label-disable)"
          : active
            ? "var(--component-toggle-icon-fg-active)"
            : "var(--component-toggle-icon-fg)",
        background: disabled
          ? "var(--color-semantic-fill-normal)"
          : active
            ? "var(--component-toggle-icon-bg-active)"
            : "var(--component-toggle-icon-bg)",
        border: disabled
          ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)"
          : active
            ? "var(--border-thin) solid transparent"
            : "var(--component-toggle-icon-border)",
        borderRadius: "var(--component-toggle-icon-radius)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "var(--component-button-transition)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
