"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk33JG4LIIcjs = require('./chunk-33JG4LII.cjs');


var _chunkB6GRMPJUcjs = require('./chunk-B6GRMPJU.cjs');

// components/selection/FilterChip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  expanded,
  haspopup = "menu",
  disabled = false,
  size = "md",
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = _react2.default.useState(false);
  const isDisclosure = caret;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "button",
    {
      type: "button",
      "aria-pressed": isDisclosure ? void 0 : active,
      "aria-haspopup": isDisclosure ? haspopup : void 0,
      "aria-expanded": isDisclosure ? Boolean(_nullishCoalesce(expanded, () => ( active))) : void 0,
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
        caret && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true" })
      ]
    }
  );
}



exports.FilterChip = FilterChip;
//# sourceMappingURL=chunk-ML3ESD54.cjs.map