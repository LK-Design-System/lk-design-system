"use client";
import {
  BrandLogo
} from "./chunk-EKVHKFPY.js";

// components/buttons/SocialButton.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SocialButton({
  provider = "google",
  // google | apple | facebook
  align = "center",
  // center | left  (킷의 Centre / Left Aligned)
  tone = "outline",
  // outline | brand
  iconOnly = false,
  // 원형 아이콘 버튼(48px 서클) — 레퍼런스 킷의 소셜 아이콘 행
  full = false,
  disabled = false,
  as = "button",
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onClick,
  type,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const KIT_SHADOW = "0px 0px 3px 0px rgba(0,0,0,0.084), 0px 2px 3px 0px rgba(0,0,0,0.168)";
  const brandFills = {
    google: { bg: "rgb(255,255,255)", bgHover: "rgb(255,255,255)", fg: "rgba(0,0,0,0.54)", bd: "none", shadow: KIT_SHADOW, mono: false },
    apple: { bg: "rgb(0,0,0)", bgHover: "rgb(0,0,0)", fg: "#FFFFFF", bd: "none", shadow: KIT_SHADOW, mono: false },
    facebook: { bg: "rgb(20,101,216)", bgHover: "rgb(20,101,216)", fg: "#FFFFFF", bd: "none", shadow: "none", mono: true }
  };
  const outline = {
    bg: "var(--color-semantic-background-elevated-normal, #FFFFFF)",
    bgHover: "var(--color-semantic-background-elevated-normal, #FFFFFF)",
    fg: "var(--color-semantic-label-normal)",
    bd: "1px solid var(--color-semantic-line-solid-normal)",
    bdHover: "1px solid var(--color-semantic-line-solid-normal)",
    shadow: "none",
    mono: false
  };
  const labels = { google: "Google\uB85C \uACC4\uC18D\uD558\uAE30", apple: "Apple\uB85C \uACC4\uC18D\uD558\uAE30", facebook: "Facebook\uC73C\uB85C \uACC4\uC18D\uD558\uAE30" };
  const p = tone === "brand" ? brandFills[provider] || brandFills.google : outline;
  const active = !disabled;
  const composed = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: iconOnly ? "center" : align === "left" ? "flex-start" : "center",
    gap: iconOnly ? 0 : "9px",
    height: iconOnly ? "48px" : "52px",
    padding: iconOnly ? "0" : "0 20px",
    width: iconOnly ? "48px" : full ? "100%" : void 0,
    flexShrink: iconOnly ? 0 : void 0,
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--body1-size)",
    fontWeight: "var(--fw-bold)",
    letterSpacing: 0,
    lineHeight: 1,
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: active && hover && p.bdHover ? p.bdHover : p.bd,
    borderRadius: iconOnly ? "999px" : "var(--radius-md)",
    boxShadow: p.shadow,
    transform: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "var(--component-button-transition)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    ...style
  };
  const Comp = as;
  const isNativeButton = as === "button";
  const label = typeof children === "string" ? children : labels[provider];
  return /* @__PURE__ */ jsxs(
    Comp,
    {
      className: `lk-social-btn lk-social-btn--${provider}`,
      style: composed,
      disabled: isNativeButton ? disabled : void 0,
      "aria-disabled": !isNativeButton && disabled ? true : void 0,
      type: isNativeButton ? type ?? "button" : void 0,
      "aria-label": iconOnly ? label : void 0,
      title: iconOnly ? label : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        onMouseUp && onMouseUp(e);
      },
      onClick: (e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick && onClick(e);
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(BrandLogo, { name: provider, size: iconOnly ? 22 : 20, mono: p.mono, decorative: true, style: { flexShrink: 0 } }),
        !iconOnly && /* @__PURE__ */ jsx("span", { children: children ?? labels[provider] })
      ]
    }
  );
}

export {
  SocialButton
};
//# sourceMappingURL=chunk-B4IUSU64.js.map