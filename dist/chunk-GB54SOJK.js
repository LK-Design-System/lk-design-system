"use client";

// components/cards/FeatureCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ICON_TONES = {
  signal: { fg: "var(--color-semantic-primary-normal)", bg: "var(--color-semantic-primary-surface-normal)" },
  // teal tile (default)
  steel: { fg: "var(--color-semantic-accent-foreground-blue)", bg: "var(--color-semantic-primary-surface-normal)" },
  amber: { fg: "var(--color-semantic-accent-foreground-orange)", bg: "color-mix(in srgb, var(--color-semantic-accent-foreground-orange) 14%, transparent)" },
  navy: { fg: "var(--color-semantic-brand-on-surface)", bg: "var(--color-semantic-brand-surface)" }
};
function FeatureCard({
  icon,
  title,
  children,
  tone = "signal",
  boxed = false,
  density = "comfortable",
  headingLevel = 4,
  style,
  onClick,
  onKeyDown,
  ...rest
}) {
  const t = ICON_TONES[tone] || ICON_TONES.signal;
  const activatable = typeof onClick === "function";
  const compact = density === "compact";
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const handleKeyDown = (e) => {
    if (activatable && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      onClick(e);
    }
    onKeyDown && onKeyDown(e);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-density": density,
      role: rest.role ?? (activatable ? "button" : void 0),
      tabIndex: rest.tabIndex ?? (activatable ? 0 : void 0),
      onClick,
      onKeyDown: handleKeyDown,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: compact ? "var(--space-3)" : "var(--space-4)",
        background: boxed ? "var(--component-card-bg)" : "transparent",
        border: boxed ? "var(--component-card-border)" : "none",
        borderRadius: boxed ? "var(--component-card-radius)" : 0,
        /* Card's default rest elevation (elevation="md") — same value as the
           previous var(--shadow-md), now tracked via the card token. */
        boxShadow: boxed ? "var(--component-card-shadow-md)" : "none",
        padding: boxed ? compact ? "var(--space-4)" : "var(--component-card-padding)" : 0,
        cursor: activatable ? "pointer" : void 0,
        ...style
      },
      ...rest,
      children: [
        icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: compact ? "var(--space-10)" : 52, height: compact ? "var(--space-10)" : 52, borderRadius: "var(--radius-14)", color: t.fg, background: t.bg }, children: icon }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: compact ? "var(--space-1)" : "var(--space-2)" }, children: [
          /* @__PURE__ */ jsx(HeadingTag, { style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-strong)", margin: 0, wordBreak: "keep-all" }, children: title }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-alternative)", margin: 0, wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}

export {
  FeatureCard
};
//# sourceMappingURL=chunk-GB54SOJK.js.map