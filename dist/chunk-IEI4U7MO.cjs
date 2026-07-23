"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/feedback/Badge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var PALETTES = {
  signal: { bg: "var(--component-badge-signal-bg)", fg: "var(--component-badge-signal-fg)", dot: "var(--color-semantic-primary-normal)" },
  navy: { bg: "var(--component-badge-navy-bg)", fg: "var(--component-badge-navy-fg)", dot: "var(--color-semantic-secondary-normal)" },
  steel: { bg: "var(--component-badge-steel-bg)", fg: "var(--component-badge-steel-fg)", dot: "var(--color-semantic-accent-foreground-blue)" },
  amber: { bg: "var(--component-badge-cautionary-bg)", fg: "var(--component-badge-cautionary-fg)", dot: "var(--color-semantic-status-cautionary-foreground)" },
  red: { bg: "var(--component-badge-negative-bg)", fg: "var(--component-badge-negative-fg)", dot: "var(--color-semantic-status-negative-foreground)" },
  // aliases
  indigo: { bg: "var(--component-badge-navy-bg)", fg: "var(--component-badge-navy-fg)", dot: "var(--color-semantic-secondary-normal)" },
  green: { bg: "var(--component-badge-positive-bg)", fg: "var(--component-badge-positive-fg)", dot: "var(--color-semantic-status-positive-foreground)" },
  ink: { bg: "var(--component-badge-navy-bg)", fg: "var(--component-badge-navy-fg)", dot: "var(--color-semantic-secondary-normal)" }
};
function clampCount(children, max) {
  if (max == null) return children;
  if (typeof children === "number") return children > max ? `${max}+` : children;
  if (typeof children === "string" && /^\d+$/.test(children.trim())) {
    const value = Number(children.trim());
    return value > max ? `${max}+` : children;
  }
  return children;
}
var DOT_LABEL_GAP = 6;
function Badge({ children, tone = "signal", dot = false, max = 99, style, ...rest }) {
  const palette = PALETTES[tone] || PALETTES.signal;
  const label = clampCount(children, max);
  const hasLabel = label != null && label !== false && label !== "";
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const dotStyle = {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: palette.dot,
    flexShrink: 0
  };
  if (dot) {
    if (!hasLabel) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "span",
        {
          role: named ? "img" : void 0,
          "aria-hidden": named ? void 0 : "true",
          style: { ...dotStyle, ...style },
          ...rest
        }
      );
    }
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: DOT_LABEL_GAP,
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--fw-bold)",
          fontSize: "var(--caption1-size)",
          color: "var(--color-semantic-label-normal)",
          ...style
        },
        ...rest,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: dotStyle }),
          label
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-bold)",
        fontSize: "var(--caption1-size)",
        color: palette.fg,
        background: palette.bg,
        borderRadius: 4,
        /* WDS _Badge/Value r4 (no 4px token) */
        ...style
      },
      ...rest,
      children: label
    }
  );
}



exports.Badge = Badge;
//# sourceMappingURL=chunk-IEI4U7MO.cjs.map