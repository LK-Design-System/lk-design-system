"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/content/ContentBadge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var BRAND_FOREGROUND = "color-mix(in srgb, var(--color-semantic-primary-normal) 60%, var(--color-semantic-label-normal))";
var TONES = {
  signal: "var(--color-semantic-primary-normal)",
  accent: "var(--color-semantic-primary-normal)",
  navy: "var(--color-semantic-brand-surface)",
  neutral: "var(--color-semantic-label-alternative)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  warning: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)"
};
var SOLID_TONES = {
  signal: "var(--color-semantic-primary-normal)",
  accent: "var(--color-semantic-primary-normal)",
  navy: "var(--color-semantic-brand-surface)",
  neutral: "var(--color-semantic-label-alternative)",
  positive: "var(--color-semantic-status-positive-text)",
  cautionary: "var(--color-semantic-status-cautionary-text)",
  warning: "var(--color-semantic-status-cautionary-text)",
  negative: "var(--color-semantic-status-negative-text)"
};
var TEXT_TONES = {
  signal: BRAND_FOREGROUND,
  accent: BRAND_FOREGROUND,
  navy: "var(--color-semantic-brand-ink)",
  neutral: "var(--color-semantic-label-neutral)",
  positive: "var(--color-semantic-status-positive-text)",
  cautionary: "var(--color-semantic-status-cautionary-text)",
  warning: "var(--color-semantic-status-cautionary-text)",
  negative: "var(--color-semantic-status-negative-text)"
};
var SIZE_XS = {
  padding: "3px 6px",
  fontSize: "var(--caption2-size)",
  lineHeight: "var(--caption2-line)",
  gap: "var(--space-0-5)",
  icon: 12,
  radius: "var(--radius-sm)"
};
var SIZE_SM = {
  padding: "4px 6px",
  fontSize: "var(--caption1-size)",
  lineHeight: "var(--caption1-line)",
  gap: "var(--space-1)",
  icon: 14,
  radius: "var(--radius-sm)"
};
var SIZE_MD = {
  padding: "5px 8px",
  fontSize: "var(--label2-size)",
  lineHeight: "var(--label2-line)",
  gap: 4,
  icon: 16,
  radius: "var(--radius-8)"
};
var SIZE = {
  xsmall: SIZE_XS,
  xs: SIZE_XS,
  small: SIZE_SM,
  sm: SIZE_SM,
  medium: SIZE_MD,
  md: SIZE_MD,
  lg: SIZE_MD
};
function normalizeVariant(variant) {
  if (variant === "outline") return "outlined";
  if (variant === "soft") return "default";
  return variant || "default";
}
function decorateIcon(icon, size) {
  if (!_react2.default.isValidElement(icon)) return icon;
  const props = icon.props || {};
  return _react2.default.cloneElement(icon, {
    size: _nullishCoalesce(props.size, () => ( size)),
    "aria-hidden": _nullishCoalesce(props["aria-hidden"], () => ( true)),
    focusable: _nullishCoalesce(props.focusable, () => ( false))
  });
}
function ContentBadge({
  children,
  tone,
  color = tone ? void 0 : "neutral",
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
  const softBg = accentBackgroundColor || (resolvedTone === "accent" ? "color-mix(in srgb, var(--color-semantic-primary-normal) 14%, var(--color-semantic-background-elevated-normal))" : neutralColor ? "var(--color-semantic-fill-normal)" : `color-mix(in srgb, ${baseColor} 14%, var(--color-semantic-background-elevated-normal))`);
  const solidBg = accentBackgroundColor || (neutralColor ? "var(--color-semantic-fill-strong)" : SOLID_TONES[resolvedTone] || baseColor);
  const solidFg = accentContentColor || (neutralColor ? "var(--color-semantic-label-neutral)" : resolvedTone === "navy" ? "var(--color-semantic-static-white)" : "var(--color-semantic-background-normal-normal)");
  const borderColor = accentContentColor || (neutralColor ? "var(--color-semantic-line-normal-normal)" : `color-mix(in srgb, ${baseColor} 48%, var(--color-semantic-background-elevated-normal))`);
  const looks = {
    solid: {
      background: solidBg,
      color: solidFg,
      border: "1px solid transparent"
    },
    default: {
      background: softBg,
      color: accentContentColor || TEXT_TONES[resolvedTone] || TEXT_TONES.neutral,
      border: "1px solid transparent"
    },
    outlined: {
      background: "transparent",
      color: accentContentColor || TEXT_TONES[resolvedTone] || TEXT_TONES.neutral,
      border: `1px solid ${borderColor}`
    }
  }[resolvedVariant] || {};
  const startIcon = _nullishCoalesce(leading, () => ( (iconPosition !== "end" ? icon : null)));
  const endIcon = _nullishCoalesce(trailing, () => ( (iconPosition === "end" ? icon : null)));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      style: {
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
        ...style
      },
      ...rest,
      children: [
        startIcon != null && decorateIcon(startIcon, resolvedSize.icon),
        children,
        endIcon != null && decorateIcon(endIcon, resolvedSize.icon)
      ]
    }
  );
}



exports.ContentBadge = ContentBadge;
//# sourceMappingURL=chunk-YABSG6LK.cjs.map