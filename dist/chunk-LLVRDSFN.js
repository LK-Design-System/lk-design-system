"use client";
import {
  Spinner
} from "./chunk-I5FLPUYL.js";

// components/buttons/TextButton.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var BRAND_FOREGROUND = "color-mix(in srgb, var(--color-semantic-primary-normal) 60%, var(--color-semantic-label-normal))";
function TextButton({
  children,
  tone = "signal",
  color,
  size = "md",
  arrow = false,
  underline = false,
  disabled = false,
  disable = false,
  loading = false,
  loadingLabel = "\uBD88\uB7EC\uC624\uB294 \uC911",
  as = "button",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const normalizedSize = {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const normalizedColor = color === "assistive" ? "assistive" : color === "primary" ? "primary" : void 0;
  const textColor = normalizedColor === "assistive" ? "var(--color-semantic-label-alternative)" : normalizedColor === "primary" ? BRAND_FOREGROUND : tone === "neutral" ? "var(--color-semantic-label-neutral)" : tone === "danger" ? "var(--color-semantic-status-negative-text)" : BRAND_FOREGROUND;
  const fs = normalizedSize === "sm" ? "var(--label1-size)" : normalizedSize === "lg" ? 17 : "var(--body1-size)";
  const ls = normalizedSize === "sm" ? "var(--label1-spacing)" : "var(--body1-spacing)";
  const h = normalizedSize === "sm" ? 28 : normalizedSize === "lg" ? 36 : 32;
  const nativeDisabled = disabled || disable;
  const disabledState = nativeDisabled || loading;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const Comp = as;
  return /* @__PURE__ */ jsxs(
    Comp,
    {
      ...rest,
      className: ["lk-textbtn", className].filter(Boolean).join(" "),
      disabled: as === "button" ? nativeDisabled : void 0,
      type: as === "button" ? type ?? "button" : void 0,
      "aria-label": loading ? loadingLabel : ariaLabel,
      "aria-busy": loading || void 0,
      "aria-disabled": ariaBlocked || loading || as !== "button" && disabledState || void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        if (!blocked) setPressed(true);
        onMouseDown?.(e);
      },
      onMouseUp: (e) => {
        setPressed(false);
        onMouseUp?.(e);
      },
      onKeyDown: (e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) setPressed(true);
        onKeyDown?.(e);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") setPressed(false);
        onKeyUp?.(e);
      },
      onBlur: (e) => {
        setPressed(false);
        onBlur?.(e);
      },
      onClick: (e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        minHeight: h,
        padding: 0,
        border: "none",
        background: "transparent",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: ls,
        color: blocked ? "var(--color-semantic-label-disable)" : textColor,
        opacity: blocked ? 1 : pressed ? 0.76 : hover ? "var(--component-button-text-hover-opacity)" : 1,
        cursor: blocked ? "not-allowed" : "pointer",
        textDecoration: underline ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "var(--component-button-transition)",
        ...style
      },
      children: [
        loading && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Spinner, { size: 14, color: "currentColor" }) }),
          /* @__PURE__ */ jsx("span", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: loadingLabel })
        ] }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": loading || void 0, style: { visibility: loading ? "hidden" : void 0 }, children })
      ]
    }
  );
}

export {
  TextButton
};
//# sourceMappingURL=chunk-LLVRDSFN.js.map