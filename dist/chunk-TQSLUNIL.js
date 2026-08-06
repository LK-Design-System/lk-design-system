"use client";
import {
  Icon
} from "./chunk-ON44Y65B.js";

// components/cards/NewsCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function isFocusVisible(node) {
  if (!node || typeof node.matches !== "function") return true;
  try {
    return node.matches(":focus-visible");
  } catch {
    return true;
  }
}
function NewsCard({ image, imageAlt = "", category, title, excerpt, source, date, dateTime, cta, href = "#", headingLevel = 3, style, onFocus, onBlur, "aria-label": ariaLabel, ...rest }) {
  const [pointerHover, setPointerHover] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const hover = pointerHover || focusVisible;
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const titleName = typeof title === "string" ? title : null;
  const altName = typeof imageAlt === "string" && imageAlt.trim() ? imageAlt.trim() : null;
  const resolvedLabel = ariaLabel ?? (titleName ? altName ? `${titleName}. ${altName}` : titleName : void 0);
  const ArrowR = /* @__PURE__ */ jsx(Icon, { name: "arrow-right", size: 15, "aria-hidden": "true" });
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      "aria-label": resolvedLabel,
      onMouseEnter: () => setPointerHover(true),
      onMouseLeave: () => setPointerHover(false),
      onFocus: (event) => {
        setFocusVisible(isFocusVisible(event.currentTarget));
        onFocus && onFocus(event);
      },
      onBlur: (event) => {
        setFocusVisible(false);
        onBlur && onBlur(event);
      },
      style: {
        display: "flex",
        flexDirection: "column",
        background: "var(--component-card-bg)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        image && /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" }, children: /* @__PURE__ */ jsx("img", { src: image, alt: imageAlt, loading: "lazy", decoding: "async", style: { width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 520ms var(--ease-out)" } }) }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }, children: [
          category && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--color-semantic-label-alternative)" }, children: category }),
          title && /* @__PURE__ */ jsx(HeadingTag, { style: { margin: 0, fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1.36, color: "var(--color-semantic-label-strong)", wordBreak: "keep-all" }, children: title }),
          excerpt && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "var(--label1-size)", lineHeight: 1.62, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: excerpt }),
          (source || date || cta) && /* @__PURE__ */ jsxs("div", { style: { marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)" }, children: [
            source && /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: source }),
            source && date && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\xB7" }),
            date && (dateTime ? /* @__PURE__ */ jsx("time", { dateTime, style: { fontVariantNumeric: "tabular-nums" }, children: date }) : /* @__PURE__ */ jsx("span", { style: { fontVariantNumeric: "tabular-nums" }, children: date })),
            cta && /* @__PURE__ */ jsxs("span", { style: { marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)", fontWeight: 700, color: "var(--color-semantic-primary-normal)", whiteSpace: "nowrap" }, children: [
              cta,
              /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", transform: hover ? "translateX(2px)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }, children: ArrowR })
            ] })
          ] })
        ] })
      ]
    }
  );
}

export {
  NewsCard
};
//# sourceMappingURL=chunk-TQSLUNIL.js.map