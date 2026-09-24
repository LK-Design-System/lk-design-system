"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Overline.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
function textOf(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return node.props ? textOf(node.props.children) : "";
}
function Overline({ children, as = "div", tone = "muted", onDark = false, style, ...rest }) {
  const Comp = as;
  const letterSpacing = HANGUL.test(textOf(children)) ? 0 : "var(--ls-overline)";
  const color = onDark ? tone === "signal" ? "var(--color-semantic-inverse-primary)" : tone === "ink" ? "var(--color-semantic-static-white)" : "var(--color-semantic-inverse-label-neutral-soft)" : tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "ink" ? "var(--color-semantic-label-strong)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Comp,
    {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-bold)",
        letterSpacing,
        textTransform: "uppercase",
        lineHeight: 1.2,
        color,
        ...style
      },
      ...rest,
      children
    }
  );
}



exports.Overline = Overline;
//# sourceMappingURL=chunk-TOYXV5EN.cjs.map