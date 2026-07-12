"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/feedback/Tag.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var TONES = {
  signal: { fg: "var(--color-semantic-primary-heavy)", bg: "var(--color-semantic-primary-surface-strong)" },
  // brand teal chip (default)
  neutral: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" },
  // ink neutral
  steel: { fg: "var(--color-semantic-accent-foreground-blue)", bg: "var(--color-semantic-secondary-surface)" },
  amber: { fg: "var(--color-semantic-status-cautionary-text)", bg: "color-mix(in srgb, var(--color-semantic-data-viz-series-5) 14%, transparent)", solidBg: "var(--color-semantic-data-viz-series-5)", solidFg: "var(--color-semantic-label-strong)" },
  red: { fg: "var(--color-semantic-accent-foreground-red)", bg: "color-mix(in srgb, var(--color-semantic-accent-foreground-red) 14%, transparent)" },
  // back-compat aliases (live site uses tone="indigo")
  indigo: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" },
  green: { fg: "var(--color-semantic-data-viz-series-4)", bg: "color-mix(in srgb, var(--color-semantic-data-viz-series-4) 14%, transparent)" },
  ink: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" }
};
function Tag({ children, tone = "signal", solid = false, style, ...rest }) {
  const t = TONES[tone] || TONES.signal;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      className: `lk-tag lk-tag--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: "var(--component-tag-height)",
        padding: "0 12px",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-bold)",
        fontSize: "var(--fs-caption)",
        lineHeight: 1,
        letterSpacing: "var(--ls-caption)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: solid ? t.solidFg || "var(--color-semantic-static-white)" : t.fg,
        background: solid ? t.solidBg || t.fg : t.bg,
        borderRadius: "var(--radius-pill)",
        ...style
      },
      ...rest,
      children
    }
  );
}



exports.Tag = Tag;
//# sourceMappingURL=chunk-VOXZBHG6.cjs.map