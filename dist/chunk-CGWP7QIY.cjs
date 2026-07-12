"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/feedback/Rating.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Rating({ value, defaultValue = 0, max = 5, onChange, size = 20, readOnly = false, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const [hover, setHover] = _react2.default.useState(null);
  const val = isControlled ? value : internal;
  const shown = hover != null ? hover : val;
  const set = (v) => {
    if (readOnly) return;
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", gap: 2, ...style }, ...rest, children: Array.from({ length: max }).map((_, i) => {
    const filled = i < shown;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "span",
      {
        onMouseEnter: () => {
          if (!readOnly) setHover(i + 1);
        },
        onMouseLeave: () => {
          if (!readOnly) setHover(null);
        },
        onClick: () => set(i + 1),
        style: { display: "inline-flex", cursor: readOnly ? "default" : "pointer", color: filled ? "var(--color-semantic-accent-foreground-orange)" : "var(--color-semantic-interaction-inactive)" },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: filled ? "star-fill" : "star", size, "aria-hidden": "true" })
      },
      i
    );
  }) });
}



exports.Rating = Rating;
//# sourceMappingURL=chunk-CGWP7QIY.cjs.map