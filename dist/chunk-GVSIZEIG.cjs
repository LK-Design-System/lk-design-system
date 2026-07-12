"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk33JG4LIIcjs = require('./chunk-33JG4LII.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/selection/FilterChip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  disabled = false,
  size = "md",
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = _react2.default.useState(false);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "button",
    {
      type: "button",
      "aria-pressed": active,
      disabled,
      onClick: disabled ? void 0 : onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        ..._chunk33JG4LIIcjs.pillChipStyle.call(void 0, active, disabled, size),
        gap: size === "sm" ? 6 : 7,
        ...!active && hover && !disabled ? { background: "var(--color-semantic-fill-normal)" } : null,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children }),
        count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontWeight: "var(--fw-bold)", color: active ? "currentColor" : "var(--color-semantic-label-alternative)" }, children: count }),
        caret && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true" })
      ]
    }
  );
}



exports.FilterChip = FilterChip;
//# sourceMappingURL=chunk-GVSIZEIG.cjs.map