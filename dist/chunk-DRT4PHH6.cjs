"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/content/Bookmark.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Bookmark({
  active,
  defaultActive,
  onChange,
  size = 24,
  disabled = false,
  label,
  style,
  "aria-label": ariaLabel,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = _react2.default.useState(!!defaultActive);
  const [pressed, setPressed] = _react2.default.useState(false);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const press = (next) => {
    if (!disabled) setPressed(next);
  };
  const name = ariaLabel || (label ? `${label} \uBD81\uB9C8\uD06C` : "\uBD81\uB9C8\uD06C");
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": name,
      "data-pressed": pressed ? "true" : "false",
      disabled,
      onClick: toggle,
      onMouseDown: (e) => {
        press(true);
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        press(false);
        onMouseUp && onMouseUp(e);
      },
      onMouseLeave: (e) => {
        press(false);
        onMouseLeave && onMouseLeave(e);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") press(true);
        onKeyDown && onKeyDown(e);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") press(false);
        onKeyUp && onKeyUp(e);
      },
      onBlur: (e) => {
        press(false);
        onBlur && onBlur(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        color: on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)",
        transform: pressed ? "scale(0.86)" : "none",
        transition: "color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: on ? "bookmark-fill" : "bookmark", size, "aria-hidden": "true" })
    }
  );
}



exports.Bookmark = Bookmark;
//# sourceMappingURL=chunk-DRT4PHH6.cjs.map