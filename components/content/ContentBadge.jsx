import React from "react";

const TONES = {
  signal: "var(--lk-accent-ink)",
  accent: "var(--color-accent)",
  navy: "var(--surface-inverse)",
  neutral: "var(--label-alternative)",
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  warning: "var(--bw-amber)",
  negative: "var(--bw-red)",
};

const SIZE = {
  xsmall: { height: 18, padding: "0 6px", fontSize: 11, gap: 3, icon: 11 },
  xs: { height: 18, padding: "0 6px", fontSize: 11, gap: 3, icon: 11 },
  small: { height: 22, padding: "0 8px", fontSize: 12, gap: 4, icon: 12 },
  sm: { height: 22, padding: "0 8px", fontSize: 12, gap: 4, icon: 12 },
  medium: { height: 26, padding: "0 10px", fontSize: 13, gap: 5, icon: 14 },
  md: { height: 26, padding: "0 10px", fontSize: 13, gap: 5, icon: 14 },
  lg: { height: 26, padding: "0 10px", fontSize: 13, gap: 5, icon: 14 },
};

function normalizeVariant(variant) {
  if (variant === "outline") return "outlined";
  if (variant === "soft") return "default";
  return variant || "default";
}

function decorateIcon(icon, size) {
  if (!React.isValidElement(icon)) return icon;
  const props = icon.props || {};
  return React.cloneElement(icon, {
    size: props.size ?? size,
    "aria-hidden": props["aria-hidden"] ?? true,
    focusable: props.focusable ?? false,
  });
}

/**
 * LK ROBOTICS — ContentBadge
 * Content Badge label for content state/attributes. Supports the documented axes:
 * variant solid/default/outlined, optional icons, xsmall/small/medium size,
 * neutral/accent color, and accent color customization. Legacy tone/soft/outline
 * names remain supported for compatibility.
 */
export function ContentBadge({
  children,
  tone,
  color = tone ? undefined : "neutral",
  variant = "default",
  size = "small",
  icon,
  iconPosition = "start",
  leading,
  trailing,
  accentBackgroundColor,
  accentContentColor,
  style,
  ...rest
}) {
  const resolvedSize = SIZE[size] || SIZE.small;
  const resolvedVariant = normalizeVariant(variant);
  const resolvedTone = tone || color || "neutral";
  const baseColor = accentContentColor || TONES[resolvedTone] || TONES.neutral;
  const neutralColor = resolvedTone === "neutral";
  const softBg =
    accentBackgroundColor ||
    (resolvedTone === "accent"
      ? "color-mix(in srgb, var(--color-accent) 14%, var(--surface-card))"
      : neutralColor
        ? "var(--fill-normal)"
        : `color-mix(in srgb, ${baseColor} 14%, var(--surface-card))`);
  const solidBg =
    accentBackgroundColor || (neutralColor ? "var(--fill-strong)" : baseColor);
  const solidFg =
    accentContentColor ||
    (neutralColor ? "var(--label-neutral)" : "var(--text-on-signal)");
  const borderColor =
    accentContentColor ||
    (neutralColor
      ? "var(--line-normal)"
      : `color-mix(in srgb, ${baseColor} 48%, var(--surface-card))`);
  const looks =
    {
      solid: {
        background: solidBg,
        color: solidFg,
        border: "1px solid transparent",
      },
      default: {
        background: softBg,
        color: baseColor,
        border: "1px solid transparent",
      },
      outlined: {
        background: "transparent",
        color: baseColor,
        border: `1px solid ${borderColor}`,
      },
    }[resolvedVariant] || {};
  const startIcon = leading ?? (iconPosition !== "end" ? icon : null);
  const endIcon = trailing ?? (iconPosition === "end" ? icon : null);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: resolvedSize.gap,
        minWidth: resolvedSize.height,
        height: resolvedSize.height,
        padding: resolvedSize.padding,
        boxSizing: "border-box",
        fontFamily: "var(--font-sans)",
        fontSize: resolvedSize.fontSize,
        lineHeight: 1,
        fontWeight: "var(--fw-bold)",
        letterSpacing: 0,
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
        ...looks,
        ...style,
      }}
      {...rest}
    >
      {startIcon != null && decorateIcon(startIcon, resolvedSize.icon)}
      {children}
      {endIcon != null && decorateIcon(endIcon, resolvedSize.icon)}
    </span>
  );
}
