"use client";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/overlay/Snackbar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ICON = /* @__PURE__ */ jsx(Icon, { name: "circle-info-fill", size: 22, "aria-hidden": "true" });
var TONE_ICON_COLOR = {
  normal: "var(--color-semantic-inverse-label)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)"
};
function normalizeTone(value) {
  const normalized = normalizeStatusTone(value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
}
function toneIcon(tone) {
  if (tone === "normal") return ICON;
  return /* @__PURE__ */ jsx(Icon, { name: statusToneStyle(tone).icon, size: 22, "aria-hidden": "true" });
}
function Snackbar({
  heading,
  description,
  children,
  action,
  onAction,
  tone = "normal",
  variant,
  icon,
  leadingIcon = false,
  closeButton = true,
  onClose,
  closeLabel = "\uB2EB\uAE30",
  width = 384,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = React.useState(false);
  const hasDescription = description != null || children != null;
  const normalized = normalizeTone(variant || tone);
  const urgent = normalized === "negative";
  const showClose = closeButton !== false && typeof onClose === "function";
  const minHeight = heading != null && hasDescription ? 72 : hasDescription ? 68 : 54;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: urgent ? "alert" : "status",
      "aria-live": urgent ? "assertive" : "polite",
      "data-tone": normalized,
      style: {
        display: "inline-flex",
        alignItems: hasDescription ? "flex-start" : "center",
        gap: 12,
        width,
        maxWidth: "100%",
        minHeight,
        padding: "11px 16px",
        borderRadius: "var(--radius-lg)",
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
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
            style: {
              display: "inline-flex",
              flexShrink: 0,
              marginTop: hasDescription ? 1 : 0,
              color: TONE_ICON_COLOR[normalized]
            },
            children: icon ?? toneIcon(normalized)
          }
        ),
        /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0, flex: 1 }, children: [
          heading != null && /* @__PURE__ */ jsx(
            "strong",
            {
              style: {
                fontSize: "var(--body2-size)",
                lineHeight: "var(--body2-line)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: "var(--body2-spacing)"
              },
              children: heading
            }
          ),
          hasDescription && /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontSize: "var(--label2-size)",
                lineHeight: "var(--label2-line)",
                color: "var(--color-semantic-inverse-label-strong-soft)",
                letterSpacing: "var(--label2-spacing)",
                wordBreak: "keep-all"
              },
              children: description ?? children
            }
          ),
          heading == null && !hasDescription && /* Single-line message matches Toast's one-liner step (body2) so the
             two transient surfaces speak the same size for the same role. */
          /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", letterSpacing: "var(--body2-spacing)" }, children })
        ] }),
        action != null && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            onMouseEnter: () => setActionHover(true),
            onMouseLeave: () => setActionHover(false),
            style: {
              flexShrink: 0,
              alignSelf: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              /* WDS content-to-action gap is 32px (container gap 12 + 20). */
              marginLeft: 20,
              /* WCAG 2.2 target size: 24px hit area without moving the layout. */
              minWidth: 24,
              minHeight: 24,
              marginTop: -4,
              marginBottom: -4,
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
        showClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": closeLabel,
            onClick: onClose,
            style: {
              flexShrink: 0,
              alignSelf: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 24,
              minHeight: 24,
              padding: 4,
              margin: -4,
              border: "none",
              background: "transparent",
              color: "var(--color-semantic-inverse-label)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 16, "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}

export {
  Snackbar
};
//# sourceMappingURL=chunk-6NHGDP3P.js.map