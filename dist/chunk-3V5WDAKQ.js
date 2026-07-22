"use client";

// components/cards/ProductCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PC_FADE = "linear-gradient(180deg, var(--color-semantic-static-black) 58%, transparent 97%)";
var PC_GRADE = [
  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-semantic-brand-stage-to) 5%, transparent) 50%, color-mix(in srgb, var(--color-semantic-brand-stage-to) 28%, transparent) 100%)",
  "linear-gradient(180deg, transparent 34%, color-mix(in srgb, var(--scrim-dark) 55%, transparent) 88%)"
].join(", ");
function ProductCard({
  id,
  category,
  description,
  image,
  imagePosition = "50% 30%",
  href = "#",
  cta,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        aspectRatio: "4 / 5",
        background: "linear-gradient(180deg, var(--color-semantic-brand-stage-from) 0%, var(--color-semantic-brand-stage-to) 100%)",
        border: "1px solid var(--border-hairline-dark)",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        boxShadow: hover ? "var(--shadow-xl)" : "var(--shadow-sm)",
        transition: "box-shadow var(--dur-base) var(--ease-out)",
        textDecoration: "none",
        ...style
      },
      ...rest,
      children: [
        image && /* @__PURE__ */ jsxs(
          "div",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "68%",
              pointerEvents: "none",
              WebkitMaskImage: PC_FADE,
              maskImage: PC_FADE
            },
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: image,
                  alt: "",
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: imagePosition,
                    display: "block",
                    filter: "brightness(1.06)",
                    transform: hover ? "scale(1.05)" : "scale(1)",
                    transition: "transform 600ms var(--ease-out)"
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: PC_GRADE } })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 9 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
            category && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--color-semantic-inverse-primary)" }, children: category }),
            /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "var(--fs-h5)", lineHeight: "var(--lh-h5)", fontWeight: "var(--fw-extra)", letterSpacing: "var(--ls-h5)", color: "var(--color-semantic-inverse-label)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: id })
          ] }),
          description && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", color: "var(--color-semantic-inverse-label)", wordBreak: "keep-all", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }, children: description }),
          cta && /* @__PURE__ */ jsx("span", { style: {
            alignSelf: "flex-end",
            marginTop: 4,
            whiteSpace: "nowrap",
            fontSize: "var(--label2-size)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: hover ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-inverse-label-neutral-soft)",
            textDecoration: hover ? "underline" : "none",
            textUnderlineOffset: 3,
            transition: "color var(--dur-fast) var(--ease-out)"
          }, children: cta })
        ] })
      ]
    }
  );
}

export {
  ProductCard
};
//# sourceMappingURL=chunk-3V5WDAKQ.js.map