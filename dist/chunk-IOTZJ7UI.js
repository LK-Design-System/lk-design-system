"use client";
import {
  embeddedBandStyle,
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/status/Banner.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function variantStyle(variant, palette) {
  if (variant === "embedded") {
    return {
      padding: "var(--space-3) var(--space-5)",
      ...embeddedBandStyle(palette)
    };
  }
  return {
    padding: "14px 16px",
    borderTop: `1px solid ${palette.border}`,
    borderRight: `1px solid ${palette.border}`,
    borderBottom: `1px solid ${palette.border}`,
    borderLeft: `1px solid ${palette.border}`,
    borderRadius: "var(--radius-lg)"
  };
}
function Banner({ tone = "signal", variant = "standalone", title, children, action, onClose, closeLabel = "\uB2EB\uAE30", style, ...rest }) {
  const normalizedTone = normalizeStatusTone(tone);
  const t = statusToneStyle(normalizedTone);
  const urgent = normalizedTone === "negative";
  const resolvedVariant = variant === "embedded" ? "embedded" : "standalone";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: urgent ? "alert" : "status",
      "aria-live": urgent ? "assertive" : "polite",
      "data-banner-variant": resolvedVariant,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        boxSizing: "border-box",
        background: t.surface,
        ...variantStyle(resolvedVariant, t),
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(Icon, { name: t.icon, size: 20, color: t.foreground, "aria-hidden": "true", style: { flexShrink: 0, marginTop: "var(--space-0-5)" } }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", marginBottom: children != null ? 3 : 0 }, children: title }),
          children != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.6, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
        ] }),
        action != null && /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, children: action }),
        onClose && /* @__PURE__ */ jsx("button", { type: "button", "aria-label": closeLabel, onClick: onClose, style: { flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, minHeight: 24, padding: 4, margin: -3, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-semantic-label-neutral)" }, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 18, "aria-hidden": "true" }) })
      ]
    }
  );
}

export {
  Banner
};
//# sourceMappingURL=chunk-IOTZJ7UI.js.map