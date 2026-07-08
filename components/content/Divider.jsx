import React from "react";

/**
 * LK ROBOTICS Divider
 * Layout divider with normal/thick and horizontal/vertical variants.
 */
export function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  style,
  ...rest
}) {
  const thickness =
    variant === "thick"
      ? "var(--component-divider-thickness-thick)"
      : "var(--component-divider-thickness-normal)";
  const color =
    variant === "thick"
      ? "var(--component-divider-color-thick)"
      : "var(--component-divider-color-normal)";

  if (vertical) {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        style={{
          display: "inline-block",
          width: thickness,
          alignSelf: "stretch",
          minHeight: 32,
          background: color,
          ...style,
        }}
        {...rest}
      />
    );
  }

  if (label != null) {
    const rule = { flex: 1, height: thickness, background: color };
    return (
      <div
        role="separator"
        style={{ display: "flex", alignItems: "center", gap: 14, ...style }}
        {...rest}
      >
        <span style={rule} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: "var(--fw-semibold)",
            letterSpacing: 0,
            color: "var(--color-semantic-label-alternative)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span style={rule} />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      style={{
        border: "none",
        height: thickness,
        background: color,
        margin: `0 ${inset}px`,
        ...style,
      }}
      {...rest}
    />
  );
}
