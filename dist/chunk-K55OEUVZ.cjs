"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/cards/ProductCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function isFocusVisible(node) {
  if (!node || typeof node.matches !== "function") return true;
  try {
    return node.matches(":focus-visible");
  } catch (e) {
    return true;
  }
}
var PC_SCRIM = [
  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--scrim-dark) 12%, transparent) 28%, color-mix(in srgb, var(--scrim-dark) 72%, transparent) 58%, var(--scrim-dark) 100%)"
].join(", ");
var PC_RATIOS = {
  "16/9": "var(--ratio-16-9)",
  "3/2": "var(--ratio-3-2)",
  "4/3": "var(--ratio-4-3)",
  "1/1": "var(--ratio-1-1)",
  "4/5": "var(--ratio-4-5)",
  "3/4": "var(--ratio-3-4)",
  "2/3": "var(--ratio-2-3)"
};
function resolveRatio(ratio) {
  if (typeof ratio === "number") return String(ratio);
  if (typeof ratio === "string") return PC_RATIOS[ratio] || ratio.replace("/", " / ");
  return PC_RATIOS["3/2"];
}
function ProductCard({
  id,
  category,
  description,
  image,
  ratio = "3/2",
  imageFit = "cover",
  imagePosition = "50% 30%",
  imageSrcSet,
  imageSizes,
  href = "#",
  cta,
  headingLevel = 3,
  style,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  ...rest
}) {
  const [pointerHover, setPointerHover] = _react2.default.useState(false);
  const [focusVisible, setFocusVisible] = _react2.default.useState(false);
  const hover = pointerHover || focusVisible;
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const resolvedLabel = _nullishCoalesce(ariaLabel, () => ( (typeof id === "string" ? id : void 0)));
  const resolvedImageFit = imageFit === "contain" ? "contain" : "cover";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        aspectRatio: resolveRatio(ratio),
        background: "var(--color-semantic-brand-surface)",
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
        image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "img",
              {
                src: image,
                srcSet: imageSrcSet,
                sizes: imageSizes,
                alt: "",
                loading: "lazy",
                decoding: "async",
                style: {
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                  objectFit: resolvedImageFit,
                  objectPosition: imagePosition,
                  display: "block",
                  padding: resolvedImageFit === "contain" ? "var(--space-6)" : 0,
                  filter: "brightness(1.03)",
                  transform: hover ? "scale(1.05)" : "scale(1)",
                  transition: "transform 600ms var(--ease-out)"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "min(84%, calc(var(--space-32) + var(--space-28)))",
              background: PC_SCRIM,
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)" }, children: [
            category && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--color-semantic-inverse-label-strong-soft)" }, children: category }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { style: { margin: 0, fontSize: "var(--fs-h5)", lineHeight: "var(--lh-h5)", fontWeight: "var(--fw-extra)", letterSpacing: "var(--ls-h5)", color: "var(--color-semantic-inverse-label)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: id })
          ] }),
          description && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", color: "var(--color-semantic-inverse-label-strong-soft)", wordBreak: "keep-all", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }, children: description }),
          cta && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: {
            alignSelf: "flex-end",
            marginTop: 4,
            whiteSpace: "nowrap",
            fontSize: "var(--label2-size)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: hover ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-inverse-label-strong-soft)",
            textDecoration: hover ? "underline" : "none",
            textUnderlineOffset: 3,
            transition: "color var(--dur-fast) var(--ease-out)"
          }, children: cta })
        ] })
      ]
    }
  );
}



exports.ProductCard = ProductCard;
//# sourceMappingURL=chunk-K55OEUVZ.cjs.map