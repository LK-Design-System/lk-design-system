import React from "react";

const TONES = {
  signal: "var(--color-semantic-primary-normal)",
  accent: "var(--color-semantic-primary-normal)",
  navy: "var(--color-semantic-inverse-background)",
  neutral: "var(--color-semantic-label-alternative)",
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  warning: "var(--bw-amber)",
  negative: "var(--bw-red)",
};

/* WDS scale: heights derive from padding + line-height (no fixed height). */
const SIZE_XS = {
  padding: "3px 6px",
  fontSize: 11,
  lineHeight: "var(--caption2-line)",
  gap: 2,
  icon: 12,
  radius: "var(--radius-sm)",
};
const SIZE_SM = {
  padding: "4px 6px",
  fontSize: 12,
  lineHeight: "var(--caption1-line)",
  gap: 3,
  icon: 14,
  radius: "var(--radius-sm)",
};
const SIZE_MD = {
  padding: "5px 8px",
  fontSize: 13,
  lineHeight: "var(--label2-line)",
  gap: 4,
  icon: 16,
  radius: "var(--radius-8)",
};
const SIZE = {
  xsmall: SIZE_XS,
  xs: SIZE_XS,
  small: SIZE_SM,
  sm: SIZE_SM,
  medium: SIZE_MD,
  md: SIZE_MD,
  lg: SIZE_MD,
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
      ? "color-mix(in srgb, var(--color-semantic-primary-normal) 14%, var(--color-semantic-background-elevated-normal))"
      : neutralColor
        ? "var(--color-semantic-fill-normal)"
        : `color-mix(in srgb, ${baseColor} 14%, var(--color-semantic-background-elevated-normal))`);
  const solidBg =
    accentBackgroundColor || (neutralColor ? "var(--color-semantic-fill-strong)" : baseColor);
  const solidFg =
    accentContentColor ||
    (neutralColor ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-static-white)");
  const borderColor =
    accentContentColor ||
    (neutralColor
      ? "var(--color-semantic-line-normal-normal)"
      : `color-mix(in srgb, ${baseColor} 48%, var(--color-semantic-background-elevated-normal))`);
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
        padding: resolvedSize.padding,
        boxSizing: "border-box",
        fontFamily: "var(--font-sans)",
        fontSize: resolvedSize.fontSize,
        lineHeight: resolvedSize.lineHeight,
        fontWeight: "var(--fw-medium)",
        letterSpacing: 0,
        borderRadius: resolvedSize.radius,
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
