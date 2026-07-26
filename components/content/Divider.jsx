import React from "react";

/**
 * LK ROBOTICS Divider
 * Layout divider with normal/thick and horizontal/vertical variants.
 *
 * Accessibility — a divider is either SEMANTIC (default: exposed as
 * `role="separator"`, meaning "the content changes here") or DECORATIVE
 * (`decorative`: `role="none"` + `aria-hidden`, a purely visual rule that adds
 * nothing to the reading order). Native `<hr>` already carries the separator
 * role, so it is not re-declared.
 */
export function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  decorative = false,
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
  /* Decorative: role="none" strips the implicit separator role, aria-hidden
     keeps the rule (and any label text) out of the accessibility tree. */
  const decorativeProps = { role: "none", "aria-hidden": "true" };
  const semantics = decorative ? decorativeProps : null;
  const verticalSemantics = decorative
    ? decorativeProps
    : { role: "separator", "aria-orientation": "vertical" };

  if (vertical) {
    return (
      <span
        {...verticalSemantics}
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
        {...(decorative
          ? decorativeProps
          : {
              role: "separator",
              /* separator gets no name from its contents — expose the visible
                 label explicitly so "또는" is announced, not just a boundary. */
              "aria-label": typeof label === "string" ? label : undefined,
            })}
        style={{ display: "flex", alignItems: "center", gap: 'var(--space-3-5)', ...style }}
        {...rest}
      >
        <span style={rule} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--label2-size)",
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
      {...semantics}
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
