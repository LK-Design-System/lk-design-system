"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/SourceTag.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var MONO = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";
var BRAND_FOREGROUND = "color-mix(in srgb, var(--color-semantic-primary-normal) 60%, var(--color-semantic-label-normal))";
function SourceTag({ children, label = "SOURCE", href, tone = "default", style, ...rest }) {
  const isLink = href != null;
  const Comp = isLink ? "a" : "span";
  const [hover, setHover] = _react2.default.useState(false);
  const onDark = tone === "onDark";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
        paddingInline: 11,
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontFamily: MONO, fontSize: "var(--caption2-size)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: onDark ? "var(--color-semantic-inverse-label)" : BRAND_FOREGROUND }, children: label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 1, height: 12, background: "currentColor", opacity: 0.28 } }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontWeight: 600 }, children }),
        isLink && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { opacity: hover ? 1 : 0.55, transition: "opacity var(--dur-fast) var(--ease-out)" }, children: "\u2197" })
      ]
    }
  );
}



exports.SourceTag = SourceTag;
//# sourceMappingURL=chunk-CHXTAM4E.cjs.map