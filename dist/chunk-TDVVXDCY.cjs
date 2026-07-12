"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/buttons/Fab.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Fab({
  children,
  variant = "signal",
  size = "md",
  label,
  style,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  className,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = _react2.default.useState(false);
  const [pressed, setPressed] = _react2.default.useState(false);
  const d = size === "sm" ? 48 : size === "lg" ? 64 : 56;
  const palettes = {
    signal: { bg: "var(--color-semantic-primary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-accent)" },
    dark: { bg: "var(--color-semantic-inverse-background)", fg: "var(--color-semantic-inverse-label)", sh: "var(--shadow-md)" },
    primary: { bg: "var(--color-semantic-primary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-accent)" },
    secondary: { bg: "var(--color-semantic-secondary-normal)", fg: "var(--color-semantic-static-white)", sh: "var(--shadow-indigo)" },
    white: { bg: "var(--color-semantic-background-elevated-normal)", fg: "var(--color-semantic-label-normal)", sh: "var(--shadow-md)" }
  };
  const p = palettes[variant] || palettes.signal;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabled || ariaBlocked;
  const interactiveBackground = pressed ? `color-mix(in srgb, ${p.bg} 88%, var(--color-semantic-label-normal))` : hover ? `color-mix(in srgb, ${p.bg} 96%, var(--color-semantic-label-normal))` : p.bg;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-disabled": ariaBlocked || void 0,
      disabled,
      className: ["lk-fab", `lk-fab--${variant}`, className].filter(Boolean).join(" "),
      onClick: (event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        _optionalChain([onClick, 'optionalCall', _ => _(event)]);
      },
      onMouseEnter: (event) => {
        setHover(true);
        _optionalChain([onMouseEnter, 'optionalCall', _2 => _2(event)]);
      },
      onMouseLeave: (event) => {
        setHover(false);
        setPressed(false);
        _optionalChain([onMouseLeave, 'optionalCall', _3 => _3(event)]);
      },
      onMouseDown: (event) => {
        if (!blocked) setPressed(true);
        _optionalChain([onMouseDown, 'optionalCall', _4 => _4(event)]);
      },
      onMouseUp: (event) => {
        setPressed(false);
        _optionalChain([onMouseUp, 'optionalCall', _5 => _5(event)]);
      },
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _6 => _6(event)]);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _7 => _7(event)]);
      },
      onBlur: (event) => {
        setPressed(false);
        _optionalChain([onBlur, 'optionalCall', _8 => _8(event)]);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        borderRadius: "50%",
        border: blocked ? "var(--component-button-disabled-outlined-border)" : variant === "white" ? "1px solid var(--color-semantic-line-solid-normal)" : "none",
        background: blocked ? "var(--component-button-disabled-bg)" : interactiveBackground,
        color: blocked ? "var(--component-button-disabled-fg-outlined)" : p.fg,
        cursor: blocked ? "not-allowed" : "pointer",
        boxShadow: blocked ? "none" : p.sh || "var(--shadow-md)",
        transform: "none",
        transition: "var(--component-button-transition)",
        ...style
      },
      ...rest,
      children
    }
  );
}



exports.Fab = Fab;
//# sourceMappingURL=chunk-TDVVXDCY.cjs.map