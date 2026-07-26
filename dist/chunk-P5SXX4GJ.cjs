"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk33JG4LIIcjs = require('./chunk-33JG4LII.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/selection/MultiSelectChip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function MultiSelectChip({
  children,
  selected,
  defaultSelected,
  onChange,
  disabled = false,
  size = "md",
  style,
  ...rest
}) {
  const isControlled = selected !== void 0;
  const [internal, setInternal] = _react2.default.useState(!!defaultSelected);
  const on = isControlled ? selected : internal;
  const sm = size === "sm";
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "button",
    {
      type: "button",
      "aria-pressed": on,
      disabled,
      onClick: toggle,
      style: {
        ..._chunk33JG4LIIcjs.pillChipStyle.call(void 0, on, disabled, size),
        gap: "var(--space-1-5)",
        padding: on ? sm ? "0 12px 0 9px" : "0 12px 0 8px" : sm ? "0 12px" : "0 12px",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), padding var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        on && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "check", size: 15, "aria-hidden": "true" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children })
      ]
    }
  );
}



exports.MultiSelectChip = MultiSelectChip;
//# sourceMappingURL=chunk-P5SXX4GJ.cjs.map