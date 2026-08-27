"use client";
import {
  useResolvedDensity
} from "./chunk-EEL7ELPX.js";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/status/Callout.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ICON_SIZE = 24;
function normalizeIcon(icon, fallbackIcon) {
  if (!React.isValidElement(icon)) return fallbackIcon;
  return React.cloneElement(icon, {
    size: icon.props.size ?? ICON_SIZE,
    width: icon.props.width ?? ICON_SIZE,
    height: icon.props.height ?? ICON_SIZE,
    style: { display: "block", ...icon.props.style }
  });
}
function Callout({ tone = "signal", title, headingLevel = false, children, icon, density, style, ...rest }) {
  const resolvedDensity = useResolvedDensity(density, "comfortable");
  const compact = resolvedDensity === "compact";
  const navy = tone === "navy";
  const normalizedTone = navy ? "offline" : normalizeStatusTone(tone);
  const palette = navy ? {
    icon: "circle-info",
    foreground: "var(--color-semantic-brand-on-surface)",
    surface: "var(--color-semantic-brand-surface)",
    border: "var(--color-semantic-brand-on-surface-border)"
  } : statusToneStyle(normalizedTone);
  const c = palette.foreground;
  const defaultIcon = /* @__PURE__ */ jsx(Icon, { name: palette.icon, size: ICON_SIZE });
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  const Heading = headingLevel ? `h${headingLevel}` : "div";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-density": resolvedDensity,
      style: {
        display: "flex",
        gap: compact ? "var(--space-3)" : "var(--space-4)",
        padding: compact ? "var(--space-3) var(--space-4)" : "var(--space-5) var(--space-6)",
        boxSizing: "border-box",
        background: palette.surface,
        border: "none",
        borderRadius: "var(--radius-xl)",
        boxShadow: "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              width: ICON_SIZE,
              height: ICON_SIZE,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: c,
              lineHeight: 0,
              flexShrink: 0
            },
            children: normalizedIcon
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx(Heading, { style: { margin: 0, fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: navy ? "var(--color-semantic-brand-on-surface)" : "var(--color-semantic-label-normal)", marginBottom: children != null ? "var(--space-1-5)" : 0 }, children: title }),
          children != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", lineHeight: compact ? "var(--label1-line)" : "var(--label1-reading-line)", color: navy ? "var(--color-semantic-brand-on-surface-subtle)" : "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}

export {
  Callout
};
//# sourceMappingURL=chunk-IFGBRJFA.js.map