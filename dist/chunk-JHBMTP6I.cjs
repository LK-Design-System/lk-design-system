"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/cards/FeatureCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ICON_TONES = {
  signal: { fg: "var(--color-semantic-primary-normal)", bg: "var(--color-semantic-primary-surface-normal)" },
  // teal tile (default)
  steel: { fg: "var(--color-semantic-accent-foreground-blue)", bg: "var(--color-semantic-primary-surface-normal)" },
  amber: { fg: "var(--color-semantic-accent-foreground-orange)", bg: "color-mix(in srgb, var(--color-semantic-accent-foreground-orange) 14%, transparent)" },
  navy: { fg: "var(--color-semantic-brand-ink)", bg: "var(--color-semantic-fill-strong)" }
};
function FeatureCard({
  icon,
  title,
  children,
  tone = "signal",
  boxed = false,
  headingLevel = 4,
  style,
  onClick,
  onKeyDown,
  ...rest
}) {
  const t = ICON_TONES[tone] || ICON_TONES.signal;
  const activatable = typeof onClick === "function";
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const handleKeyDown = (e) => {
    if (activatable && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      onClick(e);
    }
    onKeyDown && onKeyDown(e);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: _nullishCoalesce(rest.role, () => ( (activatable ? "button" : void 0))),
      tabIndex: _nullishCoalesce(rest.tabIndex, () => ( (activatable ? 0 : void 0))),
      onClick,
      onKeyDown: handleKeyDown,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: boxed ? "var(--component-card-bg)" : "transparent",
        border: boxed ? "var(--component-card-border)" : "none",
        borderRadius: boxed ? "var(--component-card-radius)" : 0,
        /* Card's default rest elevation (elevation="md") — same value as the
           previous var(--shadow-md), now tracked via the card token. */
        boxShadow: boxed ? "var(--component-card-shadow-md)" : "none",
        padding: boxed ? "var(--component-card-padding)" : 0,
        cursor: activatable ? "pointer" : void 0,
        ...style
      },
      ...rest,
      children: [
        icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: "var(--radius-14)", color: t.fg, background: t.bg }, children: icon }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-strong)", margin: 0, wordBreak: "keep-all" }, children: title }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-alternative)", margin: 0, wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}



exports.FeatureCard = FeatureCard;
//# sourceMappingURL=chunk-JHBMTP6I.cjs.map