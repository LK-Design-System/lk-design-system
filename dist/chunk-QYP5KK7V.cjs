"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Bubble.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Bubble({ children, tone = "navy", tail = "bottom", style, ...rest }) {
  const dark = tone === "navy";
  const bg = dark ? "var(--color-semantic-brand-surface)" : "var(--color-semantic-background-elevated-normal)";
  const fg = dark ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)";
  const bd = dark ? "none" : "1px solid var(--color-semantic-line-solid-normal)";
  const tailBase = { position: "absolute", width: 12, height: 12, background: bg, transform: "rotate(45deg)" };
  const tails = {
    bottom: { ...tailBase, bottom: -6, left: "50%", marginLeft: -6, borderRight: bd, borderBottom: bd },
    top: { ...tailBase, top: -6, left: "50%", marginLeft: -6, borderLeft: bd, borderTop: bd },
    left: { ...tailBase, left: -6, top: "50%", marginTop: -6, borderLeft: bd, borderBottom: bd },
    right: { ...tailBase, right: -6, top: "50%", marginTop: -6, borderRight: bd, borderTop: bd }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      style: {
        position: "relative",
        display: "inline-block",
        maxWidth: 280,
        padding: "12px 15px",
        background: bg,
        color: fg,
        border: bd,
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        lineHeight: 1.6,
        letterSpacing: 0,
        wordBreak: "keep-all",
        ...style
      },
      ...rest,
      children: [
        children,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: tails[tail] || tails.bottom })
      ]
    }
  );
}



exports.Bubble = Bubble;
//# sourceMappingURL=chunk-QYP5KK7V.cjs.map