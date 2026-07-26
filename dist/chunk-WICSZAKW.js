"use client";

// components/content/SourceTag.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MONO = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";
var BRAND_FOREGROUND = "color-mix(in srgb, var(--color-semantic-primary-normal) 60%, var(--color-semantic-label-normal))";
function SourceTag({ children, label = "SOURCE", href, tone = "default", style, ...rest }) {
  const isLink = href != null;
  const Comp = isLink ? "a" : "span";
  const [hover, setHover] = React.useState(false);
  const onDark = tone === "onDark";
  return /* @__PURE__ */ jsxs(
    Comp,
    {
      href,
      target: isLink ? "_blank" : void 0,
      rel: isLink ? "noopener noreferrer" : void 0,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: "var(--component-tag-height)",
        paddingInline: "var(--space-3)",
        borderRadius: "var(--radius-pill)",
        background: onDark ? "var(--color-semantic-inverse-fill-normal)" : "var(--color-semantic-fill-normal)",
        border: `1px solid ${onDark ? "var(--color-semantic-inverse-fill-strong)" : "var(--color-semantic-line-normal-normal)"}`,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: isLink ? "pointer" : "default",
        color: onDark ? "var(--color-semantic-inverse-label-strong-soft)" : "var(--color-semantic-label-neutral)",
        transition: "border-color var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: MONO, fontSize: "var(--caption2-size)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: onDark ? "var(--color-semantic-inverse-label)" : BRAND_FOREGROUND }, children: label }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { width: 1, height: 12, background: "currentColor", opacity: 0.28 } }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children }),
        isLink && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { opacity: hover ? 1 : 0.55, transition: "opacity var(--dur-fast) var(--ease-out)" }, children: "\u2197" })
      ]
    }
  );
}

export {
  SourceTag
};
//# sourceMappingURL=chunk-WICSZAKW.js.map