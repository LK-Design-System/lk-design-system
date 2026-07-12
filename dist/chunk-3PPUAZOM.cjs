"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/forms/ColorSwatch.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ColorSwatch({ colors = [], value, defaultValue, onChange, size = 28, shape = "rounded", style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (c) => {
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const radius = shape === "circle" ? "50%" : "var(--radius-md)";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "inline-flex", gap: 10, flexWrap: "wrap", ...style }, ...rest, children: colors.map((c) => {
    const on = c === val;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        type: "button",
        "aria-label": c,
        onClick: () => pick(c),
        style: { width: size, height: size, borderRadius: radius, background: c, cursor: "pointer", padding: 0, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: on ? "0 0 0 2px var(--color-semantic-primary-normal)" : "inset 0 0 0 1px var(--color-semantic-line-normal-normal)", transition: "box-shadow var(--dur-fast) var(--ease-out)" }
      },
      c
    );
  }) });
}



exports.ColorSwatch = ColorSwatch;
//# sourceMappingURL=chunk-3PPUAZOM.cjs.map