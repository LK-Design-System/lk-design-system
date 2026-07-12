"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/content/Bookmark.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Bookmark({ active, defaultActive, onChange, size = 24, disabled = false, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = _react2.default.useState(!!defaultActive);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": "bookmark",
      disabled,
      onClick: toggle,
      onMouseDown: (e) => {
        e.currentTarget.style.transform = "scale(0.86)";
      },
      onMouseUp: (e) => {
        e.currentTarget.style.transform = "none";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
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
        transition: "color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: on ? "bookmark-fill" : "bookmark", size, "aria-hidden": "true" })
    }
  );
}



exports.Bookmark = Bookmark;
//# sourceMappingURL=chunk-H3Y577ZD.cjs.map