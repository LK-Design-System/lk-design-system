"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// packages/core/dist/chunk-VL2LVV4M.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ToggleIcon({
  children,
  pressed,
  defaultPressed = false,
  onChange,
  label,
  size = "md",
  variant = "default",
  disabled = false,
  disable = false,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  type,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [internal, setInternal] = _react2.default.useState(defaultPressed);
  const [hover, setHover] = _react2.default.useState(false);
  const [pointerPressed, setPointerPressed] = _react2.default.useState(false);
  const active = _nullishCoalesce(pressed, () => ( internal));
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const disabledState = disabled || disable;
  const blocked = disabledState || ariaBlocked;
  const side = size === "sm" ? "var(--component-toggle-icon-size-sm)" : "var(--component-toggle-icon-size-md)";
  const setNext = (event) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    _optionalChain([onClick, 'optionalCall', _ => _(event)]);
    if (event.defaultPrevented) return;
    const next = !active;
    if (pressed === void 0) setInternal(next);
    onChange && onChange(next);
  };
  const palettes = {
    default: {
      background: "var(--component-toggle-icon-bg)",
      hoverBackground: "var(--color-semantic-fill-alternative)",
      foreground: "var(--component-toggle-icon-fg)",
      border: "var(--component-toggle-icon-border)"
    },
    plain: {
      background: "transparent",
      hoverBackground: "color-mix(in srgb, var(--viewer-foreground, var(--color-semantic-label-normal)) 7%, transparent)",
      foreground: "var(--viewer-foreground, var(--color-semantic-label-normal))",
      border: "var(--border-thin) solid transparent"
    },
    "on-dark": {
      background: "color-mix(in srgb, var(--color-semantic-static-white) 10%, transparent)",
      hoverBackground: "color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)",
      foreground: "var(--color-semantic-static-white)",
      border: "var(--border-thin) solid color-mix(in srgb, var(--color-semantic-static-white) 18%, transparent)"
    }
  };
  const palette = _nullishCoalesce(palettes[variant], () => ( palettes.default));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "button",
    {
      ...rest,
      type: _nullishCoalesce(type, () => ( "button")),
      "aria-label": label,
      "aria-pressed": active,
      "aria-disabled": ariaBlocked || void 0,
      disabled: disabledState,
      className: ["lk-toggle-icon", `lk-toggle-icon--${variant}`, className].filter(Boolean).join(" "),
      onClick: setNext,
      onMouseEnter: (event) => {
        setHover(true);
        _optionalChain([onMouseEnter, 'optionalCall', _2 => _2(event)]);
      },
      onMouseLeave: (event) => {
        setHover(false);
        setPointerPressed(false);
        _optionalChain([onMouseLeave, 'optionalCall', _3 => _3(event)]);
      },
      onMouseDown: (event) => {
        if (!blocked) setPointerPressed(true);
        _optionalChain([onMouseDown, 'optionalCall', _4 => _4(event)]);
      },
      onMouseUp: (event) => {
        setPointerPressed(false);
        _optionalChain([onMouseUp, 'optionalCall', _5 => _5(event)]);
      },
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPointerPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _6 => _6(event)]);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPointerPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _7 => _7(event)]);
      },
      onBlur: (event) => {
        setPointerPressed(false);
        _optionalChain([onBlur, 'optionalCall', _8 => _8(event)]);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: side,
        height: side,
        color: blocked ? "var(--color-semantic-label-disable)" : active ? "var(--component-toggle-icon-fg-active)" : palette.foreground,
        background: blocked ? "var(--color-semantic-fill-normal)" : pointerPressed ? `color-mix(in srgb, ${active ? "var(--component-toggle-icon-bg-active)" : palette.hoverBackground} 88%, var(--color-semantic-label-normal))` : active ? "var(--component-toggle-icon-bg-active)" : hover ? palette.hoverBackground : palette.background,
        border: blocked ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)" : active ? "var(--border-thin) solid transparent" : palette.border,
        borderRadius: "var(--component-toggle-icon-radius)",
        cursor: blocked ? "not-allowed" : "pointer",
        transition: "var(--component-button-transition)",
        WebkitTapHighlightColor: "transparent",
        ...style
      },
      children
    }
  );
}



exports.ToggleIcon = ToggleIcon;
//# sourceMappingURL=chunk-FVL575B5.cjs.map