"use client";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-WXLIZEH2.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/overlay/Toast.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ICONS = {
  normal: {
    color: "var(--color-semantic-inverse-label)",
    name: "circle-info-fill"
  },
  positive: {
    color: "var(--color-semantic-status-positive)",
    name: statusToneStyle("positive").icon
  },
  cautionary: {
    color: "var(--color-semantic-status-cautionary)",
    name: statusToneStyle("cautionary").icon
  },
  negative: {
    color: "var(--color-semantic-status-negative)",
    name: statusToneStyle("negative").icon
  }
};
function normalizeTone(value) {
  const normalized = normalizeStatusTone(value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
}
function Toast({
  tone = "normal",
  variant,
  children,
  action,
  onAction,
  onClose,
  closeLabel = "\uB2EB\uAE30",
  leadingIcon = true,
  icon,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = React.useState(false);
  const normalized = normalizeTone(variant || tone);
  const t = ICONS[normalized] || ICONS.normal;
  const urgent = normalized === "negative";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: urgent ? "alert" : "status",
      "aria-live": urgent ? "assertive" : "polite",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        minWidth: 335,
        maxWidth: 520,
        padding: "11px 16px",
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        leadingIcon && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: { display: "inline-flex", flexShrink: 0, color: t.color },
            children: icon || /* @__PURE__ */ jsx(Icon, { name: t.name, size: 22, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              flex: 1,
              minWidth: 0,
              fontSize: "var(--body2-size)",
              lineHeight: "var(--body2-line)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: "var(--body2-spacing)",
              color: "var(--color-semantic-inverse-label)",
              wordBreak: "keep-all"
            },
            children
          }
        ),
        action != null && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            onMouseEnter: () => setActionHover(true),
            onMouseLeave: () => setActionHover(false),
            style: {
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              /* WCAG 2.2 target size: keep a 24px hit area without moving the layout. */
              minWidth: 24,
              minHeight: 24,
              margin: "-4px 0",
              border: "none",
              background: "transparent",
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label2-size)",
              fontWeight: "var(--fw-bold)",
              cursor: "pointer",
              padding: "4px 0",
              textDecoration: actionHover ? "underline" : "none",
              textUnderlineOffset: 3
            },
            children: action
          }
        ),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": closeLabel,
            onClick: onClose,
            style: {
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 24,
              minHeight: 24,
              padding: 4,
              margin: -2,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-semantic-inverse-label)"
            },
            children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 16, "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}

export {
  Toast
};
//# sourceMappingURL=chunk-4K5P7HW2.js.map