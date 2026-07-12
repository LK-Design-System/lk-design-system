"use client";

// components/feedback/Chip.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Chip({
  children,
  as = "span",
  size = "md",
  variant = "default",
  active = false,
  selected = false,
  disabled = false,
  disable = false,
  leading,
  thumbnail,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const disabledState = disabled || disable;
  const activeState = active || selected || hover && !disabledState;
  const normalizedSize = {
    xsmall: "xs",
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const sizes = {
    xs: {
      height: "var(--component-chip-height-xs)",
      paddingX: "var(--component-chip-padding-x-xs)",
      fontSize: "var(--component-chip-font-size-xs)",
      letterSpacing: "var(--component-chip-letter-spacing-xs)",
      gap: "var(--component-chip-gap-xs)",
      radius: "var(--component-chip-radius-xs)",
      media: "var(--component-chip-media-size-xs)"
    },
    sm: {
      height: "var(--component-chip-height-sm)",
      paddingX: "var(--component-chip-padding-x-sm)",
      fontSize: "var(--component-chip-font-size-sm)",
      letterSpacing: "var(--component-chip-letter-spacing-sm)",
      gap: "var(--component-chip-gap-sm)",
      radius: "var(--component-chip-radius-sm)",
      media: "var(--component-chip-media-size-sm)"
    },
    md: {
      height: "var(--component-chip-height-md)",
      paddingX: "var(--component-chip-padding-x-md)",
      fontSize: "var(--component-chip-font-size-md)",
      letterSpacing: "var(--component-chip-letter-spacing-md)",
      gap: "var(--component-chip-gap-md)",
      radius: "var(--component-chip-radius-md)",
      media: "var(--component-chip-media-size-md)"
    },
    lg: {
      height: "var(--component-chip-height-lg)",
      paddingX: "var(--component-chip-padding-x-lg)",
      fontSize: "var(--component-chip-font-size-lg)",
      letterSpacing: "var(--component-chip-letter-spacing-lg)",
      gap: "var(--component-chip-gap-lg)",
      radius: "var(--component-chip-radius-lg)",
      media: "var(--component-chip-media-size-lg)"
    }
  };
  const s = sizes[normalizedSize] || sizes.md;
  const palettes = {
    default: {
      bg: activeState ? "var(--component-chip-bg-selected)" : "var(--component-chip-bg)",
      bgHover: activeState ? "var(--component-chip-bg-selected)" : "var(--component-chip-bg-hover)",
      fg: activeState ? "var(--component-chip-fg-active)" : "var(--component-chip-fg)",
      border: activeState ? "var(--component-chip-border-active)" : "var(--component-chip-border)"
    },
    outlined: {
      bg: "transparent",
      bgHover: activeState ? "var(--component-chip-bg-selected)" : "transparent",
      fg: activeState ? "var(--component-chip-fg-active)" : "var(--component-chip-fg)",
      border: activeState ? "var(--component-chip-border-active)" : "var(--component-chip-border)"
    },
    solid: {
      bg: "var(--component-chip-solid-bg)",
      bgHover: "var(--component-chip-solid-bg)",
      fg: "var(--component-chip-solid-fg)",
      border: "var(--component-chip-solid-border)"
    }
  };
  const p = palettes[variant] || palettes.default;
  const Comp = as;
  return /* @__PURE__ */ jsxs(
    Comp,
    {
      disabled: as === "button" ? disabledState : void 0,
      "aria-disabled": as !== "button" && disabledState ? true : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      onClick: (e) => {
        if (disabledState) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        height: s.height,
        paddingInline: s.paddingX,
        background: hover && !disabledState ? p.bgHover : p.bg,
        border: p.border,
        borderRadius: s.radius,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--component-chip-font-weight)",
        letterSpacing: s.letterSpacing,
        color: disabledState ? "var(--color-semantic-label-disable)" : p.fg,
        opacity: 1,
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: disabledState ? "not-allowed" : as === "a" || onClick || rest.onClick ? "pointer" : "default",
        transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        thumbnail && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: s.media,
              height: s.media,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              flexShrink: 0,
              marginLeft: `calc(${s.gap} * -1)`
            },
            children: thumbnail
          }
        ),
        !thumbnail && leading && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: leading }),
        children
      ]
    }
  );
}

export {
  Chip
};
//# sourceMappingURL=chunk-3OKVA7NT.js.map